import { createContext, useCallback, useContext, useEffect, useId, useState } from 'react';
import type { MouseEvent, ReactNode } from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import './AppShell.css';

export interface AppShellState {
  /** Vrai sous 768px : la barre latérale devient un tiroir. */
  isMobile: boolean;
  /** Barre latérale repliée (icônes seules). Toujours faux sur mobile. */
  sidebarCollapsed: boolean;
  /** Tiroir mobile ouvert. */
  mobileSidebarOpen: boolean;
  /** Replie/déplie (bureau) ou ouvre/ferme le tiroir (mobile). */
  toggleSidebar: () => void;
  closeMobileSidebar: () => void;
}

const AppShellContext = createContext<AppShellState | null>(null);

/** Accès à l'état du layout depuis n'importe quel composant enfant. */
export function useAppShell(): AppShellState {
  const ctx = useContext(AppShellContext);
  if (!ctx) throw new Error('useAppShell doit être utilisé dans un <AppShell>.');
  return ctx;
}

export interface AppShellProps {
  /** Logo ou nom de l'application, à gauche de l'en-tête. */
  brand?: ReactNode;
  /** Contenu central de l'en-tête (ex. un NavMenu horizontal, une recherche). */
  headerContent?: ReactNode;
  /** Garder `headerContent` visible sur mobile (masqué par défaut, faute de place). */
  showHeaderContentOnMobile?: boolean;
  /** Actions à droite de l'en-tête (profil, notifications...). */
  headerActions?: ReactNode;
  /** Barre latérale. Une fonction reçoit l'état du layout (ex. `collapsed`). */
  sidebar?: ReactNode | ((state: AppShellState) => ReactNode);
  /** Contenu en bas de la barre latérale (ex. version, déconnexion). */
  sidebarFooter?: ReactNode | ((state: AppShellState) => ReactNode);
  footer?: ReactNode;
  children: ReactNode;
  /** Mode contrôlé de la barre latérale repliée. */
  sidebarCollapsed?: boolean;
  defaultSidebarCollapsed?: boolean;
  onSidebarCollapsedChange?: (collapsed: boolean) => void;
  /** Texte du bouton menu, pour les lecteurs d'écran. */
  toggleLabel?: string;
  className?: string;
}

function renderSlot(
  slot: ReactNode | ((state: AppShellState) => ReactNode),
  state: AppShellState,
): ReactNode {
  return typeof slot === 'function' ? slot(state) : slot;
}

export function AppShell({
  brand,
  headerContent,
  showHeaderContentOnMobile = false,
  headerActions,
  sidebar,
  sidebarFooter,
  footer,
  children,
  sidebarCollapsed: collapsedProp,
  defaultSidebarCollapsed = false,
  onSidebarCollapsedChange,
  toggleLabel = 'Afficher ou masquer le menu',
  className,
}: AppShellProps) {
  const isMobile = useMediaQuery('(max-width: 767.98px)');
  const [collapsedState, setCollapsedState] = useState(defaultSidebarCollapsed);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const sidebarId = useId();
  const mainId = useId();

  const isControlled = collapsedProp !== undefined;
  const collapsed = isControlled ? collapsedProp : collapsedState;
  const hasSidebar = sidebar != null;

  const setCollapsed = useCallback(
    (value: boolean) => {
      if (!isControlled) setCollapsedState(value);
      onSidebarCollapsedChange?.(value);
    },
    [isControlled, onSidebarCollapsedChange],
  );

  const closeMobileSidebar = useCallback(() => setMobileSidebarOpen(false), []);

  const toggleSidebar = useCallback(() => {
    if (isMobile) setMobileSidebarOpen((open) => !open);
    else setCollapsed(!collapsed);
  }, [isMobile, collapsed, setCollapsed]);

  // On referme le tiroir en repassant sur grand écran.
  useEffect(() => {
    if (!isMobile) setMobileSidebarOpen(false);
  }, [isMobile]);

  // Échap ferme le tiroir et on bloque le défilement de la page derrière.
  useEffect(() => {
    if (!mobileSidebarOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileSidebarOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [mobileSidebarOpen]);

  const state: AppShellState = {
    isMobile,
    sidebarCollapsed: !isMobile && collapsed,
    mobileSidebarOpen,
    toggleSidebar,
    closeMobileSidebar,
  };

  // Sur mobile, cliquer un lien du tiroir le referme.
  const onSidebarClick = (event: MouseEvent<HTMLElement>) => {
    if (isMobile && (event.target as HTMLElement).closest('a[href]')) {
      setMobileSidebarOpen(false);
    }
  };

  const rootClass = [
    'ui-shell',
    hasSidebar && 'has-sidebar',
    state.sidebarCollapsed && 'is-collapsed',
    mobileSidebarOpen && 'is-drawer-open',
    showHeaderContentOnMobile && 'show-header-content-mobile',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <AppShellContext.Provider value={state}>
      <div className={rootClass}>
        <a className="ui-shell__skip" href={`#${mainId}`}>
          Aller au contenu
        </a>

        <header className="ui-shell__header">
          {hasSidebar && (
            <button
              type="button"
              className="ui-shell__toggle"
              aria-label={toggleLabel}
              aria-controls={sidebarId}
              aria-expanded={isMobile ? mobileSidebarOpen : !collapsed}
              onClick={toggleSidebar}
            >
              <span className="ui-shell__burger" aria-hidden="true" />
            </button>
          )}
          {brand && <div className="ui-shell__brand">{brand}</div>}
          {headerContent && <div className="ui-shell__header-content">{headerContent}</div>}
          {headerActions && <div className="ui-shell__header-actions">{headerActions}</div>}
        </header>

        {hasSidebar && (
          <>
            <aside
              id={sidebarId}
              className="ui-shell__sidebar"
              aria-label="Barre latérale"
              onClick={onSidebarClick}
            >
              <div className="ui-shell__sidebar-body">{renderSlot(sidebar, state)}</div>
              {sidebarFooter != null && (
                <div className="ui-shell__sidebar-footer">{renderSlot(sidebarFooter, state)}</div>
              )}
            </aside>
            {isMobile && mobileSidebarOpen && (
              <div className="ui-shell__overlay" aria-hidden="true" onClick={closeMobileSidebar} />
            )}
          </>
        )}

        <main id={mainId} className="ui-shell__main" tabIndex={-1}>
          {children}
        </main>

        {footer && <footer className="ui-shell__footer">{footer}</footer>}
      </div>
    </AppShellContext.Provider>
  );
}

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { NavItem, NavLinkRenderer } from './types';
import './NavMenu.css';

export interface NavMenuProps {
  items: NavItem[];
  /** `id` de l'élément de la page courante. */
  activeId?: string;
  /** `vertical` pour une barre latérale, `horizontal` pour un en-tête. */
  orientation?: 'vertical' | 'horizontal';
  /** Mode icônes seules (vertical uniquement). Les sous-menus s'ouvrent en panneau flottant. */
  collapsed?: boolean;
  /**
   * Rendu personnalisé des liens, pour React Router, Next.js, etc.
   * Par défaut : une balise `<a href>`.
   */
  renderLink?: NavLinkRenderer;
  /** Appelé quand l'utilisateur choisit un lien. */
  onNavigate?: (item: NavItem) => void;
  'aria-label'?: string;
  className?: string;
}

const defaultRenderLink: NavLinkRenderer = ({ item, children, isActive, ...rest }) => (
  <a {...rest}>{children}</a>
);

/** Renvoie les `id` des parents de l'élément `targetId`, du plus haut au plus proche. */
export function findAncestorIds(items: NavItem[], targetId: string): string[] {
  for (const item of items) {
    if (item.id === targetId) return [];
    if (item.children) {
      const path = findAncestorIds(item.children, targetId);
      if (path.length > 0 || item.children.some((child) => child.id === targetId)) {
        return [item.id, ...path];
      }
    }
  }
  return [];
}

function cx(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

export function NavMenu({
  items,
  activeId,
  orientation = 'vertical',
  collapsed = false,
  renderLink = defaultRenderLink,
  onNavigate,
  'aria-label': ariaLabel = 'Navigation principale',
  className,
}: NavMenuProps) {
  // Horizontal ou replié : sous-menus en panneau flottant, un seul ouvert à la fois.
  const isDropdown = orientation === 'horizontal' || collapsed;
  const ancestorIds = useMemo(
    () => (activeId ? findAncestorIds(items, activeId) : []),
    [items, activeId],
  );
  const [openIds, setOpenIds] = useState<Set<string>>(
    () => new Set(isDropdown ? [] : ancestorIds),
  );
  const rootRef = useRef<HTMLElement>(null);
  const baseId = useId();

  // En mode accordéon, la section de la page courante reste ouverte.
  useEffect(() => {
    if (isDropdown) {
      setOpenIds(new Set());
    } else if (ancestorIds.length > 0) {
      setOpenIds((prev) => new Set([...prev, ...ancestorIds]));
    }
  }, [isDropdown, ancestorIds]);

  // En mode flottant : fermeture au clic extérieur et avec Échap.
  useEffect(() => {
    if (!isDropdown || openIds.size === 0) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpenIds(new Set());
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenIds(new Set());
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isDropdown, openIds]);

  const toggle = (item: NavItem, parentIds: string[]) => {
    setOpenIds((prev) => {
      if (prev.has(item.id)) {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      }
      // Flottant : on garde seulement la branche en cours.
      return isDropdown ? new Set([...parentIds, item.id]) : new Set([...prev, item.id]);
    });
  };

  const renderItems = (list: NavItem[], depth: number, parentIds: string[]): ReactNode =>
    list.map((item) => {
      const hasChildren = Boolean(item.children?.length);
      const isActive = item.id === activeId;
      const isInActivePath = ancestorIds.includes(item.id);
      const isOpen = openIds.has(item.id);
      const submenuId = `${baseId}-${item.id}`;
      const showLabel = !collapsed || depth > 0;

      const content = (
        <>
          {item.icon && (
            <span className="ui-nav__icon" aria-hidden="true">
              {item.icon}
            </span>
          )}
          <span className={cx('ui-nav__label', !showLabel && 'ui-visually-hidden')}>
            {item.label}
          </span>
          {item.badge != null && showLabel && <span className="ui-nav__badge">{item.badge}</span>}
        </>
      );

      const itemClass = cx(
        'ui-nav__link',
        isActive && 'is-active',
        isInActivePath && 'is-in-active-path',
        item.disabled && 'is-disabled',
      );

      return (
        <li key={item.id} className={cx('ui-nav__item', hasChildren && 'has-children')}>
          {hasChildren ? (
            <>
              <button
                type="button"
                className={itemClass}
                aria-expanded={isOpen}
                aria-controls={submenuId}
                disabled={item.disabled}
                title={collapsed && depth === 0 ? item.label : undefined}
                onClick={() => toggle(item, parentIds)}
              >
                {content}
                {showLabel && <span className="ui-nav__chevron" aria-hidden="true" />}
              </button>
              <ul
                id={submenuId}
                className={cx('ui-nav__submenu', isDropdown && 'is-floating')}
                hidden={!isOpen}
              >
                {renderItems(item.children!, depth + 1, [...parentIds, item.id])}
              </ul>
            </>
          ) : item.disabled || !item.href ? (
            <span className={itemClass} aria-disabled={item.disabled || undefined}>
              {content}
            </span>
          ) : (
            renderLink({
              item,
              href: item.href,
              className: itemClass,
              isActive,
              'aria-current': isActive ? 'page' : undefined,
              onClick: () => {
                if (isDropdown) setOpenIds(new Set());
                onNavigate?.(item);
              },
              children: content,
            })
          )}
        </li>
      );
    });

  return (
    <nav
      ref={rootRef}
      aria-label={ariaLabel}
      className={cx(
        'ui-nav',
        `ui-nav--${orientation}`,
        collapsed && orientation === 'vertical' && 'is-collapsed',
        className,
      )}
    >
      <ul className="ui-nav__list">{renderItems(items, 0, [])}</ul>
    </nav>
  );
}

import type { MouseEvent, ReactNode } from 'react';

/** Un élément de menu. Un élément avec `children` ouvre un sous-menu. */
export interface NavItem {
  /** Identifiant unique, utilisé pour l'état actif et l'ouverture des sous-menus. */
  id: string;
  label: string;
  /** Lien de destination. Ignoré si l'élément a des `children`. */
  href?: string;
  /** Icône (SVG, emoji, composant d'une librairie d'icônes...). */
  icon?: ReactNode;
  /** Petit indicateur affiché à droite (ex. nombre de notifications). */
  badge?: ReactNode;
  disabled?: boolean;
  children?: NavItem[];
}

/** Props passées à `renderLink` pour brancher n'importe quel routeur. */
export interface NavLinkRenderProps {
  item: NavItem;
  href: string;
  className: string;
  isActive: boolean;
  'aria-current'?: 'page';
  onClick: (event: MouseEvent<HTMLElement>) => void;
  children: ReactNode;
}

export type NavLinkRenderer = (props: NavLinkRenderProps) => ReactNode;

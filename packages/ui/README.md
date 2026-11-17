# @works/ui

Composants React génériques, réutilisables d'un projet à l'autre :

- **`AppShell`** : la « master page » (en-tête, barre latérale, contenu, pied de page). Sur mobile, la barre latérale devient un tiroir.
- **`NavMenu`** : un menu de navigation vertical ou horizontal, avec sous-menus sur plusieurs niveaux, icônes, badges et mode replié.

Les composants fonctionnent avec n'importe quel routeur (React Router, Next.js, ou de simples liens), gèrent le thème clair et sombre, et sont accessibles au clavier et aux lecteurs d'écran.

## Lancer la démo

```bash
cd packages/ui
npm install
npm run dev      # démo sur http://localhost:5173
npm test         # tests
npm run build    # génère dist/
```

## Utiliser dans un projet

```bash
npm install ../works/packages/ui   # chemin local, ou publier le paquet sur un registre npm
```

```tsx
import { AppShell, NavMenu, type NavItem } from '@works/ui';
import '@works/ui/style.css';

const menu: NavItem[] = [
  { id: 'home', label: 'Accueil', href: '/', icon: '🏠' },
  { id: 'messages', label: 'Messages', href: '/messages', badge: 3 },
  {
    id: 'admin',
    label: 'Administration',
    children: [
      { id: 'users', label: 'Utilisateurs', href: '/admin/users' },
      { id: 'settings', label: 'Paramètres', href: '/admin/settings' },
    ],
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      brand="MonApp"
      headerActions={<button>Profil</button>}
      sidebar={({ sidebarCollapsed }) => (
        <NavMenu items={menu} activeId="users" collapsed={sidebarCollapsed} />
      )}
      footer="© 2026 MonApp"
    >
      {children}
    </AppShell>
  );
}
```

### Avec React Router

```tsx
import { Link, useLocation } from 'react-router-dom';

function SidebarMenu({ collapsed }: { collapsed: boolean }) {
  const { pathname } = useLocation();
  const activeId = findItemByHref(menu, pathname)?.id; // à écrire selon votre menu

  return (
    <NavMenu
      items={menu}
      activeId={activeId}
      collapsed={collapsed}
      renderLink={({ href, item, isActive, children, ...props }) => (
        <Link to={href} {...props}>{children}</Link>
      )}
    />
  );
}
```

Avec Next.js, la même chose s'écrit avec `next/link`.

## API

### `AppShell`

| Prop | Type | Rôle |
| --- | --- | --- |
| `brand` | `ReactNode` | Logo ou nom, à gauche de l'en-tête |
| `headerContent` | `ReactNode` | Centre de l'en-tête (menu horizontal, recherche…) |
| `showHeaderContentOnMobile` | `boolean` | Garder `headerContent` visible sur mobile (masqué par défaut) |
| `headerActions` | `ReactNode` | Droite de l'en-tête (profil, notifications…) |
| `sidebar` | `ReactNode \| (state) => ReactNode` | Barre latérale. Sans elle, pas de bouton ☰ |
| `sidebarFooter` | `ReactNode \| (state) => ReactNode` | Bas de la barre latérale |
| `footer` | `ReactNode` | Pied de page |
| `sidebarCollapsed` / `defaultSidebarCollapsed` / `onSidebarCollapsedChange` | | Repli de la barre latérale, contrôlé ou non |

Le hook `useAppShell()` donne accès à `isMobile`, `sidebarCollapsed`, `mobileSidebarOpen`, `toggleSidebar()` et `closeMobileSidebar()` depuis n'importe quel enfant.

### `NavMenu`

| Prop | Type | Rôle |
| --- | --- | --- |
| `items` | `NavItem[]` | Éléments du menu (`id`, `label`, `href`, `icon`, `badge`, `disabled`, `children`) |
| `activeId` | `string` | Élément de la page courante. Ses parents s'ouvrent automatiquement |
| `orientation` | `'vertical' \| 'horizontal'` | Barre latérale ou en-tête |
| `collapsed` | `boolean` | Icônes seules. Les sous-menus s'ouvrent en panneau flottant |
| `renderLink` | `(props) => ReactNode` | Brancher le composant de lien de votre routeur |
| `onNavigate` | `(item) => void` | Appelé au clic sur un lien |

Un élément avec `children` sert uniquement à ouvrir un sous-menu : son `href` est ignoré.

## Personnaliser le thème

Toutes les couleurs et tailles sont des variables CSS. Il suffit de les surcharger :

```css
:root {
  --ui-color-primary: #e11d48;
  --ui-color-primary-soft: #ffe4e9;
  --ui-sidebar-width: 280px;
  --ui-header-height: 64px;
}
```

Le thème sombre suit le système. Pour le forcer, ajoutez `data-theme="dark"` (ou `"light"`) sur `<html>`.

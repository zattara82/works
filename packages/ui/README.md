# @works/ui

Composants React génériques, réutilisables d'un projet à l'autre, au style inspiré de **Fluent UI 2** (Microsoft) : couleurs neutres, bleu de marque, coins de 4px, ombres en couches, police Segoe UI, focus clavier à double contour.

- **`AppShell`** : la « master page » (en-tête, barre latérale, contenu, pied de page). Sur mobile, la barre latérale devient un tiroir.
- **`NavMenu`** : un menu de navigation vertical ou horizontal, dans l'esprit du composant `Nav` de Fluent : barre de sélection bleue, sous-menus sur plusieurs niveaux, titres de section, séparateurs, icônes, compteurs et mode replié.
- **`Button`** : les boutons Fluent (`primary`, `secondary`, `outline`, `subtle`, `transparent`), en trois tailles et trois formes.
- Icônes : `NavigationIcon`, `ChevronDownIcon`, `ChevronRightIcon`.

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

Titres de section et séparateurs :

```ts
{ id: 'sec-admin', kind: 'section', label: 'Administration' },
{ id: 'sep-1', kind: 'divider', label: '' },
```

En mode replié, les titres de section deviennent des séparateurs.

### `Button`

```tsx
<Button appearance="primary" icon={<AddIcon />}>Nouveau</Button>
<Button appearance="subtle" icon={<SettingsIcon />} aria-label="Paramètres" />
```

| Prop | Valeurs |
| --- | --- |
| `appearance` | `primary`, `secondary` (défaut), `outline`, `subtle`, `transparent` |
| `size` | `small`, `medium` (défaut), `large` |
| `shape` | `rounded` (défaut), `circular`, `square` |
| `icon` / `iconPosition` | une icône, avant (défaut) ou après le texte. Sans texte, le bouton devient carré |

Il accepte aussi tous les attributs d'un `<button>` HTML.

## Personnaliser le thème

Toutes les couleurs et tailles sont des variables CSS. Il suffit de les surcharger :

```css
:root {
  --ui-color-brand: #c50f1f;        /* couleur de marque */
  --ui-color-brand-hover: #a80000;
  --ui-color-brand-pressed: #750b1c;
  --ui-color-brand-text: #c50f1f;   /* texte et barre de sélection */
  --ui-sidebar-width: 280px;
  --ui-header-height: 56px;
}
```

Les variables suivent les familles de jetons Fluent : couleurs neutres (`--ui-color-*`), marque (`--ui-color-brand-*`), arrondis (`--ui-radius-*`), ombres (`--ui-shadow-2` à `--ui-shadow-64`), typographie (`--ui-font-size-*`) et animations (`--ui-duration-*`, `--ui-curve-*`). La liste complète est dans `src/styles/theme.css`.

Le thème sombre suit le système. Pour le forcer, ajoutez `data-theme="dark"` (ou `"light"`) sur `<html>`.

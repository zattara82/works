import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AppShell, Button, NavMenu } from '../src';
import type { NavItem } from '../src';
import {
  AddIcon,
  AppsIcon,
  BoxIcon,
  ChartIcon,
  HomeIcon,
  MailIcon,
  MoonIcon,
  PeopleIcon,
  SettingsIcon,
  SunIcon,
} from './icons';

const sidebarItems: NavItem[] = [
  { id: 'dashboard', label: 'Tableau de bord', href: '#dashboard', icon: <HomeIcon /> },
  { id: 'messages', label: 'Messages', href: '#messages', icon: <MailIcon />, badge: 3 },
  { id: 'sec-content', kind: 'section', label: 'Contenu' },
  {
    id: 'catalog',
    label: 'Catalogue',
    icon: <BoxIcon />,
    children: [
      { id: 'products', label: 'Produits', href: '#products' },
      { id: 'categories', label: 'Catégories', href: '#categories' },
    ],
  },
  { id: 'reports', label: 'Rapports', href: '#reports', icon: <ChartIcon />, disabled: true },
  { id: 'sec-admin', kind: 'section', label: 'Administration' },
  { id: 'users', label: 'Utilisateurs', href: '#users', icon: <PeopleIcon /> },
  {
    id: 'settings',
    label: 'Paramètres',
    icon: <SettingsIcon />,
    children: [
      { id: 'general', label: 'Général', href: '#general' },
      { id: 'security', label: 'Sécurité', href: '#security' },
    ],
  },
];

const headerItems: NavItem[] = [
  { id: 'docs', label: 'Documentation', href: '#docs' },
  {
    id: 'help',
    label: 'Aide',
    children: [
      { id: 'faq', label: 'FAQ', href: '#faq' },
      { id: 'contact', label: 'Contact', href: '#contact' },
    ],
  },
];

// La démo utilise le hash de l'URL comme « routeur ».
function useHash(): string {
  const read = () => window.location.hash.slice(1) || 'dashboard';
  const [hash, setHash] = useState(read);
  useEffect(() => {
    const onChange = () => setHash(read());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return hash;
}

const card = {
  padding: 20,
  borderRadius: 8,
  background: 'var(--ui-color-surface)',
  boxShadow: 'var(--ui-shadow-4)',
} as const;

function Demo() {
  const page = useHash();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  }, [dark]);

  return (
    <AppShell
      brand={
        <>
          <span style={{ display: 'inline-flex', color: 'var(--ui-color-brand-text)' }}>
            <AppsIcon />
          </span>
          MonApp
        </>
      }
      headerContent={
        <NavMenu items={headerItems} orientation="horizontal" activeId={page} aria-label="Liens rapides" />
      }
      headerActions={
        <Button
          appearance="subtle"
          icon={dark ? <SunIcon /> : <MoonIcon />}
          aria-label={dark ? 'Thème clair' : 'Thème sombre'}
          title={dark ? 'Thème clair' : 'Thème sombre'}
          onClick={() => setDark((d) => !d)}
        />
      }
      sidebar={({ sidebarCollapsed }) => (
        <NavMenu items={sidebarItems} activeId={page} collapsed={sidebarCollapsed} />
      )}
      sidebarFooter={({ sidebarCollapsed }) => (sidebarCollapsed ? 'v0.2' : 'Version 0.2.0')}
      footer="© 2026 MonApp"
    >
      <h1 style={{ margin: '0 0 4px', fontSize: 28, lineHeight: '36px', fontWeight: 600 }}>
        Page : {page}
      </h1>
      <p style={{ margin: '0 0 24px', color: 'var(--ui-color-text-subtle)' }}>
        Le bouton ☰ replie le menu. Sous 768px, il devient un tiroir.
      </p>

      <section style={card}>
        <h2 style={{ margin: '0 0 16px', fontSize: 20, lineHeight: '28px', fontWeight: 600 }}>
          Boutons
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          <Button appearance="primary" icon={<AddIcon />}>
            Nouveau
          </Button>
          <Button>Secondaire</Button>
          <Button appearance="outline">Contour</Button>
          <Button appearance="subtle">Discret</Button>
          <Button appearance="transparent">Transparent</Button>
          <Button disabled>Désactivé</Button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginTop: 12 }}>
          <Button appearance="primary" size="small">
            Petit
          </Button>
          <Button appearance="primary">Moyen</Button>
          <Button appearance="primary" size="large">
            Grand
          </Button>
          <Button shape="circular">Arrondi</Button>
          <Button icon={<SettingsIcon />} aria-label="Paramètres" />
        </div>
      </section>
    </AppShell>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Demo />
  </StrictMode>,
);

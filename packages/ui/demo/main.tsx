import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AppShell, NavMenu } from '../src';
import type { NavItem } from '../src';

const sidebarItems: NavItem[] = [
  { id: 'dashboard', label: 'Tableau de bord', href: '#dashboard', icon: '📊' },
  { id: 'messages', label: 'Messages', href: '#messages', icon: '✉️', badge: 3 },
  {
    id: 'catalog',
    label: 'Catalogue',
    icon: '📦',
    children: [
      { id: 'products', label: 'Produits', href: '#products' },
      { id: 'categories', label: 'Catégories', href: '#categories' },
    ],
  },
  {
    id: 'admin',
    label: 'Administration',
    icon: '⚙️',
    children: [
      { id: 'users', label: 'Utilisateurs', href: '#users' },
      {
        id: 'settings',
        label: 'Paramètres',
        children: [
          { id: 'general', label: 'Général', href: '#general' },
          { id: 'security', label: 'Sécurité', href: '#security' },
        ],
      },
    ],
  },
  { id: 'reports', label: 'Rapports', href: '#reports', icon: '📈', disabled: true },
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

function Demo() {
  const page = useHash();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  }, [dark]);

  return (
    <AppShell
      brand={<span>🧩 MonApp</span>}
      headerContent={<NavMenu items={headerItems} orientation="horizontal" activeId={page} aria-label="Liens rapides" />}
      headerActions={
        <button type="button" onClick={() => setDark((d) => !d)} style={{ padding: '6px 10px' }}>
          {dark ? '☀️ Clair' : '🌙 Sombre'}
        </button>
      }
      sidebar={({ sidebarCollapsed }) => (
        <NavMenu items={sidebarItems} activeId={page} collapsed={sidebarCollapsed} />
      )}
      sidebarFooter={({ sidebarCollapsed }) => (sidebarCollapsed ? 'v0.1' : 'Version 0.1.0')}
      footer="© 2026 MonApp"
    >
      <h1 style={{ marginTop: 0 }}>Page : {page}</h1>
      <p>
        Cliquez sur le bouton ☰ pour replier la barre latérale. Réduisez la fenêtre sous 768px
        pour voir le menu passer en tiroir.
      </p>
    </AppShell>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Demo />
  </StrictMode>,
);

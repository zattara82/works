import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NavMenu, findAncestorIds } from './NavMenu';
import type { NavItem } from './types';

const items: NavItem[] = [
  { id: 'home', label: 'Accueil', href: '/' },
  {
    id: 'admin',
    label: 'Administration',
    children: [
      { id: 'users', label: 'Utilisateurs', href: '/users' },
      {
        id: 'settings',
        label: 'Paramètres',
        children: [{ id: 'security', label: 'Sécurité', href: '/security' }],
      },
    ],
  },
  { id: 'off', label: 'Bientôt', href: '/soon', disabled: true },
];

describe('findAncestorIds', () => {
  it('renvoie le chemin des parents', () => {
    expect(findAncestorIds(items, 'security')).toEqual(['admin', 'settings']);
    expect(findAncestorIds(items, 'users')).toEqual(['admin']);
    expect(findAncestorIds(items, 'home')).toEqual([]);
    expect(findAncestorIds(items, 'inconnu')).toEqual([]);
  });
});

describe('NavMenu', () => {
  it('marque la page active et ouvre ses parents', () => {
    render(<NavMenu items={items} activeId="security" />);
    expect(screen.getByRole('link', { name: 'Sécurité' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Administration' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('ouvre et ferme un sous-menu', async () => {
    const user = userEvent.setup();
    render(<NavMenu items={items} />);
    const toggle = screen.getByRole('button', { name: 'Administration' });
    expect(screen.queryByRole('link', { name: 'Utilisateurs' })).not.toBeInTheDocument();

    await user.click(toggle);
    expect(screen.getByRole('link', { name: 'Utilisateurs' })).toBeVisible();

    await user.click(toggle);
    expect(screen.queryByRole('link', { name: 'Utilisateurs' })).not.toBeInTheDocument();
  });

  it("n'affiche pas de lien pour un élément désactivé", () => {
    render(<NavMenu items={items} />);
    expect(screen.queryByRole('link', { name: 'Bientôt' })).not.toBeInTheDocument();
    expect(screen.getByText('Bientôt').closest('[aria-disabled]')).toBeInTheDocument();
  });

  it('utilise renderLink et appelle onNavigate', async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    render(
      <NavMenu
        items={items}
        onNavigate={onNavigate}
        renderLink={({ href, className, children, onClick }) => (
          <a
            href={href}
            className={className}
            data-router="custom"
            onClick={(e) => {
              e.preventDefault();
              onClick(e);
            }}
          >
            {children}
          </a>
        )}
      />,
    );
    const link = screen.getByRole('link', { name: 'Accueil' });
    expect(link).toHaveAttribute('data-router', 'custom');
    await user.click(link);
    expect(onNavigate).toHaveBeenCalledWith(items[0]);
  });

  it('en horizontal, ferme le sous-menu avec Échap et au clic extérieur', async () => {
    const user = userEvent.setup();
    render(
      <>
        <NavMenu items={items} orientation="horizontal" />
        <p>Dehors</p>
      </>,
    );
    const toggle = screen.getByRole('button', { name: 'Administration' });

    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await user.keyboard('{Escape}');
    expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await user.click(toggle);
    await user.click(screen.getByText('Dehors'));
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });
});

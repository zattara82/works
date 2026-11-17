import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppShell, useAppShell } from './AppShell';

function mockViewport(mobile: boolean) {
  window.matchMedia = (query: string) =>
    ({
      matches: mobile,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }) as unknown as MediaQueryList;
}

function Status() {
  const { isMobile, sidebarCollapsed } = useAppShell();
  return <p>{`mobile=${isMobile} collapsed=${sidebarCollapsed}`}</p>;
}

describe('AppShell', () => {
  it("affiche l'en-tête, la barre latérale, le contenu et le pied de page", () => {
    mockViewport(false);
    render(
      <AppShell brand="MonApp" sidebar={<p>Menu</p>} footer="© 2026">
        <h1>Tableau de bord</h1>
      </AppShell>,
    );
    expect(screen.getByRole('banner')).toHaveTextContent('MonApp');
    expect(screen.getByRole('complementary')).toHaveTextContent('Menu');
    expect(screen.getByRole('main')).toHaveTextContent('Tableau de bord');
    expect(screen.getByRole('contentinfo')).toHaveTextContent('© 2026');
  });

  it('replie la barre latérale sur grand écran', async () => {
    mockViewport(false);
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <AppShell
        sidebar={({ sidebarCollapsed }) => <p>{sidebarCollapsed ? 'replié' : 'déplié'}</p>}
        onSidebarCollapsedChange={onChange}
      >
        <Status />
      </AppShell>,
    );
    await user.click(screen.getByRole('button', { name: /menu/i }));
    expect(screen.getByText('replié')).toBeInTheDocument();
    expect(screen.getByText('mobile=false collapsed=true')).toBeInTheDocument();
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('ouvre le tiroir sur mobile et le ferme au clic sur un lien', async () => {
    mockViewport(true);
    const user = userEvent.setup();
    const { container } = render(
      <AppShell sidebar={<a href="#page">Page</a>}>
        <Status />
      </AppShell>,
    );
    const toggle = screen.getByRole('button', { name: /menu/i });
    const shell = container.querySelector('.ui-shell')!;

    await user.click(toggle);
    expect(shell).toHaveClass('is-drawer-open');
    expect(toggle).toHaveAttribute('aria-expanded', 'true');

    await user.click(screen.getByRole('link', { name: 'Page' }));
    expect(shell).not.toHaveClass('is-drawer-open');
  });

  it("n'affiche pas de bouton menu sans barre latérale", () => {
    mockViewport(false);
    render(<AppShell brand="MonApp">Contenu</AppShell>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});

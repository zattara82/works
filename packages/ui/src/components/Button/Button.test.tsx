import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('applique apparence, taille et forme', () => {
    render(
      <Button appearance="primary" size="large" shape="circular">
        Enregistrer
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Enregistrer' });
    expect(button).toHaveClass('ui-button--primary', 'ui-button--large', 'ui-button--circular');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('secondary par défaut', () => {
    render(<Button>Annuler</Button>);
    expect(screen.getByRole('button')).toHaveClass('ui-button--secondary', 'ui-button--medium');
  });

  it("détecte le bouton icône seule", () => {
    render(<Button icon={<svg />} aria-label="Menu" />);
    expect(screen.getByRole('button', { name: 'Menu' })).toHaveClass('ui-button--icon-only');
  });

  it("n'appelle pas onClick quand il est désactivé", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Envoyer
      </Button>,
    );
    await user.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });
});

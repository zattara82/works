import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './Button.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Style visuel, comme dans Fluent UI :
   * - `primary` : action principale, couleur de marque
   * - `secondary` (défaut) : bouton standard avec bordure
   * - `outline` : bordure sans fond
   * - `subtle` : sans bordure, fond au survol
   * - `transparent` : sans fond, texte coloré au survol
   */
  appearance?: 'primary' | 'secondary' | 'outline' | 'subtle' | 'transparent';
  size?: 'small' | 'medium' | 'large';
  shape?: 'rounded' | 'circular' | 'square';
  icon?: ReactNode;
  iconPosition?: 'before' | 'after';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    appearance = 'secondary',
    size = 'medium',
    shape = 'rounded',
    icon,
    iconPosition = 'before',
    type = 'button',
    className,
    children,
    ...rest
  },
  ref,
) {
  const iconOnly = icon != null && (children == null || children === false);
  const classes = [
    'ui-button',
    'ui-focusable',
    `ui-button--${appearance}`,
    `ui-button--${size}`,
    `ui-button--${shape}`,
    iconOnly && 'ui-button--icon-only',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const iconNode = icon != null && (
    <span className="ui-button__icon" aria-hidden="true">
      {icon}
    </span>
  );

  return (
    <button ref={ref} type={type} className={classes} {...rest}>
      {iconPosition === 'before' && iconNode}
      {children}
      {iconPosition === 'after' && iconNode}
    </button>
  );
});

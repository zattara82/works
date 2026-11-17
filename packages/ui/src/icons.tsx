import type { SVGProps } from 'react';

/** Icônes 20px au trait fin, dans l'esprit des Fluent System Icons. */
type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: 20,
  height: 20,
  viewBox: '0 0 20 20',
  fill: 'currentColor',
  'aria-hidden': true,
  focusable: false,
} as const;

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M15.85 7.65a.5.5 0 0 1 0 .7l-5.5 5.5a.5.5 0 0 1-.7 0l-5.5-5.5a.5.5 0 1 1 .7-.7L10 12.79l5.15-5.14a.5.5 0 0 1 .7 0Z" />
    </svg>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M7.65 4.15a.5.5 0 0 0 0 .7L12.79 10l-5.14 5.15a.5.5 0 0 0 .7.7l5.5-5.5a.5.5 0 0 0 0-.7l-5.5-5.5a.5.5 0 0 0-.7 0Z" />
    </svg>
  );
}

export function NavigationIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M2 4.5c0-.28.22-.5.5-.5h15a.5.5 0 0 1 0 1h-15a.5.5 0 0 1-.5-.5Zm0 5c0-.28.22-.5.5-.5h15a.5.5 0 0 1 0 1h-15a.5.5 0 0 1-.5-.5Zm.5 4.5a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1h-15Z" />
    </svg>
  );
}

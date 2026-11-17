// Icônes de démonstration, dessinées au trait comme les Fluent System Icons.
const props = {
  width: 20,
  height: 20,
  viewBox: '0 0 20 20',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const;

export const HomeIcon = () => (
  <svg {...props}>
    <path d="M3.5 8.5 10 3l6.5 5.5V16a.5.5 0 0 1-.5.5h-3.5v-4.5h-5v4.5H4a.5.5 0 0 1-.5-.5Z" />
  </svg>
);
export const MailIcon = () => (
  <svg {...props}>
    <rect x="2.5" y="4.5" width="15" height="11" rx="2" />
    <path d="m3 6 7 5 7-5" />
  </svg>
);
export const BoxIcon = () => (
  <svg {...props}>
    <path d="M10 2.5 17 6v8l-7 3.5L3 14V6Z" />
    <path d="M3 6l7 3.5L17 6M10 9.5v8" />
  </svg>
);
export const SettingsIcon = () => (
  <svg {...props}>
    <circle cx="10" cy="10" r="2.5" />
    <path d="M10 2.5v2M10 15.5v2M2.5 10h2M15.5 10h2M4.7 4.7l1.4 1.4M13.9 13.9l1.4 1.4M4.7 15.3l1.4-1.4M13.9 6.1l1.4-1.4" />
  </svg>
);
export const ChartIcon = () => (
  <svg {...props}>
    <path d="M3.5 16.5h13M6 13.5v-4M10 13.5v-8M14 13.5v-6" />
  </svg>
);
export const PeopleIcon = () => (
  <svg {...props}>
    <circle cx="7.5" cy="7" r="2.5" />
    <path d="M3 15.5c0-2.5 2-4 4.5-4s4.5 1.5 4.5 4" />
    <circle cx="14" cy="7.5" r="2" />
    <path d="M13.5 11.5c2 0 3.5 1.2 3.5 3.5" />
  </svg>
);
export const AppsIcon = () => (
  <svg {...props}>
    <rect x="3" y="3" width="5.5" height="5.5" rx="1.2" />
    <rect x="11.5" y="3" width="5.5" height="5.5" rx="1.2" />
    <rect x="3" y="11.5" width="5.5" height="5.5" rx="1.2" />
    <rect x="11.5" y="11.5" width="5.5" height="5.5" rx="1.2" />
  </svg>
);
export const MoonIcon = () => (
  <svg {...props}>
    <path d="M15.5 12.5A6.5 6.5 0 0 1 7.5 4.5a6.5 6.5 0 1 0 8 8Z" />
  </svg>
);
export const SunIcon = () => (
  <svg {...props}>
    <circle cx="10" cy="10" r="3.5" />
    <path d="M10 2v1.5M10 16.5V18M2 10h1.5M16.5 10H18M4.3 4.3l1.1 1.1M14.6 14.6l1.1 1.1M4.3 15.7l1.1-1.1M14.6 5.4l1.1-1.1" />
  </svg>
);
export const AddIcon = () => (
  <svg {...props}>
    <path d="M10 4v12M4 10h12" />
  </svg>
);

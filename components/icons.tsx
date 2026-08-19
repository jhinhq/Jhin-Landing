type P = { className?: string };

const base = "h-full w-full";
const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const IconUser = ({ className }: P) => (
  <svg viewBox="0 0 24 24" {...stroke} className={className ?? base}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" />
  </svg>
);

export const IconCompass = ({ className }: P) => (
  <svg viewBox="0 0 24 24" {...stroke} className={className ?? base}>
    <circle cx="12" cy="12" r="9" />
    <path d="m15.5 8.5-2 5-5 2 2-5z" />
  </svg>
);

export const IconBolt = ({ className }: P) => (
  <svg viewBox="0 0 24 24" {...stroke} className={className ?? base}>
    <path d="M13 2 4.5 13.5H11L9.5 22 19 10h-6.5z" />
  </svg>
);

export const IconSearch = ({ className }: P) => (
  <svg viewBox="0 0 24 24" {...stroke} className={className ?? base}>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="m20 20-4.8-4.8" />
  </svg>
);

export const IconWrench = ({ className }: P) => (
  <svg viewBox="0 0 24 24" {...stroke} className={className ?? base}>
    <path d="M14.2 6.3a4.5 4.5 0 0 0-6 5.6L3 17l-.4 3.4L6 20l5.1-5.2a4.5 4.5 0 0 0 5.6-6l-3 3-2.8-.7-.7-2.8z" />
  </svg>
);

export const IconMegaphone = ({ className }: P) => (
  <svg viewBox="0 0 24 24" {...stroke} className={className ?? base}>
    <path d="M3 11v2a2 2 0 0 0 2 2h1l2 6h2.5l-1.8-6H14l6 3V4l-6 3H5a2 2 0 0 0-2 2z" />
  </svg>
);

export const IconHourglass = ({ className }: P) => (
  <svg viewBox="0 0 24 24" {...stroke} className={className ?? base}>
    <path d="M6 2h12M6 22h12M7 2c0 8 10 6 10 12 0 4-2 6-2 6M17 2c0 8-10 6-10 12 0 4 2 6 2 6" />
  </svg>
);

export const IconHandshake = ({ className }: P) => (
  <svg viewBox="0 0 24 24" {...stroke} className={className ?? base}>
    <path d="m11 17 2 2a1.5 1.5 0 0 0 2.1-2.1l-4-4M14.5 14.5l1.5 1.5a1.5 1.5 0 0 0 2.1-2.1L14 9.8M2 8l4-4 5 1.5L15 4l7 4-3.5 6M8.5 12.5 6 15a1.5 1.5 0 0 0 2.1 2.1L11 14" />
  </svg>
);

export const IconLock = ({ className }: P) => (
  <svg viewBox="0 0 24 24" {...stroke} className={className ?? base}>
    <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
    <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5M12 15v2" />
  </svg>
);

export const IconChip = ({ className }: P) => (
  <svg viewBox="0 0 24 24" {...stroke} className={className ?? base}>
    <rect x="6" y="6" width="12" height="12" rx="2" />
    <rect x="10" y="10" width="4" height="4" rx="1" />
    <path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" />
  </svg>
);

export const IconChart = ({ className }: P) => (
  <svg viewBox="0 0 24 24" {...stroke} className={className ?? base}>
    <path d="M3 3v16a2 2 0 0 0 2 2h16" />
    <path d="M7 15v-4M12 15V7M17 15v-6" />
  </svg>
);

export const IconPen = ({ className }: P) => (
  <svg viewBox="0 0 24 24" {...stroke} className={className ?? base}>
    <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
  </svg>
);

export const IconTrend = ({ className }: P) => (
  <svg viewBox="0 0 24 24" {...stroke} className={className ?? base}>
    <path d="m3 17 6-6 4 4 8-8" />
    <path d="M15 7h6v6" />
  </svg>
);

export const IconChat = ({ className }: P) => (
  <svg viewBox="0 0 24 24" {...stroke} className={className ?? base}>
    <path d="M21 12a8 8 0 0 1-8 8H4l2.3-2.7A8 8 0 1 1 21 12z" />
    <path d="M8.5 11h.01M12 11h.01M15.5 11h.01" />
  </svg>
);

export const IconLifebuoy = ({ className }: P) => (
  <svg viewBox="0 0 24 24" {...stroke} className={className ?? base}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="4" />
    <path d="m5.6 5.6 3.6 3.6M18.4 5.6l-3.6 3.6M18.4 18.4l-3.6-3.6M5.6 18.4l3.6-3.6" />
  </svg>
);

export const IconDatabase = ({ className }: P) => (
  <svg viewBox="0 0 24 24" {...stroke} className={className ?? base}>
    <ellipse cx="12" cy="5.5" rx="8" ry="3" />
    <path d="M4 5.5v13c0 1.7 3.6 3 8 3s8-1.3 8-3v-13" />
    <path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
  </svg>
);

export const IconBook = ({ className }: P) => (
  <svg viewBox="0 0 24 24" {...stroke} className={className ?? base}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14A2.5 2.5 0 0 0 6.5 22H20v-2.5" />
  </svg>
);

export const IconFlask = ({ className }: P) => (
  <svg viewBox="0 0 24 24" {...stroke} className={className ?? base}>
    <path d="M10 2v6.5L4.5 18a2.5 2.5 0 0 0 2.2 3.5h10.6a2.5 2.5 0 0 0 2.2-3.5L14 8.5V2M8.5 2h7M7 15h10" />
  </svg>
);

export const IconAgent = ({ className }: P) => (
  <svg viewBox="0 0 24 24" {...stroke} className={className ?? base}>
    <rect x="5" y="8" width="14" height="11" rx="3" />
    <path d="M12 8V5M12 5a1.5 1.5 0 1 0-.01-3.01A1.5 1.5 0 0 0 12 5z" />
    <circle cx="9.5" cy="13" r="0.6" fill="currentColor" />
    <circle cx="14.5" cy="13" r="0.6" fill="currentColor" />
    <path d="M9.5 16.2c1.6 1 3.4 1 5 0" />
  </svg>
);

import type { SVGProps } from "react";


export type IconProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

function iconProps(props: IconProps) {
  const { size = 18, className, ...rest } = props;
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    ...rest,
  };
}

export function IconX(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M18 6 6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

export function IconSearch(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

export function IconMenu(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
    </svg>
  );
}

export function IconBriefcase(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M10 6V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v1" />
      <path d="M3 9h18v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" />
      <path d="M3 13h18" />
    </svg>
  );
}

export function IconBuilding(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M4 21V4h12v17" />
      <path d="M16 8h4v13" />
      <path d="M7 8h2" />
      <path d="M7 12h2" />
      <path d="M7 16h2" />
      <path d="M10 21v-4h4v4" />
    </svg>
  );
}

export function IconArrowLeft(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </svg>
  );
}

export function IconArrowUpRight(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M7 17 17 7" />
      <path d="M9 7h8v8" />
    </svg>
  );
}

export function IconChartBar(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M4 20V10" />
      <path d="M10 20V4" />
      <path d="M16 20v-8" />
      <path d="M22 20H2" />
    </svg>
  );
}

export function IconSparkles(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2z" />
      <path d="M5 14l.9 2.6L8.5 17.5 5.9 18.4 5 21l-.9-2.6L1.5 17.5 4.1 16.6 5 14z" />
    </svg>
  );
}

export function IconSun(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="M4.9 4.9l1.4 1.4" />
      <path d="M17.7 17.7l1.4 1.4" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="M4.9 19.1l1.4-1.4" />
      <path d="M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

export function IconMoon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M20 13.6A8 8 0 1 1 10.4 4 6.5 6.5 0 0 0 20 13.6z" />
    </svg>
  );
}

export function IconShield(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M12 2l7 3v6c0 5-3.4 9.4-7 11-3.6-1.6-7-6-7-11V5l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

export function IconBell(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
      <path d="M9.5 19a2.5 2.5 0 0 0 5 0" />
    </svg>
  );
}

export function IconLogout(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M9 21H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}

export function IconDashboard(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <rect x="3" y="3" width="8" height="8" rx="2" />
      <rect x="13" y="3" width="8" height="8" rx="2" />
      <rect x="3" y="13" width="8" height="8" rx="2" />
      <rect x="13" y="13" width="8" height="8" rx="2" />
    </svg>
  );
}

export function IconUser(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="8" r="4" />
    </svg>
  );
}

export function IconUsers(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M17 21a7 7 0 0 0-14 0" />
      <circle cx="10" cy="8" r="3.5" />
      <path d="M23 21a6 6 0 0 0-9-5" />
      <path d="M17.5 4.5a3 3 0 0 1 0 6" />
    </svg>
  );
}

export function IconTag(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M20 12l-8 8-10-10V2h8l10 10z" />
      <circle cx="7" cy="7" r="1.5" />
    </svg>
  );
}

export function IconClipboardList(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M9 5h6" />
      <path d="M9 3h6a2 2 0 0 1 2 2v16H7V5a2 2 0 0 1 2-2z" />
      <path d="M9 9h6" />
      <path d="M9 13h6" />
      <path d="M9 17h6" />
    </svg>
  );
}

export function IconWrench(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4l-6.2 6.2a2 2 0 1 0 2.8 2.8l6.2-6.2a4 4 0 0 0 5.4-5.4l-2.1 2.1-3.5-3.5 2.8-2.8z" />
    </svg>
  );
}

export function IconCog(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
      <path d="M19.4 15a8 8 0 0 0 .1-6l-2.1.6a6.4 6.4 0 0 0-1.5-1.5l.6-2.1a8 8 0 0 0-6-.1l.6 2.1a6.4 6.4 0 0 0-1.5 1.5l-2.1-.6a8 8 0 0 0-.1 6l2.1-.6c.4.6.9 1.1 1.5 1.5l-.6 2.1a8 8 0 0 0 6 .1l-.6-2.1c.6-.4 1.1-.9 1.5-1.5l2.1.6z" />
    </svg>
  );
}

export function IconCoins(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <ellipse cx="12" cy="5" rx="7" ry="3" />
      <path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5" />
      <path d="M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
    </svg>
  );
}

export function IconMessageCircle(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H7l-4 3 1.2-4.6A8.5 8.5 0 1 1 21 11.5z" />
    </svg>
  );
}

export function IconFactory(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M3 21V9l6 3V9l6 3V7l6 3v11H3z" />
      <path d="M7 21v-4" />
      <path d="M11 21v-6" />
      <path d="M15 21v-3" />
    </svg>
  );
}

export function IconTruck(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M3 7h11v10H3z" />
      <path d="M14 10h4l3 3v4h-7z" />
      <circle cx="7" cy="19" r="2" />
      <circle cx="18" cy="19" r="2" />
    </svg>
  );
}

export function IconPackage(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M12 2l9 5-9 5-9-5 9-5z" />
      <path d="M3 7v10l9 5 9-5V7" />
      <path d="M12 12v10" />
    </svg>
  );
}

export function IconPencil(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
    </svg>
  );
}

export function IconTrash(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M6 6l1 16h10l1-16" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}

export function IconEye(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function IconEyeOff(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M3 3l18 18" />
      <path d="M10.5 10.5A3 3 0 0 0 12 15a3 3 0 0 0 2.5-4.5" />
      <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c6 0 10 7 10 7a18 18 0 0 1-4 5.2" />
      <path d="M6.3 6.3C3.9 8.3 2 12 2 12s4 7 10 7c.7 0 1.4-.1 2.1-.2" />
    </svg>
  );
}

export function IconAlertTriangle(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M10.3 3.3 1.9 18a2 2 0 0 0 1.7 3h16.8a2 2 0 0 0 1.7-3L13.7 3.3a2 2 0 0 0-3.4 0z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

export function IconCheckCircle(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12l2.5 2.5L16 9" />
    </svg>
  );
}

export function IconKey(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M21 2l-2 2" />
      <path d="M7.5 14.5a5 5 0 1 1 3.5 3.5L7 22H3v-4l4.5-3.5z" />
      <path d="M16 7l2 2" />
    </svg>
  );
}

export function IconLock(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export function IconBolt(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
    </svg>
  );
}

export function IconPhone(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 3a2 2 0 0 1-.5 2L8.1 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2-.5c1 .3 2 .6 3 .7A2 2 0 0 1 22 16.9z" />
    </svg>
  );
}

export function IconMail(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M4 4h16v16H4z" />
      <path d="m4 6 8 7 8-7" />
    </svg>
  );
}

export function IconQuote(props: IconProps) {
  return (
    <svg {...iconProps(props)} fill="currentColor" stroke="none">
      <path d="M7 6c-2.2 1.4-3.5 3.4-3.5 5.9C3.5 14.5 5 16 7 16c1.7 0 3-1.3 3-3s-1.2-2.9-2.7-2.9c-.2 0-.4 0-.6.1C7 8.3 8 7.1 9.3 6.4L7 6z" />
      <path d="M16 6c-2.2 1.4-3.5 3.4-3.5 5.9 0 2.6 1.5 4.1 3.5 4.1 1.7 0 3-1.3 3-3s-1.2-2.9-2.7-2.9c-.2 0-.4 0-.6.1.3-1.9 1.3-3.1 2.6-3.8L16 6z" />
    </svg>
  );
}

export function IconShoppingCart(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M6 6h15l-1.5 9h-12z" />
      <path d="M6 6 5 2H2" />
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
    </svg>
  );
}

export function IconRotateCcw(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
    </svg>
  );
}

export function IconRefresh(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M20 6v5h-5" />
      <path d="M20 11a8 8 0 1 0 2 5" />
    </svg>
  );
}

export function IconUpload(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M12 16V4" />
      <path d="M7 9l5-5 5 5" />
      <path d="M4 20h16" />
    </svg>
  );
}

export function IconPlus(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

export function IconChevronRight(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

export interface NavItem {
  href: string;
  label: string;
  /** SVG path(s) for a 24×24 stroke icon. */
  icon: string;
}

export const STATS_ICON = "M4 20h16M7 16v-4M12 16V6M17 16v-7";

export interface NavGroup {
  title: string;
  items: NavItem[];
}

/** Sidebar sections: learn → practice → tournaments → admission. */
export const NAV_GROUPS: NavGroup[] = [
  {
    title: "Learn",
    items: [
      { href: "/", label: "Home", icon: "M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5Z" },
      { href: "/lessons", label: "Lessons", icon: "M4 5a2 2 0 0 1 2-2h13v15H6a2 2 0 0 0-2 2V5Zm0 15a2 2 0 0 0 2 2h13v-4" },
      { href: "/vocabulary", label: "Vocabulary", icon: "M4 19 8.5 6h1L14 19M5.7 14.5h6.6M15.5 12.5c.6-1 1.6-1.5 2.8-1.5 1.7 0 2.7 1 2.7 2.7V19M21 15.5c-.6-.3-1.4-.5-2.3-.5-1.7 0-2.9.8-2.9 2.1 0 1.2 1 2 2.3 2 1.3 0 2.4-.6 2.9-1.6" },
      { href: "/statistics", label: "Statistics", icon: STATS_ICON },
    ],
  },
  {
    title: "Practice",
    items: [
      { href: "/practice", label: "Question Bank", icon: "M9 5h11M9 12h11M9 19h11M4 5h.01M4 12h.01M4 19h.01" },
      { href: "/mistakes", label: "Mistakes", icon: "M3 12a9 9 0 1 0 3-6.7M3 4v5h5M12 8v4l3 2" },
      { href: "/test", label: "Practice Test", icon: "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" },
    ],
  },
  {
    title: "Tournaments",
    items: [
      { href: "/compete", label: "Weekly tournament", icon: "M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4ZM7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3" },
      { href: "/ranked", label: "Ranked", icon: "M13 3 4 14h7l-1 7 9-11h-7l1-7Z" },
      { href: "/leaderboard", label: "Leaderboard", icon: "M3 21h18M5 21v-8h4v8M10 21V5h4v16M15 21v-6h4v6" },
    ],
  },
  {
    title: "Admission",
    items: [
      { href: "/admission", label: "Admission", icon: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3Z" },
    ],
  },
];

/** Every main page, in sidebar order (footer links). */
export const MAIN_NAV: NavItem[] = NAV_GROUPS.flatMap((g) => g.items);

export const ACCOUNT_NAV: NavItem[] = [
  { href: "/profile", label: "Profile", icon: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0" },
];

/** Stellar Plus page (sidebar Account group). */
export const PLUS_NAV: NavItem = { href: "/plus", label: "Stellar Plus", icon: "M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.5 6.6 19.5l1.2-6L3.3 9.3l6.1-.7L12 3Z" };

/** Shown under Profile only for the admin (see lib/admin-flag.ts). */
export const ADMIN_NAV: NavItem = { href: "/admin", label: "Support list", icon: "M4 13h4l1.5 3h5L16 13h4M5 5h14l1 8v6H4v-6l1-8Z" };

export function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
}

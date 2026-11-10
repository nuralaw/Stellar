export interface NavItem {
  href: string;
  label: string;
  /** SVG path(s) for a 24×24 stroke icon. */
  icon: string;
}

export const MAIN_NAV: NavItem[] = [
  { href: "/", label: "Home", icon: "M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5Z" },
  { href: "/practice", label: "Question Bank", icon: "M9 5h11M9 12h11M9 19h11M4 5h.01M4 12h.01M4 19h.01" },
  { href: "/test", label: "Practice Test", icon: "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" },
  { href: "/compete", label: "Compete", icon: "M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4ZM7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3" },
  { href: "/lessons", label: "Lessons", icon: "M4 5a2 2 0 0 1 2-2h13v15H6a2 2 0 0 0-2 2V5Zm0 15a2 2 0 0 0 2 2h13v-4" },
];

export const ACCOUNT_NAV: NavItem[] = [
  { href: "/profile", label: "Profile", icon: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0" },
];

export function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
}

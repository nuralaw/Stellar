import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { InlineScript } from "@/components/InlineScript";
import { Sidebar } from "@/components/Sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SIDEBAR_INIT_SCRIPT } from "@/lib/sidebar";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
import { SiteFooter } from "@/components/SiteFooter";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Stellar — Free Digital SAT Prep",
    template: "%s · Stellar",
  },
  description:
    "Free Digital SAT practice: thousands of real-format questions with explanations, full-length adaptive practice tests, and clear lessons for Math and Reading & Writing.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full font-sans">
        <InlineScript html={THEME_INIT_SCRIPT + SIDEBAR_INIT_SCRIPT} />
        <Sidebar />
        {/* Desktop theme switch, top-right corner (mobile one lives in the top bar) */}
        <ThemeToggle className="fixed top-4 right-4 z-30 hidden border border-line bg-surface/90 text-ink shadow-sm backdrop-blur hover:bg-surface-2 lg:grid" />
        <div className="flex min-h-screen flex-col transition-[padding] duration-200 ease-out lg:pl-64 lg:sb-collapsed:pl-[72px]">
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}

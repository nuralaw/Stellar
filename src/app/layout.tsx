import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { InlineScript } from "@/components/InlineScript";
import { PageTracker } from "@/components/analytics/PageTracker";
import { PlausibleScript } from "@/components/analytics/PlausibleScript";
import { AppShell } from "@/components/AppShell";
import { AuthGate } from "@/components/auth/AuthGate";
import { Sidebar } from "@/components/Sidebar";
import { SidebarTour } from "@/components/SidebarTour";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SIDEBAR_INIT_SCRIPT } from "@/lib/sidebar";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
import { SiteFooter } from "@/components/SiteFooter";
import { SupportDock } from "@/components/SupportDock";
import { SyncProvider } from "@/components/SyncProvider";
import { Toaster } from "@/components/Toaster";
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
    default: "Stellar — SAT Prep",
    template: "%s · Stellar",
  },
  description:
    "Digital SAT practice: thousands of real-format questions with explanations, full-length timed practice tests, and clear lessons for Math and Reading & Writing.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full font-sans">
        <InlineScript html={THEME_INIT_SCRIPT + SIDEBAR_INIT_SCRIPT} />
        <Sidebar />
        <SyncProvider />
        <PageTracker />
        <PlausibleScript />
        <AuthGate />
        {/* On /register and /login (bare pages) AppShell leaves out the theme switch, the sidebar padding and the footer. */}
        <AppShell
          // Desktop theme switch, top-right corner (mobile one lives in the top bar)
          toggle={<ThemeToggle className="fixed top-4 right-4 z-30 hidden border border-line bg-surface/90 text-ink shadow-sm backdrop-blur hover:bg-surface-2 lg:grid focus-mode:hidden!" />}
          footer={<SiteFooter />}
        >
          {children}
        </AppShell>
        <SupportDock />
        <Toaster />
        <SidebarTour />
      </body>
    </html>
  );
}

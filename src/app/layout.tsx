import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { InlineScript } from "@/components/InlineScript";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
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
    "Free Digital SAT practice: hundreds of original questions with explanations, full-length adaptive practice tests, and clear lessons for Math and Reading & Writing.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="flex min-h-full flex-col font-sans">
        <InlineScript html={THEME_INIT_SCRIPT} />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

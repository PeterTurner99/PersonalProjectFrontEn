import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/themeProvider"
import {AuthProvider} from "../components/authProvider";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import {Inter as FontSans} from 'next/font/google'
import {cn} from '../lib/utils'
import {AppSidebar} from "../components/app-sidebar";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import BaseLayout from "../components/layout/BaseLayout";
const fontSans = FontSans({
    subsets: ['latin'],
    variable: '--font-sans',
})

export const metadata = {
  title: "Frontend Development",
  description: "app",
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn( 'min-h-screen bg-background font-sans antialiased',
            fontSans.variable)}
      >
      <ThemeProvider attribute="class"
                     defaultTheme="system"
                     enableSystem
                     disableTransitionOnChange>
          <AuthProvider>
              <BaseLayout className="flex min-h[calc(100vh_-_theme(spacing.16))] flex-1 flex-col  bg-muted/40  md:p-10">
                {children}
              </BaseLayout>
          </AuthProvider>
      </ThemeProvider>
      </body>
    </html>
  );
}

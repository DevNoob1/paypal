// app/layout.tsx
import { Suspense } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { AuthProvider } from "@/components/AuthContext";
import { ThemeProvider } from "@/components/ThemeContext";
import { WalkthroughProvider } from "@/components/WalkthroughTour";
import { SignInModal } from "@/components/SignInModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ResolvAI — Autonomous AI Escrow & Milestone Payments",
  description:
    "Milestone escrow and automated deliverable verification powered by AI agents and PayPal.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-accent selection:text-white">
        <ThemeProvider>
          <AuthProvider>
            <WalkthroughProvider>
              <Suspense fallback={<div className="h-16 border-b border-border bg-background" />}>
                <Navbar />
              </Suspense>
              <main className="flex-1 flex flex-col">{children}</main>
              <SignInModal />

              {/* Clean Professional Footer */}
              <footer className="border-t border-border bg-card/50 py-6 text-xs text-muted">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">ResolvAI</span>
                    <span>—</span>
                    <span>Automated Milestone Escrow & Verification</span>
                  </div>
                  <div className="flex items-center gap-4 text-muted">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-success inline-block"></span>
                      PayPal Payment Rails
                    </span>
                    <span>•</span>
                    <span>AI Multi-Agent Review</span>
                  </div>
                </div>
              </footer>
            </WalkthroughProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

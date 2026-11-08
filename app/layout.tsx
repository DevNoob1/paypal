// app/layout.tsx
import { Suspense } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { AuthProvider } from "@/components/AuthContext";
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
  title: "ResolvAI | Autonomous Escrow & Settlement Protocol",
  description:
    "Enterprise milestone escrow and autonomous dispute resolution powered by multi-agent consensus and PayPal financial rails.",
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
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white">
        <AuthProvider>
          <Suspense fallback={<div className="h-16 border-b border-slate-800 bg-slate-950" />}>
            <Navbar />
          </Suspense>
          <main className="flex-1 flex flex-col">{children}</main>
          <SignInModal />

          {/* Enterprise Footer */}
          <footer className="border-t border-slate-900 bg-slate-950/90 py-8 text-xs text-slate-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-400">ResolvAI Inc.</span>
                <span>—</span>
                <span>Autonomous Multi-Agent Settlement Protocol</span>
              </div>
              <div className="flex items-center gap-4 text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block"></span>
                  PayPal Orders & Payouts Engine Active
                </span>
                <span>•</span>
                <span>Tri-Agent Consensus Network</span>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}

// components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthContext";
import { useTheme } from "./ThemeContext";
import { useWalkthrough } from "./WalkthroughTour";
import {
  ShieldCheck,
  PlusCircle,
  LayoutDashboard,
  ChevronDown,
  Sun,
  Moon,
  Send,
  Compass,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { user, setIsSignInOpen } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { startTour, hasTourForPage } = useWalkthrough();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 p-[1px] shadow-sm group-hover:scale-105 transition-transform">
              <div className="h-full w-full bg-background rounded-[11px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-accent" />
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg text-foreground tracking-tight">
                Resolv<span className="text-accent">AI</span>
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/dashboard"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === "/dashboard"
                  ? "bg-card text-foreground border border-border"
                  : "text-muted hover:text-foreground hover:bg-card"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>

            {user.role === "client" && (
              <Link
                href="/contracts/new"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  pathname === "/contracts/new"
                    ? "bg-card text-foreground border border-border"
                    : "text-muted hover:text-foreground hover:bg-card"
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                New Contract
              </Link>
            )}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* Interactive Walkthrough Tour Trigger */}
          {hasTourForPage && (
            <button
              onClick={startTour}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent/10 hover:bg-accent/20 text-accent border border-accent/20 text-xs font-semibold transition-colors cursor-pointer"
              title="Start Interactive Page Walkthrough"
            >
              <Compass className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tour</span>
            </button>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-muted hover:text-foreground hover:bg-card border border-transparent hover:border-border transition-colors cursor-pointer"
            aria-label="Toggle color theme"
            title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-blue-600" />
            )}
          </button>

          {/* User Account / Role Switcher */}
          <button
            onClick={() => setIsSignInOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card hover:bg-card-hover border border-border text-xs text-foreground transition-all cursor-pointer"
          >
            <span className="text-sm">{user.avatar}</span>
            <div className="text-left hidden sm:block">
              <div className="font-semibold leading-tight">{user.name}</div>
              <div className="text-[10px] text-muted leading-tight">
                {user.role === "client" ? "Client" : "Contractor"}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-muted ml-0.5" />
          </button>

          {/* Primary Action Button */}
          {user.role === "client" ? (
            <Link
              href="/contracts/new"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-semibold shadow-sm transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              New Contract
            </Link>
          ) : (
            <Link
              href="/contracts/cnt_9821_stripe"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-success hover:opacity-90 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              Demo Deliverable
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

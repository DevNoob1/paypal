// components/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthContext";
import { useTheme } from "./ThemeContext";
import { useWalkthrough } from "./WalkthroughTour";
import {
  Shield,
  Plus,
  LayoutDashboard,
  Plug,
  ChevronDown,
  Sun,
  Moon,
  Compass,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { user, loginAs, setIsSignInOpen } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { startTour, hasTourForPage } = useWalkthrough();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/80 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Brand & Left Navigation */}
        <div className="flex items-center gap-7">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-7 w-7 rounded-lg bg-accent/15 border border-accent/25 flex items-center justify-center text-accent group-hover:border-accent/40 transition-colors">
              <Shield className="w-4 h-4 fill-accent/20" />
            </div>
            <div className="flex items-center">
              <span className="font-semibold text-sm tracking-tight text-foreground">
                Resolv<span className="text-accent">AI</span>
              </span>
            </div>
          </Link>

          {/* Clean Navigation Links */}
          <nav className="hidden md:flex items-center gap-2 text-xs">
            <Link
              href="/dashboard"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${pathname === "/dashboard"
                ? "bg-white/[0.08] text-foreground font-semibold"
                : "text-muted hover:text-foreground"
                }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Dashboard
            </Link>

            <Link
              href="/integrations"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${pathname === "/integrations"
                ? "bg-white/[0.08] text-foreground font-semibold"
                : "text-muted hover:text-foreground"
                }`}
            >
              <Plug className="w-3.5 h-3.5" />
              Integrations
            </Link>
          </nav>
        </div>

        {/* Right Utility & Actions */}
        <div className="flex items-center gap-2">
          {/* Segmented Utility Tray: Guide & Theme */}
          <div
            className="flex items-center rounded-lg border border-border bg-card/60 p-0.5"
            suppressHydrationWarning
          >
            {mounted && hasTourForPage && (
              <button
                onClick={startTour}
                className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium text-muted hover:text-foreground transition-colors cursor-pointer"
                title="Start Interactive Guide"
              >
                <Compass className="w-3.5 h-3.5 text-accent" />
                <span className="hidden sm:inline">Guide</span>
              </button>
            )}

            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-md text-muted hover:text-foreground transition-colors cursor-pointer"
              aria-label="Toggle color theme"
              title={
                mounted && theme === "dark"
                  ? "Switch to light theme"
                  : "Switch to dark theme"
              }
            >
              {mounted && theme === "light" ? (
                <Moon className="w-3.5 h-3.5 text-accent" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              )}
            </button>
          </div>

          {/* User Account / Role Switcher */}
          <button
            onClick={() => setIsSignInOpen(true)}
            suppressHydrationWarning
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-card/60 hover:bg-card-hover border border-border text-xs text-foreground transition-all cursor-pointer"
          >
            <div
              className={`w-5 h-5 rounded-full ${user.role === "client"
                ? "bg-accent/20 border-accent/30 text-accent"
                : "bg-emerald-500/20 border-emerald-500/30 text-emerald-500"
                } border flex items-center justify-center text-[10px] font-bold`}
            >
              {user.initials || "AC"}
            </div>
            <div className="text-left hidden sm:block">
              <div className="font-medium text-xs leading-none text-foreground">
                {user.name}
              </div>
            </div>
            <span
              className={`text-[10px] font-medium hidden md:inline ${user.role === "client" ? "text-accent" : "text-emerald-500"
                }`}
            >
              ({user.role === "client" ? "Client" : "Contractor"})
            </span>
            <ChevronDown className="w-3 h-3 text-muted ml-0.5" />
          </button>

          {/* Primary Action Button: New Contract */}
          <Link
            href="/contracts/new"
            onClick={() => {
              if (user.role === "contractor") {
                loginAs("client");
              }
            }}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent hover:bg-accent-hover text-white text-xs font-medium shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Create Contract
          </Link>
        </div>
      </div>
    </header>
  );
}

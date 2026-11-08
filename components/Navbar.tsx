// components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ShieldCheck, PlusCircle, LayoutDashboard, Cpu, CheckCircle2, UserCheck, ExternalLink } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [role, setRole] = useState<"client" | "freelancer">("client");

  useEffect(() => {
    const saved = localStorage.getItem("resolvai_role");
    if (saved === "client" || saved === "freelancer") {
      setRole(saved);
    }
  }, []);

  const toggleRole = () => {
    const next = role === "client" ? "freelancer" : "client";
    setRole(next);
    localStorage.setItem("resolvai_role", next);
    window.dispatchEvent(new Event("role_changed"));
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-[1px] shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <div className="h-full w-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-white tracking-tight flex items-center gap-1.5">
                Resolv<span className="text-blue-400">AI</span>
                <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  PayPal Sandbox
                </span>
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/dashboard"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === "/dashboard"
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            <Link
              href="/contracts/new"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === "/contracts/new"
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              New Escrow
            </Link>
          </nav>
        </div>

        {/* Right Actions: Sandbox Indicator + Role Switcher */}
        <div className="flex items-center gap-3">
          {/* Sandbox Live Indicator */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            PayPal Sandbox: Live
          </div>

          {/* Role Toggle */}
          <button
            onClick={toggleRole}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-xs font-medium text-slate-300 transition-all cursor-pointer"
            title="Click to toggle perspective"
          >
            <UserCheck className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-slate-400">Role:</span>
            <span className="font-semibold text-white capitalize">{role}</span>
          </button>

          <Link
            href="/contracts/new"
            className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/25 transition-all"
          >
            Create Escrow
          </Link>
        </div>
      </div>
    </header>
  );
}

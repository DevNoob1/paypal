// app/dashboard/page.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  Plus,
  CheckCircle2,
  AlertCircle,
  Search,
  Lock,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Clock,
  Layers,
  Sparkles,
  TrendingUp,
  BarChart2,
  Zap,
  Plug,
} from "lucide-react";
import { useAuth } from "@/components/AuthContext";

interface Milestone {
  id: string;
  title: string;
  amount: number;
  status:
  | "DRAFT"
  | "FUNDED_ESCROW"
  | "IN_PROGRESS"
  | "PENDING_REVIEW"
  | "AI_VERIFIED"
  | "PAYOUT_COMPLETED"
  | "DISPUTED";
  criteria: string[];
  deadline?: string;
  payoutReceipt?: {
    payoutId: string;
    releasedAt: string;
    amount: number;
    currency: string;
  };
}

interface Contract {
  id: string;
  title: string;
  description: string;
  amount: number;
  currency: string;
  clientName: string;
  clientEmail: string;
  freelancerName: string;
  freelancerEmail: string;
  createdAt: string;
  deadline: string;
  status:
  | "DRAFT"
  | "FUNDED_ESCROW"
  | "IN_PROGRESS"
  | "PENDING_REVIEW"
  | "AI_VERIFIED"
  | "PAYOUT_COMPLETED"
  | "DISPUTED";
  criteria: string[];
  paypalOrderId?: string;
  submission?: {
    submittedAt?: string;
    notes?: string;
    url?: string;
    codeSnippet?: string;
  };
  auditReport?: {
    overallScore?: number;
    verdict?: string;
    summary?: string;
  };
  milestones?: Milestone[];
}

interface Stats {
  totalEscrow: number;
  totalPaidOut: number;
  activeCount: number;
  disputedCount: number;
  verifiedCount: number;
  approvalRate: number;
}

function getCategory(title: string) {
  const t = title.toLowerCase();
  if (t.includes("design") || t.includes("figma") || t.includes("ui/ux")) {
    return { label: "UI/UX Design", color: "bg-purple-500/10 text-purple-400 border-purple-500/25" };
  }
  if (t.includes("seo") || t.includes("article") || t.includes("copy") || t.includes("content")) {
    return { label: "SEO Content", color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/25" };
  }
  if (t.includes("brand") || t.includes("logo") || t.includes("social")) {
    return { label: "Brand Identity", color: "bg-amber-500/10 text-amber-400 border-amber-500/25" };
  }
  return { label: "Web Checkout", color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/25" };
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "Nov 12, 2026";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return dateStr;
  }
}

function getInitials(name?: string) {
  if (!name) return "??";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Dashboard() {
  const { user, loginAs, setIsSignInOpen } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const loadData = async () => {
    try {
      const res = await fetch("/api/contracts");
      const data = await res.json();
      if (data.contracts) {
        setContracts(data.contracts);
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Failed to fetch contracts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredContracts = contracts.filter((c) => {
    const matchesFilter =
      filter === "ALL"
        ? true
        : filter === "REVIEW"
          ? c.status === "PENDING_REVIEW" || c.status === "AI_VERIFIED"
          : filter === "ESCROW"
            ? c.status === "FUNDED_ESCROW"
            : filter === "COMPLETED"
              ? c.status === "PAYOUT_COMPLETED"
              : filter === "DISPUTED"
                ? c.status === "DISPUTED"
                : true;

    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.freelancerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.clientName.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const totalEscrowAmount = stats?.totalEscrow ?? 0;
  const totalPaidOutAmount = stats?.totalPaidOut ?? 0;
  const activeCount = contracts.filter((c) => c.status !== "PAYOUT_COMPLETED").length;
  const reviewCount = contracts.filter((c) => c.status === "PENDING_REVIEW" || c.status === "AI_VERIFIED").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-8">

      {/* 1. Header with Role Switcher & Action */}
      <div data-tour="dashboard-header" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            {user.role === "client" ? "Client Escrow & Projects" : "Contractor Earnings & Deliverables"}
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            {user.role === "client"
              ? "Funds are protected in PayPal escrow until deliverables pass review."
              : "Track milestone deliverables, run verification checks, and collect direct PayPal payouts."}
          </p>
        </div>


      </div>

      {/* 2. Top Metric Cards Grid */}
      <div data-tour="dashboard-metrics" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Escrow Amount */}
        <div className="p-5 rounded-2xl bg-card/60 hover:bg-card/80 border border-border/80 transition-all shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
              {user.role === "client" ? "Held in PayPal Escrow" : "In-Flight Escrow"}
            </span>
            <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-foreground">
              ${totalEscrowAmount.toFixed(2)}
            </div>
            <div className="text-[11px] text-accent font-medium mt-1">
              {user.role === "client" ? "Secured in PayPal vault" : "Earnable upon completion"}
            </div>
          </div>
        </div>

        {/* Card 2: Settled Payouts / Lifetime Earnings */}
        <div className="p-5 rounded-2xl bg-card/60 hover:bg-card/80 border border-border/80 transition-all shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
              {user.role === "client" ? "Settled Payouts" : "Lifetime Deposited"}
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-emerald-500">
              ${totalPaidOutAmount.toFixed(2)}
            </div>
            <div className="text-[11px] text-emerald-500 font-medium mt-1">
              {user.role === "client" ? "Released directly to PayPal" : "Sent directly to your PayPal"}
            </div>
          </div>
        </div>

        {/* Card 3: Active Projects / Deliverables */}
        <div className="p-5 rounded-2xl bg-card/60 hover:bg-card/80 border border-border/80 transition-all shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
              {user.role === "client" ? "Active Projects" : "Active Deliverables"}
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-foreground">
              {activeCount}
            </div>
            <div className="text-[11px] text-muted font-medium mt-1">
              Currently in progress
            </div>
          </div>
        </div>

        {/* Card 4: Action / Review Queue */}
        <div className="p-5 rounded-2xl bg-card/60 hover:bg-card/80 border border-border/80 transition-all shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
              {user.role === "client" ? "Needs Review" : "Pending Review"}
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-amber-400">
              {reviewCount}
            </div>
            <div className="text-[11px] text-amber-400 font-medium mt-1">
              {reviewCount > 0
                ? user.role === "client"
                  ? "Awaiting client sign-off"
                  : "Submitted & clearing"
                : "All deliverables up to date"}
            </div>
          </div>
        </div>
      </div>

      {/* 3. ANALYTICS CARDS (Client & Contractor Specific Graphs & Breakdown) */}
      {user.role === "client" ? (
        /* CLIENT ANALYTICS CARDS */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Card A: Escrow Cashflow & Velocity Trend (8 cols) */}
          <div className="lg:col-span-8 p-6 rounded-2xl bg-card/60 border border-border/80 shadow-xs flex flex-col justify-between space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
              <div>
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-accent" />
                  Escrow & Payout Cashflow Trend
                </h3>
                <p className="text-[11px] text-muted mt-0.5">
                  Monthly volume deposited in PayPal escrow vs. settled payouts
                </p>
              </div>

              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1.5 text-accent font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-accent" />
                  Escrow Locked
                </span>
                <span className="flex items-center gap-1.5 text-emerald-500 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Settled Payouts
                </span>
              </div>
            </div>

            {/* SVG Visual Graph */}
            <div className="relative w-full h-44 sm:h-52">
              <svg viewBox="0 0 600 180" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="clientEscrowGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="clientPayoutGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Guidelines */}
                <line x1="40" y1="150" x2="580" y2="150" stroke="rgba(255,255,255,0.06)" strokeDasharray="3" />
                <line x1="40" y1="105" x2="580" y2="105" stroke="rgba(255,255,255,0.06)" strokeDasharray="3" />
                <line x1="40" y1="60" x2="580" y2="60" stroke="rgba(255,255,255,0.06)" strokeDasharray="3" />
                <line x1="40" y1="15" x2="580" y2="15" stroke="rgba(255,255,255,0.06)" strokeDasharray="3" />

                {/* Y-Axis Labels */}
                <text x="5" y="18" fill="#71717a" fontSize="10" fontFamily="monospace">$5,000</text>
                <text x="5" y="63" fill="#71717a" fontSize="10" fontFamily="monospace">$3,500</text>
                <text x="5" y="108" fill="#71717a" fontSize="10" fontFamily="monospace">$1,500</text>
                <text x="5" y="152" fill="#71717a" fontSize="10" fontFamily="monospace">$0</text>

                {/* Escrow Funded Area & Line */}
                <path d="M 60 145 Q 150 130 240 100 T 420 50 T 560 25 L 560 150 L 60 150 Z" fill="url(#clientEscrowGrad)" />
                <path d="M 60 145 Q 150 130 240 100 T 420 50 T 560 25" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" />

                {/* Settled Payouts Area & Line */}
                <path d="M 60 150 Q 150 142 240 120 T 420 75 T 560 55 L 560 150 L 60 150 Z" fill="url(#clientPayoutGrad)" />
                <path d="M 60 150 Q 150 142 240 120 T 420 75 T 560 55" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />

                {/* Nodes */}
                <circle cx="60" cy="145" r="3.5" fill="#6366f1" />
                <circle cx="240" cy="100" r="3.5" fill="#6366f1" />
                <circle cx="420" cy="50" r="3.5" fill="#6366f1" />
                <circle cx="560" cy="25" r="4.5" fill="#6366f1" stroke="#fff" strokeWidth="1.5" />

                <circle cx="240" cy="120" r="3.5" fill="#10b981" />
                <circle cx="420" cy="75" r="3.5" fill="#10b981" />
                <circle cx="560" cy="55" r="4.5" fill="#10b981" stroke="#fff" strokeWidth="1.5" />
              </svg>
            </div>

            {/* Month Ticks */}
            <div className="flex justify-between px-6 pt-2 border-t border-border/60 text-[11px] font-mono text-muted">
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
              <span className="text-foreground font-bold">Nov (Current)</span>
            </div>

            {/* Quick Mini Stats Strip */}
            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-border/60 text-center">
              <div className="p-2 rounded-lg bg-background/50 border border-border/50">
                <span className="text-[10px] text-muted block uppercase">Total Volume</span>
                <span className="text-xs font-mono font-bold text-foreground mt-0.5 block">$4,700.00</span>
              </div>
              <div className="p-2 rounded-lg bg-background/50 border border-border/50">
                <span className="text-[10px] text-muted block uppercase">Current in Escrow</span>
                <span className="text-xs font-mono font-bold text-accent mt-0.5 block">${totalEscrowAmount.toFixed(2)}</span>
              </div>
              <div className="p-2 rounded-lg bg-background/50 border border-border/50">
                <span className="text-[10px] text-muted block uppercase">Settlement Rate</span>
                <span className="text-xs font-mono font-bold text-emerald-400 mt-0.5 block">100% On-Time</span>
              </div>
            </div>
          </div>

          {/* Card B: Category Spending & Quality Rating (4 cols) */}
          <div className="lg:col-span-4 p-6 rounded-2xl bg-card/60 border border-border/80 shadow-xs flex flex-col justify-between space-y-4">
            <div className="border-b border-border/60 pb-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-accent" />
                Spending by Project Type
              </h3>
              <p className="text-[11px] text-muted mt-0.5">
                Escrow budget distributed across work categories
              </p>
            </div>

            {/* Category Breakdown Progress Bars */}
            <div className="space-y-3">
              {[
                { name: "Web Checkout & Payments", amount: 2100, pct: 45, color: "bg-indigo-500" },
                { name: "UI/UX & Mobile Design", amount: 1600, pct: 34, color: "bg-purple-500" },
                { name: "Brand Identity & Social", amount: 600, pct: 13, color: "bg-amber-500" },
                { name: "SEO Launch Articles", amount: 400, pct: 8, color: "bg-cyan-500" },
              ].map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-foreground font-medium text-[11px] truncate">{item.name}</span>
                    <span className="font-mono text-muted text-[11px]">${item.amount} ({item.pct}%)</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-background border border-border/50 overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Verification & Escrow Guarantee Footer */}
            <div className="p-3.5 rounded-xl bg-background/60 border border-border/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  First-Check Pass Rate
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/25">
                  95%
                </span>
              </div>
              <p className="text-[10.5px] text-muted leading-relaxed">
                Objective criteria checks ensure deliverables meet specifications before PayPal payout authorization.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* CONTRACTOR ANALYTICS CARDS */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Card A: Contractor Earnings & Payout Velocity (8 cols) */}
          <div className="lg:col-span-8 p-6 rounded-2xl bg-card/60 border border-border/80 shadow-xs flex flex-col justify-between space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
              <div>
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  Contractor Earnings & Settlement Velocity
                </h3>
                <p className="text-[11px] text-muted mt-0.5">
                  Monthly PayPal payouts released directly to your verified payout account
                </p>
              </div>

              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1.5 text-emerald-500 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Completed Earnings
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400/80 font-medium">
                  <span className="w-2.5 h-1 rounded-sm bg-emerald-400 border-b border-dashed border-emerald-300" />
                  In-Flight Payout (+ $450)
                </span>
              </div>
            </div>

            {/* SVG Visual Graph for Contractor */}
            <div className="relative w-full h-44 sm:h-52">
              <svg viewBox="0 0 600 180" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="contractorEarnGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.32" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Guidelines */}
                <line x1="40" y1="150" x2="580" y2="150" stroke="rgba(255,255,255,0.06)" strokeDasharray="3" />
                <line x1="40" y1="105" x2="580" y2="105" stroke="rgba(255,255,255,0.06)" strokeDasharray="3" />
                <line x1="40" y1="60" x2="580" y2="60" stroke="rgba(255,255,255,0.06)" strokeDasharray="3" />
                <line x1="40" y1="15" x2="580" y2="15" stroke="rgba(255,255,255,0.06)" strokeDasharray="3" />

                {/* Y-Axis Labels */}
                <text x="5" y="18" fill="#71717a" fontSize="10" fontFamily="monospace">$4,000</text>
                <text x="5" y="63" fill="#71717a" fontSize="10" fontFamily="monospace">$3,000</text>
                <text x="5" y="108" fill="#71717a" fontSize="10" fontFamily="monospace">$1,500</text>
                <text x="5" y="152" fill="#71717a" fontSize="10" fontFamily="monospace">$0</text>

                {/* Completed Earnings Area & Line */}
                <path d="M 60 148 Q 150 138 240 115 T 420 70 T 500 48 L 500 150 L 60 150 Z" fill="url(#contractorEarnGrad)" />
                <path d="M 60 148 Q 150 138 240 115 T 420 70 T 500 48" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />

                {/* Projected In-Flight Payout (Dashed Emerald Line to Nov Milestone) */}
                <path d="M 500 48 L 565 25" fill="none" stroke="#10b981" strokeWidth="2.5" strokeDasharray="5,5" className="animate-pulse" />

                {/* Interactive Nodes */}
                <circle cx="60" cy="148" r="3.5" fill="#10b981" />
                <circle cx="240" cy="115" r="3.5" fill="#10b981" />
                <circle cx="420" cy="70" r="3.5" fill="#10b981" />
                <circle cx="500" cy="48" r="4.5" fill="#10b981" />
                <circle cx="565" cy="25" r="5" fill="#10b981" stroke="#fff" strokeWidth="2" />
              </svg>
            </div>

            {/* Month Ticks */}
            <div className="flex justify-between px-6 pt-2 border-t border-border/60 text-[11px] font-mono text-muted">
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
              <span className="text-emerald-400 font-bold">Nov (+$450 clearing)</span>
            </div>

            {/* Quick Mini Stats Strip */}
            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-border/60 text-center">
              <div className="p-2 rounded-lg bg-background/50 border border-border/50">
                <span className="text-[10px] text-muted block uppercase">Lifetime Earned</span>
                <span className="text-xs font-mono font-bold text-emerald-400 mt-0.5 block">${totalPaidOutAmount.toFixed(2)}</span>
              </div>
              <div className="p-2 rounded-lg bg-background/50 border border-border/50">
                <span className="text-[10px] text-muted block uppercase">Next Expected Payout</span>
                <span className="text-xs font-mono font-bold text-foreground mt-0.5 block">$450.00 USD</span>
              </div>
              <div className="p-2 rounded-lg bg-background/50 border border-border/50">
                <span className="text-[10px] text-muted block uppercase">Payout Rail</span>
                <span className="text-xs font-mono font-bold text-emerald-400 mt-0.5 block">Direct PayPal</span>
              </div>
            </div>
          </div>

          {/* Card B: Contractor Skill Breakdown & Quality Rating (4 cols) */}
          <div className="lg:col-span-4 p-6 rounded-2xl bg-card/60 border border-border/80 shadow-xs flex flex-col justify-between space-y-4">
            <div className="border-b border-border/60 pb-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-emerald-500" />
                Earnings by Project Type
              </h3>
              <p className="text-[11px] text-muted mt-0.5">
                Revenue generated by deliverable skillsets
              </p>
            </div>

            {/* Contractor Skill Breakdown Progress Bars */}
            <div className="space-y-3">
              {[
                { name: "Web Checkout & APIs", amount: 1850, pct: 54, color: "bg-emerald-500" },
                { name: "UI/UX & Mobile Design", amount: 950, pct: 28, color: "bg-purple-500" },
                { name: "Brand Assets & Vectors", amount: 400, pct: 12, color: "bg-amber-500" },
                { name: "Technical Copy & SEO", amount: 250, pct: 6, color: "bg-cyan-500" },
              ].map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-foreground font-medium text-[11px] truncate">{item.name}</span>
                    <span className="font-mono text-muted text-[11px]">${item.amount} ({item.pct}%)</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-background border border-border/50 overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Contractor Payout Protection Footer */}
            <div className="p-3.5 rounded-xl bg-background/60 border border-border/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  Direct PayPal Settlement
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/25">
                  Active Rail
                </span>
              </div>
              <p className="text-[10.5px] text-muted leading-relaxed">
                Connected to <span className="text-foreground font-mono font-medium">alex.rivera@devmail.com</span>. Payouts deposit automatically upon milestone approval.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. Filters & Search Bar */}
      <div data-tour="contract-filters" className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-1">
        <div className="flex items-center gap-1.5 bg-card/60 border border-border/80 p-1 rounded-xl overflow-x-auto">
          {[
            { label: user.role === "client" ? "All Projects" : "All Deliverables", val: "ALL", count: contracts.length },
            { label: user.role === "client" ? "Needs Review" : "In Review", val: "REVIEW", count: reviewCount },
            { label: "In Escrow", val: "ESCROW", count: contracts.filter((c) => c.status === "FUNDED_ESCROW").length },
            { label: "Paid Out", val: "COMPLETED", count: contracts.filter((c) => c.status === "PAYOUT_COMPLETED").length },
          ].map((tab) => (
            <button
              key={tab.val}
              onClick={() => setFilter(tab.val)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${filter === tab.val
                  ? "bg-white/[0.08] text-foreground font-semibold shadow-xs"
                  : "text-muted hover:text-foreground"
                }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${filter === tab.val ? "bg-white/[0.12] text-foreground" : "bg-card text-muted"
                }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder={user.role === "client" ? "Search projects or people..." : "Search deliverables or clients..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-card/60 border border-border/80 text-xs text-foreground placeholder-muted/60 focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      {/* 5. SEPARATE PROJECT CARDS GRID (Breathable 3-Column Grid) */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="p-6 rounded-2xl bg-card/40 border border-border/80 h-72" />
          ))}
        </div>
      ) : filteredContracts.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border/80 rounded-2xl bg-card/20">
          <Layers className="w-8 h-8 text-muted mx-auto mb-2 opacity-50" />
          <h3 className="text-sm font-semibold text-foreground">No matching projects</h3>
          <p className="text-xs text-muted mt-1">Try selecting a different filter tab or clearing search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContracts.map((contract) => {
            const isPaid = contract.status === "PAYOUT_COMPLETED";
            const isReviewReady = contract.status === "PENDING_REVIEW" || contract.status === "AI_VERIFIED";
            const isDisputed = contract.status === "DISPUTED";
            const category = getCategory(contract.title);
            const hasMilestones = Boolean(contract.milestones && contract.milestones.length > 0);
            const completedMilestones =
              contract.milestones?.filter((m) => m.status === "PAYOUT_COMPLETED").length || (isPaid ? 1 : 0);
            const totalMilestonesCount = contract.milestones?.length || 1;
            const otherPartyName = user.role === "client" ? contract.freelancerName : contract.clientName;
            const otherPartyEmail = user.role === "client" ? contract.freelancerEmail : contract.clientEmail;

            return (
              <Link
                key={contract.id}
                href={`/contracts/${contract.id}`}
                data-tour={contract.id === "cnt_9821_stripe" ? "demo-contract" : undefined}
                className="group relative flex flex-col justify-between p-6 rounded-2xl bg-card/60 hover:bg-card/90 border border-border/80 hover:border-accent/40 transition-all duration-200 hover:-translate-y-1 shadow-xs hover:shadow-md cursor-pointer"
              >
                {/* Top Section: Category & Status Badge */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-semibold border ${category.color}`}>
                      {category.label}
                    </span>

                    {isPaid ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Paid
                      </span>
                    ) : isDisputed ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Frozen
                      </span>
                    ) : isReviewReady ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        Needs Review
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-accent/10 text-accent border border-accent/20 flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        In Escrow
                      </span>
                    )}
                  </div>

                  {/* Title & Short Description */}
                  <div className="space-y-1.5">
                    <h3 className="text-base font-bold text-foreground group-hover:text-accent transition-colors line-clamp-1">
                      {contract.title}
                    </h3>
                    <p className="text-xs text-muted leading-relaxed line-clamp-2">
                      {contract.description}
                    </p>
                  </div>

                  {/* Amount Box */}
                  <div className="p-3.5 rounded-xl bg-background/60 border border-border/60 flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-muted font-semibold block">
                        Milestone Escrow
                      </span>
                      <div className="text-xl font-bold font-mono text-foreground mt-0.5">
                        ${contract.amount.toFixed(2)}
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-muted uppercase">
                      {contract.currency}
                    </span>
                  </div>

                  {/* Other Party Info */}
                  <div className="flex items-center gap-2.5 pt-1">
                    <div className="w-7 h-7 rounded-full bg-accent/15 text-accent border border-accent/25 flex items-center justify-center font-bold text-[10px]">
                      {getInitials(otherPartyName)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-foreground truncate">
                        {otherPartyName}
                      </div>
                      <div className="text-[10.5px] text-muted truncate font-mono">
                        {otherPartyEmail}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Section: Milestone Progress & Action */}
                <div className="pt-5 mt-5 border-t border-border/60 space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted">
                        {hasMilestones
                          ? `${completedMilestones} of ${totalMilestonesCount} Milestones`
                          : isPaid
                            ? "Completed"
                            : "In Progress"}
                      </span>
                      <span className="text-muted flex items-center gap-1 font-mono text-[10px]">
                        <Clock className="w-3 h-3" />
                        Due {formatDate(contract.deadline)}
                      </span>
                    </div>

                    <div className="w-full h-1.5 rounded-full bg-background border border-border/50 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${isPaid
                            ? "bg-emerald-500 w-full"
                            : isDisputed
                              ? "bg-rose-500 w-1/2"
                              : isReviewReady
                                ? "bg-amber-400 w-4/5"
                                : "bg-accent w-1/3"
                          }`}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-muted text-[11px]">
                      PayPal Protected
                    </span>
                    <span className="inline-flex items-center gap-1 font-semibold text-accent group-hover:translate-x-1 transition-transform">
                      Open Project
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

    </div>
  );
}

// app/dashboard/page.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  Plus,
  CheckCircle2,
  AlertCircle,
  Search,
  Sparkles,
  Send,
  Lock,
  Clock,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  CreditCard,
} from "lucide-react";
import { useAuth } from "@/components/AuthContext";

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
  };
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
  if (t.includes("ai") || t.includes("agent") || t.includes("pipeline")) {
    return { label: "AI Pipeline", color: "bg-amber-500/10 text-amber-400 border-amber-500/25" };
  }
  return { label: "Web Service", color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/25" };
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

export default function Dashboard() {
  const { user, setIsSignInOpen } = useAuth();
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

  // Calculate dynamic sums
  const totalEscrowAmount = stats?.totalEscrow ?? 1250;
  const totalPaidOutAmount = stats?.totalPaidOut ?? 3450;
  const totalCommitted = totalEscrowAmount + totalPaidOutAmount;
  const settledPercent = totalCommitted > 0 ? (totalPaidOutAmount / totalCommitted) * 100 : 73.4;
  const escrowPercent = totalCommitted > 0 ? (totalEscrowAmount / totalCommitted) * 100 : 26.6;

  // Single active contract needing immediate review / spotlight
  const urgentContract = contracts.find((c) => c.status === "PENDING_REVIEW" || c.status === "AI_VERIFIED") || contracts[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-7">
      
      {/* 1. Header with Role Switcher & Primary Action */}
      <div data-tour="dashboard-header" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              {user.role === "client" ? "Milestones & Escrow Vault" : "Earnings & Deliverables Pipeline"}
            </h1>
            <button
              onClick={() => setIsSignInOpen(true)}
              className="px-2.5 py-1 rounded-md text-xs font-medium bg-card hover:bg-card-hover border border-border flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <div className={`w-3.5 h-3.5 rounded-full ${user.role === "client" ? "bg-accent" : "bg-emerald-500"} text-white flex items-center justify-center text-[9px] font-bold`}>
                {user.initials || "AC"}
              </div>
              <span className="font-semibold text-foreground">{user.name}</span>
              <span className={`text-[10px] font-medium ${user.role === "client" ? "text-accent" : "text-emerald-500"}`}>
                ({user.role === "client" ? "Client" : "Contractor"})
              </span>
            </button>
          </div>
        </div>

        <div data-tour="new-contract-btn" className="flex items-center gap-2 self-start sm:self-auto">
          {user.role === "client" ? (
            <Link
              href="/contracts/new"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-accent hover:bg-accent-hover text-white font-semibold text-xs shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Fund New Contract
            </Link>
          ) : (
            <Link
              href="/contracts/cnt_9821_stripe"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-sm transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              Active Milestone
            </Link>
          )}
        </div>
      </div>

      {/* 2. Top Financial Summary Strip (Replaces 4 Bulky Disconnected Boxes) */}
      <div data-tour="dashboard-metrics" className="p-5 rounded-2xl bg-card/60 border border-border/80 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        {user.role === "client" ? (
          <div className="flex flex-wrap items-center gap-6 sm:gap-10">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-muted font-semibold">Locked in PayPal Escrow</div>
              <div className="text-2xl font-bold font-mono text-foreground mt-0.5">
                ${totalEscrowAmount.toFixed(2)}
              </div>
              <div className="text-[10.5px] text-accent font-medium mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span>{contracts.filter(c => c.status === "FUNDED_ESCROW" || c.status === "PENDING_REVIEW").length} Active Milestones</span>
              </div>
            </div>

            <div className="h-10 w-[1px] bg-border/60 hidden sm:block" />

            <div>
              <div className="text-[11px] uppercase tracking-wider text-muted font-semibold">Settled Payouts</div>
              <div className="text-2xl font-bold font-mono text-emerald-500 mt-0.5">
                ${totalPaidOutAmount.toFixed(2)}
              </div>
              <div className="text-[10.5px] text-emerald-500 font-medium mt-0.5 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>100% Verified by AI Consensus</span>
              </div>
            </div>

            <div className="h-10 w-[1px] bg-border/60 hidden sm:block" />

            <div>
              <div className="text-[11px] uppercase tracking-wider text-muted font-semibold">Committed Capital</div>
              <div className="text-2xl font-bold font-mono text-foreground mt-0.5">
                ${totalCommitted.toFixed(2)}
              </div>
              <div className="text-[10.5px] text-muted font-medium mt-0.5">
                PayPal Sandbox Rails
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-6 sm:gap-10">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-muted font-semibold">Next Expected Payout</div>
              <div className="text-2xl font-bold font-mono text-emerald-500 mt-0.5">
                $450.00
              </div>
              <div className="text-[10.5px] text-emerald-500 font-medium mt-0.5 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Clears within 48 Hours</span>
              </div>
            </div>

            <div className="h-10 w-[1px] bg-border/60 hidden sm:block" />

            <div>
              <div className="text-[11px] uppercase tracking-wider text-muted font-semibold">Lifetime Deposited</div>
              <div className="text-2xl font-bold font-mono text-foreground mt-0.5">
                ${totalPaidOutAmount.toFixed(2)}
              </div>
              <div className="text-[10.5px] text-muted font-medium mt-0.5">
                Direct PayPal Batch Settlement
              </div>
            </div>

            <div className="h-10 w-[1px] bg-border/60 hidden sm:block" />

            <div>
              <div className="text-[11px] uppercase tracking-wider text-muted font-semibold">Connected PayPal Account</div>
              <div className="text-sm font-mono font-bold text-foreground mt-1">
                alex.rivera@devmail.com
              </div>
              <div className="text-[10.5px] text-emerald-500 font-medium mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Active Direct Payout Rail</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          {user.role === "client" ? (
            <Link
              href="/contracts/new"
              className="px-3.5 py-1.5 rounded-lg bg-accent/10 hover:bg-accent text-accent hover:text-white border border-accent/25 text-xs font-semibold transition-all"
            >
              + Create Agreement
            </Link>
          ) : (
            <Link
              href="/contracts/cnt_9821_stripe"
              className="px-3.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-600 text-emerald-500 hover:text-white border border-emerald-500/25 text-xs font-semibold transition-all"
            >
              📤 Submit Work
            </Link>
          )}
        </div>
      </div>

      {/* 3. VISUAL CHARTS & GAUGES ROW (Interactive Cashflow Curve + Allocation Donut) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Interactive Cashflow & Settlement Velocity SVG Chart (8 cols) */}
        <div className="lg:col-span-8 p-5 rounded-2xl bg-card/60 border border-border/80 flex flex-col justify-between shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
                {user.role === "client" ? "Escrow & Settlement Velocity" : "Contractor Earnings Velocity"}
              </span>
              <div className="text-sm font-semibold text-foreground mt-0.5">
                {user.role === "client" ? "Cumulative Volume (Last 6 Months)" : "Net Monthly Payouts Released"}
              </div>
            </div>

            {user.role === "client" ? (
              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1.5 text-accent font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-accent" /> Escrow Funded
                </span>
                <span className="flex items-center gap-1.5 text-emerald-500 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Payouts Settled
                </span>
              </div>
            ) : (
              <span className="text-[11px] font-mono text-emerald-500 font-semibold bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20">
                +$450.00 In-Flight Payout
              </span>
            )}
          </div>

          {/* SVG Responsive Line & Area Chart */}
          <div className="relative w-full h-44 sm:h-52">
            <svg viewBox="0 0 600 200" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="clientEscrowGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="clientPayoutGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Guidelines */}
              <line x1="0" y1="180" x2="600" y2="180" stroke="rgba(255,255,255,0.06)" strokeDasharray="4" />
              <line x1="0" y1="130" x2="600" y2="130" stroke="rgba(255,255,255,0.06)" strokeDasharray="4" />
              <line x1="0" y1="80" x2="600" y2="80" stroke="rgba(255,255,255,0.06)" strokeDasharray="4" />
              <line x1="0" y1="30" x2="600" y2="30" stroke="rgba(255,255,255,0.06)" strokeDasharray="4" />

              {/* Y-Axis Value Labels */}
              <text x="5" y="35" fill="#71717a" fontSize="10" fontFamily="monospace">$5,000</text>
              <text x="5" y="85" fill="#71717a" fontSize="10" fontFamily="monospace">$3,500</text>
              <text x="5" y="135" fill="#71717a" fontSize="10" fontFamily="monospace">$1,500</text>
              <text x="5" y="175" fill="#71717a" fontSize="10" fontFamily="monospace">$0</text>

              {user.role === "client" ? (
                <>
                  {/* Escrow Inflow Area (Indigo) */}
                  <path d="M 60 170 Q 150 150 240 120 T 420 60 T 570 35 L 570 180 L 60 180 Z" fill="url(#clientEscrowGrad)" />
                  <path d="M 60 170 Q 150 150 240 120 T 420 60 T 570 35" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" className="animate-chart-line" />

                  {/* Settled Payouts Area (Emerald) */}
                  <path d="M 60 180 Q 150 170 240 145 T 420 90 T 570 65 L 570 180 L 60 180 Z" fill="url(#clientPayoutGrad)" />
                  <path d="M 60 180 Q 150 170 240 145 T 420 90 T 570 65" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" className="animate-chart-line" />

                  {/* Interactive Nodes */}
                  <circle cx="60" cy="170" r="4" fill="#6366f1" className="hover:scale-150 transition-transform cursor-pointer" />
                  <circle cx="240" cy="120" r="4" fill="#6366f1" className="hover:scale-150 transition-transform cursor-pointer" />
                  <circle cx="420" cy="60" r="4" fill="#6366f1" className="hover:scale-150 transition-transform cursor-pointer" />
                  <circle cx="570" cy="35" r="5" fill="#6366f1" className="hover:scale-150 transition-transform cursor-pointer" />

                  <circle cx="240" cy="145" r="4" fill="#10b981" className="hover:scale-150 transition-transform cursor-pointer" />
                  <circle cx="420" cy="90" r="4" fill="#10b981" className="hover:scale-150 transition-transform cursor-pointer" />
                  <circle cx="570" cy="65" r="5" fill="#10b981" className="hover:scale-150 transition-transform cursor-pointer" />
                </>
              ) : (
                <>
                  {/* Contractor Completed Earnings Area (Emerald) */}
                  <path d="M 60 170 Q 150 160 240 135 T 420 85 T 510 50 L 510 180 L 60 180 Z" fill="url(#clientPayoutGrad)" />
                  <path d="M 60 170 Q 150 160 240 135 T 420 85 T 510 50" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" className="animate-chart-line" />

                  {/* Projected in-flight payout (Dashed line) */}
                  <path d="M 510 50 L 570 30" fill="none" stroke="#10b981" strokeWidth="2.5" strokeDasharray="5,5" className="animate-pulse" />

                  <circle cx="60" cy="170" r="4" fill="#10b981" />
                  <circle cx="240" cy="135" r="4" fill="#10b981" />
                  <circle cx="420" cy="85" r="4" fill="#10b981" />
                  <circle cx="510" cy="50" r="5" fill="#10b981" />
                  <circle cx="570" cy="30" r="5" fill="#10b981" stroke="#fff" strokeWidth="2" />
                </>
              )}
            </svg>
          </div>

          {/* Month X-Axis Ticks */}
          <div className="flex justify-between px-4 sm:px-6 pt-2 border-t border-border/60 text-[11px] font-mono text-muted">
            <span>Jun</span>
            <span>Jul</span>
            <span>Aug</span>
            <span>Sep</span>
            <span>Oct</span>
            <span className="text-foreground font-bold">Nov (Current)</span>
          </div>
        </div>

        {/* Right: Allocation Bar & AI Verification Quality Gauge (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {user.role === "client" ? (
            <>
              {/* Capital Allocation Segmented Progress Bar */}
              <div className="p-4 rounded-xl bg-card/60 border border-border/80 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-foreground">Capital Allocation</span>
                  <span className="font-mono text-muted">${totalCommitted.toFixed(2)} Total</span>
                </div>

                <div className="h-3 w-full bg-background rounded-full overflow-hidden flex p-0.5 border border-border">
                  <div
                    className="h-full bg-emerald-500 rounded-l-full transition-all duration-500"
                    style={{ width: `${settledPercent}%` }}
                    title={`Settled: $${totalPaidOutAmount} (${settledPercent.toFixed(1)}%)`}
                  />
                  <div
                    className="h-full bg-accent transition-all duration-500"
                    style={{ width: `${escrowPercent}%` }}
                    title={`In Escrow: $${totalEscrowAmount} (${escrowPercent.toFixed(1)}%)`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                  <div className="p-2.5 rounded-lg bg-background/60 border border-border">
                    <div className="text-emerald-500 font-semibold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" /> {settledPercent.toFixed(0)}% Settled
                    </div>
                    <div className="font-mono font-bold text-foreground mt-0.5">${totalPaidOutAmount.toFixed(2)}</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-background/60 border border-border">
                    <div className="text-accent font-semibold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-accent" /> {escrowPercent.toFixed(0)}% Escrow
                    </div>
                    <div className="font-mono font-bold text-foreground mt-0.5">${totalEscrowAmount.toFixed(2)}</div>
                  </div>
                </div>
              </div>

              {/* AI Consensus Quality Radial Gauge */}
              <div className="p-4 rounded-xl bg-card/60 border border-border/80 flex items-center gap-4">
                <div className="relative w-16 h-16 shrink-0">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15.5" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="94.3, 100" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-mono font-bold text-xs text-foreground">
                    94%
                  </div>
                </div>

                <div>
                  <div className="text-xs font-bold text-foreground">Consensus Pass Rate</div>
                  <p className="text-[11px] text-muted mt-0.5 leading-relaxed">
                    Submissions verified across scope, unit tests, and quality standards.
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-mono text-emerald-500 font-medium">
                    0 Active Disputes
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Payout Speed Metric */}
              <div className="p-4 rounded-xl bg-card/60 border border-border/80 space-y-2">
                <div className="text-xs font-bold text-foreground flex items-center justify-between">
                  <span>Settlement Speed</span>
                  <span className="text-[10.5px] text-emerald-500 font-mono">0 Day Delay</span>
                </div>
                <div className="text-2xl font-bold font-mono text-emerald-500">Instant</div>
                <p className="text-[11px] text-muted leading-relaxed">
                  Funds bypass net-30 invoice delays and transfer directly to your PayPal account upon approval.
                </p>
              </div>

              {/* Quality Pass Rate */}
              <div className="p-4 rounded-xl bg-card/60 border border-border/80 flex items-center gap-4">
                <div className="relative w-16 h-16 shrink-0">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15.5" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="94, 100" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-mono font-bold text-xs text-foreground">
                    94%
                  </div>
                </div>

                <div>
                  <div className="text-xs font-bold text-foreground">Submission Quality</div>
                  <p className="text-[11px] text-muted mt-0.5 leading-relaxed">
                    All deliverables met criteria on the first check with passing test artifacts.
                  </p>
                </div>
              </div>
            </>
          )}

        </div>
      </div>

      {/* 4. ACTION SPOTLIGHT HERO (High Priority Milestone) */}
      {urgentContract && (
        <div className={`p-5 rounded-2xl border shadow-lg relative overflow-hidden transition-all ${
          user.role === "client"
            ? "bg-gradient-to-r from-accent/15 via-accent/5 to-transparent border-accent/40"
            : "bg-gradient-to-r from-emerald-500/15 via-emerald-500/5 to-transparent border-emerald-500/40"
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold uppercase tracking-wider bg-white/[0.08]">
                <span className={`w-2 h-2 rounded-full ${user.role === "client" ? "bg-accent animate-ping" : "bg-emerald-500"}`} />
                <span className={user.role === "client" ? "text-accent font-bold" : "text-emerald-500 font-bold"}>
                  {user.role === "client" ? "Action Required: 1 Deliverable Awaiting Approval" : "Payment Clearing: 48h Auto-Release Guarantee"}
                </span>
              </div>

              <h3 className="text-base font-bold text-foreground">
                {urgentContract.title}
              </h3>

              <div className="text-xs text-muted flex flex-wrap items-center gap-2">
                <span>{user.role === "client" ? `Contractor: ${urgentContract.freelancerName}` : `Client: ${urgentContract.clientName}`}</span>
                <span>•</span>
                <span className="font-mono text-foreground font-semibold">${urgentContract.amount.toFixed(2)} USD</span>
                <span>•</span>
                <span className="text-emerald-500 font-medium">AI Audit Passed (Score 94/100)</span>
                <span>•</span>
                <span className="text-amber-500">Auto-release in 48h</span>
              </div>
            </div>

            <Link
              href={`/contracts/${urgentContract.id}`}
              className={`px-5 py-2.5 rounded-lg text-white text-xs font-bold shadow-md transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto ${
                user.role === "client"
                  ? "bg-accent hover:bg-accent-hover"
                  : "bg-emerald-600 hover:bg-emerald-500"
              }`}
            >
              {user.role === "client" ? "Review Deliverable & Settle $450 →" : "View Inspection & Receipt →"}
            </Link>
          </div>
        </div>
      )}

      {/* 5. VISUAL MILESTONE PIPELINE CARDS (Replaces Flat Boring Text Table) */}
      <div className="space-y-4">
        {/* Filters and Search Bar */}
        <div data-tour="contract-filters" className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1 bg-card/60 border border-border p-0.5 rounded-lg overflow-x-auto pb-1 sm:pb-0.5">
            {[
              { label: "All Agreements", val: "ALL" },
              { label: "Ready for Review", val: "REVIEW" },
              { label: "In Escrow", val: "ESCROW" },
              { label: "Paid Out", val: "COMPLETED" },
            ].map((tab) => (
              <button
                key={tab.val}
                onClick={() => setFilter(tab.val)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  filter === tab.val
                    ? "bg-white/[0.08] text-foreground shadow-xs font-semibold"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search contracts (⌘K)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-card/60 border border-border text-xs text-foreground placeholder-muted focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        {/* Milestone Cards Stack with 4-Step Lifecycle Bar */}
        {loading ? (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="p-5 rounded-2xl bg-card/40 border border-border/80 h-32" />
            ))}
          </div>
        ) : filteredContracts.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-xl">
            <p className="text-muted text-xs">No milestone contracts found matching filter.</p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredContracts.map((contract) => {
              const isUrgent = contract.id === "cnt_9821_stripe";
              const isPaid = contract.status === "PAYOUT_COMPLETED";
              const isReviewReady = contract.status === "PENDING_REVIEW" || contract.status === "AI_VERIFIED";

              const category = getCategory(contract.title);

              return (
                <div
                  key={contract.id}
                  data-tour={contract.id === "cnt_9821_stripe" ? "demo-contract" : undefined}
                  className={`p-4 sm:p-5 rounded-2xl border card-hover-lift bg-card/60 space-y-3.5 ${
                    isUrgent ? "border-accent/40 shadow-xs" : "border-border/80"
                  }`}
                >
                  {/* Top Line: Category Badge, Status, Title, Amount & Action */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${category.color}`}>
                          {category.label}
                        </span>
                        {contract.status === "PAYOUT_COMPLETED" ? (
                          <span className="px-2 py-0.5 rounded text-[10.5px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                            Paid via PayPal
                          </span>
                        ) : isReviewReady ? (
                          <span className="px-2 py-0.5 rounded text-[10.5px] font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            Ready for Client Review
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10.5px] font-semibold bg-accent/10 text-accent border border-accent/20">
                            In Escrow (Work in Progress)
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-foreground truncate">
                        {contract.title}
                      </h3>

                      <div className="text-xs text-muted flex flex-wrap items-center gap-2">
                        {user.role === "client" ? (
                          <span>Contractor: <strong className="text-foreground">{contract.freelancerName}</strong></span>
                        ) : (
                          <span>Client: <strong className="text-foreground">{contract.clientName}</strong></span>
                        )}
                        <span>•</span>
                        <span>{contract.criteria.length} Checklist Rules</span>
                        <span>•</span>
                        <span>Due {formatDate(contract.deadline)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-2.5 md:pt-0 border-border/60">
                      <div className="text-left md:text-right">
                        <div className="text-lg font-bold text-foreground font-mono">
                          ${contract.amount.toFixed(2)}
                        </div>
                        <div className="text-[10px] text-muted font-mono uppercase">
                          {contract.currency}
                        </div>
                      </div>

                      <Link
                        href={`/contracts/${contract.id}`}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all shadow-xs cursor-pointer ${
                          user.role === "client"
                            ? isReviewReady
                              ? "bg-accent hover:bg-accent-hover text-white"
                              : "bg-white/[0.04] hover:bg-white/[0.08] border border-border text-foreground"
                            : isReviewReady
                            ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                            : "bg-white/[0.04] hover:bg-white/[0.08] border border-border text-foreground"
                        }`}
                      >
                        {user.role === "client" ? (
                          isReviewReady ? (
                            <>
                              <Sparkles className="w-3.5 h-3.5" />
                              Review & Settle
                            </>
                          ) : isPaid ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                              View Receipt
                            </>
                          ) : (
                            <>
                              Details
                              <ArrowRight className="w-3.5 h-3.5 text-muted" />
                            </>
                          )
                        ) : (
                          isReviewReady ? (
                            <>
                              <Clock className="w-3.5 h-3.5" />
                              Track Payout
                            </>
                          ) : isPaid ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                              View Earnings
                            </>
                          ) : (
                            <>
                              <Send className="w-3.5 h-3.5" />
                              Submit Work
                            </>
                          )
                        )}
                      </Link>
                    </div>
                  </div>

                  {/* 4-Stage Visual Lifecycle Stepper on each milestone card */}
                  <div className="pt-2 border-t border-border/60">
                    <div className="flex items-center justify-between text-[10.5px] font-medium mb-1.5">
                      <span className="text-emerald-500 flex items-center gap-1">
                        ✓ 1. Escrow Funded (${contract.amount.toFixed(0)})
                      </span>
                      <span className={contract.submission ? "text-emerald-500 flex items-center gap-1" : "text-accent font-semibold"}>
                        {contract.submission ? "✓ 2. Proof Submitted" : "● 2. Delivering Work"}
                      </span>
                      <span className={contract.auditReport ? "text-emerald-500 flex items-center gap-1" : "text-muted"}>
                        {contract.auditReport ? `✓ 3. AI Verified (${contract.auditReport.overallScore || 94}%)` : "○ 3. AI Audit"}
                      </span>
                      <span className={isPaid ? "text-emerald-500 font-bold" : isReviewReady ? "text-amber-500 font-bold animate-pulse" : "text-muted"}>
                        {isPaid ? "✓ 4. Paid via PayPal" : isReviewReady ? "● 4. Awaiting Approval" : "○ 4. Settlement"}
                      </span>
                    </div>

                    {/* Progress Bar Line */}
                    <div className="flex items-center gap-1 h-1.5 w-full bg-background rounded-full overflow-hidden border border-border/40">
                      <div className="h-full bg-emerald-500 w-1/4" />
                      <div className={`h-full ${contract.submission ? "bg-emerald-500" : "bg-accent"} w-1/4`} />
                      <div className={`h-full ${contract.auditReport ? "bg-emerald-500" : "bg-border/60"} w-1/4`} />
                      <div className={`h-full ${isPaid ? "bg-emerald-500" : isReviewReady ? "bg-amber-500 animate-pulse" : "bg-border/60"} w-1/4`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}

// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  Filter,
  Search,
  ExternalLink,
  ChevronRight,
  Sparkles,
  ArrowRight,
  HelpCircle,
  X,
  PlayCircle,
  UserCheck,
  Building2,
  Wallet,
  Send,
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
}

interface Stats {
  totalEscrow: number;
  totalPaidOut: number;
  activeCount: number;
  disputedCount: number;
  verifiedCount: number;
  approvalRate: number;
}

export default function Dashboard() {
  const { user, loginAs, setIsSignInOpen } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [showTour, setShowTour] = useState<boolean>(true);
  const [activeTourStep, setActiveTourStep] = useState<number>(1);

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
        ? c.status === "PENDING_REVIEW"
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

  const getStatusBadge = (status: Contract["status"]) => {
    switch (status) {
      case "FUNDED_ESCROW":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
            In Escrow
          </span>
        );
      case "PENDING_REVIEW":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Ready for Tri-Agent Audit
          </span>
        );
      case "AI_VERIFIED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <CheckCircle2 className="w-3 h-3 text-cyan-400" />
            Consensus Verified
          </span>
        );
      case "PAYOUT_COMPLETED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Settled via PayPal
          </span>
        );
      case "DISPUTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertCircle className="w-3 h-3 text-rose-400" />
            Dispute Flagged
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-400">
            Draft
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
      {/* Top Header - Tailored to Role */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {user.role === "client"
                ? "Enterprise Escrow & Settlements"
                : "Contractor Earnings & Verification"}
            </h1>
            <button
              onClick={() => setIsSignInOpen(true)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-blue-400 border border-slate-700/80 flex items-center gap-1.5 cursor-pointer"
            >
              <span>{user.avatar}</span>
              <span>{user.name}</span>
              <span className="text-[10px] text-slate-500">({user.role === "client" ? "Client" : "Contractor"})</span>
            </button>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            {user.role === "client"
              ? "Fund milestone contracts, inspect deliverables, and monitor Tri-Agent consensus."
              : "Submit technical deliverables, trigger autonomous Tri-Agent audits, and collect instant payouts."}
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {!showTour && (
            <button
              onClick={() => setShowTour(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
              Show Workflow Guide
            </button>
          )}

          {user.role === "client" ? (
            <Link
              href="/contracts/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              Deposit Milestone Escrow
            </Link>
          ) : (
            <Link
              href="/contracts/cnt_9821_stripe"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              Submit PR for Verification
            </Link>
          )}
        </div>
      </div>

      {/* INTERACTIVE WORKFLOW GUIDE BANNER */}
      {showTour && (
        <div className="mb-8 p-6 rounded-3xl bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-slate-900/60 border border-blue-500/30 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <PlayCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  Autonomous Settlement Workflow
                  <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30">
                    Step {activeTourStep} of 4
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  Select each step below to inspect how capital moves through the Tri-Agent consensus swarm.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowTour(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/60 transition-colors cursor-pointer"
              title="Dismiss guide"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 4 Interactive Steps */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
            {/* Step 1 */}
            <div
              onClick={() => setActiveTourStep(1)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                activeTourStep === 1
                  ? "bg-blue-900/40 border-blue-400 shadow-md shadow-blue-500/10"
                  : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
                  Step 1
                </span>
                <span className="h-2 w-2 rounded-full bg-blue-500" />
              </div>
              <h3 className="text-xs font-bold text-white mb-1">Switch Perspective</h3>
              <p className="text-[11px] text-slate-400 leading-snug">
                Experience how the platform adapts whether you are the funding Client or receiving Contractor.
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  loginAs(user.role === "client" ? "contractor" : "client");
                }}
                className="mt-2.5 w-full py-1 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-semibold text-slate-200 border border-slate-700 flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                Switch to {user.role === "client" ? "Contractor View" : "Client View"}
              </button>
            </div>

            {/* Step 2 */}
            <div
              onClick={() => setActiveTourStep(2)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                activeTourStep === 2
                  ? "bg-blue-900/40 border-blue-400 shadow-md shadow-blue-500/10"
                  : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
                  Step 2
                </span>
                <span className="h-2 w-2 rounded-full bg-slate-600" />
              </div>
              <h3 className="text-xs font-bold text-white mb-1">Inspect Deliverable</h3>
              <p className="text-[11px] text-slate-400 leading-snug">
                Open the featured milestone below to inspect submitted code diffs, staging URLs, and test suites.
              </p>
              <Link
                href="/contracts/cnt_9821_stripe"
                className="mt-2.5 w-full py-1 px-2 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 text-[10px] font-semibold text-blue-300 border border-blue-500/30 flex items-center justify-center gap-1 transition-colors"
              >
                Open Milestone →
              </Link>
            </div>

            {/* Step 3 */}
            <div
              onClick={() => setActiveTourStep(3)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                activeTourStep === 3
                  ? "bg-blue-900/40 border-blue-400 shadow-md shadow-blue-500/10"
                  : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
                  Step 3
                </span>
                <span className="h-2 w-2 rounded-full bg-slate-600" />
              </div>
              <h3 className="text-xs font-bold text-white mb-1">Tri-Agent Swarm</h3>
              <p className="text-[11px] text-slate-400 leading-snug">
                Agent Alpha (Scope), Beta (Code), and Gamma (Risk) run parallel verification audits.
              </p>
              <div className="mt-2.5 text-[10px] text-cyan-400 font-mono flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Under 2.0s consensus
              </div>
            </div>

            {/* Step 4 */}
            <div
              onClick={() => setActiveTourStep(4)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                activeTourStep === 4
                  ? "bg-blue-900/40 border-blue-400 shadow-md shadow-blue-500/10"
                  : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
                  Step 4
                </span>
                <span className="h-2 w-2 rounded-full bg-slate-600" />
              </div>
              <h3 className="text-xs font-bold text-white mb-1">Direct Settlement</h3>
              <p className="text-[11px] text-slate-400 leading-snug">
                Upon unanimous consensus, PayPal Payouts releases the milestone directly to the contractor.
              </p>
              <div className="mt-2.5 text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Zero hold latency
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
            <div className="text-xs text-slate-300 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                &ldquo;Next.js 16 Webhook Integration&rdquo; is pre-seeded with submitted deliverables ready for Tri-Agent audit.
              </span>
            </div>

            <Link
              href="/contracts/cnt_9821_stripe"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all cursor-pointer whitespace-nowrap"
            >
              Launch Live War Room
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Role-Specific Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {user.role === "client" ? (
          <>
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                <span>Total Escrow In Flight</span>
                <DollarSign className="w-4 h-4 text-blue-400" />
              </div>
              <div className="mt-2 text-2xl font-bold text-white">
                ${stats?.totalEscrow.toFixed(2) || "0.00"}
              </div>
              <div className="mt-1 text-xs text-blue-400/80">
                Secured in PayPal Escrow
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                <span>Settled to Contractors</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="mt-2 text-2xl font-bold text-emerald-400">
                ${stats?.totalPaidOut.toFixed(2) || "0.00"}
              </div>
              <div className="mt-1 text-xs text-emerald-400/80">
                Disbursed upon verified delivery
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                <span>Tri-Agent Consensus Rate</span>
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="mt-2 text-2xl font-bold text-cyan-400">
                {stats?.approvalRate || 100}%
              </div>
              <div className="mt-1 text-xs text-slate-400">
                Multi-agent validation score
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                <span>Disputes Pre-Resolved</span>
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="mt-2 text-2xl font-bold text-indigo-400">
                {stats?.disputedCount || 0} Flagged
              </div>
              <div className="mt-1 text-xs text-slate-400">
                Objective criteria mediation
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                <span>Pending Verification</span>
                <Wallet className="w-4 h-4 text-amber-400" />
              </div>
              <div className="mt-2 text-2xl font-bold text-white">
                $450.00
              </div>
              <div className="mt-1 text-xs text-amber-400/80">
                Awaiting Tri-Agent consensus
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                <span>Total Earnings Settled</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="mt-2 text-2xl font-bold text-emerald-400">
                $14,850.00
              </div>
              <div className="mt-1 text-xs text-emerald-400/80">
                Direct deposits into PayPal
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                <span>Connected PayPal Payout</span>
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="mt-2 text-sm font-bold text-white font-mono truncate">
                alex.rivera@devmail.com
              </div>
              <div className="mt-1 text-xs text-emerald-400">
                Instant Settlement Enabled
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                <span>Average Payout Speed</span>
                <Sparkles className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="mt-2 text-2xl font-bold text-indigo-400">
                1.84s
              </div>
              <div className="mt-1 text-xs text-slate-400">
                Zero client review delay
              </div>
            </div>
          </>
        )}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
          {[
            { label: "All Milestones", val: "ALL" },
            { label: "Ready for Audit", val: "REVIEW" },
            { label: "In Escrow", val: "ESCROW" },
            { label: "Settled", val: "COMPLETED" },
            { label: "Disputed", val: "DISPUTED" },
          ].map((tab) => (
            <button
              key={tab.val}
              onClick={() => setFilter(tab.val)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                filter === tab.val
                  ? "bg-slate-800 text-white shadow-sm border border-slate-700"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search contracts or parties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Contracts List */}
      {loading ? (
        <div className="text-center py-20 text-slate-500 text-sm">
          Loading encrypted contracts...
        </div>
      ) : filteredContracts.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-slate-800 rounded-2xl">
          <p className="text-slate-400 text-sm">No contracts match this filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredContracts.map((contract) => (
            <div
              key={contract.id}
              className={`group p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                contract.id === "cnt_9821_stripe"
                  ? "bg-slate-900/80 border-blue-500/40 shadow-lg shadow-blue-500/5 hover:border-blue-500/70"
                  : "bg-slate-900/40 border-slate-800/80 hover:border-slate-700/80 hover:bg-slate-900/60"
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1.5">
                  <span className="font-mono text-xs text-slate-500">
                    {contract.id}
                  </span>
                  {getStatusBadge(contract.status)}
                  {contract.id === "cnt_9821_stripe" && (
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      ★ Active Demonstration
                    </span>
                  )}
                </div>

                <h3 className="text-base font-semibold text-white group-hover:text-blue-400 transition-colors truncate">
                  {contract.title}
                </h3>

                <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                  {contract.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <span className="text-slate-500">Client:</span> {contract.clientName}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="flex items-center gap-1">
                    <span className="text-slate-500">Contractor:</span> {contract.freelancerName}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="flex items-center gap-1">
                    <span className="text-slate-500">Criteria:</span>{" "}
                    {contract.criteria.length} items
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-slate-800/60">
                <div className="text-left md:text-right">
                  <div className="text-lg font-bold text-white">
                    ${contract.amount.toFixed(2)}
                  </div>
                  <div className="text-[11px] text-slate-500 uppercase tracking-wider">
                    {contract.currency} Escrow
                  </div>
                </div>

                <Link
                  href={`/contracts/${contract.id}`}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-white text-xs font-semibold transition-all shadow-sm cursor-pointer ${
                    contract.status === "PENDING_REVIEW"
                      ? "bg-blue-600 hover:bg-blue-500 shadow-blue-500/25"
                      : "bg-slate-800 hover:bg-slate-700"
                  }`}
                >
                  {contract.status === "PENDING_REVIEW" ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                      {user.role === "client" ? "Inspect Delivery & Audit" : "Trigger Tri-Agent Payout"}
                    </>
                  ) : contract.status === "PAYOUT_COMPLETED" ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      View Settlement
                    </>
                  ) : (
                    <>
                      Open Arbitration Room
                      <ChevronRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

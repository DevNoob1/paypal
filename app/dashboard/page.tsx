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
} from "lucide-react";

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
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [role, setRole] = useState<string>("client");

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
    const currentRole = localStorage.getItem("resolvai_role") || "client";
    setRole(currentRole);

    const handleRoleChange = () => {
      setRole(localStorage.getItem("resolvai_role") || "client");
    };
    window.addEventListener("role_changed", handleRoleChange);
    return () => window.removeEventListener("role_changed", handleRoleChange);
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
            Needs AI Audit
          </span>
        );
      case "AI_VERIFIED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <CheckCircle2 className="w-3 h-3 text-cyan-400" />
            AI Verified
          </span>
        );
      case "PAYOUT_COMPLETED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Paid Out
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
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Escrow & Milestones
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono uppercase bg-slate-800 text-slate-400 border border-slate-700">
              Viewing as: {role}
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Manage contract milestones, inspect AI audit results, and trigger PayPal releases.
          </p>
        </div>

        <Link
          href="/contracts/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/25 transition-all self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          Create Milestone Escrow
        </Link>
      </div>

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Escrow In Flight</span>
            <DollarSign className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white">
            ${stats?.totalEscrow.toFixed(2) || "0.00"}
          </div>
          <div className="mt-1 text-xs text-blue-400/80 flex items-center gap-1">
            <span>Locked in PayPal Sandbox</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Released to Contractors</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-400">
            ${stats?.totalPaidOut.toFixed(2) || "0.00"}
          </div>
          <div className="mt-1 text-xs text-emerald-400/80">
            Completed via PayPal Payouts
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>AI Auto-Approval Rate</span>
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-cyan-400">
            {stats?.approvalRate || 100}%
          </div>
          <div className="mt-1 text-xs text-slate-400">
            Multimodal Gemini verification
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Disputes Prevented</span>
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-indigo-400">
            {stats?.disputedCount || 0} Flagged
          </div>
          <div className="mt-1 text-xs text-slate-400">
            Objective criteria mediation
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
          {[
            { label: "All Milestones", val: "ALL" },
            { label: "Needs Audit", val: "REVIEW" },
            { label: "In Escrow", val: "ESCROW" },
            { label: "Paid Out", val: "COMPLETED" },
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

        {/* Search Input */}
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

      {/* Contracts List / Table */}
      {loading ? (
        <div className="text-center py-20 text-slate-500 text-sm">
          Loading contracts from PayPal Sandbox and store...
        </div>
      ) : filteredContracts.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-slate-800 rounded-2xl">
          <p className="text-slate-400 text-sm">No contracts match this filter.</p>
          <Link
            href="/contracts/new"
            className="mt-3 inline-flex items-center gap-1.5 text-xs text-blue-400 hover:underline"
          >
            Create your first milestone escrow →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredContracts.map((contract) => (
            <div
              key={contract.id}
              className="group p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700/80 hover:bg-slate-900/60 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Left Column: Title & Parties */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1.5">
                  <span className="font-mono text-xs text-slate-500">
                    {contract.id}
                  </span>
                  {getStatusBadge(contract.status)}
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

              {/* Right Column: Amount & Action */}
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
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-blue-600 text-white text-xs font-semibold transition-all shadow-sm group-hover:shadow-blue-500/10 cursor-pointer"
                >
                  {contract.status === "PENDING_REVIEW" ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:text-white" />
                      Review Deliverable
                    </>
                  ) : contract.status === "PAYOUT_COMPLETED" ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 group-hover:text-white" />
                      View Receipt
                    </>
                  ) : (
                    <>
                      Open Arbitration
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

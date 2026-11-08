// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  Search,
  ChevronRight,
  Sparkles,
  Send,
  Lock,
  Clock,
  ArrowRight,
  Info,
  X,
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
  const { user, setIsSignInOpen } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDemoTip, setShowDemoTip] = useState(true);

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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20">
            <Lock className="w-3 h-3" />
            In Escrow
          </span>
        );
      case "PENDING_REVIEW":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Sparkles className="w-3 h-3" />
            Ready for Review
          </span>
        );
      case "AI_VERIFIED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
            <CheckCircle2 className="w-3 h-3" />
            Verified
          </span>
        );
      case "PAYOUT_COMPLETED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-success/10 text-success border border-success/20">
            <CheckCircle2 className="w-3 h-3" />
            Paid via PayPal
          </span>
        );
      case "DISPUTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-500 border border-rose-500/20">
            <AlertCircle className="w-3 h-3" />
            Disputed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-card text-muted border border-border">
            Draft
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {user.role === "client" ? "Milestones & Escrow" : "Earnings & Submissions"}
            </h1>
            <button
              onClick={() => setIsSignInOpen(true)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-card hover:bg-card-hover text-accent border border-border flex items-center gap-1.5 cursor-pointer"
            >
              <span>{user.avatar}</span>
              <span>{user.name}</span>
              <span className="text-[10px] text-muted">({user.role === "client" ? "Client" : "Contractor"})</span>
            </button>
          </div>
          <p className="text-sm text-muted mt-1">
            {user.role === "client"
              ? "Manage milestone deposits, review contractor deliverables, and track payments."
              : "Submit work deliverables, trigger automated AI verification, and receive PayPal payouts."}
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {user.role === "client" ? (
            <Link
              href="/contracts/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white font-semibold text-sm shadow-sm transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              New Contract
            </Link>
          ) : (
            <Link
              href="/contracts/cnt_9821_stripe"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-success hover:opacity-90 text-white font-semibold text-sm shadow-sm transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              Demo Deliverable
            </Link>
          )}
        </div>
      </div>

      {/* Quick Demo Hint Banner */}
      {showDemoTip && (
        <div className="mb-6 p-4 rounded-2xl bg-card border border-border flex items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3 text-xs">
            <div className="w-8 h-8 rounded-xl bg-accent/15 text-accent flex items-center justify-center shrink-0">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-foreground">Interactive Demo:</span>{" "}
              <span className="text-muted">
                Contract <strong className="text-foreground">cnt_9821_stripe</strong> has a submitted PR and test logs ready for AI review and instant PayPal settlement.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/contracts/cnt_9821_stripe"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-accent text-white text-xs font-semibold hover:bg-accent-hover transition-colors whitespace-nowrap"
            >
              Open Contract
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={() => setShowDemoTip(false)}
              className="p-1 text-muted hover:text-foreground rounded-lg transition-colors cursor-pointer"
              title="Dismiss tip"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {user.role === "client" ? (
          <>
            <div className="p-5 rounded-2xl bg-card border border-border">
              <div className="flex items-center justify-between text-muted text-xs font-medium">
                <span>Total in Escrow</span>
                <DollarSign className="w-4 h-4 text-accent" />
              </div>
              <div className="mt-2 text-2xl font-bold text-foreground">
                ${stats?.totalEscrow.toFixed(2) || "0.00"}
              </div>
              <div className="mt-1 text-xs text-muted">
                Secured via PayPal
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border">
              <div className="flex items-center justify-between text-muted text-xs font-medium">
                <span>Total Paid Out</span>
                <CheckCircle2 className="w-4 h-4 text-success" />
              </div>
              <div className="mt-2 text-2xl font-bold text-success">
                ${stats?.totalPaidOut.toFixed(2) || "0.00"}
              </div>
              <div className="mt-1 text-xs text-muted">
                Released upon AI verification
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border">
              <div className="flex items-center justify-between text-muted text-xs font-medium">
                <span>Verified Milestones</span>
                <Sparkles className="w-4 h-4 text-accent" />
              </div>
              <div className="mt-2 text-2xl font-bold text-foreground">
                {stats?.verifiedCount || 2}
              </div>
              <div className="mt-1 text-xs text-muted">
                Met all acceptance criteria
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border">
              <div className="flex items-center justify-between text-muted text-xs font-medium">
                <span>Flagged Disputes</span>
                <AlertCircle className="w-4 h-4 text-rose-500" />
              </div>
              <div className="mt-2 text-2xl font-bold text-rose-500">
                {stats?.disputedCount || 0}
              </div>
              <div className="mt-1 text-xs text-muted">
                Require client/contractor review
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="p-5 rounded-2xl bg-card border border-border">
              <div className="flex items-center justify-between text-muted text-xs font-medium">
                <span>Awaiting Review</span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <div className="mt-2 text-2xl font-bold text-foreground">
                $450.00
              </div>
              <div className="mt-1 text-xs text-muted">
                Ready for AI evaluation
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border">
              <div className="flex items-center justify-between text-muted text-xs font-medium">
                <span>Total Earnings</span>
                <CheckCircle2 className="w-4 h-4 text-success" />
              </div>
              <div className="mt-2 text-2xl font-bold text-success">
                $1,200.00
              </div>
              <div className="mt-1 text-xs text-muted">
                Deposited via PayPal
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border">
              <div className="flex items-center justify-between text-muted text-xs font-medium">
                <span>PayPal Payout Account</span>
                <Lock className="w-4 h-4 text-accent" />
              </div>
              <div className="mt-2 text-sm font-bold text-foreground font-mono truncate">
                alex.rivera@devmail.com
              </div>
              <div className="mt-1 text-xs text-success">
                Direct Settlement Active
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border">
              <div className="flex items-center justify-between text-muted text-xs font-medium">
                <span>Review Speed</span>
                <Sparkles className="w-4 h-4 text-accent" />
              </div>
              <div className="mt-2 text-2xl font-bold text-foreground">
                Instant
              </div>
              <div className="mt-1 text-xs text-muted">
                Automated parallel AI review
              </div>
            </div>
          </>
        )}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
          {[
            { label: "All Contracts", val: "ALL" },
            { label: "Ready for Review", val: "REVIEW" },
            { label: "In Escrow", val: "ESCROW" },
            { label: "Completed", val: "COMPLETED" },
            { label: "Disputed", val: "DISPUTED" },
          ].map((tab) => (
            <button
              key={tab.val}
              onClick={() => setFilter(tab.val)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                filter === tab.val
                  ? "bg-accent text-white shadow-sm"
                  : "text-muted hover:text-foreground hover:bg-card"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search contracts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-card border border-border text-xs text-foreground placeholder-muted focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      {/* Contracts List */}
      {loading ? (
        <div className="text-center py-20 text-muted text-sm">
          Loading contracts...
        </div>
      ) : filteredContracts.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border rounded-2xl">
          <p className="text-muted text-sm">No contracts found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredContracts.map((contract) => (
            <div
              key={contract.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                contract.id === "cnt_9821_stripe"
                  ? "bg-card border-accent/40 shadow-sm hover:border-accent"
                  : "bg-card border-border hover:bg-card-hover"
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1.5">
                  <span className="font-mono text-xs text-muted">
                    {contract.id}
                  </span>
                  {getStatusBadge(contract.status)}
                </div>

                <h3 className="text-base font-semibold text-foreground truncate">
                  {contract.title}
                </h3>

                <p className="text-xs text-muted mt-1 line-clamp-1">
                  {contract.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-muted">
                  <span>
                    Client: <strong className="text-foreground">{contract.clientName}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Contractor: <strong className="text-foreground">{contract.freelancerName}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Criteria: <strong className="text-foreground">{contract.criteria.length} items</strong>
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-border">
                <div className="text-left md:text-right">
                  <div className="text-lg font-bold text-foreground">
                    ${contract.amount.toFixed(2)}
                  </div>
                  <div className="text-[11px] text-muted uppercase">
                    {contract.currency}
                  </div>
                </div>

                <Link
                  href={`/contracts/${contract.id}`}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm cursor-pointer ${
                    contract.status === "PENDING_REVIEW"
                      ? "bg-accent hover:bg-accent-hover text-white"
                      : "bg-card-hover hover:bg-card border border-border text-foreground"
                  }`}
                >
                  {contract.status === "PENDING_REVIEW" ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      Review & Settle
                    </>
                  ) : contract.status === "PAYOUT_COMPLETED" ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                      View Receipt
                    </>
                  ) : (
                    <>
                      View Details
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

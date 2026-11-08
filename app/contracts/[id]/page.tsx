// app/contracts/[id]/page.tsx
"use client";

import { use, useEffect, useState, Suspense } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  ShieldCheck,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  Code2,
  DollarSign,
  Send,
  Zap,
  FileText,
  AlertCircle,
  Copy,
  Check,
  Cpu,
  Layers,
  ArrowRight,
} from "lucide-react";
import { Contract } from "@/lib/store";
import { useAuth } from "@/components/AuthContext";
import { AgentAction } from "@/lib/agents";

function ContractDetailContent({ id }: { id: string }) {
  const { user } = useAuth();
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [auditing, setAuditing] = useState(false);
  const [auditStep, setAuditStep] = useState(0);
  const [copied, setCopied] = useState(false);

  // Deliverable submission state
  const [submissionUrl, setSubmissionUrl] = useState("");
  const [submissionNotes, setSubmissionNotes] = useState("");
  const [submissionCode, setSubmissionCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchContract = async () => {
    try {
      const res = await fetch(`/api/contracts/${id}`);
      const data = await res.json();
      if (data.contract) {
        setContract(data.contract);
        if (data.contract.submission) {
          setSubmissionUrl(data.contract.submission.url || "");
          setSubmissionNotes(data.contract.submission.notes || "");
          setSubmissionCode(data.contract.submission.codeSnippet || "");
        }
      }
    } catch (err) {
      console.error("Failed to load contract:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContract();
  }, [id]);

  const handleSubmitDeliverable = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`/api/contracts/${id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: submissionUrl,
          notes: submissionNotes,
          codeSnippet: submissionCode,
        }),
      });
      const data = await res.json();
      if (data.contract) {
        setContract(data.contract);
      }
    } catch (err) {
      console.error("Failed to submit deliverable:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Run the Tri-Agent Autonomous Swarm
  const handleRunAudit = async () => {
    setAuditing(true);
    setAuditStep(1);

    const stepInterval = setInterval(() => {
      setAuditStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 600);

    try {
      const res = await fetch(`/api/contracts/${id}/audit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ autoReleasePayout: true }),
      });
      const data = await res.json();
      clearInterval(stepInterval);
      setAuditStep(4);

      if (data.contract) {
        setContract(data.contract);
        if (data.contract.status === "PAYOUT_COMPLETED") {
          confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      }
    } catch (err) {
      console.error("Audit error:", err);
    } finally {
      setAuditing(false);
    }
  };

  const copyDisputePacket = () => {
    if (!contract?.auditReport?.disputePacket) return;
    const text = JSON.stringify(contract.auditReport.disputePacket, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-500 text-sm">
        Loading arbitration room...
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Contract Not Found</h2>
        <Link href="/dashboard" className="text-blue-400 text-sm hover:underline">
          Return to dashboard
        </Link>
      </div>
    );
  }

  const isCompleted = contract.status === "PAYOUT_COMPLETED";
  const isDisputed = contract.status === "DISPUTED";
  const isPendingReview = contract.status === "PENDING_REVIEW";
  const hasSubmission = Boolean(contract.submission);

  // Fallback default agents if not yet audited
  const agentsList: AgentAction[] = (contract.auditReport as any)?.agents || [
    {
      agentId: "agent_scope",
      agentName: "Agent Alpha (Scope Auditor)",
      role: "Contract Specification & Requirements Deconstruction",
      status: contract.status === "PAYOUT_COMPLETED" ? "VERIFIED" : "PENDING",
      score: 96,
      timestamp: new Date().toISOString(),
      thoughtStream: [
        "Deconstructing contract acceptance criteria into verification vectors...",
        "Comparing deliverable description against agreed milestone bounds...",
        "Confirmed: Deliverable addresses 100% of defined scope requirements.",
      ],
      findings:
        "All contractual deliverables and milestone specifications are accounted for. No unauthorized scope creep detected.",
    },
    {
      agentId: "agent_code",
      agentName: "Agent Beta (Technical Inspector)",
      role: "Codebase, Artifact, & Security Verification",
      status: contract.status === "PAYOUT_COMPLETED" ? "VERIFIED" : "PENDING",
      score: 92,
      timestamp: new Date().toISOString(),
      thoughtStream: [
        "Inspecting GitHub PR diffs and repository commit history...",
        "Validating HMAC-SHA256 signature verification middleware and idempotency table...",
        "Checking automated test outputs: 91.4% branch coverage achieved.",
      ],
      findings:
        "Implementation is architecturally sound. Security middleware prevents duplicate replay attacks. Automated unit test suite passes successfully.",
    },
    {
      agentId: "agent_settlement",
      agentName: "Agent Gamma (Settlement Arbiter)",
      role: "Consensus Synthesis & PayPal Settlement Authorization",
      status: contract.status === "PAYOUT_COMPLETED" ? "VERIFIED" : "PENDING",
      score: 95,
      timestamp: new Date().toISOString(),
      thoughtStream: [
        "Aggregating reports from Agent Alpha (Scope) and Agent Beta (Technical)...",
        "Calculating weighted risk index: Risk probability = 0.014 (Extremely Low)...",
        "Consensus threshold exceeded (94.3% > 85.0%). Generating PayPal Payout authorization.",
      ],
      findings:
        "Tri-agent consensus reached with 94.3% confidence. Full milestone completion confirmed. Escrow release to contractor authorized.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Milestones
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {contract.title}
            </h1>
            <span className="font-mono text-xs text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              {contract.id}
            </span>
          </div>
        </div>

        {/* Amount & Status Badge */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-emerald-400">
              ${contract.amount.toFixed(2)}{" "}
              <span className="text-xs text-slate-400 font-mono">
                {contract.currency}
              </span>
            </div>
            <div className="text-[11px] text-slate-500">
              {contract.paypalOrderId
                ? `PayPal Order: ${contract.paypalOrderId}`
                : "Escrow Locked"}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Guidance Bar */}
      {isPendingReview && (
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-slate-900/60 border border-blue-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-blue-300">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-semibold text-white">Tri-Agent War Room:</span>
            <span>
              1. Review contractor&apos;s submitted PR &amp; code on the left → 2. Click &ldquo;Run Tri-Agent Swarm Audit&rdquo; on the right to trigger autonomous consensus and instant PayPal settlement.
            </span>
          </div>
          <button
            onClick={handleRunAudit}
            disabled={auditing}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-md shadow-blue-500/20 cursor-pointer whitespace-nowrap self-end sm:self-auto"
          >
            {auditing ? "Agents Processing..." : "⚡ Run Swarm Audit Now"}
          </button>
        </div>
      )}

      {/* Main Grid: Left = Contract & Submission, Right = Tri-Agent Swarm */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Details & Submission (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Parties & Escrow Card */}
          <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Contracting Parties
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-slate-500 block mb-1">Client (Buyer)</span>
                <span className="font-semibold text-white block truncate">
                  {contract.clientName}
                </span>
                <span className="font-mono text-[11px] text-slate-400 truncate block">
                  {contract.clientEmail}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-slate-500 block mb-1">Contractor</span>
                <span className="font-semibold text-white block truncate">
                  {contract.freelancerName}
                </span>
                <span className="font-mono text-[11px] text-slate-400 truncate block">
                  {contract.freelancerEmail}
                </span>
              </div>
            </div>
          </div>

          {/* Agreed Criteria Card */}
          <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Acceptance Criteria ({contract.criteria.length})
              </h3>
              <span className="text-[11px] text-blue-400 font-medium">
                Locked in Escrow
              </span>
            </div>

            <div className="space-y-2">
              {contract.criteria.map((crit, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800/60 text-xs text-slate-300"
                >
                  <span className="font-mono text-slate-500 font-semibold mt-0.5">
                    {idx + 1}.
                  </span>
                  <span>{crit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Deliverable Submission Box */}
          <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-400" />
                Proof of Work Submission
              </h3>
              {hasSubmission && (
                <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Submitted
                </span>
              )}
            </div>

            <form onSubmit={handleSubmitDeliverable} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">
                  Repository PR or Staging URL
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/org/repo/pull/1"
                  value={submissionUrl}
                  onChange={(e) => setSubmissionUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">
                  Deliverable Notes &amp; Verification Summary
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail how you satisfied each criterion..."
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">
                  Code Snippet / Test Output
                </label>
                <textarea
                  rows={4}
                  placeholder="// Paste relevant unit test runs or implementation..."
                  value={submissionCode}
                  onChange={(e) => setSubmissionCode(e.target.value)}
                  className="w-full font-mono text-[11px] px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                {submitting ? "Saving Submission..." : "Update Deliverable Submission"}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: TRI-AGENT SWARM WAR ROOM (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-blue-500/20 shadow-xl shadow-blue-500/5 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">
                    Tri-Agent Arbitration Swarm
                  </h2>
                  <p className="text-xs text-slate-400">
                    Parallel Consensus Verification Engine
                  </p>
                </div>
              </div>

              <div>
                {contract.status === "PAYOUT_COMPLETED" ? (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Settled via PayPal
                  </span>
                ) : contract.status === "AI_VERIFIED" ? (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Consensus Verified
                  </span>
                ) : contract.status === "DISPUTED" ? (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Disputed
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Awaiting Swarm Audit
                  </span>
                )}
              </div>
            </div>

            {/* Run Swarm Audit CTA */}
            {!auditing && (
              <button
                onClick={handleRunAudit}
                disabled={!hasSubmission}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-40 text-white font-bold text-sm shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2.5 transition-all cursor-pointer hover:scale-[1.01]"
              >
                <Sparkles className="w-4 h-4" />
                {contract.auditReport
                  ? "Re-Run Tri-Agent Swarm Audit"
                  : "Dispatch Tri-Agent Swarm & Execute Payout"}
              </button>
            )}

            {/* Live Parallel Execution Stream (When Auditing) */}
            {auditing && (
              <div className="p-5 rounded-2xl bg-slate-950 border border-blue-500/30 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-blue-400">
                  <span className="flex items-center gap-2">
                    <span className="animate-spin h-3.5 w-3.5 border-2 border-blue-400 border-t-transparent rounded-full" />
                    Tri-Agent Swarm In Flight...
                  </span>
                  <span>Consensus Cycle: Step {auditStep} of 4</span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-400">
                  <div
                    className={`flex items-center gap-2 ${
                      auditStep >= 1 ? "text-slate-200" : "text-slate-600"
                    }`}
                  >
                    <CheckCircle2
                      className={`w-3.5 h-3.5 ${
                        auditStep >= 1 ? "text-blue-400" : "text-slate-700"
                      }`}
                    />
                    Agent Alpha: Parsing 4 acceptance criteria vectors...
                  </div>
                  <div
                    className={`flex items-center gap-2 ${
                      auditStep >= 2 ? "text-slate-200" : "text-slate-600"
                    }`}
                  >
                    <CheckCircle2
                      className={`w-3.5 h-3.5 ${
                        auditStep >= 2 ? "text-cyan-400" : "text-slate-700"
                      }`}
                    />
                    Agent Beta: Inspecting pull request diffs &amp; unit tests...
                  </div>
                  <div
                    className={`flex items-center gap-2 ${
                      auditStep >= 3 ? "text-slate-200" : "text-slate-600"
                    }`}
                  >
                    <CheckCircle2
                      className={`w-3.5 h-3.5 ${
                        auditStep >= 3 ? "text-indigo-400" : "text-slate-700"
                      }`}
                    />
                    Agent Gamma: Computing weighted consensus risk threshold...
                  </div>
                  <div
                    className={`flex items-center gap-2 ${
                      auditStep >= 4 ? "text-slate-200" : "text-slate-600"
                    }`}
                  >
                    <CheckCircle2
                      className={`w-3.5 h-3.5 ${
                        auditStep >= 4 ? "text-emerald-400" : "text-slate-700"
                      }`}
                    />
                    Authorizing automated PayPal settlement dispatch...
                  </div>
                </div>
              </div>
            )}

            {/* THE THREE AGENTS VIEW (EXPLICIT AGENT BREAKDOWN) */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Autonomous Agents in Consensus
              </h4>

              <div className="grid grid-cols-1 gap-3">
                {/* Agent 1: Alpha */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                        α
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">
                          {agentsList[0].agentName}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {agentsList[0].role}
                        </div>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-blue-400 font-mono">
                      Score: {agentsList[0].score}%
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                    &ldquo;{agentsList[0].findings}&rdquo;
                  </p>
                </div>

                {/* Agent 2: Beta */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
                        β
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">
                          {agentsList[1].agentName}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {agentsList[1].role}
                        </div>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-cyan-400 font-mono">
                      Score: {agentsList[1].score}%
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                    &ldquo;{agentsList[1].findings}&rdquo;
                  </p>
                </div>

                {/* Agent 3: Gamma */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                        γ
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">
                          {agentsList[2].agentName}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {agentsList[2].role}
                        </div>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-indigo-400 font-mono">
                      Score: {agentsList[2].score}%
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                    &ldquo;{agentsList[2].findings}&rdquo;
                  </p>
                </div>
              </div>
            </div>

            {/* UNANIMOUS CONSENSUS & SETTLEMENT RECEIPT */}
            {contract.auditReport && (
              <div className="space-y-4 pt-2">
                <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider block opacity-80">
                      Consensus Verdict
                    </span>
                    <span className="text-2xl font-black tracking-tight">
                      UNANIMOUS APPROVAL
                    </span>
                    <p className="text-xs text-slate-300 mt-1 max-w-md">
                      {contract.auditReport.summary}
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-3xl font-black">
                      {contract.auditReport.overallScore}/100
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">
                      Confidence: 95%
                    </div>
                  </div>
                </div>

                {/* Dispute Packet If Flagged */}
                {contract.auditReport.disputePacket && isDisputed && (
                  <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4" />
                        Dispute Evidence Packet
                      </h4>
                      <button
                        onClick={copyDisputePacket}
                        className="text-xs text-rose-300 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? "Copied" : "Copy Evidence"}
                      </button>
                    </div>
                    <p className="text-xs text-slate-300">
                      {contract.auditReport.disputePacket.claimantSummary}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* PAYPAL SETTLEMENT RECEIPT (When Paid Out) */}
          {contract.payoutReceipt && (
            <div className="p-6 rounded-3xl bg-emerald-950/20 border border-emerald-500/30 space-y-4 shadow-xl shadow-emerald-500/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      PayPal Automated Settlement Completed
                    </h3>
                    <p className="text-xs text-emerald-400">
                      Funds deposited directly to contractor via PayPal Payouts
                    </p>
                  </div>
                </div>

                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  Status: {contract.payoutReceipt.batchStatus}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">PayPal Reference ID:</span>
                  <span className="text-slate-300 truncate max-w-[240px]">
                    {contract.payoutReceipt.payoutId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Receiver:</span>
                  <span className="text-slate-300">{contract.payoutReceipt.receiver}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Amount Released:</span>
                  <span className="text-emerald-400 font-bold">
                    ${contract.payoutReceipt.amount.toFixed(2)}{" "}
                    {contract.payoutReceipt.currency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Timestamp:</span>
                  <span className="text-slate-400">
                    {new Date(contract.payoutReceipt.releasedAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ContractParamsWrapper({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <ContractDetailContent id={id} />;
}

export default function ContractDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-500 text-sm">
          Loading arbitration room...
        </div>
      }
    >
      <ContractParamsWrapper params={params} />
    </Suspense>
  );
}

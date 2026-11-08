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
} from "lucide-react";
import { Contract, DeliverableSubmission, PayoutReceipt } from "@/lib/store";
import { AuditReport } from "@/lib/gemini";

function ContractDetailContent({ id }: { id: string }) {

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

  // Handle deliverable submission
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

  // Run the AI Audit & Auto-payout
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
          // Trigger victory celebration
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

  // Manual Payout Trigger if needed
  const handleManualPayout = async () => {
    try {
      const res = await fetch(`/api/contracts/${id}/payout`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.contract) {
        setContract(data.contract);
        confetti({
          particleCount: 100,
          spread: 60,
          origin: { y: 0.6 },
        });
      }
    } catch (err) {
      console.error("Manual payout error:", err);
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

      {/* Main Grid: Left = Contract & Submission, Right = AI Arbiter */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Details & Submission (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Parties & Escrow Card */}
          <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Parties in Agreement
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
                  Deliverable Notes & Verification Summary
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
                  Code Snippet / Test Output (Optional)
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

        {/* RIGHT COLUMN: AI Arbiter & PayPal Settlement (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* THE AI AUDIT CONTROL PANEL */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-blue-500/20 shadow-xl shadow-blue-500/5 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">
                    ResolvAI Autonomous Arbiter
                  </h2>
                  <p className="text-xs text-slate-400">
                    Multimodal Gemini 1.5 Flash + PayPal Payouts Automation
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div>
                {contract.status === "PAYOUT_COMPLETED" ? (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Payout Released
                  </span>
                ) : contract.status === "AI_VERIFIED" ? (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    AI Verified
                  </span>
                ) : contract.status === "DISPUTED" ? (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Disputed
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Awaiting Audit
                  </span>
                )}
              </div>
            </div>

            {/* Run Audit Trigger CTA */}
            {!auditing && (
              <button
                onClick={handleRunAudit}
                disabled={!hasSubmission}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-40 text-white font-bold text-sm shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2.5 transition-all cursor-pointer hover:scale-[1.01]"
              >
                <Sparkles className="w-4 h-4" />
                {contract.auditReport
                  ? "Re-Run Autonomous AI Audit"
                  : "Run Autonomous AI Audit & Auto-Release Payout"}
              </button>
            )}

            {/* Animated Audit Steps */}
            {auditing && (
              <div className="p-5 rounded-2xl bg-slate-950 border border-blue-500/30 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-blue-400">
                  <span className="flex items-center gap-2">
                    <span className="animate-spin h-3.5 w-3.5 border-2 border-blue-400 border-t-transparent rounded-full" />
                    Evaluating Milestone Artifacts...
                  </span>
                  <span>Step {auditStep} of 4</span>
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
                    1. Ingesting acceptance criteria & contract constraints
                  </div>
                  <div
                    className={`flex items-center gap-2 ${
                      auditStep >= 2 ? "text-slate-200" : "text-slate-600"
                    }`}
                  >
                    <CheckCircle2
                      className={`w-3.5 h-3.5 ${
                        auditStep >= 2 ? "text-blue-400" : "text-slate-700"
                      }`}
                    />
                    2. Inspecting submitted PR diffs & test suite logs
                  </div>
                  <div
                    className={`flex items-center gap-2 ${
                      auditStep >= 3 ? "text-slate-200" : "text-slate-600"
                    }`}
                  >
                    <CheckCircle2
                      className={`w-3.5 h-3.5 ${
                        auditStep >= 3 ? "text-blue-400" : "text-slate-700"
                      }`}
                    />
                    3. Gemini 1.5 Flash mathematical criteria verification
                  </div>
                  <div
                    className={`flex items-center gap-2 ${
                      auditStep >= 4 ? "text-slate-200" : "text-slate-600"
                    }`}
                  >
                    <CheckCircle2
                      className={`w-3.5 h-3.5 ${
                        auditStep >= 4 ? "text-blue-400" : "text-slate-700"
                      }`}
                    />
                    4. Dispatching PayPal Payouts settlement payload
                  </div>
                </div>
              </div>
            )}

            {/* AUDIT REPORT RESULTS */}
            {contract.auditReport && (
              <div className="space-y-5 pt-2">
                {/* Score & Verdict Banner */}
                <div
                  className={`p-5 rounded-2xl border flex items-center justify-between ${
                    contract.auditReport.verdict === "APPROVE"
                      ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-400"
                      : contract.auditReport.verdict === "REVISE"
                      ? "bg-amber-950/20 border-amber-500/30 text-amber-400"
                      : "bg-rose-950/20 border-rose-500/30 text-rose-400"
                  }`}
                >
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider block opacity-80">
                      Audit Verdict
                    </span>
                    <span className="text-2xl font-black tracking-tight">
                      {contract.auditReport.verdict === "APPROVE"
                        ? "APPROVED FOR RELEASE"
                        : contract.auditReport.verdict === "REVISE"
                        ? "REVISION REQUIRED"
                        : "DISPUTED & FROZEN"}
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
                      Confidence: {(contract.auditReport.confidence * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>

                {/* Criterion-by-criterion Breakdown */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Detailed Criteria Breakdown
                  </h4>
                  {contract.auditReport.criteriaResults.map((result, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">
                          {result.criterion}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            result.status === "PASS"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : result.status === "PARTIAL"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          }`}
                        >
                          {result.status} ({result.score}%)
                        </span>
                      </div>
                      <p className="text-slate-400 text-[11px] leading-relaxed">
                        {result.notes}
                      </p>
                    </div>
                  ))}
                </div>

                {/* DISPUTE EVIDENCE PACKET (If Disputed) */}
                {contract.auditReport.disputePacket && isDisputed && (
                  <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4" />
                        PayPal Dispute Evidence Packet
                      </h4>
                      <button
                        onClick={copyDisputePacket}
                        className="text-xs text-rose-300 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? "Copied" : "Copy for PayPal API"}
                      </button>
                    </div>
                    <p className="text-xs text-slate-300">
                      {contract.auditReport.disputePacket.claimantSummary}
                    </p>
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-rose-500/20 text-[11px] font-mono text-slate-400 space-y-1">
                      <div className="font-semibold text-rose-400">
                        Resolution Recommendation:
                      </div>
                      <div>{contract.auditReport.disputePacket.recommendedResolution}</div>
                    </div>
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
                      PayPal Sandbox Payout Executed
                    </h3>
                    <p className="text-xs text-emerald-400">
                      Funds directly deposited to contractor
                    </p>
                  </div>
                </div>

                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  Status: {contract.payoutReceipt.batchStatus}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">PayPal Batch ID:</span>
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

          {/* Manual Payout Release CTA (If AI verified but payout not yet completed) */}
          {contract.status === "AI_VERIFIED" && !contract.payoutReceipt && (
            <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 flex items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-white">
                  Milestone Deliverables Verified by AI
                </h4>
                <p className="text-xs text-slate-400">
                  Ready to trigger immediate PayPal Payout.
                </p>
              </div>
              <button
                onClick={handleManualPayout}
                className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 transition-all cursor-pointer whitespace-nowrap"
              >
                Release Payout Now
              </button>
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

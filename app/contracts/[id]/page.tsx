// app/contracts/[id]/page.tsx
"use client";

import { use, useEffect, useState, Suspense } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileText,
  Send,
  Lock,
  Copy,
  Check,
  Cpu,
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

  // Run the 3 AI Agents review and trigger PayPal payout
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
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-muted text-sm">
        Loading contract details...
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-foreground mb-2">Contract Not Found</h2>
        <Link href="/dashboard" className="text-accent text-sm hover:underline">
          Return to dashboard
        </Link>
      </div>
    );
  }

  const isCompleted = contract.status === "PAYOUT_COMPLETED";
  const isDisputed = contract.status === "DISPUTED";
  const hasSubmission = Boolean(contract.submission);

  // Fallback default agents if not yet audited
  const agentsList: AgentAction[] = (contract.auditReport as any)?.agents || [
    {
      agentId: "agent_scope",
      agentName: "Agent 1: Scope Reviewer",
      role: "Acceptance Criteria & Scope Verification",
      status: contract.status === "PAYOUT_COMPLETED" ? "VERIFIED" : "PENDING",
      score: 96,
      timestamp: new Date().toISOString(),
      thoughtStream: [
        "Analyzing contract criteria against submitted deliverable...",
        "Validating PR documentation against agreed milestones...",
        "All agreed criteria covered in deliverable.",
      ],
      findings:
        "All 4 agreed acceptance criteria have been addressed. No missing deliverables detected.",
    },
    {
      agentId: "agent_code",
      agentName: "Agent 2: Code & Artifact Inspector",
      role: "Code Quality, Security & Test Coverage",
      status: contract.status === "PAYOUT_COMPLETED" ? "VERIFIED" : "PENDING",
      score: 92,
      timestamp: new Date().toISOString(),
      thoughtStream: [
        "Auditing code structure and unit test runs...",
        "Inspecting security middleware and idempotency protections...",
        "Branch coverage exceeds required threshold.",
      ],
      findings:
        "Implementation is clean. Webhook verification and idempotency protections are in place. Unit tests pass with 91.4% coverage.",
    },
    {
      agentId: "agent_settlement",
      agentName: "Agent 3: Settlement Arbiter",
      role: "Consensus Synthesis & PayPal Payout Authorization",
      status: contract.status === "PAYOUT_COMPLETED" ? "VERIFIED" : "PENDING",
      score: 95,
      timestamp: new Date().toISOString(),
      thoughtStream: [
        "Evaluating consensus from Scope and Code reviewers...",
        "Combined quality score exceeds 85% approval threshold...",
        "Dispatching payout authorization to PayPal.",
      ],
      findings:
        "Consensus reached with 94.3% overall quality score. Deliverable accepted. Escrow release to contractor authorized.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {contract.title}
            </h1>
            <span className="font-mono text-xs text-muted bg-card px-2 py-0.5 rounded border border-border">
              {contract.id}
            </span>
          </div>
        </div>

        {/* Amount & Status Badge */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-success">
              ${contract.amount.toFixed(2)}{" "}
              <span className="text-xs text-muted font-mono">
                {contract.currency}
              </span>
            </div>
            <div className="text-[11px] text-muted">
              {contract.paypalOrderId
                ? `PayPal Order: ${contract.paypalOrderId}`
                : "Escrow Locked"}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left = Contract & Deliverable, Right = AI Review & Payout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Details & Submission (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Parties Card */}
          <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">
              Parties
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-background border border-border">
                <span className="text-muted block mb-1">Client</span>
                <span className="font-semibold text-foreground block truncate">
                  {contract.clientName}
                </span>
                <span className="font-mono text-[11px] text-muted truncate block">
                  {contract.clientEmail}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-background border border-border">
                <span className="text-muted block mb-1">Contractor</span>
                <span className="font-semibold text-foreground block truncate">
                  {contract.freelancerName}
                </span>
                <span className="font-mono text-[11px] text-muted truncate block">
                  {contract.freelancerEmail}
                </span>
              </div>
            </div>
          </div>

          {/* Agreed Criteria Card */}
          <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">
                Acceptance Criteria ({contract.criteria.length})
              </h3>
              <span className="text-[11px] text-accent font-medium flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Locked in Escrow
              </span>
            </div>

            <div className="space-y-2">
              {contract.criteria.map((crit, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-background border border-border text-xs text-foreground"
                >
                  <span className="font-mono text-muted font-semibold mt-0.5">
                    {idx + 1}.
                  </span>
                  <span>{crit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Deliverable Submission Box */}
          <div className="p-5 rounded-2xl bg-card border border-border space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-muted uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-accent" />
                Deliverable Submission
              </h3>
              {hasSubmission && (
                <span className="text-[11px] text-success font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Submitted
                </span>
              )}
            </div>

            <form onSubmit={handleSubmitDeliverable} className="space-y-3 text-xs">
              <div>
                <label className="text-muted block mb-1">
                  Pull Request or Staging URL
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/org/repo/pull/1"
                  value={submissionUrl}
                  onChange={(e) => setSubmissionUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground placeholder-muted focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="text-muted block mb-1">
                  Verification Notes
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain how the criteria were satisfied..."
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground placeholder-muted focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="text-muted block mb-1">
                  Test Output / Code Snippet
                </label>
                <textarea
                  rows={4}
                  placeholder="// Paste test execution output or key code..."
                  value={submissionCode}
                  onChange={(e) => setSubmissionCode(e.target.value)}
                  className="w-full font-mono text-[11px] px-3 py-2 rounded-xl bg-background border border-border text-foreground placeholder-muted focus:outline-none focus:border-accent"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 rounded-xl bg-card-hover hover:bg-border text-foreground font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                {submitting ? "Saving Submission..." : "Update Deliverable"}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: AI REVIEW & PAYOUT (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl bg-card border border-border shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-foreground">
                    AI Deliverable Review
                  </h2>
                  <p className="text-xs text-muted">
                    Automated multi-agent verification & PayPal settlement
                  </p>
                </div>
              </div>

              <div>
                {contract.status === "PAYOUT_COMPLETED" ? (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-success/10 text-success border border-success/20 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Paid via PayPal
                  </span>
                ) : contract.status === "AI_VERIFIED" ? (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified
                  </span>
                ) : contract.status === "DISPUTED" ? (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Disputed
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Awaiting Review
                  </span>
                )}
              </div>
            </div>

            {/* Run Audit CTA */}
            {!auditing && (
              <button
                onClick={handleRunAudit}
                disabled={!hasSubmission}
                className="w-full py-3.5 rounded-xl bg-accent hover:bg-accent-hover disabled:opacity-40 text-white font-semibold text-sm shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                {contract.auditReport
                  ? "Re-Run AI Review"
                  : "Run AI Review & Release Payout"}
              </button>
            )}

            {/* In-flight Review Progress */}
            {auditing && (
              <div className="p-5 rounded-2xl bg-background border border-accent/40 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-accent">
                  <span className="flex items-center gap-2">
                    <span className="animate-spin h-3.5 w-3.5 border-2 border-accent border-t-transparent rounded-full" />
                    Running AI Evaluation...
                  </span>
                  <span>Step {auditStep} of 4</span>
                </div>

                <div className="space-y-1.5 text-xs text-muted">
                  <div className={`flex items-center gap-2 ${auditStep >= 1 ? "text-foreground" : "text-muted"}`}>
                    <CheckCircle2 className={`w-3.5 h-3.5 ${auditStep >= 1 ? "text-accent" : "text-border"}`} />
                    Scope Reviewer: Analyzing 4 acceptance criteria...
                  </div>
                  <div className={`flex items-center gap-2 ${auditStep >= 2 ? "text-foreground" : "text-muted"}`}>
                    <CheckCircle2 className={`w-3.5 h-3.5 ${auditStep >= 2 ? "text-cyan-500" : "text-border"}`} />
                    Code Inspector: Inspecting pull request diffs and tests...
                  </div>
                  <div className={`flex items-center gap-2 ${auditStep >= 3 ? "text-foreground" : "text-muted"}`}>
                    <CheckCircle2 className={`w-3.5 h-3.5 ${auditStep >= 3 ? "text-indigo-500" : "text-border"}`} />
                    Settlement Arbiter: Evaluating quality score threshold...
                  </div>
                  <div className={`flex items-center gap-2 ${auditStep >= 4 ? "text-foreground" : "text-muted"}`}>
                    <CheckCircle2 className={`w-3.5 h-3.5 ${auditStep >= 4 ? "text-success" : "text-border"}`} />
                    Executing automated PayPal payout release...
                  </div>
                </div>
              </div>
            )}

            {/* THREE AGENTS BREAKDOWN */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-muted uppercase tracking-wider">
                Independent AI Evaluations
              </h4>

              <div className="space-y-3">
                {/* Agent 1 */}
                <div className="p-4 rounded-2xl bg-background border border-border space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-foreground">
                        {agentsList[0].agentName}
                      </div>
                      <div className="text-[10px] text-muted">
                        {agentsList[0].role}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-accent font-mono">
                      {agentsList[0].score}%
                    </span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed bg-card p-3 rounded-xl border border-border">
                    {agentsList[0].findings}
                  </p>
                </div>

                {/* Agent 2 */}
                <div className="p-4 rounded-2xl bg-background border border-border space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-foreground">
                        {agentsList[1].agentName}
                      </div>
                      <div className="text-[10px] text-muted">
                        {agentsList[1].role}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 font-mono">
                      {agentsList[1].score}%
                    </span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed bg-card p-3 rounded-xl border border-border">
                    {agentsList[1].findings}
                  </p>
                </div>

                {/* Agent 3 */}
                <div className="p-4 rounded-2xl bg-background border border-border space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-foreground">
                        {agentsList[2].agentName}
                      </div>
                      <div className="text-[10px] text-muted">
                        {agentsList[2].role}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                      {agentsList[2].score}%
                    </span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed bg-card p-3 rounded-xl border border-border">
                    {agentsList[2].findings}
                  </p>
                </div>
              </div>
            </div>

            {/* Overall Verdict Banner */}
            {contract.auditReport && (
              <div className="space-y-4 pt-1">
                <div className="p-5 rounded-2xl bg-success/10 border border-success/30 text-success flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider block opacity-80">
                      Review Verdict
                    </span>
                    <span className="text-xl font-bold tracking-tight">
                      Approved by Consensus
                    </span>
                    <p className="text-xs text-muted mt-1 max-w-md">
                      {contract.auditReport.summary}
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-black">
                      {contract.auditReport.overallScore}/100
                    </div>
                    <div className="text-[10px] text-muted uppercase mt-0.5">
                      Quality Score
                    </div>
                  </div>
                </div>

                {/* Dispute section if flagged */}
                {contract.auditReport.disputePacket && isDisputed && (
                  <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-rose-500 uppercase tracking-wider flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4" />
                        Dispute Evidence
                      </h4>
                      <button
                        onClick={copyDisputePacket}
                        className="text-xs text-rose-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
                      >
                        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? "Copied" : "Copy"}
                      </button>
                    </div>
                    <p className="text-xs text-muted">
                      {contract.auditReport.disputePacket.claimantSummary}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* PAYPAL SETTLEMENT RECEIPT (When Paid Out) */}
          {contract.payoutReceipt && (
            <div className="p-6 rounded-3xl bg-success/10 border border-success/30 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-success/20 text-success flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      Payment Released via PayPal
                    </h3>
                    <p className="text-xs text-muted">
                      Funds deposited directly to the contractor&apos;s PayPal account
                    </p>
                  </div>
                </div>

                <span className="text-xs font-mono text-success bg-success/15 px-2.5 py-1 rounded-full border border-success/30">
                  Status: {contract.payoutReceipt.batchStatus}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-background border border-border text-xs font-mono space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted">Transaction ID:</span>
                  <span className="text-foreground truncate max-w-[240px]">
                    {contract.payoutReceipt.payoutId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Recipient:</span>
                  <span className="text-foreground">{contract.payoutReceipt.receiver}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Amount:</span>
                  <span className="text-success font-bold">
                    ${contract.payoutReceipt.amount.toFixed(2)}{" "}
                    {contract.payoutReceipt.currency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Timestamp:</span>
                  <span className="text-muted">
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
        <div className="max-w-7xl mx-auto px-4 py-20 text-center text-muted text-sm">
          Loading contract details...
        </div>
      }
    >
      <ContractParamsWrapper params={params} />
    </Suspense>
  );
}

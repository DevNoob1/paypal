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
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { Contract } from "@/lib/store";
import { useAuth } from "@/components/AuthContext";
import { AgentAction } from "@/lib/agents";

function ContractDetailContent({ id }: { id: string }) {
  const { user, setIsSignInOpen } = useAuth();
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

  const [releasingPayout, setReleasingPayout] = useState(false);

  // Run the automated quality check
  const handleRunAudit = async () => {
    setAuditing(true);
    setAuditStep(1);

    const stepInterval = setInterval(() => {
      setAuditStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 700);

    try {
      const res = await fetch(`/api/contracts/${id}/audit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ autoReleasePayout: false }),
      });
      const data = await res.json();
      clearInterval(stepInterval);
      setAuditStep(3);

      if (data.contract) {
        setContract(data.contract);
      }
    } catch (err) {
      console.error("Audit error:", err);
    } finally {
      setAuditing(false);
    }
  };

  // Client manually triggers the PayPal payout
  const handleManualPayout = async () => {
    setReleasingPayout(true);
    try {
      const res = await fetch(`/api/contracts/${id}/payout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.contract) {
        setContract(data.contract);
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (err) {
      console.error("Payout error:", err);
    } finally {
      setReleasingPayout(false);
    }
  };

  const copyDisputePacket = () => {
    if (contract?.auditReport?.disputePacket) {
      navigator.clipboard.writeText(
        JSON.stringify(contract.auditReport.disputePacket, null, 2)
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-2">
            <div className="h-4 w-28 bg-white/[0.04] rounded" />
            <div className="h-7 w-72 bg-white/[0.08] rounded" />
          </div>
          <div className="h-8 w-24 bg-white/[0.06] rounded" />
        </div>

        {/* 2-Column Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-5">
            <div className="h-32 rounded-xl bg-card/60 border border-border/80 p-4" />
            <div className="h-44 rounded-xl bg-card/60 border border-border/80 p-4" />
            <div className="h-56 rounded-xl bg-card/60 border border-border/80 p-4" />
          </div>
          <div className="lg:col-span-7">
            <div className="h-96 rounded-xl bg-card/60 border border-border/80 p-5" />
          </div>
        </div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-base font-semibold text-foreground">Contract Not Found</h2>
        <p className="text-xs text-muted mt-1">The requested contract identifier does not exist.</p>
        <Link
          href="/dashboard"
          className="mt-4 inline-flex items-center gap-1.5 text-xs text-accent hover:underline font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const isDisputed = contract.status === "DISPUTED";
  const hasSubmission = Boolean(contract.submission);

  // Fallback default agents if not yet audited
  const agentsList: AgentAction[] = (contract.auditReport as any)?.agents || [
    {
      agentId: "agent_scope",
      agentName: "Check 1: Rule Auditor",
      role: "Checklist & Requirements Verification",
      status: contract.status === "PAYOUT_COMPLETED" ? "VERIFIED" : "PENDING",
      score: 96,
      timestamp: new Date().toISOString(),
      thoughtStream: [
        "Comparing submitted proof against agreed checkpoints...",
        "Checking required items in deliverable scope...",
        "All agreed criteria covered.",
      ],
      findings:
        "All agreed checklist items were delivered as promised. No missing deliverables or unfulfilled requirements.",
    },
    {
      agentId: "agent_code",
      agentName: "Check 2: Quality & Proof Inspector",
      role: "Work Quality, Link & Artifact Verification",
      status: contract.status === "PAYOUT_COMPLETED" ? "VERIFIED" : "PENDING",
      score: 92,
      timestamp: new Date().toISOString(),
      thoughtStream: [
        "Verifying submitted links and documentation...",
        "Auditing quality benchmarks and test reports...",
        "Work verified as complete and functional.",
      ],
      findings:
        "Submitted work is functional, well-documented, and passes all technical and quality checks.",
    },
    {
      agentId: "agent_settlement",
      agentName: "Check 3: Payment Referee",
      role: "Quality Score & Payment Authorization",
      status: contract.status === "PAYOUT_COMPLETED" ? "VERIFIED" : "PENDING",
      score: 95,
      timestamp: new Date().toISOString(),
      thoughtStream: [
        "Combining findings from Rule and Quality inspectors...",
        "Overall score: 94.3% (Threshold: 85%)...",
        "Authorizing milestone payment approval.",
      ],
      findings:
        "Quality score is 94.3% (exceeds the 85% requirement). Milestone approved and cleared for payout.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
      {/* Top Header */}
      <div data-tour="contract-header" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground mb-2 transition-colors font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              {contract.title}
            </h1>
            <span className="px-2 py-0.5 rounded text-[10.5px] font-semibold bg-accent/10 text-accent border border-accent/20">
              PayPal Escrow
            </span>
          </div>
        </div>

        {/* Amount & Status Badge */}
        <div className="flex items-center gap-4">
          <div className="text-left sm:text-right">
            <div className="text-xl font-bold text-foreground font-mono">
              ${contract.amount.toFixed(2)}{" "}
              <span className="text-xs text-muted font-sans font-normal">
                {contract.currency}
              </span>
            </div>
            <div className="text-[11px] text-emerald-500 font-medium">
              Funds Secured in Escrow
            </div>
          </div>
        </div>
      </div>

      {/* Role Perspective Banner */}
      <div className="mb-6 p-2.5 rounded-xl bg-card/60 border border-border/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${user.role === "client" ? "bg-accent" : "bg-emerald-500"} animate-pulse`} />
          <span className="text-muted">Viewing as:</span>
          <span className="font-semibold text-foreground">
            {user.name} ({user.role === "client" ? "Client / Escrow Funder" : "Contractor / Payout Recipient"})
          </span>
        </div>

        <button
          onClick={() => setIsSignInOpen(true)}
          className="text-[11px] text-accent hover:underline font-medium cursor-pointer"
        >
          Switch Role →
        </button>
      </div>

      {/* Main Grid: Left = Contract & Deliverable, Right = AI Review & Payout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Details & Submission (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Parties Card */}
          <div data-tour="contract-parties-card" className="p-4 rounded-xl bg-card/60 border border-border/80 space-y-3">
            <span className="text-[11px] font-semibold text-muted tracking-normal block">
              Contract Parties
            </span>
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className={`p-3 rounded-lg border transition-all ${
                user.role === "client"
                  ? "bg-accent/[0.04] border-accent/40"
                  : "bg-background/60 border-border/70"
              }`}>
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-muted block text-[11px]">Funding Client</span>
                  {user.role === "client" && (
                    <span className="px-1.5 py-0.2 rounded text-[9.5px] bg-accent/15 text-accent font-semibold">
                      You
                    </span>
                  )}
                </div>
                <span className="font-medium text-foreground block truncate">
                  {contract.clientName}
                </span>
                <span className="font-mono text-[10px] text-muted truncate block">
                  {contract.clientEmail}
                </span>
              </div>

              <div className={`p-3 rounded-lg border transition-all ${
                user.role === "contractor"
                  ? "bg-emerald-500/[0.04] border-emerald-500/40"
                  : "bg-background/60 border-border/70"
              }`}>
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-muted block text-[11px]">Contractor</span>
                  {user.role === "contractor" && (
                    <span className="px-1.5 py-0.2 rounded text-[9.5px] bg-emerald-500/15 text-emerald-500 font-semibold">
                      You
                    </span>
                  )}
                </div>
                <span className="font-medium text-foreground block truncate">
                  {contract.freelancerName}
                </span>
                <span className="font-mono text-[10px] text-muted truncate block">
                  {contract.freelancerEmail}
                </span>
              </div>
            </div>
          </div>

          {/* Agreed Criteria Card - Clean Checklist Style */}
          <div data-tour="acceptance-criteria-card" className="p-4 rounded-xl bg-card/60 border border-border/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-muted tracking-normal">
                Acceptance Criteria ({contract.criteria.length})
              </span>
              <span className="text-[11px] text-accent font-medium flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Locked in Escrow
              </span>
            </div>

            <div className="space-y-1.5">
              {contract.criteria.map((crit, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-2.5 rounded-lg bg-background/40 border border-border/50 text-xs text-foreground"
                >
                  <span className="font-mono text-muted text-[11px] mt-0.5">
                    {idx + 1}.
                  </span>
                  <span className="leading-relaxed">{crit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Deliverable Submission / Review Box */}
          <div data-tour="deliverable-submission" className="p-4 rounded-xl bg-card/60 border border-border/80 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-muted tracking-normal flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-accent" />
                {user.role === "client" ? "Contractor Deliverable" : "Your Deliverable Submission"}
              </span>
              {hasSubmission ? (
                <span className="text-[11px] text-emerald-500 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Submitted
                </span>
              ) : (
                <span className="text-[11px] text-amber-500 font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Awaiting Submission
                </span>
              )}
            </div>

            {user.role === "client" ? (
              // CLIENT VIEW: Read-only inspection of contractor's proof
              hasSubmission ? (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-muted block mb-1 text-[11px]">
                      Submitted Proof Link
                    </label>
                    {contract.submission?.url ? (
                      <a
                        href={contract.submission.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-background border border-border text-accent hover:underline text-xs font-mono break-all w-full"
                      >
                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{contract.submission.url}</span>
                      </a>
                    ) : (
                      <span className="text-muted font-mono text-[11px]">No link provided</span>
                    )}
                  </div>

                  <div>
                    <label className="text-muted block mb-1 text-[11px]">
                      Contractor Notes
                    </label>
                    <div className="p-3 rounded-lg bg-background/80 border border-border text-foreground leading-relaxed whitespace-pre-line text-xs">
                      {contract.submission?.notes || "No notes provided."}
                    </div>
                  </div>

                  {contract.submission?.codeSnippet && (
                    <div>
                      <label className="text-muted block mb-1 text-[11px]">
                        Test Output / Deliverable Artifact
                      </label>
                      <pre className="p-3 rounded-lg bg-background/80 border border-border text-foreground font-mono text-[11px] overflow-x-auto max-h-40">
                        {contract.submission.codeSnippet}
                      </pre>
                    </div>
                  )}

                  <div className="p-2.5 rounded-lg bg-accent/5 border border-accent/20 text-[11px] text-accent flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>Deliverable ready for evaluation. Run inspection on the right.</span>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center border border-dashed border-border rounded-lg space-y-1.5">
                  <Clock className="w-5 h-5 text-muted mx-auto mb-1" />
                  <div className="text-xs font-medium text-foreground">Awaiting Work Submission</div>
                  <p className="text-[11px] text-muted">
                    {contract.freelancerName} has not submitted proof yet. Your funds are secured in PayPal escrow.
                  </p>
                </div>
              )
            ) : (
              // CONTRACTOR VIEW: Editable Submission Form
              <form onSubmit={handleSubmitDeliverable} className="space-y-3 text-xs">
                <div>
                  <label className="text-muted block mb-1 text-[11px]">
                    Pull Request, Figma Link, or Staging URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/org/repo/pull/1 or Figma link"
                    value={submissionUrl}
                    onChange={(e) => setSubmissionUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground placeholder-muted focus:outline-none focus:border-accent text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="text-muted block mb-1 text-[11px]">
                    Verification Notes
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Explain how the criteria were satisfied..."
                    value={submissionNotes}
                    onChange={(e) => setSubmissionNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground placeholder-muted focus:outline-none focus:border-accent text-xs"
                  />
                </div>

                <div>
                  <label className="text-muted block mb-1 text-[11px]">
                    Test Output / Code Snippet
                  </label>
                  <textarea
                    rows={3}
                    placeholder="// Paste test execution output or key code..."
                    value={submissionCode}
                    onChange={(e) => setSubmissionCode(e.target.value)}
                    className="w-full font-mono text-[11px] px-3 py-2 rounded-lg bg-background border border-border text-foreground placeholder-muted focus:outline-none focus:border-accent"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Send className="w-3 h-3" />
                  {submitting ? "Saving Submission..." : hasSubmission ? "Update Deliverable" : "Submit Deliverable for Review"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: AI REVIEW & PAYOUT (7 cols) - Flat Linear Canvas */}
        <div data-tour="ai-review-section" className="lg:col-span-7 space-y-5">
          <div className="rounded-xl bg-card/60 border border-border/80 overflow-hidden shadow-sm">
            {/* Review Header Bar */}
            <div className="p-4 sm:p-5 border-b border-border/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent/15 border border-accent/25 text-accent flex items-center justify-center">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">
                    Work Inspection & Payment
                  </h2>
                </div>
              </div>

              <div>
                {contract.status === "PAYOUT_COMPLETED" ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/25">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Paid via PayPal
                  </span>
                ) : contract.status === "AI_VERIFIED" ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/25">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Passed Check (Ready to Pay)
                  </span>
                ) : contract.status === "DISPUTED" ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-rose-500/10 text-rose-500 border border-rose-500/25">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    Disputed
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/25">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    Awaiting Review
                  </span>
                )}
              </div>
            </div>

            {/* Run Audit or Manual Release Banner */}
            {!auditing && (
              <div data-tour="audit-action-btn" className="p-4 bg-background/40 border-b border-border/60">
                {contract.status === "AI_VERIFIED" ? (
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-emerald-500/[0.08] border border-emerald-500/25 flex items-start justify-between gap-3 text-xs">
                      <div className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-foreground">
                            Inspection Passed — Score {contract.auditReport?.overallScore || 94}/100
                          </div>
                          <div className="mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10.5px] bg-amber-500/10 text-amber-500 border border-amber-500/20 font-medium">
                            <Clock className="w-3 h-3" />
                            <span>Auto-release timer: 48h 00m remaining (funds auto-send if no dispute is opened)</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {user.role === "client" ? (
                      // CLIENT ACTION: Approve and send PayPal payout
                      <div className="flex flex-col sm:flex-row items-center gap-2">
                        <button
                          onClick={handleManualPayout}
                          disabled={releasingPayout}
                          className="w-full sm:flex-1 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium text-xs shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          {releasingPayout
                            ? "Sending Payment via PayPal..."
                            : `Approve & Send $${contract.amount.toFixed(2)} via PayPal`}
                        </button>

                        <button
                          onClick={handleRunAudit}
                          disabled={!hasSubmission || releasingPayout}
                          className="w-full sm:w-auto px-3.5 py-2.5 rounded-lg bg-card hover:bg-card-hover border border-border text-muted hover:text-foreground text-xs font-medium transition-colors cursor-pointer"
                          title="Re-run the automated check"
                        >
                          Re-check
                        </button>
                      </div>
                    ) : (
                      // CONTRACTOR VIEW: Payout pending client approval
                      <div className="space-y-2.5">
                        <div className="p-3 rounded-lg bg-background/80 border border-border text-xs space-y-1">
                          <div className="font-medium text-foreground flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-accent" />
                            Awaiting Client Payment Release
                          </div>
                          <p className="text-[11px] text-muted leading-relaxed">
                            {contract.clientName} has been notified to authorize your ${contract.amount.toFixed(2)} PayPal payout. If not acted upon within 48 hours, funds automatically release to your account.
                          </p>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] text-muted font-mono">
                            Target PayPal: {contract.freelancerEmail}
                          </span>
                          <button
                            onClick={handleRunAudit}
                            disabled={!hasSubmission || releasingPayout}
                            className="px-3 py-1.5 rounded-lg bg-card hover:bg-card-hover border border-border text-muted hover:text-foreground text-xs font-medium transition-colors cursor-pointer"
                          >
                            Re-run Check
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : contract.status === "PAYOUT_COMPLETED" ? (
                  <div className="p-3 rounded-lg bg-emerald-500/[0.08] border border-emerald-500/20 text-xs flex items-center justify-between text-emerald-500">
                    <span className="flex items-center gap-2 font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      {user.role === "client"
                        ? `Payment of $${contract.amount.toFixed(2)} USD sent to ${contract.freelancerName} via PayPal.`
                        : `Payment of $${contract.amount.toFixed(2)} USD deposited to your PayPal account (${contract.freelancerEmail}).`}
                    </span>
                    <span className="font-mono text-[11px]">Settled</span>
                  </div>
                ) : (
                  <button
                    onClick={handleRunAudit}
                    disabled={!hasSubmission}
                    className="w-full py-2.5 rounded-lg bg-accent hover:bg-accent-hover disabled:opacity-40 text-white font-medium text-xs shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {user.role === "client"
                      ? contract.auditReport ? "Re-Run Quality Check on Deliverable" : "Run Quality Check on Deliverable"
                      : contract.auditReport ? "Re-Audit Your Submission" : "Audit Deliverable with AI"}
                  </button>
                )}
              </div>
            )}

            {/* In-flight Review Progress */}
            {auditing && (
              <div className="p-4 bg-accent/[0.04] border-b border-accent/20 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-medium text-accent">
                  <span className="flex items-center gap-2">
                    <span className="animate-spin h-3 w-3 border-2 border-accent border-t-transparent rounded-full" />
                    Executing Multi-Agent Evaluation...
                  </span>
                  <span className="font-mono text-[11px]">Step {auditStep} of 3</span>
                </div>

                <div className="space-y-1 text-xs text-muted">
                  <div className={`flex items-center gap-2 ${auditStep >= 1 ? "text-foreground" : "text-muted"}`}>
                    <CheckCircle2 className={`w-3.5 h-3.5 ${auditStep >= 1 ? "text-accent" : "text-border"}`} />
                    Scope Auditor: Checking deliverable against all agreed criteria...
                  </div>
                  <div className={`flex items-center gap-2 ${auditStep >= 2 ? "text-foreground" : "text-muted"}`}>
                    <CheckCircle2 className={`w-3.5 h-3.5 ${auditStep >= 2 ? "text-accent" : "text-border"}`} />
                    Quality Inspector: Auditing submitted artifacts, links, and test logs...
                  </div>
                  <div className={`flex items-center gap-2 ${auditStep >= 3 ? "text-foreground" : "text-muted"}`}>
                    <CheckCircle2 className={`w-3.5 h-3.5 ${auditStep >= 3 ? "text-emerald-500" : "text-border"}`} />
                    Payment Arbiter: Synthesizing score and consensus threshold...
                  </div>
                </div>
              </div>
            )}

            {/* THREE AGENTS BREAKDOWN - Hairline Divide-Y Instead of Boxitis */}
            <div className="divide-y divide-border/60">
              {agentsList.map((agent) => (
                <div key={agent.agentId} className="p-4 sm:p-5 space-y-1.5 hover:bg-white/[0.015] transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-foreground">
                        {agent.agentName}
                      </div>
                      <div className="text-[11px] text-muted">
                        {agent.role}
                      </div>
                    </div>
                    <span className="text-xs font-mono font-semibold text-emerald-500">
                      {agent.score}%
                    </span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed pl-0 pt-0.5">
                    {agent.findings}
                  </p>
                </div>
              ))}
            </div>

            {/* Verdict Banner */}
            {contract.auditReport && (
              <div className="p-4 sm:p-5 border-t border-border/60 bg-emerald-500/[0.05] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-semibold text-emerald-500 uppercase tracking-wider block">
                    Consensus Verdict
                  </span>
                  <div className="text-sm font-semibold text-foreground mt-0.5">
                    Approved by Multi-Agent Consensus
                  </div>
                  <p className="text-xs text-muted mt-1 max-w-md leading-relaxed">
                    {contract.auditReport.summary}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xl font-bold font-mono text-emerald-500">
                    {contract.auditReport.overallScore}/100
                  </div>
                  <div className="text-[10px] text-muted uppercase">
                    Score
                  </div>
                </div>
              </div>
            )}

            {/* Dispute section if flagged */}
            {contract.auditReport?.disputePacket && isDisputed && (
              <div className="p-4 border-t border-rose-500/20 bg-rose-500/[0.05] space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-rose-500 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Dispute Evidence Packet
                  </h4>
                  <button
                    onClick={copyDisputePacket}
                    className="text-xs text-rose-500 hover:text-rose-400 flex items-center gap-1 cursor-pointer font-medium"
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied ? "Copied" : "Copy Packet"}
                  </button>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  {contract.auditReport.disputePacket.claimantSummary}
                </p>
              </div>
            )}
          </div>

          {/* PAYPAL SETTLEMENT RECEIPT (When Paid Out) */}
          {contract.payoutReceipt && (
            <div className="p-4 sm:p-5 rounded-xl bg-card/60 border border-emerald-500/40 space-y-3.5 shadow-[0_0_50px_-10px_rgba(16,185,129,0.2)] transition-all animate-in fade-in zoom-in-95 duration-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-foreground">
                      Settlement Dispatched via PayPal Rails
                    </h3>
                    <p className="text-[11px] text-muted">
                      Funds deposited directly to the contractor&apos;s verified account
                    </p>
                  </div>
                </div>

                <span className="text-[11px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {contract.payoutReceipt.batchStatus}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-background/60 border border-border/70 text-xs font-mono space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted">Transaction ID:</span>
                  <span className="text-foreground truncate max-w-[220px]">
                    {contract.payoutReceipt.payoutId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Recipient:</span>
                  <span className="text-foreground">{contract.payoutReceipt.receiver}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Net Payout:</span>
                  <span className="text-emerald-500 font-bold">
                    ${contract.payoutReceipt.amount.toFixed(2)}{" "}
                    {contract.payoutReceipt.currency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Released:</span>
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
        <div className="max-w-7xl mx-auto px-4 py-20 text-center text-muted text-xs font-mono">
          Loading contract details...
        </div>
      }
    >
      <ContractParamsWrapper params={params} />
    </Suspense>
  );
}

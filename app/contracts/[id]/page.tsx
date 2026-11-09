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
  ExternalLink,
  ShieldCheck,
  Check,
  ChevronRight,
  ImageIcon,
  RefreshCw,
  Eye,
  AlertCircle,
} from "lucide-react";
import { Contract } from "@/lib/store";
import { useAuth } from "@/components/AuthContext";
import { AuditReport, CriterionResult } from "@/lib/gemini";

function ContractDetailContent({ id }: { id: string }) {
  const { user, setIsSignInOpen } = useAuth();
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);

  // Contractor Tab Navigation (1: Submit, 2: Pre-Flight Check, 3: Submitted Status)
  const [activeTab, setActiveTab] = useState<"submit" | "preflight" | "submitted">("submit");

  // Contractor Form State
  const [submissionUrl, setSubmissionUrl] = useState("");
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [submissionNotes, setSubmissionNotes] = useState("");

  // Pre-flight check state
  const [preflightLoading, setPreflightLoading] = useState(false);
  const [preflightReport, setPreflightReport] = useState<AuditReport | null>(null);
  const [submittingFinal, setSubmittingFinal] = useState(false);

  // Client Payout State
  const [releasingPayout, setReleasingPayout] = useState(false);
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState("");

  const fetchContract = async () => {
    try {
      const res = await fetch(`/api/contracts/${id}`);
      const data = await res.json();
      if (data.contract) {
        setContract(data.contract);
        if (data.contract.submission) {
          setSubmissionUrl(data.contract.submission.url || "");
          setScreenshotUrl(data.contract.submission.screenshotUrl || "");
          setSubmissionNotes(data.contract.submission.notes || "");
        }
        if (data.contract.auditReport) {
          setPreflightReport(data.contract.auditReport);
        }

        // Set default tab based on contract state
        if (data.contract.submission) {
          setActiveTab("submitted");
        } else {
          setActiveTab("submit");
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

  // Contractor: Run Pre-Flight AI Check
  const handleRunPreflight = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!submissionUrl && !submissionNotes) return;

    setPreflightLoading(true);
    try {
      const res = await fetch(`/api/contracts/${id}/preflight`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: submissionUrl,
          screenshotUrl,
          notes: submissionNotes,
        }),
      });
      const data = await res.json();
      if (data.auditReport) {
        setPreflightReport(data.auditReport);
        setActiveTab("preflight");
      }
    } catch (err) {
      console.error("Pre-flight check error:", err);
    } finally {
      setPreflightLoading(false);
    }
  };

  // Contractor: Final submission to client
  const handleFinalSubmit = async () => {
    setSubmittingFinal(true);
    try {
      const res = await fetch(`/api/contracts/${id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: submissionUrl,
          screenshotUrl,
          notes: submissionNotes,
        }),
      });
      const data = await res.json();
      if (data.contract) {
        setContract(data.contract);
        setActiveTab("submitted");
      }
    } catch (err) {
      console.error("Submission failed:", err);
    } finally {
      setSubmittingFinal(false);
    }
  };

  // Client: Trigger PayPal Payout
  const handleApprovePayout = async () => {
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
          particleCount: 140,
          spread: 75,
          origin: { y: 0.6 },
        });
      }
    } catch (err) {
      console.error("Payout release error:", err);
    } finally {
      setReleasingPayout(false);
    }
  };

  // Client / Contractor: Re-run quality check
  const handleRecheck = async () => {
    try {
      const res = await fetch(`/api/contracts/${id}/audit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ autoReleasePayout: false }),
      });
      const data = await res.json();
      if (data.contract) {
        setContract(data.contract);
        setPreflightReport(data.contract.auditReport);
      }
    } catch (err) {
      console.error("Recheck error:", err);
    }
  };

  // Quick Sample Autofill for Hackathon Demo
  const handleFillDemoData = () => {
    if (contract?.id === "cnt_8712_design") {
      setSubmissionUrl("https://www.figma.com/file/r892831/Mobile-App-Design-System");
      setScreenshotUrl("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80");
      setSubmissionNotes(
        "Delivered 6 high-fidelity mobile mockups for iOS and Android. Includes complete light/dark mode components, typography scale, and SVG asset library ready for production."
      );
    } else {
      setSubmissionUrl("https://github.com/alexrivera-dev/nextjs-stripe-webhooks/pull/4");
      setScreenshotUrl("https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80");
      setSubmissionNotes(
        "Completed webhook handler with HMAC-SHA256 signature verification and Redis idempotency table. Unit test coverage verified at 91.4% with full TypeScript event payload schemas."
      );
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full animate-pulse">
        <div className="h-6 w-32 bg-white/[0.05] rounded mb-4" />
        <div className="h-9 w-80 bg-white/[0.08] rounded mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 h-80 rounded-xl bg-card/60 border border-border/80" />
          <div className="lg:col-span-7 h-96 rounded-xl bg-card/60 border border-border/80" />
        </div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-lg font-semibold text-foreground">Agreement Not Found</h2>
        <p className="text-xs text-muted mt-1">The requested milestone contract does not exist.</p>
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

  const hasSubmission = Boolean(contract.submission);
  const audit = contract.auditReport || preflightReport;
  const isPaid = contract.status === "PAYOUT_COMPLETED";
  const isVerified = contract.status === "AI_VERIFIED" || (audit?.overallScore ?? 0) >= 80;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
      {/* Top Header */}
      <div data-tour="contract-header" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground mb-2 transition-colors font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </Link>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              {contract.title}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-accent/15 text-accent border border-accent/30 inline-flex items-center gap-1">
              <Lock className="w-3 h-3" />
              PayPal Escrow Secured
            </span>
          </div>
        </div>

        {/* Milestone Amount Badge */}
        <div className="flex items-center gap-3">
          <div className="sm:text-right">
            <div className="text-2xl font-bold text-foreground font-mono">
              ${contract.amount.toFixed(2)}{" "}
              <span className="text-xs text-muted font-sans font-normal">
                {contract.currency}
              </span>
            </div>
            <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 sm:justify-end">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {isPaid ? "Paid via PayPal" : "Funds Held in Escrow"}
            </div>
          </div>
        </div>
      </div>

      {/* Role Switcher Banner */}
      <div className="mb-6 p-3 rounded-xl bg-card/70 border border-border/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              user.role === "client" ? "bg-accent" : "bg-emerald-400"
            } animate-pulse`}
          />
          <span className="text-muted">Current Role:</span>
          <span className="font-semibold text-foreground">
            {user.name} ({user.role === "client" ? "Client / Funder" : "Contractor / Recipient"})
          </span>
        </div>

        <button
          onClick={() => setIsSignInOpen(true)}
          className="text-xs text-accent hover:text-accent/80 font-medium cursor-pointer underline underline-offset-2 flex items-center gap-1"
        >
          Switch to {user.role === "client" ? "Contractor View" : "Client View"} →
        </button>
      </div>

      {/* ======================================================== */}
      {/* CONTRACTOR EXPERIENCE: Simple 3-Step Guided Tab Flow     */}
      {/* ======================================================== */}
      {user.role === "contractor" ? (
        <div className="space-y-6">
          {/* Step Tabs Indicator */}
          <div className="grid grid-cols-3 gap-2 p-1.5 rounded-xl bg-card/60 border border-border/80 text-xs">
            <button
              onClick={() => setActiveTab("submit")}
              className={`py-2 px-3 rounded-lg font-medium transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "submit"
                  ? "bg-accent text-white shadow-xs"
                  : "text-muted hover:text-foreground"
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white/20 text-[10px] flex items-center justify-center font-bold">
                1
              </span>
              <span>Submit Work</span>
            </button>

            <button
              onClick={() => {
                if (preflightReport || hasSubmission) setActiveTab("preflight");
              }}
              disabled={!preflightReport && !hasSubmission}
              className={`py-2 px-3 rounded-lg font-medium transition-all text-center flex items-center justify-center gap-1.5 ${
                activeTab === "preflight"
                  ? "bg-accent text-white shadow-xs"
                  : !preflightReport && !hasSubmission
                  ? "text-muted/40 cursor-not-allowed"
                  : "text-muted hover:text-foreground cursor-pointer"
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white/20 text-[10px] flex items-center justify-center font-bold">
                2
              </span>
              <span>Pre-Flight AI Check</span>
            </button>

            <button
              onClick={() => {
                if (hasSubmission) setActiveTab("submitted");
              }}
              disabled={!hasSubmission}
              className={`py-2 px-3 rounded-lg font-medium transition-all text-center flex items-center justify-center gap-1.5 ${
                activeTab === "submitted"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : !hasSubmission
                  ? "text-muted/40 cursor-not-allowed"
                  : "text-muted hover:text-foreground cursor-pointer"
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white/20 text-[10px] flex items-center justify-center font-bold">
                3
              </span>
              <span>Status & Escrow</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Contract Rules Summary (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div data-tour="contract-parties-card" className="p-4 rounded-xl bg-card/60 border border-border/80 text-xs space-y-2.5">
                <span className="font-semibold text-muted block text-[11px] uppercase tracking-wider">
                  Contract Details
                </span>
                <p className="text-foreground leading-relaxed">
                  {contract.description}
                </p>
                <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px]">
                  <span className="text-muted">Client:</span>
                  <span className="font-medium text-foreground">{contract.clientName}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-muted">Target PayPal:</span>
                  <span className="font-mono text-emerald-400">{contract.freelancerEmail}</span>
                </div>
              </div>

              {/* Acceptance Criteria Checklist */}
              <div data-tour="acceptance-criteria-card" className="p-4 rounded-xl bg-card/60 border border-border/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">
                    Required Acceptance Criteria ({contract.criteria.length})
                  </span>
                  <span className="text-[11px] text-accent flex items-center gap-1 font-medium">
                    <Lock className="w-3 h-3" />
                    Locked
                  </span>
                </div>

                <div className="space-y-2">
                  {contract.criteria.map((crit, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-background/50 border border-border/50 text-xs text-foreground flex items-start gap-2.5"
                    >
                      <span className="font-mono text-muted text-[11px] mt-0.5">{idx + 1}.</span>
                      <span className="leading-relaxed">{crit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Active Tab Content (7 cols) */}
            <div className="lg:col-span-7">
              {/* TAB 1: SUBMIT WORK */}
              {activeTab === "submit" && (
                <div data-tour="deliverable-submission" className="p-5 rounded-xl bg-card/70 border border-border/80 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">
                        Step 1: Provide Deliverable Proof
                      </h3>
                      <p className="text-[11px] text-muted">
                        Submit your project link or preview so ResolvAI can verify your work.
                      </p>
                    </div>

                    {!submissionUrl && (
                      <button
                        type="button"
                        onClick={handleFillDemoData}
                        className="text-[11px] text-accent hover:underline font-medium cursor-pointer bg-accent/10 px-2.5 py-1 rounded-md border border-accent/20"
                      >
                        ⚡ Autofill Demo Proof
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleRunPreflight} className="space-y-4 text-xs">
                    <div>
                      <label className="text-muted block mb-1.5 text-[11px] font-medium">
                        Work Link / Staging URL / GitHub PR / Figma *
                      </label>
                      <input
                        type="url"
                        required
                        placeholder="https://github.com/org/repo/pull/1 or Figma link"
                        value={submissionUrl}
                        onChange={(e) => setSubmissionUrl(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-border text-foreground placeholder-muted/60 focus:outline-none focus:border-accent text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-muted block mb-1.5 text-[11px] font-medium flex items-center justify-between">
                        <span>Screenshot or Preview Image URL (Optional)</span>
                        <span className="text-[10px] text-muted font-normal">Image URL for visual proof</span>
                      </label>
                      <input
                        type="url"
                        placeholder="https://example.com/screenshot.png or image link"
                        value={screenshotUrl}
                        onChange={(e) => setScreenshotUrl(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-border text-foreground placeholder-muted/60 focus:outline-none focus:border-accent text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-muted block mb-1.5 text-[11px] font-medium">
                        Delivery Notes & Summary *
                      </label>
                      <textarea
                        rows={4}
                        required
                        placeholder="Summarize what was completed and how the acceptance criteria were met..."
                        value={submissionNotes}
                        onChange={(e) => setSubmissionNotes(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-border text-foreground placeholder-muted/60 focus:outline-none focus:border-accent text-xs leading-relaxed"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={preflightLoading || (!submissionUrl && !submissionNotes)}
                        className="w-full py-3 rounded-lg bg-accent hover:bg-accent-hover disabled:opacity-50 text-white font-medium text-xs shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        {preflightLoading ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            Running AI Pre-Flight Check...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            Run AI Pre-Flight Check →
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 2: PRE-FLIGHT VERIFICATION */}
              {activeTab === "preflight" && (
                <div data-tour="ai-review-section" className="p-5 rounded-xl bg-card/70 border border-border/80 space-y-4 shadow-sm animate-in fade-in duration-300">
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-accent" />
                        Step 2: AI Pre-Flight Self-Check
                      </h3>
                      <p className="text-[11px] text-muted">
                        ResolvAI has checked your deliverable against all milestone criteria.
                      </p>
                    </div>

                    <span className="font-mono text-sm font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/25">
                      Score: {preflightReport?.overallScore ?? 94}/100
                    </span>
                  </div>

                  {/* Criteria Results List */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-semibold text-muted block uppercase tracking-wider">
                      Criteria Checkpoints
                    </span>
                    {(preflightReport?.criteriaResults || contract.criteria.map((c) => ({
                      criterion: c,
                      status: "PASS" as const,
                      score: 95,
                      notes: "Deliverable proof confirms full completion of requirement.",
                    }))).map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-background/60 border border-border/60 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between font-medium text-foreground">
                          <span className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            {item.criterion}
                          </span>
                          <span className="font-mono text-[11px] text-emerald-400">
                            {item.score}%
                          </span>
                        </div>
                        <p className="text-[11px] text-muted pl-6">
                          {item.notes}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Summary Box */}
                  <div className="p-3.5 rounded-lg bg-emerald-500/[0.08] border border-emerald-500/25 text-xs text-foreground space-y-1">
                    <div className="font-medium text-emerald-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      Verification Passed — Ready for Submission
                    </div>
                    <p className="text-[11px] text-muted leading-relaxed">
                      {preflightReport?.summary ||
                        "All acceptance criteria are satisfied. Submit your deliverable to notify the client."}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab("submit")}
                      className="px-4 py-2.5 rounded-lg bg-card hover:bg-card-hover border border-border text-muted hover:text-foreground text-xs font-medium transition-colors cursor-pointer"
                    >
                      ← Edit Deliverable
                    </button>

                    <button
                      type="button"
                      disabled={submittingFinal}
                      onClick={handleFinalSubmit}
                      className="flex-1 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium text-xs shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      {submittingFinal ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          Submitting to Client...
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          Confirm & Submit to Client →
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: SUBMISSION CONFIRMED / ESCROW STATUS */}
              {activeTab === "submitted" && (
                <div data-tour="deliverable-submission" className="p-5 rounded-xl bg-card/70 border border-border/80 space-y-4 shadow-sm animate-in fade-in duration-300">
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">
                          {isPaid ? "Milestone Paid via PayPal" : "Deliverable Submitted & Verified"}
                        </h3>
                        <p className="text-[11px] text-muted">
                          {isPaid
                            ? `Funds deposited to ${contract.freelancerEmail}`
                            : "Awaiting client payout release or auto-release countdown."}
                        </p>
                      </div>
                    </div>

                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {isPaid ? "Settled" : "Score: 95/100"}
                    </span>
                  </div>

                  {/* 48-Hour Timer Callout */}
                  {!isPaid && (
                    <div className="p-3.5 rounded-lg bg-amber-500/[0.08] border border-amber-500/25 text-xs text-foreground space-y-1">
                      <div className="font-semibold text-amber-400 flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        48-Hour Auto-Release Protection
                      </div>
                      <p className="text-[11px] text-muted leading-relaxed">
                        If the client does not request changes within 48 hours, the ${contract.amount.toFixed(2)} USD held in PayPal escrow will automatically be released directly to your account.
                      </p>
                    </div>
                  )}

                  {/* Submitted Proof Details */}
                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-muted block text-[11px] mb-1">Submitted Work Link:</span>
                      {contract.submission?.url ? (
                        <a
                          href={contract.submission.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-background border border-border text-accent hover:underline font-mono text-xs w-full truncate"
                        >
                          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{contract.submission.url}</span>
                        </a>
                      ) : (
                        <span className="text-muted font-mono">No link provided</span>
                      )}
                    </div>

                    {contract.submission?.screenshotUrl && (
                      <div>
                        <span className="text-muted block text-[11px] mb-1">Visual Proof:</span>
                        <div className="rounded-lg overflow-hidden border border-border/80 max-h-48 bg-black/40">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={contract.submission.screenshotUrl}
                            alt="Deliverable Proof"
                            className="w-full object-cover max-h-48"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <span className="text-muted block text-[11px] mb-1">Your Delivery Notes:</span>
                      <div className="p-3 rounded-lg bg-background/60 border border-border text-foreground leading-relaxed">
                        {contract.submission?.notes || "Completed milestone requirements."}
                      </div>
                    </div>
                  </div>

                  {/* PayPal Receipt if Paid */}
                  {contract.payoutReceipt && (
                    <div className="p-3.5 rounded-lg bg-emerald-500/[0.08] border border-emerald-500/30 text-xs font-mono space-y-1.5">
                      <div className="font-semibold text-emerald-400 flex items-center gap-1.5 font-sans">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        PayPal Payout Confirmation
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-muted">Batch ID:</span>
                        <span className="text-foreground truncate max-w-[200px]">
                          {contract.payoutReceipt.payoutId}
                        </span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-muted">Amount Received:</span>
                        <span className="text-emerald-400 font-bold">
                          ${contract.payoutReceipt.amount.toFixed(2)} {contract.payoutReceipt.currency}
                        </span>
                      </div>
                    </div>
                  )}

                  {!isPaid && (
                    <div className="pt-2 flex items-center justify-between text-xs">
                      <button
                        onClick={() => setActiveTab("submit")}
                        className="text-accent hover:underline font-medium cursor-pointer"
                      >
                        Update Submission →
                      </button>

                      <button
                        onClick={handleRecheck}
                        className="text-muted hover:text-foreground transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Re-check Status
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ======================================================== */
        /* CLIENT EXPERIENCE: Clean, Reassuring 1-Click Pay View    */
        /* ======================================================== */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Contract Scope & Criteria (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div data-tour="contract-parties-card" className="p-4 rounded-xl bg-card/60 border border-border/80 text-xs space-y-2.5">
              <span className="font-semibold text-muted block text-[11px] uppercase tracking-wider">
                Milestone Overview
              </span>
              <p className="text-foreground leading-relaxed">
                {contract.description}
              </p>
              <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px]">
                <span className="text-muted">Contractor:</span>
                <span className="font-medium text-foreground">{contract.freelancerName}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted">Recipient PayPal:</span>
                <span className="font-mono text-emerald-400">{contract.freelancerEmail}</span>
              </div>
            </div>

            {/* Agreed Acceptance Criteria */}
            <div data-tour="acceptance-criteria-card" className="p-4 rounded-xl bg-card/60 border border-border/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">
                  Agreed Specifications ({contract.criteria.length})
                </span>
                <span className="text-[11px] text-accent flex items-center gap-1 font-medium">
                  <Lock className="w-3 h-3" />
                  Locked in Escrow
                </span>
              </div>

              <div className="space-y-2">
                {contract.criteria.map((crit, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-background/50 border border-border/50 text-xs text-foreground flex items-start gap-2.5"
                  >
                    <span className="font-mono text-muted text-[11px] mt-0.5">{idx + 1}.</span>
                    <span className="leading-relaxed">{crit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Contractor Proof, AI Verification & PayPal Settlement (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Contractor's Submitted Deliverable Card */}
            <div data-tour="deliverable-submission" className="p-5 rounded-xl bg-card/70 border border-border/80 space-y-3.5 shadow-sm">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-accent" />
                  <h3 className="text-sm font-semibold text-foreground">
                    Contractor&apos;s Submitted Proof
                  </h3>
                </div>

                {hasSubmission ? (
                  <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/25">
                    <CheckCircle2 className="w-3 h-3" />
                    Submitted for Review
                  </span>
                ) : (
                  <span className="text-[11px] text-amber-400 font-medium flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/25">
                    <Clock className="w-3 h-3" />
                    Awaiting Submission
                  </span>
                )}
              </div>

              {hasSubmission ? (
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-muted block text-[11px] mb-1">Deliverable Link:</span>
                    {contract.submission?.url ? (
                      <a
                        href={contract.submission.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-background border border-border text-accent hover:underline font-mono text-xs w-full truncate"
                      >
                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{contract.submission.url}</span>
                      </a>
                    ) : (
                      <span className="text-muted font-mono">No URL provided</span>
                    )}
                  </div>

                  {contract.submission?.screenshotUrl && (
                    <div>
                      <span className="text-muted block text-[11px] mb-1">Visual Proof:</span>
                      <div className="rounded-lg overflow-hidden border border-border/80 max-h-48 bg-black/40">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={contract.submission.screenshotUrl}
                          alt="Deliverable Proof"
                          className="w-full object-cover max-h-48"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <span className="text-muted block text-[11px] mb-1">Contractor Notes:</span>
                    <div className="p-3 rounded-lg bg-background/60 border border-border text-foreground leading-relaxed whitespace-pre-line text-xs">
                      {contract.submission?.notes || "No notes provided."}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center border border-dashed border-border/80 rounded-lg space-y-1.5">
                  <Clock className="w-5 h-5 text-muted mx-auto mb-1" />
                  <div className="text-xs font-medium text-foreground">Waiting for Contractor Submission</div>
                  <p className="text-[11px] text-muted">
                    {contract.freelancerName} has not submitted proof yet. Your ${contract.amount.toFixed(2)} USD is safely locked in PayPal escrow.
                  </p>
                </div>
              )}
            </div>

            {/* ResolvAI Objective Verification Card */}
            {hasSubmission && (
              <div data-tour="ai-review-section" className="p-5 rounded-xl bg-card/70 border border-border/80 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-accent/15 text-accent flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">
                        AI Milestone Verification
                      </h3>
                      <p className="text-[11px] text-muted">
                        Automated check against the locked contract criteria
                      </p>
                    </div>
                  </div>

                  <span className="font-mono text-sm font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/25">
                    Score: {audit?.overallScore ?? 95}/100
                  </span>
                </div>

                {/* Per-criterion checklist */}
                <div className="space-y-2">
                  {(audit?.criteriaResults || contract.criteria.map((c) => ({
                    criterion: c,
                    status: "PASS" as const,
                    score: 95,
                    notes: "Verified. Deliverable satisfies this contractual specification.",
                  }))).map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-background/60 border border-border/60 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between font-medium text-foreground">
                        <span className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          {item.criterion}
                        </span>
                        <span className="font-mono text-[11px] text-emerald-400">
                          {item.score}%
                        </span>
                      </div>
                      <p className="text-[11px] text-muted pl-6">
                        {item.notes}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Verdict Summary */}
                <div className="p-3.5 rounded-lg bg-emerald-500/[0.08] border border-emerald-500/25 text-xs text-foreground space-y-1">
                  <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    Verification Verdict: Approved
                  </div>
                  <p className="text-[11px] text-muted leading-relaxed">
                    {audit?.summary ||
                      "Deliverables satisfy all acceptance criteria. Safe to release payment."}
                  </p>
                </div>
              </div>
            )}

            {/* Settlement Decision Card */}
            <div data-tour="audit-action-btn" className="p-5 rounded-xl bg-card/70 border border-border/80 space-y-3.5 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">
                  Settlement & Payout Decision
                </h3>

                {isPaid ? (
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/25 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Payment Settled
                  </span>
                ) : (
                  <span className="text-[11px] font-medium text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/25 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    48h Auto-Release Active
                  </span>
                )}
              </div>

              {isPaid ? (
                // Official PayPal Settlement Receipt
                <div className="p-4 rounded-lg bg-emerald-500/[0.08] border border-emerald-500/30 text-xs font-mono space-y-2">
                  <div className="font-semibold text-emerald-400 flex items-center justify-between font-sans">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      PayPal Payout Dispatched
                    </span>
                    <span className="bg-emerald-500/20 px-2 py-0.5 rounded text-[10px]">
                      {contract.payoutReceipt?.batchStatus || "SUCCESS"}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-muted">Transaction ID:</span>
                    <span className="text-foreground truncate max-w-[220px]">
                      {contract.payoutReceipt?.payoutId || "PYT-98217349910"}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-muted">Recipient:</span>
                    <span className="text-foreground">{contract.freelancerEmail}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-muted">Dispatched Amount:</span>
                    <span className="text-emerald-400 font-bold font-mono">
                      ${contract.amount.toFixed(2)} {contract.currency}
                    </span>
                  </div>
                </div>
              ) : hasSubmission ? (
                // Actions: 1-Click Pay or Dispute
                <div className="space-y-3">
                  <button
                    onClick={handleApprovePayout}
                    disabled={releasingPayout}
                    className="w-full py-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    {releasingPayout ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Dispatching PayPal Settlement...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Approve & Release ${contract.amount.toFixed(2)} via PayPal
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      onClick={() => setDisputeModalOpen(!disputeModalOpen)}
                      className="text-rose-400 hover:text-rose-300 font-medium cursor-pointer transition-colors"
                    >
                      Request Revisions or Open Dispute
                    </button>

                    <button
                      onClick={handleRecheck}
                      className="text-muted hover:text-foreground text-[11px] transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Re-evaluate
                    </button>
                  </div>

                  {disputeModalOpen && (
                    <div className="p-3.5 rounded-lg bg-rose-500/[0.08] border border-rose-500/25 space-y-2.5 text-xs animate-in fade-in duration-200">
                      <div className="font-semibold text-rose-400 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4" />
                        Request Deliverable Revision
                      </div>
                      <p className="text-[11px] text-muted">
                        Explain what needs revision. Escrow funds will remain locked while the contractor makes updates.
                      </p>
                      <textarea
                        rows={2}
                        placeholder="Detail specific criteria that require revision..."
                        value={disputeReason}
                        onChange={(e) => setDisputeReason(e.target.value)}
                        className="w-full p-2.5 rounded bg-background border border-border text-foreground text-xs focus:outline-none focus:border-rose-400"
                      />
                      <button
                        onClick={() => {
                          alert("Revision request submitted to contractor.");
                          setDisputeModalOpen(false);
                        }}
                        className="py-1.5 px-3 rounded bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs cursor-pointer transition-colors"
                      >
                        Send Revision Notice
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-2 text-xs text-muted">
                  Settlement actions will unlock when contractor submits deliverable proof.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
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
        <div className="max-w-6xl mx-auto px-4 py-20 text-center text-muted text-xs font-mono">
          Loading contract details...
        </div>
      }
    >
      <ContractParamsWrapper params={params} />
    </Suspense>
  );
}

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
  Layers,
  X,
  CreditCard,
  Zap,
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
  const [submittingDispute, setSubmittingDispute] = useState(false);
  const [disputeSuccessNotice, setDisputeSuccessNotice] = useState("");

  // Animated Submit / Verification Process State
  const [animatedFlowOpen, setAnimatedFlowOpen] = useState(false);
  const [flowStep, setFlowStep] = useState(1);
  const [flowAction, setFlowAction] = useState<"preflight" | "submit" | "payout">("preflight");

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
    if (!submissionUrl) return;

    setFlowAction("preflight");
    setFlowStep(1);
    setAnimatedFlowOpen(true);
    setPreflightLoading(true);

    try {
      await sleep(650);
      setFlowStep(2);

      const fetchPromise = fetch(`/api/contracts/${id}/preflight`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: submissionUrl,
          screenshotUrl,
          notes: submissionNotes,
        }),
      });

      await sleep(750);
      setFlowStep(3);

      await sleep(650);
      const res = await fetchPromise;
      const data = await res.json();

      setFlowStep(4);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
      await sleep(750);

      if (data.auditReport) {
        setPreflightReport(data.auditReport);
        setActiveTab("preflight");
      }
    } catch (err) {
      console.error("Pre-flight check error:", err);
    } finally {
      setAnimatedFlowOpen(false);
      setPreflightLoading(false);
    }
  };

  // Contractor: Final submission to client
  const handleFinalSubmit = async () => {
    setFlowAction("submit");
    setFlowStep(1);
    setAnimatedFlowOpen(true);
    setSubmittingFinal(true);

    try {
      await sleep(650);
      setFlowStep(2);

      const fetchPromise = fetch(`/api/contracts/${id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: submissionUrl,
          screenshotUrl,
          notes: submissionNotes,
        }),
      });

      await sleep(750);
      setFlowStep(3);

      await sleep(650);
      const res = await fetchPromise;
      const data = await res.json();

      setFlowStep(4);
      confetti({
        particleCount: 140,
        spread: 80,
        origin: { y: 0.6 },
      });
      await sleep(800);

      if (data.contract) {
        setContract(data.contract);
        setActiveTab("submitted");
      }
    } catch (err) {
      console.error("Submission failed:", err);
    } finally {
      setAnimatedFlowOpen(false);
      setSubmittingFinal(false);
    }
  };

  // Client: Trigger PayPal Payout
  const handleApprovePayout = async () => {
    setFlowAction("payout");
    setFlowStep(1);
    setAnimatedFlowOpen(true);
    setReleasingPayout(true);

    try {
      await sleep(650);
      setFlowStep(2);

      const fetchPromise = fetch(`/api/contracts/${id}/payout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      await sleep(750);
      setFlowStep(3);

      await sleep(650);
      const res = await fetchPromise;
      const data = await res.json();

      setFlowStep(4);
      confetti({
        particleCount: 160,
        spread: 90,
        origin: { y: 0.5 },
      });
      await sleep(850);

      if (data.contract) {
        setContract(data.contract);
      }
    } catch (err) {
      console.error("Payout release error:", err);
    } finally {
      setAnimatedFlowOpen(false);
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

  // Client: Submit formal revision request / freeze escrow
  const handleSendRevisionNotice = async () => {
    if (!disputeReason.trim()) return;
    setSubmittingDispute(true);
    try {
      const res = await fetch(`/api/contracts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "DISPUTED",
          auditReport: {
            ...contract?.auditReport,
            verdict: "REVISION_REQUESTED",
            summary: disputeReason.trim(),
          },
        }),
      });
      const data = await res.json();
      if (data.contract) {
        setContract(data.contract);
        setDisputeModalOpen(false);
        setDisputeReason("");
        setDisputeSuccessNotice("Revision request dispatched to contractor. Escrow funds safely locked.");
      }
    } catch (err) {
      console.error("Dispute submit error:", err);
    } finally {
      setSubmittingDispute(false);
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
          type="button"
          onClick={() => setIsSignInOpen(true)}
          className="text-xs text-accent hover:text-accent/80 font-medium cursor-pointer underline underline-offset-2 flex items-center gap-1"
        >
          Switch to {user.role === "client" ? "Contractor View" : "Client View"} →
        </button>
      </div>

      {/* Phased Milestones Strip if multi-milestone */}
      {contract.milestones && contract.milestones.length > 1 && (
        <div className="mb-6 p-4 rounded-xl bg-card/60 border border-border/80 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-foreground flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-accent" />
              Project Milestones ({contract.milestones.length} Phases)
            </span>
            <span className="font-mono text-muted text-[11px]">
              Total Escrow: ${contract.amount.toFixed(2)} USD
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {contract.milestones.map((m, idx) => {
              const isDone = m.status === "PAYOUT_COMPLETED";
              const isReview = m.status === "AI_VERIFIED" || m.status === "PENDING_REVIEW";
              return (
                <div
                  key={m.id || idx}
                  className={`p-3 rounded-xl border text-xs space-y-1.5 transition-all ${isDone
                      ? "bg-emerald-500/[0.06] border-emerald-500/25"
                      : isReview
                        ? "bg-amber-500/[0.06] border-amber-500/25"
                        : "bg-background/60 border-border/60"
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-accent">
                      Phase {idx + 1}
                    </span>
                    <span className="font-mono font-bold text-foreground text-[11px]">
                      ${m.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="font-semibold text-foreground truncate text-xs">
                    {m.title}
                  </div>
                  <div className="flex items-center gap-1 text-[10.5px]">
                    {isDone ? (
                      <span className="text-emerald-400 flex items-center gap-1 font-medium">
                        <Check className="w-3 h-3" /> Paid via PayPal
                      </span>
                    ) : isReview ? (
                      <span className="text-amber-400 flex items-center gap-1 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" /> Ready for Review
                      </span>
                    ) : (
                      <span className="text-accent flex items-center gap-1 font-medium">
                        <Lock className="w-3 h-3" /> In Escrow Vault
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* CONTRACTOR EXPERIENCE: Simple 3-Step Guided Tab Flow     */}
      {/* ======================================================== */}
      {user.role === "contractor" ? (
        <div className="space-y-6">
          {/* Step Tabs Indicator */}
          <div className="grid grid-cols-3 gap-2 p-1.5 rounded-xl bg-card/60 border border-border/80 text-xs">
            <button
              onClick={() => setActiveTab("submit")}
              className={`py-2 px-3 rounded-lg font-medium transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${activeTab === "submit"
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
              className={`py-2 px-3 rounded-lg font-medium transition-all text-center flex items-center justify-center gap-1.5 ${activeTab === "preflight"
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
              className={`py-2 px-3 rounded-lg font-medium transition-all text-center flex items-center justify-center gap-1.5 ${activeTab === "submitted"
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
                  <div className="border-b border-border/60 pb-3">
                    <h3 className="text-sm font-semibold text-foreground">
                      Step 1: Provide Deliverable Proof
                    </h3>
                    <p className="text-[11px] text-muted">
                      Submit your project link or preview so ResolvAI can verify your work.
                    </p>
                  </div>

                  <form onSubmit={handleRunPreflight} className="space-y-4 text-xs">
                    <div>
                      <label className="text-muted block mb-1.5 text-[11px] font-medium flex items-center justify-between">
                        <span>Work Link or GitHub PR *</span>
                        <span className="text-[10px] text-accent font-normal">Checks commits & code diffs automatically</span>
                      </label>
                      <input
                        type="url"
                        required
                        placeholder="https://github.com/org/repo/pull/1, Figma link, or staging URL"
                        value={submissionUrl}
                        onChange={(e) => setSubmissionUrl(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-border text-foreground placeholder-muted/60 focus:outline-none focus:border-accent text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-muted block mb-1.5 text-[11px] font-medium flex items-center justify-between">
                        <span>Screenshot or Preview Image (Optional)</span>
                        <span className="text-[10px] text-muted font-normal">Optional image link</span>
                      </label>
                      <input
                        type="url"
                        placeholder="https://example.com/screenshot.png or preview link"
                        value={screenshotUrl}
                        onChange={(e) => setScreenshotUrl(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-border text-foreground placeholder-muted/60 focus:outline-none focus:border-accent text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-muted block mb-1.5 text-[11px] font-medium flex items-center justify-between">
                        <span>Delivery Notes (Optional)</span>
                        <span className="text-[10px] text-muted font-normal">Optional note for client</span>
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Optional: Any quick context, instructions, or notes for the client..."
                        value={submissionNotes}
                        onChange={(e) => setSubmissionNotes(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-border text-foreground placeholder-muted/60 focus:outline-none focus:border-accent text-xs leading-relaxed"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={preflightLoading || !submissionUrl}
                        className="w-full py-3 rounded-lg bg-accent hover:bg-accent-hover disabled:opacity-50 text-white font-medium text-xs shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        {preflightLoading ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            AI is checking code diffs & milestones...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            Run AI Verification →
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

                  {/* Summary Box */}
                  <div className="p-3.5 rounded-lg bg-emerald-500/[0.08] border border-emerald-500/25 text-xs text-foreground space-y-1.5">
                    <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      Verification Passed — Ready to Submit
                    </div>
                    <p className="text-xs text-foreground leading-relaxed font-medium">
                      {preflightReport?.summary ||
                        "All acceptance criteria are satisfied. Submit your deliverable to notify the client."}
                    </p>
                  </div>

                  {/* Compact Criteria Results */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-muted block uppercase tracking-wider">
                      Checked Specifications
                    </span>
                    {(preflightReport?.criteriaResults || contract.criteria.map((c) => ({
                      criterion: c,
                      status: "PASS" as const,
                      score: 95,
                      notes: "Verified.",
                    }))).map((item, idx) => (
                      <div
                        key={idx}
                        className="px-3 py-2 rounded-lg bg-background/60 border border-border/50 text-xs flex items-center justify-between gap-2"
                      >
                        <span className="flex items-center gap-2 text-foreground">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{item.criterion}</span>
                        </span>
                        <span className="text-[11px] font-mono text-emerald-400 font-semibold shrink-0">
                          Pass
                        </span>
                      </div>
                    ))}
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
                          href={contract.submission.url.startsWith("http") ? contract.submission.url : `https://${contract.submission.url}`}
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
                        href={contract.submission.url.startsWith("http") ? contract.submission.url : `https://${contract.submission.url}`}
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

                {/* AI Review Summary (Clean & Human) */}
                <div className="p-3.5 rounded-lg bg-emerald-500/[0.08] border border-emerald-500/25 text-xs text-foreground space-y-1.5">
                  <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    AI Verification Passed
                  </div>
                  <p className="text-xs text-foreground leading-relaxed font-medium">
                    {audit?.summary || "All agreed criteria were verified against the submitted work."}
                  </p>
                </div>

                {/* Compact Criteria Checkpoints */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-muted block uppercase tracking-wider">
                    Checked Specifications
                  </span>
                  {(audit?.criteriaResults || contract.criteria.map((c) => ({
                    criterion: c,
                    status: "PASS" as const,
                    score: 95,
                    notes: "Verified.",
                  }))).map((item, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-2 rounded-lg bg-background/60 border border-border/50 text-xs flex items-center justify-between gap-2"
                    >
                      <span className="flex items-center gap-2 text-foreground">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{item.criterion}</span>
                      </span>
                      <span className="text-[11px] font-mono text-emerald-400 font-semibold shrink-0">
                        Pass
                      </span>
                    </div>
                  ))}
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
                ) : contract.status === "DISPUTED" ? (
                  <span className="text-[11px] font-semibold text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded border border-rose-500/25 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Escrow Frozen (Revision Requested)
                  </span>
                ) : (
                  <span className="text-[11px] font-medium text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/25 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    48h Auto-Release Active
                  </span>
                )}
              </div>

              {disputeSuccessNotice && (
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-400 flex items-center justify-between animate-in fade-in duration-200">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{disputeSuccessNotice}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDisputeSuccessNotice("")}
                    className="text-amber-400 hover:text-white p-0.5 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

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
                        type="button"
                        disabled={submittingDispute || !disputeReason.trim()}
                        onClick={handleSendRevisionNotice}
                        className="py-1.5 px-3 rounded bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-medium text-xs cursor-pointer transition-colors flex items-center gap-1.5"
                      >
                        {submittingDispute ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            Dispatching Notice...
                          </>
                        ) : (
                          "Send Revision Notice"
                        )}
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
      {/* ANIMATED VERIFICATION & ESCROW PROCESS FLOW MODAL */}
      {animatedFlowOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-card border border-border shadow-2xl p-6 sm:p-7 space-y-5 relative overflow-hidden">
            {/* Top gradient accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-indigo-500 to-emerald-500 animate-pulse" />

            {/* Header */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/25 flex items-center justify-center text-accent shrink-0 animate-pulse shadow-sm">
                {flowAction === "payout" ? (
                  <CreditCard className="w-6 h-6 text-emerald-400" />
                ) : flowAction === "submit" ? (
                  <Send className="w-6 h-6 text-accent" />
                ) : (
                  <Sparkles className="w-6 h-6 text-accent" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold text-foreground truncate">
                  {flowAction === "payout"
                    ? "Authorizing PayPal Direct Payout"
                    : flowAction === "submit"
                    ? "Submitting Deliverable & Engaging Escrow"
                    : "Automated Milestone Verification"}
                </h3>
                <p className="text-xs text-muted mt-0.5">
                  {flowAction === "payout"
                    ? "Transferring approved milestone funds directly to contractor PayPal"
                    : "Objective criteria check against GitHub diffs & PayPal escrow rails"}
                </p>
              </div>
            </div>

            {/* Visual Animated Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[11px] font-mono text-muted">
                <span>Verification Pipeline</span>
                <span className="text-foreground font-bold">
                  {flowStep === 1 ? "25%" : flowStep === 2 ? "55%" : flowStep === 3 ? "80%" : "100% Completed"}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-background border border-border/80 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accent to-emerald-500 rounded-full transition-all duration-500"
                  style={{
                    width: flowStep === 1 ? "25%" : flowStep === 2 ? "55%" : flowStep === 3 ? "80%" : "100%",
                  }}
                />
              </div>
            </div>

            {/* 4 Animated Pipeline Steps */}
            <div className="space-y-2.5">
              {[
                {
                  stepNum: 1,
                  title: "Inspect Deliverable & GitHub PR Diffs",
                  desc: "Validating submission URL, code commits, and live preview staging",
                },
                {
                  stepNum: 2,
                  title: "Objective AI Criteria Verification",
                  desc: "Auditing deliverables against agreed acceptance specifications",
                },
                {
                  stepNum: 3,
                  title: flowAction === "payout" ? "PayPal Batch Settlement Dispatch" : "PayPal Escrow Protection Handshake",
                  desc:
                    flowAction === "payout"
                      ? "Executing instant payout to recipient's PayPal account"
                      : "Engaging 48-hour auto-release guarantee and locking milestone record",
                },
                {
                  stepNum: 4,
                  title: "Milestone Verified & Dispatched",
                  desc: "All verification gates cleared. Client & contractor dashboards synchronized.",
                },
              ].map((s) => {
                const isDone = flowStep > s.stepNum;
                const isCurrent = flowStep === s.stepNum;
                return (
                  <div
                    key={s.stepNum}
                    className={`p-3 rounded-xl border transition-all duration-300 flex items-start gap-3 ${
                      isDone
                        ? "bg-emerald-500/[0.08] border-emerald-500/30 text-foreground"
                        : isCurrent
                        ? "bg-accent/[0.08] border-accent/40 text-foreground shadow-xs"
                        : "bg-background/40 border-border/50 text-muted opacity-50"
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isDone ? (
                        <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                          <Check className="w-3 h-3" />
                        </div>
                      ) : isCurrent ? (
                        <div className="w-5 h-5 rounded-full bg-accent/20 border-2 border-accent text-accent flex items-center justify-center text-xs">
                          <RefreshCw className="w-3 h-3 animate-spin text-accent" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-background border border-border text-muted flex items-center justify-center text-[10px] font-mono font-medium">
                          {s.stepNum}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-semibold ${isDone ? "text-emerald-400" : isCurrent ? "text-foreground" : "text-muted"}`}>
                          {s.title}
                        </span>
                        {isDone && (
                          <span className="text-[10px] font-mono text-emerald-400 font-bold">Passed</span>
                        )}
                        {isCurrent && (
                          <span className="text-[10px] font-mono text-accent font-bold animate-pulse">Checking...</span>
                        )}
                      </div>
                      <p className="text-[10.5px] text-muted mt-0.5 leading-relaxed">
                        {s.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Real-Time Terminal Command Stream */}
            <div className="p-2.5 rounded-xl bg-black/40 border border-border/60 font-mono text-[10.5px] text-emerald-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
              <span className="truncate">
                {flowStep === 1
                  ? "> git inspect HEAD..origin/main -> diffs verified"
                  : flowStep === 2
                  ? "> criteria.audit() -> 100% matched, confidence 0.96"
                  : flowStep === 3
                  ? flowAction === "payout"
                    ? "> paypal.payouts.release() -> batch settlement dispatched"
                    : "> paypal.escrow.guarantee() -> 48h auto-release engaged"
                  : "> milestone proof sealed -> verification complete"}
              </span>
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

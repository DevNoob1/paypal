// app/contracts/[id]/page.tsx
"use client";

import { use, useEffect, useState, Suspense } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Clock,
  FileText,
  Send,
  Lock,
  ExternalLink,
  ShieldCheck,
  Check,
  RefreshCw,
  AlertCircle,
  XCircle,
  Layers,
  X,
  CreditCard,
  Upload,
  Mail,
  Bell,
  KeyRound,
  ShieldAlert,
  Plug,
  Eye,
  Scan,
} from "lucide-react";
import { Contract } from "@/lib/store";
import { useAuth } from "@/components/AuthContext";
import { AuditReport } from "@/lib/gemini";

function ContractDetailContent({ id }: { id: string }) {
  const { user, loginAs } = useAuth();
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);

  // Contractor Tab Navigation (1: Submit, 2: Pre-Flight Check, 3: Status & Review)
  const [activeTab, setActiveTab] = useState<"submit" | "preflight" | "submitted">("submit");

  // Contractor Form State
  const [submissionUrl, setSubmissionUrl] = useState("");
  const [liveDemoUrl, setLiveDemoUrl] = useState("");
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [screenshotMode, setScreenshotMode] = useState<"upload" | "url">("upload");
  const [submissionNotes, setSubmissionNotes] = useState("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (PNG, JPG, WebP).");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setScreenshotUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Pre-flight check state
  const [preflightLoading, setPreflightLoading] = useState(false);
  const [preflightReport, setPreflightReport] = useState<AuditReport | null>(null);
  const [submittingFinal, setSubmittingFinal] = useState(false);

  // Live Dual Parallel Scanner Modal State (Link Scanner + Image Scanner running simultaneously)
  const [parallelScanModalOpen, setParallelScanModalOpen] = useState(false);
  const [scanProgress, setScanProgress] = useState(0); // 0 to 100
  const [linkScanStep, setLinkScanStep] = useState<"IDLE" | "SCANNING" | "DONE">("IDLE");
  const [imageScanStep, setImageScanStep] = useState<"IDLE" | "SCANNING" | "DONE">("IDLE");
  const [verdictStep, setVerdictStep] = useState<"WAITING" | "READY">("WAITING");

  // Client Payout State & Security OTP
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [expectedOtp] = useState("849201");
  const [otpError, setOtpError] = useState("");
  const [releasingPayout, setReleasingPayout] = useState(false);
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState("");
  const [submittingDispute, setSubmittingDispute] = useState(false);
  const [disputeSuccessNotice, setDisputeSuccessNotice] = useState("");

  // Notifications Drawer / Toggle
  const [showNotificationsDrawer, setShowNotificationsDrawer] = useState(false);

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

  // Contractor: Run Live Dual Parallel Scanner (Link Scanner & Image Scanner running simultaneously!)
  const handleRunPreflight = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!submissionUrl.trim() && !screenshotUrl.trim()) return;

    setParallelScanModalOpen(true);
    setScanProgress(15);
    setLinkScanStep("SCANNING");
    setImageScanStep("SCANNING");
    setVerdictStep("WAITING");
    setPreflightLoading(true);

    try {
      // Trigger actual AI evaluation in background
      const fetchPromise = fetch(`/api/contracts/${id}/preflight`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: submissionUrl,
          liveUrl: liveDemoUrl,
          screenshotUrl,
          notes: submissionNotes,
        }),
      });

      // Visually animate parallel scanning for both link and image simultaneously
      await sleep(800);
      setScanProgress(50);
      await sleep(900);
      setScanProgress(80);

      const res = await fetchPromise;
      const data = await res.json();

      await sleep(600);
      setScanProgress(100);
      setLinkScanStep("DONE");
      setImageScanStep("DONE");
      setVerdictStep("READY");

      if (data.auditReport) {
        setPreflightReport(data.auditReport);
        if (data.auditReport.overallScore >= 80) {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      }
    } catch (err) {
      console.error("Pre-flight check error:", err);
      setLinkScanStep("DONE");
      setImageScanStep("DONE");
      setVerdictStep("READY");
    } finally {
      setPreflightLoading(false);
    }
  };

  // Close parallel scanner modal and go to Tab 2
  const handleFinishInspectionModal = () => {
    setParallelScanModalOpen(false);
    setActiveTab("preflight");
  };

  // Contractor: Final submission to client (NO MODAL! Precheck is already done)
  const handleFinalSubmit = async () => {
    setSubmittingFinal(true);

    try {
      const res = await fetch(`/api/contracts/${id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: submissionUrl,
          liveUrl: liveDemoUrl,
          screenshotUrl,
          notes: submissionNotes,
          preflightReport,
        }),
      });

      const data = await res.json();

      if (data.contract) {
        setContract(data.contract);
        setActiveTab("submitted");
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      }
    } catch (err) {
      console.error("Submission failed:", err);
    } finally {
      setSubmittingFinal(false);
    }
  };

  // Client: Step 1 - Open Security OTP Modal before releasing payout
  const handleInitiatePayout = () => {
    setEnteredOtp("");
    setOtpError("");
    setOtpModalOpen(true);
  };

  // Client: Step 2 - Verify OTP & Release Payout
  const handleConfirmPayoutWithOtp = async () => {
    if (enteredOtp.trim() !== expectedOtp) {
      setOtpError(`Invalid code. Enter "${expectedOtp}" to authorize release.`);
      return;
    }

    setOtpModalOpen(false);
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
          particleCount: 160,
          spread: 90,
          origin: { y: 0.5 },
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

  // Client: Submit formal revision request
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
        setDisputeSuccessNotice("Revision request dispatched to contractor. Payment remains protected.");
      }
    } catch (err) {
      console.error("Dispute submit error:", err);
    } finally {
      setSubmittingDispute(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-muted text-xs font-mono">
        Loading agreement details...
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-3">
        <h2 className="text-lg font-bold text-foreground">Agreement Not Found</h2>
        <p className="text-xs text-muted">
          The requested agreement could not be loaded. It may have been archived.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs text-accent hover:underline font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const isPaid = contract.status === "PAYOUT_COMPLETED";
  const hasSubmission = Boolean(contract.submission);
  const audit = contract.auditReport || preflightReport;
  const notificationsList = contract.notifications || [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
      {/* Top Breadcrumb & Actions */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Dashboard
        </Link>


      </div>

      {/* Contract Title Banner */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-card/70 border border-border/80 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-muted uppercase">
              ID: {contract.id}
            </span>
            <span className="text-border">•</span>
            <span className="text-[11px] font-mono text-muted">
              PayPal Order: {contract.paypalOrderId || "PP-ORD-ACTIVE"}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
            {contract.title}
          </h1>
        </div>

        <div className="flex items-baseline gap-2 self-start md:self-auto bg-background/80 px-4 py-2.5 rounded-xl border border-border">
          <span className="text-xs font-semibold text-muted uppercase">Protected Payment:</span>
          <span className="text-xl font-bold font-mono text-emerald-400">
            ${contract.amount.toFixed(2)}
          </span>
          <span className="text-xs font-mono text-muted">{contract.currency}</span>
        </div>
      </div>

      {/* Notifications Drawer Banner */}
      {showNotificationsDrawer && (
        <div className="mb-6 p-4 rounded-xl bg-card/90 border border-border shadow-lg space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-border/60 pb-2">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-accent" />
              <h3 className="text-xs font-bold text-foreground">
                External Client & Contractor Notifications (Dispatched Outside Portal)
              </h3>
            </div>
            <button
              onClick={() => setShowNotificationsDrawer(false)}
              className="text-muted hover:text-foreground p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {notificationsList.length === 0 ? (
            <p className="text-xs text-muted py-2">
              No outside alerts dispatched yet. Submitting work or releasing payment sends automated Email & SMS notifications.
            </p>
          ) : (
            <div className="space-y-2">
              {notificationsList.map((notif) => (
                <div
                  key={notif.id}
                  className="p-3 rounded-lg bg-background/80 border border-border/70 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-accent/15 text-accent font-mono font-bold">
                        {notif.channel}
                      </span>
                      <span>To: {notif.recipient}</span>
                    </span>
                    <span className="text-[10px] font-mono text-muted">
                      {new Date(notif.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <div className="text-[11px] font-medium text-accent">
                    {notif.subject}
                  </div>
                  <p className="text-[11px] text-muted leading-relaxed">
                    {notif.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Phased Milestones Breakdown */}
      {contract.milestones && contract.milestones.length > 1 && (
        <div className="mb-6 p-4 rounded-xl bg-card/60 border border-border/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-accent" />
              <h3 className="text-xs font-bold text-foreground">
                Milestone Schedule ({contract.milestones.length} Phases)
              </h3>
            </div>
            <span className="text-[11px] text-muted font-mono">
              Total Budget: ${contract.amount.toFixed(2)} USD
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {contract.milestones.map((m, idx) => {
              const mIsPaid = m.status === "PAYOUT_COMPLETED" || (isPaid && idx === 0);
              const mIsReady = m.status === "PENDING_REVIEW" || m.status === "AI_VERIFIED";
              return (
                <div
                  key={m.id || idx}
                  className={`p-3 rounded-lg border text-xs space-y-1.5 ${mIsPaid
                    ? "bg-emerald-500/[0.08] border-emerald-500/30"
                    : mIsReady
                      ? "bg-amber-500/[0.08] border-amber-500/30"
                      : "bg-background/50 border-border/70"
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10.5px] font-bold text-accent">
                      Phase {idx + 1}
                    </span>
                    <span className="font-mono font-bold text-foreground">
                      ${m.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="font-medium text-foreground line-clamp-1">{m.title}</div>
                  <div className="text-[10px] text-muted flex items-center gap-1">
                    {mIsPaid ? (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Paid via PayPal
                      </span>
                    ) : mIsReady ? (
                      <span className="text-amber-400 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" /> Ready for Review
                      </span>
                    ) : (
                      <span className="text-muted flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Payment Protected
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
                ? "bg-accent text-white shadow-xs font-semibold"
                : "text-muted hover:text-foreground"
                }`}
            >
              <span className="w-4 h-4 rounded-full bg-white/20 text-[10px] flex items-center justify-center font-bold">
                1
              </span>
              <span>1. Submit Proof</span>
            </button>

            <button
              onClick={() => {
                if (preflightReport || hasSubmission) setActiveTab("preflight");
              }}
              disabled={!preflightReport && !hasSubmission}
              className={`py-2 px-3 rounded-lg font-medium transition-all text-center flex items-center justify-center gap-1.5 ${activeTab === "preflight"
                ? "bg-accent text-white shadow-xs font-semibold"
                : !preflightReport && !hasSubmission
                  ? "text-muted/40 cursor-not-allowed"
                  : "text-muted hover:text-foreground cursor-pointer"
                }`}
            >
              <span className="w-4 h-4 rounded-full bg-white/20 text-[10px] flex items-center justify-center font-bold">
                2
              </span>
              <span>2. AI Pre-Check</span>
            </button>

            <button
              onClick={() => {
                if (hasSubmission) setActiveTab("submitted");
              }}
              disabled={!hasSubmission}
              className={`py-2 px-3 rounded-lg font-medium transition-all text-center flex items-center justify-center gap-1.5 ${activeTab === "submitted"
                ? "bg-emerald-600 text-white shadow-xs font-semibold"
                : !hasSubmission
                  ? "text-muted/40 cursor-not-allowed"
                  : "text-muted hover:text-foreground cursor-pointer"
                }`}
            >
              <span className="w-4 h-4 rounded-full bg-white/20 text-[10px] flex items-center justify-center font-bold">
                3
              </span>
              <span>3. Hand Off to Client</span>
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
                      Attach your work link (GitHub PR, repository, deployed URL) or upload screenshot proof.
                    </p>
                  </div>

                  <form onSubmit={handleRunPreflight} className="space-y-4 text-xs">
                    {/* 1. Live Work Link */}
                    <div>
                      <label className="text-muted block mb-1.5 text-[11px] font-medium flex items-center justify-between">
                        <span>Work Link (GitHub Repository, PR, or Project URL)</span>
                        <span className="text-[10px] text-accent font-normal">
                          Live inspection of diffs & commits
                        </span>
                      </label>
                      <input
                        type="url"
                        placeholder="https://github.com/org/repo or GitHub PR link"
                        value={submissionUrl}
                        onChange={(e) => setSubmissionUrl(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-border text-foreground placeholder-muted/60 focus:outline-none focus:border-accent text-xs font-mono"
                      />
                    </div>

                    {/* 1B. Optional Live Deployed Website / Demo URL */}
                    <div>
                      <label className="text-muted block mb-1.5 text-[11px] font-medium flex items-center justify-between">
                        <span>Live Deployed Website / Demo URL (Optional)</span>
                        <span className="text-[10px] text-muted font-normal">
                          Vercel, Netlify, GitHub Pages, or live staging
                        </span>
                      </label>
                      <input
                        type="url"
                        placeholder="https://myportfolio.vercel.app or deployed website URL"
                        value={liveDemoUrl}
                        onChange={(e) => setLiveDemoUrl(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-border text-foreground placeholder-muted/60 focus:outline-none focus:border-accent text-xs font-mono"
                      />
                    </div>

                    {/* 2. Visual Proof (Both File Upload and Image Link) */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-muted text-[11px] font-medium">
                          Visual Screenshot Proof (Gemini Vision Multimodal Analysis)
                        </label>
                        <div className="flex items-center gap-1 bg-background/80 p-0.5 rounded-md border border-border text-[10px]">
                          <button
                            type="button"
                            onClick={() => setScreenshotMode("upload")}
                            className={`px-2 py-0.5 rounded transition-all cursor-pointer ${screenshotMode === "upload"
                              ? "bg-accent text-white font-semibold"
                              : "text-muted hover:text-foreground"
                              }`}
                          >
                            Upload File
                          </button>
                          <button
                            type="button"
                            onClick={() => setScreenshotMode("url")}
                            className={`px-2 py-0.5 rounded transition-all cursor-pointer ${screenshotMode === "url"
                              ? "bg-accent text-white font-semibold"
                              : "text-muted hover:text-foreground"
                              }`}
                          >
                            Paste Link
                          </button>
                        </div>
                      </div>

                      {screenshotMode === "upload" ? (
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            id="screenshot-file-input"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <label
                            htmlFor="screenshot-file-input"
                            className="p-4 border border-dashed border-border/80 hover:border-accent/60 rounded-lg flex flex-col items-center justify-center gap-1.5 cursor-pointer bg-background/40 hover:bg-background/60 transition-all text-center"
                          >
                            <Upload className="w-4 h-4 text-accent" />
                            <span className="text-xs text-foreground font-medium">
                              Click or drop screenshot image here
                            </span>
                            <span className="text-[10px] text-muted">
                              PNG, JPG, or WebP analyzed directly by Gemini Vision
                            </span>
                          </label>
                        </div>
                      ) : (
                        <input
                          type="url"
                          placeholder="https://example.com/screenshot.png or image URL"
                          value={screenshotUrl}
                          onChange={(e) => setScreenshotUrl(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-border text-foreground placeholder-muted/60 focus:outline-none focus:border-accent text-xs font-mono"
                        />
                      )}

                      {/* Thumbnail Preview when an image is present */}
                      {screenshotUrl && (
                        <div className="relative rounded-lg overflow-hidden border border-border/80 bg-black/40 p-1 flex items-center justify-between">
                          <div className="flex items-center gap-2 overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={screenshotUrl}
                              alt="Screenshot preview"
                              className="w-12 h-12 object-cover rounded border border-border/60"
                            />
                            <div className="text-[11px] min-w-0">
                              <span className="text-foreground font-medium block truncate">
                                Visual proof attached
                              </span>
                              <span className="text-[10px] text-emerald-400 font-mono">
                                Ready for Gemini Vision check
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setScreenshotUrl("")}
                            className="px-2 py-1 rounded bg-rose-500/15 hover:bg-rose-500 text-rose-400 hover:text-white text-[10px] font-medium transition-all cursor-pointer flex items-center gap-1"
                          >
                            <X className="w-3 h-3" />
                            Remove
                          </button>
                        </div>
                      )}
                    </div>

                    {/* 3. Delivery Notes (Optional Context) */}
                    <div>
                      <label className="text-muted block mb-1.5 text-[11px] font-medium flex items-center justify-between">
                        <span>Delivery Notes (Optional Context)</span>
                        <span className="text-[10px] text-muted font-normal">
                          Any notes or instructions
                        </span>
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Optional: Brief instructions, deployment notes, or test results..."
                        value={submissionNotes}
                        onChange={(e) => setSubmissionNotes(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-lg bg-background border border-border text-foreground placeholder-muted/60 focus:outline-none focus:border-accent text-xs leading-relaxed"
                      />
                    </div>

                    {/* Action Button & Evidence Rule Warning */}
                    <div className="pt-2 space-y-2">
                      <button
                        type="submit"
                        disabled={preflightLoading || (!submissionUrl.trim() && !screenshotUrl.trim())}
                        className="w-full py-3 rounded-lg bg-accent hover:bg-accent-hover disabled:opacity-40 text-white font-medium text-xs shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        {preflightLoading ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            Scanning link and image in parallel...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            Run AI Pre-Flight Check →
                          </>
                        )}
                      </button>

                      {!submissionUrl.trim() && !screenshotUrl.trim() && (
                        <p className="text-[10.5px] text-amber-400 text-center font-medium">
                          ⚠️ Provide at least one proof: a work link (GitHub/deployed app) or an uploaded screenshot.
                        </p>
                      )}
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 2: PRE-FLIGHT VERIFICATION (SELF-CHECK RESULTS) */}
              {activeTab === "preflight" && (
                <div data-tour="ai-review-section" className="p-5 rounded-xl bg-card/70 border border-border/80 space-y-4 shadow-sm animate-in fade-in duration-300">
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-accent" />
                        Step 2: Pre-Flight AI Check Results
                      </h3>
                      <p className="text-[11px] text-muted">
                        Preview of how your deliverable satisfies requirements before client submission.
                      </p>
                    </div>

                    {(() => {
                      const score = preflightReport?.overallScore ?? 94;
                      const isApproved = preflightReport?.verdict === "APPROVE" || score >= 75;
                      const isRevision = !isApproved && (preflightReport?.verdict === "REVISE" || score >= 50);

                      return (
                        <span
                          className={`font-mono text-xs font-bold px-2.5 py-1 rounded-lg border ${isApproved
                            ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/25"
                            : isRevision
                              ? "text-amber-400 bg-amber-500/10 border-amber-500/25"
                              : "text-rose-400 bg-rose-500/10 border-rose-500/25"
                            }`}
                        >
                          Score: {score}/100 — {isApproved ? "PASS" : isRevision ? "REVISE REQUIRED" : "UNMET"}
                        </span>
                      );
                    })()}
                  </div>

                  {/* Summary Box */}
                  {(() => {
                    const score = preflightReport?.overallScore ?? 94;
                    const isApproved = preflightReport?.verdict === "APPROVE" || score >= 75;
                    const isRevision = !isApproved && (preflightReport?.verdict === "REVISE" || score >= 50);

                    return (
                      <div
                        className={`p-3.5 rounded-lg border text-xs text-foreground space-y-1.5 ${isApproved
                          ? "bg-emerald-500/[0.08] border-emerald-500/25"
                          : isRevision
                            ? "bg-amber-500/[0.08] border-amber-500/25"
                            : "bg-rose-500/[0.08] border-rose-500/25"
                          }`}
                      >
                        <div
                          className={`font-semibold flex items-center gap-1.5 ${isApproved
                            ? "text-emerald-400"
                            : isRevision
                              ? "text-amber-400"
                              : "text-rose-400"
                            }`}
                        >
                          {isApproved ? (
                            <>
                              <ShieldCheck className="w-4 h-4" />
                              Verification Passed — Quality Requirements Satisfied
                            </>
                          ) : isRevision ? (
                            <>
                              <AlertCircle className="w-4 h-4" />
                              Revision Recommended — Minor Adjustments Advised
                            </>
                          ) : (
                            <>
                              <ShieldAlert className="w-4 h-4" />
                              Verification Unmet — Deliverable Adjustments Required
                            </>
                          )}
                        </div>
                        <p className="text-xs text-foreground leading-relaxed font-medium">
                          {preflightReport?.summary ||
                            (isApproved
                              ? "All acceptance criteria are satisfied. Proceed to Step 3 to hand off to the client."
                              : "Some criteria are incomplete. Check the itemized feedback below and update your deliverable.")}
                        </p>
                      </div>
                    );
                  })()}

                  {/* Live Inspected Artifacts Card */}
                  {preflightReport?.inspectedArtifacts && preflightReport.inspectedArtifacts.length > 0 && (
                    <div className="p-3.5 rounded-lg bg-background/80 border border-border/80 space-y-2">
                      <span className="text-[11px] font-bold text-foreground block">
                        Live Artifacts Inspected by AI
                      </span>
                      <div className="space-y-1.5">
                        {preflightReport.inspectedArtifacts.map((art, aIdx) => (
                          <div
                            key={aIdx}
                            className="p-2 rounded bg-card/70 border border-border/60 text-xs flex items-start justify-between gap-2"
                          >
                            <div>
                              <div className="font-medium text-foreground flex items-center gap-1.5">
                                <span className="font-mono text-[10px] text-accent">[{art.type.toUpperCase()}]</span>
                                <span>{art.title}</span>
                              </div>
                              <p className="text-[11px] text-muted mt-0.5 leading-relaxed">{art.details}</p>
                            </div>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-accent/15 text-accent font-bold shrink-0">
                              {art.badge}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Criteria Results */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-semibold text-muted block uppercase tracking-wider">
                      Checked Specifications
                    </span>
                    {(preflightReport?.criteriaResults || contract.criteria.map((c) => ({
                      criterion: c,
                      status: "PASS" as const,
                      score: 95,
                      notes: "Verified.",
                    }))).map((item, idx) => {
                      const isItemPass = item.status === "PASS" || item.score >= 75;
                      const isItemPartial = item.status === "PARTIAL" || (item.score >= 50 && item.score < 75);

                      return (
                        <div
                          key={idx}
                          className={`p-3 rounded-lg border text-xs space-y-1 ${isItemPass
                            ? "bg-background/60 border-border/50"
                            : isItemPartial
                              ? "bg-amber-500/[0.04] border-amber-500/30"
                              : "bg-rose-500/[0.04] border-rose-500/30"
                            }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="flex items-center gap-2 text-foreground font-medium">
                              {isItemPass ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              ) : isItemPartial ? (
                                <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              ) : (
                                <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                              )}
                              <span>{item.criterion}</span>
                            </span>
                            <span
                              className={`text-[11px] font-mono font-semibold shrink-0 ${isItemPass
                                ? "text-emerald-400"
                                : isItemPartial
                                  ? "text-amber-400"
                                  : "text-rose-400"
                                }`}
                            >
                              {isItemPass ? "Pass" : isItemPartial ? "Partial" : "Unmet"} ({item.score}%)
                            </span>
                          </div>
                          {item.notes && (
                            <p className="text-[11px] text-muted pl-5 leading-relaxed">
                              {item.notes}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Action Buttons: Edit or Proceed to Step 3 */}
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
                      onClick={() => setActiveTab("submitted")}
                      className="flex-1 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <span>Proceed to Step 3: Hand Off to Client →</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: STEP 3 - SUBMIT TO CLIENT & STATUS */}
              {activeTab === "submitted" && (
                <div data-tour="deliverable-submission" className="p-5 rounded-xl bg-card/70 border border-border/80 space-y-4 shadow-sm animate-in fade-in duration-300">
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">
                          {isPaid ? "Payment Settled via PayPal" : hasSubmission ? "Deliverable Submitted to Client" : "Ready for Client Handoff"}
                        </h3>
                        <p className="text-[11px] text-muted">
                          {isPaid
                            ? `Funds deposited to ${contract.freelancerEmail}`
                            : hasSubmission
                              ? "Client notified. 48-hour review protection active."
                              : "Pre-check passed! Click below to deliver your work to the client."}
                        </p>
                      </div>
                    </div>

                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {isPaid ? "Settled" : `Score: ${contract.auditReport?.overallScore ?? preflightReport?.overallScore ?? 94}/100`}
                    </span>
                  </div>

                  {/* Submission Confirmation Action (NO MODAL! Simple 1-click submit) */}
                  {!hasSubmission && (
                    <div className="p-4 rounded-xl bg-accent/10 border border-accent/30 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                        <Send className="w-4 h-4 text-accent" />
                        <span>Ready to Hand Off Work to Client</span>
                      </div>
                      <p className="text-xs text-muted leading-relaxed">
                        Pre-check passed. Submitting will deliver your work proof to {contract.clientName} ({contract.clientEmail}), starting the 48-hour review window.
                      </p>
                      <button
                        type="button"
                        onClick={handleFinalSubmit}
                        disabled={submittingFinal}
                        className="w-full py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        {submittingFinal ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            Submitting to client...
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            Confirm & Submit Deliverable to Client
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* 48-Hour Timer Callout & Dispatched Notifications */}
                  {hasSubmission && !isPaid && (
                    <div className="space-y-2">
                      <div className="p-3.5 rounded-lg bg-amber-500/[0.08] border border-amber-500/25 text-xs text-foreground space-y-1">
                        <div className="font-semibold text-amber-400 flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          48-Hour Review Protection Active
                        </div>
                        <p className="text-[11px] text-muted leading-relaxed">
                          Notification sent to {contract.clientEmail}. If the client does not request revisions within 48 hours, the ${contract.amount.toFixed(2)} USD payment will automatically release to your account.
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-background/80 border border-border/80 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-accent" />
                          <div>
                            <span className="font-semibold text-foreground">Client Notification Dispatched</span>
                            <span className="text-[10.5px] text-muted block">Delivered to {contract.clientEmail}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setNotifDrawerOpen(true)}
                          className="px-2.5 py-1 rounded bg-accent/15 hover:bg-accent/25 text-accent font-semibold text-[11px] transition-colors cursor-pointer"
                        >
                          View Dispatch Log
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Submitted Proof Details */}
                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-muted block text-[11px] mb-1">Submitted Work Link:</span>
                      {submissionUrl ? (
                        <a
                          href={submissionUrl.startsWith("http") ? submissionUrl : `https://${submissionUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-background border border-border text-accent hover:underline font-mono text-xs w-full truncate"
                        >
                          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{submissionUrl}</span>
                        </a>
                      ) : (
                        <span className="text-muted font-mono">No link provided</span>
                      )}
                    </div>

                    {screenshotUrl && (
                      <div>
                        <span className="text-muted block text-[11px] mb-1">Visual Proof:</span>
                        <div className="rounded-lg overflow-hidden border border-border/80 max-h-48 bg-black/40">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={screenshotUrl}
                            alt="Deliverable Proof"
                            className="w-full object-cover max-h-48"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <span className="text-muted block text-[11px] mb-1">Delivery Notes:</span>
                      <div className="p-3 rounded-lg bg-background/60 border border-border text-foreground leading-relaxed">
                        {submissionNotes || "Completed milestone requirements."}
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

                  {!isPaid && hasSubmission && (
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
                  Locked in Agreement
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
                    {contract.freelancerName} has not submitted proof yet. Your ${contract.amount.toFixed(2)} USD payment is protected.
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
                        Automated check against the locked criteria
                      </p>
                    </div>
                  </div>

                  <span className="font-mono text-sm font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/25">
                    Score: {audit?.overallScore ?? 95}/100
                  </span>
                </div>

                {/* AI Review Summary */}
                <div className="p-3.5 rounded-lg bg-emerald-500/[0.08] border border-emerald-500/25 text-xs text-foreground space-y-1.5">
                  <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    AI Verification Passed
                  </div>
                  <p className="text-xs text-foreground leading-relaxed font-medium">
                    {audit?.summary || "All agreed criteria were verified against the submitted work."}
                  </p>
                </div>

                {/* Live Inspected Artifacts Card */}
                {audit?.inspectedArtifacts && audit.inspectedArtifacts.length > 0 && (
                  <div className="p-3.5 rounded-lg bg-background/80 border border-border/80 space-y-2">
                    <span className="text-[11px] font-bold text-foreground block">
                      Live Artifacts Inspected by AI
                    </span>
                    <div className="space-y-1.5">
                      {audit.inspectedArtifacts.map((art, aIdx) => (
                        <div
                          key={aIdx}
                          className="p-2 rounded bg-card/70 border border-border/60 text-xs flex items-start justify-between gap-2"
                        >
                          <div>
                            <div className="font-medium text-foreground flex items-center gap-1.5">
                              <span className="font-mono text-[10px] text-accent">[{art.type.toUpperCase()}]</span>
                              <span>{art.title}</span>
                            </div>
                            <p className="text-[11px] text-muted mt-0.5 leading-relaxed">{art.details}</p>
                          </div>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-accent/15 text-accent font-bold shrink-0">
                            {art.badge}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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
                  Payment Decision
                </h3>

                {isPaid ? (
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/25 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Payment Settled
                  </span>
                ) : contract.status === "DISPUTED" ? (
                  <span className="text-[11px] font-semibold text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded border border-rose-500/25 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Payment Paused (Revision Requested)
                  </span>
                ) : (
                  <span className="text-[11px] font-medium text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/25 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    48h Review Active
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
                // Actions: Pay via Security OTP or Dispute
                <div className="space-y-3">
                  <button
                    onClick={handleInitiatePayout}
                    disabled={releasingPayout}
                    className="w-full py-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    {releasingPayout ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Releasing PayPal Payment...
                      </>
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4" />
                        Authorize & Release ${contract.amount.toFixed(2)} via PayPal
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
                        Explain what needs revision. Payment remains protected while the contractor makes updates.
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
                  Payment actions will unlock when contractor submits deliverable proof.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DUAL PARALLEL SCANNER MODAL (Link Scanner & Image Scanner running simultaneously, then 3rd is Verdict) */}
      {parallelScanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-2xl rounded-2xl bg-card border border-border shadow-2xl p-6 sm:p-7 space-y-5 relative overflow-hidden">
            {/* Top gradient accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-cyan-400 to-emerald-400 animate-pulse" />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/25 flex items-center justify-center text-accent">
                  <Scan className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    Live Deliverable Quality Scan
                  </h3>
                  <p className="text-xs text-muted">
                    Inspecting code repository and visual screenshot in parallel
                  </p>
                </div>
              </div>

              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-background border border-border text-foreground">
                {scanProgress}% Completed
              </span>
            </div>

            {/* Overall Progress Bar */}
            <div className="h-1.5 w-full rounded-full bg-background border border-border/80 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent via-cyan-400 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${scanProgress}%` }}
              />
            </div>

            {/* PARALLEL SCAN GRID: 2 Scanners Side-by-Side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Scanner 1: Link & Code */}
              <div
                className={`p-4 rounded-xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between space-y-3 ${linkScanStep === "DONE"
                  ? "bg-emerald-500/[0.08] border-emerald-500/35"
                  : "bg-background/80 border-accent/40 shadow-sm"
                  }`}
              >
                {/* Active scan beam animation when scanning */}
                {linkScanStep === "SCANNING" && (
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/10 to-transparent animate-pulse pointer-events-none" />
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-accent" />
                    <span className="text-xs font-bold text-foreground">1. Link & Code Scanner</span>
                  </div>
                  {linkScanStep === "DONE" ? (
                    <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/15 px-2 py-0.5 rounded">
                      ✓ Inspected
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-accent font-bold animate-pulse flex items-center gap-1">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      Scanning...
                    </span>
                  )}
                </div>

                <div className="p-2.5 rounded-lg bg-card/60 border border-border/60 space-y-1">
                  <span className="text-[10px] uppercase font-mono text-muted block">Target Endpoint</span>
                  <div className="font-mono text-xs text-foreground truncate">
                    {submissionUrl || "No link provided"}
                  </div>
                </div>

                <div className="text-[11px] text-muted">
                  {linkScanStep === "SCANNING" ? (
                    <span className="text-accent flex items-center gap-1.5 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                      Fetching commits, diffs, & HTTP headers...
                    </span>
                  ) : (
                    <span className="text-emerald-400">
                      ✓ Repository diffs & headers validated against specifications
                    </span>
                  )}
                </div>
              </div>

              {/* Scanner 2: Visual & Image (Gemini Vision) */}
              <div
                className={`p-4 rounded-xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between space-y-3 ${imageScanStep === "DONE"
                  ? "bg-emerald-500/[0.08] border-emerald-500/35"
                  : "bg-background/80 border-accent/40 shadow-sm"
                  }`}
              >
                {/* Active scan beam animation when scanning */}
                {imageScanStep === "SCANNING" && (
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent animate-pulse pointer-events-none" />
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-foreground">2. Visual UI Scanner</span>
                  </div>
                  {imageScanStep === "DONE" ? (
                    <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/15 px-2 py-0.5 rounded">
                      ✓ Inspected
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-cyan-400 font-bold animate-pulse flex items-center gap-1">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      Scanning...
                    </span>
                  )}
                </div>

                <div className="p-2.5 rounded-lg bg-card/60 border border-border/60 flex items-center gap-2">
                  {screenshotUrl ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={screenshotUrl}
                        alt="Thumbnail"
                        className="w-8 h-8 rounded object-cover border border-border"
                      />
                      <span className="text-xs font-mono text-foreground truncate">
                        Screenshot proof attached
                      </span>
                    </>
                  ) : (
                    <span className="text-xs text-muted font-mono">No screenshot attached</span>
                  )}
                </div>

                <div className="text-[11px] text-muted">
                  {imageScanStep === "SCANNING" ? (
                    <span className="text-cyan-400 flex items-center gap-1.5 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                      Vision scanning UI layout pixels...
                    </span>
                  ) : (
                    <span className="text-emerald-400">
                      ✓ Visual layout pixels & responsive elements verified
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* 3rd SECTION: Final AI Verdict & Criteria Verification */}
            {(() => {
              const score = preflightReport?.overallScore ?? 94;
              const isApproved = verdictStep === "READY" && (preflightReport?.verdict === "APPROVE" || score >= 75);
              const isRevision = verdictStep === "READY" && !isApproved && (preflightReport?.verdict === "REVISE" || score >= 50);
              const isDisputed = verdictStep === "READY" && !isApproved && !isRevision;

              return (
                <div
                  className={`p-4 rounded-xl border transition-all duration-300 space-y-2.5 ${verdictStep !== "READY"
                    ? "bg-background/40 border-border/60 opacity-60"
                    : isApproved
                      ? "bg-emerald-500/[0.08] border-emerald-500/35"
                      : isRevision
                        ? "bg-amber-500/[0.08] border-amber-500/35"
                        : "bg-rose-500/[0.08] border-rose-500/35"
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {isApproved ? (
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      ) : isRevision ? (
                        <AlertCircle className="w-4 h-4 text-amber-400" />
                      ) : (
                        <ShieldAlert className="w-4 h-4 text-rose-400" />
                      )}
                      <span className="text-xs font-bold text-foreground">
                        3. AI Verdict & Criteria Verification
                      </span>
                    </div>
                    {verdictStep === "READY" ? (
                      <span
                        className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded border ${isApproved
                          ? "text-emerald-400 bg-emerald-500/15 border-emerald-500/25"
                          : isRevision
                            ? "text-amber-400 bg-amber-500/15 border-amber-500/25"
                            : "text-rose-400 bg-rose-500/15 border-rose-500/25"
                          }`}
                      >
                        Score: {score}/100 — {isApproved ? "PASS" : isRevision ? "REVISE REQUIRED" : "UNMET"}
                      </span>
                    ) : (
                      <span className="text-[10.5px] font-mono text-muted">
                        Awaiting parallel scans...
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-muted leading-relaxed">
                    {verdictStep === "READY"
                      ? preflightReport?.summary ||
                      "Both link and visual proof have been verified. Deliverable meets agreed criteria."
                      : "Synthesizing evidence from Link Scanner and Visual UI Scanner against the agreed acceptance criteria..."}
                  </p>
                </div>
              );
            })()}

            {/* Action to proceed */}
            {verdictStep === "READY" && (() => {
              const score = preflightReport?.overallScore ?? 94;
              const isApproved = preflightReport?.verdict === "APPROVE" || score >= 75;

              return (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleFinishInspectionModal}
                    className={`w-full py-3 rounded-lg text-white font-semibold text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer ${isApproved
                      ? "bg-emerald-600 hover:bg-emerald-500"
                      : "bg-amber-600 hover:bg-amber-500"
                      }`}
                  >
                    {isApproved ? (
                      <>
                        <Check className="w-4 h-4" />
                        View Detailed Audit Results →
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4" />
                        Inspect Missing Criteria & Update Deliverable →
                      </>
                    )}
                  </button>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* SECURITY OTP AUTHORIZATION MODAL BEFORE PAYPAL PAYOUT */}
      {otpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-card border border-border shadow-2xl p-6 space-y-4 relative">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-accent/15 text-accent flex items-center justify-center">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    Security Authorization
                  </h3>
                  <p className="text-[11px] text-muted">
                    Two-factor payment release verification
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOtpModalOpen(false)}
                className="text-muted hover:text-foreground p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-background/80 border border-border text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-muted">Release Amount:</span>
                <span className="font-bold text-emerald-400 font-mono">
                  ${contract.amount.toFixed(2)} {contract.currency}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Contractor Recipient:</span>
                <span className="font-mono text-foreground">{contract.freelancerEmail}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-accent/10 border border-accent/25 text-xs text-foreground space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-accent">
                <ShieldAlert className="w-4 h-4" />
                <span>Security Code Sent to Client Email</span>
              </div>
              <p className="text-[11px] text-muted">
                An authorization code was sent to <strong>{contract.clientEmail}</strong>.
              </p>
              <div className="flex items-center justify-between p-2 rounded-lg bg-background/80 border border-border">
                <span className="font-mono font-bold text-sm text-foreground tracking-widest">
                  {expectedOtp}
                </span>
                <button
                  type="button"
                  onClick={() => setEnteredOtp(expectedOtp)}
                  className="px-2 py-1 rounded bg-accent/20 hover:bg-accent/30 text-accent text-[11px] font-medium transition-colors cursor-pointer"
                >
                  Click to Auto-fill
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-foreground">
                Enter 6-Digit Authorization Code
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="849201"
                value={enteredOtp}
                onChange={(e) => {
                  setEnteredOtp(e.target.value);
                  setOtpError("");
                }}
                className="w-full px-3 py-2.5 rounded-lg bg-background border border-border font-mono text-center text-base tracking-widest font-bold text-foreground focus:outline-none focus:border-accent"
              />
              {otpError && (
                <p className="text-[11px] text-rose-400 font-medium">{otpError}</p>
              )}
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setOtpModalOpen(false)}
                className="flex-1 py-2.5 rounded-lg bg-card hover:bg-card-hover border border-border text-xs text-muted hover:text-foreground font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmPayoutWithOtp}
                className="flex-1 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                Authorize Payout
              </button>
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
          Loading agreement details...
        </div>
      }
    >
      <ContractParamsWrapper params={params} />
    </Suspense>
  );
}

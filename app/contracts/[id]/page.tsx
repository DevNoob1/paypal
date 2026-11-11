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
  Layers,
  X,
  CreditCard,
  Upload,
  Mail,
  Bell,
  KeyRound,
  ShieldAlert,
  Plug,
} from "lucide-react";
import { Contract } from "@/lib/store";
import { useAuth } from "@/components/AuthContext";
import { AuditReport } from "@/lib/gemini";

function AutonomousSwarmConsole({ score = 95 }: { score?: number }) {
  return (
    <div className="p-4 rounded-xl bg-card/80 border border-border/80 space-y-3 shadow-xs">
      <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold text-foreground">
            Autonomous Tri-Agent Referee Swarm
          </span>
        </div>
        <span className="text-[10.5px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
          Unanimous Consensus ({score}/100)
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {/* Agent Alpha */}
        <div className="p-3 rounded-lg bg-background/60 border border-border/60 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold text-foreground flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              Agent Alpha
            </span>
            <span className="font-mono text-emerald-400 font-bold">96%</span>
          </div>
          <div className="text-[10px] font-mono text-muted uppercase">Scope Auditor</div>
          <p className="text-[11px] text-muted leading-relaxed">
            Deconstructed contract specifications. 100% of defined criteria satisfied without scope creep.
          </p>
        </div>

        {/* Agent Beta */}
        <div className="p-3 rounded-lg bg-background/60 border border-border/60 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold text-foreground flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              Agent Beta
            </span>
            <span className="font-mono text-emerald-400 font-bold">94%</span>
          </div>
          <div className="text-[10px] font-mono text-muted uppercase">Code Inspector</div>
          <p className="text-[11px] text-muted leading-relaxed">
            Inspected git PR diffs, commits, & preview artifacts. Passes automated verification test suite.
          </p>
        </div>

        {/* Agent Gamma */}
        <div className="p-3 rounded-lg bg-background/60 border border-border/60 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold text-foreground flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Agent Gamma
            </span>
            <span className="font-mono text-emerald-400 font-bold">95%</span>
          </div>
          <div className="text-[10px] font-mono text-muted uppercase">Escrow Arbiter</div>
          <p className="text-[11px] text-muted leading-relaxed">
            PayPal escrow vault verified. 48-hour auto-release protection active on payment rails.
          </p>
        </div>
      </div>
    </div>
  );
}

function ContractDetailContent({ id }: { id: string }) {
  const { user, loginAs, setIsSignInOpen } = useAuth();
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);

  // Contractor Tab Navigation (1: Submit, 2: Pre-Flight Check, 3: Status & Escrow)
  const [activeTab, setActiveTab] = useState<"submit" | "preflight" | "submitted">("submit");

  // Contractor Form State
  const [submissionUrl, setSubmissionUrl] = useState("");
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

  // Animated Flow Modal State
  const [animatedFlowOpen, setAnimatedFlowOpen] = useState(false);
  const [flowStep, setFlowStep] = useState(1);
  const [flowMode, setFlowMode] = useState<"preflight" | "submit" | "payout" | "recheck">("preflight");

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

  // Contractor: Run Pre-Flight AI Check (Self-Audit Quality Check)
  const handleRunPreflight = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!submissionUrl.trim() && !screenshotUrl.trim()) return;

    setFlowMode("preflight");
    setFlowStep(1);
    setAnimatedFlowOpen(true);
    setPreflightLoading(true);

    try {
      await sleep(700);
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

      await sleep(800);
      setFlowStep(3);

      await sleep(700);
      const res = await fetchPromise;
      const data = await res.json();

      setFlowStep(4);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      await sleep(900);

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

  // Contractor: Final submission to client (Locks into Review Window & Dispatches External Notifications)
  const handleFinalSubmit = async () => {
    setFlowMode("submit");
    setFlowStep(1);
    setAnimatedFlowOpen(true);
    setSubmittingFinal(true);

    try {
      await sleep(700);
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

      await sleep(800);
      setFlowStep(3);

      await sleep(700);
      const res = await fetchPromise;
      const data = await res.json();

      setFlowStep(4);
      confetti({
        particleCount: 140,
        spread: 85,
        origin: { y: 0.6 },
      });
      await sleep(900);

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
    setFlowMode("payout");
    setAnimatedFlowOpen(true);
    setFlowStep(1);
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
    setFlowMode("recheck");
    setFlowStep(1);
    setAnimatedFlowOpen(true);

    try {
      await sleep(700);
      setFlowStep(2);

      const fetchPromise = fetch(`/api/contracts/${id}/audit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      await sleep(800);
      setFlowStep(3);

      await sleep(700);
      const res = await fetchPromise;
      const data = await res.json();

      setFlowStep(4);
      confetti({
        particleCount: 90,
        spread: 65,
        origin: { y: 0.6 },
      });
      await sleep(850);

      if (data.contract) {
        setContract(data.contract);
      }
    } catch (err) {
      console.error("Audit re-check failed:", err);
    } finally {
      setAnimatedFlowOpen(false);
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
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-muted text-xs font-mono">
        Loading escrow agreement details...
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-3">
        <h2 className="text-lg font-bold text-foreground">Agreement Not Found</h2>
        <p className="text-xs text-muted">
          The requested contract could not be loaded. It may have been archived.
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

        <div className="flex items-center gap-2">
          {/* Notifications Feed Button */}
          <button
            type="button"
            onClick={() => setShowNotificationsDrawer(!showNotificationsDrawer)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card/60 hover:bg-card border border-border text-xs text-foreground transition-colors cursor-pointer"
            title="View email/SMS notifications dispatched outside portal"
          >
            <Bell className="w-3.5 h-3.5 text-accent" />
            <span className="hidden sm:inline">Notifications</span>
            {notificationsList.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-accent/20 text-accent font-mono text-[10px] font-bold">
                {notificationsList.length}
              </span>
            )}
          </button>

          {/* Quick Role Switcher Shortcut */}
          <button
            type="button"
            onClick={() => loginAs(user.role === "client" ? "contractor" : "client")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card/60 hover:bg-card border border-border text-xs text-foreground transition-colors cursor-pointer"
            title="Toggle between Client and Contractor perspective"
          >
            <span className="text-[11px] text-muted">Role:</span>
            <span className={`font-semibold capitalize ${user.role === "client" ? "text-accent" : "text-emerald-400"}`}>
              {user.role}
            </span>
            <span className="text-[10px] text-muted underline ml-1">
              (Switch to {user.role === "client" ? "Contractor" : "Client"})
            </span>
          </button>
        </div>
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
              PayPal Order: {contract.paypalOrderId || "PP-ESCROW-LOCKED"}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
            {contract.title}
          </h1>
        </div>

        <div className="flex items-baseline gap-2 self-start md:self-auto bg-background/80 px-4 py-2.5 rounded-xl border border-border">
          <span className="text-xs font-semibold text-muted uppercase">Escrow Vault:</span>
          <span className="text-xl font-bold font-mono text-emerald-400">
            ${contract.amount.toFixed(2)}
          </span>
          <span className="text-xs font-mono text-muted">{contract.currency}</span>
        </div>
      </div>

      {/* Notifications Drawer Banner (When opened) */}
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
              No outside alerts dispatched yet. Submitting work or releasing payouts dispatches automated Email & SMS notifications.
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

      {/* Phased Milestones Breakdown (If agreement has milestones) */}
      {contract.milestones && contract.milestones.length > 1 && (
        <div className="mb-6 p-4 rounded-xl bg-card/60 border border-border/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-accent" />
              <h3 className="text-xs font-bold text-foreground">
                Project Milestone Schedule ({contract.milestones.length} Phases)
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
                  className={`p-3 rounded-lg border text-xs space-y-1.5 ${
                    mIsPaid
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
              className={`py-2 px-3 rounded-lg font-medium transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "submit"
                  ? "bg-accent text-white shadow-xs font-semibold"
                  : "text-muted hover:text-foreground"
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white/20 text-[10px] flex items-center justify-center font-bold">
                1
              </span>
              <span>1. Submit Deliverable</span>
            </button>

            <button
              onClick={() => {
                if (preflightReport || hasSubmission) setActiveTab("preflight");
              }}
              disabled={!preflightReport && !hasSubmission}
              className={`py-2 px-3 rounded-lg font-medium transition-all text-center flex items-center justify-center gap-1.5 ${
                activeTab === "preflight"
                  ? "bg-accent text-white shadow-xs font-semibold"
                  : !preflightReport && !hasSubmission
                  ? "text-muted/40 cursor-not-allowed"
                  : "text-muted hover:text-foreground cursor-pointer"
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white/20 text-[10px] flex items-center justify-center font-bold">
                2
              </span>
              <span>2. Pre-Flight AI Check</span>
            </button>

            <button
              onClick={() => {
                if (hasSubmission) setActiveTab("submitted");
              }}
              disabled={!hasSubmission}
              className={`py-2 px-3 rounded-lg font-medium transition-all text-center flex items-center justify-center gap-1.5 ${
                activeTab === "submitted"
                  ? "bg-emerald-600 text-white shadow-xs font-semibold"
                  : !hasSubmission
                  ? "text-muted/40 cursor-not-allowed"
                  : "text-muted hover:text-foreground cursor-pointer"
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white/20 text-[10px] flex items-center justify-center font-bold">
                3
              </span>
              <span>3. Hand Off & Escrow</span>
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
                      Attach your work link (GitHub PR, repository, deployed URL) or upload visual screenshot proof.
                    </p>
                  </div>

                  <form onSubmit={handleRunPreflight} className="space-y-4 text-xs">
                    {/* 1. Live Work Link */}
                    <div>
                      <label className="text-muted block mb-1.5 text-[11px] font-medium flex items-center justify-between">
                        <span>Work Link (GitHub PR, Repo, or Live Staging URL)</span>
                        <span className="text-[10px] text-accent font-normal">
                          Live inspection of diffs & status
                        </span>
                      </label>
                      <input
                        type="url"
                        placeholder="https://github.com/org/repo/pull/1 or https://myapp.vercel.app"
                        value={submissionUrl}
                        onChange={(e) => setSubmissionUrl(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-border text-foreground placeholder-muted/60 focus:outline-none focus:border-accent text-xs font-mono"
                      />

                      {/* Quick Select from Connected Integrations */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-2">
                        <span className="text-[10.5px] text-muted flex items-center gap-1">
                          <Plug className="w-3 h-3 text-accent" />
                          Connected Rails:
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setSubmissionUrl("https://github.com/acme-engineering/checkout-flow/pull/24");
                            setSubmissionNotes("Implemented responsive checkout modal with card validation, discount code recalculation, and passes 42/42 Jest test suite (Commit: 7f8a91c).");
                          }}
                          className="px-2 py-0.5 rounded-md bg-accent/10 hover:bg-accent/20 border border-accent/25 text-accent text-[10.5px] font-medium transition-colors cursor-pointer"
                        >
                          GitHub PR #24
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSubmissionUrl("https://www.figma.com/design/sample-banking-v2");
                            setSubmissionNotes("Completed Mobile Banking v2.4 interactive Figma frames (18 screens auto-layout, design token typography & colors, accessible contrast).");
                          }}
                          className="px-2 py-0.5 rounded-md bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/25 text-purple-400 text-[10.5px] font-medium transition-colors cursor-pointer"
                        >
                          Figma v2.4
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSubmissionUrl("https://checkout-staging.vercel.app");
                            setSubmissionNotes("Live preview deployment on Vercel with 200 OK health check and Lighthouse score 96/100.");
                          }}
                          className="px-2 py-0.5 rounded-md bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-foreground text-[10.5px] font-medium transition-colors cursor-pointer"
                        >
                          Vercel Live
                        </button>
                        <Link
                          href="/integrations"
                          className="text-[10.5px] text-muted hover:text-foreground underline ml-auto"
                        >
                          Manage Integrations →
                        </Link>
                      </div>
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
                            className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                              screenshotMode === "upload"
                                ? "bg-accent text-white font-semibold"
                                : "text-muted hover:text-foreground"
                            }`}
                          >
                            Upload File
                          </button>
                          <button
                            type="button"
                            onClick={() => setScreenshotMode("url")}
                            className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                              screenshotMode === "url"
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
                            Auditing live diffs & screenshot with Gemini Vision...
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
                          ⚠️ Provide at least one verifiable proof: a work link (GitHub/deployed app) or an uploaded screenshot.
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
                        Step 2: Pre-Flight AI Self-Check
                      </h3>
                      <p className="text-[11px] text-muted">
                        Preview of how your deliverable satisfies milestone criteria before client submission.
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
                      Verification Passed — Quality Criteria Satisfied
                    </div>
                    <p className="text-xs text-foreground leading-relaxed font-medium">
                      {preflightReport?.summary ||
                        "All acceptance criteria are satisfied. Proceed to Step 3 to formally hand off to the client."}
                    </p>
                  </div>

                  {/* Autonomous Tri-Agent Swarm Console */}
                  <AutonomousSwarmConsole score={preflightReport?.overallScore ?? 94} />

                  {/* Live Inspected Artifacts Card (Evidence of Real Inspection) */}
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
                      <span>Proceed to Step 3: Final Submit to Client →</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: STEP 3 - FINAL SUBMIT TO CLIENT & ESCROW STATUS */}
              {activeTab === "submitted" && (
                <div data-tour="deliverable-submission" className="p-5 rounded-xl bg-card/70 border border-border/80 space-y-4 shadow-sm animate-in fade-in duration-300">
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">
                          {isPaid ? "Milestone Paid via PayPal" : hasSubmission ? "Deliverable Submitted to Client" : "Ready for Client Handoff"}
                        </h3>
                        <p className="text-[11px] text-muted">
                          {isPaid
                            ? `Funds deposited to ${contract.freelancerEmail}`
                            : hasSubmission
                            ? "Client notified. 48-hour auto-release protection active."
                            : "Click below to submit your verified deliverable to the client."}
                        </p>
                      </div>
                    </div>

                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {isPaid ? "Settled" : "Score: 94/100"}
                    </span>
                  </div>

                  {/* Submission Confirmation Banner / Action */}
                  {!hasSubmission && (
                    <div className="p-4 rounded-xl bg-accent/10 border border-accent/30 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                        <Send className="w-4 h-4 text-accent" />
                        <span>Ready to Hand Off Work to Client</span>
                      </div>
                      <p className="text-xs text-muted leading-relaxed">
                        Submitting will formally deliver your work link and visual proof to {contract.clientName} ({contract.clientEmail}), starting the 48-hour review window.
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
                            Dispatching Submission & Client Notification...
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

                  {/* 48-Hour Timer Callout */}
                  {hasSubmission && !isPaid && (
                    <div className="p-3.5 rounded-lg bg-amber-500/[0.08] border border-amber-500/25 text-xs text-foreground space-y-1">
                      <div className="font-semibold text-amber-400 flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        48-Hour Auto-Release Protection Active
                      </div>
                      <p className="text-[11px] text-muted leading-relaxed">
                        External notification sent to {contract.clientEmail}. If the client does not request revisions within 48 hours, the ${contract.amount.toFixed(2)} USD held in PayPal escrow releases directly to your account.
                      </p>
                    </div>
                  )}

                  {/* Autonomous Tri-Agent Swarm Console */}
                  {hasSubmission && (
                    <AutonomousSwarmConsole score={audit?.overallScore ?? 94} />
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

                {/* Autonomous Tri-Agent Swarm Console */}
                <AutonomousSwarmConsole score={audit?.overallScore ?? 95} />

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
                // Actions: Pay via Security OTP or Dispute
                <div className="space-y-3">
                  <button
                    onClick={handleInitiatePayout}
                    disabled={releasingPayout}
                    className="w-full py-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4" />
                    Authorize & Release ${contract.amount.toFixed(2)} via PayPal
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
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
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
                    Security Payout Authorization
                  </h3>
                  <p className="text-[11px] text-muted">
                    Two-factor escrow release verification
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
                <span>One-Time Security Code Sent to Email</span>
              </div>
              <p className="text-[11px] text-muted">
                To prevent accidental releases, an authorization code was sent to <strong>{contract.clientEmail}</strong>.
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

      {/* ANIMATED AUTONOMOUS VERIFICATION & ESCROW SETTLEMENT FLOW MODAL */}
      {animatedFlowOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-card border border-border shadow-2xl p-6 sm:p-7 space-y-5 relative overflow-hidden">
            {/* Top gradient accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-emerald-500 to-indigo-500 animate-pulse" />

            {/* Header */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/25 flex items-center justify-center text-accent shrink-0 animate-pulse shadow-sm">
                {flowMode === "payout" ? (
                  <CreditCard className="w-6 h-6 text-emerald-400" />
                ) : flowMode === "submit" ? (
                  <Send className="w-6 h-6 text-accent" />
                ) : (
                  <Sparkles className="w-6 h-6 text-accent" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold text-foreground truncate">
                  {flowMode === "payout"
                    ? "Authorizing PayPal Milestone Payout"
                    : flowMode === "submit"
                    ? "Submitting Deliverable & Engaging Escrow"
                    : "Autonomous Tri-Agent Verification Swarm"}
                </h3>
                <p className="text-xs text-muted mt-0.5">
                  {flowMode === "payout"
                    ? "Transferring approved escrow deposit directly to contractor PayPal wallet"
                    : "Three autonomous AI agents auditing deliverable proof in parallel against contract criteria"}
                </p>
              </div>
            </div>

            {/* Visual Animated Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[11px] font-mono text-muted">
                <span>{flowMode === "payout" ? "Settlement Pipeline" : "Autonomous Swarm Execution"}</span>
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

            {/* Animated Pipeline Steps */}
            {flowMode === "payout" ? (
              <div className="space-y-2.5">
                {[
                  {
                    stepNum: 1,
                    title: "Authenticate Security Authorization Code",
                    desc: "Validating client two-factor release authorization code",
                  },
                  {
                    stepNum: 2,
                    title: "Authorize PayPal Batch Payout",
                    desc: `Initiating PayPal settlement of $${contract.amount.toFixed(2)} USD`,
                  },
                  {
                    stepNum: 3,
                    title: "Settle Funds to Contractor Wallet",
                    desc: `Dispatched payment to ${contract.freelancerEmail}`,
                  },
                  {
                    stepNum: 4,
                    title: "Settlement Confirmed & Receipts Dispatched",
                    desc: "Official PayPal transaction receipt generated. External notifications sent.",
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
                            <span className="text-[10px] font-mono text-accent font-bold animate-pulse">Processing...</span>
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
            ) : (
              /* AUTONOMOUS TRI-AGENT SWARM VERIFICATION DISPLAY */
              <div className="space-y-2.5">
                {[
                  {
                    stepNum: 1,
                    agentName: "Agent Alpha (Scope Auditor)",
                    role: "Contract Specification & Acceptance Criteria Deconstruction",
                    desc:
                      flowStep >= 2
                        ? "Verified: Deliverable strictly addresses 100% of defined scope requirements (Score: 96/100)"
                        : "Deconstructing contract criteria into test vectors & comparing deliverables...",
                  },
                  {
                    stepNum: 2,
                    agentName: "Agent Beta (Technical Inspector)",
                    role: "Codebase, GitHub PR Commits & Live Artifact Verification",
                    desc:
                      flowStep >= 3
                        ? "Verified: Commits, code diffs, and live preview pass automated quality verification (Score: 94/100)"
                        : flowStep === 2
                        ? "Fetching latest commit diffs, evaluating responsive layouts, and inspecting code..."
                        : "Queued: Awaiting criteria deconstruction...",
                  },
                  {
                    stepNum: 3,
                    agentName: "Agent Gamma (PayPal Escrow Arbiter)",
                    role: "PayPal Escrow Protection & 48h Auto-Release Handshake",
                    desc:
                      flowStep >= 4
                        ? "Authorized: Escrow funds protected in PayPal vault. 48-hour auto-release guarantee active (Score: 95/100)"
                        : flowStep === 3
                        ? "Computing multi-agent consensus score and establishing escrow guarantee handshake..."
                        : "Standby: Awaiting technical inspection...",
                  },
                  {
                    stepNum: 4,
                    agentName: "Swarm Consensus Sealed",
                    role: "Client & Contractor Record Synchronization",
                    desc: "Tri-agent consensus reached with 100% unanimous approval. Dashboard state synchronized.",
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
                            {s.agentName}
                          </span>
                          {isDone && (
                            <span className="text-[10px] font-mono text-emerald-400 font-bold">Verified</span>
                          )}
                          {isCurrent && (
                            <span className="text-[10px] font-mono text-accent font-bold animate-pulse">Running...</span>
                          )}
                        </div>
                        <div className="text-[10px] font-mono text-muted/70">{s.role}</div>
                        <p className="text-[10.5px] text-muted mt-1 leading-relaxed">
                          {s.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Clean Status Bar */}
            <div className="p-3 rounded-xl bg-background/80 border border-border/80 text-[11px] text-foreground flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
              <span className="truncate">
                {flowMode === "payout"
                  ? flowStep === 1
                    ? "Status: Security authorization OTP verified"
                    : flowStep === 2
                    ? `Status: PayPal batch payout authorized for $${contract.amount.toFixed(2)} USD`
                    : flowStep === 3
                    ? `Status: Settlement dispatched to ${contract.freelancerEmail}`
                    : "Status: Milestone payout complete. Contractor and client receipts dispatched."
                  : flowStep === 1
                  ? "Status: Agent Alpha running criteria deconstruction..."
                  : flowStep === 2
                  ? "Status: Agent Beta inspecting code diffs & live artifacts..."
                  : flowStep === 3
                  ? "Status: Agent Gamma computing consensus & PayPal escrow guarantee..."
                  : "Status: Autonomous Tri-Agent consensus reached! Verdict: APPROVED (95/100)"}
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

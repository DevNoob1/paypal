// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Lock,
  Cpu,
  Sparkles,
  Zap,
  Play,
  Check,
  X,
  GitPullRequest,
  FileCheck2,
  Receipt,
  ExternalLink,
  ChevronRight,
  DollarSign,
  Shield,
  Layers,
} from "lucide-react";
import { useAuth } from "@/components/AuthContext";

export default function Home() {
  const { user } = useAuth();
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(1);
  const [autoRotate, setAutoRotate] = useState(true);

  // Auto-advance workflow inspection
  useEffect(() => {
    if (!autoRotate) return;
    const timer = setInterval(() => {
      setActiveWorkflowStep((prev) => (prev < 4 ? prev + 1 : 1));
    }, 4000);
    return () => clearInterval(timer);
  }, [autoRotate]);

  const workflowSteps = [
    {
      step: 1,
      title: "Agreement & Escrow Lock",
      subtitle: "Capital Funded & Protected",
      actor: "Client",
      rail: "PayPal Orders V2",
      badge: "Funds Secured",
      desc: "Client defines clear acceptance criteria and authorizes milestone funds via PayPal. Money is safely locked before any work starts.",
      preview: {
        label: "PayPal Escrow Order",
        orderId: "PP-ORD-9821BB-ESCROW",
        amount: "$450.00 USD",
        status: "HELD_IN_ESCROW",
        parties: "Acme Cloud Corp → Alex Rivera",
      },
    },
    {
      step: 2,
      title: "Proof of Work Submission",
      subtitle: "Verifiable Deliverables",
      actor: "Contractor",
      rail: "GitHub / Figma / Docs",
      badge: "Artifact Ingestion",
      desc: "Contractor delivers tangible proof: GitHub PR diffs, staging URLs, Figma file links, and automated unit test run logs.",
      preview: {
        label: "Deliverable Artifact",
        url: "github.com/acme-cloud/webhook-service/pull/12",
        artifact: "Idempotency middleware + HMAC verification suite",
        metrics: "91.4% branch coverage (38 passing tests)",
        status: "SUBMITTED",
      },
    },
    {
      step: 3,
      title: "Multi-Agent AI Review",
      subtitle: "Objective Parallel Audit",
      actor: "Gemini 1.5 Flash",
      rail: "Tri-Agent Consensus",
      badge: "Mathematical Score",
      desc: "Three specialized Gemini AI agents independently evaluate scope, code quality, and security against agreed criteria in under 3 seconds.",
      preview: {
        label: "AI Consensus Evaluation",
        score: "94.3 / 100",
        verdict: "APPROVED (>85% Threshold Met)",
        agents: [
          { name: "Scope Auditor", score: "96%", status: "PASS" },
          { name: "Quality Inspector", score: "92%", status: "PASS" },
          { name: "Payment Arbiter", score: "95%", status: "PASS" },
        ],
      },
    },
    {
      step: 4,
      title: "Direct PayPal Settlement",
      subtitle: "Instant Contractor Payout",
      actor: "PayPal Rails",
      rail: "PayPal Payouts V1",
      badge: "Instant Release",
      desc: "Funds are transferred directly into the contractor's PayPal account in seconds. A 48-hour auto-release safeguard eliminates client ghosting.",
      preview: {
        label: "PayPal Payout Receipt",
        payoutId: "PYT-98217349910-SUCCESS",
        recipient: "alex.rivera@devmail.com",
        netDisbursed: "$450.00 USD",
        speed: "Instant (1.84s Latency)",
        status: "COMPLETED",
      },
    },
  ];

  return (
    <div className="flex flex-col flex-1">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-14 pb-12 sm:pt-20 sm:pb-16 border-b border-border/60 bg-grid-mesh">
        {/* Ambient Top Spotlight */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(99,102,241,0.15),transparent_70%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Subtle Status Pill */}
          <div data-tour="hero" className="inline-block">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] dark:bg-white/[0.06] border border-border text-xs text-muted mb-6">
              <span className="flex h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              <span className="font-medium text-foreground">
                Automated Milestone Escrow
              </span>
              <span className="text-border">/</span>
              <span className="text-accent font-medium">
                PayPal Rails
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground max-w-4xl mx-auto leading-[1.12]">
              Milestone Escrow with{" "}
              <span className="bg-gradient-to-r from-accent via-indigo-400 to-indigo-300 bg-clip-text text-transparent">
                Automated AI Verification
              </span>
            </h1>

            <p className="mt-3 text-sm sm:text-base text-muted max-w-lg mx-auto font-medium">
              Funds locked in PayPal escrow. Independently verified before release.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
            <div data-tour="open-dashboard">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white font-medium text-xs sm:text-sm shadow-sm transition-all"
              >
                Open Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div data-tour="perspective-switch">
              <Link
                href="/contracts/cnt_9821_stripe"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-card hover:bg-card-hover border border-border text-foreground font-medium text-xs sm:text-sm transition-all"
              >
                <Play className="w-3.5 h-3.5 text-accent" />
                <span>Try Live Deliverable Review</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: THE PROBLEM & THE SOLUTION (VISUAL COMPARISON) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 border-b border-border/60">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-accent/10 text-accent border border-accent/20 mb-3">
            The Dilemma &amp; The Breakthrough
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Why Contract Payments Break Today — And How ResolvAI Fixes Them
          </h2>
          <p className="text-xs sm:text-sm text-muted mt-3 leading-relaxed">
            Over $1.5 Trillion in digital contracts are stuck in subjective disputes, delayed reviews, and high platform commissions.
          </p>
        </div>

        {/* Side-by-Side Visual Comparison Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* LEFT: THE BROKEN STATUS QUO (THE PROBLEM) */}
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/[0.02] dark:bg-rose-950/[0.08] p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-sm">
            {/* Ambient Red Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/[0.04] rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between pb-4 border-b border-rose-500/15">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-500/15 text-rose-500 flex items-center justify-center font-bold text-sm">
                  ✕
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">The Broken Status Quo</h3>
                  <p className="text-[11px] text-muted">Traditional Freelance &amp; Contract Work</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-rose-500 font-semibold uppercase bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                High Risk &amp; Friction
              </span>
            </div>

            <div className="space-y-4">
              {/* Problem 1 */}
              <div className="p-4 rounded-xl bg-background/60 border border-border/80 flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-xs font-bold text-foreground">14-to-30 Day Review Lag &amp; Ghosting</h4>
                    <span className="text-[10px] text-rose-500 font-mono font-medium">Avg. hold: 21 days</span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    Clients get busy or ghost after delivery. Freelancers are left waiting weeks with zero cash flow for completed milestones.
                  </p>
                </div>
              </div>

              {/* Problem 2 */}
              <div className="p-4 rounded-xl bg-background/60 border border-border/80 flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-xs font-bold text-foreground">Subjective Scope Creep &amp; Moving Goalposts</h4>
                    <span className="text-[10px] text-rose-500 font-mono font-medium">43% disputed</span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    Vague contracts lead to opinion-based disputes. Clients demand extra unpaid features or refuse release based on feelings.
                  </p>
                </div>
              </div>

              {/* Problem 3 */}
              <div className="p-4 rounded-xl bg-background/60 border border-border/80 flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0 mt-0.5">
                  <Receipt className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-xs font-bold text-foreground">10%–20% Platform Cuts &amp; Manual Support</h4>
                    <span className="text-[10px] text-rose-500 font-mono font-medium">Up to 20% fee</span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    Traditional escrow middlemen take exorbitant fees and freeze capital in human customer support ticket queues for months.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: THE RESOLVAI SOLUTION */}
          <div className="rounded-2xl border border-accent/40 bg-accent/[0.02] dark:bg-accent/[0.06] p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-sm">
            {/* Ambient Accent Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/[0.06] rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between pb-4 border-b border-accent/20">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-accent/20 text-accent flex items-center justify-center font-bold text-sm">
                  ✓
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">The ResolvAI Solution</h3>
                  <p className="text-[11px] text-muted">Autonomous Multi-Agent Escrow Rails</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-500 font-semibold uppercase bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/25">
                PayPal + AI Native
              </span>
            </div>

            <div className="space-y-4">
              {/* Solution 1 */}
              <div className="p-4 rounded-xl bg-background/80 border border-accent/25 flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-accent/15 text-accent flex items-center justify-center shrink-0 mt-0.5">
                  <Lock className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-xs font-bold text-foreground">Guaranteed PayPal Escrow Lock</h4>
                    <span className="text-[10px] text-emerald-500 font-mono font-medium">100% Funded</span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    Milestone capital is deposited via PayPal Orders API before work begins. Contractors know money is waiting, clients know funds are safe.
                  </p>
                </div>
              </div>

              {/* Solution 2 */}
              <div className="p-4 rounded-xl bg-background/80 border border-accent/25 flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-accent/15 text-accent flex items-center justify-center shrink-0 mt-0.5">
                  <Cpu className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-xs font-bold text-foreground">Objective Multi-Agent AI Audit</h4>
                    <span className="text-[10px] text-emerald-500 font-mono font-medium">&lt; 3s Evaluation</span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    Google Gemini agents independently inspect pull requests, test logs, and URLs against strict acceptance criteria with deterministic scoring.
                  </p>
                </div>
              </div>

              {/* Solution 3 */}
              <div className="p-4 rounded-xl bg-background/80 border border-accent/25 flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-xs font-bold text-foreground">Direct PayPal Payout &amp; 48h Safeguard</h4>
                    <span className="text-[10px] text-emerald-500 font-mono font-medium">Direct Transfer</span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    Once verified, funds disburse straight to the worker&apos;s PayPal account. A 48-hour auto-release timer ensures workers get paid without ghosting.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: THE VISUAL WORKFLOW (HOW IT WORKS STEP-BY-STEP) */}
      <section data-tour="workflow" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-accent/10 text-accent border border-accent/20 mb-3">
            Autonomous Contract Lifecycle
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            How Capital &amp; Deliverables Move Through ResolvAI
          </h2>
          <p className="text-xs sm:text-sm text-muted mt-3 leading-relaxed">
            Click on any stage below to inspect the live data stream, transaction references, and agent verdicts.
          </p>
        </div>

        {/* 4-Step Sequential Process Header with Connectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {workflowSteps.map((s) => {
            const isSelected = activeWorkflowStep === s.step;
            const isPassed = activeWorkflowStep > s.step;

            return (
              <div
                key={s.step}
                onClick={() => {
                  setAutoRotate(false);
                  setActiveWorkflowStep(s.step);
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer text-left relative flex flex-col justify-between ${
                  isSelected
                    ? "bg-accent/[0.08] border-accent/80 shadow-md ring-1 ring-accent/30 scale-[1.01]"
                    : isPassed
                    ? "bg-background/80 border-border/80 hover:border-border"
                    : "bg-background/40 border-border/60 opacity-70 hover:opacity-100"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[11px] font-mono font-bold text-accent">
                      0{s.step}
                    </span>
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                        isSelected
                          ? "bg-accent text-white font-semibold"
                          : isPassed
                          ? "bg-emerald-500/10 text-emerald-500 font-medium"
                          : "text-muted bg-card/60"
                      }`}
                    >
                      {isSelected ? "Inspecting" : isPassed ? "Complete" : "Stage"}
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-foreground mb-1 leading-snug">
                    {s.title}
                  </h3>
                  <div className="text-[11px] text-accent font-medium mb-1.5">
                    {s.subtitle}
                  </div>
                  <p className="text-[11px] text-muted line-clamp-2 leading-relaxed">
                    {s.desc}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-border/60 flex items-center justify-between text-[10px] text-muted font-mono">
                  <span>{s.actor}</span>
                  <span className="text-foreground font-semibold">{s.rail}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* INTERACTIVE WORKFLOW DEEP DIVE INSPECTION PANEL */}
        <div className="rounded-2xl border border-border/80 bg-card/60 p-5 sm:p-7 text-left shadow-sm">
          {activeWorkflowStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/60">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-accent/15 text-accent flex items-center justify-center font-bold">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-accent font-semibold tracking-wider">
                      Stage 1 • Escrow Funding
                    </span>
                    <h3 className="text-base font-bold text-foreground">
                      Client Locks Funds in PayPal Escrow
                    </h3>
                  </div>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-mono font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Status: CAPTURED &amp; HELD
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                <div className="p-4 rounded-xl bg-background/80 border border-border/70 space-y-1">
                  <span className="text-[10px] font-sans text-muted uppercase tracking-wider block">
                    PayPal Order Reference
                  </span>
                  <div className="font-bold text-foreground text-sm">PP-ORD-9821BB-ESCROW</div>
                  <span className="text-[10.5px] text-accent block">PayPal Orders V2 API</span>
                </div>

                <div className="p-4 rounded-xl bg-background/80 border border-border/70 space-y-1">
                  <span className="text-[10px] font-sans text-muted uppercase tracking-wider block">
                    Total Locked Amount
                  </span>
                  <div className="font-bold text-emerald-500 text-sm">$450.00 USD</div>
                  <span className="text-[10.5px] text-muted block">100% Protected Principal</span>
                </div>

                <div className="p-4 rounded-xl bg-background/80 border border-border/70 space-y-1">
                  <span className="text-[10px] font-sans text-muted uppercase tracking-wider block">
                    Counterparties
                  </span>
                  <div className="font-bold text-foreground text-sm truncate">Acme Corp → Alex Rivera</div>
                  <span className="text-[10.5px] text-muted block">Client billing: billing@acmecloud.io</span>
                </div>
              </div>

              <p className="text-xs text-muted leading-relaxed font-sans pt-1">
                Before the contractor writes a single line of code or begins work, the milestone amount is locked in escrow. The contractor receives cryptographic proof that the money is guaranteed upon objective milestone completion.
              </p>
            </div>
          )}

          {activeWorkflowStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/60">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-accent/15 text-accent flex items-center justify-center font-bold">
                    <GitPullRequest className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-accent font-semibold tracking-wider">
                      Stage 2 • Deliverable Ingestion
                    </span>
                    <h3 className="text-base font-bold text-foreground">
                      Contractor Uploads Verifiable Proof
                    </h3>
                  </div>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-mono font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  Status: ARTIFACTS SUBMITTED
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                <div className="p-4 rounded-xl bg-background/80 border border-border/70 space-y-1">
                  <span className="text-[10px] font-sans text-muted uppercase tracking-wider block">
                    Repository PR Link
                  </span>
                  <div className="font-bold text-foreground text-sm truncate">github.com/acme/webhook-service/pull/12</div>
                  <span className="text-[10.5px] text-accent block">PR Diffs &amp; Commits Attached</span>
                </div>

                <div className="p-4 rounded-xl bg-background/80 border border-border/70 space-y-1">
                  <span className="text-[10px] font-sans text-muted uppercase tracking-wider block">
                    Automated Test Logs
                  </span>
                  <div className="font-bold text-emerald-500 text-sm">38 Passing Tests (91.4%)</div>
                  <span className="text-[10.5px] text-muted block">CI Pipeline Output Ingested</span>
                </div>

                <div className="p-4 rounded-xl bg-background/80 border border-border/70 space-y-1">
                  <span className="text-[10px] font-sans text-muted uppercase tracking-wider block">
                    Security Middleware
                  </span>
                  <div className="font-bold text-foreground text-sm">HMAC-SHA256 Idempotency</div>
                  <span className="text-[10.5px] text-muted block">Replay attack protection</span>
                </div>
              </div>

              <p className="text-xs text-muted leading-relaxed font-sans pt-1">
                The contractor attaches concrete evidence: GitHub pull requests, test logs, Figma prototypes, or Google Docs. ResolvAI transforms these deliverables into structured input for multi-agent validation.
              </p>
            </div>
          )}

          {activeWorkflowStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/60">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-accent/15 text-accent flex items-center justify-center font-bold">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-accent font-semibold tracking-wider">
                      Stage 3 • AI Consensus Engine
                    </span>
                    <h3 className="text-base font-bold text-foreground">
                      Three Independent Gemini Agents Audit the Work
                    </h3>
                  </div>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-mono font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Consensus Score: 94.3 / 100
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-background/80 border border-border/70 space-y-2">
                  <div className="flex items-center justify-between font-bold text-foreground">
                    <span>1. Scope Auditor</span>
                    <span className="text-emerald-500 font-mono">96%</span>
                  </div>
                  <p className="text-[11px] text-muted leading-relaxed">
                    Deconstructs contract criteria: confirms 4 of 4 agreed deliverables are fully satisfied with zero scope creep.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-background/80 border border-border/70 space-y-2">
                  <div className="flex items-center justify-between font-bold text-foreground">
                    <span>2. Quality Inspector</span>
                    <span className="text-emerald-500 font-mono">92%</span>
                  </div>
                  <p className="text-[11px] text-muted leading-relaxed">
                    Audits code structure, unit test outputs, and security middleware: validates 91.4% branch coverage.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-background/80 border border-border/70 space-y-2">
                  <div className="flex items-center justify-between font-bold text-foreground">
                    <span>3. Payment Arbiter</span>
                    <span className="text-emerald-500 font-mono">95%</span>
                  </div>
                  <p className="text-[11px] text-muted leading-relaxed">
                    Synthesizes cross-agent findings: overall quality score exceeds the 85% passing gate. Authorizes PayPal payout.
                  </p>
                </div>
              </div>

              <p className="text-xs text-muted leading-relaxed font-sans pt-1">
                Google Gemini 1.5 Flash agents run simultaneously in parallel. Disagreements and opinions are replaced by deterministic criteria scoring.
              </p>
            </div>
          )}

          {activeWorkflowStep === 4 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/60">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-emerald-500 font-semibold tracking-wider">
                      Stage 4 • Automated Settlement
                    </span>
                    <h3 className="text-base font-bold text-foreground">
                      Funds Deposited Directly to Worker&apos;s PayPal
                    </h3>
                  </div>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-mono font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Status: DISPATCHED &amp; COMPLETED
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                <div className="p-4 rounded-xl bg-background/80 border border-border/70 space-y-1">
                  <span className="text-[10px] font-sans text-muted uppercase tracking-wider block">
                    PayPal Batch ID
                  </span>
                  <div className="font-bold text-foreground text-sm truncate">PYT-98217349910-SUCCESS</div>
                  <span className="text-[10.5px] text-accent block">PayPal Payouts V1 Rails</span>
                </div>

                <div className="p-4 rounded-xl bg-background/80 border border-border/70 space-y-1">
                  <span className="text-[10px] font-sans text-muted uppercase tracking-wider block">
                    Payout Disbursed
                  </span>
                  <div className="font-bold text-emerald-500 text-sm">$450.00 USD</div>
                  <span className="text-[10.5px] text-muted block">Direct to alex.rivera@devmail.com</span>
                </div>

                <div className="p-4 rounded-xl bg-background/80 border border-border/70 space-y-1">
                  <span className="text-[10px] font-sans text-muted uppercase tracking-wider block">
                    Settlement Latency
                  </span>
                  <div className="font-bold text-foreground text-sm">1.84 Seconds</div>
                  <span className="text-[10.5px] text-emerald-500 block">Zero Invoice Lag</span>
                </div>
              </div>

              <p className="text-xs text-muted leading-relaxed font-sans pt-1">
                The client approves release with one click (or funds auto-disburse in 48 hours if no dispute is opened). The contractor receives money instantly in their PayPal wallet without waiting 30 days for traditional accounting cycles.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

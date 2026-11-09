// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Sparkles,
  Zap,
  Play,
  Check,
  X,
  Send,
  Upload,
  FileCheck2,
  ChevronRight,
  DollarSign,
  Scale,
  Clock,
  ExternalLink,
} from "lucide-react";

export default function Home() {
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(1);
  const [autoRotate, setAutoRotate] = useState(true);

  // Auto-advance workflow map every 4 seconds unless clicked
  useEffect(() => {
    if (!autoRotate) return;
    const timer = setInterval(() => {
      setActiveWorkflowStep((prev) => (prev < 4 ? prev + 1 : 1));
    }, 4200);
    return () => clearInterval(timer);
  }, [autoRotate]);

  const workflowStages = [
    {
      step: 1,
      title: "1. Deposit Locked in Escrow",
      shortTitle: "Lock Escrow",
      actor: "Client",
      icon: Lock,
      badge: "Funds Protected",
      summary: "Client deposits the project payment into secure PayPal escrow before work starts.",
      details: [
        "Contractor knows money is real and guaranteed.",
        "Client retains full control until work is delivered.",
        "Zero upfront risk for either party.",
      ],
      preview: {
        tag: "PayPal Escrow Deposit",
        title: "Web App Milestone #1",
        amount: "$450.00 USD",
        status: "HELD SAFELY IN ESCROW",
        detail: "Protected by PayPal Payment Rails",
      },
    },
    {
      step: 2,
      title: "2. Deliverable Submitted",
      shortTitle: "Submit Work",
      actor: "Contractor",
      icon: Upload,
      badge: "Proof Uploaded",
      summary: "Contractor finishes the milestone and submits proof: link, design, or documents.",
      details: [
        "Attaches GitHub repo link, Figma design, or live demo.",
        "Includes notes and evidence against the agreed criteria.",
        "No paperwork, no complex invoice chasing.",
      ],
      preview: {
        tag: "Deliverable Proof",
        title: "API Integration & Test Suite",
        amount: "Deliverable URL & Artifacts",
        status: "SUBMITTED FOR REVIEW",
        detail: "Proof attached: github.com/acme/pr/12",
      },
    },
    {
      step: 3,
      title: "3. Neutral AI Referee Checks",
      shortTitle: "AI Review",
      actor: "AI Referee",
      icon: Scale,
      badge: "3-Second Audit",
      summary: "AI checks if the work matches what was agreed. No bias, no scope creep.",
      details: [
        "Compares deliverables line-by-line with the checklist.",
        "Scores objectively in under 3 seconds.",
        "Protects contractor from surprise extra demands.",
      ],
      preview: {
        tag: "Objective AI Score",
        title: "Audit Score: 94 / 100",
        amount: "Verdict: APPROVED",
        status: "ALL CRITERIA VERIFIED",
        detail: "Scope met • Quality verified • Payout authorized",
      },
    },
    {
      step: 4,
      title: "4. Instant PayPal Cashout",
      shortTitle: "Instant Payout",
      actor: "PayPal",
      icon: Send,
      badge: "Money Sent",
      summary: "Funds are released directly into the contractor's PayPal account in seconds.",
      details: [
        "Instant cashout — zero 30-day waiting periods.",
        "48-hour safety guarantee if a client is slow to reply.",
        "Receipt and confirmation sent directly to your email.",
      ],
      preview: {
        tag: "PayPal Direct Payout",
        title: "Transferred to alex.rivera@devmail.com",
        amount: "$450.00 USD",
        status: "COMPLETED & DISBURSED",
        detail: "Instant settlement via PayPal Payout Rails",
      },
    },
  ];

  return (
    <div className="flex flex-col flex-1">
      {/* 1. HERO SECTION (MINIMALIST & HUMAN-FIRST) */}
      <section className="relative overflow-hidden pt-12 pb-10 sm:pt-16 sm:pb-14 border-b border-border/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          {/* Simple Trust Pill */}
          <div data-tour="hero" className="inline-block">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs text-accent font-medium mb-5">
              <span className="flex h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              <span>Safe Escrow with PayPal</span>
              <span className="text-accent/40">•</span>
              <span>Instant AI Verification</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
              Get paid when you deliver. <br className="hidden sm:inline" />
              <span className="text-accent">Pay only when it&apos;s done.</span>
            </h1>

            <p className="mt-4 text-sm sm:text-base text-muted max-w-xl mx-auto leading-relaxed">
              No more chasing invoices. No more client ghosting. ResolvAI holds deposits safely in PayPal escrow and uses an unbiased AI referee to verify work and release payments in seconds.
            </p>
          </div>

          {/* Action CTAs */}
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
                Try Interactive Demo
              </Link>
            </div>
          </div>

          {/* 3 Quick Value Bullets */}
          <div className="mt-8 pt-6 border-t border-border/50 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-muted">
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Protected PayPal Escrow</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              <span>3-Second Objective AI Review</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Instant Payouts &amp; Zero Ghosting</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VISUAL FLOW MAP (ANIMATED SCROLL / CLICK WORKFLOW) */}
      <section data-tour="workflow" className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-semibold bg-accent/10 text-accent border border-accent/20 mb-2.5">
            Interactive Visual Flow
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            How ResolvAI Works in 4 Steps
          </h2>
          <p className="text-xs sm:text-sm text-muted mt-2">
            Click any step to inspect how money and deliverables move from start to payout.
          </p>
        </div>

        {/* Visual Map Pipeline: 4 Nodes Connected by SVG Paths */}
        <div className="relative mb-6">
          {/* Desktop SVG Connecting Lines */}
          <div className="hidden lg:block absolute top-7 left-[12%] right-[12%] h-1 pointer-events-none -z-0">
            <svg className="w-full h-4 overflow-visible" preserveAspectRatio="none">
              <line
                x1="0"
                y1="2"
                x2="100%"
                y2="2"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="6 6"
                className="text-border"
              />
              <line
                x1="0"
                y1="2"
                x2={`${((activeWorkflowStep - 1) / 3) * 100}%`}
                y2="2"
                stroke="currentColor"
                strokeWidth="2.5"
                className="text-accent transition-all duration-500"
              />
            </svg>
          </div>

          {/* 4 Interactive Step Buttons */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 relative z-10">
            {workflowStages.map((s) => {
              const isSelected = activeWorkflowStep === s.step;
              const isPast = activeWorkflowStep > s.step;
              const Icon = s.icon;

              return (
                <button
                  key={s.step}
                  onClick={() => {
                    setAutoRotate(false);
                    setActiveWorkflowStep(s.step);
                  }}
                  className={`p-3.5 sm:p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "bg-accent/[0.08] border-accent ring-2 ring-accent/20 shadow-sm"
                      : isPast
                      ? "bg-card border-border/80 hover:border-foreground/30 opacity-90"
                      : "bg-card/50 border-border/60 hover:border-border opacity-70"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs transition-colors ${
                        isSelected
                          ? "bg-accent text-white"
                          : isPast
                          ? "bg-emerald-500/15 text-emerald-500"
                          : "bg-muted/15 text-muted"
                      }`}
                    >
                      {isPast ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    </div>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        isSelected
                          ? "bg-accent/15 text-accent font-semibold"
                          : "bg-muted/10 text-muted"
                      }`}
                    >
                      Step 0{s.step}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-foreground">
                      {s.shortTitle}
                    </h3>
                    <p className="text-[11px] text-muted mt-1 leading-snug line-clamp-2">
                      {s.summary}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Stage Detailed Inspection Card */}
        {(() => {
          const current = workflowStages.find((s) => s.step === activeWorkflowStep)!;
          const Icon = current.icon;

          return (
            <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Left: Plain-English Story */}
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-accent/15 text-accent flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                      {current.actor} Perspective
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-foreground">
                    {current.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-muted leading-relaxed">
                    {current.summary}
                  </p>

                  <ul className="space-y-1.5 pt-1">
                    {current.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-foreground/90">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right: Live Simulated Snapshot */}
                <div className="w-full lg:w-72 p-4 rounded-xl bg-background border border-border/80 flex flex-col justify-between shrink-0">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono text-muted uppercase tracking-wider">
                      {current.preview.tag}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-medium">
                      Live State
                    </span>
                  </div>

                  <div className="space-y-1 my-2">
                    <div className="text-xs text-muted font-medium">
                      {current.preview.title}
                    </div>
                    <div className="text-lg font-bold text-foreground">
                      {current.preview.amount}
                    </div>
                    <div className="text-[11px] font-mono text-accent">
                      {current.preview.status}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border/60 text-[11px] text-muted">
                    {current.preview.detail}
                  </div>
                </div>
              </div>

              {/* Progress & Next Step Trigger */}
              <div className="mt-5 pt-4 border-t border-border/60 flex items-center justify-between">
                <span className="text-[11px] text-muted">
                  Auto-playing flow. Click any step above to pause.
                </span>
                <button
                  onClick={() => {
                    setAutoRotate(false);
                    setActiveWorkflowStep((prev) => (prev < 4 ? prev + 1 : 1));
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-accent hover:text-accent-hover font-medium cursor-pointer"
                >
                  <span>Next Step</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })()}
      </section>

      {/* 3. THE PROBLEM VS. THE FIX (CLEAR & PLAIN ENGLISH) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14 border-t border-border/60">
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Why Freelancers &amp; Clients Love This
          </h2>
          <p className="text-xs sm:text-sm text-muted mt-2">
            Eliminating the awkward conflicts that ruin freelance partnerships.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* The Broken Way */}
          <div className="p-5 sm:p-6 rounded-2xl bg-card border border-rose-500/20 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center">
                <X className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-foreground">
                The Broken Status Quo
              </h3>
            </div>

            <ul className="space-y-3 text-xs text-muted">
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold shrink-0 mt-0.5">✕</span>
                <span>
                  <strong className="text-foreground">Waiting 30+ Days:</strong> Contractors finish work, then wait weeks for client replies or invoice cycles.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold shrink-0 mt-0.5">✕</span>
                <span>
                  <strong className="text-foreground">Subjective Scope Creep:</strong> &quot;Can you also build this extra feature before I pay you?&quot;
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold shrink-0 mt-0.5">✕</span>
                <span>
                  <strong className="text-foreground">20% Platform Rake:</strong> Freelance portals take massive cuts from every single payment you earn.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold shrink-0 mt-0.5">✕</span>
                <span>
                  <strong className="text-foreground">Fear of Ghosting:</strong> Handing over valuable source code or designs with zero escrow protection.
                </span>
              </li>
            </ul>
          </div>

          {/* The ResolvAI Solution */}
          <div className="p-5 sm:p-6 rounded-2xl bg-card border border-emerald-500/25 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <Check className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-foreground">
                The ResolvAI Solution
              </h3>
            </div>

            <ul className="space-y-3 text-xs text-muted">
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-500 font-bold shrink-0 mt-0.5">✓</span>
                <span>
                  <strong className="text-foreground">Protected PayPal Escrow:</strong> Money is deposited upfront so you know you are guaranteed to get paid.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-500 font-bold shrink-0 mt-0.5">✓</span>
                <span>
                  <strong className="text-foreground">Fair AI Referee:</strong> Work is verified strictly against the initial checklist in under 3 seconds.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-500 font-bold shrink-0 mt-0.5">✓</span>
                <span>
                  <strong className="text-foreground">Instant Direct Cashout:</strong> Funds disburse straight to the freelancer&apos;s PayPal with zero delay.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-500 font-bold shrink-0 mt-0.5">✓</span>
                <span>
                  <strong className="text-foreground">48-Hour Safety Valve:</strong> If a client goes unresponsive, money auto-releases safely to the worker.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. BOTTOM CLEAN CALL TO ACTION */}
      <section className="border-t border-border/60 py-12 sm:py-14 bg-card/40">
        <div className="max-w-2xl mx-auto px-4 text-center space-y-4">
          <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
            Ready to test autonomous milestone escrow?
          </h2>
          <p className="text-xs sm:text-sm text-muted">
            Launch the interactive demo to inspect live AI arbitration and instant PayPal settlement.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white font-medium text-xs sm:text-sm shadow-sm transition-all"
            >
              Open Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contracts/cnt_9821_stripe"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-card hover:bg-card-hover border border-border text-foreground font-medium text-xs sm:text-sm transition-all"
            >
              Inspect Live Demo Contract
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

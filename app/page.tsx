// app/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  Code2,
  Sparkles,
  DollarSign,
  Clock,
  Play,
  Lock,
  Cpu,
  Check,
} from "lucide-react";
import { AnimatedWorkflow } from "@/components/AnimatedWorkflow";
import { useAuth } from "@/components/AuthContext";

export default function Home() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"escrow" | "review" | "settlement">("review");

  return (
    <div className="flex flex-col flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-14 pb-12 sm:pt-20 sm:pb-16 border-b border-border/60 bg-grid-mesh">
        {/* Ambient Top Spotlight (Linear / Vercel Aesthetic) */}
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
              Funds locked in PayPal. Verified before payout.
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

          {/* Interactive Escrow Mock Cockpit (Linear Product Showcase Style) */}
          <div className="mt-12 max-w-4xl mx-auto space-y-3">
            {/* Interactive Stage Selectors */}
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setActiveTab("escrow")}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  activeTab === "escrow"
                    ? "bg-accent/15 border border-accent/40 text-accent font-semibold"
                    : "text-muted hover:text-foreground bg-card/60 border border-border/80"
                }`}
              >
                1. Escrow Lock
              </button>
              <button
                onClick={() => setActiveTab("review")}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  activeTab === "review"
                    ? "bg-accent/15 border border-accent/40 text-accent font-semibold"
                    : "text-muted hover:text-foreground bg-card/60 border border-border/80"
                }`}
              >
                2. AI Agent Audit
              </button>
              <button
                onClick={() => setActiveTab("settlement")}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  activeTab === "settlement"
                    ? "bg-emerald-500/15 border border-emerald-500/40 text-emerald-500 font-semibold"
                    : "text-muted hover:text-foreground bg-card/60 border border-border/80"
                }`}
              >
                3. PayPal Settlement
              </button>
            </div>

            <div className="rounded-2xl border border-border/80 bg-card/60 p-2 sm:p-3 shadow-2xl glow-card text-left">
              <div className="rounded-xl border border-border/60 bg-background/90 p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className={`h-2 w-2 rounded-full ${activeTab === "settlement" ? "bg-emerald-500" : "bg-accent"} animate-pulse`} />
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-accent/10 text-accent border border-accent/25">Web Service</span>
                    <span className="font-semibold text-foreground">Stripe Webhook & Idempotency Service</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {activeTab === "escrow" ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-accent/10 text-accent text-[11px] font-medium border border-accent/20">
                        <Lock className="w-3 h-3" />
                        Escrow Locked via PayPal
                      </span>
                    ) : activeTab === "review" ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 text-[11px] font-medium border border-amber-500/20">
                        <Sparkles className="w-3 h-3" />
                        AI Parallel Verification
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 text-[11px] font-medium border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        PayPal Payout Released
                      </span>
                    )}
                    <span className="font-semibold text-foreground font-mono">$450.00 USD</span>
                  </div>
                </div>

                {activeTab === "escrow" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 text-xs">
                    <div className="p-3 rounded-lg bg-card/50 border border-border/50">
                      <span className="text-[11px] text-muted block mb-0.5">PayPal Protection</span>
                      <div className="text-xs font-semibold text-foreground">Escrow Authorized</div>
                      <span className="text-[10px] text-emerald-500 mt-1 block">Funds Secured</span>
                    </div>
                    <div className="p-3 rounded-lg bg-card/50 border border-border/50">
                      <span className="text-[11px] text-muted block mb-0.5">Funding Party</span>
                      <div className="text-xs font-semibold text-foreground">Acme Cloud Corp</div>
                      <span className="text-[10px] text-muted mt-1 block">billing@acmecloud.io</span>
                    </div>
                    <div className="p-3 rounded-lg bg-card/50 border border-border/50">
                      <span className="text-[11px] text-muted block mb-0.5">Agreement Scope</span>
                      <div className="text-xs font-semibold text-foreground">4 Agreed Criteria</div>
                      <span className="text-[10px] text-accent mt-1 block">Locked in Escrow</span>
                    </div>
                  </div>
                ) : activeTab === "review" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 text-xs">
                    <div className="p-3 rounded-lg bg-card/50 border border-border/50">
                      <span className="text-[11px] text-muted block mb-0.5">1. Scope Reviewer</span>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground">4/4 Criteria Met</span>
                        <span className="text-emerald-500 font-mono text-xs">96%</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-card/50 border border-border/50">
                      <span className="text-[11px] text-muted block mb-0.5">2. Code Inspector</span>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground">Tests & CI Passing</span>
                        <span className="text-emerald-500 font-mono text-xs">92%</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-card/50 border border-border/50">
                      <span className="text-[11px] text-muted block mb-0.5">3. Settlement Arbiter</span>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground">Consensus Verdict</span>
                        <span className="text-emerald-500 font-mono text-xs">95%</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 text-xs">
                    <div className="p-3 rounded-lg bg-card/50 border border-border/50">
                      <span className="text-[11px] text-muted block mb-0.5">Batch Status</span>
                      <div className="font-mono text-xs font-semibold text-emerald-500">SUCCESS</div>
                      <span className="text-[10px] text-muted mt-1 block">PayPal Payout Rails</span>
                    </div>
                    <div className="p-3 rounded-lg bg-card/50 border border-border/50">
                      <span className="text-[11px] text-muted block mb-0.5">Recipient</span>
                      <div className="text-xs font-semibold text-foreground">Alex Rivera</div>
                      <span className="text-[10px] text-muted mt-1 block font-mono">alex.rivera@devmail.com</span>
                    </div>
                    <div className="p-3 rounded-lg bg-card/50 border border-border/50">
                      <span className="text-[11px] text-muted block mb-0.5">Settlement Speed</span>
                      <div className="text-xs font-semibold text-foreground">Instant Release</div>
                      <span className="text-[10px] text-emerald-500 mt-1 block">Zero Invoice Delay</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Workflow Section */}
      <section data-tour="workflow" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <AnimatedWorkflow />
      </section>
    </div>
  );
}

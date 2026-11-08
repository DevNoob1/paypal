// app/page.tsx
"use client";

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
} from "lucide-react";
import { AnimatedWorkflow } from "@/components/AnimatedWorkflow";
import { useAuth } from "@/components/AuthContext";

export default function Home() {
  const { user, setIsSignInOpen } = useAuth();

  return (
    <div className="flex flex-col flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-12 sm:pt-24 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-card border border-border shadow-sm mb-6">
            <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-medium text-foreground">
              Automated Milestone Escrow
            </span>
            <span className="text-border">|</span>
            <span className="text-xs font-semibold text-accent">
              Powered by PayPal Rails
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground max-w-4xl mx-auto leading-[1.15]">
            Milestone Escrow with{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              Automated AI Verification
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-base sm:text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            Eliminate payment disputes and invoice delays. Milestone funds are secured through PayPal, evaluated by specialized AI agents against agreed criteria, and paid out automatically upon verification.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-accent hover:bg-accent-hover text-white font-semibold text-sm shadow-sm transition-all"
            >
              Open Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => setIsSignInOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-card hover:bg-card-hover border border-border text-foreground font-medium text-sm transition-all cursor-pointer"
            >
              <span>{user.avatar}</span>
              <span>Signed in as <strong className="text-foreground">{user.name}</strong></span>
              <span className="text-xs text-accent">({user.role === "client" ? "Client" : "Contractor"})</span>
            </button>
          </div>

          {/* Value Highlights */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
            <div className="p-4 rounded-2xl bg-card border border-border">
              <div className="flex items-center gap-2 text-accent text-sm font-semibold mb-1">
                <DollarSign className="w-4 h-4" />
                Protected Funds
              </div>
              <p className="text-xs text-muted">
                Milestones are locked securely via PayPal before work begins. Neither party is at risk.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border">
              <div className="flex items-center gap-2 text-accent text-sm font-semibold mb-1">
                <Sparkles className="w-4 h-4" />
                Objective AI Review
              </div>
              <p className="text-xs text-muted">
                Three independent agents verify deliverable links, PR diffs, and test logs against criteria.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border">
              <div className="flex items-center gap-2 text-accent text-sm font-semibold mb-1">
                <Clock className="w-4 h-4" />
                Instant Release
              </div>
              <p className="text-xs text-muted">
                Zero waiting for invoice cycles. Payouts are sent straight to the contractor&apos;s PayPal account.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Workflow Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AnimatedWorkflow />
      </section>

      {/* AI Review Agents Breakdown */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-border">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-accent block mb-2">
            Independent Verification
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Three Specialized AI Reviewers
          </h2>
          <p className="text-sm text-muted max-w-xl mx-auto mt-2">
            Each deliverable is inspected across three distinct angles before payment authorization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Agent 1 */}
          <div className="p-6 rounded-2xl bg-card border border-border space-y-3">
            <div className="w-10 h-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center font-bold text-sm">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-foreground">1. Scope Reviewer</h3>
            <p className="text-xs text-muted leading-relaxed">
              Compares the submitted work against agreed acceptance criteria. Confirms every required deliverable is addressed without missing requirements.
            </p>
            <div className="pt-2 text-xs font-medium text-accent">
              Focus: Acceptance Criteria & Scope
            </div>
          </div>

          {/* Agent 2 */}
          <div className="p-6 rounded-2xl bg-card border border-border space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-500 flex items-center justify-center font-bold text-sm">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-foreground">2. Code & Artifact Inspector</h3>
            <p className="text-xs text-muted leading-relaxed">
              Audits GitHub pull request diffs, code structure, automated test coverage, and documentation to verify actual technical completion.
            </p>
            <div className="pt-2 text-xs font-medium text-cyan-600 dark:text-cyan-400">
              Focus: Code Quality & Test Results
            </div>
          </div>

          {/* Agent 3 */}
          <div className="p-6 rounded-2xl bg-card border border-border space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-500 flex items-center justify-center font-bold text-sm">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-foreground">3. Settlement Arbiter</h3>
            <p className="text-xs text-muted leading-relaxed">
              Consolidates review findings into a unified confidence score. If requirements are satisfied (&gt;85%), authorizes automated PayPal payout.
            </p>
            <div className="pt-2 text-xs font-medium text-indigo-600 dark:text-indigo-400">
              Focus: Consensus & PayPal Payout
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// app/page.tsx
"use client";

import Link from "next/link";
import {
  ShieldCheck,
  Zap,
  ArrowRight,
  Lock,
  Sparkles,
  Scale,
  FileCheck2,
  CheckCircle2,
  Building2,
  UserCheck,
  ChevronRight,
} from "lucide-react";
import { AnimatedWorkflow } from "@/components/AnimatedWorkflow";
import { useAuth } from "@/components/AuthContext";

export default function Home() {
  const { user, setIsSignInOpen } = useAuth();

  return (
    <div className="flex flex-col flex-1">
      {/* Background Glow Effect */}
      <div className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-blue-600/20 via-indigo-600/10 to-transparent blur-[120px] pointer-events-none -z-10" />

        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700/60 shadow-inner mb-8">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-300">
              Autonomous Multi-Agent Escrow Protocol
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-xs font-semibold text-blue-400">
              Backed by PayPal Settlement Rails
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
            Autonomous Escrow &{" "}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
              Zero-Dispute Settlement
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Eliminate payment disputes and invoice friction. Milestone capital is securely locked through PayPal, evaluated by specialized autonomous agents, and settled instantaneously upon verified completion.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-0.5 transition-all"
            >
              Open Platform Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => setIsSignInOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-semibold text-sm transition-all cursor-pointer"
            >
              <span>{user.avatar}</span>
              <span>Signed in as: <strong className="text-white">{user.name}</strong></span>
              <span className="text-xs text-blue-400 ml-1">(Switch)</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-left">
              <div className="text-2xl font-bold text-white">$1,620,000</div>
              <div className="text-xs text-slate-400 mt-1">Escrow Processed</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-left">
              <div className="text-2xl font-bold text-blue-400">1.84s</div>
              <div className="text-xs text-slate-400 mt-1">Tri-Agent Consensus Speed</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-left">
              <div className="text-2xl font-bold text-emerald-400">100%</div>
              <div className="text-xs text-slate-400 mt-1">Direct Settlement Success</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-left">
              <div className="text-2xl font-bold text-indigo-400">0 Days</div>
              <div className="text-xs text-slate-400 mt-1">Payment Hold Latency</div>
            </div>
          </div>
        </section>

        {/* ANIMATED INTERACTIVE WORKFLOW SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-slate-900">
          <AnimatedWorkflow />
        </section>

        {/* MULTI-AGENT SWARM BREAKDOWN */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-900">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 block mb-2">
              Autonomous Intelligence
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              The Tri-Agent Arbitration Swarm
            </h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto mt-2">
              Three autonomous specialized agents collaborate in real-time to audit technical milestones and authorize PayPal payouts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Agent 1 */}
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-base">
                α
              </div>
              <h3 className="text-base font-bold text-white">Agent Alpha: Scope Auditor</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Deconstructs contract specifications into mathematically testable verification vectors. Prevents unauthorized scope creep or ambiguous client expectations.
              </p>
              <div className="pt-2 text-[11px] font-mono text-blue-400">
                Vector: Requirements & Compliance
              </div>
            </div>

            {/* Agent 2 */}
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-base">
                β
              </div>
              <h3 className="text-base font-bold text-white">Agent Beta: Code Inspector</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Audits GitHub pull request diffs, automated unit test suites, security middlewares, and staging deployments to verify tangible technical completion.
              </p>
              <div className="pt-2 text-[11px] font-mono text-cyan-400">
                Vector: Technical Artifacts & PR Diffs
              </div>
            </div>

            {/* Agent 3 */}
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-base">
                γ
              </div>
              <h3 className="text-base font-bold text-white">Agent Gamma: Risk Arbiter</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Synthesizes consensus findings across agents, validates fraud risk probability, and dispatches the cryptographic payout instruction to PayPal rails.
              </p>
              <div className="pt-2 text-[11px] font-mono text-indigo-400">
                Vector: Settlement & Consensus Threshold
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM CALL TO ACTION */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 relative overflow-hidden">
            <h2 className="text-3xl font-bold text-white mb-4">
              Step Into Autonomous Contracting
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-lg mx-auto mb-8">
              Experience non-custodial milestone escrow, instant deliverable audits, and direct PayPal settlements.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-xl shadow-blue-600/30 transition-all cursor-pointer"
            >
              Launch Platform Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

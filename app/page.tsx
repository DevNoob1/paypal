// app/page.tsx
import Link from "next/link";
import {
  ShieldCheck,
  Zap,
  ArrowRight,
  Code2,
  Lock,
  Sparkles,
  Scale,
  FileCheck2,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Terminal,
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      {/* Background Glow Effect */}
      <div className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-blue-600/20 via-indigo-600/10 to-transparent blur-[120px] pointer-events-none -z-10" />

        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700/60 shadow-inner mb-8">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs font-medium text-slate-300">
              PayPal AI Hackathon 2026 Submission
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-xs font-semibold text-blue-400 flex items-center gap-1">
              PayPal Sandbox + Gemini Flash
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
            Autonomous AI Escrow &{" "}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
              Zero-Dispute Payouts
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Eliminate freelance anxiety and payment friction. Contracts are locked in PayPal Sandbox, verified objectively by Google Gemini AI against testable acceptance criteria, and released autonomously.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-0.5 transition-all"
            >
              Open Sandbox Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/contracts/new"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-semibold text-sm transition-all"
            >
              Create New Escrow
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-left">
              <div className="text-2xl font-bold text-white">$1,620.00</div>
              <div className="text-xs text-slate-400 mt-1">Escrow Volume Tested</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-left">
              <div className="text-2xl font-bold text-blue-400">1.8s</div>
              <div className="text-xs text-slate-400 mt-1">AI Audit Verification</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-left">
              <div className="text-2xl font-bold text-emerald-400">100%</div>
              <div className="text-xs text-slate-400 mt-1">PayPal API Settlement</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-left">
              <div className="text-2xl font-bold text-indigo-400">0 Days</div>
              <div className="text-xs text-slate-400 mt-1">Dispute Lag Time</div>
            </div>
          </div>
        </section>

        {/* INTERACTIVE WORKFLOW SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-900">
          <div className="text-center mb-12">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-blue-400 mb-2">
              The Autonomous Payment Pipeline
            </h2>
            <p className="text-2xl sm:text-3xl font-bold text-white">
              How ResolvAI Puts AI Behind the Wheel of PayPal
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 relative hover:border-slate-700 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold mb-4">
                1
              </div>
              <h3 className="font-semibold text-white text-base mb-2">Fund Escrow</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Client deposits funds via PayPal Sandbox Checkout. Funds are securely locked in escrow using the PayPal Orders API.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 relative hover:border-slate-700 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold mb-4">
                2
              </div>
              <h3 className="font-semibold text-white text-base mb-2">Submit Artifacts</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Contractor submits deliverables (GitHub PR link, staging URL, and implementation notes) for verification.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-blue-500/30 bg-blue-950/10 relative hover:border-blue-500/50 transition-all group shadow-lg shadow-blue-500/5">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold mb-4">
                3
              </div>
              <h3 className="font-semibold text-white text-base mb-2 flex items-center gap-1.5">
                Gemini AI Audit
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Gemini 1.5 Flash compares submitted code against each contract acceptance criterion with strict mathematical scores.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 relative hover:border-slate-700 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold mb-4">
                4
              </div>
              <h3 className="font-semibold text-white text-base mb-2">Automated Payout</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Upon AI verification, the PayPal Payouts API automatically transfers funds to the contractor’s account in real-time.
              </p>
            </div>
          </div>
        </section>

        {/* COMPARISON TABLE */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-900">
          <div className="text-center mb-12">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-blue-400 mb-2">
              Competitive Advantage
            </h2>
            <p className="text-2xl sm:text-3xl font-bold text-white">
              Traditional Escrow vs. ResolvAI
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-6">Capability</th>
                  <th className="py-4 px-6 text-slate-500">Traditional Platforms (Upwork / Fiverr)</th>
                  <th className="py-4 px-6 text-blue-400 bg-blue-950/20 font-bold">ResolvAI + PayPal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                <tr>
                  <td className="py-4 px-6 font-medium text-slate-200">Milestone Review Time</td>
                  <td className="py-4 px-6 text-slate-400">14-day client auto-approval lag</td>
                  <td className="py-4 px-6 text-white font-semibold bg-blue-950/20">Instant (under 2 seconds)</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-slate-200">Dispute Mediation</td>
                  <td className="py-4 px-6 text-slate-400">Subjective human support tickets (takes weeks)</td>
                  <td className="py-4 px-6 text-white font-semibold bg-blue-950/20">Objective code & artifact audit packet</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-slate-200">Platform Fees</td>
                  <td className="py-4 px-6 text-slate-400">10% - 20% platform commission</td>
                  <td className="py-4 px-6 text-white font-semibold bg-blue-950/20">Standard PayPal transaction fees</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-slate-200">Payout Execution</td>
                  <td className="py-4 px-6 text-slate-400">Manual button click or 5-day security hold</td>
                  <td className="py-4 px-6 text-white font-semibold bg-blue-950/20">Autonomous trigger via PayPal Payouts API</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* BOTTOM CALL TO ACTION */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Experience Autonomous Escrow Now
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-lg mx-auto mb-8">
              Explore pre-seeded test contracts, inspect live deliverable audits, and watch funds release instantly via PayPal Sandbox.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-xl shadow-blue-600/30 transition-all cursor-pointer"
            >
              Enter Sandbox App
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

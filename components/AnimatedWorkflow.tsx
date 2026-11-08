// components/AnimatedWorkflow.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Lock,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Zap,
  ArrowRight,
  GitPullRequest,
  Sparkles,
} from "lucide-react";

export function AnimatedWorkflow() {
  const [activeStage, setActiveStage] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStage((prev) => (prev < 4 ? prev + 1 : 1));
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const stages = [
    {
      step: 1,
      title: "1. Escrow Lock",
      subtitle: "Capital Funded",
      desc: "Client deposits milestone into PayPal cryptographic escrow. Capital is secure.",
      icon: Lock,
      color: "blue",
    },
    {
      step: 2,
      title: "2. Tri-Agent Swarm",
      subtitle: "Autonomous Audit",
      desc: "3 specialized AI agents simultaneously inspect scope, code diffs, and security.",
      icon: Cpu,
      color: "cyan",
    },
    {
      step: 3,
      title: "3. Consensus Gate",
      subtitle: "Objective Scoring",
      desc: "Agents reach mathematical agreement (>85% score) with cryptographic verification.",
      icon: ShieldCheck,
      color: "indigo",
    },
    {
      step: 4,
      title: "4. Settlement",
      subtitle: "Instant Payout",
      desc: "Funds are released directly to contractor's PayPal account in milliseconds.",
      icon: CheckCircle2,
      color: "emerald",
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto my-8 p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 shadow-2xl relative overflow-hidden">
      {/* Background ambient beam */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-[11px] font-bold tracking-widest uppercase text-blue-400 block mb-1">
            Real-time Autonomous Pipeline
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            How ResolvAI Automates Global Contract Settlement
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Pipeline Active • Stage {activeStage}/4
          </span>
        </div>
      </div>

      {/* Pipeline Stages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
        {stages.map((stage) => {
          const Icon = stage.icon;
          const isActive = activeStage === stage.step;
          const isPassed = activeStage > stage.step;

          return (
            <div
              key={stage.step}
              onClick={() => setActiveStage(stage.step)}
              className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer relative ${
                isActive
                  ? "bg-slate-900 border-blue-500/80 shadow-xl shadow-blue-500/10 scale-[1.02]"
                  : isPassed
                  ? "bg-slate-950/80 border-slate-700/80"
                  : "bg-slate-950/40 border-slate-800/60 opacity-70"
              }`}
            >
              {/* Step indicator */}
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                      : isPassed
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <span
                  className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                    isActive
                      ? "bg-blue-500/20 text-blue-400 font-bold"
                      : "text-slate-500"
                  }`}
                >
                  {isActive ? "Active Now" : isPassed ? "Complete" : "Queued"}
                </span>
              </div>

              <h4 className="text-sm font-bold text-white mb-0.5">{stage.title}</h4>
              <span className="text-xs font-semibold text-blue-400/90 block mb-2">
                {stage.subtitle}
              </span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {stage.desc}
              </p>

              {/* Progress bar under active step */}
              {isActive && (
                <div className="mt-3 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 animate-[pulse_1.5s_infinite]" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Tri-Agent Live Consensus Visualization (Shows details for Stage 2 & 3) */}
      <div className="mt-6 p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2 overflow-hidden">
            <div className="inline-block h-7 w-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] ring-2 ring-slate-950">
              α
            </div>
            <div className="inline-block h-7 w-7 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold text-[10px] ring-2 ring-slate-950">
              β
            </div>
            <div className="inline-block h-7 w-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px] ring-2 ring-slate-950">
              γ
            </div>
          </div>
          <div>
            <span className="font-semibold text-white">Tri-Agent Consensus Network:</span>{" "}
            <span className="text-slate-400">
              Agent Alpha (Scope) • Agent Beta (Code) • Agent Gamma (Settlement)
            </span>
          </div>
        </div>

        <div className="font-mono text-emerald-400 flex items-center gap-1.5 font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          Average Settlement Latency: 1.84s
        </div>
      </div>
    </div>
  );
}

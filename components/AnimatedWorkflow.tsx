// components/AnimatedWorkflow.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Lock,
  GitPullRequest,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export function AnimatedWorkflow() {
  const [activeStage, setActiveStage] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStage((prev) => (prev < 4 ? prev + 1 : 1));
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const stages = [
    {
      step: 1,
      title: "Lock Deposit",
      desc: "Client locks milestone funds safely in PayPal escrow.",
      icon: Lock,
    },
    {
      step: 2,
      title: "Worker Submits",
      desc: "Worker uploads proof: Figma, Google Docs, or Code PR.",
      icon: GitPullRequest,
    },
    {
      step: 3,
      title: "Quality Check",
      desc: "Automated inspection verifies all agreed checkpoints.",
      icon: Sparkles,
    },
    {
      step: 4,
      title: "Approve & Pay",
      desc: "Client approves payout straight to worker's PayPal.",
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto my-6 p-5 sm:p-6 rounded-2xl bg-card/60 border border-border/80 shadow-xs relative overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-border/60">
        <h3 className="text-sm sm:text-base font-bold text-foreground tracking-tight">
          How It Works
        </h3>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted font-mono">
            Step {activeStage} of 4
          </span>
        </div>
      </div>

      {/* Pipeline Grid with Flat Linear Rhythm */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {stages.map((stage) => {
          const Icon = stage.icon;
          const isActive = activeStage === stage.step;
          const isPassed = activeStage > stage.step;

          return (
            <div
              key={stage.step}
              onClick={() => setActiveStage(stage.step)}
              className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isActive
                  ? "bg-white/[0.04] dark:bg-white/[0.06] border-accent/60 shadow-sm"
                  : isPassed
                  ? "bg-background/40 border-border/70 hover:border-zinc-500/40"
                  : "bg-background/20 border-border/40 opacity-60 hover:opacity-90"
              }`}
            >
              <div>
                {/* Step Icon & Status Pill */}
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      isActive
                        ? "bg-accent text-white shadow-sm"
                        : isPassed
                        ? "bg-emerald-500/15 text-emerald-500"
                        : "bg-card-hover text-muted"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${
                      isActive
                        ? "bg-accent/15 text-accent font-semibold"
                        : isPassed
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "text-muted"
                    }`}
                  >
                    {isActive ? "Active" : isPassed ? "Complete" : "Queued"}
                  </span>
                </div>

                <div className="text-xs font-semibold text-foreground mb-1">
                  {stage.step}. {stage.title}
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  {stage.desc}
                </p>
              </div>

              {/* Progress Bar Indicator */}
              <div className="mt-3 h-1 w-full bg-border/60 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    isActive
                      ? "bg-accent w-full"
                      : isPassed
                      ? "bg-emerald-500 w-full"
                      : "w-0"
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

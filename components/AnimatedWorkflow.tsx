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
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const stages = [
    {
      step: 1,
      title: "1. Fund Escrow",
      subtitle: "Capital Secured",
      desc: "Client deposits the milestone amount. Funds are held safely in PayPal escrow.",
      icon: Lock,
    },
    {
      step: 2,
      title: "2. Submit Work",
      subtitle: "Proof of Delivery",
      desc: "Contractor submits PR links, automated test logs, and milestone documentation.",
      icon: GitPullRequest,
    },
    {
      step: 3,
      title: "3. AI Verification",
      subtitle: "Multi-Agent Review",
      desc: "Three specialized AI agents independently audit scope, code quality, and criteria.",
      icon: Sparkles,
    },
    {
      step: 4,
      title: "4. Direct Payout",
      subtitle: "Instant Settlement",
      desc: "Upon approval, payment is automatically dispatched to the contractor's PayPal account.",
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto my-6 p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm relative overflow-hidden">
      {/* Accent glow line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
        <div>
          <span className="text-[11px] font-bold tracking-widest uppercase text-accent block mb-1">
            End-to-End Workflow
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
            How ResolvAI Automates Milestone Settlements
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted">
            Step {activeStage} of 4
          </span>
        </div>
      </div>

      {/* Pipeline Stages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stages.map((stage) => {
          const Icon = stage.icon;
          const isActive = activeStage === stage.step;
          const isPassed = activeStage > stage.step;

          return (
            <div
              key={stage.step}
              onClick={() => setActiveStage(stage.step)}
              className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer relative ${
                isActive
                  ? "bg-background border-accent shadow-md scale-[1.02]"
                  : isPassed
                  ? "bg-background/60 border-border"
                  : "bg-background/30 border-border/70 opacity-70"
              }`}
            >
              {/* Step indicator */}
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                    isActive
                      ? "bg-accent text-white shadow-sm"
                      : isPassed
                      ? "bg-success/20 text-success"
                      : "bg-card-hover text-muted"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <span
                  className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                    isActive
                      ? "bg-accent/15 text-accent"
                      : isPassed
                      ? "bg-success/10 text-success"
                      : "text-muted"
                  }`}
                >
                  {isActive ? "Active" : isPassed ? "Complete" : "Queued"}
                </span>
              </div>

              <h4 className="text-sm font-bold text-foreground mb-0.5">{stage.title}</h4>
              <span className="text-xs font-medium text-accent block mb-2">
                {stage.subtitle}
              </span>
              <p className="text-[11px] text-muted leading-relaxed">
                {stage.desc}
              </p>

              {/* Progress bar under active step */}
              {isActive && (
                <div className="mt-3 h-1 w-full bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-accent animate-pulse" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

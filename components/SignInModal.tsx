// components/SignInModal.tsx
"use client";

import { useAuth } from "./AuthContext";
import { X, Shield, Check, Building2, Code2 } from "lucide-react";

export function SignInModal() {
  const { isSignInOpen, setIsSignInOpen, user, loginAs } = useAuth();

  if (!isSignInOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md transition-opacity">
      <div className="relative w-full max-w-md p-6 rounded-2xl bg-card border border-border shadow-2xl">
        {/* Close Button */}
        <button
          onClick={() => setIsSignInOpen(false)}
          className="absolute top-4 right-4 text-muted hover:text-foreground p-1.5 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-5">
          <div className="w-8 h-8 rounded-lg bg-accent/15 border border-accent/25 text-accent flex items-center justify-center mb-3">
            <Shield className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-semibold text-foreground tracking-tight">
            Switch Perspective
          </h3>
          <p className="text-xs text-muted mt-1 leading-relaxed">
            Select an account to experience ResolvAI from either side of the escrow agreement.
          </p>
        </div>

        {/* Account Options */}
        <div className="space-y-3">
          {/* Option 1: Client */}
          <div
            onClick={() => loginAs("client")}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              user.role === "client"
                ? "bg-accent/[0.07] border-accent/60 shadow-sm"
                : "bg-background/60 border-border hover:border-zinc-500/40 hover:bg-card-hover"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent/15 border border-accent/30 text-accent flex items-center justify-center font-bold text-xs">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Acme Cloud Corp</h4>
                  <div className="flex items-center gap-1.5 text-[11px] text-muted">
                    <span>Sarah Jenkins</span>
                    <span>•</span>
                    <span className="text-accent font-medium">Client Role</span>
                  </div>
                </div>
              </div>
              {user.role === "client" && (
                <span className="h-5 w-5 rounded-full bg-accent text-white flex items-center justify-center text-xs">
                  <Check className="w-3 h-3" />
                </span>
              )}
            </div>
            <p className="text-xs text-muted leading-relaxed pl-11">
              Create contracts, lock PayPal milestone deposits, and define acceptance criteria for AI verification.
            </p>
          </div>

          {/* Option 2: Contractor */}
          <div
            onClick={() => loginAs("contractor")}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              user.role === "contractor"
                ? "bg-emerald-500/[0.08] border-emerald-500/60 shadow-sm"
                : "bg-background/60 border-border hover:border-zinc-500/40 hover:bg-card-hover"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 flex items-center justify-center font-bold text-xs">
                  <Code2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Alex Rivera</h4>
                  <div className="flex items-center gap-1.5 text-[11px] text-muted">
                    <span>Rivera Engineering</span>
                    <span>•</span>
                    <span className="text-emerald-500 font-medium">Contractor Role</span>
                  </div>
                </div>
              </div>
              {user.role === "contractor" && (
                <span className="h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs">
                  <Check className="w-3 h-3" />
                </span>
              )}
            </div>
            <p className="text-xs text-muted leading-relaxed pl-11">
              Submit pull request deliverables, run multi-agent audits, and receive instant PayPal payouts upon approval.
            </p>
          </div>
        </div>

        <div className="mt-5 pt-3.5 border-t border-border flex items-center justify-between text-[11px] text-muted">
          <span>Simulation Mode</span>
          <span className="flex items-center gap-1 text-emerald-500 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
            PayPal Sandbox Rails
          </span>
        </div>
      </div>
    </div>
  );
}

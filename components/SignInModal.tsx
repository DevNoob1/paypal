// components/SignInModal.tsx
"use client";

import { useAuth } from "./AuthContext";
import { X, ShieldCheck, Check } from "lucide-react";

export function SignInModal() {
  const { isSignInOpen, setIsSignInOpen, user, loginAs } = useAuth();

  if (!isSignInOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md p-6 rounded-3xl bg-card border border-border shadow-2xl">
        {/* Close Button */}
        <button
          onClick={() => setIsSignInOpen(false)}
          className="absolute top-5 right-5 text-muted hover:text-foreground p-1 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="w-10 h-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-foreground tracking-tight">
            Switch Perspective
          </h3>
          <p className="text-xs text-muted mt-1">
            Choose a role to experience how ResolvAI serves both parties.
          </p>
        </div>

        {/* Account Options */}
        <div className="space-y-3">
          {/* Option 1: Client */}
          <div
            onClick={() => loginAs("client")}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              user.role === "client"
                ? "bg-accent/10 border-accent shadow-sm"
                : "bg-background border-border hover:border-muted hover:bg-card-hover"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-accent text-white flex items-center justify-center font-bold text-sm">
                  🏢
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">Acme Cloud Corp</h4>
                  <span className="text-[11px] text-accent font-medium">
                    Client Role
                  </span>
                </div>
              </div>
              {user.role === "client" && (
                <span className="h-5 w-5 rounded-full bg-accent text-white flex items-center justify-center text-xs">
                  <Check className="w-3 h-3" />
                </span>
              )}
            </div>
            <p className="text-[11px] text-muted mt-2">
              • Create contracts and deposit milestone funds<br />
              • Define acceptance criteria for automated verification<br />
              • Monitor automated approvals and payouts
            </p>
          </div>

          {/* Option 2: Contractor */}
          <div
            onClick={() => loginAs("contractor")}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              user.role === "contractor"
                ? "bg-accent/10 border-accent shadow-sm"
                : "bg-background border-border hover:border-muted hover:bg-card-hover"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-success text-white flex items-center justify-center font-bold text-sm">
                  👨‍💻
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">Alex Rivera</h4>
                  <span className="text-[11px] text-success font-medium">
                    Contractor Role
                  </span>
                </div>
              </div>
              {user.role === "contractor" && (
                <span className="h-5 w-5 rounded-full bg-success text-white flex items-center justify-center text-xs">
                  <Check className="w-3 h-3" />
                </span>
              )}
            </div>
            <p className="text-[11px] text-muted mt-2">
              • Submit pull requests, test logs, and deliverables<br />
              • Request automated AI review<br />
              • Receive instant payouts to PayPal
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-border text-center">
          <span className="text-[11px] text-muted">
            Settlement rails powered by PayPal Sandbox
          </span>
        </div>
      </div>
    </div>
  );
}

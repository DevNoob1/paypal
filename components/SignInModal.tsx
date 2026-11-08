// components/SignInModal.tsx
"use client";

import { useAuth, UserRole } from "./AuthContext";
import { X, Building2, UserCheck, ShieldCheck, ArrowRight, Check } from "lucide-react";

export function SignInModal() {
  const { isSignInOpen, setIsSignInOpen, user, loginAs } = useAuth();

  if (!isSignInOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={() => setIsSignInOpen(false)}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Select Your Account
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            ResolvAI tailors dashboard actions, contracts, and settlement tools based on your organization type.
          </p>
        </div>

        {/* Account Options */}
        <div className="space-y-3">
          {/* Option 1: Enterprise Client */}
          <div
            onClick={() => loginAs("client")}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              user.role === "client"
                ? "bg-blue-950/40 border-blue-500 shadow-lg shadow-blue-500/10"
                : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  🏢
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Acme Cloud Corp</h4>
                  <span className="text-[11px] text-blue-400 font-medium">
                    Enterprise Client & Buyer
                  </span>
                </div>
              </div>
              {user.role === "client" && (
                <span className="h-5 w-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">
                  <Check className="w-3 h-3" />
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              • Lock milestone funds in PayPal escrow<br />
              • Set technical acceptance criteria<br />
              • Authorize automated settlements
            </p>
          </div>

          {/* Option 2: Contractor / Vendor */}
          <div
            onClick={() => loginAs("contractor")}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              user.role === "contractor"
                ? "bg-blue-950/40 border-blue-500 shadow-lg shadow-blue-500/10"
                : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                  👨‍💻
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Alex Rivera</h4>
                  <span className="text-[11px] text-emerald-400 font-medium">
                    Verified Lead Contractor
                  </span>
                </div>
              </div>
              {user.role === "contractor" && (
                <span className="h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs">
                  <Check className="w-3 h-3" />
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              • Submit pull requests and test logs<br />
              • Request Tri-Agent automated audit<br />
              • Receive instant payouts to PayPal
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 text-center">
          <span className="text-[11px] text-slate-500">
            PayPal Single Sign-On Enabled • 256-bit Encrypted
          </span>
        </div>
      </div>
    </div>
  );
}

// app/contracts/new/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Plus,
  Trash2,
  DollarSign,
  Calendar,
  Lock,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Zap,
} from "lucide-react";

export default function NewContractPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"DETAILS" | "ESCROW_PAYMENT">("DETAILS");

  // Form State
  const [title, setTitle] = useState("REST API Microservice with Docker & Tests");
  const [description, setDescription] = useState(
    "Build a production-ready Node.js/TypeScript microservice with rate limiting, OpenAPI 3.0 documentation, and Docker Compose."
  );
  const [amount, setAmount] = useState("350.00");
  const [currency, setCurrency] = useState("USD");
  const [clientName, setClientName] = useState("Venture Studio Labs");
  const [clientEmail, setClientEmail] = useState("sb-merchant-corp@business.example.com");
  const [freelancerName, setFreelancerName] = useState("Jordan Chen");
  const [freelancerEmail, setFreelancerEmail] = useState("sb-contractor@personal.example.com");
  const [criteria, setCriteria] = useState<string[]>([
    "Docker container builds cleanly with docker-compose up",
    "OpenAPI 3.0 / Swagger docs available at /api/docs",
    "Rate limiting middleware active (max 100 req/min per IP)",
    "Unit test coverage > 85% with passing CI checks",
  ]);
  const [newCriterion, setNewCriterion] = useState("");
  const [deadline, setDeadline] = useState("2026-11-20");

  useEffect(() => {
    const d = new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0];
    setDeadline(d);
  }, []);
  const [createdContractId, setCreatedContractId] = useState<string | null>(null);
  const [paypalOrderId, setPaypalOrderId] = useState<string | null>(null);

  const addCriterion = () => {
    if (newCriterion.trim()) {
      setCriteria([...criteria, newCriterion.trim()]);
      setNewCriterion("");
    }
  };

  const removeCriterion = (index: number) => {
    setCriteria(criteria.filter((_, i) => i !== index));
  };

  const applyTemplate = (type: "web" | "ai" | "mobile") => {
    if (type === "web") {
      setTitle("Fullstack Webhook Service & CI Pipeline");
      setAmount("400.00");
      setCriteria([
        "Secure webhook signature verification middleware",
        "Idempotency database table preventing duplicate execution",
        "Automated GitHub Actions CI passing unit tests",
      ]);
    } else if (type === "ai") {
      setTitle("Gemini 1.5 Multimodal Document Extraction Agent");
      setAmount("500.00");
      setCriteria([
        "Extracts tabular data from PDF invoices with >95% accuracy",
        "Structured JSON schema output validation",
        "Error handling for corrupted or unreadable documents",
      ]);
    } else if (type === "mobile") {
      setTitle("React Native Cross-Platform Onboarding Flow");
      setAmount("300.00");
      setCriteria([
        "Smooth 60fps animations on both iOS and Android",
        "Biometric authentication (FaceID / Fingerprint)",
        "Zero TypeScript errors with strict mode enabled",
      ]);
    }
  };

  // Step 1: Initialize contract in backend
  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create a PayPal Sandbox Order
      const paypalRes = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(amount),
          currency,
          description: title,
        }),
      });

      const orderData = await paypalRes.json();
      const orderId = orderData.id || `MOCK_ORDER_${Date.now()}`;
      setPaypalOrderId(orderId);

      // 2. Create the contract in draft/funded state
      const contractRes = await fetch("/api/contracts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          amount: parseFloat(amount),
          currency,
          clientName,
          clientEmail,
          freelancerName,
          freelancerEmail,
          criteria,
          paypalOrderId: orderId,
        }),
      });

      const data = await contractRes.json();
      if (data.contract) {
        setCreatedContractId(data.contract.id);
        setStep("ESCROW_PAYMENT");
      }
    } catch (err) {
      console.error("Error creating escrow:", err);
      alert("Failed to initialize contract. Please check console.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Confirm PayPal Sandbox Lock
  const handleConfirmEscrowLock = async () => {
    setLoading(true);
    try {
      if (paypalOrderId && createdContractId) {
        // Attempt to capture PayPal order in sandbox
        await fetch("/api/paypal/capture-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: paypalOrderId }),
        }).catch(() => null);

        // Update contract status to FUNDED_ESCROW
        await fetch(`/api/contracts/${createdContractId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "FUNDED_ESCROW",
            escrowCapturedAt: new Date().toISOString(),
          }),
        });

        router.push(`/contracts/${createdContractId}`);
      }
    } catch (err) {
      console.error("Failed to capture order:", err);
      if (createdContractId) router.push(`/contracts/${createdContractId}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
      {/* Back button */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Dashboard
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Create Milestone Escrow Contract
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Lock payment in PayPal Sandbox. Define unambiguous acceptance criteria for autonomous AI review.
        </p>
      </div>

      {step === "DETAILS" ? (
        <form onSubmit={handleProceedToPayment} className="space-y-8">
          {/* Preset Templates */}
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Quick Templates
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applyTemplate("web")}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium transition-colors"
              >
                ⚡ Fullstack Webhook & Idempotency
              </button>
              <button
                type="button"
                onClick={() => applyTemplate("ai")}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium transition-colors"
              >
                🤖 Gemini AI Document Extraction
              </button>
              <button
                type="button"
                onClick={() => applyTemplate("mobile")}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium transition-colors"
              >
                📱 React Native Onboarding
              </button>
            </div>
          </div>

          {/* Section 1: Milestone Overview */}
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <span className="h-6 w-6 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center text-xs">
                1
              </span>
              Contract Scope & Budget
            </h2>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Milestone Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Detailed Scope of Work
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Escrow Amount ($USD)
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="number"
                    step="1.00"
                    min="1"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-semibold text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Target Completion Deadline
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Parties */}
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <span className="h-6 w-6 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center text-xs">
                2
              </span>
              Parties & PayPal Sandbox Accounts
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Client / Buyer (Funding Party)
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Organization or Name"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white mb-2"
                />
                <input
                  type="email"
                  required
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="Sandbox buyer email"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Contractor / Vendor (Receiving Party)
                </label>
                <input
                  type="text"
                  required
                  value={freelancerName}
                  onChange={(e) => setFreelancerName(e.target.value)}
                  placeholder="Contractor Name"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white mb-2"
                />
                <input
                  type="email"
                  required
                  value={freelancerEmail}
                  onChange={(e) => setFreelancerEmail(e.target.value)}
                  placeholder="Sandbox payout receiver email"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Acceptance Criteria */}
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <span className="h-6 w-6 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center text-xs">
                  3
                </span>
                AI Acceptance Criteria
              </h2>
              <span className="text-xs text-cyan-400 font-medium flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Evaluated by Gemini
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Each criterion will be strictly tested by the AI against submitted PRs, links, and test logs before releasing escrow.
            </p>

            <div className="space-y-2">
              {criteria.map((crit, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800"
                >
                  <div className="flex items-center gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>{crit}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCriterion(index)}
                    className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add new item */}
            <div className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="e.g. End-to-end Cypress test passing in CI..."
                value={newCriterion}
                onChange={(e) => setNewCriterion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCriterion();
                  }
                }}
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={addCriterion}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={loading || criteria.length === 0}
            className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {loading ? "Generating PayPal Sandbox Order..." : "Proceed to Escrow Deposit ($" + amount + ")"}
          </button>
        </form>
      ) : (
        /* ESCROW LOCK SCREEN */
        <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-center max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">
            Lock Funds in PayPal Sandbox
          </h2>
          <p className="text-sm text-slate-400 mb-6">
            A PayPal Sandbox order has been prepared. Authorize the funds into the non-custodial escrow contract.
          </p>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 mb-6 text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Contract ID:</span>
              <span className="font-mono text-slate-300">{createdContractId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">PayPal Sandbox Order ID:</span>
              <span className="font-mono text-blue-400">{paypalOrderId}</span>
            </div>
            <div className="flex justify-between font-bold text-sm pt-2 border-t border-slate-800">
              <span className="text-slate-300">Total Escrow:</span>
              <span className="text-emerald-400">${amount} USD</span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleConfirmEscrowLock}
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              {loading ? "Capturing Sandbox Funds..." : "Simulate PayPal Checkout & Lock Escrow"}
            </button>

            <button
              onClick={() => setStep("DETAILS")}
              className="w-full py-2.5 rounded-xl text-xs text-slate-400 hover:text-white transition-colors"
            >
              Modify Contract Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

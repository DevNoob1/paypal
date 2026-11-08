// app/contracts/new/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  Trash2,
  DollarSign,
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Lock,
  Sparkles,
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
  const [clientName, setClientName] = useState("Acme Cloud Corp");
  const [clientEmail, setClientEmail] = useState("billing@acmecloud.io");
  const [freelancerName, setFreelancerName] = useState("Alex Rivera");
  const [freelancerEmail, setFreelancerEmail] = useState("alex.rivera@devmail.com");
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
      setTitle("Gemini Document Extraction Agent");
      setAmount("500.00");
      setCriteria([
        "Extracts tabular data from PDF invoices with high accuracy",
        "Structured JSON schema output validation",
        "Graceful error handling for corrupted or unreadable documents",
      ]);
    } else if (type === "mobile") {
      setTitle("React Native Cross-Platform Onboarding Flow");
      setAmount("300.00");
      setCriteria([
        "Smooth animations on both iOS and Android",
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
      // 1. Create a PayPal Order
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
      const orderId = orderData.id || `PP_ORD_${Date.now()}`;
      setPaypalOrderId(orderId);

      // 2. Create the contract
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
      alert("Failed to initialize contract. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Confirm PayPal Lock
  const handleConfirmEscrowLock = async () => {
    setLoading(true);
    try {
      if (paypalOrderId && createdContractId) {
        await fetch("/api/paypal/capture-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: paypalOrderId }),
        }).catch(() => null);

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
      {/* Back button */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Dashboard
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          Create Milestone Contract
        </h1>
        <p className="text-sm text-muted mt-1">
          Lock milestone payment securely via PayPal. Define clear acceptance criteria for AI review.
        </p>
      </div>

      {step === "DETAILS" ? (
        <form onSubmit={handleProceedToPayment} className="space-y-6">
          {/* Preset Templates */}
          <div className="p-4 rounded-2xl bg-card border border-border">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider block mb-2">
              Sample Templates
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applyTemplate("web")}
                className="px-3 py-1.5 rounded-lg bg-card-hover hover:bg-border text-xs text-foreground font-medium transition-colors cursor-pointer"
              >
                ⚡ Webhook & Idempotency Service
              </button>
              <button
                type="button"
                onClick={() => applyTemplate("ai")}
                className="px-3 py-1.5 rounded-lg bg-card-hover hover:bg-border text-xs text-foreground font-medium transition-colors cursor-pointer"
              >
                🤖 Document Extraction Agent
              </button>
              <button
                type="button"
                onClick={() => applyTemplate("mobile")}
                className="px-3 py-1.5 rounded-lg bg-card-hover hover:bg-border text-xs text-foreground font-medium transition-colors cursor-pointer"
              >
                📱 Mobile Onboarding Flow
              </button>
            </div>
          </div>

          {/* Section 1: Overview */}
          <div className="p-6 rounded-2xl bg-card border border-border space-y-4">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <span className="h-6 w-6 rounded-lg bg-accent/15 text-accent flex items-center justify-center text-xs font-bold">
                1
              </span>
              Contract Scope & Budget
            </h2>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Milestone Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Scope Description
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:border-accent"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Escrow Amount ($USD)
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    type="number"
                    step="1.00"
                    min="1"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-background border border-border text-sm font-semibold text-foreground focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Target Deadline
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:border-accent"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Parties */}
          <div className="p-6 rounded-2xl bg-card border border-border space-y-4">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <span className="h-6 w-6 rounded-lg bg-accent/15 text-accent flex items-center justify-center text-xs font-bold">
                2
              </span>
              Parties
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Client (Funding Party)
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Organization or Name"
                  className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-sm text-foreground mb-2"
                />
                <input
                  type="email"
                  required
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="Client PayPal billing email"
                  className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs text-muted"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Contractor (Receiving Party)
                </label>
                <input
                  type="text"
                  required
                  value={freelancerName}
                  onChange={(e) => setFreelancerName(e.target.value)}
                  placeholder="Contractor Name"
                  className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-sm text-foreground mb-2"
                />
                <input
                  type="email"
                  required
                  value={freelancerEmail}
                  onChange={(e) => setFreelancerEmail(e.target.value)}
                  placeholder="Contractor PayPal payout email"
                  className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs text-muted"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Acceptance Criteria */}
          <div className="p-6 rounded-2xl bg-card border border-border space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                <span className="h-6 w-6 rounded-lg bg-accent/15 text-accent flex items-center justify-center text-xs font-bold">
                  3
                </span>
                Acceptance Criteria
              </h2>
              <span className="text-xs text-accent font-medium flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Evaluated by AI
              </span>
            </div>

            <p className="text-xs text-muted">
              These criteria are evaluated against submitted pull requests, links, and test logs before releasing escrow.
            </p>

            <div className="space-y-2">
              {criteria.map((crit, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-background border border-border"
                >
                  <div className="flex items-center gap-2.5 text-xs text-foreground">
                    <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                    <span>{crit}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCriterion(index)}
                    className="text-muted hover:text-rose-500 p-1 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add item */}
            <div className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="e.g. Unit tests passing with >80% coverage..."
                value={newCriterion}
                onChange={(e) => setNewCriterion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCriterion();
                  }
                }}
                className="flex-1 px-3.5 py-2 rounded-xl bg-background border border-border text-xs text-foreground placeholder-muted focus:outline-none focus:border-accent"
              />
              <button
                type="button"
                onClick={addCriterion}
                className="px-4 py-2 rounded-xl bg-card-hover hover:bg-border text-xs font-semibold text-foreground flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || criteria.length === 0}
            className="w-full py-3.5 rounded-xl bg-accent hover:bg-accent-hover disabled:opacity-50 text-white font-semibold text-sm shadow-sm transition-all cursor-pointer"
          >
            {loading ? "Generating PayPal Escrow Order..." : `Proceed to Deposit Escrow ($${amount} USD)`}
          </button>
        </form>
      ) : (
        /* ESCROW CONFIRMATION */
        <div className="p-8 rounded-3xl bg-card border border-border text-center max-w-xl mx-auto shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-accent/15 text-accent flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7" />
          </div>

          <h2 className="text-xl font-bold text-foreground mb-2">
            Confirm Escrow Deposit
          </h2>
          <p className="text-sm text-muted mb-6">
            A PayPal payment order has been prepared. Authorize the funds to lock them safely in escrow.
          </p>

          <div className="p-4 rounded-2xl bg-background border border-border mb-6 text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-muted">Contract ID:</span>
              <span className="font-mono text-foreground">{createdContractId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">PayPal Order ID:</span>
              <span className="font-mono text-accent">{paypalOrderId}</span>
            </div>
            <div className="flex justify-between font-bold text-sm pt-2 border-t border-border">
              <span className="text-foreground">Total Escrow:</span>
              <span className="text-success">${amount} USD</span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleConfirmEscrowLock}
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-accent hover:bg-accent-hover text-white font-semibold text-sm shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              {loading ? "Securing Funds..." : "Confirm & Deposit via PayPal"}
            </button>

            <button
              onClick={() => setStep("DETAILS")}
              className="w-full py-2 text-xs text-muted hover:text-foreground transition-colors cursor-pointer"
            >
              Edit Contract Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

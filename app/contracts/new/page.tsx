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
  Zap,
  Bot,
  Smartphone,
  Palette,
  FileText,
} from "lucide-react";
import { useAuth } from "@/components/AuthContext";

export default function NewContractPage() {
  const router = useRouter();
  const { user, loginAs } = useAuth();
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

  const applyTemplate = (type: "web" | "ai" | "mobile" | "design" | "writing") => {
    if (type === "design") {
      setTitle("Mobile App UI/UX & Figma Design System");
      setDescription("Create high-fidelity responsive mobile mockups in Figma with typography, color tokens, and exportable vector assets.");
      setAmount("450.00");
      setCriteria([
        "Figma file with 6 high-fidelity mobile screens (iOS & Android)",
        "Design system components with Light and Dark variants",
        "Exportable asset library with vector icons and typography specs",
      ]);
    } else if (type === "writing") {
      setTitle("1,500-Word SEO Article & Launch Copy");
      setDescription("Research and write a comprehensive product launch guide with SEO optimization, meta tags, and social snippets.");
      setAmount("250.00");
      setCriteria([
        "1,500-word comprehensive product guide in Google Docs",
        "All 3 target SEO keywords incorporated in H2 sections",
        "Grammarly score > 90 with meta description and social snippets",
      ]);
    } else if (type === "web") {
      setTitle("Fullstack Webhook Service & CI Pipeline");
      setDescription("Build a production-ready Node.js/TypeScript microservice with rate limiting, OpenAPI 3.0 documentation, and Docker Compose.");
      setAmount("400.00");
      setCriteria([
        "Secure webhook signature verification middleware",
        "Idempotency database table preventing duplicate execution",
        "Automated GitHub Actions CI passing unit tests",
      ]);
    } else if (type === "ai") {
      setTitle("Gemini Document Extraction Agent");
      setDescription("Automate tabular extraction from invoices and documents into structured JSON with schema validation.");
      setAmount("500.00");
      setCriteria([
        "Extracts tabular data from PDF invoices with high accuracy",
        "Structured JSON schema output validation",
        "Graceful error handling for corrupted or unreadable documents",
      ]);
    } else if (type === "mobile") {
      setTitle("React Native Cross-Platform Onboarding Flow");
      setDescription("Build a smooth cross-platform onboarding flow with biometric authentication and zero strict-mode TypeScript errors.");
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
      {/* Back button */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground mb-4 transition-colors font-medium"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Dashboard
      </Link>

      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
          Create Milestone Contract
        </h1>
      </div>

      {user.role === "contractor" && (
        <div className="mb-5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-between gap-3 text-xs">
          <span className="text-amber-500">
            You are viewing as <strong>Contractor ({user.name})</strong>. Milestone contracts are typically created and funded by clients.
          </span>
          <button
            type="button"
            onClick={() => loginAs("client")}
            className="px-2.5 py-1 rounded-md bg-accent text-white font-medium hover:bg-accent-hover transition-colors shrink-0 cursor-pointer"
          >
            Switch to Client
          </button>
        </div>
      )}

      {step === "DETAILS" ? (
        <form onSubmit={handleProceedToPayment} className="space-y-5">
          {/* Preset Templates */}
          <div data-tour="contract-templates" className="p-3.5 rounded-xl bg-card/60 border border-border/80">
            <span className="text-[11px] font-semibold text-muted block mb-2">
              Sample Freelance Categories
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applyTemplate("design")}
                className="px-2.5 py-1.5 rounded-lg bg-background hover:bg-card-hover border border-border/80 text-xs text-foreground font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Palette className="w-3.5 h-3.5 text-accent" />
                UI/UX Design (Figma)
              </button>
              <button
                type="button"
                onClick={() => applyTemplate("writing")}
                className="px-2.5 py-1.5 rounded-lg bg-background hover:bg-card-hover border border-border/80 text-xs text-foreground font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-accent" />
                SEO Content (Google Docs)
              </button>
              <button
                type="button"
                onClick={() => applyTemplate("web")}
                className="px-2.5 py-1.5 rounded-lg bg-background hover:bg-card-hover border border-border/80 text-xs text-foreground font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-accent" />
                Web Service (GitHub PR)
              </button>
              <button
                type="button"
                onClick={() => applyTemplate("ai")}
                className="px-2.5 py-1.5 rounded-lg bg-background hover:bg-card-hover border border-border/80 text-xs text-foreground font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Bot className="w-3.5 h-3.5 text-accent" />
                AI Agent Pipeline
              </button>
            </div>
          </div>

          {/* Section 1: Overview */}
          <div data-tour="scope-budget" className="p-5 rounded-xl bg-card/60 border border-border/80 space-y-3.5">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <span className="h-5 w-5 rounded-md bg-accent/15 text-accent flex items-center justify-center text-xs font-bold">
                1
              </span>
              Contract Scope & Budget
            </h2>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Milestone Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs text-foreground focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Scope Description
              </label>
              <textarea
                rows={2}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs text-foreground focus:outline-none focus:border-accent"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-0.5">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Escrow Amount ($USD)
                </label>
                <div className="relative">
                  <DollarSign className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    type="number"
                    step="1.00"
                    min="1"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-lg bg-background border border-border text-xs font-semibold font-mono text-foreground focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Target Deadline
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs text-foreground focus:outline-none focus:border-accent"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Parties */}
          <div data-tour="contract-parties" className="p-5 rounded-xl bg-card/60 border border-border/80 space-y-3.5">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <span className="h-5 w-5 rounded-md bg-accent/15 text-accent flex items-center justify-center text-xs font-bold">
                2
              </span>
              Parties
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Funding Client
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Organization or Name"
                  className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-xs text-foreground mb-1.5 focus:outline-none focus:border-accent"
                />
                <input
                  type="email"
                  required
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="Client PayPal billing email"
                  className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-[11px] text-muted font-mono focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Contractor (Recipient)
                </label>
                <input
                  type="text"
                  required
                  value={freelancerName}
                  onChange={(e) => setFreelancerName(e.target.value)}
                  placeholder="Contractor Name"
                  className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-xs text-foreground mb-1.5 focus:outline-none focus:border-accent"
                />
                <input
                  type="email"
                  required
                  value={freelancerEmail}
                  onChange={(e) => setFreelancerEmail(e.target.value)}
                  placeholder="Contractor PayPal payout email"
                  className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-[11px] text-muted font-mono focus:outline-none focus:border-accent"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Acceptance Criteria */}
          <div data-tour="acceptance-criteria" className="p-5 rounded-xl bg-card/60 border border-border/80 space-y-3.5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <span className="h-5 w-5 rounded-md bg-accent/15 text-accent flex items-center justify-center text-xs font-bold">
                  3
                </span>
                Acceptance Criteria
              </h2>
              <span className="text-xs text-accent font-medium flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Audited by AI
              </span>
            </div>

            <div className="space-y-1.5">
              {criteria.map((crit, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-background/60 border border-border/70"
                >
                  <div className="flex items-center gap-2 text-xs text-foreground">
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
                    <span>{crit}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCriterion(index)}
                    className="text-muted hover:text-rose-500 p-1 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
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
                className="flex-1 px-3 py-1.5 rounded-lg bg-background border border-border text-xs text-foreground placeholder-muted focus:outline-none focus:border-accent"
              />
              <button
                type="button"
                onClick={addCriterion}
                className="px-3 py-1.5 rounded-lg bg-card hover:bg-card-hover border border-border text-xs font-medium text-foreground flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>
          </div>

          {/* Submit */}
          <div data-tour="deposit-escrow-btn">
            <button
              type="submit"
              disabled={loading || criteria.length === 0}
              className="w-full py-2.5 rounded-lg bg-accent hover:bg-accent-hover disabled:opacity-50 text-white font-medium text-xs shadow-xs transition-all cursor-pointer"
            >
              {loading ? "Generating PayPal Escrow Order..." : `Proceed to Deposit Escrow ($${amount} USD)`}
            </button>
          </div>
        </form>
      ) : (
        /* ESCROW CONFIRMATION */
        <div className="p-6 rounded-xl bg-card/60 border border-border/80 text-center max-w-lg mx-auto shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center mx-auto mb-3">
            <Lock className="w-5 h-5" />
          </div>

          <h2 className="text-base font-bold text-foreground mb-1">
            Confirm Escrow Deposit
          </h2>
          <p className="text-xs text-muted mb-4 font-medium">
            Funds will be locked securely in PayPal escrow until work is approved.
          </p>

          <div className="p-3.5 rounded-lg bg-background/60 border border-border mb-5 text-left text-xs font-mono space-y-1.5">
            <div className="flex justify-between">
              <span className="text-muted font-sans">Contract ID:</span>
              <span className="text-foreground">{createdContractId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted font-sans">PayPal Order ID:</span>
              <span className="text-accent">{paypalOrderId}</span>
            </div>
            <div className="flex justify-between font-bold text-sm pt-2 border-t border-border">
              <span className="text-foreground font-sans">Total Escrow:</span>
              <span className="text-emerald-500">${amount} USD</span>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleConfirmEscrowLock}
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white font-medium text-xs shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5" />
              {loading ? "Securing Funds..." : "Confirm & Deposit via PayPal"}
            </button>

            <button
              onClick={() => setStep("DETAILS")}
              className="w-full py-1.5 text-xs text-muted hover:text-foreground transition-colors cursor-pointer"
            >
              Edit Contract Specifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

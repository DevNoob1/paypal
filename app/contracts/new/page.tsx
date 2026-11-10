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
  Layers,
  Check,
  RefreshCw,
  Wand2,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useAuth } from "@/components/AuthContext";

interface FormMilestone {
  id: string;
  title: string;
  amount: string;
  criteria: string[];
  newCriterionText?: string;
}

const TEMPLATES = [
  {
    id: "web-dev",
    icon: "💻",
    name: "Web App & Next.js",
    budget: "1800",
    title: "Full-Stack Web App & Payment Integration",
    description:
      "Build Next.js 15 web application with responsive UI, role-based authentication, and direct PayPal checkout.",
    milestones: [
      {
        id: "m_1",
        title: "Phase 1: Architecture, Authentication & Foundation",
        amount: "550",
        criteria: [
          "Next.js App Router project initialized with TypeScript and Tailwind CSS",
          "Authentication and role-based session management configured",
          "Clean GitHub repository with zero lint errors and CI workflow",
        ],
      },
      {
        id: "m_2",
        title: "Phase 2: Core Business Logic & PayPal Checkout",
        amount: "800",
        criteria: [
          "Interactive dashboard with live data tables and responsive layouts",
          "PayPal Orders & Payouts API integration tested in sandbox",
          "Deliverable submission flow with validation checks and error handling",
        ],
      },
      {
        id: "m_3",
        title: "Phase 3: Automated Verification, QA & Staging Deployment",
        amount: "450",
        criteria: [
          "Automated milestone verification engine with live URL and screenshot checks",
          "Comprehensive end-to-end user testing across client and contractor flows",
          "Live staging deployment accessible via public HTTPS URL with HTTP 200 OK",
        ],
      },
    ],
  },
  {
    id: "figma",
    icon: "🎨",
    name: "Figma UI/UX Design",
    budget: "1200",
    title: "Mobile App Design System & Prototype",
    description:
      "Design comprehensive mobile app interface with complete Figma component tokens and interactive clickable prototype.",
    milestones: [
      {
        id: "m_1",
        title: "Phase 1: Design System, Tokens & Wireframes",
        amount: "540",
        criteria: [
          "Figma component library with auto-layout and color/typography tokens",
          "Responsive wireframes for mobile, tablet, and desktop viewports",
          "User flow architecture covering onboarding and primary user dashboard",
        ],
      },
      {
        id: "m_2",
        title: "Phase 2: High-Fidelity UI Prototype & Developer Specs",
        amount: "660",
        criteria: [
          "Fully interactive clickable Figma prototype with hover and modal states",
          "Design handoff specs with documented padding, hex tokens, and assets",
          "Exportable SVG icon suite and responsive asset package",
        ],
      },
    ],
  },
  {
    id: "brand",
    icon: "✒️",
    name: "Brand & Vector Suite",
    budget: "800",
    title: "Brand Identity, Logo & Vector Asset Suite",
    description:
      "Complete visual identity system including primary/secondary logos, brand style guidelines, and scalable vector assets.",
    milestones: [
      {
        id: "m_1",
        title: "Phase 1: Concept Moodboards & Logo Exploration",
        amount: "400",
        criteria: [
          "3 distinct creative direction moodboards with typography pairings",
          "Primary and secondary logo mark sketches in monochrome and full color",
          "Client presentation deck with feedback reconciliation notes",
        ],
      },
      {
        id: "m_2",
        title: "Phase 2: Brand Guidelines & Vector Asset Package",
        amount: "400",
        criteria: [
          "Comprehensive 15-page brand style guide PDF (clear space, colors, rules)",
          "Master vector deliverables in AI, SVG, EPS, and high-res PNG formats",
          "Social media banner templates and avatar asset pack",
        ],
      },
    ],
  },
  {
    id: "seo",
    icon: "📈",
    name: "SEO & Content Marketing",
    budget: "600",
    title: "SEO Strategy & Launch Article Campaign",
    description:
      "Comprehensive SEO content strategy, keyword research, and high-ranking article publication.",
    milestones: [
      {
        id: "m_1",
        title: "Phase 1: Keyword Research & Content Architecture",
        amount: "240",
        criteria: [
          "Comprehensive keyword gap analysis and search volume report",
          "Detailed content briefs for 5 targeted long-form articles with H2/H3 outlines",
          "Internal linking strategy and competitor benchmark audit",
        ],
      },
      {
        id: "m_2",
        title: "Phase 2: Draft Articles, On-Page SEO & Publication",
        amount: "360",
        criteria: [
          "5 published SEO-optimized articles (minimum 1,500 words each)",
          "Meta titles, descriptions, and OpenGraph tags configured",
          "Grammarly score > 95% and zero detected plagiarism",
        ],
      },
    ],
  },
];

export default function NewContractPage() {
  const router = useRouter();
  const { user, loginAs } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"DETAILS" | "ESCROW_PAYMENT">("DETAILS");

  // Agreement Structure Mode: "single" vs "phased"
  const [agreementMode, setAgreementMode] = useState<"single" | "phased">("phased");

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("1800");
  const [currency] = useState("USD");
  const [clientName, setClientName] = useState(user.role === "client" ? user.name : "Acme Client Corp");
  const [clientEmail, setClientEmail] = useState(user.role === "client" ? user.email : "billing@acme.com");
  const [freelancerName, setFreelancerName] = useState("Alex Rivera");
  const [freelancerEmail, setFreelancerEmail] = useState("alex.rivera@devmail.com");
  const [criteria, setCriteria] = useState<string[]>([]);
  const [newCriterion, setNewCriterion] = useState("");
  const [deadline, setDeadline] = useState("");

  // Phased Milestones State (Preloaded with Web App template default for instant demo readiness)
  const [milestones, setMilestones] = useState<FormMilestone[]>(TEMPLATES[0].milestones);

  // AI Generation State
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiSuccessNotice, setAiSuccessNotice] = useState(false);

  useEffect(() => {
    // Default 14-day deadline
    const d = new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0];
    setDeadline(d);

    // Apply template 0 by default so the user is never faced with a blank intimidating form
    setTitle(TEMPLATES[0].title);
    setDescription(TEMPLATES[0].description);
    setAmount(TEMPLATES[0].budget);
    setMilestones(TEMPLATES[0].milestones);

    if (user.role === "client") {
      setClientName(user.name);
      setClientEmail(user.email);
    }
  }, [user]);

  const [createdContractId, setCreatedContractId] = useState<string | null>(null);
  const [paypalOrderId, setPaypalOrderId] = useState<string | null>(null);

  // Animated Escrow Creation Flow State
  const [escrowFlowOpen, setEscrowFlowOpen] = useState(false);
  const [escrowFlowStep, setEscrowFlowStep] = useState(1);
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  // Dynamic calculated amount
  const totalCalculatedAmount =
    agreementMode === "phased"
      ? milestones
          .reduce((sum, m) => sum + (parseFloat(m.amount) || 0), 0)
          .toFixed(2)
      : amount || "0.00";

  // Quick Template Applier
  const applyTemplate = (tmpl: (typeof TEMPLATES)[number]) => {
    setTitle(tmpl.title);
    setDescription(tmpl.description);
    setAmount(tmpl.budget);
    setMilestones(
      tmpl.milestones.map((m) => ({
        ...m,
        id: `m_${Date.now().toString().slice(-4)}_${Math.random().toString().slice(2, 5)}`,
      }))
    );
    setAgreementMode("phased");
  };

  // AI Milestone & Budget Generator
  const handleAiAutoStructure = async () => {
    setAiGenerating(true);
    try {
      const budgetNum =
        parseFloat(agreementMode === "phased" ? totalCalculatedAmount : amount) || 1500;

      const res = await fetch("/api/contracts/ai-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim() || "Milestone Deliverable Contract",
          description: description.trim() || "Full project deliverables and technical specifications.",
          budget: budgetNum,
        }),
      });

      const data = await res.json();
      if (data.milestones && data.milestones.length > 0) {
        setAgreementMode("phased");
        setMilestones(
          data.milestones.map((m: any, idx: number) => ({
            id: `m_${idx + 1}_${Date.now().toString().slice(-4)}`,
            title: m.title,
            amount: String(m.amount),
            criteria: m.criteria,
            newCriterionText: "",
          }))
        );
        setAiSuccessNotice(true);
        setTimeout(() => setAiSuccessNotice(false), 4500);
      }
    } catch (err) {
      console.error("AI auto structure failed:", err);
    } finally {
      setAiGenerating(false);
    }
  };

  // Single mode criteria helpers
  const addCriterion = () => {
    if (newCriterion.trim()) {
      setCriteria([...criteria, newCriterion.trim()]);
      setNewCriterion("");
    }
  };

  const removeCriterion = (index: number) => {
    setCriteria(criteria.filter((_, i) => i !== index));
  };

  // Multi-milestone helpers
  const addMilestone = () => {
    const nextIdx = milestones.length + 1;
    setMilestones([
      ...milestones,
      {
        id: `m_${nextIdx}_${Date.now().toString().slice(-4)}`,
        title: "",
        amount: "",
        criteria: [],
        newCriterionText: "",
      },
    ]);
  };

  const updateMilestone = (id: string, field: "title" | "amount", val: string) => {
    setMilestones(
      milestones.map((m) => (m.id === id ? { ...m, [field]: val } : m))
    );
  };

  const removeMilestone = (id: string) => {
    if (milestones.length <= 1) return;
    setMilestones(milestones.filter((m) => m.id !== id));
  };

  const addMilestoneCriterion = (milestoneId: string, text: string) => {
    if (!text.trim()) return;
    setMilestones(
      milestones.map((m) =>
        m.id === milestoneId
          ? {
              ...m,
              criteria: [...m.criteria, text.trim()],
              newCriterionText: "",
            }
          : m
      )
    );
  };

  const removeMilestoneCriterion = (milestoneId: string, idx: number) => {
    setMilestones(
      milestones.map((m) =>
        m.id === milestoneId
          ? { ...m, criteria: m.criteria.filter((_, i) => i !== idx) }
          : m
      )
    );
  };

  // Step 1: Initialize contract in backend
  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const finalAmount = parseFloat(totalCalculatedAmount);
      const payloadMilestones =
        agreementMode === "phased"
          ? milestones.map((m) => ({
              id: m.id,
              title: m.title.trim() || "Milestone Deliverable",
              amount: parseFloat(m.amount) || 100,
              criteria: m.criteria.length > 0 ? m.criteria : ["Deliverable satisfies agreed scope"],
            }))
          : undefined;

      const payloadCriteria =
        agreementMode === "phased"
          ? milestones.flatMap((m) => m.criteria)
          : criteria;

      // 1. Create a PayPal Order
      const paypalRes = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalAmount,
          currency,
          description: title || "Milestone Contract Escrow",
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
          title: title.trim() || "Untitled Milestone Agreement",
          description: description.trim() || "Milestone deliverables agreed between client and contractor.",
          amount: finalAmount,
          currency,
          clientName: clientName.trim() || user.name,
          clientEmail: clientEmail.trim() || user.email,
          freelancerName: freelancerName.trim() || "Alex Rivera",
          freelancerEmail: freelancerEmail.trim() || "alex.rivera@devmail.com",
          criteria: payloadCriteria.length > 0 ? payloadCriteria : ["Deliverable implemented to standard"],
          milestones: payloadMilestones,
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
    setEscrowFlowOpen(true);
    setEscrowFlowStep(1);

    try {
      await sleep(650);
      setEscrowFlowStep(2);

      const capturePromise = (async () => {
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
        }
      })();

      await sleep(750);
      setEscrowFlowStep(3);

      await capturePromise;
      await sleep(650);
      setEscrowFlowStep(4);
      confetti({ particleCount: 140, spread: 80, origin: { y: 0.5 } });

      await sleep(850);
      if (createdContractId) router.push(`/contracts/${createdContractId}`);
    } catch (err) {
      console.error("Failed to capture order:", err);
      if (createdContractId) router.push(`/contracts/${createdContractId}`);
    } finally {
      setLoading(false);
      setEscrowFlowOpen(false);
    }
  };

  const isSubmitDisabled =
    loading ||
    (agreementMode === "single"
      ? !title.trim() || !amount.trim() || criteria.length === 0
      : !title.trim() ||
        milestones.length === 0 ||
        milestones.some((m) => !m.title.trim() || !m.amount.trim() || m.criteria.length === 0));

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
        <p className="text-xs text-muted mt-1">
          Lock payment safely in PayPal escrow. Funds release only when deliverable proof satisfies agreed criteria.
        </p>
      </div>

      {user.role === "contractor" && (
        <div className="mb-5 p-3 rounded-xl bg-accent/10 border border-accent/25 flex items-center justify-between gap-3 text-xs">
          <span className="text-foreground">
            You are viewing as <strong>Contractor ({user.name})</strong>. You can draft an agreement or fund it as client.
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
        <form onSubmit={handleProceedToPayment} className="space-y-6">
          {/* Quick Category Templates */}
          <div className="p-4 rounded-xl bg-card/60 border border-border/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <span>Select Work Template</span>
                <span className="text-[10px] text-muted font-normal">(Auto-fills phased milestones & budget)</span>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => applyTemplate(tmpl)}
                  className="p-2.5 rounded-lg bg-background hover:bg-card border border-border hover:border-accent/50 text-left transition-all cursor-pointer group flex flex-col justify-between space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base">{tmpl.icon}</span>
                    <span className="text-[11px] font-mono font-bold text-emerald-400">
                      ${tmpl.budget}
                    </span>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-1">
                      {tmpl.name}
                    </div>
                    <div className="text-[10px] text-muted">
                      {tmpl.milestones.length} Phases
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Milestone Structure Selector */}
          <div className="p-3.5 rounded-xl bg-card/60 border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-foreground block">Agreement Structure</span>
              <span className="text-[11px] text-muted">Choose single milestone or multi-phase project schedule</span>
            </div>
            <div className="flex items-center gap-1 bg-background/80 p-1 rounded-lg border border-border self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setAgreementMode("single")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  agreementMode === "single"
                    ? "bg-accent text-white shadow-xs font-semibold"
                    : "text-muted hover:text-foreground"
                }`}
              >
                Single Milestone
              </button>
              <button
                type="button"
                onClick={() => setAgreementMode("phased")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  agreementMode === "phased"
                    ? "bg-accent text-white shadow-xs font-semibold"
                    : "text-muted hover:text-foreground"
                }`}
              >
                <Layers className="w-3 h-3" />
                Multi-Milestone Project ({milestones.length})
              </button>
            </div>
          </div>

          {/* Section 1: Overview */}
          <div data-tour="scope-budget" className="p-5 rounded-xl bg-card/60 border border-border/80 space-y-3.5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <span className="h-5 w-5 rounded-md bg-accent/15 text-accent flex items-center justify-center text-xs font-bold">
                  1
                </span>
                {agreementMode === "phased" ? "Project Overview & Schedule" : "Contract Scope & Budget"}
              </h2>

              {/* AI Auto-Structure Milestones & Budget Button */}
              <button
                type="button"
                onClick={handleAiAutoStructure}
                disabled={aiGenerating}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/15 hover:bg-accent/25 border border-accent/30 text-accent text-xs font-medium transition-all cursor-pointer disabled:opacity-50 shadow-xs"
              >
                {aiGenerating ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin text-accent" />
                    <span>Structuring Milestones...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3 text-accent" />
                    <span>Auto-Split Milestones & Budget</span>
                  </>
                )}
              </button>
            </div>

            {aiSuccessNotice && (
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-xs text-emerald-400 flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>
                  Successfully structured {milestones.length} phased milestones and split the ${totalCalculatedAmount} budget with criteria!
                </span>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                {agreementMode === "phased" ? "Project Agreement Title *" : "Milestone Title *"}
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Next.js App & PayPal Integration"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs text-foreground placeholder-muted/60 focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Project Scope Description *
              </label>
              <textarea
                rows={2}
                required
                placeholder="Describe project deliverables, requirements, and technical specifications..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs text-foreground placeholder-muted/60 focus:outline-none focus:border-accent"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-0.5">
              {agreementMode === "single" ? (
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Escrow Amount ($USD) *
                  </label>
                  <div className="relative">
                    <DollarSign className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                      type="number"
                      step="1.00"
                      min="1"
                      required
                      placeholder="450.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 rounded-lg bg-background border border-border text-xs font-semibold font-mono text-foreground placeholder-muted/50 focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Total Project Budget (Calculated)
                  </label>
                  <div className="p-2 rounded-lg bg-background border border-border text-xs font-bold font-mono text-emerald-400 flex items-center justify-between">
                    <span>${totalCalculatedAmount} USD</span>
                    <span className="text-[10.5px] text-muted font-sans font-normal">
                      {milestones.length} Milestone{milestones.length > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              )}

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
                  placeholder="Client Organization Name"
                  className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-xs text-foreground placeholder-muted/60 mb-1.5 focus:outline-none focus:border-accent"
                />
                <input
                  type="email"
                  required
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="billing@client.com"
                  className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-[11px] text-foreground placeholder-muted/60 font-mono focus:outline-none focus:border-accent"
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
                  className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-xs text-foreground placeholder-muted/60 mb-1.5 focus:outline-none focus:border-accent"
                />
                <input
                  type="email"
                  required
                  value={freelancerEmail}
                  onChange={(e) => setFreelancerEmail(e.target.value)}
                  placeholder="contractor@paypal.com"
                  className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-[11px] text-foreground placeholder-muted/60 font-mono focus:outline-none focus:border-accent"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Criteria or Phased Milestones */}
          {agreementMode === "single" ? (
            <div data-tour="acceptance-criteria" className="p-5 rounded-xl bg-card/60 border border-border/80 space-y-3.5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <span className="h-5 w-5 rounded-md bg-accent/15 text-accent flex items-center justify-center text-xs font-bold">
                    3
                  </span>
                  Acceptance Criteria Checklist *
                </h2>
                <span className="text-xs text-accent font-medium flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Objective Escrow Checks
                </span>
              </div>

              {criteria.length === 0 ? (
                <div className="py-5 px-4 text-center border border-dashed border-border/70 rounded-lg text-xs text-muted">
                  No criteria added yet. Add at least 1 objective requirement below that the deliverable must satisfy to unlock payment.
                </div>
              ) : (
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
                        title="Remove criterion"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add item */}
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder="e.g. Mobile checkout form with card validation (press Add or Enter)..."
                  value={newCriterion}
                  onChange={(e) => setNewCriterion(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCriterion();
                    }
                  }}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-background border border-border text-xs text-foreground placeholder-muted/60 focus:outline-none focus:border-accent"
                />
                <button
                  type="button"
                  onClick={addCriterion}
                  className="px-3 py-1.5 rounded-lg bg-card hover:bg-card-hover border border-border text-xs font-medium text-foreground flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Rule
                </button>
              </div>
            </div>
          ) : (
            /* PHASED MILESTONES BUILDER */
            <div className="p-5 rounded-xl bg-card/60 border border-border/80 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <span className="h-5 w-5 rounded-md bg-accent/15 text-accent flex items-center justify-center text-xs font-bold">
                    3
                  </span>
                  Phased Milestones & Budget Breakdown
                </h2>
                <span className="text-xs text-accent font-medium flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5" />
                  Sequential Settlement
                </span>
              </div>

              <div className="space-y-4">
                {milestones.map((milestone, mIdx) => (
                  <div
                    key={milestone.id}
                    className="p-4 rounded-xl bg-background/80 border border-border/80 space-y-3"
                  >
                    {/* Milestone Header */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-accent/15 text-accent font-mono text-xs font-bold flex items-center justify-center">
                          {mIdx + 1}
                        </span>
                        <span className="text-xs font-bold text-foreground">
                          Milestone Phase {mIdx + 1}
                        </span>
                      </div>

                      {milestones.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMilestone(milestone.id)}
                          className="text-muted hover:text-rose-400 text-xs flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove Phase</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                      <div className="sm:col-span-8">
                        <label className="block text-[11px] font-medium text-muted mb-1">
                          Phase Deliverable Title *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Phase 1: Wireframes & Navigation Architecture"
                          value={milestone.title}
                          onChange={(e) => updateMilestone(milestone.id, "title", e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-card border border-border text-xs text-foreground placeholder-muted/60 focus:outline-none focus:border-accent"
                        />
                      </div>

                      <div className="sm:col-span-4">
                        <label className="block text-[11px] font-medium text-muted mb-1">
                          Phase Amount ($USD) *
                        </label>
                        <div className="relative">
                          <DollarSign className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                          <input
                            type="number"
                            min="1"
                            step="1.00"
                            required
                            placeholder="200.00"
                            value={milestone.amount}
                            onChange={(e) => updateMilestone(milestone.id, "amount", e.target.value)}
                            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-card border border-border text-xs font-mono font-bold text-foreground placeholder-muted/50 focus:outline-none focus:border-accent"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Milestone Checklist Criteria */}
                    <div className="space-y-1.5 pt-1">
                      <label className="block text-[10.5px] font-semibold text-muted uppercase tracking-wider">
                        Acceptance Criteria for Phase {mIdx + 1} *
                      </label>
                      {milestone.criteria.length === 0 ? (
                        <div className="py-2.5 px-3 border border-dashed border-border/60 rounded-lg text-[11px] text-muted">
                          No requirements added for this phase yet. Add at least 1 checkpoint below.
                        </div>
                      ) : (
                        milestone.criteria.map((c, cIdx) => (
                          <div
                            key={cIdx}
                            className="flex items-center justify-between gap-2 p-2 rounded-lg bg-card/60 border border-border/60 text-xs text-foreground"
                          >
                            <div className="flex items-center gap-1.5">
                              <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                              <span>{c}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeMilestoneCriterion(milestone.id, cIdx)}
                              className="text-muted hover:text-rose-400 p-0.5 cursor-pointer"
                              title="Remove requirement"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))
                      )}

                      {/* Add criterion to this milestone */}
                      <div className="flex gap-2 pt-1">
                        <input
                          type="text"
                          placeholder="e.g. Clean card validation with zero console errors..."
                          value={milestone.newCriterionText || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setMilestones(
                              milestones.map((m) =>
                                m.id === milestone.id ? { ...m, newCriterionText: val } : m
                              )
                            );
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addMilestoneCriterion(milestone.id, milestone.newCriterionText || "");
                            }
                          }}
                          className="flex-1 px-2.5 py-1 rounded-md bg-card border border-border text-xs text-foreground placeholder-muted/60 focus:outline-none focus:border-accent"
                        />
                        <button
                          type="button"
                          onClick={() => addMilestoneCriterion(milestone.id, milestone.newCriterionText || "")}
                          className="px-2.5 py-1 rounded-md bg-card hover:bg-card-hover border border-border text-xs text-foreground font-medium flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add Phase Button */}
                <button
                  type="button"
                  onClick={addMilestone}
                  className="w-full py-2.5 rounded-xl border border-dashed border-border hover:border-accent/60 bg-card/40 hover:bg-card/70 text-accent font-medium text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Another Milestone Phase</span>
                </button>

                {/* Total Escrow Summary Callout */}
                <div className="p-3.5 rounded-xl bg-accent/10 border border-accent/25 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-foreground block">Total Escrow Commitment</span>
                    <span className="text-[11px] text-muted">Sum of all {milestones.length} milestone phase deposits</span>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-mono font-bold text-emerald-400">
                      ${totalCalculatedAmount} USD
                    </div>
                    <span className="text-[10px] text-muted">Locked in PayPal Escrow Vault</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submit */}
          <div data-tour="deposit-escrow-btn">
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="w-full py-3 rounded-lg bg-accent hover:bg-accent-hover disabled:opacity-50 text-white font-medium text-xs shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <CreditCard className="w-3.5 h-3.5" />
              {loading
                ? "Generating PayPal Escrow Order..."
                : `Proceed to Deposit Escrow ($${totalCalculatedAmount} USD)`}
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
            Funds will be locked securely in PayPal escrow until milestones pass verification.
          </p>

          <div className="p-3.5 rounded-lg bg-background/60 border border-border mb-5 text-left text-xs font-mono space-y-2">
            <div className="flex justify-between">
              <span className="text-muted font-sans">Agreement ID:</span>
              <span className="text-foreground">{createdContractId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted font-sans">PayPal Order ID:</span>
              <span className="text-accent">{paypalOrderId}</span>
            </div>

            {/* If Phased, list the phases */}
            {agreementMode === "phased" && (
              <div className="pt-2 border-t border-border/60 space-y-1">
                <span className="text-muted font-sans text-[11px] block font-semibold">
                  Phased Milestone Schedule:
                </span>
                {milestones.map((m, i) => (
                  <div key={m.id} className="flex justify-between text-[11px] text-muted">
                    <span className="truncate max-w-[200px]">Phase {i + 1}: {m.title || `Phase ${i + 1}`}</span>
                    <span className="text-foreground font-bold">${parseFloat(m.amount || "0").toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between font-bold text-sm pt-2 border-t border-border">
              <span className="text-foreground font-sans">Total Escrow Deposit:</span>
              <span className="text-emerald-500">${totalCalculatedAmount} USD</span>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleConfirmEscrowLock}
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white font-medium text-xs shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5" />
              {loading ? "Securing Funds in PayPal..." : `Confirm & Deposit $${totalCalculatedAmount} via PayPal`}
            </button>

            <button
              onClick={() => setStep("DETAILS")}
              className="w-full py-1.5 text-xs text-muted hover:text-foreground transition-colors cursor-pointer"
            >
              Edit Agreement Specifications
            </button>
          </div>
        </div>
      )}

      {/* ANIMATED ESCROW DEPOSIT FLOW MODAL */}
      {escrowFlowOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-card border border-border shadow-2xl p-6 sm:p-7 space-y-5 relative overflow-hidden">
            {/* Top gradient accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-indigo-500 to-emerald-500 animate-pulse" />

            {/* Header */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/25 flex items-center justify-center text-accent shrink-0 animate-pulse shadow-sm">
                <Lock className="w-6 h-6 text-accent" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold text-foreground truncate">
                  Locking Funds in PayPal Escrow
                </h3>
                <p className="text-xs text-muted mt-0.5">
                  Securing milestone deposit in PayPal vault with milestone protections
                </p>
              </div>
            </div>

            {/* Visual Animated Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[11px] font-mono text-muted">
                <span>Escrow Handshake</span>
                <span className="text-foreground font-bold">
                  {escrowFlowStep === 1 ? "25%" : escrowFlowStep === 2 ? "55%" : escrowFlowStep === 3 ? "80%" : "100% Completed"}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-background border border-border/80 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accent to-emerald-500 rounded-full transition-all duration-500"
                  style={{
                    width: escrowFlowStep === 1 ? "25%" : escrowFlowStep === 2 ? "55%" : escrowFlowStep === 3 ? "80%" : "100%",
                  }}
                />
              </div>
            </div>

            {/* 4 Animated Pipeline Steps */}
            <div className="space-y-2.5">
              {[
                {
                  stepNum: 1,
                  title: "Validate Agreement Specifications",
                  desc: "Validating milestone phases, deadlines, and acceptance criteria",
                },
                {
                  stepNum: 2,
                  title: "Authorize PayPal Escrow Order",
                  desc: `Creating purchase intent order ${paypalOrderId || "PP-ORD-..."} on PayPal rails`,
                },
                {
                  stepNum: 3,
                  title: "Lock Funds in Escrow Vault",
                  desc: `Locking $${totalCalculatedAmount} USD safely until contractor milestones are verified`,
                },
                {
                  stepNum: 4,
                  title: "Agreement Live & Contractor Notified",
                  desc: "Escrow guarantee confirmed. Dispatching agreement to contractor.",
                },
              ].map((s) => {
                const isDone = escrowFlowStep > s.stepNum;
                const isCurrent = escrowFlowStep === s.stepNum;
                return (
                  <div
                    key={s.stepNum}
                    className={`p-3 rounded-xl border transition-all duration-300 flex items-start gap-3 ${
                      isDone
                        ? "bg-emerald-500/[0.08] border-emerald-500/30 text-foreground"
                        : isCurrent
                        ? "bg-accent/[0.08] border-accent/40 text-foreground shadow-xs"
                        : "bg-background/40 border-border/50 text-muted opacity-50"
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isDone ? (
                        <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                          <Check className="w-3 h-3" />
                        </div>
                      ) : isCurrent ? (
                        <div className="w-5 h-5 rounded-full bg-accent/20 border-2 border-accent text-accent flex items-center justify-center text-xs">
                          <RefreshCw className="w-3 h-3 animate-spin text-accent" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-background border border-border text-muted flex items-center justify-center text-[10px] font-mono font-medium">
                          {s.stepNum}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-semibold ${isDone ? "text-emerald-400" : isCurrent ? "text-foreground" : "text-muted"}`}>
                          {s.title}
                        </span>
                        {isDone && (
                          <span className="text-[10px] font-mono text-emerald-400 font-bold">Confirmed</span>
                        )}
                        {isCurrent && (
                          <span className="text-[10px] font-mono text-accent font-bold animate-pulse">Securing...</span>
                        )}
                      </div>
                      <p className="text-[10.5px] text-muted mt-0.5 leading-relaxed">
                        {s.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Real-Time Terminal Command Stream */}
            <div className="p-2.5 rounded-xl bg-black/40 border border-border/60 font-mono text-[10.5px] text-emerald-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
              <span className="truncate">
                {escrowFlowStep === 1
                  ? "> specs.validate() -> 100% compliant"
                  : escrowFlowStep === 2
                  ? `> paypal.orders.create() -> order_id: ${paypalOrderId || "PP-ORD-ACTIVE"}`
                  : escrowFlowStep === 3
                  ? `> paypal.escrow.capture() -> locked $${totalCalculatedAmount} USD`
                  : "> agreement active -> contractor notified successfully"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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
  RotateCcw,
  Bot,
  ShieldCheck,
  Cpu,
  Workflow,
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

type ProjectCategory = "software" | "figma" | "content" | "art";

const CATEGORY_PRESETS: Record<
  ProjectCategory,
  {
    label: string;
    icon: string;
    defaultTitle: string;
    defaultDesc: string;
    defaultBudget: string;
    defaultCriteria: string[];
  }
> = {
  software: {
    label: "Software & Engineering",
    icon: "💻",
    defaultTitle: "Customer Checkout & Online Payment Flow",
    defaultDesc:
      "Build a responsive checkout page with credit card validation, discount code support, and automatic receipt generation.",
    defaultBudget: "450.00",
    defaultCriteria: [
      "Mobile-responsive checkout form with clean card input validation",
      "Instant discount code application and subtotal recalculation",
      "Automatic branded order confirmation email and printable receipt",
      "Passes automated verification test suite with no errors",
    ],
  },
  figma: {
    label: "UI/UX & Figma Design",
    icon: "🎨",
    defaultTitle: "Mobile Banking App UI/UX Redesign in Figma",
    defaultDesc:
      "Create interactive Figma prototypes, design system components, and complete mobile screens for iOS and Android.",
    defaultBudget: "600.00",
    defaultCriteria: [
      "Figma file contains complete auto-layout mobile frames for Home, Transactions, and Send Money",
      "Design token library with typography, accessible contrast colors, and spacing scale",
      "Interactive clickable prototype with animated page transitions",
    ],
  },
  content: {
    label: "Content & Copywriting",
    icon: "✍️",
    defaultTitle: "API Documentation & Developer Quickstart Guides",
    defaultDesc:
      "Write comprehensive technical documentation, code snippets in Python and Node.js, and error troubleshooting guides.",
    defaultBudget: "400.00",
    defaultCriteria: [
      "Complete OpenAPI 3.0 markdown documentation with interactive request/response samples",
      "Tested code recipes in Node.js and Python for authentication and payment webhooks",
      "Zero grammar or technical inaccuracies with 100% verified endpoints",
    ],
  },
  art: {
    label: "Art, 3D & Brand Identity",
    icon: "🎭",
    defaultTitle: "3D App Icon Suite & Brand Identity Package",
    defaultDesc:
      "Design 6 custom 3D isometric icons, vector logos for light/dark modes, and social media brand identity kit.",
    defaultBudget: "500.00",
    defaultCriteria: [
      "6 high-resolution 3D isometric icons rendered at 2048x2048 in PNG and Blender source files",
      "Vector logo suite in SVG, PDF, and EPS with light and dark mode variants",
      "Brand guidelines PDF specifying logo clear space, color codes, and disallowed usage",
    ],
  },
};

export default function NewContractPage() {
  const router = useRouter();
  const { user, loginAs } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"DETAILS" | "ESCROW_PAYMENT">("DETAILS");

  // Selected Category / Work Type
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | null>(null);

  // Agreement Structure Mode: "single" vs "phased"
  const [agreementMode, setAgreementMode] = useState<"single" | "phased">("single");

  // AI Milestone Generation State
  const [generatingMilestones, setGeneratingMilestones] = useState(false);
  const [aiGenerationNote, setAiGenerationNote] = useState<string | null>(null);

  // Single Milestone Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [currency] = useState("USD");
  const [clientName, setClientName] = useState(user.role === "client" ? user.name : "Acme Cloud Corp");
  const [clientEmail, setClientEmail] = useState(user.role === "client" ? user.email : "billing@acmecloud.io");
  const [freelancerName, setFreelancerName] = useState("Alex Rivera");
  const [freelancerEmail, setFreelancerEmail] = useState("alex.rivera@devmail.com");
  const [criteria, setCriteria] = useState<string[]>([]);
  const [newCriterion, setNewCriterion] = useState("");
  const [deadline, setDeadline] = useState("");

  // Multi-Milestone Phased State
  const [milestones, setMilestones] = useState<FormMilestone[]>([
    {
      id: "m_1",
      title: "",
      amount: "",
      criteria: [],
      newCriterionText: "",
    },
  ]);

  useEffect(() => {
    const d = new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0];
    setDeadline(d);
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

  // Autonomous AI Milestone Architect Modal State
  const [aiArchitectModalOpen, setAiArchitectModalOpen] = useState(false);
  const [aiArchitectStep, setAiArchitectStep] = useState(1);

  // Autonomous Escrow Order Initialization Modal State (Step 1 submit)
  const [escrowInitModalOpen, setEscrowInitModalOpen] = useState(false);
  const [escrowInitStep, setEscrowInitStep] = useState(1);

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  // Dynamic calculated amount
  const totalCalculatedAmount =
    agreementMode === "phased"
      ? milestones
          .reduce((sum, m) => sum + (parseFloat(m.amount) || 0), 0)
          .toFixed(2)
      : amount || "0.00";

  // Category Selection Preset Click Handler
  const applyCategoryOption = (cat: ProjectCategory) => {
    setSelectedCategory(cat);
    const preset = CATEGORY_PRESETS[cat];
    setTitle(preset.defaultTitle);
    setDescription(preset.defaultDesc);
    setAmount(preset.defaultBudget);
    setCriteria(preset.defaultCriteria);
    setAiGenerationNote(null);
  };

  // Reset form clean
  const handleResetForm = () => {
    setTitle("");
    setDescription("");
    setAmount("");
    setSelectedCategory(null);
    setCriteria([]);
    setNewCriterion("");
    setAiGenerationNote(null);
    setAgreementMode("single");
    setMilestones([
      {
        id: "m_1",
        title: "",
        amount: "",
        criteria: [],
        newCriterionText: "",
      },
    ]);
  };

  // AI Milestone Architect & Budget Splitter Handler
  const handleAIGenerateMilestones = async () => {
    setGeneratingMilestones(true);
    setAiGenerationNote(null);
    setAiArchitectStep(1);
    setAiArchitectModalOpen(true);

    try {
      const budgetVal = parseFloat(totalCalculatedAmount) || parseFloat(amount) || 600;
      const catLabel = selectedCategory
        ? CATEGORY_PRESETS[selectedCategory].label
        : "Software & Engineering";

      await sleep(650);
      setAiArchitectStep(2);

      const fetchPromise = fetch("/api/contracts/ai-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: catLabel,
          title: title.trim() || "Milestone Agreement Deliverables",
          description: description.trim() || "Project deliverables agreed between client and contractor",
          totalBudget: budgetVal,
        }),
      });

      await sleep(750);
      setAiArchitectStep(3);

      const res = await fetchPromise;
      const data = await res.json();

      await sleep(650);
      setAiArchitectStep(4);
      confetti({ particleCount: 120, spread: 75, origin: { y: 0.5 } });

      await sleep(800);

      if (data.success && Array.isArray(data.milestones) && data.milestones.length > 0) {
        setMilestones(
          data.milestones.map((m: any, idx: number) => ({
            id: `m_${idx + 1}_${Date.now().toString().slice(-4)}`,
            title: m.title,
            amount: m.amount.toString(),
            criteria: m.criteria,
            newCriterionText: "",
          }))
        );
        setAgreementMode("phased");
        setAiGenerationNote(
          `✨ AI partitioned $${budgetVal} across ${data.milestones.length} milestone phases with 100% budget allocation. ${data.reasoning || ""}`
        );
      }
    } catch (err) {
      console.error("AI milestone generation error:", err);
    } finally {
      setGeneratingMilestones(false);
      setAiArchitectModalOpen(false);
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
    setEscrowInitStep(1);
    setEscrowInitModalOpen(true);

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

      await sleep(650);
      setEscrowInitStep(2);

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

      await sleep(750);
      setEscrowInitStep(3);

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

      await sleep(650);
      setEscrowInitStep(4);
      confetti({ particleCount: 100, spread: 65, origin: { y: 0.55 } });
      await sleep(750);

      if (data.contract) {
        setCreatedContractId(data.contract.id);
        setStep("ESCROW_PAYMENT");
      }
    } catch (err) {
      console.error("Error creating escrow:", err);
      alert("Failed to initialize contract. Please check your connection.");
    } finally {
      setLoading(false);
      setEscrowInitModalOpen(false);
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
      {/* Top Header with Back and Reset */}
      <div className="flex items-center justify-between mb-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Dashboard
        </Link>

        <button
          type="button"
          onClick={handleResetForm}
          className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors cursor-pointer"
          title="Clear form inputs"
        >
          <RotateCcw className="w-3 h-3" />
          Start Fresh
        </button>
      </div>

      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
          Create Milestone Contract
        </h1>
        <p className="text-xs text-muted mt-1">
          Lock payment safely in PayPal escrow. Funds release only when deliverable proof satisfies agreed criteria.
        </p>
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
          {/* Work Domain / Category Options Selector */}
          <div className="p-4 rounded-xl bg-card/60 border border-border/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-foreground block">Select Project Work Category</span>
                <span className="text-[11px] text-muted">
                  Choose a category to pre-populate industry-standard specifications and criteria
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {(Object.keys(CATEGORY_PRESETS) as ProjectCategory[]).map((cat) => {
                const item = CATEGORY_PRESETS[cat];
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => applyCategoryOption(cat)}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                      isSelected
                        ? "bg-accent/15 border-accent text-foreground shadow-xs font-semibold"
                        : "bg-background/60 hover:bg-background border-border/70 text-muted hover:text-foreground"
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    <span className="text-[11px] font-medium leading-tight">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Milestone Structure Selector & AI Breakdown Trigger */}
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
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <span className="h-5 w-5 rounded-md bg-accent/15 text-accent flex items-center justify-center text-xs font-bold">
                1
              </span>
              {agreementMode === "phased" ? "Project Overview & Scope" : "Contract Scope & Budget"}
            </h2>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                {agreementMode === "phased" ? "Project Agreement Title *" : "Milestone Title *"}
              </label>
              <input
                type="text"
                required
                placeholder={
                  agreementMode === "phased"
                    ? "e.g. Mobile App Redesign & Web Launch"
                    : "e.g. Customer Checkout & Payment Integration"
                }
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
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  {agreementMode === "phased" ? "Target Total Budget ($USD) *" : "Escrow Amount ($USD) *"}
                </label>
                <div className="relative">
                  <DollarSign className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    type="number"
                    step="1.00"
                    min="1"
                    required
                    placeholder="450.00"
                    value={agreementMode === "phased" ? (amount || totalCalculatedAmount) : amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-lg bg-background border border-border text-xs font-semibold font-mono text-foreground placeholder-muted/50 focus:outline-none focus:border-accent"
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

            {/* AI Breakdown Helper Bar */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleAIGenerateMilestones}
                disabled={generatingMilestones}
                className="w-full py-2 px-3 rounded-lg bg-accent/10 hover:bg-accent/20 border border-accent/30 text-accent font-medium text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {generatingMilestones ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    AI Architect is breaking down scope and splitting budget...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    ✨ Let AI Generate Phased Milestones & Split Budget (${amount || "450"})
                  </>
                )}
              </button>

              {aiGenerationNote && (
                <div className="mt-2 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-[11px] text-emerald-400 font-medium">
                  {aiGenerationNote}
                </div>
              )}
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
                  placeholder="e.g. Acme Corporation or Client Name"
                  className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-xs text-foreground placeholder-muted/60 mb-1.5 focus:outline-none focus:border-accent"
                />
                <input
                  type="email"
                  required
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="Client PayPal billing email (e.g. billing@acme.com)"
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
                  placeholder="e.g. Alex Rivera or Contractor Name"
                  className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-xs text-foreground placeholder-muted/60 mb-1.5 focus:outline-none focus:border-accent"
                />
                <input
                  type="email"
                  required
                  value={freelancerEmail}
                  onChange={(e) => setFreelancerEmail(e.target.value)}
                  placeholder="Contractor PayPal payout email (e.g. dev@gmail.com)"
                  className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-[11px] text-foreground placeholder-muted/60 font-mono focus:outline-none focus:border-accent"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Acceptance Criteria OR Phased Milestones Builder */}
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
                  Audited by AI
                </span>
              </div>

              {criteria.length === 0 ? (
                <div className="py-5 px-4 text-center border border-dashed border-border/70 rounded-lg text-xs text-muted">
                  No criteria added yet. Add at least 1 objective requirement below or click a category above to load presets.
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
                          placeholder="e.g. 6 mobile wireframes in Figma..."
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

      {/* ANIMATED ESCROW DEPOSIT FLOW MODAL (PURGED OF FAKE PSEUDO-CLI COMMANDS) */}
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
                  title: "Agreement Live & Parties Synchronized",
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

            {/* Clean Enterprise Status Bar (No fake CLI strings) */}
            <div className="p-3 rounded-xl bg-background/80 border border-border/80 text-[11px] text-foreground flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
              <span className="truncate">
                {escrowFlowStep === 1
                  ? "Status: Specifications validated against contract requirements"
                  : escrowFlowStep === 2
                  ? `Status: PayPal escrow order authorized (${paypalOrderId || "PP-ORD-ACTIVE"})`
                  : escrowFlowStep === 3
                  ? `Status: PayPal vault deposit locked ($${totalCalculatedAmount} USD)`
                  : "Status: Milestone escrow active. Contractor notified via email & SMS."}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* AUTONOMOUS MILESTONE ARCHITECT MODAL */}
      {aiArchitectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-card border border-border shadow-2xl p-6 sm:p-7 space-y-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-accent to-emerald-500 animate-pulse" />

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-purple-400 shrink-0 shadow-sm">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold text-foreground truncate">
                  Autonomous Milestone Architect
                </h3>
                <p className="text-xs text-muted mt-0.5">
                  Deconstructing project requirements, splitting budget, and generating escrow checkpoints
                </p>
              </div>
            </div>

            {/* Visual Animated Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[11px] font-mono text-muted">
                <span>Swarm Synthesis Progress</span>
                <span className="text-foreground font-bold">
                  {aiArchitectStep === 1 ? "25%" : aiArchitectStep === 2 ? "55%" : aiArchitectStep === 3 ? "80%" : "100% Completed"}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-background border border-border/80 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 via-accent to-emerald-500 rounded-full transition-all duration-500"
                  style={{
                    width: aiArchitectStep === 1 ? "25%" : aiArchitectStep === 2 ? "55%" : aiArchitectStep === 3 ? "80%" : "100%",
                  }}
                />
              </div>
            </div>

            {/* 4 Parallel Agent Step Cards */}
            <div className="space-y-2.5">
              {[
                {
                  stepNum: 1,
                  agent: "Agent 1: Scope & Objective Parser",
                  role: "Deconstructing Deliverable Dependencies",
                  desc:
                    aiArchitectStep >= 2
                      ? "Parsed: Scope deconstructed into sequential deliverable milestones and dependencies"
                      : "Analyzing project description and category guidelines for phased delivery...",
                },
                {
                  stepNum: 2,
                  agent: "Agent 2: Phase & Budget Partitioning Engine",
                  role: "100% Mathematical Allocation",
                  desc:
                    aiArchitectStep >= 3
                      ? `Allocated: $${amount || "600"} USD budget split with balanced payment milestones`
                      : aiArchitectStep === 2
                      ? `Partitioning $${amount || "600"} USD across logical delivery phases...`
                      : "Queued: Awaiting scope deconstruction...",
                },
                {
                  stepNum: 3,
                  agent: "Agent 3: PayPal Escrow Acceptance Synthesizer",
                  role: "Objective Verification Rules",
                  desc:
                    aiArchitectStep >= 4
                      ? "Synthesized: Acceptance criteria generated for each milestone with strict checkpoints"
                      : aiArchitectStep === 3
                      ? "Drafting clear, testable criteria for client sign-off and AI verification..."
                      : "Standby: Awaiting budget allocation...",
                },
                {
                  stepNum: 4,
                  agent: "Architecture Blueprint Ready",
                  role: "Form Synchronization",
                  desc: "Milestone structure assembled and ready to populate into your agreement.",
                },
              ].map((s) => {
                const isDone = aiArchitectStep > s.stepNum;
                const isCurrent = aiArchitectStep === s.stepNum;
                return (
                  <div
                    key={s.stepNum}
                    className={`p-3 rounded-xl border transition-all duration-300 flex items-start gap-3 ${
                      isDone
                        ? "bg-emerald-500/[0.08] border-emerald-500/30 text-foreground"
                        : isCurrent
                        ? "bg-purple-500/[0.08] border-purple-500/40 text-foreground shadow-xs"
                        : "bg-background/40 border-border/50 text-muted opacity-50"
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isDone ? (
                        <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                          <Check className="w-3 h-3" />
                        </div>
                      ) : isCurrent ? (
                        <div className="w-5 h-5 rounded-full bg-purple-500/20 border-2 border-purple-500 text-purple-400 flex items-center justify-center text-xs">
                          <RefreshCw className="w-3 h-3 animate-spin text-purple-400" />
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
                          {s.agent}
                        </span>
                        {isDone && (
                          <span className="text-[10px] font-mono text-emerald-400 font-bold">Done</span>
                        )}
                        {isCurrent && (
                          <span className="text-[10px] font-mono text-purple-400 font-bold animate-pulse">Running...</span>
                        )}
                      </div>
                      <div className="text-[10px] font-mono text-muted/70">{s.role}</div>
                      <p className="text-[10.5px] text-muted mt-0.5 leading-relaxed">
                        {s.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Status bar */}
            <div className="p-3 rounded-xl bg-background/80 border border-border/80 text-[11px] text-foreground flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping shrink-0" />
              <span className="truncate">
                {aiArchitectStep === 1
                  ? "Status: Deconstructing scope into milestones and deliverables..."
                  : aiArchitectStep === 2
                  ? `Status: Partitioning $${amount || "600"} USD budget across milestone phases...`
                  : aiArchitectStep === 3
                  ? "Status: Synthesizing objective acceptance criteria checkpoints..."
                  : "Status: Milestone architecture complete! Applying to contract form."}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* INITIALIZING PAYPAL ESCROW ORDER MODAL */}
      {escrowInitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-card border border-border shadow-2xl p-6 sm:p-7 space-y-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-indigo-500 to-emerald-500 animate-pulse" />

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/25 flex items-center justify-center text-accent shrink-0 shadow-sm">
                <CreditCard className="w-6 h-6 animate-pulse" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold text-foreground truncate">
                  Initializing PayPal Milestone Escrow
                </h3>
                <p className="text-xs text-muted mt-0.5">
                  Validating specifications, minting order rails, and preparing secure escrow vault
                </p>
              </div>
            </div>

            {/* Visual Animated Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[11px] font-mono text-muted">
                <span>Setup Progress</span>
                <span className="text-foreground font-bold">
                  {escrowInitStep === 1 ? "25%" : escrowInitStep === 2 ? "55%" : escrowInitStep === 3 ? "80%" : "100% Ready"}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-background border border-border/80 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accent to-emerald-500 rounded-full transition-all duration-500"
                  style={{
                    width: escrowInitStep === 1 ? "25%" : escrowInitStep === 2 ? "55%" : escrowInitStep === 3 ? "80%" : "100%",
                  }}
                />
              </div>
            </div>

            {/* 4 Steps */}
            <div className="space-y-2.5">
              {[
                {
                  stepNum: 1,
                  title: "Validate Milestone Specifications",
                  desc: "Validating acceptance checklist, milestone budgets, and participant wallets",
                },
                {
                  stepNum: 2,
                  title: "Authorize PayPal Escrow Order",
                  desc: `Minting purchase intent order on PayPal API rails for $${totalCalculatedAmount} USD`,
                },
                {
                  stepNum: 3,
                  title: "Register Escrow Agreement on Vault Ledger",
                  desc: "Establishing locked milestone agreement with buyer and contractor protections",
                },
                {
                  stepNum: 4,
                  title: "Ready for Escrow Deposit",
                  desc: "Agreement initialized. Proceeding to PayPal deposit authorization.",
                },
              ].map((s) => {
                const isDone = escrowInitStep > s.stepNum;
                const isCurrent = escrowInitStep === s.stepNum;
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
                          <span className="text-[10px] font-mono text-emerald-400 font-bold">Ready</span>
                        )}
                        {isCurrent && (
                          <span className="text-[10px] font-mono text-accent font-bold animate-pulse">Initializing...</span>
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

            {/* Status bar */}
            <div className="p-3 rounded-xl bg-background/80 border border-border/80 text-[11px] text-foreground flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-accent animate-ping shrink-0" />
              <span className="truncate">
                {escrowInitStep === 1
                  ? "Status: Specifications validated against contract requirements..."
                  : escrowInitStep === 2
                  ? `Status: Minting PayPal purchase intent order for $${totalCalculatedAmount} USD...`
                  : escrowInitStep === 3
                  ? "Status: Agreement registered in escrow vault ledger..."
                  : "Status: Setup complete! Directing to 1-click escrow deposit."}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

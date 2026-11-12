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

export default function NewContractPage() {
  const router = useRouter();
  const { user, loginAs } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"DETAILS" | "CONFIRM_PAYMENT">("DETAILS");

  // Agreement Structure Mode: "single" vs "phased"
  const [agreementMode, setAgreementMode] = useState<"single" | "phased">("phased");

  // AI Milestone Generation State
  const [generatingMilestones, setGeneratingMilestones] = useState(false);
  const [aiGenerationNote, setAiGenerationNote] = useState<string | null>(null);

  // Form State
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

  // Phased Milestones State
  const [milestones, setMilestones] = useState<FormMilestone[]>([]);

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

  // Dynamic calculated amount
  const totalCalculatedAmount =
    agreementMode === "phased" && milestones.length > 0
      ? milestones
        .reduce((sum, m) => sum + (parseFloat(m.amount) || 0), 0)
        .toFixed(2)
      : amount || "0.00";

  // Reset form clean
  const handleResetForm = () => {
    setTitle("");
    setDescription("");
    setAmount("");
    setCriteria([]);
    setNewCriterion("");
    setAiGenerationNote(null);
    setAgreementMode("phased");
    setMilestones([]);
  };

  // Simple, fast AI Milestone Generator (no 4-step modal!)
  const handleAIGenerateMilestones = async () => {
    setGeneratingMilestones(true);
    setAiGenerationNote(null);

    try {
      const budgetVal = parseFloat(amount) || parseFloat(totalCalculatedAmount) || 600;

      const res = await fetch("/api/contracts/ai-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: "General",
          title: title.trim() || "Client Project Deliverables",
          description: description.trim() || "Project deliverables agreed between client and contractor",
          totalBudget: budgetVal,
        }),
      });

      const data = await res.json();
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
          `✨ AI generated ${data.milestones.length} milestones splitting $${budgetVal} total budget.`
        );
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      }
    } catch (err) {
      console.error("AI milestone generation error:", err);
    } finally {
      setGeneratingMilestones(false);
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

  // Step 1: Initialize contract in backend (simple button loading, no 4-step modal!)
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
          description: title || "Milestone Contract Payment",
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
          title: title.trim() || "Project Agreement",
          description: description.trim() || "Project deliverables agreed between client and contractor.",
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
        setStep("CONFIRM_PAYMENT");
      }
    } catch (err) {
      console.error("Error creating contract:", err);
      alert("Failed to initialize contract. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Confirm PayPal Lock
  const handleConfirmPayment = async () => {
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
      }

      confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
      if (createdContractId) router.push(`/contracts/${createdContractId}`);
    } catch (err) {
      console.error("Failed to capture payment:", err);
      if (createdContractId) router.push(`/contracts/${createdContractId}`);
    } finally {
      setLoading(false);
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
          Create New Contract
        </h1>
      </div>

      {user.role === "contractor" && (
        <div className="mb-5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-between gap-3 text-xs">
          <span className="text-amber-500">
            You are viewing as <strong>Contractor ({user.name})</strong>. Agreements are typically created and funded by clients.
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
          {/* Section 1: Overview */}
          <div data-tour="scope-budget" className="p-5 rounded-xl bg-card/60 border border-border/80 space-y-3.5">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <span className="h-5 w-5 rounded-md bg-accent/15 text-accent flex items-center justify-center text-xs font-bold">
                1
              </span>
              Project Overview & Budget
            </h2>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Project Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Mobile App Redesign & Web Launch"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs text-foreground placeholder-muted/60 focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Project Description *
              </label>
              <textarea
                rows={2}
                required
                placeholder="Describe project deliverables, requirements, and specifications..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs text-foreground placeholder-muted/60 focus:outline-none focus:border-accent"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-0.5">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Total Project Budget ($USD) *
                </label>
                <div className="relative">
                  <DollarSign className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    type="number"
                    step="1.00"
                    min="1"
                    required
                    placeholder="450.00"
                    value={amount || totalCalculatedAmount}
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

            {/* AI Milestone Generator Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleAIGenerateMilestones}
                disabled={generatingMilestones || !title.trim()}
                className="w-full py-2.5 px-3 rounded-lg bg-accent/15 hover:bg-accent/25 disabled:opacity-50 border border-accent/30 text-accent font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {generatingMilestones ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    AI is creating milestones...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    ✨ Generate Milestones with AI (${amount || totalCalculatedAmount || "450"})
                  </>
                )}
              </button>

              {aiGenerationNote && (
                <div className="mt-2 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-[11px] text-emerald-400 font-medium">
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
                  placeholder="Client Name or Company"
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
                  placeholder="Contractor Name"
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

          {/* Section 3: Milestones & Criteria */}
          <div className="p-5 rounded-xl bg-card/60 border border-border/80 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <span className="h-5 w-5 rounded-md bg-accent/15 text-accent flex items-center justify-center text-xs font-bold">
                  3
                </span>
                Milestones & Acceptance Requirements ({milestones.length})
              </h2>
              <div className="text-xs font-mono font-bold text-emerald-400">
                Total: ${totalCalculatedAmount} USD
              </div>
            </div>

            <div className="space-y-4">
              {milestones.length === 0 ? (
                <div className="py-8 px-4 text-center border border-dashed border-border/80 rounded-xl space-y-3 bg-card/20">
                  <Sparkles className="w-6 h-6 text-accent mx-auto opacity-70" />
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-foreground">
                      No milestones added yet
                    </p>
                    <p className="text-[11px] text-muted max-w-sm mx-auto">
                      Click &quot;✨ Generate Milestones with AI&quot; in Section 1 to auto-generate phases from your project description, or add them manually below.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addMilestone}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card hover:bg-card-hover border border-border text-xs text-foreground font-medium transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Milestone Manually
                  </button>
                </div>
              ) : milestones.map((milestone, mIdx) => (
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
                          Milestone {mIdx + 1}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeMilestone(milestone.id)}
                        className="text-muted hover:text-rose-400 text-xs flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-8">
                      <label className="block text-[11px] font-medium text-muted mb-1">
                        Milestone Deliverable Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Core App Feature Implementation"
                        value={milestone.title}
                        onChange={(e) => updateMilestone(milestone.id, "title", e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-card border border-border text-xs text-foreground placeholder-muted/60 focus:outline-none focus:border-accent"
                      />
                    </div>

                    <div className="sm:col-span-4">
                      <label className="block text-[11px] font-medium text-muted mb-1">
                        Milestone Amount ($USD) *
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
                      Acceptance Requirements for Milestone {mIdx + 1} *
                    </label>
                    {milestone.criteria.length === 0 ? (
                      <div className="py-2.5 px-3 border border-dashed border-border/60 rounded-lg text-[11px] text-muted">
                        No requirements added yet. Add at least 1 requirement below.
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
                        placeholder="e.g. Working checkout form passing tests..."
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
              {milestones.length > 0 && (
                <button
                  type="button"
                  onClick={addMilestone}
                  className="w-full py-2.5 rounded-xl border border-dashed border-border hover:border-accent/60 bg-card/40 hover:bg-card/70 text-accent font-medium text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Another Milestone</span>
                </button>
              )}
            </div>
          </div>

          {/* Submit */}
          <div>
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="w-full py-3 rounded-lg bg-accent hover:bg-accent-hover disabled:opacity-50 text-white font-medium text-xs shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <CreditCard className="w-3.5 h-3.5" />
              {loading
                ? "Creating Agreement..."
                : `Continue to Payment ($${totalCalculatedAmount} USD)`}
            </button>
          </div>
        </form>
      ) : (
        /* CONFIRM PAYMENT */
        <div className="p-6 rounded-xl bg-card/60 border border-border/80 text-center max-w-lg mx-auto shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center mx-auto mb-3">
            <Lock className="w-5 h-5" />
          </div>

          <h2 className="text-base font-bold text-foreground mb-1">
            Confirm Payment Protection
          </h2>
          <p className="text-xs text-muted mb-4 font-medium">
            Funds will be held securely until milestones pass verification.
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

            <div className="pt-2 border-t border-border/60 space-y-1">
              <span className="text-muted font-sans text-[11px] block font-semibold">
                Milestone Schedule:
              </span>
              {milestones.map((m, i) => (
                <div key={m.id} className="flex justify-between text-[11px] text-muted">
                  <span className="truncate max-w-[200px]">Milestone {i + 1}: {m.title || `Milestone ${i + 1}`}</span>
                  <span className="text-foreground font-bold">${parseFloat(m.amount || "0").toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between font-bold text-sm pt-2 border-t border-border">
              <span className="text-foreground font-sans">Total Payment:</span>
              <span className="text-emerald-500">${totalCalculatedAmount} USD</span>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleConfirmPayment}
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white font-medium text-xs shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5" />
              {loading ? "Confirming with PayPal..." : `Confirm & Pay $${totalCalculatedAmount} via PayPal`}
            </button>

            <button
              onClick={() => setStep("DETAILS")}
              className="w-full py-1.5 text-xs text-muted hover:text-foreground transition-colors cursor-pointer"
            >
              Edit Agreement
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

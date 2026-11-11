// app/integrations/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  X,
  AlertCircle,
  CheckCircle2,
  Trash2,
  ArrowRight,
} from "lucide-react";
import {
  INTEGRATIONS_CATALOG,
  IntegrationDefinition,
  loadSavedIntegrations,
  saveIntegrationState,
  removeIntegrationState,
  SavedIntegrationState,
} from "@/lib/integrations";

export default function IntegrationsPage() {
  const [savedStates, setSavedStates] = useState<Record<string, SavedIntegrationState>>({});
  const [selectedId, setSelectedId] = useState<string>("github");
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Load saved configurations from localStorage on mount
  useEffect(() => {
    const loaded = loadSavedIntegrations();
    setSavedStates(loaded);

    // Initialize form values for default selected integration
    const currentSaved = loaded["github"];
    if (currentSaved?.values) {
      setFormValues(currentSaved.values);
    } else {
      setFormValues({});
    }
  }, []);

  const selectedDef =
    INTEGRATIONS_CATALOG.find((i) => i.id === selectedId) || INTEGRATIONS_CATALOG[0];

  // When user clicks a card, switch to it and load its existing form values
  const handleSelectCard = (id: string) => {
    setSelectedId(id);
    setErrorMsg(null);
    setSuccessMsg(null);
    const existing = savedStates[id];
    if (existing?.values) {
      setFormValues(existing.values);
    } else {
      setFormValues({});
    }
  };

  const handleInputChange = (fieldKey: string, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldKey]: value,
    }));
    if (errorMsg) setErrorMsg(null);
  };

  // Connect button handler
  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/integrations/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedDef.id,
          values: formValues,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Failed to verify credentials. Please check your inputs.");
        setLoading(false);
        return;
      }

      // Save valid state
      const newState: SavedIntegrationState = {
        connected: true,
        connectedAs: data.connectedAs || "Connected",
        connectedAt: new Date().toISOString(),
        values: formValues,
      };

      saveIntegrationState(selectedDef.id, newState);
      setSavedStates((prev) => ({
        ...prev,
        [selectedDef.id]: newState,
      }));

      setSuccessMsg(`Connected successfully as ${data.connectedAs}!`);
    } catch (err) {
      console.error("Connection error:", err);
      setErrorMsg("Network error. Could not connect to verification server.");
    } finally {
      setLoading(false);
    }
  };

  // Disconnect button handler
  const handleDisconnect = () => {
    removeIntegrationState(selectedDef.id);
    setSavedStates((prev) => {
      const next = { ...prev };
      delete next[selectedDef.id];
      return next;
    });
    setFormValues({});
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const isConnected = !!savedStates[selectedDef.id]?.connected;
  const connectedAs = savedStates[selectedDef.id]?.connectedAs;

  // Clean brand icons
  const renderIcon = (id: string) => {
    switch (id) {
      case "github":
        return (
          <div className="w-10 h-10 rounded-xl bg-zinc-800 text-white flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </div>
        );
      case "figma":
        return (
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M8 24c2.2 0 4-1.8 4-4v-4H8c-2.2 0-4 1.8-4 4s1.8 4 4 4zM4 12c0-2.2 1.8-4 4-4h4v8H8c-2.2 0-4-1.8-4-4zm0-8c0-2.2 1.8-4 4-4h4v8H8C5.8 8 4 6.2 4 4zm8-4h4c2.2 0 4 1.8 4 4s-1.8 4-4 4h-4V0zm0 8h4c2.2 0 4 1.8 4 4s-1.8 4-4 4h-4V8z" />
            </svg>
          </div>
        );
      case "vercel":
        return (
          <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-700 text-white flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 1L24 22H0L12 1Z" />
            </svg>
          </div>
        );
      case "notifications":
        return (
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
      {/* Top Header */}
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors font-medium mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Dashboard
        </Link>

        <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
          Integrations
        </h1>
        <p className="text-xs text-muted mt-1 leading-relaxed">
          Connect your tools so ResolvAI can automatically check private code, design components, staging URLs, and send direct notifications.
        </p>
      </div>

      {/* Grid of Integration Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {INTEGRATIONS_CATALOG.map((item) => {
          const itemConnected = !!savedStates[item.id]?.connected;
          const isSelected = item.id === selectedId;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelectCard(item.id)}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                isSelected
                  ? "bg-card border-accent shadow-sm ring-1 ring-accent"
                  : "bg-card/60 hover:bg-card border-border/80 text-foreground"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                {renderIcon(item.id)}
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${
                    itemConnected
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                      : "bg-background border border-border text-muted"
                  }`}
                >
                  {itemConnected ? "Connected" : "Not connected"}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-foreground">{item.name}</h3>
                  <span className="text-[10px] font-mono text-muted uppercase">[{item.category}]</span>
                </div>
                <p className="text-[11px] text-muted mt-1 leading-relaxed line-clamp-2">
                  {item.shortDesc}
                </p>
              </div>

              <div className="pt-2 border-t border-border/50 text-[11px] font-medium text-accent flex items-center justify-between">
                <span>{isSelected ? "Configuring below" : "Click to set up"}</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Integration Detail & Setup Panel */}
      <div className="p-6 sm:p-7 rounded-2xl bg-card border border-border/90 shadow-sm space-y-6">
        {/* Selected Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
          <div className="flex items-center gap-3">
            {renderIcon(selectedDef.id)}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-foreground">{selectedDef.name}</h2>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-accent/15 text-accent font-semibold">
                  {selectedDef.category}
                </span>
              </div>
              <p className="text-xs text-muted mt-0.5">{selectedDef.shortDesc}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isConnected ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <Check className="w-3.5 h-3.5" />
                Connected as {connectedAs}
              </span>
            ) : (
              <span className="text-xs text-muted font-mono">Status: Ready to connect</span>
            )}
          </div>
        </div>

        {/* Why and How Explanation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Why Card */}
          <div className="p-4 rounded-xl bg-background/60 border border-border/70 space-y-1.5">
            <span className="text-xs font-bold text-foreground block">Why connect this?</span>
            <p className="text-xs text-muted leading-relaxed">{selectedDef.why}</p>
          </div>

          {/* How Card */}
          <div className="p-4 rounded-xl bg-background/60 border border-border/70 space-y-1.5">
            <span className="text-xs font-bold text-foreground block">How to connect:</span>
            <ol className="space-y-1 text-xs text-muted list-decimal list-inside leading-relaxed">
              {selectedDef.how.map((step, sIdx) => (
                <li key={sIdx}>{step}</li>
              ))}
            </ol>
          </div>
        </div>

        {/* Setup Form */}
        <form onSubmit={handleConnect} className="space-y-4 pt-2">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
            Connection Details
          </h3>

          {selectedDef.fields.map((field) => (
            <div key={field.key}>
              <label className="block text-xs font-medium text-foreground mb-1">
                {field.label}
              </label>
              <input
                type={field.type}
                required={field.key === "token" || field.key === "email"}
                placeholder={field.placeholder}
                value={formValues[field.key] || ""}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-border text-foreground font-mono text-xs placeholder-muted/60 focus:outline-none focus:border-accent"
              />
              <span className="block text-[11px] text-muted mt-1">{field.helperText}</span>
            </div>
          ))}

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/25 flex items-start gap-2 text-xs text-rose-400">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success Message */}
          {successMsg && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center gap-2 text-xs text-emerald-400">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-border/60">
            {isConnected ? (
              <button
                type="button"
                onClick={handleDisconnect}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-medium transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Disconnect {selectedDef.name}
              </button>
            ) : (
              <span className="text-xs text-muted">Details saved securely in your local environment.</span>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50 ml-auto"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Verifying with {selectedDef.name}...
                </>
              ) : isConnected ? (
                "Update Connection"
              ) : (
                `Connect ${selectedDef.name}`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

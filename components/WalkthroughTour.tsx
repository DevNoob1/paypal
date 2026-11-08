// components/WalkthroughTour.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  Suspense,
} from "react";
import { usePathname } from "next/navigation";
import {
  Compass,
  X,
  ChevronRight,
  ChevronLeft,
  Check,
} from "lucide-react";

export interface TourStep {
  target: string;
  title: string;
  description: string;
  badge?: string;
  position?: "top" | "bottom" | "left" | "right";
}

// Tour configurations per page route
const PAGE_TOURS: Record<string, TourStep[]> = {
  "/": [
    {
      target: '[data-tour="hero"]',
      title: "Automated Milestone Escrow",
      description:
        "ResolvAI connects PayPal payment rails with Google Gemini AI to secure milestone funds and eliminate payment disputes for contracts.",
      badge: "Core Value",
      position: "bottom",
    },
    {
      target: '[data-tour="perspective-switch"]',
      title: "Perspective Switcher",
      description:
        "Click here anytime to switch between the Client (funding escrow) and Contractor (receiving payment) viewpoints to experience both sides.",
      badge: "Interactive Role",
      position: "bottom",
    },
    {
      target: '[data-tour="value-props"]',
      title: "Protected Escrow & Instant Payouts",
      description:
        "Funds are deposited securely through PayPal before work starts. Milestones are verified by AI against objective criteria and released in seconds.",
      badge: "How it Works",
      position: "bottom",
    },
    {
      target: '[data-tour="workflow"]',
      title: "Interactive 4-Stage Pipeline",
      description:
        "Shows the automated lifecycle: 1. Escrow Funded → 2. Work Submitted → 3. AI Verification → 4. Direct PayPal Payout.",
      badge: "End-to-End Flow",
      position: "top",
    },
    {
      target: '[data-tour="ai-agents"]',
      title: "Three Independent AI Reviewers",
      description:
        "Deliverables are audited across three distinct angles: Scope Reviewer (criteria check), Code Inspector (PR diffs & tests), and Settlement Arbiter (payout trigger).",
      badge: "AI Architecture",
      position: "top",
    },
    {
      target: '[data-tour="open-dashboard"]',
      title: "Platform Dashboard",
      description:
        "Click this button to view active milestone contracts, monitor escrow in flight, and trigger live AI evaluations.",
      badge: "Next Step",
      position: "bottom",
    },
  ],

  "/dashboard": [
    {
      target: '[data-tour="dashboard-header"]',
      title: "Role-Adapted Workspace",
      description:
        "The dashboard dynamically customizes actions, metrics, and contracts based on whether you are logged in as a Client or Contractor.",
      badge: "Role Header",
      position: "bottom",
    },
    {
      target: '[data-tour="dashboard-metrics"]',
      title: "Real-Time Settlement Metrics",
      description:
        "Tracks capital currently protected in PayPal escrow, total payouts disbursed to contractors, and milestone approval rates.",
      badge: "Financial Health",
      position: "bottom",
    },
    {
      target: '[data-tour="contract-filters"]',
      title: "Filter & Status Tabs",
      description:
        "Quickly filter contracts by state: Ready for Review (submitted PRs), In Escrow, Completed settlements, or Disputed items.",
      badge: "Management",
      position: "bottom",
    },
    {
      target: '[data-tour="demo-contract"]',
      title: "Interactive Demo Contract",
      description:
        "Contract cnt_9821_stripe has a pre-loaded pull request and test logs. Click 'Review & Settle' to run the live 3-agent AI review and release payment!",
      badge: "Live Demo",
      position: "top",
    },
    {
      target: '[data-tour="new-contract-btn"]',
      title: "Create Milestone Escrow",
      description:
        "Easily draft new contracts, define strict AI acceptance criteria, and deposit milestone funds via PayPal Orders API.",
      badge: "Creation",
      position: "bottom",
    },
  ],

  "/contracts/new": [
    {
      target: '[data-tour="contract-templates"]',
      title: "Quick Industry Templates",
      description:
        "Select pre-built engineering templates (Webhook Service, AI Document Extractor, Mobile Flow) to auto-populate scope and criteria.",
      badge: "Templates",
      position: "bottom",
    },
    {
      target: '[data-tour="scope-budget"]',
      title: "Scope & Escrow Budget",
      description:
        "Specify the milestone title, technical deliverables, and amount in USD to be locked in PayPal escrow.",
      badge: "Specification",
      position: "bottom",
    },
    {
      target: '[data-tour="contract-parties"]',
      title: "Counterparty Accounts",
      description:
        "Enter the Client's billing account and the Contractor's PayPal email where payouts will be automatically transferred.",
      badge: "Parties",
      position: "bottom",
    },
    {
      target: '[data-tour="acceptance-criteria"]',
      title: "AI Acceptance Criteria",
      description:
        "Define unambiguous, testable rules (e.g., 'Unit test coverage > 85%'). Gemini AI will strictly evaluate these conditions before releasing funds.",
      badge: "AI Rules",
      position: "top",
    },
    {
      target: '[data-tour="deposit-escrow-btn"]',
      title: "PayPal Escrow Deposit",
      description:
        "Clicking this creates a PayPal Order and safely deposits the milestone amount into escrow before any contractor work begins.",
      badge: "Payment Rail",
      position: "top",
    },
  ],

  "/contracts/cnt_9821_stripe": [
    {
      target: '[data-tour="contract-header"]',
      title: "Milestone Details & Status",
      description:
        "Displays the contract title, locked escrow amount ($450.00 USD), and the linked PayPal Order reference.",
      badge: "Overview",
      position: "bottom",
    },
    {
      target: '[data-tour="acceptance-criteria-card"]',
      title: "Agreed Acceptance Criteria",
      description:
        "These 4 criteria were agreed upon and locked in escrow. The AI reviewers will inspect each one against the submitted deliverable.",
      badge: "Criteria",
      position: "bottom",
    },
    {
      target: '[data-tour="deliverable-submission"]',
      title: "Proof of Work Submission",
      description:
        "The contractor submitted their GitHub PR URL, verification notes, and unit test execution output demonstrating completion.",
      badge: "Submission",
      position: "top",
    },
    {
      target: '[data-tour="ai-review-section"]',
      title: "Three Independent AI Reviewers",
      description:
        "Three specialized Gemini agents independently audit the deliverable: Scope Reviewer, Code Inspector, and Settlement Arbiter.",
      badge: "Multi-Agent AI",
      position: "top",
    },
    {
      target: '[data-tour="audit-action-btn"]',
      title: "Run AI Review & Release Payout",
      description:
        "Click here to run the 3 AI reviewers in parallel. When consensus passes (>85%), PayPal Payouts releases the $450 directly to the contractor!",
      badge: "Core Action",
      position: "bottom",
    },
  ],
};

interface WalkthroughContextType {
  isActive: boolean;
  currentStepIndex: number;
  currentStep: TourStep | null;
  totalSteps: number;
  startTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  endTour: () => void;
  hasTourForPage: boolean;
  setPageSteps: (steps: TourStep[]) => void;
}

const WalkthroughContext = createContext<WalkthroughContextType>({
  isActive: false,
  currentStepIndex: 0,
  currentStep: null,
  totalSteps: 0,
  startTour: () => {},
  nextStep: () => {},
  prevStep: () => {},
  endTour: () => {},
  hasTourForPage: false,
  setPageSteps: () => {},
});

// Inner component that safely uses usePathname inside a Suspense boundary
function WalkthroughPathSync({
  setPageSteps,
  endTour,
}: {
  setPageSteps: (steps: TourStep[]) => void;
  endTour: () => void;
}) {
  const pathname = usePathname();

  useEffect(() => {
    endTour();
    if (!pathname) {
      setPageSteps([]);
      return;
    }

    if (PAGE_TOURS[pathname]) {
      setPageSteps(PAGE_TOURS[pathname]);
    } else if (pathname.startsWith("/contracts/") && pathname !== "/contracts/new") {
      setPageSteps(PAGE_TOURS["/contracts/cnt_9821_stripe"] || []);
    } else {
      setPageSteps([]);
    }
  }, [pathname, setPageSteps, endTour]);

  return null;
}

export function WalkthroughProvider({ children }: { children: React.ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentTourSteps, setCurrentTourSteps] = useState<TourStep[]>([]);
  const cardRef = useRef<HTMLDivElement>(null);

  const hasTourForPage = currentTourSteps.length > 0;
  const currentStep = currentTourSteps[currentStepIndex] || null;

  const setPageSteps = useCallback((steps: TourStep[]) => {
    setCurrentTourSteps(steps);
    setCurrentStepIndex(0);
  }, []);

  const endTour = useCallback(() => {
    setIsActive(false);
    if (typeof document !== "undefined") {
      document.querySelectorAll(".tour-highlight-active").forEach((el) => {
        el.classList.remove("tour-highlight-active");
      });
    }
  }, []);

  const startTour = useCallback(() => {
    if (currentTourSteps.length === 0) return;
    setCurrentStepIndex(0);
    setIsActive(true);
  }, [currentTourSteps.length]);

  const nextStep = useCallback(() => {
    if (currentStepIndex < currentTourSteps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      endTour();
    }
  }, [currentStepIndex, currentTourSteps.length, endTour]);

  const prevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  }, [currentStepIndex]);

  // Target element highlight & scroll
  useEffect(() => {
    if (!isActive || !currentStep || typeof document === "undefined") {
      return;
    }

    // Remove previous active highlights
    document.querySelectorAll(".tour-highlight-active").forEach((el) => {
      el.classList.remove("tour-highlight-active");
    });

    const element = document.querySelector(currentStep.target);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.classList.add("tour-highlight-active");
    }

    return () => {
      if (typeof document !== "undefined") {
        document.querySelectorAll(".tour-highlight-active").forEach((el) => {
          el.classList.remove("tour-highlight-active");
        });
      }
    };
  }, [isActive, currentStep, currentStepIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isActive) return;
      if (e.key === "Escape") endTour();
      if (e.key === "ArrowRight") nextStep();
      if (e.key === "ArrowLeft") prevStep();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isActive, nextStep, prevStep, endTour]);

  return (
    <WalkthroughContext.Provider
      value={{
        isActive,
        currentStepIndex,
        currentStep,
        totalSteps: currentTourSteps.length,
        startTour,
        nextStep,
        prevStep,
        endTour,
        hasTourForPage,
        setPageSteps,
      }}
    >
      <Suspense fallback={null}>
        <WalkthroughPathSync setPageSteps={setPageSteps} endTour={endTour} />
      </Suspense>

      {children}

      {/* Global CSS for tour highlights */}
      <style jsx global>{`
        .tour-highlight-active {
          position: relative !important;
          z-index: 45 !important;
          outline: 3px solid var(--accent) !important;
          outline-offset: 4px !important;
          border-radius: 1rem !important;
          transition: outline 0.2s ease, outline-offset 0.2s ease !important;
          box-shadow: 0 0 25px rgba(37, 99, 235, 0.25) !important;
        }
      `}</style>

      {/* Active Walkthrough Overlay & Dialog */}
      {isActive && currentStep && (
        <>
          {/* Dimmed backdrop */}
          <div
            onClick={endTour}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[1px] transition-opacity"
            aria-hidden="true"
          />

          {/* Floating Tour Card */}
          <div
            ref={cardRef}
            className="fixed z-50 w-[92vw] max-w-md p-5 rounded-3xl bg-card border-2 border-accent/60 shadow-2xl transition-all duration-300 animate-in fade-in zoom-in-95"
            style={{
              bottom: "24px",
              right: "24px",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-accent/15 text-accent flex items-center justify-center">
                  <Compass className="w-4 h-4 animate-spin-slow" />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
                    {currentStep.badge || "Feature Walkthrough"}
                    <span className="text-muted">•</span>
                    <span className="text-muted font-normal">
                      {currentStepIndex + 1} of {currentTourSteps.length}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={endTour}
                className="p-1 rounded-lg text-muted hover:text-foreground hover:bg-card-hover transition-colors cursor-pointer"
                title="Exit Walkthrough (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="mb-4">
              <h4 className="text-sm font-bold text-foreground mb-1.5 flex items-center gap-2">
                {currentStep.title}
              </h4>
              <p className="text-xs text-muted leading-relaxed">
                {currentStep.description}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="h-1 w-full bg-border rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-accent transition-all duration-300"
                style={{
                  width: `${((currentStepIndex + 1) / currentTourSteps.length) * 100}%`,
                }}
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <button
                onClick={prevStep}
                disabled={currentStepIndex === 0}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-border text-xs font-semibold text-foreground disabled:opacity-30 disabled:cursor-not-allowed hover:bg-card-hover transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Previous
              </button>

              <div className="flex items-center gap-1.5">
                {currentTourSteps.map((_, idx) => (
                  <span
                    key={idx}
                    onClick={() => setCurrentStepIndex(idx)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      idx === currentStepIndex
                        ? "w-4 bg-accent"
                        : "w-1.5 bg-border hover:bg-muted"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextStep}
                className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
              >
                {currentStepIndex === currentTourSteps.length - 1 ? (
                  <>
                    Done
                    <Check className="w-3.5 h-3.5" />
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </WalkthroughContext.Provider>
  );
}

export function useWalkthrough() {
  return useContext(WalkthroughContext);
}

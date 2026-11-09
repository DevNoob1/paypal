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
import { X, ChevronRight, ChevronLeft, Check, Sparkles } from "lucide-react";

export interface TourStep {
  target: string;
  prompt: string;
  badge?: string;
}

// Concise, game-style action instructions per page route
const PAGE_TOURS: Record<string, TourStep[]> = {
  "/": [
    {
      target: '[data-tour="hero"]',
      prompt: "Lock milestone payment safely in PayPal escrow. Releases only when work passes verified checkpoints.",
      badge: "Escrow Rails",
    },
    {
      target: '[data-tour="open-dashboard"]',
      prompt: "Click here to view your active agreements, held escrow funds, and deliverable review queue.",
      badge: "Workspace",
    },
    {
      target: '[data-tour="perspective-switch"]',
      prompt: "Explore the 4-step interactive flow: Escrow deposit → Deliverable proof → AI referee → PayPal payout.",
      badge: "How It Works",
    },
    {
      target: '[data-tour="workflow"]',
      prompt: "The 4-step loop: Lock deposit → Worker submits proof → Automated check → Instant PayPal payout.",
      badge: "User Story",
    },
  ],

  "/dashboard": [
    {
      target: '[data-tour="dashboard-header"]',
      prompt: "Switch your account between Client (funding milestones) and Contractor (submitting work).",
      badge: "Role Switcher",
    },
    {
      target: '[data-tour="dashboard-metrics"]',
      prompt: "Track real-time money locked in PayPal escrow and completed payouts at a single glance.",
      badge: "Live Balances",
    },
    {
      target: '[data-tour="contract-filters"]',
      prompt: "Filter milestone agreements by status: In Escrow, Ready for Review, or Completed.",
      badge: "Filters",
    },
    {
      target: '[data-tour="demo-contract"]',
      prompt: "Click here to inspect this contract, evaluate deliverables with the AI referee, or track PayPal payout settlement.",
      badge: "Milestone Details",
    },
    {
      target: '[data-tour="new-contract-btn"]',
      prompt: "Create a new milestone agreement and lock the deposit safely in PayPal escrow.",
      badge: "New Agreement",
    },
  ],

  "/contracts/new": [
    {
      target: '[data-tour="contract-templates"]',
      prompt: "Click a category template (UI/UX Figma, SEO Content, Web Code) to instantly auto-fill the rules.",
      badge: "Templates",
    },
    {
      target: '[data-tour="scope-budget"]',
      prompt: "Set the milestone title, scope details, and the dollar amount to hold in escrow.",
      badge: "Scope & Amount",
    },
    {
      target: '[data-tour="contract-parties"]',
      prompt: "Enter the client organization and the contractor's PayPal email address for payouts.",
      badge: "Parties",
    },
    {
      target: '[data-tour="acceptance-criteria"]',
      prompt: "Write objective checklist rules. These are the exact requirements verified before releasing money.",
      badge: "Checklist Rules",
    },
    {
      target: '[data-tour="deposit-escrow-btn"]',
      prompt: "Click here to fund the PayPal escrow deposit. Funds stay locked until work is approved.",
      badge: "Lock Escrow",
    },
  ],

  "/contracts/cnt_9821_stripe": [
    {
      target: '[data-tour="contract-header"]',
      prompt: "Milestone agreement overview: $450.00 is locked safely in PayPal escrow.",
      badge: "Escrow Status",
    },
    {
      target: '[data-tour="acceptance-criteria-card"]',
      prompt: "Agreed checklist rules. Every checkpoint must be satisfied before funds release.",
      badge: "Agreed Rules",
    },
    {
      target: '[data-tour="deliverable-submission"]',
      prompt: "Contractor submits work proof here: Figma link, GitHub PR, live URL, or test logs.",
      badge: "Proof of Work",
    },
    {
      target: '[data-tour="ai-review-section"]',
      prompt: "Automated quality checks inspect the submitted proof against all agreed rules.",
      badge: "Inspection",
    },
    {
      target: '[data-tour="audit-action-btn"]',
      prompt: "Click to run inspection. When approved, client clicks 'Approve & Send' for instant PayPal payout.",
      badge: "Approve & Pay",
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
});

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

interface SpotlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export function WalkthroughProvider({ children }: { children: React.ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentTourSteps, setCurrentTourSteps] = useState<TourStep[]>([]);
  const [spotlightRect, setSpotlightRect] = useState<SpotlightRect | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const hasTourForPage = currentTourSteps.length > 0;
  const currentStep = currentTourSteps[currentStepIndex] || null;

  const setPageSteps = useCallback((steps: TourStep[]) => {
    setCurrentTourSteps(steps);
    setCurrentStepIndex(0);
  }, []);

  const endTour = useCallback(() => {
    setIsActive(false);
    setSpotlightRect(null);
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

  // Update spotlight rect when active step changes, or on scroll / resize
  const updateSpotlight = useCallback(() => {
    if (!isActive || !currentStep || typeof document === "undefined") {
      setSpotlightRect(null);
      return;
    }

    const element = document.querySelector(currentStep.target);
    if (!element) {
      setSpotlightRect(null);
      return;
    }

    const rect = element.getBoundingClientRect();
    const pad = 8;
    setSpotlightRect({
      top: Math.max(0, rect.top - pad),
      left: Math.max(0, rect.left - pad),
      width: rect.width + pad * 2,
      height: rect.height + pad * 2,
    });
  }, [isActive, currentStep]);

  useEffect(() => {
    if (!isActive || !currentStep || typeof document === "undefined") return;

    const element = document.querySelector(currentStep.target);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    // Measure after small delay to let smooth scroll settle
    const timeout = setTimeout(updateSpotlight, 150);
    const handleReposition = () => updateSpotlight();

    window.addEventListener("scroll", handleReposition, { passive: true });
    window.addEventListener("resize", handleReposition, { passive: true });

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("scroll", handleReposition);
      window.removeEventListener("resize", handleReposition);
    };
  }, [isActive, currentStep, currentStepIndex, updateSpotlight]);

  // Keyboard navigation: Escape to exit, ArrowRight / Enter to advance, ArrowLeft to go back
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isActive) return;
      if (e.key === "Escape") endTour();
      if (e.key === "ArrowRight" || e.key === "Enter") nextStep();
      if (e.key === "ArrowLeft") prevStep();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isActive, nextStep, prevStep, endTour]);

  // Calculate popover coordinates based on spotlight target
  const getPopoverStyle = (): React.CSSProperties => {
    if (typeof window === "undefined" || !spotlightRect) {
      return {
        position: "fixed",
        bottom: 24,
        left: "50%",
        transform: "translateX(-50%)",
        width: "92vw",
        maxWidth: 380,
      };
    }

    const popoverWidth = Math.min(380, window.innerWidth - 32);
    const popoverEstimatedHeight = 160;

    // Center horizontally on the target, but keep within viewport edges
    let left = spotlightRect.left + spotlightRect.width / 2 - popoverWidth / 2;
    if (left < 16) left = 16;
    if (left + popoverWidth > window.innerWidth - 16) {
      left = window.innerWidth - popoverWidth - 16;
    }

    // Try placing below target
    let top = spotlightRect.top + spotlightRect.height + 12;

    // If not enough space below, place above target
    if (top + popoverEstimatedHeight > window.innerHeight - 16) {
      top = Math.max(16, spotlightRect.top - popoverEstimatedHeight - 12);
    }

    return {
      position: "fixed",
      top: `${top}px`,
      left: `${left}px`,
      width: `${popoverWidth}px`,
    };
  };

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
      }}
    >
      <Suspense fallback={null}>
        <WalkthroughPathSync setPageSteps={setPageSteps} endTour={endTour} />
      </Suspense>

      {children}

      {/* Interactive Spotlight Modal Overlay */}
      {isActive && currentStep && (
        <div className="fixed inset-0 z-50 overflow-hidden pointer-events-auto">
          {/* Fullscreen SVG with Cutout Mask - Darkens everything except the target */}
          <svg
            className="fixed inset-0 w-full h-full pointer-events-none transition-all duration-200"
            style={{ width: "100vw", height: "100vh" }}
          >
            <defs>
              <mask id="walkthrough-spotlight-mask">
                {/* Reveal dark mask everywhere */}
                <rect x="0" y="0" width="100%" height="100%" fill="white" />
                {/* Punch out transparent hole over active target */}
                {spotlightRect && (
                  <rect
                    x={spotlightRect.left}
                    y={spotlightRect.top}
                    width={spotlightRect.width}
                    height={spotlightRect.height}
                    rx="12"
                    fill="black"
                  />
                )}
              </mask>
            </defs>

            {/* Dark backdrop with cutout */}
            <rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="rgba(0, 0, 0, 0.85)"
              mask="url(#walkthrough-spotlight-mask)"
              className="pointer-events-auto cursor-pointer"
              onClick={endTour}
            />

            {/* Glowing spotlight border around active target */}
            {spotlightRect && (
              <rect
                x={spotlightRect.left}
                y={spotlightRect.top}
                width={spotlightRect.width}
                height={spotlightRect.height}
                rx="12"
                fill="none"
                stroke="#6366f1"
                strokeWidth="2.5"
                style={{
                  filter: "drop-shadow(0 0 12px rgba(99, 102, 241, 0.7))",
                }}
              />
            )}
          </svg>

          {/* Floating Game-HUD Dialogue Popover */}
          <div
            ref={popoverRef}
            style={getPopoverStyle()}
            className="z-50 p-4 rounded-xl bg-card/95 border border-accent/40 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Top metadata pill & exit button */}
            <div className="flex items-center justify-between mb-2.5">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-accent/15 border border-accent/30 text-[10.5px] font-semibold text-accent uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                <span>
                  {currentStep.badge || "Checkpoint"} • {currentStepIndex + 1}/{currentTourSteps.length}
                </span>
              </div>

              <button
                onClick={endTour}
                className="p-1 rounded-md text-muted hover:text-foreground hover:bg-card transition-colors cursor-pointer"
                title="Exit (Esc)"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Game Instruction - Direct, bold, zero filler subtitles */}
            <div className="mb-4">
              <p className="text-xs sm:text-[13px] font-medium text-foreground leading-relaxed">
                {currentStep.prompt}
              </p>
            </div>

            {/* Game Controls: Skip, Back, Next */}
            <div className="flex items-center justify-between pt-2 border-t border-border/60">
              <button
                onClick={endTour}
                className="text-[11px] font-medium text-muted hover:text-foreground transition-colors cursor-pointer px-1 py-1"
              >
                Skip
              </button>

              <div className="flex items-center gap-1.5">
                {currentStepIndex > 0 && (
                  <button
                    onClick={prevStep}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border bg-background hover:bg-card text-foreground text-xs font-medium transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    Back
                  </button>
                )}

                <button
                  onClick={nextStep}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent hover:bg-accent-hover text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
                >
                  {currentStepIndex === currentTourSteps.length - 1 ? (
                    <>
                      <span>Done</span>
                      <Check className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <>
                      <span>Next</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </WalkthroughContext.Provider>
  );
}

export function useWalkthrough() {
  return useContext(WalkthroughContext);
}

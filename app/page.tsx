// app/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Shield,
  Sparkles,
  Zap,
  Lock,
  FileText,
  CheckCircle2,
  Send,
  X,
  Check,
  ArrowRight,
  Clock,
} from "lucide-react";

export default function Home() {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  return (
    <div className="w-full bg-[#0A0A0D] text-[#F2F2F4] min-h-screen">
      {/* 1. HERO SECTION */}
      <section
        data-tour="hero"
        className="max-w-[1000px] mx-auto pt-16 pb-10 px-6 sm:px-8 text-center"
        style={{
          backgroundImage: "radial-gradient(#1C1C24 1.2px, transparent 1.2px)",
          backgroundSize: "28px 28px",
        }}
      >
        <div className="inline-block text-[13px] font-medium text-[#B9B4FF] bg-[#1A1838] border border-[#2D2A5E] px-3.5 py-1.5 rounded-full mb-7">
          Escrow on PayPal · Verified by AI
        </div>

        <h1 className="hd text-5xl sm:text-7xl lg:text-[84px] font-bold tracking-tight leading-[1.03] text-[#F2F2F4]">
          Get paid when
          <br />
          you <span className="text-[#8F88FF]">deliver.</span>
        </h1>

        <p className="mt-7 max-w-[620px] mx-auto text-lg sm:text-xl text-[#A0A0AA] leading-relaxed">
          The client’s money is locked in escrow before work starts. An impartial
          AI referee checks the work, and the payout lands in your PayPal.
        </p>

        {/* CTA Buttons */}
        <div className="mt-9 flex flex-wrap gap-3.5 justify-center items-center">
          <div data-tour="open-dashboard">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#7C74FF] hover:bg-[#6B62FF] text-[#0A0A0D] font-semibold text-base transition-colors"
            >
              Open dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div data-tour="perspective-switch">
            <Link
              href="/contracts/cnt_9821_stripe"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-[#33333D] hover:border-[#5E57C9] bg-[#131318] text-[#F2F2F4] font-semibold text-base transition-colors"
            >
              Inspect demo contract
            </Link>
          </div>
        </div>

        {/* Animated Hero SVG Diagram (Client -> AI Escrow -> Payout) */}
        <div className="mt-14 max-w-[900px] mx-auto w-full">
          <svg
            viewBox="0 0 900 210"
            className="w-full h-auto block"
            role="img"
            aria-label="Client deposits into escrow, AI verifies, freelancer is paid"
          >
            {/* Animated Dashed Connecting Lines */}
            <g fill="none" stroke="#3A3A46" strokeWidth="2" strokeDasharray="6 8">
              <path d="M166 100H394">
                <animate
                  attributeName="stroke-dashoffset"
                  from="28"
                  to="0"
                  dur="1.4s"
                  repeatCount="indefinite"
                />
              </path>
              <path d="M506 100H734">
                <animate
                  attributeName="stroke-dashoffset"
                  from="28"
                  to="0"
                  dur="1.4s"
                  repeatCount="indefinite"
                />
              </path>
            </g>

            {/* Traveling Gold Particle: Client -> AI */}
            <circle r="7" cy="0" fill="#F5C451">
              <animateMotion
                path="M166,100 L394,100"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>

            {/* Traveling Emerald Particle: AI -> You */}
            <circle r="7" fill="#5EE0A0">
              <animateMotion
                path="M506,100 L734,100"
                dur="3s"
                begin="1.5s"
                repeatCount="indefinite"
              />
            </circle>

            {/* Client & Freelancer Outer Circles */}
            <g fill="#131318" stroke="#2E2E38" strokeWidth="2">
              <circle cx="110" cy="100" r="56" />
              <circle cx="790" cy="100" r="56" />
            </g>

            {/* AI Escrow Center Pulsing Circle */}
            <circle
              cx="450"
              cy="100"
              r="56"
              fill="#17163A"
              stroke="#7C74FF"
              strokeWidth="2"
            />
            <circle
              cx="450"
              cy="100"
              r="56"
              fill="none"
              stroke="#7C74FF"
              strokeOpacity=".5"
            >
              <animate
                attributeName="r"
                values="56;76;56"
                dur="3s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="stroke-opacity"
                values=".5;0;.5"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>

            {/* Clean Icons Inside Circles */}
            <g fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              {/* Left: Client Icon */}
              <g stroke="#E8E8EC" transform="translate(86 76) scale(2)">
                <circle cx="12" cy="8" r="3.5" />
                <path d="M5 20c0-4 3-6 7-6s7 2 7 6" />
              </g>

              {/* Center: Shield AI Icon */}
              <g stroke="#B9B4FF" transform="translate(426 76) scale(2)">
                <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
                <path d="M9 12l2.2 2.2L15.5 10" />
              </g>

              {/* Right: Freelancer Icon */}
              <g stroke="#5EE0A0" transform="translate(766 76) scale(2)">
                <circle cx="12" cy="8" r="3.5" />
                <path d="M5 20c0-4 3-6 7-6s7 2 7 6" />
              </g>
            </g>

            {/* Labels Under Circles */}
            <g
              fill="#A0A0AA"
              fontSize="15"
              textAnchor="middle"
              fontFamily="Inter, system-ui, sans-serif"
            >
              <text x="110" y="196">
                Client deposits
              </text>
              <text x="450" y="196">
                Escrow + AI referee
              </text>
              <text x="790" y="196">
                You get paid
              </text>
            </g>
          </svg>
        </div>
      </section>

      {/* 3 QUICK TRUST BADGES */}
      <section className="max-w-[1000px] mx-auto px-6 sm:px-8 py-10 pb-20 flex justify-between flex-wrap gap-5 text-sm sm:text-base text-[#B4B4BC]">
        <div className="flex items-center gap-3">
          <span className="text-[#5EE0A0]">
            <Shield className="w-5 h-5" />
          </span>
          <span>Protected PayPal escrow</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[#9D97FF]">
            <Sparkles className="w-5 h-5" />
          </span>
          <span>3-second AI review</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[#F5C451]">
            <Zap className="w-5 h-5" />
          </span>
          <span>Instant payouts, zero ghosting</span>
        </div>
      </section>

      {/* 2. THE 4-STEP VERTICAL TIMELINE WORKFLOW */}
      <section
        id="flow"
        data-tour="workflow"
        className="max-w-[1000px] mx-auto px-6 sm:px-8 py-10"
      >
        <div className="text-center mb-16">
          <h2 className="hd text-3xl sm:text-5xl font-bold tracking-tight text-[#F2F2F4]">
            Four steps. No chasing.
          </h2>
          <p className="mt-3.5 text-base sm:text-lg text-[#A0A0AA]">
            Follow one milestone down the line, from deposit to payout.
          </p>
        </div>

        {/* Vertical Connected Flow */}
        <div className="relative flex flex-col gap-10">
          {/* Central Animated Vertical Fill Line */}
          <div className="hidden md:block absolute left-1/2 -ml-[1px] top-[125px] bottom-[125px] w-[2px] bg-[#23232B] pointer-events-none">
            <div className="timeline-vfill" />
          </div>

          {/* STEP 1: CLIENT */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_72px_1fr] items-center gap-6 md:gap-0 min-h-[250px]">
            <div>
              <div
                onClick={() => setActiveStep(activeStep === 1 ? null : 1)}
                className={`card p-7 sm:p-8 rounded-[20px] bg-[#131318] border transition-all cursor-pointer ${
                  activeStep === 1
                    ? "border-[#7C74FF] ring-1 ring-[#7C74FF]/30"
                    : "border-[#26262E] hover:border-[#5E57C9] timeline-card-anim"
                }`}
                style={{ animationDelay: "0s" }}
              >
                <div className="flex gap-4 items-center mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#1E1C45] text-[#B9B4FF] flex items-center justify-center">
                    <Lock className="w-7 h-7" />
                  </div>
                  <div className="text-[#9D97FF] text-[13px] font-semibold tracking-wider uppercase">
                    1 · CLIENT
                  </div>
                </div>

                <h3 className="hd text-2xl font-semibold mb-2.5 text-[#F2F2F4]">
                  Money goes in first.
                </h3>
                <p className="text-[#B4B4BC] text-sm sm:text-base leading-relaxed">
                  The client deposits the milestone payment into PayPal escrow
                  before any work begins. You know it’s real.
                </p>

                <div className="mt-5 pt-4 border-t border-[#26262E]">
                  <div className="text-[#A0A0AA] text-xs">
                    Milestone 1 · Real-world example
                  </div>
                  <div className="hd text-3xl sm:text-4xl font-semibold mt-1 text-[#F2F2F4]">
                    $1,200
                  </div>
                  <span className="inline-block bg-[#12301F] text-[#5EE0A0] text-xs sm:text-sm font-medium px-3.5 py-1.5 rounded-full mt-3">
                    Locked in escrow
                  </span>
                </div>
              </div>
            </div>

            {/* Central Node 1 */}
            <div className="hidden md:flex justify-center relative">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center bg-[#23232B] text-[#A4A4AD] border-4 border-[#0A0A0D]"
                style={{
                  boxShadow: "0 0 0 8px #0A0A0D",
                }}
              >
                <Lock className="w-6 h-6" />
              </div>
            </div>

            <div className="hidden md:block" />
          </div>

          {/* STEP 2: CONTRACTOR */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_72px_1fr] items-center gap-6 md:gap-0 min-h-[250px]">
            <div className="hidden md:block" />

            {/* Central Node 2 */}
            <div className="hidden md:flex justify-center relative">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center bg-[#23232B] text-[#A4A4AD] border-4 border-[#0A0A0D]"
                style={{
                  boxShadow: "0 0 0 8px #0A0A0D",
                }}
              >
                <FileText className="w-6 h-6" />
              </div>
            </div>

            <div>
              <div
                onClick={() => setActiveStep(activeStep === 2 ? null : 2)}
                className={`card p-7 sm:p-8 rounded-[20px] bg-[#131318] border transition-all cursor-pointer ${
                  activeStep === 2
                    ? "border-[#7C74FF] ring-1 ring-[#7C74FF]/30"
                    : "border-[#26262E] hover:border-[#5E57C9] timeline-card-anim"
                }`}
                style={{ animationDelay: "4s" }}
              >
                <div className="flex gap-4 items-center mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#1E1C45] text-[#B9B4FF] flex items-center justify-center">
                    <FileText className="w-7 h-7" />
                  </div>
                  <div className="text-[#9D97FF] text-[13px] font-semibold tracking-wider uppercase">
                    2 · CONTRACTOR
                  </div>
                </div>

                <h3 className="hd text-2xl font-semibold mb-2.5 text-[#F2F2F4]">
                  You deliver the proof.
                </h3>
                <p className="text-[#B4B4BC] text-sm sm:text-base leading-relaxed">
                  Finish the milestone and submit a link, a design file, or a code
                  repo. It’s measured strictly against what was agreed.
                </p>

                <div className="mt-5 space-y-2">
                  <div className="p-3 bg-[#1B1B22] rounded-xl text-sm font-mono text-[#E8E8EC] border border-[#2E2E38]">
                    homepage-design.fig
                  </div>
                  <div className="p-3 bg-[#1B1B22] rounded-xl text-sm font-mono text-[#E8E8EC] border border-[#2E2E38]">
                    api-service-test-suite.ts
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 3: AI REFEREE */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_72px_1fr] items-center gap-6 md:gap-0 min-h-[250px]">
            <div>
              <div
                onClick={() => setActiveStep(activeStep === 3 ? null : 3)}
                className={`card p-7 sm:p-8 rounded-[20px] bg-[#131318] border transition-all cursor-pointer ${
                  activeStep === 3
                    ? "border-[#7C74FF] ring-1 ring-[#7C74FF]/30"
                    : "border-[#26262E] hover:border-[#5E57C9] timeline-card-anim"
                }`}
                style={{ animationDelay: "8s" }}
              >
                <div className="flex gap-4 items-center mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#1E1C45] text-[#B9B4FF] flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div className="text-[#9D97FF] text-[13px] font-semibold tracking-wider uppercase">
                    3 · AI REFEREE
                  </div>
                </div>

                <h3 className="hd text-2xl font-semibold mb-2.5 text-[#F2F2F4]">
                  Checked in 3 seconds.
                </h3>
                <p className="text-[#B4B4BC] text-sm sm:text-base leading-relaxed">
                  The referee compares the work with the checklist, line by line.
                  No bias, no surprise extra demands.
                </p>

                <div className="mt-5 pt-4 border-t border-[#26262E]">
                  <div className="flex justify-between text-xs text-[#A0A0AA] mb-2 font-medium">
                    <span>Audit score</span>
                    <span className="text-[#5EE0A0] font-mono">94 / 100</span>
                  </div>
                  <div className="h-2 bg-[#23232B] rounded-full overflow-hidden">
                    <div className="timeline-score-bar" />
                  </div>
                  <span className="inline-block bg-[#12301F] text-[#5EE0A0] text-xs sm:text-sm font-medium px-3.5 py-1.5 rounded-full mt-3">
                    Approved
                  </span>
                </div>
              </div>
            </div>

            {/* Central Node 3 */}
            <div className="hidden md:flex justify-center relative">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center bg-[#23232B] text-[#A4A4AD] border-4 border-[#0A0A0D]"
                style={{
                  boxShadow: "0 0 0 8px #0A0A0D",
                }}
              >
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>

            <div className="hidden md:block" />
          </div>

          {/* STEP 4: PAYOUT */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_72px_1fr] items-center gap-6 md:gap-0 min-h-[250px]">
            <div className="hidden md:block" />

            {/* Central Node 4 */}
            <div className="hidden md:flex justify-center relative">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center bg-[#23232B] text-[#A4A4AD] border-4 border-[#0A0A0D]"
                style={{
                  boxShadow: "0 0 0 8px #0A0A0D",
                }}
              >
                <Send className="w-6 h-6" />
              </div>
            </div>

            <div>
              <div
                onClick={() => setActiveStep(activeStep === 4 ? null : 4)}
                className={`card p-7 sm:p-8 rounded-[20px] bg-[#131318] border transition-all cursor-pointer ${
                  activeStep === 4
                    ? "border-[#7C74FF] ring-1 ring-[#7C74FF]/30"
                    : "border-[#26262E] hover:border-[#5E57C9] timeline-card-anim"
                }`}
                style={{ animationDelay: "12s" }}
              >
                <div className="flex gap-4 items-center mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#1E1C45] text-[#B9B4FF] flex items-center justify-center">
                    <Send className="w-7 h-7" />
                  </div>
                  <div className="text-[#9D97FF] text-[13px] font-semibold tracking-wider uppercase">
                    4 · PAYOUT
                  </div>
                </div>

                <h3 className="hd text-2xl font-semibold mb-2.5 text-[#F2F2F4]">
                  Paid, straight away.
                </h3>
                <p className="text-[#B4B4BC] text-sm sm:text-base leading-relaxed">
                  Approved work releases the funds to your PayPal in seconds. If a
                  client goes quiet, escrow auto-releases after 48 hours.
                </p>

                <div className="mt-5 pt-4 border-t border-[#26262E]">
                  <div className="text-[#A0A0AA] text-xs">
                    Released to your PayPal
                  </div>
                  <div className="hd text-3xl sm:text-4xl font-semibold mt-1 text-[#5EE0A0]">
                    + $1,200
                  </div>
                  <span className="inline-block bg-[#12301F] text-[#5EE0A0] text-xs sm:text-sm font-medium px-3.5 py-1.5 rounded-full mt-3">
                    Payout complete
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. EVERYTHING ON ONE LIVE CONTRACT (SIMULATED COCKPIT PREVIEW) */}
      <section id="contract" className="max-w-[880px] mx-auto px-6 sm:px-8 pt-28 pb-10">
        <div className="text-center mb-14">
          <h2 className="hd text-3xl sm:text-5xl font-bold tracking-tight text-[#F2F2F4]">
            Everything on one live contract.
          </h2>
          <p className="mt-3.5 text-base sm:text-lg text-[#A0A0AA]">
            Every milestone, payment and decision in a single timeline. Live contract data shown.
          </p>
        </div>

        <div className="card p-7 sm:p-9 rounded-[24px] bg-[#131318] border border-[#26262E]">
          {/* Header */}
          <div className="flex justify-between items-center flex-wrap gap-4 pb-6">
            <div>
              <h3 className="hd text-2xl font-semibold text-[#F2F2F4]">
                Brand identity project
              </h3>
              <div className="text-[#A0A0AA] text-sm mt-1">
                Alex Rivera · Contractor
              </div>
            </div>
            <div className="text-right">
              <div className="text-[#A0A0AA] text-xs">Funded in escrow</div>
              <div className="hd text-3xl font-semibold text-[#F2F2F4]">$2,400</div>
            </div>
          </div>

          {/* Progress Multi-Bar */}
          <div className="flex gap-1.5 mb-5">
            <div className="flex-1 h-1.5 rounded-full bg-[#5EE0A0]" />
            <div className="flex-1 h-1.5 rounded-full bg-[#7C74FF]" />
            <div className="flex-1 h-1.5 rounded-full bg-[#23232B]" />
          </div>

          {/* Milestone Rows */}
          <div className="flex justify-between items-center gap-4 py-4 border-t border-[#26262E]">
            <div>
              <div className="font-semibold text-sm sm:text-base text-[#F2F2F4]">
                Homepage design
              </div>
              <div className="text-[#A0A0AA] text-xs sm:text-sm mt-0.5">$1,200</div>
            </div>
            <span className="bg-[#12301F] text-[#5EE0A0] text-xs sm:text-sm font-medium px-3.5 py-1.5 rounded-full whitespace-nowrap">
              Paid
            </span>
          </div>

          <div className="flex justify-between items-center gap-4 py-4 border-t border-[#26262E]">
            <div>
              <div className="font-semibold text-sm sm:text-base text-[#F2F2F4]">
                Brand guide
              </div>
              <div className="text-[#A0A0AA] text-xs sm:text-sm mt-0.5">$800</div>
            </div>
            <span className="bg-[#1E1C45] text-[#B9B4FF] text-xs sm:text-sm font-medium px-3.5 py-1.5 rounded-full whitespace-nowrap">
              In AI review
            </span>
          </div>

          <div className="flex justify-between items-center gap-4 py-4 border-t border-[#26262E]">
            <div>
              <div className="font-semibold text-sm sm:text-base text-[#F2F2F4]">
                Handoff files
              </div>
              <div className="text-[#A0A0AA] text-xs sm:text-sm mt-0.5">$400</div>
            </div>
            <span className="bg-[#1E1E25] text-[#A0A0AA] text-xs sm:text-sm font-medium px-3.5 py-1.5 rounded-full whitespace-nowrap">
              Locked
            </span>
          </div>

          {/* Live Activity Timeline */}
          <div className="border-t border-[#26262E] mt-3 pt-7">
            <div className="text-[#9D97FF] text-xs font-semibold tracking-wider uppercase mb-5">
              ACTIVITY TIMELINE
            </div>

            <div className="relative flex flex-col gap-6 pl-1">
              <div className="absolute left-[5px] top-2 bottom-2 w-[2px] bg-[#26262E]" />

              <div className="flex gap-4 relative" style={{ animation: "timelineEv0 16s infinite" }}>
                <span className="w-3 h-3 rounded-full bg-[#F5C451] shrink-0 mt-1.5 ring-4 ring-[#131318]" />
                <div>
                  <div className="font-medium text-sm text-[#F2F2F4]">
                    Client funded escrow
                  </div>
                  <div className="text-[#A0A0AA] text-xs mt-0.5">
                    $2,400 locked in PayPal
                  </div>
                </div>
              </div>

              <div className="flex gap-4 relative" style={{ animation: "timelineEv1 16s infinite" }}>
                <span className="w-3 h-3 rounded-full bg-[#9D97FF] shrink-0 mt-1.5 ring-4 ring-[#131318]" />
                <div>
                  <div className="font-medium text-sm text-[#F2F2F4]">
                    Alex submitted Milestone 1
                  </div>
                  <div className="text-[#A0A0AA] text-xs mt-0.5">
                    2 deliverable files attached
                  </div>
                </div>
              </div>

              <div className="flex gap-4 relative" style={{ animation: "timelineEv2 16s infinite" }}>
                <span className="w-3 h-3 rounded-full bg-[#9D97FF] shrink-0 mt-1.5 ring-4 ring-[#131318]" />
                <div>
                  <div className="font-medium text-sm text-[#F2F2F4]">
                    AI review: 94 / 100 · Approved
                  </div>
                  <div className="text-[#A0A0AA] text-xs mt-0.5">
                    Scope met, quality verified
                  </div>
                </div>
              </div>

              <div className="flex gap-4 relative" style={{ animation: "timelineEv3 16s infinite" }}>
                <span className="w-3 h-3 rounded-full bg-[#5EE0A0] shrink-0 mt-1.5 ring-4 ring-[#131318]" />
                <div>
                  <div className="font-medium text-sm text-[#F2F2F4]">
                    $1,200 paid to PayPal
                  </div>
                  <div className="text-[#A0A0AA] text-xs mt-0.5">
                    Payout complete
                  </div>
                </div>
              </div>
            </div>

            {/* Quick demo contract link */}
            <div className="mt-8 pt-5 border-t border-[#26262E] flex justify-between items-center flex-wrap gap-3">
              <span className="text-xs text-[#A0A0AA]">
                Ready to test with your own deliverable?
              </span>
              <Link
                href="/contracts/cnt_9821_stripe"
                className="text-xs text-[#7C74FF] hover:text-[#9D97FF] font-medium inline-flex items-center gap-1"
              >
                Inspect Live Demo Contract
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FREELANCING WITHOUT THE AWKWARD PARTS (SIDE-BY-SIDE COMPARISON) */}
      <section id="why" className="max-w-[1120px] mx-auto px-6 sm:px-8 py-24">
        <h2 className="hd text-3xl sm:text-5xl font-bold tracking-tight text-center mb-16 text-[#F2F2F4]">
          Freelancing without the awkward parts.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14">
          {/* Card 1: Without ResolvAI */}
          <div className="card p-7 sm:p-9 rounded-[20px] bg-[#131318] border border-[#26262E]">
            <div className="flex items-center gap-3.5 pb-5 text-[#FF8A8A]">
              <Clock className="w-7 h-7" />
              <span className="hd text-2xl font-semibold text-[#F2F2F4]">
                Without ResolvAI
              </span>
            </div>

            <div className="space-y-0">
              <div className="flex gap-4 py-5 border-t border-[#26262E]">
                <span className="text-[#FF8A8A] shrink-0 mt-0.5">
                  <X className="w-5 h-5" />
                </span>
                <div>
                  <div className="font-semibold text-base text-[#F2F2F4]">
                    Waiting 30+ days
                  </div>
                  <div className="text-[#A0A0AA] mt-1.5 text-sm leading-relaxed">
                    Work is finished, then weeks pass for replies and invoice cycles.
                  </div>
                </div>
              </div>

              <div className="flex gap-4 py-5 border-t border-[#26262E]">
                <span className="text-[#FF8A8A] shrink-0 mt-0.5">
                  <X className="w-5 h-5" />
                </span>
                <div>
                  <div className="font-semibold text-base text-[#F2F2F4]">
                    Scope creep
                  </div>
                  <div className="text-[#A0A0AA] mt-1.5 text-sm leading-relaxed">
                    “Can you also build this one extra thing before I pay?”
                  </div>
                </div>
              </div>

              <div className="flex gap-4 py-5 border-t border-[#26262E]">
                <span className="text-[#FF8A8A] shrink-0 mt-0.5">
                  <X className="w-5 h-5" />
                </span>
                <div>
                  <div className="font-semibold text-base text-[#F2F2F4]">
                    20% platform cuts
                  </div>
                  <div className="text-[#A0A0AA] mt-1.5 text-sm leading-relaxed">
                    Freelance portals take a large slice of everything you earn.
                  </div>
                </div>
              </div>

              <div className="flex gap-4 py-5 border-t border-[#26262E]">
                <span className="text-[#FF8A8A] shrink-0 mt-0.5">
                  <X className="w-5 h-5" />
                </span>
                <div>
                  <div className="font-semibold text-base text-[#F2F2F4]">
                    Fear of ghosting
                  </div>
                  <div className="text-[#A0A0AA] mt-1.5 text-sm leading-relaxed">
                    Handing over code or designs with nothing protecting you.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: With ResolvAI */}
          <div className="card p-7 sm:p-9 rounded-[20px] bg-[#131318] border border-[#3B3680]">
            <div className="flex items-center gap-3.5 pb-5 text-[#5EE0A0]">
              <Shield className="w-7 h-7" />
              <span className="hd text-2xl font-semibold text-[#F2F2F4]">
                With ResolvAI
              </span>
            </div>

            <div className="space-y-0">
              <div className="flex gap-4 py-5 border-t border-[#26262E]">
                <span className="text-[#5EE0A0] shrink-0 mt-0.5">
                  <Check className="w-5 h-5" />
                </span>
                <div>
                  <div className="font-semibold text-base text-[#F2F2F4]">
                    Protected escrow
                  </div>
                  <div className="text-[#A0A0AA] mt-1.5 text-sm leading-relaxed">
                    The money is deposited upfront, so you know you’ll be paid.
                  </div>
                </div>
              </div>

              <div className="flex gap-4 py-5 border-t border-[#26262E]">
                <span className="text-[#5EE0A0] shrink-0 mt-0.5">
                  <Check className="w-5 h-5" />
                </span>
                <div>
                  <div className="font-semibold text-base text-[#F2F2F4]">
                    A fair AI referee
                  </div>
                  <div className="text-[#A0A0AA] mt-1.5 text-sm leading-relaxed">
                    Work is judged only against the original checklist, in under 3 seconds.
                  </div>
                </div>
              </div>

              <div className="flex gap-4 py-5 border-t border-[#26262E]">
                <span className="text-[#5EE0A0] shrink-0 mt-0.5">
                  <Check className="w-5 h-5" />
                </span>
                <div>
                  <div className="font-semibold text-base text-[#F2F2F4]">
                    Instant cashout
                  </div>
                  <div className="text-[#A0A0AA] mt-1.5 text-sm leading-relaxed">
                    Funds go straight to your PayPal with no delay.
                  </div>
                </div>
              </div>

              <div className="flex gap-4 py-5 border-t border-[#26262E]">
                <span className="text-[#5EE0A0] shrink-0 mt-0.5">
                  <Check className="w-5 h-5" />
                </span>
                <div>
                  <div className="font-semibold text-base text-[#F2F2F4]">
                    48-hour safety valve
                  </div>
                  <div className="text-[#A0A0AA] mt-1.5 text-sm leading-relaxed">
                    If the client goes silent, the money releases to you automatically.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BOTTOM CTA BANNER WITH CONCENTRIC SVG CIRCLES */}
      <section id="start" className="max-w-[1120px] mx-auto px-6 sm:px-8 py-16 pb-24">
        <div className="relative overflow-hidden bg-[#15143A] border border-[#3B3680] rounded-[32px] py-20 px-8 text-center">
          {/* Concentric Decorative SVG Circles */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 1000 340"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            <g fill="none" stroke="#7C74FF" strokeOpacity=".22">
              <circle cx="500" cy="170" r="110" />
              <circle cx="500" cy="170" r="190" />
              <circle cx="500" cy="170" r="270" />
              <circle cx="500" cy="170" r="350" />
            </g>
          </svg>

          <div className="relative z-10">
            <h2 className="hd text-3xl sm:text-5xl font-bold text-[#F2F2F4]">
              Ready to try milestone escrow?
            </h2>
            <p className="mt-4 max-w-[520px] mx-auto text-base sm:text-lg text-[#C9C6F5] leading-relaxed">
              Launch the demo and watch AI arbitration and a PayPal payout happen live.
            </p>

            <div className="mt-9 flex flex-wrap gap-3.5 justify-center">
              <Link
                href="/dashboard"
                className="px-7 py-3.5 rounded-full bg-[#F2F2F4] hover:bg-white text-[#0A0A0D] font-semibold text-base transition-colors"
              >
                Open dashboard
              </Link>
              <Link
                href="/contracts/cnt_9821_stripe"
                className="px-7 py-3.5 rounded-full border border-[#5E57C9] hover:bg-[#1E1C45] text-[#F2F2F4] font-semibold text-base transition-colors"
              >
                Inspect the demo contract
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CLEAN FOOTER */}
      <footer className="max-w-[1120px] mx-auto px-6 sm:px-8 py-6 pb-12 flex justify-between flex-wrap gap-3 text-sm text-[#A0A0AA] border-t border-[#1C1C24]">
        <div>
          <b className="text-[#F2F2F4]">ResolvAI</b> · Automated milestone escrow and verification
        </div>
        <div>
          PayPal payment rails · AI multi-agent review
        </div>
      </footer>
    </div>
  );
}

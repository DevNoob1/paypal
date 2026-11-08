<div align="center">

# ResolvAI ⚡
### Autonomous AI Escrow & Milestone Arbitration Powered by PayPal Sandbox & Gemini

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![PayPal](https://img.shields.io/badge/PayPal-Sandbox%20API-003087?logo=paypal&logoColor=white)](https://developer.paypal.com/)
[![Google Gemini](https://img.shields.io/badge/AI-Gemini%201.5%20Flash-4285F4?logo=google&logoColor=white)](https://aistudio.google.com/)
[![Next.js 16](https://img.shields.io/badge/Next.js-16.4-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%204.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**Submitted for the PayPal AI Hackathon 2026: "Build What's Next with PayPal and AI"**

[Features](#-key-features) • [Architecture](#-architecture) • [Live Demo](#-live-demo-walkthrough) • [Getting Started](#-getting-started) • [API Integration](#-paypal--ai-integration-details)

---

</div>

## 📌 The Problem
In the global freelance and digital contractor economy ($1.5 Trillion), payment disputes and milestone delays create immense financial friction:
1. **The 14-Day Review Lag:** Clients often ghost or take weeks to review completed code, leaving freelancers unpaid.
2. **Subjective Scope Creep:** Clients dispute milestones based on subjective opinions rather than agreed criteria.
3. **Escrow Platform Overhead:** Platforms charge 10%–20% commissions and take up to a month to mediate disputes via human tickets.
4. **PayPal Chargeback Risk:** Merchants face costly chargeback fees when digital goods disputes lack objective fulfillment proof.

---

## 💡 The Solution: ResolvAI
**ResolvAI puts AI behind the wheel of PayPal.** It turns static agreements into autonomous, non-custodial milestone contracts:
1. **Locked Escrow:** Client deposits milestone funds via the **PayPal Orders API** (Sandbox).
2. **Artifact Verification:** Freelancer submits deliverables (GitHub PR, staging links, test runs).
3. **Autonomous AI Arbiter:** **Google Gemini 1.5 Flash** acts as an impartial technical mediator, rigorously auditing submitted deliverables against each acceptance criterion with mathematical scoring.
4. **Instant Automated Settlement:** If criteria pass, the **PayPal Payouts API** immediately transfers funds to the contractor in under 2 seconds. If deficient, it generates an objective **PayPal Dispute Evidence Packet**.

---

## ✨ Key Features

* 🔒 **PayPal Sandbox Escrow Locks:** Secure authorization and capture using PayPal's V2 Orders API.
* 🤖 **Gemini 1.5 Flash Arbitration Engine:** Evaluates code, pull requests, and documentation against defined conditions with deterministic scoring.
* ⚡ **Autonomous Payout Execution:** Instant fund release via PayPal Payouts batch API upon AI approval.
* 📊 **Enterprise Executive Dashboard:** Real-time visibility into escrow in flight, completed settlements, approval rates, and dispute logs.
* 🛡️ **Dispute Evidence Packet Generator:** Formats objective proof ready for direct submission to PayPal's Customer Disputes portal.
* 🔄 **Perspective Switcher:** Seamlessly toggle between Client (Buyer) and Contractor (Vendor) viewpoints.

---

## 🏗️ Architecture

```
                                 [ Client / Buyer ]
                                         │
                         1. Create Contract & Fund Escrow
                                         ▼
                     ┌───────────────────────────────────────┐
                     │          PayPal Orders API            │
                     │      (Sandbox Escrow Locked)          │
                     └──────────────────┬────────────────────┘
                                        │
                                 [ Contractor ]
                                        │
                          2. Submit PR / Code Artifacts
                                        ▼
                     ┌───────────────────────────────────────┐
                     │        ResolvAI Arbiter Room          │
                     │     (Google Gemini 1.5 Flash)         │
                     └──────────────────┬────────────────────┘
                                        │
                    3. Rigorous Acceptance Criteria Audit
                                        │
                 ┌──────────────────────┴──────────────────────┐
                 ▼                                             ▼
          [ Verdict: APPROVE ]                         [ Verdict: DISPUTE ]
                 │                                             │
      4. Autonomous Release                         4. Generate Objective
                 ▼                                       Evidence Packet
    ┌─────────────────────────┐                                │
    │    PayPal Payouts API   │                                ▼
    │  (Funds Dispatched)     │                     [ Frozen in Escrow ]
    └─────────────────────────┘
```

---

## 🛠️ Tech Stack & $0 Budget Design
* **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS v4, Lucide Icons, Canvas Confetti.
* **Backend:** Next.js Serverless Route Handlers (Node.js).
* **Payment Engine:** PayPal Sandbox REST API (OAuth 2.0, Orders V2, Payouts V1).
* **AI Model:** Google Gemini 1.5 Flash via `@google/generative-ai` with structured JSON schema output.
* **Storage:** JSON-backed persistent data store with pre-seeded demo contracts.

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) v18+ or v22+
* PayPal Developer Account (Free at [developer.paypal.com](https://developer.paypal.com))
* Google AI Studio Gemini API Key (Free at [aistudio.google.com](https://aistudio.google.com))

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/resolvai.git
cd resolvai
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_sandbox_client_id
PAYPAL_CLIENT_SECRET=your_paypal_sandbox_client_secret
PAYPAL_API_BASE=https://api-m.sandbox.paypal.com
GEMINI_API_KEY=your_gemini_api_key
```

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎬 2-Minute Demo Script (For Video Presentation)

1. **0:00 - 0:30 (The Hook):** Introduce the freelance dispute problem and showcase the ResolvAI Landing Page metrics.
2. **0:30 - 1:00 (Creating & Funding):** Open `/contracts/new`. Show how easily acceptance criteria are defined and how PayPal Sandbox locks the funds into escrow.
3. **1:00 - 2:00 (The Flagship Demo):** Navigate to the pre-seeded contract (`cnt_9821_stripe`).
   * Show the contractor's submitted PR and code snippet.
   * Click **"Run Autonomous AI Audit"**.
   * Watch Gemini evaluate all criteria in 1.8 seconds (Score: 94/100).
   * Watch the instant **PayPal Payout Batch ID** generated with celebratory confetti!
4. **2:00 - 2:30 (Dispute Handling):** Show contract `cnt_4419_crypto` demonstrating how ResolvAI flags missing security requirements and prepares a PayPal Dispute Evidence Packet.

---

## 📜 License
Distributed under the MIT License. See [LICENSE](LICENSE) for details.

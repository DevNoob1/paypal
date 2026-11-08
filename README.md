<div align="center">

# ResolvAI ⚡
### Autonomous AI Escrow & Milestone Payments Powered by PayPal & Gemini

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![PayPal](https://img.shields.io/badge/PayPal-Sandbox%20API-003087?logo=paypal&logoColor=white)](https://developer.paypal.com/)
[![Google Gemini](https://img.shields.io/badge/AI-Gemini%201.5%20Flash-4285F4?logo=google&logoColor=white)](https://aistudio.google.com/)
[![Next.js 16](https://img.shields.io/badge/Next.js-16.4-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%204.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**Submitted for the PayPal AI Hackathon 2026: "Build What's Next with PayPal and AI"**

[Features](#-key-features) • [Architecture](#-architecture) • [Getting Started](#-getting-started) • [Demo Walkthrough](#-2-minute-demo-walkthrough)

---

</div>

## 📌 The Problem
In the global freelance and digital contractor economy ($1.5 Trillion), payment disputes and milestone delays create immense financial friction:
1. **The Review Lag:** Clients often take weeks or months to review completed work, leaving freelancers unpaid.
2. **Subjective Scope Creep:** Disagreements arise over opinions rather than clear, agreed acceptance criteria.
3. **Escrow Platform Overhead:** Traditional platforms charge 10%–20% fees and take weeks to mediate disputes manually.
4. **Payment Disputes:** Digital deliverables often lack objective verification evidence.

---

## 💡 The Solution: ResolvAI
**ResolvAI puts AI behind the wheel of PayPal.** It turns static agreements into automated milestone contracts:
1. **Funded Escrow:** The client deposits milestone funds via the **PayPal Orders API**.
2. **Deliverable Submission:** The contractor submits pull requests, staging URLs, and test logs.
3. **Three AI Reviewers:** Three specialized Google Gemini agents independently audit scope, code quality, and acceptance criteria.
4. **Instant Automated Settlement:** Upon consensus approval (>85%), the **PayPal Payouts API** immediately releases funds directly to the contractor.

---

## ✨ Key Features

* 🔒 **PayPal Escrow Deposit:** Secure authorization and capture using PayPal's V2 Orders API.
* 🤖 **Three Independent AI Agents:**
  * **Agent 1 (Scope Reviewer):** Validates deliverables against agreed acceptance criteria.
  * **Agent 2 (Code Inspector):** Inspects PR diffs, test coverage, and technical implementation.
  * **Agent 3 (Settlement Arbiter):** Synthesizes evaluations and authorizes PayPal payout release.
* ⚡ **Instant Automated Payout:** Direct fund release via PayPal Payouts upon AI approval.
* 🌓 **Dark & Light Theme Toggle:** Clean, professional interface with full support for light and dark themes.
* 🔄 **Perspective Switcher:** Seamlessly switch between Client and Contractor roles to experience both sides of the platform.
* 🛡️ **Objective Dispute Handling:** Generates evidence reports for milestones that do not meet agreed criteria.

---

## 🏗️ Architecture

```
                                 [ Client / Buyer ]
                                         │
                         1. Create Contract & Fund Escrow
                                         ▼
                     ┌───────────────────────────────────────┐
                     │          PayPal Orders API            │
                     │          (Escrow Deposit)             │
                     └──────────────────┬────────────────────┘
                                        │
                                 [ Contractor ]
                                         │
                          2. Submit PR / Test Artifacts
                                         ▼
                     ┌───────────────────────────────────────┐
                     │         Three AI Reviewers            │
                     │     (Google Gemini 1.5 Flash)         │
                     │  Scope • Code Quality • Settlement    │
                     └──────────────────┬────────────────────┘
                                        │
                    3. Acceptance Criteria Consensus Evaluation
                                        │
                 ┌──────────────────────┴──────────────────────┐
                 ▼                                             ▼
          [ Verdict: APPROVED ]                         [ Verdict: DISPUTED ]
                 │                                             │
      4. Automated Release                              4. Objective Review
                 ▼                                         Report Generated
    ┌─────────────────────────┐                                │
    │    PayPal Payouts API   │                                ▼
    │  (Direct to Contractor) │                     [ Funds Held in Escrow ]
    └─────────────────────────┘
```

---

## 🛠️ Tech Stack & $0 Budget Design
* **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS v4, Lucide Icons, Canvas Confetti.
* **Backend:** Next.js Route Handlers.
* **Payment Engine:** PayPal Sandbox REST API (OAuth 2.0, Orders V2, Payouts V1).
* **AI Model:** Google Gemini 1.5 Flash with structured JSON output and multi-agent coordination.
* **Storage:** JSON-backed persistent data store with pre-seeded demo contracts.

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) v18+ or v22+
* PayPal Developer Account (Free at [developer.paypal.com](https://developer.paypal.com))
* Google AI Studio Gemini API Key (Free at [aistudio.google.com](https://aistudio.google.com))

### 1. Clone & Install
```bash
git clone https://github.com/YOUR_USERNAME/resolvai.git
cd resolvai
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_API_BASE=https://api-m.sandbox.paypal.com
GEMINI_API_KEY=your_gemini_api_key

# Optional: Distinct keys for each AI reviewer
AGENT_SCOPE_KEY=your_gemini_api_key
AGENT_CODE_KEY=your_gemini_api_key
AGENT_SETTLEMENT_KEY=your_gemini_api_key
```

### 3. Run the App
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎬 2-Minute Demo Walkthrough

1. **The Problem & Concept (0:00 - 0:30):**
   * Open the homepage at `http://localhost:3000`.
   * Toggle the light/dark theme in the navbar.
   * Explain how milestone funds are secured with PayPal and verified by AI.
2. **Contract & Escrow Creation (0:30 - 1:00):**
   * Click **"New Contract"** (`/contracts/new`).
   * Select a template or define custom acceptance criteria.
   * Proceed to PayPal escrow deposit.
3. **The Core Demo — AI Review & Settlement (1:00 - 1:50):**
   * Open pre-seeded contract `cnt_9821_stripe`.
   * View the contractor's submitted pull request and unit test logs on the left.
   * Click **"Run AI Review & Release Payout"**.
   * Watch the 3 AI reviewers evaluate the submission in parallel.
   * Upon consensus approval, celebratory confetti fires and the **PayPal Payout Receipt** displays the transaction details.
4. **Perspective Switching (1:50 - 2:00):**
   * Click the account switcher in the top right to switch between **Client** and **Contractor** roles.
   * Notice how the dashboard dynamically adapts actions and metrics for each perspective.

---

## 📜 License
Distributed under the MIT License. See [LICENSE](LICENSE) for details.

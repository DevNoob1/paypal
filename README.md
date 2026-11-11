<div align="center">

# ResolvAI ⚡
### Autonomous AI Milestone Payments & Deliverable Verification Powered by PayPal & Gemini

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![PayPal](https://img.shields.io/badge/PayPal-Sandbox%20API%20(Orders%20%26%20Payouts)-003087?logo=paypal&logoColor=white)](https://developer.paypal.com/)
[![Google Gemini](https://img.shields.io/badge/AI-Gemini%202.5%20Flash%20Multimodal-4285F4?logo=google&logoColor=white)](https://aistudio.google.com/)
[![Next.js 16](https://img.shields.io/badge/Next.js-16.4%20Turbopack-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%204.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**Submitted for the PayPal AI Hackathon 2026: "Build What's Next with PayPal and AI"**

[Video Walkthrough Guide](#-complete-hackathon-video-walkthrough-guide) • [Key Features](#-key-features) • [Button & UI Reference](#-button--ui-workflow-reference) • [Architecture](#-architecture) • [Getting Started](#-getting-started)

---

</div>

## 📌 The Problem
In the global digital freelance economy ($1.5 Trillion), milestone payments are plagued by severe friction:
1. **The Review Bottleneck:** Freelancers finish work, but clients take weeks or months to review it, trapping contractor funds.
2. **Subjective Scope Creep:** Disagreements flare over shifting opinions rather than objective, testable acceptance criteria.
3. **Escrow Platform Tax:** Legacy platforms charge 10%–20% fees and take weeks to mediate disputes manually.
4. **Unverifiable Deliverables:** Digital artifacts (code repos, staging links, Figma designs) lack instant, impartial verification.

---

## 💡 The Solution: ResolvAI
**ResolvAI puts autonomous AI behind PayPal's payment rails.**
1. **Client Funds Protected Payment:** Upfront deposits are locked into the **PayPal Orders API**.
2. **AI Scope & Milestone Architect:** Gemini decomposes the project into logical milestones and splits the budget mathematically.
3. **Dual Parallel Deliverable Scanner:** When work is submitted, a dual-engine scanner inspects GitHub commits, code diffs, README architecture, and visual UI screenshot pixels *simultaneously* using **Gemini 2.5 Flash Multimodal Vision**.
4. **48-Hour Review Protection:** Verification engages a 48-hour client review window; if the client goes silent, funds automatically release.
5. **Two-Factor Authorized Settlement:** The client authorizes release with an OTP security handshake, triggering immediate settlement via the **PayPal Payouts API**.

---

## 🎬 Complete Hackathon Video Walkthrough Guide

Use this exact chronological guide for your demo video recording. It outlines **the timestamps, what to click, what to say, and what happens on screen**.

```
  0:00                       0:30                       1:15                       2:00               2:30
   │                          │                          │                          │                  │
   ▼                          ▼                          ▼                          ▼                  ▼
[ Act 1: The Pitch ] ──► [ Act 2: Client Setup ] ──► [ Act 3: Contractor Scan ] ──► [ Act 4: Payout ] ──► [ Summary ]
  Problem & Solution       AI Milestones & Deposit     Dual Parallel Scanner       OTP & PayPal Payout    Closing Hook
```

---

### Act 1: The Pitch & Architecture (0:00 – 0:25)
* **Screen:** Open `http://localhost:3000` (Homepage).
* **What to Show:** Scroll down to the interactive PayPal $\rightarrow$ AI Verification $\rightarrow$ Payout flow diagram.
* **What to Say:**
  > *"Every year, millions of freelancers wait weeks to get paid because clients take forever to manually review deliverables. ResolvAI solves this by putting autonomous AI directly on PayPal rails. Funds are locked upfront, verified objectively through multimodal code and visual inspection, and released instantly without payment disputes."*

---

### Act 2: Client Creates Agreement & Funds Payment (0:25 – 0:55)
* **Screen:** `http://localhost:3000/contracts/new`
* **Role in Navbar:** **Client** (`Sarah Jenkins` / `billing@acmecloud.io`)
* **Step-by-Step Actions:**
  1. Click **"+ New Contract"** in the top navigation bar.
  2. Enter Project Title: `Developer Portfolio Website & Project Showcase`.
  3. Enter Description: `Build responsive portfolio website with project gallery, about section, and working contact form.`
  4. Enter Total Budget: `$500.00`.
  5. Click **"✨ Generate Milestones with AI"**:
     * **What happens:** The button triggers an inline spinner (`Generating Milestones...`). Gemini decomposes the scope into logical phases (Architecture, Components, Staging) and mathematically distributes the \$500 budget.
  6. Click **"Continue to Payment"**.
  7. Click **"Authorize & Fund Protected Payment"** (or PayPal Sandbox button):
     * **What happens:** Creates an authorized order via the PayPal Orders V2 API.
  8. Click **"View Agreement Details"** to navigate into the newly created contract (`/contracts/cnt_...`).
* **What to Say:**
  > *"As the client, I set a $500 budget and click 'Generate Milestones with AI'. ResolvAI uses Gemini to break down the scope, assign criteria, and partition the budget. Then with one click, I fund the agreement through PayPal Orders."*

---

### Act 3: Contractor Submits Deliverable & Runs Dual Scanner (0:55 – 1:45)
* **Screen:** Contract Details page (`/contracts/[id]`)
* **Role in Navbar:** Click the profile icon and switch to **Contractor** (`Alex Rivera` / `alex.rivera@devmail.com`).
* **Step-by-Step Actions:**
  1. Under **Tab 1: Submit Work**:
     * **Work Link:** Paste your GitHub repository URL (e.g., `https://github.com/your-username/portfolio`).
     * **Live Deployed Website / Demo URL (Optional):** Paste your live hosted URL (e.g., `https://myportfolio.vercel.app`).
     * **Visual UI Screenshot:** Click the upload box and select your portfolio screenshot image.
     * **Notes:** `Completed responsive portfolio with project showcase and contact form.`
  2. Click **"Run AI Pre-Flight Check"**:
     * **What happens:** The **Dual Parallel Scanner** modal opens.
     * **Left Scanner (Link & Code Scanner):** Inspects GitHub commits, diffs, repository README, and HTTP response headers.
     * **Right Scanner (Visual UI Scanner):** Multimodal Gemini Vision analyzes the uploaded screenshot layout, buttons, and responsive elements.
     * Both scanners run simultaneously for ~2.5 seconds with live animated scan beams.
     * **Section 3 (AI Verdict):** Lights up with a deterministic quality score (`Score: 94/100 — PASS`).
  3. Click **"View Detailed Audit Results →"**:
     * **What happens:** Transitions smoothly to **Tab 2**, displaying each acceptance criterion checked with verifiable `Pass` badges and itemized diagnostic notes.
  4. Click **"Confirm & Submit Deliverable to Client"**:
     * **What happens:** Instant 1-click submit without modal replaying! Transitions to **Tab 3**, displays green confirmation card, logs external Email & SMS alerts dispatched to the client, and engages the 48-Hour Review Protection window.
* **What to Say:**
  > *"Now switching to the contractor perspective. I attach my GitHub repository and an actual visual screenshot of the website. When I click 'Run AI Pre-Flight Check', ResolvAI launches our Dual Parallel Scanner. It simultaneously crawls the code commits and runs Gemini Vision on the UI screenshot. It passes with a 94 score. I click submit, which instantly notifies the client and starts the 48-hour auto-release protection."*

---

### Act 4: Client Reviews & Authorizes PayPal Payout (1:45 – 2:25)
* **Screen:** Contract Details page (`/contracts/[id]`)
* **Role in Navbar:** Switch back to **Client** (`Sarah Jenkins`).
* **Step-by-Step Actions:**
  1. View the submitted deliverable card containing the live GitHub link, demo URL, visual screenshot thumbnail, and verified audit score.
  2. Click the **"View Dispatch Log"** button (or click the 🔔 **Bell icon** in the top navbar):
     * **What happens:** Slides open the live notification delivery drawer showing the actual Email alert sent to `billing@acmecloud.io` and SMS text dispatched to `+1 (555) 019-2834`.
  3. Click **"Authorize Payment Release"**:
     * **What happens:** Opens the Security Verification modal.
  4. Enter the Security OTP: **`849201`** (displayed clearly on screen).
  5. Click **"Verify & Release Payout"**:
     * **What happens:** The PayPal Payouts V1 API executes a batch payout to `alex.rivera@devmail.com`. Celebratory confetti fires, and the status updates to **Payment Completed** with the official PayPal Batch ID and settlement receipt.
* **What to Say:**
  > *"Back on the client side, I can inspect the deliverable proof, review the verified score, and check the live notification dispatch log. Everything is in order, so I click 'Authorize Payment Release', enter my 2FA OTP code, and ResolvAI executes a direct PayPal batch payout to the freelancer's wallet. Fast, transparent, and completely fraud-free."*

---

### Act 5: Summary & Closing Hook (2:25 – 2:40)
* **Screen:** Back to `http://localhost:3000/dashboard` showing updated project metrics.
* **What to Say:**
  > *"ResolvAI turns PayPal into an autonomous escrow referee powered by Gemini AI. Thanks for watching!"*

---

## 🎛️ Button & UI Workflow Reference

| Screen | Button / Control | Role | Function / What it Does |
| :--- | :--- | :--- | :--- |
| **Top Navbar** | **Role Switcher** | Both | Toggles between **Client** (`billing@acmecloud.io`) and **Contractor** (`alex.rivera@devmail.com`). |
| **Top Navbar** | **🔔 Bell Icon** | Both | Opens the slide-out **Live Notification Ledger** showing SMS, Email, and Webhook dispatch records. |
| **Top Navbar** | **Theme Toggle (☀️/🌙)** | Both | Switches between dark and light themes. |
| **`/contracts/new`** | **✨ Generate Milestones with AI** | Client | Sends project title, description, and budget to Gemini; dynamically splits budget and generates milestone criteria with an inline loader. |
| **`/contracts/new`** | **Continue to Payment** | Client | Advances to payment review and initiates PayPal Orders V2 transaction intent. |
| **`/contracts/new`** | **Authorize & Fund Payment** | Client | Locks agreement deposit using PayPal Sandbox Orders API. |
| **`/contracts/[id]` Tab 1** | **Upload File / Paste Link** | Contractor | Toggles between direct local file upload (PNG/JPG/WebP Base64) and external screenshot URL. |
| **`/contracts/[id]` Tab 1** | **Run AI Pre-Flight Check** | Contractor | Opens **Dual Parallel Scanner** modal; runs Link Scanner and Gemini Vision UI Scanner concurrently. |
| **Scanner Modal** | **View Detailed Audit Results →** | Contractor | Closes modal and navigates to Tab 2 to review itemized diagnostic criteria. |
| **`/contracts/[id]` Tab 2** | **Confirm & Submit to Client** | Contractor | Reuses verified pre-flight report for instant (<100ms) submission; engages 48h review window and dispatches alerts. |
| **`/contracts/[id]` Tab 3** | **View Dispatch Log** | Both | Opens notification drawer to view dispatched Email and SMS delivery payloads. |
| **`/contracts/[id]` Tab 3** | **Authorize Payment Release** | Client | Opens 2FA OTP security verification modal before releasing payment. |
| **OTP Modal** | **Verify & Release Payout** | Client | Verifies code `849201` and calls PayPal Payouts V1 API to disburse funds to contractor balance. |

---

## 🏗️ Architecture

```
                                  [ Client / Buyer ]
                                          │
                         1. Create Contract & Fund Payment
                                          ▼
                      ┌───────────────────────────────────────┐
                      │          PayPal Orders V2 API         │
                      │          (Protected Deposit)          │
                      └──────────────────┬────────────────────┘
                                         │
                                  [ Contractor ]
                                          │
                     2. Submit GitHub Repo & UI Screenshot
                                          ▼
                      ┌───────────────────────────────────────┐
                      │      Dual Parallel AI Scanner         │
                      │       (Google Gemini 2.5 Flash)       │
                      │  Link/Commits/README  •  UI Vision    │
                      └──────────────────┬────────────────────┘
                                         │
                    3. Deterministic Acceptance Evaluation
                                         │
                  ┌──────────────────────┴──────────────────────┐
                  ▼                                             ▼
           [ Verdict: PASS (≥75) ]                      [ Verdict: REVISE (<75) ]
                  │                                             │
      48h Auto-Release Engaged                          Dispute Packet Generated
                  │                                             │
      4. Client OTP Authorization (2FA)                 Contractor Revises Deliverable
                  ▼                                             ▼
     ┌─────────────────────────┐                        [ Funds Remain Protected ]
     │   PayPal Payouts V1 API │
     │  (Direct to Contractor) │
     └─────────────────────────┘
```

---

## 🛠️ Tech Stack & $0 Budget Design
* **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS v4, Lucide Icons, Canvas Confetti.
* **Backend:** Next.js Route Handlers.
* **Payment Rails:** PayPal Developer Sandbox REST API (OAuth 2.0, Orders V2, Payouts V1).
* **AI Engine:** Google Gemini 2.5 Flash Multimodal with structured JSON output, URL crawler, and zero-temperature determinism.
* **Storage:** JSON-backed persistent data store (`.data/contracts.json`).

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
```

### 3. Run the App
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 License
Distributed under the MIT License. See [LICENSE](LICENSE) for details.

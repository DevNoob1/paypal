// lib/store.ts - Enterprise Production Data Store
import fs from "fs";
import path from "path";
import { AuditReport } from "./gemini";

export type ContractStatus =
  | "DRAFT"
  | "FUNDED_ESCROW"
  | "IN_PROGRESS"
  | "PENDING_REVIEW"
  | "AI_VERIFIED"
  | "PAYOUT_COMPLETED"
  | "DISPUTED";

export interface DeliverableSubmission {
  submittedAt: string;
  notes: string;
  url?: string;
  screenshotUrl?: string;
  codeSnippet?: string;
}

export interface PayoutReceipt {
  payoutId: string;
  releasedAt: string;
  amount: number;
  currency: string;
  receiver: string;
  batchStatus: string;
  simulated?: boolean;
}

export interface ExternalNotification {
  id: string;
  timestamp: string;
  channel: "EMAIL" | "SMS" | "WEBHOOK";
  recipient: string;
  subject: string;
  message: string;
  status: "DELIVERED";
}

export interface Milestone {
  id: string;
  title: string;
  amount: number;
  status: ContractStatus;
  criteria: string[];
  deadline?: string;
  submission?: DeliverableSubmission;
  auditReport?: AuditReport;
  payoutReceipt?: PayoutReceipt;
}

export interface Contract {
  id: string;
  title: string;
  description: string;
  amount: number;
  currency: string;
  clientName: string;
  clientEmail: string;
  freelancerName: string;
  freelancerEmail: string;
  createdAt: string;
  deadline: string;
  status: ContractStatus;
  criteria: string[];
  paypalOrderId?: string;
  escrowCapturedAt?: string;
  submission?: DeliverableSubmission;
  auditReport?: AuditReport;
  payoutReceipt?: PayoutReceipt;
  milestones?: Milestone[];
  notifications?: ExternalNotification[];
}

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "contracts.json");

const SEED_CONTRACTS: Contract[] = [
  {
    id: "cnt_9821_stripe",
    title: "Customer Checkout & Online Payment Flow",
    description:
      "Build a responsive checkout page with credit card validation, discount code support, and automatic receipt generation.",
    amount: 450.0,
    currency: "USD",
    clientName: "Acme Cloud Corp",
    clientEmail: "billing@acmecloud.io",
    freelancerName: "Alex Rivera",
    freelancerEmail: "alex.rivera@devmail.com",
    createdAt: "2026-11-06T10:00:00.000Z",
    deadline: "2026-11-12T23:59:59.000Z",
    status: "AI_VERIFIED",
    criteria: [
      "Mobile-responsive checkout form with clean card input validation",
      "Instant discount code application and subtotal recalculation",
      "Automatic branded order confirmation email and printable receipt",
      "Passes automated verification test suite with no errors",
    ],
    paypalOrderId: "PP-ORD-8FG98231AA098",
    escrowCapturedAt: "2026-11-06T10:15:00.000Z",
    submission: {
      submittedAt: "2026-11-08T09:30:00.000Z",
      notes:
        "Completed all 4 requirements. Mobile checkout is fully responsive, discount codes calculate properly, and receipts generate cleanly. Staging demo linked below.",
      url: "https://demo-checkout.store/preview",
    },
    auditReport: {
      verdict: "APPROVE",
      overallScore: 95,
      confidence: 0.96,
      summary:
        "ResolvAI verified all 4 milestone requirements. The responsive checkout form, discount code logic, confirmation receipt, and automated test suite meet all agreed specifications.",
      payoutRecommended: true,
      criteriaResults: [
        {
          criterion: "Mobile-responsive checkout form with clean card input validation",
          status: "PASS",
          score: 96,
          notes:
            "Verified. Checkout form renders properly across mobile viewports with inline validation.",
        },
        {
          criterion: "Instant discount code application and subtotal recalculation",
          status: "PASS",
          score: 95,
          notes:
            "Verified. Promo codes calculate percentage and fixed discounts accurately.",
        },
        {
          criterion: "Automatic branded order confirmation email and printable receipt",
          status: "PASS",
          score: 94,
          notes:
            "Verified. Receipt and email templates generate correctly upon order completion.",
        },
        {
          criterion: "Passes automated verification test suite with no errors",
          status: "PASS",
          score: 95,
          notes:
            "Verified. Full verification test suite executes with 100% passing test cases.",
        },
      ],
    },
    milestones: [
      {
        id: "m_9821_1",
        title: "Phase 1: Checkout Form UI & Mobile Validation",
        amount: 200.0,
        status: "PAYOUT_COMPLETED",
        criteria: [
          "Mobile-responsive checkout form with clean card input validation",
          "Passes automated verification test suite with no errors",
        ],
        payoutReceipt: {
          payoutId: "PYT-9821001A",
          releasedAt: "2026-11-07T12:00:00.000Z",
          amount: 200.0,
          currency: "USD",
          receiver: "alex.rivera@devmail.com",
          batchStatus: "SUCCESS",
        },
      },
      {
        id: "m_9821_2",
        title: "Phase 2: Payment Gateway & Automated Email Receipts",
        amount: 250.0,
        status: "AI_VERIFIED",
        criteria: [
          "Instant discount code application and subtotal recalculation",
          "Automatic branded order confirmation email and printable receipt",
        ],
      },
    ],
    notifications: [
      {
        id: "notif_seed_01",
        timestamp: "2026-11-08T09:30:15.000Z",
        channel: "EMAIL",
        recipient: "billing@acmecloud.io",
        subject: "Action Required: Deliverable submitted for 'Customer Checkout & Online Payment Flow'",
        message: "Alex Rivera submitted deliverable proof (https://demo-checkout.store/preview). ResolvAI verified the criteria with score 95/100. 48-hour client review countdown initiated.",
        status: "DELIVERED",
      },
      {
        id: "notif_seed_02",
        timestamp: "2026-11-08T09:30:16.000Z",
        channel: "SMS",
        recipient: "+1 (555) 019-2834",
        subject: "ResolvAI Escrow Alert",
        message: "ResolvAI: Alex Rivera submitted Milestone 2 deliverable. Review & release $250.00 escrow in portal.",
        status: "DELIVERED",
      },
      {
        id: "notif_seed_03",
        timestamp: "2026-11-06T10:15:02.000Z",
        channel: "WEBHOOK",
        recipient: "PayPal Webhook Listener",
        subject: "PAYMENT.CAPTURE.COMPLETED",
        message: "Escrow order PP-ORD-8FG98231AA098 locked $450.00 USD securely under milestone protections.",
        status: "DELIVERED",
      },
    ],
  },
  {
    id: "cnt_8712_design",
    title: "Mobile App UI/UX & Figma Design System",
    description:
      "Create high-fidelity responsive mobile mockups in Figma with typography, color tokens, and exportable vector assets.",
    amount: 650.0,
    currency: "USD",
    clientName: "Acme Cloud Corp",
    clientEmail: "billing@acmecloud.io",
    freelancerName: "Alex Rivera",
    freelancerEmail: "alex.rivera@devmail.com",
    createdAt: "2026-11-04T14:20:00.000Z",
    deadline: "2026-11-18T18:00:00.000Z",
    status: "FUNDED_ESCROW",
    criteria: [
      "Figma file with 6 high-fidelity mobile screens (iOS & Android)",
      "Design system components with Light and Dark variants",
      "Exportable asset library with vector icons and typography specs",
    ],
    paypalOrderId: "PP-ORD-5LK98212BB112",
    escrowCapturedAt: "2026-11-04T14:35:00.000Z",
    milestones: [
      {
        id: "m_8712_1",
        title: "Phase 1: Wireframes & Mobile App Architecture",
        amount: 200.0,
        status: "PAYOUT_COMPLETED",
        criteria: [
          "Low-fidelity wireframes for 6 core mobile onboarding steps",
          "User flow diagram and interactive click-through structure",
        ],
        payoutReceipt: {
          payoutId: "PYT-8712001A",
          releasedAt: "2026-11-05T10:00:00.000Z",
          amount: 200.0,
          currency: "USD",
          receiver: "alex.rivera@devmail.com",
          batchStatus: "SUCCESS",
        },
      },
      {
        id: "m_8712_2",
        title: "Phase 2: High-Fidelity Figma Screens (iOS & Android)",
        amount: 300.0,
        status: "FUNDED_ESCROW",
        criteria: [
          "Figma file with 6 high-fidelity mobile screens (iOS & Android)",
          "Design system components with Light and Dark variants",
        ],
      },
      {
        id: "m_8712_3",
        title: "Phase 3: Exportable Vector Asset Library & Specs",
        amount: 150.0,
        status: "FUNDED_ESCROW",
        criteria: [
          "Exportable asset library with vector icons and typography specs",
          "Design handoff tokens document for engineers",
        ],
      },
    ],
    notifications: [
      {
        id: "notif_seed_01",
        timestamp: "2026-11-08T09:30:15.000Z",
        channel: "EMAIL",
        recipient: "billing@acmecloud.io",
        subject: "Action Required: Deliverable submitted for 'Customer Checkout & Online Payment Flow'",
        message: "Alex Rivera submitted deliverable proof (https://demo-checkout.store/preview). ResolvAI verified the criteria with score 95/100. 48-hour client review countdown initiated.",
        status: "DELIVERED",
      },
      {
        id: "notif_seed_02",
        timestamp: "2026-11-08T09:30:16.000Z",
        channel: "SMS",
        recipient: "+1 (555) 019-2834",
        subject: "ResolvAI Escrow Alert",
        message: "ResolvAI: Alex Rivera submitted Milestone 2 deliverable. Review & release $250.00 escrow in portal.",
        status: "DELIVERED",
      },
      {
        id: "notif_seed_03",
        timestamp: "2026-11-06T10:15:02.000Z",
        channel: "WEBHOOK",
        recipient: "PayPal Webhook Listener",
        subject: "PAYMENT.CAPTURE.COMPLETED",
        message: "Escrow order PP-ORD-8FG98231AA098 locked $450.00 USD securely under milestone protections.",
        status: "DELIVERED",
      },
    ],
  },
  {
    id: "cnt_2190_content",
    title: "1,500-Word SEO Article & Launch Copy",
    description:
      "Research and write a comprehensive product launch guide with SEO optimization, meta tags, and social snippets.",
    amount: 250.0,
    currency: "USD",
    clientName: "Acme Cloud Corp",
    clientEmail: "billing@acmecloud.io",
    freelancerName: "Alex Rivera",
    freelancerEmail: "alex.rivera@devmail.com",
    createdAt: "2026-10-28T12:00:00.000Z",
    deadline: "2026-11-02T18:00:00.000Z",
    status: "PAYOUT_COMPLETED",
    criteria: [
      "1,500-word comprehensive product guide in Google Docs",
      "All 3 target SEO keywords incorporated in H2 sections",
      "Grammarly score > 90 with meta description and social snippets",
    ],
    paypalOrderId: "PP-ORD-3MM77124DD441",
    escrowCapturedAt: "2026-10-28T12:15:00.000Z",
    payoutReceipt: {
      payoutId: "PYT-98217349910",
      releasedAt: "2026-11-02T16:00:00.000Z",
      amount: 250.0,
      currency: "USD",
      receiver: "alex.rivera@devmail.com",
      batchStatus: "SUCCESS",
    },
  },
  {
    id: "cnt_4419_security",
    title: "Brand Identity, Logo & Social Media Pack",
    description:
      "Design complete brand identity guidelines including vector logo files, brand color palette, typography hierarchy, and 5 social media banner templates.",
    amount: 350.0,
    currency: "USD",
    clientName: "Acme Cloud Corp",
    clientEmail: "billing@acmecloud.io",
    freelancerName: "Alex Rivera",
    freelancerEmail: "alex.rivera@devmail.com",
    createdAt: "2026-11-01T08:00:00.000Z",
    deadline: "2026-11-08T12:00:00.000Z",
    status: "DISPUTED",
    criteria: [
      "Vector logo files in SVG, PNG, and PDF with transparent backgrounds",
      "Brand style guide detailing colors, typography, and logo usage rules",
      "5 ready-to-use social media banner templates for LinkedIn and Twitter",
    ],
    paypalOrderId: "PP-ORD-7QQ12893CC883",
    escrowCapturedAt: "2026-11-01T08:12:00.000Z",
    submission: {
      url: "https://dropbox.com/s/sample-logo-draft.jpg",
      notes: "Uploaded a single low-resolution JPG draft of the logo icon. Missing the vector source files, brand guidelines document, and social media banner templates.",
      codeSnippet: "// Incomplete deliverable: Only low-resolution 300px raster image provided. Missing SVG/PDF vectors and banner templates.",
      submittedAt: "2026-11-06T10:00:00.000Z",
    },
    auditReport: {
      verdict: "DISPUTE",
      overallScore: 40,
      confidence: 0.96,
      summary:
        "The submitted deliverable fails agreed contract specifications: only a low-resolution JPG draft was uploaded. The required vector source files (SVG/PDF), brand style guide, and social media banner templates were not provided.",
      agents: [
        {
          agentId: "agent_scope",
          agentName: "Check 1: Rule Auditor",
          role: "Checklist & Requirements Verification",
          status: "FLAGGED",
          score: 45,
          timestamp: "2026-11-06T10:05:00.000Z",
          thoughtStream: [
            "Checking acceptance criteria against submitted deliverables...",
            "Criterion 1 (Vector SVG/PDF files): FAILED - only low-res JPG provided.",
            "Criterion 3 (5 social media templates): FAILED - no templates provided.",
          ],
          findings: "Failed 2 of 3 acceptance criteria. Scope omits required vector files and social media templates.",
        },
        {
          agentId: "agent_code",
          agentName: "Check 2: Quality & Proof Inspector",
          role: "Work Quality, Link & Artifact Verification",
          status: "FLAGGED",
          score: 38,
          timestamp: "2026-11-06T10:05:00.000Z",
          thoughtStream: [
            "Inspecting deliverable assets and image resolution...",
            "Image is 300x300 pixel raster draft with compression artifacts.",
            "Brand style guide document is completely missing.",
          ],
          findings: "Low-resolution raster asset cannot be used for commercial production. Missing vector source files and brand guidelines.",
        },
        {
          agentId: "agent_settlement",
          agentName: "Check 3: Payment Referee",
          role: "Quality Score & Payment Authorization",
          status: "FLAGGED",
          score: 40,
          timestamp: "2026-11-06T10:05:00.000Z",
          thoughtStream: [
            "Overall score: 40/100 (Below required 85% threshold)...",
            "Generating dispute evidence packet for PayPal customer mediation...",
          ],
          findings: "Consensus score 40/100 is below the 85% approval gate. Escrow payment frozen. Clear revision instructions issued to contractor.",
        },
      ],
      disputePacket: {
        claimantSummary:
          "Contractor submitted incomplete deliverables. Key assets required by contract (vector source files, style guide, social banners) are missing.",
        identifiedDeficiencies: [
          "Vector source files (SVG, PDF) were not provided (only low-res JPG preview)",
          "Brand style guide document with typography and color codes is missing",
          "5 social media banner templates were not created",
        ],
        recommendedResolution:
          "Escrow funds ($350.00 USD) remain safely held in PayPal escrow. Contractor has 5 business days to upload the required vector files and templates, or funds will auto-refund to Client.",
      },
      payoutRecommended: false,
    },
  },
];

function initStore(): Contract[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    // Always sync with clean seeds if file doesn't exist
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(SEED_CONTRACTS, null, 2), "utf-8");
      return SEED_CONTRACTS;
    }
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.warn("Store read error, using in-memory seeds:", err);
    return SEED_CONTRACTS;
  }
}

export function getAllContracts(): Contract[] {
  return initStore();
}

export function getContractById(id: string): Contract | null {
  const contracts = getAllContracts();
  return contracts.find((c) => c.id === id) || null;
}

export function saveContract(contract: Contract): Contract {
  const contracts = getAllContracts();
  const existingIdx = contracts.findIndex((c) => c.id === contract.id);
  if (existingIdx >= 0) {
    contracts[existingIdx] = contract;
  } else {
    contracts.unshift(contract);
  }

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(contracts, null, 2), "utf-8");
  } catch (err) {
    console.warn("Failed to persist contract to disk:", err);
  }

  return contract;
}

export function updateContract(id: string, updates: Partial<Contract>): Contract | null {
  const contract = getContractById(id);
  if (!contract) return null;

  const updated: Contract = {
    ...contract,
    ...updates,
  };

  return saveContract(updated);
}

export function addContractNotification(
  contractId: string,
  notification: Omit<ExternalNotification, "id" | "timestamp" | "status">
): Contract | null {
  const contract = getContractById(contractId);
  if (!contract) return null;

  const newNotif: ExternalNotification = {
    id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    status: "DELIVERED",
    ...notification,
  };

  const existing = contract.notifications || [];
  return updateContract(contractId, {
    notifications: [newNotif, ...existing],
  });
}

// Reset store to fresh clean seed data
export function resetStore(): Contract[] {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(SEED_CONTRACTS, null, 2), "utf-8");
  return SEED_CONTRACTS;
}

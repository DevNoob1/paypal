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
}

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "contracts.json");

const SEED_CONTRACTS: Contract[] = [
  {
    id: "cnt_9821_stripe",
    title: "Production Next.js 16 Webhook Integration & Testing",
    description:
      "Develop a robust webhook handler with signature verification, redis idempotency, and automated Jest test coverage.",
    amount: 450.0,
    currency: "USD",
    clientName: "Acme Cloud Corp",
    clientEmail: "billing@acmecloud.io",
    freelancerName: "Alex Rivera",
    freelancerEmail: "alex.rivera@devmail.com",
    createdAt: "2026-11-06T10:00:00.000Z",
    deadline: "2026-11-12T23:59:59.000Z",
    status: "PENDING_REVIEW",
    criteria: [
      "Implement HMAC-SHA256 signature verification middleware",
      "Redis-backed idempotency table to prevent duplicate transaction replay",
      "Minimum 85% unit test coverage using Jest / Vitest",
      "Comprehensive TypeScript interfaces for all event payloads",
    ],
    paypalOrderId: "PP-ORD-8FG98231AA098",
    escrowCapturedAt: "2026-11-06T10:15:00.000Z",
    submission: {
      submittedAt: "2026-11-08T09:30:00.000Z",
      notes:
        "Completed all 4 requirements. The HMAC middleware handles raw buffer verification securely. Unit test suite passes with 91.4% branch coverage. Staging PR linked below.",
      url: "https://github.com/alexrivera-dev/nextjs-stripe-webhooks/pull/4",
      codeSnippet: `// Webhook Verification & Idempotency Handler
export async function verifyAndProcess(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const rawBody = await req.text();
  const event = stripe.webhooks.constructEvent(rawBody, sig, WEBHOOK_SECRET);
  
  const isProcessed = await redis.set(\`webhook:\${event.id}\`, "1", "NX", "EX", 86400);
  if (!isProcessed) return { status: "ALREADY_PROCESSED" };
  
  return handleEvent(event);
}`,
    },
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

// Reset store to fresh clean seed data
export function resetStore(): Contract[] {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(SEED_CONTRACTS, null, 2), "utf-8");
  return SEED_CONTRACTS;
}

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
    title: "Tailwind 4 Design System & Component Library",
    description:
      "Enterprise design tokens, dark mode palette, accessible buttons, inputs, and modal primitives.",
    amount: 320.0,
    currency: "USD",
    clientName: "Veritas AI Labs",
    clientEmail: "ops@veritaslabs.ai",
    freelancerName: "Elena Rostova",
    freelancerEmail: "elena@rostova.design",
    createdAt: "2026-11-02T14:20:00.000Z",
    deadline: "2026-11-07T18:00:00.000Z",
    status: "PAYOUT_COMPLETED",
    criteria: [
      "Custom CSS variables for brand colors and dark mode",
      "Accessible ARIA dialog component with keyboard focus traps",
      "Responsive navigation drawer for mobile viewport",
    ],
    paypalOrderId: "PP-ORD-5LK98212BB112",
    escrowCapturedAt: "2026-11-02T14:35:00.000Z",
    payoutReceipt: {
      payoutId: "PYT-98217349910",
      releasedAt: "2026-11-07T12:00:00.000Z",
      amount: 320.0,
      currency: "USD",
      receiver: "elena@rostova.design",
      batchStatus: "SUCCESS",
    },
  },
  {
    id: "cnt_4419_crypto",
    title: "Solana Smart Contract Liquidity Vault",
    description:
      "Rust Anchor program with CPI token transfers, emergency pause authority, and security audit report.",
    amount: 850.0,
    currency: "USD",
    clientName: "SolVentures Capital",
    clientEmail: "treasury@solventures.vc",
    freelancerName: "Devin Zhao",
    freelancerEmail: "devin@zhaocrypto.io",
    createdAt: "2026-11-04T08:00:00.000Z",
    deadline: "2026-11-10T12:00:00.000Z",
    status: "DISPUTED",
    criteria: [
      "Zero reentrancy vulnerability in withdrawal logic",
      "Emergency timelock multi-sig pause mechanism",
      "Full integration test suite on local validator",
    ],
    paypalOrderId: "PP-ORD-7QQ12893CC883",
    escrowCapturedAt: "2026-11-04T08:12:00.000Z",
    auditReport: {
      verdict: "DISPUTE",
      overallScore: 42,
      confidence: 0.96,
      summary:
        "The submission failed critical security criteria: the withdrawal instruction lacks reentrancy guards and no local validator test scripts were submitted.",
      criteriaResults: [
        {
          criterion: "Zero reentrancy vulnerability in withdrawal logic",
          status: "FAIL",
          score: 30,
          notes: "State mutation occurs after token transfer CPI call. High vulnerability.",
        },
        {
          criterion: "Emergency timelock multi-sig pause mechanism",
          status: "PARTIAL",
          score: 65,
          notes: "Single authority key used instead of required 2-of-3 multi-sig.",
        },
        {
          criterion: "Full integration test suite on local validator",
          status: "FAIL",
          score: 30,
          notes: "No anchor test files or validator scripts found in repository.",
        },
      ],
      satisfiedItems: [],
      missingItems: [
        "Reentrancy guards on withdrawal instruction",
        "Multi-sig authority configuration",
        "Local test validator suite",
      ],
      payoutRecommended: false,
      disputePacket: {
        claimantSummary:
          "Smart contract poses severe capital risk in its current un-audited state with missing test coverage.",
        identifiedDeficiencies: [
          "Vulnerable withdrawal instruction",
          "Single-key admin authority instead of timelock multi-sig",
        ],
        recommendedResolution:
          "Escrow funds remain frozen. Contractor granted 5 days to remediate before full refund to client.",
      },
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

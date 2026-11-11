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

const SEED_CONTRACTS: Contract[] = [];

function initStore(): Contract[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, "[]", "utf-8");
      return [];
    }
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.warn("Store read error, using in-memory store:", err);
    return [];
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
  fs.writeFileSync(DATA_FILE, "[]", "utf-8");
  return [];
}

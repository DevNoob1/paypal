// lib/integrations.ts - Real-world integrations definition & persistence

export interface IntegrationField {
  key: string;
  label: string;
  placeholder: string;
  type: "text" | "password";
  helperText: string;
}

export interface IntegrationDefinition {
  id: "github" | "figma" | "vercel" | "notifications";
  name: string;
  category: "Code" | "Design" | "Hosting" | "Alerts";
  shortDesc: string;
  why: string;
  how: string[];
  fields: IntegrationField[];
}

export interface SavedIntegrationState {
  connected: boolean;
  connectedAs?: string;
  connectedAt?: string;
  values: Record<string, string>;
}

export const INTEGRATIONS_CATALOG: IntegrationDefinition[] = [
  {
    id: "github",
    name: "GitHub",
    category: "Code",
    shortDesc: "Inspect private code diffs, verify commits, and check automated test status.",
    why: "When a contractor submits software work, ResolvAI needs access to read the repository to verify that agreed files exist, pull request diffs match the milestone scope, and automated tests pass before releasing escrow money.",
    how: [
      "Go to GitHub Settings > Developer Settings > Personal Access Tokens.",
      "Generate a token with 'repo' read permissions.",
      "Paste your token and repository name below, then click Connect.",
    ],
    fields: [
      {
        key: "token",
        label: "GitHub Personal Access Token",
        placeholder: "ghp_...",
        type: "password",
        helperText: "Requires read access to repo code and commit checks.",
      },
      {
        key: "repo",
        label: "Default Repository (optional)",
        placeholder: "owner/repository-name",
        type: "text",
        helperText: "e.g. acme-corp/checkout-flow",
      },
    ],
  },
  {
    id: "figma",
    name: "Figma",
    category: "Design",
    shortDesc: "Audit UI screens, design system tokens, and clickable prototype links.",
    why: "For UI/UX and creative contracts, ResolvAI connects to Figma to count required screens, check that colors and typography follow your design tokens, and confirm that interactive prototype links work.",
    how: [
      "In Figma, click your profile icon in the top left > Settings.",
      "Scroll down to 'Personal access tokens' and click 'Generate new token'.",
      "Paste the token and your file key below, then click Connect.",
    ],
    fields: [
      {
        key: "token",
        label: "Figma Personal Access Token",
        placeholder: "figd_...",
        type: "password",
        helperText: "Read-only access to inspect frames and components.",
      },
      {
        key: "fileKey",
        label: "File Key or Share Link (optional)",
        placeholder: "e.g. 1a2b3c4d5e... or paste Figma URL",
        type: "text",
        helperText: "Found in your Figma share link (figma.com/design/<key>/...)",
      },
    ],
  },
  {
    id: "vercel",
    name: "Vercel",
    category: "Hosting",
    shortDesc: "Check live staging URLs, SSL certificates, and website response codes.",
    why: "When work includes a deployed web application, ResolvAI checks that the staging URL is live (returns 200 OK), has valid SSL security, and passes basic mobile responsiveness checks.",
    how: [
      "In Vercel, go to Account Settings > Tokens.",
      "Create a token with read access to deployments.",
      "Paste your token below and click Connect.",
    ],
    fields: [
      {
        key: "token",
        label: "Vercel Access Token",
        placeholder: "vcl_...",
        type: "password",
        helperText: "Access token used to verify deployment status.",
      },
      {
        key: "teamId",
        label: "Team Slug or Project Name (optional)",
        placeholder: "e.g. acme-web",
        type: "text",
        helperText: "Leave blank for personal accounts.",
      },
    ],
  },
  {
    id: "notifications",
    name: "Email & Phone Alerts",
    category: "Alerts",
    shortDesc: "Get direct emails and text messages when work is submitted or review time is running out.",
    why: "Milestone contracts have a 48-hour review window. If you don't check the dashboard, you might miss a submission. Setting your email and phone ensures you receive direct notifications the moment work is submitted.",
    how: [
      "Enter your primary email address for milestone and payout receipts.",
      "Enter your mobile phone number for urgent 48-hour deadline SMS alerts.",
      "Click Connect to activate direct notifications.",
    ],
    fields: [
      {
        key: "email",
        label: "Notification Email Address",
        placeholder: "your-email@company.com",
        type: "text",
        helperText: "Where milestone submission and payout notices will be sent.",
      },
      {
        key: "phone",
        label: "Mobile Phone Number for SMS",
        placeholder: "+1 (555) 000-0000",
        type: "text",
        helperText: "Receives urgent 48-hour countdown warnings.",
      },
      {
        key: "token",
        label: "Custom Resend or Twilio API Key (optional)",
        placeholder: "Leave blank to use platform delivery",
        type: "password",
        helperText: "Only needed if you want to dispatch from your own email domain.",
      },
    ],
  },
];

const STORAGE_KEY = "resolvai_integrations_state_v2";

export function loadSavedIntegrations(): Record<string, SavedIntegrationState> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function saveIntegrationState(serviceId: string, state: SavedIntegrationState): void {
  if (typeof window === "undefined") return;
  try {
    const current = loadSavedIntegrations();
    current[serviceId] = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch (err) {
    console.error("Failed to save integration state", err);
  }
}

export function removeIntegrationState(serviceId: string): void {
  if (typeof window === "undefined") return;
  try {
    const current = loadSavedIntegrations();
    delete current[serviceId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch (err) {
    console.error("Failed to delete integration state", err);
  }
}

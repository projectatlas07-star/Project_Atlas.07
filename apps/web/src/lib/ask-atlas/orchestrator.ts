import { apiFetch } from "@/lib/api";

export interface QueryResult {
  answer: string;
  reasoning: string;
  statistics: Record<string, number | string>;
  supportingRecords: Array<{
    id: string;
    type: string;
    description: string;
    value?: number;
  }>;
  recommendedActions: string[];
  confidence: number;
  dataSources: string[];
}

interface Claim {
  id: string;
  claimNumber: string;
  status: string;
  insuranceCompany: string | null;
  customerName: string | null;
  updatedAt: string;
  description: string | null;
  adjusterId: string | null;
}

interface Supplement {
  id: string;
  supplementNumber: string;
  status: string;
  carrier: string | null;
  requestedAmount: number | null;
  approvedAmount: number | null;
  submissionDate: string | null;
  responseDate: string | null;
  createdAt: string;
  updatedAt: string;
  claimId: string;
  claimNumber: string | null;
  adjusterId: string | null;
  adjusterName: string | null;
}

interface Adjuster {
  id: string;
  fullName: string;
  insuranceCompany: string | null;
  email: string | null;
  phone: string | null;
}

interface ActivityLog {
  id: string;
  action: string;
  entityType: string;
  entityName: string;
  description: string;
  userName: string;
  createdAt: string;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const SUPPLEMENT_WAITING_STATUSES = [
  "supplement_required",
  "supplement_submitted",
  "waiting_for_carrier",
];

function isSupplementWaiting(status: string) {
  return SUPPLEMENT_WAITING_STATUSES.includes(status);
}

function toIsoDate(date: Date) {
  return date.toISOString().split("T")[0];
}

function daysSince(dateString: string) {
  const date = new Date(dateString);
  return Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
}

function extractNumber(text: string): string | null {
  const match = text.match(/\d+/);
  return match ? match[0] : null;
}

async function fetchClaimsWaitingOnSupplements(): Promise<QueryResult> {
  const response = (await apiFetch(
    "/claims?limit=100",
  )) as PaginatedResponse<Claim>;
  const claims = (response.data || []).filter((claim) =>
    isSupplementWaiting(claim.status),
  );

  if (claims.length === 0) {
    return {
      answer:
        "I don't see any claims currently waiting on supplements. You're all caught up.",
      reasoning:
        "Filtered the most recent claims for statuses that indicate supplement work is pending.",
      statistics: {},
      supportingRecords: [],
      recommendedActions: [],
      confidence: 0.9,
      dataSources: ["claims"],
    };
  }

  const totalValue = claims.reduce((sum, claim) => {
    // We don't have an estimated value on this model, so we use 0 for the sum.
    return sum;
  }, 0);

  return {
    answer: `I found ${claims.length} claim${claims.length === 1 ? "" : "s"} waiting on supplements.`,
    reasoning:
      "Searched the claims list for statuses indicating supplement work is pending or in progress.",
    statistics: {
      "Claims waiting on supplements": claims.length,
      "Total value placeholder": `$${totalValue.toLocaleString()}`,
    },
    supportingRecords: claims.map((claim) => ({
      id: claim.claimNumber,
      type: "claim",
      description: `${claim.customerName || "Unknown customer"} • ${claim.insuranceCompany || "No carrier"}`,
    })),
    recommendedActions: [
      "Review the oldest claims first to avoid carrier delays.",
      "Follow up on claims stuck in 'waiting for carrier'.",
    ],
    confidence: 0.85,
    dataSources: ["claims"],
  };
}

async function fetchAdjustersWithoutResponse(): Promise<QueryResult> {
  const [supplementsResponse, adjustersResponse] = await Promise.all([
    apiFetch("/supplements?limit=100") as Promise<
      PaginatedResponse<Supplement>
    >,
    apiFetch("/adjusters?limit=100") as Promise<PaginatedResponse<Adjuster>>,
  ]);

  const supplements = (supplementsResponse.data || []).filter(
    (supplement) =>
      !supplement.responseDate &&
      (supplement.status === "submitted" ||
        supplement.status === "waiting_for_carrier") &&
      daysSince(
        supplement.submissionDate ||
          supplement.updatedAt ||
          supplement.createdAt,
      ) > 7,
  );

  const adjustersMap = new Map(
    (adjustersResponse.data || []).map((adjuster) => [adjuster.id, adjuster]),
  );

  const grouped = new Map<string, number>();
  for (const supplement of supplements) {
    const key = supplement.adjusterName || "Unassigned";
    grouped.set(key, (grouped.get(key) || 0) + 1);
  }

  if (grouped.size === 0) {
    return {
      answer: "No adjusters are overdue for a response this week.",
      reasoning:
        "Checked supplements submitted more than 7 days ago without a carrier response.",
      statistics: {},
      supportingRecords: [],
      recommendedActions: [],
      confidence: 0.85,
      dataSources: ["supplements", "adjusters"],
    };
  }

  const supportingRecords = Array.from(grouped.entries()).map(
    ([adjusterName, count]) => ({
      id: adjusterName,
      type: "adjuster",
      description: `${count} pending supplement${count === 1 ? "" : "s"} without a response this week`,
    }),
  );

  return {
    answer: `I found ${supplements.length} supplement${supplements.length === 1 ? "" : "s"} submitted more than a week ago without a response.`,
    reasoning:
      "Grouped supplements by adjuster where the response date is missing and the submission date is more than 7 days old.",
    statistics: {
      "Overdue supplements": supplements.length,
      "Adjusters with overdue responses": grouped.size,
    },
    supportingRecords,
    recommendedActions: [
      "Reach out to the adjusters with the most overdue supplements.",
      "Escalate supplements waiting more than 14 days.",
    ],
    confidence: 0.8,
    dataSources: ["supplements", "adjusters"],
  };
}

async function fetchInvoiceStatus(number: string): Promise<QueryResult> {
  const [claimsResponse, supplementsResponse] = await Promise.all([
    apiFetch(
      `/claims?search=${encodeURIComponent(number)}&limit=10`,
    ) as Promise<PaginatedResponse<Claim>>,
    apiFetch(
      `/supplements?search=${encodeURIComponent(number)}&limit=10`,
    ) as Promise<PaginatedResponse<Supplement>>,
  ]);

  const claims = claimsResponse.data || [];
  const supplements = supplementsResponse.data || [];

  if (claims.length === 0 && supplements.length === 0) {
    return {
      answer: `I could not find any claim or supplement matching "${number}".`,
      reasoning:
        "Searched the claims and supplements lists for the provided number.",
      statistics: {},
      supportingRecords: [],
      recommendedActions: [
        "Verify the number is correct and try again.",
        "Use the full claim number if available.",
      ],
      confidence: 0.9,
      dataSources: ["claims", "supplements"],
    };
  }

  const supportingRecords = [
    ...claims.map((claim) => ({
      id: claim.claimNumber,
      type: "claim",
      description: `${claim.customerName || "Unknown customer"} • ${claim.insuranceCompany || "No carrier"} • status: ${claim.status}`,
    })),
    ...supplements.map((supplement) => ({
      id: supplement.supplementNumber,
      type: "supplement",
      description: `${supplement.carrier || "No carrier"} • status: ${supplement.status} • requested: $${(supplement.requestedAmount || 0).toLocaleString()}`,
    })),
  ];

  const blockers: string[] = [];
  for (const claim of claims) {
    if (
      claim.status === "supplement_required" ||
      claim.status === "supplement_submitted"
    ) {
      blockers.push(
        `Claim ${claim.claimNumber} is waiting on supplement work.`,
      );
    }
    if (claim.status === "waiting_for_carrier") {
      blockers.push(
        `Claim ${claim.claimNumber} is waiting for carrier response.`,
      );
    }
  }

  for (const supplement of supplements) {
    if (
      supplement.status === "submitted" ||
      supplement.status === "waiting_for_carrier"
    ) {
      blockers.push(
        `Supplement ${supplement.supplementNumber} is waiting for carrier response.`,
      );
    }
    if (supplement.status === "needs_revision") {
      blockers.push(
        `Supplement ${supplement.supplementNumber} needs revision before it can proceed.`,
      );
    }
  }

  return {
    answer: `I found ${claims.length + supplements.length} record${claims.length + supplements.length === 1 ? "" : "s"} for "${number}".`,
    reasoning:
      "Searched claims and supplements for the number and inspected status fields to identify blockers.",
    statistics: {
      "Matching claims": claims.length,
      "Matching supplements": supplements.length,
      "Blockers identified": blockers.length,
    },
    supportingRecords,
    recommendedActions:
      blockers.length > 0
        ? blockers
        : ["No blockers found. The record is progressing normally."],
    confidence: 0.85,
    dataSources: ["claims", "supplements"],
  };
}

async function fetchTodayActivitySummary(): Promise<QueryResult> {
  const today = new Date();
  const startDate = toIsoDate(today);
  const endDate = toIsoDate(today);

  const response = (await apiFetch(
    `/activity?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}&limit=100`,
  )) as PaginatedResponse<ActivityLog>;

  const logs = response.data || [];

  if (logs.length === 0) {
    return {
      answer: "There has not been any recorded activity today.",
      reasoning:
        "Queried the activity log for the current date and found no events.",
      statistics: {},
      supportingRecords: [],
      recommendedActions: [
        "Record activity as you work so Atlas can build a daily summary.",
      ],
      confidence: 0.9,
      dataSources: ["activity"],
    };
  }

  const byEntity = new Map<string, number>();
  const byAction = new Map<string, number>();
  for (const log of logs) {
    byEntity.set(log.entityType, (byEntity.get(log.entityType) || 0) + 1);
    byAction.set(log.action, (byAction.get(log.action) || 0) + 1);
  }

  const supportingRecords = logs.slice(0, 8).map((log) => ({
    id: log.id,
    type: log.entityType,
    description: `${log.action} ${log.entityName} by ${log.userName}`,
  }));

  const topEntities = Array.from(byEntity.entries())
    .map(([entity, count]) => `${count} ${entity}${count === 1 ? "" : "s"}`)
    .join(", ");

  return {
    answer: `Today there have been ${logs.length} events. The main activity was ${topEntities}.`,
    reasoning:
      "Aggregated activity logs by entity type and action for the current date.",
    statistics: {
      "Total events": logs.length,
      ...Object.fromEntries(byEntity),
      ...Object.fromEntries(byAction),
    },
    supportingRecords,
    recommendedActions: [
      "Review the most recent events for anything that needs follow-up.",
    ],
    confidence: 0.9,
    dataSources: ["activity"],
  };
}

export async function routeQuestion(question: string): Promise<QueryResult> {
  const q = question.toLowerCase();

  if (
    (q.includes("claim") && q.includes("supplement")) ||
    q.includes("waiting on supplement") ||
    q.includes("supplement pending")
  ) {
    return fetchClaimsWaitingOnSupplements();
  }

  if (
    q.includes("adjuster") &&
    (q.includes("respond") || q.includes("response"))
  ) {
    return fetchAdjustersWithoutResponse();
  }

  if (
    (q.includes("invoice") || q.includes("block") || q.includes("blocking")) &&
    q.includes("what")
  ) {
    const number = extractNumber(question);
    if (number) {
      return fetchInvoiceStatus(number);
    }
  }

  if (
    q.includes("summarize") &&
    (q.includes("activity") || q.includes("today"))
  ) {
    return fetchTodayActivitySummary();
  }

  // Fallback to the general intelligence query endpoint for everything else.
  const response = await apiFetch("/intelligence/query", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  return response as QueryResult;
}

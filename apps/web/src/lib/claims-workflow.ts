// apps/web/src/lib/claims-workflow.ts
export type ClaimStatus =
  | "new"
  | "inspection_scheduled"
  | "inspection_complete"
  | "estimate_submitted"
  | "supplement_required"
  | "supplement_submitted"
  | "waiting_for_carrier"
  | "approved"
  | "denied"
  | "work_in_progress"
  | "completed"
  | "closed";

export const STATUS_LABELS: Record<ClaimStatus, string> = {
  new: "New",
  inspection_scheduled: "Inspection Scheduled",
  inspection_complete: "Inspection Complete",
  estimate_submitted: "Estimate Submitted",
  supplement_required: "Supplement Required",
  supplement_submitted: "Supplement Submitted",
  waiting_for_carrier: "Waiting for Carrier",
  approved: "Approved",
  denied: "Denied",
  work_in_progress: "Work In Progress",
  completed: "Completed",
  closed: "Closed",
};

export const STATUS_COLORS: Record<ClaimStatus, string> = {
  new: "bg-info/10 text-info",
  inspection_scheduled: "bg-warning/10 text-warning",
  inspection_complete: "bg-success/10 text-success",
  estimate_submitted: "bg-accent/10 text-accent",
  supplement_required: "bg-warning/10 text-warning",
  supplement_submitted: "bg-accent/10 text-accent",
  waiting_for_carrier: "bg-accent/10 text-accent",
  approved: "bg-success/10 text-success",
  denied: "bg-red-100 text-destructive-foreground",
  work_in_progress: "bg-primary/10 text-primary",
  completed: "bg-success/10 text-success",
  closed: "bg-muted text-foreground",
};

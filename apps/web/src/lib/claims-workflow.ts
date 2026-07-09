// apps/web/src/lib/claims-workflow.ts
export type ClaimStatus =
  | 'new'
  | 'inspection_scheduled'
  | 'inspection_complete'
  | 'estimate_submitted'
  | 'supplement_required'
  | 'supplement_submitted'
  | 'waiting_for_carrier'
  | 'approved'
  | 'denied'
  | 'work_in_progress'
  | 'completed'
  | 'closed';

export const STATUS_LABELS: Record<ClaimStatus, string> = {
  new: 'New',
  inspection_scheduled: 'Inspection Scheduled',
  inspection_complete: 'Inspection Complete',
  estimate_submitted: 'Estimate Submitted',
  supplement_required: 'Supplement Required',
  supplement_submitted: 'Supplement Submitted',
  waiting_for_carrier: 'Waiting for Carrier',
  approved: 'Approved',
  denied: 'Denied',
  work_in_progress: 'Work In Progress',
  completed: 'Completed',
  closed: 'Closed',
};

export const STATUS_COLORS: Record<ClaimStatus, string> = {
  new: 'bg-blue-100 text-blue-800',
  inspection_scheduled: 'bg-yellow-100 text-yellow-800',
  inspection_complete: 'bg-green-100 text-green-800',
  estimate_submitted: 'bg-purple-100 text-purple-800',
  supplement_required: 'bg-orange-100 text-orange-800',
  supplement_submitted: 'bg-indigo-100 text-indigo-800',
  waiting_for_carrier: 'bg-pink-100 text-pink-800',
  approved: 'bg-emerald-100 text-emerald-800',
  denied: 'bg-red-100 text-red-800',
  work_in_progress: 'bg-cyan-100 text-cyan-800',
  completed: 'bg-teal-100 text-teal-800',
  closed: 'bg-gray-100 text-gray-800',
};

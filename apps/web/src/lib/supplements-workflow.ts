// apps/web/src/lib/supplements-workflow.ts
export type SupplementStatus =
  | 'draft'
  | 'ready_for_review'
  | 'submitted'
  | 'waiting_for_carrier'
  | 'needs_revision'
  | 'partially_approved'
  | 'approved'
  | 'denied'
  | 'closed';

export interface LineItem {
  id?: string;
  description: string;
  category: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
  depreciation: number;
  tax: number;
  notes?: string;
}

export const STATUS_LABELS: Record<SupplementStatus, string> = {
  draft: 'Draft',
  ready_for_review: 'Ready for Review',
  submitted: 'Submitted',
  waiting_for_carrier: 'Waiting for Carrier',
  needs_revision: 'Needs Revision',
  partially_approved: 'Partially Approved',
  approved: 'Approved',
  denied: 'Denied',
  closed: 'Closed',
};

export const STATUS_COLORS: Record<SupplementStatus, string> = {
  draft: 'bg-gray-100 text-gray-800',
  ready_for_review: 'bg-blue-100 text-blue-800',
  submitted: 'bg-yellow-100 text-yellow-800',
  waiting_for_carrier: 'bg-purple-100 text-purple-800',
  needs_revision: 'bg-orange-100 text-orange-800',
  partially_approved: 'bg-cyan-100 text-cyan-800',
  approved: 'bg-green-100 text-green-800',
  denied: 'bg-red-100 text-red-800',
  closed: 'bg-gray-100 text-gray-800',
};

export const LINE_ITEM_CATEGORIES = [
  'Roofing',
  'Siding',
  'Windows',
  'Doors',
  'Flooring',
  'Paint',
  'Plumbing',
  'Electrical',
  'HVAC',
  'Insulation',
  'Drywall',
  'Carpentry',
  'Landscaping',
  'Debris Removal',
  'Other',
];

export const LINE_ITEM_UNITS = [
  'Each',
  'Square Foot',
  'Linear Foot',
  'Square Yard',
  'Cubic Yard',
  'Hour',
  'Day',
  'Lot',
  'Pound',
  'Gallon',
];

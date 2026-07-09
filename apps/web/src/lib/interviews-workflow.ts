// apps/web/src/lib/interviews-workflow.ts
export type QuestionType =
  | 'short_text'
  | 'long_text'
  | 'number'
  | 'currency'
  | 'date'
  | 'time'
  | 'yes_no'
  | 'multiple_choice'
  | 'multi_select'
  | 'file_upload'
  | 'photo_upload';

export type InterviewStatus = 'draft' | 'in_progress' | 'completed' | 'archived';

export interface Question {
  id: string;
  type: QuestionType;
  label: string;
  description?: string;
  required: boolean;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    customValidation?: string;
  };
  options?: string[];
  conditional?: {
    dependsOn: string;
    operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
    value: any;
  };
  metadata?: Record<string, any>;
}

export interface Section {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  order: number;
}

export interface InterviewTemplate {
  templateId: string;
  name: string;
  description?: string;
  version: string;
  sections: Section[];
  settings: {
    autosave: boolean;
    autosaveInterval: number;
    allowResume: boolean;
    allowEditAfterComplete: boolean;
    showProgress: boolean;
    showSectionNavigation: boolean;
  };
}

export const STATUS_LABELS: Record<InterviewStatus, string> = {
  draft: 'Draft',
  in_progress: 'In Progress',
  completed: 'Completed',
  archived: 'Archived',
};

export const STATUS_COLORS: Record<InterviewStatus, string> = {
  draft: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  archived: 'bg-gray-100 text-gray-600',
};

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  short_text: 'Short Text',
  long_text: 'Long Text',
  number: 'Number',
  currency: 'Currency',
  date: 'Date',
  time: 'Time',
  yes_no: 'Yes/No',
  multiple_choice: 'Multiple Choice',
  multi_select: 'Multi-Select',
  file_upload: 'File Upload',
  photo_upload: 'Photo Upload',
};

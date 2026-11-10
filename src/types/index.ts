export type SubjectCode = 
  | 'COA' 
  | 'MATHS_4' 
  | 'CYBER_SECURITY' 
  | 'DSTL' 
  | 'DSA' 
  | 'HUMAN_VALUES'
  | 'MOCK_EXAM';

export interface SubjectMeta {
  code: SubjectCode;
  name: string;
  fullName: string;
  shortName: string;
  color: {
    bg: string;
    border: string;
    text: string;
    glow: string;
    badge: string;
    gradient: string;
  };
}

export type PlanPhase = 'syllabus' | 'revision_round_1' | 'revision_final';

export interface StudyTarget {
  id: string; // e.g. "2026-11-09-target-1"
  dateStr: string; // "YYYY-MM-DD" e.g. "2026-11-09"
  subject: string;
  subjectCode: SubjectCode;
  unit: string; // e.g. "Unit 1", "Units 1 and 2", "PYQs"
  title: string;
  details?: string;
  isRevision?: boolean;
}

export interface DSAPracticeBlock {
  id: string;
  startDate: string;
  endDate: string;
  dateRangeLabel: string;
  title: string;
  subtopics: {
    id: string;
    name: string;
  }[];
  description: string;
}

export interface DaySchedule {
  dateStr: string;
  dayNumber: number; // 1 to 28
  dayName: string; // Monday, Tuesday, ...
  formattedDate: string; // 9 Nov 2026
  phase: PlanPhase;
  phaseLabel: string;
  targets: StudyTarget[];
  dsaBlockId: string;
}

export interface DayStatus {
  isPast: boolean;
  isToday: boolean;
  isFuture: boolean;
  isAllCompleted: boolean;
  completionRate: number; // 0 to 100
  totalTargets: number;
  completedTargets: number;
}

export type FilterStatus = 'all' | 'pending' | 'completed';
export type ViewTab = 'dashboard' | 'calendar' | 'daily_targets' | 'dsa_tracker' | 'revision_plan' | 'notes';

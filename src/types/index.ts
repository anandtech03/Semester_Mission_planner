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

export type PlanPhase = 'syllabus' | 'revision';

export interface StudyTarget {
  id: string;
  dateStr: string;
  subject: string;
  subjectCode: SubjectCode;
  unit: string;
  title: string;
  details?: string;
  isRevision?: boolean;
}

export interface DSALogEntry {
  id: string;
  dateStr: string;
  topic: string;
  problemsCount?: number;
  platform?: string;
  notes?: string;
  isCompleted: boolean;
  createdAt: string;
}

export interface DaySchedule {
  dateStr: string;
  dayNumber: number; // 1 to 21
  dayName: string; // Tuesday, Wednesday, ...
  formattedDate: string; // 10 Nov 2026
  phase: PlanPhase;
  phaseLabel: string;
  targets: StudyTarget[];
}

export interface DayStatus {
  isPast: boolean;
  isToday: boolean;
  isFuture: boolean;
  isAllCompleted: boolean;
  completionRate: number;
  totalTargets: number;
  completedTargets: number;
}

export type FilterStatus = 'all' | 'pending' | 'completed';
export type ViewTab = 'dashboard' | 'calendar' | 'daily_targets' | 'dsa_tracker' | 'revision_plan' | 'notes';

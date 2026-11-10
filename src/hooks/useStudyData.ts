import { useState, useEffect, useMemo, useCallback } from 'react';
import { SCHEDULE_DAYS, DAILY_CHECKLIST_TEMPLATE } from '../data/studyPlanData';
import { getISTTodayString, calculateDaysRemaining, calculateDaysCompleted } from '../utils/dateUtils';
import { FilterStatus, DaySchedule, DSALogEntry } from '../types';

const STORAGE_KEYS = {
  COMPLETED_TARGETS: 'december_exam_mission_completed_targets_v2',
  USER_DSA_LOGS: 'december_exam_mission_user_dsa_logs_v2',
  NOTES: 'december_exam_mission_notes_v2',
  CHECKLIST: 'december_exam_mission_checklist_v2',
  SIMULATED_DATE: 'december_exam_mission_simulated_date_v2',
  ACTIVE_FILTER: 'december_exam_mission_filter_v2',
};

// Initial welcome sample log if user is starting fresh
const DEFAULT_INITIAL_DSA_LOGS: DSALogEntry[] = [
  {
    id: 'dsa-sample-1',
    dateStr: '2026-11-10',
    topic: 'Bubble Sort & Selection Sort implementation',
    problemsCount: 2,
    platform: 'LeetCode / GFG',
    notes: 'Practiced optimized Bubble sort with swapped flag and selection sort min-index in-place swapping.',
    isCompleted: true,
    createdAt: new Date().toISOString(),
  },
];

export function useStudyData() {
  // Real system date in IST
  const [systemTodayStr, setSystemTodayStr] = useState<string>(() => getISTTodayString());
  
  // Simulated date for testing if user toggles date machine
  const [simulatedDateStr, setSimulatedDateStrState] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.SIMULATED_DATE) || null;
    } catch {
      return null;
    }
  });

  // Effective today string (Asia/Kolkata)
  const todayStr = simulatedDateStr || systemTodayStr;

  // Selected date on calendar/focus (defaults to today)
  const [selectedDateStr, setSelectedDateStr] = useState<string>(todayStr);

  // Filter for tasks: 'all' | 'pending' | 'completed'
  const [filter, setFilterState] = useState<FilterStatus>(() => {
    try {
      return (localStorage.getItem(STORAGE_KEYS.ACTIVE_FILTER) as FilterStatus) || 'all';
    } catch {
      return 'all';
    }
  });

  // Completed Target IDs
  const [completedTargetIds, setCompletedTargetIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMPLETED_TARGETS);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error loading completed targets', e);
      return [];
    }
  });

  // User's Personal Daily DSA Logs (Self-entered)
  const [dsaLogs, setDsaLogs] = useState<DSALogEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_DSA_LOGS);
      return saved ? JSON.parse(saved) : DEFAULT_INITIAL_DSA_LOGS;
    } catch (e) {
      console.error('Error loading DSA logs', e);
      return DEFAULT_INITIAL_DSA_LOGS;
    }
  });

  // Notes per date: Record<dateStr, string>
  const [dailyNotes, setDailyNotes] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTES);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.error('Error loading notes', e);
      return {};
    }
  });

  // Daily checklist per date: Record<dateStr, Record<checklistId, boolean>>
  const [dailyChecklist, setDailyChecklist] = useState<Record<string, Record<string, boolean>>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CHECKLIST);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.error('Error loading checklist', e);
      return {};
    }
  });

  // Keep system date synced with IST clock
  useEffect(() => {
    const updateTime = () => {
      const current = getISTTodayString();
      if (current !== systemTodayStr) {
        setSystemTodayStr(current);
      }
    };
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, [systemTodayStr]);

  // Sync selectedDate with today initially
  useEffect(() => {
    if (!selectedDateStr) {
      setSelectedDateStr(todayStr);
    }
  }, [todayStr, selectedDateStr]);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COMPLETED_TARGETS, JSON.stringify(completedTargetIds));
    } catch (e) {
      console.error(e);
    }
  }, [completedTargetIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_DSA_LOGS, JSON.stringify(dsaLogs));
    } catch (e) {
      console.error(e);
    }
  }, [dsaLogs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(dailyNotes));
    } catch (e) {
      console.error(e);
    }
  }, [dailyNotes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CHECKLIST, JSON.stringify(dailyChecklist));
    } catch (e) {
      console.error(e);
    }
  }, [dailyChecklist]);

  const setFilter = useCallback((newFilter: FilterStatus) => {
    setFilterState(newFilter);
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_FILTER, newFilter);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const setSimulatedDateStr = useCallback((dateStr: string | null) => {
    setSimulatedDateStrState(dateStr);
    if (dateStr) {
      setSelectedDateStr(dateStr);
      try {
        localStorage.setItem(STORAGE_KEYS.SIMULATED_DATE, dateStr);
      } catch (e) {
        console.error(e);
      }
    } else {
      setSelectedDateStr(systemTodayStr);
      try {
        localStorage.removeItem(STORAGE_KEYS.SIMULATED_DATE);
      } catch (e) {
        console.error(e);
      }
    }
  }, [systemTodayStr]);

  // Target Actions
  const toggleTarget = useCallback((targetId: string) => {
    setCompletedTargetIds(prev => 
      prev.includes(targetId) ? prev.filter(id => id !== targetId) : [...prev, targetId]
    );
  }, []);

  // Personal DSA Log Actions (User-defined)
  const addDSALog = useCallback((logData: Omit<DSALogEntry, 'id' | 'createdAt'>) => {
    const newEntry: DSALogEntry = {
      ...logData,
      id: `dsa-log-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setDsaLogs(prev => [newEntry, ...prev]);
  }, []);

  const updateDSALog = useCallback((id: string, updated: Partial<DSALogEntry>) => {
    setDsaLogs(prev => prev.map(item => item.id === id ? { ...item, ...updated } : item));
  }, []);

  const deleteDSALog = useCallback((id: string) => {
    setDsaLogs(prev => prev.filter(item => item.id !== id));
  }, []);

  const toggleDSALog = useCallback((id: string) => {
    setDsaLogs(prev => prev.map(item => item.id === id ? { ...item, isCompleted: !item.isCompleted } : item));
  }, []);

  const toggleChecklistItem = useCallback((dateStr: string, checkId: string) => {
    setDailyChecklist(prev => {
      const dayChecks = prev[dateStr] || {};
      const nextStatus = !dayChecks[checkId];
      return {
        ...prev,
        [dateStr]: {
          ...dayChecks,
          [checkId]: nextStatus,
        },
      };
    });
  }, []);

  const saveDailyNote = useCallback((dateStr: string, note: string) => {
    setDailyNotes(prev => ({
      ...prev,
      [dateStr]: note,
    }));
  }, []);

  const markAllTodayComplete = useCallback((dateStr: string) => {
    const day = SCHEDULE_DAYS.find(d => d.dateStr === dateStr);
    if (!day) return;

    const dayTargetIds = day.targets.map(t => t.id);
    setCompletedTargetIds(prev => {
      const set = new Set([...prev, ...dayTargetIds]);
      return Array.from(set);
    });

    setDailyChecklist(prev => {
      const current = prev[dateStr] || {};
      const updated = { ...current };
      DAILY_CHECKLIST_TEMPLATE.forEach(item => {
        updated[item.id] = true;
      });
      return {
        ...prev,
        [dateStr]: updated,
      };
    });
  }, []);

  const unmarkAllToday = useCallback((dateStr: string) => {
    const day = SCHEDULE_DAYS.find(d => d.dateStr === dateStr);
    if (!day) return;
    const dayTargetIds = new Set(day.targets.map(t => t.id));
    setCompletedTargetIds(prev => prev.filter(id => !dayTargetIds.has(id)));
  }, []);

  const resetAllData = useCallback(() => {
    setCompletedTargetIds([]);
    setDsaLogs([]);
    setDailyNotes({});
    setDailyChecklist({});
    setSimulatedDateStrState(null);
    try {
      localStorage.removeItem(STORAGE_KEYS.COMPLETED_TARGETS);
      localStorage.removeItem(STORAGE_KEYS.USER_DSA_LOGS);
      localStorage.removeItem(STORAGE_KEYS.NOTES);
      localStorage.removeItem(STORAGE_KEYS.CHECKLIST);
      localStorage.removeItem(STORAGE_KEYS.SIMULATED_DATE);
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Compute all targets flat list
  const allTargets = useMemo(() => {
    return SCHEDULE_DAYS.flatMap(day => day.targets);
  }, []);

  // Total targets counts (30 syllabus + 7 revision = 37 targets total)
  const totalSyllabusTargets = allTargets.length;
  const completedSyllabusTargets = useMemo(() => {
    const targetIdSet = new Set(allTargets.map(t => t.id));
    return completedTargetIds.filter(id => targetIdSet.has(id)).length;
  }, [allTargets, completedTargetIds]);

  const syllabusProgressPercentage = totalSyllabusTargets > 0 
    ? Math.round((completedSyllabusTargets / totalSyllabusTargets) * 100) 
    : 0;

  // Personal User DSA stats
  const totalDSALogs = dsaLogs.length;
  const completedDSALogs = useMemo(() => {
    return dsaLogs.filter(item => item.isCompleted).length;
  }, [dsaLogs]);

  const totalDSAProblemsSolved = useMemo(() => {
    return dsaLogs.reduce((acc, curr) => acc + (curr.isCompleted ? (curr.problemsCount || 1) : 0), 0);
  }, [dsaLogs]);

  const dsaProgressPercentage = totalDSALogs > 0 
    ? Math.round((completedDSALogs / totalDSALogs) * 100) 
    : 0;

  // Timeline (10 Nov to 30 Nov = 21 Days)
  const totalDays = SCHEDULE_DAYS.length; // 21
  const daysCompleted = calculateDaysCompleted(todayStr, '2026-11-10');
  const daysRemaining = calculateDaysRemaining(todayStr, '2026-11-30');

  const overallProgressPercentage = Math.round(
    (syllabusProgressPercentage * 0.75) + ((dsaLogs.length > 0 ? dsaProgressPercentage : 0) * 0.25)
  );

  // Today's schedule object
  const todaySchedule: DaySchedule = useMemo(() => {
    return SCHEDULE_DAYS.find(day => day.dateStr === todayStr) || SCHEDULE_DAYS[0];
  }, [todayStr]);

  // Selected date schedule object
  const selectedSchedule: DaySchedule = useMemo(() => {
    return SCHEDULE_DAYS.find(day => day.dateStr === selectedDateStr) || todaySchedule;
  }, [selectedDateStr, todaySchedule]);

  const todayTargets = todaySchedule?.targets || [];
  const todayCompletedCount = todayTargets.filter(t => completedTargetIds.includes(t.id)).length;
  const isTodayAllCompleted = todayTargets.length > 0 && todayCompletedCount === todayTargets.length;
  const todayCompletionRate = todayTargets.length > 0 
    ? Math.round((todayCompletedCount / todayTargets.length) * 100) 
    : 0;

  // Today's user DSA logs
  const todayDSALogs = useMemo(() => {
    return dsaLogs.filter(item => item.dateStr === todayStr);
  }, [dsaLogs, todayStr]);

  return {
    todayStr,
    systemTodayStr,
    simulatedDateStr,
    selectedDateStr,
    filter,
    completedTargetIds,
    dsaLogs,
    todayDSALogs,
    dailyNotes,
    dailyChecklist,
    allTargets,
    todaySchedule,
    selectedSchedule,
    stats: {
      totalDays,
      daysCompleted,
      daysRemaining,
      totalSyllabusTargets,
      completedSyllabusTargets,
      syllabusProgressPercentage,
      totalDSALogs,
      completedDSALogs,
      totalDSAProblemsSolved,
      dsaProgressPercentage,
      overallProgressPercentage,
      todayCompletedCount,
      todayTotalTargets: todayTargets.length,
      todayCompletionRate,
      isTodayAllCompleted,
    },
    // Actions
    setSelectedDateStr,
    setSimulatedDateStr,
    setFilter,
    toggleTarget,
    addDSALog,
    updateDSALog,
    deleteDSALog,
    toggleDSALog,
    toggleChecklistItem,
    saveDailyNote,
    markAllTodayComplete,
    unmarkAllToday,
    resetAllData,
  };
}

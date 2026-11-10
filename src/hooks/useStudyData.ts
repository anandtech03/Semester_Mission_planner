import { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  SHIFTED_SCHEDULE_DAYS, 
  ORIGINAL_SCHEDULE_DAYS, 
  SHIFTED_DSA_BLOCKS, 
  DAILY_CHECKLIST_TEMPLATE,
  getScheduleDays,
  getDSABlocks
} from '../data/studyPlanData';
import { getISTTodayString, calculateDaysRemaining, calculateDaysCompleted } from '../utils/dateUtils';
import { FilterStatus, DaySchedule, ScheduleMode } from '../types';

const STORAGE_KEYS = {
  COMPLETED_TARGETS: 'december_exam_mission_completed_targets_v1',
  COMPLETED_DSA: 'december_exam_mission_completed_dsa_v1',
  NOTES: 'december_exam_mission_notes_v1',
  CHECKLIST: 'december_exam_mission_checklist_v1',
  SIMULATED_DATE: 'december_exam_mission_simulated_date_v1',
  ACTIVE_FILTER: 'december_exam_mission_filter_v1',
  SCHEDULE_MODE: 'december_exam_mission_schedule_mode_v1',
};

export function useStudyData() {
  // Real system date in IST
  const [systemTodayStr, setSystemTodayStr] = useState<string>(() => getISTTodayString());
  
  // Schedule Mode: 'shifted' (Starts 10 Nov, default) or 'original' (9 Nov)
  const [scheduleMode, setScheduleModeState] = useState<ScheduleMode>(() => {
    try {
      return (localStorage.getItem(STORAGE_KEYS.SCHEDULE_MODE) as ScheduleMode) || 'shifted';
    } catch {
      return 'shifted';
    }
  });

  // Active Schedule dataset
  const activeScheduleDays = useMemo(() => {
    return getScheduleDays(scheduleMode);
  }, [scheduleMode]);

  const activeDSABlocks = useMemo(() => {
    return getDSABlocks(scheduleMode);
  }, [scheduleMode]);

  // Simulated date for testing if user toggles date machine
  const [simulatedDateStr, setSimulatedDateStrState] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.SIMULATED_DATE) || null;
    } catch {
      return null;
    }
  });

  // Effective today string
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

  // Completed Independent DSA Topic IDs
  const [completedDSATopicIds, setCompletedDSATopicIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMPLETED_DSA);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error loading completed DSA topics', e);
      return [];
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

  // Sync selectedDate with today initially if today changes
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
      localStorage.setItem(STORAGE_KEYS.COMPLETED_DSA, JSON.stringify(completedDSATopicIds));
    } catch (e) {
      console.error(e);
    }
  }, [completedDSATopicIds]);

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

  const setScheduleMode = useCallback((mode: ScheduleMode) => {
    setScheduleModeState(mode);
    try {
      localStorage.setItem(STORAGE_KEYS.SCHEDULE_MODE, mode);
    } catch (e) {
      console.error(e);
    }
  }, []);

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

  // Actions
  const toggleTarget = useCallback((targetId: string) => {
    setCompletedTargetIds(prev => 
      prev.includes(targetId) ? prev.filter(id => id !== targetId) : [...prev, targetId]
    );
  }, []);

  const toggleDSATopic = useCallback((topicId: string) => {
    setCompletedDSATopicIds(prev => 
      prev.includes(topicId) ? prev.filter(id => id !== topicId) : [...prev, topicId]
    );
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
    const day = activeScheduleDays.find(d => d.dateStr === dateStr);
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
  }, [activeScheduleDays]);

  const unmarkAllToday = useCallback((dateStr: string) => {
    const day = activeScheduleDays.find(d => d.dateStr === dateStr);
    if (!day) return;
    const dayTargetIds = new Set(day.targets.map(t => t.id));
    setCompletedTargetIds(prev => prev.filter(id => !dayTargetIds.has(id)));
  }, [activeScheduleDays]);

  const resetAllData = useCallback(() => {
    setCompletedTargetIds([]);
    setCompletedDSATopicIds([]);
    setDailyNotes({});
    setDailyChecklist({});
    setSimulatedDateStrState(null);
    try {
      localStorage.removeItem(STORAGE_KEYS.COMPLETED_TARGETS);
      localStorage.removeItem(STORAGE_KEYS.COMPLETED_DSA);
      localStorage.removeItem(STORAGE_KEYS.NOTES);
      localStorage.removeItem(STORAGE_KEYS.CHECKLIST);
      localStorage.removeItem(STORAGE_KEYS.SIMULATED_DATE);
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Compute all targets flat list
  const allTargets = useMemo(() => {
    return activeScheduleDays.flatMap(day => day.targets);
  }, [activeScheduleDays]);

  // Total targets counts
  const totalSyllabusTargets = allTargets.length;
  const completedSyllabusTargets = useMemo(() => {
    const targetIdSet = new Set(allTargets.map(t => t.id));
    return completedTargetIds.filter(id => targetIdSet.has(id)).length;
  }, [allTargets, completedTargetIds]);

  const syllabusProgressPercentage = totalSyllabusTargets > 0 
    ? Math.round((completedSyllabusTargets / totalSyllabusTargets) * 100) 
    : 0;

  // DSA counts
  const allDSASubtopics = useMemo(() => {
    return activeDSABlocks.flatMap(b => b.subtopics);
  }, [activeDSABlocks]);
  const totalDSATopics = allDSASubtopics.length;
  const completedDSATopicsCount = useMemo(() => {
    const topicIdSet = new Set(allDSASubtopics.map(t => t.id));
    return completedDSATopicIds.filter(id => topicIdSet.has(id)).length;
  }, [allDSASubtopics, completedDSATopicIds]);

  const dsaProgressPercentage = totalDSATopics > 0 
    ? Math.round((completedDSATopicsCount / totalDSATopics) * 100) 
    : 0;

  // Schedule timeline (27 days in shifted schedule, Day 1 = 10 Nov)
  const validDays = activeScheduleDays.filter(d => d.dayNumber >= 1);
  const totalDays = validDays.length;
  const startDateStr = validDays[0]?.dateStr || '2026-11-10';
  const daysCompleted = calculateDaysCompleted(todayStr, startDateStr);
  const daysRemaining = calculateDaysRemaining(todayStr);

  const overallProgressPercentage = Math.round(
    (syllabusProgressPercentage * 0.7) + (dsaProgressPercentage * 0.3)
  );

  // Today's schedule object
  const todaySchedule: DaySchedule = useMemo(() => {
    const found = activeScheduleDays.find(day => day.dateStr === todayStr);
    if (found && found.targets.length > 0) return found;
    // Default to first active day with targets (10 Nov)
    return validDays[0] || activeScheduleDays[0];
  }, [activeScheduleDays, todayStr, validDays]);

  // Selected date schedule object
  const selectedSchedule: DaySchedule = useMemo(() => {
    return activeScheduleDays.find(day => day.dateStr === selectedDateStr) || todaySchedule;
  }, [activeScheduleDays, selectedDateStr, todaySchedule]);

  const todayTargets = todaySchedule?.targets || [];
  const todayCompletedCount = todayTargets.filter(t => completedTargetIds.includes(t.id)).length;
  const isTodayAllCompleted = todayTargets.length > 0 && todayCompletedCount === todayTargets.length;
  const todayCompletionRate = todayTargets.length > 0 
    ? Math.round((todayCompletedCount / todayTargets.length) * 100) 
    : 0;

  const currentDSABlock = useMemo(() => {
    return activeDSABlocks.find(block => todayStr >= block.startDate && todayStr <= block.endDate)
      || activeDSABlocks[0];
  }, [activeDSABlocks, todayStr]);

  return {
    todayStr,
    systemTodayStr,
    simulatedDateStr,
    selectedDateStr,
    scheduleMode,
    filter,
    completedTargetIds,
    completedDSATopicIds,
    dailyNotes,
    dailyChecklist,
    allTargets,
    activeScheduleDays,
    todaySchedule,
    selectedSchedule,
    currentDSABlock,
    stats: {
      totalDays,
      daysCompleted,
      daysRemaining,
      totalSyllabusTargets,
      completedSyllabusTargets,
      syllabusProgressPercentage,
      totalDSATopics,
      completedDSATopicsCount,
      dsaProgressPercentage,
      overallProgressPercentage,
      todayCompletedCount,
      todayTotalTargets: todayTargets.length,
      todayCompletionRate,
      isTodayAllCompleted,
    },
    // Actions
    setScheduleMode,
    setSelectedDateStr,
    setSimulatedDateStr,
    setFilter,
    toggleTarget,
    toggleDSATopic,
    toggleChecklistItem,
    saveDailyNote,
    markAllTodayComplete,
    unmarkAllToday,
    resetAllData,
  };
}

import { useState, useEffect, useMemo, useCallback } from 'react';
import { SCHEDULE_DAYS, DSA_PRACTICE_BLOCKS, DAILY_CHECKLIST_TEMPLATE } from '../data/studyPlanData';
import { getISTTodayString, isDateInPast, isDateCurrent, isDateInFuture, calculateDaysRemaining, calculateDaysCompleted } from '../utils/dateUtils';
import { FilterStatus, DaySchedule } from '../types';

const STORAGE_KEYS = {
  COMPLETED_TARGETS: 'december_exam_mission_completed_targets_v1',
  COMPLETED_DSA: 'december_exam_mission_completed_dsa_v1',
  NOTES: 'december_exam_mission_notes_v1',
  CHECKLIST: 'december_exam_mission_checklist_v1',
  SIMULATED_DATE: 'december_exam_mission_simulated_date_v1',
  ACTIVE_FILTER: 'december_exam_mission_filter_v1',
};

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
    const interval = setInterval(updateTime, 10000); // Check every 10s
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
    const day = SCHEDULE_DAYS.find(d => d.dateStr === dateStr);
    if (!day) return;

    // Add all targets for this day
    const dayTargetIds = day.targets.map(t => t.id);
    setCompletedTargetIds(prev => {
      const set = new Set([...prev, ...dayTargetIds]);
      return Array.from(set);
    });

    // Mark daily checklist items complete
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
    return SCHEDULE_DAYS.flatMap(day => day.targets);
  }, []);

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
    return DSA_PRACTICE_BLOCKS.flatMap(b => b.subtopics);
  }, []);
  const totalDSATopics = allDSASubtopics.length;
  const completedDSATopicsCount = useMemo(() => {
    const topicIdSet = new Set(allDSASubtopics.map(t => t.id));
    return completedDSATopicIds.filter(id => topicIdSet.has(id)).length;
  }, [allDSASubtopics, completedDSATopicIds]);

  const dsaProgressPercentage = totalDSATopics > 0 
    ? Math.round((completedDSATopicsCount / totalDSATopics) * 100) 
    : 0;

  // Calendar Days calculation
  const totalDays = SCHEDULE_DAYS.length; // 28
  const daysCompleted = calculateDaysCompleted(todayStr);
  const daysRemaining = calculateDaysRemaining(todayStr);

  // Overall Combined Progress (weighted 70% semester, 30% DSA)
  const overallProgressPercentage = Math.round(
    (syllabusProgressPercentage * 0.7) + (dsaProgressPercentage * 0.3)
  );

  // Today's schedule object
  const todaySchedule: DaySchedule | undefined = useMemo(() => {
    return SCHEDULE_DAYS.find(day => day.dateStr === todayStr) || SCHEDULE_DAYS[0];
  }, [todayStr]);

  // Selected date schedule object
  const selectedSchedule: DaySchedule = useMemo(() => {
    return SCHEDULE_DAYS.find(day => day.dateStr === selectedDateStr) || todaySchedule;
  }, [selectedDateStr, todaySchedule]);

  // Today targets completion rate
  const todayTargets = todaySchedule?.targets || [];
  const todayCompletedCount = todayTargets.filter(t => completedTargetIds.includes(t.id)).length;
  const isTodayAllCompleted = todayTargets.length > 0 && todayCompletedCount === todayTargets.length;
  const todayCompletionRate = todayTargets.length > 0 
    ? Math.round((todayCompletedCount / todayTargets.length) * 100) 
    : 0;

  // Current active DSA block for today
  const currentDSABlock = useMemo(() => {
    return DSA_PRACTICE_BLOCKS.find(block => todayStr >= block.startDate && todayStr <= block.endDate)
      || DSA_PRACTICE_BLOCKS[0];
  }, [todayStr]);

  return {
    todayStr,
    systemTodayStr,
    simulatedDateStr,
    selectedDateStr,
    filter,
    completedTargetIds,
    completedDSATopicIds,
    dailyNotes,
    dailyChecklist,
    allTargets,
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

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Search, 
  BookOpen, 
  Check
} from 'lucide-react';
import { FilterStatus } from '../types';
import { SCHEDULE_DAYS, SUBJECT_METAS } from '../data/studyPlanData';
import { formatISTDate, isDateCurrent, isDateInPast } from '../utils/dateUtils';

interface DailyTargetsListProps {
  todayStr: string;
  selectedDateStr: string;
  onSelectDate: (dateStr: string) => void;
  completedTargetIds: string[];
  onToggleTarget: (targetId: string) => void;
  filter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
}

export const DailyTargetsList: React.FC<DailyTargetsListProps> = ({
  todayStr,
  selectedDateStr,
  onSelectDate,
  completedTargetIds,
  onToggleTarget,
  filter,
  onFilterChange,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewScope, setViewScope] = useState<'selected_day' | 'all_days'>('selected_day');

  const activeDays = viewScope === 'selected_day'
    ? SCHEDULE_DAYS.filter(d => d.dateStr === selectedDateStr)
    : SCHEDULE_DAYS;

  const subjectsList = [
    { code: 'ALL', label: 'All Subjects' },
    { code: 'COA', label: 'COA' },
    { code: 'MATHS_4', label: 'Maths-4' },
    { code: 'CYBER_SECURITY', label: 'Cyber Security' },
    { code: 'DSTL', label: 'DSTL' },
    { code: 'DSA', label: 'DSA' },
    { code: 'HUMAN_VALUES', label: 'Human Values' },
  ];

  return (
    <section className="w-full glass-panel p-5 sm:p-6 rounded-2xl border border-slate-800/80 shadow-xl">
      
      {/* Top Header & Scope Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/60">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Study Targets & Checklists
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Semester units extracted from timetable with completion tracking
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setViewScope('selected_day')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewScope === 'selected_day'
                ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Inspected Day ({selectedDateStr.split('-')[2]} {selectedDateStr.split('-')[1] === '11' ? 'Nov' : 'Dec'})
          </button>
          <button
            onClick={() => setViewScope('all_days')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewScope === 'all_days'
                ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All 28 Days
          </button>
        </div>
      </div>

      {/* Filter Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 my-4">
        <div className="flex items-center gap-1 bg-slate-900/50 p-1 rounded-xl border border-slate-800/80">
          <button
            onClick={() => onFilterChange('all')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              filter === 'all'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Tasks
          </button>
          <button
            onClick={() => onFilterChange('pending')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              filter === 'pending'
                ? 'bg-slate-800 text-amber-300 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => onFilterChange('completed')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              filter === 'completed'
                ? 'bg-slate-800 text-emerald-300 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Completed
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-60">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search targets or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/70 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>
      </div>

      {/* Subject Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {subjectsList.map((sub) => {
          const isSelected = selectedSubject === sub.code;
          return (
            <button
              key={sub.code}
              onClick={() => setSelectedSubject(sub.code)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                  : 'bg-slate-900/40 text-slate-400 hover:text-slate-200 border border-slate-800/80'
              }`}
            >
              {sub.label}
            </button>
          );
        })}
      </div>

      {/* Days & Targets Output */}
      <div className="mt-4 space-y-4">
        {activeDays.map((day) => {
          const isToday = isDateCurrent(day.dateStr, todayStr);
          const isPast = isDateInPast(day.dateStr, todayStr);

          const filteredTargets = day.targets.filter((target) => {
            const isCompleted = completedTargetIds.includes(target.id);
            if (filter === 'pending' && isCompleted) return false;
            if (filter === 'completed' && !isCompleted) return false;
            if (selectedSubject !== 'ALL' && target.subjectCode !== selectedSubject) return false;
            if (searchQuery) {
              const q = searchQuery.toLowerCase();
              return (
                target.title.toLowerCase().includes(q) ||
                target.subject.toLowerCase().includes(q) ||
                target.unit.toLowerCase().includes(q) ||
                (target.details && target.details.toLowerCase().includes(q))
              );
            }
            return true;
          });

          if (filteredTargets.length === 0 && (filter !== 'all' || selectedSubject !== 'ALL' || searchQuery)) {
            return null;
          }

          const totalDayTargets = day.targets.length;
          const completedDayTargets = day.targets.filter(t => completedTargetIds.includes(t.id)).length;
          const dayPercent = totalDayTargets > 0 ? Math.round((completedDayTargets / totalDayTargets) * 100) : 0;

          return (
            <div 
              key={day.dateStr}
              className={`p-4 rounded-xl border transition-all ${
                isToday 
                  ? 'bg-slate-900/70 border-cyan-500/40 shadow-sm'
                  : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Day Subheader */}
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800/60">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    isToday ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {day.dateStr.split('-')[2]} {day.dateStr.split('-')[1] === '11' ? 'Nov' : 'Dec'}
                  </span>
                  <span className="text-xs font-semibold text-white">
                    {day.dayName}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
                    · Day {day.dayNumber} · {day.phaseLabel}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="font-mono text-cyan-400">{completedDayTargets}/{totalDayTargets} done</span>
                  <div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-cyan-400"
                      style={{ width: `${dayPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Targets List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredTargets.map((target) => {
                  const meta = SUBJECT_METAS[target.subjectCode] || SUBJECT_METAS.COA;
                  const isCompleted = completedTargetIds.includes(target.id);

                  return (
                    <div
                      key={target.id}
                      onClick={() => onToggleTarget(target.id)}
                      className={`p-3.5 rounded-xl border transition-all duration-150 cursor-pointer flex flex-col justify-between ${
                        isCompleted
                          ? 'bg-slate-900/30 border-emerald-500/20 opacity-75'
                          : 'bg-slate-850/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            {meta.shortName} • {target.unit}
                          </span>

                          <div className="flex items-center gap-1.5">
                            <span className={`text-[10px] font-medium ${isCompleted ? 'text-emerald-400' : 'text-slate-500'}`}>
                              {isCompleted ? 'Done' : 'Pending'}
                            </span>
                            <div className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                              isCompleted ? 'bg-emerald-500 text-slate-950 font-bold' : 'border border-slate-600'
                            }`}>
                              {isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : null}
                            </div>
                          </div>
                        </div>

                        <h5 className={`text-xs font-semibold ${
                          isCompleted ? 'line-through text-slate-500' : 'text-white'
                        }`}>
                          {target.title}
                        </h5>

                        {target.details && (
                          <p className={`text-[11px] mt-1 leading-relaxed ${
                            isCompleted ? 'text-slate-500' : 'text-slate-400'
                          }`}>
                            {target.details}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
};

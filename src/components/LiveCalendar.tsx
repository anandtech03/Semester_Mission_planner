import React, { useState } from 'react';
import { 
  CheckCircle, 
  Check,
  Calendar as CalendarIcon
} from 'lucide-react';
import { DaySchedule } from '../types';
import { isDateInPast, isDateCurrent, formatISTDate } from '../utils/dateUtils';

interface LiveCalendarProps {
  todayStr: string;
  selectedDateStr: string;
  onSelectDate: (dateStr: string) => void;
  completedTargetIds: string[];
  activeScheduleDays: DaySchedule[];
}

export const LiveCalendar: React.FC<LiveCalendarProps> = ({
  todayStr,
  selectedDateStr,
  onSelectDate,
  completedTargetIds,
  activeScheduleDays,
}) => {
  const [calendarView, setCalendarView] = useState<'all' | 'november' | 'december'>('all');

  const novemberDays = activeScheduleDays.filter(d => d.dateStr.startsWith('2026-11'));
  const decemberDays = activeScheduleDays.filter(d => d.dateStr.startsWith('2026-12'));

  const displayedDays = calendarView === 'november' 
    ? novemberDays 
    : calendarView === 'december' 
    ? decemberDays 
    : activeScheduleDays;

  return (
    <section className="w-full glass-panel p-5 sm:p-6 rounded-2xl border border-slate-800/80 shadow-xl">
      
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/60">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white tracking-tight">
              Live Mission Calendar
            </h3>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700">
              IST (UTC+5:30)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Mission Timeline (Rescheduled 10 Nov – 6 Dec 2026 · 27 Active Days)
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setCalendarView('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              calendarView === 'all'
                ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Days
          </button>
          <button
            onClick={() => setCalendarView('november')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              calendarView === 'november'
                ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            November
          </button>
          <button
            onClick={() => setCalendarView('december')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              calendarView === 'december'
                ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            December (6 Days)
          </button>
        </div>
      </div>

      {/* Clean Minimal Legend */}
      <div className="flex flex-wrap items-center gap-4 py-2.5 my-3 text-[11px] text-slate-400 border-b border-slate-800/40">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-slate-800 border border-slate-700 line-through text-[9px] text-slate-500 flex items-center justify-center">
            -
          </span>
          <span>Past / Shifted Days (Auto Strikethrough)</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
          <span className="text-cyan-300 font-medium">Today (Day 1)</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
          <span>Upcoming Days</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Check className="w-3 h-3 text-emerald-400" />
          <span className="text-emerald-400">All Targets Completed</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2.5 mt-4">
        {displayedDays.map((day) => {
          const isShiftedDay = day.dayNumber === 0;
          const isPast = isDateInPast(day.dateStr, todayStr) || isShiftedDay;
          const isToday = isDateCurrent(day.dateStr, todayStr);
          const isSelected = selectedDateStr === day.dateStr;

          const dayTargetIds = day.targets.map(t => t.id);
          const dayCompletedCount = dayTargetIds.filter(id => completedTargetIds.includes(id)).length;
          const isDayFullyComplete = dayTargetIds.length > 0 && dayCompletedCount === dayTargetIds.length;
          
          const dayDate = day.dateStr.split('-')[2];
          const monthShort = day.dateStr.split('-')[1] === '11' ? 'Nov' : 'Dec';

          return (
            <div
              key={day.dateStr}
              onClick={() => onSelectDate(day.dateStr)}
              className={`p-3 rounded-xl transition-all duration-150 cursor-pointer flex flex-col justify-between min-h-[115px] ${
                isSelected
                  ? 'ring-1 ring-cyan-400 bg-slate-800 border-slate-700 shadow-md'
                  : ''
              } ${
                isToday
                  ? 'border border-cyan-400/80 bg-cyan-950/20 shadow-sm'
                  : isPast
                  ? 'border border-slate-800/60 bg-slate-900/30 opacity-70 hover:opacity-100 hover:border-slate-700'
                  : 'border border-slate-800/80 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              {/* Header: Date & Status */}
              <div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-bold font-mono tracking-tight ${
                    isPast
                      ? 'line-through text-slate-500'
                      : isToday
                      ? 'text-cyan-300 font-extrabold'
                      : 'text-white'
                  }`}>
                    {dayDate} {monthShort}
                  </span>

                  {isToday ? (
                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-cyan-400 text-slate-950">
                      TODAY
                    </span>
                  ) : isShiftedDay ? (
                    <span className="text-[9px] text-amber-400 font-mono px-1 rounded bg-amber-500/10 border border-amber-500/20">
                      Shifted
                    </span>
                  ) : isPast ? (
                    <span className="text-[9px] text-slate-500 font-mono">
                      Passed
                    </span>
                  ) : (
                    <span className="text-[9px] text-slate-500">
                      D{day.dayNumber}
                    </span>
                  )}
                </div>

                <div className="text-[10px] text-slate-500 mt-0.5 flex items-center justify-between">
                  <span>{day.dayName.slice(0, 3)}</span>
                  <span className="text-[9px] text-slate-400">
                    {isShiftedDay ? 'Rescheduled' : day.phase === 'syllabus' ? 'Syllabus' : day.phase === 'revision_round_1' ? 'Rev 1' : 'PYQ'}
                  </span>
                </div>
              </div>

              {/* Target Mini Badges */}
              <div className="my-2 space-y-1">
                {isShiftedDay ? (
                  <div className="text-[9px] text-amber-400/70 italic px-1">
                    Moved to 10 Nov (Today)
                  </div>
                ) : (
                  day.targets.map((target) => {
                    const isDone = completedTargetIds.includes(target.id);
                    return (
                      <div 
                        key={target.id}
                        className={`text-[9.5px] px-1.5 py-0.5 rounded truncate font-medium flex items-center justify-between ${
                          isDone 
                            ? 'bg-emerald-500/10 text-emerald-400 line-through' 
                            : 'bg-slate-800/70 text-slate-300'
                        }`}
                        title={target.title}
                      >
                        <span className="truncate">{target.title}</span>
                        {isDone && <Check className="w-2.5 h-2.5 ml-1 text-emerald-400 flex-shrink-0" />}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer: Progress */}
              <div className="pt-1 border-t border-slate-800/40 flex items-center justify-between text-[10px]">
                {isShiftedDay ? (
                  <span className="text-[9px] text-slate-500 font-mono">Shifted Day</span>
                ) : (
                  <>
                    <span className={`font-mono ${isDayFullyComplete ? 'text-emerald-400 font-medium' : 'text-slate-500'}`}>
                      {dayCompletedCount}/{day.targets.length} done
                    </span>

                    {isDayFullyComplete && (
                      <CheckCircle className="w-3 h-3 text-emerald-400" />
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Day Quick Bar */}
      <div className="mt-4 p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Selected Day:</span>
          <span className="text-white font-medium">
            {formatISTDate(selectedDateStr, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>

        {selectedDateStr !== todayStr && (
          <button
            onClick={() => onSelectDate(todayStr)}
            className="text-cyan-400 hover:text-cyan-300 font-medium text-xs cursor-pointer"
          >
            ← Jump to Today (10 Nov)
          </button>
        )}
      </div>

    </section>
  );
};

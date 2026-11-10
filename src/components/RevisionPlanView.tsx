import React from 'react';
import { 
  Check, 
  HelpCircle,
  Trophy,
  Sparkles
} from 'lucide-react';
import { DaySchedule } from '../types';
import { SCHEDULE_DAYS, SUBJECT_METAS } from '../data/studyPlanData';
import { isDateCurrent } from '../utils/dateUtils';

interface RevisionPlanViewProps {
  todayStr: string;
  completedTargetIds: string[];
  onToggleTarget: (targetId: string) => void;
  onSelectDate: (dateStr: string) => void;
  activeScheduleDays?: DaySchedule[];
}

export const RevisionPlanView: React.FC<RevisionPlanViewProps> = ({
  todayStr,
  completedTargetIds,
  onToggleTarget,
  activeScheduleDays = SCHEDULE_DAYS,
}) => {
  const revisionDays = activeScheduleDays.filter(d => d.phase === 'revision');
  const revTargets = revisionDays.flatMap(d => d.targets);
  const totalRevTargets = revTargets.length;
  const completedRevTargets = revTargets.filter(t => completedTargetIds.includes(t.id)).length;
  const revisionPercent = totalRevTargets > 0 ? Math.round((completedRevTargets / totalRevTargets) * 100) : 0;

  return (
    <section className="w-full glass-panel p-5 sm:p-6 rounded-2xl border border-slate-800/80 shadow-xl">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/60">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Fast-Track Revision Sprint (25 Nov – 30 Nov 2026)
            </h3>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              6 Days Intensive
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            1 dedicated subject per day covering Units 1 to 5 + PYQs, completing 100% preparation by 30 November!
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-900/60 px-3.5 py-1.5 rounded-xl border border-slate-800 text-xs">
          <span className="text-slate-400">Revision Progress: </span>
          <span className="font-mono font-bold text-indigo-400">{completedRevTargets}/{totalRevTargets}</span>
          <span className="text-slate-700">·</span>
          <span className="font-mono text-white font-semibold">{revisionPercent}%</span>
        </div>
      </div>

      {/* Target Milestone Note */}
      <div className="mt-4 p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div className="text-[11px] text-slate-400 leading-relaxed">
          <strong className="text-slate-200">November 30 Completion Target:</strong> After completing the 15-day syllabus sprint on 24 November, each day from 25 to 30 November focuses on revising one entire subject (Units 1 to 5), formula flashcards, diagrams, and solving PYQs. On 30 November, you write a full mock paper and celebrate being 100% prepared!
        </div>
      </div>

      {/* Daily Subject Revision Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-5">
        {revisionDays.map((day) => {
          const isToday = isDateCurrent(day.dateStr, todayStr);

          return (
            <div
              key={day.dateStr}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                isToday
                  ? 'bg-slate-900/70 border-indigo-500/50 shadow-md'
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-800/60">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-indigo-400">
                      {day.dateStr.split('-')[2]} Nov
                    </span>
                    <span className="text-[11px] text-slate-300 font-medium">
                      {day.dayName}
                    </span>
                  </div>
                  {isToday && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-500 text-white">
                      TODAY
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  {day.targets.map((target) => {
                    const meta = SUBJECT_METAS[target.subjectCode] || SUBJECT_METAS.COA;
                    const isDone = completedTargetIds.includes(target.id);

                    return (
                      <div
                        key={target.id}
                        onClick={() => onToggleTarget(target.id)}
                        className={`p-3 rounded-lg border transition-all cursor-pointer flex items-start justify-between gap-2.5 ${
                          isDone
                            ? 'bg-slate-900/40 border-emerald-500/20 opacity-75'
                            : 'bg-slate-850/50 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                              {meta.shortName}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {target.unit}
                            </span>
                          </div>

                          <h5 className={`text-xs font-semibold ${
                            isDone ? 'line-through text-slate-500' : 'text-slate-200'
                          }`}>
                            {target.title}
                          </h5>

                          {target.details && (
                            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                              {target.details}
                            </p>
                          )}
                        </div>

                        <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                          isDone ? 'bg-emerald-500 text-slate-950 font-bold' : 'border border-slate-600'
                        }`}>
                          {isDone ? <Check className="w-3 h-3 stroke-[3]" /> : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
};

import React from 'react';
import { 
  Check, 
  HelpCircle
} from 'lucide-react';
import { SCHEDULE_DAYS, SUBJECT_METAS } from '../data/studyPlanData';
import { isDateCurrent } from '../utils/dateUtils';

interface RevisionPlanViewProps {
  todayStr: string;
  completedTargetIds: string[];
  onToggleTarget: (targetId: string) => void;
  onSelectDate: (dateStr: string) => void;
}

export const RevisionPlanView: React.FC<RevisionPlanViewProps> = ({
  todayStr,
  completedTargetIds,
  onToggleTarget,
}) => {
  const round1Days = SCHEDULE_DAYS.filter(d => d.phase === 'revision_round_1');
  const round2Days = SCHEDULE_DAYS.filter(d => d.phase === 'revision_final');

  const round1Total = round1Days.flatMap(d => d.targets).length;
  const round1Done = round1Days.flatMap(d => d.targets).filter(t => completedTargetIds.includes(t.id)).length;
  const round1Percent = Math.round((round1Done / round1Total) * 100);

  const round2Total = round2Days.flatMap(d => d.targets).length;
  const round2Done = round2Days.flatMap(d => d.targets).filter(t => completedTargetIds.includes(t.id)).length;
  const round2Percent = Math.round((round2Done / round2Total) * 100);

  return (
    <section className="w-full glass-panel p-5 sm:p-6 rounded-2xl border border-slate-800/80 shadow-xl">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/60">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Revision & PYQ Sprint (24 Nov – 6 Dec 2026)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Round 1: Units 1 & 2 consolidation · Final Sprint: Units 3, 4, 5 + past year papers
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-slate-400">Round 1: </span>
            <span className="font-mono font-bold text-indigo-400">{round1Done}/{round1Total}</span>
          </div>
          <div className="bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-slate-400">Final Sprint: </span>
            <span className="font-mono font-bold text-amber-400">{round2Done}/{round2Total}</span>
          </div>
        </div>
      </div>

      {/* Official Guidelines note from PDF */}
      <div className="mt-4 p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
        <HelpCircle className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
        <div className="text-[11px] text-slate-400 leading-relaxed">
          <strong className="text-slate-300">Exam Timetable Adaptability (from Study Plan):</strong> "This is a preparation plan, not an exam-date sheet. Once the official exam timetable is available, move the final revision target to match the actual paper order. If a unit is lengthy, complete at least half of it and carry the remaining half to the next study day."
        </div>
      </div>

      {/* Two Clean Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
        
        {/* Phase 2: First Revision Round */}
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800/60">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                24–30 November: First Revision Round
              </h4>
              <span className="text-[11px] text-slate-400">Units 1 & 2 + diagrams, formulas & definitions</span>
            </div>
            <span className="font-mono text-xs font-bold text-indigo-400">{round1Percent}%</span>
          </div>

          <div className="space-y-2">
            {round1Days.map((day) => {
              const target = day.targets[0];
              const isDone = completedTargetIds.includes(target.id);
              const isToday = isDateCurrent(day.dateStr, todayStr);
              const meta = SUBJECT_METAS[target.subjectCode] || SUBJECT_METAS.COA;

              return (
                <div
                  key={target.id}
                  onClick={() => onToggleTarget(target.id)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer flex items-start justify-between gap-3 text-xs ${
                    isDone
                      ? 'bg-slate-900/30 border-emerald-500/20 text-slate-500'
                      : isToday
                      ? 'bg-slate-850 border-indigo-500/50'
                      : 'bg-slate-850/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="font-mono font-bold text-xs text-indigo-300">
                        {day.dateStr.split('-')[2]} Nov
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {meta.shortName}
                      </span>
                      {isToday && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-500 text-white">
                          TODAY
                        </span>
                      )}
                    </div>
                    <div className={`font-medium ${isDone ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                      {target.title}
                    </div>
                    {target.details && (
                      <p className="text-[11px] text-slate-400 mt-0.5">
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

        {/* Phase 3: Final Revision + PYQs */}
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800/60">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                1–6 December: Final Revision + PYQs
              </h4>
              <span className="text-[11px] text-slate-400">Units 3, 4, 5 + university papers & final mock</span>
            </div>
            <span className="font-mono text-xs font-bold text-amber-400">{round2Percent}%</span>
          </div>

          <div className="space-y-2">
            {round2Days.map((day) => {
              const target = day.targets[0];
              const isDone = completedTargetIds.includes(target.id);
              const isToday = isDateCurrent(day.dateStr, todayStr);
              const meta = SUBJECT_METAS[target.subjectCode] || SUBJECT_METAS.COA;

              return (
                <div
                  key={target.id}
                  onClick={() => onToggleTarget(target.id)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer flex items-start justify-between gap-3 text-xs ${
                    isDone
                      ? 'bg-slate-900/30 border-emerald-500/20 text-slate-500'
                      : isToday
                      ? 'bg-slate-850 border-amber-500/50'
                      : 'bg-slate-855/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="font-mono font-bold text-xs text-amber-300">
                        {day.dateStr.split('-')[2]} Dec
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {meta.shortName}
                      </span>
                      {isToday && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500 text-slate-950">
                          TODAY
                        </span>
                      )}
                    </div>
                    <div className={`font-medium ${isDone ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                      {target.title}
                    </div>
                    {target.details && (
                      <p className="text-[11px] text-slate-400 mt-0.5">
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

    </section>
  );
};

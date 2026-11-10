import React from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  Code2, 
  CheckCheck, 
  RotateCcw,
  PartyPopper,
  Plus
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { DaySchedule, DSALogEntry } from '../types';
import { SUBJECT_METAS, MOTIVATIONAL_QUOTES } from '../data/studyPlanData';
import { formatISTDate } from '../utils/dateUtils';

interface TodayHeroProps {
  todaySchedule: DaySchedule;
  todayDSALogs: DSALogEntry[];
  todayStr: string;
  completedTargetIds: string[];
  onToggleTarget: (targetId: string) => void;
  onMarkAllTodayComplete: (dateStr: string) => void;
  onUnmarkAllToday: (dateStr: string) => void;
  onNavigateToDSA: () => void;
  stats: {
    todayCompletedCount: number;
    todayTotalTargets: number;
    todayCompletionRate: number;
    isTodayAllCompleted: boolean;
  };
}

export const TodayHero: React.FC<TodayHeroProps> = ({
  todaySchedule,
  todayDSALogs,
  todayStr,
  completedTargetIds,
  onToggleTarget,
  onMarkAllTodayComplete,
  onUnmarkAllToday,
  onNavigateToDSA,
  stats,
}) => {
  const triggerConfetti = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#38bdf8', '#818cf8', '#34d399', '#fbbf24'],
    });
  };

  const handleToggle = (id: string) => {
    const isNowCompleting = !completedTargetIds.includes(id);
    onToggleTarget(id);
    if (isNowCompleting && stats.todayCompletedCount + 1 >= stats.todayTotalTargets) {
      triggerConfetti();
    }
  };

  const handleMarkAllComplete = () => {
    onMarkAllTodayComplete(todayStr);
    triggerConfetti();
  };

  const motivationalQuote = MOTIVATIONAL_QUOTES[(todaySchedule.dayNumber - 1) % MOTIVATIONAL_QUOTES.length];

  return (
    <section className="w-full glass-panel p-5 sm:p-6 rounded-2xl border border-slate-800/80 shadow-xl relative overflow-hidden">
      
      {/* Top Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800/60">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              TODAY'S MISSION FOCUS
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Day {todaySchedule.dayNumber} of 21
            </span>
            <span className="text-slate-700">·</span>
            <span className="text-xs text-slate-400">
              {todaySchedule.phaseLabel}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {formatISTDate(todaySchedule.dateStr, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </h2>

          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span>"{motivationalQuote}"</span>
          </p>
        </div>

        {/* Right side controls & progress */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl px-3.5 py-2 flex items-center gap-3">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Today's Targets</div>
              <div className="text-sm font-bold font-mono text-white">
                <span className="text-cyan-400">{stats.todayCompletedCount}</span> / {stats.todayTotalTargets} done
              </div>
            </div>
            
            <div className="w-8 h-8 rounded-full border border-slate-800 flex items-center justify-center font-mono text-[11px] font-semibold text-slate-300">
              {stats.todayCompletionRate}%
            </div>
          </div>

          {stats.isTodayAllCompleted ? (
            <button
              onClick={() => onUnmarkAllToday(todayStr)}
              className="px-3 py-2 rounded-xl text-xs font-medium bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Undo</span>
            </button>
          ) : (
            <button
              onClick={handleMarkAllComplete}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Mark All Done</span>
            </button>
          )}
        </div>
      </div>

      {/* Congratulatory Celebration Banner */}
      <AnimatePresence>
        {stats.isTodayAllCompleted && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mt-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-center gap-2.5">
              <PartyPopper className="w-4 h-4 text-emerald-400" />
              <span><strong>Mission Complete!</strong> You finished all scheduled targets for today. Complete syllabus target on track for 30 November!</span>
            </div>
            <button
              onClick={triggerConfetti}
              className="px-2.5 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[11px] font-semibold transition-colors flex-shrink-0 cursor-pointer"
            >
              Celebrate 🎉
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Targets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-5">
        {todaySchedule.targets.map((target, idx) => {
          const meta = SUBJECT_METAS[target.subjectCode] || SUBJECT_METAS.COA;
          const isCompleted = completedTargetIds.includes(target.id);

          return (
            <div
              key={target.id}
              onClick={() => handleToggle(target.id)}
              className={`p-4 rounded-xl border transition-all duration-150 cursor-pointer flex flex-col justify-between ${
                isCompleted
                  ? 'bg-slate-900/40 border-emerald-500/30 opacity-75'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded border border-slate-700 bg-slate-800 text-slate-300">
                      {meta.shortName}
                    </span>
                    <span className="text-[11px] font-semibold text-cyan-400 font-mono">
                      {target.unit}
                    </span>
                  </div>

                  {/* Clean tactile Checkbox */}
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[11px] font-medium ${isCompleted ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {isCompleted ? 'Done' : 'Pending'}
                    </span>
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                      isCompleted 
                        ? 'bg-emerald-500 text-slate-950 font-bold' 
                        : 'border border-slate-600 hover:border-slate-400'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-500 text-slate-950" /> : null}
                    </div>
                  </div>
                </div>

                <h3 className={`text-sm sm:text-base font-semibold transition-all ${
                  isCompleted ? 'line-through text-slate-400' : 'text-white'
                }`}>
                  {target.title}
                </h3>

                {target.details && (
                  <p className={`text-xs mt-1.5 leading-relaxed ${
                    isCompleted ? 'text-slate-400' : 'text-slate-300'
                  }`}>
                    {target.details}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Embedded Clean Today's DSA Status Bar */}
      <div className="mt-4 p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
        <div className="flex items-center gap-2.5">
          <Code2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />
          <div>
            <span className="text-slate-400">Today's DSA Practice: </span>
            {todayDSALogs.length > 0 ? (
              <span className="text-indigo-300 font-medium">
                {todayDSALogs.map(l => l.topic).join(', ')} ({todayDSALogs.reduce((acc, c) => acc + (c.problemsCount || 1), 0)} problems solved)
              </span>
            ) : (
              <span className="text-slate-400 italic">
                No DSA practice logged for today yet.
              </span>
            )}
          </div>
        </div>

        <button
          onClick={onNavigateToDSA}
          className="text-cyan-400 hover:text-cyan-300 font-medium text-[11px] flex items-center gap-1 flex-shrink-0 cursor-pointer"
        >
          <Plus className="w-3 h-3" />
          <span>{todayDSALogs.length > 0 ? 'Add More in DSA Tab →' : 'Log Today\'s DSA Practice →'}</span>
        </button>
      </div>

    </section>
  );
};

import React from 'react';
import { 
  Code2, 
  Check, 
  Terminal, 
  Flame, 
  CheckCircle2
} from 'lucide-react';
import { DSAPracticeBlock } from '../types';
import { SHIFTED_DSA_BLOCKS } from '../data/studyPlanData';

interface DSATrackerProps {
  todayStr: string;
  completedDSATopicIds: string[];
  onToggleDSATopic: (topicId: string) => void;
  stats: {
    totalDSATopics: number;
    completedDSATopicsCount: number;
    dsaProgressPercentage: number;
  };
  blocks?: DSAPracticeBlock[];
}

export const DSATracker: React.FC<DSATrackerProps> = ({
  todayStr,
  completedDSATopicIds,
  onToggleDSATopic,
  stats,
  blocks = SHIFTED_DSA_BLOCKS,
}) => {
  return (
    <section className="w-full glass-panel p-5 sm:p-6 rounded-2xl border border-slate-800/80 shadow-xl">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/60">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Independent DSA Practice Roadmap
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Parallel daily problem practice roadmap (9 November – 6 December 2026)
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-900/60 px-3.5 py-1.5 rounded-xl border border-slate-800 text-xs">
          <span className="text-slate-400">Roadmap:</span>
          <span className="font-mono font-bold text-indigo-400">{stats.completedDSATopicsCount}/{stats.totalDSATopics} done</span>
          <span className="text-slate-700">·</span>
          <span className="font-mono text-white font-semibold">{stats.dsaProgressPercentage}%</span>
        </div>
      </div>

      {/* 7 Clean Roadmap Cards */}
      <div className="mt-5 space-y-3.5">
        {blocks.map((block: DSAPracticeBlock, idx: number) => {
          const isActive = todayStr >= block.startDate && todayStr <= block.endDate;
          const blockTopicIds = block.subtopics.map(s => s.id);
          const blockCompletedCount = blockTopicIds.filter(id => completedDSATopicIds.includes(id)).length;
          const isBlockFinished = blockTopicIds.length > 0 && blockCompletedCount === blockTopicIds.length;
          const blockPercent = Math.round((blockCompletedCount / blockTopicIds.length) * 100);

          return (
            <div
              key={block.id}
              className={`p-4 rounded-xl border transition-all ${
                isActive
                  ? 'bg-slate-900/70 border-indigo-500/40 shadow-sm'
                  : isBlockFinished
                  ? 'bg-slate-900/30 border-emerald-500/20'
                  : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 mb-3 border-b border-slate-800/60">
                <div className="flex items-center gap-2.5">
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    isActive 
                      ? 'bg-indigo-500 text-white' 
                      : isBlockFinished
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    #{idx + 1}
                  </span>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-white">
                        {block.title}
                      </h4>
                      {isActive && (
                        <span className="text-[10px] font-medium px-2 py-0.2 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                          Active Window
                        </span>
                      )}
                      {isBlockFinished && (
                        <span className="text-[10px] font-medium px-2 py-0.2 rounded-full bg-emerald-500/10 text-emerald-400">
                          Completed
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400">
                      Window: {block.dateRangeLabel} · {block.description}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="font-mono text-[11px]">{blockCompletedCount}/{block.subtopics.length}</span>
                  <div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-400"
                      style={{ width: `${blockPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Subtopics Checklist */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {block.subtopics.map((sub) => {
                  const isDone = completedDSATopicIds.includes(sub.id);

                  return (
                    <div
                      key={sub.id}
                      onClick={() => onToggleDSATopic(sub.id)}
                      className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-2 text-xs ${
                        isDone
                          ? 'bg-slate-900/30 border-emerald-500/20 text-slate-500'
                          : 'bg-slate-850/40 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white'
                      }`}
                    >
                      <span className={`${isDone ? 'line-through text-slate-500' : ''}`}>
                        {sub.name}
                      </span>

                      <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                        isDone ? 'bg-emerald-500 text-slate-950 font-bold' : 'border border-slate-600'
                      }`}>
                        {isDone ? <Check className="w-3 h-3 stroke-[3]" /> : null}
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

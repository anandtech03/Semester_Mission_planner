import React from 'react';
import { 
  Calendar, 
  Hourglass, 
  CheckCircle2, 
  BookMarked, 
  Code2, 
  Trophy, 
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ProgressDashboardProps {
  stats: {
    totalDays: number;
    daysCompleted: number;
    daysRemaining: number;
    totalSyllabusTargets: number;
    completedSyllabusTargets: number;
    syllabusProgressPercentage: number;
    totalDSATopics: number;
    completedDSATopicsCount: number;
    dsaProgressPercentage: number;
    overallProgressPercentage: number;
  };
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ stats }) => {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (stats.syllabusProgressPercentage / 100) * circumference;

  return (
    <section className="w-full space-y-3">
      {/* 4 Clean Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        
        {/* Metric 1: Timeline / Days */}
        <div className="glass-card p-4 rounded-xl border border-slate-800/60 hover:border-slate-700/80 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
              Timeline Status
            </span>
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-white tracking-tight">
              {stats.daysRemaining}
            </span>
            <span className="text-xs text-slate-400 font-medium">days left</span>
          </div>
          <div className="mt-2.5 w-full bg-slate-800/80 rounded-full h-1 overflow-hidden">
            <div 
              className="bg-cyan-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.round((stats.daysCompleted / stats.totalDays) * 100)}%` }}
            />
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>{stats.daysCompleted} passed</span>
            <span>28 total</span>
          </div>
        </div>

        {/* Metric 2: Semester Targets */}
        <div className="glass-card p-4 rounded-xl border border-slate-800/60 hover:border-slate-700/80 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
              Semester Units
            </span>
            <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-white tracking-tight">
              {stats.completedSyllabusTargets}
            </span>
            <span className="text-xs text-slate-400 font-medium">/ {stats.totalSyllabusTargets} done</span>
          </div>
          <div className="mt-2.5 w-full bg-slate-800/80 rounded-full h-1 overflow-hidden">
            <div 
              className="bg-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${stats.syllabusProgressPercentage}%` }}
            />
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span className="text-emerald-400 font-medium">{stats.syllabusProgressPercentage}% syllabus</span>
            <span>{stats.totalSyllabusTargets - stats.completedSyllabusTargets} pending</span>
          </div>
        </div>

        {/* Metric 3: Independent DSA */}
        <div className="glass-card p-4 rounded-xl border border-slate-800/60 hover:border-slate-700/80 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
              Independent DSA
            </span>
            <Code2 className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-white tracking-tight">
              {stats.completedDSATopicsCount}
            </span>
            <span className="text-xs text-slate-400 font-medium">/ {stats.totalDSATopics} topics</span>
          </div>
          <div className="mt-2.5 w-full bg-slate-800/80 rounded-full h-1 overflow-hidden">
            <div 
              className="bg-indigo-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${stats.dsaProgressPercentage}%` }}
            />
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span className="text-indigo-400 font-medium">{stats.dsaProgressPercentage}% complete</span>
            <span>7 blocks</span>
          </div>
        </div>

        {/* Metric 4: Overall Exam Readiness */}
        <div className="glass-card p-4 rounded-xl border border-slate-800/60 hover:border-slate-700/80 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
              Exam Readiness
            </span>
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-white tracking-tight">
              {stats.overallProgressPercentage}%
            </span>
            <span className="text-xs text-slate-400 font-medium">composite</span>
          </div>
          <div className="mt-2.5 w-full bg-slate-800/80 rounded-full h-1 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-cyan-400 to-indigo-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${stats.overallProgressPercentage}%` }}
            />
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Syllabus + DSA</span>
            <span className="text-cyan-400">Target: 6 Dec</span>
          </div>
        </div>

      </div>

      {/* Clean Timeline Strip */}
      <div className="glass-card px-4 py-2.5 rounded-xl border border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span className="text-slate-300 font-medium">Phase Roadmap:</span>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-[11px]">
          <div>
            <span className="text-slate-300 font-medium">Syllabus Coverage: </span>
            <span className="text-slate-400 font-mono">9–23 Nov (30 units)</span>
          </div>
          <span className="text-slate-700 hidden sm:inline">•</span>
          <div>
            <span className="text-slate-300 font-medium">Revision Round 1: </span>
            <span className="text-slate-400 font-mono">24–30 Nov (Units 1 & 2)</span>
          </div>
          <span className="text-slate-700 hidden sm:inline">•</span>
          <div>
            <span className="text-slate-300 font-medium">Final PYQs & Mock: </span>
            <span className="text-slate-400 font-mono">1–6 Dec (Units 3, 4, 5)</span>
          </div>
        </div>
      </div>
    </section>
  );
};

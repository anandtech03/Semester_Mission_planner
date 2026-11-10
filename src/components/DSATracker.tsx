import React, { useState } from 'react';
import { 
  Code2, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Calendar, 
  Sparkles, 
  Terminal, 
  BookOpen, 
  Check,
  Flame,
  Layers,
  HelpCircle
} from 'lucide-react';
import { DSALogEntry } from '../types';
import { formatISTDate } from '../utils/dateUtils';
import { SCHEDULE_DAYS } from '../data/studyPlanData';

interface DSATrackerProps {
  todayStr: string;
  dsaLogs: DSALogEntry[];
  onAddDSALog: (log: Omit<DSALogEntry, 'id' | 'createdAt'>) => void;
  onDeleteDSALog: (id: string) => void;
  onToggleDSALog: (id: string) => void;
  stats: {
    totalDSALogs: number;
    completedDSALogs: number;
    totalDSAProblemsSolved: number;
    dsaProgressPercentage: number;
  };
}

export const DSATracker: React.FC<DSATrackerProps> = ({
  todayStr,
  dsaLogs,
  onAddDSALog,
  onDeleteDSALog,
  onToggleDSALog,
  stats,
}) => {
  // Form State
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [topic, setTopic] = useState<string>('');
  const [problemsCount, setProblemsCount] = useState<number>(2);
  const [platform, setPlatform] = useState<string>('LeetCode');
  const [notes, setNotes] = useState<string>('');
  const [isFormOpen, setIsFormOpen] = useState<boolean>(true);

  const platforms = ['LeetCode', 'Striver A2Z', 'GeeksforGeeks', 'Codeforces', 'College Sem Lab', 'Self Practice'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    onAddDSALog({
      dateStr: selectedDate,
      topic: topic.trim(),
      problemsCount: Number(problemsCount) || 1,
      platform,
      notes: notes.trim(),
      isCompleted: true,
    });

    // Reset inputs
    setTopic('');
    setNotes('');
  };

  return (
    <section className="w-full space-y-6">
      
      {/* Top Banner & Metrics */}
      <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-800/80 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/60">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white tracking-tight">
                Daily DSA Practice Log
              </h3>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                Self-Tracked
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Write down whatever you practice daily — topics, problems solved, platforms, and code logic
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-2.5">
            <div className="bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400">Problems Solved: </span>
              <span className="font-mono font-bold text-indigo-400">{stats.totalDSAProblemsSolved}</span>
            </div>
            <div className="bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400">Entries: </span>
              <span className="font-mono font-bold text-emerald-400">{stats.completedDSALogs} done</span>
            </div>
          </div>
        </div>

        {/* Input Form Card */}
        <div className="mt-5 p-4 sm:p-5 rounded-xl bg-slate-900/40 border border-slate-800">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/60">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Plus className="w-3.5 h-3.5 text-cyan-400" />
              <span>Log Today's DSA Practice</span>
            </h4>
            <span className="text-[11px] text-slate-500 font-mono">
              Saved permanently in your browser
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              
              {/* Date */}
              <div className="sm:col-span-3">
                <label className="block text-[11px] text-slate-400 mb-1">Date</label>
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-slate-950/70 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  {SCHEDULE_DAYS.map((day) => (
                    <option key={day.dateStr} value={day.dateStr} className="bg-slate-900 text-white">
                      {day.formattedDate} ({day.dayName.slice(0, 3)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Topic / Problem Solved */}
              <div className="sm:col-span-6">
                <label className="block text-[11px] text-slate-400 mb-1">
                  What did you practice / solve today? <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Merge Sort implementation + 3 LeetCode Easy problems on Arrays"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full bg-slate-950/70 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Count of questions */}
              <div className="sm:col-span-3">
                <label className="block text-[11px] text-slate-400 mb-1">No. of Questions</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={problemsCount}
                  onChange={(e) => setProblemsCount(parseInt(e.target.value) || 1)}
                  className="w-full bg-slate-950/70 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

            </div>

            {/* Platform Tags Selection */}
            <div>
              <label className="block text-[11px] text-slate-400 mb-1.5">Platform / Resource</label>
              <div className="flex flex-wrap items-center gap-1.5">
                {platforms.map((plat) => (
                  <button
                    type="button"
                    key={plat}
                    onClick={() => setPlatform(plat)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                      platform === plat
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'bg-slate-800/60 text-slate-400 hover:text-white border border-slate-700/60'
                    }`}
                  >
                    {plat}
                  </button>
                ))}
              </div>
            </div>

            {/* Key Insights / Logic Learned */}
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">
                Approach / Intuition / Notes (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Mastered divide and conquer merge step with two pointers. Time complexity O(N log N), space O(N)."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-950/70 border border-slate-800 rounded-lg p-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono resize-none leading-relaxed"
              />
            </div>

            {/* Submit button */}
            <div className="flex items-center justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Save DSA Log Entry</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Log Feed List */}
      <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-800/80 shadow-xl">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/60">
          <div>
            <h4 className="text-base font-bold text-white tracking-tight">
              Your Daily DSA Entries ({dsaLogs.length})
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Review what you accomplished day by day
            </p>
          </div>
        </div>

        {dsaLogs.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 space-y-2">
            <Terminal className="w-8 h-8 text-slate-600 mx-auto" />
            <p>No DSA entries logged yet.</p>
            <p className="text-slate-400">Use the form above to record what algorithms or problems you solved today!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {dsaLogs.map((entry) => {
              return (
                <div
                  key={entry.id}
                  className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    entry.isCompleted
                      ? 'bg-slate-900/40 border-slate-800/90'
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  {/* Left: Checkbox + Content */}
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => onToggleDSALog(entry.id)}
                      className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors cursor-pointer ${
                        entry.isCompleted
                          ? 'bg-emerald-500 text-slate-950 font-bold'
                          : 'border border-slate-600 hover:border-slate-400'
                      }`}
                    >
                      {entry.isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : null}
                    </button>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-cyan-400">
                          {formatISTDate(entry.dateStr, { day: 'numeric', month: 'short' })}
                        </span>
                        {entry.platform && (
                          <span className="text-[10px] font-medium px-2 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            {entry.platform}
                          </span>
                        )}
                        {entry.problemsCount && entry.problemsCount > 0 && (
                          <span className="text-[10px] font-medium px-2 py-0.2 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                            {entry.problemsCount} {entry.problemsCount === 1 ? 'question' : 'questions'}
                          </span>
                        )}
                      </div>

                      <h5 className={`text-xs sm:text-sm font-semibold ${
                        entry.isCompleted ? 'text-slate-200' : 'text-slate-400'
                      }`}>
                        {entry.topic}
                      </h5>

                      {entry.notes && (
                        <p className="text-[11px] text-slate-400 mt-1 font-mono leading-relaxed bg-slate-950/40 p-2 rounded-lg border border-slate-850">
                          {entry.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center justify-end gap-2 sm:self-center">
                    <button
                      type="button"
                      onClick={() => onDeleteDSALog(entry.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </section>
  );
};

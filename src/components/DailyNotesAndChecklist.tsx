import React, { useState } from 'react';
import { 
  FileText, 
  Check, 
  Save, 
  Calendar, 
  CheckCircle2,
  BookmarkPlus
} from 'lucide-react';
import { DaySchedule } from '../types';
import { DAILY_CHECKLIST_TEMPLATE, SHIFTED_SCHEDULE_DAYS } from '../data/studyPlanData';
import { formatISTDate } from '../utils/dateUtils';

interface DailyNotesAndChecklistProps {
  selectedDateStr: string;
  onSelectDate: (dateStr: string) => void;
  dailyNotes: Record<string, string>;
  onSaveDailyNote: (dateStr: string, note: string) => void;
  dailyChecklist: Record<string, Record<string, boolean>>;
  onToggleChecklistItem: (dateStr: string, checkId: string) => void;
  activeScheduleDays?: DaySchedule[];
}

export const DailyNotesAndChecklist: React.FC<DailyNotesAndChecklistProps> = ({
  selectedDateStr,
  onSelectDate,
  dailyNotes,
  onSaveDailyNote,
  dailyChecklist,
  onToggleChecklistItem,
  activeScheduleDays = SHIFTED_SCHEDULE_DAYS,
}) => {
  const currentNote = dailyNotes[selectedDateStr] || '';
  const [localNote, setLocalNote] = useState<string>(currentNote);
  const [isSavedRecently, setIsSavedRecently] = useState<boolean>(false);

  React.useEffect(() => {
    setLocalNote(dailyNotes[selectedDateStr] || '');
  }, [selectedDateStr, dailyNotes]);

  const handleSave = () => {
    onSaveDailyNote(selectedDateStr, localNote);
    setIsSavedRecently(true);
    setTimeout(() => setIsSavedRecently(false), 2000);
  };

  const dayChecks = dailyChecklist[selectedDateStr] || {};
  const completedChecksCount = DAILY_CHECKLIST_TEMPLATE.filter(item => dayChecks[item.id]).length;

  return (
    <section className="w-full glass-panel p-5 sm:p-6 rounded-2xl border border-slate-800/80 shadow-xl">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/60">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Daily Study Routine & Notes
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            4-point study discipline from PDF + personal scratchpad saved per date
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
          <Calendar className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400">Date:</span>
          <select
            value={selectedDateStr}
            onChange={(e) => onSelectDate(e.target.value)}
            className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
          >
            {activeScheduleDays.filter(d => d.targets.length > 0).map((day) => (
              <option key={day.dateStr} value={day.dateStr} className="bg-slate-900 text-white">
                Day {day.dayNumber} ({day.formattedDate})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-5">
        
        {/* Left Column: 4-Point Daily Checklist (PDF) */}
        <div className="lg:col-span-5 p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800/60">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Daily Study Checklist (from PDF)
              </h4>
              <span className="text-xs font-mono font-medium text-cyan-400">
                {completedChecksCount} / 4 done
              </span>
            </div>

            <div className="space-y-2.5">
              {DAILY_CHECKLIST_TEMPLATE.map((item) => {
                const isChecked = Boolean(dayChecks[item.id]);

                return (
                  <div
                    key={item.id}
                    onClick={() => onToggleChecklistItem(selectedDateStr, item.id)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center gap-3 text-xs ${
                      isChecked
                        ? 'bg-slate-900/50 border-cyan-500/30 text-slate-300'
                        : 'bg-slate-850/40 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                      isChecked ? 'bg-cyan-500 text-slate-950 font-bold' : 'border border-slate-600'
                    }`}>
                      {isChecked ? <Check className="w-3 h-3 stroke-[3]" /> : null}
                    </div>

                    <span className={`${isChecked ? 'line-through text-slate-400' : ''}`}>
                      {item.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/60 text-[11px] text-slate-500">
            Checklist persists automatically in localStorage for {formatISTDate(selectedDateStr, { day: 'numeric', month: 'short' })}.
          </div>
        </div>

        {/* Right Column: Daily Notes */}
        <div className="lg:col-span-7 p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800/60">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Notes & Weak Topics for {formatISTDate(selectedDateStr, { day: 'numeric', month: 'short' })}
              </h4>

              <button
                onClick={handleSave}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3 h-3" />
                <span>{isSavedRecently ? 'Saved' : 'Save'}</span>
              </button>
            </div>

            <textarea
              rows={7}
              value={localNote}
              onChange={(e) => setLocalNote(e.target.value)}
              placeholder="Record tricky concepts, doubts, textbook questions, or formula reminders for today..."
              className="w-full bg-slate-950/40 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono resize-none leading-relaxed"
            />
          </div>

          <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>{localNote.length} characters</span>
            {isSavedRecently && (
              <span className="text-emerald-400 font-medium">Saved to storage</span>
            )}
          </div>
        </div>

      </div>

    </section>
  );
};

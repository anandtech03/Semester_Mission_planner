import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  Code2, 
  Sparkles, 
  RotateCcw, 
  Timer, 
  Menu, 
  X,
  Compass,
  FileText,
  CalendarRange
} from 'lucide-react';
import { ViewTab, ScheduleMode } from '../types';
import { formatISTTime, formatISTDate } from '../utils/dateUtils';

interface HeaderProps {
  activeTab: ViewTab;
  setActiveTab: (tab: ViewTab) => void;
  todayStr: string;
  systemTodayStr: string;
  simulatedDateStr: string | null;
  onSetSimulatedDate: (dateStr: string | null) => void;
  scheduleMode: ScheduleMode;
  onSetScheduleMode: (mode: ScheduleMode) => void;
  onOpenResetModal: () => void;
  onOpenTimerModal: () => void;
  stats: {
    daysCompleted: number;
    daysRemaining: number;
    totalDays: number;
    overallProgressPercentage: number;
  };
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  todayStr,
  systemTodayStr,
  simulatedDateStr,
  onSetSimulatedDate,
  scheduleMode,
  onSetScheduleMode,
  onOpenResetModal,
  onOpenTimerModal,
  stats,
}) => {
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('');
  const [showTimeTravelMenu, setShowTimeTravelMenu] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const update = () => setCurrentTimeStr(formatISTTime());
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { id: 'dashboard' as ViewTab, label: 'Overview', icon: Compass },
    { id: 'calendar' as ViewTab, label: 'Live Calendar', icon: CalendarIcon },
    { id: 'daily_targets' as ViewTab, label: 'Targets', icon: CheckCircle2 },
    { id: 'dsa_tracker' as ViewTab, label: 'DSA Roadmap', icon: Code2 },
    { id: 'revision_plan' as ViewTab, label: 'Revision', icon: Sparkles },
    { id: 'notes' as ViewTab, label: 'Notes', icon: FileText },
  ];

  const quickDates = [
    { label: 'Real System Time (Live 10 Nov)', value: null },
    { label: 'Day 1: 10 Nov (Shifted Start)', value: '2026-11-10' },
    { label: 'Day 7: 16 Nov (Unit 3)', value: '2026-11-16' },
    { label: 'Day 15: 24 Nov (Last Syllabus Day)', value: '2026-11-24' },
    { label: 'Day 16: 25 Nov (Revision Round 1)', value: '2026-11-25' },
    { label: 'Day 22: 1 Dec (Final PYQs)', value: '2026-12-01' },
    { label: 'Day 27: 6 Dec (Mock Exam)', value: '2026-12-06' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/60 bg-[#080b12]/80 backdrop-blur-xl">
      {/* Sleek Minimal Top Status Row */}
      <div className="border-b border-slate-800/40 px-4 py-1.5 text-[11px] text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* Left: Time & Timezone */}
          <div className="flex items-center gap-2">
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="font-mono text-slate-300 font-medium">Asia/Kolkata</span>
            <span className="text-slate-700">·</span>
            <span className="font-mono text-slate-400">{currentTimeStr}</span>
            <span className="text-slate-700 hidden sm:inline">·</span>
            <span className="text-slate-400 hidden sm:inline">
              {formatISTDate(todayStr, { day: 'numeric', month: 'short', year: 'numeric', weekday: 'short' })}
            </span>
          </div>

          {/* Right: Schedule Mode pill, Date Simulator, Timer */}
          <div className="flex items-center gap-2">
            
            {/* Schedule Mode Switcher */}
            <div className="flex items-center bg-slate-900/60 p-0.5 rounded-md border border-slate-800/80 text-[10px]">
              <button
                onClick={() => onSetScheduleMode('shifted')}
                className={`px-2 py-0.5 rounded transition-all ${
                  scheduleMode === 'shifted'
                    ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Shifted timetable starting today (10 Nov to 6 Dec, 27 Days)"
              >
                Shifted (Starts Today 10 Nov)
              </button>
              <button
                onClick={() => onSetScheduleMode('original')}
                className={`px-2 py-0.5 rounded transition-all ${
                  scheduleMode === 'original'
                    ? 'bg-slate-700 text-white font-semibold'
                    : 'text-slate-500 hover:text-white'
                }`}
                title="Original 28-day plan from PDF (Started 9 Nov)"
              >
                Original (9 Nov)
              </button>
            </div>

            {simulatedDateStr && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <span>Simulating: {simulatedDateStr}</span>
                <button
                  onClick={() => onSetSimulatedDate(null)}
                  className="hover:text-white underline ml-1 cursor-pointer"
                >
                  Reset
                </button>
              </span>
            )}

            <div className="relative">
              <button
                onClick={() => setShowTimeTravelMenu(!showTimeTravelMenu)}
                className="flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-slate-200 transition-colors px-2 py-0.5 rounded-md border border-slate-800/80 bg-slate-900/40 cursor-pointer"
              >
                <Clock className="w-3 h-3 text-slate-400" />
                <span>Date Machine</span>
              </button>

              {showTimeTravelMenu && (
                <div className="absolute right-0 mt-1.5 w-60 p-1.5 bg-[#0f1523] border border-slate-700/80 rounded-xl shadow-2xl backdrop-blur-2xl z-50">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-2 py-1 mb-1">
                    Select Test Date (IST)
                  </div>
                  {quickDates.map((item, idx) => {
                    const isSelected = item.value === simulatedDateStr || (!item.value && !simulatedDateStr);
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          onSetSimulatedDate(item.value);
                          setShowTimeTravelMenu(false);
                        }}
                        className={`w-full text-left px-2 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer ${
                          isSelected 
                            ? 'bg-cyan-500/15 text-cyan-300 font-medium' 
                            : 'text-slate-300 hover:bg-slate-800/60'
                        }`}
                      >
                        <span>{item.label}</span>
                        {isSelected && <span className="text-[9px] bg-cyan-500/20 text-cyan-300 px-1 rounded">Active</span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              onClick={onOpenTimerModal}
              className="flex items-center gap-1.5 text-[11px] text-slate-300 hover:text-white transition-colors px-2 py-0.5 rounded-md border border-slate-800/80 bg-slate-900/40 cursor-pointer"
            >
              <Timer className="w-3 h-3 text-cyan-400" />
              <span>Timer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Nav Strip */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        
        {/* Brand & Clean Tagline */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[1px] flex items-center justify-center shadow-sm">
            <div className="h-full w-full bg-[#080b12] rounded-[7px] flex items-center justify-center">
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-tr from-cyan-400 to-indigo-300 text-xs font-mono">
                26
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-sm sm:text-base tracking-wide text-white">
                DECEMBER EXAM MISSION 2026
              </h1>
              {scheduleMode === 'shifted' && (
                <span className="text-[10px] font-medium px-2 py-0.2 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  Rescheduled (Day 1 = Today)
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 font-normal hidden sm:block">
              One Day. Two Targets. <span className="text-slate-300 font-medium">One Step Closer to Success.</span>
            </p>
          </div>
        </div>

        {/* Clean Pill Navigation */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/50 p-1 rounded-xl border border-slate-800/70">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-800 text-white shadow-sm border border-slate-700/80'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right side clean progress & reset */}
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-2 bg-slate-900/40 border border-slate-800/70 rounded-lg px-2.5 py-1 text-xs">
            <span className="text-slate-400 text-[11px]">Readiness</span>
            <span className="font-mono font-semibold text-white">{stats.overallProgressPercentage}%</span>
            <div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-cyan-400 transition-all duration-300"
                style={{ width: `${stats.overallProgressPercentage}%` }}
              />
            </div>
          </div>

          <button
            onClick={onOpenResetModal}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg border border-slate-800 transition-colors cursor-pointer"
            title="Reset All Progress"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Mobile hamburger menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-slate-300 hover:text-white rounded-lg bg-slate-900 border border-slate-800 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* Mobile nav drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800/80 bg-[#0c121e] px-4 py-3 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-slate-800 text-white border border-slate-700'
                      : 'text-slate-400 bg-slate-900/40 border border-slate-800/70'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};

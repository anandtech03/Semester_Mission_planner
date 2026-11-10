import React, { useState } from 'react';
import { useStudyData } from './hooks/useStudyData';
import { ViewTab } from './types';
import { BackgroundEffects } from './components/BackgroundEffects';
import { Header } from './components/Header';
import { ProgressDashboard } from './components/ProgressDashboard';
import { TodayHero } from './components/TodayHero';
import { LiveCalendar } from './components/LiveCalendar';
import { DailyTargetsList } from './components/DailyTargetsList';
import { DSATracker } from './components/DSATracker';
import { RevisionPlanView } from './components/RevisionPlanView';
import { DailyNotesAndChecklist } from './components/DailyNotesAndChecklist';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import { StudyTimerModal } from './components/StudyTimerModal';

export function App() {
  const [activeTab, setActiveTab] = useState<ViewTab>('dashboard');
  const [isResetModalOpen, setIsResetModalOpen] = useState<boolean>(false);
  const [isTimerModalOpen, setIsTimerModalOpen] = useState<boolean>(false);

  const {
    todayStr,
    systemTodayStr,
    simulatedDateStr,
    selectedDateStr,
    scheduleMode,
    filter,
    completedTargetIds,
    completedDSATopicIds,
    dailyNotes,
    dailyChecklist,
    activeScheduleDays,
    todaySchedule,
    selectedSchedule,
    currentDSABlock,
    stats,
    setScheduleMode,
    setSelectedDateStr,
    setSimulatedDateStr,
    setFilter,
    toggleTarget,
    toggleDSATopic,
    toggleChecklistItem,
    saveDailyNote,
    markAllTodayComplete,
    unmarkAllToday,
    resetAllData,
  } = useStudyData();

  return (
    <div className="relative min-h-screen text-slate-200 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* Subtle Background Lighting */}
      <BackgroundEffects />

      {/* Top Application Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        todayStr={todayStr}
        systemTodayStr={systemTodayStr}
        simulatedDateStr={simulatedDateStr}
        onSetSimulatedDate={setSimulatedDateStr}
        scheduleMode={scheduleMode}
        onSetScheduleMode={setScheduleMode}
        onOpenResetModal={() => setIsResetModalOpen(true)}
        onOpenTimerModal={() => setIsTimerModalOpen(true)}
        stats={stats}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-7 space-y-6">
        
        {/* Mission Overview Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fade-in">
            {/* Clean Metric Dashboard Strip */}
            <ProgressDashboard stats={stats} />

            {/* Today's Focus Card */}
            <TodayHero
              todaySchedule={todaySchedule}
              currentDSABlock={currentDSABlock}
              todayStr={todayStr}
              completedTargetIds={completedTargetIds}
              onToggleTarget={toggleTarget}
              onMarkAllTodayComplete={markAllTodayComplete}
              onUnmarkAllToday={unmarkAllToday}
              onSelectDate={(dateStr) => {
                setSelectedDateStr(dateStr);
                setActiveTab('daily_targets');
              }}
              stats={stats}
            />

            {/* Live Interactive Calendar */}
            <LiveCalendar
              todayStr={todayStr}
              selectedDateStr={selectedDateStr}
              onSelectDate={setSelectedDateStr}
              completedTargetIds={completedTargetIds}
              activeScheduleDays={activeScheduleDays}
            />

            {/* Daily Targets & Study Notes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DailyTargetsList
                todayStr={todayStr}
                selectedDateStr={selectedDateStr}
                onSelectDate={setSelectedDateStr}
                completedTargetIds={completedTargetIds}
                onToggleTarget={toggleTarget}
                filter={filter}
                onFilterChange={setFilter}
                activeScheduleDays={activeScheduleDays}
              />

              <DailyNotesAndChecklist
                selectedDateStr={selectedDateStr}
                onSelectDate={setSelectedDateStr}
                dailyNotes={dailyNotes}
                onSaveDailyNote={saveDailyNote}
                dailyChecklist={dailyChecklist}
                onToggleChecklistItem={toggleChecklistItem}
                activeScheduleDays={activeScheduleDays}
              />
            </div>
          </div>
        )}

        {/* Live Calendar Tab */}
        {activeTab === 'calendar' && (
          <div className="space-y-6 animate-fade-in">
            <ProgressDashboard stats={stats} />
            
            <LiveCalendar
              todayStr={todayStr}
              selectedDateStr={selectedDateStr}
              onSelectDate={setSelectedDateStr}
              completedTargetIds={completedTargetIds}
              activeScheduleDays={activeScheduleDays}
            />

            <DailyTargetsList
              todayStr={todayStr}
              selectedDateStr={selectedDateStr}
              onSelectDate={setSelectedDateStr}
              completedTargetIds={completedTargetIds}
              onToggleTarget={toggleTarget}
              filter={filter}
              onFilterChange={setFilter}
              activeScheduleDays={activeScheduleDays}
            />
          </div>
        )}

        {/* Daily Targets Tab */}
        {activeTab === 'daily_targets' && (
          <div className="space-y-6 animate-fade-in">
            <TodayHero
              todaySchedule={todaySchedule}
              currentDSABlock={currentDSABlock}
              todayStr={todayStr}
              completedTargetIds={completedTargetIds}
              onToggleTarget={toggleTarget}
              onMarkAllTodayComplete={markAllTodayComplete}
              onUnmarkAllToday={unmarkAllToday}
              onSelectDate={setSelectedDateStr}
              stats={stats}
            />

            <DailyTargetsList
              todayStr={todayStr}
              selectedDateStr={selectedDateStr}
              onSelectDate={setSelectedDateStr}
              completedTargetIds={completedTargetIds}
              onToggleTarget={toggleTarget}
              filter={filter}
              onFilterChange={setFilter}
              activeScheduleDays={activeScheduleDays}
            />
          </div>
        )}

        {/* Independent DSA Roadmap Tab */}
        {activeTab === 'dsa_tracker' && (
          <div className="space-y-6 animate-fade-in">
            <DSATracker
              todayStr={todayStr}
              completedDSATopicIds={completedDSATopicIds}
              onToggleDSATopic={toggleDSATopic}
              stats={stats}
            />
          </div>
        )}

        {/* Revision Plan View Tab */}
        {activeTab === 'revision_plan' && (
          <div className="space-y-6 animate-fade-in">
            <RevisionPlanView
              todayStr={todayStr}
              completedTargetIds={completedTargetIds}
              onToggleTarget={toggleTarget}
              onSelectDate={(dateStr) => {
                setSelectedDateStr(dateStr);
                setActiveTab('daily_targets');
              }}
              activeScheduleDays={activeScheduleDays}
            />
          </div>
        )}

        {/* Notes & Routine Tab */}
        {activeTab === 'notes' && (
          <div className="space-y-6 animate-fade-in">
            <DailyNotesAndChecklist
              selectedDateStr={selectedDateStr}
              onSelectDate={setSelectedDateStr}
              dailyNotes={dailyNotes}
              onSaveDailyNote={saveDailyNote}
              dailyChecklist={dailyChecklist}
              onToggleChecklistItem={toggleChecklistItem}
              activeScheduleDays={activeScheduleDays}
            />
          </div>
        )}

      </main>

      {/* Clean Minimal Footer */}
      <footer className="border-t border-slate-800/60 bg-[#070a10] py-6 text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <div className="text-slate-300 font-semibold text-xs tracking-wide">
              DECEMBER EXAM MISSION 2026
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              One Day. Two Targets. One Step Closer to Success. · Shifted to 10 Nov – 6 Dec 2026
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button 
              onClick={() => setActiveTab('calendar')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Calendar
            </button>
            <button 
              onClick={() => setActiveTab('dsa_tracker')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              DSA
            </button>
            <button 
              onClick={() => setActiveTab('revision_plan')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Revision
            </button>
            <button 
              onClick={() => setIsTimerModalOpen(true)}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Pomodoro
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ResetConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirmReset={resetAllData}
      />

      <StudyTimerModal
        isOpen={isTimerModalOpen}
        onClose={() => setIsTimerModalOpen(false)}
      />
    </div>
  );
}

export default App;

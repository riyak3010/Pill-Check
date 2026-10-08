import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, ShieldCheck, ChevronRight } from 'lucide-react';
import { useMedication } from '../context/MedicationContext';

export default function TopHeader() {
  const { openReminderModal, schedule } = useMedication();
  const location = useLocation();

  // Check if any dose is pending or snoozed
  const pendingCount = schedule.filter((d) => d.status === 'pending').length;

  // Don't show header on Splash screen
  if (location.pathname === '/' || location.pathname === '/welcome') {
    return null;
  }

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm group-hover:bg-indigo-700 transition-colors">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg text-slate-900 tracking-tight">PILL CHECK</span>
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">MVP</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">Scan. Check. Stay Safe.</p>
          </div>
        </Link>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Simulate Reminder Quick Button */}
          <button
            onClick={() => openReminderModal('dose-2')}
            title="Simulate Dose Reminder"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-all shadow-sm"
          >
            <Bell className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span className="hidden xs:inline">Test Reminder</span>
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          </button>

          {/* Quick Schedule summary pill */}
          <Link
            to="/schedule"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <span>Doses: {schedule.filter(d => d.status === 'taken').length}/{schedule.length} Taken</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
          </Link>
        </div>
      </div>
    </header>
  );
}

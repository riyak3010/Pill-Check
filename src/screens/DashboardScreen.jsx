import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  ScanLine,
  MessageSquareText,
  CalendarClock,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Pill,
  ChevronRight,
  Bell,
} from 'lucide-react';
import { useMedication } from '../context/MedicationContext';

export default function DashboardScreen() {
  const navigate = useNavigate();
  const { user, medicines, schedule, markDoseStatus, openReminderModal, safetyData } =
    useMedication();

  // Calculate doses progress
  const totalDoses = schedule.length;
  const takenDoses = schedule.filter((d) => d.status === 'taken').length;
  const progressPercent = totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 0;

  // Next dose finding
  const nextDose = schedule.find((d) => d.status === 'pending') || schedule[0];

  return (
    <div className="space-y-5 pb-6">
      {/* Top Greeting & Brand Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              PILL CHECK
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
              Good Morning, {user?.name?.split(' ')[0] || 'Friend'}! 👋
            </h1>
            <p className="text-xs text-slate-500">
              Ready to keep your medicines on track today.
            </p>
          </div>
        </div>

        {/* Quick reminder test bell */}
        <button
          onClick={() => openReminderModal('dose-2')}
          className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
          title="Simulate Dose Reminder"
          aria-label="Simulate Dose Reminder"
        >
          <Bell className="w-5 h-5 text-indigo-600" />
        </button>
      </div>

      {/* Safety Alert Banner (RED) */}
      <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-4.5 sm:p-5 relative overflow-hidden">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                Safety Alert
              </span>
              <span className="text-xs text-red-600 font-medium">1 Potential Interaction</span>
            </div>
            <h2 className="text-base font-bold text-red-950 mt-1">
              Amoxicillin + Ibuprofen
            </h2>
            <p className="text-xs sm:text-sm text-red-800 mt-0.5 leading-snug">
              Potential interaction / increased risk of stomach irritation and bleeding.
            </p>
            <div className="mt-3">
              <button
                onClick={() => navigate('/safety')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                <span>View Safety Details</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Action Button: Scan Prescription */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-3xl p-5 text-white shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-semibold mb-2">
              <ScanLine className="w-3.5 h-3.5" />
              <span>Smart Prescription Scanner</span>
            </div>
            <h3 className="text-xl font-bold">Have a new prescription?</h3>
            <p className="text-indigo-100 text-xs sm:text-sm mt-0.5 max-w-sm">
              Scan doctor slips or medicine labels instantly to verify interactions.
            </p>
          </div>

          <button
            onClick={() => navigate('/scan')}
            className="py-3 px-5 bg-white hover:bg-indigo-50 text-indigo-700 font-bold text-sm sm:text-base rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 shrink-0 group active:scale-[0.98]"
          >
            <ScanLine className="w-5 h-5 text-indigo-600" />
            <span>Scan Prescription</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Progress & Next Dose Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Taken Progress */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Today's Progress
            </span>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
              {progressPercent}% Complete
            </span>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {takenDoses}
            </span>
            <span className="text-sm font-semibold text-slate-400">
              of {totalDoses} doses taken
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span>Morning: 1 taken</span>
            <span>Evening: 3 pending</span>
          </div>
        </div>

        {/* Next Dose Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-500" /> Next Dose
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                {nextDose?.time || '2:00 PM'}
              </span>
            </div>

            <div className="flex items-start gap-3 mt-1">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Pill className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base leading-tight">
                  {nextDose?.name} {nextDose?.strength}
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  {nextDose?.dosage} • {nextDose?.timing}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
            {nextDose?.status === 'taken' ? (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Marked as taken
              </span>
            ) : (
              <button
                onClick={() => markDoseStatus(nextDose?.id, 'taken')}
                className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark Taken</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Action Cards: AI Chatbot & Schedule */}
      <div className="grid grid-cols-2 gap-4">
        {/* Ask Pill Check AI */}
        <button
          onClick={() => navigate('/chat')}
          className="bg-white hover:bg-indigo-50/50 rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs text-left transition-all group"
        >
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <MessageSquareText className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base flex items-center justify-between">
            <span>Ask Pill Check AI</span>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Questions on side effects & warnings
          </p>
        </button>

        {/* View Schedule */}
        <button
          onClick={() => navigate('/schedule')}
          className="bg-white hover:bg-indigo-50/50 rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs text-left transition-all group"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <CalendarClock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base flex items-center justify-between">
            <span>View Schedule</span>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Full daily timeline & reminder times
          </p>
        </button>
      </div>

      {/* Today's Active Medicines Overview */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Current Medications ({medicines.length})
            </h3>
            <p className="text-xs text-slate-500">
              Verified from prescription scan
            </p>
          </div>
          <button
            onClick={() => navigate('/extracted')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
          >
            Review All →
          </button>
        </div>

        <div className="space-y-3">
          {medicines.map((med) => (
            <div
              key={med.id}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between hover:bg-slate-100/70 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600">
                  <Pill className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900 text-sm">
                      {med.name}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {med.strength}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {med.dosage} • {med.frequency} • {med.timing}
                  </p>
                </div>
              </div>

              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                {med.badge}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

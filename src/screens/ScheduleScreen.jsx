import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Pill,
  Bell,
  ArrowRight,
  RotateCcw,
  AlertCircle,
} from 'lucide-react';
import { useMedication } from '../context/MedicationContext';

export default function ScheduleScreen() {
  const navigate = useNavigate();
  const { schedule, markDoseStatus, openReminderModal } = useMedication();

  const takenCount = schedule.filter((d) => d.status === 'taken').length;

  return (
    <div className="space-y-5 pb-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Today's Medicines
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Daily vertical timeline • {takenCount} of {schedule.length} doses taken
          </p>
        </div>

        {/* Simulate Reminder Quick Button */}
        <button
          onClick={() => openReminderModal('dose-2')}
          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors flex items-center gap-1.5 shadow-2xs"
        >
          <Bell className="w-3.5 h-3.5 text-amber-600" />
          <span>Simulate Reminder</span>
        </button>
      </div>

      {/* Timeline Container */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {schedule.map((dose) => {
          const isTaken = dose.status === 'taken';
          const isMissed = dose.status === 'missed';

          return (
            <div key={dose.id} className="relative group">
              {/* Timeline Bullet Node */}
              <div
                className={`absolute -left-6 sm:-left-8 top-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  isTaken
                    ? 'bg-emerald-600 border-emerald-200 text-white shadow-xs'
                    : isMissed
                    ? 'bg-red-500 border-red-200 text-white'
                    : 'bg-white border-indigo-500 text-indigo-600 shadow-2xs'
                }`}
              >
                {isTaken ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : isMissed ? (
                  <XCircle className="w-3.5 h-3.5" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                )}
              </div>

              {/* Dose Card */}
              <div
                className={`bg-white rounded-3xl p-5 border transition-all ${
                  isTaken
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : isMissed
                    ? 'border-red-200 bg-red-50/20'
                    : 'border-slate-200 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Left: Time & Medicine Info */}
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-bold text-slate-500 flex items-center gap-1 bg-slate-100 px-2.5 py-0.5 rounded-full">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {dose.time}
                      </span>

                      {isTaken && (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Taken {dose.takenAt ? `at ${dose.takenAt}` : ''}
                        </span>
                      )}

                      {isMissed && (
                        <span className="text-[11px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <XCircle className="w-3 h-3" /> Missed
                        </span>
                      )}

                      {dose.snoozedUntil && (
                        <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                          Snoozed to {dose.snoozedUntil}
                        </span>
                      )}
                    </div>

                    <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      {dose.name}{' '}
                      <span className="text-slate-500 font-semibold text-sm">
                        {dose.strength}
                      </span>
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                      {dose.dosage} • {dose.timing}
                    </p>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    {/* Taken Button */}
                    {isTaken ? (
                      <button
                        onClick={() => markDoseStatus(dose.id, 'pending')}
                        className="py-1.5 px-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1 transition-colors"
                        title="Reset dose to pending"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                        <span>Undo</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => markDoseStatus(dose.id, 'taken')}
                        className="py-2 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all active:scale-95"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Mark Taken</span>
                      </button>
                    )}

                    {/* Missed / Skip toggle */}
                    {!isTaken && !isMissed && (
                      <button
                        onClick={() => markDoseStatus(dose.id, 'missed')}
                        className="py-2 px-3 rounded-xl border border-slate-200 text-slate-500 hover:text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors"
                      >
                        Missed
                      </button>
                    )}

                    {/* Change Time button (links to Screen 7) */}
                    <button
                      onClick={() => navigate(`/change-reminder/${dose.id}`)}
                      className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>Change time</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Safety Notice */}
      <div className="bg-slate-100 rounded-2xl p-4 text-xs text-slate-600 flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <p>
          Need to take medicine earlier or later? You can customize reminder times, but never alter your doctor's prescribed dose or frequency.
        </p>
      </div>

      {/* Quick navigation to Change Reminder demo or next screen */}
      <div className="pt-2 flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => navigate('/change-reminder/dose-3')}
          className="flex-1 py-3.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-sm rounded-2xl shadow-2xs transition-colors flex items-center justify-center gap-2"
        >
          <Clock className="w-4 h-4 text-indigo-600" />
          <span>Demo: Change Reminder Time</span>
        </button>

        <button
          onClick={() => navigate('/reminder')}
          className="flex-1 py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-2xl shadow-xs transition-colors flex items-center justify-center gap-2"
        >
          <Bell className="w-4 h-4" />
          <span>View Medicine Reminder Demo</span>
        </button>
      </div>
    </div>
  );
}

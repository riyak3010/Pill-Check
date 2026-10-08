import React, { useState } from 'react';
import { Bell, CheckCircle2, Clock, X, Pill, Volume2, AlertCircle } from 'lucide-react';
import { useMedication } from '../context/MedicationContext';

export default function ReminderModal() {
  const {
    reminderModalOpen,
    closeReminderModal,
    activeReminderDose,
    markDoseStatus,
    snoozeDose,
  } = useMedication();

  const [toastMessage, setToastMessage] = useState(null);

  if (!reminderModalOpen || !activeReminderDose) {
    return null;
  }

  const handleTaken = () => {
    markDoseStatus(activeReminderDose.id, 'taken');
    setToastMessage('Marked as Taken! Dose logged successfully.');
    setTimeout(() => {
      setToastMessage(null);
      closeReminderModal();
    }, 1200);
  };

  const handleSnooze = () => {
    snoozeDose(activeReminderDose.id, 10);
    setToastMessage('Snoozed for 10 minutes. Next reminder scheduled.');
    setTimeout(() => {
      setToastMessage(null);
      closeReminderModal();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 relative overflow-hidden">
        {/* Soft decorative accent top bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-indigo-600" />

        {/* Close button */}
        <button
          onClick={closeReminderModal}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Notification Icon */}
        <div className="flex flex-col items-center text-center mt-2 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-3 shadow-inner">
            <Bell className="w-8 h-8 text-amber-600 animate-bounce" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-2">
            <Volume2 className="w-3.5 h-3.5" />
            <span>Simulated Notification</span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Medicine Time!
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Scheduled for {activeReminderDose.time || '2:00 PM'}
          </p>
        </div>

        {/* Medicine Details Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 border border-indigo-200 flex items-center justify-center shrink-0">
              <Pill className="w-5 h-5 text-indigo-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-lg leading-tight">
                  {activeReminderDose.name}
                </h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                  {activeReminderDose.strength}
                </span>
              </div>
              <p className="text-sm font-medium text-slate-600 mt-1">
                {activeReminderDose.dosage} • {activeReminderDose.timing}
              </p>
            </div>
          </div>

          {activeReminderDose.snoozedUntil && (
            <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center gap-1.5 text-xs text-amber-700 font-medium">
              <Clock className="w-3.5 h-3.5" />
              <span>Previously snoozed until {activeReminderDose.snoozedUntil}</span>
            </div>
          )}
        </div>

        {/* Toast confirmation if action clicked */}
        {toastMessage ? (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold p-3 rounded-xl flex items-center justify-center gap-2 text-center animate-pulse">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
        ) : (
          /* Action Buttons */
          <div className="flex flex-col gap-2.5">
            <button
              onClick={handleTaken}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-base shadow-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Taken</span>
            </button>

            <button
              onClick={handleSnooze}
              className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <Clock className="w-4 h-4 text-slate-500" />
              <span>Snooze 10 min</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

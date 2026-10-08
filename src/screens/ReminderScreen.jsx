import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCircle2,
  Clock,
  Pill,
  ArrowRight,
  ArrowLeft,
  Volume2,
  CalendarCheck,
} from 'lucide-react';
import { useMedication } from '../context/MedicationContext';

export default function ReminderScreen() {
  const navigate = useNavigate();
  const { schedule, markDoseStatus, snoozeDose } = useMedication();

  // Dose-2 (Amoxicillin 500 mg 2:00 PM After lunch)
  const targetDose = schedule.find((d) => d.id === 'dose-2') || schedule[1] || schedule[0];

  const [statusMsg, setStatusMsg] = useState(null);
  const [snoozeTime, setSnoozeTime] = useState(targetDose.snoozedUntil);

  const handleTaken = () => {
    markDoseStatus(targetDose.id, 'taken');
    setStatusMsg({
      type: 'taken',
      text: 'Marked as Taken! Great job staying on track.',
    });
  };

  const handleSnooze = () => {
    snoozeDose(targetDose.id, 10);
    const now = new Date();
    now.setMinutes(now.getMinutes() + 10);
    const snoozedStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setSnoozeTime(snoozedStr);
    setStatusMsg({
      type: 'snooze',
      text: `Snoozed for 10 minutes. Reminder will alert again at ${snoozedStr}.`,
    });
  };

  return (
    <div className="space-y-6 pb-6 max-w-sm sm:max-w-md mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/schedule')}
          className="p-2 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          aria-label="Back to schedule"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
          Screen 8: Medicine Reminder Demo
        </span>
      </div>

      {/* Main Reminder Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 text-center relative overflow-hidden">
        {/* Accent top stripe */}
        <div className="absolute top-0 left-0 right-0 h-2.5 bg-indigo-600" />

        {/* Ringing Bell Icon */}
        <div className="w-20 h-20 rounded-3xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-4 shadow-inner ring-8 ring-amber-50/60">
          <Bell className="w-10 h-10 text-amber-600 animate-bounce" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-2">
          <Volume2 className="w-3.5 h-3.5" />
          <span>Simulated Notification Alert</span>
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Medicine Time!
        </h1>
        <p className="text-sm font-medium text-slate-500 mt-1">
          Scheduled for {targetDose.time || '2:00 PM'}
        </p>

        {/* Medicine Detail Box */}
        <div className="my-6 bg-slate-50 border border-slate-200/80 rounded-2xl p-5 text-left">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 shrink-0">
              <Pill className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900 leading-tight">
                  {targetDose.name}
                </h2>
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                  {targetDose.strength}
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-600 mt-1">
                {targetDose.dosage} • {targetDose.timing}
              </p>
            </div>
          </div>

          {(snoozeTime || targetDose.snoozedUntil) && (
            <div className="mt-3 pt-3 border-t border-slate-200 flex items-center gap-1.5 text-xs text-amber-700 font-semibold">
              <Clock className="w-3.5 h-3.5" />
              <span>Snoozed until {snoozeTime || targetDose.snoozedUntil}</span>
            </div>
          )}
        </div>

        {/* Feedback message banner */}
        {statusMsg && (
          <div
            className={`p-3.5 rounded-2xl text-xs sm:text-sm font-semibold mb-5 flex items-center justify-center gap-2 ${
              statusMsg.type === 'taken'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-amber-50 text-amber-800 border border-amber-200'
            }`}
          >
            {statusMsg.type === 'taken' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <Clock className="w-5 h-5 text-amber-600 shrink-0" />
            )}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleTaken}
            className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-lg rounded-2xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-6 h-6" />
            <span>Taken</span>
          </button>

          <button
            onClick={handleSnooze}
            className="w-full py-3.5 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-base rounded-2xl transition-colors flex items-center justify-center gap-2"
          >
            <Clock className="w-5 h-5 text-slate-500" />
            <span>Snooze 10 min</span>
          </button>
        </div>
      </div>

      {/* Next Flow Navigation */}
      <div className="pt-2 flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => navigate('/schedule')}
          className="flex-1 py-3 px-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs sm:text-sm rounded-2xl transition-colors flex items-center justify-center gap-1.5"
        >
          <CalendarCheck className="w-4 h-4 text-slate-500" />
          <span>Return to Schedule</span>
        </button>

        <button
          onClick={() => navigate('/chat')}
          className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm rounded-2xl transition-colors flex items-center justify-center gap-1.5"
        >
          <span>Ask AI Chatbot</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

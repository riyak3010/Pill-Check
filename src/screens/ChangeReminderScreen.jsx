import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  Lock,
  AlertCircle,
  Pill,
  Save,
} from 'lucide-react';
import { useMedication } from '../context/MedicationContext';

export default function ChangeReminderScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { schedule, updateReminderTime } = useMedication();

  // Find dose or default to dose-3 (Amoxicillin 8:00 PM After dinner)
  const targetDose = schedule.find((d) => d.id === id) || schedule[2] || schedule[0];

  // Parse initial time
  const initialTimeStr = targetDose.time || '8:00 PM';
  const match = initialTimeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  const initialHour = match ? match[1].padStart(2, '0') : '08';
  const initialMinute = match ? match[2].padStart(2, '0') : '00';
  const initialPeriod = match ? match[3].toUpperCase() : 'PM';

  const [hour, setHour] = useState(initialHour);
  const [minute, setMinute] = useState(initialMinute);
  const [period, setPeriod] = useState(initialPeriod);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const hoursList = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  const minutesList = ['00', '15', '30', '45'];

  const handleSave = (e) => {
    e.preventDefault();
    const formattedHour = parseInt(hour, 10).toString(); // remove leading zero if desired or keep clean
    const formattedTime = `${formattedHour}:${minute} ${period}`;

    updateReminderTime(targetDose.id, formattedTime);
    setSavedSuccess(true);

    setTimeout(() => {
      navigate('/schedule');
    }, 1000);
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/schedule')}
          className="p-2 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          aria-label="Back to schedule"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Change Reminder Time
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Customize notification alert to match your routine
          </p>
        </div>
      </div>

      {/* Selected Medicine Info Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <Pill className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Selected Dose
            </span>
            <h2 className="text-lg font-bold text-slate-900 leading-tight mt-0.5">
              {targetDose.name} {targetDose.strength}
            </h2>
            <p className="text-xs sm:text-sm font-medium text-slate-600 mt-1">
              {targetDose.dosage} • {targetDose.timing}
            </p>
            <div className="mt-2 text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-xl inline-block">
              Current Time: {targetDose.time}
            </div>
          </div>
        </div>
      </div>

      {/* Reminder Editor Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-6">
        {/* Time Selector */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
            Select New Reminder Time
          </label>

          <div className="flex items-center justify-center gap-2 sm:gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            {/* Hour select */}
            <select
              value={hour}
              onChange={(e) => setHour(e.target.value)}
              className="py-3 px-3 bg-white border border-slate-300 rounded-xl font-bold text-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs text-center cursor-pointer"
            >
              {hoursList.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>

            <span className="text-2xl font-bold text-slate-400">:</span>

            {/* Minute select */}
            <select
              value={minute}
              onChange={(e) => setMinute(e.target.value)}
              className="py-3 px-3 bg-white border border-slate-300 rounded-xl font-bold text-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs text-center cursor-pointer"
            >
              {minutesList.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            {/* AM / PM toggle */}
            <div className="flex bg-slate-200 p-1 rounded-xl gap-1">
              <button
                type="button"
                onClick={() => setPeriod('AM')}
                className={`py-2 px-3 rounded-lg text-sm font-bold transition-all ${
                  period === 'AM'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                AM
              </button>
              <button
                type="button"
                onClick={() => setPeriod('PM')}
                className={`py-2 px-3 rounded-lg text-sm font-bold transition-all ${
                  period === 'PM'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                PM
              </button>
            </div>
          </div>
        </div>

        {/* Repeat Frequency (Prescribed - Read Only) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Repeat Frequency
            </label>
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <Lock className="w-3 h-3" /> Doctor Prescribed
            </span>
          </div>

          <div className="relative">
            <select
              disabled
              value="Twice daily"
              className="w-full py-3 px-4 bg-slate-100 border border-slate-200 rounded-xl text-slate-600 text-sm font-semibold cursor-not-allowed opacity-90"
            >
              <option value="Twice daily">Twice daily (Prescribed by Dr. Sarah Miller)</option>
            </select>
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5">
            Prescription frequency is locked to protect patient health.
          </p>
        </div>

        {/* Mandatory Safety Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <span className="font-bold">Important Medication Rule:</span> You may customize your reminder alert time to suit your daily meals and waking hours, but the application must NOT change the prescribed dosage or dosing frequency.
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-2">
          {savedSuccess ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl font-bold text-center flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Reminder saved! Updating schedule...</span>
            </div>
          ) : (
            <button
              type="submit"
              className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base rounded-2xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              <span>Save Reminder</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

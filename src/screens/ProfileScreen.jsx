import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Phone,
  AlertCircle,
  Heart,
  Bell,
  Users,
  CheckCircle2,
  Save,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import { useMedication } from '../context/MedicationContext';

export default function ProfileScreen() {
  const navigate = useNavigate();
  const { user, updateUser, resetAllData } = useMedication();

  const [formData, setFormData] = useState({
    name: user?.name || 'Robert Smith',
    phone: user?.phone || '+1 (555) 234-5678',
    allergies: user?.allergies || 'Penicillin (Mild rash noted in 2021)',
    conditions: user?.conditions || 'Mild acid reflux, seasonal allergies',
    caregiverName: user?.caregiverName || 'Sarah Smith (Daughter)',
    caregiverPhone: user?.caregiverPhone || '+1 (555) 987-6543',
    sound: user?.reminderPreferences?.sound ?? true,
    vibrate: user?.reminderPreferences?.vibrate ?? true,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateUser({
      name: formData.name,
      phone: formData.phone,
      allergies: formData.allergies,
      conditions: formData.conditions,
      caregiverName: formData.caregiverName,
      caregiverPhone: formData.caregiverPhone,
      reminderPreferences: {
        sound: formData.sound,
        vibrate: formData.vibrate,
        earlyAlert: 5,
        snoozeDuration: 10,
      },
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleReset = () => {
    if (window.confirm('Reset all demo data back to factory default?')) {
      resetAllData();
      setResetSuccess(true);
      setTimeout(() => {
        setResetSuccess(false);
        navigate('/dashboard');
      }, 1000);
    }
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Your Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Personal medication safety record & caregiver settings
          </p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700">
          <User className="w-5 h-5" />
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Personal Information */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-900">
            <User className="w-4 h-4 text-indigo-600" />
            <h2 className="font-bold text-sm">Personal Information</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mobile Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
              />
            </div>
          </div>
        </div>

        {/* Known Allergies */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-900">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <h2 className="font-bold text-sm">Known Drug Allergies</h2>
          </div>

          <div>
            <textarea
              name="allergies"
              rows="2"
              value={formData.allergies}
              onChange={handleChange}
              placeholder="e.g. Penicillin, Aspirin, Sulfa drugs..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Used when checking new prescription compatibility
            </p>
          </div>
        </div>

        {/* Health Information */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-900">
            <Heart className="w-4 h-4 text-pink-500" />
            <h2 className="font-bold text-sm">Health Information</h2>
          </div>

          <div>
            <textarea
              name="conditions"
              rows="2"
              value={formData.conditions}
              onChange={handleChange}
              placeholder="e.g. Mild acid reflux, hypertension..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Recorded to avoid contraindications with chronic conditions
            </p>
          </div>
        </div>

        {/* Caregiver Contact */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-900">
            <Users className="w-4 h-4 text-emerald-600" />
            <h2 className="font-bold text-sm">Caregiver Contact</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Caregiver Name & Relation
              </label>
              <input
                type="text"
                name="caregiverName"
                value={formData.caregiverName}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Caregiver Phone
              </label>
              <input
                type="tel"
                name="caregiverPhone"
                value={formData.caregiverPhone}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
              />
            </div>
          </div>
        </div>

        {/* Reminder Preferences */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-900">
            <Bell className="w-4 h-4 text-amber-500" />
            <h2 className="font-bold text-sm">Reminder Preferences</h2>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer">
              <span className="text-xs font-semibold text-slate-700">
                Audible Sound Reminders
              </span>
              <input
                type="checkbox"
                name="sound"
                checked={formData.sound}
                onChange={handleChange}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer border-t border-slate-100">
              <span className="text-xs font-semibold text-slate-700">
                Vibrate on Alarm
              </span>
              <input
                type="checkbox"
                name="vibrate"
                checked={formData.vibrate}
                onChange={handleChange}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
            </label>

            <div className="p-2.5 rounded-xl bg-slate-50 text-xs text-slate-500 flex justify-between">
              <span>Default Snooze Duration</span>
              <span className="font-bold text-slate-700">10 Minutes</span>
            </div>
          </div>
        </div>

        {/* Status Toasts */}
        {savedSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Profile settings saved successfully!</span>
          </div>
        )}

        {resetSuccess && (
          <div className="bg-indigo-50 border border-indigo-200 text-indigo-800 p-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2">
            <RotateCcw className="w-5 h-5 text-indigo-600" />
            <span>Demo data reset to initial clean state!</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <button
            type="submit"
            className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base rounded-2xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            <span>Save Profile Changes</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="w-full py-3 px-6 bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-600 font-semibold text-xs rounded-2xl transition-colors flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Demo Data to Default</span>
          </button>
        </div>
      </form>
    </div>
  );
}

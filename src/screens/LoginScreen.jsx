import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, User, Phone, ArrowRight, HeartHandshake } from 'lucide-react';
import { useMedication } from '../context/MedicationContext';

export default function LoginScreen() {
  const navigate = useNavigate();
  const { user, updateUser } = useMedication();

  const [name, setName] = useState(user?.name || 'Robert Smith');
  const [phone, setPhone] = useState(user?.phone || '+1 (555) 234-5678');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }

    updateUser({ name: name.trim(), phone: phone.trim() });
    navigate('/dashboard');
  };

  return (
    <div className="flex flex-col justify-center min-h-[78vh] py-6 max-w-sm mx-auto">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-md mb-3 ring-6 ring-indigo-50">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Welcome to Pill Check
        </h1>
        <p className="text-sm font-medium text-slate-500 mt-1">
          Your simple medication safety assistant
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-100 text-slate-700">
          <HeartHandshake className="w-5 h-5 text-indigo-600" />
          <h2 className="font-semibold text-base text-slate-900">
            Let's get to know you
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-xs bg-red-50 text-red-700 border border-red-200 rounded-xl">
              {error}
            </div>
          )}

          {/* Name Field */}
          <div>
            <label
              htmlFor="user-name"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Your Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-5 h-5" />
              </div>
              <input
                id="user-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                placeholder="e.g. Robert Smith"
                required
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-base font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Used for your personalized medication reminders
            </p>
          </div>

          {/* Mobile Number Field */}
          <div>
            <label
              htmlFor="user-phone"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Mobile Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-5 h-5" />
              </div>
              <input
                id="user-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-base font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              For audio reminders and caregiver emergency alerts
            </p>
          </div>

          {/* Continue Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base rounded-2xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 group"
            >
              <span>Continue to Dashboard</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </form>
      </div>

      <div className="text-center mt-6">
        <p className="text-xs text-slate-400">
          Demo Mode • No password or verification SMS needed
        </p>
      </div>
    </div>
  );
}

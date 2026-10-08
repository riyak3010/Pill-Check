import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function SplashScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-between min-h-[82vh] py-4 text-center">
      {/* Brand & Badge */}
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md mb-3 ring-8 ring-indigo-50">
          <ShieldCheck className="w-9 h-9" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Pill Check
        </h1>
        <p className="text-base sm:text-lg font-semibold text-indigo-600 mt-1">
          “Scan. Check. Stay Safe.”
        </p>
        <p className="text-sm text-slate-500 mt-1 max-w-xs">
          Your simple medication safety assistant
        </p>
      </div>

      {/* Friendly Healthcare Illustration */}
      <div className="my-6 w-full max-w-xs sm:max-w-sm">
        <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 bg-white">
          <img
            src="/welcome-illustration.jpg"
            alt="Friendly healthcare assistant with elderly couple"
            className="w-full h-auto object-cover max-h-72"
            onError={(e) => {
              // Fallback friendly illustration container if image fails
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="absolute bottom-2 left-2 right-2 bg-white/95 backdrop-blur-sm rounded-xl p-2.5 shadow-sm border border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-700 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Designed for seniors & caregivers</span>
          </div>
        </div>
      </div>

      {/* Onboarding Dots & Primary Button */}
      <div className="w-full max-w-xs flex flex-col items-center gap-4">
        {/* Onboarding dots */}
        <div className="flex items-center gap-2">
          <span className="w-6 h-2 rounded-full bg-indigo-600 transition-all"></span>
          <span className="w-2 h-2 rounded-full bg-slate-300"></span>
          <span className="w-2 h-2 rounded-full bg-slate-300"></span>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={() => navigate('/login')}
          className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-lg rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
        >
          <span>Get Started</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        <p className="text-xs text-slate-400">
          Easy setup • No complex password required
        </p>
      </div>
    </div>
  );
}

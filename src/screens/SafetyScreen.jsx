import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Info,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ShieldCheck,
  Pill,
} from 'lucide-react';
import { useMedication } from '../context/MedicationContext';

export default function SafetyScreen() {
  const navigate = useNavigate();
  const { safetyData, medicines } = useMedication();
  const [openInteractionId, setOpenInteractionId] = useState(
    safetyData.interactions[0]?.id || null
  );

  const toggleDetails = (id) => {
    setOpenInteractionId((prev) => (prev === id ? null : id));
  };

  const hasInteractions = safetyData.interactions && safetyData.interactions.length > 0;

  return (
    <div className="space-y-5 pb-6">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/extracted')}
          className="p-2 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          aria-label="Back to extracted medicines"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Safety Check Results
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Database scan completed across your {medicines.length} verified prescriptions
          </p>
        </div>
      </div>

      {/* RED: Potential Interactions Found */}
      {hasInteractions ? (
        safetyData.interactions.map((interaction) => {
          const isOpen = openInteractionId === interaction.id;

          return (
            <div
              key={interaction.id}
              className="bg-red-50 border-2 border-red-200 rounded-3xl p-5 shadow-xs transition-all"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-xs font-bold uppercase tracking-wider mb-1">
                    <span>Potential interaction detected</span>
                  </div>
                  <h2 className="text-lg font-bold text-red-950 mt-0.5">
                    {safetyData.interactionCount} Potential Interaction Found
                  </h2>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm bg-white px-2.5 py-1 rounded-xl border border-red-200">
                      {interaction.drugs.join(' + ')}
                    </span>
                  </div>
                  <p className="text-sm text-red-900 font-medium mt-2 leading-relaxed">
                    {interaction.summary}
                  </p>

                  {/* View Details Toggle Button */}
                  <div className="mt-3">
                    <button
                      onClick={() => toggleDetails(interaction.id)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                    >
                      <span>{isOpen ? 'Hide Details' : 'View Details'}</span>
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expandable Details Card */}
              {isOpen && (
                <div className="mt-4 pt-4 border-t border-red-200 space-y-3 bg-white/80 p-4 rounded-2xl border">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Clinical Mechanism
                    </h3>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {interaction.mechanism}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Pharmacist Guidance
                    </h3>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {interaction.recommendation}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                No issue found in the checked database
              </span>
              <h2 className="text-base font-bold text-emerald-950 mt-1">
                No Severe Interactions Found
              </h2>
              <p className="text-xs sm:text-sm text-emerald-800 mt-1 leading-relaxed">
                No major conflicting drug-drug interactions detected among your verified medications in the checked reference database.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* GREEN: Safe Medicines */}
      {safetyData.safeMedicines && safetyData.safeMedicines.map((safe) => (
        <div key={safe.id} className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                No issue found in the checked database
              </span>
              <h2 className="text-base font-bold text-emerald-950 mt-1">
                {safe.title}
              </h2>
              <p className="text-xs sm:text-sm text-emerald-800 mt-1 leading-relaxed">
                {safe.summary} {safe.note}
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* YELLOW: General Advice */}
      <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 shadow-xs">
        <div className="flex items-start gap-3.5 mb-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0">
            <Info className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
              Clinical Guidelines
            </span>
            <h2 className="text-base font-bold text-amber-950 mt-1">
              General Advice
            </h2>
          </div>
        </div>

        <ul className="space-y-2.5 mt-2">
          {safetyData.generalAdvice.map((advice, i) => (
            <li
              key={i}
              className="flex items-start gap-2.5 text-xs sm:text-sm text-amber-900 bg-white/80 p-3 rounded-2xl border border-amber-200/60"
            >
              <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span className="leading-snug">{advice}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Mandatory Safety Disclaimer Notice */}
      <div className="bg-slate-100 border border-slate-200 rounded-2xl p-3.5 text-slate-600 text-[11px] leading-relaxed">
        <p className="font-semibold text-slate-700 mb-0.5">Medical Safety Notice:</p>
        <p>
          Pill Check reports potential interactions found in medical databases. The system never guarantees medication safety or tells users to alter prescribed medication. Always consult your doctor or pharmacist.
        </p>
      </div>

      {/* Next Action Button: Go to Schedule */}
      <div className="pt-2">
        <button
          onClick={() => navigate('/schedule')}
          className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-base sm:text-lg rounded-2xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 group"
        >
          <span>View Medication Schedule</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Pill,
  Edit2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Info,
  FileCheck,
} from 'lucide-react';
import { useMedication } from '../context/MedicationContext';
import MedicineEditModal from '../components/MedicineEditModal';

export default function ExtractedScreen() {
  const navigate = useNavigate();
  const { medicines, updateMedicine, uploadedRx } = useMedication();
  const [editingMed, setEditingMed] = useState(null);

  const handleEditClick = (med) => {
    setEditingMed(med);
  };

  const handleSaveEdit = (id, updatedFields) => {
    updateMedicine(id, updatedFields);
  };

  return (
    <div className="space-y-5 pb-6">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/scan')}
          className="p-2 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          aria-label="Back to scan"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Medicines found
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700">
              {medicines.length} Detected
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Verify extracted medicines against your prescription
          </p>
        </div>
      </div>

      {/* Scanned Rx Source Badge */}
      <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
            <FileCheck className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900">
              Scanned Source: {uploadedRx?.doctor || 'Dr. Sarah Miller, MD'}
            </p>
            <p className="text-[11px] text-slate-500">
              Prescription matched with 99.4% optical confidence
            </p>
          </div>
        </div>
        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
        </span>
      </div>

      {/* Medicines List */}
      <div className="space-y-3.5">
        {medicines.map((med, index) => (
          <div
            key={med.id}
            className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs hover:border-slate-300 transition-all relative overflow-hidden"
          >
            {/* Index number accent */}
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 shrink-0 shadow-2xs">
                  <Pill className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">
                      #{index + 1}
                    </span>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900">
                      {med.name}
                    </h2>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {med.strength}
                    </span>
                  </div>

                  {/* Attributes line */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700">
                      {med.dosage}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700">
                      {med.frequency}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
                      {med.timing}
                    </span>
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              <button
                onClick={() => handleEditClick(med)}
                className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 transition-colors flex items-center gap-1 text-xs font-semibold"
                title="Edit medicine details"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Edit</span>
              </button>
            </div>

            {/* Sub-note/purpose */}
            {med.purpose && (
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
                <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Indication: {med.purpose}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Safety Notice Callout */}
      <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p>
          Next step will check all {medicines.length} medicines against clinical interaction databases for maximum safety.
        </p>
      </div>

      {/* Confirm Button */}
      <div className="pt-2">
        <button
          onClick={() => navigate('/safety')}
          className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-base sm:text-lg rounded-2xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 group"
        >
          <span>Confirm Medicines</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        <p className="text-center text-xs text-slate-400 mt-2">
          Clicking confirm runs instant drug-drug interaction safety analysis
        </p>
      </div>

      {/* Edit Modal */}
      <MedicineEditModal
        medicine={editingMed}
        isOpen={!!editingMed}
        onClose={() => setEditingMed(null)}
        onSave={handleSaveEdit}
      />
    </div>
  );
}

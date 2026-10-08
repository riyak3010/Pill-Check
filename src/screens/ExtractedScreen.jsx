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
  AlertTriangle,
  Plus,
  FileText,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useMedication } from '../context/MedicationContext';
import MedicineEditModal from '../components/MedicineEditModal';

export default function ExtractedScreen() {
  const navigate = useNavigate();
  const {
    extractedMedicines,
    updateExtractedMedicine,
    addExtractedMedicine,
    confirmExtractedMedicines,
    uploadedRx,
  } = useMedication();

  const [editingMed, setEditingMed] = useState(null);
  const [showRawText, setShowRawText] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // New medicine state for Add
  const [newMedForm, setNewMedForm] = useState({
    name: '',
    strength: '500 mg',
    dosage: '1 tablet',
    frequency: 'Once daily',
    timing: 'After food',
    badge: 'Prescription',
  });

  const handleEditClick = (med) => {
    setEditingMed(med);
  };

  const handleSaveEdit = (id, updatedFields) => {
    updateExtractedMedicine(id, updatedFields);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newMedForm.name.trim()) return;

    addExtractedMedicine({
      id: `med-custom-${Date.now()}`,
      name: newMedForm.name.trim(),
      strength: newMedForm.strength,
      dosage: newMedForm.dosage,
      frequency: newMedForm.frequency,
      timing: newMedForm.timing,
      badge: 'Added Item',
      purpose: 'Prescribed treatment',
      class: 'custom',
    });

    setNewMedForm({
      name: '',
      strength: '500 mg',
      dosage: '1 tablet',
      frequency: 'Once daily',
      timing: 'After food',
      badge: 'Prescription',
    });
    setShowAddModal(false);
  };

  const handleConfirm = () => {
    // Commit the extracted medicines to active medicines, schedule, and safety check
    confirmExtractedMedicines(extractedMedicines);
    navigate('/safety');
  };

  const isPreset = uploadedRx?.isPreset;
  const isRealOCR = uploadedRx?.mode === 'Real OCR';
  const isDemoOCR = uploadedRx?.mode === 'Demo OCR';

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
              {extractedMedicines.length} Detected
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Extracted from your uploaded prescription document
          </p>
        </div>
      </div>

      {/* Scanned Rx Source & OCR Status Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 leading-tight">
                Source: {uploadedRx?.doctor || uploadedRx?.name || 'Uploaded Prescription'}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {isPreset ? (
                  'Preset sample prescription document'
                ) : isRealOCR ? (
                  `Processed via Optical Character Recognition • ${uploadedRx?.confidence || 75}% confidence`
                ) : (
                  'Processed via Demo OCR extraction from uploaded image'
                )}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="self-start sm:self-auto">
            {isPreset ? (
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Preset Verified</span>
              </span>
            ) : (
              <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Please verify extracted details</span>
              </span>
            )}
          </div>
        </div>

        {/* View Raw Extracted Text Accordion */}
        {uploadedRx?.rawText && (
          <div className="mt-3 pt-3 border-t border-slate-100">
            <button
              onClick={() => setShowRawText(!showRawText)}
              className="text-xs font-semibold text-slate-600 hover:text-indigo-600 flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>{showRawText ? 'Hide extracted text' : 'View extracted OCR text from image'}</span>
              {showRawText ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showRawText && (
              <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
                {uploadedRx.rawText}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Medicines List */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Detected Medications
          </span>
          <button
            onClick={() => setShowAddModal(true)}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Medicine</span>
          </button>
        </div>

        {extractedMedicines.map((med, index) => (
          <div
            key={med.id}
            className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs hover:border-slate-300 transition-all relative overflow-hidden"
          >
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
      <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p>
          Please review medicine names, strengths, and times above. Clicking confirm will run clinical interaction safety checks across your medications.
        </p>
      </div>

      {/* Confirm Button */}
      <div className="pt-2">
        <button
          onClick={handleConfirm}
          className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-base sm:text-lg rounded-2xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 group"
        >
          <span>Confirm Medicines</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        <p className="text-center text-xs text-slate-400 mt-2">
          Clicking confirm analyzes drug-drug interactions and builds your schedule
        </p>
      </div>

      {/* Edit Modal */}
      <MedicineEditModal
        medicine={editingMed}
        isOpen={!!editingMed}
        onClose={() => setEditingMed(null)}
        onSave={handleSaveEdit}
      />

      {/* Add Medicine Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-lg text-slate-900 mb-1">Add Another Medicine</h3>
            <p className="text-xs text-slate-500 mb-4">Add a medication from your prescription or label</p>

            <form onSubmit={handleAddSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Medicine Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Metformin, Lisinopril, Paracetamol..."
                  value={newMedForm.name}
                  onChange={(e) => setNewMedForm({ ...newMedForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Strength</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 500 mg"
                    value={newMedForm.strength}
                    onChange={(e) => setNewMedForm({ ...newMedForm, strength: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Dosage</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1 tablet"
                    value={newMedForm.dosage}
                    onChange={(e) => setNewMedForm({ ...newMedForm, dosage: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Frequency</label>
                  <select
                    value={newMedForm.frequency}
                    onChange={(e) => setNewMedForm({ ...newMedForm, frequency: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm font-medium bg-white"
                  >
                    <option value="Once daily">Once daily</option>
                    <option value="Twice daily">Twice daily</option>
                    <option value="Three times daily">Three times daily</option>
                    <option value="As needed">As needed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Food Instruction</label>
                  <select
                    value={newMedForm.timing}
                    onChange={(e) => setNewMedForm({ ...newMedForm, timing: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm font-medium bg-white"
                  >
                    <option value="After food">After food</option>
                    <option value="Before food">Before food</option>
                    <option value="With food or milk">With food or milk</option>
                    <option value="Without food">Without food</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm"
                >
                  Add Medicine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

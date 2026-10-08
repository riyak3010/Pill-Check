import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Upload,
  Camera,
  FileText,
  CheckCircle2,
  X,
  Plus,
  Sparkles,
  Loader2,
  FileCheck,
} from 'lucide-react';
import { useMedication } from '../context/MedicationContext';

export default function ScanScreen() {
  const navigate = useNavigate();
  const { uploadedRx, setUploadedRx } = useMedication();
  const fileInputRef = useRef(null);

  const [images, setImages] = useState([
    {
      id: 'default-img',
      name: 'Prescription_Dr_Miller.jpg',
      size: '1.4 MB',
      url: uploadedRx?.imageUrl || '/sample-prescription.jpg',
      isPreset: true,
    },
  ]);

  const [isDragging, setIsDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);

  const analysisSteps = [
    'Scanning document & enhancing contrast...',
    'Extracting medicine names & strengths (OCR)...',
    'Cross-referencing drug database & dosages...',
    'Extraction complete! Preparing results...',
  ];

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newImgs = files.map((file, idx) => ({
      id: `upload-${Date.now()}-${idx}`,
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      url: URL.createObjectURL(file),
      isPreset: false,
    }));

    setImages((prev) => [...prev, ...newImgs]);
    setUploadedRx({
      imageUrl: newImgs[0].url,
      previewTitle: newImgs[0].name,
      doctor: 'Dr. Sarah Miller, MD',
    });
  };

  const handleRemoveImage = (id, e) => {
    e.stopPropagation();
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleAnalyze = () => {
    setAnalyzing(true);
    setAnalysisStep(0);

    const stepInterval = setInterval(() => {
      setAnalysisStep((prev) => {
        if (prev < analysisSteps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(stepInterval);
          setTimeout(() => {
            setAnalyzing(false);
            navigate('/extracted');
          }, 600);
          return prev;
        }
      });
    }, 700);
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Top Header with Back button */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/dashboard')}
          className="p-2 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          aria-label="Go Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Scan your prescription
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Upload a clear doctor slip or medicine bottle label
          </p>
        </div>
      </div>

      {/* Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files) {
            handleFileSelect({ target: { files: e.dataTransfer.files } });
          }
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50/70 scale-[0.99]'
            : 'border-slate-300 bg-white hover:border-indigo-400 hover:bg-slate-50/60'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/jpg, application/pdf"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />

        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 shadow-2xs ring-6 ring-indigo-50/50">
            <Camera className="w-8 h-8" />
          </div>

          <h3 className="font-bold text-base sm:text-lg text-slate-900">
            Click to upload image
          </h3>
          <p className="text-sm font-medium text-slate-500 mt-1">
            or drag and drop file here
          </p>

          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
            <FileText className="w-3.5 h-3.5" />
            <span>Supported formats: JPG, PNG, PDF</span>
          </div>
        </div>
      </div>

      {/* Uploaded Image Thumbnails Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800">
            Uploaded Documents ({images.length})
          </h2>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            <span>Add More</span>
          </button>
        </div>

        {images.length === 0 ? (
          <div className="bg-slate-100 rounded-2xl p-4 text-center text-xs text-slate-500">
            No document uploaded yet. Click above or choose sample.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {images.map((img) => (
              <div
                key={img.id}
                className="bg-white border border-slate-200 rounded-2xl p-3 flex items-center gap-3 relative shadow-2xs group"
              >
                <div className="w-14 h-16 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                  <img
                    src={img.url}
                    alt="Prescription preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/sample-prescription.jpg';
                    }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {img.name}
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {img.size} • Ready for analysis
                  </p>
                  {img.isPreset && (
                    <span className="inline-block mt-1 text-[10px] uppercase font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded">
                      Demo Prescription
                    </span>
                  )}
                </div>

                <button
                  onClick={(e) => handleRemoveImage(img.id, e)}
                  className="text-slate-400 hover:text-red-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Analyzing Simulation Overlay / Progress */}
      {analyzing && (
        <div className="bg-white border border-indigo-200 rounded-3xl p-5 shadow-md">
          <div className="flex items-center gap-3 mb-3">
            <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
            <div>
              <h4 className="font-bold text-slate-900 text-sm">
                AI Vision Processing...
              </h4>
              <p className="text-xs text-indigo-600 font-medium">
                {analysisSteps[analysisStep]}
              </p>
            </div>
          </div>

          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-500"
              style={{
                width: `${((analysisStep + 1) / analysisSteps.length) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Primary Action Button: Analyze Prescription */}
      <div className="pt-2">
        <button
          onClick={handleAnalyze}
          disabled={analyzing || images.length === 0}
          className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-slate-300 text-white font-bold text-base sm:text-lg rounded-2xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 group"
        >
          {analyzing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Analyzing Prescription...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-indigo-200" />
              <span>Analyze Prescription</span>
            </>
          )}
        </button>

        <p className="text-center text-xs text-slate-400 mt-2.5">
          Simulated optical recognition processes text and medication details safely
        </p>
      </div>
    </div>
  );
}

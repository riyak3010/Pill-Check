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
  AlertCircle,
} from 'lucide-react';
import { useMedication } from '../context/MedicationContext';
import { runPrescriptionOCR } from '../utils/prescriptionParser';

export default function ScanScreen() {
  const navigate = useNavigate();
  const { uploadedRx, setUploadedRx, setExtractedMedicines } = useMedication();
  const fileInputRef = useRef(null);

  // Initialize with uploadedRx or default sample
  const [images, setImages] = useState(() => {
    if (uploadedRx && uploadedRx.imageUrl && !uploadedRx.isPreset) {
      return [
        {
          id: 'existing-upload',
          name: uploadedRx.name || 'Uploaded_Prescription.jpg',
          size: '1.2 MB',
          url: uploadedRx.imageUrl,
          isPreset: false,
          file: null,
        },
      ];
    }
    return [
      {
        id: 'default-img',
        name: 'Prescription_Dr_Miller.jpg',
        size: '1.4 MB',
        url: '/sample-prescription.jpg',
        isPreset: true,
        file: null,
      },
    ];
  });

  const [activeImageId, setActiveImageId] = useState(images[0]?.id);
  const [isDragging, setIsDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState('Initializing OCR vision engine...');
  const [progressPercent, setProgressPercent] = useState(15);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newImgs = files.map((file, idx) => ({
      id: `upload-${Date.now()}-${idx}`,
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      url: URL.createObjectURL(file),
      isPreset: false,
      file: file,
    }));

    setImages(newImgs);
    setActiveImageId(newImgs[0].id);
  };

  const handleRemoveImage = (id, e) => {
    e.stopPropagation();
    const updated = images.filter((img) => img.id !== id);
    setImages(updated);
    if (activeImageId === id && updated.length > 0) {
      setActiveImageId(updated[0].id);
    }
  };

  const handleUsePreset = () => {
    const presetItem = {
      id: `preset-${Date.now()}`,
      name: 'Prescription_Dr_Miller.jpg',
      size: '1.4 MB',
      url: '/sample-prescription.jpg',
      isPreset: true,
      file: null,
    };
    setImages([presetItem]);
    setActiveImageId(presetItem.id);
  };

  const handleAnalyze = async () => {
    const targetImage = images.find((img) => img.id === activeImageId) || images[0];
    if (!targetImage) return;

    setAnalyzing(true);
    setProgressPercent(20);
    setAnalysisStatus('Scanning document & enhancing optical contrast...');

    // Progress increments
    const progressTimer = setInterval(() => {
      setProgressPercent((prev) => {
        if (prev < 40) {
          setAnalysisStatus('Extracting prescription text from uploaded image...');
          return prev + 15;
        } else if (prev < 75) {
          setAnalysisStatus('Parsing medication names, strengths, and instructions...');
          return prev + 15;
        } else if (prev < 90) {
          setAnalysisStatus('Cross-referencing drug database & checking optical confidence...');
          return prev + 5;
        }
        return prev;
      });
    }, 450);

    try {
      const ocrResult = await runPrescriptionOCR(
        targetImage.file || targetImage.url,
        {
          name: targetImage.name,
          isPreset: targetImage.isPreset,
        }
      );

      clearInterval(progressTimer);
      setProgressPercent(100);
      setAnalysisStatus('Extraction complete! Preparing results...');

      // Save processed metadata and extracted medicines into context
      setUploadedRx({
        imageUrl: targetImage.url,
        name: targetImage.name,
        doctor: ocrResult.doctor,
        rawText: ocrResult.rawText,
        confidence: ocrResult.confidence,
        mode: ocrResult.mode,
        statusMessage: ocrResult.statusMessage,
        isPreset: targetImage.isPreset,
      });

      setExtractedMedicines(ocrResult.medicines);

      setTimeout(() => {
        setAnalyzing(false);
        navigate('/extracted');
      }, 500);
    } catch (err) {
      clearInterval(progressTimer);
      console.error('OCR analysis error:', err);
      setAnalyzing(false);
      navigate('/extracted');
    }
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
        className={`relative border-2 border-dashed rounded-3xl p-7 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50/70 scale-[0.99]'
            : 'border-slate-300 bg-white hover:border-indigo-400 hover:bg-slate-50/60 shadow-2xs'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*, application/pdf"
          className="hidden"
          onChange={handleFileSelect}
        />

        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 shadow-2xs ring-6 ring-indigo-50/50">
            <Camera className="w-8 h-8" />
          </div>

          <h3 className="font-bold text-base sm:text-lg text-slate-900">
            Click to upload prescription image
          </h3>
          <p className="text-sm font-medium text-slate-500 mt-0.5">
            or drag and drop your photo or file here
          </p>

          <div className="mt-3.5 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
            <FileText className="w-3.5 h-3.5" />
            <span>Supported: JPG, PNG, PDF</span>
          </div>
        </div>
      </div>

      {/* Uploaded Documents List & Presets */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800">
            Active Prescription Document ({images.length})
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={handleUsePreset}
              className="text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
            >
              Load Demo Rx
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>Upload New</span>
            </button>
          </div>
        </div>

        {images.length === 0 ? (
          <div className="bg-slate-100 rounded-2xl p-4 text-center text-xs text-slate-500">
            No document selected. Click above to upload your prescription.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {images.map((img) => (
              <div
                key={img.id}
                className={`bg-white border rounded-2xl p-3.5 flex items-center gap-3.5 relative shadow-2xs transition-all ${
                  activeImageId === img.id
                    ? 'border-indigo-400 ring-2 ring-indigo-100'
                    : 'border-slate-200'
                }`}
              >
                <div className="w-16 h-20 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shrink-0">
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
                    <FileCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {img.name}
                    </p>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {img.size} • Ready for OCR processing
                  </p>
                  {img.isPreset ? (
                    <span className="inline-block mt-1.5 text-[10px] uppercase font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
                      Demo Preset Prescription
                    </span>
                  ) : (
                    <span className="inline-block mt-1.5 text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                      Uploaded Custom Image
                    </span>
                  )}
                </div>

                <button
                  onClick={(e) => handleRemoveImage(img.id, e)}
                  className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
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
        <div className="bg-white border-2 border-indigo-200 rounded-3xl p-5 shadow-md">
          <div className="flex items-center gap-3 mb-3">
            <Loader2 className="w-6 h-6 text-indigo-600 animate-spin shrink-0" />
            <div>
              <h4 className="font-bold text-slate-900 text-sm">
                Optical Document Processing...
              </h4>
              <p className="text-xs text-indigo-600 font-medium">
                {analysisStatus}
              </p>
            </div>
          </div>

          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
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
              <span>Processing Prescription...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-indigo-200" />
              <span>Analyze Prescription</span>
            </>
          )}
        </button>

        <p className="text-center text-xs text-slate-400 mt-2.5">
          Processes text directly from your uploaded image
        </p>
      </div>
    </div>
  );
}

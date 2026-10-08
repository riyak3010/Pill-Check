import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_USER,
  INITIAL_MEDICINES,
  INITIAL_SCHEDULE,
  SAFETY_CHECK_DATA,
  SAMPLE_PRESCRIPTIONS,
} from '../data/demoData';
import { evaluateSafetyForMedicines, generateScheduleFromMedicines } from '../utils/safetyChecker';

const MedicationContext = createContext(null);

const STORAGE_KEYS = {
  USER: 'pillcheck_user_v1',
  MEDICINES: 'pillcheck_medicines_v1',
  SCHEDULE: 'pillcheck_schedule_v1',
  UPLOADED_RX: 'pillcheck_rx_v1',
  EXTRACTED: 'pillcheck_extracted_v1',
};

export function MedicationProvider({ children }) {
  // 1. User state
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });

  // 2. Medicines state (Confirmed active medications)
  const [medicines, setMedicines] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MEDICINES);
      return saved ? JSON.parse(saved) : INITIAL_MEDICINES;
    } catch {
      return INITIAL_MEDICINES;
    }
  });

  // 3. Extracted medicines state (Candidate medicines from current scan before/after confirmation)
  const [extractedMedicines, setExtractedMedicines] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EXTRACTED);
      return saved ? JSON.parse(saved) : INITIAL_MEDICINES;
    } catch {
      return INITIAL_MEDICINES;
    }
  });

  // 4. Schedule state
  const [schedule, setSchedule] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SCHEDULE);
      return saved ? JSON.parse(saved) : INITIAL_SCHEDULE;
    } catch {
      return INITIAL_SCHEDULE;
    }
  });

  // 5. Uploaded prescription image metadata
  const [uploadedRx, setUploadedRx] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.UPLOADED_RX);
      return saved
        ? JSON.parse(saved)
        : {
            ...SAMPLE_PRESCRIPTIONS[0],
            confidence: 96,
            mode: 'Preset Sample',
            statusMessage: 'Preset Demo Prescription (Pre-verified)',
            isPreset: true,
          };
    } catch {
      return {
        ...SAMPLE_PRESCRIPTIONS[0],
        confidence: 96,
        mode: 'Preset Sample',
        statusMessage: 'Preset Demo Prescription (Pre-verified)',
        isPreset: true,
      };
    }
  });

  // 6. Dynamic Safety check data based on active medicines
  const [safetyData, setSafetyData] = useState(() => evaluateSafetyForMedicines(INITIAL_MEDICINES));

  // 7. Active reminder popup modal state
  const [reminderModalOpen, setReminderModalOpen] = useState(false);
  const [activeReminderDoseId, setActiveReminderDoseId] = useState('dose-2');

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEDICINES, JSON.stringify(medicines));
    setSafetyData(evaluateSafetyForMedicines(medicines));
  }, [medicines]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EXTRACTED, JSON.stringify(extractedMedicines));
  }, [extractedMedicines]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(schedule));
  }, [schedule]);

  useEffect(() => {
    if (uploadedRx) {
      localStorage.setItem(STORAGE_KEYS.UPLOADED_RX, JSON.stringify(uploadedRx));
    }
  }, [uploadedRx]);

  // Actions
  const updateUser = (fields) => {
    setUser((prev) => ({ ...prev, ...fields }));
  };

  const updateMedicine = (id, updatedFields) => {
    setMedicines((prev) =>
      prev.map((med) => (med.id === id ? { ...med, ...updatedFields } : med))
    );
    setExtractedMedicines((prev) =>
      prev.map((med) => (med.id === id ? { ...med, ...updatedFields } : med))
    );
    setSchedule((prev) =>
      prev.map((dose) => {
        if (dose.medicineId === id) {
          return {
            ...dose,
            name: updatedFields.name || dose.name,
            strength: updatedFields.strength || dose.strength,
            dosage: updatedFields.dosage || dose.dosage,
          };
        }
        return dose;
      })
    );
  };

  const updateExtractedMedicine = (id, updatedFields) => {
    setExtractedMedicines((prev) =>
      prev.map((med) => (med.id === id ? { ...med, ...updatedFields } : med))
    );
  };

  const addExtractedMedicine = (newMed) => {
    setExtractedMedicines((prev) => [...prev, newMed]);
  };

  const removeExtractedMedicine = (id) => {
    setExtractedMedicines((prev) => prev.filter((m) => m.id !== id));
  };

  // Called on Extracted screen when user clicks "Confirm Medicines"
  const confirmExtractedMedicines = (confirmedList) => {
    const listToUse = confirmedList || extractedMedicines;
    setMedicines(listToUse);

    // Regenerate schedule dynamically matching confirmed medications
    const newSchedule = generateScheduleFromMedicines(listToUse);
    setSchedule(newSchedule);

    // Evaluate dynamic safety
    const newSafety = evaluateSafetyForMedicines(listToUse);
    setSafetyData(newSafety);
  };

  const markDoseStatus = (doseId, status) => {
    setSchedule((prev) =>
      prev.map((dose) => {
        if (dose.id === doseId) {
          const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          return {
            ...dose,
            status,
            takenAt: status === 'taken' ? nowStr : null,
          };
        }
        return dose;
      })
    );
  };

  const updateReminderTime = (doseId, newTime) => {
    setSchedule((prev) =>
      prev.map((dose) => (dose.id === doseId ? { ...dose, time: newTime } : dose))
    );
  };

  const snoozeDose = (doseId, minutes = 10) => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + minutes);
    const snoozeTimeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setSchedule((prev) =>
      prev.map((dose) =>
        dose.id === doseId ? { ...dose, snoozedUntil: snoozeTimeStr } : dose
      )
    );
  };

  const openReminderModal = (doseId = 'dose-2') => {
    setActiveReminderDoseId(doseId);
    setReminderModalOpen(true);
  };

  const closeReminderModal = () => {
    setReminderModalOpen(false);
  };

  const resetAllData = () => {
    setUser(INITIAL_USER);
    setMedicines(INITIAL_MEDICINES);
    setExtractedMedicines(INITIAL_MEDICINES);
    setSchedule(INITIAL_SCHEDULE);
    const defaultRx = {
      ...SAMPLE_PRESCRIPTIONS[0],
      confidence: 96,
      mode: 'Preset Sample',
      statusMessage: 'Preset Demo Prescription (Pre-verified)',
      isPreset: true,
    };
    setUploadedRx(defaultRx);
    setSafetyData(evaluateSafetyForMedicines(INITIAL_MEDICINES));
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.MEDICINES);
    localStorage.removeItem(STORAGE_KEYS.SCHEDULE);
    localStorage.removeItem(STORAGE_KEYS.UPLOADED_RX);
    localStorage.removeItem(STORAGE_KEYS.EXTRACTED);
  };

  const activeReminderDose =
    schedule.find((d) => d.id === activeReminderDoseId) || schedule[0];

  return (
    <MedicationContext.Provider
      value={{
        user,
        updateUser,
        medicines,
        updateMedicine,
        extractedMedicines,
        setExtractedMedicines,
        updateExtractedMedicine,
        addExtractedMedicine,
        removeExtractedMedicine,
        confirmExtractedMedicines,
        schedule,
        markDoseStatus,
        updateReminderTime,
        snoozeDose,
        uploadedRx,
        setUploadedRx,
        safetyData,
        reminderModalOpen,
        activeReminderDose,
        openReminderModal,
        closeReminderModal,
        resetAllData,
      }}
    >
      {children}
    </MedicationContext.Provider>
  );
}

export function useMedication() {
  const context = useContext(MedicationContext);
  if (!context) {
    throw new Error('useMedication must be used within a MedicationProvider');
  }
  return context;
}

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_USER,
  INITIAL_MEDICINES,
  INITIAL_SCHEDULE,
  SAFETY_CHECK_DATA,
  SAMPLE_PRESCRIPTIONS,
} from '../data/demoData';

const MedicationContext = createContext(null);

const STORAGE_KEYS = {
  USER: 'pillcheck_user_v1',
  MEDICINES: 'pillcheck_medicines_v1',
  SCHEDULE: 'pillcheck_schedule_v1',
  UPLOADED_RX: 'pillcheck_rx_v1',
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

  // 2. Medicines state
  const [medicines, setMedicines] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MEDICINES);
      return saved ? JSON.parse(saved) : INITIAL_MEDICINES;
    } catch {
      return INITIAL_MEDICINES;
    }
  });

  // 3. Schedule state
  const [schedule, setSchedule] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SCHEDULE);
      return saved ? JSON.parse(saved) : INITIAL_SCHEDULE;
    } catch {
      return INITIAL_SCHEDULE;
    }
  });

  // 4. Uploaded prescription image state
  const [uploadedRx, setUploadedRx] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.UPLOADED_RX);
      return saved ? JSON.parse(saved) : SAMPLE_PRESCRIPTIONS[0];
    } catch {
      return SAMPLE_PRESCRIPTIONS[0];
    }
  });

  // 5. Active reminder popup modal state
  const [reminderModalOpen, setReminderModalOpen] = useState(false);
  const [activeReminderDoseId, setActiveReminderDoseId] = useState('dose-2');

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEDICINES, JSON.stringify(medicines));
  }, [medicines]);

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
    // Also sync medicine name/strength into schedule if updated
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
    setSchedule(INITIAL_SCHEDULE);
    setUploadedRx(SAMPLE_PRESCRIPTIONS[0]);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.MEDICINES);
    localStorage.removeItem(STORAGE_KEYS.SCHEDULE);
    localStorage.removeItem(STORAGE_KEYS.UPLOADED_RX);
  };

  const activeReminderDose =
    schedule.find((d) => d.id === activeReminderDoseId) || schedule[1] || schedule[0];

  return (
    <MedicationContext.Provider
      value={{
        user,
        updateUser,
        medicines,
        updateMedicine,
        schedule,
        markDoseStatus,
        updateReminderTime,
        snoozeDose,
        uploadedRx,
        setUploadedRx,
        safetyData: SAFETY_CHECK_DATA,
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

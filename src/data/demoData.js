// Centralized demo data for Pill Check Hackathon MVP

export const INITIAL_USER = {
  name: "Robert Smith",
  phone: "+1 (555) 234-5678",
  age: 68,
  allergies: "Penicillin (Mild rash noted in 2021)",
  conditions: "Mild acid reflux, seasonal allergies",
  caregiverName: "Sarah Smith (Daughter)",
  caregiverPhone: "+1 (555) 987-6543",
  reminderPreferences: {
    sound: true,
    vibrate: true,
    earlyAlert: 5, // minutes before
    snoozeDuration: 10, // minutes
  },
};

export const INITIAL_MEDICINES = [
  {
    id: "med-amox",
    name: "Amoxicillin",
    strength: "500 mg",
    dosage: "1 tablet",
    frequency: "Twice daily",
    timing: "After food",
    badge: "Antibiotic",
    color: "purple",
    purpose: "Bacterial infection treatment",
    prescribedBy: "Dr. Sarah Miller, MD",
    instructions: "Take with a full glass of water after food. Complete the full 7-day course.",
    warnings: "Do not skip doses. Take with food to reduce stomach upset.",
  },
  {
    id: "med-ibup",
    name: "Ibuprofen",
    strength: "400 mg",
    dosage: "1 tablet",
    frequency: "Once daily",
    timing: "After food",
    badge: "Pain & Inflammation",
    color: "amber",
    purpose: "Mild pain and inflammation relief",
    prescribedBy: "Dr. Sarah Miller, MD",
    instructions: "Take with or right after food or milk to protect your stomach lining.",
    warnings: "Avoid taking on an empty stomach. Caution with other stomach-irritating meds.",
  },
  {
    id: "med-panto",
    name: "Pantoprazole",
    strength: "40 mg",
    dosage: "1 tablet",
    frequency: "Once daily",
    timing: "Before food",
    badge: "Stomach Protection",
    color: "teal",
    purpose: "Reduces stomach acid & protects stomach lining",
    prescribedBy: "Dr. Sarah Miller, MD",
    instructions: "Swallow whole with water 30 minutes before breakfast. Do not crush or chew.",
    warnings: "Take regularly before the first meal of the day.",
  },
];

export const INITIAL_SCHEDULE = [
  {
    id: "dose-1",
    time: "8:00 AM",
    medicineId: "med-panto",
    name: "Pantoprazole",
    strength: "40 mg",
    dosage: "1 tablet",
    timing: "Before breakfast",
    status: "taken", // 'taken' | 'missed' | 'pending'
    takenAt: "8:05 AM",
    snoozedUntil: null,
  },
  {
    id: "dose-2",
    time: "2:00 PM",
    medicineId: "med-amox",
    name: "Amoxicillin",
    strength: "500 mg",
    dosage: "1 tablet",
    timing: "After lunch",
    status: "pending",
    takenAt: null,
    snoozedUntil: null,
  },
  {
    id: "dose-3",
    time: "8:00 PM",
    medicineId: "med-amox",
    name: "Amoxicillin",
    strength: "500 mg",
    dosage: "1 tablet",
    timing: "After dinner",
    status: "pending",
    takenAt: null,
    snoozedUntil: null,
  },
  {
    id: "dose-4",
    time: "8:00 PM",
    medicineId: "med-ibup",
    name: "Ibuprofen",
    strength: "400 mg",
    dosage: "1 tablet",
    timing: "After dinner",
    status: "pending",
    takenAt: null,
    snoozedUntil: null,
  },
];

export const SAFETY_CHECK_DATA = {
  interactionCount: 1,
  interactions: [
    {
      id: "int-1",
      severity: "danger", // RED
      title: "Potential Interaction Found",
      drugs: ["Amoxicillin", "Ibuprofen"],
      summary: "Potential interaction / increased risk of stomach irritation and bleeding.",
      mechanism: "Both NSAIDs (Ibuprofen) and oral antibiotics (Amoxicillin) can cause gastric mucosal irritation. When taken concurrently, particularly around dinner, gastric discomfort, nausea, or mucosal irritation risk may increase.",
      recommendation: "Always take both medications with food or milk. Spacing doses or discussing protective gastro-agents with your physician is advised.",
      consultDoctor: true,
    },
  ],
  safeMedicines: [
    {
      id: "safe-1",
      severity: "safe", // GREEN
      title: "No issues found for Pantoprazole",
      medicine: "Pantoprazole 40 mg",
      summary: "No adverse drug-drug interactions detected with Amoxicillin or Ibuprofen in clinical databases.",
      note: "Pantoprazole helps decrease stomach acid and provides gastroprotective benefit.",
    },
  ],
  generalAdvice: [
    "Take medicines strictly according to your doctor's advice.",
    "Do not change or stop medication on your own without professional guidance.",
    "Consult your doctor or pharmacist for clinical confirmation of any concerns.",
  ],
  disclaimer: "SAFETY NOTICE: Pill Check checks known drug interactions against reference datasets. It does not replace professional medical judgment, diagnosis, or clinical advice. Always consult your prescribing physician or licensed pharmacist.",
};

export const SAMPLE_PRESCRIPTIONS = [
  {
    id: "rx-1",
    doctor: "Dr. Sarah Miller, MD",
    clinic: "Metro Health Clinic",
    date: "October 26, 2024",
    imageUrl: "/sample-prescription.jpg",
    previewTitle: "Dr. Miller's Rx (Amoxicillin, Ibuprofen, Pantoprazole)",
  },
];

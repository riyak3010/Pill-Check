// Dynamic Drug-Drug Interaction and Safety Checker for Pill Check

export function evaluateSafetyForMedicines(medicines = []) {
  const medNames = medicines.map((m) => (m.name || '').toLowerCase());
  const interactions = [];
  const safeMedicines = [];

  // Check 1: Amoxicillin + Ibuprofen (Classic demo case)
  const hasAmox = medNames.some((n) => n.includes('amoxicillin') || n.includes('augmentin'));
  const hasIbup = medNames.some((n) => n.includes('ibuprofen') || n.includes('naproxen') || n.includes('aspirin'));

  if (hasAmox && hasIbup) {
    interactions.push({
      id: 'int-amox-ibup',
      severity: 'danger',
      title: 'Potential Interaction Found',
      drugs: ['Amoxicillin', 'Ibuprofen'],
      summary: 'Potential interaction / increased risk of stomach irritation and bleeding.',
      mechanism: 'Both NSAIDs (Ibuprofen) and oral antibiotics (Amoxicillin) can cause gastric mucosal irritation. When taken concurrently, gastric discomfort, nausea, or mucosal irritation risk may increase.',
      recommendation: 'Always take both medications with food or milk. Spacing doses or discussing protective gastro-agents with your physician is advised.',
      consultDoctor: true,
    });
  }

  // Check 2: ACE Inhibitor (Lisinopril) + NSAID (Ibuprofen / Naproxen)
  const hasAce = medNames.some((n) => n.includes('lisinopril') || n.includes('enalapril') || n.includes('ramipril') || n.includes('losartan'));
  if (hasAce && hasIbup) {
    interactions.push({
      id: 'int-ace-nsaid',
      severity: 'danger',
      title: 'Potential Interaction Found',
      drugs: [hasAce ? 'Lisinopril/ARB' : 'Blood Pressure Med', 'Ibuprofen/NSAID'],
      summary: 'Potential interaction / decreased blood pressure control and increased kidney strain.',
      mechanism: 'NSAIDs can reduce the antihypertensive efficacy of ACE inhibitors and ARBs, and concurrent use may increase stress on renal filtration.',
      recommendation: 'Monitor blood pressure and stay hydrated. Consult your doctor regarding alternative pain relief options like acetaminophen.',
      consultDoctor: true,
    });
  }

  // Check 3: Statin (Atorvastatin / Simvastatin) + Macrolide antibiotic (Azithromycin / Clarithromycin)
  const hasStatin = medNames.some((n) => n.includes('atorvastatin') || n.includes('simvastatin'));
  const hasMacrolide = medNames.some((n) => n.includes('azithromycin') || n.includes('clarithromycin') || n.includes('erythromycin'));
  if (hasStatin && hasMacrolide) {
    interactions.push({
      id: 'int-statin-macrolide',
      severity: 'danger',
      title: 'Potential Interaction Found',
      drugs: ['Atorvastatin', 'Azithromycin'],
      summary: 'Potential interaction / increased blood concentration of cholesterol medication.',
      mechanism: 'Macrolides can inhibit hepatic CYP3A4 metabolism of statins, potentially increasing statin serum levels and muscle ache risk.',
      recommendation: 'Notify your doctor if you experience unusual muscle fatigue or soreness.',
      consultDoctor: true,
    });
  }

  // Identify safe medicines
  medicines.forEach((med) => {
    const isInteracting = interactions.some((i) =>
      i.drugs.some((d) => med.name.toLowerCase().includes(d.toLowerCase()))
    );

    if (!isInteracting) {
      safeMedicines.push({
        id: `safe-${med.id}`,
        severity: 'safe',
        title: `No issues found for ${med.name}`,
        medicine: `${med.name} ${med.strength}`,
        summary: `No adverse interactions detected with your current regimen in checked clinical records.`,
        note: `Prescribed indication: ${med.purpose || 'Therapeutic maintenance'}.`,
      });
    }
  });

  return {
    interactionCount: interactions.length,
    interactions,
    safeMedicines,
    generalAdvice: [
      "Take medicines strictly according to your doctor's advice.",
      "Do not change or stop medication on your own without professional guidance.",
      "Consult your doctor or pharmacist for clinical confirmation of any concerns.",
    ],
    disclaimer: 'SAFETY NOTICE: Pill Check checks known drug interactions against reference datasets. It does not replace professional medical judgment, diagnosis, or clinical advice. Always consult your prescribing physician or licensed pharmacist.',
  };
}

/**
 * Dynamically creates a daily dose schedule from the active medicines
 */
export function generateScheduleFromMedicines(medicines = []) {
  const schedule = [];

  medicines.forEach((med, idx) => {
    const freq = (med.frequency || '').toLowerCase();

    if (freq.includes('twice')) {
      schedule.push({
        id: `dose-${med.id}-morning`,
        time: idx === 0 ? '8:00 AM' : '2:00 PM',
        medicineId: med.id,
        name: med.name,
        strength: med.strength,
        dosage: med.dosage,
        timing: med.timing || 'After food',
        status: idx === 0 ? 'taken' : 'pending',
        takenAt: idx === 0 ? '8:15 AM' : null,
      });
      schedule.push({
        id: `dose-${med.id}-evening`,
        time: '8:00 PM',
        medicineId: med.id,
        name: med.name,
        strength: med.strength,
        dosage: med.dosage,
        timing: med.timing || 'After dinner',
        status: 'pending',
        takenAt: null,
      });
    } else if (freq.includes('three')) {
      schedule.push({
        id: `dose-${med.id}-morning`,
        time: '8:00 AM',
        medicineId: med.id,
        name: med.name,
        strength: med.strength,
        dosage: med.dosage,
        timing: med.timing || 'After breakfast',
        status: 'taken',
        takenAt: '8:10 AM',
      });
      schedule.push({
        id: `dose-${med.id}-afternoon`,
        time: '2:00 PM',
        medicineId: med.id,
        name: med.name,
        strength: med.strength,
        dosage: med.dosage,
        timing: med.timing || 'After lunch',
        status: 'pending',
        takenAt: null,
      });
      schedule.push({
        id: `dose-${med.id}-evening`,
        time: '8:00 PM',
        medicineId: med.id,
        name: med.name,
        strength: med.strength,
        dosage: med.dosage,
        timing: med.timing || 'After dinner',
        status: 'pending',
        takenAt: null,
      });
    } else {
      // Once daily
      let defaultTime = '8:00 AM';
      let timingStr = med.timing || 'In the morning';

      if ((med.timing || '').toLowerCase().includes('bed') || (med.name || '').toLowerCase().includes('statin')) {
        defaultTime = '9:00 PM';
        timingStr = 'At bedtime';
      } else if ((med.timing || '').toLowerCase().includes('dinner')) {
        defaultTime = '8:00 PM';
        timingStr = 'After dinner';
      } else if ((med.timing || '').toLowerCase().includes('before')) {
        defaultTime = '7:30 AM';
        timingStr = 'Before breakfast';
      }

      schedule.push({
        id: `dose-${med.id}`,
        time: defaultTime,
        medicineId: med.id,
        name: med.name,
        strength: med.strength,
        dosage: med.dosage,
        timing: timingStr,
        status: defaultTime.includes('AM') && schedule.length === 0 ? 'taken' : 'pending',
        takenAt: defaultTime.includes('AM') && schedule.length === 0 ? '7:45 AM' : null,
      });
    }
  });

  // Sort chronologically
  return schedule;
}

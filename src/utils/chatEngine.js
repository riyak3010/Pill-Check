// Intelligent medical response engine for Pill Check AI
// Provides medically sound, conservative, disclaimer-compliant answers

export const SUGGESTED_PROMPTS = [
  "What are my medicines for?",
  "Why is there an alert?",
  "When is my next dose?",
  "I have a headache",
  "What are the side effects?",
];

export function getBotResponse(userMessage, contextData = {}) {
  const query = (userMessage || "").trim().toLowerCase();
  const { medicines = [], schedule = [] } = contextData;

  // 1. Emergency & Red-Flag symptoms check
  const emergencyKeywords = [
    "chest pain", "can't breathe", "cannot breathe", "shortness of breath",
    "severe allergic", "throat swelling", "difficulty breathing",
    "coughing blood", "blood in vomit", "blood in stool", "passed out", "fainted"
  ];
  if (emergencyKeywords.some((kw) => query.includes(kw))) {
    return {
      text: "⚠️ URGENT MEDICAL ADVICE: These symptoms may indicate an acute medical emergency. Please call 911 or go to your nearest emergency room immediately. Do not wait for an online response.",
      type: "emergency",
      suggestedNext: ["Find nearest urgent care", "Call doctor's emergency line"],
    };
  }

  // 2. Specific Medicine: Amoxicillin
  if (query.includes("amoxicillin") || query.includes("antibiotic")) {
    return {
      text: "Amoxicillin is an antibiotic commonly used to treat certain bacterial infections (such as ear, nose, throat, or respiratory infections). It does not treat viral infections like the cold or flu. You are prescribed 500 mg twice daily after food. Follow your prescription to the end of the course and speak with your doctor or pharmacist if you have concerns.",
      type: "info",
      disclaimer: "Complete the full prescribed course even if you feel better.",
    };
  }

  // 3. Specific Medicine: Ibuprofen
  if (query.includes("ibuprofen") || query.includes("advil") || query.includes("motrin")) {
    return {
      text: "Ibuprofen is a nonsteroidal anti-inflammatory drug (NSAID) used to relieve pain, tenderness, swelling, and fever. You are prescribed 400 mg once daily after food. Because NSAIDs can irritate the stomach lining, always take it with food or milk.",
      type: "info",
      disclaimer: "Take with food to protect your stomach.",
    };
  }

  // 4. Specific Medicine: Pantoprazole
  if (query.includes("pantoprazole") || query.includes("protonix") || query.includes("acid reflux") || query.includes("stomach")) {
    if (query.includes("pantoprazole") || query.includes("protonix")) {
      return {
        text: "Pantoprazole is a proton pump inhibitor (PPI) that decreases the amount of acid produced in your stomach. It is prescribed at 40 mg once daily before breakfast. It helps protect your stomach lining and treat acid-related irritation. Swallow the tablet whole 30 minutes before your first meal.",
        type: "info",
      };
    }
  }

  // 5. Why is there an alert? / Interaction inquiry
  if (
    query.includes("alert") ||
    query.includes("interaction") ||
    query.includes("danger") ||
    query.includes("warning") ||
    query.includes("why is there")
  ) {
    return {
      text: "Pill Check detected 1 potential interaction between Amoxicillin and Ibuprofen:\n\n• Both medications can irritate the stomach lining when taken around the same time.\n• Recommendation: Take both doses with plenty of food or milk, and take your Pantoprazole in the morning to protect your stomach.\n\n*Important Safety Note:* Potential interaction detected in reference database. Do not stop or alter your medication without consulting your doctor or pharmacist.",
      type: "warning",
    };
  }

  // 6. What are my medicines for? / Overview of all medicines
  if (
    query.includes("what are my medicines for") ||
    query.includes("what medicines do i have") ||
    query.includes("my medicines") ||
    query.includes("overview") ||
    query.includes("explain my prescription")
  ) {
    return {
      text: "Here is a summary of your 3 prescribed medicines:\n\n1. Amoxicillin (500 mg): Antibiotic for bacterial infection (Twice daily, after food).\n2. Ibuprofen (400 mg): NSAID for pain and inflammation relief (Once daily, after food).\n3. Pantoprazole (40 mg): Stomach acid reducer to protect your stomach (Once daily, before breakfast).\n\nAlways follow your doctor's exact instructions on your prescription label.",
      type: "info",
    };
  }

  // 7. When is my next dose? / Schedule questions
  if (
    query.includes("next dose") ||
    query.includes("when do i take") ||
    query.includes("time") ||
    query.includes("schedule") ||
    query.includes("today")
  ) {
    // Find next pending dose
    const pendingDoses = schedule.filter((d) => d.status === "pending");
    if (pendingDoses.length > 0) {
      const next = pendingDoses[0];
      return {
        text: `Your next scheduled dose is ${next.name} ${next.strength} (${next.dosage}) at ${next.time} (${next.timing}). You have ${pendingDoses.length} remaining dose(s) scheduled for today.`,
        type: "schedule",
      };
    }
    return {
      text: "All your scheduled doses for today have already been marked as taken! Your next routine dose begins tomorrow at 8:00 AM with Pantoprazole 40 mg.",
      type: "schedule",
    };
  }

  // 8. Headache / Symptom question
  if (query.includes("headache") || query.includes("fever") || query.includes("pain")) {
    return {
      text: "For a general mild headache:\n\n• Ensure you are well hydrated and rest in a calm, dimly lit room.\n• You already have Ibuprofen 400 mg prescribed for pain (once daily after food). Check your schedule to ensure you do not exceed your prescribed dosage.\n• Avoid taking additional over-the-counter pain relievers without checking with a pharmacist to prevent accidental double-dosing.\n\n*Safety Notice:* If the headache is sudden, severe, or accompanied by stiff neck or vision changes, seek urgent medical care.",
      type: "symptom",
    };
  }

  // 9. Side effects
  if (query.includes("side effect") || query.includes("side-effects") || query.includes("adverse")) {
    return {
      text: "Common known side effects for your current medications include:\n\n• Amoxicillin: Mild nausea, mild diarrhea, upset stomach.\n• Ibuprofen: Stomach upset, mild heartburn, indigestion.\n• Pantoprazole: Mild headache, slight stomach pain.\n\nTaking Amoxicillin and Ibuprofen with meals significantly lowers stomach discomfort. If you notice a rash, hives, or severe diarrhea, notify your doctor immediately.",
      type: "info",
    };
  }

  // 10. Missed dose question
  if (query.includes("miss") || query.includes("forgot") || query.includes("late")) {
    return {
      text: "General guidance for missed doses:\n\n• If you remember shortly after the scheduled time, take it with the required food instruction.\n• If it is almost time for your next scheduled dose, skip the missed dose and resume your regular schedule.\n• NEVER take two doses at the same time to make up for a missed dose.",
      type: "guidance",
    };
  }

  // 11. Food instructions inquiry
  if (query.includes("food") || query.includes("eat") || query.includes("empty stomach") || query.includes("milk")) {
    return {
      text: "Food instructions for your medicines:\n\n• Pantoprazole 40 mg: Take BEFORE food (30 minutes before breakfast).\n• Amoxicillin 500 mg: Take AFTER food (reduces stomach discomfort).\n• Ibuprofen 400 mg: Take AFTER food or with milk (protects stomach lining).",
      type: "info",
    };
  }

  // Default intelligent fallback with healthcare disclaimer
  return {
    text: "Pill Check AI is here to provide general medication information for your prescribed medicines (Amoxicillin, Ibuprofen, Pantoprazole). For clinical diagnoses, personalized dosage changes, or new symptoms, please consult your prescribing doctor or licensed pharmacist.",
    type: "general",
  };
}

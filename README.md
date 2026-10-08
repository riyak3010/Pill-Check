# PILL CHECK 💊
> **“Scan. Check. Stay Safe.”** — Your simple medication safety assistant.

---

## 🌟 Hackathon MVP Overview
**Pill Check** is a demo-ready, senior-friendly medication safety application built in a 90-minute hackathon sprint. It empowers patients and caregivers to scan doctor prescriptions, instantly review extracted medicines, detect critical drug-drug interactions, organize daily dose timelines, manage notification reminders, and consult a dedicated AI assistant.

---

## 🚀 Key Features & Screen Flow (0 – 10)

1. **0. Splash / Welcome** (`/` or `/welcome`)
   - Logo and brand tagline: *“Scan. Check. Stay Safe.”*
   - Subtitle: *“Your simple medication safety assistant”*
   - Friendly elderly couple illustration
   - Primary **“Get Started →”** button with onboarding indicator dots.

2. **1. Login / Onboarding** (`/login`)
   - Senior-friendly onboarding without passwords or friction.
   - Saves Patient Name (`Robert Smith`) and Mobile Number locally.

3. **2. Home Dashboard** (`/dashboard`)
   - Personalized greeting (`Good Morning, Robert!`).
   - Daily adherence progress bar (`1 of 4 doses taken`).
   - Next Dose Card (`Amoxicillin 500 mg at 2:00 PM • After lunch`).
   - Red Safety Alert Banner for detected drug interactions.
   - Primary quick actions: **Scan Prescription**, **Ask Pill Check AI**, **View Schedule**.

4. **3. Scan Prescription** (`/scan`)
   - Drag-and-drop file uploader and sample doctor prescription preset (*Dr. Sarah Miller, MD*).
   - Multi-step OCR visual processing animation simulating text extraction.

5. **4. Extracted Medicines** (`/extracted`)
   - Shows detected medications:
     1. **Amoxicillin 500 mg** (1 tablet • Twice daily • After food)
     2. **Ibuprofen 400 mg** (1 tablet • Once daily • After food)
     3. **Pantoprazole 40 mg** (1 tablet • Once daily • Before food)
   - Interactive editing modal for medicine details.
   - **“Confirm Medicines →”** triggers the Safety Check.

6. **5. Safety Check** (`/safety`)
   - **RED Alert**: *“1 Potential Interaction Found: Amoxicillin + Ibuprofen”* (increased risk of stomach irritation and bleeding). Includes expandable clinical mechanism and advice.
   - **GREEN Safe Card**: *“No issues found for Pantoprazole”* (safe gastric protection).
   - **YELLOW Card**: *General Advice* on medical compliance.
   - Regulatory medical disclaimers strictly adhered to.

7. **6. Medication Schedule** (`/schedule`)
   - Clean vertical daily timeline:
     - 8:00 AM — Pantoprazole 40 mg [✓ Taken]
     - 2:00 PM — Amoxicillin 500 mg [Take / Mark Taken / Missed]
     - 8:00 PM — Amoxicillin 500 mg [Change time]
     - 8:00 PM — Ibuprofen 400 mg [Change time]
   - Live dose tracking with Undo support.

8. **7. Change Reminder Time** (`/change-reminder/:id`)
   - Time editor with hour, minute, and AM/PM pickers.
   - Prescription frequency lock notice protecting doctor orders.
   - Saves new reminder time immediately into schedule state and `localStorage`.

9. **8. Medicine Reminder** (`/reminder`)
   - Simulated audio/visual notification alarm.
   - 🔔 *“Medicine Time! Amoxicillin 500 mg”*.
   - **“Taken”** logs the dose immediately.
   - **“Snooze 10 min”** shifts alarm display forward by 10 minutes.

10. **9. AI Chatbot** (`/chat`)
    - Unified **“Pill Check AI”** conversational assistant.
    - Quick prompt chips:
      - *“What are my medicines for?”*
      - *“Why is there an alert?”*
      - *“When is my next dose?”*
      - *“I have a headache”*
      - *“What are the side effects?”*
    - Intelligent triage logic, interaction explanations, and emergency symptom warnings.

11. **10. Profile & Settings** (`/profile`)
    - Personal info, drug allergies (*Penicillin*), chronic conditions, reminder sound/vibrate preferences, and caregiver contacts.
    - One-click **Reset All Demo Data** for presentation reset.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS (Light mode only, clean healthcare aesthetic, soft lavender/indigo brand `#5B4BF5`)
- **Icons**: Lucide React
- **Routing**: React Router DOM (v7)
- **State Management**: Centralized React Context (`MedicationContext`) with persistent `localStorage` synchronization
- **Zero External API Dependency**: 100% self-contained for offline/demo reliability.

---

## 💻 Local Development

```bash
# 1. Clone repository
git clone <repo-url>
cd pill-check

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Build production bundle
npm run build
```

---

## 🌐 Deployment Target: Vercel

The application is pre-configured for instant Vercel deployment:
- Includes `vercel.json` SPA URL rewrites to prevent 404s on deep links.
- Uses standard Vite build output (`dist/`).
- Zero hardcoded localhost URLs.

---

## ⚖️ Medical Safety Notice
Pill Check is designed as an educational assistant and reference checker. It does not replace professional clinical diagnosis, prescription alterations, or healthcare provider consultations.

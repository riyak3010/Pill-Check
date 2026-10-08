import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { MedicationProvider } from './context/MedicationContext';
import Layout from './components/Layout';

// Screens
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import ScanScreen from './screens/ScanScreen';
import ExtractedScreen from './screens/ExtractedScreen';
import SafetyScreen from './screens/SafetyScreen';
import ScheduleScreen from './screens/ScheduleScreen';
import ChangeReminderScreen from './screens/ChangeReminderScreen';
import ReminderScreen from './screens/ReminderScreen';
import ChatScreen from './screens/ChatScreen';
import ProfileScreen from './screens/ProfileScreen';

// Helper to scroll to top on every navigation
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <MedicationProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<Layout />}>
            {/* 0. Splash / Welcome */}
            <Route path="/" element={<SplashScreen />} />
            <Route path="/welcome" element={<SplashScreen />} />

            {/* 1. Login / Onboarding */}
            <Route path="/login" element={<LoginScreen />} />

            {/* 2. Home Dashboard */}
            <Route path="/dashboard" element={<DashboardScreen />} />

            {/* 3. Scan Prescription */}
            <Route path="/scan" element={<ScanScreen />} />

            {/* 4. Extracted Medicines */}
            <Route path="/extracted" element={<ExtractedScreen />} />

            {/* 5. Safety Check */}
            <Route path="/safety" element={<SafetyScreen />} />

            {/* 6. Medication Schedule */}
            <Route path="/schedule" element={<ScheduleScreen />} />

            {/* 7. Change Reminder Time */}
            <Route path="/change-reminder/:id" element={<ChangeReminderScreen />} />
            <Route path="/change-reminder" element={<ChangeReminderScreen />} />

            {/* 8. Medicine Reminder */}
            <Route path="/reminder" element={<ReminderScreen />} />

            {/* 9. AI Chatbot */}
            <Route path="/chat" element={<ChatScreen />} />

            {/* 10. Profile & Settings */}
            <Route path="/profile" element={<ProfileScreen />} />

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MedicationProvider>
  );
}

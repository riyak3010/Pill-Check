import React from 'react';
import { Outlet } from 'react-router-dom';
import TopHeader from './TopHeader';
import BottomNav from './BottomNav';
import DemoFlowBar from './DemoFlowBar';
import ReminderModal from './ReminderModal';

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-indigo-100 selection:text-indigo-800">
      {/* 90-Minute Hackathon Demo Flow Quick Jumper */}
      <DemoFlowBar />

      {/* Main App Header */}
      <TopHeader />

      {/* Main View Area */}
      <main className="flex-1 w-full max-w-md mx-auto pb-24 md:max-w-2xl px-4 pt-4 sm:pt-6">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Global Simulated Reminder Modal */}
      <ReminderModal />
    </div>
  );
}

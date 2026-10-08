import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, CalendarClock, ScanLine, MessageSquareText, User } from 'lucide-react';

export default function BottomNav() {
  const location = useLocation();

  // Hide on Welcome/Splash and Login screen
  if (
    location.pathname === '/' ||
    location.pathname === '/welcome' ||
    location.pathname === '/login'
  ) {
    return null;
  }

  const navItems = [
    { to: '/dashboard', label: 'Home', icon: Home },
    { to: '/schedule', label: 'Schedule', icon: CalendarClock },
    { to: '/scan', label: 'Scan Rx', icon: ScanLine, isPrimary: true },
    { to: '/chat', label: 'AI Chat', icon: MessageSquareText },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg">
      <div className="max-w-md mx-auto px-4 py-2 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;

          if (item.isPrimary) {
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center -mt-6 group focus:outline-none`}
              >
                <div
                  className={`w-13 h-13 rounded-full flex items-center justify-center p-3 text-white shadow-md transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-700 ring-4 ring-indigo-100 scale-105'
                      : 'bg-indigo-600 hover:bg-indigo-700 group-hover:scale-105'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <span
                  className={`text-[11px] font-semibold mt-1 transition-colors ${
                    isActive ? 'text-indigo-600' : 'text-slate-600'
                  }`}
                >
                  {item.label}
                </span>
              </NavLink>
            );
          }

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all duration-150 ${
                isActive
                  ? 'text-indigo-600 font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                )}
              </div>
              <span className="text-[11px] mt-1">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

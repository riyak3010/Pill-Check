import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Layers, ChevronDown, ChevronUp } from 'lucide-react';

const STEPS = [
  { id: '0', path: '/', label: '0. Welcome' },
  { id: '1', path: '/login', label: '1. Login' },
  { id: '2', path: '/dashboard', label: '2. Dashboard' },
  { id: '3', path: '/scan', label: '3. Scan' },
  { id: '4', path: '/extracted', label: '4. Extracted' },
  { id: '5', path: '/safety', label: '5. Safety' },
  { id: '6', path: '/schedule', label: '6. Schedule' },
  { id: '7', path: '/change-reminder/dose-3', label: '7. Change Time' },
  { id: '8', path: '/reminder', label: '8. Reminder' },
  { id: '9', path: '/chat', label: '9. AI Chat' },
  { id: '10', path: '/profile', label: '10. Profile' },
];

export default function DemoFlowBar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="bg-slate-900 text-slate-100 text-xs border-b border-slate-800 z-40 sticky top-0 shadow-sm print:hidden">
      <div className="max-w-4xl mx-auto px-3 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-semibold tracking-wide text-slate-200">
            Hackathon Demo Flow:
          </span>
          <span className="text-[11px] text-slate-400 hidden md:inline">
            (90-Min MVP • 0 to 10 Sequential Steps)
          </span>
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-1 text-slate-400 hover:text-white px-2 py-0.5 rounded transition-colors"
          title={collapsed ? "Show all steps" : "Hide steps"}
        >
          <span className="text-[11px] font-medium">{collapsed ? 'Show Steps' : 'Collapse'}</span>
          {collapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>
      </div>

      {!collapsed && (
        <div className="max-w-4xl mx-auto px-3 pb-2 pt-0.5 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 min-w-max">
            {STEPS.map((step) => {
              const isActive =
                step.path === '/'
                  ? location.pathname === '/' || location.pathname === '/welcome'
                  : location.pathname.startsWith(step.path.split('/')[1] ? `/${step.path.split('/')[1]}` : step.path);

              return (
                <NavLink
                  key={step.id}
                  to={step.path}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white font-semibold shadow-sm ring-1 ring-indigo-400'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {step.label}
                </NavLink>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

import React from 'react';
import {
  LayoutDashboard,
  Users,
  Building2,
  Target,
  Sparkles
} from 'lucide-react';

export type ActiveTab = 'overview' | 'candidates' | 'universities' | 'goals';

interface Props {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  candidateCount: number;
  eligibleCount: number;
}

export const Sidebar: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  candidateCount,
  eligibleCount
}) => {
  const mainNavItems = [
    {
      id: 'overview',
      label: 'Tablero Principal (2x2)',
      icon: LayoutDashboard,
      badge: '2027'
    },
    {
      id: 'candidates',
      label: 'Registros Formulario',
      icon: Users,
      badge: `${candidateCount}`
    }
  ];

  const analyticsNavItems = [
    {
      id: 'universities',
      label: 'Universidades y Mapeo',
      icon: Building2,
      badge: '274 var.'
    },
    {
      id: 'goals',
      label: 'Estructura de Metas',
      icon: Target,
      badge: '1,000 meta'
    }
  ];

  return (
    <aside className="w-full md:w-60 bg-[#152238] text-slate-300 flex flex-col shrink-0 border-r border-slate-700/50">
      {/* Top Sidebar Header */}
      <div className="p-5 flex items-center gap-3 border-b border-slate-700/50">
        <div className="w-8 h-8 rounded bg-[#2E9E82] flex items-center justify-center text-white font-extrabold text-sm shadow-xs">
          E
        </div>
        <div className="text-white">
          <h2 className="text-[10px] font-bold leading-none tracking-wider text-slate-400 uppercase">
            Convocatoria
          </h2>
          <p className="text-sm font-bold text-white mt-0.5">
            LIDERA 2027
          </p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-5 overflow-y-auto">
        {/* Main Section */}
        <div>
          <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2.5 px-2">
            Módulos Principales
          </div>
          <div className="space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as ActiveTab)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-white/10 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#2E9E82]' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                        isActive ? 'bg-[#2E9E82] text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Analytics & Management Section */}
        <div>
          <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2.5 px-2">
            Análisis y Estructura
          </div>
          <div className="space-y-1">
            {analyticsNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as ActiveTab)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-white/10 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#2E9E82]' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                        isActive ? 'bg-[#2E9E82] text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Cohort 2027 Quick Stats Widget */}
        <div className="p-3 bg-slate-800/60 rounded-lg border border-slate-700/50 text-xs">
          <div className="font-bold text-slate-200 mb-2 flex items-center justify-between">
            <span>Cohorte 2027</span>
            <Sparkles className="w-3.5 h-3.5 text-[#F2A900]" />
          </div>
          <div className="space-y-1.5 text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Pre-registros:</span>
              <span className="font-mono font-bold text-white">{candidateCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Elegibles:</span>
              <span className="font-mono font-bold text-[#2E9E82]">{eligibleCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Tasa Elegibilidad:</span>
              <span className="font-mono font-bold text-slate-200">
                {candidateCount > 0 ? `${Math.round((eligibleCount / candidateCount) * 100)}%` : '0%'}
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Brand Footer */}
      <div className="p-4 border-t border-slate-700/50">
        <div className="px-2 py-1 text-slate-400 text-[11px] font-semibold flex items-center justify-between">
          <span>Enseña por Colombia</span>
          <span className="text-slate-500">2027</span>
        </div>
      </div>
    </aside>
  );
};


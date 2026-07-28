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
      label: 'Universidades',
      icon: Building2,
      badge: 'QS / Prio'
    },
    {
      id: 'goals',
      label: 'Estructura de Metas',
      icon: Target,
      badge: '5 metas'
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

        {/* Formulario de Interés Cohorte 2026 Widget */}
        <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/60 text-xs">
          <div className="font-bold text-slate-200 mb-1 flex items-center justify-between">
            <span className="text-[#2E9E82] font-extrabold">Formulario de Interés — Cohorte 2026</span>
            <Sparkles className="w-3.5 h-3.5 text-[#F2A900]" />
          </div>
          <p className="text-[10px] text-slate-400 mb-2">
            Fuente: Tablero "Dash por Interés" (Estadísticas Descriptivas)
          </p>
          <div className="space-y-1.5 text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Total Pre-registros:</span>
              <span className="font-mono font-bold text-white">2.022</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Elegibles de Interés:</span>
              <span className="font-mono font-bold text-[#2E9E82]">1.011</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">No Cumplen Mínimos:</span>
              <span className="font-mono font-bold text-rose-400">1.011</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-700/50">
              <span className="text-slate-300 font-semibold">Tasa de Conversión:</span>
              <span className="font-mono font-extrabold text-amber-400">50.0%</span>
            </div>
          </div>
          <a
            href="https://docs.google.com/spreadsheets/d/1hHAac3wB0JwTfL4n5VIpxJrdEc83_r2_ni0y0y8NYM4/edit?gid=911810443#gid=911810443"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2.5 block text-[10px] text-emerald-400 hover:text-emerald-300 underline font-semibold transition-colors"
          >
            ↗ Abrir Hoja Google Sheets
          </a>
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


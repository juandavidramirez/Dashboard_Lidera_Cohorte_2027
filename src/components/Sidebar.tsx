import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  Building2,
  Target,
  Sparkles,
  FileX,
  LineChart,
  BookOpen,
  Network,
  ChevronDown,
  UserCheck
} from 'lucide-react';

export type ActiveTab =
  | 'general_funnel'
  | 'overview'
  | 'candidates'
  | 'incomplete_candidates'
  | 'auxiliary_charts'
  | 'universities'
  | 'goals'
  | 'lecturas_progress'
  | 'entrevistas_progress';

interface Props {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  candidateCount: number;
  incompleteCandidateCount?: number;
  eligibleCount: number;
  lecturasCompletadasCount?: number;
  entrevistasCompletadasCount?: number;
  entrevistasTotalCount?: number;
}

export const Sidebar: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  candidateCount,
  incompleteCandidateCount = 0,
  lecturasCompletadasCount = 612,
  entrevistasCompletadasCount = 31,
  entrevistasTotalCount = 180
}) => {
  // Estado desplegable para los 4 dashboards principales
  const [openSections, setOpenSections] = useState<{
    general: boolean;
    convocatoria: boolean;
    lecturas: boolean;
    entrevistas: boolean;
  }>({
    general: activeTab === 'general_funnel',
    convocatoria: [
      'overview',
      'candidates',
      'incomplete_candidates',
      'auxiliary_charts',
      'universities',
      'goals'
    ].includes(activeTab),
    lecturas: activeTab === 'lecturas_progress',
    entrevistas: activeTab === 'entrevistas_progress'
  });

  // Asegura que al cambiar de pestaña externamente se abra la sección correspondiente
  useEffect(() => {
    if (activeTab === 'general_funnel') {
      setOpenSections(prev => ({ ...prev, general: true }));
    } else if (activeTab === 'lecturas_progress') {
      setOpenSections(prev => ({ ...prev, lecturas: true }));
    } else if (activeTab === 'entrevistas_progress') {
      setOpenSections(prev => ({ ...prev, entrevistas: true }));
    } else {
      setOpenSections(prev => ({ ...prev, convocatoria: true }));
    }
  }, [activeTab]);

  const toggleSection = (section: 'general' | 'convocatoria' | 'lecturas' | 'entrevistas') => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Grupo 1: Dashboard General
  const generalNavItems = [
    {
      id: 'general_funnel',
      label: 'Embudo Completo (General)',
      icon: Network,
      badge: 'En constr.'
    }
  ];

  // Grupo 2: Dashboard de Convocatoria (agrupa todas las vistas previas)
  const convocatoriaNavItems = [
    {
      id: 'overview',
      label: 'Tablero Principal (2x2)',
      icon: LayoutDashboard,
      badge: '2027'
    },
    {
      id: 'candidates',
      label: 'Registros completados formulario',
      icon: Users,
      badge: `${candidateCount}`
    },
    {
      id: 'incomplete_candidates',
      label: 'Registros incompletos formulario',
      icon: FileX,
      badge: `${incompleteCandidateCount}`
    },
    {
      id: 'auxiliary_charts',
      label: 'Gráficas e Indicadores Auxiliares',
      icon: LineChart,
      badge: 'Fuentes'
    },
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

  // Grupo 3: Dashboard de Proceso de Lecturas
  const lecturasNavItems = [
    {
      id: 'lecturas_progress',
      label: 'Progreso y Evaluación de Lecturas',
      icon: BookOpen,
      badge: `${lecturasCompletadasCount} / 978`
    }
  ];

  // Grupo 4: Dashboard de Proceso de Entrevistas
  const entrevistasNavItems = [
    {
      id: 'entrevistas_progress',
      label: 'Progreso y Evaluación de Entrevistas',
      icon: UserCheck,
      badge: `${entrevistasCompletadasCount} / ${entrevistasTotalCount}`
    }
  ];

  return (
    <aside className="w-full md:w-64 bg-[#152238] text-slate-300 flex flex-col shrink-0 border-r border-slate-700/50">
      {/* Top Sidebar Header */}
      <div className="p-5 flex items-center gap-3 border-b border-slate-700/50">
        <div className="w-8 h-8 rounded bg-[#2E9E82] flex items-center justify-center text-white font-extrabold text-sm shadow-xs">
          E
        </div>
        <div className="text-white">
          <h2 className="text-[10px] font-bold leading-none tracking-wider text-slate-400 uppercase">
            Sistema BI
          </h2>
          <p className="text-sm font-bold text-white mt-0.5">
            LIDERA 2027
          </p>
        </div>
      </div>

      {/* Navigation Menu Reorganizado en 3 Acordeones Desplegables */}
      <nav className="flex-1 p-3.5 space-y-3.5 overflow-y-auto">
        {/* GRUPO 1: DASHBOARD GENERAL (Desplegable) */}
        <div className="rounded-lg bg-slate-900/40 border border-slate-800/80 overflow-hidden">
          <button
            onClick={() => toggleSection('general')}
            className="w-full flex items-center justify-between p-2.5 text-left hover:bg-slate-800/60 transition-colors group"
          >
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider text-slate-300 font-extrabold group-hover:text-white transition-colors">
                1. Dashboard General
              </span>
              <span className="text-[9px] bg-slate-800 text-amber-400 px-1.5 py-0.2 rounded font-bold border border-amber-400/20">
                Etapas 1-4
              </span>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 group-hover:text-slate-200 ${
                openSections.general ? 'rotate-180' : ''
              }`}
            />
          </button>

          {openSections.general && (
            <div className="p-1.5 space-y-1 border-t border-slate-800/70 bg-slate-950/20">
              {generalNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as ActiveTab)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-white/10 text-white shadow-xs border-l-2 border-amber-400'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold shrink-0 ${
                          isActive ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* GRUPO 2: DASHBOARD DE CONVOCATORIA (Desplegable) */}
        <div className="rounded-lg bg-slate-900/40 border border-slate-800/80 overflow-hidden">
          <button
            onClick={() => toggleSection('convocatoria')}
            className="w-full flex items-center justify-between p-2.5 text-left hover:bg-slate-800/60 transition-colors group"
          >
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider text-slate-300 font-extrabold group-hover:text-white transition-colors">
                2. Dashboard Convocatoria
              </span>
              <span className="text-[9px] bg-[#2E9E82]/20 text-[#2E9E82] px-1.5 py-0.2 rounded font-bold border border-[#2E9E82]/30">
                6 Vistas
              </span>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 group-hover:text-slate-200 ${
                openSections.convocatoria ? 'rotate-180' : ''
              }`}
            />
          </button>

          {openSections.convocatoria && (
            <div className="p-1.5 space-y-1 border-t border-slate-800/70 bg-slate-950/20">
              {convocatoriaNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as ActiveTab)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-white/10 text-white shadow-xs border-l-2 border-[#2E9E82]'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#2E9E82]' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold shrink-0 ${
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
          )}
        </div>

        {/* GRUPO 3: DASHBOARD DE LECTURAS (Desplegable) */}
        <div className="rounded-lg bg-slate-900/40 border border-slate-800/80 overflow-hidden">
          <button
            onClick={() => toggleSection('lecturas')}
            className="w-full flex items-center justify-between p-2.5 text-left hover:bg-slate-800/60 transition-colors group"
          >
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider text-slate-300 font-extrabold group-hover:text-white transition-colors">
                3. Dashboard Lecturas
              </span>
              <span className="text-[9px] bg-blue-500/20 text-blue-400 px-1.5 py-0.2 rounded font-bold border border-blue-400/30">
                Foco Activo
              </span>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 group-hover:text-slate-200 ${
                openSections.lecturas ? 'rotate-180' : ''
              }`}
            />
          </button>

          {openSections.lecturas && (
            <div className="p-1.5 space-y-1 border-t border-slate-800/70 bg-slate-950/20">
              {lecturasNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as ActiveTab)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-white/10 text-white shadow-xs border-l-2 border-blue-400'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold shrink-0 ${
                          isActive ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* GRUPO 4: DASHBOARD DE ENTREVISTAS (Desplegable) */}
        <div className="rounded-lg bg-slate-900/40 border border-slate-800/80 overflow-hidden">
          <button
            onClick={() => toggleSection('entrevistas')}
            className="w-full flex items-center justify-between p-2.5 text-left hover:bg-slate-800/60 transition-colors group"
          >
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider text-slate-300 font-extrabold group-hover:text-white transition-colors">
                4. Dashboard Entrevistas
              </span>
              <span className="text-[9px] bg-[#2E9E82]/20 text-[#2E9E82] px-1.5 py-0.2 rounded font-bold border border-[#2E9E82]/30">
                Nuevo
              </span>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 group-hover:text-slate-200 ${
                openSections.entrevistas ? 'rotate-180' : ''
              }`}
            />
          </button>

          {openSections.entrevistas && (
            <div className="p-1.5 space-y-1 border-t border-slate-800/70 bg-slate-950/20">
              {entrevistasNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as ActiveTab)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-white/10 text-white shadow-xs border-l-2 border-[#2E9E82]'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#2E9E82]' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold shrink-0 ${
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
          )}
        </div>

        {/* Formulario de Interés Cohorte 2026 Widget */}
        <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/60 text-xs">
          <div className="font-bold text-slate-200 mb-1 flex items-center justify-between">
            <span className="text-[#2E9E82] font-extrabold">Formulario de Interés — 2026</span>
            <Sparkles className="w-3.5 h-3.5 text-[#F2A900]" />
          </div>
          <p className="text-[10px] text-slate-400 mb-2">
            Fuente: Tablero "Dash por Interés" (Estadísticas)
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
              <span className="text-slate-400">% Elegibilidad 2026:</span>
              <span className="font-mono font-bold text-white">50.0%</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-700/50 text-[10px] text-slate-400 flex items-center justify-between">
        <span>Cohorte 2027</span>
        <span className="font-mono">v3.5.0</span>
      </div>
    </aside>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import {
  RefreshCw,
  RotateCcw,
  Database,
  X,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  LayoutDashboard,
  BookOpen,
  Network,
  ExternalLink
} from 'lucide-react';
import { dataStore } from '../lib/dataStore';
import { supabaseUrl, setCustomSupabaseCredentials, clearCustomSupabaseCredentials } from '../lib/supabase';
import { ActiveTab } from './Sidebar';

interface Props {
  onSyncSheets: () => void;
  onSyncLecturas?: () => void;
  onSyncEntrevistas?: () => void;
  onSyncAll?: () => void;
  onResetData: () => void;
  isSyncing: boolean;
  totalCandidatesCount: number;
  activeTab?: ActiveTab;
  setActiveTab?: (tab: ActiveTab) => void;
}

export const Header: React.FC<Props> = ({
  onSyncSheets,
  onSyncLecturas,
  onSyncEntrevistas,
  onSyncAll,
  onResetData,
  isSyncing,
  activeTab,
  setActiveTab
}) => {
  const supabaseStatus = dataStore.getSupabaseStatus();
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [urlInput, setUrlInput] = useState(supabaseUrl || '');
  const [keyInput, setKeyInput] = useState('');

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput && keyInput) {
      setCustomSupabaseCredentials(urlInput, keyInput);
    }
  };

  const handleClearConfig = () => {
    if (confirm('¿Deseas desvincular las credenciales personalizadas de Supabase?')) {
      clearCustomSupabaseCredentials();
    }
  };

  const handleNavigate = (tab: ActiveTab) => {
    if (setActiveTab) {
      setActiveTab(tab);
    }
    setIsDropdownOpen(false);
  };

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-40 px-4 sm:px-8 flex items-center justify-between shadow-2xs">
        {/* Brand & Breadcrumb Title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#2E9E82] flex items-center justify-center text-white font-extrabold text-xs shadow-xs">
            E
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-sm font-bold text-[#152238] tracking-tight">
              BI Dash Funnel Convocatoria Lidera
            </h1>
            <span className="bg-[#2E9E82] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Cohorte 2027
            </span>
          </div>
        </div>

        {/* Live Status & Global Actions */}
        <div className="flex items-center gap-3">
          {/* Supabase Status Badge */}
          <button
            onClick={() => setIsConfigModalOpen(true)}
            title="Haz clic para ver o configurar credenciales de Supabase"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
              supabaseStatus.configured
                ? 'bg-purple-50 border border-purple-200 text-purple-800 hover:bg-purple-100'
                : 'bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <Database className={`w-3.5 h-3.5 ${supabaseStatus.configured ? 'text-purple-600' : 'text-amber-600'}`} />
            <span className="hidden sm:inline">
              {supabaseStatus.configured ? 'Supabase Conectado' : 'Configurar Supabase'}
            </span>
          </button>

          {/* Menú Desplegable de Fuentes de Datos por Sección */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold transition-all border shadow-2xs cursor-pointer ${
                isDropdownOpen
                  ? 'bg-emerald-100 border-emerald-300 text-emerald-950 ring-2 ring-emerald-400/20'
                  : 'bg-emerald-50 hover:bg-emerald-100/70 border-emerald-200/90 text-emerald-900'
              }`}
              title="Haz clic para ver y actualizar las fuentes de datos por sección"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="hidden md:inline font-bold">Google Sheets / Supabase</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-emerald-700 transition-transform duration-200 ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden divide-y divide-slate-100 animate-in fade-in-50 zoom-in-95 duration-100">
                {/* Header del dropdown */}
                <div className="p-3.5 bg-slate-50 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                      Fuentes de Datos
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Actualiza o navega a cada sección del dashboard
                    </p>
                  </div>
                  {onSyncAll && (
                    <button
                      onClick={() => {
                        onSyncAll();
                        setIsDropdownOpen(false);
                      }}
                      disabled={isSyncing}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg transition-colors shadow-2xs disabled:opacity-50"
                      title="Actualizar todas las fuentes concurrentemente"
                    >
                      <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                      <span>Actualizar Todo</span>
                    </button>
                  )}
                </div>

                {/* Lista de Secciones */}
                <div className="p-2 space-y-1.5">
                  {/* 1. Dashboard de Convocatoria */}
                  <div className="p-2.5 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50/80 transition-colors">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-amber-50 text-[#F2A900] border border-amber-200">
                          <LayoutDashboard className="w-4 h-4 text-amber-700" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900">
                              Dashboard de Convocatoria
                            </span>
                            {activeTab === 'overview' && (
                              <span className="text-[9px] bg-amber-100 text-amber-900 font-extrabold px-1.5 py-0.2 rounded border border-amber-300">
                                Activo
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500 block">
                            Fuente: Google Sheets / candidates_convocatoria
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
                      <button
                        onClick={() => handleNavigate('overview')}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 hover:text-slate-950 px-2 py-1 rounded hover:bg-slate-100 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Ver sección
                      </button>
                      <button
                        onClick={() => {
                          onSyncSheets();
                          setIsDropdownOpen(false);
                        }}
                        disabled={isSyncing}
                        className="inline-flex items-center gap-1 text-[11px] font-bold bg-[#F2A900] text-slate-950 hover:bg-amber-500 px-2.5 py-1 rounded-md transition-colors shadow-2xs disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                        Actualizar datos
                      </button>
                    </div>
                  </div>

                  {/* 2. Dashboard de Lecturas */}
                  <div className="p-2.5 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50/80 transition-colors">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-emerald-50 text-[#2E9E82] border border-emerald-200">
                          <BookOpen className="w-4 h-4 text-[#2E9E82]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900">
                              Dashboard de Lecturas
                            </span>
                            {activeTab === 'lecturas_progress' && (
                              <span className="text-[9px] bg-emerald-100 text-emerald-900 font-extrabold px-1.5 py-0.2 rounded border border-emerald-300">
                                Activo
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500 block">
                            Fuente: Supabase (lecturas_progreso)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
                      <button
                        onClick={() => handleNavigate('lecturas_progress')}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 hover:text-slate-950 px-2 py-1 rounded hover:bg-slate-100 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Ver sección
                      </button>
                      <button
                        onClick={() => {
                          if (onSyncLecturas) onSyncLecturas();
                          setIsDropdownOpen(false);
                        }}
                        disabled={isSyncing}
                        className="inline-flex items-center gap-1 text-[11px] font-bold bg-[#152238] text-white hover:bg-slate-800 px-2.5 py-1 rounded-md transition-colors shadow-2xs disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                        Actualizar datos
                      </button>
                    </div>
                  </div>

                  {/* 3. Dashboard de Entrevistas */}
                  <div className="p-2.5 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50/80 transition-colors">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-emerald-50 text-[#2E9E82] border border-emerald-200">
                          <CheckCircle2 className="w-4 h-4 text-[#2E9E82]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900">
                              Dashboard de Entrevistas
                            </span>
                            {activeTab === 'entrevistas_progress' && (
                              <span className="text-[9px] bg-emerald-100 text-emerald-900 font-extrabold px-1.5 py-0.2 rounded border border-emerald-300">
                                Activo
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500 block">
                            Fuente: Supabase (entrevistas_con_perfil)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
                      <button
                        onClick={() => handleNavigate('entrevistas_progress')}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 hover:text-slate-950 px-2 py-1 rounded hover:bg-slate-100 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Ver sección
                      </button>
                      <button
                        onClick={() => {
                          if (onSyncEntrevistas) onSyncEntrevistas();
                          setIsDropdownOpen(false);
                        }}
                        disabled={isSyncing}
                        className="inline-flex items-center gap-1 text-[11px] font-bold bg-[#152238] text-white hover:bg-slate-800 px-2.5 py-1 rounded-md transition-colors shadow-2xs disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                        Actualizar datos
                      </button>
                    </div>
                  </div>

                  {/* 4. Dashboard General (Embudo Completo) */}
                  <div className="p-2.5 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50/80 transition-colors">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600 border border-slate-200">
                          <Network className="w-4 h-4 text-slate-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900">
                              Dashboard General
                            </span>
                            <span className="text-[9px] bg-slate-100 text-slate-600 font-bold px-1.5 py-0.2 rounded border border-slate-200">
                              En constr.
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 block">
                            Embudo consolidado de conversión
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
                      <button
                        onClick={() => handleNavigate('general_funnel')}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 hover:text-slate-950 px-2 py-1 rounded hover:bg-slate-100 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Ver sección
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Reset Local Seed Data */}
          <button
            onClick={onResetData}
            title="Restablecer datos locales al estado inicial por defecto"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Supabase Connection Modal */}
      {isConfigModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="bg-[#152238] px-5 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Database className="w-4 h-4 text-purple-400" />
                <span>Estado de Conexión Supabase</span>
              </div>
              <button
                onClick={() => setIsConfigModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              {supabaseStatus.configured ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-2 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-bold">¡Supabase está configurado correctamente!</p>
                    <p className="text-[11px] text-emerald-700 mt-0.5">
                      URL: <span className="font-mono">{supabaseUrl}</span>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2 text-amber-800">
                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-bold">Conexión Supabase Pendiente</p>
                    <p className="text-[11px] text-amber-700 mt-0.5">
                      Ingresa tu VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY para conectar tu dashboard local a la base de datos real.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSaveConfig} className="space-y-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Supabase Project URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://xxx.supabase.co"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Supabase Anon Key
                  </label>
                  <input
                    type="password"
                    placeholder="eyJhbGciOi..."
                    value={keyInput}
                    onChange={(e) => setKeyInput(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 font-mono text-[11px]"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  {supabaseStatus.configured && (
                    <button
                      type="button"
                      onClick={handleClearConfig}
                      className="text-red-600 hover:underline text-[11px]"
                    >
                      Desconectar Credenciales
                    </button>
                  )}
                  <div className="flex gap-2 ml-auto">
                    <button
                      type="button"
                      onClick={() => setIsConfigModalOpen(false)}
                      className="px-3 py-1.5 border border-slate-300 rounded-lg font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      Cerrar
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-purple-700 text-white rounded-lg font-semibold hover:bg-purple-800"
                    >
                      Guardar y Conectar
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

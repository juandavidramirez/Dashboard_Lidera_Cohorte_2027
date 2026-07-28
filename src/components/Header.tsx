import React, { useState } from 'react';
import {
  RefreshCw,
  RotateCcw,
  Database,
  X,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { dataStore } from '../lib/dataStore';
import { supabaseUrl, setCustomSupabaseCredentials, clearCustomSupabaseCredentials } from '../lib/supabase';

interface Props {
  onSyncSheets: () => void;
  onResetData: () => void;
  isSyncing: boolean;
  totalCandidatesCount: number;
}

export const Header: React.FC<Props> = ({
  onSyncSheets,
  onResetData,
  isSyncing
}) => {
  const supabaseStatus = dataStore.getSupabaseStatus();
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [urlInput, setUrlInput] = useState(supabaseUrl || '');
  const [keyInput, setKeyInput] = useState('');

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

          {/* Sync Button (Google Sheets / Supabase Real-Time) */}
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-full text-xs font-semibold text-emerald-800">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="hidden md:inline">Google Sheets / Supabase</span>
            <button
              onClick={onSyncSheets}
              disabled={isSyncing}
              title="Cargar/Refrescar datos en tiempo real desde Supabase"
              className="p-1 hover:bg-emerald-200/60 rounded text-emerald-900 transition-colors disabled:opacity-50 flex items-center gap-1"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            </button>
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




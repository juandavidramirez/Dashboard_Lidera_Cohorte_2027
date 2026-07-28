import React from 'react';
import {
  RefreshCw,
  RotateCcw,
  Database
} from 'lucide-react';
import { dataStore } from '../lib/dataStore';

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

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-40 px-4 sm:px-8 flex items-center justify-between shadow-2xs">
      {/* Brand & Breadcrumb Title */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-[#2E9E82] flex items-center justify-center text-white font-extrabold text-xs shadow-xs">
          E
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-tight hidden sm:inline">
            Embudo de Convocatoria /
          </span>
          <h1 className="text-sm font-bold text-[#152238] tracking-tight">
            Difusión e Interés LIDERA
          </h1>
          <span className="bg-[#2E9E82] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Cohorte 2027
          </span>
        </div>
      </div>

      {/* Live Status & Global Actions */}
      <div className="flex items-center gap-3">
        {/* Supabase Status Badge */}
        {supabaseStatus.configured ? (
          <div className="flex items-center gap-1.5 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-full text-xs font-semibold text-purple-800">
            <Database className="w-3.5 h-3.5 text-purple-600" />
            <span className="hidden sm:inline">Supabase Conectado</span>
          </div>
        ) : (
          <div className="hidden lg:flex items-center gap-1.5 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full text-[11px] font-medium text-slate-600">
            <Database className="w-3 h-3 text-slate-400" />
            <span>Almacenamiento Local</span>
          </div>
        )}

        {/* Google Sheets Sync Badge */}
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-full text-xs font-semibold text-emerald-800">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="hidden md:inline">Google Sheets Vivo</span>
          <button
            onClick={onSyncSheets}
            disabled={isSyncing}
            title="Sincronizar ahora con Google Sheets 2027"
            className="p-0.5 hover:bg-emerald-200/60 rounded text-emerald-900 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Reset Seed Data */}
        <button
          onClick={onResetData}
          title="Restablecer datos por defecto"
          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors text-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};



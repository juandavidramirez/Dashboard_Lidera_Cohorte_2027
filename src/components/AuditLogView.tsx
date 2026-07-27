import React from 'react';
import { AuditLogItem } from '../types';
import { ShieldCheck, Clock, User, RefreshCw, FileText } from 'lucide-react';

interface Props {
  logs: AuditLogItem[];
}

export const AuditLogView: React.FC<Props> = ({ logs }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden mb-8">
      {/* Title Bar in Amber */}
      <div className="bg-[#F2A900] px-4 py-2 text-slate-900 font-bold text-xs uppercase tracking-wider flex items-center justify-between">
        <span>REGISTRO DE AUDITORÍA Y SEGURIDAD (AUDIT TRAIL 2027)</span>
        <span className="text-[11px] font-semibold bg-amber-600/20 px-2 py-0.5 rounded">
          {logs.length} Eventos Registrados
        </span>
      </div>

      <div className="p-4 border-b border-slate-200 bg-slate-50">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#2E9E82]" />
          Trazabilidad de Cambios y Sincronizaciones en Vivo
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Auditoría en tiempo real de acciones ejecutadas por el equipo CSM y tareas de sincronización automatizadas
        </p>
      </div>

      <div className="divide-y divide-slate-100 text-xs">
        {logs.length === 0 ? (
          <div className="p-6 text-center text-slate-400">Sin eventos de auditoría registrados</div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="p-3 hover:bg-slate-50 transition-colors flex items-start gap-3">
              <div
                className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                  log.type === 'sync'
                    ? 'bg-blue-100 text-blue-700'
                    : log.type === 'goal_change'
                    ? 'bg-amber-100 text-amber-700'
                    : log.type === 'create'
                    ? 'bg-[#2E9E82]/15 text-[#2E9E82]'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {log.type === 'sync' ? (
                  <RefreshCw className="w-4 h-4" />
                ) : (
                  <FileText className="w-4 h-4" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{log.action}</span>
                  <span className="text-[11px] font-mono text-slate-400">{log.timestamp}</span>
                </div>
                <p className="text-slate-600 mt-0.5">{log.details}</p>
                <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>Ejecutado por: {log.user}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

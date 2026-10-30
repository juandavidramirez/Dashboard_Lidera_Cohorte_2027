import React from 'react';
import {
  TrendingUp,
  UserCheck,
  Award,
  GraduationCap,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { LabGeneralKpis } from '../../types';

interface Props {
  kpis: LabGeneralKpis;
  onFilterNoAsistieron?: () => void;
}

export const LabHeaderKPIs: React.FC<Props> = ({ kpis, onFilterNoAsistieron }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Avance del Lab */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-tight text-slate-700 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2E9E82]" />
              Avance del Lab
            </span>
            <CheckCircle2 className="w-4 h-4 text-[#2E9E82]" />
          </div>

          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-3xl font-black text-slate-900 font-mono">
              {kpis.evaluadosCompletosCount.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-slate-500">
              / {kpis.totalAceptadosEntrevista.toLocaleString()} universo Lab
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mt-3 border border-slate-200">
            <div
              className="h-full bg-[#2E9E82] rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(kpis.avanceLabPct, 4))}%` }}
            />
          </div>
        </div>

        <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            {kpis.avanceLabPct}% evaluados
          </span>
          <span className="font-semibold text-slate-700">Meta: {kpis.metaAceptadosLab}</span>
        </div>
      </div>

      {/* 2. Asistencia al Lab */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-tight text-slate-700 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#152238]" />
              Asistencia al Lab
            </span>
            <UserCheck className="w-4 h-4 text-[#152238]" />
          </div>

          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-3xl font-black text-slate-900 font-mono">
              {kpis.asistieronCount.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-slate-500">
              / {kpis.totalAgendados.toLocaleString()} agendados
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mt-3 border border-slate-200">
            <div
              className="h-full bg-[#152238] rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(kpis.asistenciaPct, 4))}%` }}
            />
          </div>
        </div>

        <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            {kpis.asistenciaPct}% asistencia
          </span>

          <button
            type="button"
            onClick={onFilterNoAsistieron}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-[10px] font-bold transition-colors cursor-pointer"
            title="Ver inasistentes en el directorio"
          >
            <AlertCircle className="w-3 h-3 text-rose-600" />
            <span>{kpis.noAsistieronCount} no asistieron</span>
          </button>
        </div>
      </div>

      {/* 3. Tasa de Paso (Lab) */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-tight text-slate-700 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F2A900]" />
              Tasa de Paso (Lab)
            </span>
            <Award className="w-4 h-4 text-[#F2A900]" />
          </div>

          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-3xl font-black text-slate-900 font-mono">
              {kpis.tasaPasoPct}%
            </span>
            <span className="text-xs font-bold text-slate-500">
              / {kpis.evaluadosCompletosCount.toLocaleString()} evaluados
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mt-3 border border-slate-200">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(kpis.tasaPasoPct, 4))}%` }}
            />
          </div>
        </div>

        <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="font-semibold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-mono">
            {kpis.aceptadosLabCount} aceptados
          </span>
          <span className="font-mono text-slate-500 text-[10px]">
            {kpis.rechazadosLabCount} rechazados
          </span>
        </div>
      </div>

      {/* 4. Pasan a Comité */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-tight text-slate-700 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2E9E82]" />
              Pasan a Comité
            </span>
            <GraduationCap className="w-4 h-4 text-[#2E9E82]" />
          </div>

          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-3xl font-black text-[#2E9E82] font-mono">
              {kpis.matriculacionCount.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-slate-500">
              / {kpis.metaCupos} cupos cohorte
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mt-3 border border-slate-200">
            <div
              className="h-full bg-[#2E9E82] rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(kpis.matriculacionPct, 4))}%` }}
            />
          </div>
        </div>

        <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            {kpis.matriculacionPct}% ocupación
          </span>
          <span className="font-semibold text-slate-700">Meta: {kpis.metaCupos} cupos</span>
        </div>
      </div>
    </div>
  );
};

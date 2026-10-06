import React from 'react';
import {
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Star,
  Users
} from 'lucide-react';
import { EntrevistasGeneralKpis } from '../../types';

interface Props {
  kpis: EntrevistasGeneralKpis;
}

export const EntrevistasHeaderKPIs: React.FC<Props> = ({ kpis }) => {
  const isAtrasadosCritical = kpis.evaluadoresAtrasadosCount > 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Avance global */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-tight text-slate-700 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2E9E82]" />
              Avance global
            </span>
            <CheckCircle2 className="w-4 h-4 text-[#2E9E82]" />
          </div>

          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-3xl font-black text-slate-900">
              {kpis.completadasCount.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-slate-500">
              / {kpis.metaGlobal.toLocaleString()} asignados
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mt-3 border border-slate-200">
            <div
              className="h-full bg-[#2E9E82] rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(kpis.avanceGlobalPct, 4))}%` }}
            />
          </div>
        </div>

        <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            {kpis.avanceGlobalPct}% completado
          </span>
          <span className="font-semibold text-slate-700">Meta: {kpis.metaGlobal}</span>
        </div>
      </div>

      {/* 2. Tasa de éxito */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-tight text-slate-700 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F2A900]" />
              Tasa de éxito
            </span>
            <TrendingUp className="w-4 h-4 text-[#F2A900]" />
          </div>

          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-3xl font-black text-slate-900">
              {kpis.aceptadosCount.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-slate-500">
              / {kpis.totalEvaluados.toLocaleString()} evaluados
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mt-3 border border-slate-200">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(kpis.tasaExitoPct, 4))}%` }}
            />
          </div>
        </div>

        <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="font-semibold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            {kpis.tasaExitoPct}% aceptados
          </span>
          <span className="font-mono text-slate-500 text-[10px]">
            {kpis.rechazadosCount} rechazados
          </span>
        </div>
      </div>

      {/* 3. Evaluadores atrasados */}
      <div
        className={`bg-white border ${
          isAtrasadosCritical
            ? 'border-rose-300 ring-2 ring-rose-100'
            : 'border-slate-200/90'
        } rounded-xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between`}
      >
        <div>
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-tight text-slate-700 flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isAtrasadosCritical ? 'bg-rose-500' : 'bg-emerald-500'}`} />
              Evaluadores atrasados
            </span>
            <Users className={`w-4 h-4 ${isAtrasadosCritical ? 'text-rose-600' : 'text-slate-400'}`} />
          </div>

          <div className="flex items-baseline gap-1.5 mt-2">
            <span
              className={`text-3xl font-black ${
                isAtrasadosCritical ? 'text-rose-700' : 'text-slate-800'
              }`}
            >
              {kpis.evaluadoresAtrasadosCount}
            </span>
            <span className="text-xs font-bold text-slate-500">
              / {kpis.totalEvaluadores} evaluadores
            </span>
          </div>

          <div className="mt-3">
            {isAtrasadosCritical ? (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                Avance menor al 50%
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                Al día (&gt; 50% avance)
              </span>
            )}
          </div>
        </div>

        <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="font-semibold text-slate-700">
            Staff: {kpis.evaluadoresAtrasadosStaffCount} · Externos: {kpis.evaluadoresAtrasadosExternosCount}
          </span>
          <span className="font-mono text-slate-400 text-[10px]">
            {kpis.totalEvaluadores} totales
          </span>
        </div>
      </div>

      {/* 4. Top Candidatos */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-tight text-slate-700 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F2A900]" />
              Top Candidatos
            </span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>

          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-3xl font-black text-slate-900">
              {kpis.topCandidatosCount.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-slate-500">
              / {kpis.totalEvaluados.toLocaleString()} evaluados
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mt-3 border border-slate-200">
            <div
              className="h-full bg-[#F2A900] rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(kpis.topCandidatosPct, 4))}%` }}
            />
          </div>
        </div>

        <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="font-semibold text-amber-950 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            {kpis.topCandidatosPct}% evaluados
          </span>
          <span className="font-mono text-[10px] text-slate-400">
            STEM/Bil + Univ. Priorizada
          </span>
        </div>
      </div>
    </div>
  );
};

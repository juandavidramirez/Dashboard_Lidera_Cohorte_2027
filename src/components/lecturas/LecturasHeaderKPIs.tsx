import React from 'react';
import { CheckCircle2, TrendingUp, AlertTriangle, Cpu, Users } from 'lucide-react';
import { LecturasGeneralKpis } from '../../types';

interface Props {
  kpis: LecturasGeneralKpis;
}

export const LecturasHeaderKPIs: React.FC<Props> = ({ kpis }) => {
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
              / {kpis.metaGlobal.toLocaleString()} meta
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
          <span className="font-semibold text-slate-700">Meta: 978</span>
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
              {kpis.seleccionadosCount.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-slate-500">
              / {kpis.totalCumplenMinimos.toLocaleString()} elegibles
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
            {kpis.tasaExitoPct}% pasan
          </span>
          <span className="font-mono text-slate-400 text-[10px]">{kpis.totalCumplenMinimos} total cohorte</span>
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
          <span>{kpis.totalEvaluadores - kpis.evaluadoresAtrasadosCount} en meta</span>
          <span className="font-semibold text-slate-700">{kpis.totalEvaluadores} evaluadores</span>
        </div>
      </div>

      {/* 4. Modelo vs. evaluador */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-tight text-slate-700 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
              Modelo vs. Evaluador
            </span>
            <Cpu className="w-4 h-4 text-amber-700" />
          </div>

          <div className="flex items-baseline gap-2 mt-2">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-amber-900">
                {kpis.modeloPasaPct}%
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400">Modelo</span>
            </div>
            <span className="text-slate-400 font-bold text-xs">vs</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-[#2E9E82]">
                {kpis.evaluadorPasaPct}%
              </span>
              <span className="text-[10px] uppercase font-bold text-[#2E9E82]">Eval</span>
            </div>
          </div>

          {/* Symmetrical Dual Progress Bar */}
          <div className="flex items-center gap-1.5 mt-3">
            <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
              <div
                className="h-full bg-amber-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, kpis.modeloPasaPct)}%` }}
              />
            </div>
            <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
              <div
                className="h-full bg-[#2E9E82] rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, kpis.evaluadorPasaPct)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>{kpis.modeloPasaCount} favorable modelo</span>
          <span className="font-semibold text-slate-700">{kpis.evaluadorPasaCount} pasan eval</span>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { EntrevistaRecord } from '../../types';
import { calculateResultadosBreakdown } from '../../lib/entrevistasMetricsCalculator';
import { CheckCircle2, XCircle, Award } from 'lucide-react';

interface Props {
  entrevistas: EntrevistaRecord[];
}

export const CardResultados: React.FC<Props> = ({ entrevistas }) => {
  const breakdown = calculateResultadosBreakdown(entrevistas);

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs flex flex-col h-full">
      {/* Title Strip in Brand Amber #F2A900 */}
      <div className="bg-[#F2A900] px-4 py-2.5 flex items-center justify-between gap-2 border-b border-amber-300">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-slate-950" />
          <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider">
            Resultados de Entrevista (Opinión del Evaluador)
          </h3>
        </div>

        <span className="text-[10px] bg-[#152238] text-white font-bold px-2 py-0.5 rounded shadow-2xs font-mono">
          {breakdown.totalEvaluados.toLocaleString()} evaluados
        </span>
      </div>

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        {/* Contraste en 2 Columnas: Aceptado vs Rechazado */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
          {/* Bloque 1: Aceptado */}
          <div className="bg-emerald-50/60 border border-emerald-200/90 rounded-xl p-3.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-emerald-200/80">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2E9E82]" />
                  Aceptados
                </span>
                <span className="text-[11px] font-bold text-emerald-800 font-mono">
                  {breakdown.aceptadosCount} de {breakdown.totalEvaluados}
                </span>
              </div>

              <div className="mt-2.5 mb-3 flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#2E9E82]">
                  {breakdown.aceptadosPct}%
                </span>
                <span className="text-xs font-bold text-slate-600">
                  tasa de aceptación
                </span>
              </div>

              {/* 3 Subcategorías de Aceptado */}
              <div className="space-y-2">
                {breakdown.aceptadosCategories.map((item) => (
                  <div key={item.label} className="bg-white p-2 rounded-lg border border-emerald-200/80 shadow-2xs">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-800 flex items-center gap-1.5 truncate pr-1" title={item.label}>
                        <span className="w-2 h-2 rounded-full bg-[#2E9E82] shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </span>
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="font-mono font-bold text-slate-900">
                          {item.count}
                        </span>
                        <span className="font-mono text-slate-400 text-[11px]">
                          ({item.pct}%)
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#2E9E82] transition-all duration-500"
                        style={{ width: `${Math.max(item.pct, item.count > 0 ? 3 : 0)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bloque 2: Rechazado */}
          <div className="bg-rose-50/50 border border-rose-200/80 rounded-xl p-3.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-rose-200/80">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-950 flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                  Rechazados
                </span>
                <span className="text-[11px] font-bold text-rose-800 font-mono">
                  {breakdown.rechazadosCount} de {breakdown.totalEvaluados}
                </span>
              </div>

              <div className="mt-2.5 mb-3 flex items-baseline gap-2">
                <span className="text-3xl font-black text-rose-700">
                  {breakdown.rechazadosPct}%
                </span>
                <span className="text-xs font-bold text-slate-600">
                  no seleccionados
                </span>
              </div>

              {/* 2 Subcategorías de Rechazado */}
              <div className="space-y-2">
                {breakdown.rechazadosCategories.map((item) => (
                  <div key={item.label} className="bg-white p-2 rounded-lg border border-rose-200/80 shadow-2xs">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-800 flex items-center gap-1.5 truncate pr-1" title={item.label}>
                        <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </span>
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="font-mono font-bold text-slate-900">
                          {item.count}
                        </span>
                        <span className="font-mono text-slate-400 text-[11px]">
                          ({item.pct}%)
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-rose-500 transition-all duration-500"
                        style={{ width: `${Math.max(item.pct, item.count > 0 ? 3 : 0)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

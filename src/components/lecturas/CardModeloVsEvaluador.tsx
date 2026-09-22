import React from 'react';
import { LecturaRecord } from '../../types';
import { calculateModeloVsEvaluadorBreakdown } from '../../lib/lecturasMetricsCalculator';
import { Cpu, UserCheck } from 'lucide-react';

interface Props {
  lecturas: LecturaRecord[];
}

export const CardModeloVsEvaluador: React.FC<Props> = ({ lecturas }) => {
  const breakdown = calculateModeloVsEvaluadorBreakdown(lecturas);

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs flex flex-col h-full">
      {/* Title Strip in Candidato Warm Amber */}
      <div className="bg-[#854D0E] px-4 py-2.5 flex items-center justify-between gap-2 border-b border-amber-700">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-amber-200" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Recomendación del Modelo vs. Opinión del Evaluador
          </h3>
        </div>

        <span className="text-[10px] bg-amber-950/60 text-amber-200 font-bold px-2 py-0.5 rounded border border-amber-600/50 font-mono">
          {breakdown.totalLeidos.toLocaleString()} evaluados
        </span>
      </div>

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        {/* Contraste en 2 Columnas Limpias y Equilibradas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
          {/* Columna Modelo (IA) */}
          <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-amber-700" />
                  Modelo (IA)
                </span>
                <span className="text-[11px] font-bold text-slate-500 font-mono">
                  {breakdown.modeloPasaCount} de {breakdown.totalLeidos}
                </span>
              </div>

              {/* Scorecard limpio */}
              <div className="mt-2.5 mb-3 flex items-baseline gap-2">
                <span className="text-3xl font-black text-amber-900">
                  {breakdown.modeloPasaPct}%
                </span>
                <span className="text-xs font-bold text-slate-600">
                  recomienda pasar
                </span>
              </div>

              {/* Categorías acortadas */}
              <div className="space-y-2">
                {breakdown.modeloCategories.map((item) => (
                  <div key={item.label} className="bg-white p-2 rounded-lg border border-slate-200/80 shadow-2xs">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            item.isPass ? 'bg-[#2E9E82]' : 'bg-slate-400'
                          }`}
                        />
                        {item.label}
                      </span>
                      <div className="flex items-center gap-1">
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
                        className={`h-full rounded-full ${
                          item.isPass ? 'bg-[#2E9E82]' : 'bg-slate-400'
                        }`}
                        style={{ width: `${Math.max(item.pct, 2)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Columna Evaluador (Humano) */}
          <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-xl p-3.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-emerald-200/80">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-[#2E9E82]" />
                  Evaluador (Humano)
                </span>
                <span className="text-[11px] font-bold text-emerald-800 font-mono">
                  {breakdown.evaluadorPasaCount} de {breakdown.totalLeidos}
                </span>
              </div>

              {/* Scorecard limpio */}
              <div className="mt-2.5 mb-3 flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#2E9E82]">
                  {breakdown.evaluadorPasaPct}%
                </span>
                <span className="text-xs font-bold text-slate-600">
                  recomienda pasar
                </span>
              </div>

              {/* Categorías acortadas */}
              <div className="space-y-2">
                {breakdown.evaluadorCategories.map((item) => (
                  <div key={item.label} className="bg-white p-2 rounded-lg border border-emerald-200/80 shadow-2xs">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            item.label === 'Pasa a entrevista'
                              ? 'bg-[#2E9E82]'
                              : item.label === 'Descalificado (plagio)'
                              ? 'bg-rose-500'
                              : 'bg-slate-400'
                          }`}
                        />
                        {item.label}
                      </span>
                      <div className="flex items-center gap-1">
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
                        className={`h-full rounded-full ${
                          item.label === 'Pasa a entrevista'
                            ? 'bg-[#2E9E82]'
                            : item.label === 'Descalificado (plagio)'
                            ? 'bg-rose-500'
                            : 'bg-slate-400'
                        }`}
                        style={{ width: `${Math.max(item.pct, 2)}%` }}
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

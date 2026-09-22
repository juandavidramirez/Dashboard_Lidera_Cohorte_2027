import React from 'react';
import { LecturaRecord } from '../../types';
import { calculateModeloVsEvaluadorBreakdown } from '../../lib/lecturasMetricsCalculator';
import { Cpu, UserCheck, CheckCircle2 } from 'lucide-react';

interface Props {
  lecturas: LecturaRecord[];
}

export const CardModeloVsEvaluador: React.FC<Props> = ({ lecturas }) => {
  const breakdown = calculateModeloVsEvaluadorBreakdown(lecturas);

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs flex flex-col h-full">
      {/* Title Strip in Brand Deep Navy #152238 (Identical to Panels in Tablero Principal) */}
      <div className="bg-[#152238] px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[#F2A900]" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Recomendación del Modelo vs. Opinión del Evaluador
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-slate-800 text-slate-300 font-bold px-2 py-0.5 rounded border border-slate-700">
            {breakdown.totalLeidos.toLocaleString()} Evaluados
          </span>
          <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-500/30">
            Criterios Confirmados
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-5">
        <p className="text-xs text-slate-500">
          Contraste de evaluación independiente entre la clasificación predictiva de IA y el juicio humano del evaluador asignado.
        </p>

        {/* Resumen comparativo superior (Estilo KPI Cards del Tablero Principal) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
          {/* Sub-box 1: Modelo (Deep Navy) */}
          <div className="bg-white border border-slate-200/90 p-3 rounded-lg flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#152238] flex items-center gap-1.5 uppercase tracking-tight">
                <Cpu className="w-3.5 h-3.5 text-[#152238]" />
                Modelo recomienda pasar
              </span>
              <span className="text-[11px] font-bold text-slate-500 font-mono">
                {breakdown.modeloPasaCount} / {breakdown.totalLeidos}
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#152238]">
                {breakdown.modeloPasaPct}%
              </span>
              <span className="text-[10px] text-slate-500 font-semibold">
                (Pasan + Factor Ñ)
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200 mt-2">
              <div
                className="h-full bg-[#152238] rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(breakdown.modeloPasaPct, 4))}%` }}
              />
            </div>
          </div>

          {/* Sub-box 2: Evaluador (Emerald Teal) */}
          <div className="bg-emerald-50/70 border border-emerald-200/90 p-3 rounded-lg flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5 uppercase tracking-tight">
                <UserCheck className="w-3.5 h-3.5 text-[#2E9E82]" />
                Evaluador recomienda pasar
              </span>
              <span className="text-[11px] font-bold text-emerald-800 font-mono">
                {breakdown.evaluadorPasaCount} / {breakdown.totalLeidos}
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#2E9E82]">
                {breakdown.evaluadorPasaPct}%
              </span>
              <span className="text-[10px] text-emerald-800 font-semibold">
                (Aprobados entrevista)
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200 mt-2">
              <div
                className="h-full bg-[#2E9E82] rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(breakdown.evaluadorPasaPct, 4))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Columnas separadas de desglose */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
          {/* Columna 1: Modelo */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1.5 border-b-2 border-[#152238]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#152238] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#152238]" />
                Recomendación Modelo (IA)
              </span>
              <span className="text-[10px] font-bold text-slate-400">
                {breakdown.modeloCategories.length} categorías
              </span>
            </div>

            <div className="space-y-2.5">
              {breakdown.modeloCategories.map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5 truncate">
                      {item.isPass ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#152238] shrink-0" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                      )}
                      <span className="truncate">{item.label}</span>
                      {item.isPass && (
                        <span className="text-[9px] font-bold text-slate-900 bg-slate-100 border border-slate-300 px-1 py-0.2 rounded shrink-0">
                          Pasa
                        </span>
                      )}
                    </span>
                    <span className="font-mono font-bold text-slate-800 shrink-0">
                      {item.count} <span className="text-slate-400 font-normal">({item.pct}%)</span>
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.isPass ? 'bg-[#152238]' : 'bg-slate-400'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(item.pct, 2))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Columna 2: Evaluador */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1.5 border-b-2 border-[#2E9E82]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2E9E82] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#2E9E82]" />
                Opinión Evaluador (Humano)
              </span>
              <span className="text-[10px] font-bold text-slate-400">
                {breakdown.evaluadorCategories.length} categorías
              </span>
            </div>

            <div className="space-y-2.5">
              {breakdown.evaluadorCategories.map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5 truncate">
                      {item.isPass ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2E9E82] shrink-0" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                      )}
                      <span className="truncate">{item.label}</span>
                    </span>
                    <span className="font-mono font-bold text-slate-800 shrink-0">
                      {item.count} <span className="text-slate-400 font-normal">({item.pct}%)</span>
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.isPass ? 'bg-[#2E9E82]' : 'bg-slate-300'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(item.pct, 2))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Note Box */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2 text-xs text-slate-600">
          <CheckCircle2 className="w-4 h-4 text-[#2E9E82] shrink-0 mt-0.5" />
          <div className="text-[11.5px] leading-relaxed">
            <strong className="text-slate-800">Criterios de clasificación confirmados:</strong> En el modelo, <em>"Recomienda pasar"</em> y <em>"Tiene factor Ñ"</em> computan como recomendación favorable. Las opciones del evaluador corresponden a las dos respuestas oficiales registradas en el proceso de lectura.
          </div>
        </div>
      </div>
    </div>
  );
};

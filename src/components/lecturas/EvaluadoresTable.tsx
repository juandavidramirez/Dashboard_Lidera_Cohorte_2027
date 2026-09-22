import React from 'react';
import { EvaluadorSummary } from '../../types';
import { Users, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';

interface Props {
  evaluadores: EvaluadorSummary[];
}

export const EvaluadoresTable: React.FC<Props> = ({ evaluadores }) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs flex flex-col">
      {/* Title Strip in Brand Deep Navy #152238 (Identical to Panels in Tablero Principal) */}
      <div className="bg-[#152238] px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Avance Operativo por Evaluador
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-slate-800 text-slate-300 font-bold px-2 py-0.5 rounded border border-slate-700">
            {evaluadores.length} Evaluadores Asignados
          </span>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-500/30">
            Ordenado: Prioridad de Seguimiento
          </span>
        </div>
      </div>

      {/* Description Strip */}
      <div className="px-4 py-2 bg-slate-50/80 border-b border-slate-200 text-xs text-slate-500 flex items-center justify-between flex-wrap gap-2">
        <p>
          Listado ordenado de menor a mayor porcentaje de avance para focalizar la gestión y aceleración operativa.
        </p>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1 font-semibold text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-[#2E9E82]" /> On track (≥80%)
          </span>
          <span className="flex items-center gap-1 font-semibold text-amber-700">
            <span className="w-2 h-2 rounded-full bg-[#F2A900]" /> Medio (50%–79%)
          </span>
          <span className="flex items-center gap-1 font-semibold text-rose-700">
            <span className="w-2 h-2 rounded-full bg-rose-500" /> Atrasado (&lt;50%)
          </span>
        </div>
      </div>

      {/* Operative Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-600 bg-slate-50">
              <th className="py-2.5 px-4">Evaluador</th>
              <th className="py-2.5 px-3 text-right">Asignados</th>
              <th className="py-2.5 px-3 text-right">Completados</th>
              <th className="py-2.5 px-4 min-w-[220px]">% Avance</th>
              <th className="py-2.5 px-4 text-center">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {evaluadores.map((ev) => {
              const isGood = ev.estado === 'On track';
              const isWarning = ev.estado === 'Medio';
              const isCritical = ev.estado === 'Atrasado';

              const barColor = isGood
                ? 'bg-[#2E9E82]'
                : isWarning
                ? 'bg-[#F2A900]'
                : 'bg-rose-500';

              const chipBg = isGood
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : isWarning
                ? 'bg-amber-50 text-amber-900 border-amber-200'
                : 'bg-rose-50 text-rose-800 border-rose-200';

              const dotColor = isGood
                ? 'bg-emerald-600'
                : isWarning
                ? 'bg-amber-600'
                : 'bg-rose-600';

              return (
                <tr
                  key={ev.evaluador}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    isCritical ? 'bg-rose-50/30' : ''
                  }`}
                >
                  <td className="py-2.5 px-4 font-semibold text-slate-900 flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#152238] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                      {ev.evaluador.charAt(0)}
                    </span>
                    <span className="truncate font-medium">{ev.evaluador}</span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-medium text-slate-600">
                    {ev.asignados}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-[#152238]">
                    {ev.completados}
                  </td>
                  <td className="py-2.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        <div
                          className={`h-full ${barColor} rounded-full transition-all duration-500`}
                          style={{ width: `${Math.min(100, Math.max(ev.avancePct, 3))}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-slate-800 w-11 text-right">
                        {ev.avancePct}%
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${chipBg}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                      {ev.estado}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footnote Strip: Criterio Confirmado */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between flex-wrap gap-2 text-xs text-slate-600">
        <div className="flex items-center gap-1.5 text-[11.5px]">
          <CheckCircle2 className="w-4 h-4 text-[#2E9E82] shrink-0" />
          <span>
            <strong className="text-slate-800">Criterio de semáforo confirmado:</strong> 🟢 On track ≥80%, 🟡 Medio 50%–79%, 🔴 Atrasado &lt;50% — Umbral fijo estándar sobre el % de avance de lecturas asignadas.
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          Total asignaciones: {evaluadores.reduce((acc, curr) => acc + curr.asignados, 0)}
        </span>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { LecturaRecord, PerfilFilterType } from '../../types';
import { calculatePerfilSeleccionadosStat } from '../../lib/lecturasMetricsCalculator';
import { Award, Info, CheckCircle2 } from 'lucide-react';

interface Props {
  lecturas: LecturaRecord[];
  totalCumplenMinimos: number;
}

export const CardPerfilSeleccionados: React.FC<Props> = ({ lecturas, totalCumplenMinimos }) => {
  const [activeFilter, setActiveFilter] = useState<PerfilFilterType>('uni_prioritaria');

  const stat = calculatePerfilSeleccionadosStat(lecturas, totalCumplenMinimos, activeFilter);

  const filterOptions: Array<{ id: PerfilFilterType; label: string }> = [
    { id: 'uni_prioritaria', label: 'Universidad priorizada' },
    { id: 'is_bilingual', label: 'Bilingüe (B2+)' },
    { id: 'or', label: 'Uno u otro (OR)' },
    { id: 'and', label: 'Ambos (AND)' }
  ];

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs flex flex-col h-full">
      {/* Title Strip in Brand Deep Navy #152238 (Identical to Panels in Tablero Principal) */}
      <div className="bg-[#152238] px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-[#F2A900]" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Perfil de Seleccionados (Estratégico)
          </h3>
        </div>

        {/* Segmented Filter Pills (Tablero Principal Style) */}
        <div className="flex gap-0.5 bg-slate-900/60 p-0.5 rounded text-[10px] border border-slate-700">
          {filterOptions.map((opt) => {
            const isActive = activeFilter === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setActiveFilter(opt.id)}
                className={`px-2.5 py-1 rounded font-bold transition-all ${
                  isActive
                    ? 'bg-[#2E9E82] text-white shadow-2xs'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-5">
        <p className="text-xs text-slate-500">
          Candidatos con atributos estratégicos que el evaluador recomienda pasar, contrastados contra el total general de candidatos que cumplen mínimos ({stat.totalCumplenMinimos.toLocaleString()}).
        </p>

        {/* Número destacado y métrica principal estilo KpiHeaderBand */}
        <div className="p-4 bg-emerald-50/70 border border-emerald-200/90 rounded-xl flex items-baseline justify-between flex-wrap gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 block">
              Seleccionados con {stat.filtroLabel}
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl sm:text-4xl font-black text-[#2E9E82]">
                {stat.pctSeleccionadosSobreTotal}%
              </span>
              <span className="text-xs font-bold text-slate-600">
                ({stat.seleccionadosCount.toLocaleString()} de {stat.totalCumplenMinimos.toLocaleString()} elegibles totales)
              </span>
            </div>
            <span className="text-[10px] text-emerald-800 font-semibold block mt-0.5">
              Cálculo con denominador en vivo sobre la cohorte
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight block">
              Universo Elegibles
            </span>
            <span className="text-xl font-mono font-bold text-[#152238]">
              {stat.totalCumplenMinimos.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400 block">cumplen mínimos</span>
          </div>
        </div>

        {/* Barra de progreso única con 2 segmentos anidados */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span className="font-semibold text-slate-700">
              Representación sobre el Total de Elegibles (100% = {stat.totalCumplenMinimos.toLocaleString()})
            </span>
            <span className="font-mono text-slate-500 font-semibold text-[11px]">
              {stat.totalLeidosConPerfilCount} leídos con este perfil
            </span>
          </div>

          {/* Stacked Progress Bar */}
          <div className="w-full h-7 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex p-0.5 gap-0.5">
            {/* Segmento 1: Seleccionados (Verde Esmeralda) */}
            <div
              className="h-full bg-[#2E9E82] rounded-l-md transition-all duration-500 relative group flex items-center justify-center text-white text-[11px] font-black"
              style={{ width: `${Math.max(stat.pctBarraSeleccionados, 3)}%` }}
              title={`Seleccionados: ${stat.seleccionadosCount} (${stat.pctSeleccionadosSobreTotal}%)`}
            >
              {stat.pctBarraSeleccionados > 6 && `${stat.pctBarraSeleccionados}%`}
            </div>

            {/* Segmento 2: Leídos no seleccionados (Azul Navy #152238) */}
            <div
              className="h-full bg-[#152238] rounded-r-md transition-all duration-500 relative group flex items-center justify-center text-white text-[11px] font-black"
              style={{ width: `${Math.max(stat.pctBarraLeidosNoSel, 2)}%` }}
              title={`Leídos pero no seleccionados: ${stat.leidosNoSeleccionadosCount} (${stat.pctLeidosNoSelSobreTotal}%)`}
            >
              {stat.pctBarraLeidosNoSel > 6 && `${stat.pctBarraLeidosNoSel}%`}
            </div>

            {/* Segmento 3: Resto del universo (Gris neutro de fondo) */}
            <div className="h-full flex-1 bg-slate-100 rounded-r-md" />
          </div>

          {/* Leyenda clara de colores */}
          <div className="flex items-center justify-start flex-wrap gap-4 pt-1 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#2E9E82]" />
              <span className="font-semibold text-slate-800">
                Seleccionados ({stat.seleccionadosCount})
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#152238]" />
              <span className="font-semibold text-slate-800">
                Leídos sin seleccionar ({stat.leidosNoSeleccionadosCount})
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-slate-200 border border-slate-300" />
              <span className="text-slate-500">
                Resto de candidatos elegibles ({stat.totalCumplenMinimos - stat.totalLeidosConPerfilCount})
              </span>
            </div>
          </div>
        </div>

        {/* Explicación dinámica */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2 text-xs text-slate-600">
          <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <p className="text-[11.5px] leading-relaxed">
            <strong className="text-slate-800">{stat.seleccionadosCount} seleccionados</strong> + {stat.leidosNoSeleccionadosCount} leídos sin seleccionar = <strong className="text-slate-800">{stat.totalLeidosConPerfilCount} leídos</strong> con el perfil <em>"{stat.filtroLabel}"</em>, de un total general de {stat.totalCumplenMinimos.toLocaleString()} candidatos que cumplen mínimos en la cohorte · <strong className="text-[#2E9E82] font-black">{stat.pctSeleccionadosSobreTotal}%</strong> seleccionados sobre el total.
          </p>
        </div>
      </div>
    </div>
  );
};

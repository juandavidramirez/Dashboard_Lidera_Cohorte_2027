import React, { useState } from 'react';
import { LecturaRecord, PerfilFilterType } from '../../types';
import { calculatePerfilSeleccionadosStat } from '../../lib/lecturasMetricsCalculator';
import { Award } from 'lucide-react';

interface Props {
  lecturas: LecturaRecord[];
  totalCumplenMinimos: number;
}

export const CardPerfilSeleccionados: React.FC<Props> = ({ lecturas, totalCumplenMinimos }) => {
  const [activeFilter, setActiveFilter] = useState<PerfilFilterType>('uni_prioritaria');

  const stat = calculatePerfilSeleccionadosStat(lecturas, totalCumplenMinimos, activeFilter);

  const filterOptions: Array<{ id: PerfilFilterType; label: string }> = [
    { id: 'uni_prioritaria', label: 'Univ. Priorizada' },
    { id: 'bilingue', label: 'Bilingüe' },
    { id: 'stem', label: 'STEM' },
    { id: 'stem_or_bilingue', label: 'STEM o Bilingüe (OR)' },
    { id: 'stem_and_bilingue', label: 'STEM y Bilingüe (AND)' }
  ];

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs flex flex-col h-full">
      {/* Title Strip in Brand Yellow-Orange #F2A900 */}
      <div className="bg-[#F2A900] px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 border-b border-amber-300">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-slate-950" />
          <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider">
            Perfil de Seleccionados
          </h3>
        </div>

        {/* Segmented Filter Pills */}
        <div className="flex flex-wrap gap-0.5 bg-black/10 p-0.5 rounded text-[10px] border border-amber-400/60">
          {filterOptions.map((opt) => {
            const isActive = activeFilter === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setActiveFilter(opt.id)}
                className={`px-2 py-1 rounded font-bold transition-all ${
                  isActive
                    ? 'bg-[#152238] text-white shadow-2xs'
                    : 'text-slate-900/80 hover:text-slate-950 hover:bg-white/30'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        {/* Número destacado limpio y sin texto redundante */}
        <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl flex items-baseline justify-between flex-wrap gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-950 block">
              Seleccionados con {stat.filtroLabel}
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl sm:text-4xl font-black text-[#152238]">
                {stat.pctSeleccionadosSobreSeleccionados}%
              </span>
              <span className="text-xs font-bold text-slate-600">
                ({stat.seleccionadosCount.toLocaleString()} de {stat.totalSeleccionados.toLocaleString()})
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight block">
              Total Seleccionados
            </span>
            <span className="text-xl font-mono font-bold text-slate-800">
              {stat.totalSeleccionados.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Barra de progreso sobre el grupo de seleccionados */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span className="font-semibold text-slate-700">
              Participación sobre Seleccionados
            </span>
            <span className="font-mono text-slate-500 font-semibold text-[11px]">
              {stat.totalLeidosConPerfilCount} leídos con este perfil
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-6 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex p-0.5 gap-0.5">
            {/* Segmento 1: Seleccionados con perfil (Amarillo-Naranja #F2A900) */}
            <div
              className="h-full bg-[#F2A900] text-slate-950 rounded-l-md transition-all duration-500 flex items-center justify-center text-[11px] font-black"
              style={{ width: `${Math.max(stat.pctBarraSeleccionados, 4)}%` }}
              title={`Seleccionados con este perfil: ${stat.seleccionadosCount} (${stat.pctSeleccionadosSobreSeleccionados}%)`}
            >
              {stat.pctBarraSeleccionados > 8 && `${stat.pctBarraSeleccionados}%`}
            </div>

            {/* Segmento 2: Otros seleccionados (Deep Navy #152238) */}
            <div
              className="h-full bg-[#152238] rounded-r-md transition-all duration-500 flex items-center justify-center text-white text-[11px] font-black"
              style={{ width: `${Math.max(100 - stat.pctBarraSeleccionados, 4)}%` }}
              title={`Otros seleccionados: ${stat.totalSeleccionados - stat.seleccionadosCount}`}
            >
              {(100 - stat.pctBarraSeleccionados) > 8 && `${(100 - stat.pctBarraSeleccionados).toFixed(1)}%`}
            </div>
          </div>

          {/* Leyenda limpia sin ruido */}
          <div className="flex items-center justify-start flex-wrap gap-4 pt-1 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#F2A900]" />
              <span className="font-semibold text-slate-800">
                Con {stat.filtroLabel} ({stat.seleccionadosCount})
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#152238]" />
              <span className="font-semibold text-slate-800">
                Otros ({stat.totalSeleccionados - stat.seleccionadosCount})
              </span>
            </div>
            <span className="text-[11px] text-slate-400 ml-auto font-mono">
              {stat.leidosNoSeleccionadosCount} no seleccionados con este perfil
            </span>
          </div>
        </div>

        {/* Footer mínimo */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Clasificación por Enfoque y Universidad Priorizada</span>
          <span>{stat.totalCumplenMinimos.toLocaleString()} elegibles cohorte</span>
        </div>
      </div>
    </div>
  );
};

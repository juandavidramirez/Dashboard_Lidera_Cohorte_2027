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
    { id: 'uni_prioritaria', label: 'Univ. Priorizada' },
    { id: 'bilingue', label: 'Bilingüe' },
    { id: 'stem', label: 'STEM' },
    { id: 'stem_or_bilingue', label: 'STEM o Bilingüe (OR)' },
    { id: 'stem_and_bilingue', label: 'STEM y Bilingüe (AND)' }
  ];

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs flex flex-col h-full">
      {/* Title Strip in Brand Deep Navy #152238 */}
      <div className="bg-[#152238] px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-[#F2A900]" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Perfil de Seleccionados
          </h3>
        </div>

        {/* Segmented Filter Pills (5 standalone & Enfoque options) */}
        <div className="flex flex-wrap gap-0.5 bg-slate-900/60 p-0.5 rounded text-[10px] border border-slate-700">
          {filterOptions.map((opt) => {
            const isActive = activeFilter === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setActiveFilter(opt.id)}
                className={`px-2 py-1 rounded font-bold transition-all ${
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

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <p className="text-xs text-slate-500">
          Composición estratégica del grupo recomendado a entrevista por los evaluadores ({stat.totalSeleccionados.toLocaleString()} seleccionados).
        </p>

        {/* Número destacado y métrica principal con base en los seleccionados */}
        <div className="p-4 bg-emerald-50/70 border border-emerald-200/90 rounded-xl flex items-baseline justify-between flex-wrap gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 block">
              Seleccionados con {stat.filtroLabel}
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl sm:text-4xl font-black text-[#2E9E82]">
                {stat.pctSeleccionadosSobreSeleccionados}%
              </span>
              <span className="text-xs font-bold text-slate-600">
                ({stat.seleccionadosCount.toLocaleString()} de {stat.totalSeleccionados.toLocaleString()} seleccionados)
              </span>
            </div>
            <span className="text-[10px] text-emerald-800 font-semibold block mt-0.5">
              Base actualizada: % sobre el total de candidatos seleccionados
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight block">
              Total Seleccionados
            </span>
            <span className="text-xl font-mono font-bold text-[#152238]">
              {stat.totalSeleccionados.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400 block">pasan a entrevista</span>
          </div>
        </div>

        {/* Barra de progreso sobre el grupo de seleccionados */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span className="font-semibold text-slate-700">
              Participación sobre Seleccionados (100% = {stat.totalSeleccionados.toLocaleString()})
            </span>
            <span className="font-mono text-slate-500 font-semibold text-[11px]">
              {stat.totalLeidosConPerfilCount} leídos evaluados con este perfil
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-7 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex p-0.5 gap-0.5">
            {/* Segmento 1: Seleccionados con perfil (Verde Esmeralda) */}
            <div
              className="h-full bg-[#2E9E82] rounded-l-md transition-all duration-500 relative group flex items-center justify-center text-white text-[11px] font-black"
              style={{ width: `${Math.max(stat.pctBarraSeleccionados, 4)}%` }}
              title={`Seleccionados con este perfil: ${stat.seleccionadosCount} (${stat.pctSeleccionadosSobreSeleccionados}%)`}
            >
              {stat.pctBarraSeleccionados > 8 && `${stat.pctBarraSeleccionados}%`}
            </div>

            {/* Segmento 2: Otros seleccionados (Azul Navy #152238) */}
            <div
              className="h-full bg-[#152238] rounded-r-md transition-all duration-500 relative group flex items-center justify-center text-white text-[11px] font-black"
              style={{ width: `${Math.max(100 - stat.pctBarraSeleccionados, 4)}%` }}
              title={`Otros seleccionados: ${stat.totalSeleccionados - stat.seleccionadosCount} (${(100 - stat.pctBarraSeleccionados).toFixed(1)}%)`}
            >
              {(100 - stat.pctBarraSeleccionados) > 8 && `${(100 - stat.pctBarraSeleccionados).toFixed(1)}%`}
            </div>
          </div>

          {/* Leyenda clara de colores */}
          <div className="flex items-center justify-start flex-wrap gap-4 pt-1 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#2E9E82]" />
              <span className="font-semibold text-slate-800">
                Con {stat.filtroLabel} ({stat.seleccionadosCount})
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#152238]" />
              <span className="font-semibold text-slate-800">
                Otros seleccionados ({stat.totalSeleccionados - stat.seleccionadosCount})
              </span>
            </div>
            <div className="flex items-center gap-1.5 ml-auto text-slate-500 font-medium">
              <Info className="w-3.5 h-3.5 text-slate-400" />
              <span>{stat.leidosNoSeleccionadosCount} leídos con perfil no seleccionados</span>
            </div>
          </div>
        </div>

        {/* Explicación dinámica */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2 text-xs text-slate-600">
          <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <p className="text-[11.5px] leading-relaxed">
            De los <strong className="text-slate-800">{stat.totalSeleccionados.toLocaleString()} candidatos seleccionados</strong>, <strong className="text-[#2E9E82] font-black">{stat.seleccionadosCount} ({stat.pctSeleccionadosSobreSeleccionados}%)</strong> cuentan con el perfil <em>"{stat.filtroLabel}"</em> · Además hubo {stat.leidosNoSeleccionadosCount} leídos evaluados con este perfil que no pasaron.
          </p>
        </div>

        {/* Footer info contextual */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Clasificación derivada de: Enfoque y Universidad Priorizada
          </span>
          <span className="font-mono text-slate-400">
            {stat.totalCumplenMinimos.toLocaleString()} elegibles cohorte
          </span>
        </div>
      </div>
    </div>
  );
};

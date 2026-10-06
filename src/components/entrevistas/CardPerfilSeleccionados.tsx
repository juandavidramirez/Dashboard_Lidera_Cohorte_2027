import React, { useState } from 'react';
import { EntrevistaRecord, CombinablePerfilFilterState } from '../../types';
import { calculatePerfilCombinadoStat } from '../../lib/entrevistasMetricsCalculator';
import { Award, Filter, RotateCcw, Check } from 'lucide-react';

interface Props {
  entrevistas: EntrevistaRecord[];
  totalCumplenMinimos: number;
}

export const CardPerfilSeleccionados: React.FC<Props> = ({ entrevistas, totalCumplenMinimos }) => {
  const [filters, setFilters] = useState<CombinablePerfilFilterState>({
    uniPriorizada: true,
    bilingue: false,
    stem: false,
    stemOrBilingue: false,
    menores30: false
  });

  const toggleFilter = (key: keyof CombinablePerfilFilterState) => {
    setFilters(prev => {
      const next = { ...prev, [key]: !prev[key] };

      // Si activa STEM o Bilingüe (OR), desactiva los individuales para evitar redundancia
      if (key === 'stemOrBilingue' && next.stemOrBilingue) {
        next.stem = false;
        next.bilingue = false;
      }
      // Si activa STEM o Bilingüe individual, desactiva el OR general
      if ((key === 'stem' || key === 'bilingue') && next[key]) {
        next.stemOrBilingue = false;
      }

      return next;
    });
  };

  const resetFilters = () => {
    setFilters({
      uniPriorizada: false,
      bilingue: false,
      stem: false,
      stemOrBilingue: false,
      menores30: false
    });
  };

  const stat = calculatePerfilCombinadoStat(entrevistas, totalCumplenMinimos, filters);

  const filterButtons: Array<{ key: keyof CombinablePerfilFilterState; label: string; tooltip: string }> = [
    { key: 'menores30', label: 'Menores de 30', tooltip: 'Candidatos con edad menor a 30 años' },
    { key: 'stem', label: 'STEM', tooltip: 'Ruta o formación en Ciencia, Tecnología, Ingeniería y Matemáticas' },
    { key: 'bilingue', label: 'Bilingüe', tooltip: 'Nivel de inglés B2 o superior' },
    { key: 'stemOrBilingue', label: 'STEM o Bilingüe (OR)', tooltip: 'Cumple al menos una de las dos condiciones' },
    { key: 'uniPriorizada', label: 'Univ. Priorizada', tooltip: 'Proviene de una universidad focalizada por LIDERA' }
  ];

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs flex flex-col h-full">
      {/* Title Strip in Brand Amber #F2A900 */}
      <div className="bg-[#F2A900] px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 border-b border-amber-300">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-slate-950" />
          <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider">
            Perfil de Seleccionados (Aceptados)
          </h3>
        </div>

        {stat.hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-1 text-[10px] font-bold bg-[#152238] text-white hover:bg-slate-800 px-2 py-0.5 rounded shadow-2xs transition-colors cursor-pointer"
            title="Restablecer filtros a sin selección"
          >
            <RotateCcw className="w-3 h-3" />
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        {/* Selector interactivo de filtros concatenables */}
        <div className="bg-slate-50/90 border border-slate-200/90 rounded-xl p-3 text-xs space-y-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span>Filtros Estratégicos Combinables (Concatenar con AND):</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              Selecciona uno o varios
            </span>
          </div>

          <div className="flex items-center flex-wrap gap-1.5">
            {filterButtons.map((btn) => {
              const isChecked = filters[btn.key];
              return (
                <button
                  key={btn.key}
                  type="button"
                  onClick={() => toggleFilter(btn.key)}
                  title={btn.tooltip}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all border shadow-2xs cursor-pointer ${
                    isChecked
                      ? 'bg-[#152238] text-white border-[#152238] ring-2 ring-[#152238]/20'
                      : 'bg-white text-slate-700 hover:text-slate-950 border-slate-200 hover:bg-slate-100/80'
                  }`}
                >
                  <span
                    className={`w-3.5 h-3.5 rounded flex items-center justify-center border text-[9px] transition-colors ${
                      isChecked
                        ? 'bg-[#2E9E82] border-[#2E9E82] text-white'
                        : 'border-slate-300 bg-slate-50'
                    }`}
                  >
                    {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </span>
                  <span>{btn.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scorecard destacado con label dinámico */}
        <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl flex items-baseline justify-between flex-wrap gap-3">
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-950 block truncate" title={stat.filtroLabel}>
              Aceptados con: <strong className="text-slate-900 font-black">{stat.filtroLabel}</strong>
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

          <div className="text-right shrink-0">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight block">
              Total Aceptados
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
              Participación sobre Total de Aceptados
            </span>
            <span className="font-mono text-slate-500 font-semibold text-[11px]">
              {stat.totalEvaluadosConPerfilCount} evaluados totales con este perfil
            </span>
          </div>

          {/* Dual Progress Bar */}
          <div className="w-full h-6 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex p-0.5 gap-0.5">
            {/* Segmento 1: Aceptados con perfil */}
            <div
              className="h-full bg-[#F2A900] text-slate-950 rounded-l-md transition-all duration-500 flex items-center justify-center text-[11px] font-black"
              style={{ width: `${Math.max(stat.pctBarraSeleccionados, stat.seleccionadosCount > 0 ? 4 : 0)}%` }}
              title={`Aceptados con este perfil: ${stat.seleccionadosCount} (${stat.pctSeleccionadosSobreSeleccionados}%)`}
            >
              {stat.pctBarraSeleccionados > 8 && `${stat.pctBarraSeleccionados}%`}
            </div>

            {/* Segmento 2: Otros aceptados */}
            <div
              className="h-full bg-[#152238] rounded-r-md transition-all duration-500 flex items-center justify-center text-white text-[11px] font-black"
              style={{ width: `${Math.max(100 - stat.pctBarraSeleccionados, (stat.totalSeleccionados - stat.seleccionadosCount) > 0 ? 4 : 0)}%` }}
              title={`Otros aceptados: ${stat.totalSeleccionados - stat.seleccionadosCount}`}
            >
              {(100 - stat.pctBarraSeleccionados) > 8 && `${(100 - stat.pctBarraSeleccionados).toFixed(1)}%`}
            </div>
          </div>

          {/* Leyenda */}
          <div className="flex items-center justify-start flex-wrap gap-4 pt-1 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#F2A900]" />
              <span className="font-semibold text-slate-800">
                Con perfil seleccionado ({stat.seleccionadosCount})
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#152238]" />
              <span className="font-semibold text-slate-800">
                Otros Aceptados ({stat.totalSeleccionados - stat.seleccionadosCount})
              </span>
            </div>
            <span className="text-[11px] text-slate-400 ml-auto font-mono">
              {stat.evaluadosNoSeleccionadosCount} no seleccionados con este perfil
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Cruce de Perfil Estratégico Combinable</span>
          <span>Base Seleccionados: {stat.totalSeleccionados}</span>
        </div>
      </div>
    </div>
  );
};

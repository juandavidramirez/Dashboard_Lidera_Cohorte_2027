import React from 'react';
import { EntrevistaRecord } from '../../types';
import {
  calculateTipoPregradoBreakdown,
  calculateEnfoqueBreakdown,
  calculateEdadesBreakdown,
  calculateGeneroBreakdown,
  calculateCiudadesBreakdown
} from '../../lib/entrevistasMetricsCalculator';
import {
  GraduationCap,
  Sparkles,
  Calendar,
  Users,
  MapPin
} from 'lucide-react';

interface Props {
  entrevistas: EntrevistaRecord[];
}

export const CardsComposicionSeleccionados: React.FC<Props> = ({ entrevistas }) => {
  const tipoPregrado = calculateTipoPregradoBreakdown(entrevistas);
  const enfoque = calculateEnfoqueBreakdown(entrevistas);
  const edades = calculateEdadesBreakdown(entrevistas);
  const genero = calculateGeneroBreakdown(entrevistas);
  const ciudades = calculateCiudadesBreakdown(entrevistas);

  return (
    <div className="space-y-4">
      {/* Grid de los 4 desgloses demográficos y académicos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Profesionales vs. Licenciados */}
        <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs flex flex-col justify-between">
          <div className="bg-[#F2A900] px-3.5 py-2 flex items-center justify-between border-b border-amber-300">
            <div className="flex items-center gap-2 text-slate-950">
              <GraduationCap className="w-4 h-4 text-slate-950" />
              <h4 className="text-xs font-black uppercase tracking-wider">
                Pregrado
              </h4>
            </div>
          </div>

          <div className="p-3.5 space-y-3 flex-1 flex flex-col justify-center">
            {tipoPregrado.items.map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">{item.label}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-slate-900 text-xs">
                      {item.count}
                    </span>
                    <span className="font-mono text-slate-400 text-[11px]">
                      ({item.pct}%)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(item.pct, item.count > 0 ? 3 : 0)}%`,
                      backgroundColor: item.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. STEM / Enfoque (4 categorías) */}
        <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs flex flex-col justify-between">
          <div className="bg-[#F2A900] px-3.5 py-2 flex items-center justify-between border-b border-amber-300">
            <div className="flex items-center gap-2 text-slate-950">
              <Sparkles className="w-4 h-4 text-slate-950" />
              <h4 className="text-xs font-black uppercase tracking-wider">
                Enfoque / STEM
              </h4>
            </div>
          </div>

          <div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-center">
            {enfoque.items.map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 truncate max-w-[130px]" title={item.label}>
                    {item.label}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-slate-900 text-xs">
                      {item.count}
                    </span>
                    <span className="font-mono text-slate-400 text-[11px]">
                      ({item.pct}%)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(item.pct, item.count > 0 ? 3 : 0)}%`,
                      backgroundColor: item.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Rangos de Edad */}
        <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs flex flex-col justify-between">
          <div className="bg-[#F2A900] px-3.5 py-2 flex items-center justify-between border-b border-amber-300">
            <div className="flex items-center gap-2 text-slate-950">
              <Calendar className="w-4 h-4 text-slate-950" />
              <h4 className="text-xs font-black uppercase tracking-wider">
                Rangos de Edad
              </h4>
            </div>
          </div>

          <div className="p-3.5 space-y-3 flex-1 flex flex-col justify-center">
            {edades.items.map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">{item.label}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-slate-900 text-xs">
                      {item.count}
                    </span>
                    <span className="font-mono text-slate-400 text-[11px]">
                      ({item.pct}%)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(item.pct, item.count > 0 ? 2 : 0)}%`,
                      backgroundColor: item.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Género */}
        <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs flex flex-col justify-between">
          <div className="bg-[#F2A900] px-3.5 py-2 flex items-center justify-between border-b border-amber-300">
            <div className="flex items-center gap-2 text-slate-950">
              <Users className="w-4 h-4 text-slate-950" />
              <h4 className="text-xs font-black uppercase tracking-wider">
                Género
              </h4>
            </div>
          </div>

          <div className="p-3.5 space-y-3 flex-1 flex flex-col justify-center">
            {genero.items.map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">{item.label}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-slate-900 text-xs">
                      {item.count}
                    </span>
                    <span className="font-mono text-slate-400 text-[11px]">
                      ({item.pct}%)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(item.pct, item.count > 0 ? 3 : 0)}%`,
                      backgroundColor: item.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Gráfico de Ciudad — Leaderboard Ranking con Barras de Magnitud */}
      <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs">
        <div className="bg-[#F2A900] px-4 py-2.5 flex items-center justify-between border-b border-amber-300 flex-wrap gap-2">
          <div className="flex items-center gap-2 text-slate-950">
            <MapPin className="w-4 h-4 text-slate-950" />
            <h4 className="text-xs font-black uppercase tracking-wider">
              Ciudad de Nacimiento — Ranking Territorial
            </h4>
          </div>
          <span className="text-[10px] font-bold text-slate-900 bg-white/80 border border-amber-400 px-2 py-0.5 rounded shadow-2xs">
            Foco Territorial: Cali · Barranquilla · Medellín ({ciudades.focoCitiesCount} · {ciudades.focoCitiesPct}%)
          </span>
        </div>

        <div className="p-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] uppercase font-bold text-slate-400">
                <th className="py-2 px-2.5 w-10">#</th>
                <th className="py-2 px-3">Ciudad</th>
                <th className="py-2 px-3 w-48 sm:w-72">Magnitud relativa</th>
                <th className="py-2 px-3 text-right">Aceptados</th>
                <th className="py-2 px-3 text-right">%</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ciudades.items.map((c) => (
                <tr
                  key={c.label}
                  className={`transition-colors ${
                    c.isFoco ? 'bg-amber-50/60 font-semibold' : 'hover:bg-slate-50/80'
                  }`}
                >
                  <td className="py-2 px-2.5 text-slate-400 font-mono text-[11px]">
                    {c.rank}
                  </td>
                  <td className="py-2 px-3 text-slate-800">
                    <div className="flex items-center gap-1.5">
                      <span>{c.label}</span>
                      {c.isFoco && (
                        <span className="text-[9px] font-bold bg-[#F2A900] text-slate-950 border border-amber-400 px-1.5 py-0.2 rounded">
                          Foco
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-2 px-3">
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          c.isFoco ? 'bg-[#F2A900]' : 'bg-[#152238]'
                        }`}
                        style={{ width: `${Math.max(c.magnitudePct, 2)}%` }}
                        title={`Magnitud: ${c.count} vs ${ciudades.maxCityCount} de la ciudad líder`}
                      />
                    </div>
                  </td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                    {c.count}
                  </td>
                  <td className="py-2 px-3 text-right font-mono text-slate-500">
                    {c.pct}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

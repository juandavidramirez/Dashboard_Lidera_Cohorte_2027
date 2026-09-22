import React from 'react';
import { LecturaRecord } from '../../types';
import {
  calculateTipoPregradoBreakdown,
  calculateEnfoqueBreakdown,
  calculateEdadesBreakdown,
  calculateGeneroBreakdown,
  calculateCiudadesBreakdown
} from '../../lib/lecturasMetricsCalculator';
import {
  GraduationCap,
  Sparkles,
  Calendar,
  Users,
  MapPin
} from 'lucide-react';

interface Props {
  lecturas: LecturaRecord[];
}

export const CardsComposicionSeleccionados: React.FC<Props> = ({ lecturas }) => {
  const tipoPregrado = calculateTipoPregradoBreakdown(lecturas);
  const enfoque = calculateEnfoqueBreakdown(lecturas);
  const edades = calculateEdadesBreakdown(lecturas);
  const genero = calculateGeneroBreakdown(lecturas);
  const ciudades = calculateCiudadesBreakdown(lecturas);

  const totalSel = tipoPregrado.totalSeleccionados;

  return (
    <div className="space-y-4">
      {/* Subheader descriptivo conciso */}
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] sm:text-[11px] font-extrabold text-amber-950 uppercase tracking-wider bg-amber-100/90 border border-amber-300 px-2.5 py-0.5 rounded-md flex items-center gap-1.5 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-amber-600" />
          Composición del Grupo Seleccionado ({totalSel.toLocaleString()} candidatos)
        </span>
      </div>

      {/* Grid de los 4 desgloses demográficos y académicos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Profesionales vs. Licenciados */}
        <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs flex flex-col justify-between">
          <div className="bg-[#854D0E] px-3.5 py-2 flex items-center justify-between border-b border-amber-700">
            <div className="flex items-center gap-2 text-white">
              <GraduationCap className="w-4 h-4 text-amber-200" />
              <h4 className="text-xs font-bold uppercase tracking-wider">
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
                      width: `${Math.max(item.pct, 2)}%`,
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
          <div className="bg-[#854D0E] px-3.5 py-2 flex items-center justify-between border-b border-amber-700">
            <div className="flex items-center gap-2 text-white">
              <Sparkles className="w-4 h-4 text-amber-200" />
              <h4 className="text-xs font-bold uppercase tracking-wider">
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
          <div className="bg-[#854D0E] px-3.5 py-2 flex items-center justify-between border-b border-amber-700">
            <div className="flex items-center gap-2 text-white">
              <Calendar className="w-4 h-4 text-amber-200" />
              <h4 className="text-xs font-bold uppercase tracking-wider">
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
          <div className="bg-[#854D0E] px-3.5 py-2 flex items-center justify-between border-b border-amber-700">
            <div className="flex items-center gap-2 text-white">
              <Users className="w-4 h-4 text-amber-200" />
              <h4 className="text-xs font-bold uppercase tracking-wider">
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
        <div className="bg-[#854D0E] px-4 py-2.5 flex items-center justify-between border-b border-amber-700 flex-wrap gap-2">
          <div className="flex items-center gap-2 text-white">
            <MapPin className="w-4 h-4 text-amber-200" />
            <h4 className="text-xs font-bold uppercase tracking-wider">
              Ciudad de Nacimiento — Ranking Territorial
            </h4>
          </div>
          <span className="text-[10px] font-bold text-amber-100 bg-amber-950/60 border border-amber-600/50 px-2 py-0.5 rounded">
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
                <th className="py-2 px-3 text-right">Seleccionados</th>
                <th className="py-2 px-3 text-right">%</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ciudades.items.map((c) => (
                <tr
                  key={c.label}
                  className={`transition-colors ${
                    c.isFoco ? 'bg-amber-50/50 font-semibold' : 'hover:bg-slate-50/80'
                  }`}
                >
                  <td className="py-2 px-2.5 text-slate-400 font-mono text-[11px]">
                    {c.rank}
                  </td>
                  <td className="py-2 px-3 text-slate-800">
                    <div className="flex items-center gap-1.5">
                      <span>{c.label}</span>
                      {c.isFoco && (
                        <span className="text-[9px] font-bold bg-amber-200 text-amber-900 border border-amber-400 px-1.5 py-0.2 rounded">
                          Foco
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-2 px-3">
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          c.isFoco ? 'bg-amber-600' : 'bg-slate-500'
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

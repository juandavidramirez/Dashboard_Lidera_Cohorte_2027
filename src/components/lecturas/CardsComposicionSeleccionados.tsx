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
  MapPin,
  Info
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
      {/* Subheader descriptivo */}
      <div className="flex items-center justify-between px-1 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] sm:text-[11px] font-extrabold text-slate-800 uppercase tracking-wider bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-md flex items-center gap-1.5 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#2E9E82]" />
            Composición del Grupo Seleccionado ({totalSel.toLocaleString()} candidatos)
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            Todos los porcentajes calculados sobre los {totalSel.toLocaleString()} candidatos recomendados a entrevista
          </span>
        </div>
      </div>

      {/* Grid de los 5 Desgloses */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* 1. Profesionales vs. Licenciados */}
        <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs flex flex-col justify-between">
          <div className="bg-[#152238] px-3.5 py-2.5 flex items-center justify-between border-b border-slate-700">
            <div className="flex items-center gap-2 text-white">
              <GraduationCap className="w-4 h-4 text-[#F2A900]" />
              <h4 className="text-xs font-bold uppercase tracking-wider">
                Profesionales vs. Licenciados
              </h4>
            </div>
            <span className="text-[10px] font-mono text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded">
              tipo_pregrado
            </span>
          </div>

          <div className="p-4 space-y-3.5 flex-1 flex flex-col justify-between">
            <div className="space-y-3">
              {tipoPregrado.items.map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{item.label}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-slate-500 text-[11px]">
                        {item.count} seleccionados
                      </span>
                      <span className="font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                        {item.pct}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
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

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>{tipoPregrado.items[0]?.label}: {tipoPregrado.items[0]?.count} ({tipoPregrado.items[0]?.pct}%)</span>
              <span>{tipoPregrado.items[1]?.label}: {tipoPregrado.items[1]?.count} ({tipoPregrado.items[1]?.pct}%)</span>
            </div>
          </div>
        </div>

        {/* 2. STEM / Enfoque (4 categorías) */}
        <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs flex flex-col justify-between">
          <div className="bg-[#152238] px-3.5 py-2.5 flex items-center justify-between border-b border-slate-700">
            <div className="flex items-center gap-2 text-white">
              <Sparkles className="w-4 h-4 text-[#F2A900]" />
              <h4 className="text-xs font-bold uppercase tracking-wider">
                Distribución por Enfoque / STEM
              </h4>
            </div>
            <span className="text-[10px] font-mono text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded">
              enfoque (4 cat.)
            </span>
          </div>

          <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
            <div className="space-y-2.5">
              {enfoque.items.map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 truncate max-w-[170px]" title={item.label}>
                      {item.label}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-slate-500 text-[11px]">
                        {item.count}
                      </span>
                      <span className="font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                        {item.pct}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
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

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="text-emerald-700 font-semibold">
                STEM o Bilingüe: 100%
              </span>
              <span className="font-mono text-slate-400">
                Base: {totalSel} sel.
              </span>
            </div>
          </div>
        </div>

        {/* 3. Rangos de Edad */}
        <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs flex flex-col justify-between">
          <div className="bg-[#152238] px-3.5 py-2.5 flex items-center justify-between border-b border-slate-700">
            <div className="flex items-center gap-2 text-white">
              <Calendar className="w-4 h-4 text-[#F2A900]" />
              <h4 className="text-xs font-bold uppercase tracking-wider">
                Rangos de Edad
              </h4>
            </div>
            <span className="text-[10px] font-mono text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded">
              3 buckets (&lt;22, 22-29, &gt;29)
            </span>
          </div>

          <div className="p-4 space-y-3.5 flex-1 flex flex-col justify-between">
            <div className="space-y-3">
              {edades.items.map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-slate-700">{item.label}</span>
                      <span className="text-[10px] text-slate-400 ml-1.5 hidden sm:inline">
                        ({item.sublabel})
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-slate-500 text-[11px]">
                        {item.count}
                      </span>
                      <span className="font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                        {item.pct}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
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

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="text-slate-600 font-medium">
                Población central: 22 a 29 años ({edades.items[1]?.pct}%)
              </span>
              <span className="font-mono text-slate-400">
                Calculado desde edad
              </span>
            </div>
          </div>
        </div>

        {/* 4. Género */}
        <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs flex flex-col justify-between">
          <div className="bg-[#152238] px-3.5 py-2.5 flex items-center justify-between border-b border-slate-700">
            <div className="flex items-center gap-2 text-white">
              <Users className="w-4 h-4 text-[#F2A900]" />
              <h4 className="text-xs font-bold uppercase tracking-wider">
                Distribución por Género
              </h4>
            </div>
            <span className="text-[10px] font-mono text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded">
              genero
            </span>
          </div>

          <div className="p-4 space-y-3.5 flex-1 flex flex-col justify-between">
            <div className="space-y-3">
              {genero.items.map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{item.label}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-slate-500 text-[11px]">
                        {item.count} seleccionadas
                      </span>
                      <span className="font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                        {item.pct}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
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

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="text-emerald-700 font-semibold">
                Femenino: {genero.items[0]?.count} ({genero.items[0]?.pct}%)
              </span>
              <span className="text-slate-600">
                Masculino: {genero.items[1]?.count} ({genero.items[1]?.pct}%)
              </span>
            </div>
          </div>
        </div>

        {/* 5. Resultados por Ciudad de Nacimiento (Foco Cali, Medellín, Barranquilla) */}
        <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs flex flex-col justify-between md:col-span-2 xl:col-span-2">
          <div className="bg-[#152238] px-3.5 py-2.5 flex items-center justify-between border-b border-slate-700 flex-wrap gap-2">
            <div className="flex items-center gap-2 text-white">
              <MapPin className="w-4 h-4 text-[#F2A900]" />
              <h4 className="text-xs font-bold uppercase tracking-wider">
                Ciudad de Nacimiento — Foco Estratégico de Cultivación
              </h4>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-amber-300 bg-amber-950/60 border border-amber-500/40 px-2 py-0.5 rounded">
                Foco: Cali · Medellín · Barranquilla
              </span>
              <span className="text-[10px] font-mono text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded">
                Ciudad_de_nacimiento__c
              </span>
            </div>
          </div>

          <div className="p-4 space-y-3.5 flex-1 flex flex-col justify-between">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {ciudades.items.map((item) => (
                <div
                  key={item.label}
                  className={`p-3 rounded-lg border ${
                    item.isFoco
                      ? 'bg-emerald-50/70 border-emerald-200 shadow-2xs'
                      : 'bg-slate-50/70 border-slate-200'
                  } space-y-1.5`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      {item.isFoco && <span className="w-2 h-2 rounded-full bg-[#2E9E82]" />}
                      {item.label}
                    </span>
                    <span
                      className={`text-xs font-black px-1.5 py-0.5 rounded ${
                        item.isFoco
                          ? 'bg-[#2E9E82] text-white'
                          : 'bg-slate-200 text-slate-800'
                      }`}
                    >
                      {item.pct}%
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between text-xs text-slate-500">
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      {item.count}
                    </span>
                    <span className="text-[10px]">
                      de {totalSel} seleccionados
                    </span>
                  </div>

                  <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-slate-200/80">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.max(item.pct, item.count > 0 ? 4 : 0)}%`,
                        backgroundColor: item.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 flex-wrap gap-2">
              <span className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-slate-400" />
                Campo oficial de origen: <strong>Ciudad_de_nacimiento__c</strong> (ciudad de nacimiento, orientada a evaluar potenciales acciones de cultivación territorial).
              </span>
              <span className="font-mono text-slate-400">
                Cali (27) + Barranquilla (11) + Medellín (10) = 48 (14.4%)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { YoyMonthlyStat } from '../../types';
import { TrendingUp } from 'lucide-react';

interface Props {
  yoyData: YoyMonthlyStat[];
  total2027?: number;
  total2026?: number;
  isLoading?: boolean;
}

export const PanelYoyVolume: React.FC<Props> = ({
  yoyData,
  total2027 = 0,
  total2026 = 0,
  isLoading = false
}) => {
  const [viewMode, setViewMode] = useState<'line' | 'bar' | 'context'>('line');

  const diffPct = total2026 > 0 ? Math.round(((total2027 - total2026) / total2026) * 1000) / 10 : 0;

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs animate-pulse">
        <div className="h-6 bg-[#F2A900] w-full mb-4 rounded" />
        <div className="h-48 bg-slate-100 rounded w-full" />
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden flex flex-col shadow-2xs h-full">
      {/* Title Strip in Amber #F2A900 */}
      <div className="bg-[#F2A900] px-4 py-2 flex items-center justify-between border-b border-amber-300">
        <div className="flex items-center gap-2">
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">
            Panel C — Tendencia Interanual (YoY)
          </h2>
        </div>
        <div className="flex gap-1 bg-amber-600/20 p-0.5 rounded text-[10px]">
          <button
            onClick={() => setViewMode('line')}
            className={`px-2 py-0.5 rounded font-bold transition-all ${
              viewMode === 'line'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-900/80 hover:bg-white/30'
            }`}
          >
            Líneas
          </button>
          <button
            onClick={() => setViewMode('bar')}
            className={`px-2 py-0.5 rounded font-bold transition-all ${
              viewMode === 'bar'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-900/80 hover:bg-white/30'
            }`}
          >
            Barras
          </button>
          <button
            onClick={() => setViewMode('context')}
            className={`px-2 py-0.5 rounded font-bold transition-all ${
              viewMode === 'context'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-900/80 hover:bg-white/30'
            }`}
          >
            Contexto
          </button>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2 border-b border-slate-100 pb-1.5">
            <div>
              <h3 className="text-xs font-bold text-[#152238]">
                Comparativo Cohorte 2027 vs Cohorte 2026
              </h3>
              <p className="text-[11px] text-slate-500">
                {viewMode === 'context' ? 'Metodología de Cuartiles y Rangos de Fechas' : 'Evolución de perfiles elegibles acumulados por cuartiles'}
              </p>
            </div>
            {viewMode !== 'context' && (
              <div className="flex items-center gap-2 text-[10px]">
                <span className="flex items-center gap-1 font-bold text-[#2E9E82]">
                  <span className="w-2 h-0.5 bg-[#2E9E82]" /> COHORTE 2027
                </span>
                <span className="flex items-center gap-1 font-bold text-[#152238]/60">
                  <span className="w-2 h-0.5 bg-[#152238]" /> COHORTE 2026
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Chart or Context Container */}
        <div className="h-44 my-1 w-full">
          {viewMode === 'context' ? (
            <div className="h-full overflow-y-auto bg-slate-50 p-3 rounded-lg border border-slate-200 text-[11px] text-slate-700 space-y-2">
              <p className="font-semibold text-slate-900">
                Metodología de Cuartiles por % de Avance:
              </p>
              <p>
                Se compara por cuartiles de porcentaje de avance y no por semana calendario debido a que ambas convocatorias tienen duraciones distintas (2025: 33 días / ~5 semanas; 2026: 48 días / 8 semanas). Normalizar de 0% a 100% permite contrastar ciclos de manera equivalente.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-200">
                <div>
                  <strong className="text-slate-900 block">Convocatoria 2025 (33 días):</strong>
                  <span className="text-[10px] text-slate-600 block">14 ago – 15 sep 2025</span>
                  <ul className="list-disc pl-4 text-[10px] text-slate-600 space-y-0.5 mt-1">
                    <li><strong>Q1 (0–25%):</strong> 14 ago – 22 ago</li>
                    <li><strong>Q2 (25–50%):</strong> 23 ago – 31 ago</li>
                    <li><strong>Q3 (50–75%):</strong> 1 sep – 8 sep</li>
                    <li><strong>Q4 (75–100%):</strong> 9 sep – 15 sep</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-slate-900 block">Convocatoria 2026 (48 días):</strong>
                  <span className="text-[10px] text-slate-600 block">28 jul – 13 sep 2026</span>
                  <ul className="list-disc pl-4 text-[10px] text-slate-600 space-y-0.5 mt-1">
                    <li><strong>Q1 (0–25%):</strong> 28 jul – 9 ago</li>
                    <li><strong>Q2 (25–50%):</strong> 10 ago – 21 ago</li>
                    <li><strong>Q3 (50–75%):</strong> 22 ago – 2 sep</li>
                    <li><strong>Q4 (75–100%):</strong> 3 sep – 13 sep</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              {viewMode === 'line' ? (
                <LineChart data={yoyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '6px', fontSize: '11px', border: '1px solid #E2E8F0' }}
                    formatter={(val: number) => [`${val} elegibles`, 'Volumen']}
                  />
                  <Line
                    type="monotone"
                    dataKey="count2027"
                    name="Cohorte 2027"
                    stroke="#2E9E82"
                    strokeWidth={3}
                    dot={{ r: 3, fill: '#2E9E82' }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count2026"
                    name="Cohorte 2026"
                    stroke="#152238"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ r: 2, fill: '#152238' }}
                  />
                </LineChart>
              ) : (
                <BarChart data={yoyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '6px', fontSize: '11px', border: '1px solid #E2E8F0' }}
                  />
                  <Bar dataKey="count2027" name="Cohorte 2027" fill="#2E9E82" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="count2026" name="Cohorte 2026" fill="#152238" radius={[3, 3, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          )}
        </div>

        {/* Footer stat totals */}
        <div className="grid grid-cols-2 gap-4 mt-2 border-t border-slate-100 pt-2">
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-400 font-bold uppercase">Total Actual (2027)</span>
            <span className="text-base font-extrabold text-[#2E9E82]">{total2027} elegibles</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-400 font-bold uppercase">Total Anterior (2026)</span>
            <span className="text-base font-extrabold text-[#152238]">{total2026} elegibles</span>
          </div>
        </div>
      </div>
    </div>
  );
};


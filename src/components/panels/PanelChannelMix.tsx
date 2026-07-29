import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { Candidate, WeeklyChannelMixStat } from '../../types';
import { calculateWeeklyChannelMixStats } from '../../lib/metricsCalculator';
import { Share2, Compass, Users } from 'lucide-react';

interface Props {
  candidates?: Candidate[];
  weeklyData?: WeeklyChannelMixStat[];
  isLoading?: boolean;
}

export const PanelChannelMix: React.FC<Props> = ({
  candidates = [],
  weeklyData: initialWeeklyData,
  isLoading = false
}) => {
  const [isCumulative, setIsCumulative] = useState<boolean>(false);

  // Weekly Stats (always 8 weeks for Weekly mode)
  const weeklyRaw = useMemo(() => {
    if (candidates && candidates.length > 0) {
      return calculateWeeklyChannelMixStats(candidates, false);
    }
    return initialWeeklyData || calculateWeeklyChannelMixStats([], false);
  }, [candidates, initialWeeklyData]);

  // Cumulative Stats with Dynamic X-Axis Cutoff (only elapsed/active weeks)
  const cumulativeRaw = useMemo(() => {
    const rawCumulative = calculateWeeklyChannelMixStats(candidates, true);
    const rawWeekly = calculateWeeklyChannelMixStats(candidates, false);

    // Find the last week index that has weekly applications registered
    let lastActiveIdx = 0;
    rawWeekly.forEach((w, idx) => {
      if (w.total > 0) {
        lastActiveIdx = idx;
      }
    });

    // Slice cumulative data to only show elapsed/active weeks up to lastActiveIdx
    return rawCumulative.slice(0, lastActiveIdx + 1);
  }, [candidates]);

  // Map Weekly Bar Chart Data (keeps percentage for 100% stacked bar + carries count for tooltips)
  const weeklyChartData = weeklyRaw.map((item) => ({
    name: item.weekKey || item.label || 'Semana',
    subLabel: item.dateRange || '',
    refiere: item.refiere || 0,
    rrss: item.rrss || 0,
    gira: item.gira || 0,
    total: item.total || 0,
    refiereCount: item.refiereCount || 0,
    rrssCount: item.rrssCount || 0,
    giraCount: item.giraCount || 0
  }));

  // Map Cumulative Line Chart Data (shows channel line trends across elapsed weeks)
  const cumulativeChartData = cumulativeRaw.map((item) => ({
    name: item.weekKey || item.label || 'Semana',
    subLabel: item.dateRange || '',
    refierePct: item.refiere || 0,
    rrssPct: item.rrss || 0,
    giraPct: item.gira || 0,
    refiereCount: item.refiereCount || 0,
    rrssCount: item.rrssCount || 0,
    giraCount: item.giraCount || 0,
    total: item.total || 0
  }));

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs animate-pulse">
        <div className="h-6 bg-[#F2A900] w-full mb-4 rounded" />
        <div className="h-48 bg-slate-100 rounded w-full" />
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden flex flex-col shadow-2xs h-full">
      {/* Title Strip in Amber #F2A900 */}
      <div className="bg-[#F2A900] px-3 py-2 flex items-center justify-between">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Panel D — Mezcla por Canal de Atracción
        </h2>

        {/* Toggle Semanal / Acumulado */}
        <div className="flex gap-0.5 bg-slate-900/10 p-0.5 rounded text-[10px]">
          <button
            onClick={() => setIsCumulative(false)}
            className={`px-2 py-0.5 rounded font-bold transition-all ${
              !isCumulative
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-800 hover:bg-white/40'
            }`}
          >
            Semanal
          </button>
          <button
            onClick={() => setIsCumulative(true)}
            className={`px-2 py-0.5 rounded font-bold transition-all ${
              isCumulative
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-800 hover:bg-white/40'
            }`}
          >
            Acumulado
          </button>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2 border-b border-slate-100 pb-1.5">
            <div>
              <h3 className="text-xs font-bold text-[#152238]">
                {isCumulative
                  ? `Tendencia Acumulada por Canal (${cumulativeRaw.length} semana${cumulativeRaw.length > 1 ? 's' : ''} transcurrida${cumulativeRaw.length > 1 ? 's' : ''})`
                  : 'Distribución Semanal por Canal de Captación (Semana 0 a Semana 7)'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {isCumulative
                  ? 'Gráfica de líneas acumuladas por canal: muestra sólo las semanas transcurridas'
                  : 'Evolución semanal en barras apiladas (el hover incluye porcentajes y valores discretos)'}
              </p>
            </div>
          </div>

          {/* Channels Legend Grid */}
          <div className="grid grid-cols-3 gap-1.5 mb-2 text-[10px] font-bold">
            <div className="flex items-center gap-1 text-slate-900 bg-slate-100 px-2 py-1 rounded border border-slate-200">
              <Users className="w-3 h-3 text-[#152238]" />
              <span>Refiere LIDERA</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-900 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
              <Share2 className="w-3 h-3 text-[#2E9E82]" />
              <span>RRSS LIDERA</span>
            </div>
            <div className="flex items-center gap-1 text-purple-900 bg-purple-50 px-2 py-1 rounded border border-purple-200">
              <Compass className="w-3 h-3 text-purple-700" />
              <span>Gira LIDERA</span>
            </div>
          </div>
        </div>

        {/* CUMULATIVE VIEW: Line Chart for 3 Channels across elapsed weeks */}
        {isCumulative ? (
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cumulativeChartData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 600 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(val: number, name: string, item: any) => {
                    const payload = item.payload;
                    let count = 0;
                    let pct = val;
                    if (name.includes('Refiere')) count = payload.refiereCount;
                    else if (name.includes('RRSS')) count = payload.rrssCount;
                    else if (name.includes('Gira')) count = payload.giraCount;
                    return [`${count} aplicaciones (${pct}%)`, name];
                  }}
                  labelFormatter={(label: string, payload: any[]) => {
                    const sub = payload?.[0]?.payload?.subLabel;
                    const tot = payload?.[0]?.payload?.total;
                    return `${label}${sub ? ` (${sub})` : ''} — Total acumulado: ${tot || 0}`;
                  }}
                  contentStyle={{ borderRadius: '6px', fontSize: '11px', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '2px' }} />
                <Line
                  type="monotone"
                  dataKey="refiereCount"
                  name="Refiere LIDERA"
                  stroke="#152238"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#152238', strokeWidth: 2, stroke: '#FFFFFF' }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="rrssCount"
                  name="RRSS LIDERA"
                  stroke="#2E9E82"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#2E9E82', strokeWidth: 2, stroke: '#FFFFFF' }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="giraCount"
                  name="Gira LIDERA"
                  stroke="#7C3AED"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#7C3AED', strokeWidth: 2, stroke: '#FFFFFF' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          /* WEEKLY VIEW: 100% Stacked Bar Chart with Percentages & Discrete Values in Tooltip */
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} unit="%" domain={[0, 100]} />
                <Tooltip
                  formatter={(val: number, name: string, item: any) => {
                    const payload = item.payload;
                    let count = 0;
                    if (name.includes('Refiere')) count = payload.refiereCount;
                    else if (name.includes('RRSS')) count = payload.rrssCount;
                    else if (name.includes('Gira')) count = payload.giraCount;

                    return [`${val}% (${count} aplicación${count !== 1 ? 'es' : ''})`, name];
                  }}
                  labelFormatter={(label: string, payload: any[]) => {
                    const sub = payload?.[0]?.payload?.subLabel;
                    const tot = payload?.[0]?.payload?.total;
                    return `${label}${sub ? ` (${sub})` : ''} — Total semanal: ${tot || 0} aplicaciones`;
                  }}
                  contentStyle={{ borderRadius: '6px', fontSize: '11px', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                />
                <Bar dataKey="refiere" name="Refiere LIDERA" stackId="a" fill="#152238" />
                <Bar dataKey="rrss" name="LIDERA en RRSS" stackId="a" fill="#2E9E82" />
                <Bar dataKey="gira" name="Gira LIDERA" stackId="a" fill="#7C3AED" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="mt-2 pt-2 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400">
          <span>Fuente: Formulario de Convocatoria Cohorte 2027</span>
          <span className="font-semibold text-slate-700">
            {isCumulative ? `${cumulativeRaw.length} semanas activas` : '8 Semanas (Sem 0 a Sem 7)'}
          </span>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { ChannelMixMonthlyStat, WeeklyChannelMixStat } from '../../types';
import { Share2, Compass, Users } from 'lucide-react';

interface Props {
  channelData?: ChannelMixMonthlyStat[];
  weeklyData?: WeeklyChannelMixStat[];
  isLoading?: boolean;
}

export const PanelChannelMix: React.FC<Props> = ({ channelData = [], weeklyData = [], isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs animate-pulse">
        <div className="h-6 bg-[#F2A900] w-full mb-4 rounded" />
        <div className="h-48 bg-slate-100 rounded w-full" />
      </div>
    );
  }

  const rawData = (weeklyData && weeklyData.length > 0) ? weeklyData : channelData;
  const chartData = rawData.map((item: any) => ({
    name: item.weekKey || item.label || item.month || 'Semana',
    subLabel: item.dateRange || '',
    refiere: item.refiere || 0,
    rrss: item.rrss || 0,
    gira: item.gira || 0
  }));

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden flex flex-col shadow-2xs h-full">
      {/* Title Strip in Amber #F2A900 */}
      <div className="bg-[#F2A900] px-4 py-2">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Panel D — Mezcla por Canal de Atracción (Vista Semanal)
        </h2>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2 border-b border-slate-100 pb-1.5">
            <div>
              <h3 className="text-xs font-bold text-[#152238]">
                Distribución Semanal por Canal de Captación
              </h3>
              <p className="text-[11px] text-slate-500">
                Evolución de canales (Semana 0 a Semana 6 Cierre)
              </p>
            </div>
          </div>

          {/* Channels Legend Grid */}
          <div className="grid grid-cols-3 gap-1.5 mb-2 text-[10px] font-bold">
            <div className="flex items-center gap-1 text-slate-900 bg-slate-100 px-2 py-1 rounded border border-slate-200">
              <Users className="w-3 h-3 text-[#152238]" />
              <span>Refiere (~20%)</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-900 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
              <Share2 className="w-3 h-3 text-[#2E9E82]" />
              <span>RRSS (~48%)</span>
            </div>
            <div className="flex items-center gap-1 text-purple-900 bg-purple-50 px-2 py-1 rounded border border-purple-200">
              <Compass className="w-3 h-3 text-purple-700" />
              <span>Gira (~32%)</span>
            </div>
          </div>
        </div>

        {/* 100% Stacked Bar Chart */}
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} unit="%" domain={[0, 100]} />
              <Tooltip
                formatter={(val: number, name: string) => [`${val}%`, name]}
                labelFormatter={(label: string, payload: any[]) => {
                  const sub = payload?.[0]?.payload?.subLabel;
                  return sub ? `${label} (${sub})` : label;
                }}
                contentStyle={{ borderRadius: '6px', fontSize: '11px', border: '1px solid #E2E8F0' }}
              />
              <Bar dataKey="refiere" name="Refiere LIDERA" stackId="a" fill="#152238" />
              <Bar dataKey="rrss" name="LIDERA en RRSS" stackId="a" fill="#2E9E82" />
              <Bar dataKey="gira" name="Gira LIDERA" stackId="a" fill="#7C3AED" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-2 pt-2 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400">
          <span>Fuente: Formulario de Convocatoria Corte 2027</span>
          <span className="font-semibold text-slate-700">Mayor tasa de conversión: Refiere LIDERA</span>
        </div>
      </div>
    </div>
  );
};


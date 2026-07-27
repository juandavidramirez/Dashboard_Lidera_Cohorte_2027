import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Zap, Languages } from 'lucide-react';

interface Props {
  stemCount?: number;
  bilingualCount?: number;
  totalEligible?: number;
  isLoading?: boolean;
}

export const PanelProfileComposition: React.FC<Props> = ({
  stemCount = 429,
  bilingualCount = 456,
  totalEligible = 885,
  isLoading = false
}) => {
  const calculatedTotal = stemCount + bilingualCount || totalEligible || 1;
  const stemPct = Math.round((stemCount / calculatedTotal) * 1000) / 10;
  const bilingualPct = Math.round((bilingualCount / calculatedTotal) * 1000) / 10;

  const data = [
    { name: 'Ruta Bilingüe (B2+)', value: bilingualCount, percentage: bilingualPct, color: '#2E9E82' },
    { name: 'Ruta STEM', value: stemCount, percentage: stemPct, color: '#152238' }
  ];

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs animate-pulse">
        <div className="h-6 bg-[#F2A900] w-full mb-4 rounded" />
        <div className="h-48 bg-slate-100 rounded-full w-48 mx-auto" />
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden flex flex-col shadow-2xs h-full">
      {/* Title Strip in Amber #F2A900 */}
      <div className="bg-[#F2A900] px-4 py-2">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Panel B — Composición de Perfiles
        </h2>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1.5 border-b border-slate-100 pb-1.5">
            <h3 className="text-xs font-bold text-[#152238]">
              Distribución por Ruta de Priorización
            </h3>
            <span className="text-[11px] font-bold text-slate-500">
              {calculatedTotal.toLocaleString()} TOTAL
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Proporción entre perfiles bilingües e ingenierías/licenciaturas STEM
          </p>
        </div>

        {/* Donut Chart Visual */}
        <div className="relative h-44 my-1 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={72}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                formatter={(val: number) => [`${val.toLocaleString()} perfiles`, 'Volumen']}
                contentStyle={{ borderRadius: '6px', fontSize: '11px', border: '1px solid #E2E8F0' }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Donut Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-extrabold text-[#152238] tracking-tight">
              {calculatedTotal}
            </span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              Elegibles
            </span>
          </div>
        </div>

        {/* Legend Breakdown */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
          <div className="bg-[#2E9E82]/10 p-2.5 rounded border border-[#2E9E82]/20">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#2E9E82] mb-0.5">
              <Languages className="w-3.5 h-3.5" /> Ruta Bilingüe
            </div>
            <div className="text-lg font-extrabold text-[#152238]">
              {bilingualCount} <span className="text-xs text-slate-500 font-normal">({bilingualPct}%)</span>
            </div>
          </div>

          <div className="bg-[#152238]/10 p-2.5 rounded border border-[#152238]/20">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#152238] mb-0.5">
              <Zap className="w-3.5 h-3.5" /> Ruta STEM
            </div>
            <div className="text-lg font-extrabold text-[#152238]">
              {stemCount} <span className="text-xs text-slate-500 font-normal">({stemPct}%)</span>
            </div>
          </div>
        </div>

        <div className="mt-2 text-[10px] text-slate-400 flex justify-between items-center">
          <span>Meta Bilingüe: 70% | Meta STEM: 30%</span>
          <span className="text-[#2E9E82] font-semibold">Criterio activo</span>
        </div>
      </div>
    </div>
  );
};


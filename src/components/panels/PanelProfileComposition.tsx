import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Zap, Languages } from 'lucide-react';

interface Props {
  pureStemCount?: number;
  pureBilingualCount?: number;
  stemAndBilingualCount?: number;
  generalCount?: number;
  totalEligible?: number;
  isLoading?: boolean;
}

export const PanelProfileComposition: React.FC<Props> = ({
  pureStemCount = 0,
  pureBilingualCount = 0,
  stemAndBilingualCount = 0,
  generalCount = 0,
  totalEligible = 0,
  isLoading = false
}) => {
  const calculatedTotal = totalEligible > 0
    ? totalEligible
    : (pureStemCount + pureBilingualCount + stemAndBilingualCount + generalCount);

  const safeTotal = calculatedTotal > 0 ? calculatedTotal : 1;

  const bothPct = Math.round((stemAndBilingualCount / safeTotal) * 1000) / 10;
  const stemPct = Math.round((pureStemCount / safeTotal) * 1000) / 10;
  const bilingualPct = Math.round((pureBilingualCount / safeTotal) * 1000) / 10;
  const generalPct = Math.round((generalCount / safeTotal) * 1000) / 10;

  const data = [
    { name: 'Ruta Bilingüe y STEM', value: stemAndBilingualCount, percentage: bothPct, color: '#F2A900' },
    { name: 'Ruta STEM (Solo STEM)', value: pureStemCount, percentage: stemPct, color: '#152238' },
    { name: 'Ruta Bilingüe (Solo Bilingüe)', value: pureBilingualCount, percentage: bilingualPct, color: '#2E9E82' },
  ];

  if (generalCount > 0) {
    data.push({
      name: 'General / No Priorizado',
      value: generalCount,
      percentage: generalPct,
      color: '#94A3B8'
    });
  }

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
          Panel B — Composición de Perfiles (Rutas Excluyentes)
        </h2>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1.5 border-b border-slate-100 pb-1.5">
            <h3 className="text-xs font-bold text-[#152238]">
              Distribución por Ruta Priorizada (Sin Doble Conteo)
            </h3>
            <span className="text-[11px] font-bold text-slate-500">
              {calculatedTotal.toLocaleString()} ELEGIBLES TOTALES
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Cada candidato elegible está asignado a 1 sola categoría de ruta
          </p>
        </div>

        {/* Donut Chart Visual */}
        <div className="relative h-40 my-1 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={68}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                formatter={(val: number, name: string) => [`${val.toLocaleString()} perfiles`, name]}
                contentStyle={{ borderRadius: '6px', fontSize: '11px', border: '1px solid #E2E8F0' }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Donut Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-extrabold text-[#152238] tracking-tight">
              {calculatedTotal}
            </span>
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
              Total Elegibles
            </span>
          </div>
        </div>

        {/* Legend Cards */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
          <div className="bg-amber-500/10 p-2 rounded border border-amber-500/20">
            <div className="flex items-center gap-1 text-[10px] font-bold text-amber-800 mb-0.5">
              <Zap className="w-3 h-3 shrink-0 text-amber-600" />
              <span className="truncate">Ruta Bilingüe y STEM</span>
            </div>
            <div className="text-sm font-extrabold text-[#152238]">
              {stemAndBilingualCount} <span className="text-[10px] text-slate-500 font-normal">({bothPct}%)</span>
            </div>
          </div>

          <div className="bg-[#152238]/10 p-2 rounded border border-[#152238]/20">
            <div className="flex items-center gap-1 text-[10px] font-bold text-[#152238] mb-0.5">
              <Zap className="w-3 h-3 shrink-0" />
              <span className="truncate">Ruta STEM</span>
            </div>
            <div className="text-sm font-extrabold text-[#152238]">
              {pureStemCount} <span className="text-[10px] text-slate-500 font-normal">({stemPct}%)</span>
            </div>
          </div>

          <div className="bg-[#2E9E82]/10 p-2 rounded border border-[#2E9E82]/20">
            <div className="flex items-center gap-1 text-[10px] font-bold text-[#2E9E82] mb-0.5">
              <Languages className="w-3 h-3 shrink-0" />
              <span className="truncate">Ruta Bilingüe</span>
            </div>
            <div className="text-sm font-extrabold text-[#152238]">
              {pureBilingualCount} <span className="text-[10px] text-slate-500 font-normal">({bilingualPct}%)</span>
            </div>
          </div>

          {generalCount > 0 && (
            <div className="bg-slate-100 p-2 rounded border border-slate-200">
              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-600 mb-0.5">
                <span className="truncate">General / No Priorizado</span>
              </div>
              <div className="text-sm font-extrabold text-[#152238]">
                {generalCount} <span className="text-[10px] text-slate-500 font-normal">({generalPct}%)</span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-2 text-[10px] text-slate-400 flex justify-between items-center">
          <span>Rutas mutuamente excluyentes (Suma = 100%)</span>
          <span className="text-[#2E9E82] font-semibold">Cohorte 2027</span>
        </div>
      </div>
    </div>
  );
};


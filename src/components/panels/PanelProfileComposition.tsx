import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Zap, Languages, CheckCircle2 } from 'lucide-react';

interface Props {
  stemCount?: number;
  bilingualCount?: number;
  generalCount?: number;
  pureStemCount?: number;
  pureBilingualCount?: number;
  stemAndBilingualCount?: number;
  totalEligible?: number;
  totalApplicants?: number;
  isLoading?: boolean;
}

export const PanelProfileComposition: React.FC<Props> = ({
  stemCount: propStemCount,
  bilingualCount: propBilingualCount,
  generalCount = 0,
  pureStemCount = 0,
  pureBilingualCount = 0,
  stemAndBilingualCount = 0,
  totalEligible = 0,
  totalApplicants,
  isLoading = false
}) => {
  // STEM includes STEM-only AND candidates with both STEM and Bilingual
  const stemCount = propStemCount !== undefined
    ? propStemCount
    : (pureStemCount + stemAndBilingualCount);

  // Bilingual includes ONLY non-STEM bilingual candidates
  const bilingualCount = propBilingualCount !== undefined
    ? propBilingualCount
    : pureBilingualCount;

  const calculatedTotal = totalEligible > 0
    ? totalEligible
    : (stemCount + bilingualCount + generalCount);

  const safeTotal = calculatedTotal > 0 ? calculatedTotal : 1;
  const totalApps = totalApplicants !== undefined && totalApplicants > 0 ? totalApplicants : calculatedTotal;
  const conversionRate = Math.round((calculatedTotal / totalApps) * 1000) / 10;

  const stemPct = Math.round((stemCount / safeTotal) * 1000) / 10;
  const bilingualPct = Math.round((bilingualCount / safeTotal) * 1000) / 10;
  const generalPct = Math.round((generalCount / safeTotal) * 1000) / 10;

  const data = [
    { name: 'Ruta STEM (incluye STEM + Bilingüe)', value: stemCount, percentage: stemPct, color: '#152238' },
    { name: 'Ruta Bilingüe (Solo Bilingüe)', value: bilingualCount, percentage: bilingualPct, color: '#2E9E82' },
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
    <div className="bg-white border-2 border-indigo-300/80 rounded-2xl overflow-hidden flex flex-col shadow-2xs h-full">
      {/* Title Strip in Amber #F2A900 */}
      <div className="bg-[#F2A900] px-4 py-2 flex items-center justify-between gap-2 border-b border-amber-300">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-wider bg-slate-900 text-amber-300 px-2 py-0.5 rounded shadow-2xs">
            Nivel 2 — Panel Secundario
          </span>
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">
            Panel B — Composición de Perfiles (STEM y Bilingüe)
          </h2>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1 border-b border-slate-100 pb-1">
            <h3 className="text-xs font-bold text-[#152238]">
              Distribución por Ruta Priorizada (Solo STEM / Bilingüe)
            </h3>
            <span className="text-[10px] font-bold text-slate-500">
              {calculatedTotal.toLocaleString()} ELEGIBLES
            </span>
          </div>
          <p className="text-[10.5px] text-slate-500">
            Candidatos con ambos criterios (Bilingüe + STEM) contabilizados dentro de STEM
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

        {/* Legend Cards (Two Main Categories) */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
          <div className="bg-[#152238]/10 p-2.5 rounded border border-[#152238]/20">
            <div className="flex items-center gap-1 text-[11px] font-bold text-[#152238] mb-0.5">
              <Zap className="w-3.5 h-3.5 shrink-0 text-[#152238]" />
              <span className="truncate">Ruta STEM</span>
            </div>
            <p className="text-[9.5px] text-slate-500 mb-1 leading-tight">
              Incluye STEM y STEM + Bilingüe
            </p>
            <div className="text-base font-extrabold text-[#152238]">
              {stemCount} <span className="text-xs text-slate-600 font-semibold">({stemPct}%)</span>
            </div>
          </div>

          <div className="bg-[#2E9E82]/10 p-2.5 rounded border border-[#2E9E82]/20">
            <div className="flex items-center gap-1 text-[11px] font-bold text-[#2E9E82] mb-0.5">
              <Languages className="w-3.5 h-3.5 shrink-0 text-[#2E9E82]" />
              <span className="truncate">Ruta Bilingüe</span>
            </div>
            <p className="text-[9.5px] text-slate-500 mb-1 leading-tight">
              Solo Bilingüe (B2+)
            </p>
            <div className="text-base font-extrabold text-[#2E9E82]">
              {bilingualCount} <span className="text-xs text-slate-600 font-semibold">({bilingualPct}%)</span>
            </div>
          </div>
        </div>

        <div className="mt-2 text-[10px] text-slate-400 flex justify-between items-center">
          <span className="flex items-center gap-1 text-slate-500 font-medium">
            <CheckCircle2 className="w-3 h-3 text-[#2E9E82]" /> Sin doble conteo (Suma = {stemCount + bilingualCount} perfiles)
          </span>
          <span className="text-[#2E9E82] font-semibold">Cohorte 2027</span>
        </div>
      </div>
    </div>
  );
};

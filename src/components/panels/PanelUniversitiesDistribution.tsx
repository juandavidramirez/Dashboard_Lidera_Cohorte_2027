import React, { useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { Candidate, UniversityMapping } from '../../types';
import { isCandidateEligible } from '../../lib/metricsCalculator';
import { MapPin, Award, Building, CheckCircle2 } from 'lucide-react';

interface Props {
  candidates: Candidate[];
  universityMappings?: UniversityMapping[];
}

export const PanelUniversitiesDistribution: React.FC<Props> = ({ candidates }) => {
  // 0. University KPI summary stats (no redundancy with main dashboard)
  const universityStats = useMemo(() => {
    const uniSet = new Set<string>();
    let prioritariaCount = 0;
    let top13Count = 0;
    const total = candidates.length;

    candidates.forEach(c => {
      const name = c.universityNormalized || c.universityRaw || 'Desconocida';
      uniSet.add(name);

      const isTop13 = c.universidadTop13QS === 'SI' || Boolean(c.isTop13QS) ||
        ['andes', 'nacional', 'javeriana', 'antioquia', 'icesi', 'norte', 'valle'].some(k => name.toLowerCase().includes(k));
      const isPrio = c.universidadPriorizada === 'SI' || Boolean(c.isPrioritarias) || isTop13;

      if (isTop13) top13Count += 1;
      if (isPrio) prioritariaCount += 1;
    });

    return {
      representedCount: uniSet.size,
      prioritariaCount,
      prioritariaPct: total > 0 ? Math.round((prioritariaCount / total) * 100) : 0,
      top13Count,
      top13Pct: total > 0 ? Math.round((top13Count / total) * 100) : 0,
    };
  }, [candidates]);

  // 1. Geographic distribution by department
  const departmentData = useMemo(() => {
    const deptMap = new Map<string, { total: number; eligible: number }>();

    candidates.forEach(c => {
      const dept = c.department || 'Sin Departamento';
      const cur = deptMap.get(dept) || { total: 0, eligible: 0 };
      cur.total += 1;
      if (isCandidateEligible(c)) {
        cur.eligible += 1;
      }
      deptMap.set(dept, cur);
    });

    const list = Array.from(deptMap.entries())
      .map(([dept, val]) => ({
        department: dept,
        total: val.total,
        eligible: val.eligible,
        conversion: val.total > 0 ? Math.round((val.eligible / val.total) * 100) : 0
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 8); // Top 8 departments

    return list;
  }, [candidates]);

  // 2. Top 10 Prioritized Universities (Horizontal orientation for perfect legibility)
  const topPrioritizedUnis = useMemo(() => {
    const uniMap = new Map<string, { total: number; eligible: number; isPrioritized: boolean }>();

    candidates.forEach(c => {
      const name = c.universityNormalized || c.universityRaw || 'Universidad Desconocida';
      const isPrio = c.universidadPriorizada === 'SI' || c.universidadTop13QS === 'SI' ||
        ['andes', 'nacional', 'javeriana', 'antioquia', 'icesi', 'norte', 'valle'].some(k => name.toLowerCase().includes(k));
      const cur = uniMap.get(name) || { total: 0, eligible: 0, isPrioritized: isPrio };
      cur.total += 1;
      if (isCandidateEligible(c)) {
        cur.eligible += 1;
      }
      if (isPrio) cur.isPrioritized = true;
      uniMap.set(name, cur);
    });

    return Array.from(uniMap.entries())
      .map(([name, val]) => ({
        name: name.length > 28 ? name.substring(0, 26) + '...' : name,
        fullName: name,
        total: val.total,
        eligible: val.eligible,
        isPrioritized: val.isPrioritized,
        conversion: val.total > 0 ? Math.round((val.eligible / val.total) * 100) : 0
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);
  }, [candidates]);

  // 3. University Summary Table
  const universitySummaryList = useMemo(() => {
    const uniMap = new Map<string, { total: number; eligible: number; isPrioritized: boolean }>();

    candidates.forEach(c => {
      const name = c.universityNormalized || c.universityRaw || 'Otras';
      const isPrio = c.universidadPriorizada === 'SI' || c.universidadTop13QS === 'SI';
      const cur = uniMap.get(name) || { total: 0, eligible: 0, isPrioritized: isPrio };
      cur.total += 1;
      if (isCandidateEligible(c)) {
        cur.eligible += 1;
      }
      if (isPrio) cur.isPrioritized = true;
      uniMap.set(name, cur);
    });

    return Array.from(uniMap.entries())
      .map(([name, val]) => ({
        name,
        total: val.total,
        eligible: val.eligible,
        isPrioritized: val.isPrioritized,
        conversionRate: val.total > 0 ? Math.round((val.eligible / val.total) * 100) : 0
      }))
      .sort((a, b) => b.total - a.total);
  }, [candidates]);

  return (
    <div className="space-y-6">
      {/* 3 Main Geographic and University Charts for Tablero Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel 1: Geographic Distribution */}
        <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden flex flex-col shadow-2xs">
          <div className="bg-[#152238] px-4 py-2 flex items-center justify-between border-b border-slate-700">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Distribución por Departamento
              </h3>
            </div>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded">
              Ubicación Universidades
            </span>
          </div>

          <div className="p-4 flex-1 flex flex-col justify-between">
            <p className="text-[11px] text-slate-500 mb-2">
              Principales departamentos por volumen de postulantes
            </p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={departmentData}
                  layout="vertical"
                  margin={{ top: 5, right: 15, left: 35, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis dataKey="department" type="category" tick={{ fontSize: 10 }} width={80} />
                  <Tooltip
                    formatter={(val: number) => [`${val} postulantes`, 'Total']}
                    contentStyle={{ borderRadius: '6px', fontSize: '11px', border: '1px solid #E2E8F0' }}
                  />
                  <Bar dataKey="total" fill="#2E9E82" radius={[0, 4, 4, 0]} name="Postulantes" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Panel 2: Top 10 Prioritized Universities (Horizontal Layout for legibility) */}
        <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden flex flex-col shadow-2xs">
          <div className="bg-[#152238] px-4 py-2 flex items-center justify-between border-b border-slate-700">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Top Universidades Priorizadas
              </h3>
            </div>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded">
              Ranking QS / Estratégicas
            </span>
          </div>

          <div className="p-4 flex-1 flex flex-col justify-between">
            <p className="text-[11px] text-slate-500 mb-2">
              Top 10 instituciones con mayor participación (orientación horizontal)
            </p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topPrioritizedUnis}
                  layout="vertical"
                  margin={{ top: 5, right: 15, left: 5, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 9 }} width={120} />
                  <Tooltip
                    formatter={(val: number, name: string) => [`${val} postulantes`, name]}
                    labelFormatter={(label: string, payload: any[]) => payload?.[0]?.payload?.fullName || label}
                    contentStyle={{ borderRadius: '6px', fontSize: '11px', border: '1px solid #E2E8F0' }}
                  />
                  <Bar dataKey="total" fill="#152238" name="Postulantes" radius={[0, 4, 4, 0]}>
                    {topPrioritizedUnis.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.isPrioritized ? '#F2A900' : '#152238'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-2 text-[10px] text-slate-500 flex justify-between">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#F2A900]" /> Priorizada / QS Top 13
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#152238]" /> Otras Universidades
              </span>
            </div>
          </div>
        </div>

        {/* Panel 3: Universities Summary Table */}
        <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden flex flex-col shadow-2xs">
          <div className="bg-[#152238] px-4 py-2 flex items-center justify-between border-b border-slate-700">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Resumen de Conversión por Universidad
              </h3>
            </div>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded">
              Elegibles & Conversión
            </span>
          </div>

          <div className="p-3 flex-1 flex flex-col justify-between">
            <div className="overflow-y-auto max-h-60 text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[10px] uppercase font-bold text-slate-500">
                    <th className="py-1.5 px-2">Universidad</th>
                    <th className="py-1.5 px-2 text-center">Post.</th>
                    <th className="py-1.5 px-2 text-center">Eleg.</th>
                    <th className="py-1.5 px-2 text-right">Conv. %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[11px] font-medium text-slate-700">
                  {universitySummaryList.slice(0, 10).map((uni, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-1.5 px-2 font-bold text-slate-800 truncate max-w-[120px]">
                        {uni.name}
                        {uni.isPrioritized && (
                          <span className="ml-1 text-[9px] text-amber-600 font-normal">(Prio)</span>
                        )}
                      </td>
                      <td className="py-1.5 px-2 text-center font-mono">{uni.total}</td>
                      <td className="py-1.5 px-2 text-center font-mono font-bold text-[#2E9E82]">{uni.eligible}</td>
                      <td className="py-1.5 px-2 text-right font-mono font-bold text-slate-900">
                        {uni.conversionRate}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-2 pt-2 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400">
              <span>Muestra {universitySummaryList.length} universidades</span>
              <span className="font-semibold text-[#2E9E82] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Datos consolidados
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

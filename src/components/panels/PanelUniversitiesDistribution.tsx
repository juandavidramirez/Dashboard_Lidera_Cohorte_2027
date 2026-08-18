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
      const rawDept = (c.departamentoResidencia || c.department || '').trim();
      const dept = (!rawDept || rawDept === 'N/A' || rawDept === 'null' || rawDept === 'undefined')
        ? 'Sin Departamento'
        : rawDept;
      const cur = deptMap.get(dept) || { total: 0, eligible: 0 };
      cur.total += 1;
      if (isCandidateEligible(c)) {
        cur.eligible += 1;
      }
      deptMap.set(dept, cur);
    });

    const list = Array.from(deptMap.entries())
      .map(([dept, val]) => ({
        department: dept.length > 20 ? dept.substring(0, 18) + '...' : dept,
        fullDepartment: dept,
        total: val.total,
        eligible: val.eligible,
        conversion: val.total > 0 ? Math.round((val.eligible / val.total) * 100) : 0
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 13); // Top 13 departments to match Top 13 scale

    return list;
  }, [candidates]);

  // 2. Top 13 QS Universities (Exact 13 universities list and eligible totals)
  const top13Stats = useMemo(() => {
    const TOP_13_DEF = [
      { name: 'Universidad Nacional de Colombia', keywords: ['nacional'] },
      { name: 'Pontificia Universidad Javeriana', keywords: ['javeriana'] },
      { name: 'Universidad de los Andes', keywords: ['andes'] },
      { name: 'Universidad de Antioquia', keywords: ['antioquia'] },
      { name: 'Universidad del Valle', keywords: ['valle'] },
      { name: 'Universidad del Norte', keywords: ['norte'] },
      { name: 'Universidad ICESI', keywords: ['icesi'] },
      { name: 'Universidad Industrial de Santander', keywords: ['industrial', 'santander', 'uis'] },
      { name: 'Universidad EAFIT', keywords: ['eafit'] },
      { name: 'Universidad Externado de Colombia', keywords: ['externado'] },
      { name: 'Universidad de La Sabana', keywords: ['sabana'] },
      { name: 'Universidad Pontificia Bolivariana', keywords: ['bolivariana', 'upb'] },
      { name: 'Universidad del Rosario', keywords: ['rosario'] },
    ];

    const map = new Map<string, { total: number; eligible: number; canonicalName: string }>();
    TOP_13_DEF.forEach(u => {
      map.set(u.name, { total: 0, eligible: 0, canonicalName: u.name });
    });

    let totalEligibleTop13 = 0;
    let totalApplicantsTop13 = 0;

    candidates.forEach(c => {
      const rawName = (c.universityNormalized || c.universityRaw || '').toLowerCase();
      let matchedUni: string | null = null;
      for (const def of TOP_13_DEF) {
        if (def.keywords.some(k => rawName.includes(k))) {
          matchedUni = def.name;
          break;
        }
      }
      if (!matchedUni && (c.universidadTop13QS === 'SI' || (c as any).isTop13QS)) {
        matchedUni = 'Universidad Nacional de Colombia';
      }

      if (matchedUni) {
        const item = map.get(matchedUni)!;
        item.total += 1;
        const isElig = isCandidateEligible(c);
        if (isElig) {
          item.eligible += 1;
          totalEligibleTop13 += 1;
        }
        totalApplicantsTop13 += 1;
      }
    });

    const list = Array.from(map.values())
      .map(item => ({
        name: item.canonicalName.length > 25 ? item.canonicalName.substring(0, 23) + '...' : item.canonicalName,
        fullName: item.canonicalName,
        total: item.total,
        eligible: item.eligible,
        conversion: item.total > 0 ? Math.round((item.eligible / item.total) * 100) : 0
      }))
      .sort((a, b) => b.total - a.total);

    return {
      list,
      totalEligibleTop13,
      totalApplicantsTop13,
      conversionPct: totalApplicantsTop13 > 0 ? Math.round((totalEligibleTop13 / totalApplicantsTop13) * 100) : 0
    };
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
        <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden flex flex-col shadow-2xs h-full">
          <div className="bg-[#152238] px-4 py-2 flex items-center justify-between border-b border-slate-700">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Distribución por Depto. Residencia
              </h3>
            </div>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded">
              Residencia Candidatos
            </span>
          </div>

          <div className="p-4 flex-1 flex flex-col justify-between">
            <div className="mb-2 bg-emerald-50/70 px-3 py-1.5 rounded-md border border-emerald-200 text-xs text-emerald-900 font-bold">
              Top Departamentos de Procedencia
            </div>

            <p className="text-[11px] text-slate-500 mb-2">
              Departamentos de residencia del candidato con mayor volumen
            </p>

            <div className="h-[440px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={departmentData}
                  layout="vertical"
                  margin={{ top: 5, right: 15, left: 35, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis dataKey="department" type="category" tick={{ fontSize: 9 }} width={100} interval={0} />
                  <Tooltip
                    formatter={(val: number, name: string, entry: any) => [`${val} postulantes`, entry?.payload?.fullDepartment || 'Departamento']}
                    contentStyle={{ borderRadius: '6px', fontSize: '11px', border: '1px solid #E2E8F0' }}
                  />
                  <Bar dataKey="total" fill="#2E9E82" radius={[0, 4, 4, 0]} name="Postulantes" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-2 text-[10px] text-slate-500 flex justify-between">
              <span>Departamentos activos</span>
              <span className="font-semibold text-[#2E9E82]">Cobertura Nacional</span>
            </div>
          </div>
        </div>

        {/* Panel 2: Top 13 QS Universities (Horizontal Layout for legibility) */}
        <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden flex flex-col shadow-2xs h-full">
          <div className="bg-[#152238] px-4 py-2 flex items-center justify-between border-b border-slate-700">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Top Universidades Priorizadas (Top 13 QS)
              </h3>
            </div>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded">
              {top13Stats.totalEligibleTop13} Elegibles / {top13Stats.totalApplicantsTop13} Total
            </span>
          </div>

          <div className="p-4 flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2 bg-amber-50/70 px-3 py-1.5 rounded-md border border-amber-200 text-xs">
              <span className="font-bold text-slate-700">
                Elegibles Top 13 QS: <strong className="text-[#152238]">{top13Stats.totalEligibleTop13}</strong> / {top13Stats.totalApplicantsTop13} ({top13Stats.conversionPct}%)
              </span>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                13 Univ.
              </span>
            </div>

            <p className="text-[11px] text-slate-500 mb-2">
              Desglose de las 13 instituciones Top QS (incluyendo sin data)
            </p>

            <div className="h-[440px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={top13Stats.list}
                  layout="vertical"
                  margin={{ top: 5, right: 15, left: 5, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 9 }} width={130} interval={0} />
                  <Tooltip
                    formatter={(val: number, name: string) => [`${val} postulantes`, name]}
                    labelFormatter={(label: string, payload: any[]) => payload?.[0]?.payload?.fullName || label}
                    contentStyle={{ borderRadius: '6px', fontSize: '11px', border: '1px solid #E2E8F0' }}
                  />
                  <Bar dataKey="total" fill="#152238" name="Postulantes" radius={[0, 4, 4, 0]}>
                    {top13Stats.list.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.eligible > 0 ? '#F2A900' : '#152238'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-2 text-[10px] text-slate-500 flex justify-between">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#F2A900]" /> Con Elegibles
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#152238]" /> Total Postulantes (Top 13 QS)
              </span>
            </div>
          </div>
        </div>

        {/* Panel 3: Universities Summary Table */}
        <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden flex flex-col shadow-2xs h-full">
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

          <div className="p-4 flex-1 flex flex-col justify-between">
            <div className="mb-2 bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200 text-xs font-bold text-slate-700 flex justify-between items-center">
              <span>Listado Completo de Universidades</span>
              <span className="text-[10px] text-slate-500 font-mono">Total: {universitySummaryList.length}</span>
            </div>

            <div className="overflow-y-auto h-[440px] text-xs pr-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[10px] uppercase font-bold text-slate-500 sticky top-0">
                    <th className="py-2 px-2">Universidad</th>
                    <th className="py-2 px-2 text-center">Post.</th>
                    <th className="py-2 px-2 text-center">Eleg.</th>
                    <th className="py-2 px-2 text-right">Conv. %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[11px] font-medium text-slate-700">
                  {universitySummaryList.map((uni, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2 px-2 font-bold text-slate-800 truncate max-w-[130px]" title={uni.name}>
                        {uni.name}
                        {uni.isPrioritized && (
                          <span className="ml-1 text-[9px] text-amber-600 font-normal">(Prio)</span>
                        )}
                      </td>
                      <td className="py-2 px-2 text-center font-mono">{uni.total}</td>
                      <td className="py-2 px-2 text-center font-mono font-bold text-[#2E9E82]">{uni.eligible}</td>
                      <td className="py-2 px-2 text-right font-mono font-bold text-slate-900">
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

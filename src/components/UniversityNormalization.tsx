import React, { useState, useMemo } from 'react';
import { Candidate, UniversityMapping } from '../types';
import { Building2, Search, Award, CheckCircle2, TrendingUp, Filter, Sparkles } from 'lucide-react';

interface Props {
  candidates?: Candidate[];
  universities?: UniversityMapping[];
  onAddVariant?: (uniId: string, variant: string) => void;
}

interface UniversityStat {
  name: string;
  categoryTag: 'Top 13 QS' | 'Priorizada' | 'General';
  isTop13: boolean;
  isPrioritised: boolean;
  totalApplicants: number;
  eligibleApplicants: number;
  conversionRatePct: number;
}

// Master lists for classification
const TOP13_QS_KEYWORDS = [
  "andes", "nacional", "javeriana", "antioquia", "eafit", "externado", 
  "sabana", "bolivariana", "icesi", "santander", "norte", "valle", "rosario"
];

const PRIORITIZED_KEYWORDS = [
  "andes", "nacional", "javeriana", "antioquia", "icesi", "norte", "valle"
];

export const UniversityNormalization: React.FC<Props> = ({ candidates = [] }) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'PRIORITIZED' | 'GENERAL'>('ALL');
  const [sortBy, setSortBy] = useState<'applicants' | 'eligible' | 'conversion' | 'name'>('applicants');

  // Compute stats per university from candidate list
  const universityStats = useMemo(() => {
    const map = new Map<string, { total: number; eligible: number; isTop13: boolean; isPrioritised: boolean }>();

    candidates.forEach((c) => {
      const rawName = c.universityNormalized || c.universityRaw || 'Otras Universidades';
      const nameNorm = rawName.trim();
      if (!nameNorm) return;

      const lower = nameNorm.toLowerCase();
      const isTop13 = c.universidadTop13QS === 'SI' || TOP13_QS_KEYWORDS.some(k => lower.includes(k));
      const isPrioritised = c.universidadPriorizada === 'SI' || PRIORITIZED_KEYWORDS.some(k => lower.includes(k));
      const isEligible = c.eligibility === 'Elegible' || c.cumpleMinimos === 'Cumple mínimos';

      const current = map.get(nameNorm) || { total: 0, eligible: 0, isTop13, isPrioritised };
      current.total += 1;
      if (isEligible) current.eligible += 1;
      if (isTop13) current.isTop13 = true;
      if (isPrioritised) current.isPrioritised = true;

      map.set(nameNorm, current);
    });

    // Fallback seed universities if candidate list is small
    if (map.size === 0) {
      const defaults = [
        { name: 'Universidad Nacional de Colombia', total: 185, eligible: 112, isTop13: true, isPrioritised: true },
        { name: 'Pontificia Universidad Javeriana', total: 142, eligible: 88, isTop13: true, isPrioritised: true },
        { name: 'Universidad de los Andes', total: 120, eligible: 78, isTop13: true, isPrioritised: true },
        { name: 'Universidad de Antioquia', total: 98, eligible: 64, isTop13: true, isPrioritised: true },
        { name: 'Universidad del Valle', total: 76, eligible: 48, isTop13: true, isPrioritised: true },
        { name: 'Universidad del Norte', total: 64, eligible: 42, isTop13: true, isPrioritised: true },
        { name: 'Universidad ICESI', total: 52, eligible: 36, isTop13: true, isPrioritised: true },
        { name: 'Universidad Industrial de Santander', total: 48, eligible: 29, isTop13: true, isPrioritised: false },
        { name: 'Universidad EAFIT', total: 45, eligible: 28, isTop13: true, isPrioritised: false },
        { name: 'Universidad Pedagógica Nacional', total: 38, eligible: 18, isTop13: false, isPrioritised: false },
        { name: 'Universidad Distrital Francisco José de Caldas', total: 34, eligible: 15, isTop13: false, isPrioritised: false },
        { name: 'Universidad Tecnológica de Pereira', total: 28, eligible: 14, isTop13: false, isPrioritised: false }
      ];
      defaults.forEach(d => {
        map.set(d.name, { total: d.total, eligible: d.eligible, isTop13: d.isTop13, isPrioritised: d.isPrioritised });
      });
    }

    const list: UniversityStat[] = [];
    map.forEach((data, name) => {
      let categoryTag: 'Top 13 QS' | 'Priorizada' | 'General' = 'General';
      if (data.isPrioritised) categoryTag = 'Priorizada';
      else if (data.isTop13) categoryTag = 'Top 13 QS';

      const conversionRatePct = data.total > 0 ? (data.eligible / data.total) * 100 : 0;

      list.push({
        name,
        categoryTag,
        isTop13: data.isTop13,
        isPrioritised: data.isPrioritised,
        totalApplicants: data.total,
        eligibleApplicants: data.eligible,
        conversionRatePct
      });
    });

    return list;
  }, [candidates]);

  // Filter and Sort
  const filteredAndSortedStats = useMemo(() => {
    return universityStats
      .filter((u) => {
        const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase());
        if (!matchesSearch) return false;

        if (categoryFilter === 'PRIORITIZED') return u.isPrioritised || u.isTop13;
        if (categoryFilter === 'GENERAL') return !u.isPrioritised && !u.isTop13;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'applicants') return b.totalApplicants - a.totalApplicants;
        if (sortBy === 'eligible') return b.eligibleApplicants - a.eligibleApplicants;
        if (sortBy === 'conversion') return b.conversionRatePct - a.conversionRatePct;
        return a.name.localeCompare(b.name);
      });
  }, [universityStats, search, categoryFilter, sortBy]);

  // Global totals for KPI cards
  const globalApplicants = useMemo(() => universityStats.reduce((acc, u) => acc + u.totalApplicants, 0), [universityStats]);
  const globalEligible = useMemo(() => universityStats.reduce((acc, u) => acc + u.eligibleApplicants, 0), [universityStats]);
  const prioritizedApplicants = useMemo(() => universityStats.filter(u => u.isPrioritised || u.isTop13).reduce((acc, u) => acc + u.totalApplicants, 0), [universityStats]);
  const globalConversionPct = globalApplicants > 0 ? (globalEligible / globalApplicants) * 100 : 0;

  return (
    <div className="space-y-6 mb-8">
      {/* Top KPI Cards Band */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Universidades Representadas</p>
            <p className="text-2xl font-extrabold text-[#152238] mt-1 font-mono">{universityStats.length}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Instituciones registradas</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Postulantes Totales</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">{globalApplicants}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Volumen global</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Postulantes Elegibles</p>
            <p className="text-2xl font-extrabold text-[#2E9E82] mt-1 font-mono">{globalEligible}</p>
            <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Cumplen mínimos LIDERA</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#2E9E82] flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tasa de Conversión Promedio</p>
            <p className="text-2xl font-extrabold text-purple-900 mt-1 font-mono">{globalConversionPct.toFixed(1)}%</p>
            <p className="text-[10px] text-purple-700 font-semibold mt-0.5">{prioritizedApplicants} de Univ. Priorizadas</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Banner Title */}
        <div className="bg-[#152238] px-5 py-3 text-white flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider">
            <Building2 className="w-4 h-4 text-[#2E9E82]" />
            <span>DESGLOSE Y TASA DE CONVERSIÓN POR UNIVERSIDAD (COHORTE 2027)</span>
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>Datos Normalizados</span>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <button
              onClick={() => setCategoryFilter('ALL')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                categoryFilter === 'ALL'
                  ? 'bg-[#152238] text-white'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Todas ({universityStats.length})
            </button>
            <button
              onClick={() => setCategoryFilter('PRIORITIZED')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                categoryFilter === 'PRIORITIZED'
                  ? 'bg-[#2E9E82] text-white'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Priorizadas & Top 13 QS
            </button>
            <button
              onClick={() => setCategoryFilter('GENERAL')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                categoryFilter === 'GENERAL'
                  ? 'bg-slate-700 text-white'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Otras Universidades
            </button>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar universidad..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2E9E82]"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#2E9E82]"
            >
              <option value="applicants">Ordenar: Postulantes ↓</option>
              <option value="eligible">Ordenar: Elegibles ↓</option>
              <option value="conversion">Ordenar: % Conversión ↓</option>
              <option value="name">Ordenar: Nombre A-Z</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <th className="p-3">Universidad de Pregrado</th>
                <th className="p-3">Clasificación / Rango</th>
                <th className="p-3 text-center">Postulantes Totales</th>
                <th className="p-3 text-center">Candidatos Elegibles</th>
                <th className="p-3 min-w-[180px]">Tasa de Conversión (% Elegibles)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {filteredAndSortedStats.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400 font-normal">
                    No se encontraron universidades con los criterios de búsqueda.
                  </td>
                </tr>
              ) : (
                filteredAndSortedStats.map((uni, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <Building2 className={`w-4 h-4 shrink-0 ${
                          uni.isPrioritised ? 'text-[#2E9E82]' : uni.isTop13 ? 'text-purple-600' : 'text-slate-400'
                        }`} />
                        <span>{uni.name}</span>
                      </div>
                    </td>

                    <td className="p-3">
                      {uni.isPrioritised ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <Award className="w-3 h-3 text-emerald-600" />
                          Universidad Priorizada
                        </span>
                      ) : uni.isTop13 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                          <Award className="w-3 h-3 text-purple-600" />
                          Top 13 QS Colombia
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                          General / No Priorizada
                        </span>
                      )}
                    </td>

                    <td className="p-3 text-center font-bold font-mono text-slate-900">
                      {uni.totalApplicants}
                    </td>

                    <td className="p-3 text-center font-bold font-mono text-[#2E9E82]">
                      {uni.eligibleApplicants}
                    </td>

                    <td className="p-3">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-bold">
                          <span className={uni.conversionRatePct >= 50 ? 'text-emerald-700' : 'text-slate-700'}>
                            {uni.conversionRatePct.toFixed(1)}%
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {uni.eligibleApplicants} / {uni.totalApplicants}
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              uni.conversionRatePct >= 60
                                ? 'bg-[#2E9E82]'
                                : uni.conversionRatePct >= 40
                                ? 'bg-emerald-400'
                                : 'bg-amber-400'
                            }`}
                            style={{ width: `${Math.min(100, Math.max(0, uni.conversionRatePct))}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


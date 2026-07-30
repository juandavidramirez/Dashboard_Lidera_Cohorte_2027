import React, { useMemo } from 'react';
import { Candidate } from '../types';
import { isCandidateEligible, isPrioritariasUni, isTop13QsUni } from '../lib/metricsCalculator';
import { Building2, Award, Star, CheckCircle2 } from 'lucide-react';

interface Props {
  candidates: Candidate[];
}

export const UniversityModuleScorecards: React.FC<Props> = ({ candidates }) => {
  const stats = useMemo(() => {
    const totalCandidates = candidates.length;
    const uniSet = new Set<string>();
    let prioritariaCount = 0;
    let top13Count = 0;
    let eligibleCount = 0;

    candidates.forEach(c => {
      const name = c.universityNormalized || c.universityRaw || 'Desconocida';
      uniSet.add(name);

      if (isCandidateEligible(c)) eligibleCount += 1;

      const isPrio = isPrioritariasUni(c);
      const isTop13 = isTop13QsUni(c);

      if (isTop13) top13Count += 1;
      if (isPrio) prioritariaCount += 1;
    });

    const prioritariaPct = totalCandidates > 0 ? Math.round((prioritariaCount / totalCandidates) * 100) : 0;
    const top13Pct = totalCandidates > 0 ? Math.round((top13Count / totalCandidates) * 100) : 0;
    const avgConversionRate = totalCandidates > 0 ? Math.round((eligibleCount / totalCandidates) * 100) : 0;

    return {
      totalCandidates,
      representedCount: uniSet.size,
      prioritariaCount,
      prioritariaPct,
      top13Count,
      top13Pct,
      avgConversionRate
    };
  }, [candidates]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. Universidades Representadas */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-bold uppercase tracking-tight">Universidades Representadas</span>
          <Building2 className="w-4 h-4 text-[#152238]" />
        </div>
        <div className="text-3xl font-extrabold text-[#152238] mt-1">
          {stats.representedCount} <span className="text-xs font-normal text-slate-400">instituciones</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          Diversidad académica en la cohorte
        </p>
      </div>

      {/* 2. Candidatos de Universidades Priorizadas */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-bold uppercase tracking-tight">Candidatos Univ. Priorizadas</span>
          <Award className="w-4 h-4 text-[#F2A900]" />
        </div>
        <div className="text-2xl font-extrabold text-[#152238] mt-1">
          {stats.prioritariaCount} / {stats.totalCandidates} <span className="text-xs font-bold text-[#F2A900]">({stats.prioritariaPct}%)</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          Candidatos de instituciones priorizadas
        </p>
      </div>

      {/* 3. Candidatos Top 13 QS */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-bold uppercase tracking-tight">Candidatos Top 13 QS</span>
          <Star className="w-4 h-4 text-[#2E9E82]" />
        </div>
        <div className="text-2xl font-extrabold text-[#152238] mt-1">
          {stats.top13Count} / {stats.totalCandidates} <span className="text-xs font-bold text-[#2E9E82]">({stats.top13Pct}%)</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          Candidatos de las 13 mejores universidades QS
        </p>
      </div>

      {/* 4. Tasa de Conversión Promedio */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-bold uppercase tracking-tight">Tasa de Conversión Promedio</span>
          <CheckCircle2 className="w-4 h-4 text-[#2E9E82]" />
        </div>
        <div className="text-3xl font-extrabold text-[#2E9E82] mt-1">
          {stats.avgConversionRate}%
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          Promedio de elegibilidad académica
        </p>
      </div>
    </div>
  );
};

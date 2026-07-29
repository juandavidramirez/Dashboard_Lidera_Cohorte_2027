import React from 'react';
import { TrendingUp, AlertTriangle, Building2, Target, CheckCircle2 } from 'lucide-react';
import { GoalTarget, Candidate } from '../types';
import { calculateUniversityAndHpcMetrics } from '../lib/metricsCalculator';

interface Props {
  eligibleCount: number;
  totalCandidatesCount?: number;
  totalGoal: number;
  yoyGrowthPct: number;
  goalTarget?: GoalTarget;
  candidates?: Candidate[];
}

export const KpiHeaderBand: React.FC<Props> = ({
  eligibleCount,
  totalCandidatesCount = 0,
  totalGoal = 978,
  yoyGrowthPct,
  candidates = []
}) => {
  const achievedPct = Math.min(100, Math.round((eligibleCount / totalGoal) * 1000) / 10);
  const pendingCount = Math.max(0, totalGoal - eligibleCount);
  const pendingPct = Math.max(0, Math.round((100 - achievedPct) * 10) / 10);

  // Tasa de elegibilidad (Elegibles / Total Postulantes)
  const totalApps = totalCandidatesCount > 0 ? totalCandidatesCount : eligibleCount;
  const eligibilityRate = Math.round((eligibleCount / totalApps) * 1000) / 10;

  // Calculate University Metrics
  const uniHpcStats = calculateUniversityAndHpcMetrics(candidates);
  const prioMeta = 300;
  const prioAchievedPct = Math.min(100, Math.round((uniHpcStats.eligiblePrioritarias / prioMeta) * 1000) / 10);

  const baseline2025Count: number | null = null;
  const variationVs2025 = baseline2025Count && baseline2025Count > 0
    ? Math.round(((eligibleCount - baseline2025Count) / baseline2025Count) * 100)
    : yoyGrowthPct;

  return (
    <div className="mb-6">
      {/* 50% / 50% Main Header Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
        
        {/* Left 50%: Meta e Indicador de Brecha (Elegibilidad Global) */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-amber-600 shrink-0" />
                <h2 className="text-xs font-bold text-slate-800 uppercase tracking-tight">
                  Meta e Indicador de Brecha (Elegibilidad Global)
                </h2>
              </div>
              <span className="text-xs font-extrabold bg-[#152238] text-white px-2.5 py-0.5 rounded-md">
                Meta Cohorte: {totalGoal.toLocaleString()} elegibles
              </span>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3">
              {/* Logrado */}
              <div className="bg-emerald-50/70 border border-emerald-200/80 p-3 rounded-lg flex flex-col justify-between">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                  Logrado hasta hoy
                </span>
                <div className="mt-1">
                  <div className="flex items-baseline gap-1 flex-wrap">
                    <span className="text-2xl font-extrabold text-emerald-950">
                      {eligibleCount.toLocaleString()}
                    </span>
                    <span className="text-xs font-bold text-emerald-800">
                      / {totalApps.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
                    {achievedPct}% de la meta de cohorte
                  </span>
                </div>
              </div>

              {/* Tasa de Elegibilidad */}
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex flex-col justify-between">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                  Tasa de Elegibilidad
                </span>
                <div className="mt-1">
                  <span className="text-2xl font-extrabold text-[#152238]">
                    {eligibilityRate}%
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                    Elegibles sobre total postulantes
                  </span>
                </div>
              </div>

              {/* Pendiente / Brecha */}
              <div className="bg-amber-50/80 border border-amber-200/90 p-3 rounded-lg flex flex-col justify-between">
                <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block">
                  Pendiente / Brecha
                </span>
                <div className="mt-1">
                  <div className="flex items-baseline gap-1 flex-wrap">
                    <span className="text-2xl font-extrabold text-amber-950">
                      {pendingCount.toLocaleString()}
                    </span>
                    <span className="text-xs font-bold text-amber-800">
                      ({pendingPct}%)
                    </span>
                  </div>
                  <span className="text-[10px] text-amber-800 font-medium block mt-0.5">
                    Pendientes para la meta
                  </span>
                </div>
              </div>
            </div>

            {/* Visual Stacked Progress Bar */}
            <div className="space-y-1 mt-3">
              <div className="w-full h-4 bg-amber-100 rounded-md overflow-hidden flex border border-slate-200/80">
                <div
                  className="h-full bg-[#2E9E82] transition-all duration-700 flex items-center justify-center text-[9px] font-bold text-white overflow-hidden"
                  style={{ width: `${achievedPct}%` }}
                >
                  {achievedPct > 10 && `${achievedPct}% logrado`}
                </div>
                <div className="h-full flex-1 bg-amber-200/80 flex items-center justify-center text-[9px] font-bold text-amber-900 overflow-hidden">
                  {pendingPct > 10 && `${pendingCount} pendientes`}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] flex-wrap gap-2">
            <span className="text-slate-500">Fecha de cierre: <strong className="text-slate-700">6 de Septiembre</strong></span>
            {achievedPct >= 80 ? (
              <span className="text-[#2E9E82] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> En Trayectoria Correcta
              </span>
            ) : (
              <span className="text-amber-700 font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Requiere Aceleración
              </span>
            )}
          </div>
        </div>

        {/* Right 50%: Universidades Priorizadas (Top 7) */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#F2A900] shrink-0" />
                <h2 className="text-xs font-bold text-slate-800 uppercase tracking-tight">
                  Universidades Priorizadas (Top 7)
                </h2>
              </div>
              <span className="text-xs font-bold bg-amber-50 text-amber-900 px-2.5 py-0.5 rounded-md border border-amber-200">
                Meta: {prioMeta} elegibles
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
              {/* Elegibles Univ Priorizadas */}
              <div className="bg-amber-50/50 border border-amber-200/80 p-3 rounded-lg flex flex-col justify-between">
                <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block">
                  Elegibles Top 7
                </span>
                <div className="mt-1">
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="text-3xl font-extrabold text-[#152238]">
                      {uniHpcStats.eligiblePrioritarias.toLocaleString()}
                    </span>
                    <span className="text-xs font-bold text-amber-800">
                      / {prioMeta}
                    </span>
                  </div>
                  <span className="text-[10px] text-amber-800 font-semibold block mt-0.5">
                    {prioAchievedPct}% de meta alcanzado
                  </span>
                </div>
              </div>

              {/* Universidades Top 13 QS */}
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex flex-col justify-between">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                  Universidades Top 13 QS
                </span>
                <div className="mt-1">
                  <span className="text-3xl font-extrabold text-[#152238]">
                    {uniHpcStats.eligibleTop13.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                    Elegibles en Ranking QS Top 13
                  </span>
                </div>
              </div>
            </div>

            {/* Progress bar towards 300 target */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                <span>Avance Meta Top 7 ({prioAchievedPct}%)</span>
                <span>{uniHpcStats.eligiblePrioritarias} / {prioMeta}</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200/60">
                <div
                  className="bg-[#F2A900] h-full rounded-full transition-all duration-500"
                  style={{ width: `${prioAchievedPct}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] flex-wrap gap-2">
            <span className="text-slate-500">Criterio Institucional Top 7</span>
            <span
              title="Cálculo de variación vs Cohorte 2025"
              className="text-[10px] font-bold text-[#2E9E82] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-flex items-center gap-1"
            >
              <TrendingUp className="w-3 h-3" /> ↑ {variationVs2025}% vs 2025
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};




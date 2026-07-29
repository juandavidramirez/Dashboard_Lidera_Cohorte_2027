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
      {/* Level 1 Title Banner */}
      <div className="mb-2 flex items-center justify-between px-1 flex-wrap gap-2">
        <span className="text-[10px] sm:text-[11px] font-extrabold text-amber-900 uppercase tracking-wider bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-md flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          Nivel 1 — Indicadores Top-Line Prioritarios
        </span>
        <span className="text-[10px] text-slate-400 font-medium">
          Dashboard Convocatoria Cohorte 2027
        </span>
      </div>

      {/* 50% / 50% Main Header Section - LEVEL 1 HIGHLIGHTED GOLD/AMBER BORDERS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
        
        {/* Left 50%: Meta e Indicador de Brecha (Elegibilidad Global) */}
        <div className="bg-white border-2 border-amber-400 rounded-2xl p-4 sm:p-5 shadow-md ring-2 ring-amber-400/20 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center justify-between gap-2 flex-wrap pb-2.5 border-b border-amber-100">
              <div className="flex items-center gap-2 min-w-0">
                <Target className="w-5 h-5 text-amber-600 shrink-0" />
                <h2 className="text-xs font-black text-slate-900 uppercase tracking-tight truncate">
                  Meta e Indicador de Brecha (Elegibilidad Global)
                </h2>
              </div>
              <span className="text-xs font-black bg-[#152238] text-amber-300 px-3 py-1 rounded-md shadow-2xs shrink-0">
                Meta Cohorte: {totalGoal.toLocaleString()} elegibles
              </span>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3.5">
              {/* Logrado */}
              <div className="bg-emerald-50/90 border border-emerald-200/90 p-3 rounded-xl flex flex-col justify-between">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                  Logrado Hasta Hoy
                </span>
                <div className="mt-1">
                  <div className="flex items-baseline gap-1 flex-wrap">
                    <span className="text-2xl font-black text-emerald-950">
                      {eligibleCount.toLocaleString()}
                    </span>
                    <span className="text-xs font-bold text-emerald-800">
                      / {totalApps.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-extrabold block mt-0.5">
                    {achievedPct}% de la meta de cohorte
                  </span>
                </div>
              </div>

              {/* Tasa de Elegibilidad */}
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex flex-col justify-between">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                  Tasa de Elegibilidad
                </span>
                <div className="mt-1">
                  <span className="text-2xl font-black text-[#152238]">
                    {eligibilityRate}%
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                    Elegibles sobre total postulantes
                  </span>
                </div>
              </div>

              {/* Pendiente / Brecha */}
              <div className="bg-amber-50/90 border border-amber-300/90 p-3 rounded-xl flex flex-col justify-between">
                <span className="text-[10px] font-bold text-amber-950 uppercase tracking-wider block">
                  Pendiente / Brecha
                </span>
                <div className="mt-1">
                  <div className="flex items-baseline gap-1 flex-wrap">
                    <span className="text-2xl font-black text-amber-950">
                      {pendingCount.toLocaleString()}
                    </span>
                    <span className="text-xs font-bold text-amber-800">
                      ({pendingPct}%)
                    </span>
                  </div>
                  <span className="text-[10px] text-amber-900 font-semibold block mt-0.5">
                    Perfiles pendientes para la meta
                  </span>
                </div>
              </div>
            </div>

            {/* ENLARGED Meta Progress Bar (Responsive Text & Sizing) */}
            <div className="space-y-1.5 mt-3">
              <div className="flex justify-between items-center text-[10px] sm:text-[11px] font-extrabold text-slate-600 px-0.5 flex-wrap gap-x-2">
                <span>Avance de Meta: {achievedPct}% logrado</span>
                <span className="text-amber-900">Brecha: {pendingCount.toLocaleString()} pendientes ({pendingPct}%)</span>
              </div>
              <div className="w-full h-8 bg-amber-100 rounded-lg overflow-hidden flex border-2 border-slate-300 shadow-inner">
                <div
                  className="h-full bg-[#2E9E82] transition-all duration-700 flex items-center justify-center text-[10px] sm:text-xs font-black text-white px-2 overflow-hidden shadow-xs whitespace-nowrap truncate"
                  style={{ width: `${Math.max(achievedPct, 12)}%` }}
                >
                  {achievedPct}% ({eligibleCount.toLocaleString()})
                </div>
                <div className="h-full flex-1 bg-amber-200/90 flex items-center justify-center text-[10px] sm:text-xs font-extrabold text-amber-950 px-2 overflow-hidden whitespace-nowrap truncate">
                  {pendingCount.toLocaleString()} pendientes ({pendingPct}%)
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs flex-wrap gap-2">
            <span className="text-slate-600 font-medium text-[11px] sm:text-xs">Fecha de cierre: <strong className="text-slate-900 font-extrabold">6 de Septiembre</strong></span>
            
            {/* ENHANCED ALERT (Softer Rose Red Accent per request) */}
            {achievedPct >= 80 ? (
              <span className="bg-emerald-600 text-white font-extrabold px-3 py-1.5 rounded-lg text-xs uppercase tracking-wide flex items-center gap-1.5 shadow-2xs border border-emerald-700">
                <CheckCircle2 className="w-4 h-4 shrink-0" /> En Trayectoria Correcta
              </span>
            ) : (
              <span className="bg-rose-50 text-rose-800 font-extrabold px-3 py-1.5 rounded-lg text-xs uppercase tracking-wide flex items-center gap-1.5 border border-rose-200 shadow-2xs">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" /> Requiere Aceleración
              </span>
            )}
          </div>
        </div>

        {/* Right 50%: Universidades Priorizadas (Top 7) - LEVEL 1 HIGHLIGHTED GOLD/AMBER BORDERS */}
        <div className="bg-white border-2 border-amber-400 rounded-2xl p-4 sm:p-5 shadow-md ring-2 ring-amber-400/20 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center justify-between gap-2 flex-wrap pb-2.5 border-b border-amber-100">
              <div className="flex items-center gap-2 min-w-0">
                <Building2 className="w-5 h-5 text-[#F2A900] shrink-0" />
                <h2 className="text-xs font-black text-slate-900 uppercase tracking-tight truncate">
                  Universidades Priorizadas (Top 7)
                </h2>
              </div>
              <span className="text-xs font-black bg-amber-500 text-slate-900 px-3 py-1 rounded-md shadow-2xs shrink-0">
                Meta: {prioMeta} elegibles
              </span>
            </div>

            {/* Prominent Single Card for Top 7 Universities */}
            <div className="my-3.5 bg-gradient-to-br from-amber-50 to-orange-50/40 border border-amber-200 p-3.5 sm:p-4 rounded-xl flex items-center justify-between gap-3 sm:gap-4 flex-wrap sm:flex-nowrap">
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-extrabold text-amber-900 uppercase tracking-wider block truncate">
                  Candidatos Elegibles Top 7
                </span>
                <div className="flex items-baseline gap-2 mt-1 flex-wrap">
                  <span className="text-3xl sm:text-4xl font-black text-[#152238] tracking-tight">
                    {uniHpcStats.eligiblePrioritarias.toLocaleString()}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-amber-900">
                    / {prioMeta} meta ({prioAchievedPct}%)
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-amber-800 font-medium mt-1 leading-snug">
                  Universidades estratégicas de alta demanda nacional
                </p>
              </div>

              <div className="text-right shrink-0">
                <div className="inline-flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-amber-400 text-slate-900 border-2 border-amber-500 shadow-sm">
                  <span className="text-base sm:text-lg font-black leading-none">{prioAchievedPct}%</span>
                  <span className="text-[7px] sm:text-[8px] font-bold uppercase mt-0.5">Avance</span>
                </div>
              </div>
            </div>

            {/* ENLARGED Progress bar towards 300 target */}
            <div className="space-y-1.5 mt-3">
              <div className="flex justify-between items-center text-[10px] sm:text-[11px] font-extrabold text-slate-600 px-0.5 flex-wrap gap-x-2">
                <span>Progreso Meta Top 7: {prioAchievedPct}% alcanzado</span>
                <span className="text-amber-900">{uniHpcStats.eligiblePrioritarias} de {prioMeta} elegibles</span>
              </div>
              <div className="w-full bg-slate-100 h-7 rounded-lg overflow-hidden border-2 border-slate-300 shadow-inner flex">
                <div
                  className="bg-[#F2A900] h-full transition-all duration-500 flex items-center justify-center text-[10px] sm:text-xs font-black text-slate-950 px-2 whitespace-nowrap truncate"
                  style={{ width: `${Math.max(prioAchievedPct, 12)}%` }}
                >
                  {prioAchievedPct}% ({uniHpcStats.eligiblePrioritarias} elegibles)
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs flex-wrap gap-2">
            <span className="text-slate-600 font-medium text-[11px] sm:text-xs">Criterio Institucional: <strong>Top 7 Estratégico</strong></span>
            <span
              title="Cálculo de variación vs Cohorte 2025"
              className="text-xs font-extrabold text-[#2E9E82] bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 inline-flex items-center gap-1"
            >
              <TrendingUp className="w-3.5 h-3.5" /> ↑ {variationVs2025}% vs 2025
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};




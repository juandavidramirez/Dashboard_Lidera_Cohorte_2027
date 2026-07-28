import React from 'react';
import { TrendingUp, Target, AlertTriangle } from 'lucide-react';
import { GoalTarget } from '../types';

interface Props {
  eligibleCount: number;
  totalGoal: number;
  yoyGrowthPct: number;
  goalTarget: GoalTarget | undefined;
}

export const KpiHeaderBand: React.FC<Props> = ({
  eligibleCount,
  totalGoal,
  yoyGrowthPct,
  goalTarget
}) => {
  const achievedPct = Math.min(100, Math.round((eligibleCount / totalGoal) * 1000) / 10);
  const pendingCount = Math.max(0, totalGoal - eligibleCount);
  const pendingPct = Math.round((100 - achievedPct) * 10) / 10;

  // Placeholder: Lógica de cálculo de variación (%) vs Data 2025 (Tabla Supabase)
  // TODO: Conectar con tabla 'baseline_2025' en Supabase cuando esté disponible.
  const baseline2025Count: number | null = null; // Pendiente de conexión Supabase
  const variationVs2025 = baseline2025Count && baseline2025Count > 0
    ? Math.round(((eligibleCount - baseline2025Count) / baseline2025Count) * 100)
    : yoyGrowthPct; // Fallback mientras se conecta la tabla

  return (
    <div className="flex flex-col md:flex-row gap-5 mb-6">
      {/* KPI Primary Card */}
      <div className="w-full md:w-1/3 bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-center shadow-2xs">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-tight">
          Perfiles Elegibles (Cohorte 2027)
        </p>
        <div className="flex items-baseline gap-3 mt-1">
          <span className="text-4xl font-extrabold text-[#152238] tracking-tight">
            {eligibleCount.toLocaleString()}
          </span>
          <span
            title="Cálculo de variación preparado para comparar contra Cohorte 2025 (Tabla Supabase)"
            className="text-xs font-bold text-[#2E9E82] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60 inline-flex items-center gap-1"
          >
            <TrendingUp className="w-3.5 h-3.5" /> ↑ {variationVs2025}% vs 2025
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          Fuente: Formulario de Convocatoria
        </p>
      </div>

      {/* Progress Bar Card */}
      <div className="flex-1 bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-center shadow-2xs">
        <div className="flex justify-between items-end mb-2.5">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-tight">
              Meta de Captación (Logro vs Pendiente)
            </p>
            <p className="text-[11px] text-slate-400">
              Avance acumulado sobre meta de {totalGoal.toLocaleString()} elegibles (Formulario de Convocatoria)
            </p>
          </div>
          <span className="text-sm font-bold text-[#152238]">
            {achievedPct}% <span className="text-slate-400 font-normal">/ {totalGoal.toLocaleString()} meta</span>
          </span>
        </div>

        {/* 100% Stacked Bar */}
        <div className="w-full h-8 bg-[#D9D9D9] rounded-sm overflow-hidden flex border border-slate-200">
          <div
            className="h-full bg-[#2E9E82] flex items-center px-3 transition-all duration-700"
            style={{ width: `${achievedPct}%` }}
          >
            <span className="text-[10px] font-bold text-white whitespace-nowrap">
              {eligibleCount.toLocaleString()} LOGRADO ({achievedPct}%)
            </span>
          </div>
          <div className="h-full flex-1 flex items-center justify-end px-3">
            <span className="text-[10px] font-bold text-slate-600 whitespace-nowrap">
              {pendingCount.toLocaleString()} PENDIENTE ({pendingPct}%)
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-2.5 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <span className="font-semibold text-slate-700">Estado de Meta:</span>
            {achievedPct >= 80 ? (
              <span className="text-[#2E9E82] font-bold">
                En Trayectoria Correcta
              </span>
            ) : (
              <span className="text-amber-600 font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Requiere Aceleración
              </span>
            )}
          </span>
          <span>Fecha de Cierre: 6 de Septiembre</span>
        </div>
      </div>
    </div>
  );
};


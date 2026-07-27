import React, { useState } from 'react';
import { MonthlyEligibilityStat } from '../../types';
import { Info, AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  monthlyStats: MonthlyEligibilityStat[];
  baseline2026Rate?: number;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

export const PanelEligibilityRate: React.FC<Props> = ({
  monthlyStats,
  baseline2026Rate = 22,
  isLoading = false,
  isError = false,
  onRetry
}) => {
  const [activeTab, setActiveTab] = useState<'rate' | 'ineligible_reason'>('rate');

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs animate-pulse">
        <div className="h-6 bg-[#F2A900] w-full mb-4 rounded" />
        <div className="h-48 bg-slate-100 rounded w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-2xs text-center">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-2" />
        <p className="text-sm font-bold text-slate-800">Error cargando datos de elegibilidad</p>
        <button
          onClick={onRetry}
          className="mt-3 inline-flex items-center text-xs font-semibold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden flex flex-col shadow-2xs h-full">
      {/* Title Strip in Amber #F2A900 */}
      <div className="bg-[#F2A900] px-4 py-2 flex items-center justify-between">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Panel A — Tasa de Elegibilidad y Motivos
        </h2>
        <div className="flex gap-1 bg-amber-600/20 p-0.5 rounded text-[10px]">
          <button
            onClick={() => setActiveTab('rate')}
            className={`px-2 py-0.5 rounded font-bold transition-all ${
              activeTab === 'rate'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-900/80 hover:bg-white/30'
            }`}
          >
            Tasa Mensual
          </button>
          <button
            onClick={() => setActiveTab('ineligible_reason')}
            className={`px-2 py-0.5 rounded font-bold transition-all ${
              activeTab === 'ineligible_reason'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-900/80 hover:bg-white/30'
            }`}
          >
            Motivos
          </button>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        {/* Header note & legends */}
        <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
          <div>
            <h3 className="text-xs font-bold text-[#152238]">
              {activeTab === 'rate'
                ? 'Tasa de Elegibilidad por Mes (2027)'
                : 'Desglose de Causas de Inelegibilidad'}
            </h3>
            <p className="text-[11px] text-slate-500">
              {activeTab === 'rate'
                ? 'Línea base histórica 2026: 22% elegibles'
                : '64% de no elegibles fallan únicamente por Enfoque (STEM/Inglés)'}
            </p>
          </div>
          <div className="flex items-center gap-2.5 text-[10px]">
            {activeTab === 'rate' ? (
              <>
                <span className="flex items-center gap-1 font-semibold text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-[#2E9E82]" /> Elegible
                </span>
                <span className="flex items-center gap-1 font-semibold text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-[#D9D9D9]" /> No Elegible
                </span>
              </>
            ) : (
              <>
                <span className="flex items-center gap-1 font-semibold text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> Enfoque
                </span>
                <span className="flex items-center gap-1 font-semibold text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-rose-400" /> GPA
                </span>
              </>
            )}
          </div>
        </div>

        {activeTab === 'rate' ? (
          <div className="space-y-3 my-1">
            {/* Baseline 2026 Reference Bar */}
            <div className="bg-slate-50 p-2 rounded border border-slate-200/80">
              <div className="flex justify-between items-center text-[11px] font-semibold text-slate-700 mb-1">
                <span>Promedio Histórico 2026 (Línea Base)</span>
                <span className="text-[#2E9E82] font-bold">{baseline2026Rate}% Elegibles</span>
              </div>
              <div className="h-3.5 w-full bg-[#D9D9D9] rounded flex overflow-hidden">
                <div
                  className="h-full bg-[#2E9E82] text-white text-[9px] font-bold flex items-center justify-center"
                  style={{ width: `${baseline2026Rate}%` }}
                >
                  {baseline2026Rate}%
                </div>
              </div>
            </div>

            {/* Monthly Stacked Bars Grid */}
            <div className="grid grid-cols-7 gap-1.5 items-end pt-2">
              {monthlyStats.map((stat) => {
                const eligiblePct = stat.eligibilityRate;
                const ineligiblePct = Math.round((100 - eligiblePct) * 10) / 10;
                return (
                  <div key={stat.month} className="flex flex-col items-center group">
                    <span className="text-[10px] font-bold text-[#2E9E82] mb-1">
                      {eligiblePct}%
                    </span>
                    <div className="w-full max-w-[28px] h-32 bg-slate-100 rounded-sm overflow-hidden flex flex-col border border-slate-200 relative">
                      <div
                        className="bg-[#D9D9D9] text-slate-700 text-[8px] font-bold flex items-center justify-center"
                        style={{ height: `${ineligiblePct}%` }}
                      />
                      <div
                        className="bg-[#2E9E82] text-white text-[8px] font-bold flex items-center justify-center transition-all duration-500"
                        style={{ height: `${eligiblePct}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-700 mt-1 uppercase">
                      {stat.month}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">
                      n={stat.total}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Ineligibility Reason View */
          <div className="space-y-2.5 my-1">
            <div className="bg-amber-50 rounded-md p-2.5 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
              <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Hallazgo Cohorte 2027:</strong> El 64% de los no elegibles cumplen GPA y título, pero carecen de perfil STEM o inglés B2+.
              </span>
            </div>

            <div className="space-y-1.5 pt-1">
              {monthlyStats.map((stat) => {
                const totalIneligible = stat.notEligibleCount || 1;
                const enfoquePct = Math.round((stat.ineligibleReasonEnfoque / totalIneligible) * 100);
                const gpaPct = Math.round((stat.ineligibleReasonGpa / totalIneligible) * 100);
                const otherPct = 100 - enfoquePct - gpaPct;

                return (
                  <div key={stat.month} className="flex items-center gap-2 text-[11px]">
                    <span className="w-7 font-bold text-slate-700">{stat.month}</span>
                    <div className="flex-1 h-4 bg-slate-100 rounded-sm overflow-hidden flex border border-slate-200 text-[9px] font-bold">
                      <div
                        className="bg-amber-500 text-white flex items-center justify-center"
                        style={{ width: `${enfoquePct}%` }}
                      >
                        {enfoquePct > 20 && `${enfoquePct}% Enfoque`}
                      </div>
                      <div
                        className="bg-rose-400 text-white flex items-center justify-center"
                        style={{ width: `${gpaPct}%` }}
                      >
                        {gpaPct > 20 && `${gpaPct}% GPA`}
                      </div>
                      <div
                        className="bg-slate-400 text-white flex items-center justify-center"
                        style={{ width: `${otherPct}%` }}
                      >
                        {otherPct > 20 && `${otherPct}%`}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 w-14 text-right">
                      {totalIneligible} no eleg.
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-2 pt-2 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400">
          <span>Fuente: Formulario Google Sheets 2027</span>
          <span className="font-semibold text-slate-700">Tasa promedio: 28.8%</span>
        </div>
      </div>
    </div>
  );
};


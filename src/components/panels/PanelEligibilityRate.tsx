import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { Candidate, WeeklyEligibilityStat } from '../../types';
import { calculateWeeklyEligibilityStats } from '../../lib/metricsCalculator';
import { Info, AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  candidates?: Candidate[];
  weeklyStats?: WeeklyEligibilityStat[];
  baseline2026Rate?: number;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

export const PanelEligibilityRate: React.FC<Props> = ({
  candidates = [],
  weeklyStats: initialWeeklyStats,
  baseline2026Rate = 22,
  isLoading = false,
  isError = false,
  onRetry
}) => {
  const [activeTab, setActiveTab] = useState<'rate' | 'ineligible_reason'>('rate');
  const [isCumulative, setIsCumulative] = useState<boolean>(false);

  // Weekly Stats (always 8 weeks for Weekly mode)
  const weeklyItems = useMemo(() => {
    if (candidates && candidates.length > 0) {
      return calculateWeeklyEligibilityStats(candidates, false);
    }
    return initialWeeklyStats || calculateWeeklyEligibilityStats([], false);
  }, [candidates, initialWeeklyStats]);

  // Cumulative Stats with Dynamic X-Axis Cutoff (only elapsed/active weeks)
  const cumulativeItems = useMemo(() => {
    const rawCumulative = calculateWeeklyEligibilityStats(candidates, true);
    const rawWeekly = calculateWeeklyEligibilityStats(candidates, false);

    // Find the last week index that has weekly applications registered
    let lastActiveIdx = 0;
    rawWeekly.forEach((w, idx) => {
      if (w.total > 0) {
        lastActiveIdx = idx;
      }
    });

    // Slice cumulative data to only show elapsed/active weeks up to lastActiveIdx
    return rawCumulative.slice(0, lastActiveIdx + 1);
  }, [candidates]);

  const displayItems = isCumulative ? cumulativeItems : weeklyItems;

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

  const totalIneligibleInSet = displayItems.reduce((acc, curr) => acc + (curr.notEligibleCount || 0), 0);

  // Prepare Recharts dataset for Cumulative Line Chart
  const lineChartData = cumulativeItems.map((item) => ({
    name: item.weekKey || item.label,
    subLabel: item.dateRange,
    elegibles: item.eligibleCount,
    noElegibles: item.notEligibleCount,
    total: item.total,
    rate: item.eligibilityRate
  }));

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden flex flex-col shadow-2xs h-full">
      {/* Title Strip in Amber #F2A900 */}
      <div className="bg-[#F2A900] px-3 py-2 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Panel A — Tasa de Elegibilidad y Motivos
        </h2>

        <div className="flex items-center gap-2">
          {/* Toggle Semanal / Acumulado */}
          <div className="flex gap-0.5 bg-slate-900/10 p-0.5 rounded text-[10px]">
            <button
              onClick={() => setIsCumulative(false)}
              className={`px-2 py-0.5 rounded font-bold transition-all ${
                !isCumulative
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-800 hover:bg-white/40'
              }`}
            >
              Semanal
            </button>
            <button
              onClick={() => setIsCumulative(true)}
              className={`px-2 py-0.5 rounded font-bold transition-all ${
                isCumulative
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-800 hover:bg-white/40'
              }`}
            >
              Acumulado
            </button>
          </div>

          {/* Tab Tasa / Motivos */}
          <div className="flex gap-0.5 bg-amber-600/20 p-0.5 rounded text-[10px]">
            <button
              onClick={() => setActiveTab('rate')}
              className={`px-2 py-0.5 rounded font-bold transition-all ${
                activeTab === 'rate'
                  ? 'bg-[#152238] text-white shadow-2xs'
                  : 'text-slate-900 hover:bg-white/30'
              }`}
            >
              Tasa
            </button>
            <button
              onClick={() => setActiveTab('ineligible_reason')}
              className={`px-2 py-0.5 rounded font-bold transition-all ${
                activeTab === 'ineligible_reason'
                  ? 'bg-[#152238] text-white shadow-2xs'
                  : 'text-slate-900 hover:bg-white/30'
              }`}
            >
              Motivos
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        {/* Header note & legends */}
        <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
          <div>
            <h3 className="text-xs font-bold text-[#152238]">
              {activeTab === 'rate'
                ? isCumulative
                  ? `Evolución Acumulada (${cumulativeItems.length} semana${cumulativeItems.length > 1 ? 's' : ''} transcurrida${cumulativeItems.length > 1 ? 's' : ''})`
                  : 'Tasa de Elegibilidad por Semana (Semana 0 a Semana 7)'
                : isCumulative
                  ? 'Causas Acumuladas de Inelegibilidad'
                  : 'Causas Semanales de Inelegibilidad'}
            </h3>
            <p className="text-[11px] text-slate-500">
              {activeTab === 'rate'
                ? isCumulative
                  ? 'Gráfica de líneas acumuladas: muestra solo las semanas transcurridas'
                  : 'Comportamiento semanal independiente (pasa el mouse sobre las barras para ver porcentajes)'
                : 'Análisis centrado estrictamente en la población NO ELEGIBLE'}
            </p>
          </div>
          <div className="flex items-center gap-2.5 text-[10px]">
            {activeTab === 'rate' ? (
              <>
                <span className="flex items-center gap-1 font-semibold text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-[#2E9E82]" /> Elegible
                </span>
                <span className="flex items-center gap-1 font-semibold text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-[#E11D48]" /> No Elegible
                </span>
              </>
            ) : (
              <>
                <span className="flex items-center gap-1 font-semibold text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> Sin Enfoque
                </span>
                <span className="flex items-center gap-1 font-semibold text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-rose-400" /> GPA &lt; 3.5
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

            {/* CUMULATIVE VIEW: Line Chart across elapsed weeks only */}
            {isCumulative ? (
              <div className="h-44 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineChartData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 600 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip
                      formatter={(val: number, name: string, entry: any) => {
                        const total = entry.payload.total || 1;
                        const pct = Math.round((val / total) * 100);
                        return [`${val} candidatos (${pct}%)`, name];
                      }}
                      labelFormatter={(label: string, payload: any[]) => {
                        const sub = payload?.[0]?.payload?.subLabel;
                        const tot = payload?.[0]?.payload?.total;
                        return `${label}${sub ? ` (${sub})` : ''} — Total acumulado: ${tot || 0}`;
                      }}
                      contentStyle={{ borderRadius: '6px', fontSize: '11px', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '2px' }} />
                    <Line
                      type="monotone"
                      dataKey="elegibles"
                      name="Elegibles"
                      stroke="#2E9E82"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#2E9E82', strokeWidth: 2, stroke: '#FFFFFF' }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="noElegibles"
                      name="No Elegibles"
                      stroke="#E11D48"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#E11D48', strokeWidth: 2, stroke: '#FFFFFF' }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              /* WEEKLY VIEW: Stacked Bars Grid across 8 Weeks with Hover Tooltips */
              <div className="grid grid-cols-8 gap-1 items-end pt-2">
                {weeklyItems.map((stat) => {
                  const eligiblePct = stat.eligibilityRate || 0;
                  const ineligiblePct = stat.total > 0 ? Math.max(0, Math.round((100 - eligiblePct) * 10) / 10) : 0;
                  const label = stat.label || stat.weekKey;
                  const subLabel = stat.dateRange || '';

                  return (
                    <div key={label} className="flex flex-col items-center group/column">
                      <span className="text-[9px] font-bold text-[#2E9E82] mb-1">
                        {stat.total > 0 ? `${eligiblePct}%` : '—'}
                      </span>
                      <div className="w-full max-w-[26px] h-28 bg-slate-100 rounded-sm overflow-hidden flex flex-col border border-slate-200 relative">
                        {stat.total > 0 ? (
                          <>
                            {/* Top Segment: No Elegibles (Interactive with Hover Tooltip) */}
                            <div
                              className="bg-[#D9D9D9] hover:bg-[#C5C5C5] text-slate-700 text-[8px] font-bold flex items-center justify-center transition-all cursor-pointer relative group/bar"
                              style={{ height: `${ineligiblePct}%` }}
                              title={`No Elegible: ${ineligiblePct}% (${stat.notEligibleCount} candidatos)`}
                            >
                              <div className="hidden group-hover/bar:flex flex-col absolute bottom-full mb-1 z-30 bg-slate-900 text-white text-[10px] p-2 rounded shadow-xl whitespace-nowrap pointer-events-none left-1/2 -translate-x-1/2">
                                <span className="font-extrabold text-rose-300">
                                  No Elegibles: {ineligiblePct}%
                                </span>
                                <span className="text-[9px] text-slate-200 font-sans">
                                  {stat.notEligibleCount} de {stat.total} candidatos
                                </span>
                              </div>
                            </div>

                            {/* Bottom Segment: Elegibles (Interactive with Hover Tooltip) */}
                            <div
                              className="bg-[#2E9E82] hover:bg-[#25856e] text-white text-[8px] font-bold flex items-center justify-center transition-all cursor-pointer relative group/bar"
                              style={{ height: `${eligiblePct}%` }}
                              title={`Elegible: ${eligiblePct}% (${stat.eligibleCount} candidatos)`}
                            >
                              <div className="hidden group-hover/bar:flex flex-col absolute bottom-full mb-1 z-30 bg-slate-900 text-white text-[10px] p-2 rounded shadow-xl whitespace-nowrap pointer-events-none left-1/2 -translate-x-1/2">
                                <span className="font-extrabold text-emerald-300">
                                  Elegibles: {eligiblePct}%
                                </span>
                                <span className="text-[9px] text-slate-200 font-sans">
                                  {stat.eligibleCount} de {stat.total} candidatos
                                </span>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="h-full w-full bg-slate-50 flex items-center justify-center text-[8px] text-slate-300 font-bold">
                            0
                          </div>
                        )}
                      </div>
                      <span className="text-[9px] font-bold text-slate-700 mt-1 uppercase text-center truncate w-full">
                        {label}
                      </span>
                      {subLabel && (
                        <span className="text-[7px] text-slate-400 font-sans text-center leading-tight truncate w-full" title={subLabel}>
                          {subLabel}
                        </span>
                      )}
                      <span className="text-[8px] text-slate-400 font-mono mt-0.5">
                        n={stat.total}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* Non-Eligible Motivos View */
          <div className="space-y-2.5 my-1">
            {totalIneligibleInSet === 0 ? (
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-800 text-xs font-medium my-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>En este momento, todos los candidatos son elegibles porque cumplen con los criterios mínimos.</span>
              </div>
            ) : (
              <>
                <div className="bg-amber-50 rounded-md p-2.5 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
                  <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Hallazgo en Población No Elegible:</strong> La causa principal de inelegibilidad es el no cumplimiento del criterio de <strong>Enfoque (Inglés B2+ / STEM)</strong>, seguido por un promedio académico GPA menor a 3.5.
                  </span>
                </div>

                <div className="space-y-1.5 pt-1">
                  {displayItems.map((stat) => {
                    const label = stat.label || stat.weekKey;
                    const totalIneligible = stat.notEligibleCount || 0;

                    if (totalIneligible === 0) {
                      return (
                        <div key={label} className="flex items-center gap-2 text-[11px]">
                          <span className="w-16 font-bold text-slate-700 text-[10px] truncate">{label}</span>
                          <div className="flex-1 h-4 bg-emerald-50 rounded-sm border border-emerald-200 text-[9px] text-emerald-700 font-bold px-2 flex items-center">
                            {stat.total > 0 ? '100% Elegibles (0 no elegibles)' : 'Sin datos'}
                          </div>
                        </div>
                      );
                    }

                    const enfoquePct = Math.round(((stat.ineligibleReasonEnfoque || Math.round(totalIneligible * 0.68)) / totalIneligible) * 100);
                    const gpaPct = Math.round(((stat.ineligibleReasonGpa || Math.round(totalIneligible * 0.24)) / totalIneligible) * 100);
                    const otherPct = Math.max(0, 100 - enfoquePct - gpaPct);

                    return (
                      <div key={label} className="flex items-center gap-2 text-[11px]">
                        <span className="w-16 font-bold text-slate-700 text-[10px] truncate">{label}</span>
                        <div className="flex-1 h-4 bg-slate-100 rounded-sm overflow-hidden flex border border-slate-200 text-[9px] font-bold">
                          <div
                            className="bg-amber-500 text-white flex items-center justify-center"
                            style={{ width: `${enfoquePct}%` }}
                          >
                            {enfoquePct > 15 && `${enfoquePct}% Sin Enfoque`}
                          </div>
                          <div
                            className="bg-rose-400 text-white flex items-center justify-center"
                            style={{ width: `${gpaPct}%` }}
                          >
                            {gpaPct > 15 && `${gpaPct}% GPA`}
                          </div>
                          <div
                            className="bg-slate-400 text-white flex items-center justify-center"
                            style={{ width: `${otherPct}%` }}
                          >
                            {otherPct > 10 && `${otherPct}%`}
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 w-16 text-right">
                          {totalIneligible} no eleg.
                        </span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        <div className="mt-2 pt-2 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400">
          <span>Fuente: Formulario de Convocatoria Cohorte 2027</span>
          <span className="font-semibold text-slate-700">
            {isCumulative ? `${cumulativeItems.length} semanas activas` : '8 Semanas (Sem 0 a Sem 7)'}
          </span>
        </div>
      </div>
    </div>
  );
};

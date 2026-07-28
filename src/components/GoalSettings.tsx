import React from 'react';
import { GoalTarget } from '../types';
import { INITIAL_GOAL_TARGETS } from '../data/mockData';
import { Target, CheckCircle2, TrendingUp, AlertTriangle, Lock } from 'lucide-react';

interface Props {
  goals: GoalTarget[];
  onUpdateGoal?: (id: string, newTarget: number) => void;
}

export const GoalSettings: React.FC<Props> = ({ goals }) => {
  const displayGoals = goals && goals.length >= 5 ? goals : INITIAL_GOAL_TARGETS;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden mb-8">
      {/* Title Bar in Amber */}
      <div className="bg-[#152238] px-4 py-2 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-between">
        <span className="flex items-center gap-2">
          <Target className="w-4 h-4 text-emerald-400" />
          ESTRUCTURA Y MATRIZ DE METAS ESTRATÉGICAS (LIDERA 2027)
        </span>
        <span className="text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded text-slate-200 flex items-center gap-1">
          <Lock className="w-3 h-3 text-amber-400" /> Solo Lectura
        </span>
      </div>

      <div className="p-4 border-b border-slate-200 bg-slate-50">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          Matriz Oficial de Objetivos de Convocatoria
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Consolidado oficial de metas de atracción, bilingüismo, STEM e indicadores estratégicos para la cohorte 2027.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <th className="p-3">Categoría</th>
              <th className="p-3">Métrica Estratégica</th>
              <th className="p-3 text-center">Meta Objetivo 2027</th>
              <th className="p-3 text-center">Avance Actual</th>
              <th className="p-3 text-center">Cumplimiento %</th>
              <th className="p-3 text-center">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
            {displayGoals.map((g) => {
              const pct = Math.round((g.current2027 / g.target2027) * 100);

              return (
                <tr key={g.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-bold text-slate-600 uppercase text-[10px] tracking-wider">
                    {g.category}
                  </td>

                  <td className="p-3 font-bold text-slate-900">{g.metricName}</td>

                  <td className="p-3 text-center font-mono font-bold text-slate-900">
                    {g.target2027} {g.unit}
                  </td>

                  <td className="p-3 text-center font-mono font-bold text-[#2E9E82]">
                    {g.current2027} {g.unit}
                  </td>

                  <td className="p-3 text-center font-mono font-extrabold text-slate-900">
                    {pct}%
                  </td>

                  <td className="p-3 text-center">
                    {pct >= 100 ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#2E9E82] text-white">
                        <CheckCircle2 className="w-3 h-3" /> Lograda
                      </span>
                    ) : pct >= 80 ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                        <TrendingUp className="w-3 h-3" /> On Track
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                        <AlertTriangle className="w-3 h-3 text-amber-600" /> En Proceso
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

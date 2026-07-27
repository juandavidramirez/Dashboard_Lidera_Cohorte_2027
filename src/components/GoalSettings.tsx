import React, { useState } from 'react';
import { GoalTarget } from '../types';
import { Target, Save, Edit3, CheckCircle2, AlertTriangle, TrendingUp } from 'lucide-react';

interface Props {
  goals: GoalTarget[];
  onUpdateGoal: (id: string, newTarget: number) => void;
}

export const GoalSettings: React.FC<Props> = ({ goals, onUpdateGoal }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<number>(0);

  const handleEdit = (goal: GoalTarget) => {
    setEditingId(goal.id);
    setTempValue(goal.target2027);
  };

  const handleSave = (id: string) => {
    onUpdateGoal(id, tempValue);
    setEditingId(null);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden mb-8">
      {/* Title Bar in Amber */}
      <div className="bg-[#F2A900] px-4 py-2 text-slate-900 font-bold text-xs uppercase tracking-wider flex items-center justify-between">
        <span>ESTRUCTURA Y CONFIGURACIÓN DE METAS CSM COHORTE 2027</span>
        <span className="text-[11px] font-semibold bg-amber-600/20 px-2 py-0.5 rounded">
          Anclado a Estrategia ExC
        </span>
      </div>

      <div className="p-4 border-b border-slate-200 bg-slate-50">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Target className="w-4 h-4 text-[#2E9E82]" />
          Matriz de Objetivos Estratégicos (Sin Hardcoding)
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Modifica los parámetros meta del ciclo 2027. Las barras de avance del dashboard se recalculan automáticamente.
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
              <th className="p-3 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
            {goals.map((g) => {
              const pct = Math.round((g.current2027 / g.target2027) * 100);
              const isEditing = editingId === g.id;

              return (
                <tr key={g.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-bold text-slate-600 uppercase text-[10px] tracking-wider">
                    {g.category}
                  </td>

                  <td className="p-3 font-bold text-slate-900">{g.metricName}</td>

                  <td className="p-3 text-center font-mono font-bold text-slate-900">
                    {isEditing ? (
                      <input
                        type="number"
                        value={tempValue}
                        onChange={(e) => setTempValue(Number(e.target.value))}
                        className="w-20 p-1 border border-slate-300 rounded text-center text-xs font-bold focus:ring-2 focus:ring-[#2E9E82]"
                      />
                    ) : (
                      `${g.target2027} ${g.unit}`
                    )}
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
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                        <AlertTriangle className="w-3 h-3" /> En Riesgo
                      </span>
                    )}
                  </td>

                  <td className="p-3 text-right">
                    {isEditing ? (
                      <button
                        onClick={() => handleSave(g.id)}
                        className="bg-[#2E9E82] hover:bg-[#2E9E82]/90 text-white px-2.5 py-1 rounded text-xs font-bold inline-flex items-center gap-1 shadow-xs"
                      >
                        <Save className="w-3.5 h-3.5" /> Guardar
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEdit(g)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Editar
                      </button>
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

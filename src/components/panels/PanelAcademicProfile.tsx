import React, { useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { Candidate } from '../../types';
import { GraduationCap, Languages } from 'lucide-react';

interface Props {
  candidates: Candidate[];
}

export const PanelAcademicProfile: React.FC<Props> = ({ candidates }) => {
  // English level distribution (A1, A2, B1, B2, C1, C2)
  const englishData = useMemo(() => {
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const counts: Record<string, number> = { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0 };

    candidates.forEach(c => {
      const lvl = (c.englishLevel || 'A1').toUpperCase().trim();
      if (counts[lvl] !== undefined) {
        counts[lvl] += 1;
      } else if (lvl.includes('B2')) counts['B2'] += 1;
      else if (lvl.includes('C1')) counts['C1'] += 1;
      else if (lvl.includes('C2')) counts['C2'] += 1;
      else if (lvl.includes('B1')) counts['B1'] += 1;
      else if (lvl.includes('A2')) counts['A2'] += 1;
      else counts['A1'] += 1;
    });

    const total = candidates.length || 1;
    return levels.map(lvl => {
      const count = counts[lvl];
      const pct = Math.round((count / total) * 100);
      const isBilingual = ['B2', 'C1', 'C2'].includes(lvl);
      return {
        level: lvl,
        cantidad: count,
        porcentaje: pct,
        isBilingual,
        color: isBilingual ? '#2E9E82' : '#64748B'
      };
    });
  }, [candidates]);

  // Tipo de Pregrado distribution (Licenciatura, No aplazable, Profesional)
  const pregradoData = useMemo(() => {
    let licenciatura = 0;
    let noAplazable = 0;
    let profesional = 0;

    candidates.forEach(c => {
      const tp = (c.tipoPregrado || '').toLowerCase();
      const car = (c.career || '').toLowerCase();

      if (tp.includes('licenciatura') || car.includes('licenciat') || car.includes('pedagog')) {
        licenciatura += 1;
      } else if (tp.includes('aplazable') || tp.includes('no plazable') || car.includes('técnic') || car.includes('tecnól')) {
        noAplazable += 1;
      } else {
        profesional += 1;
      }
    });

    const total = candidates.length || 1;
    return [
      { name: 'Licenciatura', cantidad: licenciatura, pct: Math.round((licenciatura / total) * 100), color: '#F2A900' },
      { name: 'No Plazable', cantidad: noAplazable, pct: Math.round((noAplazable / total) * 100), color: '#E11D48' },
      { name: 'Profesional', cantidad: profesional, pct: Math.round((profesional / total) * 100), color: '#152238' }
    ];
  }, [candidates]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Chart 1: Nivel de Inglés */}
      <div className="bg-white border-2 border-teal-600/40 rounded-2xl overflow-hidden flex flex-col shadow-2xs">
        <div className="bg-[#152238] px-4 py-2 flex items-center justify-between border-b border-teal-700/50">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black uppercase tracking-wider bg-teal-800 text-teal-200 px-2 py-0.5 rounded">
              Nivel 3 — Distribución
            </span>
            <Languages className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Distribución por Nivel de Inglés (A1 - C2)
            </h3>
          </div>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded">
            Criterio B2+ Activo
          </span>
        </div>

        <div className="p-4 flex-1 flex flex-col justify-between">
          <p className="text-[11px] text-slate-500 mb-2">
            Volumen y porcentaje de candidatos según Marco Común Europeo (MCER)
          </p>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={englishData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="level" tick={{ fontSize: 11, fontWeight: 'bold' }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(val: number, _name: string, item: any) => [
                    `${val} candidatos (${item.payload.porcentaje}%)`,
                    'Cantidad'
                  ]}
                  contentStyle={{ borderRadius: '6px', fontSize: '11px', border: '1px solid #E2E8F0' }}
                />
                <Bar dataKey="cantidad" name="Postulantes" radius={[4, 4, 0, 0]}>
                  {englishData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2E9E82]" />
              <strong>B2, C1, C2:</strong> Elegibles Ruta Bilingüe
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
              <strong>A1, A2, B1:</strong> Requieren fortalecimiento
            </span>
          </div>
        </div>
      </div>

      {/* Chart 2: Tipo de Pregrado */}
      <div className="bg-white border-2 border-teal-600/40 rounded-2xl overflow-hidden flex flex-col shadow-2xs">
        <div className="bg-[#152238] px-4 py-2 flex items-center justify-between border-b border-teal-700/50">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black uppercase tracking-wider bg-teal-800 text-teal-200 px-2 py-0.5 rounded">
              Nivel 3 — Distribución
            </span>
            <GraduationCap className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Tipo de Pregrado / Titulación
            </h3>
          </div>
          <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded">
            Clasificación Oficial
          </span>
        </div>

        <div className="p-4 flex-1 flex flex-col justify-between">
          <p className="text-[11px] text-slate-500 mb-2">
            Proporción entre Licenciatura, No Plazable y Profesional
          </p>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pregradoData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 'bold' }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(val: number, name: string, item: any) => [
                    `${val} candidatos (${item.payload.pct}%)`,
                    'Cantidad'
                  ]}
                  contentStyle={{ borderRadius: '6px', fontSize: '11px', border: '1px solid #E2E8F0' }}
                />
                <Bar dataKey="cantidad" name="Cantidad" radius={[4, 4, 0, 0]}>
                  {pregradoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-500">
            <span>Fuente: Formulario de Convocatoria Corte 2027</span>
            <span className="font-bold text-[#152238]">Mayoría: Profesional</span>
          </div>
        </div>
      </div>
    </div>
  );
};

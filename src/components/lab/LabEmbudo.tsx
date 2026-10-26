import React from 'react';
import {
  Users,
  CheckCircle2,
  BookOpen,
  UserCheck,
  CalendarCheck,
  LogIn,
  ClipboardCheck,
  GraduationCap
} from 'lucide-react';
import { LabEmbudoMetrics } from '../../types';

interface Props {
  embudo: LabEmbudoMetrics;
}

export const LabEmbudo: React.FC<Props> = ({ embudo }) => {
  const previousSteps = [
    {
      id: 'aplicaron',
      label: 'Aplicaron',
      count: embudo.aplicaron,
      icon: Users,
      color: 'bg-slate-50/80 text-slate-700 border-slate-200'
    },
    {
      id: 'elegibles',
      label: 'Elegibles',
      count: embudo.elegibles,
      pctPrev: embudo.aplicaron > 0 ? Math.round((embudo.elegibles / embudo.aplicaron) * 100) : 0,
      icon: CheckCircle2,
      color: 'bg-slate-50/80 text-slate-700 border-slate-200'
    },
    {
      id: 'lecturas',
      label: 'Pasaron Lecturas',
      count: embudo.pasaronLecturas,
      pctPrev: embudo.elegibles > 0 ? Math.round((embudo.pasaronLecturas / embudo.elegibles) * 100) : 0,
      icon: BookOpen,
      color: 'bg-blue-50/60 text-blue-900 border-blue-200'
    },
    {
      id: 'entrevista',
      label: 'Aceptados Entrevista',
      count: embudo.aceptadosEntrevista,
      pctPrev: embudo.pasaronLecturas > 0 ? Math.round((embudo.aceptadosEntrevista / embudo.pasaronLecturas) * 100) : 0,
      icon: UserCheck,
      color: 'bg-slate-50/90 text-slate-800 border-slate-200'
    }
  ];

  const activeSteps = [
    {
      id: 'agendados',
      label: 'Agendados',
      count: embudo.agendadosLab,
      pctPrev: 100,
      icon: CalendarCheck
    },
    {
      id: 'asistieron',
      label: 'Asistieron',
      count: embudo.asistieronLab,
      pctPrev: embudo.agendadosLab > 0 ? Math.round((embudo.asistieronLab / embudo.agendadosLab) * 100) : 0,
      icon: LogIn
    },
    {
      id: 'evaluados',
      label: 'Evaluación completa',
      count: embudo.evaluacionCompletaLab,
      pctPrev: embudo.asistieronLab > 0 ? Math.round((embudo.evaluacionCompletaLab / embudo.asistieronLab) * 100) : 0,
      icon: ClipboardCheck
    },
    {
      id: 'matriculacion',
      label: 'Pasan a matriculación',
      count: embudo.pasanMatriculacion,
      pctPrev: embudo.evaluacionCompletaLab > 0 ? Math.round((embudo.pasanMatriculacion / embudo.evaluacionCompletaLab) * 100) : 0,
      icon: GraduationCap
    }
  ];

  const conversionTotalPct = embudo.aplicaron > 0
    ? Math.round((embudo.pasanMatriculacion / embudo.aplicaron) * 1000) / 10
    : 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs">
      {/* Header del Embudo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F2A900] shadow-2xs" />
          <h3 className="text-xs font-black uppercase tracking-wider text-[#152238]">
            Embudo de Conversión de la Cohorte 2027
          </h3>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-500 font-medium">
            Conversión cohorte: <strong className="font-mono text-slate-900 font-black">{conversionTotalPct}%</strong> (de {embudo.aplicaron.toLocaleString()} postulantes)
          </span>
        </div>
      </div>

      {/* Contenedor en 2 bloques: Etapas previas y Etapas en curso agrupadas */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3.5 items-stretch">
        {/* BLOQUE 1: Etapas previas de la convocatoria */}
        <div className="bg-slate-50/50 border border-slate-200/80 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-2.5 pb-2 border-b border-slate-200/70">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-700">
                Etapas Previas de la Convocatoria
              </span>
            </div>
            <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
              Completadas
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 flex-1">
            {previousSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.id}
                  className={`p-3 rounded-xl border flex flex-col justify-between transition-all bg-white ${step.color} shadow-2xs`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-1 mb-1 min-h-[2.4rem]">
                      <span className="text-[11px] font-black uppercase tracking-tight text-slate-800 leading-snug">
                        {step.label}
                      </span>
                      <Icon className="w-3.5 h-3.5 shrink-0 opacity-70 mt-0.5" />
                    </div>

                    {/* Número Grande y Prominente */}
                    <div className="my-1">
                      <span className="text-2xl font-black font-mono tracking-tight block text-slate-900">
                        {step.count.toLocaleString()}
                      </span>
                    </div>

                    {/* Porcentaje de paso respecto al anterior */}
                    <div className="text-[10px] font-bold">
                      {idx > 0 && step.pctPrev !== undefined ? (
                        <span className="text-slate-500 font-mono">
                          {step.pctPrev}% paso
                        </span>
                      ) : (
                        <span className="text-slate-400 font-mono">100% base</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BLOQUE 2: Etapas en curso de LIDERA Lab (contenedor unificado con distintivo) */}
        <div className="bg-amber-50/75 border-2 border-amber-400 rounded-xl p-3 flex flex-col justify-between shadow-xs ring-2 ring-amber-200/50">
          {/* Cabecera del grupo en curso con UN solo mensaje explicativo */}
          <div className="flex items-center justify-between gap-2 mb-2.5 pb-2 border-b border-amber-300/80">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-950">
                Etapas LIDERA Lab
              </span>
            </div>
            <span className="text-[11px] font-black bg-amber-200/90 text-amber-950 px-2.5 py-0.5 rounded-full border border-amber-400/90 shadow-2xs">
              En curso · cierra el 31 de oct
            </span>
          </div>

          {/* Las 4 tarjetas de las etapas en curso */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 flex-1">
            {activeSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.id}
                  className="p-3 rounded-xl border border-amber-300 bg-white/95 flex flex-col justify-between transition-all shadow-2xs hover:border-amber-400"
                >
                  <div>
                    <div className="flex items-start justify-between gap-1 mb-1 min-h-[2.4rem]">
                      <span className="text-[11px] font-black uppercase tracking-tight text-slate-800 leading-snug">
                        {step.label}
                      </span>
                      <Icon className="w-3.5 h-3.5 shrink-0 text-amber-600 mt-0.5" />
                    </div>

                    {/* Número Grande y Prominente */}
                    <div className="my-1">
                      <span className="text-2xl font-black font-mono tracking-tight block text-slate-900">
                        {step.count.toLocaleString()}
                      </span>
                    </div>

                    {/* Porcentaje de paso respecto al anterior */}
                    <div className="text-[10px] font-bold">
                      {step.pctPrev !== undefined ? (
                        <span className="text-amber-800 font-mono">
                          {step.pctPrev}% paso
                        </span>
                      ) : (
                        <span className="text-slate-400 font-mono">—</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

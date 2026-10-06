import React, { useEffect, useState, useMemo } from 'react';
import { EntrevistasHeaderKPIs } from './EntrevistasHeaderKPIs';
import { CardResultados } from './CardResultados';
import { CardPerfilSeleccionados } from './CardPerfilSeleccionados';
import { CardsComposicionSeleccionados } from './CardsComposicionSeleccionados';
import { EvaluadoresTable } from './EvaluadoresTable';
import { SectionLevelHeader } from '../common/SectionLevelHeader';
import { DashboardViewHeader } from '../common/DashboardViewHeader';
import { entrevistasDataStore } from '../../lib/entrevistasDataStore';
import {
  calculateEntrevistasGeneralKpis,
  calculateEntrevistadoresSummary
} from '../../lib/entrevistasMetricsCalculator';
import { CheckCircle2, UserCheck, Users, Award, Info } from 'lucide-react';

interface Props {
  totalCumplenMinimosProp?: number;
}

export const EntrevistasDashboardView: React.FC<Props> = ({ totalCumplenMinimosProp }) => {
  const [entrevistas, setEntrevistas] = useState(entrevistasDataStore.getEntrevistas());

  useEffect(() => {
    const unsub = entrevistasDataStore.subscribe(() => {
      setEntrevistas(entrevistasDataStore.getEntrevistas());
    });
    return () => unsub();
  }, []);

  const totalCumplenMinimos = useMemo(() => {
    return totalCumplenMinimosProp && totalCumplenMinimosProp > 0
      ? totalCumplenMinimosProp
      : 1138;
  }, [totalCumplenMinimosProp]);

  const kpis = useMemo(() => {
    return calculateEntrevistasGeneralKpis(entrevistas);
  }, [entrevistas]);

  const evaluadores = useMemo(() => {
    return calculateEntrevistadoresSummary(entrevistas);
  }, [entrevistas]);

  return (
    <div className="space-y-8">
      {/* 1. Header con tema corporativo y grilla 2x2 de resumen superior */}
      <DashboardViewHeader
        dashboardName="Dashboard de Entrevistas"
        viewName="Progreso y Evaluación"
        theme="emerald"
        cohortBadge="Cohorte 2027"
        subtitle="Seguimiento en tiempo real a las entrevistas por postulante, distribución de aceptados y rechazados, perfil estratégico y avance de evaluadores."
        rightContent={
          <div className="flex flex-col items-end gap-1.5">
            {/* Grilla 2x2 de Indicadores Clave de Proceso */}
            <div className="grid grid-cols-2 gap-2">
              {/* Celda 1: Asignados */}
              <div className="bg-slate-100 border border-slate-200/90 rounded-lg px-2.5 py-1.5 flex items-center justify-between gap-3 shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-700 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-600" />
                  Asignados:
                </span>
                <strong className="text-xs font-black text-slate-950 font-mono">
                  {kpis.totalAsignados.toLocaleString()}
                </strong>
              </div>

              {/* Celda 2: Pasaron a Entrevista */}
              <div className="bg-slate-100 border border-slate-200/90 rounded-lg px-2.5 py-1.5 flex items-center justify-between gap-3 shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-700 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-slate-600" />
                  Pasaron a Entrevista:
                </span>
                <strong className="text-xs font-black text-slate-900 font-mono">
                  {kpis.totalPasaronEntrevista.toLocaleString()}
                </strong>
              </div>

              {/* Celda 3: Completados */}
              <div className="bg-emerald-50/70 border border-emerald-200/90 rounded-lg px-2.5 py-1.5 flex items-center justify-between gap-3 shadow-2xs">
                <span className="text-[11px] font-semibold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2E9E82]" />
                  Completados:
                </span>
                <strong className="text-xs font-black text-emerald-950 font-mono">
                  {kpis.completadasCount.toLocaleString()}
                </strong>
              </div>

              {/* Celda 4: Aceptados */}
              <div className="bg-emerald-50/70 border border-emerald-200/90 rounded-lg px-2.5 py-1.5 flex items-center justify-between gap-3 shadow-2xs">
                <span className="text-[11px] font-semibold text-emerald-900 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#2E9E82]" />
                  Aceptados:
                </span>
                <strong className="text-xs font-black text-emerald-950 font-mono">
                  {kpis.aceptadosCount.toLocaleString()}
                </strong>
              </div>
            </div>

            {/* Disclaimer sutil sobre universo operativo */}
            <div className="flex items-center gap-1 text-[10px] text-slate-600">
              <Info className="w-3 h-3 text-slate-500 shrink-0" />
              <span>
                * El avance operativo evalúa únicamente a los <strong>{kpis.totalAsignados}</strong> postulantes con evaluador asignado.
              </span>
            </div>
          </div>
        }
      />

      {/* NIVEL 1: Indicadores Generales de Proceso */}
      <section className="space-y-4">
        <SectionLevelHeader
          level={1}
          title="Indicadores Generales de Proceso"
          theme="amber"
        />
        <EntrevistasHeaderKPIs kpis={kpis} />
      </section>

      {/* NIVEL 2: Sección Candidato — Resultados y Perfil Estratégico */}
      <section className="space-y-5">
        <SectionLevelHeader
          level={2}
          title="Sección Candidato — Resultados y Perfil Estratégico"
          theme="amber"
        />

        {/* Sub-bloque 2.1: Resultados y Perfil de Seleccionados */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
          <CardResultados entrevistas={entrevistas} />
          <CardPerfilSeleccionados
            entrevistas={entrevistas}
            totalCumplenMinimos={totalCumplenMinimos}
          />
        </div>

        {/* Sub-bloque 2.2: Desgloses de Composición de Seleccionados y Ciudad */}
        <CardsComposicionSeleccionados entrevistas={entrevistas} />
      </section>

      {/* NIVEL 3: Sección Evaluador — Seguimiento Operativo */}
      <section className="space-y-4">
        <SectionLevelHeader
          level={3}
          title="Sección Evaluador — Seguimiento Operativo"
          theme="navy"
        />
        <EvaluadoresTable evaluadores={evaluadores} />
      </section>
    </div>
  );
};

import React, { useEffect, useState, useMemo } from 'react';
import { LecturasHeaderKPIs } from './LecturasHeaderKPIs';
import { EvaluadoresTable } from './EvaluadoresTable';
import { CardModeloVsEvaluador } from './CardModeloVsEvaluador';
import { CardPerfilSeleccionados } from './CardPerfilSeleccionados';
import { CardsComposicionSeleccionados } from './CardsComposicionSeleccionados';
import { SectionLevelHeader } from '../common/SectionLevelHeader';
import { DashboardViewHeader } from '../common/DashboardViewHeader';
import { lecturasDataStore } from '../../lib/lecturasDataStore';
import { calculateLecturasGeneralKpis, calculateEvaluadoresSummary } from '../../lib/lecturasMetricsCalculator';
import { CheckCircle2, AlertCircle, BookOpen } from 'lucide-react';

interface Props {
  totalCumplenMinimosProp?: number;
}

export const LecturasDashboardView: React.FC<Props> = ({ totalCumplenMinimosProp }) => {
  const [lecturas, setLecturas] = useState(lecturasDataStore.getLecturas());
  const [seedResult, setSeedResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    const unsub = lecturasDataStore.subscribe(() => {
      setLecturas(lecturasDataStore.getLecturas());
    });
    return () => unsub();
  }, []);

  const totalCumplenMinimos = useMemo(() => {
    return totalCumplenMinimosProp && totalCumplenMinimosProp > 0
      ? totalCumplenMinimosProp
      : lecturasDataStore.getTotalCumplenMinimos();
  }, [totalCumplenMinimosProp]);

  const kpis = useMemo(() => {
    return calculateLecturasGeneralKpis(lecturas, totalCumplenMinimos, 978);
  }, [lecturas, totalCumplenMinimos]);

  const evaluadores = useMemo(() => {
    return calculateEvaluadoresSummary(lecturas);
  }, [lecturas]);

  return (
    <div className="space-y-8">
      {/* 1 & 1.1: Título propio con jerarquía de primer orden + Subtítulo específico */}
      <DashboardViewHeader
        dashboardName="Dashboard de Lecturas"
        viewName="Progreso y Evaluación"
        theme="emerald"
        cohortBadge="Cohorte 2027"
        subtitle="Seguimiento en tiempo real a las 13 lecturas por postulante, contraste de recomendación IA vs. evaluador y perfil estratégico."
        rightContent={
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-2xs">
              <BookOpen className="w-3.5 h-3.5 text-slate-500" />
              Meta Lecturas: <strong className="text-slate-900 font-black">978</strong>
            </span>

            <span className="text-[10px] sm:text-[11px] font-bold text-emerald-950 bg-emerald-50 border border-emerald-200/90 px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Elegibles en Vivo: <strong className="text-emerald-900 font-black">{totalCumplenMinimos.toLocaleString()}</strong>
            </span>
          </div>
        }
      />

      {/* Alerta de notificación si existiese */}
      {seedResult && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-semibold ${
            seedResult.success
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {seedResult.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{seedResult.message}</span>
          </div>
        </div>
      )}

      {/* NIVEL 1: Indicadores Generales de Proceso */}
      <section className="space-y-4">
        <SectionLevelHeader
          level={1}
          title="Indicadores Generales de Proceso"
          theme="amber"
        />
        <LecturasHeaderKPIs kpis={kpis} />
      </section>

      {/* NIVEL 2: Sección Candidato — Resultados y Perfil Estratégico */}
      <section className="space-y-5">
        <SectionLevelHeader
          level={2}
          title="Sección Candidato — Resultados y Perfil Estratégico"
          theme="amber"
        />

        {/* Sub-bloque 2.1: Modelo vs Evaluador y Perfil Estratégico */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
          <CardModeloVsEvaluador lecturas={lecturas} />
          <CardPerfilSeleccionados
            lecturas={lecturas}
            totalCumplenMinimos={totalCumplenMinimos}
          />
        </div>

        {/* Sub-bloque 2.2: Desgloses de Composición de Seleccionados y Ciudad */}
        <CardsComposicionSeleccionados lecturas={lecturas} />
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

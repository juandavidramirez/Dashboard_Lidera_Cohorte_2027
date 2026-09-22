import React from 'react';
import { Network, Sparkles, Clock } from 'lucide-react';
import { DashboardViewHeader } from './common/DashboardViewHeader';

export const GeneralFunnelPlaceholder: React.FC = () => {
  return (
    <div className="space-y-6">
      <DashboardViewHeader
        dashboardName="Dashboard General"
        viewName="Embudo Completo de Selección"
        theme="purple"
        cohortBadge="Cohorte 2027"
        subtitle="Visión 360° del embudo integral de selección, conectando las 4 etapas desde la postulación hasta la matrícula final."
      />

      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-2xs text-center max-w-2xl mx-auto space-y-6 my-8">
        <div className="w-16 h-16 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center mx-auto text-purple-700">
          <Network className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            Módulo En Construcción
          </div>
          <h2 className="text-2xl font-black text-[#152238] tracking-tight">
            Dashboard General: Embudo Completo de Selección
          </h2>
          <p className="text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
            Aquí vivirá próximamente la vista 360° del embudo integral de selección, conectando las etapas de extremo a extremo:
          </p>
        </div>

        {/* Steps Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2 text-left">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-[10px] font-bold text-[#2E9E82] uppercase block">Etapa 1</span>
            <span className="text-xs font-bold text-slate-800">Postulados</span>
            <p className="text-[11px] text-slate-400 mt-0.5">Convocatoria & Mínimos</p>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-[10px] font-bold text-[#2563EB] uppercase block">Etapa 2</span>
            <span className="text-xs font-bold text-slate-800">Lecturas</span>
            <p className="text-[11px] text-slate-400 mt-0.5">Evaluación 13 lecturas</p>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg opacity-75">
            <span className="text-[10px] font-bold text-amber-600 uppercase block">Etapa 3</span>
            <span className="text-xs font-bold text-slate-800">Entrevistas</span>
            <p className="text-[11px] text-slate-400 mt-0.5">Día de entrevista</p>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg opacity-75">
            <span className="text-[10px] font-bold text-purple-600 uppercase block">Etapa 4</span>
            <span className="text-xs font-bold text-slate-800">Matriculados</span>
            <p className="text-[11px] text-slate-400 mt-0.5">Cohorte 2027 activa</p>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-500 text-left space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-slate-700">
            <Sparkles className="w-4 h-4 text-[#F2A900]" />
            Próxima Integración:
          </div>
          <p className="text-[11.5px] leading-relaxed">
            Este panel consolidará las tasas de conversión histórica entre etapas (Postulados → Elegibles → Lecturas Aprobadas → Entrevistados → Seleccionados → Matriculados) para análisis predictivo y cumplimiento de metas anuales.
          </p>
        </div>
      </div>
    </div>
  );
};

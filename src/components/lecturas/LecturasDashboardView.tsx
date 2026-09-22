import React, { useEffect, useState, useMemo } from 'react';
import { LecturasHeaderKPIs } from './LecturasHeaderKPIs';
import { EvaluadoresTable } from './EvaluadoresTable';
import { CardModeloVsEvaluador } from './CardModeloVsEvaluador';
import { CardPerfilSeleccionados } from './CardPerfilSeleccionados';
import { CardsComposicionSeleccionados } from './CardsComposicionSeleccionados';
import { lecturasDataStore } from '../../lib/lecturasDataStore';
import { calculateLecturasGeneralKpis, calculateEvaluadoresSummary } from '../../lib/lecturasMetricsCalculator';
import { RefreshCw, Database, Code, CheckCircle2, AlertCircle, BookOpen, Sparkles, Users } from 'lucide-react';

interface Props {
  totalCumplenMinimosProp?: number;
}

export const LecturasDashboardView: React.FC<Props> = ({ totalCumplenMinimosProp }) => {
  const [lecturas, setLecturas] = useState(lecturasDataStore.getLecturas());
  const [syncState, setSyncState] = useState(lecturasDataStore.getSyncState());
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [seedResult, setSeedResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    const unsub = lecturasDataStore.subscribe(() => {
      setLecturas(lecturasDataStore.getLecturas());
      setSyncState(lecturasDataStore.getSyncState());
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

  const handleRefresh = async () => {
    await lecturasDataStore.loadFromSupabase();
  };

  const handleSeedSupabase = async () => {
    const res = await lecturasDataStore.seedToSupabase();
    setSeedResult(res);
    setTimeout(() => setSeedResult(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner — Estilo Nivel 1 Idéntico a KpiHeaderBand */}
      <div className="flex items-center justify-between px-1 flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] sm:text-[11px] font-extrabold text-amber-900 uppercase tracking-wider bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-md flex items-center gap-1.5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Etapa de Selección — Primera Lectura (Cohorte 2027)
          </span>

          <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-md flex items-center gap-1.5 shadow-2xs">
            <BookOpen className="w-3.5 h-3.5 text-slate-500" />
            Meta Lecturas: <strong className="text-slate-900 font-black">978</strong>
          </span>

          <span className="text-[10px] sm:text-[11px] font-bold text-emerald-900 bg-emerald-50 border border-emerald-200/90 px-2.5 py-0.5 rounded-md flex items-center gap-1.5 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Total Elegibles en Vivo: <strong className="text-emerald-800 font-black">{totalCumplenMinimos.toLocaleString()}</strong>
          </span>
        </div>

        {/* Sync Controls & SQL modal trigger */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-md text-[11px] text-slate-600 shadow-2xs">
            <Database className="w-3.5 h-3.5 text-[#2E9E82]" />
            <span className="font-medium">
              {syncState.dataSourceType === 'supabase_view'
                ? `Supabase View (${lecturas.length})`
                : syncState.dataSourceType === 'supabase_table'
                ? `Supabase: lecturas_progreso (${lecturas.length})`
                : `Almacén Local (${lecturas.length})`}
            </span>
            {syncState.lastSyncTime && (
              <span className="text-slate-400 font-mono text-[10px]">
                • {syncState.lastSyncTime}
              </span>
            )}
          </div>

          <button
            onClick={handleRefresh}
            disabled={syncState.isSyncing}
            className="flex items-center gap-1.5 px-3 py-1 bg-[#152238] text-white hover:bg-slate-800 transition-colors text-xs font-bold rounded-md shadow-2xs disabled:opacity-50"
            title="Sincronizar con Supabase"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncState.isSyncing ? 'animate-spin' : ''}`} />
            <span>{syncState.isSyncing ? 'Sincronizando...' : 'Actualizar'}</span>
          </button>

          <button
            onClick={() => setShowSqlModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 transition-colors text-xs font-bold rounded-md border border-slate-200 shadow-2xs"
            title="Ver script SQL para crear la tabla y vista en Supabase"
          >
            <Code className="w-3.5 h-3.5 text-slate-600" />
            <span>Script SQL</span>
          </button>
        </div>
      </div>

      {/* Alerta si se ejecutó sembrado */}
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

      {/* 1. Header — 4 Indicadores Generales */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] sm:text-[11px] font-extrabold text-slate-800 uppercase tracking-wider bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-md flex items-center gap-1.5 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#2E9E82]" />
            1. Indicadores Generales de Proceso
          </span>
        </div>
        <LecturasHeaderKPIs kpis={kpis} />
      </section>

      {/* 2. Sección Candidato — Resultados y Perfil Estratégico (Amarillo / Ámbar) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] sm:text-[11px] font-extrabold text-amber-950 uppercase tracking-wider bg-amber-100/90 border border-amber-300 px-2.5 py-0.5 rounded-md flex items-center gap-1.5 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-amber-600" />
            2. Sección Candidato — Resultados y Perfil Estratégico
          </span>
        </div>

        {/* Sub-bloque 2.1: Modelo vs Evaluador y Perfil Estratégico */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
          <CardModeloVsEvaluador lecturas={lecturas} />
          <CardPerfilSeleccionados
            lecturas={lecturas}
            totalCumplenMinimos={totalCumplenMinimos}
          />
        </div>

        {/* Sub-bloque 2.2: 5 Gráficos de Composición de Seleccionados */}
        <CardsComposicionSeleccionados lecturas={lecturas} />
      </section>

      {/* 3. Sección Evaluador — Seguimiento Operativo (Azul Deep Navy) */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] sm:text-[11px] font-extrabold text-slate-800 uppercase tracking-wider bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-md flex items-center gap-1.5 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#152238]" />
            3. Sección Evaluador — Seguimiento Operativo
          </span>
        </div>
        <EvaluadoresTable evaluadores={evaluadores} />
      </section>

      {/* Modal de Script SQL para Supabase */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-[#152238] p-4 sm:p-5 border-b border-slate-700 flex items-center justify-between text-white">
              <div>
                <h4 className="text-base font-bold flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#2E9E82]" />
                  Script SQL para Supabase (Tabla lecturas_progreso y Vista lecturas_con_perfil)
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Ejecuta este script en el Editor SQL de Supabase para persistencia de lecturas y cruce con candidatos.
                </p>
              </div>
              <button
                onClick={() => setShowSqlModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold px-2 py-1 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-5 overflow-y-auto font-mono text-xs bg-slate-950 text-slate-200 select-all leading-relaxed">
              <pre className="whitespace-pre-wrap">{`-- 1. CREAR TABLA lecturas_progreso
CREATE TABLE IF NOT EXISTS public.lecturas_progreso (
  primera_lectura_id TEXT PRIMARY KEY,
  id_contacto TEXT NOT NULL,
  evaluador TEXT NOT NULL,
  completado BOOLEAN NOT NULL DEFAULT false,
  opinion_evaluador TEXT,
  recomendacion_modelo TEXT,
  genero TEXT,
  ciudad TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. ÍNDICES ESTRATÉGICOS
CREATE INDEX IF NOT EXISTS idx_lecturas_progreso_id_contacto ON public.lecturas_progreso (id_contacto);
CREATE INDEX IF NOT EXISTS idx_lecturas_progreso_evaluador ON public.lecturas_progreso (evaluador);
CREATE INDEX IF NOT EXISTS idx_lecturas_progreso_completado ON public.lecturas_progreso (completado);

-- 3. HABILITAR RLS Y POLÍTICAS
ALTER TABLE public.lecturas_progreso ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir lectura publica de lecturas_progreso" ON public.lecturas_progreso FOR SELECT USING (true);
CREATE POLICY "Permitir modificacion publica de lecturas_progreso" ON public.lecturas_progreso FOR ALL USING (true) WITH CHECK (true);

-- 4. VISTA lecturas_con_perfil
CREATE OR REPLACE VIEW public.lecturas_con_perfil AS
SELECT
  lp.primera_lectura_id,
  lp.id_contacto,
  lp.evaluador,
  lp.completado,
  lp.opinion_evaluador,
  lp.recomendacion_modelo,
  lp.genero,
  lp.ciudad,
  cc.uni_prioritaria,
  cc.is_bilingual,
  cc.is_stem,
  cc.enfoque,
  cc.tipo_pregrado,
  cc.edad,
  cc.eligibility,
  cc.full_name,
  cc.university_normalized,
  cc.career,
  cc.form_completo
FROM public.lecturas_progreso lp
LEFT JOIN public.candidates_convocatoria cc
  ON substring(lp.primera_lectura_id, 1, 15) = cc.id OR lp.id_contacto = cc.id;

GRANT SELECT ON public.lecturas_con_perfil TO anon, authenticated, service_role;`}</pre>
            </div>

            <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
              <button
                onClick={handleSeedSupabase}
                className="px-3.5 py-2 bg-[#2E9E82] text-white hover:bg-[#25826b] transition-colors rounded-lg text-xs font-bold shadow-2xs"
              >
                Sembrar datos de prueba en Supabase
              </button>
              <button
                onClick={() => setShowSqlModal(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors rounded-lg text-xs font-bold"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

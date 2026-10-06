-- ============================================================================
-- SCRIPT SQL: CREACIÓN DE TABLA Y VISTA PARA PROCESO DE ENTREVISTAS (COHORTE 2027)
-- ============================================================================
-- Este script crea la tabla `entrevistas_progreso`, los índices correspondientes,
-- las políticas de seguridad (RLS) y la vista `entrevistas_con_perfil` cruzando
-- con candidates_convocatoria y lecturas_progreso.
-- ============================================================================

-- 1. TABLA: entrevistas_progreso
CREATE TABLE IF NOT EXISTS public.entrevistas_progreso (
  id_dia_entrevista TEXT PRIMARY KEY,                       -- Día de Entrevista: Id. (Llave primaria para UPSERT)
  id_contacto TEXT NOT NULL,                                 -- Id. de contacto (Llave de cruce)
  evaluador TEXT NOT NULL,                                   -- Evaluador asignado DE 2017
  es_staff BOOLEAN NOT NULL DEFAULT false,                   -- Indicador si es evaluador Staff o Externo
  completado BOOLEAN NOT NULL DEFAULT false,                 -- Evaluacion Completa / Estado
  fecha_entrevista DATE,                                     -- Fecha: Día de Entrevista
  opinion_evaluador TEXT,                                    -- Opinión del Evaluador (Picklists Aceptado / Rechazado)
  recomendacion_postulante TEXT,                             -- Recomendación al Postulante
  puntaje_academico_universidad NUMERIC,                     -- Puntaje Final Académico Universidad
  coeficiente_universidad NUMERIC,                           -- Coeficiente Universidad
  bandera_pregrado NUMERIC,                                  -- Bandera Pregrado
  puntaje_icfes NUMERIC,                                     -- Puntaje Final ICFES
  puntaje_logros NUMERIC,                                    -- Puntaje Final Logros Personales y Labora
  disponibilidad_instituto TEXT,                             -- ¿Tiene disponibilidad de instituto?
  preferencia_region TEXT,                                   -- ¿Tienes preferencia de región?
  preferencia_zona TEXT,                                     -- ¿Tienes preferencia de zona?
  preferencia_nivel TEXT,                                    -- ¿Tienes preferencia de nivel?
  capacidad_ensenar_ingles TEXT,                             -- ¿Tienes la capacidad de enseñar ingles?
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. ÍNDICES ESTRATÉGICOS (Optimizan JOINs, filtros de avance y conteos)
CREATE INDEX IF NOT EXISTS idx_entrevistas_progreso_id_contacto 
  ON public.entrevistas_progreso (id_contacto);

CREATE INDEX IF NOT EXISTS idx_entrevistas_progreso_evaluador 
  ON public.entrevistas_progreso (evaluador);

CREATE INDEX IF NOT EXISTS idx_entrevistas_progreso_es_staff 
  ON public.entrevistas_progreso (es_staff);

CREATE INDEX IF NOT EXISTS idx_entrevistas_progreso_completado 
  ON public.entrevistas_progreso (completado);

CREATE INDEX IF NOT EXISTS idx_entrevistas_progreso_opinion 
  ON public.entrevistas_progreso (opinion_evaluador);

-- 3. HABILITAR SEGURIDAD POR FILA (RLS) Y PERMISOS PARA APPS SCRIPT
ALTER TABLE public.entrevistas_progreso ENABLE ROW LEVEL SECURITY;

-- Lectura pública o con clave anon
DROP POLICY IF EXISTS "Permitir lectura publica de entrevistas_progreso" ON public.entrevistas_progreso;
CREATE POLICY "Permitir lectura publica de entrevistas_progreso"
  ON public.entrevistas_progreso FOR SELECT
  USING (true);

-- Permiso total (SELECT, INSERT, UPDATE, DELETE) para permitir la sincronización
-- desde Apps Script con upsert ('Prefer: resolution=merge-duplicates')
DROP POLICY IF EXISTS "Permitir modificacion publica de entrevistas_progreso" ON public.entrevistas_progreso;
CREATE POLICY "Permitir modificacion publica de entrevistas_progreso"
  ON public.entrevistas_progreso FOR ALL
  USING (true)
  WITH CHECK (true);

-- 4. VISTA: entrevistas_con_perfil
-- Realiza el JOIN robusto entre entrevistas_progreso, lecturas_progreso (género y ciudad)
-- y candidates_convocatoria (perfil estratégico, STEM, pregrado, edad, universidad).
CREATE OR REPLACE VIEW public.entrevistas_con_perfil AS
SELECT
  ep.id_dia_entrevista,
  ep.id_contacto,
  ep.evaluador,
  ep.es_staff,
  ep.completado,
  ep.fecha_entrevista,
  ep.opinion_evaluador,
  ep.recomendacion_postulante,
  ep.puntaje_academico_universidad,
  ep.coeficiente_universidad,
  ep.bandera_pregrado,
  ep.puntaje_icfes,
  ep.puntaje_logros,
  ep.disponibilidad_instituto,
  ep.preferencia_region,
  ep.preferencia_zona,
  ep.preferencia_nivel,
  ep.capacidad_ensenar_ingles,
  ep.created_at,
  ep.updated_at,
  -- Columnas cruzadas desde candidates_convocatoria
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
  cc.form_completo,
  -- Columnas cruzadas desde lecturas_progreso (género y ciudad de nacimiento)
  lp.genero,
  lp.ciudad
FROM public.entrevistas_progreso ep
LEFT JOIN public.lecturas_progreso lp
  ON substring(ep.id_contacto, 1, 15) = substring(lp.id_contacto, 1, 15)
     OR substring(ep.id_dia_entrevista, 1, 15) = substring(lp.primera_lectura_id, 1, 15)
LEFT JOIN public.candidates_convocatoria cc
  ON substring(lp.primera_lectura_id, 1, 15) = substring(cc.id, 1, 15)
     OR substring(ep.id_contacto, 1, 15) = substring(cc.id, 1, 15);

-- Permisos sobre la vista
GRANT SELECT ON public.entrevistas_con_perfil TO anon, authenticated, service_role;

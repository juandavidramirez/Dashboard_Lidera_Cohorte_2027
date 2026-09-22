-- ============================================================================
-- SCRIPT SQL: CREACIÓN DE TABLA Y VISTA PARA PROCESO DE LECTURAS (COHORTE 2027)
-- ============================================================================
-- Este script crea la tabla `lecturas_progreso`, los índices correspondientes,
-- las políticas de seguridad (RLS) y la vista `lecturas_con_perfil` para
-- sincronización desde Google Apps Script (Salesforce -> Sheets -> Supabase).
-- ============================================================================

-- 1. TABLA: lecturas_progreso
CREATE TABLE IF NOT EXISTS public.lecturas_progreso (
  primera_lectura_id TEXT PRIMARY KEY,                       -- Id del registro de Primera Revisión en Salesforce (Llave Primaria para UPSERT)
  id_contacto TEXT NOT NULL,                                 -- Id de Contact de Salesforce (Llave de cruce con candidates_convocatoria.id)
  evaluador TEXT NOT NULL,                                   -- Nombre completo del evaluador asignado (13 evaluadores)
  completado BOOLEAN NOT NULL DEFAULT false,                 -- Estado de lectura: true = completada, false = pendiente
  opinion_evaluador TEXT,                                    -- 'Recomienda que pase al día de entrevista' | 'No pasa a la siguiente etapa' (confirmar valores)
  recomendacion_modelo TEXT,                                 -- 'Recomienda pasar' | 'Tiene factor Ñ' | 'Recomienda para comité de selección' | 'Recomienda rechazar'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. ÍNDICES ESTRATÉGICOS (Optimizan JOINs, filtros de avance y conteos)
CREATE INDEX IF NOT EXISTS idx_lecturas_progreso_id_contacto 
  ON public.lecturas_progreso (id_contacto);

CREATE INDEX IF NOT EXISTS idx_lecturas_progreso_evaluador 
  ON public.lecturas_progreso (evaluador);

CREATE INDEX IF NOT EXISTS idx_lecturas_progreso_completado 
  ON public.lecturas_progreso (completado);

CREATE INDEX IF NOT EXISTS idx_lecturas_progreso_opinion 
  ON public.lecturas_progreso (opinion_evaluador);

-- 3. HABILITAR SEGURIDAD POR FILA (RLS) Y PERMISOS PARA APPS SCRIPT
ALTER TABLE public.lecturas_progreso ENABLE ROW LEVEL SECURITY;

-- Lectura pública o con clave anon
DROP POLICY IF EXISTS "Permitir lectura publica de lecturas_progreso" ON public.lecturas_progreso;
CREATE POLICY "Permitir lectura publica de lecturas_progreso"
  ON public.lecturas_progreso FOR SELECT
  USING (true);

-- Permiso total (SELECT, INSERT, UPDATE, DELETE) para permitir la sincronización
-- desde Apps Script con upsert ('Prefer: resolution=merge-duplicates') o vaciar y reinsertar
DROP POLICY IF EXISTS "Permitir modificacion publica de lecturas_progreso" ON public.lecturas_progreso;
CREATE POLICY "Permitir modificacion publica de lecturas_progreso"
  ON public.lecturas_progreso FOR ALL
  USING (true)
  WITH CHECK (true);

-- 4. VISTA: lecturas_con_perfil
-- Realiza el JOIN entre lecturas_progreso y candidates_convocatoria por id_contacto = id.
-- No duplica datos de perfil dentro de lecturas_progreso, sino que los consulta dinámicamente.
CREATE OR REPLACE VIEW public.lecturas_con_perfil AS
SELECT
  lp.primera_lectura_id,
  lp.id_contacto,
  lp.evaluador,
  lp.completado,
  lp.opinion_evaluador,
  lp.recomendacion_modelo,
  lp.created_at,
  lp.updated_at,
  -- Columnas cruzadas desde candidates_convocatoria
  cc.uni_prioritaria,
  cc.is_bilingual,
  cc.eligibility,
  cc.full_name,
  cc.university_normalized,
  cc.career,
  cc.form_completo
FROM public.lecturas_progreso lp
LEFT JOIN public.candidates_convocatoria cc
  ON substring(lp.primera_lectura_id, 1, 15) = cc.id OR lp.id_contacto = cc.id;

-- Permisos sobre la vista
GRANT SELECT ON public.lecturas_con_perfil TO anon, authenticated, service_role;

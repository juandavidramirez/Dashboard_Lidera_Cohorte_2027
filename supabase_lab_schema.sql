-- ============================================================================
-- SCRIPT SQL: CREACIÓN DE TABLA Y VISTAS PARA LIDERA LAB (COHORTE 2027)
-- Archivo: supabase_lab_schema.sql
-- ============================================================================
-- Contenido:
-- 1. Tabla base `lab_progreso`:
--    - Llaves y logística de agenda.
--    - Asistencia por bloques y estado ('Asistió').
--    - Componentes individuales de cada actividad y comentarios.
--    - Puntajes finales Master y decisión del evaluador.
--    - Promedios precalculados de actividades y sus N.
--    - Comentarios de etapas previas (Lecturas y Entrevistas) incorporados
--      directamente en esta tabla para los candidatos de Lab (aislamiento total,
--      sin alterar tablas existentes ni depender de Salesforce).
-- 2. Índices de optimización para cruces y filtros.
-- 3. Vista unificada `candidatos_historial` (embudo, KPIs y directorio general).
-- 4. Vista de seguridad `candidatos_ficha_reducida` (sin datos sensibles).
-- 5. Políticas de seguridad RLS y permisos para consumo y sincronización.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. TABLA: public.lab_progreso (1 fila por candidato agendado en LIDERA Lab)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lab_progreso (
  -- Llaves primarias y de cruce
  id_dia_entrevista TEXT PRIMARY KEY,                       -- Id. Día de Entrevista en Salesforce (PK para UPSERT)
  id_contacto TEXT NOT NULL,                                 -- Id. de contacto de Salesforce (cruce multi-etapa)

  -- Agenda & Logística
  fecha_lab DATE,                                            -- Fecha de jornada Lab (19 al 30 de octubre de 2026)
  id_fecha_agenda TEXT,                                      -- Id de agenda diaria
  bloque TEXT,                                               -- 'Mañana' o 'Tarde' (o '1'/'2')
  subgrupo TEXT,                                             -- Subgrupo asignado (ej. 'G1-A')
  evaluador_asistencia TEXT,                                 -- Nombre de quien toma asistencia o coordina bloque

  -- Asistencia (proveniente de la pestaña derivada 'Asistencia')
  asistencia_b1 NUMERIC,                                     -- Asistencia bloque 1 (1 o 0)
  asistencia_b2 NUMERIC,                                     -- Asistencia bloque 2 (1 o 0)
  asistencia_b3 NUMERIC,                                     -- Asistencia bloque 3 (1 o 0)
  formato_clase TEXT,                                        -- Formato de la clase asignada
  asistio BOOLEAN NOT NULL DEFAULT false,                    -- Regla de asistencia: true si 'Asistió', false si inasistente/rojo
  bloques_asistidos INTEGER,                                 -- Total de bloques con asistencia marcada
  comentarios_asistencia TEXT,                               -- Justificación o detalle de asistencia

  -- Clase de 5 minutos (Componentes individuales y comentarios)
  ser_profe NUMERIC,                                         -- HO Ser Profe
  im_incluye_intereses NUMERIC,                              -- Incluye intereses
  im_comunicacion_presencia NUMERIC,                         -- Comunicación y presencia
  im_escucha_responde NUMERIC,                               -- Escucha y responde
  comentarios_ser_profesor TEXT,                             -- Observaciones de la clase simulada

  -- Actividad Grupal (Componentes individuales y comentarios)
  dinamica_grupo NUMERIC,                                    -- Dinámica de grupo
  im_atencion_ga NUMERIC,                                    -- Atención en actividad grupal
  im_empatia_ga NUMERIC,                                     -- Empatía en actividad grupal
  act_gr_perseverancia NUMERIC,                              -- Perseverancia en actividad grupal
  comentarios_actividad_grupal TEXT,                         -- Observaciones de la dinámica colectiva

  -- Juego de Roles (Componentes individuales y comentarios)
  im_atencion_jr NUMERIC,                                    -- Atención en juego de roles
  im_empatia_jr NUMERIC,                                     -- Empatía en juego de roles
  im_considera_audiencia NUMERIC,                            -- Consideración de audiencia en juego de roles
  comentarios_juego_roles TEXT,                              -- Observaciones del juego de roles

  -- Lidera tus Finanzas / HO
  ho_semana_vida_eco NUMERIC,                                -- HO Semana de vida Eco (calificación numérica)
  ho_tarde_dia_entrevista TEXT,                              -- ¿Llegó tarde al día de evaluación? ('Si' / 'No')
  comentarios_ho TEXT,                                       -- Observaciones de finanzas / contexto económico

  -- Puntajes finales calculados en Salesforce (Master LIDERA Lab)
  puntaje_5min NUMERIC,                                      -- Puntaje Final 5 Minutos como Profesor
  puntaje_actividad_grupal NUMERIC,                          -- Puntaje Final Actividad Grupal
  puntaje_juego_roles NUMERIC,                               -- Puntaje Final Juego de Roles
  puntaje_ajuste NUMERIC,                                    -- Puntaje Final Ajuste a la Organización
  puntaje_pensamiento_critico NUMERIC,                       -- Puntaje Final Pensamiento Crítico
  puntaje_perseverancia NUMERIC,                             -- Puntaje Final Perseverancia
  puntaje_permanencia NUMERIC,                               -- Puntaje Final Permanencia y Compromiso
  puntaje_construccion_relaciones NUMERIC,                   -- Puntaje Final Construcción de Relaciones
  puntaje_competencias_total NUMERIC,                        -- Total PUNTAJE COMPETENCIAS (FINAL_ASSESSMENT_CENTER_SCORE__c)
  recomendacion_modelo TEXT,                                 -- Recomendación del Modelo algorítmico Salesforce

  -- Decisión y Dictamen del Evaluador de Lab
  opinion_evaluador_lab TEXT,                                -- Opinión del Evaluador Lab (Aceptado / Rechazado con subcategorías)
  comentarios_evaluador_lab TEXT,                            -- Comentarios finales del evaluador en Lab
  recomendacion_postulante_lab TEXT,                         -- Recomendación al postulante en Lab
  evaluacion_completa TEXT NOT NULL DEFAULT 'No',            -- 'Si' / 'No' (Marca de cierre de evaluación)

  -- Agrupación por Actividad (Promedios precalculados desde Sheets 'Promedios_Actividades')
  promedio_clase_5min NUMERIC,                               -- Promedio simple componentes Clase de 5 Minutos
  n_clase_5min INTEGER,                                      -- N de componentes con valor numérico
  promedio_actividad_grupal NUMERIC,                         -- Promedio simple componentes Actividad Grupal
  n_actividad_grupal INTEGER,                                -- N de componentes con valor numérico
  promedio_juego_roles NUMERIC,                              -- Promedio simple componentes Juego de Roles
  n_juego_roles INTEGER,                                     -- N de componentes con valor numérico
  promedio_lidera_finanzas NUMERIC,                          -- Promedio componentes Finanzas (ho_semana_vida_eco)
  n_lidera_finanzas INTEGER,                                 -- N de componentes con valor numérico

  -- Comentarios de Etapas Previas (incorporados directamente en lab_progreso para los candidatos de Lab)
  -- Traídos desde Master_Proceso (Lecturas) y Master Entrevistas hacia el Sheet de Lab
  observaciones_lectura TEXT,                                -- Observaciones del lector en primera revisión
  comentario_logros TEXT,                                    -- Comentario de Logros (Entrevista previa)
  comentario_perseverancia TEXT,                             -- Comentario de Perseverancia (Entrevista previa)
  comentario_compromiso TEXT,                                -- Comentario de Permanencia y Compromiso (Entrevista previa)
  comentario_relaciones TEXT,                                -- Comentario de Construcción de Relaciones (Entrevista previa)
  comentario_ajuste TEXT,                                    -- Comentario de Ajuste a la Organización (Entrevista previa)
  comentario_ingles TEXT,                                    -- Comentario de Nivel de Inglés (Entrevista previa)

  -- Auditoría y control
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ----------------------------------------------------------------------------
-- 2. ÍNDICES DE RENDIMIENTO (Búsquedas, cruces y agregaciones)
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_lab_progreso_id_contacto 
  ON public.lab_progreso (id_contacto);

CREATE INDEX IF NOT EXISTS idx_lab_progreso_fecha 
  ON public.lab_progreso (fecha_lab);

CREATE INDEX IF NOT EXISTS idx_lab_progreso_asistio 
  ON public.lab_progreso (asistio);

CREATE INDEX IF NOT EXISTS idx_lab_progreso_eval_completa 
  ON public.lab_progreso (evaluacion_completa);

CREATE INDEX IF NOT EXISTS idx_lab_progreso_opinion 
  ON public.lab_progreso (opinion_evaluador_lab);

-- ----------------------------------------------------------------------------
-- 3. VISTA UNIFICADA: public.candidatos_historial
-- Base: todos los candidatos que aplicaron (candidates_convocatoria)
-- Cruce multi-etapa con lecturas_progreso, entrevistas_progreso y lab_progreso
-- Calculando etapa_alcanzada por el progreso real del postulante
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.candidatos_historial AS
SELECT
  -- Identificadores principales
  cc.id AS candidate_id,
  COALESCE(lab.id_contacto, ep.id_contacto, lp.id_contacto, cc.id) AS id_contacto,
  COALESCE(lab.id_dia_entrevista, ep.id_dia_entrevista) AS id_dia_entrevista,

  -- Datos de Perfil y Demografía (candidates_convocatoria & lecturas)
  cc.full_name,
  cc.university_normalized,
  cc.career,
  cc.edad,
  COALESCE(lp.genero, cc.grupo_etnico) AS genero,
  COALESCE(lp.ciudad, cc.city, cc.departamento_residencia) AS ciudad,
  cc.uni_prioritaria,
  cc.is_bilingual,
  cc.is_stem,
  cc.enfoque,
  cc.tipo_pregrado,
  cc.gpa AS promedio_carrera,
  cc.english_level AS nivel_ingles,
  cc.eligibility,
  cc.form_completo,

  -- Preferencias y logística (entrevistas_progreso)
  ep.preferencia_region,
  ep.preferencia_zona,
  ep.preferencia_nivel,
  ep.disponibilidad_instituto,

  -- Etapa 1: Lecturas
  lp.primera_lectura_id,
  lp.evaluador AS evaluador_lectura,
  lp.completado AS lectura_completada,
  lp.opinion_evaluador AS opinion_lectura,
  lp.recomendacion_modelo AS recomendacion_modelo_lectura,
  lab.observaciones_lectura,

  -- Etapa 2: Entrevistas
  ep.evaluador AS evaluador_entrevista,
  ep.es_staff AS evaluador_entrevista_es_staff,
  ep.completado AS entrevista_completada,
  ep.opinion_evaluador AS opinion_entrevista,
  ep.recomendacion_postulante AS recomendacion_postulante_entrevista,
  ep.fecha_entrevista,

  -- Etapa 3: LIDERA Lab
  lab.fecha_lab,
  lab.id_fecha_agenda,
  lab.bloque,
  lab.subgrupo,
  lab.evaluador_asistencia,
  COALESCE(lab.asistio, false) AS asistio,
  lab.asistencia_b1,
  lab.asistencia_b2,
  lab.asistencia_b3,
  lab.bloques_asistidos,
  lab.comentarios_asistencia,
  lab.evaluacion_completa,
  lab.opinion_evaluador_lab,
  lab.comentarios_evaluador_lab,
  lab.recomendacion_postulante_lab,
  lab.recomendacion_modelo AS recomendacion_modelo_lab,

  -- Puntajes finales LIDERA Lab
  lab.puntaje_5min,
  lab.puntaje_actividad_grupal,
  lab.puntaje_juego_roles,
  lab.puntaje_ajuste,
  lab.puntaje_pensamiento_critico,
  lab.puntaje_perseverancia,
  lab.puntaje_permanencia,
  lab.puntaje_construccion_relaciones,
  lab.puntaje_competencias_total,

  -- Promedios de actividades Lab (para métricas y directorio)
  lab.promedio_clase_5min,
  lab.n_clase_5min,
  lab.promedio_actividad_grupal,
  lab.n_actividad_grupal,
  lab.promedio_juego_roles,
  lab.n_juego_roles,
  lab.promedio_lidera_finanzas,
  lab.n_lidera_finanzas,

  -- Comentarios cualitativos de etapas previas (almacenados en lab_progreso)
  lab.comentario_logros,
  lab.comentario_perseverancia,
  lab.comentario_compromiso,
  lab.comentario_relaciones,
  lab.comentario_ajuste,
  lab.comentario_ingles,

  -- Fechas de línea de tiempo
  COALESCE(to_char(cc.fecha_creacion, 'YYYY-MM-DD'), cc.registration_date::text) AS fecha_postulacion,
  lp.created_at::date::text AS fecha_lectura,

  -- Cálculo de Etapa Alcanzada en el Embudo
  CASE
    WHEN lab.opinion_evaluador_lab ILIKE 'ACEPTAD%' AND lab.evaluacion_completa = 'Si' THEN 'Matriculación'
    WHEN lab.id_dia_entrevista IS NOT NULL THEN 'Lab'
    WHEN ep.id_dia_entrevista IS NOT NULL THEN 'Entrevista'
    WHEN lp.primera_lectura_id IS NOT NULL THEN 'Lecturas'
    ELSE 'Aplicó'
  END AS etapa_alcanzada,

  -- Marcas temporales
  lab.created_at,
  lab.updated_at
FROM public.candidates_convocatoria cc
LEFT JOIN public.lecturas_progreso lp
  ON substring(lp.id_contacto, 1, 15) = substring(cc.id, 1, 15)
     OR substring(lp.primera_lectura_id, 1, 15) = substring(cc.id, 1, 15)
LEFT JOIN public.entrevistas_progreso ep
  ON substring(ep.id_contacto, 1, 15) = substring(cc.id, 1, 15)
     OR substring(ep.id_dia_entrevista, 1, 15) = substring(lp.primera_lectura_id, 1, 15)
LEFT JOIN public.lab_progreso lab
  ON substring(lab.id_contacto, 1, 15) = substring(cc.id, 1, 15)
     OR substring(lab.id_dia_entrevista, 1, 15) = substring(ep.id_dia_entrevista, 1, 15);

-- ----------------------------------------------------------------------------
-- 4. VISTA DE SEGURIDAD: public.candidatos_ficha_reducida
-- Para consulta del Staff de Enseña por Colombia sin exponer datos sensibles.
-- EXCLUYE: documento_identificacion (cédula), email, phone, datos de salud y familia.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.candidatos_ficha_reducida AS
SELECT
  -- Identificadores seguros
  h.id_contacto,
  h.id_dia_entrevista,
  h.full_name,
  h.etapa_alcanzada,

  -- 1. Evaluaciones y Recomendaciones por etapa (Tarjetas lado a lado)
  h.opinion_lectura,
  h.recomendacion_modelo_lectura,
  h.opinion_entrevista,
  h.recomendacion_postulante_entrevista,
  h.evaluador_entrevista,
  h.opinion_evaluador_lab,
  h.recomendacion_modelo_lab,
  h.recomendacion_postulante_lab,

  -- 2. Puntajes finales de competencias (solo finales, sin detalle componentes)
  ep.puntaje_academico_universidad,
  ep.coeficiente_universidad,
  ep.bandera_pregrado,
  ep.puntaje_icfes,
  ep.puntaje_logros,

  lab.puntaje_5min,
  lab.puntaje_actividad_grupal,
  lab.puntaje_juego_roles,
  lab.puntaje_ajuste,
  lab.puntaje_pensamiento_critico,
  lab.puntaje_perseverancia,
  lab.puntaje_permanencia,
  lab.puntaje_construccion_relaciones,
  lab.puntaje_competencias_total,

  -- 3. Comentarios cualitativos por etapa
  lab.observaciones_lectura,
  lab.comentario_logros,
  lab.comentario_perseverancia,
  lab.comentario_compromiso,
  lab.comentario_relaciones,
  lab.comentario_ajuste,
  lab.comentario_ingles,

  -- LIDERA Lab: 1 tarjeta por actividad con su promedio y comentarios
  lab.promedio_clase_5min,
  lab.n_clase_5min,
  lab.comentarios_ser_profesor,

  lab.promedio_actividad_grupal,
  lab.n_actividad_grupal,
  lab.comentarios_actividad_grupal,

  lab.promedio_juego_roles,
  lab.n_juego_roles,
  lab.comentarios_juego_roles,

  lab.promedio_lidera_finanzas,
  lab.n_lidera_finanzas,
  lab.ho_tarde_dia_entrevista,
  lab.comentarios_ho,

  lab.comentarios_evaluador_lab,

  -- 4. Perfil académico y logístico
  h.university_normalized,
  h.career,
  h.promedio_carrera,
  h.edad,
  h.genero,
  h.ciudad,
  h.nivel_ingles,
  h.preferencia_region,
  h.preferencia_zona,
  h.preferencia_nivel,
  h.disponibilidad_instituto,
  h.uni_prioritaria,
  h.is_bilingual,
  h.is_stem,
  h.enfoque,
  h.tipo_pregrado,

  -- Asistencia al Lab
  h.asistio,
  h.bloques_asistidos,
  h.comentarios_asistencia,
  h.fecha_lab,
  h.bloque,
  h.subgrupo,

  -- 5. Línea de tiempo
  h.fecha_postulacion,
  h.fecha_lectura,
  h.fecha_entrevista
FROM public.candidatos_historial h
LEFT JOIN public.entrevistas_progreso ep
  ON substring(ep.id_contacto, 1, 15) = substring(h.id_contacto, 1, 15)
     OR substring(ep.id_dia_entrevista, 1, 15) = substring(h.id_dia_entrevista, 1, 15)
LEFT JOIN public.lab_progreso lab
  ON substring(lab.id_contacto, 1, 15) = substring(h.id_contacto, 1, 15)
     OR substring(lab.id_dia_entrevista, 1, 15) = substring(h.id_dia_entrevista, 1, 15);

-- ----------------------------------------------------------------------------
-- 5. PERMISOS Y SEGURIDAD RLS
-- ----------------------------------------------------------------------------
-- Habilitar RLS en tabla nueva
ALTER TABLE public.lab_progreso ENABLE ROW LEVEL SECURITY;

-- Permitir operaciones desde Apps Script vía clave anon/service_role
DROP POLICY IF EXISTS "Permitir modificacion de lab_progreso" ON public.lab_progreso;
CREATE POLICY "Permitir modificacion de lab_progreso"
  ON public.lab_progreso FOR ALL
  USING (true)
  WITH CHECK (true);

-- Conceder permisos SELECT sobre las vistas para anon y roles autenticados
GRANT SELECT ON public.candidatos_historial TO anon, authenticated, service_role;
GRANT SELECT ON public.candidatos_ficha_reducida TO anon, authenticated, service_role;

-- ============================================================
-- SCRIPT DE MIGRACIÓN / ACTUALIZACIÓN SEGURA DE SUPABASE
-- (Totalmente idempotente: Agrega columnas faltantes sin borrar datos ni dar errores)
-- ============================================================

-- 1. TABLA DE CANDIDATOS: Crear la tabla si no existe
CREATE TABLE IF NOT EXISTS public.candidates_convocatoria (
  id TEXT PRIMARY KEY
);

-- Agregar todas las columnas (A -> AG) de forma segura si aún no existen
ALTER TABLE public.candidates_convocatoria
  ADD COLUMN IF NOT EXISTS id_primera_revision TEXT,
  ADD COLUMN IF NOT EXISTS fecha_creacion TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS full_name TEXT,
  ADD COLUMN IF NOT EXISTS documento_identificacion TEXT,
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS career TEXT,
  ADD COLUMN IF NOT EXISTS graduation_year INT4,
  ADD COLUMN IF NOT EXISTS university_raw TEXT,
  ADD COLUMN IF NOT EXISTS university_normalized TEXT,
  ADD COLUMN IF NOT EXISTS nivel_educacion TEXT,
  ADD COLUMN IF NOT EXISTS gpa NUMERIC(3,2),
  ADD COLUMN IF NOT EXISTS english_level TEXT,
  ADD COLUMN IF NOT EXISTS is_bilingual BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS grupo_etnico TEXT,
  ADD COLUMN IF NOT EXISTS fuente_informacion TEXT,
  ADD COLUMN IF NOT EXISTS medio_interes TEXT,
  ADD COLUMN IF NOT EXISTS referred_by TEXT,
  ADD COLUMN IF NOT EXISTS fecha_nacimiento DATE,
  ADD COLUMN IF NOT EXISTS responsabilidad_familiar TEXT,
  ADD COLUMN IF NOT EXISTS monitor TEXT,
  ADD COLUMN IF NOT EXISTS pago_estudios TEXT,
  ADD COLUMN IF NOT EXISTS ultima_modificacion TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS is_stem BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS stem_clasificacion TEXT,
  ADD COLUMN IF NOT EXISTS uni_top13_qs TEXT,
  ADD COLUMN IF NOT EXISTS uni_prioritaria TEXT,
  ADD COLUMN IF NOT EXISTS tipo_pregrado TEXT,
  ADD COLUMN IF NOT EXISTS enfoque TEXT,
  ADD COLUMN IF NOT EXISTS channel TEXT,
  ADD COLUMN IF NOT EXISTS eligibility TEXT,
  ADD COLUMN IF NOT EXISTS ineligibility_reason TEXT,
  ADD COLUMN IF NOT EXISTS route TEXT,
  ADD COLUMN IF NOT EXISTS edad INT4,
  ADD COLUMN IF NOT EXISTS month TEXT,
  ADD COLUMN IF NOT EXISTS hpc TEXT,
  ADD COLUMN IF NOT EXISTS department TEXT,
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS registration_date DATE,
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- Habilitar RLS
ALTER TABLE public.candidates_convocatoria ENABLE ROW LEVEL SECURITY;

-- Eliminar y re-crear políticas para evitar errores de "Policy already exists"
DROP POLICY IF EXISTS "Permitir lectura publica de candidatos" ON public.candidates_convocatoria;
DROP POLICY IF EXISTS "Permitir insercion/modificacion publica de candidatos" ON public.candidates_convocatoria;

CREATE POLICY "Permitir lectura publica de candidatos" 
  ON public.candidates_convocatoria FOR SELECT 
  USING (true);

CREATE POLICY "Permitir insercion/modificacion publica de candidatos" 
  ON public.candidates_convocatoria FOR ALL 
  USING (true) 
  WITH CHECK (true);


-- 2. TABLA DE ESTRUCTURA DE METAS 2027
CREATE TABLE IF NOT EXISTS public.goals_2027 (
  id TEXT PRIMARY KEY,
  category TEXT,
  metric_name TEXT,
  target2027 NUMERIC,
  current2027 NUMERIC,
  unit TEXT,
  deadline TEXT,
  status TEXT
);

ALTER TABLE public.goals_2027 ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir lectura publica de metas" ON public.goals_2027;
DROP POLICY IF EXISTS "Permitir modificacion publica de metas" ON public.goals_2027;

CREATE POLICY "Permitir lectura publica de metas" 
  ON public.goals_2027 FOR SELECT 
  USING (true);

CREATE POLICY "Permitir modificacion publica de metas" 
  ON public.goals_2027 FOR ALL 
  USING (true) 
  WITH CHECK (true);


-- 3. TABLA DE MAPEADO DE UNIVERSIDADES
CREATE TABLE IF NOT EXISTS public.universities_mapping (
  id TEXT PRIMARY KEY,
  normalized_name TEXT,
  category TEXT,
  region TEXT,
  raw_variants TEXT[] DEFAULT '{}',
  total_candidates INT4 DEFAULT 0,
  eligible_candidates INT4 DEFAULT 0
);

ALTER TABLE public.universities_mapping ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir lectura publica de universidades" ON public.universities_mapping;
DROP POLICY IF EXISTS "Permitir modificacion publica de universidades" ON public.universities_mapping;

CREATE POLICY "Permitir lectura publica de universidades" 
  ON public.universities_mapping FOR SELECT 
  USING (true);

CREATE POLICY "Permitir modificacion publica de universidades" 
  ON public.universities_mapping FOR ALL 
  USING (true) 
  WITH CHECK (true);

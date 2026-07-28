-- ============================================================
-- ESQUEMA DE BASE DE DATOS SUPABASE - EX C LIDERA 2027
-- ============================================================
-- Ejecutar este script en el SQL Editor de Supabase para crear
-- las tablas necesarias y configurar los permisos de lectura/escritura.

-- 1. TABLA DE CANDIDATOS (Convocatoria LIDERA 2027)
CREATE TABLE IF NOT EXISTS public.candidates_convocatoria (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  university_raw TEXT,
  university_normalized TEXT,
  department TEXT,
  city TEXT,
  career TEXT,
  graduation_year INT4,
  gpa NUMERIC(3,2),
  is_bilingual BOOLEAN DEFAULT false,
  english_level TEXT,
  is_stem BOOLEAN DEFAULT false,
  route TEXT,
  channel TEXT,
  eligibility TEXT,
  ineligibility_reason TEXT,
  registration_date DATE,
  month TEXT,
  notes TEXT,
  referred_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Permisos RLS para candidates_convocatoria (Anon Read/Write)
ALTER TABLE public.candidates_convocatoria ENABLE ROW LEVEL SECURITY;

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
  normalized_name TEXT NOT NULL,
  category TEXT,
  region TEXT,
  raw_variants TEXT[] DEFAULT '{}',
  total_candidates INT4 DEFAULT 0,
  eligible_candidates INT4 DEFAULT 0
);

ALTER TABLE public.universities_mapping ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir lectura publica de universidades" 
  ON public.universities_mapping FOR SELECT 
  USING (true);

CREATE POLICY "Permitir modificacion publica de universidades" 
  ON public.universities_mapping FOR ALL 
  USING (true) 
  WITH CHECK (true);

import { Candidate, GoalTarget, UniversityMapping, AuditLogItem, EligibilityStatus, IneligibilityReason, RouteType } from '../types';
import { INITIAL_CANDIDATES, INITIAL_GOAL_TARGETS, INITIAL_UNIVERSITY_MAPPINGS, INITIAL_AUDIT_LOGS } from '../data/mockData';
import { supabase, isSupabaseConfigured } from './supabase';

const STORAGE_KEYS = {
  CANDIDATES: 'exc_lidera_2027_candidates',
  GOALS: 'exc_lidera_2027_goals',
  UNIVERSITIES: 'exc_lidera_2027_universities',
  LOGS: 'exc_lidera_2027_logs'
};

// Map TypeScript Candidate to Supabase Row
function candidateToRow(cand: Candidate) {
  return {
    id: cand.id,
    id_primera_revision: cand.idPrimeraRevision || cand.id,
    fecha_creacion: cand.fechaCreacion || cand.registrationDate,
    full_name: cand.fullName,
    documento_identificacion: cand.documentoIdentificacion || '',
    email: cand.email,
    phone: cand.phone,
    career: cand.career,
    graduation_year: cand.graduationYear,
    university_raw: cand.universityRaw,
    university_normalized: cand.universityNormalized,
    nivel_educacion: cand.nivelEducacion || '',
    gpa: cand.gpa,
    english_level: cand.englishLevel,
    is_bilingual: cand.isBilingual,
    grupo_etnico: cand.grupoEtnico || '',
    fuente_informacion: cand.fuenteInformacion || cand.channel,
    medio_interes: cand.medioInteres || '',
    referred_by: cand.referredBy || cand.personaRecomendo || '',
    fecha_nacimiento: cand.fechaNacimiento || null,
    responsabilidad_familiar: cand.responsabilidadFamiliar || 'No',
    monitor: cand.monitor || 'No',
    pago_estudios: cand.pagoEstudios || '',
    ultima_modificacion: cand.ultimaModificacion || null,

    // Campos Transformados
    is_stem: cand.isStem,
    stem_clasificacion: cand.stemClass || (cand.isStem ? 'STEM Priorizada' : 'NO'),
    uni_top13_qs: cand.universidadTop13QS || 'NO',
    uni_prioritaria: cand.universidadPriorizada || 'NO',
    tipo_pregrado: cand.tipoPregrado || 'Profesional',
    enfoque: cand.enfoque || (cand.isStem && cand.isBilingual ? 'STEM y Bilingüe' : cand.isStem ? 'STEM' : cand.isBilingual ? 'Bilingüe' : 'No STEM no Bilingüe'),
    channel: cand.channel,
    eligibility: cand.eligibility,
    ineligibility_reason: cand.ineligibilityReason,
    route: cand.route,
    edad: typeof cand.edad === 'number' ? cand.edad : null,
    month: cand.month,
    hpc: cand.hpc || 'No',

    // Campos adicionales
    department: cand.department || '',
    city: cand.city || '',
    registration_date: cand.registrationDate,
    notes: cand.notes || ''
  };
}

// Map Supabase Row to Candidate
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToCandidate(row: any): Candidate {
  return {
    id: row.id || row.id_primera_revision || `cand-${Math.random().toString(36).substr(2, 9)}`,
    fullName: row.full_name || row.nombre_completo || 'Candidato/a',
    email: row.email || row.correo_electronico || '',
    phone: row.phone || row.telefono || '',
    universityRaw: row.university_raw || row.universidad_pregrado || '',
    universityNormalized: row.university_normalized || row.universidad_pregrado || '',
    department: row.department || '',
    city: row.city || '',
    career: row.career || row.carrera_pregrado || '',
    graduationYear: Number(row.graduation_year || row.anio_graduacion || 2026),
    gpa: Number(row.gpa || row.promedio_academico || 0),
    isBilingual: row.is_bilingual !== undefined ? Boolean(row.is_bilingual) : ['B2', 'C1', 'C2'].includes(row.english_level || row.nivel_ingles || ''),
    englishLevel: row.english_level || row.nivel_ingles || 'A1',
    isStem: row.is_stem !== undefined ? Boolean(row.is_stem) : String(row.stem_clasificacion || row.stem || '').includes('STEM'),
    route: row.route || row.ruta || 'General / No Priorizado',
    channel: row.channel || row.canal_convocatoria || 'Otros',
    eligibility: row.eligibility || row.cumple_minimos || 'Elegible',
    ineligibilityReason: row.ineligibility_reason || row.motivo_no_cumplimiento || 'Ninguno (Es Elegible)',
    registrationDate: row.registration_date || row.fecha_creacion?.split('T')[0] || new Date().toISOString().split('T')[0],
    month: row.month || row.mes || 'Ene',
    notes: row.notes,
    referredBy: row.referred_by || row.persona_recomendo,

    // Campos Fuente A->U
    idPrimeraRevision: row.id_primera_revision || row.id,
    fechaCreacion: row.fecha_creacion,
    documentoIdentificacion: row.documento_identificacion,
    nivelEducacion: row.nivel_educacion,
    grupoEtnico: row.grupo_etnico,
    fuenteInformacion: row.fuente_informacion,
    medioInteres: row.medio_interes,
    personaRecomendo: row.persona_recomendo,
    fechaNacimiento: row.fecha_nacimiento,
    responsabilidadFamiliar: row.responsabilidad_familiar,
    monitor: row.monitor,
    pagoEstudios: row.pago_estudios,
    ultimaModificacion: row.ultima_modificacion,

    // Campos Transformados V->AG
    stemClass: row.stem_clasificacion || row.stem,
    universidadTop13QS: row.uni_top13_qs,
    universidadPriorizada: row.uni_prioritaria,
    tipoPregrado: row.tipo_pregrado,
    enfoque: row.enfoque,
    canalConvocatoria: row.channel || row.canal_convocatoria,
    cumpleMinimos: row.cumple_minimos || row.eligibility,
    motivoNoCumplimiento: row.motivo_no_cumplimiento || row.ineligibility_reason,
    rutaCalculada: row.route || row.ruta,
    edad: row.edad,
    hpc: row.hpc
  };
}

// Evaluate candidate eligibility based on LIDERA 2027 Rules
export function evaluateEligibility(data: Partial<Candidate>): { eligibility: EligibilityStatus; ineligibilityReason: IneligibilityReason; route: RouteType } {
  const gpa = Number(data.gpa || 0);
  const englishLevel = data.englishLevel || 'A1';
  const isBilingual = ['B2', 'C1', 'C2'].includes(englishLevel);
  const isStem = Boolean(data.isStem);

  if (gpa < 3.5) {
    return {
      eligibility: 'No Elegible',
      ineligibilityReason: 'Promedio Académico (< 3.5)',
      route: isStem ? 'STEM' : (isBilingual ? 'Bilingüe' : 'General / No Priorizado')
    };
  }

  if (!isBilingual && !isStem) {
    return {
      eligibility: 'No Elegible',
      ineligibilityReason: 'Enfoque (No STEM / No Bilingüe B2+)',
      route: 'General / No Priorizado'
    };
  }

  let route: RouteType = 'General / No Priorizado';
  if (isStem) route = 'STEM';
  else if (isBilingual) route = 'Bilingüe';

  return {
    eligibility: 'Elegible',
    ineligibilityReason: 'Ninguno (Es Elegible)',
    route
  };
}

class DataStore {
  private candidates: Candidate[] = [];
  private goals: GoalTarget[] = [];
  private universities: UniversityMapping[] = [];
  private logs: AuditLogItem[] = [];
  private listeners: Array<() => void> = [];
  private isSyncing = false;
  private lastSyncError: string | null = null;

  constructor() {
    this.init();
    if (isSupabaseConfigured) {
      this.loadFromSupabase();
    }
  }

  private init() {
    try {
      const storedCand = localStorage.getItem(STORAGE_KEYS.CANDIDATES);
      this.candidates = storedCand ? JSON.parse(storedCand) : INITIAL_CANDIDATES;

      const storedGoals = localStorage.getItem(STORAGE_KEYS.GOALS);
      if (storedGoals) {
        const parsed = JSON.parse(storedGoals);
        if (Array.isArray(parsed) && parsed.length >= 5) {
          this.goals = parsed;
        } else {
          this.goals = INITIAL_GOAL_TARGETS;
        }
      } else {
        this.goals = INITIAL_GOAL_TARGETS;
      }

      const storedUnis = localStorage.getItem(STORAGE_KEYS.UNIVERSITIES);
      this.universities = storedUnis ? JSON.parse(storedUnis) : INITIAL_UNIVERSITY_MAPPINGS;

      const storedLogs = localStorage.getItem(STORAGE_KEYS.LOGS);
      this.logs = storedLogs ? JSON.parse(storedLogs) : INITIAL_AUDIT_LOGS;
    } catch (e) {
      console.error('Error loading data from localStorage', e);
      this.candidates = INITIAL_CANDIDATES;
      this.goals = INITIAL_GOAL_TARGETS;
      this.universities = INITIAL_UNIVERSITY_MAPPINGS;
      this.logs = INITIAL_AUDIT_LOGS;
    }
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  private save() {
    try {
      localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(this.candidates));
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(this.goals));
      localStorage.setItem(STORAGE_KEYS.UNIVERSITIES, JSON.stringify(this.universities));
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(this.logs));
    } catch (e) {
      console.error('Error saving data to localStorage', e);
    }
    this.notify();
  }

  // --- SUPABASE INTEGRATION METHODS ---
  public getSupabaseStatus() {
    return {
      configured: isSupabaseConfigured,
      syncing: this.isSyncing,
      error: this.lastSyncError
    };
  }

  public async loadFromSupabase(): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;

    this.isSyncing = true;
    this.lastSyncError = null;
    this.notify();

    try {
      // 1. Fetch Candidates
      const { data: candData, error: candError } = await supabase
        .from('candidates_convocatoria')
        .select('*')
        .order('registration_date', { ascending: false });

      if (candError) throw candError;

      if (candData && candData.length > 0) {
        this.candidates = candData.map(rowToCandidate);
      }

      // 2. Fetch Goals
      const { data: goalData, error: goalError } = await supabase
        .from('goals_2027')
        .select('*');

      if (!goalError && goalData && goalData.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.goals = goalData.map((g: any) => ({
          id: g.id,
          category: g.category,
          metricName: g.metric_name,
          target2027: Number(g.target2027),
          current2027: Number(g.current2027),
          unit: g.unit,
          deadline: g.deadline,
          status: g.status
        }));
      }

      this.save();
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn('Could not load data from Supabase, falling back to local data:', message);
      this.lastSyncError = message;
      return false;
    } finally {
      this.isSyncing = false;
      this.notify();
    }
  }

  public async seedToSupabase(): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;

    this.isSyncing = true;
    this.lastSyncError = null;
    this.notify();

    try {
      const candidateRows = this.candidates.map(candidateToRow);
      const { error: candErr } = await supabase
        .from('candidates_convocatoria')
        .upsert(candidateRows, { onConflict: 'id' });

      if (candErr) throw candErr;

      const goalRows = this.goals.map(g => ({
        id: g.id,
        category: g.category,
        metric_name: g.metricName,
        target2027: g.target2027,
        current2027: g.current2027,
        unit: g.unit,
        deadline: g.deadline,
        status: g.status
      }));

      const { error: goalErr } = await supabase
        .from('goals_2027')
        .upsert(goalRows, { onConflict: 'id' });

      if (goalErr) throw goalErr;

      this.addAuditLogInternal(
        'Sincronización Supabase',
        `Se enviaron ${candidateRows.length} registros a la base de datos Supabase.`,
        'create'
      );

      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('Error seeding data to Supabase:', message);
      this.lastSyncError = message;
      return false;
    } finally {
      this.isSyncing = false;
      this.notify();
    }
  }

  // --- CANDIDATES CRUD ---
  public getCandidates(): Candidate[] {
    return [...this.candidates];
  }

  public addCandidate(cand: Omit<Candidate, 'id'>): Candidate {
    const evalRes = evaluateEligibility(cand);
    const newCand: Candidate = {
      ...cand,
      id: `cand-${Date.now()}`,
      eligibility: evalRes.eligibility,
      ineligibilityReason: evalRes.ineligibilityReason,
      route: evalRes.route
    };
    this.candidates.unshift(newCand);

    this.addAuditLogInternal(
      'Creación de Registro',
      `Candidato/a ${newCand.fullName} registrado en el Formulario de Interés (${newCand.eligibility}).`,
      'create'
    );

    this.save();

    if (isSupabaseConfigured && supabase) {
      supabase
        .from('candidates_convocatoria')
        .insert([candidateToRow(newCand)])
        .then(({ error }) => {
          if (error) console.error('Supabase async insert error:', error.message);
        });
    }

    return newCand;
  }

  public updateCandidate(id: string, updates: Partial<Candidate>): Candidate | null {
    const idx = this.candidates.findIndex(c => c.id === id);
    if (idx === -1) return null;

    const current = this.candidates[idx];
    const merged = { ...current, ...updates };
    const evalRes = evaluateEligibility(merged);

    const updatedCand: Candidate = {
      ...merged,
      eligibility: updates.eligibility || evalRes.eligibility,
      ineligibilityReason: updates.ineligibilityReason || evalRes.ineligibilityReason,
      route: updates.route || evalRes.route
    };

    this.candidates[idx] = updatedCand;

    this.addAuditLogInternal(
      'Edición de Candidato',
      `Candidato ${updatedCand.fullName} actualizado. Estado: ${updatedCand.eligibility}.`,
      'update'
    );

    this.save();

    if (isSupabaseConfigured && supabase) {
      supabase
        .from('candidates_convocatoria')
        .upsert(candidateToRow(updatedCand))
        .then(({ error }) => {
          if (error) console.error('Supabase async update error:', error.message);
        });
    }

    return updatedCand;
  }

  public deleteCandidate(id: string) {
    const cand = this.candidates.find(c => c.id === id);
    if (cand) {
      this.candidates = this.candidates.filter(c => c.id !== id);
      this.addAuditLogInternal(
        'Eliminación de Candidato',
        `Se eliminó a ${cand.fullName} del Formulario de Interés.`,
        'update'
      );
      this.save();

      if (isSupabaseConfigured && supabase) {
        supabase
          .from('candidates_convocatoria')
          .delete()
          .eq('id', id)
          .then(({ error }) => {
            if (error) console.error('Supabase async delete error:', error.message);
          });
      }
    }
  }

  public batchUpdateCandidates(ids: string[], action: 'set_eligible' | 'set_not_eligible' | 'flag_hpc') {
    let count = 0;
    this.candidates = this.candidates.map(c => {
      if (ids.includes(c.id)) {
        count++;
        if (action === 'set_eligible') {
          return { ...c, eligibility: 'Elegible', ineligibilityReason: 'Ninguno (Es Elegible)' };
        } else if (action === 'set_not_eligible') {
          return { ...c, eligibility: 'No Elegible' };
        } else if (action === 'flag_hpc') {
          return { ...c, channel: 'Cultivación de HPC' };
        }
      }
      return c;
    });

    this.addAuditLogInternal(
      'Acción Masiva',
      `Se ejecutó acción "${action}" sobre ${count} registros seleccionados.`,
      'bulk_action'
    );

    this.save();

    if (isSupabaseConfigured && supabase) {
      const updatedRows = this.candidates
        .filter(c => ids.includes(c.id))
        .map(candidateToRow);

      supabase
        .from('candidates_convocatoria')
        .upsert(updatedRows)
        .then(({ error }) => {
          if (error) console.error('Supabase async batch update error:', error.message);
        });
    }
  }

  // Goals
  public getGoals(): GoalTarget[] {
    return [...this.goals];
  }

  public updateGoal(id: string, newTarget: number): GoalTarget | null {
    const idx = this.goals.findIndex(g => g.id === id);
    if (idx === -1) return null;

    const g = this.goals[idx];
    g.target2027 = newTarget;
    this.goals[idx] = { ...g };

    this.addAuditLogInternal(
      'Ajuste de Meta',
      `Meta "${g.metricName}" actualizada a ${newTarget} ${g.unit}.`,
      'goal_change'
    );

    this.save();

    if (isSupabaseConfigured && supabase) {
      supabase
        .from('goals_2027')
        .upsert({
          id: g.id,
          category: g.category,
          metric_name: g.metricName,
          target2027: g.target2027,
          current2027: g.current2027,
          unit: g.unit,
          deadline: g.deadline,
          status: g.status
        })
        .then(({ error }) => {
          if (error) console.error('Supabase async goal update error:', error.message);
        });
    }

    return g;
  }

  // Universities
  public getUniversities(): UniversityMapping[] {
    return [...this.universities];
  }

  public addUniversityVariant(uniId: string, variant: string) {
    const idx = this.universities.findIndex(u => u.id === uniId);
    if (idx !== -1) {
      if (!this.universities[idx].rawVariants.includes(variant)) {
        this.universities[idx].rawVariants.push(variant);
        this.addAuditLogInternal(
          'Normalización Universidad',
          `Variante "${variant}" añadida a "${this.universities[idx].normalizedName}".`,
          'update'
        );
        this.save();
      }
    }
  }

  // Logs
  public getAuditLogs(): AuditLogItem[] {
    return [...this.logs];
  }

  private addAuditLogInternal(action: string, details: string, type: AuditLogItem['type']) {
    const now = new Date();
    const timestamp = now.toISOString().replace('T', ' ').substring(0, 19);
    this.logs.unshift({
      id: `log-${Date.now()}`,
      timestamp,
      user: 'Juanda (CSM)',
      action,
      details,
      type
    });
  }

  public resetToDefault() {
    this.candidates = INITIAL_CANDIDATES;
    this.goals = INITIAL_GOAL_TARGETS;
    this.universities = INITIAL_UNIVERSITY_MAPPINGS;
    this.logs = INITIAL_AUDIT_LOGS;
    this.save();
  }
}

export const dataStore = new DataStore();

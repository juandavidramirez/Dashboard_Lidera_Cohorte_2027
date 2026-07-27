import { Candidate, GoalTarget, UniversityMapping, AuditLogItem, EligibilityStatus, IneligibilityReason, RouteType } from '../types';
import { INITIAL_CANDIDATES, INITIAL_GOAL_TARGETS, INITIAL_UNIVERSITY_MAPPINGS, INITIAL_AUDIT_LOGS } from '../data/mockData';

const STORAGE_KEYS = {
  CANDIDATES: 'exc_lidera_2027_candidates',
  GOALS: 'exc_lidera_2027_goals',
  UNIVERSITIES: 'exc_lidera_2027_universities',
  LOGS: 'exc_lidera_2027_logs'
};

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

  constructor() {
    this.init();
  }

  private init() {
    try {
      const storedCand = localStorage.getItem(STORAGE_KEYS.CANDIDATES);
      this.candidates = storedCand ? JSON.parse(storedCand) : INITIAL_CANDIDATES;

      const storedGoals = localStorage.getItem(STORAGE_KEYS.GOALS);
      this.goals = storedGoals ? JSON.parse(storedGoals) : INITIAL_GOAL_TARGETS;

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

  // Candidates
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

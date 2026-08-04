export type EligibilityStatus = 'Elegible' | 'No Elegible' | 'Pendiente';

export type RouteType = 'STEM' | 'Bilingüe' | 'General / No Priorizado';

export type RecruitmentChannel = 
  | 'LIDERA en RRSS' 
  | 'Gira LIDERA' 
  | 'Refiere LIDERA' 
  | 'Cultivación de HPC'
  | 'Otros';

export interface AuditLogItem {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
  type?: 'create' | 'update' | 'sync' | 'export' | 'delete' | string;
}

export type IneligibilityReason = 
  | 'Enfoque (No STEM / No Bilingüe B2+)'
  | 'Promedio Académico (< 3.5)'
  | 'Título / Disciplina No Elegible'
  | 'Año de Graduación'
  | 'Nacionalidad / Cédula'
  | 'Ninguno (Es Elegible)';

export interface Candidate {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  universityRaw: string;
  universityNormalized: string;
  department: string;
  city: string;
  career: string;
  graduationYear: number;
  gpa: number;
  isBilingual: boolean;
  englishLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  isStem: boolean;
  route: RouteType;
  channel: RecruitmentChannel;
  eligibility: EligibilityStatus;
  ineligibilityReason: IneligibilityReason;
  registrationDate: string; // YYYY-MM-DD
  month: string; // 'Ene', 'Feb', etc.
  notes?: string;
  referredBy?: string;

  // Campos Fuente adicionales de Data_Raw_Conv (A->U)
  idPrimeraRevision?: string;
  fechaCreacion?: string;
  documentoIdentificacion?: string;
  nivelEducacion?: string;
  grupoEtnico?: string;
  fuenteInformacion?: string;
  medioInteres?: string;
  personaRecomendo?: string;
  fechaNacimiento?: string;
  responsabilidadFamiliar?: string;
  monitor?: string;
  pagoEstudios?: string;
  ultimaModificacion?: string;

  // Campos Transformados V->AI
  departamentoResidencia?: string;// Col V: Departamento de Residencia
  stemClass?: string;             // Col W: 'STEM Priorizada' | 'STEM No Priorizada' | 'NO'
  universidadTop13QS?: string;   // Col X: 'SI' | 'NO'
  universidadPriorizada?: string;// Col Y: 'SI' | 'NO'
  tipoPregrado?: string;          // Col Z: 'Profesional' | 'Licenciatura' | 'Carrera no plazable' | 'NO'
  enfoque?: string;               // Col AA: 'STEM y Bilingüe' | 'STEM' | 'Bilingüe' | 'No STEM no Bilingüe'
  canalConvocatoria?: string;     // Col AB: 'LIDERA en RRSS' | 'Refiere LIDERA' | 'Gira LIDERA' | 'Otros'
  cumpleMinimos?: string;         // Col AC: 'Cumple mínimos' | 'No cumple mínimos'
  motivoNoCumplimiento?: string;  // Col AD
  rutaCalculada?: string;         // Col AE: 'Ruta Promisorios' | 'Ruta General' | 'N/A'
  edad?: number | string;         // Col AF
  hpc?: string;                   // Col AH: 'Si' | 'No'
  formCompleto?: string;          // Col AI: 'SI' | 'NO'
}

export interface UniversityMapping {
  id: string;
  normalizedName: string;
  category: 'Priorizada' | 'No Priorizada' | 'Internacional';
  region: string;
  rawVariants: string[];
  totalCandidates: number;
  eligibleCandidates: number;
}

export interface MonthlyEligibilityStat {
  month: string;
  year: number;
  eligibleCount: number;
  notEligibleCount: number;
  total: number;
  eligibilityRate: number;
  // Ineligibility breakdown
  ineligibleReasonEnfoque: number;
  ineligibleReasonGpa: number;
  ineligibleReasonOther: number;
}

export interface WeeklyEligibilityStat {
  weekKey: string; // 'Semana 1', 'Semana 2', etc.
  label: string;   // '28 jul – 2 ago'
  dateRange: string;
  eligibleCount: number;
  notEligibleCount: number;
  total: number;
  eligibilityRate: number;
  ineligibleReasonEnfoque: number;
  ineligibleReasonGpa: number;
  ineligibleReasonOther: number;
}

export interface WeeklyChannelMixStat {
  weekKey: string;
  label: string;
  dateRange: string;
  rrss: number;
  gira: number;
  refiere: number;
  otros: number;
  total: number;
  rrssCount?: number;
  giraCount?: number;
  refiereCount?: number;
  otrosCount?: number;
}

export interface YoyMonthlyStat {
  month: string;
  count2026: number;
  count2027: number;
}

export interface ChannelMixMonthlyStat {
  month: string;
  rrss: number;
  gira: number;
  refiere: number;
  total: number;
}

export interface GoalTarget {
  id: string;
  category: string;
  metricName: string;
  target2027: number;
  current2027: number;
  unit: string | '%';
  deadline: string;
  status: 'On Track' | 'At Risk' | 'Achieved';
}

export interface FilterState {
  search: string;
  eligibility: string; // 'ALL' | 'Elegible' | 'No Elegible'
  route: string; // 'ALL' | 'STEM' | 'Bilingüe'
  channel: string; // 'ALL' | specific channel
  department: string; // 'ALL' | specific department
  ineligibilityReason: string; // 'ALL' | specific reason
  dateRange: { start: string; end: string };
}

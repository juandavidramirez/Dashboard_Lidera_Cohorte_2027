export type EligibilityStatus = 'Elegible' | 'No Elegible' | 'Pendiente';

export type RouteType = 'STEM' | 'Bilingüe' | 'General / No Priorizado';

export type RecruitmentChannel = 
  | 'LIDERA en RRSS' 
  | 'Gira LIDERA' 
  | 'Refiere LIDERA' 
  | 'Otros';

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

  // Campos Transformados de Data_Raw_Conv (V->AG)
  stemClass?: string;             // Col V: 'STEM Priorizada' | 'STEM No Priorizada' | 'NO'
  universidadTop13QS?: string;   // Col W: 'SI' | 'NO'
  universidadPriorizada?: string;// Col X: 'SI' | 'NO'
  tipoPregrado?: string;          // Col Y: 'Profesional' | 'Licenciatura' | 'Carrera no plazable' | 'NO'
  enfoque?: string;               // Col Z: 'STEM y Bilingüe' | 'STEM' | 'Bilingüe' | 'No STEM no Bilingüe'
  canalConvocatoria?: string;     // Col AA: 'LIDERA en RRSS' | 'Refiere LIDERA' | 'Gira LIDERA' | 'Otros'
  cumpleMinimos?: string;         // Col AB: 'Cumple mínimos' | 'No cumple mínimos'
  motivoNoCumplimiento?: string;  // Col AC
  rutaCalculada?: string;         // Col AD: 'Ruta Promisorios' | 'Ruta General' | 'N/A'
  edad?: number | string;         // Col AE
  hpc?: string;                   // Col AG: 'Si' | 'No'
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

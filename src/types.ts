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

// ==========================================
// TIPOS PARA PROCESO DE LECTURAS (COHORTE 2027)
// ==========================================

export interface LecturaRecord {
  primera_lectura_id: string;
  id_contacto: string;
  evaluador: string;
  completado: boolean;
  opinion_evaluador?: string | null;
  recomendacion_modelo?: string | null;
  // Campos propios de lecturas_progreso
  genero?: string | null;
  ciudad?: string | null; // Ciudad de nacimiento (Ciudad_de_nacimiento__c)
  // Campos cruzados desde candidates_convocatoria
  uni_prioritaria?: string | null;
  is_bilingual?: boolean | null;
  is_stem?: boolean | null;
  enfoque?: string | null; // 'STEM y Bilingüe' | 'STEM' | 'Bilingüe' | 'No STEM no Bilingüe'
  tipo_pregrado?: string | null; // 'Profesional' | 'Licenciatura' | 'Carrera no plazable'
  edad?: number | string | null;
  eligibility?: string | null;
  full_name?: string | null;
  university_normalized?: string | null;
  career?: string | null;
  form_completo?: string | null;
}

export type EvaluadorStatus = 'On track' | 'Medio' | 'Atrasado';

export interface EvaluadorSummary {
  evaluador: string;
  asignados: number;
  completados: number;
  avancePct: number;
  estado: EvaluadorStatus;
}

export type PerfilFilterType = 
  | 'uni_prioritaria'
  | 'bilingue'
  | 'stem'
  | 'stem_or_bilingue'
  | 'stem_and_bilingue';

export interface CategoryBreakdownItem {
  label: string;
  count: number;
  pct: number;
  isPass: boolean;
}

export interface CityLeaderboardItem {
  rank: number;
  label: string;
  count: number;
  pct: number;
  magnitudePct: number;
  isFoco: boolean;
}

export interface CompositionBreakdownItem {
  key: string;
  label: string;
  count: number;
  pctSobreSeleccionados: number;
  color?: string;
  sublabel?: string;
}

export interface LecturasGeneralKpis {
  completadasCount: number;
  metaGlobal: number;
  avanceGlobalPct: number;
  seleccionadosCount: number;
  totalCumplenMinimos: number;
  tasaExitoPct: number;
  evaluadoresAtrasadosCount: number;
  totalEvaluadores: number;
  modeloPasaPct: number;
  modeloPasaCount: number;
  evaluadorPasaPct: number;
  evaluadorPasaCount: number;
  totalLeidos: number;
}

// ==========================================
// TIPOS PARA PROCESO DE ENTREVISTAS (COHORTE 2027)
// ==========================================

export interface EntrevistaRecord {
  id_dia_entrevista: string;
  id_contacto: string;
  evaluador: string;
  es_staff: boolean;
  completado: boolean;
  fecha_entrevista?: string | null;
  opinion_evaluador?: string | null;
  recomendacion_postulante?: string | null;
  puntaje_academico_universidad?: number | null;
  coeficiente_universidad?: number | null;
  bandera_pregrado?: number | null;
  puntaje_icfes?: number | null;
  puntaje_logros?: number | null;
  disponibilidad_instituto?: string | null;
  preferencia_region?: string | null;
  preferencia_zona?: string | null;
  preferencia_nivel?: string | null;
  capacidad_ensenar_ingles?: string | null;
  created_at?: string | null;
  updated_at?: string | null;

  // Campos cruzados desde candidates_convocatoria
  uni_prioritaria?: string | null;
  is_bilingual?: boolean | null;
  is_stem?: boolean | null;
  enfoque?: string | null; // 'STEM y Bilingüe' | 'STEM' | 'Bilingüe' | 'No STEM no Bilingüe'
  tipo_pregrado?: string | null; // 'Profesional' | 'Licenciatura' | 'Carrera no plazable'
  edad?: number | string | null;
  eligibility?: string | null;
  full_name?: string | null;
  university_normalized?: string | null;
  career?: string | null;
  form_completo?: string | null;

  // Campos cruzados desde lecturas_progreso
  genero?: string | null;
  ciudad?: string | null; // Ciudad de nacimiento
}

export interface EntrevistadorSummary {
  evaluador: string;
  esStaff: boolean;
  asignados: number;
  completados: number;
  avancePct: number;
  estado: EvaluadorStatus;
}

export interface CombinablePerfilFilterState {
  uniPriorizada: boolean;
  bilingue: boolean;
  stem: boolean;
  stemOrBilingue: boolean;
  menores30: boolean;
}

export interface TopCandidatosFilterState {
  menores30: boolean;
  menores30Bilingue: boolean;
  menores30Stem: boolean;
  universidadPriorizada: boolean;
  universidadNoPriorizada: boolean;
}

export interface EntrevistasGeneralKpis {
  completadasCount: number;
  metaGlobal: number;
  totalAsignados: number;
  totalPasaronEntrevista: number;
  avanceGlobalPct: number;
  aceptadosCount: number;
  rechazadosCount: number;
  totalEvaluados: number;
  tasaExitoPct: number;
  evaluadoresAtrasadosCount: number;
  evaluadoresAtrasadosStaffCount: number;
  evaluadoresAtrasadosExternosCount: number;
  totalEvaluadores: number;
  totalStaffEvaluadores: number;
  totalExternosEvaluadores: number;
  topCandidatosCount: number;
  topCandidatosPct: number;
  topCandidatosFilteredCount: number;
  topCandidatosFilteredPct: number;
}

export interface EntrevistasResultadosBreakdown {
  totalEvaluados: number;
  aceptadosCount: number;
  aceptadosPct: number;
  rechazadosCount: number;
  rechazadosPct: number;
  aceptadosCategories: CategoryBreakdownItem[];
  rechazadosCategories: CategoryBreakdownItem[];
}

// ==========================================
// TIPOS PARA DASHBOARD LIDERA LAB (COHORTE 2027)
// ==========================================

export type LabEtapaAlcanzada = 'Aplicó' | 'Lecturas' | 'Entrevista' | 'Lab' | 'Matriculación';

export interface LabRecord {
  // Llaves
  id_dia_entrevista: string;
  id_contacto: string;

  // Agenda & Logística
  fecha_lab: string; // ej. '2026-10-21'
  id_fecha_agenda?: string | null;
  bloque: 'Mañana' | 'Tarde'; // Bloque de jornada
  subgrupo?: string | null; // ej. 'G1-A'
  evaluador_asistencia?: string | null;

  // Asistencia
  asistencia_b1?: number | null;
  asistencia_b2?: number | null;
  asistencia_b3?: number | null;
  formato_clase?: string | null;
  asistio: boolean;
  bloques_asistidos?: number;
  comentarios_asistencia?: string | null;

  // Componentes Clase de 5 minutos
  ser_profe?: number | null;
  im_incluye_intereses?: number | null;
  im_comunicacion_presencia?: number | null;
  im_escucha_responde?: number | null;
  comentarios_ser_profesor?: string | null;

  // Componentes Actividad Grupal
  dinamica_grupo?: number | null;
  im_atencion_ga?: number | null;
  im_empatia_ga?: number | null;
  act_gr_perseverancia?: number | null;
  comentarios_actividad_grupal?: string | null;

  // Componentes Juego de Roles
  im_atencion_jr?: number | null;
  im_empatia_jr?: number | null;
  im_considera_audiencia?: number | null;
  comentarios_juego_roles?: string | null;

  // Componentes Lidera tus Finanzas / HO
  ho_semana_vida_eco?: number | null;
  ho_tarde_dia_entrevista?: string | null; // 'Si' | 'No'
  comentarios_ho?: string | null;

  // Puntajes finales calculados (Salesforce)
  puntaje_5min?: number | null;
  puntaje_actividad_grupal?: number | null;
  puntaje_juego_roles?: number | null;
  puntaje_ajuste?: number | null;
  puntaje_pensamiento_critico?: number | null;
  puntaje_perseverancia?: number | null;
  puntaje_permanencia?: number | null;
  puntaje_construccion_relaciones?: number | null;
  puntaje_competencias_total?: number | null;
  recomendacion_modelo?: string | null;

  // Decisión y Evaluador Lab
  opinion_evaluador_lab?: string | null;
  comentarios_evaluador_lab?: string | null;
  recomendacion_postulante_lab?: string | null;
  evaluacion_completa: 'Si' | 'No';

  // Promedios por sección calculados (Fórmula 4.2)
  promedio_clase_5min?: number | null;
  n_clase_5min?: number | null;
  promedio_actividad_grupal?: number | null;
  n_actividad_grupal?: number | null;
  promedio_juego_roles?: number | null;
  n_juego_roles?: number | null;
  promedio_lidera_finanzas?: number | null;
  n_lidera_finanzas?: number | null;

  // Perfil del candidato cruzado (Candidates / Lecturas / Entrevistas)
  full_name: string;
  university_normalized: string;
  career: string;
  edad?: number | string | null;
  genero?: string | null;
  ciudad?: string | null;
  uni_prioritaria?: string | null;
  is_bilingual?: boolean | null;
  is_stem?: boolean | null;
  enfoque?: string | null;
  tipo_pregrado?: string | null;
  promedio_carrera?: number | string | null;
  nivel_ingles?: string | null;
  preferencia_region?: string | null;
  preferencia_zona?: string | null;
  preferencia_nivel?: string | null;
  disponibilidad_instituto?: string | null;

  // Historial de etapas previas para la Ficha
  opinion_lectura?: string | null;
  recomendacion_modelo_lectura?: string | null;
  observaciones_lectura?: string | null;

  opinion_entrevista?: string | null;
  recomendacion_postulante_entrevista?: string | null;
  comentarios_entrevista?: string | null;
  evaluador_entrevista?: string | null;

  // Comentarios cualitativos detallados de etapas previas (almacenados en lab_progreso)
  comentario_logros?: string | null;
  comentario_perseverancia?: string | null;
  comentario_compromiso?: string | null;
  comentario_relaciones?: string | null;
  comentario_ajuste?: string | null;
  comentario_ingles?: string | null;

  // Puntajes académicos previos de entrevista
  puntaje_academico_universidad?: number | null;
  coeficiente_universidad?: number | null;
  bandera_pregrado?: number | null;
  puntaje_icfes?: number | null;
  puntaje_logros?: number | null;

  // Etapa alcanzada y fechas del proceso
  etapa_alcanzada: LabEtapaAlcanzada;
  fecha_postulacion?: string | null;
  fecha_lectura?: string | null;
  fecha_entrevista?: string | null;

  created_at?: string | null;
  updated_at?: string | null;
}

export interface LabGeneralKpis {
  totalAceptadosEntrevista: number; // Universo Lab
  totalAgendados: number;
  evaluadosCompletosCount: number;
  avanceLabPct: number;
  asistieronCount: number;
  noAsistieronCount: number;
  asistenciaPct: number;
  aceptadosLabCount: number;
  rechazadosLabCount: number;
  tasaPasoPct: number; // Sobre evaluados completos
  matriculacionCount: number;
  matriculacionPct: number; // Sobre cupos o universo
  metaCupos: number;
  metaAceptadosLab: number;
}

export interface LabEmbudoMetrics {
  aplicaron: number;
  elegibles: number;
  pasaronLecturas: number;
  aceptadosEntrevista: number;
  agendadosLab: number;
  asistieronLab: number;
  evaluacionCompletaLab: number;
  pasanMatriculacion: number;
}

export interface LabDiaAvanceItem {
  fecha: string;
  diaLabel: string;
  agendados: number;
  asistieron: number;
  evaluados: number;
}

export interface LabCompetenciaMetric {
  key: string;
  nombre: string;
  descripcion?: string;
  promedioTotal: number;
  medianaTotal: number;
  minTotal: number;
  maxTotal: number;
  promedioAceptados: number;
  promedioRechazados: number;
  diferencia: number;
  distribucion: Array<{ rango: string; count: number; pct: number }>;
}

export interface LabMatrizConcordancia {
  matriz: Array<{
    modelo: string;
    evaluador: string;
    count: number;
  }>;
  totalComparables: number;
  acuerdosCount: number;
  acuerdoPct: number;
  modeloDist: Array<{ label: string; count: number; pct: number }>;
  evaluadorDist: Array<{ label: string; count: number; pct: number }>;
}

export interface LabCambioDecision {
  totalComparados: number;
  mantieneAceptado: number;
  mantieneRechazado: number;
  aceptadoARechazado: number;
  rechazadoAAceptado: number;
  cambiosTotales: number;
  cambioPct: number;
}


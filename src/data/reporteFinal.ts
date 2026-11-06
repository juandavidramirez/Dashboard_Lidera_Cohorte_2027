// ============================================================================
// DATOS OFICIALES PARA EL REPORTE GENERAL DE LA CONVOCATORIA LIDERA 2027
// Archivo: src/data/reporteFinal.ts
// Fecha de corte oficial: 4 de noviembre de 2026 (embudo hasta comité) y
//                        6 de noviembre de 2026 (cohorte seleccionada y matrícula)
// Elaborado por: Juan David Ramírez
// Fuente: Convocatoria, Selección y Matrícula (CSM), Enseña por Colombia
// ============================================================================

export interface ReporteMetadata {
  proceso: string;
  fechaCorte: string;
  elaboradoPor: string;
  alcanceAdvertencia: string;
}

export const REPORTE_METADATA: ReporteMetadata = {
  proceso: 'Convocatoria, Selección y Matrícula (CSM), Enseña por Colombia',
  fechaCorte:
    '4 de noviembre de 2026 (embudo hasta comité) y 6 de noviembre de 2026 (cohorte seleccionada y matrícula)',
  elaboradoPor: 'Juan David Ramírez',
  alcanceAdvertencia:
    'Este reporte cubre el proceso completo, desde la convocatoria hasta la matrícula. "Pasa a comité" son las personas que el LIDERA Lab recomienda llevar a comité de selección. "Seleccionado" son las personas que el comité eligió para la cohorte y fueron invitadas a matricularse (pestaña Cohorte 2027 de Candidatos, consolidada en la base de Matriculados). La cifra de seleccionados todavía puede cambiar: era 63 el 5 de noviembre y es 61 el 6 de noviembre.'
};

// ============================================================================
// SECCIÓN 1: RESUMEN EJECUTIVO
// ============================================================================
export interface KpiResumen {
  label: string;
  valor: number;
  meta: number;
  unidad?: string;
  cumplimientoPct: number;
  esMetaIncumplida?: boolean;
  esPreliminar?: boolean;
  notaTooltip?: string;
  detalle: string;
  estado: 'Cumplida' | 'No cumplida' | 'Informativo';
}

export const KPIS_RESUMEN_EJECUTIVO: KpiResumen[] = [
  {
    label: 'Postulantes',
    valor: 1641,
    meta: 1500,
    cumplimientoPct: 109.4,
    detalle: 'Meta 1.500 (109%)',
    estado: 'Cumplida'
  },
  {
    label: 'Elegibles',
    valor: 1138,
    meta: 978,
    cumplimientoPct: 116.4,
    detalle: 'Meta 978 (116%)',
    estado: 'Cumplida'
  },
  {
    label: 'Elegibles Top 7',
    valor: 216,
    meta: 300,
    cumplimientoPct: 72.0,
    esMetaIncumplida: true,
    detalle: 'Meta 300 (72%)',
    estado: 'No cumplida'
  },
  {
    label: 'En comité',
    valor: 130,
    meta: 80,
    cumplimientoPct: 162.5,
    esPreliminar: true,
    notaTooltip: 'Incluye 21 pre-evaluados de julio, pendiente de confirmación final.',
    detalle: '80 cupos (163%)',
    estado: 'Cumplida'
  },
  {
    label: 'Seleccionados',
    valor: 61,
    meta: 80,
    cumplimientoPct: 76.3,
    esMetaIncumplida: true,
    detalle: '80 cupos (76%)',
    estado: 'No cumplida'
  },
  {
    label: 'Conversión total',
    valor: 3.7,
    meta: 5.3,
    unidad: '%',
    cumplimientoPct: 69.8,
    detalle: '61 de 1.641 postulantes',
    estado: 'Informativo'
  }
];

export const METAS_RESUMEN_EJECUTIVO_PARRAFO =
  'Metas: se cumplieron 3 de 5. Postulantes, elegibles y personas en comité superaron su meta. No se cumplieron la meta de elegibles de universidades priorizadas (72%) ni la de cupos de la cohorte (61 seleccionados para 80 cupos, 76%). El detalle está en la sección 4.1.';

export const CONCLUSIONES_PRINCIPALES = [
  {
    numero: 1,
    titulo: 'La cohorte no llena los cupos',
    descripcion:
      '130 personas llegaron a comité y 61 quedaron seleccionadas, menos de la mitad. Con 80 cupos, faltan 19. El cuello de botella final no es de volumen.'
  },
  {
    numero: 2,
    titulo: 'Las metas de volumen se superaron, pero la meta de calidad estratégica no',
    descripcion:
      'Hubo 26,6% más elegibles que en 2025 (1.138 frente a 899), pero los elegibles de universidades priorizadas quedaron en 72% de la meta (216 de 300).'
  },
  {
    numero: 3,
    titulo: 'Referidos y gira convierten el doble que redes sociales',
    descripcion:
      'Redes sociales aporta el 79% de los elegibles, pero solo 9,0% de ellos llega a comité. Referidos (20,3%) y gira (19,0%) duplican esa tasa con mucho menos volumen.'
  },
  {
    numero: 4,
    titulo: 'La universidad priorizada pesa más a cada paso',
    descripcion:
      'Duplica la probabilidad de llegar a comité (19,9% frente a 9,3%) y en comité vuelve a pesar: es el 33% de quienes llegan y el 46% de la cohorte seleccionada.'
  },
  {
    numero: 5,
    titulo: 'La edad es el filtro más fuerte del proceso',
    descripcion:
      'El 43% de los elegibles tiene 30 años o más; en comité son el 18% y en la cohorte seleccionada el 13%.'
  },
  {
    numero: 6,
    titulo: 'La brecha de equidad se cierra en cero',
    descripcion:
      'Las personas afrodescendientes e indígenas llegan a comité a la mitad de la tasa del resto, y ninguna de las 9 que llegaron quedó seleccionada.'
  }
];

// ============================================================================
// SECCIÓN 2: DEFINICIONES Y ALCANCE
// ============================================================================
export const TEXTO_FUENTES_SECCION_2 =
  'Fuentes: formulario de convocatoria en Salesforce (procesado en Data_Raw_Conv), Master de Lecturas, Master de Entrevistas, Master de LIDERA Lab, la base consolidada de Matriculados (BD MATRÍCULADOS P2026-C2027) y el dashboard de BI. Las cifras de este reporte son las cifras oficiales, conciliadas entre las distintas fuentes.';

export const DEFINICIONES_GLOSARIO = [
  {
    termino: 'Pre-registro',
    definicion: 'Persona que llenó el formulario de interés (2.022). No es postulante.'
  },
  {
    termino: 'Postulante',
    definicion: 'Persona con el formulario de convocatoria completo (1.641).'
  },
  {
    termino: 'Elegible',
    definicion:
      'Postulante que cumple mínimos: año de grado válido, promedio ≥ 3,5, perfil STEM o bilingüe, carrera aceptada y documento no duplicado.'
  },
  {
    termino: 'HPC',
    definicion:
      'Elegible con responsabilidad familiar, pago de estudios propio o experiencia como monitor.'
  },
  {
    termino: 'Ruta Promisorios',
    definicion: 'Elegible de una de las 7 universidades priorizadas.'
  },
  {
    termino: 'Pre-evaluado',
    definicion:
      'Candidato evaluado con la rúbrica del Lab en julio, antes de las jornadas de octubre (21 personas).'
  },
  {
    termino: 'Pasa a comité',
    definicion:
      'Aceptado en LIDERA Lab con evaluación completa, o pre-evaluado aceptado (130 personas).'
  },
  {
    termino: 'Seleccionado',
    definicion:
      'Persona elegida por el comité para la cohorte e invitada a matricularse (61).'
  },
  {
    termino: 'Matriculado',
    definicion:
      'Seleccionado con la matrícula confirmada en Candidatos (60).'
  }
];

export const LIMITACIONES_REPORTE = [
  'La cifra de comité (130) es preliminar hasta que Tatiana confirme que los 21 pre-evaluados cuentan.',
  'El perfil de comité de las secciones 9 y 10 se calcula sobre 129 de las 130 personas (una no tiene marcada la evaluación completa en el Master).',
  'Los pre-evaluados se postularon en julio, así que inflan la conversión de ese mes (ver 4.2).',
  'La cifra de seleccionados (61) puede cambiar mientras Tatiana ajusta la cohorte, y falta confirmar qué significa exactamente "matriculado" (hay una persona invitada sin la marca).',
  'La comparación comité frente a seleccionados (sección 8) cruza dos bases distintas: el perfil de comité sale de los Master de las etapas y el de seleccionados de la base de Matriculados, cruzada con Convocatoria por cédula (cruzan las 61).'
];

// ============================================================================
// SECCIÓN 3: EMBUDO COMPLETO (9 ETAPAS PROPORCIONALES)
// ============================================================================
export interface EtapaEmbudoReporte {
  etapa: string;
  personas: number;
  pasoEtapaAnteriorPct: number | null;
  acumuladoPostulantesPct: number | null;
  anchoProporcionalPct: number;
}

export const EMBUDO_COMPLETO_DATOS: EtapaEmbudoReporte[] = [
  {
    etapa: 'Postulantes',
    personas: 1641,
    pasoEtapaAnteriorPct: null,
    acumuladoPostulantesPct: 100.0,
    anchoProporcionalPct: 100.0
  },
  {
    etapa: 'Elegibles',
    personas: 1138,
    pasoEtapaAnteriorPct: 69.3,
    acumuladoPostulantesPct: 69.3,
    anchoProporcionalPct: 69.3
  },
  {
    etapa: 'Pasan Lecturas',
    personas: 678,
    pasoEtapaAnteriorPct: 59.6,
    acumuladoPostulantesPct: 41.3,
    anchoProporcionalPct: 41.3
  },
  {
    etapa: 'Aceptados en Entrevista',
    personas: 231,
    pasoEtapaAnteriorPct: 34.1,
    acumuladoPostulantesPct: 14.1,
    anchoProporcionalPct: 14.1
  },
  {
    etapa: 'Citados al Lab',
    personas: 196,
    pasoEtapaAnteriorPct: 84.8,
    acumuladoPostulantesPct: 11.9,
    anchoProporcionalPct: 11.9
  },
  {
    etapa: 'Asistieron al Lab',
    personas: 171,
    pasoEtapaAnteriorPct: 87.2,
    acumuladoPostulantesPct: 10.4,
    anchoProporcionalPct: 10.4
  },
  {
    etapa: 'Pasan a comité',
    personas: 130,
    pasoEtapaAnteriorPct: 76.9, // 76.9% de los evaluados
    acumuladoPostulantesPct: 7.9,
    anchoProporcionalPct: 7.9
  },
  {
    etapa: 'Seleccionados (invitados a matricularse)',
    personas: 61,
    pasoEtapaAnteriorPct: 46.9,
    acumuladoPostulantesPct: 3.7,
    anchoProporcionalPct: 5.5 // ancho mínimo proporcional estricto menor que el anterior (7.9% > 5.5%)
  },
  {
    etapa: 'Matriculados',
    personas: 60,
    pasoEtapaAnteriorPct: 98.4,
    acumuladoPostulantesPct: 3.7,
    anchoProporcionalPct: 4.8 // estrictamente menor que el anterior (5.5% > 4.8%)
  }
];

export const PRE_REGISTROS_INTERES_VALOR = 2022;

export const TARJETAS_INSIGHTS_EMBUDO_ORDENADAS = [
  {
    etiqueta: 'Filtro de volumen',
    cifra: '59,6%',
    titulo: 'Lecturas: filtro de volumen, pasa el 60% de los elegibles',
    descripcion:
      'Avanzaron 678 de los 1.138 elegibles. Funciona como el primer colador masivo antes de las etapas de evaluación presenciales y sincrónicas.'
  },
  {
    etiqueta: 'Filtro más exigente',
    cifra: '34,1%',
    titulo: 'Entrevista: el filtro más exigente, pasa 1 de cada 3',
    descripcion:
      'Solo 1 de cada 3 personas pasa (231 aceptados de 678 evaluados). Es la etapa decisiva donde más se define el perfil de la cohorte.'
  },
  {
    etiqueta: 'Pérdida evitable',
    cifra: '60 pers.',
    titulo: 'Entre Entrevista y el Lab se pierden 60 personas aceptadas',
    descripcion:
      '32 nunca fueron citadas a una jornada, 26 no asistieron y 3 no pasaron al Master del Lab. Es la fuga más evitable del proceso porque ya estaban aceptadas.'
  },
  {
    etiqueta: 'Segundo filtro más exigente',
    cifra: '61 / 80',
    titulo: 'Comité: el segundo filtro más exigente, quedan 61 para 80 cupos',
    descripcion:
      'El comité eligió a menos de la mitad (46,9% de quienes llegaron: 61 de 130), dejando la cohorte en 76% de los cupos.'
  }
];

export const LECTURA_EMBUDO_PUNTOS_ORDENADOS = [
  {
    titulo: 'Lecturas filtra 4 de cada 10 elegibles.',
    detalle: 'Es un filtro de volumen (pasan 678 de 1.138, 59,6% de paso).'
  },
  {
    titulo: 'Entrevista es el filtro más exigente:',
    detalle: 'solo 1 de cada 3 personas pasa (34,1%). Es donde más se define el perfil final.'
  },
  {
    titulo: 'Entre Entrevista y el Lab se pierden 60 personas sin evaluar:',
    detalle:
      '32 nunca fueron citadas a una jornada, 26 no asistieron y 3 no pasaron al Master del Lab. Es la fuga más evitable del proceso, porque son personas que ya habían sido aceptadas.'
  },
  {
    titulo: 'El Lab confirma más de lo que filtra:',
    detalle: '3 de cada 4 evaluados pasan a comité (76,9% de paso).'
  },
  {
    titulo: 'El comité es el segundo filtro más exigente:',
    detalle:
      'elige a menos de la mitad (46,9%), y deja la cohorte en 61 personas para 80 cupos.'
  },
  {
    titulo: 'Quien es seleccionado se matricula:',
    detalle: '60 de 61 tienen la matrícula confirmada (98,4% de paso).'
  }
];

// ============================================================================
// SECCIÓN 4: CONVOCATORIA (VOLUMEN Y CALIDAD)
// ============================================================================
export interface MetaConvocatoria {
  meta: string;
  resultado: number;
  metaValor: string;
  avancePct: number;
  estado: 'Cumplida' | 'No cumplida';
}

export const TABLA_METAS_CONVOCATORIA: MetaConvocatoria[] = [
  {
    meta: 'Postulantes',
    resultado: 1641,
    metaValor: '1.500',
    avancePct: 109,
    estado: 'Cumplida'
  },
  {
    meta: 'Elegibles',
    resultado: 1138,
    metaValor: '978',
    avancePct: 116,
    estado: 'Cumplida'
  },
  {
    meta: 'Elegibles de universidades priorizadas (Top 7)',
    resultado: 216,
    metaValor: '300',
    avancePct: 72,
    estado: 'No cumplida'
  },
  {
    meta: 'Personas en comité',
    resultado: 130,
    metaValor: '80 cupos',
    avancePct: 163,
    estado: 'Cumplida'
  },
  {
    meta: 'Cohorte seleccionada',
    resultado: 61,
    metaValor: '80 cupos',
    avancePct: 76,
    estado: 'No cumplida'
  }
];

export const PUNTOS_ANALISIS_METAS = [
  'Se cumplieron 3 de las 5 metas. Las tres de volumen (postulantes, elegibles y comité) se superaron con holgura. Las dos que no se cumplieron son las que miden calidad y cierre: elegibles de universidades priorizadas y cupos de la cohorte.',
  '1.138 elegibles, 26,6% más que en 2025 (899). La tasa de elegibilidad subió de 66,2% a 69,3%: además de más volumen, entró una proporción algo mayor de perfiles que cumplen.',
  'La meta Top 7 se quedó en 72% (216 de 300), aunque el grupo creció 53% frente a 2025.',
  'La meta de cupos no se cumplió aunque comité tuvo 1,6 personas por cupo: el comité seleccionó a 61 de 130 (ver sección 8).'
];

export const COMPARATIVO_2025_2026 = [
  { concepto: 'Elegibles', '2025': 899, '2026': 1138, incrementoPct: 26.6 },
  { concepto: 'Tasa Elegibilidad (%)', '2025': 66.2, '2026': 69.3, incrementoPct: 4.7 }
];

export const DINAMICA_SEMANAL = [
  { semana: 'Sem 0 (<28 jul)', postulantes: 34, tasaElegibilidad: 100.0, esPico: false },
  { semana: 'Sem 1 (28 jul - 3 ago)', postulantes: 394, tasaElegibilidad: 66.0, esPico: false },
  { semana: 'Sem 2 (4 - 10 ago)', postulantes: 121, tasaElegibilidad: 68.6, esPico: false },
  { semana: 'Sem 3 (11 - 17 ago)', postulantes: 70, tasaElegibilidad: 78.6, esPico: false },
  { semana: 'Sem 4 (18 - 24 ago)', postulantes: 233, tasaElegibilidad: 73.8, esPico: false },
  { semana: 'Sem 5 (25 - 31 ago)', postulantes: 179, tasaElegibilidad: 72.1, esPico: false },
  { semana: 'Sem 6 (1 - 7 sep)', postulantes: 146, tasaElegibilidad: 77.4, esPico: false },
  { semana: 'Sem 7 (8 - 13 sep)*', postulantes: 464, tasaElegibilidad: 62.9, esPico: true }
];

export const MOTIVOS_NO_CUMPLIMIENTO = [
  { motivo: 'Enfoque (ni STEM ni bilingüe)', personas: 366, pct: 72.8 },
  { motivo: 'Enfoque y carrera no aceptada', personas: 52, pct: 10.3 },
  { motivo: 'Carrera no aceptada', personas: 31, pct: 6.2 },
  { motivo: 'Enfoque y nivel (normalista/técnico)', personas: 20, pct: 4.0 },
  { motivo: 'Promedio académico (< 3.5)', personas: 15, pct: 3.0 },
  { motivo: 'Nivel (normalista/técnico)', personas: 14, pct: 2.8 },
  { motivo: 'Otros combinados', personas: 4, pct: 0.8 }
];

// ============================================================================
// SECCIÓN 5: LECTURAS
// ============================================================================
export const COMPARATIVO_LECTURAS_MODELO_EVALUADOR = {
  total: 1140,
  modelo: [
    { label: 'Pasar', count: 560, pct: 49.1, color: '#2E9E82' },
    { label: 'Factor Ñ', count: 323, pct: 28.3, color: '#F2A900' },
    { label: 'Comité', count: 126, pct: 11.1, color: '#3B82F6' },
    { label: 'Rechazar', count: 131, pct: 11.5, color: '#94A3B8' }
  ],
  evaluador: [
    { label: 'Pasa a Entrevista', count: 678, pct: 59.5, color: '#2E9E82' },
    { label: 'No pasa', count: 422, pct: 37.0, color: '#94A3B8' },
    { label: 'Descalificado por plagio', count: 40, pct: 3.5, color: '#F43F5E' }
  ]
};

// ============================================================================
// SECCIÓN 6: ENTREVISTAS
// ============================================================================
export const RESULTADOS_ENTREVISTA = {
  totalEvaluados: 675,
  aceptadosCount: 231,
  tasaPasoPct: 34.1,
  desglose: [
    { label: 'De acuerdo', count: 95, grupo: 'Aceptados', color: '#2E9E82' },
    { label: 'Creo que debería pasar', count: 70, grupo: 'Aceptados', color: '#14B8A6' },
    { label: 'Tiene el factor "Ñ"', count: 67, grupo: 'Aceptados', color: '#F2A900' },
    { label: 'Firmemente de acuerdo', count: 309, grupo: 'Rechazados', color: '#64748B' },
    { label: 'Podría ser Eco en el futuro', count: 134, grupo: 'Rechazados', color: '#94A3B8' }
  ]
};

// ============================================================================
// SECCIÓN 7: LIDERA LAB
// ============================================================================
export const METRICAS_LAB_RESUMEN = {
  citados: 196,
  asistieron: 171,
  asistenciaPct: 87.2,
  noAsistieron: 26,
  nuncaCitados: 32,
  evaluacionCompleta: 169,
  pasanComite: 130,
  tasaPasoEvaluadosPct: 76.9,
  rechazadosLab: 40,
  rechazadosEcoFuturo: 30,
  preEvaluadosJulio: 21
};

// ============================================================================
// SECCIÓN 8: COMITÉ Y MATRÍCULA
// ============================================================================
export interface FilaSeleccionComite {
  dimension: string;
  grupo: string;
  enComite: number;
  seleccionados: number;
  tasaSeleccionPct: number;
  esAlerta?: boolean;
}

export const TASA_PROMEDIO_SELECCION_COMITE = 47; // 47% promedio

export const TASAS_SELECCION_COMITE_GRUPOS: FilaSeleccionComite[] = [
  // Universidad
  {
    dimension: 'Universidad',
    grupo: 'Universidad priorizada (Top 7)',
    enComite: 43,
    seleccionados: 28,
    tasaSeleccionPct: 65
  },
  {
    dimension: 'Universidad',
    grupo: 'No priorizada',
    enComite: 86,
    seleccionados: 33,
    tasaSeleccionPct: 38
  },
  // Enfoque
  {
    dimension: 'Enfoque',
    grupo: 'Bilingüe',
    enComite: 60,
    seleccionados: 41,
    tasaSeleccionPct: 68
  },
  {
    dimension: 'Enfoque',
    grupo: 'STEM y bilingüe',
    enComite: 22,
    seleccionados: 11,
    tasaSeleccionPct: 50
  },
  {
    dimension: 'Enfoque',
    grupo: 'STEM',
    enComite: 47,
    seleccionados: 9,
    tasaSeleccionPct: 19,
    esAlerta: true
  },
  // Edad
  {
    dimension: 'Edad',
    grupo: '23 años o menos',
    enComite: 22,
    seleccionados: 11,
    tasaSeleccionPct: 50
  },
  {
    dimension: 'Edad',
    grupo: '24 a 26',
    enComite: 49,
    seleccionados: 28,
    tasaSeleccionPct: 57
  },
  {
    dimension: 'Edad',
    grupo: '27 a 29',
    enComite: 35,
    seleccionados: 14,
    tasaSeleccionPct: 40
  },
  {
    dimension: 'Edad',
    grupo: '30 o más',
    enComite: 23,
    seleccionados: 8,
    tasaSeleccionPct: 35
  },
  // Territorio
  {
    dimension: 'Territorio',
    grupo: 'Cundinamarca',
    enComite: 53,
    seleccionados: 34,
    tasaSeleccionPct: 64
  },
  {
    dimension: 'Territorio',
    grupo: 'Nariño',
    enComite: 15,
    seleccionados: 2,
    tasaSeleccionPct: 13,
    esAlerta: true
  },
  // Grupo Étnico
  {
    dimension: 'Grupo étnico',
    grupo: 'Afrodescendientes e indígenas',
    enComite: 9,
    seleccionados: 0,
    tasaSeleccionPct: 0,
    esAlerta: true
  }
];

export const INSIGHTS_SELECCION_COMITE = [
  'STEM es lo que más se pierde en comité: 47 personas STEM llegaron y 9 quedaron (19%). STEM era el grupo más grande de elegibles (45%) y es el 15% de la cohorte. Si el programa necesita docentes STEM, esta es la decisión que más lo explica.',
  'El bilingüe y la universidad priorizada se refuerzan en comité: dos de cada tres llegan a la cohorte.',
  'Nariño, el departamento que mejor convertía hasta comité, casi desaparece: 15 personas en comité, 2 seleccionadas. Cundinamarca pasa del 41% del comité al 56% de la cohorte.',
  'Ninguna de las 9 personas afrodescendientes o indígenas que llegaron a comité fue seleccionada. Los números son pequeños, pero con la brecha que ya existía en Entrevista y en el Lab, el resultado es una cohorte sin ninguna persona de esos grupos.',
  'El canal ya no diferencia: redes, referidos y gira se seleccionan en proporciones parecidas (47%, 47% y 50%). Lo que gana referidos y gira ocurre antes de comité.'
];

export interface IndicadorMatricula {
  indicador: string;
  valor: string;
  detalle: string;
  esAlerta?: boolean;
}

export const INDICADORES_MATRICULA: IndicadorMatricula[] = [
  {
    indicador: 'Respondieron el formulario de matriculación',
    valor: '60 de 61',
    detalle: '98,4% de respuesta'
  },
  {
    indicador: 'Entregaron documentos (PDF en la carpeta)',
    valor: '55 de 61',
    detalle: '6 personas pendientes'
  },
  {
    indicador: 'Confirman disponibilidad para el instituto presencial en Cali',
    valor: '60 de 60',
    detalle: '100% confirmados'
  },
  {
    indicador: 'Aceptan vivir en la región que se les asigne',
    valor: '60 de 60',
    detalle: '100% de aceptación'
  },
  {
    indicador: 'Están a la espera de nombramiento en el concurso docente',
    valor: '9 (15%)',
    detalle: 'Riesgo concreto de deserción',
    esAlerta: true
  },
  {
    indicador: 'Abiertos a cualquier región (entrevista)',
    valor: '45 (74%)',
    detalle: 'Flexibilidad territorial'
  },
  {
    indicador: 'Pueden enseñar inglés (entrevista)',
    valor: '51 (84%)',
    detalle: 'Aptitud bilingüe declarada'
  }
];

export const INSIGHTS_MATRICULA = [
  'El compromiso declarado es alto: todas las personas que respondieron confirman el instituto y aceptan la región asignada.',
  'El riesgo de deserción más concreto son las 9 personas que esperan un nombramiento docente. Si les sale la plaza durante el programa, pueden irse. Vale la pena seguirlas desde ya.',
  '6 personas no han entregado documentos y 1 no ha respondido el formulario.'
];

// ============================================================================
// SECCIÓN 9: CÓMO CAMBIA EL PERFIL
// ============================================================================
export const TASA_PROMEDIO_REFERENCIA_COMITE = 11.3;

export interface FilaPerfilDimension {
  categoria: string;
  elegibles: number;
  pasanLecturas?: number;
  aceptadosEntrevista?: number;
  comite: number;
  conversionPct: number;
  muestraPequena?: boolean;
}

export interface DimensionPerfil {
  id: string;
  titulo: string;
  descripcion: string;
  datos: FilaPerfilDimension[];
  insights: string[];
}

export const DIMENSIONES_CAMBIO_PERFIL: DimensionPerfil[] = [
  {
    id: 'canal',
    titulo: 'Canal de atracción',
    descripcion:
      'Comparativa de eficiencia entre los tres canales oficiales de reclutamiento.',
    datos: [
      {
        categoria: 'Redes sociales LIDERA',
        elegibles: 896,
        pasanLecturas: 508,
        aceptadosEntrevista: 161,
        comite: 81,
        conversionPct: 9.0
      },
      {
        categoria: 'Referidos',
        elegibles: 158,
        pasanLecturas: 111,
        aceptadosEntrevista: 43,
        comite: 32,
        conversionPct: 20.3
      },
      {
        categoria: 'Gira LIDERA',
        elegibles: 84,
        pasanLecturas: 59,
        aceptadosEntrevista: 27,
        comite: 16,
        conversionPct: 19.0
      }
    ],
    insights: [
      'Referidos y gira convierten más del doble que redes sociales (20,3% y 19,0% vs 9,0%).',
      'Redes sociales aporta el 79% de los elegibles, pero solo 9,0% de ellos llega a comité.',
      'Referidos es el 14% de los elegibles y el 25% del comité.'
    ]
  },
  {
    id: 'universidad',
    titulo: 'Universidad y ruta',
    descripcion:
      'Impacto de pertenecer a las 7 Universidades Priorizadas o al Top 13 QS.',
    datos: [
      {
        categoria: 'Universidad priorizada (Top 7)',
        elegibles: 216,
        comite: 43,
        conversionPct: 19.9
      },
      {
        categoria: 'No priorizada',
        elegibles: 922,
        comite: 86,
        conversionPct: 9.3
      },
      {
        categoria: 'Universidad Top 13 QS',
        elegibles: 275,
        comite: 49,
        conversionPct: 17.8
      },
      {
        categoria: 'No Top 13',
        elegibles: 863,
        comite: 80,
        conversionPct: 9.3
      },
      {
        categoria: 'Ruta Promisorios',
        elegibles: 363,
        comite: 60,
        conversionPct: 16.5
      },
      {
        categoria: 'Ruta General',
        elegibles: 775,
        comite: 69,
        conversionPct: 8.9
      }
    ],
    insights: [
      'Ser de una universidad priorizada duplica la probabilidad de llegar a comité (19,9% frente a 9,3%).',
      'El 19% de los elegibles es Top 7, pero en comité ascienden al 33% del total.',
      'Esto refuerza que la meta Top 7 (no cumplida) es la que más impacto tiene en la calidad final.'
    ]
  },
  {
    id: 'enfoque',
    titulo: 'Enfoque e inglés',
    descripcion:
      'Rendimiento según el enfoque formativo (Bilingüe vs STEM) y nivel de suficiencia en inglés.',
    datos: [
      {
        categoria: 'Bilingüe',
        elegibles: 420,
        comite: 60,
        conversionPct: 14.3
      },
      {
        categoria: 'STEM y bilingüe',
        elegibles: 201,
        comite: 22,
        conversionPct: 10.9
      },
      {
        categoria: 'STEM',
        elegibles: 517,
        comite: 47,
        conversionPct: 9.1
      }
    ],
    insights: [
      'El perfil bilingüe es el que mejor convierte, por encima incluso de STEM y bilingüe.',
      'Entre los STEM, el inglés bajo frena: A1 convierte 2,4% y A2 5,6%, frente a 12% a 15% en B1 a C1.',
      'STEM es el grupo más grande de elegibles (45%) y el que menos convierte. Si la necesidad de cupos es STEM, el cuello de botella está en el proceso de selección, no en la atracción.'
    ]
  },
  {
    id: 'edad',
    titulo: 'Edad',
    descripcion: 'Evolución del embudo desagregada por tramos de edad.',
    datos: [
      {
        categoria: '23 o menos',
        elegibles: 102,
        pasanLecturas: 77,
        aceptadosEntrevista: 38,
        comite: 22,
        conversionPct: 21.6
      },
      {
        categoria: '24 a 26',
        elegibles: 307,
        pasanLecturas: 205,
        aceptadosEntrevista: 89,
        comite: 49,
        conversionPct: 16.0
      },
      {
        categoria: '27 a 29',
        elegibles: 244,
        pasanLecturas: 162,
        aceptadosEntrevista: 56,
        comite: 35,
        conversionPct: 14.3
      },
      {
        categoria: '30 o más',
        elegibles: 485,
        pasanLecturas: 234,
        aceptadosEntrevista: 48,
        comite: 23,
        conversionPct: 4.7
      }
    ],
    insights: [
      'El 43% de los elegibles tiene 30 años o más, pero solo es el 18% del comité.',
      'La caída se concentra en Entrevista: de los mayores de 30 que pasan Lecturas, solo el 20,5% es aceptado, frente a 49% de los menores de 24.',
      'Hay que decidir si esto es un criterio deliberado del programa o un sesgo del proceso. Si es deliberado, conviene decirlo en la convocatoria para no atraer un volumen que no va a avanzar.'
    ]
  },
  {
    id: 'etnia',
    titulo: 'Grupo étnico',
    descripcion:
      'Comportamiento de la tasa de paso según pertenencia étnica declarada.',
    datos: [
      {
        categoria: 'Ninguno de los anteriores',
        elegibles: 971,
        comite: 120,
        conversionPct: 12.4
      },
      {
        categoria: 'Afrodescendientes',
        elegibles: 100,
        comite: 5,
        conversionPct: 5.0
      },
      {
        categoria: 'Indígenas',
        elegibles: 63,
        comite: 4,
        conversionPct: 6.3
      },
      {
        categoria: 'Raizales y palenqueros',
        elegibles: 4,
        comite: 0,
        conversionPct: 0.0,
        muestraPequena: true
      }
    ],
    insights: [
      'Las personas afrodescendientes e indígenas llegan a comité a la mitad de la tasa del resto.',
      'En el caso afrodescendiente, la caída ocurre en Entrevista (30% de aceptación) y sobre todo en el Lab (5 de 17 aceptados en Entrevista llegan a comité).',
      'En comité la brecha se completa: ninguna de las 9 personas afrodescendientes o indígenas que llegaron quedó seleccionada (ver sección 8).'
    ]
  },
  {
    id: 'territorio',
    titulo: 'Territorio',
    descripcion:
      'Distribución geográfica de los postulantes elegibles frente a quienes acceden a comité.',
    datos: [
      {
        categoria: 'Cundinamarca',
        elegibles: 334,
        comite: 53,
        conversionPct: 15.9
      },
      {
        categoria: 'Nariño',
        elegibles: 77,
        comite: 15,
        conversionPct: 19.5
      },
      {
        categoria: 'Valle del Cauca',
        elegibles: 99,
        comite: 11,
        conversionPct: 11.1
      },
      {
        categoria: 'Antioquia',
        elegibles: 84,
        comite: 7,
        conversionPct: 8.3
      },
      {
        categoria: 'Atlántico',
        elegibles: 64,
        comite: 6,
        conversionPct: 9.4
      },
      {
        categoria: 'Córdoba',
        elegibles: 52,
        comite: 0,
        conversionPct: 0.0
      },
      {
        categoria: 'Bolívar',
        elegibles: 41,
        comite: 2,
        conversionPct: 4.9
      }
    ],
    insights: [
      'Cundinamarca concentra el 41% del comité (53 de 129).',
      'Nariño es el caso destacado: con volumen medio, tiene la mejor conversión del país.',
      'Córdoba aporta 52 elegibles y ninguno llega a comité. La región Caribe en general convierte por debajo del promedio.'
    ]
  },
  {
    id: 'no_diferencia',
    titulo: 'Lo que no diferencia',
    descripcion:
      'Condiciones evaluadas que presentan una tasa de paso idéntica o sin significancia estadística.',
    datos: [
      {
        categoria: 'HPC (Condición socioeconómica)',
        elegibles: 910,
        comite: 104,
        conversionPct: 11.4
      },
      {
        categoria: 'No HPC',
        elegibles: 228,
        comite: 25,
        conversionPct: 11.1
      },
      {
        categoria: 'Pregrado Profesional',
        elegibles: 885,
        comite: 104,
        conversionPct: 11.8
      },
      {
        categoria: 'Pregrado Licenciatura',
        elegibles: 243,
        comite: 25,
        conversionPct: 10.3
      }
    ],
    insights: [
      'HPC no predice el resultado: convierte igual con o sin la condición (11,4% frente a 11,1%). Como el 80% de los elegibles es HPC, el criterio hoy no ayuda a priorizar.',
      'Profesional y licenciatura convierten parecido (11,8% frente a 10,3%).'
    ]
  }
];

// ============================================================================
// SECCIÓN 10: PERFIL DE LA COHORTE SELECCIONADA
// ============================================================================
export interface FilaComparativaCohorte {
  dimension: string;
  comite129: string;
  cohorte61: string;
  destacado?: boolean;
}

export const COMPARATIVO_COMITE_VS_SELECCIONADOS: FilaComparativaCohorte[] = [
  {
    dimension: 'Canal',
    comite129: '63% redes, 25% referidos, 12% gira',
    cohorte61: '62% redes, 25% referidos, 13% gira'
  },
  {
    dimension: 'Universidad priorizada (Top 7)',
    comite129: '33%',
    cohorte61: '46%',
    destacado: true
  },
  {
    dimension: 'Universidad Top 13 QS',
    comite129: '38%',
    cohorte61: '51%'
  },
  {
    dimension: 'Ruta Promisorios',
    comite129: '47%',
    cohorte61: '57%'
  },
  {
    dimension: 'Enfoque',
    comite129: '47% bilingüe, 36% STEM, 17% STEM y bilingüe',
    cohorte61: '67% bilingüe, 15% STEM, 18% STEM y bilingüe',
    destacado: true
  },
  {
    dimension: 'Edad',
    comite129: '17% 23 o menos, 65% 24 a 29, 18% 30 o más',
    cohorte61: '18% 23 o menos, 69% 24 a 29, 13% 30 o más'
  },
  {
    dimension: 'Pregrado',
    comite129: '70% profesional, 30% licenciatura',
    cohorte61: '85% profesional, 15% licenciatura',
    destacado: true
  },
  {
    dimension: 'Territorio',
    comite129: '41% Cundinamarca, 12% Nariño, 9% Valle',
    cohorte61: '56% Cundinamarca, 8% Valle, 7% Quindío, 3% Nariño',
    destacado: true
  },
  {
    dimension: 'Grupo étnico',
    comite129: '7% afrodescendiente o indígena',
    cohorte61: '0%',
    destacado: true
  }
];

export const PERFIL_COHORTE_DONAS = {
  total: 61,
  canal: [
    { name: 'Redes sociales', value: 62, comiteVal: 63, color: '#152238' },
    { name: 'Referidos', value: 25, comiteVal: 25, color: '#2E9E82' },
    { name: 'Gira LIDERA', value: 13, comiteVal: 12, color: '#F2A900' }
  ],
  universidad: [
    { name: 'Priorizada Top 7', value: 46, comiteVal: 33, color: '#F2A900' },
    { name: 'Top 13 QS (No Top 7)', value: 5, comiteVal: 5, color: '#3B82F6' },
    { name: 'Otras Universidades', value: 49, comiteVal: 62, color: '#94A3B8' }
  ],
  ruta: [
    { name: 'Ruta Promisorios', value: 57, comiteVal: 47, color: '#2E9E82' },
    { name: 'Ruta General', value: 43, comiteVal: 53, color: '#152238' }
  ],
  enfoque: [
    { name: 'Bilingüe', value: 67, comiteVal: 47, color: '#2E9E82' },
    { name: 'STEM', value: 15, comiteVal: 36, color: '#E11D48' },
    { name: 'STEM y bilingüe', value: 18, comiteVal: 17, color: '#152238' }
  ],
  edad: [
    { name: '24 a 29 años', value: 69, comiteVal: 65, color: '#2E9E82' },
    { name: '23 años o menos', value: 18, comiteVal: 17, color: '#F2A900' },
    { name: '30 años o más', value: 13, comiteVal: 18, color: '#152238' }
  ],
  pregrado: [
    { name: 'Profesional', value: 85, comiteVal: 70, color: '#152238' },
    { name: 'Licenciatura', value: 15, comiteVal: 30, color: '#2E9E82' }
  ],
  territorio: [
    { name: 'Cundinamarca', value: 56, comiteVal: 41, color: '#152238' },
    { name: 'Valle del Cauca', value: 8, comiteVal: 9, color: '#2E9E82' },
    { name: 'Quindío', value: 7, comiteVal: 3, color: '#F2A900' },
    { name: 'Nariño', value: 3, comiteVal: 12, color: '#E11D48' },
    { name: 'Otros depts.', value: 26, comiteVal: 35, color: '#94A3B8' }
  ]
};

export const DATOS_EXCLUSIVOS_COHORTE_SELECCIONADA = {
  genero: '79% femenino, 20% masculino, 2% otro',
  colegio: '62% privado, 38% público',
  estrato:
    '57% en estratos 2 y 3 (35 personas), 23% en estrato 4, y 18% en 1, 5 y 6 juntos (una persona sin dato)',
  edadPromedio: '26 años',
  inglesAutodeclarado: '87% en B2 o más'
};

// ============================================================================
// SECCIÓN 11: CONCLUSIONES Y RECOMENDACIONES (13 ACCIONES)
// ============================================================================
export interface RecomendacionReporte {
  id: number;
  hallazgo: string;
  recomendacion: string;
  impactoEsperado: string;
}

export const RECOMENDACIONES_FINALES: RecomendacionReporte[] = [
  {
    id: 1,
    hallazgo: 'El comité seleccionó a 61 de 130 y la cohorte queda en 76% de los cupos.',
    recomendacion:
      'Registrar el motivo de cada no selección (decisión del comité, desistimiento, otro) y revisar si hay que convocar a quienes quedaron cerca, o abrir una segunda ronda.',
    impactoEsperado: 'Saber si la brecha es filtro o pérdida, y cerrar los 19 cupos.'
  },
  {
    id: 2,
    hallazgo: 'Referidos y gira convierten el doble que redes sociales.',
    recomendacion:
      'Invertir más en referidos (programa de embajadores con Ecos y alumni) y en gira en universidades priorizadas.',
    impactoEsperado: 'Más comité con el mismo volumen de postulantes.'
  },
  {
    id: 3,
    hallazgo: 'La meta Top 7 no se cumplió, y es el grupo que más convierte.',
    recomendacion:
      'Concentrar la gira y los referidos en las 7 universidades priorizadas.',
    impactoEsperado: 'Cerrar la brecha de 84 elegibles Top 7.'
  },
  {
    id: 4,
    hallazgo: 'El 73% de los no elegibles se cae por enfoque.',
    recomendacion:
      'Hacer más visible en toda la difusión el requisito STEM o bilingüe, con una prueba de autoselección antes del formulario.',
    impactoEsperado: 'Menos volumen no elegible y menos carga operativa.'
  },
  {
    id: 5,
    hallazgo: '688 personas cumplían mínimos y no terminaron el formulario.',
    recomendacion:
      'Campaña de recuperación por correo y WhatsApp durante la convocatoria, y revisión de la longitud del formulario.',
    impactoEsperado: 'Unas 25 personas más en comité si se recupera un tercio.'
  },
  {
    id: 6,
    hallazgo: 'La extensión trajo mucho volumen con baja conversión.',
    recomendacion:
      'Evaluar si la extensión compensa el costo operativo, o activarla solo con difusión dirigida a canales que convierten.',
    impactoEsperado: 'Mejor rendimiento por postulante.'
  },
  {
    id: 7,
    hallazgo: '32 aceptados en Entrevista nunca fueron citados al Lab y 26 no asistieron.',
    recomendacion:
      'Citar al Lab inmediatamente después de la aceptación, con confirmación y recordatorios.',
    impactoEsperado: 'Unas 20 personas más en comité.'
  },
  {
    id: 8,
    hallazgo:
      'Mayores de 30 años y personas afro e indígenas convierten mucho menos, y ninguna persona afro o indígena quedó en la cohorte.',
    recomendacion:
      'Revisar con el equipo si es un criterio del programa o un sesgo de Entrevista, Lab y comité; si es criterio, comunicarlo en la convocatoria.',
    impactoEsperado: 'Proceso más justo o expectativas más claras.'
  },
  {
    id: 9,
    hallazgo:
      'STEM es el 45% de los elegibles y el 15% de la cohorte; el comité selecciona al 19% de los STEM que llegan.',
    recomendacion:
      'Definir de antemano cuántos cupos STEM necesita el programa y usarlo como criterio explícito en comité.',
    impactoEsperado: 'Cohorte alineada con la necesidad de docentes.'
  },
  {
    id: 10,
    hallazgo: '9 personas seleccionadas esperan nombramiento en el concurso docente.',
    recomendacion:
      'Seguimiento cercano a ese grupo durante la formación inicial.',
    impactoEsperado: 'Menos deserción temprana.'
  },
  {
    id: 11,
    hallazgo: 'Hay 134 rechazados en Entrevista y 30 en Lab que "podrían ser Eco en el futuro".',
    recomendacion:
      'Crear una base de talento para invitarlos de nuevo en la próxima convocatoria.',
    impactoEsperado: 'Arranque de la convocatoria 2027 con candidatos ya conocidos.'
  },
  {
    id: 12,
    hallazgo: 'HPC no diferencia a quienes llegan a comité.',
    recomendacion:
      'Revisar la definición de HPC o dejar de usarla como criterio de priorización.',
    impactoEsperado: 'Criterios más útiles para priorizar.'
  },
  {
    id: 13,
    hallazgo: 'El evaluador de Lecturas es 18 puntos más exigente que el modelo, y hubo 40 casos de plagio.',
    recomendacion:
      'Recalibrar el modelo con los resultados de este año y agregar verificación automática de plagio.',
    impactoEsperado: 'Lecturas más rápidas y consistentes.'
  }
];

// ============================================================================
// SECCIÓN 12: ANEXO Y ENLACES
// ============================================================================
export const ENLACE_DOCUMENTO_ENTREGA = {
  titulo:
    'Documento de entrega del proceso CSM LIDERA (cómo se construyó y cómo se opera cada etapa)',
  url: 'https://drive.google.com/file/d/1BhGJLNqjuddVHxWnl9Zm6c1fL4SJgFfa/view'
};

// ============================================================================
// SECCIONES DE NAVEGACIÓN Y TABLA DE CONTENIDOS (12 SECCIONES)
// ============================================================================
export interface SeccionTOC {
  id: string;
  numero: string;
  titulo: string;
}

export const SECCIONES_TOC: SeccionTOC[] = [
  { id: 'resumen-ejecutivo', numero: '1', titulo: 'Resumen ejecutivo' },
  { id: 'alcance-definiciones', numero: '2', titulo: 'Alcance y definiciones' },
  { id: 'embudo-completo', numero: '3', titulo: 'Embudo completo' },
  { id: 'convocatoria', numero: '4', titulo: 'Convocatoria: volumen y calidad' },
  { id: 'lecturas', numero: '5', titulo: 'Lecturas' },
  { id: 'entrevistas', numero: '6', titulo: 'Entrevistas' },
  { id: 'lidera-lab', numero: '7', titulo: 'LIDERA Lab' },
  { id: 'comite-matricula', numero: '8', titulo: 'Comité y matrícula' },
  { id: 'cambio-perfil', numero: '9', titulo: 'Cómo cambia el perfil' },
  { id: 'perfil-cohorte', numero: '10', titulo: 'Perfil de la cohorte seleccionada' },
  { id: 'conclusiones-recomendaciones', numero: '11', titulo: 'Conclusiones y recomendaciones' },
  { id: 'anexo', numero: '12', titulo: 'Anexo' }
];

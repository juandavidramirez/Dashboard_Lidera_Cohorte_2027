import { LabRecord } from '../types';

export const META_CUPOS = 80;
export const META_ACEPTADOS_LAB = 140;

/**
 * Nombres y datos ficticios para el dataset de prueba de LIDERA Lab (Cohorte 2027).
 * Cumple estrictamente con:
 * - ~140 candidatos ficticios (19–30 de octubre de 2026)
 * - ~8% no asistió
 * - ~70% con evaluación completa ('Si')
 * - Aceptados con puntajes tendencialmente superiores a rechazados
 * - ~12% con cambio de decisión entre Entrevista y Lab
 * - Sin cédula, correo, teléfono, salud ni familia
 */

const NOMBRES_MASCULINOS = [
  'Mateo Valencia Morales', 'Santiago Arango Cárdenas', 'Sebastián Betancur Ríos',
  'Nicolás Restrepo Gómez', 'Daniel Osorio Pineda', 'Alejandro Henao Velez',
  'Samuel Echeverry Gil', 'Gabriel Carvajal Builes', 'Lucas Monsalve Bedoya',
  'David Londoño Agudelo', 'Martín Zuleta Mejía', 'Felipe Marín Jaramillo',
  'Joaquín Saldarriaga Duque', 'Jerónimo Giraldo Castrillón', 'Tomás Peláez Arenas',
  'Andrés Felipe Caicedo Ortiz', 'Camilo Ernesto Barón Silva', 'Diego Fernando Tovar Paz',
  'Esteban José Cuéllar Ruiz', 'Julián Andrés Quintero Polo', 'Manuel Salvador Vergara Hoyos',
  'Óscar Eduardo Bejarano Soler', 'Rodrigo Alfonso Pantoja Caicedo', 'Víctor Manuel Burbano Cruz',
  'Álvaro Javier Domínguez Luna', 'Carlos Alberto Forero Rojas', 'Gustavo Adolfo Buitrago Parra',
  'Hernando León Chaparro Nivia', 'Iván Darío Macías Serna', 'Javier Ignacio Mosquera Palacios',
  'Leandro Mauricio Ojeda Tafur', 'Pablo Emilio Rendón Quiceno', 'Ricardo Antonio Salcedo Flórez',
  'Sergio Daniel Valenzuela Umaña', 'William Andrés Zapata Oquendo'
];

const NOMBRES_FEMENINOS = [
  'Valentina Correa Mazo', 'Mariana Castaño Zapata', 'Isabella Ocampo Guzmán',
  'Sofía Gallego Urrego', 'Camila Quintero Chaverra', 'Luciana Tabares Holguín',
  'Gabriela Piedrahita Toro', 'Salomé Cardona Posada', 'Sara Montoya Rave',
  'Manuela Hincapié Saza', 'Antonia Cano Barrientos', 'Emilia Tamayo Loaiza',
  'Juliana Villegas Arbeláez', 'Laura Sofía Otálvaro Luján', 'Valeria Puerta Palacio',
  'Carolina Andrea Cifuentes Cruz', 'Daniela Paola Garavito Garzón', 'Elena Victoria Villamizar Peña',
  'Fabiana Raquel Mindiola Daza', 'Gloria Inés Samper Pardo', 'Helena Beatriz Zúñiga Rangel',
  'Ingrid Vanessa Charry Tello', 'Johana Marcela Lemus Perea', 'Karina Paola Noguera Baena',
  'Liliana Rocío Peñaranda Mogollón', 'Marcela Viviana Rosero Jurado', 'Natalia María Saavedra Conde',
  'Patricia Elena Triana Uribe', 'Sandra Milena Villalba Roa', 'Tatiana Marcela Yanguas Nieto',
  'Xiomara Lucía Barreto Cotes', 'Yolanda Mercedes Ceballos Cuartas', 'Adriana Cecilia Delgado Fajardo',
  'Beatriz Eugenia Ebratt Gnecco', 'Claudia Patricia Frasser Hinestrosa'
];

const UNIVERSIDADES = [
  { name: 'Universidad del Valle', prio: 'SI' },
  { name: 'Universidad de Antioquia', prio: 'SI' },
  { name: 'Universidad del Norte', prio: 'SI' },
  { name: 'Universidad Industrial de Santander', prio: 'SI' },
  { name: 'Universidad Tecnológica de Pereira', prio: 'SI' },
  { name: 'Universidad de Caldas', prio: 'SI' },
  { name: 'Universidad del Cauca', prio: 'SI' },
  { name: 'Universidad Nacional de Colombia', prio: 'NO' },
  { name: 'Pontificia Universidad Javeriana', prio: 'NO' },
  { name: 'Universidad de los Andes', prio: 'NO' },
  { name: 'Universidad EAFIT', prio: 'NO' },
  { name: 'Universidad de La Sabana', prio: 'NO' },
  { name: 'Universidad del Rosario', prio: 'NO' },
  { name: 'Universidad Pedagógica Nacional', prio: 'SI' }
];

const CARRERAS = [
  { carrera: 'Licenciatura en Lenguas Modernas', tipo: 'Licenciatura', stem: false, bil: true },
  { carrera: 'Licenciatura en Matemáticas', tipo: 'Licenciatura', stem: true, bil: false },
  { carrera: 'Ingeniería de Sistemas', tipo: 'Profesional', stem: true, bil: true },
  { carrera: 'Ingeniería Química', tipo: 'Profesional', stem: true, bil: false },
  { carrera: 'Biología Marina', tipo: 'Profesional', stem: true, bil: true },
  { carrera: 'Psicología', tipo: 'Profesional', stem: false, bil: false },
  { carrera: 'Economía', tipo: 'Profesional', stem: true, bil: true },
  { carrera: 'Filología e Idiomas', tipo: 'Profesional', stem: false, bil: true },
  { carrera: 'Licenciatura en Ciencias Sociales', tipo: 'Licenciatura', stem: false, bil: false },
  { carrera: 'Ingeniería Biomédica', tipo: 'Profesional', stem: true, bil: true },
  { carrera: 'Sociología', tipo: 'Profesional', stem: false, bil: false },
  { carrera: 'Licenciatura en Educación Infantil', tipo: 'Licenciatura', stem: false, bil: false }
];

const CIUDADES = [
  'Cali', 'Barranquilla', 'Medellín', 'Bogotá, D.C.', 'Bucaramanga',
  'Pasto', 'Pereira', 'Cúcuta', 'Manizales', 'Santa Marta', 'Cartagena'
];

const FECHAS_LAB = [
  '2026-10-19', '2026-10-20', '2026-10-21', '2026-10-22', '2026-10-23',
  '2026-10-26', '2026-10-27', '2026-10-28', '2026-10-29', '2026-10-30'
];

const COMENTARIOS_CLASE = [
  'Excelente manejo del espacio escénico, capturó de inmediato la atención con una analogía visual.',
  'Muy clara explicación pedagógica, involucró activamente a los compañeros formulando preguntas reflexivas.',
  'Gran calidez y carisma al comunicar el concepto central; tono de voz impecable.',
  'Dificultad menor para cerrar a tiempo los 5 minutos, pero muy sólido dominio conceptual.',
  'Se mostró receptivo/a ante las dudas simuladas y adaptó el lenguaje con sencillez.'
];

const COMENTARIOS_GRUPAL = [
  'Liderazgo democrático notable; articuló los consensos y dio voz a quienes participaban menos.',
  'Escucha activa genuina y capacidad de mediar constructivamente frente al límite de tiempo.',
  'Aportó propuestas creativas y resolutivas que destrabaron el reto del equipo.',
  'Muy cooperativo/a y orientado/a al resultado colectivo; reconoció las ideas de los demás.',
  'Participación prudente pero estratégica cuando se requirió síntesis.'
];

const COMENTARIOS_JUEGO_ROLES = [
  'Manejo asertivo de la situación conflictiva; demostró empatía profunda con el rol asignado.',
  'Alta inteligencia emocional y serenidad ante la presión de la contraparte.',
  'Capaz de sostener límites con respeto y calidez humana; muy orientado/a a soluciones pedagógicas.',
  'Escuchó con atención antes de responder y calibró su postura con prudencia.',
  'Lenguaje no verbal firme y conciliador.'
];

const COMENTARIOS_FINANZAS = [
  'Planificación realista y reflexiva; demuestra conciencia de la economía del territorio asignado.',
  'Proyección equilibrada con visión de sostenibilidad personal para el periodo de dos años.',
  'Buena anticipación de gastos imprevistos y priorización en necesidades esenciales.',
  'Consciente de la asignación de sostenimiento mensual y compromiso total.'
];

export function generateLabDummyData(): LabRecord[] {
  const records: LabRecord[] = [];
  const TOTAL = 142; // ~140 candidatos
  const NO_ASISTIO_COUNT = 11; // ~8% de inasistencia (11 / 142 = 7.7%)
  const EVAL_COMPLETA_COUNT = 98; // ~70% de evaluación completa (98 / 140 = 70%)

  // Índices asignados a inasistencia
  const inasistentesSet = new Set([6, 17, 31, 44, 59, 73, 88, 102, 115, 127, 138]);

  // Decisiones flip entre Entrevista y Lab (~12% = 17 casos)
  const flipSet = new Set([12, 23, 35, 48, 62, 77, 85, 93, 104, 112, 119, 125, 131, 135, 139, 140, 141]);

  for (let i = 0; i < TOTAL; i++) {
    const isMasc = i % 2 === 0;
    const namePool = isMasc ? NOMBRES_MASCULINOS : NOMBRES_FEMENINOS;
    const fullName = namePool[Math.floor(i / 2) % namePool.length] + (i >= 70 ? ' ' : '');

    const uniObj = UNIVERSIDADES[i % UNIVERSIDADES.length];
    const carrObj = CARRERAS[i % CARRERAS.length];
    const ciudad = CIUDADES[i % CIUDADES.length];
    const fechaLab = FECHAS_LAB[i % FECHAS_LAB.length];
    const bloque = i % 2 === 0 ? 'Mañana' : 'Tarde';
    const subgrupo = `G${(i % 4) + 1}-${i % 2 === 0 ? 'A' : 'B'}`;

    // Edad con distribución realista
    let edad: number;
    if (i % 4 === 0) edad = 22 + (i % 3); // <24
    else if (i % 4 === 1) edad = 25 + (i % 2); // 25-26
    else if (i % 4 === 2) edad = 27 + (i % 2); // 27-28
    else edad = 29 + (i % 5); // >29

    const isNoAsistio = inasistentesSet.has(i);
    const asistio = !isNoAsistio;

    // Evaluación completa
    const isEvalCompleta = asistio && (i < EVAL_COMPLETA_COUNT || (i % 5 !== 0));
    const evaluacion_completa = isEvalCompleta ? 'Si' : 'No';

    // Opinión Entrevista previa (todos los que llegaron a Lab venían de entrevista)
    const opinionEntrevista = 'ACEPTADO: De acuerdo';

    // Decisión de Lab: Aceptados vs Rechazados
    // Generalmente pasan ~65-70% de los evaluados
    const isFlip = flipSet.has(i);
    let isAceptadoLab: boolean;

    if (!asistio) {
      isAceptadoLab = false;
    } else if (isFlip) {
      // Cambio de decisión: de Aceptado en entrevista a Rechazado en Lab
      isAceptadoLab = false;
    } else {
      isAceptadoLab = (i % 3 !== 0); // ~67% pasa
    }

    let opinionEvaluadorLab: string | null = null;
    let recModelo: string | null = null;

    if (asistio && evaluacion_completa === 'Si') {
      if (isAceptadoLab) {
        const sub = i % 3;
        if (sub === 0) opinionEvaluadorLab = 'ACEPTADO: De acuerdo';
        else if (sub === 1) opinionEvaluadorLab = 'ACEPTADO: Creo que debería pasar';
        else opinionEvaluadorLab = 'ACEPTADO: Tiene el factor "Ñ"';

        recModelo = i % 5 === 0 ? 'Comité' : 'Pasar';
      } else {
        const sub = i % 2;
        if (sub === 0) opinionEvaluadorLab = 'RECHAZADO: De acuerdo, pero podría ser Eco en el futuro';
        else opinionEvaluadorLab = 'RECHAZADO: firmemente de acuerdo';

        recModelo = i % 4 === 0 ? 'Factor Ñ' : 'Rechazar';
      }
    } else if (asistio) {
      opinionEvaluadorLab = null; // En curso
      recModelo = 'Comité';
    }

    // Puntajes numéricos (Aceptados tienen medias más altas ~3.8-4.6, Rechazados ~2.5-3.4)
    let p5min: number | null = null;
    let pGrupal: number | null = null;
    let pRoles: number | null = null;
    let pAjuste: number | null = null;
    let pCritico: number | null = null;
    let pPerseverancia: number | null = null;
    let pPermanencia: number | null = null;
    let pRelaciones: number | null = null;
    let pTotal: number | null = null;

    // Componentes de sección (para promedios calculados)
    let serProfe: number | null = null;
    let imIntereses: number | null = null;
    let imComPresencia: number | null = null;
    let imEscuchaResponde: number | null = null;

    let dinamicaGrupo: number | null = null;
    let imAtencionGa: number | null = null;
    let imEmpatiaGa: number | null = null;
    let actGrPerseverancia: number | null = null;

    let imAtencionJr: number | null = null;
    let imEmpatiaJr: number | null = null;
    let imConsideraAudiencia: number | null = null;

    let hoSemanaVidaEco: number | null = null;

    if (asistio && evaluacion_completa === 'Si') {
      const baseScore = isAceptadoLab ? 3.9 + ((i % 10) * 0.1) : 2.7 + ((i % 8) * 0.1);

      serProfe = Math.min(5, Math.max(1, Math.round((baseScore + ((i % 5) - 2) * 0.2) * 10) / 10));
      imIntereses = Math.min(5, Math.max(1, Math.round((baseScore + ((i % 4) - 1.5) * 0.2) * 10) / 10));
      imComPresencia = Math.min(5, Math.max(1, Math.round((baseScore + ((i % 3) - 1) * 0.2) * 10) / 10));
      imEscuchaResponde = Math.min(5, Math.max(1, Math.round((baseScore + ((i % 4) - 2) * 0.2) * 10) / 10));
      p5min = Math.round(((serProfe + imIntereses + imComPresencia + imEscuchaResponde) / 4) * 10) / 10;

      dinamicaGrupo = Math.min(5, Math.max(1, Math.round((baseScore + ((i % 3) - 1) * 0.2) * 10) / 10));
      imAtencionGa = Math.min(5, Math.max(1, Math.round((baseScore + ((i % 5) - 2) * 0.2) * 10) / 10));
      imEmpatiaGa = Math.min(5, Math.max(1, Math.round((baseScore + ((i % 4) - 1) * 0.2) * 10) / 10));
      actGrPerseverancia = Math.min(5, Math.max(1, Math.round((baseScore + ((i % 3) - 1.5) * 0.2) * 10) / 10));
      pGrupal = Math.round(((dinamicaGrupo + imAtencionGa + imEmpatiaGa + actGrPerseverancia) / 4) * 10) / 10;

      imAtencionJr = Math.min(5, Math.max(1, Math.round((baseScore + ((i % 4) - 1.5) * 0.2) * 10) / 10));
      imEmpatiaJr = Math.min(5, Math.max(1, Math.round((baseScore + ((i % 3) - 1) * 0.2) * 10) / 10));
      imConsideraAudiencia = Math.min(5, Math.max(1, Math.round((baseScore + ((i % 5) - 2) * 0.2) * 10) / 10));
      pRoles = Math.round(((imAtencionJr + imEmpatiaJr + imConsideraAudiencia) / 3) * 10) / 10;

      hoSemanaVidaEco = Math.min(5, Math.max(1, Math.round((baseScore + ((i % 3) - 1) * 0.1) * 10) / 10));

      pAjuste = Math.min(5, Math.max(1, Math.round((baseScore + ((i % 3) - 1) * 0.15) * 10) / 10));
      pCritico = Math.min(5, Math.max(1, Math.round((baseScore + ((i % 4) - 1.5) * 0.15) * 10) / 10));
      pPerseverancia = Math.min(5, Math.max(1, Math.round((baseScore + ((i % 3) - 0.5) * 0.15) * 10) / 10));
      pPermanencia = Math.min(5, Math.max(1, Math.round((baseScore + ((i % 4) - 2) * 0.15) * 10) / 10));
      pRelaciones = Math.min(5, Math.max(1, Math.round((baseScore + ((i % 3) - 1) * 0.15) * 10) / 10));

      pTotal = Math.round((
        (p5min + pGrupal + pRoles + pAjuste + pCritico + pPerseverancia + pPermanencia + pRelaciones) / 8
      ) * 10) / 10;
    }

    // Promedios calculados por sección (Fórmula de la sección 4.2 del spec)
    const promClase = (serProfe && imIntereses && imComPresencia && imEscuchaResponde)
      ? Math.round(((serProfe + imIntereses + imComPresencia + imEscuchaResponde) / 4) * 10) / 10
      : null;
    const promGrupal = (dinamicaGrupo && imAtencionGa && imEmpatiaGa && actGrPerseverancia)
      ? Math.round(((dinamicaGrupo + imAtencionGa + imEmpatiaGa + actGrPerseverancia) / 4) * 10) / 10
      : null;
    const promRoles = (imAtencionJr && imEmpatiaJr && imConsideraAudiencia)
      ? Math.round(((imAtencionJr + imEmpatiaJr + imConsideraAudiencia) / 3) * 10) / 10
      : null;
    const promFinanzas = hoSemanaVidaEco;

    // Etapa alcanzada
    let etapaAlcanzada: LabRecord['etapa_alcanzada'] = 'Lab';
    if (!asistio) {
      etapaAlcanzada = 'Entrevista'; // Se quedó en entrevista
    } else if (isAceptadoLab && evaluacion_completa === 'Si') {
      etapaAlcanzada = 'Comité';
    } else {
      etapaAlcanzada = 'Lab';
    }

    const isBilingual = carrObj.bil || (i % 3 === 0);
    const isStem = carrObj.stem || (i % 4 === 0);
    let enfoque = 'No STEM no Bilingüe';
    if (isStem && isBilingual) enfoque = 'STEM y Bilingüe';
    else if (isStem) enfoque = 'STEM';
    else if (isBilingual) enfoque = 'Bilingüe';

    records.push({
      id_dia_entrevista: `a0DQU00002${String(1000 + i).padStart(5, '0')}`,
      id_contacto: `003QU00002${String(2000 + i).padStart(6, '0')}`,
      es_pre_evaluado: i < 21,
      fecha_lab: fechaLab,
      id_fecha_agenda: `AG-202610${fechaLab.slice(8)}-${bloque === 'Mañana' ? 'M' : 'T'}`,
      bloque,
      subgrupo,
      evaluador_asistencia: i % 2 === 0 ? 'Tatiana Morimitsu' : 'Rocío Navarro',

      // Asistencia
      asistencia_b1: asistio ? 1 : 0,
      asistencia_b2: asistio ? (i % 15 === 0 ? 0 : 1) : 0,
      asistencia_b3: asistio ? 1 : 0,
      formato_clase: 'Presencial',
      asistio,
      bloques_asistidos: asistio ? (i % 15 === 0 ? 2 : 3) : 0,
      comentarios_asistencia: asistio
        ? (i % 15 === 0 ? 'Asistió a 2 de 3 bloques (receso B2)' : 'Asistió a los 3 bloques con puntualidad')
        : (i % 2 === 0 ? 'Fila marcada en rojo en agenda presencial' : 'Sin asistencia en ningún bloque reportado'),

      // Componentes individuales
      ser_profe: serProfe,
      im_incluye_intereses: imIntereses,
      im_comunicacion_presencia: imComPresencia,
      im_escucha_responde: imEscuchaResponde,
      comentarios_ser_profesor: asistio ? COMENTARIOS_CLASE[i % COMENTARIOS_CLASE.length] : null,

      dinamica_grupo: dinamicaGrupo,
      im_atencion_ga: imAtencionGa,
      im_empatia_ga: imEmpatiaGa,
      act_gr_perseverancia: actGrPerseverancia,
      comentarios_actividad_grupal: asistio ? COMENTARIOS_GRUPAL[i % COMENTARIOS_GRUPAL.length] : null,

      im_atencion_jr: imAtencionJr,
      im_empatia_jr: imEmpatiaJr,
      im_considera_audiencia: imConsideraAudiencia,
      comentarios_juego_roles: asistio ? COMENTARIOS_JUEGO_ROLES[i % COMENTARIOS_JUEGO_ROLES.length] : null,

      ho_semana_vida_eco: hoSemanaVidaEco,
      ho_tarde_dia_entrevista: i % 18 === 0 ? 'Si' : 'No',
      comentarios_ho: asistio ? COMENTARIOS_FINANZAS[i % COMENTARIOS_FINANZAS.length] : null,

      // Puntajes finales calculados
      puntaje_5min: p5min,
      puntaje_actividad_grupal: pGrupal,
      puntaje_juego_roles: pRoles,
      puntaje_ajuste: pAjuste,
      puntaje_pensamiento_critico: pCritico,
      puntaje_perseverancia: pPerseverancia,
      puntaje_permanencia: pPermanencia,
      puntaje_construccion_relaciones: pRelaciones,
      puntaje_competencias_total: pTotal,
      recomendacion_modelo: recModelo,

      opinion_evaluador_lab: opinionEvaluadorLab,
      comentarios_evaluador_lab: asistio
        ? `Candidato/a con perfil ${isAceptadoLab ? 'muy favorable' : 'que requiere mayor maduración'} para el aula de clase. ${isAceptadoLab ? 'Destaca su resiliencia y empatía.' : 'Se recomienda reforzar asertividad pedagógica.'}`
        : 'No se presentó a la jornada presencial de evaluación.',
      recomendacion_postulante_lab: isAceptadoLab ? 'Apto para asignación territorial en aula' : 'Continuar en red Alumni o convocatoria posterior',
      evaluacion_completa,

      // Promedios calculados
      promedio_clase_5min: promClase,
      promedio_actividad_grupal: promGrupal,
      promedio_juego_roles: promRoles,
      promedio_lidera_finanzas: promFinanzas,

      // Perfil
      full_name: fullName,
      university_normalized: uniObj.name,
      career: carrObj.carrera,
      edad,
      genero: isMasc ? 'Masculino' : 'Femenino',
      ciudad,
      uni_prioritaria: uniObj.prio,
      is_bilingual: isBilingual,
      is_stem: isStem,
      enfoque,
      tipo_pregrado: carrObj.tipo,
      promedio_carrera: Math.round((3.8 + (i % 12) * 0.1) * 10) / 10,
      nivel_ingles: isBilingual ? (i % 2 === 0 ? 'C1' : 'B2') : (i % 2 === 0 ? 'B1' : 'A2'),
      preferencia_region: i % 3 === 0 ? 'Caribe' : i % 3 === 1 ? 'Pacífico' : 'Abierto a cualquier región',
      preferencia_zona: i % 2 === 0 ? 'Rural' : 'No tengo preferencia',
      preferencia_nivel: 'Secundaria / Media',
      disponibilidad_instituto: 'Si',

      // Etapas previas
      opinion_lectura: 'Lectura favorable - Pasa a entrevista',
      recomendacion_modelo_lectura: 'Pasar',
      observaciones_lectura: 'Postulación con ensayo reflexivo de alta calidad y clara vocación social.',
      opinion_entrevista: opinionEntrevista,
      recomendacion_postulante_entrevista: 'Excelente desenvolvimiento en entrevista individual.',
      comentarios_entrevista: 'Mostró sólidos antecedentes de perseverancia y compromiso comunitario.',
      evaluador_entrevista: i % 2 === 0 ? 'Ana Medina' : 'Juan David',

      etapa_alcanzada: etapaAlcanzada,
      fecha_postulacion: '2026-06-12',
      fecha_lectura: '2026-07-02',
      fecha_entrevista: '2026-08-14',
      created_at: '2026-10-18T10:00:00Z',
      updated_at: '2026-10-26T15:30:00Z'
    });
  }

  return records;
}

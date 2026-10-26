import {
  LabRecord,
  LabGeneralKpis,
  LabEmbudoMetrics,
  LabDiaAvanceItem,
  LabCompetenciaMetric,
  LabMatrizConcordancia,
  LabCambioDecision,
  CategoryBreakdownItem,
  CityLeaderboardItem
} from '../types';
import { META_CUPOS, META_ACEPTADOS_LAB } from './labDummyData';
import { stripHtml } from './entrevistasMetricsCalculator';

export { stripHtml };

export const OPINION_LAB_VALORES = {
  ACEPTADO_DE_ACUERDO: 'ACEPTADO: De acuerdo',
  ACEPTADO_CREO_PASAR: 'ACEPTADO: Creo que debería pasar',
  ACEPTADO_FACTOR_ENIE: 'ACEPTADO: Tiene el factor "Ñ"',
  RECHAZADO_FUTURO: 'RECHAZADO: De acuerdo, pero podría ser Eco en el futuro',
  RECHAZADO_FIRME: 'RECHAZADO: firmemente de acuerdo'
};

export function isLabAceptado(opinion?: string | null): boolean {
  if (!opinion) return false;
  const clean = stripHtml(opinion).toUpperCase().trim();
  return clean.startsWith('ACEPTADO') || clean.includes('ACEPTAD');
}

export function isLabRechazado(opinion?: string | null): boolean {
  if (!opinion) return false;
  const clean = stripHtml(opinion).toUpperCase().trim();
  return clean.startsWith('RECHAZADO') || clean.includes('RECHAZAD');
}

export function isLabEvaluacionCompleta(r: LabRecord): boolean {
  return r.evaluacion_completa === 'Si';
}

export function calculateLabGeneralKpis(
  records: LabRecord[],
  metaCuposProp = META_CUPOS,
  metaAceptadosLabProp = META_ACEPTADOS_LAB
): LabGeneralKpis {
  const totalAgendados = records.length;
  const totalAceptadosEntrevista = metaAceptadosLabProp || totalAgendados;

  const evaluadosCompletos = records.filter(r => r.evaluacion_completa === 'Si');
  const evaluadosCompletosCount = evaluadosCompletos.length;

  const avanceLabPct = totalAceptadosEntrevista > 0
    ? Math.round((evaluadosCompletosCount / totalAceptadosEntrevista) * 1000) / 10
    : 0;

  const asistieron = records.filter(r => r.asistio === true);
  const asistieronCount = asistieron.length;
  const noAsistieronCount = records.filter(r => r.asistio === false).length;

  const asistenciaPct = totalAgendados > 0
    ? Math.round((asistieronCount / totalAgendados) * 1000) / 10
    : 0;

  const aceptadosLab = evaluadosCompletos.filter(r => isLabAceptado(r.opinion_evaluador_lab));
  const aceptadosLabCount = aceptadosLab.length;

  const rechazadosLab = evaluadosCompletos.filter(r => isLabRechazado(r.opinion_evaluador_lab));
  const rechazadosLabCount = rechazadosLab.length;

  const tasaPasoPct = evaluadosCompletosCount > 0
    ? Math.round((aceptadosLabCount / evaluadosCompletosCount) * 1000) / 10
    : 0;

  const matriculacionCount = aceptadosLabCount;
  const matriculacionPct = metaCuposProp > 0
    ? Math.round((matriculacionCount / metaCuposProp) * 1000) / 10
    : 0;

  return {
    totalAceptadosEntrevista,
    totalAgendados,
    evaluadosCompletosCount,
    avanceLabPct,
    asistieronCount,
    noAsistieronCount,
    asistenciaPct,
    aceptadosLabCount,
    rechazadosLabCount,
    tasaPasoPct,
    matriculacionCount,
    matriculacionPct,
    metaCupos: metaCuposProp,
    metaAceptadosLab: metaAceptadosLabProp
  };
}

export function calculateLabEmbudo(
  records: LabRecord[],
  aplicaronTotal = 2022,
  elegiblesTotal = 1138
): LabEmbudoMetrics {
  const agendadosLab = records.length;
  const asistieronLab = records.filter(r => r.asistio).length;
  const evaluacionCompletaLab = records.filter(r => r.evaluacion_completa === 'Si').length;
  const pasanMatriculacion = records.filter(r => r.evaluacion_completa === 'Si' && isLabAceptado(r.opinion_evaluador_lab)).length;

  return {
    aplicaron: aplicaronTotal,
    elegibles: elegiblesTotal,
    pasaronLecturas: 675,
    aceptadosEntrevista: agendadosLab,
    agendadosLab,
    asistieronLab,
    evaluacionCompletaLab,
    pasanMatriculacion
  };
}

export function calculateLabAvancePorDia(
  records: LabRecord[],
  bloqueFiltro: 'Todos' | 'Mañana' | 'Tarde' = 'Todos'
): LabDiaAvanceItem[] {
  const filtered = bloqueFiltro === 'Todos'
    ? records
    : records.filter(r => r.bloque === bloqueFiltro);

  const dayMap = new Map<string, { agendados: number; asistieron: number; evaluados: number }>();

  // Fechas del 19 al 30 de octubre de 2026
  const fechas = [
    '2026-10-19', '2026-10-20', '2026-10-21', '2026-10-22', '2026-10-23',
    '2026-10-26', '2026-10-27', '2026-10-28', '2026-10-29', '2026-10-30'
  ];

  fechas.forEach(f => {
    dayMap.set(f, { agendados: 0, asistieron: 0, evaluados: 0 });
  });

  filtered.forEach(r => {
    if (!r.fecha_lab) return;
    const current = dayMap.get(r.fecha_lab) || { agendados: 0, asistieron: 0, evaluados: 0 };
    current.agendados++;
    if (r.asistio) current.asistieron++;
    if (r.evaluacion_completa === 'Si') current.evaluados++;
    dayMap.set(r.fecha_lab, current);
  });

  const diasNombres: Record<string, string> = {
    '2026-10-19': 'Lun 19',
    '2026-10-20': 'Mar 20',
    '2026-10-21': 'Mié 21',
    '2026-10-22': 'Jue 22',
    '2026-10-23': 'Vie 23',
    '2026-10-26': 'Lun 26',
    '2026-10-27': 'Mar 27',
    '2026-10-28': 'Mié 28',
    '2026-10-29': 'Jue 29',
    '2026-10-30': 'Vie 30'
  };

  return fechas.map(f => {
    const data = dayMap.get(f) || { agendados: 0, asistieron: 0, evaluados: 0 };
    return {
      fecha: f,
      diaLabel: diasNombres[f] || f.slice(8),
      agendados: data.agendados,
      asistieron: data.asistieron,
      evaluados: data.evaluados
    };
  });
}

export function calculateLabResultadosBreakdown(records: LabRecord[]) {
  const evaluados = records.filter(r => r.evaluacion_completa === 'Si' && r.opinion_evaluador_lab);
  const totalEvaluados = evaluados.length;

  let deAcuerdo = 0;
  let creoPasar = 0;
  let factorEnie = 0;
  let ecoFuturo = 0;
  let firme = 0;

  evaluados.forEach(r => {
    const op = String(r.opinion_evaluador_lab || '').toLowerCase();
    if (op.includes('ñ') || op.includes('factor ñ') || op.includes('factor "ñ"')) factorEnie++;
    else if (op.includes('creo que debería pasar') || op.includes('deberia pasar')) creoPasar++;
    else if (op.includes('aceptado')) deAcuerdo++;
    else if (op.includes('futuro') || op.includes('eco')) ecoFuturo++;
    else if (op.includes('rechazado')) firme++;
  });

  const aceptadosCount = deAcuerdo + creoPasar + factorEnie;
  const rechazadosCount = ecoFuturo + firme;

  const aceptadosCategories: CategoryBreakdownItem[] = [
    {
      label: 'De acuerdo',
      count: deAcuerdo,
      pct: totalEvaluados > 0 ? Math.round((deAcuerdo / totalEvaluados) * 1000) / 10 : 0,
      isPass: true
    },
    {
      label: 'Creo que debería pasar',
      count: creoPasar,
      pct: totalEvaluados > 0 ? Math.round((creoPasar / totalEvaluados) * 1000) / 10 : 0,
      isPass: true
    },
    {
      label: 'Tiene el factor "Ñ"',
      count: factorEnie,
      pct: totalEvaluados > 0 ? Math.round((factorEnie / totalEvaluados) * 1000) / 10 : 0,
      isPass: true
    }
  ];

  const rechazadosCategories: CategoryBreakdownItem[] = [
    {
      label: 'De acuerdo, pero podría ser Eco en el futuro',
      count: ecoFuturo,
      pct: totalEvaluados > 0 ? Math.round((ecoFuturo / totalEvaluados) * 1000) / 10 : 0,
      isPass: false
    },
    {
      label: 'Firmemente de acuerdo',
      count: firme,
      pct: totalEvaluados > 0 ? Math.round((firme / totalEvaluados) * 1000) / 10 : 0,
      isPass: false
    }
  ];

  return {
    totalEvaluados,
    aceptadosCount,
    aceptadosPct: totalEvaluados > 0 ? Math.round((aceptadosCount / totalEvaluados) * 1000) / 10 : 0,
    rechazadosCount,
    rechazadosPct: totalEvaluados > 0 ? Math.round((rechazadosCount / totalEvaluados) * 1000) / 10 : 0,
    aceptadosCategories,
    rechazadosCategories
  };
}

export function calculateLabMatrizConcordancia(records: LabRecord[]): LabMatrizConcordancia {
  const evaluados = records.filter(
    r => r.evaluacion_completa === 'Si' && r.opinion_evaluador_lab && r.recomendacion_modelo
  );

  const matrixMap = new Map<string, number>();
  const modeloMap = new Map<string, number>();
  const evalMap = new Map<string, number>();
  let acuerdosCount = 0;

  evaluados.forEach(r => {
    const mod = r.recomendacion_modelo || 'Sin Modelo';
    const isAcept = isLabAceptado(r.opinion_evaluador_lab);
    const ev = isAcept ? 'Aceptado' : 'Rechazado';

    const key = `${mod}__${ev}`;
    matrixMap.set(key, (matrixMap.get(key) || 0) + 1);
    modeloMap.set(mod, (modeloMap.get(mod) || 0) + 1);
    evalMap.set(ev, (evalMap.get(ev) || 0) + 1);

    // Acuerdo: Modelo Pasar -> Aceptado, o Modelo Rechazar -> Rechazado
    if ((mod === 'Pasar' && isAcept) || (mod === 'Rechazar' && !isAcept)) {
      acuerdosCount++;
    }
  });

  const totalComparables = evaluados.length;
  const acuerdoPct = totalComparables > 0
    ? Math.round((acuerdosCount / totalComparables) * 1000) / 10
    : 0;

  const matriz: Array<{ modelo: string; evaluador: string; count: number }> = [];
  const modelos = ['Pasar', 'Comité', 'Factor Ñ', 'Rechazar'];
  const evaluadores = ['Aceptado', 'Rechazado'];

  modelos.forEach(m => {
    evaluadores.forEach(e => {
      const count = matrixMap.get(`${m}__${e}`) || 0;
      matriz.push({ modelo: m, evaluador: e, count });
    });
  });

  const modeloDist = modelos.map(m => ({
    label: m,
    count: modeloMap.get(m) || 0,
    pct: totalComparables > 0 ? Math.round(((modeloMap.get(m) || 0) / totalComparables) * 1000) / 10 : 0
  }));

  const evaluadorDist = evaluadores.map(e => ({
    label: e,
    count: evalMap.get(e) || 0,
    pct: totalComparables > 0 ? Math.round(((evalMap.get(e) || 0) / totalComparables) * 1000) / 10 : 0
  }));

  return {
    matriz,
    totalComparables,
    acuerdosCount,
    acuerdoPct,
    modeloDist,
    evaluadorDist
  };
}

export function calculateLabCambioDecision(records: LabRecord[]): LabCambioDecision {
  const comparables = records.filter(
    r => r.evaluacion_completa === 'Si' && r.opinion_evaluador_lab && r.opinion_entrevista
  );

  let mantieneAceptado = 0;
  let mantieneRechazado = 0;
  let aceptadoARechazado = 0;
  let rechazadoAAceptado = 0;

  comparables.forEach(r => {
    const isEntAcept = isLabAceptado(r.opinion_entrevista);
    const isLabAcept = isLabAceptado(r.opinion_evaluador_lab);

    if (isEntAcept && isLabAcept) mantieneAceptado++;
    else if (!isEntAcept && !isLabAcept) mantieneRechazado++;
    else if (isEntAcept && !isLabAcept) aceptadoARechazado++;
    else if (!isEntAcept && isLabAcept) rechazadoAAceptado++;
  });

  const totalComparados = comparables.length;
  const cambiosTotales = aceptadoARechazado + rechazadoAAceptado;
  const cambioPct = totalComparados > 0
    ? Math.round((cambiosTotales / totalComparados) * 1000) / 10
    : 0;

  return {
    totalComparados,
    mantieneAceptado,
    mantieneRechazado,
    aceptadoARechazado,
    rechazadoAAceptado,
    cambiosTotales,
    cambioPct
  };
}

export function calculateLabCompetencias(records: LabRecord[]): LabCompetenciaMetric[] {
  const evaluados = records.filter(r => r.evaluacion_completa === 'Si');

  const compDefs: Array<{ key: keyof LabRecord; nombre: string; descripcion: string }> = [
    { key: 'puntaje_5min', nombre: 'Clase de 5 Minutos', descripcion: 'Desempeño pedagógico simulado' },
    { key: 'puntaje_actividad_grupal', nombre: 'Actividad Grupal', descripcion: 'Dinamización y perseverancia colectiva' },
    { key: 'puntaje_juego_roles', nombre: 'Juego de Roles', descripcion: 'Empatía y consideración de audiencia' },
    { key: 'puntaje_ajuste', nombre: 'Ajuste a la Organización', descripcion: 'Alineación con valores y misión' },
    { key: 'puntaje_pensamiento_critico', nombre: 'Pensamiento Crítico', descripcion: 'Resolución analítica de problemas' },
    { key: 'puntaje_perseverancia', nombre: 'Perseverancia', descripcion: 'Tenacidad frente al reto y frustración' },
    { key: 'puntaje_permanencia', nombre: 'Permanencia y Compromiso', descripcion: 'Sostenibilidad personal y arraigo' },
    { key: 'puntaje_construccion_relaciones', nombre: 'Construcción de Relaciones', descripcion: 'Vínculos con comunidad y colegas' },
    { key: 'puntaje_competencias_total', nombre: 'PUNTAJE COMPETENCIAS TOTAL', descripcion: 'Calificación ponderada global' }
  ];

  return compDefs.map(def => {
    const valuesTotal: number[] = [];
    const valuesAceptados: number[] = [];
    const valuesRechazados: number[] = [];

    evaluados.forEach(r => {
      const raw = r[def.key];
      if (raw !== null && raw !== undefined && typeof raw === 'number' && !isNaN(raw)) {
        valuesTotal.push(raw);
        if (isLabAceptado(r.opinion_evaluador_lab)) {
          valuesAceptados.push(raw);
        } else if (isLabRechazado(r.opinion_evaluador_lab)) {
          valuesRechazados.push(raw);
        }
      }
    });

    const sumTotal = valuesTotal.reduce((a, b) => a + b, 0);
    const promTotal = valuesTotal.length > 0 ? Math.round((sumTotal / valuesTotal.length) * 100) / 100 : 0;

    const sumAcept = valuesAceptados.reduce((a, b) => a + b, 0);
    const promAcept = valuesAceptados.length > 0 ? Math.round((sumAcept / valuesAceptados.length) * 100) / 100 : 0;

    const sumRech = valuesRechazados.reduce((a, b) => a + b, 0);
    const promRech = valuesRechazados.length > 0 ? Math.round((sumRech / valuesRechazados.length) * 100) / 100 : 0;

    // Mediana
    valuesTotal.sort((a, b) => a - b);
    let mediana = 0;
    if (valuesTotal.length > 0) {
      const mid = Math.floor(valuesTotal.length / 2);
      mediana = valuesTotal.length % 2 !== 0
        ? valuesTotal[mid]
        : Math.round(((valuesTotal[mid - 1] + valuesTotal[mid]) / 2) * 100) / 100;
    }

    const minTotal = valuesTotal.length > 0 ? valuesTotal[0] : 0;
    const maxTotal = valuesTotal.length > 0 ? valuesTotal[valuesTotal.length - 1] : 0;

    // Distribución en 4 tramos: 1.0-2.5, 2.6-3.5, 3.6-4.2, 4.3-5.0
    const tramos = [
      { rango: '1.0 - 2.5', min: 1.0, max: 2.5, count: 0 },
      { rango: '2.6 - 3.5', min: 2.501, max: 3.5, count: 0 },
      { rango: '3.6 - 4.2', min: 3.501, max: 4.2, count: 0 },
      { rango: '4.3 - 5.0', min: 4.201, max: 5.0, count: 0 }
    ];

    valuesTotal.forEach(v => {
      for (const t of tramos) {
        if (v >= t.min && v <= t.max) {
          t.count++;
          break;
        }
      }
    });

    const distribucion = tramos.map(t => ({
      rango: t.rango,
      count: t.count,
      pct: valuesTotal.length > 0 ? Math.round((t.count / valuesTotal.length) * 1000) / 10 : 0
    }));

    return {
      key: String(def.key),
      nombre: def.nombre,
      descripcion: def.descripcion,
      promedioTotal: promTotal,
      medianaTotal: mediana,
      minTotal,
      maxTotal,
      promedioAceptados: promAcept,
      promedioRechazados: promRech,
      diferencia: Math.round((promAcept - promRech) * 100) / 100,
      distribucion
    };
  });
}

export function calculateLabPerfilSeleccionados(records: LabRecord[]) {
  const aceptados = records.filter(
    r => r.evaluacion_completa === 'Si' && isLabAceptado(r.opinion_evaluador_lab)
  );
  const total = aceptados.length > 0 ? aceptados.length : 1;

  // 1. Univ Priorizada
  const prioCount = aceptados.filter(r => String(r.uni_prioritaria).toUpperCase() === 'SI').length;

  // 2. Bilingüe
  const bilingueCount = aceptados.filter(r => r.is_bilingual === true).length;

  // 3. STEM
  const stemCount = aceptados.filter(r => r.is_stem === true).length;

  // 4. STEM o Bilingüe
  const stemOrBilCount = aceptados.filter(r => r.is_stem || r.is_bilingual).length;

  // 5. STEM y Bilingüe
  const stemAndBilCount = aceptados.filter(r => r.is_stem && r.is_bilingual).length;

  // 6. Pregrado
  let profesional = 0;
  let licenciatura = 0;
  let otroPregrado = 0;
  aceptados.forEach(r => {
    const tp = String(r.tipo_pregrado || '').toLowerCase();
    if (tp.includes('licenciatura')) licenciatura++;
    else if (tp.includes('profesional')) profesional++;
    else otroPregrado++;
  });

  // 7. Enfoque
  let enfStemBil = 0;
  let enfStem = 0;
  let enfBil = 0;
  let enfNoNo = 0;
  aceptados.forEach(r => {
    if (r.is_stem && r.is_bilingual) enfStemBil++;
    else if (r.is_stem) enfStem++;
    else if (r.is_bilingual) enfBil++;
    else enfNoNo++;
  });

  // 8. Rangos de Edad (Nuevos rangos del spec: Menos de 24, 25 - 26, 27-28, Más de 29)
  let menos24 = 0;
  let de25a26 = 0;
  let de27a28 = 0;
  let mas29 = 0;
  aceptados.forEach(r => {
    const edad = typeof r.edad === 'number' ? r.edad : Number(r.edad);
    if (!isNaN(edad) && edad > 0) {
      if (edad <= 24) menos24++;
      else if (edad <= 26) de25a26++;
      else if (edad <= 28) de27a28++;
      else mas29++;
    } else {
      de25a26++;
    }
  });

  // 9. Género
  let fem = 0;
  let masc = 0;
  let otroGen = 0;
  aceptados.forEach(r => {
    const g = String(r.genero || '').toLowerCase();
    if (g.includes('femenino') || g === 'mujer') fem++;
    else if (g.includes('masculino') || g === 'hombre') masc++;
    else otroGen++;
  });

  // 10. Ciudades
  const cityMap = new Map<string, number>();
  aceptados.forEach(r => {
    const c = r.ciudad || 'Otras';
    cityMap.set(c, (cityMap.get(c) || 0) + 1);
  });

  const sortedCities = Array.from(cityMap.entries()).sort((a, b) => b[1] - a[1]);
  const maxCity = sortedCities.length > 0 ? sortedCities[0][1] : 1;

  const topCities = sortedCities.slice(0, 6);
  const remaining = sortedCities.slice(6);

  const cityItems: CityLeaderboardItem[] = topCities.map(([name, count], idx) => ({
    rank: idx + 1,
    label: name,
    count,
    pct: Math.round((count / total) * 1000) / 10,
    magnitudePct: Math.round((count / maxCity) * 100),
    isFoco: name === 'Cali' || name === 'Barranquilla' || name === 'Medellín'
  }));

  const remCount = remaining.reduce((a, b) => a + b[1], 0);
  if (remCount > 0) {
    cityItems.push({
      rank: topCities.length + 1,
      label: `Otras (${remaining.length})`,
      count: remCount,
      pct: Math.round((remCount / total) * 1000) / 10,
      magnitudePct: Math.round((remCount / maxCity) * 100),
      isFoco: false
    });
  }

  return {
    totalAceptados: total,
    prioCount,
    prioPct: Math.round((prioCount / total) * 1000) / 10,
    bilingueCount,
    bilinguePct: Math.round((bilingueCount / total) * 1000) / 10,
    stemCount,
    stemPct: Math.round((stemCount / total) * 1000) / 10,
    stemOrBilCount,
    stemOrBilPct: Math.round((stemOrBilCount / total) * 1000) / 10,
    stemAndBilCount,
    stemAndBilPct: Math.round((stemAndBilCount / total) * 1000) / 10,

    pregrado: [
      { label: 'Profesional', count: profesional, pct: Math.round((profesional / total) * 1000) / 10, color: '#0F766E' },
      { label: 'Licenciatura', count: licenciatura, pct: Math.round((licenciatura / total) * 1000) / 10, color: '#14B8A6' }
    ],

    enfoque: [
      { label: 'Bilingüe', count: enfBil, pct: Math.round((enfBil / total) * 1000) / 10, color: '#0D9488' },
      { label: 'STEM', count: enfStem, pct: Math.round((enfStem / total) * 1000) / 10, color: '#F59E0B' },
      { label: 'STEM y Bilingüe', count: enfStemBil, pct: Math.round((enfStemBil / total) * 1000) / 10, color: '#152238' },
      { label: 'No STEM no Bilingüe', count: enfNoNo, pct: Math.round((enfNoNo / total) * 1000) / 10, color: '#94A3B8' }
    ],

    edades: [
      { label: 'Menos de 24', sublabel: 'Jóvenes / Recién egresados', count: menos24, pct: Math.round((menos24 / total) * 1000) / 10, color: '#64748B' },
      { label: '25 - 26', sublabel: 'Rango temprano', count: de25a26, pct: Math.round((de25a26 / total) * 1000) / 10, color: '#0D9488' },
      { label: '27-28', sublabel: 'Rango intermedio', count: de27a28, pct: Math.round((de27a28 / total) * 1000) / 10, color: '#F59E0B' },
      { label: 'Más de 29', sublabel: 'Profesionales con trayectoria', count: mas29, pct: Math.round((mas29 / total) * 1000) / 10, color: '#152238' }
    ],

    genero: [
      { label: 'Femenino', count: fem, pct: Math.round((fem / total) * 1000) / 10, color: '#0D9488' },
      { label: 'Masculino', count: masc, pct: Math.round((masc / total) * 1000) / 10, color: '#152238' }
    ],

    ciudades: cityItems
  };
}

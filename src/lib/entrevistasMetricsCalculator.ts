import {
  EntrevistaRecord,
  EntrevistadorSummary,
  EvaluadorStatus,
  EntrevistasGeneralKpis,
  TopCandidatosFilterState,
  CombinablePerfilFilterState,
  EntrevistasResultadosBreakdown,
  PerfilFilterType,
  CategoryBreakdownItem,
  CityLeaderboardItem
} from '../types';

/**
 * Escala de semáforo para evaluadores de entrevistas:
 * - On track: % avance >= 80%
 * - Medio: 50% - 79%
 * - Atrasado: < 50%
 */
export function getEvaluadorStatus(avancePct: number): EvaluadorStatus {
  if (avancePct >= 80) return 'On track';
  if (avancePct >= 50) return 'Medio';
  return 'Atrasado';
}

/**
 * Limpia etiquetas HTML
 */
export function stripHtml(str?: string | null): string {
  if (!str) return '';
  return str.replace(/<[^>]*>?/gm, '').trim();
}

/**
 * Sub-categorías canónicas de Resultados de Entrevista
 */
export const OPINION_ENTREVISTA_VALORES = {
  ACEPTADO_DE_ACUERDO: 'ACEPTADO: De acuerdo',
  ACEPTADO_CREO_PASAR: 'ACEPTADO: Creo que debería pasar',
  ACEPTADO_FACTOR_ENIE: 'ACEPTADO: Tiene el factor "Ñ"',
  RECHAZADO_FUTURO: 'RECHAZADO: De acuerdo, pero podría ser Eco en el futuro',
  RECHAZADO_FIRME: 'RECHAZADO: firmemente de acuerdo'
};

/**
 * Valida si la opinión del evaluador corresponde a Aceptado
 */
export function isEntrevistaAceptado(opinion?: string | null): boolean {
  if (!opinion) return false;
  const clean = stripHtml(opinion).toUpperCase().trim();
  return clean.startsWith('ACEPTADO') || clean.includes('ACEPTAD');
}

/**
 * Valida si la opinión del evaluador corresponde a Rechazado
 */
export function isEntrevistaRechazado(opinion?: string | null): boolean {
  if (!opinion) return false;
  const clean = stripHtml(opinion).toUpperCase().trim();
  return clean.startsWith('RECHAZADO') || clean.includes('RECHAZAD');
}

/**
 * Valida si el candidato tiene un evaluador asignado activo
 */
export function isEntrevistaAsignada(e: EntrevistaRecord): boolean {
  if (!e.evaluador) return false;
  const clean = e.evaluador.trim().toLowerCase();
  return clean !== '' && clean !== 'sin asignar' && clean !== 'pendiente' && clean !== 'no asignado';
}

/**
 * Valida si la entrevista se encuentra completada
 */
export function isEntrevistaCompletada(e: EntrevistaRecord): boolean {
  if (e.completado === true) return true;
  const op = stripHtml(e.opinion_evaluador);
  return Boolean(op && op.trim() !== '' && !op.toLowerCase().includes('pendiente'));
}

/**
 * Normaliza y clasifica si el candidato proviene de universidad priorizada
 */
export function isEntrevistaUniPrioritaria(e: EntrevistaRecord): boolean {
  const val = String(e.uni_prioritaria || '').toUpperCase().trim();
  return val === 'SI' || val === 'SÍ' || val === 'TRUE' || val === 'PRIORIZADA';
}

/**
 * Normaliza y clasifica si el candidato es bilingüe (B2+)
 */
export function isEntrevistaBilingual(e: EntrevistaRecord): boolean {
  if (typeof e.is_bilingual === 'boolean') return e.is_bilingual;
  const val = String(e.is_bilingual || '').toUpperCase().trim();
  if (val === 'TRUE' || val === 'SI' || val === 'SÍ' || val === '1') return true;
  const enf = String(e.enfoque || '').toLowerCase();
  return enf.includes('bilingüe') || enf.includes('bilingue');
}

/**
 * Normaliza y clasifica si el candidato es STEM
 */
export function isEntrevistaStem(e: EntrevistaRecord): boolean {
  if (typeof e.is_stem === 'boolean') return e.is_stem;
  const val = String(e.is_stem || '').toUpperCase().trim();
  if (val === 'TRUE' || val === 'SI' || val === 'SÍ' || val === '1') return true;
  const enf = String(e.enfoque || '').toLowerCase();
  return enf.includes('stem');
}

export function isEntrevistaStemOrBilingual(e: EntrevistaRecord): boolean {
  return isEntrevistaStem(e) || isEntrevistaBilingual(e);
}

export function isEntrevistaStemAndBilingual(e: EntrevistaRecord): boolean {
  return isEntrevistaStem(e) && isEntrevistaBilingual(e);
}

/**
 * Definición canónica de Top Candidatos:
 * (ruta = STEM OR es_bilingue) AND universidad_priorizada = true
 */
export function isTopCandidatoBase(e: EntrevistaRecord): boolean {
  const isPrio = isEntrevistaUniPrioritaria(e);
  const isStemOrBil = isEntrevistaStemOrBilingual(e);
  return isStemOrBil && isPrio;
}

/**
 * Validador para el selector interactivo de categorías combinables de Top Candidatos
 */
export function matchesTopCandidatosFilter(
  e: EntrevistaRecord,
  filters: TopCandidatosFilterState
): boolean {
  const hasActiveFilters =
    filters.menores30 ||
    filters.menores30Bilingue ||
    filters.menores30Stem ||
    filters.universidadPriorizada ||
    filters.universidadNoPriorizada;

  // Si no hay filtros marcados, responde a la definición base
  if (!hasActiveFilters) {
    return isTopCandidatoBase(e);
  }

  const edadNum = typeof e.edad === 'number' ? e.edad : Number(e.edad);
  const isMenor30 = !isNaN(edadNum) && edadNum > 0 ? edadNum < 30 : false;
  const isBiling = isEntrevistaBilingual(e);
  const isStemVal = isEntrevistaStem(e);
  const isPrio = isEntrevistaUniPrioritaria(e);

  // Verificaciones condicionales para filtros activos (AND combinable)
  if (filters.menores30 && !isMenor30) {
    return false;
  }
  if (filters.menores30Bilingue && !(isMenor30 && isBiling)) {
    return false;
  }
  if (filters.menores30Stem && !(isMenor30 && isStemVal)) {
    return false;
  }
  if (filters.universidadPriorizada && !isPrio) {
    return false;
  }
  if (filters.universidadNoPriorizada && isPrio) {
    return false;
  }

  return true;
}

/**
 * Calcula los 4 KPIs principales de Nivel 1 para Entrevistas
 */
export function calculateEntrevistasGeneralKpis(
  entrevistas: EntrevistaRecord[],
  filters?: TopCandidatosFilterState,
  metaGlobalProp?: number
): EntrevistasGeneralKpis {
  const totalPasaronEntrevista = entrevistas.length;
  const asignadas = entrevistas.filter(isEntrevistaAsignada);
  const totalAsignados = asignadas.length > 0 ? asignadas.length : (entrevistas.length > 0 ? entrevistas.length : 180);

  const completadas = entrevistas.filter(isEntrevistaCompletada);
  const completadasCount = completadas.length;

  const safeMeta = metaGlobalProp && metaGlobalProp > 0 ? metaGlobalProp : totalAsignados;
  const avanceGlobalPct = safeMeta > 0 ? Math.round((completadasCount / safeMeta) * 1000) / 10 : 0;

  const evaluados = completadas.filter(e => Boolean(e.opinion_evaluador));
  const totalEvaluados = evaluados.length > 0 ? evaluados.length : completadasCount;

  const aceptados = evaluados.filter(e => isEntrevistaAceptado(e.opinion_evaluador));
  const aceptadosCount = aceptados.length;
  const rechazados = evaluados.filter(e => isEntrevistaRechazado(e.opinion_evaluador));
  const rechazadosCount = rechazados.length;

  const tasaExitoPct = totalEvaluados > 0 ? Math.round((aceptadosCount / totalEvaluados) * 1000) / 10 : 0;

  const evaluadoresSummary = calculateEntrevistadoresSummary(entrevistas);
  const evaluadoresAtrasados = evaluadoresSummary.filter(ev => ev.estado === 'Atrasado');
  const evaluadoresAtrasadosCount = evaluadoresAtrasados.length;
  const evaluadoresAtrasadosStaffCount = evaluadoresAtrasados.filter(ev => ev.esStaff).length;
  const evaluadoresAtrasadosExternosCount = evaluadoresAtrasados.filter(ev => !ev.esStaff).length;

  const totalStaffEvaluadores = evaluadoresSummary.filter(ev => ev.esStaff).length;
  const totalExternosEvaluadores = evaluadoresSummary.filter(ev => !ev.esStaff).length;

  // Top Candidatos base
  const topCandidatosBase = evaluados.filter(isTopCandidatoBase);
  const topCandidatosCount = topCandidatosBase.length;
  const topCandidatosPct = totalEvaluados > 0 ? Math.round((topCandidatosCount / totalEvaluados) * 1000) / 10 : 0;

  // Top Candidatos con filtro interactivo
  const effectiveFilters = filters || {
    menores30: false,
    menores30Bilingue: false,
    menores30Stem: false,
    universidadPriorizada: false,
    universidadNoPriorizada: false
  };
  const topCandidatosFiltered = evaluados.filter(e => matchesTopCandidatosFilter(e, effectiveFilters));
  const topCandidatosFilteredCount = topCandidatosFiltered.length;
  const topCandidatosFilteredPct = totalEvaluados > 0 ? Math.round((topCandidatosFilteredCount / totalEvaluados) * 1000) / 10 : 0;

  return {
    completadasCount,
    metaGlobal: safeMeta,
    totalAsignados,
    totalPasaronEntrevista,
    avanceGlobalPct,
    aceptadosCount,
    rechazadosCount,
    totalEvaluados,
    tasaExitoPct,
    evaluadoresAtrasadosCount,
    evaluadoresAtrasadosStaffCount,
    evaluadoresAtrasadosExternosCount,
    totalEvaluadores: evaluadoresSummary.length,
    totalStaffEvaluadores,
    totalExternosEvaluadores,
    topCandidatosCount,
    topCandidatosPct,
    topCandidatosFilteredCount,
    topCandidatosFilteredPct
  };
}

/**
 * Lista de evaluadores confirmados como Staff LIDERA
 */
export const KNOWN_STAFF_EVALUADORES = [
  'juan david',
  'ana medina',
  'anamaría torres',
  'anamaria torres',
  'charid badillo',
  'edwin cuellar',
  'laura méndez',
  'laura mendez',
  'luis del castillo',
  'mayra lópez',
  'mayra lopez',
  'natalia rodríguez',
  'natalia rodriguez',
  'rocío navarro',
  'rocio navarro',
  'ruth puello',
  'zoila jiménez',
  'zoila jimenez'
];

/**
 * Valida si un evaluador pertenece al Staff
 */
export function isEvaluadorStaff(evaluador?: string | null, explicitEsStaff?: boolean | null): boolean {
  if (explicitEsStaff === true) return true;
  if (!evaluador) return false;
  const name = evaluador.toLowerCase().trim();
  return KNOWN_STAFF_EVALUADORES.some(staffName => name === staffName || name.includes(staffName) || staffName.includes(name));
}

/**
 * Resumen operativo por evaluador (Nivel 3) - Excluye registros no asignados
 */
export function calculateEntrevistadoresSummary(entrevistas: EntrevistaRecord[]): EntrevistadorSummary[] {
  const map = new Map<string, { asignados: number; completados: number; esStaff: boolean }>();

  entrevistas.forEach(e => {
    if (!isEntrevistaAsignada(e)) return;
    const ev = (e.evaluador || '').trim();
    const isStaff = isEvaluadorStaff(ev, e.es_staff);
    if (!map.has(ev)) {
      map.set(ev, { asignados: 0, completados: 0, esStaff: isStaff });
    }
    const curr = map.get(ev)!;
    curr.asignados += 1;
    if (isEntrevistaCompletada(e)) {
      curr.completados += 1;
    }
    if (isStaff) {
      curr.esStaff = true;
    }
  });

  const list: EntrevistadorSummary[] = [];
  map.forEach((data, evaluador) => {
    const avancePct = data.asignados > 0 ? Math.round((data.completados / data.asignados) * 100) : 0;
    list.push({
      evaluador,
      esStaff: data.esStaff,
      asignados: data.asignados,
      completados: data.completados,
      avancePct,
      estado: getEvaluadorStatus(avancePct)
    });
  });

  // Ordenar de MENOR a MAYOR avance para priorizar seguimiento
  list.sort((a, b) => {
    if (a.avancePct !== b.avancePct) {
      return a.avancePct - b.avancePct;
    }
    return b.asignados - a.asignados;
  });

  return list;
}

/**
 * Normaliza y mapea la categoría de opinión del evaluador en los 5 valores reales
 */
export function normalizeOpinionCategory(raw: string | null | undefined): string {
  const clean = stripHtml(raw).trim();
  if (!clean) return 'Sin registrar';

  const lower = clean.toLowerCase();

  // Aceptados
  if (lower.includes('ñ') || lower.includes('factor ñ') || lower.includes('factor "ñ"') || lower.includes('factor ""ñ""')) {
    return OPINION_ENTREVISTA_VALORES.ACEPTADO_FACTOR_ENIE;
  }
  if (lower.includes('creo que debería pasar') || lower.includes('deberia pasar')) {
    return OPINION_ENTREVISTA_VALORES.ACEPTADO_CREO_PASAR;
  }
  if (lower.includes('aceptado') && (lower.includes('acuerdo') || lower.includes('de acuerdo'))) {
    return OPINION_ENTREVISTA_VALORES.ACEPTADO_DE_ACUERDO;
  }
  if (lower.startsWith('aceptado')) {
    return OPINION_ENTREVISTA_VALORES.ACEPTADO_DE_ACUERDO;
  }

  // Rechazados
  if (lower.includes('futuro') || lower.includes('eco en el futuro')) {
    return OPINION_ENTREVISTA_VALORES.RECHAZADO_FUTURO;
  }
  if (lower.includes('firmemente') || lower.includes('firmemente de acuerdo')) {
    return OPINION_ENTREVISTA_VALORES.RECHAZADO_FIRME;
  }
  if (lower.startsWith('rechazado')) {
    return OPINION_ENTREVISTA_VALORES.RECHAZADO_FIRME;
  }

  return clean;
}

/**
 * Desglose de Resultados (Nivel 2.1) en 2 bloques: Aceptado (3 subcats) vs Rechazado (2 subcats)
 */
export function calculateResultadosBreakdown(entrevistas: EntrevistaRecord[]): EntrevistasResultadosBreakdown {
  const completadas = entrevistas.filter(isEntrevistaCompletada);
  const evaluados = completadas.filter(e => Boolean(e.opinion_evaluador));
  const totalEvaluados = evaluados.length > 0 ? evaluados.length : completadas.length;

  const aceptadosMap = new Map<string, number>([
    [OPINION_ENTREVISTA_VALORES.ACEPTADO_DE_ACUERDO, 0],
    [OPINION_ENTREVISTA_VALORES.ACEPTADO_CREO_PASAR, 0],
    [OPINION_ENTREVISTA_VALORES.ACEPTADO_FACTOR_ENIE, 0]
  ]);

  const rechazadosMap = new Map<string, number>([
    [OPINION_ENTREVISTA_VALORES.RECHAZADO_FUTURO, 0],
    [OPINION_ENTREVISTA_VALORES.RECHAZADO_FIRME, 0]
  ]);

  let aceptadosCount = 0;
  let rechazadosCount = 0;

  evaluados.forEach(e => {
    const norm = normalizeOpinionCategory(e.opinion_evaluador);
    if (isEntrevistaAceptado(e.opinion_evaluador)) {
      aceptadosCount++;
      aceptadosMap.set(norm, (aceptadosMap.get(norm) || 0) + 1);
    } else if (isEntrevistaRechazado(e.opinion_evaluador)) {
      rechazadosCount++;
      rechazadosMap.set(norm, (rechazadosMap.get(norm) || 0) + 1);
    }
  });

  const aceptadosPct = totalEvaluados > 0 ? Math.round((aceptadosCount / totalEvaluados) * 1000) / 10 : 0;
  const rechazadosPct = totalEvaluados > 0 ? Math.round((rechazadosCount / totalEvaluados) * 1000) / 10 : 0;

  const aceptadosCategories: CategoryBreakdownItem[] = [
    {
      label: 'De acuerdo',
      count: aceptadosMap.get(OPINION_ENTREVISTA_VALORES.ACEPTADO_DE_ACUERDO) || 0,
      pct: totalEvaluados > 0 ? Math.round(((aceptadosMap.get(OPINION_ENTREVISTA_VALORES.ACEPTADO_DE_ACUERDO) || 0) / totalEvaluados) * 1000) / 10 : 0,
      isPass: true
    },
    {
      label: 'Creo que debería pasar',
      count: aceptadosMap.get(OPINION_ENTREVISTA_VALORES.ACEPTADO_CREO_PASAR) || 0,
      pct: totalEvaluados > 0 ? Math.round(((aceptadosMap.get(OPINION_ENTREVISTA_VALORES.ACEPTADO_CREO_PASAR) || 0) / totalEvaluados) * 1000) / 10 : 0,
      isPass: true
    },
    {
      label: 'Tiene el factor "Ñ"',
      count: aceptadosMap.get(OPINION_ENTREVISTA_VALORES.ACEPTADO_FACTOR_ENIE) || 0,
      pct: totalEvaluados > 0 ? Math.round(((aceptadosMap.get(OPINION_ENTREVISTA_VALORES.ACEPTADO_FACTOR_ENIE) || 0) / totalEvaluados) * 1000) / 10 : 0,
      isPass: true
    }
  ];

  const rechazadosCategories: CategoryBreakdownItem[] = [
    {
      label: 'De acuerdo, pero podría ser Eco en el futuro',
      count: rechazadosMap.get(OPINION_ENTREVISTA_VALORES.RECHAZADO_FUTURO) || 0,
      pct: totalEvaluados > 0 ? Math.round(((rechazadosMap.get(OPINION_ENTREVISTA_VALORES.RECHAZADO_FUTURO) || 0) / totalEvaluados) * 1000) / 10 : 0,
      isPass: false
    },
    {
      label: 'Firmemente de acuerdo',
      count: rechazadosMap.get(OPINION_ENTREVISTA_VALORES.RECHAZADO_FIRME) || 0,
      pct: totalEvaluados > 0 ? Math.round(((rechazadosMap.get(OPINION_ENTREVISTA_VALORES.RECHAZADO_FIRME) || 0) / totalEvaluados) * 1000) / 10 : 0,
      isPass: false
    }
  ];

  return {
    totalEvaluados,
    aceptadosCount,
    aceptadosPct,
    rechazadosCount,
    rechazadosPct,
    aceptadosCategories,
    rechazadosCategories
  };
}

/**
 * Calcula estadísticas de Perfil de Seleccionados (Aceptados) (Nivel 2.2) con soporte de filtros concatenables
 */
export function calculatePerfilCombinadoStat(
  entrevistas: EntrevistaRecord[],
  totalCumplenMinimos: number,
  filters: CombinablePerfilFilterState
): {
  filtroLabel: string;
  seleccionadosCount: number;
  totalSeleccionados: number;
  evaluadosNoSeleccionadosCount: number;
  totalEvaluadosConPerfilCount: number;
  totalCumplenMinimos: number;
  pctSeleccionadosSobreSeleccionados: number;
  pctBarraSeleccionados: number;
  pctEvaluadosNoSelSobreSeleccionados: number;
  hasActiveFilters: boolean;
} {
  const safeTotalMinimos = totalCumplenMinimos > 0 ? totalCumplenMinimos : 1138;
  const completadas = entrevistas.filter(isEntrevistaCompletada);
  const seleccionados = completadas.filter(e => isEntrevistaAceptado(e.opinion_evaluador));
  const totalSeleccionados = seleccionados.length > 0 ? seleccionados.length : 1;

  const hasActiveFilters =
    filters.menores30 ||
    filters.stem ||
    filters.bilingue ||
    filters.stemOrBilingue ||
    filters.uniPriorizada;

  // Evaluador de concordancia con filtros activos combinados con AND
  const matchesCombinableFilter = (e: EntrevistaRecord): boolean => {
    if (!hasActiveFilters) return true;

    const edadNum = typeof e.edad === 'number' ? e.edad : Number(e.edad);
    const isMenor30 = !isNaN(edadNum) && edadNum > 0 ? edadNum < 30 : false;
    const isPrio = isEntrevistaUniPrioritaria(e);
    const isBil = isEntrevistaBilingual(e);
    const isStm = isEntrevistaStem(e);
    const isStmOrBil = isEntrevistaStemOrBilingual(e);

    if (filters.menores30 && !isMenor30) return false;
    if (filters.uniPriorizada && !isPrio) return false;
    if (filters.stemOrBilingue && !isStmOrBil) return false;
    if (filters.stem && !isStm) return false;
    if (filters.bilingue && !isBil) return false;

    return true;
  };

  let seleccionadosCount = 0;
  let evaluadosNoSeleccionadosCount = 0;

  completadas.forEach(e => {
    if (matchesCombinableFilter(e)) {
      if (isEntrevistaAceptado(e.opinion_evaluador)) {
        seleccionadosCount++;
      } else {
        evaluadosNoSeleccionadosCount++;
      }
    }
  });

  const totalEvaluadosConPerfilCount = seleccionadosCount + evaluadosNoSeleccionadosCount;
  const pctSeleccionadosSobreSeleccionados = totalSeleccionados > 0
    ? Math.round((seleccionadosCount / totalSeleccionados) * 1000) / 10
    : 0;
  const pctEvaluadosNoSelSobreSeleccionados = totalSeleccionados > 0
    ? Math.round((evaluadosNoSeleccionadosCount / totalSeleccionados) * 1000) / 10
    : 0;

  const pctBarraSeleccionados = Math.min(100, pctSeleccionadosSobreSeleccionados);

  // Generar label dinámico según la combinación
  const activeLabels: string[] = [];
  if (filters.menores30) activeLabels.push('Menores de 30');
  if (filters.stem) activeLabels.push('STEM');
  if (filters.bilingue) activeLabels.push('Bilingüe');
  if (filters.stemOrBilingue) activeLabels.push('STEM o Bilingüe');
  if (filters.uniPriorizada) activeLabels.push('Univ. Priorizada');

  const filtroLabel = activeLabels.length > 0
    ? activeLabels.join(' + ')
    : 'Todos los Aceptados (sin filtros)';

  return {
    filtroLabel,
    seleccionadosCount,
    totalSeleccionados,
    evaluadosNoSeleccionadosCount,
    totalEvaluadosConPerfilCount,
    totalCumplenMinimos: safeTotalMinimos,
    pctSeleccionadosSobreSeleccionados,
    pctBarraSeleccionados,
    pctEvaluadosNoSelSobreSeleccionados,
    hasActiveFilters
  };
}

/**
 * Calcula estadísticas de Perfil de Seleccionados (Aceptados) (Nivel 2.2)
 */
export function calculatePerfilSeleccionadosStat(
  entrevistas: EntrevistaRecord[],
  totalCumplenMinimos: number,
  filtro: PerfilFilterType
): {
  filtro: PerfilFilterType;
  filtroLabel: string;
  seleccionadosCount: number;
  totalSeleccionados: number;
  evaluadosNoSeleccionadosCount: number;
  totalEvaluadosConPerfilCount: number;
  totalCumplenMinimos: number;
  pctSeleccionadosSobreSeleccionados: number;
  pctBarraSeleccionados: number;
  pctEvaluadosNoSelSobreSeleccionados: number;
} {
  const safeTotalMinimos = totalCumplenMinimos > 0 ? totalCumplenMinimos : 1138;
  const completadas = entrevistas.filter(isEntrevistaCompletada);
  const seleccionados = completadas.filter(e => isEntrevistaAceptado(e.opinion_evaluador));
  const totalSeleccionados = seleccionados.length > 0 ? seleccionados.length : 1;

  const matchesFilter = (e: EntrevistaRecord): boolean => {
    if (filtro === 'uni_prioritaria') return isEntrevistaUniPrioritaria(e);
    if (filtro === 'bilingue') return isEntrevistaBilingual(e);
    if (filtro === 'stem') return isEntrevistaStem(e);
    if (filtro === 'stem_or_bilingue') return isEntrevistaStemOrBilingual(e);
    if (filtro === 'stem_and_bilingue') return isEntrevistaStemAndBilingual(e);
    return true;
  };

  let seleccionadosCount = 0;
  let evaluadosNoSeleccionadosCount = 0;

  completadas.forEach(e => {
    if (matchesFilter(e)) {
      if (isEntrevistaAceptado(e.opinion_evaluador)) {
        seleccionadosCount++;
      } else {
        evaluadosNoSeleccionadosCount++;
      }
    }
  });

  const totalEvaluadosConPerfilCount = seleccionadosCount + evaluadosNoSeleccionadosCount;
  const pctSeleccionadosSobreSeleccionados = totalSeleccionados > 0
    ? Math.round((seleccionadosCount / totalSeleccionados) * 1000) / 10
    : 0;
  const pctEvaluadosNoSelSobreSeleccionados = totalSeleccionados > 0
    ? Math.round((evaluadosNoSeleccionadosCount / totalSeleccionados) * 1000) / 10
    : 0;

  const pctBarraSeleccionados = Math.min(100, pctSeleccionadosSobreSeleccionados);

  const labelsMap: Record<PerfilFilterType, string> = {
    uni_prioritaria: 'Universidad Priorizada',
    bilingue: 'Bilingüe',
    stem: 'STEM',
    stem_or_bilingue: 'STEM o Bilingüe (OR)',
    stem_and_bilingue: 'STEM y Bilingüe (AND)'
  };

  return {
    filtro,
    filtroLabel: labelsMap[filtro],
    seleccionadosCount,
    totalSeleccionados,
    evaluadosNoSeleccionadosCount,
    totalEvaluadosConPerfilCount,
    totalCumplenMinimos: safeTotalMinimos,
    pctSeleccionadosSobreSeleccionados,
    pctBarraSeleccionados,
    pctEvaluadosNoSelSobreSeleccionados
  };
}

/**
 * 1. Desglose de Pregrado sobre Aceptados
 */
export function calculateTipoPregradoBreakdown(entrevistas: EntrevistaRecord[]): {
  items: Array<{ label: string; count: number; pct: number; color: string }>;
  totalSeleccionados: number;
} {
  const completadas = entrevistas.filter(isEntrevistaCompletada);
  const seleccionados = completadas.filter(e => isEntrevistaAceptado(e.opinion_evaluador));
  const total = seleccionados.length > 0 ? seleccionados.length : 1;

  let profesionalCount = 0;
  let licenciaturaCount = 0;
  let otroCount = 0;

  seleccionados.forEach(s => {
    const raw = String(s.tipo_pregrado || '').toLowerCase().trim();
    if (raw.includes('licenciatura')) {
      licenciaturaCount++;
    } else if (raw.includes('profesional')) {
      profesionalCount++;
    } else {
      otroCount++;
    }
  });

  const items = [
    {
      label: 'Profesional',
      count: profesionalCount,
      pct: Math.round((profesionalCount / total) * 1000) / 10,
      color: '#152238' // Deep Navy
    },
    {
      label: 'Licenciatura',
      count: licenciaturaCount,
      pct: Math.round((licenciaturaCount / total) * 1000) / 10,
      color: '#2E9E82' // Teal / Emerald
    }
  ];

  if (otroCount > 0) {
    items.push({
      label: 'No Plazable / Otro',
      count: otroCount,
      pct: Math.round((otroCount / total) * 1000) / 10,
      color: '#94A3B8'
    });
  }

  return { items, totalSeleccionados: total };
}

/**
 * 2. Desglose de Enfoque/STEM (4 categorías) sobre Aceptados
 */
export function calculateEnfoqueBreakdown(entrevistas: EntrevistaRecord[]): {
  items: Array<{ label: string; count: number; pct: number; color: string }>;
  totalSeleccionados: number;
} {
  const completadas = entrevistas.filter(isEntrevistaCompletada);
  const seleccionados = completadas.filter(e => isEntrevistaAceptado(e.opinion_evaluador));
  const total = seleccionados.length > 0 ? seleccionados.length : 1;

  let stemAndBilCount = 0;
  let stemCount = 0;
  let bilCount = 0;
  let noStemNoBilCount = 0;

  seleccionados.forEach(s => {
    const enf = String(s.enfoque || '').trim();
    if (enf === 'STEM y Bilingüe') {
      stemAndBilCount++;
    } else if (enf === 'STEM') {
      stemCount++;
    } else if (enf === 'Bilingüe') {
      bilCount++;
    } else {
      noStemNoBilCount++;
    }
  });

  const items = [
    {
      label: 'Bilingüe',
      count: bilCount,
      pct: Math.round((bilCount / total) * 1000) / 10,
      color: '#2E9E82' // Emerald
    },
    {
      label: 'STEM',
      count: stemCount,
      pct: Math.round((stemCount / total) * 1000) / 10,
      color: '#F2A900' // Amber
    },
    {
      label: 'STEM y Bilingüe',
      count: stemAndBilCount,
      pct: Math.round((stemAndBilCount / total) * 1000) / 10,
      color: '#152238' // Navy
    },
    {
      label: 'No STEM no Bilingüe',
      count: noStemNoBilCount,
      pct: Math.round((noStemNoBilCount / total) * 1000) / 10,
      color: '#94A3B8' // Slate
    }
  ];

  return { items, totalSeleccionados: total };
}

/**
 * 3. Desglose de Rangos de Edad (<22, 22 a 29, >29) sobre Aceptados
 */
export function calculateEdadesBreakdown(entrevistas: EntrevistaRecord[]): {
  items: Array<{ label: string; count: number; pct: number; color: string; sublabel: string }>;
  totalSeleccionados: number;
} {
  const completadas = entrevistas.filter(isEntrevistaCompletada);
  const seleccionados = completadas.filter(e => isEntrevistaAceptado(e.opinion_evaluador));
  const total = seleccionados.length > 0 ? seleccionados.length : 1;

  let menor22 = 0;
  let de22a29 = 0;
  let mayor29 = 0;

  seleccionados.forEach(s => {
    const edad = typeof s.edad === 'number' ? s.edad : Number(s.edad);
    if (!isNaN(edad) && edad > 0) {
      if (edad < 22) menor22++;
      else if (edad <= 29) de22a29++;
      else mayor29++;
    } else {
      de22a29++;
    }
  });

  const items = [
    {
      label: '< 22 años',
      sublabel: 'Jóvenes / Recién egresados',
      count: menor22,
      pct: Math.round((menor22 / total) * 1000) / 10,
      color: '#64748B'
    },
    {
      label: '22 a 29 años',
      sublabel: 'Rango central de convocatoria',
      count: de22a29,
      pct: Math.round((de22a29 / total) * 1000) / 10,
      color: '#2E9E82' // Emerald
    },
    {
      label: '> 29 años',
      sublabel: 'Profesionales con trayectoria',
      count: mayor29,
      pct: Math.round((mayor29 / total) * 1000) / 10,
      color: '#152238' // Navy
    }
  ];

  return { items, totalSeleccionados: total };
}

/**
 * 4. Desglose de Género sobre Aceptados
 */
export function calculateGeneroBreakdown(entrevistas: EntrevistaRecord[]): {
  items: Array<{ label: string; count: number; pct: number; color: string }>;
  totalSeleccionados: number;
} {
  const completadas = entrevistas.filter(isEntrevistaCompletada);
  const seleccionados = completadas.filter(e => isEntrevistaAceptado(e.opinion_evaluador));
  const total = seleccionados.length > 0 ? seleccionados.length : 1;

  let fem = 0;
  let masc = 0;
  let otro = 0;

  seleccionados.forEach(s => {
    const gen = String(s.genero || '').toLowerCase().trim();
    if (gen.includes('femenino') || gen === 'mujer') {
      fem++;
    } else if (gen.includes('masculino') || gen === 'hombre') {
      masc++;
    } else {
      otro++;
    }
  });

  const items = [
    {
      label: 'Femenino',
      count: fem,
      pct: Math.round((fem / total) * 1000) / 10,
      color: '#2E9E82' // Emerald
    },
    {
      label: 'Masculino',
      count: masc,
      pct: Math.round((masc / total) * 1000) / 10,
      color: '#152238' // Navy
    }
  ];

  if (otro > 0) {
    items.push({
      label: 'Trans / Diversidad / Otro',
      count: otro,
      pct: Math.round((otro / total) * 1000) / 10,
      color: '#F2A900' // Amber
    });
  }

  return { items, totalSeleccionados: total };
}

/**
 * Normaliza nombres de ciudades
 */
export function normalizeCityName(raw: string | null | undefined): string {
  if (!raw) return 'Otras ciudades';
  const trimmed = raw.trim();
  const lower = trimmed.toLowerCase();
  if (lower.includes('cali')) return 'Cali';
  if (lower.includes('bogot')) return 'Bogotá, D.C.';
  if (lower.includes('medell')) return 'Medellín';
  if (lower.includes('barranquilla')) return 'Barranquilla';
  if (lower.includes('cúcuta') || lower.includes('cucuta')) return 'Cúcuta';
  if (lower.includes('pasto')) return 'Pasto';
  if (lower.includes('palmira')) return 'Palmira';
  if (lower.includes('bucaramanga')) return 'Bucaramanga';
  if (lower.includes('pereira')) return 'Pereira';
  if (lower.includes('ipiales')) return 'Ipiales';
  if (lower.includes('neiva')) return 'Neiva';
  if (lower.includes('manizales')) return 'Manizales';
  if (lower.includes('popay')) return 'Popayán';
  return trimmed;
}

/**
 * 5. Desglose de Ciudades de Nacimiento en Ranking Territorial
 */
export function calculateCiudadesBreakdown(entrevistas: EntrevistaRecord[]): {
  items: CityLeaderboardItem[];
  totalSeleccionados: number;
  maxCityCount: number;
  focoCitiesCount: number;
  focoCitiesPct: number;
} {
  const completadas = entrevistas.filter(isEntrevistaCompletada);
  const seleccionados = completadas.filter(e => isEntrevistaAceptado(e.opinion_evaluador));
  const total = seleccionados.length > 0 ? seleccionados.length : 1;

  const cityMap = new Map<string, number>();

  seleccionados.forEach(s => {
    const name = normalizeCityName(s.ciudad);
    cityMap.set(name, (cityMap.get(name) || 0) + 1);
  });

  const sortedCities = Array.from(cityMap.entries()).sort((a, b) => b[1] - a[1]);
  const maxCityCount = sortedCities.length > 0 ? sortedCities[0][1] : 1;

  const topCutoff = 7;
  const topCities = sortedCities.slice(0, topCutoff);
  const remainingCities = sortedCities.slice(topCutoff);

  const items: CityLeaderboardItem[] = [];

  topCities.forEach(([name, count], index) => {
    const isFoco = name === 'Cali' || name === 'Barranquilla' || name === 'Medellín';
    const pct = Math.round((count / total) * 1000) / 10;
    const magnitudePct = Math.round((count / maxCityCount) * 100);
    items.push({
      rank: index + 1,
      label: name,
      count,
      pct,
      magnitudePct,
      isFoco
    });
  });

  const remainingCount = remainingCities.reduce((acc, curr) => acc + curr[1], 0);
  if (remainingCount > 0) {
    const pct = Math.round((remainingCount / total) * 1000) / 10;
    const magnitudePct = Math.round((remainingCount / maxCityCount) * 100);
    items.push({
      rank: topCities.length + 1,
      label: `Otras (${remainingCities.length} ciudades)`,
      count: remainingCount,
      pct,
      magnitudePct: Math.min(100, magnitudePct),
      isFoco: false
    });
  }

  const caliCount = cityMap.get('Cali') || 0;
  const barCount = cityMap.get('Barranquilla') || 0;
  const medCount = cityMap.get('Medellín') || 0;
  const focoCitiesCount = caliCount + barCount + medCount;
  const focoCitiesPct = Math.round((focoCitiesCount / total) * 1000) / 10;

  return {
    items,
    totalSeleccionados: total,
    maxCityCount,
    focoCitiesCount,
    focoCitiesPct
  };
}

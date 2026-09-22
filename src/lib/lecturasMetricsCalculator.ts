import {
  LecturaRecord,
  EvaluadorSummary,
  EvaluadorStatus,
  LecturasGeneralKpis,
  PerfilFilterType,
  CategoryBreakdownItem
} from '../types';

/**
 * Escala de semáforo confirmada para evaluadores:
 * - On track: % avance >= 80%
 * - Medio: 50% - 79%
 * - Atrasado: < 50%
 * (Criterio estándar confirmado para seguimiento operativo)
 */
export function getEvaluadorStatus(avancePct: number): EvaluadorStatus {
  if (avancePct >= 80) return 'On track';
  if (avancePct >= 50) return 'Medio';
  return 'Atrasado';
}

/**
 * Limpia etiquetas HTML (como <img ... /> que vienen de fórmulas de Salesforce)
 */
export function stripHtml(str?: string | null): string {
  if (!str) return '';
  return str.replace(/<[^>]*>?/gm, '').trim();
}

/**
 * Valida si la opinión del evaluador corresponde a recomendar que pase a entrevista.
 * Soporta 'Me gustaría que pase al día de entrevista', 'Recomienda que pase al día de entrevista' y normalizaciones.
 */
export function isEvaluadorRecomiendaPasar(opinion?: string | null): boolean {
  if (!opinion) return false;
  const clean = stripHtml(opinion).toLowerCase().trim();
  if (
    clean.includes('no pasa') ||
    clean.includes('rechaza') ||
    clean.includes('descart') ||
    clean.includes('descalific') ||
    clean.includes('plagio')
  ) {
    return false;
  }
  return clean.includes('recomienda') || clean.includes('pase') || clean.includes('entrevista') || clean === 'si';
}

/**
 * Valida si la recomendación del modelo cuenta como 'Pasa'.
 * Categorías confirmadas que pasan: {"Recomienda pasar", "Tiene factor Ñ"}.
 */
export function isModeloRecomiendaPasar(rec?: string | null): boolean {
  if (!rec) return false;
  const clean = stripHtml(rec).toLowerCase().trim();
  if (
    clean.includes('rechazar') ||
    clean.includes('rechazo') ||
    clean.includes('comité') ||
    clean.includes('comite')
  ) {
    return false;
  }
  // 'Tiene factor Ñ' o 'factor ñ'
  if (clean.includes('factor ñ') || clean.includes('factor n')) {
    return true;
  }
  // 'Recomienda pasar'
  if (clean.includes('pasar') && !clean.includes('no')) {
    return true;
  }
  return false;
}

/**
 * Normaliza y clasifica si el candidato leido proviene de universidad priorizada.
 */
export function isLecturaUniPrioritaria(l: LecturaRecord): boolean {
  const val = String(l.uni_prioritaria || '').toUpperCase().trim();
  return val === 'SI' || val === 'SÍ' || val === 'TRUE' || val === 'PRIORIZADA';
}

/**
 * Normaliza y clasifica si el candidato leido es bilingüe.
 */
export function isLecturaBilingual(l: LecturaRecord): boolean {
  if (typeof l.is_bilingual === 'boolean') return l.is_bilingual;
  const val = String(l.is_bilingual || '').toUpperCase().trim();
  return val === 'TRUE' || val === 'SI' || val === 'SÍ' || val === '1';
}

/**
 * Calcula los 4 KPIs del Header general en el orden exacto solicitado:
 * 1. Avance global (progreso): completadas sobre meta (978).
 * 2. Tasa de éxito: seleccionados sobre TOTAL que cumplen mínimos en convocatoria.
 * 3. Evaluadores atrasados: conteo en banda < 50%.
 * 4. Modelo vs. evaluador: % recomiendan pasar lado a lado.
 */
export function calculateLecturasGeneralKpis(
  lecturas: LecturaRecord[],
  totalCumplenMinimos: number,
  metaGlobal: number = 978
): LecturasGeneralKpis {
  const completadas = lecturas.filter(l => l.completado);
  const completadasCount = completadas.length;
  const avanceGlobalPct = metaGlobal > 0 ? Math.round((completadasCount / metaGlobal) * 1000) / 10 : 0;

  // Seleccionados por el evaluador (solo entre los leídos)
  const seleccionados = completadas.filter(l => isEvaluadorRecomiendaPasar(l.opinion_evaluador));
  const seleccionadosCount = seleccionados.length;

  // Tasa de éxito sobre el TOTAL de candidatos que cumplen mínimos (NO sobre los leídos)
  const safeTotalMinimos = totalCumplenMinimos > 0 ? totalCumplenMinimos : Math.max(completadasCount, 1141);
  const tasaExitoPct = safeTotalMinimos > 0 ? Math.round((seleccionadosCount / safeTotalMinimos) * 1000) / 10 : 0;

  // Evaluadores y estado de avance
  const evalStats = calculateEvaluadoresSummary(lecturas);
  const evaluadoresAtrasadosCount = evalStats.filter(e => e.estado === 'Atrasado').length;

  // Comparativa Modelo vs Evaluador (calculado sobre los leídos)
  const modeloPasa = completadas.filter(l => isModeloRecomiendaPasar(l.recomendacion_modelo));
  const modeloPasaCount = modeloPasa.length;
  const modeloPasaPct = completadasCount > 0 ? Math.round((modeloPasaCount / completadasCount) * 1000) / 10 : 0;
  const evaluadorPasaPct = completadasCount > 0 ? Math.round((seleccionadosCount / completadasCount) * 1000) / 10 : 0;

  return {
    completadasCount,
    metaGlobal,
    avanceGlobalPct,
    seleccionadosCount,
    totalCumplenMinimos: safeTotalMinimos,
    tasaExitoPct,
    evaluadoresAtrasadosCount,
    totalEvaluadores: evalStats.length,
    modeloPasaPct,
    modeloPasaCount,
    evaluadorPasaPct,
    evaluadorPasaCount: seleccionadosCount,
    totalLeidos: completadasCount
  };
}

/**
 * Agrupa y calcula el resumen por evaluador, ordenado de MENOR a MAYOR avance %
 */
export function calculateEvaluadoresSummary(lecturas: LecturaRecord[]): EvaluadorSummary[] {
  const map = new Map<string, { asignados: number; completados: number }>();

  lecturas.forEach(l => {
    const ev = (l.evaluador || 'Sin Asignar').trim();
    if (!map.has(ev)) {
      map.set(ev, { asignados: 0, completados: 0 });
    }
    const curr = map.get(ev)!;
    curr.asignados += 1;
    if (l.completado) {
      curr.completados += 1;
    }
  });

  const list: EvaluadorSummary[] = [];
  map.forEach((data, evaluador) => {
    const avancePct = data.asignados > 0 ? Math.round((data.completados / data.asignados) * 100) : 0;
    list.push({
      evaluador,
      asignados: data.asignados,
      completados: data.completados,
      avancePct,
      estado: getEvaluadorStatus(avancePct)
    });
  });

  // Ordenar de MENOR a MAYOR % de avance (para priorizar seguimiento a atrasados)
  list.sort((a, b) => {
    if (a.avancePct !== b.avancePct) {
      return a.avancePct - b.avancePct;
    }
    return b.asignados - a.asignados;
  });

  return list;
}

/**
 * Desglose detallado de categorías del modelo vs evaluador
 */
export function calculateModeloVsEvaluadorBreakdown(lecturas: LecturaRecord[]): {
  totalLeidos: number;
  modeloPasaCount: number;
  modeloPasaPct: number;
  evaluadorPasaCount: number;
  evaluadorPasaPct: number;
  modeloCategories: CategoryBreakdownItem[];
  evaluadorCategories: CategoryBreakdownItem[];
} {
  const leidos = lecturas.filter(l => l.completado);
  const totalLeidos = leidos.length;

  const modeloMap = new Map<string, number>();
  const evaluadorMap = new Map<string, number>();

  let modeloPasaCount = 0;
  let evaluadorPasaCount = 0;

  leidos.forEach(l => {
    const modRaw = stripHtml(l.recomendacion_modelo) || 'Sin recomendación';
    const evRaw = stripHtml(l.opinion_evaluador) || 'Sin registrar';

    modeloMap.set(modRaw, (modeloMap.get(modRaw) || 0) + 1);
    evaluadorMap.set(evRaw, (evaluadorMap.get(evRaw) || 0) + 1);

    if (isModeloRecomiendaPasar(l.recomendacion_modelo)) {
      modeloPasaCount += 1;
    }
    if (isEvaluadorRecomiendaPasar(l.opinion_evaluador)) {
      evaluadorPasaCount += 1;
    }
  });

  const modeloPasaPct = totalLeidos > 0 ? Math.round((modeloPasaCount / totalLeidos) * 1000) / 10 : 0;
  const evaluadorPasaPct = totalLeidos > 0 ? Math.round((evaluadorPasaCount / totalLeidos) * 1000) / 10 : 0;

  // Convertir a lista de categorías con banderas de 'isPass'
  const modeloCategories: CategoryBreakdownItem[] = Array.from(modeloMap.entries()).map(([label, count]) => {
    const isPass = isModeloRecomiendaPasar(label);
    const pct = totalLeidos > 0 ? Math.round((count / totalLeidos) * 1000) / 10 : 0;
    return { label, count, pct, isPass };
  });

  // Ordenar: primero las que pasan, luego por mayor volumen
  modeloCategories.sort((a, b) => {
    if (a.isPass && !b.isPass) return -1;
    if (!a.isPass && b.isPass) return 1;
    return b.count - a.count;
  });

  const evaluadorCategories: CategoryBreakdownItem[] = Array.from(evaluadorMap.entries()).map(([label, count]) => {
    const isPass = isEvaluadorRecomiendaPasar(label);
    const pct = totalLeidos > 0 ? Math.round((count / totalLeidos) * 1000) / 10 : 0;
    return { label, count, pct, isPass };
  });

  evaluadorCategories.sort((a, b) => {
    if (a.isPass && !b.isPass) return -1;
    if (!a.isPass && b.isPass) return 1;
    return b.count - a.count;
  });

  return {
    totalLeidos,
    modeloPasaCount,
    modeloPasaPct,
    evaluadorPasaCount,
    evaluadorPasaPct,
    modeloCategories,
    evaluadorCategories
  };
}

/**
 * Calcula los datos para el Card de Perfil de Seleccionados
 * Subconjuntos anidados: Seleccionados ⊆ Leídos ⊆ Total que Cumplen Mínimos
 */
export function calculatePerfilSeleccionadosStat(
  lecturas: LecturaRecord[],
  totalCumplenMinimos: number,
  filtro: PerfilFilterType
): {
  filtro: PerfilFilterType;
  filtroLabel: string;
  seleccionadosCount: number;
  leidosNoSeleccionadosCount: number;
  totalLeidosConPerfilCount: number;
  totalCumplenMinimos: number;
  pctSeleccionadosSobreTotal: number;
  pctLeidosNoSelSobreTotal: number;
  pctBarraSeleccionados: number;
  pctBarraLeidosNoSel: number;
} {
  const safeTotalMinimos = totalCumplenMinimos > 0 ? totalCumplenMinimos : 1141;
  const leidos = lecturas.filter(l => l.completado);

  const matchesFilter = (l: LecturaRecord): boolean => {
    const prio = isLecturaUniPrioritaria(l);
    const bil = isLecturaBilingual(l);
    if (filtro === 'uni_prioritaria') return prio;
    if (filtro === 'is_bilingual') return bil;
    if (filtro === 'or') return prio || bil;
    if (filtro === 'and') return prio && bil;
    return true;
  };

  let seleccionadosCount = 0;
  let leidosNoSeleccionadosCount = 0;

  leidos.forEach(l => {
    if (matchesFilter(l)) {
      if (isEvaluadorRecomiendaPasar(l.opinion_evaluador)) {
        seleccionadosCount += 1;
      } else {
        leidosNoSeleccionadosCount += 1;
      }
    }
  });

  const totalLeidosConPerfilCount = seleccionadosCount + leidosNoSeleccionadosCount;
  const pctSeleccionadosSobreTotal = safeTotalMinimos > 0 
    ? Math.round((seleccionadosCount / safeTotalMinimos) * 1000) / 10 
    : 0;
  const pctLeidosNoSelSobreTotal = safeTotalMinimos > 0 
    ? Math.round((leidosNoSeleccionadosCount / safeTotalMinimos) * 1000) / 10 
    : 0;

  // Ancho porcentual de los segmentos en la barra que representa el 100% de los elegibles
  const pctBarraSeleccionados = Math.min(100, Math.round((seleccionadosCount / safeTotalMinimos) * 1000) / 10);
  const pctBarraLeidosNoSel = Math.min(100 - pctBarraSeleccionados, Math.round((leidosNoSeleccionadosCount / safeTotalMinimos) * 1000) / 10);

  const labelsMap: Record<PerfilFilterType, string> = {
    uni_prioritaria: 'Universidad Priorizada',
    is_bilingual: 'Bilingüe (B2+)',
    or: 'Uno u otro (Univ. Priorizada o Bilingüe)',
    and: 'Ambos (Univ. Priorizada y Bilingüe)'
  };

  return {
    filtro,
    filtroLabel: labelsMap[filtro],
    seleccionadosCount,
    leidosNoSeleccionadosCount,
    totalLeidosConPerfilCount,
    totalCumplenMinimos: safeTotalMinimos,
    pctSeleccionadosSobreTotal,
    pctLeidosNoSelSobreTotal,
    pctBarraSeleccionados,
    pctBarraLeidosNoSel
  };
}

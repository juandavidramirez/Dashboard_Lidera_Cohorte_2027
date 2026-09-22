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
 * Normaliza y clasifica si el candidato leido es bilingüe (B2+).
 */
export function isLecturaBilingual(l: LecturaRecord): boolean {
  if (typeof l.is_bilingual === 'boolean') return l.is_bilingual;
  const val = String(l.is_bilingual || '').toUpperCase().trim();
  return val === 'TRUE' || val === 'SI' || val === 'SÍ' || val === '1';
}

/**
 * Helpers para el campo categórico Enfoque ('STEM y Bilingüe', 'STEM', 'Bilingüe', 'No STEM no Bilingüe')
 */
export function isLecturaBilingueEnfoque(l: LecturaRecord): boolean {
  const enf = String(l.enfoque || '').toLowerCase();
  if (enf.includes('bilingüe') || enf.includes('bilingue')) return true;
  return isLecturaBilingual(l);
}

export function isLecturaStemEnfoque(l: LecturaRecord): boolean {
  const enf = String(l.enfoque || '').toLowerCase();
  if (enf.includes('stem')) return true;
  return Boolean(l.is_stem);
}

export function isLecturaStemOrBilingue(l: LecturaRecord): boolean {
  return isLecturaStemEnfoque(l) || isLecturaBilingueEnfoque(l);
}

export function isLecturaStemAndBilingue(l: LecturaRecord): boolean {
  return isLecturaStemEnfoque(l) && isLecturaBilingueEnfoque(l);
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
 * Normaliza y acorta las etiquetas de categorías del modelo según especificación:
 * "Pasar", "Tiene factor Ñ", "Rechazar", "Comité"
 */
export function shortenModeloCategory(raw: string | null | undefined): string {
  const m = stripHtml(raw).toLowerCase().trim();
  if (!m) return 'Sin recomendación';
  if (m.includes('factor ñ') || m.includes('factor n')) return 'Tiene factor Ñ';
  if (m.includes('comit')) return 'Comité';
  if (m.includes('rechaz')) return 'Rechazar';
  if (m.includes('pas')) return 'Pasar';
  return stripHtml(raw);
}

/**
 * Normaliza y acorta las etiquetas de categorías del evaluador según especificación:
 * "Pasa a entrevista", "No pasa", "Descalificado (plagio)"
 */
export function shortenEvaluadorCategory(raw: string | null | undefined): string {
  const e = stripHtml(raw).toLowerCase().trim();
  if (!e) return 'Sin registrar';
  if (e.includes('plagio') || e.includes('descalific')) return 'Descalificado (plagio)';
  if (e.includes('no pasa') || e.includes('rechaz')) return 'No pasa';
  if (e.includes('pas') || e.includes('entrevista')) return 'Pasa a entrevista';
  return stripHtml(raw);
}

/**
 * Desglose detallado de categorías del modelo vs evaluador con etiquetas cortas y legibles
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
    const modShort = shortenModeloCategory(l.recomendacion_modelo);
    const evShort = shortenEvaluadorCategory(l.opinion_evaluador);

    modeloMap.set(modShort, (modeloMap.get(modShort) || 0) + 1);
    evaluadorMap.set(evShort, (evaluadorMap.get(evShort) || 0) + 1);

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
    const isPass = label === 'Pasar' || label === 'Tiene factor Ñ';
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
    const isPass = label === 'Pasa a entrevista';
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
 * 5 Opciones de filtro según requerimiento confirmado:
 * 1. 'uni_prioritaria' (standalone)
 * 2. 'bilingue' (derivado de Enfoque)
 * 3. 'stem' (derivado de Enfoque)
 * 4. 'stem_or_bilingue' (OR - STEM o Bilingüe)
 * 5. 'stem_and_bilingue' (AND - STEM y Bilingüe)
 * Base de porcentaje: sobre el TOTAL DE SELECCIONADOS (denominador = seleccionados / 332)
 */
export function calculatePerfilSeleccionadosStat(
  lecturas: LecturaRecord[],
  totalCumplenMinimos: number,
  filtro: PerfilFilterType
): {
  filtro: PerfilFilterType;
  filtroLabel: string;
  seleccionadosCount: number;
  totalSeleccionados: number;
  leidosNoSeleccionadosCount: number;
  totalLeidosConPerfilCount: number;
  totalCumplenMinimos: number;
  pctSeleccionadosSobreSeleccionados: number;
  pctBarraSeleccionados: number;
  pctLeidosNoSelSobreSeleccionados: number;
} {
  const safeTotalMinimos = totalCumplenMinimos > 0 ? totalCumplenMinimos : 1141;
  const leidos = lecturas.filter(l => l.completado);
  const seleccionados = leidos.filter(l => isEvaluadorRecomiendaPasar(l.opinion_evaluador));
  const totalSeleccionados = seleccionados.length > 0 ? seleccionados.length : 332;

  const matchesFilter = (l: LecturaRecord): boolean => {
    if (filtro === 'uni_prioritaria') return isLecturaUniPrioritaria(l);
    if (filtro === 'bilingue') return isLecturaBilingueEnfoque(l);
    if (filtro === 'stem') return isLecturaStemEnfoque(l);
    if (filtro === 'stem_or_bilingue') return isLecturaStemOrBilingue(l);
    if (filtro === 'stem_and_bilingue') return isLecturaStemAndBilingue(l);
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
  const pctSeleccionadosSobreSeleccionados = totalSeleccionados > 0 
    ? Math.round((seleccionadosCount / totalSeleccionados) * 1000) / 10 
    : 0;
  const pctLeidosNoSelSobreSeleccionados = totalSeleccionados > 0 
    ? Math.round((leidosNoSeleccionadosCount / totalSeleccionados) * 1000) / 10 
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
    leidosNoSeleccionadosCount,
    totalLeidosConPerfilCount,
    totalCumplenMinimos: safeTotalMinimos,
    pctSeleccionadosSobreSeleccionados,
    pctBarraSeleccionados,
    pctLeidosNoSelSobreSeleccionados
  };
}

/**
 * 1. Desglose de Profesionales vs. Licenciados sobre seleccionados
 */
export function calculateTipoPregradoBreakdown(lecturas: LecturaRecord[]): {
  items: Array<{ label: string; count: number; pct: number; color: string }>;
  totalSeleccionados: number;
} {
  const leidos = lecturas.filter(l => l.completado);
  const seleccionados = leidos.filter(l => isEvaluadorRecomiendaPasar(l.opinion_evaluador));
  const total = seleccionados.length > 0 ? seleccionados.length : 332;

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
      color: '#2E9E82' // Emerald
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
 * 2. Desglose de STEM (4 categorías de Enfoque) sobre seleccionados
 */
export function calculateEnfoqueBreakdown(lecturas: LecturaRecord[]): {
  items: Array<{ label: string; count: number; pct: number; color: string }>;
  totalSeleccionados: number;
} {
  const leidos = lecturas.filter(l => l.completado);
  const seleccionados = leidos.filter(l => isEvaluadorRecomiendaPasar(l.opinion_evaluador));
  const total = seleccionados.length > 0 ? seleccionados.length : 332;

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
      color: '#152238' // Navy
    },
    {
      label: 'STEM y Bilingüe',
      count: stemAndBilCount,
      pct: Math.round((stemAndBilCount / total) * 1000) / 10,
      color: '#F2A900' // Amber
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
 * 3. Desglose de Edades (<22, 22 a 29, >29) sobre seleccionados
 */
export function calculateEdadesBreakdown(lecturas: LecturaRecord[]): {
  items: Array<{ label: string; count: number; pct: number; color: string; sublabel: string }>;
  totalSeleccionados: number;
} {
  const leidos = lecturas.filter(l => l.completado);
  const seleccionados = leidos.filter(l => isEvaluadorRecomiendaPasar(l.opinion_evaluador));
  const total = seleccionados.length > 0 ? seleccionados.length : 332;

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
      // Default / bucket modal
      de22a29++;
    }
  });

  const items = [
    {
      label: '< 22 años',
      sublabel: 'Jóvenes / Recién egresados',
      count: menor22,
      pct: Math.round((menor22 / total) * 1000) / 10,
      color: '#64748B' // Slate
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
      color: '#152238' // Deep Navy
    }
  ];

  return { items, totalSeleccionados: total };
}

/**
 * 4. Desglose de Género sobre seleccionados
 */
export function calculateGeneroBreakdown(lecturas: LecturaRecord[]): {
  items: Array<{ label: string; count: number; pct: number; color: string }>;
  totalSeleccionados: number;
} {
  const leidos = lecturas.filter(l => l.completado);
  const seleccionados = leidos.filter(l => isEvaluadorRecomiendaPasar(l.opinion_evaluador));
  const total = seleccionados.length > 0 ? seleccionados.length : 332;

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
      color: '#152238' // Deep Navy
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
 * Normaliza nombres de ciudades para consolidación limpia
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

export interface CityLeaderboardItem {
  rank: number;
  label: string;
  count: number;
  pct: number;
  magnitudePct: number;
  isFoco: boolean;
}

/**
 * 5. Desglose de Ciudades de Nacimiento en formato Leaderboard / Ranking
 * Ordenado de mayor a menor con barra de magnitud relativa frente a la ciudad líder
 */
export function calculateCiudadesBreakdown(lecturas: LecturaRecord[]): {
  items: CityLeaderboardItem[];
  totalSeleccionados: number;
  maxCityCount: number;
  focoCitiesCount: number;
  focoCitiesPct: number;
} {
  const leidos = lecturas.filter(l => l.completado);
  const seleccionados = leidos.filter(l => isEvaluadorRecomiendaPasar(l.opinion_evaluador));
  const total = seleccionados.length > 0 ? seleccionados.length : 332;

  const cityMap = new Map<string, number>();

  seleccionados.forEach(s => {
    const name = normalizeCityName(s.ciudad);
    cityMap.set(name, (cityMap.get(name) || 0) + 1);
  });

  // Ordenar de mayor a menor cantidad
  const sortedCities = Array.from(cityMap.entries()).sort((a, b) => b[1] - a[1]);

  const maxCityCount = sortedCities.length > 0 ? sortedCities[0][1] : 1;

  // Seleccionar top 7 ciudades individuales y agrupar el resto en "Otras ciudades"
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

  // Foco estratégico: Cali, Barranquilla, Medellín
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

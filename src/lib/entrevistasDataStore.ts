import { supabase, isSupabaseConfigured } from './supabase';
import { EntrevistaRecord } from '../types';
import { dataStore } from './dataStore';
import { lecturasDataStore } from './lecturasDataStore';
import { stripHtml, isEvaluadorStaff } from './entrevistasMetricsCalculator';

const STORAGE_KEY_ENTREVISTAS = 'exc_entrevistas_progreso_cache_v1';

export const EVALUADORES_ENTREVISTAS_BASE = [
  { evaluador: 'Ana Medina', esStaff: true, asignados: 35, completados: 3 },
  { evaluador: 'Anamaría Torres', esStaff: true, asignados: 40, completados: 9 },
  { evaluador: 'Rocío Navarro', esStaff: true, asignados: 38, completados: 7 },
  { evaluador: 'Tatiana Morimitsu', esStaff: true, asignados: 42, completados: 12 },
  { evaluador: 'Juan David', esStaff: true, asignados: 5, completados: 2 },
  { evaluador: 'Laura Hoffmann Medina', esStaff: false, asignados: 25, completados: 0 }
];

/**
 * Genera el dataset inicial estructurado en caso de falla de red o uso offline
 */
function generateSeedEntrevistas(): EntrevistaRecord[] {
  const records: EntrevistaRecord[] = [];
  const candidates = dataStore.getCandidates();
  const lecturas = lecturasDataStore.getLecturas();

  const candidateMap = new Map(candidates.map(c => [c.id, c]));
  const lecturasMap = new Map(lecturas.map(l => [l.id_contacto, l]));

  let counter = 1;

  EVALUADORES_ENTREVISTAS_BASE.forEach((evDef) => {
    for (let i = 0; i < evDef.asignados; i++) {
      const isCompletado = i < evDef.completados;
      const mockContactId = `003QU00001${String(counter + 100).padStart(6, '0')}`;
      const mockDiaId = `a0DQU00001${String(counter + 500).padStart(5, '0')}`;

      const cand = candidateMap.get(mockContactId) || (candidates.length > 0 ? candidates[counter % candidates.length] : null);
      const lec = lecturasMap.get(mockContactId) || (lecturas.length > 0 ? lecturas[counter % lecturas.length] : null);

      let opinion: string | null = null;
      let recPostulante: string | null = null;

      if (isCompletado) {
        const opMod = (counter * 7 + i) % 5;
        if (opMod === 0) opinion = 'ACEPTADO: De acuerdo';
        else if (opMod === 1) opinion = 'ACEPTADO: Creo que debería pasar';
        else if (opMod === 2) opinion = 'ACEPTADO: Tiene el factor "Ñ"';
        else if (opMod === 3) opinion = 'RECHAZADO: De acuerdo, pero podría ser Eco en el futuro';
        else opinion = 'RECHAZADO: firmemente de acuerdo';

        recPostulante = 'Candidato con buen desempeño y alineación.';
      }

      const isPrio = cand ? cand.universidadPriorizada === 'SI' : (counter % 3 === 0);
      const isBiling = cand ? Boolean(cand.isBilingual) : (counter % 2 === 0);
      const isStem = cand ? Boolean(cand.isStem) : (counter % 3 === 0);
      const mockGenero = lec?.genero || (counter % 3 === 0 ? 'Masculino' : 'Femenino');
      const mockCiudad = lec?.ciudad || (counter % 4 === 0 ? 'Cali' : counter % 4 === 1 ? 'Barranquilla' : counter % 4 === 2 ? 'Medellín' : 'Bogotá, D.C.');
      const mockEnfoque = cand?.enfoque || (isStem && isBiling ? 'STEM y Bilingüe' : isStem ? 'STEM' : 'Bilingüe');

      records.push({
        id_dia_entrevista: mockDiaId,
        id_contacto: mockContactId,
        evaluador: evDef.evaluador,
        es_staff: evDef.esStaff,
        completado: isCompletado,
        fecha_entrevista: '2026-07-15',
        opinion_evaluador: opinion,
        recomendacion_postulante: recPostulante,
        puntaje_academico_universidad: 3,
        coeficiente_universidad: 1.08,
        bandera_pregrado: 3,
        puntaje_icfes: 5.5,
        puntaje_logros: 4,
        disponibilidad_instituto: 'Si',
        preferencia_region: 'Abierto a cualquier región',
        preferencia_zona: 'No tengo preferencia',
        preferencia_nivel: 'No tengo preferencia',
        capacidad_ensenar_ingles: 'Sí',
        uni_prioritaria: isPrio ? 'SI' : 'NO',
        is_bilingual: isBiling,
        is_stem: isStem,
        enfoque: mockEnfoque,
        tipo_pregrado: cand?.tipoPregrado || 'Profesional',
        edad: cand?.edad || (22 + (counter % 10)),
        eligibility: 'Cumple mínimos',
        full_name: cand?.fullName || `Postulante Entrevista #${counter}`,
        university_normalized: cand?.universityNormalized || 'Universidad de los Andes',
        career: cand?.career || 'Licenciatura / Ingeniería',
        form_completo: 'SI',
        genero: mockGenero,
        ciudad: mockCiudad
      });

      counter++;
    }
  });

  return records;
}

class EntrevistasDataStore {
  private entrevistas: EntrevistaRecord[] = [];
  private listeners: Array<() => void> = [];
  private isSyncing = false;
  private lastSyncTime: string | null = null;
  private lastSyncError: string | null = null;
  private dataSourceType: 'supabase_view' | 'supabase_table' | 'local_seed' = 'local_seed';

  constructor() {
    this.init();
    if (isSupabaseConfigured) {
      this.loadFromSupabase();
    }
  }

  private init() {
    try {
      const cached = localStorage.getItem(STORAGE_KEY_ENTREVISTAS);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.entrevistas = parsed;
          this.dataSourceType = 'supabase_view';
          return;
        }
      }
    } catch (e) {
      console.warn('Error reading entrevistas cache from localStorage:', e);
    }

    this.entrevistas = generateSeedEntrevistas();
    this.saveLocal();
  }

  private saveLocal() {
    try {
      localStorage.setItem(STORAGE_KEY_ENTREVISTAS, JSON.stringify(this.entrevistas));
    } catch (e) {
      console.warn('Could not save entrevistas to localStorage:', e);
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

  public getEntrevistas(): EntrevistaRecord[] {
    return [...this.entrevistas];
  }

  public getSyncState() {
    return {
      isSyncing: this.isSyncing,
      lastSyncTime: this.lastSyncTime,
      lastSyncError: this.lastSyncError,
      dataSourceType: this.dataSourceType,
      isConfigured: isSupabaseConfigured,
      totalRegistros: this.entrevistas.length
    };
  }

  /**
   * Carga los registros de entrevistas desde la vista `entrevistas_con_perfil` en Supabase
   * con paginación PostgREST (lotes de 1000).
   */
  public async loadFromSupabase(): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) {
      this.dataSourceType = 'local_seed';
      this.notify();
      return false;
    }

    this.isSyncing = true;
    this.lastSyncError = null;
    this.notify();

    try {
      // 1. Intentar leer de la vista enriquecida `entrevistas_con_perfil`
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let rawData: any[] = [];
      let page = 0;
      const pageSize = 1000;
      let usedView = true;

      while (true) {
        const { data, error } = await supabase
          .from('entrevistas_con_perfil')
          .select('*')
          .range(page * pageSize, (page + 1) * pageSize - 1);

        if (error) {
          console.warn('View entrevistas_con_perfil error, trying table entrevistas_progreso:', error.message);
          usedView = false;
          break;
        }

        if (!data || data.length === 0) break;
        rawData = rawData.concat(data);
        if (data.length < pageSize) break;
        page++;
      }

      // 2. Fallback a la tabla base `entrevistas_progreso` si la vista no estuviese lista
      if (!usedView || rawData.length === 0) {
        page = 0;
        while (true) {
          const { data, error } = await supabase
            .from('entrevistas_progreso')
            .select('*')
            .range(page * pageSize, (page + 1) * pageSize - 1);

          if (error) {
            console.warn('Error fetching entrevistas_progreso:', error.message);
            break;
          }

          if (!data || data.length === 0) break;
          rawData = rawData.concat(data);
          if (data.length < pageSize) break;
          page++;
        }
      }

      if (rawData.length === 0) {
        console.warn('No rows found in entrevistas_con_perfil or entrevistas_progreso');
        this.dataSourceType = 'local_seed';
        return false;
      }

      // 3. Diccionarios de enriquecimiento multi-clave (15 y 18 caracteres de Salesforce)
      let candidates = dataStore.getCandidates();
      if (candidates.length === 0) {
        await dataStore.loadFromSupabase();
        candidates = dataStore.getCandidates();
      }
      const candMap15 = new Map(candidates.map(c => [c.id ? c.id.slice(0, 15) : '', c]));
      const candMap18 = new Map(candidates.map(c => [c.id, c]));

      let lecturas = lecturasDataStore.getLecturas();
      if (lecturas.length === 0) {
        await lecturasDataStore.loadFromSupabase();
        lecturas = lecturasDataStore.getLecturas();
      }
      const lecturasMapContact15 = new Map(lecturas.map(l => [l.id_contacto ? l.id_contacto.slice(0, 15) : '', l]));
      const lecturasMapContact18 = new Map(lecturas.map(l => [l.id_contacto, l]));
      const lecturasMapPrimera15 = new Map(lecturas.map(l => [l.primera_lectura_id ? l.primera_lectura_id.slice(0, 15) : '', l]));

      // 4. Mapear y normalizar registros cruzando Entrevistas -> Lecturas -> Candidates
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.entrevistas = rawData.map((row: any) => {
        const opinionClean = stripHtml(row.opinion_evaluador);
        const idContacto = String(row.id_contacto || '').trim();
        const idContacto15 = idContacto.slice(0, 15);
        const idDia15 = String(row.id_dia_entrevista || '').slice(0, 15);

        // Cruce con Lecturas
        const lec =
          lecturasMapContact15.get(idContacto15) ||
          lecturasMapContact18.get(idContacto) ||
          lecturasMapPrimera15.get(idDia15) ||
          null;

        // Cruce con Candidates
        let cand = null;
        if (lec && lec.primera_lectura_id) {
          const pId15 = lec.primera_lectura_id.slice(0, 15);
          cand = candMap15.get(pId15) || candMap18.get(lec.primera_lectura_id);
        }
        if (!cand) {
          cand = candMap15.get(idContacto15) || candMap18.get(idContacto);
        }

        const isCompletado = row.completado === true || (
          Boolean(opinionClean) && 
          opinionClean.trim() !== '' && 
          !opinionClean.toLowerCase().includes('pendiente')
        );

        const uniPrioritaria = row.uni_prioritaria || cand?.universidadPriorizada || 'NO';
        const isBilingual = row.is_bilingual !== undefined && row.is_bilingual !== null
          ? Boolean(row.is_bilingual)
          : (cand?.isBilingual !== undefined ? Boolean(cand.isBilingual) : false);
        const isStem = row.is_stem !== undefined && row.is_stem !== null
          ? Boolean(row.is_stem)
          : (cand?.isStem !== undefined ? Boolean(cand.isStem) : false);

        let enfoqueVal = row.enfoque || cand?.enfoque || null;
        if (!enfoqueVal) {
          if (isStem && isBilingual) enfoqueVal = 'STEM y Bilingüe';
          else if (isStem) enfoqueVal = 'STEM';
          else if (isBilingual) enfoqueVal = 'Bilingüe';
          else enfoqueVal = 'No STEM no Bilingüe';
        }

        const tipoPregrado = row.tipo_pregrado || cand?.tipoPregrado || 'Profesional';

        let edadVal: number | null = null;
        if (row.edad !== undefined && row.edad !== null && !isNaN(Number(row.edad))) {
          edadVal = Number(row.edad);
        } else if (cand && typeof cand.edad === 'number') {
          edadVal = cand.edad;
        }

        const generoClean = row.genero ? String(row.genero).trim() : (lec?.genero || null);
        const ciudadClean = row.ciudad ? String(row.ciudad).trim() : (lec?.ciudad || cand?.city || null);

        const evName = (row.evaluador || 'Sin Asignar').trim();
        const isStaff = isEvaluadorStaff(evName, row.es_staff);

        return {
          id_dia_entrevista: row.id_dia_entrevista || row.id,
          id_contacto: idContacto,
          evaluador: evName,
          es_staff: isStaff,
          completado: isCompletado,
          fecha_entrevista: row.fecha_entrevista || null,
          opinion_evaluador: opinionClean || null,
          recomendacion_postulante: stripHtml(row.recomendacion_postulante) || null,
          puntaje_academico_universidad: row.puntaje_academico_universidad ?? null,
          coeficiente_universidad: row.coeficiente_universidad ?? null,
          bandera_pregrado: row.bandera_pregrado ?? null,
          puntaje_icfes: row.puntaje_icfes ?? null,
          puntaje_logros: row.puntaje_logros ?? null,
          disponibilidad_instituto: row.disponibilidad_instituto || null,
          preferencia_region: row.preferencia_region || null,
          preferencia_zona: row.preferencia_zona || null,
          preferencia_nivel: row.preferencia_nivel || null,
          capacidad_ensenar_ingles: row.capacidad_ensenar_ingles || null,
          uni_prioritaria: uniPrioritaria,
          is_bilingual: isBilingual,
          is_stem: isStem,
          enfoque: enfoqueVal,
          tipo_pregrado: tipoPregrado,
          edad: edadVal,
          eligibility: row.eligibility || cand?.eligibility || 'Cumple mínimos',
          full_name: row.full_name || cand?.fullName || '',
          university_normalized: row.university_normalized || cand?.universityNormalized || '',
          career: row.career || cand?.career || '',
          form_completo: row.form_completo || cand?.formCompleto || 'SI',
          genero: generoClean,
          ciudad: ciudadClean
        };
      });

      this.dataSourceType = usedView ? 'supabase_view' : 'supabase_table';
      this.lastSyncTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      this.saveLocal();
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn('Could not sync entrevistas from Supabase:', msg);
      this.lastSyncError = msg;
      return false;
    } finally {
      this.isSyncing = false;
      this.notify();
    }
  }
}

export const entrevistasDataStore = new EntrevistasDataStore();

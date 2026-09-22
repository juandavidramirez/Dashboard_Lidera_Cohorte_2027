import { supabase, isSupabaseConfigured } from './supabase';
import { LecturaRecord } from '../types';
import { dataStore } from './dataStore';
import { stripHtml } from './lecturasMetricsCalculator';

const STORAGE_KEY_LECTURAS = 'exc_lecturas_progreso_cache_v2';

// Definición canónica de los 13 evaluadores y su meta/volumen operativo inicial
export const EVALUADORES_BASE = [
  { evaluador: 'Rafael David Payares Pineda', asignados: 41, completados: 3 },
  { evaluador: 'Miguel Ricardo Medina Cuentas', asignados: 40, completados: 0 },
  { evaluador: 'Ana María Arenas Rodríguez', asignados: 40, completados: 15 },
  { evaluador: 'Luisa Fernanda Acosta Hernández', asignados: 40, completados: 19 },
  { evaluador: 'María Fernanda Camelo Ramírez', asignados: 40, completados: 22 },
  { evaluador: 'Laura Hoffmann Medina', asignados: 115, completados: 40 },
  { evaluador: 'Laura Johana Cepeda Ayerbe', asignados: 116, completados: 50 },
  { evaluador: 'Neidi Marcela Sánchez López', asignados: 116, completados: 51 },
  { evaluador: 'Paola Andrea Mendoza Medina', asignados: 116, completados: 52 },
  { evaluador: 'Sara Valentina Yunda Martinez', asignados: 116, completados: 52 },
  { evaluador: 'Alejandra Ramírez López', asignados: 118, completados: 61 },
  { evaluador: 'Ronal Nicolás Martinez Vergara', asignados: 117, completados: 69 },
  { evaluador: 'Tatiana Morimitsu Sanchez', asignados: 131, completados: 131 }
];

export const OPINION_EVALUADOR_VALORES = {
  PASA: 'Me gustaría que pase al día de entrevista',
  NO_PASA: 'Este candidato no pasa a la siguiente etapa',
  PLAGIO: 'Descalificado por plagio'
};

export const RECOMENDACION_MODELO_VALORES = {
  PASA_DIRECTO: 'Recomienda Pasar',
  FACTOR_ENIE: 'Recomienda pasar, Tiene el factor Ñ',
  COMITE: 'Recomienda para Comité de Selección',
  RECHAZAR: 'Recomienda Rechazar'
};

/**
 * Genera el dataset inicial estructurado en caso de falla de red o uso offline
 */
function generateSeedLecturas(): LecturaRecord[] {
  const records: LecturaRecord[] = [];
  const candidates = dataStore.getCandidates();
  const eligibleCandidates = candidates.filter(c => c.eligibility === 'Elegible');

  let candIdx = 0;
  let counter = 1;

  EVALUADORES_BASE.forEach((evDef) => {
    for (let i = 0; i < evDef.asignados; i++) {
      const isCompletado = i < evDef.completados;
      const linkedCand = eligibleCandidates.length > 0
        ? eligibleCandidates[candIdx % eligibleCandidates.length]
        : null;
      candIdx++;

      let opinion: string | null = null;
      let modeloRec: string | null = null;

      if (isCompletado) {
        const isSelected = (counter * 7 + i) % 100 < 58;
        opinion = isSelected 
          ? OPINION_EVALUADOR_VALORES.PASA 
          : OPINION_EVALUADOR_VALORES.NO_PASA;

        const modMod = (counter * 13 + i * 3) % 100;
        if (modMod < 38) {
          modeloRec = RECOMENDACION_MODELO_VALORES.PASA_DIRECTO;
        } else if (modMod < 55) {
          modeloRec = RECOMENDACION_MODELO_VALORES.FACTOR_ENIE;
        } else if (modMod < 85) {
          modeloRec = RECOMENDACION_MODELO_VALORES.COMITE;
        } else {
          modeloRec = RECOMENDACION_MODELO_VALORES.RECHAZAR;
        }
      }

      const isPrio = linkedCand 
        ? (linkedCand.universidadPriorizada === 'SI' || linkedCand.universityNormalized?.includes('Universidad'))
        : (counter % 3 === 0);

      const isBiling = linkedCand 
        ? Boolean(linkedCand.isBilingual)
        : (counter % 2 === 0);

      records.push({
        primera_lectura_id: `a0FQU00000${String(counter).padStart(5, '0')}2AF`,
        id_contacto: linkedCand ? linkedCand.id : `003QU00001${String(counter).padStart(6, '0')}`,
        evaluador: evDef.evaluador,
        completado: isCompletado,
        opinion_evaluador: opinion,
        recomendacion_modelo: modeloRec,
        uni_prioritaria: isPrio ? 'SI' : 'NO',
        is_bilingual: isBiling,
        eligibility: 'Cumple mínimos',
        full_name: linkedCand ? linkedCand.fullName : `Candidato/a Lectura #${counter}`,
        university_normalized: linkedCand ? linkedCand.universityNormalized : 'Universidad de los Andes',
        career: linkedCand ? linkedCand.career : 'Ingeniería / Licenciatura',
        form_completo: 'SI'
      });

      counter++;
    }
  });

  return records;
}

class LecturasDataStore {
  private lecturas: LecturaRecord[] = [];
  private totalCumplenMinimos = 1141; // Denominador en vivo verificado en base de datos (1.141)
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
      const cached = localStorage.getItem(STORAGE_KEY_LECTURAS);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.lecturas = parsed;
          this.dataSourceType = 'supabase_table';
          return;
        }
      }
    } catch (e) {
      console.warn('Error reading lecturas cache from localStorage:', e);
    }

    this.lecturas = generateSeedLecturas();
    this.saveLocal();
  }

  private saveLocal() {
    try {
      localStorage.setItem(STORAGE_KEY_LECTURAS, JSON.stringify(this.lecturas));
    } catch (e) {
      console.warn('Could not save lecturas to localStorage:', e);
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

  public getLecturas(): LecturaRecord[] {
    return [...this.lecturas];
  }

  public getTotalCumplenMinimos(): number {
    return this.totalCumplenMinimos;
  }

  public getSyncState() {
    return {
      isSyncing: this.isSyncing,
      lastSyncTime: this.lastSyncTime,
      lastSyncError: this.lastSyncError,
      dataSourceType: this.dataSourceType,
      isConfigured: isSupabaseConfigured,
      totalRegistros: this.lecturas.length
    };
  }

  /**
   * Carga los datos reales desde la tabla `lecturas_progreso` en Supabase (1.146 registros),
   * paginando para obtener la totalidad de las filas, normalizando opiniones/recomendaciones
   * y cruzando perfiles con `candidates_convocatoria` (15-character Salesforce ID).
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
      // 1. Consultar el total EN VIVO de candidatos que cumplen mínimos en candidates_convocatoria
      const { count: countMinimos, error: errCount } = await supabase
        .from('candidates_convocatoria')
        .select('*', { count: 'exact', head: true })
        .eq('eligibility', 'Cumple mínimos')
        .eq('form_completo', 'SI');

      if (!errCount && typeof countMinimos === 'number' && countMinimos > 0) {
        this.totalCumplenMinimos = countMinimos;
      }

      // 2. Cargar TODOS los registros de `lecturas_progreso` con paginación PostgREST (máx 1000 por página)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let rawLecturas: any[] = [];
      let page = 0;
      const pageSize = 1000;

      while (true) {
        const { data, error } = await supabase
          .from('lecturas_progreso')
          .select('*')
          .range(page * pageSize, (page + 1) * pageSize - 1);

        if (error) {
          console.warn('Error fetching lecturas_progreso page', page, error);
          break;
        }

        if (!data || data.length === 0) break;
        rawLecturas = rawLecturas.concat(data);
        if (data.length < pageSize) break;
        page++;
      }

      if (rawLecturas.length === 0) {
        console.warn('No rows found in lecturas_progreso');
        this.dataSourceType = 'local_seed';
        return false;
      }

      // 3. Cargar diccionario de candidatos desde `candidates_convocatoria` para enriquecer perfil estratégico
      // Mapeamos tanto por ID de 15 caracteres como por ID completo
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const candidateMap = new Map<string, any>();

      // Primero, verificar si dataStore ya tiene candidatos en memoria
      const localCandidates = dataStore.getCandidates();
      if (localCandidates.length > 0) {
        localCandidates.forEach(c => {
          if (c.id) {
            candidateMap.set(c.id, c);
            if (c.id.length >= 15) {
              candidateMap.set(c.id.slice(0, 15), c);
            }
          }
          if (c.idPrimeraRevision) {
            candidateMap.set(c.idPrimeraRevision, c);
            if (c.idPrimeraRevision.length >= 15) {
              candidateMap.set(c.idPrimeraRevision.slice(0, 15), c);
            }
          }
        });
      }

      // Complementar/actualizar directamente desde candidates_convocatoria en Supabase si es necesario
      let candPage = 0;
      while (candPage < 4) { // hasta 4.000 candidatos
        const { data: cData, error: cErr } = await supabase
          .from('candidates_convocatoria')
          .select('id, id_primera_revision, full_name, eligibility, uni_prioritaria, is_bilingual, university_normalized, career, form_completo')
          .range(candPage * pageSize, (candPage + 1) * pageSize - 1);

        if (cErr || !cData || cData.length === 0) break;

        cData.forEach(c => {
          if (c.id) {
            candidateMap.set(c.id, c);
            if (c.id.length >= 15) {
              candidateMap.set(c.id.slice(0, 15), c);
            }
          }
          if (c.id_primera_revision) {
            candidateMap.set(c.id_primera_revision, c);
            if (c.id_primera_revision.length >= 15) {
              candidateMap.set(c.id_primera_revision.slice(0, 15), c);
            }
          }
        });

        if (cData.length < pageSize) break;
        candPage++;
      }

      // 4. Mapear, limpiar fórmulas de Salesforce y consolidar el dataset final
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.lecturas = rawLecturas.map((row: any) => {
        const opinionClean = stripHtml(row.opinion_evaluador);
        const modeloClean = stripHtml(row.recomendacion_modelo);

        // En Salesforce el estado de completado se refleja cuando el evaluador ha emitido opinión
        const isCompletado = row.completado === true || (
          Boolean(opinionClean) && 
          opinionClean.trim() !== '' && 
          !opinionClean.toLowerCase().includes('pendiente') &&
          !opinionClean.toLowerCase().includes('vacio')
        );

        // Cruce con candidato por Salesforce ID (prefijo de 15 caracteres o id_contacto)
        const id15 = (row.primera_lectura_id || '').slice(0, 15);
        const cand = candidateMap.get(id15) || 
                     candidateMap.get(row.primera_lectura_id) || 
                     candidateMap.get(row.id_contacto);

        const uniPrioritaria = cand 
          ? (cand.uni_prioritaria || cand.universidadPriorizada || 'NO')
          : 'NO';

        const isBilingual = cand 
          ? Boolean(cand.is_bilingual || cand.isBilingual)
          : false;

        const fullName = cand 
          ? (cand.full_name || cand.fullName || '')
          : '';

        const uniNormalized = cand 
          ? (cand.university_normalized || cand.universityNormalized || '')
          : '';

        const career = cand 
          ? (cand.career || '')
          : '';

        return {
          primera_lectura_id: row.primera_lectura_id || row.id,
          id_contacto: row.id_contacto,
          evaluador: (row.evaluador || 'Sin Asignar').trim(),
          completado: isCompletado,
          opinion_evaluador: opinionClean || null,
          recomendacion_modelo: modeloClean || null,
          uni_prioritaria: uniPrioritaria,
          is_bilingual: isBilingual,
          eligibility: cand?.eligibility || 'Cumple mínimos',
          full_name: fullName,
          university_normalized: uniNormalized,
          career: career,
          form_completo: cand?.form_completo || 'SI'
        };
      });

      this.dataSourceType = 'supabase_table';
      this.lastSyncTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      this.saveLocal();
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn('Could not sync lecturas from Supabase:', msg);
      this.lastSyncError = msg;
      return false;
    } finally {
      this.isSyncing = false;
      this.notify();
    }
  }

  /**
   * Permite sincronizar o sembrar en caso necesario
   */
  public async seedToSupabase(): Promise<{ success: boolean; message: string }> {
    return this.loadFromSupabase().then(ok => ({
      success: ok,
      message: ok 
        ? `Sincronizados ${this.lecturas.length} registros reales de Supabase.` 
        : 'Error al sincronizar con Supabase.'
    }));
  }
}

export const lecturasDataStore = new LecturasDataStore();

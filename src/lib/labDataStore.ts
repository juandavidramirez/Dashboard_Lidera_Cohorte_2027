import { LabRecord, LabEtapaAlcanzada } from '../types';
import { supabase, isSupabaseConfigured } from './supabase';
import { dataStore } from './dataStore';
import { lecturasDataStore } from './lecturasDataStore';
import { entrevistasDataStore } from './entrevistasDataStore';
import { stripHtml } from './entrevistasMetricsCalculator';
import { META_CUPOS, META_ACEPTADOS_LAB, generateLabDummyData } from './labDummyData';

const STORAGE_KEY_LAB = 'exc_lab_progreso_cache_v2';

/**
 * STORE CENTRALIZADO PARA DASHBOARD LIDERA LAB (COHORTE 2027)
 * Conexión nativa a Supabase (tabla `lab_progreso` enriquecida con Candidates, Lecturas y Entrevistas).
 */
class LabDataStore {
  private labRecords: LabRecord[] = [];
  private listeners: Array<() => void> = [];
  private isSyncing = false;
  private lastSyncTime: string | null = null;
  private lastSyncError: string | null = null;
  private dataSourceType: 'dummy_local' | 'supabase_table' = 'supabase_table';

  constructor() {
    this.init();
  }

  private init() {
    try {
      const cached = localStorage.getItem(STORAGE_KEY_LAB);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.labRecords = parsed;
          this.dataSourceType = 'supabase_table';
          this.lastSyncTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          // Revalidación asíncrona en segundo plano
          setTimeout(() => {
            this.loadFromSupabase().catch(err => {
              console.warn('Background Supabase refresh warning:', err);
            });
          }, 100);
          return;
        }
      }
    } catch (e) {
      console.warn('Error reading lab records cache from localStorage:', e);
    }

    // Si no hay caché, cargar de Supabase de inmediato
    this.loadFromSupabase().catch(err => {
      console.warn('Initial Supabase load failed, falling back:', err);
      if (this.labRecords.length === 0) {
        this.labRecords = generateLabDummyData();
        this.dataSourceType = 'dummy_local';
        this.saveLocal();
      }
    });
  }

  private saveLocal() {
    try {
      localStorage.setItem(STORAGE_KEY_LAB, JSON.stringify(this.labRecords));
    } catch (e) {
      console.warn('Could not save lab records to localStorage:', e);
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

  public getRecords(): LabRecord[] {
    return [...this.labRecords];
  }

  public getSyncState() {
    return {
      isSyncing: this.isSyncing,
      lastSyncTime: this.lastSyncTime,
      lastSyncError: this.lastSyncError,
      dataSourceType: this.dataSourceType,
      totalRegistros: this.labRecords.length,
      metaCupos: META_CUPOS,
      metaAceptadosLab: META_ACEPTADOS_LAB
    };
  }

  /**
   * Carga los registros de LIDERA Lab desde Supabase (`lab_progreso`)
   * y los enriquece con el perfil demográfico de Candidates, Lecturas y Entrevistas.
   */
  public async loadFromSupabase(): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) {
      console.warn('Supabase no está configurado en las variables de entorno.');
      this.lastSyncError = 'Supabase no está configurado.';
      this.notify();
      return false;
    }

    this.isSyncing = true;
    this.lastSyncError = null;
    this.notify();

    try {
      // 1. Fetch de todas las filas de `lab_progreso` con paginación PostgREST
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let rawData: any[] = [];
      let page = 0;
      const pageSize = 1000;

      while (true) {
        const { data, error } = await supabase
          .from('lab_progreso')
          .select('*')
          .range(page * pageSize, (page + 1) * pageSize - 1);

        if (error) {
          throw new Error(`Error consultando lab_progreso: ${error.message}`);
        }

        if (!data || data.length === 0) break;
        rawData = rawData.concat(data);
        if (data.length < pageSize) break;
        page++;
      }

      if (rawData.length === 0) {
        console.warn('No se encontraron registros en lab_progreso.');
        this.lastSyncError = 'No se encontraron registros en la tabla lab_progreso.';
        return false;
      }

      // 2. Cargar dependencias de candidatos para cruce demográfico
      let candidates = dataStore.getCandidates();
      if (candidates.length === 0) {
        await dataStore.loadFromSupabase();
        candidates = dataStore.getCandidates();
      }

      let lecturas = lecturasDataStore.getLecturas();
      if (lecturas.length === 0) {
        await lecturasDataStore.loadFromSupabase();
        lecturas = lecturasDataStore.getLecturas();
      }

      let entrevistas = entrevistasDataStore.getEntrevistas();
      if (entrevistas.length === 0) {
        await entrevistasDataStore.loadFromSupabase();
        entrevistas = entrevistasDataStore.getEntrevistas();
      }

      // 3. Diccionarios optimizados en memoria (IDs de 15 y 18 caracteres de Salesforce)
      const candMap15 = new Map(candidates.map(c => [c.id ? c.id.slice(0, 15) : '', c]));
      const candMap18 = new Map(candidates.map(c => [c.id, c]));

      const lecContactMap15 = new Map(lecturas.map(l => [l.id_contacto ? l.id_contacto.slice(0, 15) : '', l]));
      const lecContactMap18 = new Map(lecturas.map(l => [l.id_contacto, l]));

      const entDiaMap15 = new Map(entrevistas.map(e => [e.id_dia_entrevista ? e.id_dia_entrevista.slice(0, 15) : '', e]));
      const entDiaMap18 = new Map(entrevistas.map(e => [e.id_dia_entrevista, e]));
      const entContactMap15 = new Map(entrevistas.map(e => [e.id_contacto ? e.id_contacto.slice(0, 15) : '', e]));
      const entContactMap18 = new Map(entrevistas.map(e => [e.id_contacto, e]));

      // 4. Enriquecimiento e hidratación de cada fila
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const hydratedRecords: LabRecord[] = rawData.map((row: any) => {
        const idContacto = String(row.id_contacto || '').trim();
        const idContacto15 = idContacto.slice(0, 15);
        const idDia = String(row.id_dia_entrevista || '').trim();
        const idDia15 = idDia.slice(0, 15);

        // Cruce con Lecturas para enlazar con Convocatoria
        const lec =
          lecContactMap18.get(idContacto) ||
          lecContactMap15.get(idContacto15) ||
          null;

        // Cruce con Candidates
        let cand = null;
        if (lec && lec.primera_lectura_id) {
          cand = candMap18.get(lec.primera_lectura_id) || candMap15.get(lec.primera_lectura_id.slice(0, 15));
        }
        if (!cand) {
          cand = candMap18.get(idContacto) || candMap15.get(idContacto15);
        }
        if (!cand) {
          cand = candMap18.get(idDia) || candMap15.get(idDia15);
        }

        // Cruce con Entrevistas
        const ent =
          entDiaMap18.get(idDia) ||
          entDiaMap15.get(idDia15) ||
          entContactMap18.get(idContacto) ||
          entContactMap15.get(idContacto15) ||
          null;

        const opinionCleanLab = stripHtml(row.opinion_evaluador_lab);
        const modeloCleanLab = stripHtml(row.recomendacion_modelo);

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

        const generoClean = row.genero ? String(row.genero).trim() : (lec?.genero || cand?.grupoEtnico || null);
        const ciudadClean = row.ciudad ? String(row.ciudad).trim() : (lec?.ciudad || cand?.city || cand?.departamentoResidencia || null);

        const evalCompleta = (row.evaluacion_completa === 'Si' || row.evaluacion_completa === true) ? 'Si' : 'No';

        // Cálculo determinístico de Etapa Alcanzada
        let etapaAlcanzada: LabEtapaAlcanzada = 'Lab';
        if (opinionCleanLab.toUpperCase().includes('ACEPTAD') && evalCompleta === 'Si') {
          etapaAlcanzada = 'Matriculación';
        }

        return {
          id_dia_entrevista: idDia,
          id_contacto: idContacto,
          fecha_lab: row.fecha_lab || null,
          id_fecha_agenda: row.id_fecha_agenda || null,
          bloque: row.bloque || null,
          subgrupo: row.subgrupo || null,
          evaluador_asistencia: row.evaluador_asistencia || null,

          asistio: Boolean(row.asistio),
          bloques_asistidos: row.bloques_asistidos ?? (row.asistio ? 3 : 0),
          comentarios_asistencia: row.comentarios_asistencia || null,

          // Componentes Clase de 5 minutos
          ser_profe: row.ser_profe ?? null,
          im_incluye_intereses: row.im_incluye_intereses ?? null,
          im_comunicacion_presencia: row.im_comunicacion_presencia ?? null,
          im_escucha_responde: row.im_escucha_responde ?? null,
          comentarios_ser_profesor: row.comentarios_ser_profesor || null,

          // Componentes Actividad Grupal
          dinamica_grupo: row.dinamica_grupo ?? null,
          im_atencion_ga: row.im_atencion_ga ?? null,
          im_empatia_ga: row.im_empatia_ga ?? null,
          act_gr_perseverancia: row.act_gr_perseverancia ?? null,
          comentarios_actividad_grupal: row.comentarios_actividad_grupal || null,

          // Componentes Juego de Roles
          im_atencion_jr: row.im_atencion_jr ?? null,
          im_empatia_jr: row.im_empatia_jr ?? null,
          im_considera_audiencia: row.im_considera_audiencia ?? null,
          comentarios_juego_roles: row.comentarios_juego_roles || null,

          // Componentes Lidera tus Finanzas / HO
          ho_semana_vida_eco: row.ho_semana_vida_eco ?? null,
          ho_tarde_dia_entrevista: row.ho_tarde_dia_entrevista || 'No',
          comentarios_ho: row.comentarios_ho || null,

          // Puntajes finales calculados en Salesforce
          puntaje_5min: row.puntaje_5min ?? null,
          puntaje_actividad_grupal: row.puntaje_actividad_grupal ?? null,
          puntaje_juego_roles: row.puntaje_juego_roles ?? null,
          puntaje_ajuste: row.puntaje_ajuste ?? null,
          puntaje_pensamiento_critico: row.puntaje_pensamiento_critico ?? null,
          puntaje_perseverancia: row.puntaje_perseverancia ?? null,
          puntaje_permanencia: row.puntaje_permanencia ?? null,
          puntaje_construccion_relaciones: row.puntaje_construccion_relaciones ?? null,
          puntaje_competencias_total: row.puntaje_competencias_total ?? null,
          recomendacion_modelo: modeloCleanLab || null,

          // Decisión y Evaluador Lab
          opinion_evaluador_lab: opinionCleanLab || null,
          comentarios_evaluador_lab: row.comentarios_evaluador_lab || null,
          recomendacion_postulante_lab: row.recomendacion_postulante_lab || null,
          evaluacion_completa: evalCompleta,

          // Promedios por sección calculados
          promedio_clase_5min: row.promedio_clase_5min ?? null,
          n_clase_5min: row.n_clase_5min ?? null,
          promedio_actividad_grupal: row.promedio_actividad_grupal ?? null,
          n_actividad_grupal: row.n_actividad_grupal ?? null,
          promedio_juego_roles: row.promedio_juego_roles ?? null,
          n_juego_roles: row.n_juego_roles ?? null,
          promedio_lidera_finanzas: row.promedio_lidera_finanzas ?? null,
          n_lidera_finanzas: row.n_lidera_finanzas ?? null,

          // Perfil demográfico
          full_name: cand?.fullName || 'Postulante Lab',
          university_normalized: cand?.universidad || cand?.university || 'Universidad por asignar',
          career: cand?.carrera || cand?.career || 'Carrera por asignar',
          edad: edadVal,
          genero: generoClean,
          ciudad: ciudadClean,
          uni_prioritaria: uniPrioritaria,
          is_bilingual: isBilingual,
          is_stem: isStem,
          enfoque: enfoqueVal,
          tipo_pregrado: tipoPregrado,
          promedio_carrera: cand?.gpa ?? null,
          nivel_ingles: cand?.english_level || ent?.capacidad_ensenar_ingles || null,
          preferencia_region: ent?.preferencia_region || null,
          preferencia_zona: ent?.preferencia_zona || null,
          preferencia_nivel: ent?.preferencia_nivel || null,
          disponibilidad_instituto: ent?.disponibilidad_instituto || null,

          // Historial de etapas previas
          opinion_lectura: lec?.opinion_evaluador || null,
          recomendacion_modelo_lectura: stripHtml(lec?.recomendacion_modelo) || null,
          observaciones_lectura: row.observaciones_lectura || null,

          opinion_entrevista: ent?.opinion_evaluador || null,
          recomendacion_postulante_entrevista: ent?.recomendacion_postulante || null,
          comentarios_entrevista: ent?.recomendacion_postulante || null,
          evaluador_entrevista: ent?.evaluador || null,

          // Comentarios detallados de entrevista previa
          comentario_logros: row.comentario_logros || null,
          comentario_perseverancia: row.comentario_perseverancia || null,
          comentario_compromiso: row.comentario_compromiso || null,
          comentario_relaciones: row.comentario_relaciones || null,
          comentario_ajuste: row.comentario_ajuste || null,
          comentario_ingles: row.comentario_ingles || null,

          // Puntajes previos de entrevista
          puntaje_academico_universidad: ent?.puntaje_academico_universidad ?? null,
          coeficiente_universidad: ent?.coeficiente_universidad ?? null,
          bandera_pregrado: ent?.bandera_pregrado ?? null,
          puntaje_icfes: ent?.puntaje_icfes ?? null,
          puntaje_logros: ent?.puntaje_logros ?? null,

          // Etapa alcanzada y fechas del proceso
          etapa_alcanzada: etapaAlcanzada,
          fecha_postulacion: cand?.fechaCreacion ? cand.fechaCreacion.slice(0, 10) : (cand?.registrationDate ? cand.registrationDate.slice(0, 10) : null),
          fecha_lectura: cand?.fechaCreacion ? cand.fechaCreacion.slice(0, 10) : null,
          fecha_entrevista: ent?.fecha_entrevista || null,

          created_at: row.created_at || null,
          updated_at: row.updated_at || null
        };
      });

      this.labRecords = hydratedRecords;
      this.dataSourceType = 'supabase_table';
      this.lastSyncTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      this.saveLocal();
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('Error sincronizando LIDERA Lab desde Supabase:', msg);
      this.lastSyncError = msg;
      return false;
    } finally {
      this.isSyncing = false;
      this.notify();
    }
  }

  public resetToDefault() {
    localStorage.removeItem(STORAGE_KEY_LAB);
    this.labRecords = [];
    this.dataSourceType = 'supabase_table';
    this.loadFromSupabase();
  }
}

export const labDataStore = new LabDataStore();

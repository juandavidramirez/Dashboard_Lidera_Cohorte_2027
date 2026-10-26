import { LabRecord } from '../types';
import { generateLabDummyData, META_CUPOS, META_ACEPTADOS_LAB } from './labDummyData';

const STORAGE_KEY_LAB = 'exc_lab_progreso_cache_v1';

/**
 * STORE CENTRALIZADO PARA DASHBOARD LIDERA LAB (COHORTE 2027)
 * Sigue el mismo patrón arquitectónico de singleton, pub-sub y cache local
 * implementado en `entrevistasDataStore.ts` y `lecturasDataStore.ts`.
 *
 * NOTA DE ARQUITECTURA (ETAPA 1 -> ETAPA 2):
 * Actualmente se inicializa y opera con el dataset estructurado de datos de ejemplo
 * desde `src/lib/labDummyData.ts`.
 *
 * EN LA ETAPA 2:
 * Aquí se conectará la consulta a Supabase:
 * - Lectura desde la vista unificada `candidatos_historial` o tabla `lab_progreso`
 * - Paginación PostgREST en lotes de 1000
 * - Invocación en `loadFromSupabase()`
 */
class LabDataStore {
  private labRecords: LabRecord[] = [];
  private listeners: Array<() => void> = [];
  private isSyncing = false;
  private lastSyncTime: string | null = null;
  private lastSyncError: string | null = null;
  private dataSourceType: 'dummy_local' | 'supabase_view' | 'supabase_table' = 'dummy_local';

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
          this.lastSyncTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          return;
        }
      }
    } catch (e) {
      console.warn('Error reading lab records cache from localStorage:', e);
    }

    // Inicialización con datos de ejemplo (Etapa 1)
    this.labRecords = generateLabDummyData();
    this.saveLocal();
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
   * Refresca los datos en pantalla. En Etapa 1 restablece/actualiza los datos ficticios.
   * En Etapa 2, este método realizará el fetch real a Supabase (PostgREST paginado).
   */
  public async loadFromSupabase(): Promise<boolean> {
    this.isSyncing = true;
    this.notify();

    // =========================================================================
    // PUNTO DE CONEXIÓN ETAPA 2 (SUPABASE):
    // Cuando el usuario solicite la conexión a Supabase, reemplazar este bloque
    // con la consulta a `supabase.from('candidatos_historial')` o `lab_progreso`.
    // =========================================================================
    try {
      await new Promise(resolve => setTimeout(resolve, 450));
      this.labRecords = generateLabDummyData();
      this.saveLocal();
      this.lastSyncTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      this.dataSourceType = 'dummy_local';
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.lastSyncError = msg;
      return false;
    } finally {
      this.isSyncing = false;
      this.notify();
    }
  }

  public resetToDefault() {
    localStorage.removeItem(STORAGE_KEY_LAB);
    this.labRecords = generateLabDummyData();
    this.saveLocal();
    this.notify();
  }
}

export const labDataStore = new LabDataStore();

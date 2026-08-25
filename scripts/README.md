# Herramientas y Scripts de Utilidad (Convocatoria LIDERA 2027)

Este directorio contiene las herramientas de diagnóstico, validación de reglas de negocio y sincronización con bases de datos para el proyecto LIDERA.

---

## 🛠️ Scripts Principales

### 1. `scripts/evaluate_convocatoria_2027.py`
- **Descripción**: Implementación de referencia de las reglas oficiales de negocio de la Convocatoria 2027.
- **Función**: Descarga los datos de Google Sheets (`Data_Raw_Conv`), evalúa criterios de STEM, Tipo de Carrera, Top 13 QS, Universidades Priorizadas, Enfoque, Rutas (Promisorios / General), Elegibilidad y HPC.
- **Uso**:
  ```bash
  python3 scripts/evaluate_convocatoria_2027.py
  ```

### 2. `scripts/audit_database_health.py`
- **Descripción**: Diagnóstico y auditoría de la base de datos de Supabase en tiempo real.
- **Función**: Verifica el total de registros en Supabase, la proporción de formularios completos vs incompletos, la distribución de elegibilidad, candidatos por ruta y control de duplicados.
- **Uso**:
  ```bash
  python3 scripts/audit_database_health.py
  ```

### 3. `scripts/sync_supabase_from_sheets.py`
- **Descripción**: Sincronizador CLI entre Google Sheets y Supabase.
- **Función**: Permite actualizar directamente la base de datos de Supabase desde los datos procesados en la hoja de Google Sheets en lotes controlados.
- **Uso**:
  ```bash
  python3 scripts/sync_supabase_from_sheets.py
  ```

---

## 📂 Carpetas de Bases Históricas y Calibración
- **`scripts/1_exploracion_y_procesamiento/`**: Scripts iniciales de extracción de encabezados y procesamiento de fuentes de datos.
- **`scripts/2_calculo_bases_historicas/`**: Cálculo y validación de las métricas históricas de la Convocatoria 2025 para calibración de metas.
- **`scripts/3_depuracion_y_validacion/`**: Scripts de auditoría de reglas y validación cruzada.

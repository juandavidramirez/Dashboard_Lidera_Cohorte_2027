# Diseño propuesto — Dashboard de LIDERA Lab (Cohorte 2027)

> Estado: **borrador para validar con Juanda** (2026-10-26). Es la especificación para que Google
> AI Studio construya las tablas de Supabase y la sección nueva del dashboard (mismo flujo que
> `DISEÑO_PROPUESTO_Dashboard_Entrevistas.md`). No es código. Una vez cerrado, se convierte en
> un prompt (`PROMPT_AI_Studio_Dashboard_LideraLab.md`).

## 1. Qué es y qué pregunta responde

Una sección nueva dentro de `Dashboard_Cohorte_2027`, con el mismo molde visual y de
componentes que Lecturas y Entrevistas, que responde: **¿cómo va avanzando LIDERA Lab, cuántas
personas pasan por él, cuántas lo superan, y quiénes son los que pasan a matriculación?** — y
que además sirve de **directorio**: buscar a cualquier persona que haya pasado por el proceso y
ver toda su información sin ir a Salesforce ni a los Sheets.

Diferencias frente a Entrevistas:
- **Se elimina el Nivel 3 "Evaluador"** (seguimiento operativo). Se reemplaza por el **Nivel 3
  "Directorio de candidatos"** (sección 4).
- Aparece un indicador nuevo, **asistencia**, y la comparación **Modelo vs. Evaluador** vuelve a
  tener sentido (Lab trae `RECOMENDACIÓN DEL MODELO` calculada por Salesforce, como Lecturas).

## 2. Hallazgos que condicionan el diseño (revisados contra los datos reales)

1. **Lab y Entrevistas comparten el mismo registro de Salesforce** (`Candidate_Selection_Assessment_Center__c`,
   el mismo `Id. Día de Entrevista`). Por eso **`Opinión del Evaluador`, `Comentarios del Evaluador` y
   `Recomendación al Postulante` son los mismos campos para ambas etapas**: lo que Tatiana escribe
   en Lab pisa lo de Entrevistas en Salesforce. Hoy no se pierde porque Entrevistas excluye de su
   re-extracción a los candidatos con `Evaluacion Completa = Si`, pero en Supabase hay que guardar
   **cada etapa por separado** (no sobrescribir `entrevistas_progreso.opinion_evaluador` con la de Lab).
2. **La asistencia no está en el Master de Lidera Lab** y **no se va a tocar la estructura de la
   pestaña `Master`** (decisión de Juanda, 2026-10-26: cambiarla implicaría reescribir Fases A-D). `Asistencia
   Bloque 1/2/3` y `Formato Clase` viven solo en las pestañas por día de Agenda. Solución: un script que
   recorre esas pestañas, busca a cada persona (por cédula, o por nombre en las pestañas manuales) y deja el
   resultado en una **pestaña nueva `Asistencia`** del archivo Master LIDERA Lab (ver 4.3). El `Master` queda intacto.
3. **Faltan en el Master los puntajes finales de las competencias del Lab**: `PUNTAJE FINAL 5 MINUTOS
   COMO PROFESOR`, `ACTIVIDAD GRUPAL`, `JUEGO DE ROLES 1`, `PENSAMIENTO CRÍTICO` (los que acabamos de
   copiar en Salesforce con `ProcesarLideraLab_7_CopiaCompetencias`) y el **total** `PUNTAJE COMPETENCIAS`
   (`FINAL_ASSESSMENT_CENTER_SCORE__c`). El Master hoy solo trae 4 finales (perseverancia, ajuste,
   permanencia, construcción de relaciones). Hay que agregarlos como columnas amarillas + `MAPEO_CAMPOS_LIDERALAB`
   para que Fase D los descargue.
4. **Los comentarios viven en 3 sitios distintos**: observaciones de Lecturas y de LIDERA Lab (con
   resumen de IA) en `Master_Proceso`; comentarios de Entrevista en `Master Entrevistas`; comentarios de
   Lab en `Master LIDERA Lab`. Supabase hoy **no tiene ninguno de esos comentarios** (`entrevistas_progreso`
   solo trae opinión, recomendación, 5 puntajes y logística; `lecturas_progreso` solo opinión y modelo).
5. **Las políticas de Supabase actuales son de lectura pública con la clave anon**
   (`USING (true)`). Está bien para KPIs agregados, **no para una ficha con cédula, comentarios de
   evaluadores y datos de salud** (ver sección 6).
6. **Cruce de ids**: siempre por los primeros 15 caracteres (`substring(id,1,15)`), como en
   `entrevistas_con_perfil`; los ids de Lab/Entrevistas llegan en 15 o 18 caracteres.

## 3. Estructura del dashboard — 3 niveles

### Nivel 1 — Indicadores generales

**Embudo de la cohorte** (barra horizontal con conversión entre etapas): Aplicaron → Elegibles →
Pasaron Lecturas → Aceptados en Entrevista (= universo de Lab) → Agendados en Lab → Asistieron →
Evaluación completa → **Pasan a matriculación**.

**4 KPI cards** (mismo patrón visual, `theme` propio, sugerido `rose`/`teal` — distinto de verde,
azul y morado):
1. **Avance del Lab** — evaluados / aceptados en Entrevista y barra de avance. **"Evaluado" = `Evaluación
   Completa` = Sí** (es la señal de que el Lab de esa persona ya quedó calificado). Meta = N de aceptados (por definir).
2. **Asistencia** — asistieron / agendados, y **No asistieron** como indicador propio (cantidad y lista:
   al hacer clic se abre el directorio filtrado por "No asistió"). Regla en 4.3.
3. **Tasa de paso** — % con `opinión del evaluador` = `ACEPTADO:*` sobre evaluados completos.
4. **Pasan a matriculación** — cantidad y % del cupo de la cohorte (meta de cupos por definir).

**Avance por día** (gráfico de barras agrupadas, 19–30 oct): agendados vs. asistieron vs. evaluados,
con filtro por bloque (mañana/tarde). Sirve para ver ritmo y ocupación de franjas.

### Nivel 2 — Resultados y perfil de los que pasan

**2.1 Resultados — Modelo vs. Evaluador** (mismo layout que Lecturas):
- Bloque *Modelo (IA)*: `recomendacion_modelo` (valores reales de `MODEL_RECOMMENDATION__c`, **por
  confirmar**; en Lecturas son Pasar / Factor Ñ / Comité / Rechazar).
- Bloque *Evaluador (Humano)*: `opinion_evaluador_lab` — Aceptado (3 sub: De acuerdo / Creo que debería
  pasar / Factor "Ñ") y Rechazado (2 sub), igual que Entrevistas.
- **Matriz de concordancia** Modelo × Evaluador (2×2 o la que salga de los valores) y % de acuerdo.
- **Cambios de decisión**: cuántos candidatos cambiaron entre la opinión de Entrevista y la de Lab
  (Aceptado→Rechazado y viceversa). Posible porque se guardan ambas por separado.

**2.2 Puntajes de competencias** (reemplaza al "avance por evaluador"): una fila por competencia
con promedio, mediana, mínimo/máximo y distribución (histograma o boxplot), para: 5 minutos, actividad
grupal, juego de roles, ajuste a la organización, pensamiento crítico, perseverancia, permanencia y
compromiso, construcción de relaciones, y el **total PUNTAJE COMPETENCIAS**. Toggle "Aceptados vs.
Rechazados" para ver qué competencias separan a unos de otros (la pregunta de fondo: *¿qué puntajes
explican la decisión?*).

**2.3 Perfil de seleccionados — filtros y desgloses idénticos a Entrevistas** (sin cambios de diseño),
sobre los que tienen `opinion_evaluador_lab` = `ACEPTADO:*`:
tabs Univ. Priorizada / Bilingüe / STEM / STEM o Bilingüe / STEM y Bilingüe; Pregrado; Enfoque;
Rangos de edad (<22, 22–29, >29); Género; Ciudad de nacimiento (ranking territorial Cali /
Barranquilla / Medellín). **Filtros globales** de la sección: día del Lab, bloque, universidad
priorizada, edad, género, ciudad. (No aplica el filtro Staff/Externo.)

### Nivel 3 — Directorio de candidatos (reemplaza "Evaluador")

Sección al final de la página, a todo el ancho.

**Tabla de búsqueda:** una fila por persona que haya pasado por el historial. Columnas: nombre,
**etapa alcanzada** (badge: Aplicó / Lecturas / Entrevista / Lab / Matriculación), universidad,
opinión de Entrevista, opinión de Lab, modelo, fecha de Lab. **Barra de búsqueda** por nombre,
universidad, carrera, ciudad y, opcionalmente, texto dentro de los comentarios (búsqueda de texto
completo de Postgres). Filtros rápidos por etapa y por decisión. Paginación del lado del servidor.

**Al hacer clic en una fila → panel lateral "Ficha de la persona"** (decisión de Juanda 2026-10-26: **solo lo
más importante**, no todos los campos), en este orden:
1. **Evaluaciones y recomendaciones** (lo primero que se ve): tres tarjetas lado a lado — *Lecturas*
   (opinión + recomendación del modelo), *Entrevista* (opinión + recomendación al postulante),
   *LIDERA Lab* (opinión + modelo + recomendación al postulante).
2. **Puntajes finales**: los puntajes finales de las competencias (Lab: 5 minutos, actividad grupal, juego
   de roles, ajuste, pensamiento crítico, perseverancia, permanencia, construcción de relaciones y el total;
   Entrevista/Lecturas: puntajes finales que ya trae el Master). **Solo el puntaje final, sin el detalle de
   los componentes.**
3. **Comentarios**, en acordeón por etapa:
   - *Entrevista*: logros, perseverancia, permanencia y compromiso, construcción de relaciones, ajuste, inglés.
   - *LIDERA Lab*, **una tarjeta por sección con su promedio y sus comentarios**: Clase de 5 minutos, Actividad
     grupal, Juego de rol y Lidera tus finanzas (ver 4.2: cómo se calcula el promedio de cada sección).
   - *Lecturas*: observaciones de la lectora.
4. **Perfil y logística**: universidad, carrera, promedio, edad, género, ciudad, nivel de inglés,
   preferencias (región, zona, nivel), disponibilidad de instituto, **asistencia al Lab** (de la pestaña `Asistencia`).
5. **Línea de tiempo**: fecha de postulación, lectura, entrevista, Lab y estado.

*Se descarta la "tabla de todos los puntajes con buscador" de la versión anterior del diseño, y con ella el
catálogo de campos.*

## 4. Datos en Supabase

### 4.1 Lo que ya existe y se reutiliza
`candidates_convocatoria` (perfil, STEM, universidad, edad), `lecturas_progreso`, `entrevistas_progreso`,
vistas `lecturas_con_perfil` y `entrevistas_con_perfil`.

### 4.2 Tabla nueva — `lab_progreso` (1 fila por candidato en Lab; PK `id_dia_entrevista`)

| Grupo | Columnas (origen) |
|---|---|
| Llaves | `id_dia_entrevista` (PK), `id_contacto` |
| Agenda | `fecha_lab`, `id_fecha_agenda`, `bloque` (1/2), `subgrupo` (G1-A…), `evaluador_asistencia` (Master LL / Agenda) |
| Asistencia *(de la pestaña `Asistencia`, no del `Master`)* | `asistencia_b1`, `asistencia_b2`, `asistencia_b3`, `formato_clase`, `asistio` (calculado) |
| Clase de 5 minutos | `ser_profe` (HO Ser Profe), `im_incluye_intereses`, `im_comunicacion_presencia`, `im_escucha_responde`, `comentarios_ser_profesor` |
| Actividad grupal | `dinamica_grupo`, `im_atencion_ga`, `im_empatia_ga`, `act_gr_perseverancia`, `comentarios_actividad_grupal` |
| Juego de roles | `im_atencion_jr`, `im_empatia_jr`, `im_considera_audiencia`, `comentarios_juego_roles` |
| Lidera tus finanzas / HO | `ho_semana_vida_eco`, `ho_tarde_dia_entrevista`, `comentarios_ho` |
| Puntajes calculados (Salesforce) | `puntaje_5min`, `puntaje_actividad_grupal`, `puntaje_juego_roles`, `puntaje_ajuste`, `puntaje_pensamiento_critico`, `puntaje_perseverancia`, `puntaje_permanencia`, `puntaje_construccion_relaciones`, **`puntaje_competencias_total`**, `recomendacion_modelo` |
| Decisión | `opinion_evaluador_lab`, `comentarios_evaluador_lab`, `recomendacion_postulante_lab`, `evaluacion_completa` |
| **Resumen por sección** *(los que muestra la ficha)* | `promedio_clase_5min`, `promedio_actividad_grupal`, `promedio_juego_roles`, `promedio_lidera_finanzas` (+ los `comentarios_*` de cada sección, ya listados arriba) |
| Control | `created_at`, `updated_at` |

**Los componentes individuales (las ~17 calificaciones) se guardan en la tabla pero el dashboard no los muestra**
(decisión 2026-10-26): quedan disponibles para análisis futuro sin cambiar la ficha.

**Cómo se calcula el promedio de cada sección** (promedio simple de los componentes numéricos que tengan valor;
si no hay ninguno, queda vacío). Ojo: **las secciones no tienen el mismo número de componentes**:

| Sección | Componentes que se promedian | N |
|---|---|---|
| Clase de 5 minutos | `ser_profe`, `im_incluye_intereses`, `im_comunicacion_presencia`, `im_escucha_responde` | 4 |
| Actividad grupal | `dinamica_grupo`, `im_atencion_ga`, `im_empatia_ga`, `act_gr_perseverancia` | 4 |
| Juego de rol | `im_atencion_jr`, `im_empatia_jr`, `im_considera_audiencia` | 3 |
| Lidera tus finanzas | `ho_semana_vida_eco` (la otra, `ho_tarde_dia_entrevista`, es Si/No y se muestra como alerta) | 1 |

El promedio se calcula **en Supabase (columna generada o en la vista)**, no en el script de sync, para que la
fórmula viva en un solo lugar y se recalcule sola si cambia una calificación.

Fuente: `Master LIDERA Lab` (hoja `Master`) vía un script de sync igual al de Entrevistas
(`PropertiesService`, **sin hardcodear la key**), más la pestaña `Asistencia` (4.3) y los puntajes finales
faltantes (hallazgo 3).

### 4.3 Asistencia — pestaña nueva `Asistencia` (sin alterar el `Master`)

Pestaña nueva en el archivo Master LIDERA Lab, alimentada por un **script nuevo** (hermano de Fase C) que
recorre las pestañas por día de Agenda y, por cada persona, busca su fila y copia su asistencia:
- Pestañas automáticas (desde el 21 oct): cruce por **cédula** (columna `Cédula`).
- Pestañas manuales (Lunes 19, Martes 20): cruce por **nombre → cédula** vía el Master de Agenda, con la misma
  normalización de tildes/mayúsculas de Fase C (`normalizarNombreLideraLab_`).

**Regla de asistencia (definida por Juanda 2026-10-26, verificada en las pestañas):** una persona **NO asistió** si
se cumple cualquiera de estas: (a) su fila está **pintada de rojo** (en Lunes 19, `Carlos hernando tapia bastidas`
está en `#f4cccc` de Teléfono a Asistencia y con los 3 bloques vacíos), (b) los **3 bloques de asistencia están
vacíos**, o (c) los bloques están en **0**. En cualquier otro caso **asistió**. El script lee el color con
`getBackgrounds()` y considera "rojo" un fondo con rojo claramente dominante (no el blanco ni el gris de los
divisores `G1 - A`…). Se guarda además `bloques_asistidos` (cuántos de los 3 tienen 1) para distinguir asistencia
parcial. Las pestañas de Lunes 19 y Martes 20 ya traen columna `Cédula`, así que el cruce es por cédula en todas;
el cruce por nombre queda solo como respaldo.

**Script ya escrito:** `Scripts Appscript/LIDERA Lab/ProcesarLideraLab_8_Asistencia.md`, con dos funciones como las
otras fases: `calcularAsistenciaDiaActualLideraLab()` (al cierre del día) y
`calcularAsistenciaDiasAnterioresLideraLab()` (catch-up). Columnas de la pestaña `Asistencia`: `Nombre`, `Cédula`,
`Fecha`, `Asistencia` (Asistió / No asistió), **`Comentarios`** ("Asistió a los 3 bloques", "Asistió a 2 de 3 bloques
(faltó el bloque 2)", "Fila marcada en rojo", "Sin asistencia en ningún bloque"), `Bloque 1/2/3`, `Bloques
asistidos`, `Pestaña de origen`, `Id. Día de Entrevista`, `Actualizado`. Una fila por persona: cada corrida
actualiza a esa persona, no duplica. Es una tabla derivada (no se edita a mano) y es la fuente de las columnas de
asistencia de `lab_progreso` (`asistio` = `Asistencia = 'Asistió'`).

**Por qué el día actual se corre al cierre:** los bloques se llenan durante el día; si se calcula en la mañana,
quien aún no tiene su bloque marcado saldría como "No asistió". Los días futuros no son un problema porque el
script solo procesa pestañas de hoy o anteriores (una fecha futura no tiene pestaña de asistencia todavía).

### 4.4 Ampliar tablas existentes (solo lo que necesita la ficha)

- **`lecturas_progreso`** + `observaciones_lectura` (de `Master_Proceso`).
- **`entrevistas_progreso`** + los **comentarios** de Entrevista hoy ausentes (`comentario_logros`,
  `comentario_perseverancia`, `comentario_compromiso`, `comentario_relaciones`, `comentario_ajuste`,
  `comentario_ingles`) y los **puntajes finales** que ya trae el Master. Las calificaciones individuales de
  Entrevista no se sincronizan por ahora (agregarlas después es solo sumar columnas). **Excluir a propósito**
  `Cuéntame de tu Familia` y `¿Has sufrido alguna enfermedad?` (datos de familia y salud).
- Semántica: `entrevistas_progreso.opinion_evaluador` es la de **Entrevista**; la de Lab vive en
  `lab_progreso.opinion_evaluador_lab`.

### 4.5 Vista unificada — `candidatos_historial`
1 fila por persona, `LEFT JOIN` por los 15 primeros caracteres: `candidates_convocatoria` (base: todos los
que aplicaron) + `lecturas_progreso` + `entrevistas_progreso` + `lab_progreso`, con `etapa_alcanzada`
calculada. Es la fuente del directorio y de los KPIs del embudo.

## 5. Puntajes y totales — qué analizar y qué hay que definir

| Qué | Dónde está | Estado |
|---|---|---|
| 8 puntajes finales por competencia | Salesforce (`FINAL_*`), 4 ya en el Master | Agregar los otros 4 al Master |
| **Total** `PUNTAJE COMPETENCIAS` | `FINAL_ASSESSMENT_CENTER_SCORE__c` | No está en el Master — agregar |
| `RECOMENDACIÓN DEL MODELO` | `MODEL_RECOMMENDATION__c` | Ya en el Master; **confirmar valores posibles** |
| Puntajes de Lecturas/Entrevista (académico, ICFES, logros, coeficiente) | Master LL (grises) | Ya sincronizables |
| Otros "FINAL" posibles: habilidad organizacional, influencia y motivación, responsabilidad personal, logros y liderazgo | Salesforce | **Decidir si aportan** o ya están dentro del total |

**`RECOMENDACIÓN DEL MODELO` (decisión 2026-10-26):** no hace falta conocer su regla de cálculo; el dashboard
**solo recupera el campo** tal como viene de Salesforce y lo compara con la opinión del evaluador. No se muestra
"puntaje vs. umbral". Lo único que falta es ver qué valores toma (se leen del dato real al construir).

## 6. Seguridad — decisión de Juanda (2026-10-26): sin login, **ficha reducida**

No habrá login. El directorio muestra una **ficha reducida**, pensada para que solo la revise el **staff de
Enseña por Colombia**. En concreto:
- La ficha lee de una **vista dedicada** (`candidatos_ficha_reducida`) con solo las columnas de la sección 3:
  decisiones, puntajes finales, comentarios, perfil básico y asistencia. **No incluye** cédula, correo, teléfono,
  datos de salud ni de familia (que además no se sincronizan a Supabase).
- Las tablas base (`entrevistas_progreso`, `lab_progreso`, …) **no se exponen** al rol `anon`: se revoca su
  `SELECT` y solo se concede sobre las vistas del dashboard. Hoy las políticas son `USING (true)`.

**Limitación a tener presente:** sin login, "solo staff" se sostiene únicamente porque el enlace del dashboard
no se comparte fuera de Enseña por Colombia. Cualquiera que tenga el enlace puede ver la ficha reducida (incluidos
los comentarios de evaluadores). Si en algún momento hace falta una restricción real, el paso siguiente es Supabase
Auth con lista de correos autorizados, sin rehacer el diseño. La pregunta 5 del backlog (quiénes del staff)
queda para Tatiana.

## 7. Pendientes / preguntas para cerrar el diseño

**Resueltos (Juanda, 2026-10-26):**
- **Pasa a matriculación** = `opinion_evaluador_lab` = `ACEPTADO:*` (ajustable después, p. ej. al Estado comité).
  Solo se cuentan los **aceptados** para el perfil de seleccionados. **Evaluado** = `Evaluación Completa` = Sí.
- **Modelo:** solo se recupera el campo (sin regla de cálculo).
- **Asistió / no asistió:** regla en 4.3 (fila en rojo, o 3 bloques vacíos, o en 0 = no asistió). Los
  **no asistieron** son un indicador propio.

**Pendientes para Tatiana — pasados al `backlog.md` (sección "Dashboard de LIDERA Lab"):** meta de cupos de la
cohorte, meta de aceptados que van a Lab, confirmar la definición de "pasa a matriculación", qué es `Formato
Clase` (hoy el diseño no lo usa) y quiénes del staff ven la ficha reducida. Mientras no estén, las tarjetas
muestran cantidad y % sin meta.

**Resuelto:** seguridad (sección 6, ficha reducida sin login) y asistencia de días futuros (el script solo procesa
hoy y días anteriores).

**Siguen abiertos:**
1. ¿El directorio incluye a todos los que aplicaron o solo desde Lecturas en adelante? (propongo: filtro
   por defecto desde Entrevista).
2. ¿Se agrega la etapa de Matriculación al directorio cuando exista su tabla?

## 8. Orden de construcción sugerido

1. **Datos:** agregar al Master LL solo los puntajes finales faltantes (+ `MAPEO` + Fase D) — la asistencia
   va por la pestaña nueva `Asistencia` y su script, sin tocar la estructura del `Master`.
2. **Supabase:** `lab_progreso`, ampliar `lecturas_progreso`/`entrevistas_progreso`, vistas
   `candidatos_historial` y `candidatos_ficha_reducida`; scripts de sync (Lab, y extender el de Entrevistas y
   Lecturas); revocar el `SELECT` de `anon` sobre las tablas base.
3. **Dashboard:** Nivel 1 + Nivel 2 (reutilizando componentes de Entrevistas).
4. **Nivel 3** (directorio y ficha reducida).

# Alineación y corrección de indicadores, CSM LIDERA Cohorte 2027

**Fecha de corte:** 4 de noviembre de 2026
**Elaborado por:** Juan David Ramírez
**Propósito:** dejar registro de los indicadores que muestran valores distintos entre las pestañas
del dashboard y los Master (Google Sheets), explicar qué causa cada diferencia, qué hay que revisar
en los Master, y qué valor se usa en el reporte final de la convocatoria. Al final hay un prompt
para ajustar el dashboard en Google AI Studio, para que todas las pestañas hablen el mismo idioma.

**Fuentes cruzadas:**

| Fuente | Archivo / pestaña |
|---|---|
| Convocatoria | `Data_Raw_Conv` (workbook `1mkdjjH6m5hZrXbvs-KH9CtQfAEealqu_yKNwje-8uW0`) |
| Lecturas | Archivo "Lecturas", pestaña `Master_Lectura` |
| Entrevistas | Archivo "Master de Entrevista", pestaña `Master Entrevistas` |
| LIDERA Lab | Archivo "Master LIDERA Lab", pestaña `Master` |
| Dashboard | https://dashboard-lidera-cohorte-2027.vercel.app/ (pestañas Convocatoria, Lecturas, Entrevistas y LIDERA Lab) |

El cruce entre Master se hizo por persona, con el Id. de contacto y el Id. de Primera Revisión de
Salesforce normalizados a 15 caracteres (los Master mezclan Ids de 15 y de 18 caracteres).

---

## 1. Resumen: valor oficial para el reporte

| # | Indicador | Dashboard | Master | Valor oficial del reporte | Estado |
|---|---|---|---|---|---|
| 1 | Postulantes (base del embudo) | 2.022 (Lab) / 1.641 (Convocatoria) | 1.641 con formulario completo, 3.148 registros | **1.641** | Definición a unificar en el dashboard |
| 2 | Elegibles | 1.138 | 1.138 (`Data_Raw_Conv`) / 1.140 (`Master_Lectura`) | **1.138** | Revisar duplicados en Lecturas |
| 3 | Pasaron Lecturas | 678 (Lecturas) / 675 (Entrevistas y Lab) | 678 en `Master_Lectura` / 674 en `Master Entrevistas` | **678** | Revisar 4 personas |
| 4 | Aceptados en Entrevista | 232 (Entrevistas) / 228 (Lab) | 231 en `Master Entrevistas` / 228 en Master Lab | **231** | Revisar 3 personas |
| 5 | Elegibles Top 7 (Universidades Priorizadas) | 216 (tarjeta) / 310 de 408 (gráfica) | 216 de 263 postulantes | **216 de 263** | Unificar el cálculo de la gráfica |
| 6 | Citados al Lab (agendados) | 228 | 175 citados en octubre + 21 pre-evaluados de julio | **196** | Ajustar etiqueta y cálculo en el dashboard |
| 7 | Asistieron al Lab | 149 | 150 en `Asistencia` (octubre) + 21 pre-evaluados | **171** | Agregar a Laura Catalina Vera Bravo al Master |
| 8 | Evaluación completa | 149 | 148 en octubre + 21 pre-evaluados | **169** | Revisar 1 registro |
| 9 | Pasan a comité | 109 | 108 aceptados en octubre + 21 pre-evaluados aceptados | **130 (preliminar)** | Pre-evaluados cuentan, confirmación final de Tatiana |
| 10 | No asistieron | 79 | 26 en `Asistencia` | **26** | 32 personas nunca citadas se reportan aparte |

---

## 2. Detalle por indicador

### 2.1 Postulantes (base del embudo)

- **Qué se ve:** el embudo de la pestaña LIDERA Lab arranca en "Aplicaron 2.022". La pestaña
  Convocatoria muestra 1.641 postulantes.
- **Qué lo explica:** 2.022 son los pre-registros del formulario de interés, un universo distinto al
  de la convocatoria. 1.641 son los registros de `Data_Raw_Conv` con formulario completo. Al usar
  2.022 como base, la tasa de elegibilidad del embudo del Lab baja a 56%, cuando en Convocatoria
  es 69,3% (1.138 de 1.641).
- **Qué revisar en el Master:** nada, el dato del Master es correcto.
- **Ajuste en el dashboard:** el embudo del Lab debe usar 1.641 como base. Los 2.022 pre-registros
  se pueden mostrar aparte, como una etapa previa de interés, no como "Aplicaron".

### 2.2 Elegibles

- **Qué se ve:** 1.138 en todas las pestañas, pero `Master_Lectura` tiene 1.140 filas.
- **Qué lo explica:** hay 5 registros en `Master_Lectura` que no aparecen como elegibles en
  `Data_Raw_Conv`, y 3 elegibles que no aparecen en `Master_Lectura` con el mismo Id. de Primera
  Revisión. Al menos 2 personas (María Magdalena Morelo Moreno y Daniel Felipe Vesga Caro) tienen
  dos Id. de Primera Revisión distintos: uno quedó como elegible y el otro como "No cumple
  mínimos" con formulario incompleto. Frank Chavez es elegible y no aparece en `Master_Lectura`
  con su Id. actual.
- **Qué revisar en el Master:** confirmar en Salesforce cuál es la Primera Revisión vigente de estas
  personas y si Frank Chavez fue leído con otro Id.
- **Ajuste en el dashboard:** ninguno en la cifra de elegibles. En la pestaña Lecturas, aclarar que
  1.140 son lecturas realizadas, no elegibles.

### 2.3 Pasaron Lecturas

- **Qué se ve:** 678 en la pestaña Lecturas, 675 en Entrevistas y en el embudo del Lab.
- **Qué lo explica:** `Master_Lectura` tiene 678 personas con "Me gustaría que pase al día de
  entrevista". `Master Entrevistas` tiene 674. Hay **4 personas aprobadas en Lecturas que no llegaron
  a `Master Entrevistas`**:
  1. Jaiiro César Viloria Consuegra
  2. David Moreno Zapata
  3. Kinddly Marlovi Herrera Mina
  4. María Alejandra Vergara Ariza

  El 675 del dashboard tiene 1 persona más que `Master Entrevistas`, así que Supabase
  (`entrevistas_progreso`) tiene un registro que ya no está en el Master.
- **Qué revisar en el Master:** confirmar con Tatiana si las 4 personas desistieron o quedaron por
  fuera de Entrevistas por error. Identificar el registro sobrante en Supabase.
- **Ajuste en el dashboard:** todas las pestañas deben tomar "Pasaron Lecturas" del mismo campo
  (opinión del evaluador de Lecturas = "Me gustaría que pase al día de entrevista").

### 2.4 Aceptados en Entrevista

- **Qué se ve:** 232 en la pestaña Entrevistas, 228 en el embudo del Lab.
- **Qué lo explica:** `Master Entrevistas` tiene 231 ACEPTADO. El Master de Lab tiene 228. Hay
  **3 aceptados en Entrevista que no pasaron al Master de Lab**:
  1. Daniel Daza Cuéllar (ACEPTADO: De acuerdo)
  2. Juan Jacobo Cárdenas Castañeda (ACEPTADO: Tiene el factor "Ñ")
  3. Laura Catalina Vera Bravo (ACEPTADO: De acuerdo)

  El 232 del dashboard tiene 1 persona más que el Master, igual que en el punto 2.3. Además, en
  `Master Entrevistas` hay 16 registros sin "Evaluación completa = Si" (14 vacíos y 2 en "No").
- **Qué revisar en el Master:** confirmar si estas 3 personas desistieron, se agendaron en otro
  momento o se quedaron por fuera de la Fase A de LIDERA Lab. Revisar los 16 registros sin
  evaluación completa.
- **Ajuste en el dashboard:** el embudo del Lab debe mostrar "Aceptados Entrevista" con el mismo
  dato de la pestaña Entrevistas, y mostrar "Agendados" (228) como una etapa aparte.

### 2.5 Elegibles Top 7 (Universidades Priorizadas)

- **Qué se ve:** la tarjeta de Convocatoria dice 216 elegibles Top 7. La gráfica "Universidades
  Priorizadas (Top 7)" de la misma pestaña dice 310 elegibles de 408.
- **Qué lo explica:** con la columna calculada `UniversidadesPriorizadas` de `Data_Raw_Conv` salen
  216 elegibles de 263 postulantes con formulario completo, y 417 registros en total. La gráfica
  usa otro universo (incluye formularios incompletos) y probablemente clasifica la universidad por
  nombre en el código del dashboard en vez de leer la columna calculada.
- **Qué revisar en el Master:** nada, la columna calculada es la fuente de verdad.
- **Ajuste en el dashboard:** la gráfica debe usar la columna `UniversidadesPriorizadas` y el mismo
  universo de la tarjeta (postulantes con formulario completo). Mismo criterio para la gráfica
  Top 13 QS con `UniversidadTOP13QS`.

### 2.6 LIDERA Lab: citados, asistencia, evaluación y comité

**Cómo se arma el Master de Lab.** Los 228 registros del Master de LIDERA Lab son todas las
personas aceptadas en Entrevista que pasaron a esta etapa. Incluyen a los 21 pre-evaluados de julio
(pestaña `Candidatos pre-evaluados`), que fueron evaluados con la rúbrica del Lab antes de que
existiera el sistema. No son personas adicionales a los 228.

| Grupo dentro de los 228 | Personas |
|---|---|
| Pre-evaluados en julio (evaluados, todos con opinión ACEPTADO) | 21 |
| Citados a jornadas del 19 al 29 de octubre (pestaña `Asistencia`) | 175 |
| Nunca citados a una jornada | 32 |

**Cruce dashboard frente a Master:**

| Indicador | Dashboard | Master | Qué explica la diferencia | Valor oficial |
|---|---|---|---|---|
| Agendados / citados | 228 | 175 de octubre + 21 de julio | El dashboard cuenta todas las filas del Master como agendadas, incluidas 32 personas que nunca fueron citadas. | **196** |
| Asistieron | 149 | 150 "Asistió" en `Asistencia` | Laura Catalina Vera Bravo asistió el 28 de octubre, pero no está en el Master de Lab (es una de las 3 aceptadas en Entrevista que no pasaron al Master). Además, los 21 pre-evaluados aparecen como "No asistió" aunque fueron evaluados. | **171** (150 de octubre + 21 de julio) |
| Evaluación completa | 149 | 148 con "Evaluación completa = Si" | Hay 1 registro que asistió y no tiene marcada la evaluación completa. | **169** (148 + 21) |
| Pasan a comité | 109 | 108 aceptados con evaluación completa + 21 pre-evaluados aceptados | El dashboard solo cuenta a quienes asistieron en octubre y deja por fuera a los 21 pre-evaluados. Los pre-evaluados cuentan para comité (confirmado preliminarmente por Juan David el 2026-11-04). | **130 (preliminar)** |
| No asistieron | 79 | 26 "No asistió" en `Asistencia` | 79 es 228 menos 149. Mezcla tres grupos: 26 inasistentes reales, 21 evaluados en julio y 32 nunca citados. | **26** inasistentes, y **32** sin citar reportados aparte |

**Por qué 160 ACEPTADO en el Master no son 160 aceptados del Lab.** El Lab y la Entrevista
comparten el mismo registro "Día de Entrevista" en Salesforce (confirmado por Juan David el
2026-11-04). Por eso el campo "Opinión del Evaluador" del Master de Lab trae, para quienes no
asistieron, la opinión que quedó de la Entrevista. Los 31 registros con opinión ACEPTADO y sin
evaluación completa corresponden casi todos a inasistentes en la pestaña `Asistencia` (por ejemplo
Gabriel Alexandre Farias Sánchez, Adrián David Molina Almanza, Ana María Quintero Ramírez,
Jimena Andrea Bubu España, Kellys Yojana Ariza Alvernia). No se cuentan para comité.

**Regla para el dashboard:** una opinión ACEPTADO en el Master de Lab solo cuenta como aceptación
del Lab si la persona asistió (pestaña `Asistencia`) y tiene evaluación completa, o si es
pre-evaluada.

| Escenario | Pasan a comité | Frente a 80 cupos |
|---|---|---|
| Dashboard hoy | 109 | 136% |
| **Valor oficial (con los 21 pre-evaluados)** | **130** | **163%** |

---

## 3. Pendientes de confirmación con Tatiana

Las preguntas abiertas quedaron en un documento aparte:
[Preguntas_Tatiana_Alineacion_Indicadores.md](Preguntas_Tatiana_Alineacion_Indicadores.md).

---

## 4. Prompt para Google AI Studio (ajuste del dashboard)

Copiar el bloque completo en Google AI Studio:

```
Contexto: el dashboard "BI Dash Funnel Convocatoria LIDERA" (Vite + React 19 + TypeScript +
Tailwind v4 + Recharts, datos desde Supabase con @supabase/supabase-js) tiene 4 pestañas
(Convocatoria, Lecturas, Entrevistas, LIDERA Lab) que hoy muestran valores distintos para los
mismos indicadores. Necesito que todas las pestañas hablen el mismo idioma: cada indicador debe
calcularse una sola vez, en un solo lugar, y reutilizarse en todas las pestañas.

1. Crea un módulo único de métricas compartidas (por ejemplo src/lib/funnelMetrics.ts) que
   calcule estos indicadores y que todas las pestañas importen. Ninguna pestaña debe recalcularlos
   por su cuenta ni tener valores fijos en el código:
   - postulantes = registros de candidates_convocatoria con form_completo = 'SI'.
   - elegibles = postulantes con "Cumple mínimos" (mismo criterio que ya usa la pestaña
     Convocatoria).
   - lecturasRealizadas = registros de lecturas_progreso.
   - pasaronLecturas = registros de lecturas_progreso con opinión del evaluador
     "Me gustaría que pase al día de entrevista".
   - evaluadosEntrevista = registros de entrevistas_progreso con opinión del evaluador no vacía.
   - aceptadosEntrevista = registros de entrevistas_progreso con opinión que empieza por
     "ACEPTADO".
   - agendadosLab, asistieronLab, evaluadosLab, pasanComite, noAsistieronLab, sinCitarLab =
     según las reglas del punto 6 (incluye a los pre-evaluados).
   - preRegistrosInteres = total del formulario de interés (2.022), como dato aparte.

2. Pestaña LIDERA Lab, embudo "Etapas previas de la convocatoria":
   - Cambia la etapa "Aplicaron" para que use postulantes (1.641), no los pre-registros del
     formulario de interés (2.022). Recalcula los porcentajes de paso con esa base.
   - "Pasaron Lecturas" y "Aceptados Entrevista" deben venir del módulo compartido, con el mismo
     valor que muestran las pestañas Lecturas y Entrevistas.
   - Muestra "Agendados" como etapa aparte, para que se vea la diferencia entre aceptados en
     Entrevista y agendados en el Lab.
   - Si quieres conservar los pre-registros, muéstralos como un dato informativo fuera del embudo,
     con la etiqueta "Pre-registros (formulario de interés)".

3. Pestaña Entrevistas: "Pasaron a Entrevista" debe ser pasaronLecturas del módulo compartido, y
   "Aceptados" debe ser aceptadosEntrevista. Revisa por qué hoy muestra 675 y 232 cuando la fuente
   tiene 674 evaluados y 231 aceptados: probablemente hay un registro huérfano en Supabase o se
   cuenta un duplicado. Cuenta por Id. de contacto único.

4. Pestaña Convocatoria, gráficas "Universidades Priorizadas (Top 7)" y "Top Universidades
   Priorizadas (Top 13 QS)":
   - Deben usar las columnas calculadas que ya vienen en la tabla (UniversidadesPriorizadas y
     UniversidadTOP13QS = 'SI'), no clasificar la universidad por nombre en el código.
   - Deben usar el mismo universo que la tarjeta de Universidades Priorizadas: postulantes con
     form_completo = 'SI'. Con eso, la gráfica Top 7 debe sumar 216 elegibles de 263 postulantes,
     igual que la tarjeta (hoy muestra 310 de 408).

5. Pestaña Lecturas: aclara en la tarjeta "Avance global" que 1.140 son lecturas realizadas y no
   elegibles (la etiqueta actual puede confundirse con el total de elegibles, 1.138).

6. Pestaña LIDERA Lab, etapas del Lab. El Lab y la Entrevista comparten el mismo registro
   "Día de Entrevista" en Salesforce, así que el campo "Opinión del Evaluador" de lab_progreso trae
   la opinión de la Entrevista para quienes no asistieron al Lab. Ajusta así:
   - Pre-evaluados: identifica a los candidatos de la pestaña "Candidatos pre-evaluados" del
     Master LIDERA Lab (21 personas, evaluados en julio). Si lab_progreso no tiene un campo que
     los marque, agrega uno (por ejemplo es_pre_evaluado boolean) en el script de sincronización
     con Supabase. Estos candidatos cuentan como agendados, como asistentes, como evaluación
     completa y, si su opinión es ACEPTADO, como pasan a comité. Nunca deben contarse como
     inasistentes. En el directorio, su asistencia debe decir "Pre-evaluado (julio)".
   - Agendados: cuenta solo a quienes tienen jornada asignada (aparecen en la pestaña Asistencia o
     tienen Fecha agenda de jornada) más los pre-evaluados. Hoy cuenta todas las filas (228); el
     valor esperado es 196. Las personas sin jornada asignada se muestran aparte como
     "Sin citar" (32).
   - Asistieron: "Asistió" en Asistencia más los pre-evaluados. Valor esperado: 171 (170 mientras
     Laura Catalina Vera Bravo no esté en lab_progreso).
   - Evaluación completa: Evaluación completa = Si más los pre-evaluados. Valor esperado: 169.
   - Pasan a comité: opinión que empieza por "ACEPTADO" solo si la persona asistió y tiene
     evaluación completa, o si es pre-evaluada. Valor esperado: 130. Una opinión ACEPTADO de
     alguien marcado "No asistió" en Asistencia no cuenta (es la opinión de la Entrevista).
   - No asistieron: solo "No asistió" en Asistencia. Valor esperado: 26.
   - En la columna "Opinión Lab" del directorio, para inasistentes muestra "No asistió" en vez de
     la opinión heredada de la Entrevista.
   - Recalcula con estos valores las tarjetas "Avance del Lab", "Asistencia al Lab", "Tasa de paso
     (Lab)" y "Pasan a comité" (130 de 80 cupos).

7. Validación: al terminar, muestra en una tabla los valores de cada indicador del punto 1 tal
   como los ve cada pestaña. Todas las columnas deben coincidir. Si alguna no coincide, explica
   por qué antes de cerrar el cambio.

No cambies los criterios de negocio (elegibilidad, opinión del evaluador, asistencia). Solo
unifica de dónde se toma cada valor y aplica la regla de pre-evaluados y de opinión heredada del
punto 6.
```

**Nota:** los valores esperados del punto 6 son al corte del 4 de noviembre de 2026. Si Tatiana
agrega a Laura Catalina Vera Bravo al Master de Lab o resuelve los 32 sin citar, cambian.

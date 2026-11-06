# Reporte final de la convocatoria LIDERA, Cohorte 2027

**Proceso:** Convocatoria, Selección y Matrícula (CSM), Enseña por Colombia
**Fecha de corte:** 4 de noviembre de 2026 (embudo hasta comité) y 6 de noviembre de 2026 (cohorte seleccionada y matrícula)
**Elaborado por:** Juan David Ramírez

> **Alcance de los datos:** este reporte cubre el proceso completo, desde la convocatoria hasta la
> matrícula. "Pasa a comité" son las personas que el LIDERA Lab recomienda llevar a comité de
> selección. "Seleccionado" son las personas que el comité eligió para la cohorte y fueron
> invitadas a matricularse (pestaña `Cohorte 2027` de Candidatos, consolidada en la base de
> Matriculados). La cifra de seleccionados todavía puede cambiar: era 63 el 5 de noviembre y es 61
> el 6 de noviembre.

**Convención para la plataforma de BI:** los bloques marcados con `📊 VISUAL` indican qué gráfico o
tarjeta debe construirse, con qué datos y qué mensaje debe transmitir. El texto alrededor es el
contenido del reporte.

---

## 1. Resumen ejecutivo

La convocatoria 2026 (Cohorte 2027) cumplió y superó sus metas de volumen y llevó a comité a
**130 personas para 80 cupos**. Pero el comité seleccionó a **61**, el 76% de los cupos: el proceso
no se queda corto en atracción ni en evaluación, sino en el último paso. El comité es, además, el
filtro que más cambia el perfil: quienes quedan son mucho más bilingües, de universidades
priorizadas y de Cundinamarca que quienes llegaron a comité.

📊 VISUAL: fila de 6 tarjetas KPI. Cada tarjeta lleva un título corto (en una sola línea), la
cifra grande y una línea de detalle debajo. Ningún texto se corta: si no cabe, la tarjeta crece en
alto o la fila pasa a dos filas de 3.

| Título de la tarjeta | Cifra | Detalle | Estado |
|---|---|---|---|
| Postulantes | 1.641 | Meta 1.500 (109%) | Cumplida |
| Elegibles | 1.138 | Meta 978 (116%) | Cumplida |
| Elegibles Top 7 | 216 | Meta 300 (72%) | No cumplida, color de alerta |
| En comité | 130 | 80 cupos (163%) | Cumplida |
| Seleccionados | 61 | 80 cupos (76%) | No cumplida, color de alerta |
| Conversión total | 3,7% | 61 de 1.641 postulantes | — |

**Metas: se cumplieron 3 de 5.** Postulantes, elegibles y personas en comité superaron su meta. No
se cumplieron la meta de elegibles de universidades priorizadas (72%) ni la de cupos de la cohorte
(61 seleccionados para 80 cupos, 76%). El detalle está en la sección 4.1.

**Seis conclusiones principales:**

1. **La cohorte no llena los cupos.** 130 personas llegaron a comité y 61 quedaron seleccionadas,
   menos de la mitad. Con 80 cupos, faltan 19. El cuello de botella final no es de volumen.
2. **Las metas de volumen se superaron, pero la meta de calidad estratégica no.** Hubo 26,6% más
   elegibles que en 2025 (1.138 frente a 899), pero los elegibles de universidades priorizadas
   quedaron en 72% de la meta.
3. **Referidos y gira convierten el doble que redes sociales.** Redes sociales aporta el 79% de los
   elegibles, pero solo 9,0% de ellos llega a comité. Referidos (20,3%) y gira (19,0%) duplican
   esa tasa con mucho menos volumen.
4. **La universidad priorizada pesa más a cada paso.** Duplica la probabilidad de llegar a comité
   (19,9% frente a 9,3%) y en comité vuelve a pesar: es el 33% de quienes llegan y el 46% de la
   cohorte seleccionada.
5. **La edad es el filtro más fuerte del proceso.** El 43% de los elegibles tiene 30 años o más;
   en comité son el 18% y en la cohorte seleccionada el 13%.
6. **La brecha de equidad se cierra en cero.** Las personas afrodescendientes e indígenas llegan a
   comité a la mitad de la tasa del resto, y ninguna de las 9 que llegaron quedó seleccionada.

---

## 2. Alcance, fuentes y definiciones

**Periodo de convocatoria:** 28 de julio al 13 de septiembre de 2026 (con extensión; el cierre
original era el 6 de septiembre).

**Fuentes:** formulario de convocatoria en Salesforce (procesado en `Data_Raw_Conv`), Master de
Lecturas, Master de Entrevistas, Master de LIDERA Lab, la base consolidada de Matriculados
(BD MATRÍCULADOS P2026-C2027) y el dashboard de BI. Las cifras de este
reporte son las cifras oficiales, conciliadas entre las distintas fuentes.

| Término | Definición |
|---|---|
| Pre-registro | Persona que llenó el formulario de interés (2.022). No es postulante. |
| Postulante | Persona con el formulario de convocatoria completo (1.641). |
| Elegible | Postulante que cumple mínimos: año de grado válido, promedio ≥ 3,5, perfil STEM o bilingüe, carrera aceptada y documento no duplicado. |
| HPC | Elegible con responsabilidad familiar, pago de estudios propio o experiencia como monitor. |
| Ruta Promisorios | Elegible de una de las 7 universidades priorizadas. |
| Pre-evaluado | Candidato evaluado con la rúbrica del Lab en julio, antes de las jornadas de octubre (21 personas). |
| Pasa a comité | Aceptado en LIDERA Lab con evaluación completa, o pre-evaluado aceptado. |
| Seleccionado | Persona elegida por el comité para la cohorte e invitada a matricularse (61). |
| Matriculado | Seleccionado con la matrícula confirmada en Candidatos (60). |

**Limitaciones:**
- La cifra de comité (130) es preliminar hasta que Tatiana confirme que los 21 pre-evaluados cuentan.
- El perfil de comité de las secciones 9 y 10 se calcula sobre 129 de las 130 personas (una no tiene
  marcada la evaluación completa en el Master).
- Los pre-evaluados se postularon en julio, así que inflan la conversión de ese mes (ver 4.2).
- La cifra de seleccionados (61) puede cambiar mientras Tatiana ajusta la cohorte, y falta
  confirmar qué significa exactamente "matriculado" (hay una persona invitada sin la marca).
- La comparación comité frente a seleccionados (sección 8) cruza dos bases distintas: el perfil
  de comité sale de los Master de las etapas y el de seleccionados de la base de Matriculados,
  cruzada con Convocatoria por cédula (cruzan las 61).

---

## 3. Embudo completo

📊 VISUAL: embudo de 9 etapas, de postulantes a matriculados. Cada barra es proporcional a su
número de personas, así que cada etapa es más angosta que la anterior y las últimas (comité,
seleccionados, matriculados) son las más pequeñas. Barras horizontales centradas, una debajo de
otra, con el mismo color degradado de oscuro a claro. Las etiquetas (nombre de la etapa, número
absoluto y % de paso desde la etapa anterior) van al lado de cada barra, fuera de ella, para que
ninguna línea del gráfico las corte. Los pre-registros van en una barra gris aparte, antes del
embudo, con la etiqueta "Interés (no postulantes)".

Layout en dos columnas: a la izquierda el embudo; a la derecha 4 tarjetas cortas de insights, en el
mismo orden del proceso (de arriba a abajo):
1. "Lecturas: filtro de volumen, pasa el 60% de los elegibles"
2. "Entrevista: el filtro más exigente, pasa 1 de cada 3"
3. "Entre Entrevista y el Lab se pierden 60 personas aceptadas"
4. "Comité: el segundo filtro más exigente, quedan 61 para 80 cupos"

| Etapa | Personas | Paso desde la etapa anterior | Acumulado desde postulantes |
|---|---|---|---|
| Pre-registros (interés) | 2.022 | — | — |
| Postulantes | 1.641 | — | 100% |
| Elegibles | 1.138 | 69,3% | 69,3% |
| Pasan Lecturas | 678 | 59,6% | 41,3% |
| Aceptados en Entrevista | 231 | 34,1% | 14,1% |
| Citados al Lab | 196 | 84,8% | 11,9% |
| Asistieron al Lab | 171 | 87,2% | 10,4% |
| Pasan a comité | 130 | 76,9% de los evaluados | 7,9% |
| **Seleccionados (invitados a matricularse)** | **61** | **46,9%** | **3,7%** |
| Matriculados | 60 | 98,4% | 3,7% |

**Lectura del embudo, en orden del proceso:**
- **Lecturas filtra 4 de cada 10 elegibles.** Es un filtro de volumen.
- **Entrevista es el filtro más exigente:** solo 1 de cada 3 personas pasa. Es donde más se define
  el perfil final.
- **Entre Entrevista y el Lab se pierden 60 personas sin evaluar:** 32 nunca fueron citadas a una
  jornada, 26 no asistieron y 3 no pasaron al Master del Lab. Es la fuga más evitable del proceso,
  porque son personas que ya habían sido aceptadas.
- **El Lab confirma más de lo que filtra:** 3 de cada 4 evaluados pasan a comité.
- **El comité es el segundo filtro más exigente:** elige a menos de la mitad (46,9%), y deja la
  cohorte en 61 personas para 80 cupos.
- **Quien es seleccionado se matricula:** 60 de 61 tienen la matrícula confirmada.

---

## 4. Convocatoria: volumen y calidad

### 4.1 Cumplimiento de metas y comparación con 2025

📊 VISUAL: tabla de metas con un indicador de estado por fila (verde cumplida, rojo no cumplida) y
una barra de avance frente a la meta. Debajo, barras agrupadas 2025 frente a 2026 para elegibles
(899 frente a 1.138) y tasa de elegibilidad (66,2% frente a 69,3%).

| Meta | Resultado | Meta | Avance | Estado |
|---|---|---|---|---|
| Postulantes | 1.641 | 1.500 | 109% | Cumplida |
| Elegibles | 1.138 | 978 | 116% | Cumplida |
| Elegibles de universidades priorizadas (Top 7) | 216 | 300 | 72% | No cumplida |
| Personas en comité | 130 | 80 cupos | 163% | Cumplida |
| Cohorte seleccionada | 61 | 80 cupos | 76% | No cumplida |

- **Se cumplieron 3 de las 5 metas.** Las tres de volumen (postulantes, elegibles y comité) se
  superaron con holgura. Las dos que no se cumplieron son las que miden calidad y cierre: elegibles
  de universidades priorizadas y cupos de la cohorte.
- **1.138 elegibles, 26,6% más que en 2025** (899). La tasa de elegibilidad subió de 66,2% a 69,3%:
  además de más volumen, entró una proporción algo mayor de perfiles que cumplen.
- **La meta Top 7 se quedó en 72% (216 de 300),** aunque el grupo creció 53% frente a 2025.
- **La meta de cupos no se cumplió aunque comité tuvo 1,6 personas por cupo:** el comité seleccionó
  a 61 de 130 (ver sección 8).

### 4.2 Dinámica en el tiempo

📊 VISUAL: barras semanales de postulantes (semana 0 a semana 7) con línea de tasa de elegibilidad
semanal. Resaltar la semana 7 (extensión, 8 al 13 de septiembre).

| Semana | Postulantes | Tasa de elegibilidad |
|---|---|---|
| 0 (antes del 28 jul) | 34 | 100% |
| 1 (28 jul a 3 ago) | 394 | 66,0% |
| 2 (4 a 10 ago) | 121 | 68,6% |
| 3 (11 a 17 ago) | 70 | 78,6% |
| 4 (18 a 24 ago) | 233 | 73,8% |
| 5 (25 a 31 ago) | 179 | 72,1% |
| 6 (1 a 7 sep) | 146 | 77,4% |
| 7 (8 a 13 sep) | 464 | 62,9% |

- **La semana de extensión trajo el 28% de los postulantes** (464), el pico de toda la convocatoria,
  pero con la tasa de elegibilidad más baja (62,9%).

### 4.3 Por qué no cumplen mínimos

📊 VISUAL: barras horizontales de motivos de no cumplimiento entre los 503 postulantes no elegibles.

| Motivo | Personas |
|---|---|
| Enfoque (ni STEM ni bilingüe) | 366 |
| Enfoque y carrera no aceptada | 52 |
| Carrera no aceptada | 31 |
| Enfoque y nivel (normalista o técnico) | 20 |
| Promedio | 15 |
| Nivel (normalista o técnico) | 14 |
| Otros combinados | 4 |

- **El 73% de los no elegibles se cae solo por enfoque:** no son STEM ni bilingües. Es un problema de
  mensaje, no de exigencia: la difusión atrae perfiles que no encajan con el requisito central.
- El promedio casi no filtra (15 personas). El requisito académico no es la barrera.

### 4.4 Potencial perdido: formularios incompletos

📊 VISUAL: tarjeta destacada con "688 personas cumplían mínimos y no terminaron el formulario".

- **688 personas cumplían los mínimos pero dejaron el formulario incompleto.** Es un 60% adicional
  sobre los 1.138 elegibles. Si se recuperara solo un tercio de ellas, con la conversión promedio
  del embudo (11,3%), serían unas 25 personas más en comité.
- Es la palanca de crecimiento más barata para la próxima convocatoria: ya mostraron interés y
  cumplen el perfil.

---

## 5. Lecturas

📊 VISUAL: dos barras apiladas lado a lado, "Modelo" frente a "Evaluador", sobre 1.140 lecturas.
Modelo: Pasar 560, Factor Ñ 323, Comité 126, Rechazar 131. Evaluador: Pasa 678, No pasa 422,
Descalificado por plagio 40.

- 1.140 lecturas completadas por 13 evaluadores, el 100% de lo asignado.
- **678 pasan a Entrevista (59,6% de los elegibles).**
- **El evaluador es más exigente que el modelo:** el modelo recomienda avanzar al 77,5% (pasar o
  factor Ñ) y los evaluadores aprueban al 59,5%. Es una diferencia de 18 puntos, que muestra que el
  modelo sirve de primer filtro pero no reemplaza el criterio humano.
- **40 personas fueron descalificadas por plagio** (3,5%). Es un volumen suficiente para justificar
  una verificación automática del ensayo en la próxima convocatoria.

---

## 6. Entrevistas

📊 VISUAL: dona de resultados de Entrevista sobre 675 evaluados. Aceptados: De acuerdo 95, Creo que
debería pasar 70, Factor Ñ 67. Rechazados: Firmemente de acuerdo 309, Podría ser Eco en el futuro 134.

- **231 aceptados, 34,1% de quienes pasaron Lecturas.** Es la etapa más selectiva del proceso.
- 20 evaluadores (12 de staff y 8 externos) completaron el 100% de lo asignado.
- **El 29% de los aceptados entra por "factor Ñ"** (67 de 232 en el dashboard): una de cada tres
  aceptaciones se apoya en el juicio del evaluador más que en la rúbrica.
- **134 rechazados "podrían ser Eco en el futuro".** Es un grupo con potencial reconocido por el
  propio evaluador, que puede convertirse en base de reclutamiento para la siguiente cohorte.

---

## 7. LIDERA Lab

📊 VISUAL: embudo corto del Lab: citados 196 → asistieron 171 → evaluación completa 169 → pasan a
comité 130. Al lado, tarjeta "Pre-evaluados (julio): 21, todos pasan a comité".

| Indicador | Valor |
|---|---|
| Citados (octubre + pre-evaluados) | 196 |
| Asistieron | 171 (87,2%) |
| No asistieron | 26 |
| Nunca citados | 32 |
| Evaluación completa | 169 |
| Pasan a comité | 130 (76,9% de los evaluados) |
| Rechazados en Lab | 40 |

- **El Lab confirma a 3 de cada 4 evaluados.** Las etapas anteriores ya hicieron la mayor parte del
  filtro.
- **La asistencia es buena (87%), pero la citación no:** 32 personas aceptadas en Entrevista nunca
  fueron citadas a una jornada. Si su paso por el Lab fuera igual al promedio, serían unas 20 personas
  más en comité.
- **30 de los 40 rechazados en Lab "podrían ser Eco en el futuro"**, el mismo patrón que en
  Entrevista.
- La cifra de comité incluye a los 21 pre-evaluados de julio, pendiente de la confirmación final de
  Tatiana.

---

## 8. Comité y matrícula

📊 VISUAL: embudo corto: pasan a comité 130 → seleccionados 61 → matriculados 60, con la meta de
80 cupos como línea de referencia. Al lado, barras de "tasa de selección en comité" por grupo
(universidad priorizada, enfoque, edad, departamento), con una línea en el promedio (47%).

**El comité eligió a 61 de las 130 personas que llegaron (46,9%).** La cohorte queda en el 76% de
los 80 cupos. No hay en las bases un motivo registrado de por qué no se seleccionó a las otras 69
(decisión del comité, desistimiento u otro), así que no se puede decir cuánto de la brecha es
filtro y cuánto es pérdida. Es la primera pregunta para cerrar con el equipo de selección.

**El comité no es neutral frente al perfil.** Selecciona en proporciones muy distintas según el
grupo (tasas calculadas sobre las 129 personas de comité con perfil completo):

| Grupo | En comité | Seleccionados | Tasa de selección |
|---|---|---|---|
| Universidad priorizada (Top 7) | 43 | 28 | **65%** |
| No priorizada | 86 | 33 | 38% |
| Bilingüe | 60 | 41 | **68%** |
| STEM y bilingüe | 22 | 11 | 50% |
| STEM | 47 | 9 | **19%** |
| 23 años o menos | 22 | 11 | 50% |
| 24 a 26 | 49 | 28 | 57% |
| 27 a 29 | 35 | 14 | 40% |
| 30 o más | 23 | 8 | 35% |
| Cundinamarca | 53 | 34 | **64%** |
| Nariño | 15 | 2 | **13%** |
| Afrodescendientes e indígenas | 9 | 0 | **0%** |

- **STEM es lo que más se pierde en comité:** 47 personas STEM llegaron y 9 quedaron (19%). STEM
  era el grupo más grande de elegibles (45%) y es el 15% de la cohorte. Si el programa necesita
  docentes STEM, esta es la decisión que más lo explica.
- **El bilingüe y la universidad priorizada se refuerzan en comité:** dos de cada tres llegan a la
  cohorte.
- **Nariño, el departamento que mejor convertía hasta comité, casi desaparece:** 15 personas en
  comité, 2 seleccionadas. Cundinamarca pasa del 41% del comité al 56% de la cohorte.
- **Ninguna de las 9 personas afrodescendientes o indígenas que llegaron a comité fue
  seleccionada.** Los números son pequeños, pero con la brecha que ya existía en Entrevista y en
  el Lab, el resultado es una cohorte sin ninguna persona de esos grupos.
- **El canal ya no diferencia:** redes, referidos y gira se seleccionan en proporciones parecidas
  (47%, 47% y 50%). Lo que gana referidos y gira ocurre antes de comité.

**Lo que dice la matrícula** (formulario de matriculación y documentos, base de Matriculados):

| Indicador | Valor |
|---|---|
| Respondieron el formulario de matriculación | 60 de 61 |
| Entregaron documentos (PDF en la carpeta) | 55 de 61 |
| Confirman disponibilidad para el instituto presencial en Cali | 60 de 60 |
| Aceptan vivir en la región que se les asigne | 60 de 60 |
| Están a la espera de nombramiento en el concurso docente | 9 (15%) |
| Abiertos a cualquier región (entrevista) | 45 (74%) |
| Pueden enseñar inglés (entrevista) | 51 (84%) |

- **El compromiso declarado es alto:** todas las personas que respondieron confirman el instituto
  y aceptan la región asignada.
- **El riesgo de deserción más concreto son las 9 personas que esperan un nombramiento docente.**
  Si les sale la plaza durante el programa, pueden irse. Vale la pena seguirlas desde ya.
- **6 personas no han entregado documentos** y 1 no ha respondido el formulario.

---

## 9. Cómo cambia el perfil a lo largo del proceso

Esta es la sección central del análisis. Muestra qué perfiles avanzan más y cuáles se quedan en el
camino, comparando la composición de los elegibles con la de quienes pasan a comité.

📊 VISUAL: para cada dimensión, barras de "tasa de conversión elegible → comité" por grupo, con una
línea de referencia en el promedio (11,3%). Se recomienda una página con un selector de dimensión
(canal, universidad, ruta, enfoque, edad, inglés, grupo étnico, departamento).

📊 VISUAL alternativo: diagrama de Sankey Elegibles → Lecturas → Entrevista → Comité, coloreado por
la dimensión seleccionada.

**Promedio de referencia: 11,3% de los elegibles llega a comité** (129 de 1.138).

### 9.1 Canal de atracción

| Canal | Elegibles | Pasan Lecturas | Aceptados Entrevista | Comité | Conversión |
|---|---|---|---|---|---|
| Redes sociales LIDERA | 896 | 508 | 161 | 81 | 9,0% |
| Referidos | 158 | 111 | 43 | 32 | **20,3%** |
| Gira LIDERA | 84 | 59 | 27 | 16 | **19,0%** |

- **Referidos y gira convierten más del doble que redes sociales.** Redes trae volumen (79% de los
  elegibles), pero referidos y gira traen perfiles que encajan mejor.
- Referidos es el 14% de los elegibles y el 25% del comité.

### 9.2 Universidad y ruta

| Grupo | Elegibles | Comité | Conversión |
|---|---|---|---|
| Universidad priorizada (Top 7) | 216 | 43 | **19,9%** |
| No priorizada | 922 | 86 | 9,3% |
| Universidad Top 13 QS | 275 | 49 | **17,8%** |
| No Top 13 | 863 | 80 | 9,3% |
| Ruta Promisorios | 363 | 60 | **16,5%** |
| Ruta General | 775 | 69 | 8,9% |

- Ser de una universidad priorizada duplica la probabilidad de llegar a comité. El 19% de los
  elegibles es Top 7, pero en comité es el 33%.
- Esto refuerza que la meta Top 7 (no cumplida) es la que más impacto tiene en la calidad final.

### 9.3 Enfoque e inglés

| Enfoque | Elegibles | Comité | Conversión |
|---|---|---|---|
| Bilingüe | 420 | 60 | **14,3%** |
| STEM y bilingüe | 201 | 22 | 10,9% |
| STEM | 517 | 47 | 9,1% |

- **El perfil bilingüe es el que mejor convierte**, por encima incluso de STEM y bilingüe.
- Entre los STEM, el inglés bajo frena: A1 convierte 2,4% y A2 5,6%, frente a 12% a 15% en B1 a C1.
- STEM es el grupo más grande de elegibles (45%) y el que menos convierte. Si la necesidad de cupos es
  STEM, el cuello de botella está en el proceso de selección, no en la atracción.

### 9.4 Edad

| Edad | Elegibles | Pasan Lecturas | Aceptados Entrevista | Comité | Conversión |
|---|---|---|---|---|---|
| 23 o menos | 102 | 77 | 38 | 22 | **21,6%** |
| 24 a 26 | 307 | 205 | 89 | 49 | 16,0% |
| 27 a 29 | 244 | 162 | 56 | 35 | 14,3% |
| 30 o más | 485 | 234 | 48 | 23 | **4,7%** |

- **El 43% de los elegibles tiene 30 años o más, pero solo es el 18% del comité.**
- La caída se concentra en Entrevista: de los mayores de 30 que pasan Lecturas, solo el 20,5% es
  aceptado, frente a 49% de los menores de 24.
- Hay que decidir si esto es un criterio deliberado del programa o un sesgo del proceso. Si es
  deliberado, conviene decirlo en la convocatoria para no atraer un volumen que no va a avanzar.

### 9.5 Grupo étnico

| Grupo | Elegibles | Comité | Conversión |
|---|---|---|---|
| Ninguno de los anteriores | 971 | 120 | 12,4% |
| Afrodescendientes | 100 | 5 | **5,0%** |
| Indígenas | 63 | 4 | **6,3%** |
| Raizales y palenqueros | 4 | 0 | 0% |

- **Las personas afrodescendientes e indígenas llegan a comité a la mitad de la tasa del resto.**
- En el caso afrodescendiente, la caída ocurre en Entrevista (30% de aceptación) y sobre todo en
  el Lab (5 de 17 aceptados en Entrevista llegan a comité).
- Los números son pequeños y pueden variar con pocos casos, pero el patrón es consistente en ambas
  etapas. Recomiendo revisarlo con el equipo de selección.
- **En comité la brecha se completa:** ninguna de las 9 personas afrodescendientes o indígenas que
  llegaron quedó seleccionada (ver sección 8).

### 9.6 Territorio

| Departamento | Elegibles | Comité | Conversión |
|---|---|---|---|
| Cundinamarca | 334 | 53 | 15,9% |
| Nariño | 77 | 15 | **19,5%** |
| Valle del Cauca | 99 | 11 | 11,1% |
| Antioquia | 84 | 7 | 8,3% |
| Atlántico | 64 | 6 | 9,4% |
| Córdoba | 52 | 0 | **0%** |
| Bolívar | 41 | 2 | 4,9% |

📊 VISUAL: mapa de Colombia por departamento, con tamaño de burbuja por elegibles y color por
conversión a comité.

- **Cundinamarca concentra el 41% del comité** (53 de 129).
- **Nariño es el caso destacado:** con volumen medio, tiene la mejor conversión del país.
- **Córdoba aporta 52 elegibles y ninguno llega a comité.** La región Caribe en general (Córdoba,
  Bolívar, Atlántico) convierte por debajo del promedio, lo que es relevante si hay plazas en esa
  región.

### 9.7 Lo que no diferencia

- **HPC no predice el resultado:** convierte igual con o sin la condición (11,4% frente a 11,1%).
  Como el 80% de los elegibles es HPC, el criterio hoy no ayuda a priorizar.
- **Profesional y licenciatura convierten parecido** (11,8% frente a 10,3%).

---

## 10. Perfil de la cohorte seleccionada

📊 VISUAL: ficha resumen con mini-donas de la cohorte seleccionada (61): canal, universidad
priorizada, enfoque, edad, región y tipo de pregrado, con el valor de comité al lado de cada una
para mostrar el cambio.

| Dimensión | Comité (129) | Cohorte seleccionada (61) |
|---|---|---|
| Canal | 63% redes, 25% referidos, 12% gira | 62% redes, 25% referidos, 13% gira |
| Universidad priorizada (Top 7) | 33% | **46%** |
| Universidad Top 13 QS | 38% | **51%** |
| Ruta Promisorios | 47% | **57%** |
| Enfoque | 47% bilingüe, 36% STEM, 17% STEM y bilingüe | **67% bilingüe, 15% STEM**, 18% STEM y bilingüe |
| Edad | 17% 23 o menos, 65% 24 a 29, 18% 30 o más | 18% 23 o menos, 69% 24 a 29, 13% 30 o más |
| Pregrado | 70% profesional, 30% licenciatura | **85% profesional**, 15% licenciatura |
| Territorio | 41% Cundinamarca, 12% Nariño, 9% Valle | **56% Cundinamarca**, 8% Valle, 7% Quindío, 3% Nariño |
| Grupo étnico | 7% afrodescendiente o indígena | **0%** |

Datos que solo existen para la cohorte seleccionada (base de Matriculados):
- **Género:** 79% femenino, 20% masculino, 2% otro.
- **Colegio:** 62% privado, 38% público.
- **Estrato:** 57% en estratos 2 y 3 (35 personas), 23% en estrato 4, y 18% en 1, 5 y 6 juntos (una persona sin dato).
- **Edad promedio:** 26 años.
- **Inglés autodeclarado:** 87% en B2 o más.

---

## 11. Conclusiones y recomendaciones

| # | Hallazgo | Recomendación | Impacto esperado |
|---|---|---|---|
| 1 | El comité seleccionó a 61 de 130 y la cohorte queda en 76% de los cupos. | Registrar el motivo de cada no selección (decisión del comité, desistimiento, otro) y revisar si hay que convocar a quienes quedaron cerca, o abrir una segunda ronda. | Saber si la brecha es filtro o pérdida, y cerrar los 19 cupos. |
| 2 | Referidos y gira convierten el doble que redes sociales. | Invertir más en referidos (programa de embajadores con Ecos y alumni) y en gira en universidades priorizadas. | Más comité con el mismo volumen de postulantes. |
| 3 | La meta Top 7 no se cumplió, y es el grupo que más convierte. | Concentrar la gira y los referidos en las 7 universidades priorizadas. | Cerrar la brecha de 84 elegibles Top 7. |
| 4 | El 73% de los no elegibles se cae por enfoque. | Hacer más visible en toda la difusión el requisito STEM o bilingüe, con una prueba de autoselección antes del formulario. | Menos volumen no elegible y menos carga operativa. |
| 5 | 688 personas cumplían mínimos y no terminaron el formulario. | Campaña de recuperación por correo y WhatsApp durante la convocatoria, y revisión de la longitud del formulario. | Unas 25 personas más en comité si se recupera un tercio. |
| 6 | La extensión trajo mucho volumen con baja conversión. | Evaluar si la extensión compensa el costo operativo, o activarla solo con difusión dirigida a canales que convierten. | Mejor rendimiento por postulante. |
| 7 | 32 aceptados en Entrevista nunca fueron citados al Lab y 26 no asistieron. | Citar al Lab inmediatamente después de la aceptación, con confirmación y recordatorios. | Unas 20 personas más en comité. |
| 8 | Mayores de 30 años y personas afro e indígenas convierten mucho menos, y ninguna persona afro o indígena quedó en la cohorte. | Revisar con el equipo si es un criterio del programa o un sesgo de Entrevista, Lab y comité; si es criterio, comunicarlo en la convocatoria. | Proceso más justo o expectativas más claras. |
| 9 | STEM es el 45% de los elegibles y el 15% de la cohorte; el comité selecciona al 19% de los STEM que llegan. | Definir de antemano cuántos cupos STEM necesita el programa y usarlo como criterio explícito en comité. | Cohorte alineada con la necesidad de docentes. |
| 10 | 9 personas seleccionadas esperan nombramiento en el concurso docente. | Seguimiento cercano a ese grupo durante la formación inicial. | Menos deserción temprana. |
| 11 | Hay 134 rechazados en Entrevista y 30 en Lab que "podrían ser Eco en el futuro". | Crear una base de talento para invitarlos de nuevo en la próxima convocatoria. | Arranque de la convocatoria 2027 con candidatos ya conocidos. |
| 12 | HPC no diferencia a quienes llegan a comité. | Revisar la definición de HPC o dejar de usarla como criterio de priorización. | Criterios más útiles para priorizar. |
| 13 | El evaluador de Lecturas es 18 puntos más exigente que el modelo, y hubo 40 casos de plagio. | Recalibrar el modelo con los resultados de este año y agregar verificación automática de plagio. | Lecturas más rápidas y consistentes. |

---

## 12. Anexo

### 12.1 Notas metodológicas

- Las cifras son las oficiales, conciliadas entre el dashboard y los Master de cada etapa.
- Las conversiones por perfil (secciones 9 y 10) cruzan por persona `Data_Raw_Conv` con los Master
  de Lecturas, Entrevistas y LIDERA Lab, usando el Id de Primera Revisión de Salesforce.
- La conversión de referencia elegible → comité es 11,3% (129 de 1.138). La conversión desde
  postulantes es 7,9% (130 de 1.641).
- La cohorte seleccionada (61) sale de la base de Matriculados al 6 de noviembre de 2026 y se
  cruza con `Data_Raw_Conv` por cédula para canal, universidad, ruta, enfoque, edad, territorio y
  grupo étnico (cruzan las 61). Las tasas de selección en comité (sección 8) usan como base las
  129 personas de comité con perfil completo.
- Los grupos con menos de 30 personas (por ejemplo, raizales, palenqueros o inglés C2) se muestran,
  pero sus porcentajes no deben leerse como tendencia.

### 12.2 Enlaces

- Documento de entrega del proceso CSM LIDERA (cómo se construyó y cómo se opera cada etapa):
  https://drive.google.com/file/d/1BhGJLNqjuddVHxWnl9Zm6c1fL4SJgFfa/view

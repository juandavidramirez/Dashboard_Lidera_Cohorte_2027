# Reporte final de la convocatoria LIDERA, Cohorte 2027

**Proceso:** Convocatoria, Selección y Matrícula (CSM), Enseña por Colombia
**Fecha de corte:** 4 de noviembre de 2026
**Elaborado por:** Juan David Ramírez

> **Alcance de los datos:** este reporte llega hasta las personas que **pasan a comité de
> selección**, no hasta las que se matriculan. La matrícula ocurre después y no está incluida. Cuando
> el reporte habla de "seleccionados" o de "comité", se refiere a quienes el LIDERA Lab recomienda
> llevar a comité.

**Convención para la plataforma de BI:** los bloques marcados con `📊 VISUAL` indican qué gráfico o
tarjeta debe construirse, con qué datos y qué mensaje debe transmitir. El texto alrededor es el
contenido del reporte.

---

## 1. Resumen ejecutivo

La convocatoria 2026 (Cohorte 2027) cumplió y superó sus metas de volumen y llevó a comité a
**130 personas para 80 cupos**, es decir, 1,6 candidatos por cupo. El reto ya no es atraer más
gente, sino atraer mejor: el embudo muestra que el canal, la universidad, la edad y el momento de
postulación predicen con mucha fuerza quién llega al final.

📊 VISUAL: fila de 5 tarjetas KPI.
- Postulantes: 1.641 / meta 1.500 (109%)
- Elegibles: 1.138 / meta 978 (116%)
- Elegibles Top 7: 216 / meta 300 (72%), la única meta no cumplida, resaltada en color de alerta
- Pasan a comité: 130 / 80 cupos (163%)
- Conversión total: 7,9% de los postulantes llega a comité (130 de 1.641)

**Cinco conclusiones principales:**

1. **Las metas de volumen se superaron, pero la meta de calidad estratégica no.** Hubo 26,6% más
   elegibles que en 2025 (1.138 frente a 899), pero los elegibles de universidades priorizadas
   quedaron en 72% de la meta.
2. **Referidos y gira convierten el doble que redes sociales.** Redes sociales aporta el 79% de los
   elegibles, pero solo 9,0% de ellos llega a comité. Referidos (20,3%) y gira (19,0%) duplican
   esa tasa con mucho menos volumen.
3. **La universidad priorizada duplica la probabilidad de llegar a comité** (19,9% frente a 9,3%).
4. **La edad es el filtro más fuerte del proceso.** El 43% de los elegibles tiene 30 años o más,
   pero solo el 18% de quienes pasan a comité está en ese grupo. La mayor caída ocurre en Entrevista.
5. **Hay una brecha de equidad que vale la pena mirar.** Las personas afrodescendientes e indígenas
   llegan a comité a la mitad de la tasa del resto (5,0% y 6,3% frente a 12,4%).

---

## 2. Alcance, fuentes y definiciones

**Periodo de convocatoria:** 28 de julio al 13 de septiembre de 2026 (con extensión; el cierre
original era el 6 de septiembre).

**Fuentes:** formulario de convocatoria en Salesforce (procesado en `Data_Raw_Conv`), Master de
Lecturas, Master de Entrevistas, Master de LIDERA Lab y el dashboard de BI. Las cifras de este
reporte son las cifras oficiales definidas en el documento
`Alineacion_Correccion_Indicadores_CSM_2027.md`, donde están las diferencias entre fuentes y su
explicación.

| Término | Definición |
|---|---|
| Pre-registro | Persona que llenó el formulario de interés (2.022). No es postulante. |
| Postulante | Persona con el formulario de convocatoria completo (1.641). |
| Elegible | Postulante que cumple mínimos: año de grado válido, promedio ≥ 3,5, perfil STEM o bilingüe, carrera aceptada y documento no duplicado. |
| HPC | Elegible con responsabilidad familiar, pago de estudios propio o experiencia como monitor. |
| Ruta Promisorios | Elegible de una de las 7 universidades priorizadas. |
| Pre-evaluado | Candidato evaluado con la rúbrica del Lab en julio, antes de las jornadas de octubre (21 personas). |
| Pasa a comité | Aceptado en LIDERA Lab con evaluación completa, o pre-evaluado aceptado. |

**Limitaciones:**
- La cifra de comité (130) es preliminar hasta que Tatiana confirme que los 21 pre-evaluados cuentan.
- El perfil de comité de las secciones 8 y 9 se calcula sobre 129 de las 130 personas (una no tiene
  marcada la evaluación completa en el Master).
- Los pre-evaluados se postularon en julio, así que inflan la conversión de ese mes (ver 4.2).

---

## 3. Embudo completo

📊 VISUAL: embudo horizontal de 7 etapas, con número absoluto, % de paso desde la etapa anterior y
% acumulado desde postulantes. Mostrar los pre-registros como una barra gris aparte, antes del
embudo, con la etiqueta "Interés (no postulantes)".

| Etapa | Personas | Paso desde la etapa anterior | Acumulado desde postulantes |
|---|---|---|---|
| Pre-registros (interés) | 2.022 | — | — |
| Postulantes | 1.641 | — | 100% |
| Elegibles | 1.138 | 69,3% | 69,3% |
| Pasan Lecturas | 678 | 59,6% | 41,3% |
| Aceptados en Entrevista | 231 | 34,1% | 14,1% |
| Citados al Lab | 196 | 84,8% | 11,9% |
| Asistieron al Lab | 171 | 87,2% | 10,4% |
| **Pasan a comité** | **130** | **76,9% de los evaluados** | **7,9%** |

**Lectura del embudo:**
- **Entrevista es el filtro más exigente:** solo 1 de cada 3 personas pasa. Es donde más se define
  el perfil final.
- **Lecturas filtra 4 de cada 10 elegibles.** Es un filtro de volumen.
- **Entre Entrevista y el Lab se pierden 60 personas sin evaluar:** 32 nunca fueron citadas a una
  jornada, 26 no asistieron y 3 no pasaron al Master del Lab. Es la fuga más evitable del proceso,
  porque son personas que ya habían sido aceptadas.
- **El Lab confirma más de lo que filtra:** 3 de cada 4 evaluados pasan a comité.

📊 VISUAL: gráfico de barras "Dónde se pierden las personas aceptadas en Entrevista" con 4 barras:
pasan a comité 130, rechazados en Lab 40, no asistieron 26, nunca citados 32 (más 3 sin pasar al
Master). Mensaje: casi la mitad de la pérdida después de Entrevista no es por desempeño.

---

## 4. Convocatoria: volumen y calidad

### 4.1 Metas y comparación con 2025

📊 VISUAL: barras agrupadas 2025 frente a 2026 para elegibles (899 frente a 1.138) y tasa de
elegibilidad (66,2% frente a 69,3%). Tarjeta aparte con la meta Top 7 (216 de 300).

- **1.138 elegibles, 26,6% más que en 2025** (899), y 116% de la meta de 978.
- La tasa de elegibilidad subió de 66,2% a 69,3%: además de más volumen, entró una proporción algo
  mayor de perfiles que cumplen.
- **La meta de universidades priorizadas (Top 7) se quedó en 72%:** 216 de 300. Aun así, el dashboard
  registra un crecimiento de 53% frente a 2025 en este grupo.

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
- **Quien se postula tarde llega menos a comité:** de los elegibles de septiembre llega a comité el
  7,4%, frente a 9,7% de agosto. La extensión sumó volumen, pero con menor rendimiento por persona.
- Julio muestra 20,8% de conversión a comité, pero ese dato está inflado por los pre-evaluados
  (evaluados antes que el resto), así que no conviene leerlo como "julio atrae mejor".

📊 VISUAL: barras de conversión elegible → comité por mes de postulación (julio, agosto,
septiembre), con una nota visible sobre julio.

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

## 8. Cómo cambia el perfil a lo largo del proceso

Esta es la sección central del análisis. Muestra qué perfiles avanzan más y cuáles se quedan en el
camino, comparando la composición de los elegibles con la de quienes pasan a comité.

📊 VISUAL: para cada dimensión, barras de "tasa de conversión elegible → comité" por grupo, con una
línea de referencia en el promedio (11,3%). Se recomienda una página con un selector de dimensión
(canal, universidad, ruta, enfoque, edad, inglés, grupo étnico, departamento).

📊 VISUAL alternativo: diagrama de Sankey Elegibles → Lecturas → Entrevista → Comité, coloreado por
la dimensión seleccionada.

**Promedio de referencia: 11,3% de los elegibles llega a comité** (129 de 1.138).

### 8.1 Canal de atracción

| Canal | Elegibles | Pasan Lecturas | Aceptados Entrevista | Comité | Conversión |
|---|---|---|---|---|---|
| Redes sociales LIDERA | 896 | 508 | 161 | 81 | 9,0% |
| Referidos | 158 | 111 | 43 | 32 | **20,3%** |
| Gira LIDERA | 84 | 59 | 27 | 16 | **19,0%** |

- **Referidos y gira convierten más del doble que redes sociales.** Redes trae volumen (79% de los
  elegibles), pero referidos y gira traen perfiles que encajan mejor.
- Referidos es el 14% de los elegibles y el 25% del comité.

### 8.2 Universidad y ruta

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

### 8.3 Enfoque e inglés

| Enfoque | Elegibles | Comité | Conversión |
|---|---|---|---|
| Bilingüe | 420 | 60 | **14,3%** |
| STEM y bilingüe | 201 | 22 | 10,9% |
| STEM | 517 | 47 | 9,1% |

- **El perfil bilingüe es el que mejor convierte**, por encima incluso de STEM y bilingüe.
- Entre los STEM, el inglés bajo frena: A1 convierte 2,4% y A2 5,6%, frente a 12% a 15% en B1 a C1.
- STEM es el grupo más grande de elegibles (45%) y el que menos convierte. Si la necesidad de cupos es
  STEM, el cuello de botella está en el proceso de selección, no en la atracción.

### 8.4 Edad

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

### 8.5 Grupo étnico

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

### 8.6 Territorio

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

### 8.7 Lo que no diferencia

- **HPC no predice el resultado:** convierte igual con o sin la condición (11,4% frente a 11,1%).
  Como el 80% de los elegibles es HPC, el criterio hoy no ayuda a priorizar.
- **Profesional y licenciatura convierten parecido** (11,8% frente a 10,3%).

---

## 9. Perfil de quienes pasan a comité

📊 VISUAL: ficha resumen con 6 mini-donas: canal, universidad priorizada, enfoque, edad, región y
tipo de pregrado.

Sobre 129 personas:
- **Canal:** 63% redes sociales, 25% referidos, 12% gira.
- **Universidad:** 33% priorizada Top 7, 38% Top 13 QS.
- **Ruta:** 47% Promisorios, 53% General.
- **Enfoque:** 47% bilingüe, 36% STEM, 17% STEM y bilingüe.
- **Edad:** 65% tiene entre 24 y 29 años, 17% tiene 23 o menos y 18% tiene 30 o más.
- **Pregrado:** 70% profesional, 30% licenciatura.
- **Territorio:** 41% Cundinamarca, 12% Nariño, 9% Valle del Cauca.

---

## 10. Conclusiones y recomendaciones

| # | Hallazgo | Recomendación | Impacto esperado |
|---|---|---|---|
| 1 | Referidos y gira convierten el doble que redes sociales. | Invertir más en referidos (programa de embajadores con Ecos y alumni) y en gira en universidades priorizadas. | Más comité con el mismo volumen de postulantes. |
| 2 | La meta Top 7 no se cumplió, y es el grupo que más convierte. | Concentrar la gira y los referidos en las 7 universidades priorizadas. | Cerrar la brecha de 84 elegibles Top 7. |
| 3 | El 73% de los no elegibles se cae por enfoque. | Hacer más visible en toda la difusión el requisito STEM o bilingüe, con una prueba de autoselección antes del formulario. | Menos volumen no elegible y menos carga operativa. |
| 4 | 688 personas cumplían mínimos y no terminaron el formulario. | Campaña de recuperación por correo y WhatsApp durante la convocatoria, y revisión de la longitud del formulario. | Unas 25 personas más en comité si se recupera un tercio. |
| 5 | La extensión trajo mucho volumen con baja conversión. | Evaluar si la extensión compensa el costo operativo, o activarla solo con difusión dirigida a canales que convierten. | Mejor rendimiento por postulante. |
| 6 | 32 aceptados en Entrevista nunca fueron citados al Lab y 26 no asistieron. | Citar al Lab inmediatamente después de la aceptación, con confirmación y recordatorios. | Unas 20 personas más en comité. |
| 7 | Mayores de 30 años y personas afro e indígenas convierten mucho menos. | Revisar con el equipo si es un criterio del programa o un sesgo de Entrevista y Lab; si es criterio, comunicarlo en la convocatoria. | Proceso más justo o expectativas más claras. |
| 8 | Hay 134 rechazados en Entrevista y 30 en Lab que "podrían ser Eco en el futuro". | Crear una base de talento para invitarlos de nuevo en la próxima convocatoria. | Arranque de la convocatoria 2027 con candidatos ya conocidos. |
| 9 | HPC no diferencia a quienes llegan a comité. | Revisar la definición de HPC o dejar de usarla como criterio de priorización. | Criterios más útiles para priorizar. |
| 10 | El evaluador de Lecturas es 18 puntos más exigente que el modelo, y hubo 40 casos de plagio. | Recalibrar el modelo con los resultados de este año y agregar verificación automática de plagio. | Lecturas más rápidas y consistentes. |

---

## 11. Anexo

### 11.1 Notas metodológicas

- Las cifras oficiales y sus diferencias con el dashboard y los Master están en
  `Alineacion_Correccion_Indicadores_CSM_2027.md`.
- Las conversiones por perfil (secciones 8 y 9) cruzan por persona `Data_Raw_Conv` con los Master
  de Lecturas, Entrevistas y LIDERA Lab, usando el Id de Primera Revisión de Salesforce.
- La conversión de referencia elegible → comité es 11,3% (129 de 1.138). La conversión desde
  postulantes es 7,9% (130 de 1.641).
- Los grupos con menos de 30 personas (por ejemplo, raizales, palenqueros o inglés C2) se muestran,
  pero sus porcentajes no deben leerse como tendencia.

### 11.2 Enlaces

- Dashboard: https://dashboard-lidera-cohorte-2027.vercel.app/
- Preguntas abiertas: `Preguntas_Tatiana_Alineacion_Indicadores.md`

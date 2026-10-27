/**
 * ============================================================================
 * SINCRONIZADOR GOOGLE APPS SCRIPT: MASTER LIDERA LAB -> SUPABASE (POSTGREST)
 * Archivo: Sync_LideraLab_Supabase.gs
 * ============================================================================
 * 
 * Este archivo contiene dos funciones principales:
 * 
 * 1. `extraerComentariosEtapasPrevias()`:
 *    Función de extracción que corre UNA SOLA VEZ (o cuando se requiera refrescar).
 *    Abre los Google Sheets de Lecturas ('Master_Proceso') y Entrevistas ('Master Entrevistas')
 *    por ID, busca ÚNICAMENTE a los candidatos presentes en el Master de LIDERA Lab,
 *    y copia sus observaciones y comentarios cualitativos en la pestaña
 *    'Promedios_Actividades' (o 'Etapas_Previas').
 *    -> NO toca Salesforce.
 *    -> NO actualiza las tablas completas en Supabase.
 *    -> Centraliza todo en el archivo de LIDERA Lab.
 * 
 * 2. `sincronizarLideraLabASupabase()`:
 *    Función de sincronización periódica que lee 'Master', 'Asistencia' y 
 *    'Promedios_Actividades', ensambla los registros completos (incluyendo promedios,
 *    asistencia y comentarios previos) y realiza un UPSERT atómico a `lab_progreso`
 *    en Supabase por lotes de 500 filas ('Prefer: resolution=merge-duplicates').
 *
 * CONFIGURACIÓN DE PROPIEDADES (PropertiesService):
 * En Apps Script: Configuración del proyecto > Propiedades de la secuencia de comandos:
 *   - SUPABASE_URL: ej. https://muyqxxzjcgwyvluzumbt.supabase.co
 *   - SUPABASE_KEY: Clave anon o service_role de Supabase
 *   - SHEET_ID_LECTURAS: ID de Google Sheets del archivo de Lecturas (Master_Proceso)
 *   - SHEET_ID_ENTREVISTAS: ID de Google Sheets del archivo de Entrevistas (Master Entrevistas)
 * ============================================================================
 */

// ============================================================================
// 1. EXTRACCIÓN DE COMENTARIOS PREVIOS HACIA EL SHEET DE LAB (OPCIÓN 2)
// ============================================================================
function extraerComentariosEtapasPrevias() {
  const ssLab = SpreadsheetApp.getActiveSpreadsheet();
  const sheetMasterLab = ssLab.getSheetByName('Master');
  if (!sheetMasterLab) throw new Error("❌ No se encontró la pestaña 'Master' en LIDERA Lab.");

  const props = PropertiesService.getScriptProperties();
  const idSheetLecturas = props.getProperty('SHEET_ID_LECTURAS');
  const idSheetEntrevistas = props.getProperty('SHEET_ID_ENTREVISTAS');

  if (!idSheetLecturas || !idSheetEntrevistas) {
    throw new Error(
      "❌ Faltan las propiedades de script 'SHEET_ID_LECTURAS' o 'SHEET_ID_ENTREVISTAS'.\n" +
      "Configúralas con el ID del documento de Google Sheets de cada proceso."
    );
  }

  Logger.log("Obteniendo lista de candidatos en Master LIDERA Lab...");
  const dataMasterLab = sheetMasterLab.getDataRange().getValues();
  const headersLab = dataMasterLab[0].map(h => normalizarTexto(h));

  const colIdDiaLab = buscarIndiceColumna(headersLab, ['id dia de entrevista', 'dia de entrevista: id', 'id dia']);
  const colIdContLab = buscarIndiceColumna(headersLab, ['id de contacto', 'id contacto']);
  const colCedLab = buscarIndiceColumna(headersLab, ['cedula', 'cédula', 'documento']);

  const candidatosLabSet = new Set();
  const mapaLabPorId = new Map();

  for (let i = 1; i < dataMasterLab.length; i++) {
    const f = dataMasterLab[i];
    const idDia = colIdDiaLab >= 0 ? String(f[colIdDiaLab] || '').trim() : '';
    const idCont = colIdContLab >= 0 ? String(f[colIdContLab] || '').trim() : '';
    const ced = colCedLab >= 0 ? String(f[colCedLab] || '').trim() : '';

    if (idDia) {
      candidatosLabSet.add(idDia);
      if (idDia.length >= 15) candidatosLabSet.add(idDia.substring(0, 15));
      mapaLabPorId.set(idDia, { idDia, idCont, ced });
    }
    if (idCont) {
      candidatosLabSet.add(idCont);
      if (idCont.length >= 15) candidatosLabSet.add(idCont.substring(0, 15));
    }
    if (ced) candidatosLabSet.add('CED_' + ced);
  }

  Logger.log(`Total candidatos a cruzar: ${mapaLabPorId.size}`);

  // A. Extraer de Lecturas (Master_Proceso)
  Logger.log("Leyendo archivo de Lecturas...");
  const ssLecturas = SpreadsheetApp.openById(idSheetLecturas);
  const sheetLecturas = ssLecturas.getSheetByName('Master_Proceso') || ssLecturas.getSheets()[0];
  const dataLecturas = sheetLecturas.getDataRange().getValues();
  const headersLec = dataLecturas[0].map(h => normalizarTexto(h));

  const colIdLec = buscarIndiceColumna(headersLec, ['id de contacto', 'id contacto', 'id primera revision', 'id']);
  const colCedLec = buscarIndiceColumna(headersLec, ['cedula', 'cédula', 'documento']);
  const colObsLec = buscarIndiceColumna(headersLec, ['observaciones lectura', 'observaciones lector', 'observaciones', 'resumen']);

  const mapaObsLectura = new Map();
  for (let i = 1; i < dataLecturas.length; i++) {
    const f = dataLecturas[i];
    const id = colIdLec >= 0 ? String(f[colIdLec] || '').trim() : '';
    const ced = colCedLec >= 0 ? String(f[colCedLec] || '').trim() : '';
    const obs = colObsLec >= 0 ? String(f[colObsLec] || '').trim() : '';

    if (obs) {
      if (id) {
        mapaObsLectura.set(id, obs);
        if (id.length >= 15) mapaObsLectura.set(id.substring(0, 15), obs);
      }
      if (ced) mapaObsLectura.set('CED_' + ced, obs);
    }
  }
  Logger.log(`Observaciones de lectura mapeadas: ${mapaObsLectura.size}`);

  // B. Extraer de Entrevistas (Master Entrevistas)
  Logger.log("Leyendo archivo de Entrevistas...");
  const ssEntrevistas = SpreadsheetApp.openById(idSheetEntrevistas);
  const sheetEntrevistas = ssEntrevistas.getSheetByName('Master') || ssEntrevistas.getSheetByName('Master Entrevistas') || ssEntrevistas.getSheets()[0];
  const dataEnt = sheetEntrevistas.getDataRange().getValues();
  const headersEnt = dataEnt[0].map(h => normalizarTexto(h));

  const colIdDiaEnt = buscarIndiceColumna(headersEnt, ['id dia de entrevista', 'dia de entrevista: id', 'id dia']);
  const colIdContEnt = buscarIndiceColumna(headersEnt, ['id de contacto', 'id contacto']);
  const colCedEnt = buscarIndiceColumna(headersEnt, ['cedula', 'cédula', 'documento']);

  const colLogros = buscarIndiceColumna(headersEnt, ['comentario logros', 'logros personales']);
  const colPersev = buscarIndiceColumna(headersEnt, ['comentario perseverancia', 'perseverancia']);
  const colComprom = buscarIndiceColumna(headersEnt, ['comentario permanencia', 'permanencia y compromiso', 'compromiso']);
  const colRelac = buscarIndiceColumna(headersEnt, ['comentario relaciones', 'construccion de relaciones', 'construcción de relaciones']);
  const colAjuste = buscarIndiceColumna(headersEnt, ['comentario ajuste', 'ajuste a la organizacion']);
  const colIngles = buscarIndiceColumna(headersEnt, ['comentario ingles', 'comentario inglés', 'nivel de ingles']);

  const mapaComEntrevista = new Map();
  for (let i = 1; i < dataEnt.length; i++) {
    const f = dataEnt[i];
    const idDia = colIdDiaEnt >= 0 ? String(f[colIdDiaEnt] || '').trim() : '';
    const idCont = colIdContEnt >= 0 ? String(f[colIdContEnt] || '').trim() : '';
    const ced = colCedEnt >= 0 ? String(f[colCedEnt] || '').trim() : '';

    const coms = {
      logros: colLogros >= 0 ? String(f[colLogros] || '').trim() : '',
      perseverancia: colPersev >= 0 ? String(f[colPersev] || '').trim() : '',
      compromiso: colComprom >= 0 ? String(f[colComprom] || '').trim() : '',
      relaciones: colRelac >= 0 ? String(f[colRelac] || '').trim() : '',
      ajuste: colAjuste >= 0 ? String(f[colAjuste] || '').trim() : '',
      ingles: colIngles >= 0 ? String(f[colIngles] || '').trim() : ''
    };

    if (idDia) {
      mapaComEntrevista.set(idDia, coms);
      if (idDia.length >= 15) mapaComEntrevista.set(idDia.substring(0, 15), coms);
    }
    if (idCont) {
      mapaComEntrevista.set(idCont, coms);
      if (idCont.length >= 15) mapaComEntrevista.set(idCont.substring(0, 15), coms);
    }
    if (ced) mapaComEntrevista.set('CED_' + ced, coms);
  }
  Logger.log(`Comentarios de entrevista mapeados: ${mapaComEntrevista.size}`);

  // C. Escribir o actualizar en la pestaña 'Promedios_Actividades' del Sheet de Lab
  let sheetDestino = ssLab.getSheetByName('Promedios_Actividades');
  if (!sheetDestino) {
    sheetDestino = ssLab.insertSheet('Promedios_Actividades');
    sheetDestino.appendRow([
      'Id. Día de Entrevista', 'Id. Contacto',
      'Promedio Clase 5 Minutos', 'N Clase 5 Minutos',
      'Promedio Actividad Grupal', 'N Actividad Grupal',
      'Promedio Juego de Roles', 'N Juego de Roles',
      'Promedio Lidera Finanzas', 'N Lidera Finanzas',
      'Observaciones Lectura',
      'Comentario Logros', 'Comentario Perseverancia', 'Comentario Compromiso',
      'Comentario Relaciones', 'Comentario Ajuste', 'Comentario Inglés'
    ]);
  }

  const dataDestino = sheetDestino.getDataRange().getValues();
  const headersDest = dataDestino[0].map(h => normalizarTexto(h));

  let colIdDiaDest = buscarIndiceColumna(headersDest, ['id dia de entrevista', 'id_dia_entrevista', 'id dia']);
  let colObsLectDest = buscarIndiceColumna(headersDest, ['observaciones lectura']);
  let colLogrosDest = buscarIndiceColumna(headersDest, ['comentario logros']);

  // Si no existen las columnas de comentarios en Promedios_Actividades, agregarlas al final
  if (colObsLectDest < 0) {
    const lastCol = sheetDestino.getLastColumn();
    sheetDestino.getRange(1, lastCol + 1, 1, 7).setValues([[
      'Observaciones Lectura',
      'Comentario Logros', 'Comentario Perseverancia', 'Comentario Compromiso',
      'Comentario Relaciones', 'Comentario Ajuste', 'Comentario Inglés'
    ]]);
    colObsLectDest = lastCol;
    colLogrosDest = lastCol + 1;
  }

  // Actualizar filas existentes
  let actualizados = 0;
  for (let i = 1; i < dataDestino.length; i++) {
    const idDia = String(dataDestino[i][colIdDiaDest] || '').trim();
    if (!idDia) continue;

    const candInfo = mapaLabPorId.get(idDia) || {};
    const idCont = candInfo.idCont || '';
    const ced = candInfo.ced || '';

    const obs = mapaObsLectura.get(idDia)
      || (idDia.length >= 15 ? mapaObsLectura.get(idDia.substring(0, 15)) : '')
      || (idCont ? mapaObsLectura.get(idCont) : '')
      || (ced ? mapaObsLectura.get('CED_' + ced) : '');

    const coms = mapaComEntrevista.get(idDia)
      || (idDia.length >= 15 ? mapaComEntrevista.get(idDia.substring(0, 15)) : '')
      || (idCont ? mapaComEntrevista.get(idCont) : '')
      || (ced ? mapaComEntrevista.get('CED_' + ced) : '')
      || {};

    sheetDestino.getRange(i + 1, colObsLectDest + 1, 1, 7).setValues([[
      obs || '',
      coms.logros || '',
      coms.perseverancia || '',
      coms.compromiso || '',
      coms.relaciones || '',
      coms.ajuste || '',
      coms.ingles || ''
    ]]);
    actualizados++;
  }

  Logger.log(`✅ Extracción completada: ${actualizados} filas actualizadas con comentarios de etapas previas.`);
}

// ============================================================================
// 2. SINCRONIZACIÓN LIDERA LAB -> SUPABASE (UPSERT POR LOTES DE 500)
// ============================================================================
function sincronizarLideraLabASupabase() {
  const startTime = new Date();
  const scriptProps = PropertiesService.getScriptProperties();
  const SUPABASE_URL = scriptProps.getProperty('SUPABASE_URL');
  const SUPABASE_KEY = scriptProps.getProperty('SUPABASE_KEY');

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error(
      "❌ Faltan las propiedades 'SUPABASE_URL' o 'SUPABASE_KEY'.\n" +
      "Configúralas en: Configuración del proyecto > Propiedades de la secuencia de comandos."
    );
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetMaster = ss.getSheetByName('Master');
  if (!sheetMaster) throw new Error("❌ No se encontró la pestaña 'Master'.");

  const sheetAsistencia = ss.getSheetByName('Asistencia');
  const sheetPromedios = ss.getSheetByName('Promedios_Actividades');

  // 1. Indexar pestaña Asistencia
  const mapaAsistencia = new Map();
  if (sheetAsistencia && sheetAsistencia.getLastRowNum() > 1) {
    const dataAsis = sheetAsistencia.getDataRange().getValues();
    const headers = dataAsis[0].map(h => normalizarTexto(h));
    const colId = buscarIndiceColumna(headers, ['id dia de entrevista', 'id_dia_entrevista', 'id dia']);
    const colCed = buscarIndiceColumna(headers, ['cedula', 'cédula', 'documento']);
    const colAsis = buscarIndiceColumna(headers, ['asistencia']);
    const colCom = buscarIndiceColumna(headers, ['comentarios', 'observaciones']);
    const colB1 = buscarIndiceColumna(headers, ['bloque 1', 'b1']);
    const colB2 = buscarIndiceColumna(headers, ['bloque 2', 'b2']);
    const colB3 = buscarIndiceColumna(headers, ['bloque 3', 'b3']);
    const colTotB = buscarIndiceColumna(headers, ['bloques asistidos']);
    const colFormato = buscarIndiceColumna(headers, ['formato clase']);

    for (let i = 1; i < dataAsis.length; i++) {
      const f = dataAsis[i];
      const id = colId >= 0 ? String(f[colId] || '').trim() : '';
      const ced = colCed >= 0 ? String(f[colCed] || '').trim() : '';
      const estado = colAsis >= 0 ? String(f[colAsis] || '').trim() : '';
      const asistio = (estado.toLowerCase() === 'asistió' || estado.toLowerCase() === 'asistio');

      const info = {
        asistio,
        asistencia_b1: colB1 >= 0 ? parsearNumero(f[colB1]) : null,
        asistencia_b2: colB2 >= 0 ? parsearNumero(f[colB2]) : null,
        asistencia_b3: colB3 >= 0 ? parsearNumero(f[colB3]) : null,
        bloques_asistidos: colTotB >= 0 ? parsearEntero(f[colTotB]) : (asistio ? 3 : 0),
        comentarios_asistencia: colCom >= 0 ? String(f[colCom] || '').trim() : null,
        formato_clase: colFormato >= 0 ? String(f[colFormato] || '').trim() : 'Presencial'
      };
      if (id) {
        mapaAsistencia.set(id, info);
        if (id.length >= 15) mapaAsistencia.set(id.substring(0, 15), info);
      }
      if (ced) mapaAsistencia.set('CED_' + ced, info);
    }
  }

  // 2. Indexar pestaña Promedios_Actividades (Promedios + Comentarios Previos)
  const mapaPromedios = new Map();
  if (sheetPromedios && sheetPromedios.getLastRowNum() > 1) {
    const dataProm = sheetPromedios.getDataRange().getValues();
    const headers = dataProm[0].map(h => normalizarTexto(h));
    const colId = buscarIndiceColumna(headers, ['id dia de entrevista', 'id_dia_entrevista', 'id dia']);
    const colCed = buscarIndiceColumna(headers, ['cedula', 'cédula']);

    const colP5 = buscarIndiceColumna(headers, ['promedio clase 5 minutos', 'promedio 5 min']);
    const colN5 = buscarIndiceColumna(headers, ['n clase 5 minutos', 'n 5 min']);
    const colPG = buscarIndiceColumna(headers, ['promedio actividad grupal', 'promedio grupal']);
    const colNG = buscarIndiceColumna(headers, ['n actividad grupal']);
    const colPR = buscarIndiceColumna(headers, ['promedio juego de roles', 'promedio roles']);
    const colNR = buscarIndiceColumna(headers, ['n juego de roles']);
    const colPF = buscarIndiceColumna(headers, ['promedio lidera finanzas', 'promedio finanzas']);
    const colNF = buscarIndiceColumna(headers, ['n lidera finanzas']);

    // Comentarios previos
    const colObsLec = buscarIndiceColumna(headers, ['observaciones lectura', 'observaciones lector']);
    const colLogros = buscarIndiceColumna(headers, ['comentario logros']);
    const colPersev = buscarIndiceColumna(headers, ['comentario perseverancia']);
    const colComprom = buscarIndiceColumna(headers, ['comentario compromiso', 'comentario permanencia']);
    const colRelac = buscarIndiceColumna(headers, ['comentario relaciones']);
    const colAjuste = buscarIndiceColumna(headers, ['comentario ajuste']);
    const colIngles = buscarIndiceColumna(headers, ['comentario ingles', 'comentario inglés']);

    for (let i = 1; i < dataProm.length; i++) {
      const f = dataProm[i];
      const id = colId >= 0 ? String(f[colId] || '').trim() : '';
      const ced = colCed >= 0 ? String(f[colCed] || '').trim() : '';
      const info = {
        promedio_clase_5min: colP5 >= 0 ? parsearNumero(f[colP5]) : null,
        n_clase_5min: colN5 >= 0 ? parsearEntero(f[colN5]) : null,
        promedio_actividad_grupal: colPG >= 0 ? parsearNumero(f[colPG]) : null,
        n_actividad_grupal: colNG >= 0 ? parsearEntero(f[colNG]) : null,
        promedio_juego_roles: colPR >= 0 ? parsearNumero(f[colPR]) : null,
        n_juego_roles: colNR >= 0 ? parsearEntero(f[colNR]) : null,
        promedio_lidera_finanzas: colPF >= 0 ? parsearNumero(f[colPF]) : null,
        n_lidera_finanzas: colNF >= 0 ? parsearEntero(f[colNF]) : null,

        observaciones_lectura: colObsLec >= 0 ? limpiarTexto(f[colObsLec]) : null,
        comentario_logros: colLogros >= 0 ? limpiarTexto(f[colLogros]) : null,
        comentario_perseverancia: colPersev >= 0 ? limpiarTexto(f[colPersev]) : null,
        comentario_compromiso: colComprom >= 0 ? limpiarTexto(f[colComprom]) : null,
        comentario_relaciones: colRelac >= 0 ? limpiarTexto(f[colRelac]) : null,
        comentario_ajuste: colAjuste >= 0 ? limpiarTexto(f[colAjuste]) : null,
        comentario_ingles: colIngles >= 0 ? limpiarTexto(f[colIngles]) : null
      };
      if (id) {
        mapaPromedios.set(id, info);
        if (id.length >= 15) mapaPromedios.set(id.substring(0, 15), info);
      }
      if (ced) mapaPromedios.set('CED_' + ced, info);
    }
  }

  // 3. Procesar Master
  const dataMaster = sheetMaster.getDataRange().getValues();
  const headers = dataMaster[0].map(h => normalizarTexto(h));

  const colIdDia = buscarIndiceColumna(headers, ['id dia de entrevista', 'dia de entrevista: id', 'id dia']);
  const colIdContacto = buscarIndiceColumna(headers, ['id de contacto', 'id contacto']);
  const colCedula = buscarIndiceColumna(headers, ['cedula', 'documento', 'cédula']);
  const colFecha = buscarIndiceColumna(headers, ['fecha lab', 'fecha']);
  const colAgenda = buscarIndiceColumna(headers, ['id fecha agenda', 'id agenda']);
  const colBloque = buscarIndiceColumna(headers, ['bloque']);
  const colSubgrupo = buscarIndiceColumna(headers, ['subgrupo', 'grupo']);
  const colEvaluadorAsis = buscarIndiceColumna(headers, ['evaluador asistencia', 'evaluador']);

  // Componentes individuales
  const colSerProfe = buscarIndiceColumna(headers, ['ho ser profe', 'ser profe']);
  const colImIntereses = buscarIndiceColumna(headers, ['incluye intereses']);
  const colImComPres = buscarIndiceColumna(headers, ['comunicacion y presencia', 'comunicación y presencia']);
  const colImEscucha = buscarIndiceColumna(headers, ['escucha y responde']);
  const colComSerProfe = buscarIndiceColumna(headers, ['comentarios ser profesor']);

  const colDinamica = buscarIndiceColumna(headers, ['dinamica de grupo', 'dinámica de grupo']);
  const colImAtenGA = buscarIndiceColumna(headers, ['atencion ga', 'atención ga']);
  const colImEmpatGA = buscarIndiceColumna(headers, ['empatia ga', 'empatía ga']);
  const colActGrPersev = buscarIndiceColumna(headers, ['perseverancia ag']);
  const colComGrupal = buscarIndiceColumna(headers, ['comentarios actividad grupal']);

  const colImAtenJR = buscarIndiceColumna(headers, ['atencion jr', 'atención jr']);
  const colImEmpatJR = buscarIndiceColumna(headers, ['empatia jr', 'empatía jr']);
  const colImAudiencia = buscarIndiceColumna(headers, ['considera audiencia jr', 'audiencia jr']);
  const colComRoles = buscarIndiceColumna(headers, ['comentarios juego roles']);

  const colHoSemana = buscarIndiceColumna(headers, ['ho semana vida eco', 'semana vida eco']);
  const colHoTarde = buscarIndiceColumna(headers, ['ho tarde dia entrevista', 'tarde dia de entrevista']);
  const colComHo = buscarIndiceColumna(headers, ['comentarios ho']);

  // Puntajes finales y Decisión
  const colP5min = buscarIndiceColumna(headers, ['puntaje final 5 minutos como profesor', 'puntaje final 5 minutos']);
  const colPGrupal = buscarIndiceColumna(headers, ['puntaje final actividad grupal', 'actividad grupal']);
  const colPRoles = buscarIndiceColumna(headers, ['puntaje final juego de roles', 'juego de roles 1']);
  const colPAjuste = buscarIndiceColumna(headers, ['puntaje final ajuste', 'ajuste']);
  const colPPensCrit = buscarIndiceColumna(headers, ['puntaje final pensamiento critico', 'pensamiento crítico', 'pensamiento critico']);
  const colPPersev = buscarIndiceColumna(headers, ['puntaje final perseverancia', 'perseverancia']);
  const colPPerman = buscarIndiceColumna(headers, ['puntaje final permanencia', 'permanencia y compromiso']);
  const colPRelac = buscarIndiceColumna(headers, ['puntaje final construccion de relaciones', 'construcción de relaciones']);
  const colPTotal = buscarIndiceColumna(headers, ['puntaje final assessment center', 'puntaje competencias', 'puntaje total competencias', 'final assessment center score']);
  const colRecModelo = buscarIndiceColumna(headers, ['recomendacion del modelo', 'recomendación del modelo']);

  const colOpinionLab = buscarIndiceColumna(headers, ['opinion del evaluador', 'opinión del evaluador']);
  const colComLab = buscarIndiceColumna(headers, ['comentarios del evaluador']);
  const colRecPostulante = buscarIndiceColumna(headers, ['recomendacion al postulante']);
  const colEvalCompleta = buscarIndiceColumna(headers, ['evaluacion completa', 'evaluación completa']);

  const filas = [];
  for (let i = 1; i < dataMaster.length; i++) {
    const r = dataMaster[i];
    const idDia = String(r[colIdDia] || '').trim();
    if (!idDia) continue;

    const idContacto = colIdContacto >= 0 ? String(r[colIdContacto] || '').trim() : '';
    const cedula = colCedula >= 0 ? String(r[colCedula] || '').trim() : '';

    const asis = mapaAsistencia.get(idDia)
      || (idDia.length >= 15 ? mapaAsistencia.get(idDia.substring(0, 15)) : null)
      || (cedula ? mapaAsistencia.get('CED_' + cedula) : null)
      || {};

    const prom = mapaPromedios.get(idDia)
      || (idDia.length >= 15 ? mapaPromedios.get(idDia.substring(0, 15)) : null)
      || (cedula ? mapaPromedios.get('CED_' + cedula) : null)
      || {};

    const rawEval = colEvalCompleta >= 0 ? String(r[colEvalCompleta] || '').trim().toLowerCase() : '';
    const evalComp = (rawEval === 'si' || rawEval === 'sí' || rawEval === 'true') ? 'Si' : 'No';

    const sp = colSerProfe >= 0 ? parsearNumero(r[colSerProfe]) : null;
    const ii = colImIntereses >= 0 ? parsearNumero(r[colImIntereses]) : null;
    const icp = colImComPres >= 0 ? parsearNumero(r[colImComPres]) : null;
    const ier = colImEscucha >= 0 ? parsearNumero(r[colImEscucha]) : null;

    const dg = colDinamica >= 0 ? parsearNumero(r[colDinamica]) : null;
    const aga = colImAtenGA >= 0 ? parsearNumero(r[colImAtenGA]) : null;
    const ega = colImEmpatGA >= 0 ? parsearNumero(r[colImEmpatGA]) : null;
    const pga = colActGrPersev >= 0 ? parsearNumero(r[colActGrPersev]) : null;

    const ajr = colImAtenJR >= 0 ? parsearNumero(r[colImAtenJR]) : null;
    const ejr = colImEmpatJR >= 0 ? parsearNumero(r[colImEmpatJR]) : null;
    const aud = colImAudiencia >= 0 ? parsearNumero(r[colImAudiencia]) : null;

    const hoSem = colHoSemana >= 0 ? parsearNumero(r[colHoSemana]) : null;

    filas.push({
      id_dia_entrevista: idDia,
      id_contacto: idContacto || idDia,
      fecha_lab: colFecha >= 0 ? formatearFecha(r[colFecha]) : null,
      id_fecha_agenda: colAgenda >= 0 ? String(r[colAgenda] || '').trim() : null,
      bloque: colBloque >= 0 ? String(r[colBloque] || '').trim() : null,
      subgrupo: colSubgrupo >= 0 ? String(r[colSubgrupo] || '').trim() : null,
      evaluador_asistencia: colEvaluadorAsis >= 0 ? String(r[colEvaluadorAsis] || '').trim() : null,

      asistencia_b1: asis.asistencia_b1 !== undefined ? asis.asistencia_b1 : null,
      asistencia_b2: asis.asistencia_b2 !== undefined ? asis.asistencia_b2 : null,
      asistencia_b3: asis.asistencia_b3 !== undefined ? asis.asistencia_b3 : null,
      formato_clase: asis.formato_clase || 'Presencial',
      asistio: asis.asistio !== undefined ? asis.asistio : false,
      bloques_asistidos: asis.bloques_asistidos !== undefined ? asis.bloques_asistidos : (asis.asistio ? 3 : 0),
      comentarios_asistencia: asis.comentarios_asistencia || null,

      ser_profe: sp,
      im_incluye_intereses: ii,
      im_comunicacion_presencia: icp,
      im_escucha_responde: ier,
      comentarios_ser_profesor: colComSerProfe >= 0 ? limpiarTexto(r[colComSerProfe]) : null,

      dinamica_grupo: dg,
      im_atencion_ga: aga,
      im_empatia_ga: ega,
      act_gr_perseverancia: pga,
      comentarios_actividad_grupal: colComGrupal >= 0 ? limpiarTexto(r[colComGrupal]) : null,

      im_atencion_jr: ajr,
      im_empatia_jr: ejr,
      im_considera_audiencia: aud,
      comentarios_juego_roles: colComRoles >= 0 ? limpiarTexto(r[colComRoles]) : null,

      ho_semana_vida_eco: hoSem,
      ho_tarde_dia_entrevista: colHoTarde >= 0 ? limpiarTexto(r[colHoTarde]) : 'No',
      comentarios_ho: colComHo >= 0 ? limpiarTexto(r[colComHo]) : null,

      puntaje_5min: colP5min >= 0 ? parsearNumero(r[colP5min]) : null,
      puntaje_actividad_grupal: colPGrupal >= 0 ? parsearNumero(r[colPGrupal]) : null,
      puntaje_juego_roles: colPRoles >= 0 ? parsearNumero(r[colPRoles]) : null,
      puntaje_ajuste: colPAjuste >= 0 ? parsearNumero(r[colPAjuste]) : null,
      puntaje_pensamiento_critico: colPPensCrit >= 0 ? parsearNumero(r[colPPensCrit]) : null,
      puntaje_perseverancia: colPPersev >= 0 ? parsearNumero(r[colPPersev]) : null,
      puntaje_permanencia: colPPerman >= 0 ? parsearNumero(r[colPPerman]) : null,
      puntaje_construccion_relaciones: colPRelac >= 0 ? parsearNumero(r[colPRelac]) : null,
      puntaje_competencias_total: colPTotal >= 0 ? parsearNumero(r[colPTotal]) : null,
      recomendacion_modelo: colRecModelo >= 0 ? limpiarTexto(r[colRecModelo]) : null,

      opinion_evaluador_lab: colOpinionLab >= 0 ? limpiarTexto(r[colOpinionLab]) : null,
      comentarios_evaluador_lab: colComLab >= 0 ? limpiarTexto(r[colComLab]) : null,
      recomendacion_postulante_lab: colRecPostulante >= 0 ? limpiarTexto(r[colRecPostulante]) : null,
      evaluacion_completa: evalComp,

      promedio_clase_5min: prom.promedio_clase_5min !== undefined ? prom.promedio_clase_5min : calcularPromedio([sp, ii, icp, ier]),
      n_clase_5min: prom.n_clase_5min !== undefined ? prom.n_clase_5min : contarValidos([sp, ii, icp, ier]),

      promedio_actividad_grupal: prom.promedio_actividad_grupal !== undefined ? prom.promedio_actividad_grupal : calcularPromedio([dg, aga, ega, pga]),
      n_actividad_grupal: prom.n_actividad_grupal !== undefined ? prom.n_actividad_grupal : contarValidos([dg, aga, ega, pga]),

      promedio_juego_roles: prom.promedio_juego_roles !== undefined ? prom.promedio_juego_roles : calcularPromedio([ajr, ejr, aud]),
      n_juego_roles: prom.n_juego_roles !== undefined ? prom.n_juego_roles : contarValidos([ajr, ejr, aud]),

      promedio_lidera_finanzas: prom.promedio_lidera_finanzas !== undefined ? prom.promedio_lidera_finanzas : hoSem,
      n_lidera_finanzas: prom.n_lidera_finanzas !== undefined ? prom.n_lidera_finanzas : (hoSem !== null ? 1 : 0),

      // Comentarios de etapas previas (Lecturas y Entrevistas)
      observaciones_lectura: prom.observaciones_lectura || null,
      comentario_logros: prom.comentario_logros || null,
      comentario_perseverancia: prom.comentario_perseverancia || null,
      comentario_compromiso: prom.comentario_compromiso || null,
      comentario_relaciones: prom.comentario_relaciones || null,
      comentario_ajuste: prom.comentario_ajuste || null,
      comentario_ingles: prom.comentario_ingles || null,

      updated_at: new Date().toISOString()
    });
  }

  // 4. Upsert en lotes de 500 a Supabase
  const BATCH_SIZE = 500;
  let sincronizados = 0;
  const errores = [];

  for (let i = 0; i < filas.length; i += BATCH_SIZE) {
    const lote = filas.slice(i, i + BATCH_SIZE);
    const url = `${SUPABASE_URL}/rest/v1/lab_progreso?on_conflict=id_dia_entrevista`;
    const options = {
      method: 'post',
      contentType: 'application/json',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'resolution=merge-duplicates,return=minimal'
      },
      payload: JSON.stringify(lote),
      muteHttpExceptions: true
    };

    try {
      const resp = UrlFetchApp.fetch(url, options);
      const code = resp.getResponseCode();
      if (code >= 200 && code < 300) {
        sincronizados += lote.length;
      } else {
        errores.push(`Lote ${Math.floor(i / BATCH_SIZE) + 1} (HTTP ${code}): ${resp.getContentText().substring(0, 250)}`);
      }
    } catch (e) {
      errores.push(`Lote ${Math.floor(i / BATCH_SIZE) + 1} Excepción: ${e.message}`);
    }
  }

  // 5. Registrar en pestaña de log
  escribirLogEnHoja(ss, {
    fecha: new Date(),
    leidos: filas.length,
    sincronizados,
    errores: errores.length,
    detalleErrores: errores.join(' | ') || 'Ninguno'
  });

  Logger.log(`Sincronización terminada: ${sincronizados}/${filas.length} registros. Errores: ${errores.length}`);
}

function normalizarTexto(txt) {
  if (!txt) return '';
  return String(txt).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
}

function buscarIndiceColumna(headers, posibles) {
  for (let i = 0; i < headers.length; i++) {
    const h = headers[i];
    for (const p of posibles) {
      const pn = normalizarTexto(p);
      if (h === pn || h.indexOf(pn) >= 0) return i;
    }
  }
  return -1;
}

function parsearNumero(v) {
  if (v === null || v === undefined || v === '') return null;
  const s = String(v).replace(',', '.').replace(/[^0-9.-]/g, '').trim();
  const n = parseFloat(s);
  return isNaN(n) ? null : n;
}

function parsearEntero(v) {
  if (v === null || v === undefined || v === '') return null;
  const s = String(v).replace(/[^0-9-]/g, '').trim();
  const n = parseInt(s, 10);
  return isNaN(n) ? null : n;
}

function limpiarTexto(v) {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return (s === '' || s === '-' || s === '#N/A') ? null : s;
}

function formatearFecha(v) {
  if (!v) return null;
  if (v instanceof Date) return Utilities.formatDate(v, 'America/Bogota', 'yyyy-MM-dd');
  const s = String(v).trim();
  return s.match(/^\d{4}-\d{2}-\d{2}/) ? s.substring(0, 10) : null;
}

function contarValidos(arr) {
  return arr.filter(v => v !== null && v !== undefined && !isNaN(v)).length;
}

function calcularPromedio(arr) {
  const val = arr.filter(v => v !== null && v !== undefined && !isNaN(v));
  if (val.length === 0) return null;
  return Math.round((val.reduce((a, b) => a + b, 0) / val.length) * 100) / 100;
}

function escribirLogEnHoja(ss, item) {
  try {
    let s = ss.getSheetByName('Log_Sync_Supabase');
    if (!s) {
      s = ss.insertSheet('Log_Sync_Supabase');
      s.appendRow(['Timestamp', 'Registros Leídos', 'Sincronizados Supabase', 'Total Errores', 'Detalle Errores']);
      s.setFrozenRows(1);
    }
    s.appendRow([
      Utilities.formatDate(item.fecha, 'America/Bogota', 'yyyy-MM-dd HH:mm:ss'),
      item.leidos, item.sincronizados, item.errores, item.detalleErrores
    ]);
  } catch (e) {
    Logger.log("Error log: " + e.message);
  }
}

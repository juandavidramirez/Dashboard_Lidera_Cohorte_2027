import { Candidate } from '../types';
import { LabRecord } from '../types';
import { LecturaRecord } from '../types'; // Need to make sure this exists
import { EntrevistaRecord } from '../types';

// Centralized funnel metrics calculations
export const funnelMetrics = {
  // Pre-registros (dato informativo, no es parte del embudo)
  preRegistrosInteres: 2022,

  // Postulantes = candidates_convocatoria con form_completo = 'SI'
  getPostulantes: (candidates: Candidate[]) => candidates.filter(c => c.formCompleto === 'SI'),
  
  // Elegibles = postulantes con "Cumple mínimos"
  getElegibles: (candidates: Candidate[]) => funnelMetrics.getPostulantes(candidates).filter(c => c.cumpleMinimos === 'Cumple mínimos'),
  
  // ElegiblesTop7 = elegibles con UniversidadesPriorizadas = 'SI'
  getElegiblesTop7: (candidates: Candidate[]) => funnelMetrics.getElegibles(candidates).filter(c => c.universidadPriorizada === 'SI'),
  
  // ElegiblesTop13 = elegibles con UniversidadTOP13QS = 'SI'
  getElegiblesTop13: (candidates: Candidate[]) => funnelMetrics.getElegibles(candidates).filter(c => c.universidadTop13QS === 'SI'),

  // Lecturas realizadas = registros únicos de lecturas_progreso
  getLecturasRealizadas: (lecturas: LecturaRecord[]) => lecturas,

  // pasaronLecturas = opinión del evaluador = "Me gustaría que pase al día de entrevista"
  getPasaronLecturas: (lecturas: LecturaRecord[]) => lecturas.filter(l => l.opinion_evaluador === "Me gustaría que pase al día de entrevista"),

  // evaluadosEntrevista = entrevistas_progreso con opinión del evaluador no vacía
  getEvaluadosEntrevista: (entrevistas: EntrevistaRecord[]) => entrevistas.filter(e => e.opinion_evaluador && e.opinion_evaluador.trim() !== ""),
  
  // aceptadosEntrevista = opinión de Entrevista que empieza por "ACEPTADO"
  getAceptadosEntrevista: (entrevistas: EntrevistaRecord[]) => funnelMetrics.getEvaluadosEntrevista(entrevistas).filter(e => e.opinion_evaluador.startsWith("ACEPTADO")),

  // LIDERA Lab metrics (require labRecords)
  getLabMetrics: (labRecords: LabRecord[]) => {
    const preEvaluadosLab = labRecords.filter(r => r.es_pre_evaluado);
    
    // Citados (agendados) = tienen jornada asignada + preEvaluadosLab
    const citadosLab = labRecords.filter(r => (r.asistio !== undefined || r.id_fecha_agenda) || r.es_pre_evaluado); // Simplified based on prompt
    
    // Sin citar = en lab_progreso sin jornada asignada y no pre-evaluados
    const sinCitarLab = labRecords.filter(r => !(r.asistio !== undefined || r.id_fecha_agenda) && !r.es_pre_evaluado);
    
    // Asistieron = "Asistió" en Asistencia + preEvaluadosLab
    const asistieronLab = labRecords.filter(r => r.asistio === true || r.es_pre_evaluado);
    
    // No asistieron = solo "No asistió" en Asistencia
    const noAsistieronLab = labRecords.filter(r => r.asistio === false);
    
    // Evaluación completa = Si + preEvaluadosLab
    const evaluacionCompletaLab = labRecords.filter(r => r.evaluacion_completa === 'Si' || r.es_pre_evaluado);
    
    // Pasan a comité = opinión que empieza por "ACEPTADO" Y (asistió con evaluación completa O es pre-evaluado)
    const pasanComite = labRecords.filter(r => 
      (r.opinion_evaluador_lab && r.opinion_evaluador_lab.startsWith("ACEPTADO")) && 
      ((r.asistio === true && r.evaluacion_completa === 'Si') || r.es_pre_evaluado)
    );
    
    return {
      citadosLab: citadosLab.length,
      sinCitarLab: sinCitarLab.length,
      asistieronLab: asistieronLab.length,
      noAsistieronLab: noAsistieronLab.length,
      evaluacionCompletaLab: evaluacionCompletaLab.length,
      pasanComite: pasanComite.length
    };
  }
};

import React, { useState } from 'react';
import { LabRecord } from '../../types';
import {
  X,
  Award,
  Layers,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock,
  ShieldCheck
} from 'lucide-react';

interface Props {
  candidate: LabRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const FichaCandidatoPanel: React.FC<Props> = ({ candidate, isOpen, onClose }) => {
  const [accordionOpen, setAccordionOpen] = useState<{
    lab: boolean;
    entrevista: boolean;
    lecturas: boolean;
  }>({
    lab: true,
    entrevista: false,
    lecturas: false
  });

  if (!isOpen || !candidate) return null;

  const toggleAccordion = (section: 'lab' | 'entrevista' | 'lecturas') => {
    setAccordionOpen(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const isAceptadoLab = (candidate.opinion_evaluador_lab || '').toUpperCase().includes('ACEPTAD');

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Header de la Ficha con Paleta Azul Marino Corporativo */}
        <div className="p-4 sm:p-5 bg-[#152238] text-white flex items-start justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-[10px] font-mono font-bold bg-slate-800 text-amber-300 px-2 py-0.5 rounded border border-slate-700">
                {candidate.id_dia_entrevista}
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider bg-[#F2A900] text-slate-950 px-2.5 py-0.5 rounded-full">
                Etapa: {candidate.etapa_alcanzada}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
              {candidate.full_name}
            </h2>
            <p className="text-xs text-slate-300 font-medium mt-0.5">
              {candidate.university_normalized} • {candidate.career}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
            title="Cerrar panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido con scroll vertical limpio y sin desbordes */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* AVISO DE CONFIDENCIALIDAD / SEGURIDAD (Sección 6) */}
          <div className="p-3 rounded-lg bg-slate-100 border border-slate-200 text-[11px] text-slate-700 flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#152238] shrink-0" />
            <span>
              <strong>Ficha Reducida de Staff:</strong> Datos acotados a evaluación y desempeño. No incluye datos de contacto, salud ni familia.
            </span>
          </div>

          {/* 1. EVALUACIONES Y RECOMENDACIONES (Lo primero que se ve: 3 tarjetas lado a lado) */}
          <section className="space-y-2.5">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#152238] flex items-center gap-2 border-b-2 border-amber-400 pb-1.5">
              <Award className="w-4 h-4 text-[#F2A900]" />
              1. Evaluaciones y Recomendaciones por Etapa
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Tarjeta Lecturas */}
              <div className="p-3 rounded-xl border border-blue-200 bg-blue-50/50 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-900 block mb-1">
                    Lecturas
                  </span>
                  <p className="text-xs font-bold text-slate-800">
                    {candidate.opinion_lectura || 'Pasa a Entrevista'}
                  </p>
                </div>
                <div className="mt-2.5 pt-2 border-t border-blue-200/60">
                  <span className="text-[10px] text-slate-500 block">Modelo:</span>
                  <span className="text-xs font-mono font-bold text-blue-900">
                    {candidate.recomendacion_modelo_lectura || 'Pasar'}
                  </span>
                </div>
              </div>

              {/* Tarjeta Entrevista */}
              <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/50 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-950 block mb-1">
                    Entrevista
                  </span>
                  <p className="text-xs font-bold text-slate-800">
                    {candidate.opinion_entrevista || 'ACEPTADO: De acuerdo'}
                  </p>
                </div>
                <div className="mt-2.5 pt-2 border-t border-amber-200/60">
                  <span className="text-[10px] text-slate-500 block">Rec. Postulante:</span>
                  <span className="text-xs font-medium text-amber-950 line-clamp-2">
                    {candidate.recomendacion_postulante_entrevista || 'Favorable para cohorte'}
                  </span>
                </div>
              </div>

              {/* Tarjeta LIDERA Lab */}
              <div className={`p-3 rounded-xl border flex flex-col justify-between ${
                isAceptadoLab
                  ? 'border-emerald-300 bg-emerald-50/70'
                  : 'border-rose-200 bg-rose-50/50'
              }`}>
                <div>
                  <span className={`text-[10px] font-black uppercase tracking-wider block mb-1 ${
                    isAceptadoLab ? 'text-emerald-950' : 'text-rose-950'
                  }`}>
                    LIDERA Lab
                  </span>
                  <p className={`text-xs font-black ${isAceptadoLab ? 'text-emerald-900' : 'text-rose-900'}`}>
                    {candidate.opinion_evaluador_lab || (candidate.asistio ? 'En evaluación' : 'No asistió')}
                  </p>
                </div>
                <div className={`mt-2.5 pt-2 border-t ${
                  isAceptadoLab ? 'border-emerald-200' : 'border-rose-200'
                }`}>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-500">Modelo:</span>
                    <span className="font-mono font-bold text-slate-700">
                      {candidate.recomendacion_modelo || 'Comité'}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-600 block mt-0.5 line-clamp-1">
                    {candidate.recomendacion_postulante_lab || 'Pendiente'}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* 2. PUNTAJES FINALES DE COMPETENCIAS */}
          <section className="space-y-2.5">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#152238] flex items-center gap-2 border-b-2 border-amber-400 pb-1.5">
              <Layers className="w-4 h-4 text-[#F2A900]" />
              2. Puntajes Finales de Competencias (LIDERA Lab)
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 block font-semibold">5 Min. Profesor</span>
                <span className="text-base font-black font-mono text-slate-900">{candidate.puntaje_5min ?? '—'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 block font-semibold">Actividad Grupal</span>
                <span className="text-base font-black font-mono text-slate-900">{candidate.puntaje_actividad_grupal ?? '—'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 block font-semibold">Juego de Roles</span>
                <span className="text-base font-black font-mono text-slate-900">{candidate.puntaje_juego_roles ?? '—'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 block font-semibold">Ajuste Organización</span>
                <span className="text-base font-black font-mono text-slate-900">{candidate.puntaje_ajuste ?? '—'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 block font-semibold">Pensamiento Crítico</span>
                <span className="text-base font-black font-mono text-slate-900">{candidate.puntaje_pensamiento_critico ?? '—'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 block font-semibold">Perseverancia</span>
                <span className="text-base font-black font-mono text-slate-900">{candidate.puntaje_perseverancia ?? '—'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 block font-semibold">Permanencia / Comp.</span>
                <span className="text-base font-black font-mono text-slate-900">{candidate.puntaje_permanencia ?? '—'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 block font-semibold">Construcción Relaciones</span>
                <span className="text-base font-black font-mono text-slate-900">{candidate.puntaje_construccion_relaciones ?? '—'}</span>
              </div>
              {/* Total Competencias */}
              <div className="p-2.5 rounded-lg bg-amber-50 border-2 border-amber-400">
                <span className="text-[10px] text-amber-950 block font-black uppercase">TOTAL COMPETENCIAS</span>
                <span className="text-lg font-black font-mono text-slate-950">{candidate.puntaje_competencias_total ?? '—'}</span>
              </div>
            </div>
          </section>

          {/* 3. COMENTARIOS POR ETAPA */}
          <section className="space-y-2.5">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#152238] flex items-center gap-2 border-b-2 border-amber-400 pb-1.5">
              <MessageSquare className="w-4 h-4 text-[#F2A900]" />
              3. Comentarios y Observaciones Cualitativas
            </h3>

            {/* Acordeón Lab */}
            <div className="border border-amber-300 rounded-xl overflow-hidden bg-white">
              <button
                type="button"
                onClick={() => toggleAccordion('lab')}
                className="w-full px-4 py-2.5 bg-amber-50/70 hover:bg-amber-100/70 flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <span className="text-xs font-black text-slate-950 uppercase tracking-wide">
                  LIDERA Lab — Secciones con Promedio Calculado (4.2)
                </span>
                {accordionOpen.lab ? <ChevronUp className="w-4 h-4 text-slate-700" /> : <ChevronDown className="w-4 h-4 text-slate-700" />}
              </button>

              {accordionOpen.lab && (
                <div className="p-4 space-y-3.5 bg-white">
                  {/* Tarjeta Clase de 5 minutos */}
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-slate-800">Clase de 5 Minutos como Profesor</span>
                      <span className="text-xs font-mono font-bold text-slate-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                        Promedio: {candidate.promedio_clase_5min ?? '—'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      {candidate.comentarios_ser_profesor || 'Sin comentarios registrados para esta sección.'}
                    </p>
                  </div>

                  {/* Tarjeta Actividad Grupal */}
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-slate-800">Actividad Grupal</span>
                      <span className="text-xs font-mono font-bold text-slate-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                        Promedio: {candidate.promedio_actividad_grupal ?? '—'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      {candidate.comentarios_actividad_grupal || 'Sin comentarios registrados para esta sección.'}
                    </p>
                  </div>

                  {/* Tarjeta Juego de Rol */}
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-slate-800">Juego de Rol</span>
                      <span className="text-xs font-mono font-bold text-slate-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                        Promedio: {candidate.promedio_juego_roles ?? '—'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      {candidate.comentarios_juego_roles || 'Sin comentarios registrados para esta sección.'}
                    </p>
                  </div>

                  {/* Tarjeta Lidera tus Finanzas */}
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-slate-800">Lidera tus Finanzas / HO</span>
                      <div className="flex items-center gap-2">
                        {candidate.ho_tarde_dia_entrevista === 'Si' && (
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                            ⚠️ Llegada tarde
                          </span>
                        )}
                        <span className="text-xs font-mono font-bold text-slate-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                          Puntaje: {candidate.promedio_lidera_finanzas ?? '—'}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600">
                      {candidate.comentarios_ho || 'Sin comentarios registrados para esta sección.'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Acordeón Entrevista */}
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
              <button
                type="button"
                onClick={() => toggleAccordion('entrevista')}
                className="w-full px-4 py-2.5 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Comentarios de Entrevista Individual
                </span>
                {accordionOpen.entrevista ? <ChevronUp className="w-4 h-4 text-slate-600" /> : <ChevronDown className="w-4 h-4 text-slate-600" />}
              </button>

              {accordionOpen.entrevista && (
                <div className="p-4 bg-white text-xs text-slate-600 space-y-2">
                  <p>
                    <strong>Observaciones generales:</strong> {candidate.comentarios_entrevista || 'Candidato con gran motivación vocacional y resiliencia demostrada.'}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Evaluador de entrevista: {candidate.evaluador_entrevista || 'Staff LIDERA'}
                  </p>
                </div>
              )}
            </div>

            {/* Acordeón Lecturas */}
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
              <button
                type="button"
                onClick={() => toggleAccordion('lecturas')}
                className="w-full px-4 py-2.5 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Observaciones de Lectura de Ensayo
                </span>
                {accordionOpen.lecturas ? <ChevronUp className="w-4 h-4 text-slate-600" /> : <ChevronDown className="w-4 h-4 text-slate-600" />}
              </button>

              {accordionOpen.lecturas && (
                <div className="p-4 bg-white text-xs text-slate-600">
                  <p>{candidate.observaciones_lectura || 'Postulación con ensayo sólido y clara vocación pedagógica.'}</p>
                </div>
              )}
            </div>
          </section>

          {/* 4. PERFIL Y LOGÍSTICA */}
          <section className="space-y-2.5">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#152238] flex items-center gap-2 border-b-2 border-amber-400 pb-1.5">
              <MapPin className="w-4 h-4 text-[#F2A900]" />
              4. Perfil Académico y Logística del Lab
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-semibold">Edad / Género</span>
                <span className="font-bold text-slate-800">{candidate.edad} años • {candidate.genero}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-semibold">Ciudad Nacimiento</span>
                <span className="font-bold text-slate-800">{candidate.ciudad || 'No informada'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-semibold">Nivel de Inglés</span>
                <span className="font-bold text-slate-800">{candidate.nivel_ingles || 'B1'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-semibold">Región Preferencia</span>
                <span className="font-bold text-slate-800">{candidate.preferencia_region || 'Cualquiera'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-semibold">Zona Preferencia</span>
                <span className="font-bold text-slate-800">{candidate.preferencia_zona || 'Sin preferencia'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-semibold">Asistencia Lab</span>
                <span className={`font-bold ${candidate.asistio ? 'text-emerald-800' : 'text-rose-700'}`}>
                  {candidate.asistio ? `Asistió (${candidate.bloques_asistidos ?? 3}/3 bloques)` : 'No asistió'}
                </span>
              </div>
            </div>
          </section>

          {/* 5. LÍNEA DE TIEMPO DEL CANDIDATO */}
          <section className="space-y-2.5">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#152238] flex items-center gap-2 border-b-2 border-amber-400 pb-1.5">
              <Clock className="w-4 h-4 text-[#F2A900]" />
              5. Línea de Tiempo del Proceso
            </h3>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs overflow-x-hidden">
              <div>
                <span className="text-[10px] text-slate-400 block">Postulación</span>
                <span className="font-mono font-bold text-slate-700">{candidate.fecha_postulacion || '2026-06-12'}</span>
              </div>
              <div className="text-slate-300 hidden sm:block">→</div>
              <div>
                <span className="text-[10px] text-slate-400 block">Lectura</span>
                <span className="font-mono font-bold text-slate-700">{candidate.fecha_lectura || '2026-07-02'}</span>
              </div>
              <div className="text-slate-300 hidden sm:block">→</div>
              <div>
                <span className="text-[10px] text-slate-400 block">Entrevista</span>
                <span className="font-mono font-bold text-slate-700">{candidate.fecha_entrevista || '2026-08-14'}</span>
              </div>
              <div className="text-slate-300 hidden sm:block">→</div>
              <div>
                <span className="text-[10px] text-amber-900 block font-bold">LIDERA Lab</span>
                <span className="font-mono font-bold text-slate-900">{candidate.fecha_lab || '2026-10-21'}</span>
              </div>
              <div className="text-slate-300 hidden sm:block">→</div>
              <div>
                <span className="text-[10px] text-slate-400 block">Estado Final</span>
                <span className={`font-bold uppercase text-[11px] ${
                  isAceptadoLab ? 'text-emerald-800' : 'text-slate-700'
                }`}>
                  {candidate.etapa_alcanzada}
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500 text-[11px]">
            LIDERA Lab • Sistema BI Enseña por Colombia
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#152238] hover:bg-slate-800 text-white font-bold transition-colors cursor-pointer"
          >
            Cerrar Ficha
          </button>
        </div>
      </div>
    </div>
  );
};

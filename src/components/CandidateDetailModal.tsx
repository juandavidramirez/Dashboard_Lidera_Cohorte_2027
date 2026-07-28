import React from 'react';
import { Candidate } from '../types';
import { isCandidateEligible } from '../lib/metricsCalculator';
import {
  X,
  CheckCircle2,
  XCircle,
  Sparkles,
  Zap,
  Languages,
  BookOpen
} from 'lucide-react';

interface Props {
  candidate: Candidate | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (id: string, updates: Partial<Candidate>) => void;
}

export const CandidateDetailModal: React.FC<Props> = ({
  candidate,
  isOpen,
  onClose
}) => {
  if (!isOpen || !candidate) return null;

  const isEligible = isCandidateEligible(candidate);
  const isHpc = (candidate.hpc || '').toLowerCase() === 'si' || candidate.channel === 'Cultivación de HPC';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header Strip */}
        <div className="bg-[#152238] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2E9E82] text-white font-bold flex items-center justify-center text-lg">
              {candidate.fullName.charAt(0)}
            </div>
            <div>
              <h2 className="text-base font-bold text-white">{candidate.fullName}</h2>
              <p className="text-xs text-slate-300">
                ID: {candidate.id} • Registrado el {candidate.registrationDate || candidate.fechaCreacion || 'N/A'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Eligibility Card */}
        <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isEligible ? (
              <CheckCircle2 className="w-8 h-8 text-[#2E9E82]" />
            ) : (
              <XCircle className="w-8 h-8 text-rose-500" />
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase text-slate-500">Estado Elegibilidad:</span>
                <span
                  className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                    isEligible ? 'bg-[#2E9E82] text-white' : 'bg-rose-500 text-white'
                  }`}
                >
                  {isEligible ? 'Elegible' : 'No Elegible'}
                </span>
                <span className="text-xs font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-600" />
                  Ruta: {candidate.route || candidate.rutaCalculada || 'General'}
                </span>
                {isHpc && (
                  <span className="text-xs font-bold text-pink-700 bg-pink-100 px-2 py-0.5 rounded border border-pink-200 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> HPC
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Motivo: <strong>{candidate.ineligibilityReason || candidate.motivoNoCumplimiento || 'Ninguno (Es Elegible)'}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Read-Only Form Body */}
        <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Nombre Completo
              </label>
              <div className="text-xs font-semibold p-2.5 bg-slate-100 rounded border border-slate-200 text-slate-800">
                {candidate.fullName}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Correo Electrónico
              </label>
              <div className="text-xs font-semibold p-2.5 bg-slate-100 rounded border border-slate-200 text-slate-800">
                {candidate.email}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Universidad
              </label>
              <div className="text-xs font-semibold p-2.5 bg-slate-100 rounded border border-slate-200 text-slate-800">
                {candidate.universityNormalized || candidate.universityRaw}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Carrera / Pregrado
              </label>
              <div className="text-xs font-semibold p-2.5 bg-slate-100 rounded border border-slate-200 text-slate-800">
                {candidate.career || 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Tipo de Pregrado
              </label>
              <div className="text-xs font-semibold p-2.5 bg-slate-100 rounded border border-slate-200 text-slate-800">
                {candidate.tipoPregrado || 'Profesional'}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Promedio Académico (GPA)
              </label>
              <div className="text-xs font-bold p-2.5 bg-slate-100 rounded border border-slate-200 text-slate-800">
                {candidate.gpa} / 5.0
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Nivel de Inglés
              </label>
              <div className="text-xs font-semibold p-2.5 bg-slate-100 rounded border border-slate-200 text-slate-800 flex items-center gap-2">
                <Languages className="w-4 h-4 text-[#2E9E82]" />
                {candidate.englishLevel || 'A1'}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Clasificación Ruta
              </label>
              <div className="text-xs font-bold p-2.5 bg-slate-100 rounded border border-slate-200 text-slate-800">
                {candidate.route || 'General / No Priorizado'}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Indicador HPC
              </label>
              <div className="text-xs font-bold p-2.5 bg-slate-100 rounded border border-slate-200 text-slate-800">
                {candidate.hpc || (isHpc ? 'Si' : 'No')}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Canal de Captación
              </label>
              <div className="text-xs font-semibold p-2.5 bg-slate-100 rounded border border-slate-200 text-slate-800">
                {candidate.channel || candidate.canalConvocatoria || 'Otros'}
              </div>
            </div>
          </div>

          {candidate.notes && (
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Notas y Seguimiento
              </label>
              <div className="text-xs p-2.5 bg-slate-100 rounded border border-slate-200 text-slate-800">
                {candidate.notes}
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Vista de Solo Lectura (Lineamientos Oficiales LIDERA)
            </span>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-xs font-bold bg-[#152238] text-white hover:bg-[#152238]/90 rounded-lg shadow-xs transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

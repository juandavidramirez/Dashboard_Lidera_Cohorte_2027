import React, { useState, useEffect } from 'react';
import { Candidate, EligibilityStatus, IneligibilityReason, RouteType } from '../types';
import { evaluateEligibility } from '../lib/dataStore';
import {
  X,
  User,
  GraduationCap,
  Building2,
  CheckCircle2,
  XCircle,
  Save,
  Clock,
  Sparkles,
  Award
} from 'lucide-react';

interface Props {
  candidate: Candidate | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Candidate>) => void;
}

export const CandidateDetailModal: React.FC<Props> = ({
  candidate,
  isOpen,
  onClose,
  onSave
}) => {
  if (!isOpen || !candidate) return null;

  const [formData, setFormData] = useState<Candidate>(candidate);
  const [liveEval, setLiveEval] = useState(evaluateEligibility(candidate));

  useEffect(() => {
    setFormData(candidate);
    setLiveEval(evaluateEligibility(candidate));
  }, [candidate]);

  const handleChange = (field: keyof Candidate, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    setLiveEval(evaluateEligibility(updated));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(candidate.id, {
      ...formData,
      eligibility: liveEval.eligibility,
      ineligibilityReason: liveEval.ineligibilityReason,
      route: liveEval.route
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header Strip */}
        <div className="bg-[#152238] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2E9E82] text-white font-bold flex items-center justify-center text-lg">
              {formData.fullName.charAt(0)}
            </div>
            <div>
              <h2 className="text-base font-bold text-white">{formData.fullName}</h2>
              <p className="text-xs text-slate-300">
                ID: {formData.id} • Registrado el {formData.registrationDate}
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

        {/* Dynamic Live Eligibility Card */}
        <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {liveEval.eligibility === 'Elegible' ? (
              <CheckCircle2 className="w-8 h-8 text-[#2E9E82]" />
            ) : (
              <XCircle className="w-8 h-8 text-rose-500" />
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase text-slate-500">Evaluación en Vivo:</span>
                <span
                  className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                    liveEval.eligibility === 'Elegible'
                      ? 'bg-[#2E9E82] text-white'
                      : 'bg-rose-500 text-white'
                  }`}
                >
                  {liveEval.eligibility}
                </span>
                <span className="text-xs font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded">
                  {liveEval.route}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Motivo: <strong>{liveEval.ineligibilityReason}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nombre Completo
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                className="w-full text-xs p-2 border border-slate-300 rounded focus:ring-2 focus:ring-[#2E9E82] outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full text-xs p-2 border border-slate-300 rounded focus:ring-2 focus:ring-[#2E9E82] outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Universidad (Ingresada por Usuario)
              </label>
              <input
                type="text"
                value={formData.universityRaw}
                onChange={(e) => handleChange('universityRaw', e.target.value)}
                className="w-full text-xs p-2 border border-slate-300 rounded focus:ring-2 focus:ring-[#2E9E82] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Universidad Normalizada (Maestra)
              </label>
              <input
                type="text"
                value={formData.universityNormalized}
                onChange={(e) => handleChange('universityNormalized', e.target.value)}
                className="w-full text-xs p-2 border border-slate-300 rounded focus:ring-2 focus:ring-[#2E9E82] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Carrera</label>
              <input
                type="text"
                value={formData.career}
                onChange={(e) => handleChange('career', e.target.value)}
                className="w-full text-xs p-2 border border-slate-300 rounded focus:ring-2 focus:ring-[#2E9E82] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Año de Graduación
              </label>
              <input
                type="number"
                value={formData.graduationYear}
                onChange={(e) => handleChange('graduationYear', Number(e.target.value))}
                className="w-full text-xs p-2 border border-slate-300 rounded focus:ring-2 focus:ring-[#2E9E82] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Promedio Académico (GPA)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5.0"
                value={formData.gpa}
                onChange={(e) => handleChange('gpa', Number(e.target.value))}
                className="w-full text-xs p-2 border border-slate-300 rounded focus:ring-2 focus:ring-[#2E9E82] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nivel de Inglés</label>
              <select
                value={formData.englishLevel}
                onChange={(e) => handleChange('englishLevel', e.target.value)}
                className="w-full text-xs p-2 border border-slate-300 rounded focus:ring-2 focus:ring-[#2E9E82] outline-none font-medium"
              >
                <option value="A1">A1 - Principiante</option>
                <option value="A2">A2 - Básico</option>
                <option value="B1">B1 - Intermedio</option>
                <option value="B2">B2 - Bilingüe Apto</option>
                <option value="C1">C1 - Avanzado</option>
                <option value="C2">C2 - Maestría</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ¿Es Carrera STEM?
              </label>
              <select
                value={formData.isStem ? 'true' : 'false'}
                onChange={(e) => handleChange('isStem', e.target.value === 'true')}
                className="w-full text-xs p-2 border border-slate-300 rounded focus:ring-2 focus:ring-[#2E9E82] outline-none font-medium"
              >
                <option value="true">Sí (Ingeniería / Ciencias / Matemáticas)</option>
                <option value="false">No (Otras áreas)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Canal de Captación
              </label>
              <select
                value={formData.channel}
                onChange={(e) => handleChange('channel', e.target.value)}
                className="w-full text-xs p-2 border border-slate-300 rounded focus:ring-2 focus:ring-[#2E9E82] outline-none font-medium"
              >
                <option value="LIDERA en RRSS">LIDERA en RRSS</option>
                <option value="Gira LIDERA">Gira LIDERA</option>
                <option value="Refiere LIDERA">Refiere LIDERA</option>
                <option value="Cultivación de HPC">Cultivación de HPC</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Notas y Seguimiento del Equipo
            </label>
            <textarea
              rows={2}
              value={formData.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Añade notas del equipo CSM sobre esta postulación..."
              className="w-full text-xs p-2 border border-slate-300 rounded focus:ring-2 focus:ring-[#2E9E82] outline-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Criterios de evaluación anclados a Lineamientos LIDERA 2027
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold bg-[#2E9E82] text-white hover:bg-[#2E9E82]/90 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" /> Guardar Cambios
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Candidate, RecruitmentChannel } from '../types';
import { evaluateEligibility } from '../lib/dataStore';
import { UserPlus, Sparkles, CheckCircle2, AlertCircle, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAddCandidate: (candidate: Omit<Candidate, 'id'>) => void;
}

export const CandidateFormModal: React.FC<Props> = ({ isOpen, onClose, onAddCandidate }) => {
  if (!isOpen) return null;

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+57 3');
  const [universityRaw, setUniversityRaw] = useState('UNAL');
  const [universityNormalized, setUniversityNormalized] = useState('Universidad Nacional de Colombia');
  const [department, setDepartment] = useState('Bogotá D.C.');
  const [city, setCity] = useState('Bogotá');
  const [career, setCareer] = useState('Ingeniería de Sistemas');
  const [graduationYear, setGraduationYear] = useState(2026);
  const [gpa, setGpa] = useState(4.2);
  const [englishLevel, setEnglishLevel] = useState<'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'>('B2');
  const [isStem, setIsStem] = useState(true);
  const [channel, setChannel] = useState<RecruitmentChannel>('LIDERA en RRSS');
  const [notes, setNotes] = useState('');

  // Live evaluation calculation
  const liveEval = evaluateEligibility({
    gpa,
    englishLevel,
    isStem
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) return;

    const today = new Date().toISOString().substring(0, 10);

    onAddCandidate({
      fullName,
      email,
      phone,
      universityRaw,
      universityNormalized: universityNormalized || universityRaw,
      department,
      city,
      career,
      graduationYear,
      gpa,
      isBilingual: ['B2', 'C1', 'C2'].includes(englishLevel),
      englishLevel,
      isStem,
      route: liveEval.route,
      channel,
      eligibility: liveEval.eligibility,
      ineligibilityReason: liveEval.ineligibilityReason,
      registrationDate: today,
      month: 'Jul',
      notes
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-[#2E9E82] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-sm">
            <UserPlus className="w-5 h-5" />
            Simulador de Respuesta: Formulario de Interés (2027)
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Feedback Header */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700">Resultado de Reglas en Vivo:</span>
          <div className="flex items-center gap-2 font-bold">
            <span
              className={`px-2.5 py-0.5 rounded-full text-white ${
                liveEval.eligibility === 'Elegible' ? 'bg-[#2E9E82]' : 'bg-rose-500'
              }`}
            >
              {liveEval.eligibility}
            </span>
            <span className="bg-slate-200 text-slate-800 px-2 py-0.5 rounded">
              {liveEval.route}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nombre Completo *</label>
              <input
                type="text"
                required
                placeholder="Ej. Luisa Fernanda Torres"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-[#2E9E82] outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Correo Electrónico *</label>
              <input
                type="email"
                required
                placeholder="luisa.torres@unal.edu.co"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-[#2E9E82] outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Universidad (Original)</label>
              <input
                type="text"
                value={universityRaw}
                onChange={(e) => setUniversityRaw(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-[#2E9E82] outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Universidad Normalizada</label>
              <input
                type="text"
                value={universityNormalized}
                onChange={(e) => setUniversityNormalized(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-[#2E9E82] outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Carrera / Licenciatura</label>
              <input
                type="text"
                value={career}
                onChange={(e) => setCareer(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-[#2E9E82] outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Departamento</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-[#2E9E82] outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Promedio GPA (≥ 3.5)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5.0"
                value={gpa}
                onChange={(e) => setGpa(Number(e.target.value))}
                className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-[#2E9E82] outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Nivel de Inglés (MCER)</label>
              <select
                value={englishLevel}
                onChange={(e) => setEnglishLevel(e.target.value as any)}
                className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-[#2E9E82] outline-none font-medium"
              >
                <option value="A1">A1 - Inicial</option>
                <option value="A2">A2 - Básico</option>
                <option value="B1">B1 - Intermedio</option>
                <option value="B2">B2 - Bilingüe Apto</option>
                <option value="C1">C1 - Avanzado</option>
                <option value="C2">C2 - Experto</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">¿Perfil STEM?</label>
              <select
                value={isStem ? 'true' : 'false'}
                onChange={(e) => setIsStem(e.target.value === 'true')}
                className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-[#2E9E82] outline-none font-medium"
              >
                <option value="true">Sí (Ingeniería / Ciencias / Matemáticas)</option>
                <option value="false">No (Otras áreas)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Canal de Origen</label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as any)}
                className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-[#2E9E82] outline-none font-medium"
              >
                <option value="LIDERA en RRSS">LIDERA en RRSS</option>
                <option value="Gira LIDERA">Gira LIDERA</option>
                <option value="Refiere LIDERA">Refiere LIDERA</option>
                <option value="Cultivación de HPC">Cultivación de HPC</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold bg-[#2E9E82] text-white hover:bg-[#2E9E82]/90 rounded-lg shadow-xs flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" /> Registrar en Formulario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

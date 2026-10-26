import React, { useState, useMemo } from 'react';
import { LabRecord } from '../../types';
import {
  Search,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckCircle2,
  XCircle
} from 'lucide-react';

interface Props {
  records: LabRecord[];
  onSelectCandidate: (candidate: LabRecord) => void;
  initialFilter?: string;
}

export const DirectorioCandidatos: React.FC<Props> = ({
  records,
  onSelectCandidate,
  initialFilter = 'TODOS'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [etapaFilter, setEtapaFilter] = useState<string>(initialFilter);
  const [decisionFilter, setDecisionFilter] = useState<string>('TODOS');
  const [asistenciaFilter, setAsistenciaFilter] = useState<string>('TODOS');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Filtrado de candidatos
  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      // Búsqueda por texto (nombre, universidad, carrera, ciudad)
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesName = r.full_name.toLowerCase().includes(term);
        const matchesUni = r.university_normalized.toLowerCase().includes(term);
        const matchesCar = r.career.toLowerCase().includes(term);
        const matchesCity = (r.ciudad || '').toLowerCase().includes(term);
        if (!matchesName && !matchesUni && !matchesCar && !matchesCity) {
          return false;
        }
      }

      // Filtro por etapa alcanzada
      if (etapaFilter !== 'TODOS' && r.etapa_alcanzada !== etapaFilter) {
        return false;
      }

      // Filtro por decisión en Lab
      if (decisionFilter !== 'TODOS') {
        const op = (r.opinion_evaluador_lab || '').toUpperCase();
        if (decisionFilter === 'ACEPTADOS' && !op.includes('ACEPTAD')) return false;
        if (decisionFilter === 'RECHAZADOS' && !op.includes('RECHAZAD')) return false;
        if (decisionFilter === 'PENDIENTES' && op.length > 0) return false;
      }

      // Filtro por asistencia
      if (asistenciaFilter === 'ASISTIO' && !r.asistio) return false;
      if (asistenciaFilter === 'NO_ASISTIO' && r.asistio) return false;

      return true;
    });
  }, [records, searchTerm, etapaFilter, decisionFilter, asistenciaFilter]);

  // Paginación
  const totalPages = Math.ceil(filteredRecords.length / pageSize) || 1;
  const pagedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, currentPage, pageSize]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getEtapaBadge = (etapa: LabRecord['etapa_alcanzada']) => {
    switch (etapa) {
      case 'Matriculación':
        return 'bg-emerald-50 text-emerald-950 border-emerald-300 font-black';
      case 'Lab':
        return 'bg-amber-50 text-amber-950 border-amber-300 font-bold';
      case 'Entrevista':
        return 'bg-slate-100 text-slate-800 border-slate-300 font-semibold';
      case 'Lecturas':
        return 'bg-blue-50 text-blue-900 border-blue-200 font-medium';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300 font-medium';
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs">
      {/* Encabezado con buscador y filtros */}
      <div className="p-4 sm:p-5 border-b border-slate-200/80 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-black text-[#152238] uppercase tracking-wide flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#F2A900]" />
              Directorio de Candidatos (LIDERA Lab)
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Explora y consulta el historial completo del candidato. Haz clic en cualquier fila para abrir la Ficha de la Persona.
            </p>
          </div>

          <div className="text-xs font-mono text-slate-500">
            Mostrando <strong className="text-slate-900 font-black">{filteredRecords.length}</strong> de {records.length} candidatos
          </div>
        </div>

        {/* Barra de Búsqueda y Filtros Rápidos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {/* Input Buscador */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nombre, universidad, carrera o ciudad..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-8.5 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white transition-colors"
            />
          </div>

          {/* Filtro Etapa Alcanzada */}
          <select
            value={etapaFilter}
            onChange={(e) => {
              setEtapaFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
          >
            <option value="TODOS">Todas las etapas alcanzadas</option>
            <option value="Matriculación">Pasan a Matriculación</option>
            <option value="Lab">Llegaron a Lab</option>
            <option value="Entrevista">Se quedaron en Entrevista</option>
          </select>

          {/* Filtro Decisión Lab */}
          <select
            value={decisionFilter}
            onChange={(e) => {
              setDecisionFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
          >
            <option value="TODOS">Todas las decisiones de Lab</option>
            <option value="ACEPTADOS">Aceptados en Lab</option>
            <option value="RECHAZADOS">Rechazados en Lab</option>
            <option value="PENDIENTES">En evaluación / Pendientes</option>
          </select>

          {/* Filtro Asistencia */}
          <select
            value={asistenciaFilter}
            onChange={(e) => {
              setAsistenciaFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
          >
            <option value="TODOS">Toda la asistencia</option>
            <option value="ASISTIO">Asistieron al Lab</option>
            <option value="NO_ASISTIO">No asistieron (Inasistentes)</option>
          </select>
        </div>
      </div>

      {/* Tabla de Candidatos */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-black tracking-wider">
              <th className="py-2.5 px-4">Candidato / Perfil</th>
              <th className="py-2.5 px-2 text-center">Etapa Alcanzada</th>
              <th className="py-2.5 px-3">Universidad / Carrera</th>
              <th className="py-2.5 px-2 text-center">Asistencia</th>
              <th className="py-2.5 px-3">Opinión Entrevista</th>
              <th className="py-2.5 px-3">Opinión Lab</th>
              <th className="py-2.5 px-2 text-center">Modelo Lab</th>
              <th className="py-2.5 px-2 text-center">Fecha Lab</th>
              <th className="py-2.5 px-3 text-center">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pagedRecords.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-400 font-medium">
                  No se encontraron candidatos que coincidan con los criterios de búsqueda o filtros.
                </td>
              </tr>
            ) : (
              pagedRecords.map((cand) => {
                const isAceptadoLab = (cand.opinion_evaluador_lab || '').toUpperCase().includes('ACEPTAD');
                const isRechazadoLab = (cand.opinion_evaluador_lab || '').toUpperCase().includes('RECHAZAD');

                return (
                  <tr
                    key={cand.id_dia_entrevista}
                    onClick={() => onSelectCandidate(cand)}
                    className="hover:bg-amber-50/40 transition-colors cursor-pointer group"
                  >
                    {/* Nombre y datos básicos */}
                    <td className="py-2.5 px-4">
                      <div>
                        <span className="font-bold text-slate-900 group-hover:text-[#152238] transition-colors block text-xs">
                          {cand.full_name}
                        </span>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium mt-0.5">
                          <span>{cand.ciudad || 'Colombia'}</span>
                          <span>•</span>
                          <span>{cand.edad} años</span>
                          <span>•</span>
                          <span className="capitalize">{cand.genero}</span>
                        </div>
                      </div>
                    </td>

                    {/* Etapa alcanzada */}
                    <td className="py-2.5 px-2 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] border ${getEtapaBadge(cand.etapa_alcanzada)}`}>
                        {cand.etapa_alcanzada}
                      </span>
                    </td>

                    {/* Universidad y carrera */}
                    <td className="py-2.5 px-3 max-w-[200px]">
                      <span className="font-medium text-slate-800 truncate block text-xs" title={cand.university_normalized}>
                        {cand.university_normalized}
                      </span>
                      <span className="text-[10px] text-slate-500 truncate block" title={cand.career}>
                        {cand.career}
                      </span>
                    </td>

                    {/* Asistencia */}
                    <td className="py-2.5 px-2 text-center">
                      {cand.asistio ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-[#2E9E82]" />
                          Asistió
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          <XCircle className="w-3 h-3 text-rose-600" />
                          No asistió
                        </span>
                      )}
                    </td>

                    {/* Opinión Entrevista */}
                    <td className="py-2.5 px-3 text-slate-600 text-[11px] max-w-[160px]">
                      <span className="truncate block" title={cand.opinion_entrevista || 'Sin registrar'}>
                        {cand.opinion_entrevista || 'Sin registrar'}
                      </span>
                    </td>

                    {/* Opinión Lab */}
                    <td className="py-2.5 px-3 max-w-[180px]">
                      {cand.opinion_evaluador_lab ? (
                        <span
                          className={`font-semibold text-[11px] truncate block ${
                            isAceptadoLab
                              ? 'text-emerald-800 font-bold'
                              : isRechazadoLab
                              ? 'text-rose-700'
                              : 'text-slate-700'
                          }`}
                          title={cand.opinion_evaluador_lab}
                        >
                          {cand.opinion_evaluador_lab}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px] italic">
                          {cand.asistio ? 'En evaluación' : 'No aplica'}
                        </span>
                      )}
                    </td>

                    {/* Modelo Lab */}
                    <td className="py-2.5 px-2 text-center">
                      {cand.recomendacion_modelo ? (
                        <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {cand.recomendacion_modelo}
                        </span>
                      ) : (
                        <span className="text-slate-300 text-[10px]">—</span>
                      )}
                    </td>

                    {/* Fecha Lab */}
                    <td className="py-2.5 px-2 text-center font-mono text-slate-500 text-[11px]">
                      {cand.fecha_lab || '—'}
                    </td>

                    {/* Acción */}
                    <td className="py-2.5 px-3 text-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCandidate(cand);
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-800 hover:text-slate-950 bg-slate-100 hover:bg-amber-100 px-2.5 py-1 rounded-md border border-slate-200 hover:border-amber-300 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3 h-3 text-slate-700" />
                        <span>Ver Ficha</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Paginador */}
      <div className="p-3 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
        <div>
          Página <strong className="font-mono text-slate-900 font-bold">{currentPage}</strong> de <span className="font-mono">{totalPages}</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="p-1 rounded border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 text-slate-600" />
          </button>
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="p-1 rounded border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

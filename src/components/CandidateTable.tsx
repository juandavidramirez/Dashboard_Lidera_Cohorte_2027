import React, { useState, useMemo } from 'react';
import { Candidate } from '../types';
import { isCandidateEligible, getCandidateRoute } from '../lib/metricsCalculator';
import {
  Search,
  Filter,
  Download,
  CheckSquare,
  XSquare,
  ChevronLeft,
  ChevronRight,
  Eye,
  Sparkles,
  SlidersHorizontal,
  GraduationCap,
  AlertCircle,
  UserCheck
} from 'lucide-react';

interface Props {
  candidates: Candidate[];
  onUpdateCandidate: (id: string, updates: Partial<Candidate>) => void;
  onDeleteCandidate?: (id: string) => void;
  onBatchAction: (ids: string[], action: 'set_eligible' | 'set_not_eligible' | 'flag_hpc') => void;
  onSelectCandidate: (candidate: Candidate) => void;
}

export const CandidateTable: React.FC<Props> = ({
  candidates,
  onBatchAction,
  onSelectCandidate
}) => {
  // Extended Filters State (Univ, Career, HPC replacing Department)
  const [filters, setFilters] = useState({
    search: '',
    eligibility: 'ALL',
    route: 'ALL',
    channel: 'ALL',
    university: 'ALL',
    career: 'ALL',
    hpc: 'ALL'
  });

  // Sorting & Pagination
  const [sortField, setSortField] = useState<keyof Candidate>('registrationDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Row selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Column visibility
  const [visibleColumns, setVisibleColumns] = useState({
    candidate: true,
    university: true,
    route: true,
    hpc: true,
    channel: true,
    gpa: true,
    eligibility: true,
    reason: true,
    date: true,
    actions: true
  });

  const [showColumnDropdown, setShowColumnDropdown] = useState(false);

  // Derive unique lists for dropdowns
  const uniqueUniversities = useMemo(() => {
    const set = new Set<string>();
    candidates.forEach((c) => {
      const u = c.universityNormalized || c.universityRaw;
      if (u) set.add(u);
    });
    return Array.from(set).sort();
  }, [candidates]);

  const uniqueCareers = useMemo(() => {
    const set = new Set<string>();
    candidates.forEach((c) => {
      if (c.career) set.add(c.career);
    });
    return Array.from(set).sort();
  }, [candidates]);

  // Filtered & Sorted candidates computation
  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      // Search
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matches =
          c.fullName.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          (c.universityNormalized || '').toLowerCase().includes(q) ||
          (c.universityRaw || '').toLowerCase().includes(q) ||
          (c.career || '').toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Eligibility using isCandidateEligible helper
      const isElig = isCandidateEligible(c);
      if (filters.eligibility === 'Elegible' && !isElig) return false;
      if (filters.eligibility === 'No Elegible' && isElig) return false;

      // Route
      if (filters.route !== 'ALL') {
        const candRoute = getCandidateRoute(c);
        if (filters.route === 'STEM' && candRoute !== 'STEM') return false;
        if (filters.route === 'Bilingüe' && candRoute !== 'Bilingüe') return false;
        if ((filters.route === 'STEM y Bilingüe' || filters.route === 'Bilingüe y STEM') && candRoute !== 'STEM y Bilingüe') return false;
        if (filters.route === 'General / No Priorizado' && candRoute !== 'General / No Priorizado') return false;
      }

      // Channel
      if (filters.channel !== 'ALL' && c.channel !== filters.channel) {
        return false;
      }

      // University
      if (filters.university !== 'ALL') {
        const u = c.universityNormalized || c.universityRaw;
        if (u !== filters.university) return false;
      }

      // Career
      if (filters.career !== 'ALL' && c.career !== filters.career) {
        return false;
      }

      // HPC Filter
      if (filters.hpc !== 'ALL') {
        const isHpc = (c.hpc || '').toLowerCase() === 'si' || c.channel === 'Cultivación de HPC' || (c as any).isHpc === true;
        if (filters.hpc === 'SI' && !isHpc) return false;
        if (filters.hpc === 'NO' && isHpc) return false;
      }

      return true;
    });
  }, [candidates, filters]);

  const sortedCandidates = useMemo(() => {
    return [...filteredCandidates].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (typeof valA === 'string') valA = (valA as string).toLowerCase();
      if (typeof valB === 'string') valB = (valB as string).toLowerCase();

      if (valA! < valB!) return sortOrder === 'asc' ? -1 : 1;
      if (valA! > valB!) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredCandidates, sortField, sortOrder]);

  // Pagination calculation
  const totalPages = Math.ceil(sortedCandidates.length / pageSize) || 1;
  const paginatedCandidates = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedCandidates.slice(start, start + pageSize);
  }, [sortedCandidates, currentPage, pageSize]);

  // Selection handlers
  const handleSelectAllOnPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const pageIds = paginatedCandidates.map((c) => c.id);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    } else {
      const pageIds = paginatedCandidates.map((c) => c.id);
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Export CSV
  const exportToCSV = () => {
    const dataToExport = selectedIds.length > 0
      ? candidates.filter((c) => selectedIds.includes(c.id))
      : filteredCandidates;

    const headers = [
      'ID',
      'Nombre',
      'Correo',
      'Telefono',
      'Universidad',
      'Carrera',
      'GPA',
      'Ingles',
      'Ruta',
      'HPC',
      'Elegibilidad',
      'Motivo',
      'Canal',
      'Fecha'
    ];

    const rows = dataToExport.map((c) => [
      c.id,
      `"${c.fullName.replace(/"/g, '""')}"`,
      c.email,
      c.phone,
      `"${(c.universityNormalized || c.universityRaw).replace(/"/g, '""')}"`,
      `"${(c.career || '').replace(/"/g, '""')}"`,
      c.gpa,
      c.englishLevel,
      c.route,
      c.hpc || 'No',
      isCandidateEligible(c) ? 'Elegible' : 'No Elegible',
      `"${(c.ineligibilityReason || '').replace(/"/g, '""')}"`,
      c.channel,
      c.registrationDate
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Postulantes_Convocatoria_Lidera_2027.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const departments = Array.from(new Set(candidates.map((c) => c.department))).sort();

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden mb-8">
      {/* Table Section Header */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#2E9E82]" />
            Registros del Formulario de Convocatoria LIDERA (Cohorte 2027)
          </h2>
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-extrabold bg-[#152238] text-white shadow-2xs border border-slate-700">
              Mostrando {filteredCandidates.length} de {candidates.length} candidatos registrados
            </span>
            {filteredCandidates.length < candidates.length && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                Filtro activo ({candidates.length - filteredCandidates.length} ocultos)
              </span>
            )}
          </div>
        </div>

        {/* Global actions & Column toggle */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={exportToCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            Exportar CSV
          </button>

          <div className="relative">
            <button
              onClick={() => setShowColumnDropdown(!showColumnDropdown)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 shadow-2xs transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
              Columnas
            </button>

            {showColumnDropdown && (
              <div className="absolute right-0 mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-30 p-2 text-xs space-y-1">
                <div className="font-bold text-slate-700 mb-1 border-b border-slate-100 pb-1">
                  Visibilidad Columnas
                </div>
                {Object.keys(visibleColumns).map((col) => (
                  <label
                    key={col}
                    className="flex items-center gap-2 px-1 py-1 hover:bg-slate-50 rounded cursor-pointer capitalize text-slate-700"
                  >
                    <input
                      type="checkbox"
                      checked={visibleColumns[col as keyof typeof visibleColumns]}
                      onChange={(e) =>
                        setVisibleColumns((prev) => ({
                          ...prev,
                          [col]: e.target.checked
                        }))
                      }
                      className="rounded border-slate-300 text-[#2E9E82] focus:ring-[#2E9E82]"
                    />
                    {col}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 border-b border-slate-200 bg-white space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Search Field */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, correo, universidad, carrera..."
              value={filters.search}
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, search: e.target.value }));
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E9E82] focus:border-transparent"
            />
          </div>

          {/* Eligibility Filter */}
          <div>
            <select
              value={filters.eligibility}
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, eligibility: e.target.value }));
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E9E82] text-slate-700 font-medium"
            >
              <option value="ALL">Elegibilidad: Todas</option>
              <option value="Elegible">Elegible (Apto)</option>
              <option value="No Elegible">No Elegible</option>
            </select>
          </div>

          {/* Route Filter */}
          <div>
            <select
              value={filters.route}
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, route: e.target.value }));
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E9E82] text-slate-700 font-medium"
            >
              <option value="ALL">Ruta: Todas las Rutas</option>
              <option value="STEM">Ruta STEM</option>
              <option value="Bilingüe">Ruta Bilingüe</option>
              <option value="STEM y Bilingüe">Ruta Bilingüe y STEM</option>
              <option value="General / No Priorizado">General / No Priorizado</option>
            </select>
          </div>

          {/* University Filter */}
          <div>
            <select
              value={filters.university}
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, university: e.target.value }));
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E9E82] text-slate-700 font-medium"
            >
              <option value="ALL">Universidad: Todas</option>
              {uniqueUniversities.map((uni) => (
                <option key={uni} value={uni}>
                  {uni.length > 25 ? uni.substring(0, 23) + '...' : uni}
                </option>
              ))}
            </select>
          </div>

          {/* HPC Filter */}
          <div>
            <select
              value={filters.hpc}
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, hpc: e.target.value }));
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E9E82] text-slate-700 font-medium"
            >
              <option value="ALL">HPC: Todos</option>
              <option value="SI">Es HPC (Sí)</option>
              <option value="NO">No es HPC</option>
            </select>
          </div>
        </div>

        {/* Clear Filters Chip list if active */}
        {(filters.search ||
          filters.eligibility !== 'ALL' ||
          filters.route !== 'ALL' ||
          filters.channel !== 'ALL' ||
          filters.university !== 'ALL' ||
          filters.hpc !== 'ALL') && (
          <div className="flex items-center gap-2 text-xs pt-1 border-t border-slate-100">
            <span className="font-semibold text-slate-500">Filtros activos:</span>
            <button
              onClick={() => {
                setFilters({
                  search: '',
                  eligibility: 'ALL',
                  route: 'ALL',
                  channel: 'ALL',
                  university: 'ALL',
                  career: 'ALL',
                  hpc: 'ALL'
                });
                setCurrentPage(1);
              }}
              className="text-[#2E9E82] hover:underline font-bold"
            >
              Limpiar todos
            </button>
          </div>
        )}
      </div>

      {/* Contextual Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="bg-[#152238] text-white p-3 px-4 flex items-center justify-between animate-fadeIn transition-all">
          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="bg-white/20 px-2.5 py-0.5 rounded text-white font-mono">
              {selectedIds.length} candidatos seleccionados
            </span>
            <span>Acciones disponibles:</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportToCSV}
              className="bg-[#2E9E82] hover:bg-[#2E9E82]/90 text-white text-xs font-bold px-3 py-1.5 rounded shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Exportar Selección (CSV)
            </button>
          </div>
        </div>
      )}

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <th className="p-3 w-8">
                <input
                  type="checkbox"
                  onChange={handleSelectAllOnPage}
                  checked={
                    paginatedCandidates.length > 0 &&
                    paginatedCandidates.every((c) => selectedIds.includes(c.id))
                  }
                  className="rounded border-slate-300 text-[#2E9E82] focus:ring-[#2E9E82]"
                />
              </th>

              {visibleColumns.candidate && (
                <th
                  onClick={() => {
                    setSortField('fullName');
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  }}
                  className="p-3 cursor-pointer hover:bg-slate-200/70"
                >
                  Candidato / Correo
                </th>
              )}

              {visibleColumns.university && (
                <th
                  onClick={() => {
                    setSortField('universityNormalized');
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  }}
                  className="p-3 cursor-pointer hover:bg-slate-200/70"
                >
                  Universidad & Carrera
                </th>
              )}

              {visibleColumns.route && <th className="p-3">Ruta Priorizada</th>}
              {visibleColumns.hpc && <th className="p-3 text-center">HPC</th>}
              {visibleColumns.channel && <th className="p-3">Canal</th>}

              {visibleColumns.gpa && (
                <th
                  onClick={() => {
                    setSortField('gpa');
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  }}
                  className="p-3 cursor-pointer hover:bg-slate-200/70 text-center"
                >
                  GPA
                </th>
              )}

              {visibleColumns.eligibility && <th className="p-3 text-center">Estado Elegibilidad</th>}
              {visibleColumns.reason && <th className="p-3">Motivo Inelegibilidad</th>}

              {visibleColumns.date && (
                <th
                  onClick={() => {
                    setSortField('registrationDate');
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  }}
                  className="p-3 cursor-pointer hover:bg-slate-200/70"
                >
                  Fecha Reg.
                </th>
              )}

              {visibleColumns.actions && <th className="p-3 text-right">Acciones</th>}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
            {paginatedCandidates.length === 0 ? (
              <tr>
                <td colSpan={11} className="p-8 text-center text-slate-500 bg-slate-50">
                  <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="font-bold text-slate-700">No se encontraron postulantes con los filtros seleccionados</p>
                  <p className="text-xs text-slate-400 mt-1">Prueba borrando los criterios de búsqueda</p>
                </td>
              </tr>
            ) : (
              paginatedCandidates.map((cand) => {
                const isSelected = selectedIds.includes(cand.id);
                const isEligible = isCandidateEligible(cand);
                const isHpc = (cand.hpc || '').toLowerCase() === 'si' || cand.channel === 'Cultivación de HPC';

                return (
                  <tr
                    key={cand.id}
                    className={`hover:bg-slate-50 transition-colors ${
                      isSelected ? 'bg-amber-50/50' : ''
                    }`}
                  >
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelectOne(cand.id)}
                        className="rounded border-slate-300 text-[#2E9E82] focus:ring-[#2E9E82]"
                      />
                    </td>

                    {visibleColumns.candidate && (
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{cand.fullName}</div>
                        <div className="text-[11px] text-slate-500">{cand.email}</div>
                        <div className="text-[10px] text-slate-400">{cand.phone}</div>
                      </td>
                    )}

                    {visibleColumns.university && (
                      <td className="p-3">
                        <div className="font-semibold text-slate-800">{cand.universityNormalized || cand.universityRaw}</div>
                        <div className="text-[11px] text-slate-500">
                          {cand.career} ({cand.graduationYear})
                        </div>
                        {cand.universityRaw && cand.universityNormalized && cand.universityRaw !== cand.universityNormalized && (
                          <div className="text-[10px] text-amber-700 italic">
                            Ingresó como: "{cand.universityRaw}"
                          </div>
                        )}
                      </td>
                    )}

                    {visibleColumns.route && (
                      <td className="p-3">
                        {(() => {
                          const routeVal = getCandidateRoute(cand);
                          if (routeVal === 'STEM y Bilingüe') {
                            return (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                                Ruta Bilingüe y STEM
                              </span>
                            );
                          } else if (routeVal === 'STEM') {
                            return (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-[#152238]/10 text-[#152238]">
                                Ruta STEM
                              </span>
                            );
                          } else if (routeVal === 'Bilingüe') {
                            return (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-[#2E9E82]/15 text-[#2E9E82]">
                                Ruta Bilingüe ({cand.englishLevel || 'B2+'})
                              </span>
                            );
                          } else {
                            return (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600">
                                General
                              </span>
                            );
                          }
                        })()}
                      </td>
                    )}

                    {visibleColumns.hpc && (
                      <td className="p-3 text-center">
                        {isHpc ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-pink-100 text-pink-700 border border-pink-200">
                            HPC
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">-</span>
                        )}
                      </td>
                    )}

                    {visibleColumns.channel && (
                      <td className="p-3">
                        <span className="text-[11px] text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {cand.channel}
                        </span>
                      </td>
                    )}

                    {visibleColumns.gpa && (
                      <td className="p-3 text-center">
                        <span
                          className={`font-mono font-bold ${
                            cand.gpa >= 3.5 ? 'text-[#2E9E82]' : 'text-rose-600'
                          }`}
                        >
                          {cand.gpa.toFixed(1)}
                        </span>
                      </td>
                    )}

                    {visibleColumns.eligibility && (
                      <td className="p-3 text-center">
                        {isEligible ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#2E9E82] text-white">
                            Elegible
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#D9D9D9] text-slate-800">
                            No Elegible
                          </span>
                        )}
                      </td>
                    )}

                    {visibleColumns.reason && (
                      <td className="p-3">
                        <span className="text-[11px] text-slate-600">
                          {isEligible ? 'Ninguno (Es Elegible)' : (cand.ineligibilityReason || 'Requisitos mínimos')}
                        </span>
                      </td>
                    )}

                    {visibleColumns.date && (
                      <td className="p-3 font-mono text-[11px] text-slate-500">
                        {cand.registrationDate}
                      </td>
                    )}

                    {visibleColumns.actions && (
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onSelectCandidate(cand)}
                            title="Ver Detalle"
                            className="p-1.5 hover:bg-slate-200 rounded text-slate-600 hover:text-slate-900 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span>Filas por página:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-slate-300 rounded px-2 py-1 bg-white font-medium"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span className="text-slate-400">|</span>
          <span>
            Página {currentPage} de {totalPages}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded border border-slate-300 bg-white text-slate-700 disabled:opacity-40 hover:bg-slate-100"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded border border-slate-300 bg-white text-slate-700 disabled:opacity-40 hover:bg-slate-100"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { Candidate, FilterState } from '../types';
import {
  Search,
  Filter,
  Download,
  CheckSquare,
  XSquare,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit2,
  Trash2,
  Sparkles,
  SlidersHorizontal,
  Mail,
  UserCheck,
  Building2,
  GraduationCap,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface Props {
  candidates: Candidate[];
  onUpdateCandidate: (id: string, updates: Partial<Candidate>) => void;
  onDeleteCandidate: (id: string) => void;
  onBatchAction: (ids: string[], action: 'set_eligible' | 'set_not_eligible' | 'flag_hpc') => void;
  onSelectCandidate: (candidate: Candidate) => void;
}

export const CandidateTable: React.FC<Props> = ({
  candidates,
  onUpdateCandidate,
  onDeleteCandidate,
  onBatchAction,
  onSelectCandidate
}) => {
  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    eligibility: 'ALL',
    route: 'ALL',
    channel: 'ALL',
    department: 'ALL',
    ineligibilityReason: 'ALL',
    dateRange: { start: '', end: '' }
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
    channel: true,
    gpa: true,
    eligibility: true,
    reason: true,
    date: true,
    actions: true
  });

  const [showColumnDropdown, setShowColumnDropdown] = useState(false);

  // Filtered & Sorted candidates computation
  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      // Search
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matches =
          c.fullName.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.universityNormalized.toLowerCase().includes(q) ||
          c.universityRaw.toLowerCase().includes(q) ||
          c.career.toLowerCase().includes(q) ||
          c.department.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Eligibility
      if (filters.eligibility !== 'ALL' && c.eligibility !== filters.eligibility) {
        return false;
      }

      // Route
      if (filters.route !== 'ALL' && c.route !== filters.route) {
        return false;
      }

      // Channel
      if (filters.channel !== 'ALL' && c.channel !== filters.channel) {
        return false;
      }

      // Department
      if (filters.department !== 'ALL' && c.department !== filters.department) {
        return false;
      }

      // Reason
      if (
        filters.ineligibilityReason !== 'ALL' &&
        c.ineligibilityReason !== filters.ineligibilityReason
      ) {
        return false;
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

  // Bulk actions
  const exportToCSV = () => {
    const toExport = candidates.filter((c) => selectedIds.includes(c.id));
    const items = toExport.length > 0 ? toExport : filteredCandidates;

    const headers = [
      'ID',
      'Nombre Completo',
      'Correo',
      'Teléfono',
      'Universidad Normalizada',
      'Carrera',
      'Año Graduación',
      'Promedio GPA',
      'Inglés B2+',
      'STEM',
      'Ruta',
      'Canal',
      'Elegibilidad',
      'Motivo Inelegibilidad',
      'Fecha Registro'
    ];

    const rows = items.map((c) => [
      c.id,
      `"${c.fullName}"`,
      `"${c.email}"`,
      `"${c.phone}"`,
      `"${c.universityNormalized}"`,
      `"${c.career}"`,
      c.graduationYear,
      c.gpa,
      c.isBilingual ? 'Sí' : 'No',
      c.isStem ? 'Sí' : 'No',
      `"${c.route}"`,
      `"${c.channel}"`,
      `"${c.eligibility}"`,
      `"${c.ineligibilityReason}"`,
      c.registrationDate
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Formulario_Interes_LIDERA_2027_${new Date().toISOString().substring(0, 10)}.csv`
    );
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
            Registros del Formulario de Interés (LIDERA Cohorte 2027)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Mostrando {filteredCandidates.length} de {candidates.length} postulantes pre-registrados
          </p>
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
              <option value="ALL">Ruta: Todas</option>
              <option value="STEM">Ruta STEM</option>
              <option value="Bilingüe">Ruta Bilingüe</option>
              <option value="General / No Priorizado">General / No Priorizado</option>
            </select>
          </div>

          {/* Channel Filter */}
          <div>
            <select
              value={filters.channel}
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, channel: e.target.value }));
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E9E82] text-slate-700 font-medium"
            >
              <option value="ALL">Canal: Todos</option>
              <option value="LIDERA en RRSS">LIDERA en RRSS</option>
              <option value="Gira LIDERA">Gira LIDERA</option>
              <option value="Refiere LIDERA">Refiere LIDERA</option>
              <option value="Cultivación de HPC">Cultivación de HPC</option>
            </select>
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={filters.department}
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, department: e.target.value }));
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E9E82] text-slate-700 font-medium"
            >
              <option value="ALL">Departamento: Todos</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Clear Filters Chip list if active */}
        {(filters.search ||
          filters.eligibility !== 'ALL' ||
          filters.route !== 'ALL' ||
          filters.channel !== 'ALL' ||
          filters.department !== 'ALL') && (
          <div className="flex items-center gap-2 text-xs pt-1 border-t border-slate-100">
            <span className="font-semibold text-slate-500">Filtros activos:</span>
            <button
              onClick={() => {
                setFilters({
                  search: '',
                  eligibility: 'ALL',
                  route: 'ALL',
                  channel: 'ALL',
                  department: 'ALL',
                  ineligibilityReason: 'ALL',
                  dateRange: { start: '', end: '' }
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
            <span className="bg-white/20 px-2 py-0.5 rounded text-white font-mono">
              {selectedIds.length} seleccionados
            </span>
            <span>Acciones masivas disponibles:</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onBatchAction(selectedIds, 'set_eligible')}
              className="bg-[#2E9E82] hover:bg-[#2E9E82]/90 text-white text-xs font-bold px-3 py-1 rounded shadow-xs transition-colors flex items-center gap-1"
            >
              <CheckSquare className="w-3.5 h-3.5" /> Marcar Elegibles
            </button>

            <button
              onClick={() => onBatchAction(selectedIds, 'set_not_eligible')}
              className="bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold px-3 py-1 rounded transition-colors flex items-center gap-1"
            >
              <XSquare className="w-3.5 h-3.5" /> Marcar No Elegibles
            </button>

            <button
              onClick={() => onBatchAction(selectedIds, 'flag_hpc')}
              className="bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" /> Mover a Cultivación HPC
            </button>

            <button
              onClick={exportToCSV}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white text-xs font-bold px-3 py-1 rounded transition-colors flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" /> Exportar Selección
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
                <td colSpan={10} className="p-8 text-center text-slate-500 bg-slate-50">
                  <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="font-bold text-slate-700">No se encontraron postulantes con los filtros seleccionados</p>
                  <p className="text-xs text-slate-400 mt-1">Prueba borrando los criterios de búsqueda</p>
                </td>
              </tr>
            ) : (
              paginatedCandidates.map((cand) => {
                const isSelected = selectedIds.includes(cand.id);

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
                        <div className="text-[10px] text-slate-400">{cand.phone} • {cand.department}</div>
                      </td>
                    )}

                    {visibleColumns.university && (
                      <td className="p-3">
                        <div className="font-semibold text-slate-800">{cand.universityNormalized}</div>
                        <div className="text-[11px] text-slate-500">
                          {cand.career} ({cand.graduationYear})
                        </div>
                        {cand.universityRaw !== cand.universityNormalized && (
                          <div className="text-[10px] text-amber-700 italic">
                            Ingresó como: "{cand.universityRaw}"
                          </div>
                        )}
                      </td>
                    )}

                    {visibleColumns.route && (
                      <td className="p-3">
                        {cand.route === 'STEM' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-[#152238]/10 text-[#152238]">
                            Ruta STEM
                          </span>
                        )}
                        {cand.route === 'Bilingüe' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-[#2E9E82]/15 text-[#2E9E82]">
                            Ruta Bilingüe ({cand.englishLevel})
                          </span>
                        )}
                        {cand.route === 'General / No Priorizado' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600">
                            General
                          </span>
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
                        {cand.eligibility === 'Elegible' ? (
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
                          {cand.ineligibilityReason}
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
                            title="Ver / Editar Detalle"
                            className="p-1.5 hover:bg-slate-200 rounded text-slate-600 hover:text-slate-900 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteCandidate(cand.id)}
                            title="Eliminar candidato"
                            className="p-1.5 hover:bg-rose-100 rounded text-slate-400 hover:text-rose-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
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

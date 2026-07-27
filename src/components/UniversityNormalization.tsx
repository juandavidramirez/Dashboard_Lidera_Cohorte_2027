import React, { useState } from 'react';
import { UniversityMapping } from '../types';
import { Building2, Plus, Search, CheckCircle2, ListFilter, MapPin } from 'lucide-react';

interface Props {
  universities: UniversityMapping[];
  onAddVariant: (uniId: string, variant: string) => void;
}

export const UniversityNormalization: React.FC<Props> = ({ universities, onAddVariant }) => {
  const [search, setSearch] = useState('');
  const [selectedUniId, setSelectedUniId] = useState<string | null>(null);
  const [newVariantText, setNewVariantText] = useState('');

  const filteredUnis = universities.filter(
    (u) =>
      u.normalizedName.toLowerCase().includes(search.toLowerCase()) ||
      u.region.toLowerCase().includes(search.toLowerCase()) ||
      u.rawVariants.some((v) => v.toLowerCase().includes(search.toLowerCase()))
  );

  const handleAddVariantSubmit = (e: React.FormEvent, uniId: string) => {
    e.preventDefault();
    if (!newVariantText.trim()) return;
    onAddVariant(uniId, newVariantText.trim());
    setNewVariantText('');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden mb-8">
      {/* Title Bar in Amber */}
      <div className="bg-[#F2A900] px-4 py-2 text-slate-900 font-bold text-xs uppercase tracking-wider flex items-center justify-between">
        <span>NORMALIZACIÓN DE UNIVERSIDADES (TABLA MAESTRA 2027)</span>
        <span className="text-[11px] font-semibold bg-amber-600/20 px-2 py-0.5 rounded">
          {universities.length} Universidades Priorizadas
        </span>
      </div>

      <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#152238]" />
            Mapeo de Variantes de Nombre (~274 variantes unificadas)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Mantiene la limpieza de la fuente viva de Google Sheets sin alterar el registro original del postulante
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar universidad o variante..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2E9E82]"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <th className="p-3">Nombre Oficial Normalizado</th>
              <th className="p-3">Categoría & Región</th>
              <th className="p-3">Variantes de Nombre Registradas (Google Sheets)</th>
              <th className="p-3 text-center">Postulantes</th>
              <th className="p-3 text-center">Elegibles</th>
              <th className="p-3 text-right">Añadir Variante</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
            {filteredUnis.map((uni) => (
              <tr key={uni.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-3 font-bold text-slate-900">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#2E9E82] shrink-0" />
                    <span>{uni.normalizedName}</span>
                  </div>
                </td>

                <td className="p-3">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-slate-200 text-slate-700">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    {uni.region}
                  </span>
                </td>

                <td className="p-3 max-w-xs">
                  <div className="flex flex-wrap gap-1">
                    {uni.rawVariants.map((v, i) => (
                      <span
                        key={i}
                        className="bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded text-[10px]"
                      >
                        "{v}"
                      </span>
                    ))}
                  </div>
                </td>

                <td className="p-3 text-center font-bold font-mono text-slate-800">
                  {uni.totalCandidates}
                </td>

                <td className="p-3 text-center font-bold font-mono text-[#2E9E82]">
                  {uni.eligibleCandidates}
                </td>

                <td className="p-3 text-right">
                  <form
                    onSubmit={(e) => handleAddVariantSubmit(e, uni.id)}
                    className="flex items-center justify-end gap-1"
                  >
                    <input
                      type="text"
                      placeholder="Nueva variante..."
                      value={selectedUniId === uni.id ? newVariantText : ''}
                      onFocus={() => setSelectedUniId(uni.id)}
                      onChange={(e) => {
                        setSelectedUniId(uni.id);
                        setNewVariantText(e.target.value);
                      }}
                      className="w-28 px-2 py-1 text-[11px] border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2E9E82]"
                    />
                    <button
                      type="submit"
                      className="bg-[#2E9E82] hover:bg-[#2E9E82]/90 text-white p-1 rounded transition-colors"
                      title="Agregar variante"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

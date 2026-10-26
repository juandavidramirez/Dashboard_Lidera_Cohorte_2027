import React, { useMemo } from 'react';
import { LabRecord } from '../../types';
import {
  GraduationCap,
  Sparkles,
  Calendar,
  Users,
  MapPin
} from 'lucide-react';

interface Props {
  records: LabRecord[];
  totalAceptadosBase: number;
  hasActiveFilters: boolean;
  filterLabel?: string;
}

export const CardsComposicionSeleccionadosLab: React.FC<Props> = ({
  records,
  totalAceptadosBase,
  hasActiveFilters,
  filterLabel
}) => {
  const total = records.length;

  const {
    pregradoItems,
    enfoqueItems,
    edadesItems,
    generoItems,
    cityItems,
    focoCitiesCount,
    focoCitiesPct
  } = useMemo(() => {
    // 1. Pregrado
    let profesional = 0;
    let licenciatura = 0;
    records.forEach(r => {
      const tp = String(r.tipo_pregrado || '').toLowerCase();
      if (tp.includes('licenciatura')) licenciatura++;
      else profesional++;
    });

    const pregrado = [
      {
        label: 'Profesional',
        count: profesional,
        pct: total > 0 ? Math.round((profesional / total) * 1000) / 10 : 0,
        color: '#152238'
      },
      {
        label: 'Licenciatura',
        count: licenciatura,
        pct: total > 0 ? Math.round((licenciatura / total) * 1000) / 10 : 0,
        color: '#2E9E82'
      }
    ];

    // 2. Enfoque
    let enfStemBil = 0;
    let enfStem = 0;
    let enfBil = 0;
    let enfNoNo = 0;
    records.forEach(r => {
      if (r.is_stem && r.is_bilingual) enfStemBil++;
      else if (r.is_stem) enfStem++;
      else if (r.is_bilingual) enfBil++;
      else enfNoNo++;
    });

    const enfoque = [
      {
        label: 'Bilingüe',
        count: enfBil,
        pct: total > 0 ? Math.round((enfBil / total) * 1000) / 10 : 0,
        color: '#2E9E82'
      },
      {
        label: 'STEM',
        count: enfStem,
        pct: total > 0 ? Math.round((enfStem / total) * 1000) / 10 : 0,
        color: '#F2A900'
      },
      {
        label: 'STEM y Bilingüe',
        count: enfStemBil,
        pct: total > 0 ? Math.round((enfStemBil / total) * 1000) / 10 : 0,
        color: '#152238'
      },
      {
        label: 'No STEM no Bilingüe',
        count: enfNoNo,
        pct: total > 0 ? Math.round((enfNoNo / total) * 1000) / 10 : 0,
        color: '#94A3B8'
      }
    ];

    // 3. Rangos de Edad (Menos de 24, 25 - 26, 27-28, Más de 29)
    let menos24 = 0;
    let de25a26 = 0;
    let de27a28 = 0;
    let mas29 = 0;
    records.forEach(r => {
      const edad = typeof r.edad === 'number' ? r.edad : Number(r.edad);
      if (!isNaN(edad) && edad > 0) {
        if (edad <= 24) menos24++;
        else if (edad <= 26) de25a26++;
        else if (edad <= 28) de27a28++;
        else mas29++;
      } else {
        de25a26++;
      }
    });

    const edades = [
      {
        label: 'Menos de 24',
        count: menos24,
        pct: total > 0 ? Math.round((menos24 / total) * 1000) / 10 : 0,
        color: '#64748B'
      },
      {
        label: '25 - 26',
        count: de25a26,
        pct: total > 0 ? Math.round((de25a26 / total) * 1000) / 10 : 0,
        color: '#0D9488'
      },
      {
        label: '27-28',
        count: de27a28,
        pct: total > 0 ? Math.round((de27a28 / total) * 1000) / 10 : 0,
        color: '#F59E0B'
      },
      {
        label: 'Más de 29',
        count: mas29,
        pct: total > 0 ? Math.round((mas29 / total) * 1000) / 10 : 0,
        color: '#152238'
      }
    ];

    // 4. Género
    let fem = 0;
    let masc = 0;
    records.forEach(r => {
      const g = String(r.genero || '').toLowerCase();
      if (g.includes('femenino') || g === 'mujer') fem++;
      else masc++;
    });

    const genero = [
      {
        label: 'Femenino',
        count: fem,
        pct: total > 0 ? Math.round((fem / total) * 1000) / 10 : 0,
        color: '#2E9E82'
      },
      {
        label: 'Masculino',
        count: masc,
        pct: total > 0 ? Math.round((masc / total) * 1000) / 10 : 0,
        color: '#152238'
      }
    ];

    // 5. Ciudades
    const cityMap = new Map<string, number>();
    records.forEach(r => {
      const c = r.ciudad || 'Otras';
      cityMap.set(c, (cityMap.get(c) || 0) + 1);
    });

    const sortedCities = Array.from(cityMap.entries()).sort((a, b) => b[1] - a[1]);
    const maxCityCount = sortedCities.length > 0 ? sortedCities[0][1] : 1;
    const topCities = sortedCities.slice(0, 6);
    const remaining = sortedCities.slice(6);

    const cityItemsList = topCities.map(([name, count], idx) => ({
      rank: idx + 1,
      label: name,
      count,
      pct: total > 0 ? Math.round((count / total) * 1000) / 10 : 0,
      magnitudePct: Math.round((count / maxCityCount) * 100),
      isFoco: name === 'Cali' || name === 'Barranquilla' || name === 'Medellín'
    }));

    const remCount = remaining.reduce((a, b) => a + b[1], 0);
    if (remCount > 0) {
      cityItemsList.push({
        rank: topCities.length + 1,
        label: `Otras (${remaining.length})`,
        count: remCount,
        pct: total > 0 ? Math.round((remCount / total) * 1000) / 10 : 0,
        magnitudePct: Math.round((remCount / maxCityCount) * 100),
        isFoco: false
      });
    }

    const fCount = cityItemsList
      .filter(c => c.isFoco)
      .reduce((a, b) => a + b.count, 0);
    const fPct = total > 0 ? Math.round((fCount / total) * 1000) / 10 : 0;

    return {
      pregradoItems: pregrado,
      enfoqueItems: enfoque,
      edadesItems: edades,
      generoItems: genero,
      cityItems: cityItemsList,
      focoCitiesCount: fCount,
      focoCitiesPct: fPct
    };
  }, [records, total]);

  return (
    <div className="space-y-4">
      {/* Grid de los 4 desgloses demográficos y académicos (Fila 2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Profesionales vs. Licenciados */}
        <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs flex flex-col justify-between">
          <div className="bg-[#F2A900] px-3.5 py-2 flex items-center justify-between border-b border-amber-300">
            <div className="flex items-center gap-2 text-slate-950">
              <GraduationCap className="w-4 h-4 text-slate-950" />
              <h4 className="text-xs font-black uppercase tracking-wider">
                Pregrado
              </h4>
            </div>
          </div>

          <div className="p-3.5 space-y-3 flex-1 flex flex-col justify-center">
            {pregradoItems.map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">{item.label}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-slate-900 text-xs">
                      {item.count}
                    </span>
                    <span className="font-mono text-slate-400 text-[11px]">
                      ({item.pct}%)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(item.pct, item.count > 0 ? 3 : 0)}%`,
                      backgroundColor: item.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. STEM / Enfoque (4 categorías) */}
        <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs flex flex-col justify-between">
          <div className="bg-[#F2A900] px-3.5 py-2 flex items-center justify-between border-b border-amber-300">
            <div className="flex items-center gap-2 text-slate-950">
              <Sparkles className="w-4 h-4 text-slate-950" />
              <h4 className="text-xs font-black uppercase tracking-wider">
                Enfoque / STEM
              </h4>
            </div>
          </div>

          <div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-center">
            {enfoqueItems.map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 truncate max-w-[130px]" title={item.label}>
                    {item.label}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-slate-900 text-xs">
                      {item.count}
                    </span>
                    <span className="font-mono text-slate-400 text-[11px]">
                      ({item.pct}%)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(item.pct, item.count > 0 ? 3 : 0)}%`,
                      backgroundColor: item.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Rangos de Edad */}
        <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs flex flex-col justify-between">
          <div className="bg-[#F2A900] px-3.5 py-2 flex items-center justify-between border-b border-amber-300">
            <div className="flex items-center gap-2 text-slate-950">
              <Calendar className="w-4 h-4 text-slate-950" />
              <h4 className="text-xs font-black uppercase tracking-wider">
                Rangos de Edad
              </h4>
            </div>
          </div>

          <div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-center">
            {edadesItems.map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">{item.label}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-slate-900 text-xs">
                      {item.count}
                    </span>
                    <span className="font-mono text-slate-400 text-[11px]">
                      ({item.pct}%)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(item.pct, item.count > 0 ? 2 : 0)}%`,
                      backgroundColor: item.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Género */}
        <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs flex flex-col justify-between">
          <div className="bg-[#F2A900] px-3.5 py-2 flex items-center justify-between border-b border-amber-300">
            <div className="flex items-center gap-2 text-slate-950">
              <Users className="w-4 h-4 text-slate-950" />
              <h4 className="text-xs font-black uppercase tracking-wider">
                Género
              </h4>
            </div>
          </div>

          <div className="p-3.5 space-y-3 flex-1 flex flex-col justify-center">
            {generoItems.map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">{item.label}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-slate-900 text-xs">
                      {item.count}
                    </span>
                    <span className="font-mono text-slate-400 text-[11px]">
                      ({item.pct}%)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(item.pct, item.count > 0 ? 3 : 0)}%`,
                      backgroundColor: item.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Gráfico de Ciudad — Leaderboard Ranking con Barras de Magnitud (Fila 3) */}
      <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs">
        <div className="bg-[#F2A900] px-4 py-2.5 flex items-center justify-between border-b border-amber-300 flex-wrap gap-2">
          <div className="flex items-center gap-2 text-slate-950">
            <MapPin className="w-4 h-4 text-slate-950" />
            <h4 className="text-xs font-black uppercase tracking-wider">
              Ciudad de Nacimiento — Ranking Territorial
            </h4>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {hasActiveFilters && (
              <span className="text-[10px] font-bold text-amber-950 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded shadow-2xs font-mono">
                {total} de {totalAceptadosBase} seleccionados con filtro activo
              </span>
            )}
            <span className="text-[10px] font-bold text-slate-900 bg-white/80 border border-amber-400 px-2 py-0.5 rounded shadow-2xs">
              Foco Territorial: Cali · Barranquilla · Medellín ({focoCitiesCount} · {focoCitiesPct}%)
            </span>
          </div>
        </div>

        <div className="p-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] uppercase font-bold text-slate-400">
                <th className="py-2 px-2.5 w-10">#</th>
                <th className="py-2 px-3">Ciudad</th>
                <th className="py-2 px-3 w-48 sm:w-72">Magnitud relativa</th>
                <th className="py-2 px-3 text-right">Aceptados</th>
                <th className="py-2 px-3 text-right">%</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cityItems.map((c) => (
                <tr
                  key={c.label}
                  className={`transition-colors ${
                    c.isFoco ? 'bg-amber-50/60 font-semibold' : 'hover:bg-slate-50/80'
                  }`}
                >
                  <td className="py-2 px-2.5 text-slate-400 font-mono text-[11px]">
                    {c.rank}
                  </td>
                  <td className="py-2 px-3 text-slate-800">
                    <div className="flex items-center gap-1.5">
                      <span>{c.label}</span>
                      {c.isFoco && (
                        <span className="text-[9px] font-bold bg-[#F2A900] text-slate-950 border border-amber-400 px-1.5 py-0.2 rounded">
                          Foco
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-2 px-3">
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          c.isFoco ? 'bg-[#F2A900]' : 'bg-[#152238]'
                        }`}
                        style={{ width: `${Math.max(c.magnitudePct, 2)}%` }}
                        title={`Magnitud: ${c.count} vs líder`}
                      />
                    </div>
                  </td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                    {c.count}
                  </td>
                  <td className="py-2 px-3 text-right font-mono text-slate-500">
                    {c.pct}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

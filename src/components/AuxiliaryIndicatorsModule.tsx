import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { Candidate } from '../types';
import {
  WEEK_DEFINITIONS,
  getCandidateWeekKey,
  isCandidateEligible
} from '../lib/metricsCalculator';
import {
  Share2,
  Compass,
  Users,
  HelpCircle,
  TrendingUp,
  Filter,
  CheckCircle2,
  Calendar,
  Layers,
  Award,
  Instagram,
  Facebook,
  Linkedin,
  Video,
  Search,
  School,
  UserCheck,
  Globe
} from 'lucide-react';

interface Props {
  candidates: Candidate[];
}

export type CandidateFilterType = 'all' | 'eligible_only';

export interface SourceSummary {
  sourceKey: string;
  name: string;
  category: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  totalCount: number;
  eligibleCount: number;
  notEligibleCount: number;
  sharePct: number;
  eligibilityRate: number;
  avgGpa: number;
  stemCount: number;
  stemPct: number;
  bilingualCount: number;
  bilingualPct: number;
}

// Canonical source definitions matching Salesforce/Data_Raw_Conv options
const KNOWN_SOURCES: Array<{
  key: string;
  name: string;
  matchPatterns: string[];
  category: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    key: 'instagram',
    name: 'Instagram',
    matchPatterns: ['instagram', 'insta'],
    category: 'Redes Sociales',
    color: '#E1306C',
    icon: Instagram
  },
  {
    key: 'facebook',
    name: 'Facebook',
    matchPatterns: ['facebook', 'face'],
    category: 'Redes Sociales',
    color: '#1877F2',
    icon: Facebook
  },
  {
    key: 'linkedin',
    name: 'LinkedIn',
    matchPatterns: ['linkedin'],
    category: 'Redes Sociales',
    color: '#0A66C2',
    icon: Linkedin
  },
  {
    key: 'tiktok',
    name: 'TikTok',
    matchPatterns: ['tiktok', 'tik tok'],
    category: 'Redes Sociales',
    color: '#000000',
    icon: Video
  },
  {
    key: 'universidad',
    name: 'Universidad u organización',
    matchPatterns: ['universidad u organizacion', 'charlas', 'ferias laborales', 'boletines', 'universidad'],
    category: 'Gira Institucional',
    color: '#2E9E82',
    icon: School
  },
  {
    key: 'recom_eco_alumni',
    name: 'Recomendación Eco / Alumni ExC',
    matchPatterns: ['persona eco', 'alumni', 'enseña por colombia'],
    category: 'Referidos ExC',
    color: '#152238',
    icon: UserCheck
  },
  {
    key: 'familiar_amigo',
    name: 'Familiar o amigo',
    matchPatterns: ['familiar o amigo', 'amigo que no ha participado', 'familiar'],
    category: 'Referidos Externos',
    color: '#6366F1',
    icon: Users
  },
  {
    key: 'buscador',
    name: 'Buscador de internet (Google, Bing)',
    matchPatterns: ['buscador', 'google', 'bing'],
    category: 'Búsqueda Orgánica',
    color: '#EA4335',
    icon: Search
  },
  {
    key: 'contenido_medios',
    name: 'Artículo, video o podcast',
    matchPatterns: ['articulo', 'video', 'podcast', 'youtube'],
    category: 'Medios & Prensa',
    color: '#F59E0B',
    icon: Globe
  },
  {
    key: 'otros',
    name: 'Otra fuente / No especificada',
    matchPatterns: [],
    category: 'Otros / Sin especificar',
    color: '#94A3B8',
    icon: HelpCircle
  }
];

export const AuxiliaryIndicatorsModule: React.FC<Props> = ({ candidates }) => {
  // -------------------------------------------------------------
  // STATES FOR CONTROLS & FILTERS
  // -------------------------------------------------------------
  // Filter 1: Table Candidate Filter ('all' vs 'eligible_only')
  const [tableFilterType, setTableFilterType] = useState<CandidateFilterType>('all');
  
  // Filter 2: Table Week Filter ('ALL' or 'Semana 0', 'Semana 1', etc.)
  const [selectedWeek, setSelectedWeek] = useState<string>('ALL');

  // Filter 3: Table Category Filter
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Filter 4: Line Chart Filter ('all' vs 'eligible_only')
  const [chartFilterType, setChartFilterType] = useState<CandidateFilterType>('all');

  // Filter 5: Chart View Mode ('weekly' vs 'cumulative')
  const [chartViewMode, setChartViewMode] = useState<'weekly' | 'cumulative'>('weekly');

  // Filter 6: Top N vs All in Chart (to prevent clutter if desired)
  const [chartSourceSelection, setChartSourceSelection] = useState<'top5' | 'all'>('top5');

  // -------------------------------------------------------------
  // HELPER: Normalize Source of Information (Fuente de Información)
  // -------------------------------------------------------------
  const getCandidateSourceKey = (c: Candidate): string => {
    const raw = (c.fuenteInformacion || c.channel || '').trim().toLowerCase();
    if (!raw) return 'otros';

    for (const src of KNOWN_SOURCES) {
      if (src.key === 'otros') continue;
      for (const pattern of src.matchPatterns) {
        if (raw.includes(pattern)) {
          return src.key;
        }
      }
    }
    return 'otros';
  };

  // -------------------------------------------------------------
  // 1. DATA COMPUTATION FOR THE TABLE
  // -------------------------------------------------------------
  const tableCandidates = useMemo(() => {
    return candidates.filter((c, idx) => {
      if (selectedWeek === 'ALL') return true;
      const wKey = getCandidateWeekKey(c, idx);
      return wKey === selectedWeek;
    });
  }, [candidates, selectedWeek]);

  const tableData = useMemo(() => {
    const statsMap: Record<string, {
      total: number;
      eligible: number;
      notEligible: number;
      gpaSum: number;
      gpaCount: number;
      stemCount: number;
      bilingualCount: number;
    }> = {};

    KNOWN_SOURCES.forEach((s) => {
      statsMap[s.key] = { total: 0, eligible: 0, notEligible: 0, gpaSum: 0, gpaCount: 0, stemCount: 0, bilingualCount: 0 };
    });

    tableCandidates.forEach((c) => {
      const srcKey = getCandidateSourceKey(c);
      const isElig = isCandidateEligible(c);
      const gpa = Number(c.gpa || 0);

      const target = statsMap[srcKey] || statsMap['otros'];
      target.total += 1;
      if (isElig) {
        target.eligible += 1;
      } else {
        target.notEligible += 1;
      }

      if (gpa > 0) {
        target.gpaSum += gpa;
        target.gpaCount += 1;
      }

      const isStem = c.isStem || String(c.stemClass || '').includes('STEM');
      if (isStem) target.stemCount += 1;

      const isBil = c.isBilingual || ['B2', 'C1', 'C2'].includes(c.englishLevel || '');
      if (isBil) target.bilingualCount += 1;
    });

    const totalInView = tableFilterType === 'eligible_only'
      ? Object.values(statsMap).reduce((acc, curr) => acc + curr.eligible, 0)
      : Object.values(statsMap).reduce((acc, curr) => acc + curr.total, 0);

    const allRows: SourceSummary[] = KNOWN_SOURCES.map((src) => {
      const raw = statsMap[src.key] || { total: 0, eligible: 0, notEligible: 0, gpaSum: 0, gpaCount: 0, stemCount: 0, bilingualCount: 0 };
      const displayedCount = tableFilterType === 'eligible_only' ? raw.eligible : raw.total;
      const sharePct = totalInView > 0 ? Math.round((displayedCount / totalInView) * 1000) / 10 : 0;
      const eligibilityRate = raw.total > 0 ? Math.round((raw.eligible / raw.total) * 1000) / 10 : 0;
      const avgGpa = raw.gpaCount > 0 ? Math.round((raw.gpaSum / raw.gpaCount) * 100) / 100 : 0;
      const stemPct = raw.total > 0 ? Math.round((raw.stemCount / raw.total) * 100) : 0;
      const bilingualPct = raw.total > 0 ? Math.round((raw.bilingualCount / raw.total) * 100) : 0;

      return {
        sourceKey: src.key,
        name: src.name,
        category: src.category,
        color: src.color,
        icon: src.icon,
        totalCount: raw.total,
        eligibleCount: raw.eligible,
        notEligibleCount: raw.notEligible,
        sharePct,
        eligibilityRate,
        avgGpa,
        stemCount: raw.stemCount,
        stemPct,
        bilingualCount: raw.bilingualCount,
        bilingualPct
      };
    });

    // Filter by Category if selected
    const filteredRows = allRows
      .filter((r) => {
        if (selectedCategory === 'ALL') return true;
        return r.category === selectedCategory;
      })
      // Sort by displayed count descending
      .sort((a, b) => {
        const countA = tableFilterType === 'eligible_only' ? a.eligibleCount : a.totalCount;
        const countB = tableFilterType === 'eligible_only' ? b.eligibleCount : b.totalCount;
        return countB - countA;
      });

    return {
      rows: filteredRows,
      allRows,
      totalInView,
      grandTotal: tableCandidates.length,
      grandEligible: tableCandidates.filter(isCandidateEligible).length,
      grandNotEligible: tableCandidates.filter(c => !isCandidateEligible(c)).length,
      overallEligibilityRate: tableCandidates.length > 0
        ? Math.round((tableCandidates.filter(isCandidateEligible).length / tableCandidates.length) * 1000) / 10
        : 0
    };
  }, [tableCandidates, tableFilterType, selectedCategory]);

  // Categories list for filter
  const categoriesList = useMemo(() => {
    const cats = Array.from(new Set(KNOWN_SOURCES.map(s => s.category)));
    return ['ALL', ...cats];
  }, []);

  // -------------------------------------------------------------
  // 2. DATA COMPUTATION FOR THE LINE CHART (Weekly Evolution by Source)
  // -------------------------------------------------------------
  // Top 5 sources overall by volume to feature prominently
  const top5Sources = useMemo(() => {
    return [...tableData.allRows]
      .filter(r => r.sourceKey !== 'otros')
      .sort((a, b) => b.totalCount - a.totalCount)
      .slice(0, 5)
      .map(r => r.sourceKey);
  }, [tableData.allRows]);

  const lineChartData = useMemo(() => {
    // 1. Initialize per-week buckets for each known source
    const weekMap = new Map<string, {
      weekKey: string;
      label: string;
      range: string;
      sources: Record<string, { total: number; eligible: number }>;
      weekTotal: number;
      weekEligible: number;
    }>();

    WEEK_DEFINITIONS.forEach((w) => {
      const srcObj: Record<string, { total: number; eligible: number }> = {};
      KNOWN_SOURCES.forEach((s) => {
        srcObj[s.key] = { total: 0, eligible: 0 };
      });

      weekMap.set(w.key, {
        weekKey: w.key,
        label: w.label,
        range: w.range,
        sources: srcObj,
        weekTotal: 0,
        weekEligible: 0
      });
    });

    candidates.forEach((c, idx) => {
      const wKey = getCandidateWeekKey(c, idx);
      const item = weekMap.get(wKey);
      if (!item) return;

      const srcKey = getCandidateSourceKey(c);
      const isElig = isCandidateEligible(c);

      item.weekTotal += 1;
      if (isElig) item.weekEligible += 1;

      if (item.sources[srcKey]) {
        item.sources[srcKey].total += 1;
        if (isElig) item.sources[srcKey].eligible += 1;
      } else if (item.sources['otros']) {
        item.sources['otros'].total += 1;
        if (isElig) item.sources['otros'].eligible += 1;
      }
    });

    // 2. Build cumulative/discrete series
    const runningSources: Record<string, number> = {};
    KNOWN_SOURCES.forEach((s) => {
      runningSources[s.key] = 0;
    });
    let runningTotal = 0;

    const dataPoints = WEEK_DEFINITIONS.map((w) => {
      const item = weekMap.get(w.key)!;
      const pointObj: Record<string, any> = {
        name: w.key,
        shortLabel: w.label,
        range: w.range
      };

      const valTotal = chartFilterType === 'eligible_only' ? item.weekEligible : item.weekTotal;
      if (chartViewMode === 'cumulative') {
        runningTotal += valTotal;
        pointObj['Total'] = runningTotal;
      } else {
        pointObj['Total'] = valTotal;
      }

      KNOWN_SOURCES.forEach((s) => {
        const count = chartFilterType === 'eligible_only'
          ? (item.sources[s.key]?.eligible || 0)
          : (item.sources[s.key]?.total || 0);

        if (chartViewMode === 'cumulative') {
          runningSources[s.key] += count;
          pointObj[s.name] = runningSources[s.key];
        } else {
          pointObj[s.name] = count;
        }
      });

      return pointObj;
    });

    return dataPoints;
  }, [candidates, chartFilterType, chartViewMode]);

  // Sources to display on chart lines
  const activeChartLines = useMemo(() => {
    if (chartSourceSelection === 'top5') {
      return KNOWN_SOURCES.filter(s => top5Sources.includes(s.key));
    }
    return KNOWN_SOURCES;
  }, [chartSourceSelection, top5Sources]);

  // Source with highest volume (excluding 'otros' for clear insight)
  const topSource = useMemo(() => {
    const valid = tableData.allRows.filter(r => r.sourceKey !== 'otros');
    if (!valid.length) return null;
    return [...valid].sort((a, b) => b.totalCount - a.totalCount)[0];
  }, [tableData.allRows]);

  // Source with highest conversion rate (minimum 15 postulantes)
  const highestConversionSource = useMemo(() => {
    const valid = tableData.allRows.filter(r => r.totalCount >= 15 && r.sourceKey !== 'otros');
    if (!valid.length) return null;
    return [...valid].sort((a, b) => b.eligibilityRate - a.eligibilityRate)[0];
  }, [tableData.allRows]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* -------------------------------------------------------------
          MODULE TITLE & CONTEXT HEADER
      ------------------------------------------------------------- */}
      <section className="bg-white border border-slate-200/90 rounded-2xl p-5 md:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="bg-[#152238] text-white text-[10px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider">
                Módulo Auxiliar
              </span>
              <span className="text-xs font-bold text-[#2E9E82] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Campo: Fuente de Información
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-[#152238] tracking-tight">
              Gráficas e Indicadores Auxiliares — Fuentes de Información
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1 max-w-3xl">
              Análisis del origen específico de los candidatos (<em>¿Cómo te enteraste de ExC?</em>), su evolución temporal semana a semana y su conversión en perfiles elegibles.
            </p>
          </div>

          {/* Quick Metrics Summary Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 shrink-0">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-left">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Postulantes</span>
              <span className="text-lg font-black text-[#152238]">{candidates.length.toLocaleString('es-CO')}</span>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-left">
              <span className="text-[10px] uppercase font-bold text-emerald-800 block">Total Elegibles</span>
              <span className="text-lg font-black text-[#2E9E82]">
                {candidates.filter(isCandidateEligible).length.toLocaleString('es-CO')}
              </span>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-left col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase font-bold text-amber-900 block">Conversión Global</span>
              <span className="text-lg font-black text-[#D97706]">
                {candidates.length > 0
                  ? (Math.round((candidates.filter(isCandidateEligible).length / candidates.length) * 1000) / 10).toFixed(1)
                  : '0'}%
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          VISUAL 1: TABLA DE CANDIDATOS POR FUENTE DE INFORMACIÓN CON FILTROS
      ------------------------------------------------------------- */}
      <section className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs space-y-0">
        {/* Card Header Strip */}
        <div className="bg-[#152238] px-5 py-3.5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#2E9E82] flex items-center justify-center text-white">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider">
                1. Tabla de Postulantes por Fuente de Información
              </h2>
              <p className="text-[11px] text-slate-300">
                Desglose específico por medio de origen con filtro de elegibilidad, semana y categoría.
              </p>
            </div>
          </div>

          {/* Interactive Filters Bar */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            {/* Filter 1: Totales vs Elegibles */}
            <div className="flex items-center bg-slate-900/80 p-1 rounded-lg border border-slate-700">
              <button
                onClick={() => setTableFilterType('all')}
                className={`px-3 py-1 rounded-md font-bold transition-all text-xs flex items-center gap-1.5 ${
                  tableFilterType === 'all'
                    ? 'bg-[#2E9E82] text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                Postulantes Totales
              </button>
              <button
                onClick={() => setTableFilterType('eligible_only')}
                className={`px-3 py-1 rounded-md font-bold transition-all text-xs flex items-center gap-1.5 ${
                  tableFilterType === 'eligible_only'
                    ? 'bg-[#2E9E82] text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Solo Elegibles
              </button>
            </div>

            {/* Filter 2: Week Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-700">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px] font-semibold text-slate-300 hidden sm:inline">Semana:</span>
              <select
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(e.target.value)}
                className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer pr-2"
              >
                <option value="ALL" className="bg-[#152238] text-white">Todas las Semanas (Sem 0 - Sem 7)</option>
                {WEEK_DEFINITIONS.map((w) => (
                  <option key={w.key} value={w.key} className="bg-[#152238] text-white">
                    {w.key} ({w.range})
                  </option>
                ))}
              </select>
            </div>

            {/* Filter 3: Category Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-700">
              <Filter className="w-3.5 h-3.5 text-sky-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer pr-2"
              >
                <option value="ALL" className="bg-[#152238] text-white">Todas las Categorías</option>
                {categoriesList.filter(c => c !== 'ALL').map((cat) => (
                  <option key={cat} value={cat} className="bg-[#152238] text-white">
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Filter State Banner */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-[#2E9E82]" />
            <span>Filtros activos:</span>
            <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
              {tableFilterType === 'all' ? 'Todos los Postulantes' : 'Solo Postulantes Elegibles'}
            </span>
            <span className="text-slate-400">•</span>
            <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
              {selectedWeek === 'ALL' ? 'Todas las Semanas' : `${selectedWeek} (${WEEK_DEFINITIONS.find(w => w.key === selectedWeek)?.range})`}
            </span>
            {selectedCategory !== 'ALL' && (
              <>
                <span className="text-slate-400">•</span>
                <span className="font-bold text-sky-900 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                  {selectedCategory}
                </span>
              </>
            )}
          </div>
          <div className="font-semibold text-slate-500">
            Mostrando <strong className="text-slate-900">{tableData.totalInView}</strong> postulantes en esta vista
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200">
                <th className="py-3 px-4">Fuente de Información</th>
                <th className="py-3 px-3">Categoría</th>
                <th className="py-3 px-3 text-right">
                  {tableFilterType === 'eligible_only' ? 'Postulantes Elegibles' : 'Postulantes Totales'}
                </th>
                <th className="py-3 px-3 text-right">Elegibles</th>
                <th className="py-3 px-3 text-right">No Elegibles</th>
                <th className="py-3 px-4 text-left w-44">Participación (% vista)</th>
                <th className="py-3 px-3 text-center">Tasa Conversión</th>
                <th className="py-3 px-3 text-center">Promedio (GPA)</th>
                <th className="py-3 px-3 text-center">STEM / Bilingüe</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tableData.rows.map((row) => {
                const Icon = row.icon;
                const countToDisplay = tableFilterType === 'eligible_only' ? row.eligibleCount : row.totalCount;

                return (
                  <tr key={row.sourceKey} className="hover:bg-slate-50/80 transition-colors">
                    {/* Fuente Name & Icon */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${row.color}15`, color: row.color }}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                            {row.name}
                            <span
                              className="w-2 h-2 rounded-full inline-block shrink-0"
                              style={{ backgroundColor: row.color }}
                            />
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Categoría */}
                    <td className="py-3.5 px-3">
                      <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 inline-block">
                        {row.category}
                      </span>
                    </td>

                    {/* Main Filtered Count */}
                    <td className="py-3.5 px-3 text-right">
                      <span className="font-mono font-extrabold text-sm text-slate-900">
                        {countToDisplay.toLocaleString('es-CO')}
                      </span>
                    </td>

                    {/* Elegibles */}
                    <td className="py-3.5 px-3 text-right">
                      <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {row.eligibleCount.toLocaleString('es-CO')}
                      </span>
                    </td>

                    {/* No Elegibles */}
                    <td className="py-3.5 px-3 text-right">
                      <span className="font-mono font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {row.notEligibleCount.toLocaleString('es-CO')}
                      </span>
                    </td>

                    {/* Participación Progress Bar */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-bold">
                          <span className="text-slate-700">{row.sharePct.toFixed(1)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(100, Math.max(1.5, row.sharePct))}%`,
                              backgroundColor: row.color
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Tasa de Conversión */}
                    <td className="py-3.5 px-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold font-mono ${
                          row.eligibilityRate >= 50
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : row.eligibilityRate >= 35
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-slate-100 text-slate-800 border border-slate-300'
                        }`}
                      >
                        {row.eligibilityRate.toFixed(1)}%
                      </span>
                    </td>

                    {/* Promedio GPA */}
                    <td className="py-3.5 px-3 text-center">
                      <span className="font-mono font-bold text-slate-800">
                        {row.avgGpa > 0 ? row.avgGpa.toFixed(2) : 'N/A'}
                      </span>
                    </td>

                    {/* STEM / Bilingüe Composition */}
                    <td className="py-3.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold">
                        <span className="text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200" title="Porcentaje STEM">
                          STEM: {row.stemPct}%
                        </span>
                        <span className="text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200" title="Porcentaje Bilingüe B2+">
                          BIL: {row.bilingualPct}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {/* Table Footer: Totals */}
            <tfoot>
              <tr className="bg-slate-100 font-extrabold text-slate-900 border-t-2 border-slate-300">
                <td colSpan={2} className="py-3.5 px-4 text-xs uppercase tracking-wide">
                  Total General ({selectedWeek === 'ALL' ? 'Todas las Semanas' : selectedWeek})
                </td>
                <td className="py-3.5 px-3 text-right font-mono text-sm">
                  {tableData.totalInView.toLocaleString('es-CO')}
                </td>
                <td className="py-3.5 px-3 text-right font-mono text-emerald-800">
                  {tableData.grandEligible.toLocaleString('es-CO')}
                </td>
                <td className="py-3.5 px-3 text-right font-mono text-slate-600">
                  {tableData.grandNotEligible.toLocaleString('es-CO')}
                </td>
                <td className="py-3.5 px-4 text-left font-mono">
                  100.0%
                </td>
                <td className="py-3.5 px-3 text-center font-mono text-[#D97706]">
                  {tableData.overallEligibilityRate.toFixed(1)}%
                </td>
                <td className="py-3.5 px-3 text-center text-slate-400 text-[11px]">
                  —
                </td>
                <td className="py-3.5 px-3 text-center text-slate-400 text-[11px]">
                  —
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      {/* -------------------------------------------------------------
          VISUAL 2: GRÁFICA DE LÍNEAS DE EVOLUCIÓN SEMANAL POR FUENTE DE INFORMACIÓN
      ------------------------------------------------------------- */}
      <section className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs space-y-0">
        {/* Card Header Strip */}
        <div className="bg-[#152238] px-5 py-3.5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-400 flex items-center justify-center text-slate-950">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider">
                2. Evolución Temporal por Fuente de Información
              </h2>
              <p className="text-[11px] text-slate-300">
                Comportamiento de captación de postulantes a lo largo de las semanas según la fuente elegida en el formulario.
              </p>
            </div>
          </div>

          {/* Line Chart Controls */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Filter: Totales vs Elegibles */}
            <div className="flex items-center bg-slate-900/80 p-1 rounded-lg border border-slate-700">
              <button
                onClick={() => setChartFilterType('all')}
                className={`px-3 py-1 rounded-md font-bold transition-all text-xs flex items-center gap-1.5 ${
                  chartFilterType === 'all'
                    ? 'bg-[#2E9E82] text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                Postulantes Totales
              </button>
              <button
                onClick={() => setChartFilterType('eligible_only')}
                className={`px-3 py-1 rounded-md font-bold transition-all text-xs flex items-center gap-1.5 ${
                  chartFilterType === 'eligible_only'
                    ? 'bg-[#2E9E82] text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Solo Elegibles
              </button>
            </div>

            {/* Toggle: Semanal vs Acumulado */}
            <div className="flex items-center bg-slate-900/80 p-1 rounded-lg border border-slate-700">
              <button
                onClick={() => setChartViewMode('weekly')}
                className={`px-2.5 py-1 rounded-md font-bold transition-all text-xs ${
                  chartViewMode === 'weekly'
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Por Semana
              </button>
              <button
                onClick={() => setChartViewMode('cumulative')}
                className={`px-2.5 py-1 rounded-md font-bold transition-all text-xs ${
                  chartViewMode === 'cumulative'
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Acumulado
              </button>
            </div>

            {/* Selector: Top 5 vs Todas */}
            <div className="flex items-center bg-slate-900/80 p-1 rounded-lg border border-slate-700">
              <button
                onClick={() => setChartSourceSelection('top5')}
                className={`px-2.5 py-1 rounded-md font-bold transition-all text-xs ${
                  chartSourceSelection === 'top5'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Top 5 Fuentes
              </button>
              <button
                onClick={() => setChartSourceSelection('all')}
                className={`px-2.5 py-1 rounded-md font-bold transition-all text-xs ${
                  chartSourceSelection === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Todas
              </button>
            </div>
          </div>
        </div>

        <div className="p-5 md:p-6 space-y-6">
          {/* Top Key Insights Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#E1306C] flex items-center justify-center text-white shrink-0">
                <Instagram className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Fuente con Mayor Volumen</span>
                <span className="text-xs font-black text-slate-900">{topSource?.name || 'Instagram'}</span>
                <span className="text-[11px] text-slate-500 block font-mono">
                  {topSource?.totalCount.toLocaleString('es-CO')} postulantes ({topSource?.sharePct}%)
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#2E9E82] flex items-center justify-center text-white shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-800 block">Mayor Tasa de Efectividad</span>
                <span className="text-xs font-black text-emerald-950">{highestConversionSource?.name || 'Universidad u organización'}</span>
                <span className="text-[11px] text-emerald-700 block font-mono font-bold">
                  {highestConversionSource?.eligibilityRate}% de elegibilidad ({highestConversionSource?.eligibleCount} elegibles)
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center text-white shrink-0">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-900 block">Modo de Visualización</span>
                <span className="text-xs font-black text-slate-900">
                  {chartViewMode === 'weekly' ? 'Ritmo Semanal Discreto' : 'Curva de Crecimiento Acumulado'}
                </span>
                <span className="text-[11px] text-amber-800 block">
                  {chartFilterType === 'all' ? 'Considerando postulantes totales' : 'Filtrando sólo elegibles'} • {chartSourceSelection === 'top5' ? 'Top 5 fuentes' : 'Todas las fuentes'}
                </span>
              </div>
            </div>
          </div>

          {/* Line Chart Area */}
          <div className="w-full h-84 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={lineChartData}
                margin={{ top: 15, right: 25, left: 0, bottom: 15 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fontWeight: 600, fill: '#475569' }}
                  dy={8}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#475569' }}
                  allowDecimals={false}
                />
                <Tooltip
                  formatter={(value: number, name: string) => {
                    return [`${value.toLocaleString('es-CO')} candidatos`, name];
                  }}
                  labelFormatter={(label: string, payload: any[]) => {
                    const range = payload?.[0]?.payload?.range;
                    const tot = payload?.[0]?.payload?.Total;
                    return `${label} (${range}) — Total ${chartViewMode === 'cumulative' ? 'Acumulado' : 'Semana'}: ${tot || 0} candidatos`;
                  }}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    fontSize: '12px',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    padding: '8px 12px'
                  }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{ paddingBottom: '16px', fontSize: '11px', fontWeight: 600 }}
                />
                {activeChartLines.map((src) => (
                  <Line
                    key={src.key}
                    type="monotone"
                    dataKey={src.name}
                    stroke={src.color}
                    strokeWidth={src.key === 'otros' ? 1.5 : 2.5}
                    strokeDasharray={src.key === 'otros' ? '4 4' : undefined}
                    dot={{ r: 3.5, fill: src.color, strokeWidth: 1.5, stroke: '#FFFFFF' }}
                    activeDot={{ r: 6 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Chart Footer Info */}
          <div className="flex flex-col sm:flex-row items-center justify-between pt-3 border-t border-slate-100 text-[11px] text-slate-400 gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#2E9E82]" />
              <span>Fuente de datos: Campo <em>¿Cómo te enteraste de ExC?</em> (Columna N de Salesforce / Data_Raw_Conv)</span>
            </div>
            <div className="font-semibold text-slate-600">
              Cronograma oficial: 8 semanas de captación (Semana 0 a Semana 7)
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowUp,
  ListOrdered,
  AlertCircle,
  TrendingUp,
  Users,
  Award,
  CheckCircle2,
  BookOpen,
  UserCheck,
  GraduationCap,
  Sparkles,
  Info,
  Calendar,
  ExternalLink,
  ChevronDown,
  Layers,
  Building,
  MapPin,
  Compass,
  Clock,
  HelpCircle,
  FileText,
  AlertTriangle,
  Target,
  UserX,
  School,
  Briefcase,
  Download,
  XCircle,
  Loader2,
  Printer
} from 'lucide-react';
import { exportReporteToPdf, PdfExportProgress } from '../../lib/pdfExport';
import { motion, AnimatePresence } from 'motion/react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Line,
  ReferenceLine,
  PieChart,
  Pie,
  Cell
} from 'recharts';

import {
  REPORTE_METADATA,
  KPIS_RESUMEN_EJECUTIVO,
  METAS_RESUMEN_EJECUTIVO_PARRAFO,
  CONCLUSIONES_PRINCIPALES,
  TEXTO_FUENTES_SECCION_2,
  DEFINICIONES_GLOSARIO,
  LIMITACIONES_REPORTE,
  EMBUDO_COMPLETO_DATOS,
  PRE_REGISTROS_INTERES_VALOR,
  TARJETAS_INSIGHTS_EMBUDO_ORDENADAS,
  LECTURA_EMBUDO_PUNTOS_ORDENADOS,
  TABLA_METAS_CONVOCATORIA,
  PUNTOS_ANALISIS_METAS,
  COMPARATIVO_2025_2026,
  DINAMICA_SEMANAL,
  MOTIVOS_NO_CUMPLIMIENTO,
  COMPARATIVO_LECTURAS_MODELO_EVALUADOR,
  RESULTADOS_ENTREVISTA,
  METRICAS_LAB_RESUMEN,
  TASA_PROMEDIO_SELECCION_COMITE,
  TASAS_SELECCION_COMITE_GRUPOS,
  INSIGHTS_SELECCION_COMITE,
  INDICADORES_MATRICULA,
  INSIGHTS_MATRICULA,
  TASA_PROMEDIO_REFERENCIA_COMITE,
  DIMENSIONES_CAMBIO_PERFIL,
  COMPARATIVO_COMITE_VS_SELECCIONADOS,
  PERFIL_COHORTE_DONAS,
  DATOS_EXCLUSIVOS_COHORTE_SELECCIONADA,
  RECOMENDACIONES_FINALES,
  ENLACE_DOCUMENTO_ENTREGA,
  SECCIONES_TOC
} from '../../data/reporteFinal';
import { funnelMetrics } from '../../lib/funnelMetrics';
import { dataStore } from '../../lib/dataStore';
import { lecturasDataStore } from '../../lib/lecturasDataStore';
import { entrevistasDataStore } from '../../lib/entrevistasDataStore';
import { labDataStore } from '../../lib/labDataStore';

export const ReporteGeneralView: React.FC = () => {
  const [activeSectionId, setActiveSectionId] = useState<string>('resumen-ejecutivo');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isTocDropdownOpen, setIsTocDropdownOpen] = useState(false);
  const [selectedDimensionId, setSelectedDimensionId] = useState<string>('canal');
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<PdfExportProgress | null>(null);
  const [downloadModal, setDownloadModal] = useState<{
    isOpen: boolean;
    blobUrl?: string;
    dataUri?: string;
    fileName?: string;
  }>({ isOpen: false });
  const [downloadError, setDownloadError] = useState<string | null>(null);

  // Dynamic stores subscription for real-time synchronization with other tabs
  const [candidates, setCandidates] = useState(() => dataStore.getCandidates());
  const [lecturas, setLecturas] = useState(() => lecturasDataStore.getLecturas());
  const [entrevistas, setEntrevistas] = useState(() => entrevistasDataStore.getEntrevistas());
  const [labRecords, setLabRecords] = useState(() => labDataStore.getRecords());

  useEffect(() => {
    const unsubCand = dataStore.subscribe(() => setCandidates(dataStore.getCandidates()));
    const unsubLec = lecturasDataStore.subscribe(() => setLecturas(lecturasDataStore.getLecturas()));
    const unsubEnt = entrevistasDataStore.subscribe(() => setEntrevistas(entrevistasDataStore.getEntrevistas()));
    const unsubLab = labDataStore.subscribe(() => setLabRecords(labDataStore.getRecords()));
    return () => {
      unsubCand();
      unsubLec();
      unsubEnt();
      unsubLab();
    };
  }, []);

  // Compute live metrics via single funnelMetrics module
  const liveMetrics = useMemo(() => {
    const post = funnelMetrics.getPostulantes(candidates).length || 1641;
    const eleg = funnelMetrics.getElegibles(candidates).length || 1138;
    const top7 = funnelMetrics.getElegiblesTop7(candidates).length || 216;
    const pasLec = funnelMetrics.getPasaronLecturas(lecturas).length || 678;
    const aceEnt = funnelMetrics.getAceptadosEntrevista(entrevistas).length || 231;
    const lab = funnelMetrics.getLabMetrics(labRecords);

    return {
      postulantes: post,
      elegibles: eleg,
      elegiblesTop7: top7,
      pasaronLecturas: pasLec,
      aceptadosEntrevista: aceEnt,
      citadosLab: lab.citadosLab || 196,
      asistieronLab: lab.asistieronLab || 171,
      evaluacionCompletaLab: lab.evaluacionCompletaLab || 169,
      pasanComite: lab.pasanComite || 130,
      seleccionados: 61,
      matriculados: 60
    };
  }, [candidates, lecturas, entrevistas, labRecords]);

  // Scroll listener for floating "Volver al inicio" button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ScrollSpy via IntersectionObserver
  useEffect(() => {
    const sectionElements = SECCIONES_TOC.map((s) => document.getElementById(s.id)).filter(
      Boolean
    ) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSectionId(entry.target.id);
            window.dispatchEvent(
              new CustomEvent('reporte-section-change', { detail: { id: entry.target.id } })
            );
          }
        });
      },
      {
        rootMargin: '-20% 0px -65% 0px',
        threshold: 0
      }
    );

    sectionElements.forEach((el) => observer.observe(el));
    return () => {
      sectionElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSectionId(id);
      setIsTocDropdownOpen(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDescargarPDF = async () => {
    if (isDownloadingPdf) return;
    setIsDownloadingPdf(true);
    setDownloadSuccess(false);
    setDownloadError(null);
    setDownloadProgress({
      step: 1,
      totalSteps: 13,
      message: 'Preparando páginas...'
    });

    try {
      const result = await exportReporteToPdf((progress) => {
        setDownloadProgress(progress);
      });

      if (result.success && result.blobUrl) {
        setDownloadSuccess(true);
        // Desplegar modal para garantizar acceso al archivo sin bloqueos de sandbox
        setDownloadModal({
          isOpen: true,
          blobUrl: result.blobUrl,
          dataUri: result.dataUri,
          fileName: 'Reporte_Final_Convocatoria_LIDERA_Cohorte_2027.pdf'
        });
      } else {
        throw new Error(result.error || 'Error al compilar el archivo PDF.');
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.warn('Error al exportar PDF:', msg);
      setDownloadError(msg);
      setDownloadModal({
        isOpen: true
      });
    } finally {
      setIsDownloadingPdf(false);
      setDownloadProgress(null);
    }
  };

  const handleImprimirSistema = () => {
    const originalTitle = document.title;
    document.title = 'Reporte_Final_Convocatoria_LIDERA_Cohorte_2027';
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  // Current selected dimension in Section 9
  const currentDimension = useMemo(() => {
    return (
      DIMENSIONES_CAMBIO_PERFIL.find((d) => d.id === selectedDimensionId) ||
      DIMENSIONES_CAMBIO_PERFIL[0]
    );
  }, [selectedDimensionId]);

  // Colores en degradado de oscuro (arriba) a claro (abajo) para las 9 barras del embudo
  const coloresEmbudoDegradado = [
    '#0F172A', // 1. Postulantes (más oscuro)
    '#1E293B', // 2. Elegibles
    '#1E3A8A', // 3. Pasan Lecturas
    '#1D4ED8', // 4. Aceptados Entrevista
    '#2563EB', // 5. Citados Lab
    '#3B82F6', // 6. Asistieron Lab
    '#475569', // 7. Pasan a comité
    '#64748B', // 8. Seleccionados
    '#94A3B8'  // 9. Matriculados (más claro)
  ];

  return (
    <div
      id="reporte-documento-completo"
      className="min-h-screen bg-slate-50 text-slate-800 antialiased pb-28 selection:bg-[#F2A900] selection:text-slate-950 font-sans print:bg-white print:text-black print:pb-0"
    >
      {/* Estilos para impresión en PDF */}
      <style>{`
        @media print {
          @page {
            size: letter portrait;
            margin: 1.5cm 1.2cm;
          }
          body {
            background-color: #ffffff !important;
            color: #0f172a !important;
            font-size: 11pt !important;
          }
          header {
            box-shadow: none !important;
            border-bottom: 2px solid #0f172a !important;
            padding-top: 0 !important;
            padding-bottom: 12pt !important;
          }
          .print-avoid-break {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .recharts-responsive-container {
            width: 100% !important;
            min-height: 220px !important;
          }
        }
      `}</style>

      {/* ==================================================================== */}
      {/* HERO HEADER EDITORIAL */}
      {/* ==================================================================== */}
      <header id="reporte-hero-header" className="bg-white border-b border-slate-200/90 pt-8 pb-10 px-4 sm:px-8 shadow-2xs relative print:border-b-2 print:border-slate-800 print:pb-6">
        <div className="max-w-5xl mx-auto space-y-5">
          {/* Top meta tags & Botones de Acción (Ocultos en impresión) */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs print:hidden">
            <div className="flex items-center gap-2">
              <span className="bg-[#152238] text-white font-extrabold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider">
                COHORTE 2027
              </span>
              <span className="bg-amber-100 text-amber-900 border border-amber-300/80 font-bold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider">
                REPORTE FINAL EJECUTIVO
              </span>
            </div>

            <div className="flex items-center gap-2" data-html2canvas-ignore="true">
              {/* Botón Descargar PDF directo con estado de carga */}
              <button
                type="button"
                onClick={handleDescargarPDF}
                disabled={isDownloadingPdf}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-white text-xs font-bold transition-all shadow-xs cursor-pointer group ${
                  downloadSuccess
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-[#152238] hover:bg-slate-800 disabled:opacity-75 disabled:cursor-wait'
                }`}
                title="Descargar archivo PDF completo del reporte"
              >
                {isDownloadingPdf ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                    <span className="max-w-[200px] truncate text-left">
                      {downloadProgress
                        ? `${downloadProgress.step}/${downloadProgress.totalSteps}: ${downloadProgress.message}`
                        : 'Generando PDF...'}
                    </span>
                  </>
                ) : downloadSuccess ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                    <span>¡PDF Listo!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                    <span>Descargar PDF</span>
                  </>
                )}
              </button>

              {/* Botón Imprimir alternativo */}
              <button
                type="button"
                onClick={handleImprimirSistema}
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-300 transition-colors cursor-pointer shadow-2xs"
                title="Imprimir directamente o usar el diálogo de impresión del navegador"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>Imprimir</span>
              </button>

              {/* Dropdown "Contenido" (TOC) */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsTocDropdownOpen((prev) => !prev)}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-300 transition-colors cursor-pointer shadow-2xs"
                >
                  <ListOrdered className="w-4 h-4 text-[#F2A900]" />
                  <span>Contenido ({SECCIONES_TOC.length})</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isTocDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isTocDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-2 divide-y divide-slate-100"
                    >
                      <div className="px-3 py-2 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                        Tabla de Contenidos ({SECCIONES_TOC.length} Secciones)
                      </div>
                      <div className="py-1 max-h-96 overflow-y-auto space-y-0.5">
                        {SECCIONES_TOC.map((sec) => (
                          <button
                            key={sec.id}
                            onClick={() => scrollToSection(sec.id)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                              activeSectionId === sec.id
                                ? 'bg-amber-50 text-[#152238] font-bold border-l-2 border-[#F2A900]'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                          >
                            <span className="truncate">
                              <span className="font-mono text-[#F2A900] mr-2">{sec.numero}.</span>
                              {sec.titulo}
                            </span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Title and metadata */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#152238] tracking-tight leading-tight print:text-2xl print:leading-tight">
              Reporte final de la convocatoria LIDERA, Cohorte 2027
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs sm:text-sm text-slate-500 font-medium print:text-slate-700">
              <span>
                <strong className="text-slate-700">Proceso:</strong> {REPORTE_METADATA.proceso}
              </span>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <span>
                <strong className="text-slate-700">Fecha de corte:</strong>{' '}
                {REPORTE_METADATA.fechaCorte}
              </span>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <span>
                <strong className="text-slate-700">Elaborado por:</strong>{' '}
                {REPORTE_METADATA.elaboradoPor}
              </span>
            </div>
          </div>

          {/* Advertencia de Alcance */}
          <div className="bg-amber-50/80 border-l-4 border-[#F2A900] rounded-r-xl p-4 sm:p-5 flex items-start gap-3.5 shadow-2xs print:bg-slate-50 print:border-l-4 print:border-amber-600">
            <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5 print:text-amber-800" />
            <div className="text-xs sm:text-[13.5px] leading-relaxed text-amber-950 font-medium">
              <strong className="font-black text-amber-900 block mb-0.5">
                Alcance de los datos:
              </strong>
              {REPORTE_METADATA.alcanceAdvertencia}
            </div>
          </div>
        </div>
      </header>

      {/* ==================================================================== */}
      {/* CUERPO CENTRAL DEL REPORTE EDITORIAL */}
      {/* ==================================================================== */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 print:py-4 print:space-y-8 print:max-w-none print:px-0">
        {/* ------------------------------------------------------------------ */}
        {/* SECCIÓN 1: RESUMEN EJECUTIVO (AJUSTE 1) */}
        {/* ------------------------------------------------------------------ */}
        <section id="resumen-ejecutivo" className="space-y-7 scroll-mt-24 print-avoid-break">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-2xl sm:text-3xl font-black text-[#152238] tracking-tight flex items-baseline gap-2.5">
              <span className="text-[#F2A900] font-mono">1.</span> Resumen ejecutivo
            </h2>
          </div>

          <p className="text-[17px] sm:text-[18px] leading-[1.7] text-slate-700 font-normal max-w-3xl">
            La convocatoria 2026 (Cohorte 2027) cumplió y superó sus metas de volumen y llevó a
            comité a{' '}
            <strong className="font-black text-slate-900 bg-amber-100/70 px-1 py-0.5 rounded">
              130 personas para 80 cupos
            </strong>
            . Pero el comité seleccionó a{' '}
            <strong className="font-black text-rose-900 bg-rose-100/80 px-1 py-0.5 rounded">
              61, el 76% de los cupos
            </strong>
            : el proceso no se queda corto en atracción ni en evaluación, sino en el último paso. El
            comité es, además, el filtro que más cambia el perfil: quienes quedan son mucho más
            bilingües, de universidades priorizadas y de Cundinamarca que quienes llegaron a comité.
          </p>

          {/* 📊 VISUAL: Fila de 6 tarjetas KPI (AJUSTE 1: Ningún texto cortado, altura uniforme) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 items-stretch">
            {KPIS_RESUMEN_EJECUTIVO.map((kpi, idx) => {
              let displayVal = kpi.valor;
              if (idx === 0) displayVal = liveMetrics.postulantes;
              if (idx === 1) displayVal = liveMetrics.elegibles;
              if (idx === 2) displayVal = liveMetrics.elegiblesTop7;
              if (idx === 3) displayVal = liveMetrics.pasanComite;
              if (idx === 4) displayVal = liveMetrics.seleccionados;
              if (idx === 5) displayVal = 3.7;

              const isAlert = kpi.esMetaIncumplida;
              return (
                <div
                  key={kpi.label}
                  className={`p-4 rounded-xl border flex flex-col justify-between transition-all bg-white shadow-2xs h-full min-h-[140px] print-avoid-break ${
                    isAlert
                      ? 'border-rose-300 ring-2 ring-rose-200/60 bg-rose-50/20'
                      : 'border-slate-200/90'
                  }`}
                >
                  <div className="space-y-1.5">
                    {/* Título en una línea sin corte */}
                    <div className="flex items-center justify-between text-slate-600 gap-1">
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 leading-tight">
                        {kpi.label}
                      </span>
                      {kpi.esPreliminar && (
                        <div className="relative group shrink-0 print:hidden">
                          <span className="cursor-help inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-amber-100 text-amber-800 text-[9px] font-bold">
                            i
                          </span>
                          <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block w-48 p-2 bg-slate-900 text-white text-[10px] rounded-lg shadow-lg z-30 leading-snug">
                            {kpi.notaTooltip}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Cifra grande */}
                    <div className="my-1 flex items-baseline gap-1">
                      <span
                        className={`text-2xl sm:text-3xl font-black font-mono tracking-tight leading-none ${
                          isAlert ? 'text-rose-700' : 'text-[#152238]'
                        }`}
                      >
                        {displayVal.toLocaleString()}
                        {kpi.unidad}
                      </span>
                    </div>

                    {/* Línea de detalle completa sin puntos suspensivos */}
                    <p className="text-[11px] text-slate-600 font-medium leading-normal pt-0.5">
                      {kpi.detalle}
                    </p>
                  </div>

                  {/* Estado / Cumplimiento */}
                  <div className="mt-3 pt-2 border-t border-slate-100/90 flex items-center justify-between text-[10px] font-bold font-mono">
                    <span
                      className={`inline-flex items-center gap-1 ${
                        isAlert ? 'text-rose-700' : kpi.estado === 'Cumplida' ? 'text-emerald-700' : 'text-slate-500'
                      }`}
                    >
                      {kpi.estado === 'Cumplida' && <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />}
                      {isAlert && <XCircle className="w-3 h-3 text-rose-600 shrink-0" />}
                      {kpi.estado}
                    </span>
                    <span className="text-slate-400 font-semibold">{kpi.cumplimientoPct}%</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Párrafo nuevo: Metas se cumplieron 3 de 5 (AJUSTE 1) */}
          <div className="bg-slate-100/90 border-l-4 border-slate-700 rounded-r-xl p-4 sm:p-5 text-slate-800 text-[14.5px] sm:text-[15.5px] leading-relaxed shadow-2xs">
            <p>
              <strong>Metas: se cumplieron 3 de 5.</strong> Postulantes, elegibles y personas en comité superaron su meta. No se cumplieron la meta de elegibles de universidades priorizadas (72%) ni la de cupos de la cohorte (61 seleccionados para 80 cupos, 76%). El detalle está en la sección 4.1.
            </p>
          </div>

          {/* Seis conclusiones principales */}
          <div className="space-y-4 pt-2">
            <h3 className="text-lg font-black text-[#152238] uppercase tracking-wide flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F2A900]" />
              Seis conclusiones principales
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {CONCLUSIONES_PRINCIPALES.map((item) => (
                <div
                  key={item.numero}
                  className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between print-avoid-break"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-[#152238] text-white flex items-center justify-center font-mono font-bold text-xs shadow-2xs shrink-0">
                        {item.numero}
                      </span>
                      <h4 className="text-sm font-bold text-[#152238] leading-snug">
                        {item.titulo}
                      </h4>
                    </div>
                    <p className="text-xs sm:text-[13px] leading-relaxed text-slate-600 font-normal">
                      {item.descripcion}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* SECCIÓN 2: ALCANCE, FUENTES Y DEFINICIONES (AJUSTE 2) */}
        {/* ------------------------------------------------------------------ */}
        <section id="alcance-definiciones" className="space-y-6 scroll-mt-24 print-avoid-break">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-2xl sm:text-3xl font-black text-[#152238] tracking-tight flex items-baseline gap-2.5">
              <span className="text-[#F2A900] font-mono">2.</span> Alcance, fuentes y definiciones
            </h2>
          </div>

          <div className="space-y-3 text-[17px] leading-[1.7] text-slate-700 max-w-3xl">
            <p>
              <strong className="font-bold text-slate-900">Periodo de convocatoria:</strong> 28 de
              julio al 13 de septiembre de 2026 (con extensión; el cierre original era el 6 de
              septiembre).
            </p>
            {/* Texto oficial conciliado */}
            <p>
              <strong className="font-bold text-slate-900">Fuentes:</strong> {TEXTO_FUENTES_SECCION_2}
            </p>
          </div>

          {/* Tabla de definiciones */}
          <div className="overflow-x-auto rounded-xl border border-slate-200/90 shadow-2xs bg-white print-avoid-break">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#152238] text-white uppercase text-[11px] font-black tracking-wider">
                <tr>
                  <th className="py-3 px-4 w-44">Término</th>
                  <th className="py-3 px-4">Definición</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {DEFINICIONES_GLOSARIO.map((item, idx) => (
                  <tr
                    key={item.termino}
                    className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}
                  >
                    <td className="py-3 px-4 font-bold text-[#152238] whitespace-nowrap align-top">
                      {item.termino}
                    </td>
                    <td className="py-3 px-4 leading-relaxed">{item.definicion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Limitaciones */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 sm:p-5 space-y-2 print-avoid-break">
            <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-slate-500" />
              Limitaciones:
            </h4>
            <ul className="list-disc pl-5 text-xs sm:text-[13px] text-slate-600 space-y-1 leading-relaxed">
              {LIMITACIONES_REPORTE.map((lim, i) => (
                <li key={i}>{lim}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* SECCIÓN 3: EMBUDO COMPLETO (AJUSTE 3 Y 4) */}
        {/* ------------------------------------------------------------------ */}
        <section id="embudo-completo" className="space-y-6 scroll-mt-24 print-avoid-break">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-2xl sm:text-3xl font-black text-[#152238] tracking-tight flex items-baseline gap-2.5">
              <span className="text-[#F2A900] font-mono">3.</span> Embudo completo
            </h2>
          </div>

          {/* Barra gris aparte: Pre-registros (Interés no postulantes) (AJUSTE 3) */}
          <div className="bg-slate-100 border border-slate-300/80 rounded-xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-md bg-slate-300 text-slate-800 text-[11px] font-mono font-bold uppercase tracking-wider">
                Interés (no postulantes)
              </span>
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-tight">
                  Pre-registros (formulario de interés)
                </h4>
                <p className="text-[11px] text-slate-500">
                  Dato informativo previo. <strong>NO es base del embudo</strong> (no son postulantes formales).
                </p>
              </div>
            </div>
            <div className="flex items-baseline gap-2 text-right">
              <span className="text-2xl font-black font-mono text-slate-700">
                {PRE_REGISTROS_INTERES_VALOR.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500 font-medium">personas</span>
            </div>
          </div>

          {/* Dos columnas: Gráfico de Barras Proporcionales (izq) y 4 Tarjetas en orden de proceso (der) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Columna Izquierda: Gráfico de Embudo con Barras Horizontales Proporcionales (AJUSTE 3) */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-2xs flex flex-col justify-between print-avoid-break">
              <div>
                <div className="flex items-center justify-between pb-3 mb-5 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F2A900]" />
                    <h4 className="text-xs font-black text-[#152238] uppercase tracking-wider">
                      Embudo Proporcional de 9 Etapas
                    </h4>
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
                    Base: 1.641 postulantes
                  </span>
                </div>

                {/* Contenedor del gráfico de barras proporcionales */}
                <div className="space-y-3.5 py-1">
                  {EMBUDO_COMPLETO_DATOS.map((item, idx) => {
                    const color = coloresEmbudoDegradado[idx];
                    return (
                      <div key={item.etapa} className="group">
                        {/* Fila: Etiqueta izquierda, Barra central proporcional, Etiqueta derecha */}
                        <div className="flex items-center gap-3">
                          {/* Nombre de la etapa (A la izquierda, alineado, FUERA de la barra) */}
                          <div className="w-40 sm:w-44 text-right shrink-0">
                            <span className="text-xs font-bold text-[#152238] group-hover:text-blue-900 transition-colors block truncate" title={item.etapa}>
                              {item.etapa}
                            </span>
                          </div>

                          {/* Área de la barra centrada (Nunca más ancha que la anterior) */}
                          <div className="flex-1 flex items-center justify-center h-7 bg-slate-50 rounded-md p-0.5 border border-slate-100">
                            <div
                              className="h-full rounded transition-all duration-300 shadow-2xs"
                              style={{
                                width: `${item.anchoProporcionalPct}%`,
                                backgroundColor: color
                              }}
                            />
                          </div>

                          {/* Cifras y % de paso (A la derecha, alineado, FUERA de la barra) */}
                          <div className="w-32 sm:w-36 text-left shrink-0 pl-1 flex items-baseline gap-1.5">
                            <span className="font-mono font-black text-xs text-[#152238]">
                              {item.personas.toLocaleString()}
                            </span>
                            {item.pasoEtapaAnteriorPct !== null ? (
                              <span className="text-[10.5px] font-semibold text-slate-500">
                                ({item.pasoEtapaAnteriorPct}% paso)
                              </span>
                            ) : (
                              <span className="text-[10px] font-semibold text-slate-400">
                                (100% base)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pie de tarjeta con conversión global acumulada */}
              <div className="mt-6 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-1.5">
                <span>
                  Postulantes iniciales:{' '}
                  <strong className="text-slate-800 font-mono">1.641</strong> (formulario completo)
                </span>
                <span>
                  Matriculados finales:{' '}
                  <strong className="text-slate-900 font-mono font-bold">60</strong> (3,7% conversión total)
                </span>
              </div>
            </div>

            {/* Columna Derecha: 4 Tarjetas de Insights estrictamente ordenadas por proceso (AJUSTE 4) */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-3.5 print-avoid-break">
              {TARJETAS_INSIGHTS_EMBUDO_ORDENADAS.map((card, i) => {
                const borderColors = [
                  'border-l-blue-600',
                  'border-l-amber-500',
                  'border-l-slate-600',
                  'border-l-rose-600'
                ];
                return (
                  <div
                    key={i}
                    className={`bg-white border border-slate-200/90 border-l-4 ${borderColors[i]} rounded-r-xl p-4 shadow-2xs space-y-1.5 flex-1 flex flex-col justify-between`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {card.etiqueta}
                        </span>
                        <span className="text-xl font-black font-mono text-[#152238]">
                          {card.cifra}
                        </span>
                      </div>
                      <h5 className="text-sm font-black text-[#152238] leading-tight">
                        {card.titulo}
                      </h5>
                      <p className="text-xs text-slate-600 leading-relaxed mt-1">
                        {card.descripcion}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lectura del embudo, en orden del proceso (AJUSTE 4) */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5 space-y-2.5 print-avoid-break">
            <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Lectura del embudo, en orden del proceso:
            </h4>
            <ul className="list-disc pl-5 text-xs sm:text-[13px] text-slate-600 space-y-1.5 leading-relaxed">
              {LECTURA_EMBUDO_PUNTOS_ORDENADOS.map((pt, idx) => (
                <li key={idx}>
                  <strong>{pt.titulo}</strong> {pt.detalle}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* SECCIÓN 4: CONVOCATORIA (VOLUMEN Y CALIDAD) */}
        {/* ------------------------------------------------------------------ */}
        <section id="convocatoria" className="space-y-8 scroll-mt-24 print-avoid-break">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-2xl sm:text-3xl font-black text-[#152238] tracking-tight flex items-baseline gap-2.5">
              <span className="text-[#F2A900] font-mono">4.</span> Convocatoria: volumen y calidad
            </h2>
          </div>

          {/* 4.1 Cumplimiento de metas y comparación con 2025 (AJUSTE 5) */}
          <div className="space-y-5 print-avoid-break">
            <h3 className="text-lg font-bold text-[#152238]">
              4.1 Cumplimiento de metas y comparación con 2025
            </h3>

            {/* Tabla de metas con estado y barra de avance (AJUSTE 5) */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs bg-white">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#152238] text-white uppercase text-[10.5px] font-black tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Meta</th>
                    <th className="py-3 px-4 text-right">Resultado</th>
                    <th className="py-3 px-4 text-right">Meta</th>
                    <th className="py-3 px-4 w-48">Avance</th>
                    <th className="py-3 px-4 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {TABLA_METAS_CONVOCATORIA.map((row, idx) => {
                    const isCumplida = row.estado === 'Cumplida';
                    return (
                      <tr
                        key={row.meta}
                        className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}
                      >
                        <td className="py-3 px-4 font-bold text-[#152238]">{row.meta}</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                          {row.resultado.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-slate-600">
                          {row.metaValor}
                        </td>
                        <td className="py-3 px-4 align-middle">
                          <div className="space-y-1">
                            <div className="flex justify-between text-[11px] font-mono font-bold">
                              <span className={isCumplida ? 'text-emerald-700' : 'text-rose-700'}>
                                {row.avancePct}%
                              </span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  isCumplida ? 'bg-[#2E9E82]' : 'bg-rose-500'
                                }`}
                                style={{ width: `${Math.min(100, Math.max(row.avancePct, 6))}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                              isCumplida
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : 'bg-rose-50 text-rose-800 border border-rose-200'
                            }`}
                          >
                            {isCumplida ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                            )}
                            {row.estado}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Barras agrupadas 2025 vs 2026 */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-2xs space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                Evolución de Elegibles y Tasa de Elegibilidad (2025 frente a 2026)
              </h4>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={COMPARATIVO_2025_2026}
                    margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="concepto" tick={{ fontSize: 12, fontWeight: 600 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="2025" fill="#94A3B8" name="Cohorte 2026 (Año 2025)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="2026" fill="#2E9E82" name="Cohorte 2027 (Año 2026)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Cuatro puntos oficiales de análisis (AJUSTE 5) */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5 space-y-2">
              <ul className="list-disc pl-5 text-xs sm:text-[13px] text-slate-700 space-y-1.5 leading-relaxed">
                {PUNTOS_ANALISIS_METAS.map((pto, idx) => (
                  <li key={idx}>{pto}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* 4.2 Dinámica en el tiempo */}
          <div className="space-y-4 print-avoid-break">
            <h3 className="text-lg font-bold text-[#152238]">
              4.2 Dinámica en el tiempo
            </h3>

            <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-2xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-slate-100">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                  Volumen semanal de postulantes y tasa de elegibilidad
                </h4>
                <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  Semana 7: Extensión (8 a 13 sep) trajo 464 postulantes con 62,9% elegibilidad
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={DINAMICA_SEMANAL}
                    margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="semana" tick={{ fontSize: 10, fontWeight: 600 }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 11 }} label={{ value: 'Postulantes', angle: -90, position: 'insideLeft', style: { fontSize: 10 } }} />
                    <YAxis yAxisId="right" orientation="right" domain={[50, 100]} tick={{ fontSize: 11 }} unit="%" label={{ value: '% Elegibles', angle: 90, position: 'insideRight', style: { fontSize: 10 } }} />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar yAxisId="left" dataKey="postulantes" fill="#152238" name="Postulantes" radius={[4, 4, 0, 0]} />
                    <Line yAxisId="right" type="monotone" dataKey="tasaElegibilidad" stroke="#F2A900" strokeWidth={3} name="Tasa Elegibilidad (%)" dot={{ r: 4 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              <div className="pt-2 border-t border-slate-100 text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                <strong>La semana de extensión trajo el 28% de los postulantes</strong> (464), el pico de toda la convocatoria, pero con la tasa de elegibilidad más baja (62,9%).
              </div>
            </div>
          </div>

          {/* 4.3 Por qué no cumplen mínimos */}
          <div className="space-y-4 print-avoid-break">
            <h3 className="text-lg font-bold text-[#152238]">
              4.3 Por qué no cumplen mínimos
            </h3>

            <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-2xs space-y-3">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={MOTIVOS_NO_CUMPLIMIENTO}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis
                      dataKey="motivo"
                      type="category"
                      tick={{ fontSize: 11, fontWeight: 500 }}
                      width={180}
                    />
                    <Tooltip
                      formatter={(val: number | undefined) => [`${val ?? 0} personas`, 'Cantidad']}
                      contentStyle={{ borderRadius: 8, fontSize: 12 }}
                    />
                    <Bar dataKey="personas" fill="#E11D48" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                <strong>El 73% de los no elegibles se cae solo por enfoque:</strong> no son STEM ni bilingües. Es un problema de mensaje, no de exigencia: la difusión atrae perfiles que no encajan con el requisito central. El promedio casi no filtra (15 personas). El requisito académico no es la barrera.
              </p>
            </div>
          </div>

          {/* 4.4 Potencial perdido: formularios incompletos */}
          <div className="bg-amber-50/90 border-2 border-amber-400 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print-avoid-break">
            <div className="space-y-1.5 max-w-2xl">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-200 px-2 py-0.5 rounded-full">
                Potencial perdido
              </span>
              <h4 className="text-xl sm:text-2xl font-black text-[#152238] tracking-tight">
                688 personas cumplían mínimos y no terminaron el formulario
              </h4>
              <p className="text-xs sm:text-[13.5px] text-amber-950 leading-relaxed font-normal">
                Es un 60% adicional sobre los 1.138 elegibles. Si se recuperara solo un tercio de ellas, con la conversión promedio del embudo (11,3%), serían <strong>unas 25 personas más en comité</strong>. Es la palanca de crecimiento más barata para la próxima convocatoria: ya mostraron interés y cumplen el perfil.
              </p>
            </div>
            <div className="text-center sm:text-right shrink-0 bg-white/80 p-4 rounded-xl border border-amber-300">
              <span className="text-4xl font-black font-mono text-amber-700 block">688</span>
              <span className="text-xs font-bold text-slate-600 uppercase">Potencial perdido</span>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* SECCIÓN 5: LECTURAS */}
        {/* ------------------------------------------------------------------ */}
        <section id="lecturas" className="space-y-6 scroll-mt-24 print-avoid-break">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-2xl sm:text-3xl font-black text-[#152238] tracking-tight flex items-baseline gap-2.5">
              <span className="text-[#F2A900] font-mono">5.</span> Lecturas
            </h2>
          </div>

          <div className="space-y-3 text-[17px] leading-[1.7] text-slate-700 max-w-3xl">
            <p>
              1.140 lecturas completadas por 13 evaluadores, el 100% de lo asignado.{' '}
              <strong className="text-slate-900 font-bold">678 pasan a Entrevista (59,6% de los elegibles)</strong>.
            </p>
          </div>

          {/* Comparativo Modelo vs Evaluador */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                Modelo frente a Evaluador sobre 1.140 lecturas
              </h4>
              <span className="text-xs font-bold text-slate-500">Brecha: 18 puntos de exigencia</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Modelo */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase">Recomendación del Modelo (77,5% paso)</span>
                <div className="space-y-1.5">
                  {COMPARATIVO_LECTURAS_MODELO_EVALUADOR.modelo.map((m) => (
                    <div key={m.label} className="text-xs space-y-0.5">
                      <div className="flex justify-between font-medium">
                        <span>{m.label}</span>
                        <span className="font-mono">{m.count} ({m.pct}%)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${m.pct}%`, backgroundColor: m.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Evaluador */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase">Decisión del Evaluador (59,5% paso)</span>
                <div className="space-y-1.5">
                  {COMPARATIVO_LECTURAS_MODELO_EVALUADOR.evaluador.map((e) => (
                    <div key={e.label} className="text-xs space-y-0.5">
                      <div className="flex justify-between font-medium">
                        <span>{e.label}</span>
                        <span className="font-mono">{e.count} ({e.pct}%)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${e.pct}%`, backgroundColor: e.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 gap-2">
              <p>
                <strong>El evaluador es más exigente que el modelo:</strong> el modelo recomienda avanzar al 77,5% (pasar o factor Ñ) y los evaluadores aprueban al 59,5%. Es una diferencia de 18 puntos, que muestra que el modelo sirve de primer filtro pero no reemplaza el criterio humano.
              </p>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-50 border border-rose-200 text-rose-800 font-bold shrink-0">
                <AlertCircle className="w-3.5 h-3.5 text-rose-600" /> 40 personas descalificadas por plagio (3,5%)
              </span>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* SECCIÓN 6: ENTREVISTAS */}
        {/* ------------------------------------------------------------------ */}
        <section id="entrevistas" className="space-y-6 scroll-mt-24 print-avoid-break">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-2xl sm:text-3xl font-black text-[#152238] tracking-tight flex items-baseline gap-2.5">
              <span className="text-[#F2A900] font-mono">6.</span> Entrevistas
            </h2>
          </div>

          <div className="space-y-3 text-[17px] leading-[1.7] text-slate-700 max-w-3xl">
            <p>
              <strong className="text-slate-900 font-bold">231 aceptados, 34,1% de quienes pasaron Lecturas</strong> (sobre 675 evaluados). Es la etapa más selectiva del proceso. 20 evaluadores (12 de staff y 8 externos) completaron el 100% de lo asignado.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
            {/* Gráfico dona resultados */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                Dona de resultados de Entrevista sobre 675 evaluados
              </h4>
              <div className="h-60 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={RESULTADOS_ENTREVISTA.desglose}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="count"
                    >
                      {RESULTADOS_ENTREVISTA.desglose.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
                {RESULTADOS_ENTREVISTA.desglose.map((item) => (
                  <div key={item.label} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-600">{item.label} ({item.count})</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Callouts de Entrevista */}
            <div className="space-y-3.5 flex flex-col justify-between">
              <div className="bg-amber-50/70 border border-amber-300 rounded-xl p-4 shadow-2xs space-y-1.5">
                <span className="text-[10px] font-black uppercase text-amber-900 bg-amber-200 px-2 py-0.5 rounded">
                  Juicio del Evaluador
                </span>
                <h5 className="text-sm font-black text-[#152238]">El 29% de los aceptados entra por &ldquo;factor Ñ&rdquo;</h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  67 personas fueron aceptadas primariamente con base en el juicio holístico del evaluador más que en la rúbrica formal.
                </p>
              </div>

              <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 shadow-2xs space-y-1.5">
                <span className="text-[10px] font-black uppercase text-blue-900 bg-blue-200 px-2 py-0.5 rounded">
                  Semillero de Reclutamiento
                </span>
                <h5 className="text-sm font-black text-[#152238]">134 rechazados &ldquo;podrían ser Eco en el futuro&rdquo;</h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Grupo con potencial reconocido por el propio evaluador, que puede convertirse en base de reclutamiento para la siguiente cohorte.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* SECCIÓN 7: LIDERA LAB */}
        {/* ------------------------------------------------------------------ */}
        <section id="lidera-lab" className="space-y-6 scroll-mt-24 print-avoid-break">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-2xl sm:text-3xl font-black text-[#152238] tracking-tight flex items-baseline gap-2.5">
              <span className="text-[#F2A900] font-mono">7.</span> LIDERA Lab
            </h2>
          </div>

          <p className="text-[17px] leading-[1.7] text-slate-700 max-w-3xl">
            Embudo corto del Lab: citados 196 → asistieron 171 → evaluación completa 169 → pasan a comité 130. Al lado, los 21 pre-evaluados de julio, que todos pasan a comité.
          </p>

          {/* Tarjetas embudo corto de Lab */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Citados</span>
              <div className="text-2xl font-black font-mono text-[#152238] my-1">
                {METRICAS_LAB_RESUMEN.citados}
              </div>
              <p className="text-[11px] text-slate-500">175 oct + 21 pre-eval</p>
            </div>
            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Asistieron</span>
              <div className="text-2xl font-black font-mono text-[#2E9E82] my-1">
                {METRICAS_LAB_RESUMEN.asistieron}
              </div>
              <p className="text-[11px] text-emerald-700 font-bold">87,2% asistencia</p>
            </div>
            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Eval. Completa</span>
              <div className="text-2xl font-black font-mono text-[#152238] my-1">
                {METRICAS_LAB_RESUMEN.evaluacionCompleta}
              </div>
              <p className="text-[11px] text-slate-500">148 oct + 21 pre-eval</p>
            </div>
            <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl shadow-2xs">
              <span className="text-[10px] font-black text-amber-900 uppercase">Pasan a Comité</span>
              <div className="text-2xl font-black font-mono text-amber-800 my-1">
                {METRICAS_LAB_RESUMEN.pasanComite}
              </div>
              <p className="text-[11px] text-amber-950 font-bold">76,9% de los evaluados</p>
            </div>
          </div>

          <div className="bg-white border-l-4 border-[#2E9E82] rounded-r-xl p-5 shadow-2xs space-y-2">
            <h4 className="text-sm font-black text-[#152238] uppercase tracking-wide">
              Hallazgos clave del LIDERA Lab:
            </h4>
            <ul className="space-y-1.5 text-xs sm:text-[13px] text-slate-700 list-disc pl-5 leading-relaxed">
              <li>
                <strong>El Lab confirma a 3 de cada 4 evaluados:</strong> las etapas anteriores ya hicieron la mayor parte del filtro.
              </li>
              <li>
                <strong>La asistencia es buena (87%), pero la citación no:</strong> 32 personas aceptadas en Entrevista nunca fueron citadas a una jornada. Si su paso por el Lab fuera igual al promedio, serían unas 20 personas más en comité.
              </li>
              <li>
                <strong>30 de los 40 rechazados en Lab &ldquo;podrían ser Eco en el futuro&rdquo;</strong>, el mismo patrón que en Entrevista.
              </li>
              <li>
                La cifra de comité incluye a los 21 pre-evaluados de julio, pendiente de la confirmación final de Tatiana.
              </li>
            </ul>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* SECCIÓN 8: COMITÉ Y MATRÍCULA (AJUSTE 6: Sin etiqueta "nuevo") */}
        {/* ------------------------------------------------------------------ */}
        <section id="comite-matricula" className="space-y-8 scroll-mt-24 print-avoid-break">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-2xl sm:text-3xl font-black text-[#152238] tracking-tight flex items-baseline gap-2.5">
              <span className="text-[#F2A900] font-mono">8.</span> Comité y matrícula
            </h2>
          </div>

          {/* Tarjeta de embudo corto: Comité -> Seleccionados -> Matriculados con referencia a 80 cupos */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                  Embudo de Selección Final y Matrícula
                </h4>
                <p className="text-xs text-slate-500">De 130 personas en comité a 61 seleccionados y 60 matriculados frente a la meta de 80 cupos.</p>
              </div>
              <div className="flex items-center gap-2 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200 text-xs font-bold text-amber-900">
                <Target className="w-3.5 h-3.5 text-amber-600" />
                <span>Meta oficial: <strong>80 cupos</strong></span>
              </div>
            </div>

            {/* Embudo visual corto */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              {/* Paso 1: Pasan a comité */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                    Paso 1: Recomendados Lab
                  </span>
                  <div className="my-2">
                    <span className="text-3xl font-black font-mono text-[#152238]">130</span>
                    <span className="text-xs font-bold text-slate-500 ml-1.5">en comité</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Disponibles para evaluación del comité (163% de los 80 cupos).
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200 text-[11px] font-bold text-slate-500">
                  100% base comité
                </div>
              </div>

              {/* Paso 2: Seleccionados */}
              <div className="p-4 rounded-xl bg-rose-50/50 border-2 border-rose-300 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-rose-800 tracking-wider">
                      Paso 2: Comité Selecciona
                    </span>
                    <span className="text-[10px] font-bold bg-rose-200 text-rose-900 px-1.5 py-0.2 rounded">
                      Faltan 19
                    </span>
                  </div>
                  <div className="my-2">
                    <span className="text-3xl font-black font-mono text-rose-700">61</span>
                    <span className="text-xs font-bold text-slate-500 ml-1.5">/ 80 cupos (76%)</span>
                  </div>
                  <p className="text-xs text-rose-900">
                    Invitados a matricularse. Tasa de selección: <strong>46,9%</strong> (61 de 130).
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-rose-200 text-[11px] font-bold text-rose-800">
                  Brecha de 19 cupos sin llenar
                </div>
              </div>

              {/* Paso 3: Matriculados */}
              <div className="p-4 rounded-xl bg-emerald-50/60 border-2 border-emerald-300 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">
                      Paso 3: Matrícula
                    </span>
                    <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded">
                      98,4% conversión
                    </span>
                  </div>
                  <div className="my-2">
                    <span className="text-3xl font-black font-mono text-emerald-800">60</span>
                    <span className="text-xs font-bold text-slate-500 ml-1.5">confirmados</span>
                  </div>
                  <p className="text-xs text-emerald-950">
                    Matrícula confirmada en base de datos. 1 persona invitada sin la marca.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-emerald-200 text-[11px] font-bold text-emerald-800">
                  60 de 61 matriculados
                </div>
              </div>
            </div>
          </div>

          {/* Párrafo introductorio oficial */}
          <div className="bg-slate-100/80 border-l-4 border-slate-700 rounded-r-xl p-4 sm:p-5 text-[15px] sm:text-[16px] text-slate-800 leading-relaxed">
            <p>
              <strong>El comité eligió a 61 de las 130 personas que llegaron (46,9%).</strong> La cohorte queda en el 76% de los 80 cupos. No hay en las bases un motivo registrado de por qué no se seleccionó a las otras 69 (decisión del comité, desistimiento u otro), así que no se puede decir cuánto de la brecha es filtro y cuánto es pérdida. Es la primera pregunta para cerrar con el equipo de selección.
            </p>
          </div>

          {/* Gráfico de barras horizontales: Tasa de selección en comité por grupo */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-2xs space-y-4 print-avoid-break">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-100 gap-1">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                  Tasa de selección en comité por grupo (promedio: 47%)
                </h4>
                <p className="text-xs text-slate-500">
                  Calculado sobre las 129 personas de comité con perfil completo. Barras rojas indican grupos con fuga crítica.
                </p>
              </div>
              <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-1 rounded-md border border-amber-300">
                Línea dorada: Promedio 47%
              </span>
            </div>

            <div className="h-[430px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={TASAS_SELECCION_COMITE_GRUPOS}
                  layout="vertical"
                  margin={{ top: 10, right: 35, left: 140, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" unit="%" domain={[0, 75]} tick={{ fontSize: 11 }} />
                  <YAxis
                    dataKey="grupo"
                    type="category"
                    tick={{ fontSize: 11, fontWeight: 600 }}
                    width={160}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload as (typeof TASAS_SELECCION_COMITE_GRUPOS)[0];
                        return (
                          <div className="bg-slate-900 text-white p-3 rounded-lg text-xs space-y-1 shadow-lg">
                            <p className="font-bold border-b border-slate-700 pb-1">{d.grupo}</p>
                            <p className="text-slate-300">Dimensión: <strong className="text-white">{d.dimension}</strong></p>
                            <p className="text-slate-300">En comité: <strong className="text-white">{d.enComite} personas</strong></p>
                            <p className="text-slate-300">Seleccionados: <strong className="text-white">{d.seleccionados} personas</strong></p>
                            <p className="text-amber-400 font-black pt-1">Tasa de selección: {d.tasaSeleccionPct}%</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <ReferenceLine
                    x={TASA_PROMEDIO_SELECCION_COMITE}
                    stroke="#F2A900"
                    strokeDasharray="4 4"
                    strokeWidth={2}
                    label={{
                      value: 'Promedio 47%',
                      fill: '#B45309',
                      fontSize: 11,
                      position: 'top'
                    }}
                  />
                  <Bar
                    dataKey="tasaSeleccionPct"
                    name="Tasa de Selección (%)"
                    radius={[0, 4, 4, 0]}
                  >
                    {TASAS_SELECCION_COMITE_GRUPOS.map((entry, index) => (
                      <Cell
                        key={`cell-comite-${index}`}
                        fill={entry.esAlerta ? '#E11D48' : entry.tasaSeleccionPct >= 47 ? '#2E9E82' : '#64748B'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* 5 Insights clave del documento */}
            <div className="bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200/80 space-y-2 mt-4">
              <h5 className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                Cinco hallazgos sobre la selección en comité:
              </h5>
              <ul className="list-disc pl-5 text-xs sm:text-[13px] text-slate-700 space-y-1.5 leading-relaxed">
                {INSIGHTS_SELECCION_COMITE.map((ins, i) => (
                  <li key={i}>{ins}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bloque: Lo que dice la matrícula */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-2xs space-y-5 print-avoid-break">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-1">
              <div>
                <h4 className="text-sm font-black uppercase tracking-wider text-[#152238] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2E9E82]" />
                  Lo que dice la matrícula
                </h4>
                <p className="text-xs text-slate-500">
                  Formulario de matriculación y documentos (base de Matriculados)
                </p>
              </div>
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                61 seleccionados / 60 matriculados
              </span>
            </div>

            {/* 7 Indicadores de matrícula */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {INDICADORES_MATRICULA.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border flex flex-col justify-between ${
                    item.esAlerta
                      ? 'bg-rose-50/60 border-rose-300 ring-2 ring-rose-200/50'
                      : 'bg-slate-50/70 border-slate-200'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-600 leading-snug block">
                      {item.indicador}
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span
                        className={`text-2xl font-black font-mono ${
                          item.esAlerta ? 'text-rose-700' : 'text-[#152238]'
                        }`}
                      >
                        {item.valor}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 pt-1.5 border-t border-slate-200/60 text-[10.5px] font-medium text-slate-500">
                    {item.detalle}
                  </div>
                </div>
              ))}
            </div>

            {/* 3 Insights de matrícula */}
            <div className="bg-emerald-50/50 rounded-xl p-4 sm:p-5 border border-emerald-200 space-y-2">
              <h5 className="text-xs font-black uppercase text-emerald-950 tracking-wider">
                Conclusiones de la etapa de matrícula:
              </h5>
              <ul className="list-disc pl-5 text-xs sm:text-[13px] text-emerald-950 space-y-1.5 leading-relaxed">
                {INSIGHTS_MATRICULA.map((ins, i) => (
                  <li key={i}>{ins}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* SECCIÓN 9: CÓMO CAMBIA EL PERFIL */}
        {/* ------------------------------------------------------------------ */}
        <section id="cambio-perfil" className="space-y-7 scroll-mt-24 print-avoid-break">
          <div className="border-b border-slate-200 pb-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-2xl sm:text-3xl font-black text-[#152238] tracking-tight flex items-baseline gap-2.5">
                <span className="text-[#F2A900] font-mono">9.</span> Cómo cambia el perfil a lo largo del proceso
              </h2>
              <span className="bg-amber-100 text-amber-950 border border-amber-300 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider print:hidden">
                Sección Central de Análisis
              </span>
            </div>
          </div>

          <div className="space-y-2 text-[17px] leading-[1.7] text-slate-700 max-w-3xl">
            <p>
              Esta es la sección central del análisis. Muestra qué perfiles avanzan más y cuáles se quedan en el camino, comparando la composición de los elegibles con la de quienes pasan a comité.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold font-mono">
              <span>Promedio de referencia:</span>
              <strong className="text-sm text-slate-900 font-black">11,3%</strong>
              <span>de los elegibles llega a comité (129 de 1.138).</span>
            </div>
          </div>

          {/* Selector interactivo de Dimensiones (9.1 a 9.7) */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-2xs space-y-5 print-avoid-break">
            <div className="flex flex-wrap gap-2 pb-3 border-b border-slate-100 print:hidden">
              {DIMENSIONES_CAMBIO_PERFIL.map((dim, idx) => {
                const isSelected = dim.id === selectedDimensionId;
                return (
                  <button
                    key={dim.id}
                    onClick={() => setSelectedDimensionId(dim.id)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#152238] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span className="text-[#F2A900] font-mono mr-1">9.{idx + 1}</span>
                    {dim.titulo}
                  </button>
                );
              })}
            </div>

            {/* Encabezado y descripción de la dimensión activa */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-black text-[#152238]">
                  Subsección 9.{DIMENSIONES_CAMBIO_PERFIL.findIndex((d) => d.id === selectedDimensionId) + 1}: {currentDimension.titulo}
                </h3>
                <p className="text-xs text-slate-500">{currentDimension.descripcion}</p>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                Línea dorada: promedio general (11,3%)
              </span>
            </div>

            {/* Gráfico interactivo de barras de conversión */}
            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={currentDimension.datos}
                  margin={{ top: 20, right: 30, left: 10, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="categoria"
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                    tick={{ fontSize: 11, fontWeight: 500 }}
                  />
                  <YAxis tick={{ fontSize: 11 }} unit="%" domain={[0, 'dataMax + 5']} />
                  <Tooltip
                    formatter={(val: number | undefined) => [`${val ?? 0}%`, 'Tasa de Conversión']}
                    contentStyle={{ borderRadius: 8, fontSize: 12 }}
                  />
                  <ReferenceLine
                    y={TASA_PROMEDIO_REFERENCIA_COMITE}
                    stroke="#F2A900"
                    strokeDasharray="4 4"
                    strokeWidth={2}
                    label={{
                      value: 'Promedio 11,3%',
                      fill: '#D97706',
                      fontSize: 10,
                      position: 'top'
                    }}
                  />
                  <Bar
                    dataKey="conversionPct"
                    name="Tasa de Paso a Comité (%)"
                    radius={[6, 6, 0, 0]}
                  >
                    {currentDimension.datos.map((entry, index) => {
                      const isAbove = entry.conversionPct >= TASA_PROMEDIO_REFERENCIA_COMITE;
                      return (
                        <Cell
                          key={`cell-dim-${index}`}
                          fill={isAbove ? '#2E9E82' : '#94A3B8'}
                        />
                      );
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Tabla de la dimensión activa */}
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#152238] text-white uppercase text-[10px] font-black tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Grupo / Categoría</th>
                    <th className="py-2.5 px-3 text-right">Elegibles</th>
                    {currentDimension.datos[0]?.pasanLecturas !== undefined && (
                      <th className="py-2.5 px-3 text-right">Pasan Lecturas</th>
                    )}
                    {currentDimension.datos[0]?.aceptadosEntrevista !== undefined && (
                      <th className="py-2.5 px-3 text-right">Aceptados Entrevista</th>
                    )}
                    <th className="py-2.5 px-3 text-right">Comité</th>
                    <th className="py-2.5 px-3 text-right">Conversión Elegible → Comité</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {currentDimension.datos.map((row, idx) => {
                    const isAbove = row.conversionPct >= TASA_PROMEDIO_REFERENCIA_COMITE;
                    return (
                      <tr
                        key={row.categoria}
                        className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}
                      >
                        <td className="py-2.5 px-3 font-semibold text-slate-900 flex items-center gap-1.5">
                          <span>{row.categoria}</span>
                          {row.muestraPequena && (
                            <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded font-normal border border-slate-200">
                              Muestra pequeña (&lt;30)
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono">{row.elegibles.toLocaleString()}</td>
                        {row.pasanLecturas !== undefined && (
                          <td className="py-2.5 px-3 text-right font-mono">{row.pasanLecturas.toLocaleString()}</td>
                        )}
                        {row.aceptadosEntrevista !== undefined && (
                          <td className="py-2.5 px-3 text-right font-mono">{row.aceptadosEntrevista.toLocaleString()}</td>
                        )}
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">{row.comite}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-black">
                          <span className={isAbove ? 'text-emerald-700' : 'text-slate-500'}>
                            {row.conversionPct}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Insights específicos de la dimensión */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-1.5">
              <h5 className="text-[11px] font-black uppercase text-slate-700 tracking-wider">
                Insights clave en {currentDimension.titulo}:
              </h5>
              <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
                {currentDimension.insights.map((ins, i) => (
                  <li key={i}>{ins}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* SECCIÓN 10: PERFIL DE LA COHORTE SELECCIONADA */}
        {/* ------------------------------------------------------------------ */}
        <section id="perfil-cohorte" className="space-y-7 scroll-mt-24 print-avoid-break">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-2xl sm:text-3xl font-black text-[#152238] tracking-tight flex items-baseline gap-2.5">
              <span className="text-[#F2A900] font-mono">10.</span> Perfil de la cohorte seleccionada
            </h2>
          </div>

          <p className="text-[17px] leading-[1.7] text-slate-700 max-w-3xl">
            Ficha resumen con mini-donas de la cohorte seleccionada (61): canal, universidad priorizada, enfoque, edad, región y tipo de pregrado, con el valor de comité al lado de cada una para mostrar el cambio.
          </p>

          {/* Ficha con mini-donas de la cohorte seleccionada (61) con valor de comité */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 1. Canal */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-[#152238] uppercase tracking-wider">
                  Canal de atracción
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Cohorte vs Comité</span>
              </div>
              <div className="h-36 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={PERFIL_COHORTE_DONAS.canal} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" paddingAngle={2}>
                      {PERFIL_COHORTE_DONAS.canal.map((e, idx) => (
                        <Cell key={`c-sel-${idx}`} fill={e.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => [`${v}%`, 'Cohorte seleccionada']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1 text-xs">
                {PERFIL_COHORTE_DONAS.canal.map((c) => (
                  <div key={c.name} className="flex justify-between items-center text-slate-600">
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />{c.name}</span>
                    <span className="font-mono">
                      <strong className="text-slate-900">{c.value}%</strong>{' '}
                      <span className="text-slate-400 text-[10.5px]">({c.comiteVal}%)</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Universidad */}
            <div className="bg-white border-2 border-amber-300 rounded-xl p-4 shadow-2xs space-y-2 bg-amber-50/20">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-[#152238] uppercase tracking-wider">
                  Universidad de origen
                </span>
                <span className="text-[10px] text-amber-800 font-bold bg-amber-100 px-1.5 py-0.2 rounded">Sube a 46%</span>
              </div>
              <div className="h-36 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={PERFIL_COHORTE_DONAS.universidad} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" paddingAngle={2}>
                      {PERFIL_COHORTE_DONAS.universidad.map((e, idx) => (
                        <Cell key={`u-sel-${idx}`} fill={e.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => [`${v}%`, 'Cohorte seleccionada']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1 text-xs">
                {PERFIL_COHORTE_DONAS.universidad.map((c) => (
                  <div key={c.name} className="flex justify-between items-center text-slate-600">
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />{c.name}</span>
                    <span className="font-mono">
                      <strong className="text-slate-900">{c.value}%</strong>{' '}
                      <span className="text-slate-400 text-[10.5px]">({c.comiteVal}%)</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Ruta */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-[#152238] uppercase tracking-wider">
                  Ruta de postulación
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Cohorte vs Comité</span>
              </div>
              <div className="h-36 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={PERFIL_COHORTE_DONAS.ruta} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" paddingAngle={2}>
                      {PERFIL_COHORTE_DONAS.ruta.map((e, idx) => (
                        <Cell key={`r-sel-${idx}`} fill={e.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => [`${v}%`, 'Cohorte seleccionada']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1 text-xs">
                {PERFIL_COHORTE_DONAS.ruta.map((c) => (
                  <div key={c.name} className="flex justify-between items-center text-slate-600">
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />{c.name}</span>
                    <span className="font-mono">
                      <strong className="text-slate-900">{c.value}%</strong>{' '}
                      <span className="text-slate-400 text-[10.5px]">({c.comiteVal}%)</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Enfoque */}
            <div className="bg-white border-2 border-rose-300 rounded-xl p-4 shadow-2xs space-y-2 bg-rose-50/20">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-[#152238] uppercase tracking-wider">
                  Enfoque de formación
                </span>
                <span className="text-[10px] text-rose-800 font-bold bg-rose-100 px-1.5 py-0.2 rounded">STEM cae a 15%</span>
              </div>
              <div className="h-36 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={PERFIL_COHORTE_DONAS.enfoque} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" paddingAngle={2}>
                      {PERFIL_COHORTE_DONAS.enfoque.map((e, idx) => (
                        <Cell key={`ef-sel-${idx}`} fill={e.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => [`${v}%`, 'Cohorte seleccionada']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1 text-xs">
                {PERFIL_COHORTE_DONAS.enfoque.map((c) => (
                  <div key={c.name} className="flex justify-between items-center text-slate-600">
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />{c.name}</span>
                    <span className="font-mono">
                      <strong className={c.name === 'STEM' ? 'text-rose-700' : 'text-slate-900'}>{c.value}%</strong>{' '}
                      <span className="text-slate-400 text-[10.5px]">({c.comiteVal}%)</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Edad */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-[#152238] uppercase tracking-wider">
                  Grupos de edad
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Cohorte vs Comité</span>
              </div>
              <div className="h-36 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={PERFIL_COHORTE_DONAS.edad} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" paddingAngle={2}>
                      {PERFIL_COHORTE_DONAS.edad.map((e, idx) => (
                        <Cell key={`ed-sel-${idx}`} fill={e.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => [`${v}%`, 'Cohorte seleccionada']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1 text-xs">
                {PERFIL_COHORTE_DONAS.edad.map((c) => (
                  <div key={c.name} className="flex justify-between items-center text-slate-600">
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />{c.name}</span>
                    <span className="font-mono">
                      <strong className="text-slate-900">{c.value}%</strong>{' '}
                      <span className="text-slate-400 text-[10.5px]">({c.comiteVal}%)</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. Territorio */}
            <div className="bg-white border-2 border-indigo-200 rounded-xl p-4 shadow-2xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-[#152238] uppercase tracking-wider">
                  Territorio
                </span>
                <span className="text-[10px] text-indigo-900 font-bold bg-indigo-50 px-1.5 py-0.2 rounded">Cundinamarca 56%</span>
              </div>
              <div className="h-36 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={PERFIL_COHORTE_DONAS.territorio} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" paddingAngle={2}>
                      {PERFIL_COHORTE_DONAS.territorio.map((e, idx) => (
                        <Cell key={`t-sel-${idx}`} fill={e.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => [`${v}%`, 'Cohorte seleccionada']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1 text-xs">
                {PERFIL_COHORTE_DONAS.territorio.slice(0, 4).map((c) => (
                  <div key={c.name} className="flex justify-between items-center text-slate-600">
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />{c.name}</span>
                    <span className="font-mono">
                      <strong className="text-slate-900">{c.value}%</strong>{' '}
                      <span className="text-slate-400 text-[10.5px]">({c.comiteVal}%)</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabla comparativa: Comité (129) frente a Cohorte Seleccionada (61) */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3 print-avoid-break">
            <h4 className="text-xs font-black text-[#152238] uppercase tracking-wider">
              Comité (129) frente a Cohorte seleccionada (61):
            </h4>
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#152238] text-white uppercase text-[10px] font-black tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Dimensión</th>
                    <th className="py-2.5 px-3">Comité (129)</th>
                    <th className="py-2.5 px-3">Cohorte seleccionada (61)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {COMPARATIVO_COMITE_VS_SELECCIONADOS.map((row, idx) => (
                    <tr
                      key={row.dimension}
                      className={
                        row.destacado
                          ? 'bg-amber-50/60 font-semibold text-slate-900'
                          : idx % 2 === 0
                          ? 'bg-white'
                          : 'bg-slate-50/60'
                      }
                    >
                      <td className="py-2.5 px-3 font-bold text-[#152238] flex items-center gap-1.5">
                        {row.destacado && <span className="w-1.5 h-1.5 rounded-full bg-[#F2A900]" />}
                        <span>{row.dimension}</span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">{row.comite129}</td>
                      <td className="py-2.5 px-3 font-bold">{row.cohorte61}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bloque: Datos que solo existen para la cohorte seleccionada */}
          <div className="bg-slate-900 text-white rounded-xl p-5 sm:p-6 shadow-md space-y-3 print-avoid-break">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <Sparkles className="w-4 h-4 text-[#F2A900]" />
              <h4 className="text-xs font-black uppercase tracking-wider text-amber-400">
                Datos que solo existen para la cohorte seleccionada (base de Matriculados)
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1 text-xs">
              <div className="bg-slate-800/80 p-3.5 rounded-lg border border-slate-700">
                <span className="text-slate-400 font-bold block mb-1">Género</span>
                <p className="font-semibold text-slate-200">{DATOS_EXCLUSIVOS_COHORTE_SELECCIONADA.genero}</p>
              </div>
              <div className="bg-slate-800/80 p-3.5 rounded-lg border border-slate-700">
                <span className="text-slate-400 font-bold block mb-1">Colegio</span>
                <p className="font-semibold text-slate-200">{DATOS_EXCLUSIVOS_COHORTE_SELECCIONADA.colegio}</p>
              </div>
              <div className="bg-slate-800/80 p-3.5 rounded-lg border border-slate-700">
                <span className="text-slate-400 font-bold block mb-1">Estrato</span>
                <p className="font-semibold text-slate-200">{DATOS_EXCLUSIVOS_COHORTE_SELECCIONADA.estrato}</p>
              </div>
              <div className="bg-slate-800/80 p-3.5 rounded-lg border border-slate-700">
                <span className="text-slate-400 font-bold block mb-1">Edad promedio</span>
                <p className="font-bold text-amber-400 text-lg">{DATOS_EXCLUSIVOS_COHORTE_SELECCIONADA.edadPromedio}</p>
              </div>
              <div className="bg-slate-800/80 p-3.5 rounded-lg border border-slate-700 sm:col-span-2">
                <span className="text-slate-400 font-bold block mb-1">Inglés autodeclarado</span>
                <p className="font-semibold text-slate-200">{DATOS_EXCLUSIVOS_COHORTE_SELECCIONADA.inglesAutodeclarado}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* SECCIÓN 11: CONCLUSIONES Y RECOMENDACIONES (13 ACCIONES) */}
        {/* ------------------------------------------------------------------ */}
        <section id="conclusiones-recomendaciones" className="space-y-6 scroll-mt-24 print-avoid-break">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-2xl sm:text-3xl font-black text-[#152238] tracking-tight flex items-baseline gap-2.5">
              <span className="text-[#F2A900] font-mono">11.</span> Conclusiones y recomendaciones
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {RECOMENDACIONES_FINALES.map((rec) => (
              <div
                key={rec.id}
                className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-all space-y-3 print-avoid-break"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-[#F2A900] text-slate-950 flex items-center justify-center font-mono font-black text-xs shrink-0">
                      #{rec.id}
                    </span>
                    <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider">
                      Hallazgo
                    </h4>
                  </div>
                  <p className="text-xs sm:text-[13px] font-bold text-[#152238] leading-snug">
                    {rec.hallazgo}
                  </p>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs sm:text-[13px] text-slate-700 leading-relaxed">
                    <strong className="text-slate-900 block mb-0.5 font-bold">Recomendación:</strong>
                    {rec.recomendacion}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">Impacto esperado:</span>
                  <span className="font-bold text-[#2E9E82] text-right">{rec.impactoEsperado}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* SECCIÓN 12: ANEXO (AJUSTE 7: Solo documento de entrega oficial) */}
        {/* ------------------------------------------------------------------ */}
        <section id="anexo" className="space-y-6 scroll-mt-24 border-t border-slate-200 pt-10 print-avoid-break">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-2xl sm:text-3xl font-black text-[#152238] tracking-tight flex items-baseline gap-2.5">
              <span className="text-[#F2A900] font-mono">12.</span> Anexo
            </h2>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-2xs space-y-4">
            <h4 className="text-xs font-black text-[#152238] uppercase tracking-wider">
              12.1 Notas metodológicas
            </h4>
            <ul className="list-disc pl-5 text-xs sm:text-[13px] text-slate-600 space-y-2 leading-relaxed">
              <li>
                Las cifras son las oficiales, conciliadas entre el dashboard y los Master de cada etapa.
              </li>
              <li>
                Las conversiones por perfil (secciones 9 y 10) cruzan por persona{' '}
                <code className="bg-slate-100 px-1 py-0.5 rounded text-xs font-mono">Data_Raw_Conv</code>{' '}
                con los Master de Lecturas, Entrevistas y LIDERA Lab, usando el Id de Primera Revisión de Salesforce.
              </li>
              <li>
                La conversión de referencia elegible → comité es <strong>11,3% (129 de 1.138)</strong>. La conversión desde postulantes es <strong>7,9% (130 de 1.641)</strong>.
              </li>
              <li>
                La cohorte seleccionada (61) sale de la base de Matriculados al 6 de noviembre de 2026 y se cruza con{' '}
                <code className="bg-slate-100 px-1 py-0.5 rounded text-xs font-mono">Data_Raw_Conv</code> por cédula para canal, universidad, ruta, enfoque, edad, territorio y grupo étnico (cruzan las 61). Las tasas de selección en comité (sección 8) usan como base las 129 personas de comité con perfil completo.
              </li>
              <li>
                Los grupos con menos de 30 personas (por ejemplo, raizales, palenqueros o inglés C2) se muestran, pero sus porcentajes no deben leerse como tendencia.
              </li>
            </ul>

            <h4 className="text-xs font-black text-[#152238] uppercase tracking-wider pt-3 border-t border-slate-100">
              12.2 Enlaces
            </h4>
            {/* Solo enlace al documento de entrega del proceso CSM LIDERA (AJUSTE 7) */}
            <div className="pt-1">
              <a
                href={ENLACE_DOCUMENTO_ENTREGA.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 transition-colors text-xs font-bold shadow-2xs group"
              >
                <ExternalLink className="w-4 h-4 text-blue-600 group-hover:translate-x-0.5 transition-transform" />
                <span>{ENLACE_DOCUMENTO_ENTREGA.titulo}</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ==================================================================== */}
      {/* BOTÓN FLOTANTE "VOLVER AL INICIO" (Oculto en impresión) */}
      {/* ==================================================================== */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.2 }}
            onClick={scrollToTop}
            data-html2canvas-ignore="true"
            className="fixed bottom-6 right-6 z-40 p-3 bg-[#152238] text-white hover:bg-slate-900 rounded-full shadow-xl border-2 border-amber-400 hover:border-amber-300 transition-all flex items-center justify-center cursor-pointer group print:hidden"
            title="Volver al inicio del reporte"
            aria-label="Volver al inicio"
          >
            <ArrowUp className="w-5 h-5 text-amber-400 group-hover:-translate-y-0.5 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>
      {/* Modal de Descarga de PDF para garantizar entrega en iframe / navegador */}
      <AnimatePresence>
        {downloadModal.isOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
            data-html2canvas-ignore="true"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden p-6 sm:p-7 space-y-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${downloadModal.blobUrl ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                    {downloadModal.blobUrl ? (
                      <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-7 h-7 text-amber-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-[#152238] tracking-tight">
                      {downloadModal.blobUrl ? '¡Reporte PDF Generado con Éxito!' : 'Exportación del Reporte'}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Cohorte 2027 • Enseña por Colombia
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDownloadModal({ isOpen: false })}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {downloadModal.blobUrl ? (
                <div className="space-y-4">
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    El documento oficial (12 secciones completas) ha sido generado con éxito en formato Carta (Letter) de alta fidelidad. Selecciona tu opción de descarga preferida:
                  </p>

                  <div className="space-y-2.5 pt-1">
                    {/* Opción 1: Descarga directa de archivo */}
                    <a
                      href={downloadModal.blobUrl}
                      download="Reporte_Final_Convocatoria_LIDERA_Cohorte_2027.pdf"
                      className="w-full flex items-center justify-center gap-2.5 px-4 py-3 bg-[#152238] hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer group"
                    >
                      <Download className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                      <span>1. Guardar archivo PDF (.pdf) en tu equipo</span>
                    </a>

                    {/* Opción 2: Abrir visor PDF en pestaña nueva */}
                    <a
                      href={downloadModal.blobUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 font-bold text-xs rounded-xl border border-emerald-300 transition-colors cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-emerald-700" />
                      <span>2. Abrir PDF en pestaña nueva (con botón de descarga nativo)</span>
                    </a>

                    {/* Opción 3: Abrir dashboard fuera del iframe */}
                    <a
                      href={window.location.href}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl border border-slate-300 transition-colors cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                      <span>3. Abrir dashboard en pestaña independiente (sin marco/iframe)</span>
                    </a>

                    {/* Opción 4: Imprimir directamente */}
                    <button
                      type="button"
                      onClick={() => {
                        setDownloadModal({ isOpen: false });
                        handleImprimirSistema();
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-1.5 text-slate-500 hover:text-slate-800 font-medium text-xs transition-colors cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-400" />
                      <span>4. O guardar usando el diálogo de impresión (Ctrl+P)</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {downloadError || 'Ocurrió una pausa al renderizar el documento completo.'}
                  </p>
                  <div className="space-y-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setDownloadModal({ isOpen: false });
                        handleImprimirSistema();
                      }}
                      className="w-full flex items-center justify-center gap-2.5 px-4 py-3 bg-[#152238] hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer"
                    >
                      <Printer className="w-4 h-4 text-amber-400" />
                      <span>Guardar como PDF usando Imprimir (Ctrl+P)</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="border-t border-slate-100 pt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => setDownloadModal({ isOpen: false })}
                  className="px-4 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

import React, { useEffect, useState, useMemo } from 'react';
import { LabRecord, CombinablePerfilFilterState } from '../../types';
import { labDataStore } from '../../lib/labDataStore';
import {
  calculateLabGeneralKpis,
  calculateLabEmbudo,
  isLabAceptado
} from '../../lib/labMetricsCalculator';
import { SectionLevelHeader } from '../common/SectionLevelHeader';
import { DashboardViewHeader } from '../common/DashboardViewHeader';
import { LabHeaderKPIs } from './LabHeaderKPIs';
import { LabEmbudo } from './LabEmbudo';
import { CardResultadosLab } from './CardResultadosLab';
import { CardPerfilSeleccionadosLab } from './CardPerfilSeleccionadosLab';
import { CardsComposicionSeleccionadosLab } from './CardsComposicionSeleccionadosLab';
import { DirectorioCandidatos } from './DirectorioCandidatos';
import { FichaCandidatoPanel } from './FichaCandidatoPanel';
import { AlertTriangle } from 'lucide-react';

interface Props {
  totalCumplenMinimosProp?: number;
}

export const LabDashboardView: React.FC<Props> = ({ totalCumplenMinimosProp }) => {
  const [records, setRecords] = useState<LabRecord[]>(() => labDataStore.getRecords());
  const [selectedCandidate, setSelectedCandidate] = useState<LabRecord | null>(null);
  const [isFichaOpen, setIsFichaOpen] = useState(false);
  const [directorioInitialFilter, setDirectorioInitialFilter] = useState('TODOS');

  // Estado de filtros estratégicos combinables (concatenados con AND)
  const [perfilFilters, setPerfilFilters] = useState<CombinablePerfilFilterState>({
    uniPriorizada: true,
    bilingue: false,
    stem: false,
    stemOrBilingue: false,
    menores30: false
  });

  const handleToggleFilter = (key: keyof CombinablePerfilFilterState) => {
    setPerfilFilters(prev => {
      const next = { ...prev, [key]: !prev[key] };
      if (key === 'stemOrBilingue' && next.stemOrBilingue) {
        next.stem = false;
        next.bilingue = false;
      }
      if ((key === 'stem' || key === 'bilingue') && next[key]) {
        next.stemOrBilingue = false;
      }
      return next;
    });
  };

  const handleResetFilters = () => {
    setPerfilFilters({
      uniPriorizada: false,
      bilingue: false,
      stem: false,
      stemOrBilingue: false,
      menores30: false
    });
  };

  useEffect(() => {
    const unsub = labDataStore.subscribe(() => {
      setRecords(labDataStore.getRecords());
    });
    return () => unsub();
  }, []);

  const kpis = useMemo(() => {
    return calculateLabGeneralKpis(records);
  }, [records]);

  const embudo = useMemo(() => {
    const elegibles = totalCumplenMinimosProp && totalCumplenMinimosProp > 0 ? totalCumplenMinimosProp : 1138;
    return calculateLabEmbudo(records, 2022, elegibles);
  }, [records, totalCumplenMinimosProp]);

  // Universo base de aceptados en Lab
  const aceptadosLab = useMemo(() => {
    return records.filter(
      r => r.evaluacion_completa === 'Si' && isLabAceptado(r.opinion_evaluador_lab)
    );
  }, [records]);

  const hasActiveFilters =
    perfilFilters.menores30 ||
    perfilFilters.stem ||
    perfilFilters.bilingue ||
    perfilFilters.stemOrBilingue ||
    perfilFilters.uniPriorizada;

  // Candidatos aceptados que cumplen los filtros combinados activos
  const filteredAceptados = useMemo(() => {
    if (!hasActiveFilters) return aceptadosLab;

    return aceptadosLab.filter(r => {
      const edadNum = typeof r.edad === 'number' ? r.edad : Number(r.edad);
      const isMenor30 = !isNaN(edadNum) && edadNum > 0 ? edadNum < 30 : false;
      const isPrio = String(r.uni_prioritaria).toUpperCase() === 'SI';
      const isBil = Boolean(r.is_bilingual);
      const isStm = Boolean(r.is_stem);
      const isStmOrBil = isStm || isBil;

      if (perfilFilters.menores30 && !isMenor30) return false;
      if (perfilFilters.uniPriorizada && !isPrio) return false;
      if (perfilFilters.stemOrBilingue && !isStmOrBil) return false;
      if (perfilFilters.stem && !isStm) return false;
      if (perfilFilters.bilingue && !isBil) return false;

      return true;
    });
  }, [aceptadosLab, hasActiveFilters, perfilFilters]);

  const handleOpenFicha = (cand: LabRecord) => {
    setSelectedCandidate(cand);
    setIsFichaOpen(true);
  };

  const handleFilterNoAsistieron = () => {
    setDirectorioInitialFilter('TODOS');
    const dirElement = document.getElementById('directorio-candidatos-section');
    if (dirElement) {
      dirElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-8">
      {/* FRANJA VISIBLE DE DATOS DE EJEMPLO */}
      <div className="bg-amber-50 border border-amber-300/80 rounded-xl px-4 py-2.5 flex items-center justify-between gap-3 text-amber-950 shadow-xs">
        <div className="flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="text-xs font-bold">
            Datos de ejemplo — no son candidatos reales (~140 registros simulados para validación de interfaz)
          </span>
        </div>
        <span className="text-[10px] font-black uppercase tracking-wider bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded">
          Etapa 1 (Prototipo UI)
        </span>
      </div>

      {/* 1. Header con tema corporativo limpio */}
      <DashboardViewHeader
        dashboardName="Dashboard LIDERA Lab"
        viewName="Progreso y Evaluación"
        theme="amber"
        cohortBadge="Cohorte 2027"
        subtitle="Jornada presencial de evaluación a la que llegan los candidatos aceptados en Entrevistas, asistencia a jornadas, competencias y paso a matriculación."
      />

      {/* NIVEL 1 — INDICADORES GENERALES Y EMBUDO DE CONVERSIÓN */}
      <section className="space-y-4">
        <SectionLevelHeader
          level={1}
          title="Indicadores Generales y Embudo de Conversión"
          theme="amber"
        />

        {/* Embudo de cohorte horizontal */}
        <LabEmbudo embudo={embudo} />

        {/* 4 KPI Cards */}
        <LabHeaderKPIs kpis={kpis} onFilterNoAsistieron={handleFilterNoAsistieron} />
      </section>

      {/* NIVEL 2: Sección Candidato — Resultados y Perfil Estratégico (Estructura idéntica a Entrevistas) */}
      <section className="space-y-5">
        <SectionLevelHeader
          level={2}
          title="Sección Candidato — Resultados y Perfil Estratégico"
          theme="amber"
        />

        {/* Fila 1 superior: Resultados y Perfil de Seleccionados (2 columnas lado a lado) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
          <CardResultadosLab records={records} />
          <CardPerfilSeleccionadosLab
            records={records}
            filters={perfilFilters}
            onToggleFilter={handleToggleFilter}
            onResetFilters={handleResetFilters}
          />
        </div>

        {/* Fila 2 (4 tarjetas individuales de perfil) y Fila 3 (Ciudad a todo el ancho) afectadas por los filtros */}
        <CardsComposicionSeleccionadosLab
          records={filteredAceptados}
          totalAceptadosBase={aceptadosLab.length}
          hasActiveFilters={hasActiveFilters}
        />
      </section>

      {/* NIVEL 3 — DIRECTORIO DE CANDIDATOS E HISTORIAL INTEGRAL (Encabezado Azul Navy como en Entrevistas) */}
      <section id="directorio-candidatos-section" className="space-y-4">
        <SectionLevelHeader
          level={3}
          title="Directorio de Candidatos e Historial de Postulantes"
          theme="navy"
          badgeText="Nivel 3"
        />

        <DirectorioCandidatos
          records={records}
          onSelectCandidate={handleOpenFicha}
          initialFilter={directorioInitialFilter}
        />
      </section>

      {/* Ficha Lateral de la Persona (Slide-over Modal) */}
      <FichaCandidatoPanel
        candidate={selectedCandidate}
        isOpen={isFichaOpen}
        onClose={() => setIsFichaOpen(false)}
      />
    </div>
  );
};

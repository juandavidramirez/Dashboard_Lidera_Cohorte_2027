import React, { useState, useEffect, useMemo } from 'react';
import { dataStore } from './lib/dataStore';
import { Candidate, GoalTarget, UniversityMapping } from './types';
import {
  calculateEligibleCount,
  calculateProfileComposition,
  calculateMonthlyEligibilityStats,
  calculateYoyMonthlyStats,
  calculateChannelMixStats,
  calculateSynchronizedGoals
} from './lib/metricsCalculator';
import { Header } from './components/Header';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { KpiHeaderBand } from './components/KpiHeaderBand';
import { PanelEligibilityRate } from './components/panels/PanelEligibilityRate';
import { PanelProfileComposition } from './components/panels/PanelProfileComposition';
import { PanelYoyVolume } from './components/panels/PanelYoyVolume';
import { PanelChannelMix } from './components/panels/PanelChannelMix';
import { CandidateTable } from './components/CandidateTable';
import { CandidateDetailModal } from './components/CandidateDetailModal';
import { UniversityNormalization } from './components/UniversityNormalization';
import { GoalSettings } from './components/GoalSettings';
import { ToastContainer, ToastMessage } from './components/Toast';

export default function App() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [goals, setGoals] = useState<GoalTarget[]>([]);
  const [universities, setUniversities] = useState<UniversityMapping[]>([]);

  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Subscribe to dataStore updates
  useEffect(() => {
    const updateLocalState = () => {
      setCandidates(dataStore.getCandidates());
      setGoals(dataStore.getGoals());
      setUniversities(dataStore.getUniversities());
    };

    updateLocalState();
    const unsubscribe = dataStore.subscribe(updateLocalState);
    return () => unsubscribe();
  }, []);

  // Toast Helpers
  const addToast = (type: ToastMessage['type'], title: string, message: string) => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Actions
  const handleUpdateCandidate = (id: string, updates: Partial<Candidate>) => {
    dataStore.updateCandidate(id, updates);
    addToast('success', 'Registro Actualizado', 'Los datos del candidato fueron modificados con éxito.');
  };

  const handleDeleteCandidate = (id: string) => {
    dataStore.deleteCandidate(id);
    addToast('info', 'Registro Eliminado', 'Se eliminó el candidato del Formulario de Interés.');
  };

  const handleBatchAction = (
    ids: string[],
    action: 'set_eligible' | 'set_not_eligible' | 'flag_hpc'
  ) => {
    dataStore.batchUpdateCandidates(ids, action);
    addToast('success', 'Acción Masiva Ejecutada', `Se aplicó el cambio a ${ids.length} postulantes.`);
  };

  const handleAddCandidate = (candData: Omit<Candidate, 'id'>) => {
    const created = dataStore.addCandidate(candData);
    addToast(
      'success',
      'Postulante Registrado',
      `Registrado/a ${created.fullName} (${created.eligibility}).`
    );
  };

  const handleUpdateGoal = (id: string, newTarget: number) => {
    dataStore.updateGoal(id, newTarget);
    addToast('success', 'Meta Actualizada', `La meta objetivo fue ajustada a ${newTarget}.`);
  };

  const handleAddUniversityVariant = (uniId: string, variant: string) => {
    dataStore.addUniversityVariant(uniId, variant);
    addToast('success', 'Variante Agregada', `Variante "${variant}" vinculada al catálogo oficial.`);
  };

  const handleSyncSheets = async () => {
    setIsSyncing(true);
    const status = dataStore.getSupabaseStatus();

    if (status.configured) {
      const success = await dataStore.loadFromSupabase();
      setIsSyncing(false);
      if (success) {
        addToast(
          'success',
          'Sincronización Supabase',
          'Se han actualizado los registros en vivo directamente desde la base de datos Supabase.'
        );
      } else {
        addToast(
          'error',
          'Error de Conexión',
          `No se pudo sincronizar desde Supabase: ${status.error || 'Verifica las credenciales'}`
        );
      }
    } else {
      setTimeout(() => {
        setIsSyncing(false);
        addToast(
          'info',
          'Modo Almacenamiento Local',
          'Se han refrescado los datos en pantalla. Configura Supabase en el encabezado para vincular tu base de datos viva.'
        );
      }, 500);
    }
  };

  const handleResetData = () => {
    if (confirm('¿Deseas restablecer los datos del dashboard a los valores iniciales de prueba?')) {
      dataStore.resetToDefault();
      addToast('info', 'Datos Restablecidos', 'El dashboard volvió al estado semilla inicial.');
    }
  };

  // Dynamic Derived Metrics from Real Candidates Dataset (Supabase / DataStore)
  const eligibleCount = useMemo(() => calculateEligibleCount(candidates), [candidates]);
  const profileComp = useMemo(() => calculateProfileComposition(candidates), [candidates]);
  const monthlyStats = useMemo(() => calculateMonthlyEligibilityStats(candidates), [candidates]);
  const yoyStats = useMemo(() => calculateYoyMonthlyStats(candidates), [candidates]);
  const channelStats = useMemo(() => calculateChannelMixStats(candidates), [candidates]);
  const synchronizedGoals = useMemo(() => calculateSynchronizedGoals(goals, candidates), [goals, candidates]);

  const mainGoal = synchronizedGoals.find((g) => g.id === 'goal-1');
  const totalGoalTarget = mainGoal ? mainGoal.target2027 : 1000;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 antialiased selection:bg-[#2E9E82] selection:text-white">
      {/* Top Header */}
      <Header
        onSyncSheets={handleSyncSheets}
        onResetData={handleResetData}
        isSyncing={isSyncing}
        totalCandidatesCount={candidates.length}
      />

      <div className="flex-1 flex flex-col md:flex-row w-full mx-auto p-4 md:p-6 gap-6">
        {/* Persistent Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          candidateCount={candidates.length}
          eligibleCount={eligibleCount}
        />

        {/* Main Dashboard Content */}
        <main className="flex-1 min-w-0 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Header Band KPI + Segmented Progress Bar */}
              <KpiHeaderBand
                eligibleCount={eligibleCount}
                totalGoal={totalGoalTarget}
                yoyGrowthPct={14.2}
                goalTarget={mainGoal}
              />

              {/* 2x2 Panel Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Panel A: Eligibility Rate */}
                <PanelEligibilityRate monthlyStats={monthlyStats} />

                {/* Panel B: Profile Composition */}
                <PanelProfileComposition
                  stemCount={profileComp.stemCount}
                  bilingualCount={profileComp.bilingualCount}
                  totalEligible={eligibleCount}
                />

                {/* Panel C: YoY Volume & Monthly Trend */}
                <PanelYoyVolume
                  yoyData={yoyStats}
                  total2027={eligibleCount}
                  total2026={Math.round(eligibleCount * 0.88)}
                />

                {/* Panel D: Channel Mix Trend */}
                <PanelChannelMix channelData={channelStats} />
              </div>

              {/* Candidates Data Grid Table */}
              <CandidateTable
                candidates={candidates}
                onUpdateCandidate={handleUpdateCandidate}
                onDeleteCandidate={handleDeleteCandidate}
                onBatchAction={handleBatchAction}
                onSelectCandidate={(cand) => {
                  setSelectedCandidate(cand);
                  setIsDetailModalOpen(true);
                }}
              />
            </div>
          )}

          {activeTab === 'candidates' && (
            <div className="space-y-6">
              <CandidateTable
                candidates={candidates}
                onUpdateCandidate={handleUpdateCandidate}
                onDeleteCandidate={handleDeleteCandidate}
                onBatchAction={handleBatchAction}
                onSelectCandidate={(cand) => {
                  setSelectedCandidate(cand);
                  setIsDetailModalOpen(true);
                }}
              />
            </div>
          )}

          {activeTab === 'universities' && (
            <UniversityNormalization
              candidates={candidates}
              universities={universities}
              onAddVariant={handleAddUniversityVariant}
            />
          )}

          {activeTab === 'goals' && (
            <GoalSettings goals={synchronizedGoals} onUpdateGoal={handleUpdateGoal} />
          )}
        </main>
      </div>

      {/* System Status Footer Bar */}
      <footer className="h-8 border-t border-slate-200 px-6 flex items-center justify-between bg-white text-[10px] font-semibold text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Sistema Operativo: Google Sheets Vivo (Sincronizado)
          </span>
          <span className="text-slate-300">|</span>
          <span>Ecosistema Convocatoria CSM LIDERA 2027</span>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <span>Seguridad: Ley 1581 HABEAS DATA / Encriptado SSL</span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500 font-bold">Enseña por Colombia © 2027</span>
        </div>
      </footer>

      {/* Candidate View / Edit Detail Modal */}
      <CandidateDetailModal
        candidate={selectedCandidate}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onSave={handleUpdateCandidate}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}

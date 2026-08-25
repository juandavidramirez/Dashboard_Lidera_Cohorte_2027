import { createClient } from '@supabase/supabase-js';
import { isFormCompleted, isCandidateEligible, isPrioritariasUni } from './src/lib/metricsCalculator';
import { rowToCandidate } from './src/lib/dataStore';

const supabaseUrl = 'https://muyqxxzjcgwyvluzumbt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11eXF4eHpqY2d3eXZsdXp1bWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxODAzODAsImV4cCI6MjEwMDc1NjM4MH0.dbcSNdYK4psdcAI1XapaTAIkQrZttglJ_kkgODZsICg';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  let allRemoteData: any[] = [];
  let fetchMore = true;
  let rangeStart = 0;
  const step = 1000;

  while (fetchMore) {
    const { data: candData, error: candError } = await supabase
      .from('candidates_convocatoria')
      .select('*')
      .order('registration_date', { ascending: false })
      .range(rangeStart, rangeStart + step - 1);

    if (candError) throw candError;

    if (candData && candData.length > 0) {
      allRemoteData = [...allRemoteData, ...candData];
      if (candData.length < step) {
        fetchMore = false;
      } else {
        rangeStart += step;
      }
    } else {
      fetchMore = false;
    }
  }

  const allCandidates = allRemoteData.map(rowToCandidate);

  const completed = allCandidates.filter(isFormCompleted);
  const incomplete = allCandidates.filter(c => !isFormCompleted(c));

  const eligibleCount = completed.filter(isCandidateEligible).length;
  const totalCompleted = completed.length;
  const rate = totalCompleted > 0 ? (eligibleCount / totalCompleted) * 100 : 0;
  const top7 = completed.filter(isPrioritariasUni).length;

  const incompleteCount = incomplete.length;
  const potentialEligibleIncompleteCount = incomplete.filter(isCandidateEligible).length;

  console.log(`--- INDICADORES NIVEL 1 ACTUALES ---`);
  console.log(`Total Postulantes (Completos): ${totalCompleted}`);
  console.log(`Elegibles: ${eligibleCount}`);
  console.log(`Tasa Elegibilidad: ${rate.toFixed(1)}%`);
  console.log(`Postulantes Top 7 (Prioritarias): ${top7}`);
  console.log(`Formularios Incompletos: ${incompleteCount}`);
  console.log(`Potencial Elegibles (Incompletos): ${potentialEligibleIncompleteCount}`);
}

run().catch(console.error);

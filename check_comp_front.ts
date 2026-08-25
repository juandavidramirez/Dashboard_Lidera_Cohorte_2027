import { createClient } from '@supabase/supabase-js';
import { isFormCompleted, isCandidateEligible, isPrioritariasUni, isProfessional } from './src/lib/metricsCalculator';
import { rowToCandidate } from './src/lib/dataStore';

const supabase = createClient(
  'https://muyqxxzjcgwyvluzumbt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11eXF4eHpqY2d3eXZsdXp1bWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxODAzODAsImV4cCI6MjEwMDc1NjM4MH0.dbcSNdYK4psdcAI1XapaTAIkQrZttglJ_kkgODZsICg'
);

async function run() {
  let allRemoteData: any[] = [];
  let fetchMore = true;
  let rangeStart = 0;
  const step = 1000;

  while (fetchMore) {
    const { data: candData, error: candError } = await supabase
      .from('candidates_convocatoria')
      .select('*')
      .order('fecha_creacion', { ascending: false })
      .order('id', { ascending: true })
      .range(rangeStart, rangeStart + step - 1);

    if (candError) throw candError;
    if (candData && candData.length > 0) {
      allRemoteData = [...allRemoteData, ...candData];
      if (candData.length < step) fetchMore = false;
      else rangeStart += step;
    } else {
      fetchMore = false;
    }
  }

  const allCandidates = allRemoteData.map(rowToCandidate);
  const completed = allCandidates.filter(isFormCompleted);
  const eligible = completed.filter(isCandidateEligible);

  // calculate profile composition over completed (like dashboard)
  let stemCount = 0;
  let b2Count = 0;
  let bothCount = 0;
  
  // Actually dashboard computes it over what? Let's read App.tsx or metricsCalculator.ts
  completed.forEach(c => {
    if (c.isStem) stemCount++;
    if (c.isBilingual) b2Count++;
    if (c.isStem && c.isBilingual) bothCount++;
  });
  
  console.log(`STEM over completed: ${(stemCount/completed.length)*100}%`);
  console.log(`STEM over eligible: ${(stemCount/eligible.length)*100}%`);
  
  let pStemCount = 0;
  let pB2Count = 0;
  eligible.forEach(c => {
    if (c.isStem) pStemCount++;
    if (c.isBilingual) pB2Count++;
  });
  console.log(`STEM exactly inside eligible: ${(pStemCount/eligible.length)*100}%`);
  console.log(`B2 exactly inside eligible: ${(pB2Count/eligible.length)*100}%`);

}

run().catch(console.error);

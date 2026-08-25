import { createClient } from '@supabase/supabase-js';
import { isFormCompleted, isCandidateEligible } from './src/lib/metricsCalculator';
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
    const { data: candData } = await supabase
      .from('candidates_convocatoria')
      .select('*')
      .order('fecha_creacion', { ascending: false })
      .order('id', { ascending: true })
      .range(rangeStart, rangeStart + step - 1);
    
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
  
  console.log(`Front-end count logic:`);
  console.log(`Total Candidates: ${allCandidates.length}`);
  console.log(`Completed Candidates: ${completed.length}`);
  console.log(`Eligible Candidates: ${eligible.length}`);
}

run().catch(console.error);

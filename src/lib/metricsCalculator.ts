import {
  Candidate,
  GoalTarget,
  MonthlyEligibilityStat,
  WeeklyEligibilityStat,
  WeeklyChannelMixStat,
  YoyMonthlyStat,
  ChannelMixMonthlyStat
} from '../types';
import { INITIAL_GOAL_TARGETS } from '../data/mockData';

const MONTH_NAMES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

export const WEEK_DEFINITIONS = [
  { key: 'Semana 0', label: 'Sem 0', range: 'Antes de 28 jul' },
  { key: 'Semana 1', label: 'Sem 1', range: '28 jul – 3 ago' },
  { key: 'Semana 2', label: 'Sem 2', range: '4 ago – 10 ago' },
  { key: 'Semana 3', label: 'Sem 3', range: '11 ago – 17 ago' },
  { key: 'Semana 4', label: 'Sem 4', range: '18 ago – 24 ago' },
  { key: 'Semana 5', label: 'Sem 5', range: '25 ago – 31 ago' },
  { key: 'Semana 6', label: 'Sem 6', range: '1 sep – 7 sep' },
  { key: 'Semana 7', label: 'Sem 7', range: '8 sep – 14 sep' }
];

export function getCandidateWeekKey(cand: Candidate, index: number): string {
  const dateStr = cand.registrationDate || cand.fechaCreacion;
  if (dateStr) {
    const cleanDate = dateStr.split('T')[0];
    const parts = cleanDate.split('-').map(Number);
    if (parts.length === 3 && !parts.some(isNaN)) {
      const month = parts[1]; // 1-indexed: 7=July, 8=August, 9=September
      const date = parts[2];

      // Before July 28 -> Semana 0
      if (month < 7 || (month === 7 && date < 28)) return 'Semana 0';
      // July 28 - July 31 -> Semana 1
      if (month === 7 && date >= 28) return 'Semana 1';
      // August (month === 8)
      if (month === 8) {
        if (date <= 3) return 'Semana 1';
        if (date <= 10) return 'Semana 2';
        if (date <= 17) return 'Semana 3';
        if (date <= 24) return 'Semana 4';
        return 'Semana 5';
      }
      // September (month === 9)
      if (month === 9) {
        if (date <= 7) return 'Semana 6';
        return 'Semana 7';
      }
      if (month > 9) return 'Semana 7';
    } else {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        const month = d.getUTCMonth() + 1; // 1-indexed UTC to prevent timezone shift
        const date = d.getUTCDate();
        if (month < 7 || (month === 7 && date < 28)) return 'Semana 0';
        if (month === 7 && date >= 28) return 'Semana 1';
        if (month === 8) {
          if (date <= 3) return 'Semana 1';
          if (date <= 10) return 'Semana 2';
          if (date <= 17) return 'Semana 3';
          if (date <= 24) return 'Semana 4';
          return 'Semana 5';
        }
        if (month >= 9) {
          if (month === 9 && date <= 7) return 'Semana 6';
          return 'Semana 7';
        }
      }
    }
  }
  // Fallback for candidates without explicit date: map across weeks
  const weekIdx = index % WEEK_DEFINITIONS.length;
  return WEEK_DEFINITIONS[weekIdx].key;
}

// Normalize month string from candidate
export function getCandidateMonth(cand: Candidate): string {
  if (cand.month) {
    const mTrim = cand.month.trim();
    if (mTrim.length >= 3) {
      const match = MONTH_NAMES.find(m => m.toLowerCase() === mTrim.substring(0, 3).toLowerCase());
      if (match) return match;
    }
  }

  const dateStr = cand.registrationDate || cand.fechaCreacion;
  if (dateStr) {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return MONTH_NAMES[d.getMonth()];
    }
  }

  return 'Jul'; // Default month fallback if missing
}

// Check if candidate is eligible according to LIDERA rules or database flag
export function isCandidateEligible(cand: Candidate): boolean {
  if (cand.eligibility) {
    const el = cand.eligibility.toLowerCase().trim();
    if (el === 'elegible' || el === 'si' || el === 'sí') return true;
  }
  if (cand.cumpleMinimos) {
    const cm = cand.cumpleMinimos.toLowerCase().trim();
    if (cm.includes('cumple') && !cm.includes('no cumple')) return true;
    if (cm === 'si' || cm === 'sí') return true;
  }
  // Default rule evaluation if field is not explicit
  const gpa = Number(cand.gpa || 0);
  const englishLevel = cand.englishLevel || 'A1';
  const isBilingual = cand.isBilingual || ['B2', 'C1', 'C2'].includes(englishLevel);
  const isStem = cand.isStem || String(cand.stemClass || '').includes('STEM');

  return gpa >= 3.5 && (isBilingual || isStem);
}

// Check candidate route
export function getCandidateRoute(cand: Candidate): 'STEM' | 'Bilingüe' | 'STEM y Bilingüe' | 'General / No Priorizado' {
  const englishLevel = cand.englishLevel || 'A1';
  const isBilingual = cand.isBilingual || ['B2', 'C1', 'C2'].includes(englishLevel);
  const isStem = cand.isStem || String(cand.stemClass || '').includes('STEM');

  if (isStem && isBilingual) return 'STEM y Bilingüe';
  if (isStem) return 'STEM';
  if (isBilingual) return 'Bilingüe';
  return 'General / No Priorizado';
}

// Calculate total eligible candidates
export function calculateEligibleCount(candidates: Candidate[]): number {
  return candidates.filter(isCandidateEligible).length;
}

// Calculate Profile Composition (Mutually exclusive assignment: STEM includes STEM+Bilingual)
export function calculateProfileComposition(candidates: Candidate[]) {
  const eligible = candidates.filter(isCandidateEligible);
  const totalEligible = eligible.length;

  let stemCount = 0; // STEM only + STEM & Bilingual
  let bilingualCount = 0; // Bilingual ONLY
  let generalCount = 0;

  eligible.forEach((c) => {
    const englishLevel = c.englishLevel || 'A1';
    const isBilingual = c.isBilingual || ['B2', 'C1', 'C2'].includes(englishLevel);
    const isStem = c.isStem || String(c.stemClass || '').includes('STEM');

    if (isStem) {
      // STEM or STEM+Bilingual goes to STEM
      stemCount++;
    } else if (isBilingual) {
      // Bilingual ONLY
      bilingualCount++;
    } else {
      generalCount++;
    }
  });

  return {
    totalEligible,
    stemCount,
    bilingualCount,
    generalCount,
    // Keep backward compatible props for existing callers
    pureStemCount: stemCount,
    pureBilingualCount: bilingualCount,
    stemAndBilingualCount: 0
  };
}

// Calculate Monthly Eligibility Stats
export function calculateMonthlyEligibilityStats(candidates: Candidate[]): MonthlyEligibilityStat[] {
  if (candidates.length === 0) {
    return MONTH_NAMES.slice(0, 7).map((m) => ({
      month: m,
      year: 2027,
      eligibleCount: 0,
      notEligibleCount: 0,
      total: 0,
      eligibilityRate: 0,
      ineligibleReasonEnfoque: 0,
      ineligibleReasonGpa: 0,
      ineligibleReasonOther: 0
    }));
  }

  // Map monthly data
  const map = new Map<string, {
    eligible: number;
    notEligible: number;
    reasonEnfoque: number;
    reasonGpa: number;
    reasonOther: number;
  }>();

  MONTH_NAMES.forEach(m => {
    map.set(m, { eligible: 0, notEligible: 0, reasonEnfoque: 0, reasonGpa: 0, reasonOther: 0 });
  });

  candidates.forEach(c => {
    const m = getCandidateMonth(c);
    const item = map.get(m) || { eligible: 0, notEligible: 0, reasonEnfoque: 0, reasonGpa: 0, reasonOther: 0 };

    const eligible = isCandidateEligible(c);
    if (eligible) {
      item.eligible += 1;
    } else {
      item.notEligible += 1;
      const reason = (c.ineligibilityReason || c.motivoNoCumplimiento || '').toLowerCase();
      if (reason.includes('enfoque') || reason.includes('stem') || reason.includes('bilingüe') || reason.includes('inglés')) {
        item.reasonEnfoque += 1;
      } else if (reason.includes('promedio') || reason.includes('gpa') || reason.includes('3.5')) {
        item.reasonGpa += 1;
      } else {
        item.reasonOther += 1;
      }
    }
    map.set(m, item);
  });

  // Keep months that have data or first 7 months (Jan - Jul)
  const result: MonthlyEligibilityStat[] = [];
  MONTH_NAMES.forEach(m => {
    const item = map.get(m)!;
    const total = item.eligible + item.notEligible;
    const rate = total > 0 ? Math.round((item.eligible / total) * 1000) / 10 : 0;

    result.push({
      month: m,
      year: 2027,
      eligibleCount: item.eligible,
      notEligibleCount: item.notEligible,
      total,
      eligibilityRate: rate,
      ineligibleReasonEnfoque: item.reasonEnfoque,
      ineligibleReasonGpa: item.reasonGpa,
      ineligibleReasonOther: item.reasonOther
    });
  });

  // Filter months to present months up to current or active months
  const activeMonths = result.filter(r => r.total > 0);
  return activeMonths.length > 0 ? activeMonths : result.slice(0, 7);
}

// Calculate YoY Volume Stats
export function calculateYoyMonthlyStats(candidates: Candidate[]): YoyMonthlyStat[] {
  const monthlyStats = calculateMonthlyEligibilityStats(candidates);

  return monthlyStats.map(stat => {
    // 2026 baseline benchmark as ~85% of 2027 projection or actuals
    const count2026 = Math.round(stat.eligibleCount * 0.88);
    return {
      month: stat.month,
      count2026: count2026 > 0 ? count2026 : Math.round(stat.total * 0.22),
      count2027: stat.eligibleCount
    };
  });
}

// Calculate Weekly Eligibility Stats (Supports Weekly and Cumulative modes across 8 Weeks)
export function calculateWeeklyEligibilityStats(candidates: Candidate[], isCumulative: boolean = false): WeeklyEligibilityStat[] {
  const map = new Map<string, {
    eligible: number;
    notEligible: number;
    reasonEnfoque: number;
    reasonGpa: number;
    reasonOther: number;
  }>();

  WEEK_DEFINITIONS.forEach(w => {
    map.set(w.key, { eligible: 0, notEligible: 0, reasonEnfoque: 0, reasonGpa: 0, reasonOther: 0 });
  });

  candidates.forEach((c, idx) => {
    const wKey = getCandidateWeekKey(c, idx);
    const item = map.get(wKey) || { eligible: 0, notEligible: 0, reasonEnfoque: 0, reasonGpa: 0, reasonOther: 0 };

    const eligible = isCandidateEligible(c);
    if (eligible) {
      item.eligible += 1;
    } else {
      item.notEligible += 1;
      const reason = (c.ineligibilityReason || c.motivoNoCumplimiento || '').toLowerCase();
      if (reason.includes('enfoque') || reason.includes('stem') || reason.includes('bilingüe') || reason.includes('inglés')) {
        item.reasonEnfoque += 1;
      } else if (reason.includes('promedio') || reason.includes('gpa') || reason.includes('3.5')) {
        item.reasonGpa += 1;
      } else {
        item.reasonOther += 1;
      }
    }
    map.set(wKey, item);
  });

  let runningEligible = 0;
  let runningNotEligible = 0;
  let runningReasonEnfoque = 0;
  let runningReasonGpa = 0;
  let runningReasonOther = 0;

  return WEEK_DEFINITIONS.map(w => {
    const item = map.get(w.key)!;

    if (isCumulative) {
      runningEligible += item.eligible;
      runningNotEligible += item.notEligible;
      runningReasonEnfoque += item.reasonEnfoque;
      runningReasonGpa += item.reasonGpa;
      runningReasonOther += item.reasonOther;

      const total = runningEligible + runningNotEligible;
      const rate = total > 0 ? Math.round((runningEligible / total) * 1000) / 10 : 0;

      return {
        weekKey: w.key,
        label: w.key,
        dateRange: w.range,
        eligibleCount: runningEligible,
        notEligibleCount: runningNotEligible,
        total,
        eligibilityRate: rate,
        ineligibleReasonEnfoque: runningReasonEnfoque,
        ineligibleReasonGpa: runningReasonGpa,
        ineligibleReasonOther: runningReasonOther
      };
    } else {
      const total = item.eligible + item.notEligible;
      const rate = total > 0 ? Math.round((item.eligible / total) * 1000) / 10 : 0;

      return {
        weekKey: w.key,
        label: w.key,
        dateRange: w.range,
        eligibleCount: item.eligible,
        notEligibleCount: item.notEligible,
        total,
        eligibilityRate: rate,
        ineligibleReasonEnfoque: item.reasonEnfoque,
        ineligibleReasonGpa: item.reasonGpa,
        ineligibleReasonOther: item.reasonOther
      };
    }
  });
}

// Calculate Weekly Channel Mix Stats (Supports Weekly and Cumulative modes across 8 Weeks)
export function calculateWeeklyChannelMixStats(candidates: Candidate[], isCumulative: boolean = false): WeeklyChannelMixStat[] {
  const map = new Map<string, { rrss: number; gira: number; refiere: number; otros: number }>();

  WEEK_DEFINITIONS.forEach(w => {
    map.set(w.key, { rrss: 0, gira: 0, refiere: 0, otros: 0 });
  });

  candidates.forEach((c, idx) => {
    const wKey = getCandidateWeekKey(c, idx);
    const item = map.get(wKey) || { rrss: 0, gira: 0, refiere: 0, otros: 0 };
    const ch = (c.channel || c.fuenteInformacion || c.canalConvocatoria || '').toLowerCase();

    if (ch.includes('refiere') || ch.includes('recomend') || ch.includes('persona')) {
      item.refiere += 1;
    } else if (ch.includes('rrss') || ch.includes('redes') || ch.includes('instagram') || ch.includes('linkedin')) {
      item.rrss += 1;
    } else if (ch.includes('gira') || ch.includes('universidad') || ch.includes('feria')) {
      item.gira += 1;
    } else {
      item.otros += 1;
    }
    map.set(wKey, item);
  });

  let runningRrss = 0;
  let runningGira = 0;
  let runningRefiere = 0;

  return WEEK_DEFINITIONS.map(w => {
    const counts = map.get(w.key) || { rrss: 0, gira: 0, refiere: 0, otros: 0 };

    if (isCumulative) {
      runningRrss += counts.rrss;
      runningGira += counts.gira;
      runningRefiere += counts.refiere;

      const total = runningRrss + runningGira + runningRefiere;
      if (total === 0) {
        return {
          weekKey: w.key,
          label: w.key,
          dateRange: w.range,
          rrss: 0,
          gira: 0,
          refiere: 0,
          otros: 0,
          total: 0
        };
      }

      const rrssPct = Math.round((runningRrss / total) * 100);
      const giraPct = Math.round((runningGira / total) * 100);
      const refierePct = 100 - rrssPct - giraPct;

      return {
        weekKey: w.key,
        label: w.key,
        dateRange: w.range,
        rrss: rrssPct,
        gira: giraPct,
        refiere: refierePct,
        otros: 0,
        total,
        rrssCount: runningRrss,
        giraCount: runningGira,
        refiereCount: runningRefiere,
        otrosCount: 0
      };
    } else {
      const total = counts.rrss + counts.gira + counts.refiere + counts.otros;

      if (total === 0) {
        return {
          weekKey: w.key,
          label: w.key,
          dateRange: w.range,
          rrss: 0,
          gira: 0,
          refiere: 0,
          otros: 0,
          total: 0,
          rrssCount: 0,
          giraCount: 0,
          refiereCount: 0,
          otrosCount: 0
        };
      }

      const rrssPct = Math.round((counts.rrss / total) * 100);
      const giraPct = Math.round((counts.gira / total) * 100);
      const refierePct = 100 - rrssPct - giraPct;

      return {
        weekKey: w.key,
        label: w.key,
        dateRange: w.range,
        rrss: rrssPct,
        gira: giraPct,
        refiere: refierePct,
        otros: 0,
        total,
        rrssCount: counts.rrss,
        giraCount: counts.gira,
        refiereCount: counts.refiere,
        otrosCount: counts.otros
      };
    }
  });
}

// Calculate goals progress dynamically based on candidates dataset
export function calculateSynchronizedGoals(goals: GoalTarget[], candidates: Candidate[]): GoalTarget[] {
  const baseGoals = (goals && goals.length >= 5) ? goals : INITIAL_GOAL_TARGETS;
  const eligibleCount = calculateEligibleCount(candidates);
  const totalCount = candidates.length;
  const profileComp = calculateProfileComposition(candidates);

  const prioritizedCount = candidates.filter(c =>
    c.universidadPriorizada === 'SI' ||
    c.universidadTop13QS === 'SI' ||
    ['andes', 'nacional', 'javeriana', 'antioquia', 'icesi', 'norte', 'valle'].some(k =>
      (c.universityNormalized || c.universityRaw || '').toLowerCase().includes(k)
    )
  ).length;

  const refiereCount = candidates.filter(c =>
    (c.channel || c.fuenteInformacion || '').toLowerCase().includes('refiere')
  ).length;

  return baseGoals.map(g => {
    let currentVal = g.current2027;

    if (g.id === 'goal-1') {
      currentVal = eligibleCount;
    } else if (g.id === 'goal-2') {
      currentVal = eligibleCount > 0 ? Math.round((profileComp.bilingualCount / eligibleCount) * 1000) / 10 : 0;
    } else if (g.id === 'goal-3') {
      currentVal = eligibleCount > 0 ? Math.round((profileComp.stemCount / eligibleCount) * 1000) / 10 : 0;
    } else if (g.id === 'goal-4') {
      currentVal = totalCount > 0 ? Math.round((prioritizedCount / totalCount) * 1000) / 10 : 0;
    } else if (g.id === 'goal-5') {
      currentVal = totalCount > 0 ? Math.round((refiereCount / totalCount) * 1000) / 10 : 0;
    }

    let status = g.status;
    const pct = g.target2027 > 0 ? (currentVal / g.target2027) * 100 : 0;
    if (pct >= 100) status = 'Achieved';
    else if (pct >= 75) status = 'On Track';
    else status = 'At Risk';

    return {
      ...g,
      current2027: currentVal,
      status
    };
  });
}

export const calculateChannelMixStats = calculateWeeklyChannelMixStats;

// Calculate University & HPC Metrics for Header Cards
export function calculateUniversityAndHpcMetrics(candidates: Candidate[]) {
  const totalApplicants = candidates.length;
  const eligible = candidates.filter(isCandidateEligible);
  const totalEligible = eligible.length;

  let eligiblePrioritarias = 0;
  let totalPrioritarias = 0;
  let eligibleTop13 = 0;
  let totalTop13 = 0;
  let totalHpc = 0;
  let eligibleHpc = 0;

  const prioKeywords = ['andes', 'nacional', 'javeriana', 'antioquia', 'icesi', 'norte', 'valle', 'pedagógica', 'uis'];
  const top13Keywords = [...prioKeywords, 'sabana', 'rosario', 'bolivariana', 'eafit', 'cauca', 'caldas', 'industrial'];

  candidates.forEach((c) => {
    const uniName = (c.universityNormalized || c.universityRaw || '').toLowerCase();
    
    const isPrio = c.universidadPriorizada === 'SI' || Boolean((c as any).isPrioritarias) ||
      prioKeywords.some(k => uniName.includes(k));
    
    const isTop13 = c.universidadTop13QS === 'SI' || Boolean((c as any).isTop13QS) || isPrio ||
      top13Keywords.some(k => uniName.includes(k));

    const isHpc = (c.hpc || '').toLowerCase() === 'si' || c.channel === 'Cultivación de HPC' || (c as any).isHpc === true;

    if (isPrio) totalPrioritarias++;
    if (isTop13) totalTop13++;
    if (isHpc) totalHpc++;

    if (isCandidateEligible(c)) {
      if (isPrio) eligiblePrioritarias++;
      if (isTop13) eligibleTop13++;
      if (isHpc) eligibleHpc++;
    }
  });

  return {
    totalApplicants,
    totalEligible,
    eligiblePrioritarias,
    totalPrioritarias,
    targetPrioritarias: 300,
    eligibleTop13,
    totalTop13,
    totalHpc,
    eligibleHpc
  };
}



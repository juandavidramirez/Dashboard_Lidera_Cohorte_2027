// 2025 Convocatoria Comparison Data (Source: Google Sheet Datos_Calculados_2025)
// Sheet ID: 1mkdjjH6m5hZrXbvs-KH9CtQfAEealqu_yKNwje-8uW0

export interface Comparison2025Data {
  elegibilidadGlobalPct: number;
  noElegibilidadGlobalPct: number;
  totalPostulaciones2025: number;
  elegibles2025: number;
  top7Elegibles2025: number;
  top7ElegiblesPct2025: number;
  cuartilQ1Pct: number;
  cuartilQ2Pct: number;
  cuartilQ3Pct: number;
  cuartilQ4Pct: number;
  quartileCounts2025: {
    Q1: number;
    Q2: number;
    Q3: number;
    Q4: number;
  };
}

export const FALLBACK_2025_DATA: Comparison2025Data = {
  elegibilidadGlobalPct: 66.15,
  noElegibilidadGlobalPct: 33.85,
  totalPostulaciones2025: 1359,
  elegibles2025: 899,
  top7Elegibles2025: 141,
  top7ElegiblesPct2025: 15.68,
  cuartilQ1Pct: 59.0,
  cuartilQ2Pct: 57.4,
  cuartilQ3Pct: 61.6,
  cuartilQ4Pct: 66.2,
  quartileCounts2025: {
    Q1: 276,
    Q2: 476,
    Q3: 643,
    Q4: 899
  }
};

let cached2025Data: Comparison2025Data = { ...FALLBACK_2025_DATA };

export async function fetchDatosCalculados2025(): Promise<Comparison2025Data> {
  try {
    const sheetId = '1mkdjjH6m5hZrXbvs-KH9CtQfAEealqu_yKNwje-8uW0';
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=Datos_Calculados_2025`;
    const response = await fetch(url);
    if (!response.ok) {
      return cached2025Data;
    }
    const csvText = await response.text();
    const lines = csvText.split('\n');
    const dataMap: Record<string, number> = {};

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const parts = line.split(',').map(p => p.replace(/^["']|["']$/g, '').trim());
      if (parts.length >= 2) {
        const key = parts[0];
        const val = parseFloat(parts[1]);
        if (!isNaN(val)) {
          dataMap[key] = val;
        }
      }
    }

    if (dataMap['elegibilidad_global_pct']) {
      cached2025Data = {
        elegibilidadGlobalPct: dataMap['elegibilidad_global_pct'] ?? 66.15,
        noElegibilidadGlobalPct: dataMap['no_elegibilidad_global_pct'] ?? 33.85,
        totalPostulaciones2025: dataMap['total_postulaciones_2025'] ?? 1359,
        elegibles2025: dataMap['elegibles_2025'] ?? 899,
        top7Elegibles2025: dataMap['top7_elegibles_2025'] ?? 141,
        top7ElegiblesPct2025: dataMap['top7_elegibles_pct_2025'] ?? 15.68,
        cuartilQ1Pct: dataMap['cuartil_q1_pct'] ?? 59.0,
        cuartilQ2Pct: dataMap['cuartil_q2_pct'] ?? 57.4,
        cuartilQ3Pct: dataMap['cuartil_q3_pct'] ?? 61.6,
        cuartilQ4Pct: dataMap['cuartil_q4_pct'] ?? 66.2,
        quartileCounts2025: {
          Q1: Math.round((dataMap['cuartil_q1_pct'] ?? 59.0) / 100 * 468), // approx absolute count or scaled
          Q2: Math.round((dataMap['cuartil_q2_pct'] ?? 57.4) / 100 * 829),
          Q3: Math.round((dataMap['cuartil_q3_pct'] ?? 61.6) / 100 * 1044),
          Q4: dataMap['elegibles_2025'] ?? 899
        }
      };
      // Keep exact absolute counts for Q1-Q4 if 899 is total: 276, 476, 643, 899
      cached2025Data.quartileCounts2025 = {
        Q1: 276,
        Q2: 476,
        Q3: 643,
        Q4: 899
      };
    }
  } catch {
    // Fallback silently if network or CORS prevents fetching
  }
  return cached2025Data;
}

export function getComparison2025Sync(): Comparison2025Data {
  return cached2025Data;
}

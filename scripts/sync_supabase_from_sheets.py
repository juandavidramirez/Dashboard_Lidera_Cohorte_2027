#!/usr/bin/env python3
"""
Sincronizador Directo: Google Sheets -> Supabase
------------------------------------------------
Herramienta de respaldo por línea de comandos para sincronizar la base de datos
de Supabase directamente desde la hoja de Google Sheets 'Data_Raw_Conv'.

Uso:
    python3 scripts/sync_supabase_from_sheets.py
"""

import urllib.request
import csv
import io
import json
import re

SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/1mkdjjH6m5hZrXbvs-KH9CtQfAEealqu_yKNwje-8uW0/export?format=csv"
SUPABASE_URL = "https://muyqxxzjcgwyvluzumbt.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11eXF4eHpqY2d3eXZsdXp1bWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxODAzODAsImV4cCI6MjEwMDc1NjM4MH0.dbcSNdYK4psdcAI1XapaTAIkQrZttglJ_kkgODZsICg"

def parse_num(val):
    if not val: return None
    try:
        return float(str(val).replace(',', '.'))
    except:
        return None

def parse_int(val):
    if not val: return None
    s = str(val).strip()
    m = re.search(r'\b(20\d\d)\b', s)
    if m: return int(m.group(1))
    try:
        return int(s)
    except:
        return None

def parse_bool(val):
    if not val: return False
    s = str(val).strip().lower()
    return s in ['true', 'si', '1', 'yes']

def sync():
    print("📥 Descargando filas de Google Sheets...")
    req = urllib.request.Request(SHEET_CSV_URL, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as resp:
        content = resp.read().decode('utf-8')

    reader = list(csv.reader(io.StringIO(content)))
    rows = [r for r in reader[1:] if r and r[0].strip()]
    print(f"📊 Registros encontrados en Sheets: {len(rows)}")

    payload = []
    for r in rows:
        record = {
            'id': str(r[0]).strip(),
            'id_primera_revision': str(r[0]).strip(),
            'created_at': str(r[1]).strip() if len(r) > 1 and r[1].strip() else None,
            'fecha_creacion': str(r[1]).strip() if len(r) > 1 and r[1].strip() else None,
            'full_name': str(r[2]).strip() if len(r) > 2 else '',
            'documento_identificacion': str(r[3]).strip() if len(r) > 3 else '',
            'email': str(r[4]).strip() if len(r) > 4 else '',
            'phone': str(r[5]).strip() if len(r) > 5 else '',
            'career': str(r[6]).strip() if len(r) > 6 else '',
            'graduation_year': parse_int(r[7] if len(r) > 7 else None),
            'university_raw': str(r[8]).strip() if len(r) > 8 else '',
            'university_normalized': str(r[8]).strip() if len(r) > 8 else '',
            'nivel_educacion': str(r[9]).strip() if len(r) > 9 else '',
            'gpa': parse_num(r[10] if len(r) > 10 else None),
            'english_level': str(r[11]).strip() if len(r) > 11 else '',
            'is_bilingual': parse_bool(r[11] in ['B2', 'C1', 'C2'] if len(r) > 11 else False),
            'grupo_etnico': str(r[12]).strip() if len(r) > 12 else '',
            'fuente_informacion': str(r[13]).strip() if len(r) > 13 else '',
            'medio_interes': str(r[14]).strip() if len(r) > 14 else '',
            'referred_by': str(r[15]).strip() if len(r) > 15 else '',
            'fecha_nacimiento': str(r[16]).strip() if len(r) > 16 and r[16].strip() else None,
            'responsabilidad_familiar': str(r[17]).strip() if len(r) > 17 else '',
            'monitor': str(r[18]).strip() if len(r) > 18 else '',
            'pago_estudios': str(r[19]).strip() if len(r) > 19 else '',
            'ultima_modificacion': str(r[20]).strip() if len(r) > 20 and r[20].strip() else None,
            'departamento_residencia': str(r[21]).strip() if len(r) > 21 else '',
            'department': str(r[21]).strip() if len(r) > 21 else '',
            'stem_clasificacion': str(r[22]).strip() if len(r) > 22 else '',
            'is_stem': parse_bool(str(r[22]).strip() in ['STEM', 'STEM Priorizada', 'STEM No Priorizada', 'STEM Transición'] if len(r) > 22 else False),
            'uni_top13_qs': str(r[23]).strip() if len(r) > 23 else '',
            'uni_prioritaria': str(r[24]).strip() if len(r) > 24 else '',
            'tipo_pregrado': str(r[25]).strip() if len(r) > 25 else '',
            'enfoque': str(r[26]).strip() if len(r) > 26 else '',
            'channel': str(r[27]).strip() if len(r) > 27 else '',
            'eligibility': str(r[28]).strip() if len(r) > 28 else 'No cumple mínimos',
            'ineligibility_reason': str(r[29]).strip() if len(r) > 29 else '',
            'route': str(r[30]).strip() if len(r) > 30 else 'No aplica',
            'edad': parse_int(r[31] if len(r) > 31 else None),
            'month': str(r[32]).strip() if len(r) > 32 else '',
            'hpc': str(r[33]).strip() if len(r) > 33 else '',
            'form_completo': str(r[34]).strip().upper() if len(r) > 34 and r[34].strip() else ('SI' if len(r) > 13 and r[13].strip() else 'NO')
        }
        payload.append(record)

    print(f"🚀 Enviando {len(payload)} registros a Supabase en lotes...")
    batch_size = 500
    for i in range(0, len(payload), batch_size):
        batch = payload[i:i+batch_size]
        body = json.dumps(batch).encode('utf-8')
        req = urllib.request.Request(
            f"{SUPABASE_URL}/rest/v1/candidates_convocatoria",
            data=body,
            headers={
                'apikey': SUPABASE_KEY,
                'Authorization': f'Bearer {SUPABASE_KEY}',
                'Content-Type': 'application/json',
                'Prefer': 'resolution=merge-duplicates'
            },
            method='POST'
        )
        with urllib.request.urlopen(req) as response:
            if response.status in [200, 201]:
                print(f"  ✅ Lote {i//batch_size + 1} subido con éxito ({len(batch)} filas)")
            else:
                print(f"  ⚠️ Lote {i//batch_size + 1} respuesta: {response.status}")

    print("🎉 Sincronización finalizada exitosamente.")

if __name__ == "__main__":
    sync()

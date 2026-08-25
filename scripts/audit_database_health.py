#!/usr/bin/env python3
"""
Auditor de Salud de Base de Datos y Supabase
--------------------------------------------
Consulta la base de datos de Supabase en vivo y realiza un diagnóstico completo:
1. Total de registros almacenados y conteo de páginas.
2. Estado de formularios (Completos 'SI' vs Incompletos 'NO').
3. Estado de elegibilidad (Cumple mínimos vs No cumple mínimos).
4. Distribución por Rutas (Ruta Promisorios, Ruta General, No aplica).
5. Detección de duplicados o anomalías en campos clave.

Uso:
    python3 scripts/audit_database_health.py
"""

import urllib.request
import json
from collections import Counter

SUPABASE_URL = "https://muyqxxzjcgwyvluzumbt.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11eXF4eHpqY2d3eXZsdXp1bWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxODAzODAsImV4cCI6MjEwMDc1NjM4MH0.dbcSNdYK4psdcAI1XapaTAIkQrZttglJ_kkgODZsICg"

def fetch_all_supabase():
    all_data = []
    start = 0
    step = 1000
    while True:
        req = urllib.request.Request(
            f"{SUPABASE_URL}/rest/v1/candidates_convocatoria?select=*&limit={step}&offset={start}",
            headers={
                'apikey': SUPABASE_KEY,
                'Authorization': f'Bearer {SUPABASE_KEY}'
            }
        )
        try:
            with urllib.request.urlopen(req) as resp:
                data = json.loads(resp.read().decode('utf-8'))
                if not data:
                    break
                all_data.extend(data)
                if len(data) < step:
                    break
                start += step
        except Exception as e:
            print(f"❌ Error al consultar Supabase: {e}")
            break
    return all_data

def auditar():
    print("🔍 Consultando Supabase...")
    data = fetch_all_supabase()
    total = len(data)
    print(f"✅ Total registros en Supabase: {total}")
    if total == 0:
        print("⚠️ No hay registros en Supabase.")
        return

    forms = Counter([str(r.get('form_completo', '')).strip().upper() for r in data])
    eligs = Counter([str(r.get('eligibility', '')).strip() for r in data])
    rutas = Counter([str(r.get('route', '')).strip() for r in data])
    
    docs = [str(r.get('documento_identificacion', '')).strip() for r in data if r.get('documento_identificacion')]
    dupes = [doc for doc, c in Counter(docs).items() if c > 1]

    print("\n" + "="*50)
    print("📊 DIAGNÓSTICO DE BASE DE DATOS (SUPABASE)")
    print("="*50)
    print("1. Estado del Formulario:")
    for k, v in forms.items():
        print(f"   - {k or 'Sin definir'}: {v} ({v/total*100:.1f}%)")

    print("\n2. Estado de Elegibilidad Global:")
    for k, v in eligs.items():
        print(f"   - {k or 'Sin definir'}: {v} ({v/total*100:.1f}%)")

    si_rows = [r for r in data if str(r.get('form_completo', '')).strip().upper() == 'SI']
    si_eligs = Counter([str(r.get('eligibility', '')).strip() for r in si_rows])
    print(f"\n3. Elegibilidad (Solo Formulario Completo 'SI' - {len(si_rows)} candidatos):")
    for k, v in si_eligs.items():
        print(f"   - {k or 'Sin definir'}: {v}")

    si_cumple = [r for r in si_rows if 'Cumple' in str(r.get('eligibility', ''))]
    si_rutas = Counter([str(r.get('route', '')).strip() for r in si_cumple])
    print(f"\n4. Distribución por Rutas (Elegibles con Formulario Completo - {len(si_cumple)} candidatos):")
    for k, v in si_rutas.items():
        print(f"   - {k or 'Sin definir'}: {v}")

    print(f"\n5. Documentos duplicados en base: {len(dupes)}")
    if dupes:
        print(f"   Ejemplos: {dupes[:5]}")

    print("="*50)

if __name__ == "__main__":
    auditar()

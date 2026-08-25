import urllib.request
import json
from collections import defaultdict

SUPABASE_URL = "https://muyqxxzjcgwyvluzumbt.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11eXF4eHpqY2d3eXZsdXp1bWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxODAzODAsImV4cCI6MjEwMDc1NjM4MH0.dbcSNdYK4psdcAI1XapaTAIkQrZttglJ_kkgODZsICg"

def fetch_supabase():
    all_data = []
    start = 0
    step = 1000
    while True:
        req = urllib.request.Request(f"{SUPABASE_URL}/rest/v1/candidates_convocatoria?select=id,full_name,documento_identificacion,stem_clasificacion,ineligibility_reason,created_at&limit={step}&offset={start}", headers={
            'apikey': SUPABASE_KEY,
            'Authorization': f'Bearer {SUPABASE_KEY}'
        })
        try:
            with urllib.request.urlopen(req) as response:
                data = json.loads(response.read().decode())
                if not data: break
                all_data.extend(data)
                if len(data) < step: break
                start += step
        except:
            break
    return all_data

data = fetch_supabase()

# Group by document
doc_groups = defaultdict(list)
for d in data:
    doc = str(d.get('documento_identificacion') or '').strip()
    if doc:
        doc_groups[doc].append(d)

# Find duplicates
dupes_found = 0
for doc, records in doc_groups.items():
    if len(records) > 1:
        print(f"\n--- DUPLICADO ENCONTRADO: Documento {doc} ---")
        for i, r in enumerate(records):
            print(f"Registro {i+1}:")
            print(f"  ID (Supabase/Sheets): {r.get('id')}")
            print(f"  Nombre: {r.get('full_name')}")
            print(f"  Clasificación STEM: {r.get('stem_clasificacion')}")
            print(f"  Motivo Inelegibilidad: {r.get('ineligibility_reason')}")
            print(f"  Fecha de Creación: {r.get('created_at')}")
        
        dupes_found += 1
        if dupes_found >= 2:
            break


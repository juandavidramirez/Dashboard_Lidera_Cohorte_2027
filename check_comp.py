import urllib.request
import json
SUPABASE_URL = "https://muyqxxzjcgwyvluzumbt.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11eXF4eHpqY2d3eXZsdXp1bWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxODAzODAsImV4cCI6MjEwMDc1NjM4MH0.dbcSNdYK4psdcAI1XapaTAIkQrZttglJ_kkgODZsICg"

def fetch_all():
    all_data = []
    start = 0
    step = 1000
    while True:
        req = urllib.request.Request(f"{SUPABASE_URL}/rest/v1/candidates_convocatoria?select=*&order=fecha_creacion.desc,id.asc&limit={step}&offset={start}", headers={
            'apikey': SUPABASE_KEY,
            'Authorization': f'Bearer {SUPABASE_KEY}'
        })
        try:
            with urllib.request.urlopen(req) as response:
                data = json.loads(response.read().decode())
                if not data:
                    break
                all_data.extend(data)
                if len(data) < step:
                    break
                start += step
        except Exception as e:
            print("Error:", e)
            break
    return all_data

def is_form_completed(cand):
    rawFormComp = str(cand.get('form_completo') or cand.get('formCompleto') or '').upper().strip()
    if rawFormComp in ['NO', 'INCOMPLETO', 'FALSE']: return False
    if rawFormComp in ['SI', 'SÍ', 'TRUE', 'COMPLETO']: return True
    channel = str(cand.get('channel') or cand.get('fuente_informacion') or cand.get('canal_convocatoria') or '').strip()
    return len(channel) > 0

data = fetch_all()
completed = [x for x in data if is_form_completed(x)]

# STEM
def is_stem(c):
    return c.get('is_stem') or 'STEM' in str(c.get('stem_clasificacion', '')).strip().upper()
stem_count = sum([1 for c in completed if is_stem(c)])
print(f"STEM: {stem_count} / {len(completed)} = {(stem_count/len(completed))*100:.1f}%")

# B2+
def is_b2(c):
    eng = str(c.get('english_level', '')).strip().upper()
    return c.get('is_bilingual') or eng in ['B2', 'C1', 'C2']
b2_count = sum([1 for c in completed if is_b2(c)])
print(f"B2+: {b2_count} / {len(completed)} = {(b2_count/len(completed))*100:.1f}%")


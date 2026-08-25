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

def is_candidate_eligible(cand):
    rawEligStr = str(cand.get('eligibility') or cand.get('cumple_minimos') or '').lower().strip()
    isNoEligible = 'no cumple' in rawEligStr or 'no elegible' in rawEligStr or rawEligStr == 'no'
    derivedEligibility = 'No Elegible' if isNoEligible else 'Elegible'

    status = derivedEligibility.lower().strip()
    if 'no cumple' in status or 'no elegible' in status or status == 'no': return False
    if 'cumple' in status or 'elegible' in status or status in ['si', 'sí']: return True

    gpa = float(cand.get('gpa', 0) or 0)
    eng = str(cand.get('english_level', '')).strip().upper()
    is_bilingual = cand.get('is_bilingual') or eng in ['B2', 'C1', 'C2']
    stem_str = str(cand.get('stem_clasificacion', '')).strip().upper()
    is_stem = cand.get('is_stem') or 'STEM' in stem_str
    
    if gpa >= 3.5 and (is_bilingual or is_stem): return True
    return False

data = fetch_all()
completed = [x for x in data if is_form_completed(x)]
eligible = [x for x in completed if is_candidate_eligible(x)]

print(f"Total Registros 2026: {len(data)}")
print(f"Postulantes Completos 2026: {len(completed)}")
print(f"Elegibles 2026: {len(eligible)}")
rate = (len(eligible) / len(completed) * 100) if completed else 0
print(f"Tasa de Elegibilidad 2026: {rate:.1f}%")

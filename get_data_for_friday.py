import urllib.request
import json

SUPABASE_URL = "https://muyqxxzjcgwyvluzumbt.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11eXF4eHpqY2d3eXZsdXp1bWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxODAzODAsImV4cCI6MjEwMDc1NjM4MH0.dbcSNdYK4psdcAI1XapaTAIkQrZttglJ_kkgODZsICg"

all_data = []
start = 0
step = 1000

while True:
    req = urllib.request.Request(f"{SUPABASE_URL}/rest/v1/candidates_convocatoria?select=*&order=registration_date.desc", headers={
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Range': f'{start}-{start + step - 1}'
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

def is_form_completed(cand):
    rawFormComp = str(cand.get('form_completo') or cand.get('formCompleto') or '').upper().strip()
    formCompleto = 'SI'
    if rawFormComp in ['NO', 'INCOMPLETO', 'FALSE']:
        formCompleto = 'NO'
    elif not rawFormComp:
        ch = str(cand.get('channel') or cand.get('fuente_informacion') or cand.get('canal_convocatoria') or '').strip()
        formCompleto = 'SI' if ch else 'NO'
    
    if formCompleto != '':
        fc = formCompleto.lower()
        return fc in ['si', 'sí', 'true', 'completo']
    
    channel = str(cand.get('channel') or cand.get('fuente_informacion') or cand.get('canal_convocatoria') or '').strip()
    return len(channel) > 0

def is_candidate_eligible(cand):
    # From rowToCandidate:
    # rawEligStr = String(row.eligibility || row.cumple_minimos || '').toLowerCase().trim();
    # isNoEligible = rawEligStr.includes('no cumple') || rawEligStr.includes('no elegible') || rawEligStr === 'no';
    # derivedEligibility = isNoEligible ? 'No Elegible' : 'Elegible';
    rawEligStr = str(cand.get('eligibility') or cand.get('cumple_minimos') or '').lower().strip()
    isNoEligible = 'no cumple' in rawEligStr or 'no elegible' in rawEligStr or rawEligStr == 'no'
    derivedEligibility = 'No Elegible' if isNoEligible else 'Elegible'

    status = derivedEligibility.lower().strip()
    if status:
        if 'no cumple' in status or 'no elegible' in status or status == 'no':
            return False
        if 'cumple' in status or 'elegible' in status or status in ['si', 'sí']:
            return True

    gpa = float(cand.get('gpa', 0) or 0)
    eng = str(cand.get('english_level', '')).strip().upper()
    is_bilingual = cand.get('is_bilingual') or eng in ['B2', 'C1', 'C2']
    stem_str = str(cand.get('stem_clasificacion', '')).strip().upper()
    is_stem = cand.get('is_stem') or 'STEM' in stem_str
    
    if gpa >= 3.5 and (is_bilingual or is_stem):
        return True
    return False

def is_uni_prioritaria(cand):
    uni = str(cand.get('university_normalized') or cand.get('university_raw') or '').strip().lower()
    prioritarias = ['andes', 'javeriana', 'rosario', 'nacional', 'sabana', 'icesi', 'eafit', 'norte', 'uis', 'valle', 'bolivariana']
    for p in prioritarias:
        if p in uni:
            return True
    return False

cutoff_date_str = "2026-08-21T23:59:59"

filtered_data = []
for d in all_data:
    d_date = d.get('registration_date') or d.get('fecha_creacion') or d.get('created_at')
    if d_date and str(d_date) <= cutoff_date_str:
        filtered_data.append(d)

complete = []
incomplete = []

for d in filtered_data:
    if is_form_completed(d):
        complete.append(d)
    else:
        incomplete.append(d)

eligible = [c for c in complete if is_candidate_eligible(c)]
top7 = [c for c in complete if str(c.get('uni_prioritaria', '')).strip().lower() in ['si', 'sí', 'true'] or is_uni_prioritaria(c)]
potential_eligible = [c for c in incomplete if is_candidate_eligible(c)]

print(f"Total Postulantes (Completos): {len(complete)}")
print(f"Elegibles (Completos): {len(eligible)}")
rate = (len(eligible) / len(complete) * 100) if complete else 0
print(f"Tasa de Elegibilidad: {rate:.1f}%")
print(f"Postulantes Top 7 (Prioritarias): {len(top7)}")
print(f"Formularios Incompletos: {len(incomplete)}")
print(f"Potencial Elegibles (Incompletos): {len(potential_eligible)}")

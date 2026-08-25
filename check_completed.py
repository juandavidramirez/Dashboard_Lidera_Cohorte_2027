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

complete = []
incomplete = []

for d in all_data:
    if is_form_completed(d):
        complete.append(d)
    else:
        incomplete.append(d)

print(f"Total Postulantes (Completos): {len(complete)}")
print(f"Formularios Incompletos: {len(incomplete)}")
print(f"Total Registros: {len(all_data)}")

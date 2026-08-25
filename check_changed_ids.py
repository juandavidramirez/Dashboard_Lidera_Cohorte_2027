import urllib.request
import json
SUPABASE_URL = "https://muyqxxzjcgwyvluzumbt.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11eXF4eHpqY2d3eXZsdXp1bWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxODAzODAsImV4cCI6MjEwMDc1NjM4MH0.dbcSNdYK4psdcAI1XapaTAIkQrZttglJ_kkgODZsICg"

def fetch_all():
    all_data = []
    start = 0
    step = 1000
    while True:
        req = urllib.request.Request(f"{SUPABASE_URL}/rest/v1/candidates_convocatoria?select=*&limit={step}&offset={start}", headers={
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

data = fetch_all()

def is_form_completed_python(cand):
    rawFormComp = str(cand.get('form_completo') or cand.get('formCompleto') or '').upper().strip()
    if rawFormComp in ['NO', 'INCOMPLETO', 'FALSE']: return False
    if rawFormComp in ['SI', 'SÍ', 'TRUE', 'COMPLETO']: return True
    channel = str(cand.get('channel') or cand.get('fuente_informacion') or cand.get('canal_convocatoria') or '').strip()
    return len(channel) > 0

def is_form_completed_ts(cand):
    rawFormComp = str(cand.get('form_completo') or cand.get('formCompleto') or '').upper().strip()
    formCompleto = 'SI'
    if rawFormComp in ['NO', 'INCOMPLETO', 'FALSE']:
        formCompleto = 'NO'
    elif not rawFormComp:
        ch = str(cand.get('channel') or cand.get('fuente_informacion') or cand.get('canal_convocatoria') or '').strip()
        formCompleto = 'SI' if ch else 'NO'
    return formCompleto == 'SI'

for d in data:
    p_comp = is_form_completed_python(d)
    ts_comp = is_form_completed_ts(d)
    if p_comp != ts_comp:
        print(f"Diff! ID: {d.get('id')} - python: {p_comp}, TS: {ts_comp}, raw: '{d.get('form_completo')}' channel: '{d.get('channel')}'")


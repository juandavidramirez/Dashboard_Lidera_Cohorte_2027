import urllib.request
import csv
import io
import json

SUPABASE_URL = "https://muyqxxzjcgwyvluzumbt.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11eXF4eHpqY2d3eXZsdXp1bWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxODAzODAsImV4cCI6MjEwMDc1NjM4MH0.dbcSNdYK4psdcAI1XapaTAIkQrZttglJ_kkgODZsICg"

def get_all_supabase():
    all_rows = []
    start = 0
    step = 1000
    while True:
        url = f"{SUPABASE_URL}/rest/v1/candidates_convocatoria?select=*&limit={step}&offset={start}"
        req = urllib.request.Request(url, headers={
            'apikey': SUPABASE_KEY,
            'Authorization': f'Bearer {SUPABASE_KEY}'
        })
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
            if not data: break
            all_rows.extend(data)
            if len(data) < step: break
            start += step
    return all_rows

def get_sheets_csv():
    url = "https://docs.google.com/spreadsheets/d/1mkdjjH6m5hZrXbvs-KH9CtQfAEealqu_yKNwje-8uW0/export?format=csv"
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as resp:
        content = resp.read().decode('utf-8')
    reader = list(csv.reader(io.StringIO(content)))
    return reader

sb_rows = get_all_supabase()
sheets_rows = get_sheets_csv()

print(f"Supabase total rows: {len(sb_rows)}")
print(f"Sheets total CSV rows: {len(sheets_rows)}")
if len(sheets_rows) > 0:
    print("Sheets Headers (first 40):")
    for idx, h in enumerate(sheets_rows[0]):
        print(f"  [{idx}] {h}")

# Let's inspect Supabase counts:
sb_by_id = {r.get('id'): r for r in sb_rows}
sb_form_si = [r for r in sb_rows if str(r.get('form_completo')).strip().upper() == 'SI']
print(f"\nSupabase Form Completo == 'SI': {len(sb_form_si)}")

# Let's check eligibility in Supabase
sb_elig_cumple = [r for r in sb_form_si if 'cumple' in str(r.get('eligibility') or '').lower() and 'no' not in str(r.get('eligibility') or '').lower()]
print(f"Supabase (Form SI & Cumple mínimos): {len(sb_elig_cumple)}")


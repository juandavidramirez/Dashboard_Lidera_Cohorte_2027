import urllib.request
import json
import csv
import io

SUPABASE_URL = "https://muyqxxzjcgwyvluzumbt.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11eXF4eHpqY2d3eXZsdXp1bWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxODAzODAsImV4cCI6MjEwMDc1NjM4MH0.dbcSNdYK4psdcAI1XapaTAIkQrZttglJ_kkgODZsICg"

def fetch_supabase():
    all_data = []
    start = 0
    step = 1000
    while True:
        req = urllib.request.Request(f"{SUPABASE_URL}/rest/v1/candidates_convocatoria?select=id,form_completo,eligibility&limit={step}&offset={start}", headers={
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
        except Exception as e:
            print("SB fetch error:", e)
            break
    return all_data

sb_data = fetch_supabase()
print(f"Total Rows in Supabase: {len(sb_data)}")
sb_form_si = sum(1 for x in sb_data if str(x.get('form_completo')).strip().upper() == 'SI')
print(f"SB Form Completo: {sb_form_si}")

url = "https://docs.google.com/spreadsheets/d/1mkdjjH6m5hZrXbvs-KH9CtQfAEealqu_yKNwje-8uW0/export?format=csv"
try:
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as response:
        data = response.read().decode('utf-8')
        reader = csv.reader(io.StringIO(data))
        rows = list(reader)
        
        form_completo_count = 0
        elegibles_count = 0
        for i, row in enumerate(rows[1:]):
            if not row or not row[0].strip():
                continue
            canal_p = row[13].strip() if len(row) > 13 else ""
            form_completo = "SI" if canal_p != "" else "NO"
            cumple_minimos = row[28].strip() if len(row) > 28 else ""
            
            if form_completo == "SI":
                form_completo_count += 1
                if "Cumple mínimos" in cumple_minimos:
                    elegibles_count += 1
                    
        print(f"Total Rows in Sheets: {len(rows)-1}")
        print(f"Sheets Form Completo (SI): {form_completo_count}")
        print(f"Sheets Elegibles: {elegibles_count}")
except Exception as e:
    print("Sheets fetch error:", e)

import urllib.request
import csv
import io
import json

SUPABASE_URL = "https://muyqxxzjcgwyvluzumbt.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11eXF4eHpqY2d3eXZsdXp1bWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxODAzODAsImV4cCI6MjEwMDc1NjM4MH0.dbcSNdYK4psdcAI1XapaTAIkQrZttglJ_kkgODZsICg"

def fetch_supabase():
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

url = "https://docs.google.com/spreadsheets/d/1mkdjjH6m5hZrXbvs-KH9CtQfAEealqu_yKNwje-8uW0/export?format=csv"
try:
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as response:
        data = response.read().decode('utf-8')
        reader = csv.reader(io.StringIO(data))
        rows = list(reader)
        
        doc_ids = set()
        
        form_completo_count = 0
        elegibles_count = 0
        total_unique = 0
        
        for i, row in enumerate(rows[1:]): # skip header
            if not row or not row[0].strip():
                continue
            
            # Dupe check exactly like App Script
            doc = row[3].strip() if len(row) > 3 else ""
            if doc:
                if doc in doc_ids:
                    continue # Skip duplicate
                doc_ids.add(doc)
            
            total_unique += 1
            canal_p = row[13].strip() if len(row) > 13 else ""
            form_completo = "SI" if canal_p != "" else "NO"
            cumple_minimos = row[28].strip() if len(row) > 28 else ""
            
            if form_completo == "SI":
                form_completo_count += 1
                if "Cumple mínimos" in cumple_minimos:
                    elegibles_count += 1

        print(f"--- GOOGLE SHEETS CALCULATED ---")
        print(f"Total Unique Valid Rows: {total_unique}")
        print(f"Form Completo (SI): {form_completo_count}")
        print(f"Elegibles: {elegibles_count}")

except Exception as e:
    print("Error fetching Sheets:", e)

print("\n--- SUPABASE CALCULATED ---")
sb_data = fetch_supabase()
sb_total = len(sb_data)
sb_form = sum([1 for x in sb_data if (str(x.get('form_completo')).strip().upper() == 'SI' or (str(x.get('channel') or '').strip() != ''))])

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

sb_elig = sum([1 for x in sb_data if (str(x.get('form_completo')).strip().upper() == 'SI' or (str(x.get('channel') or '').strip() != '')) and is_candidate_eligible(x)])

print(f"Total Rows: {sb_total}")
print(f"Form Completo (SI): {sb_form}")
print(f"Elegibles: {sb_elig}")


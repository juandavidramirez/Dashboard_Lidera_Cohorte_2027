import urllib.request
import json
from collections import Counter

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
        except Exception as e:
            print("Error:", e)
            break
    return all_data

data = fetch_supabase()
print(f"Total rows in Supabase: {len(data)}")

# Count form_completo
forms = Counter([r.get('form_completo') for r in data])
print("form_completo in Supabase:", forms)

# Count eligibility
elig = Counter([r.get('eligibility') for r in data])
print("eligibility in Supabase:", elig)

# Form completo == SI
si_rows = [r for r in data if str(r.get('form_completo')).strip().upper() == 'SI']
print(f"Form completo == 'SI': {len(si_rows)}")

si_elig = Counter([r.get('eligibility') for r in si_rows])
print("Eligibility among Form == 'SI':", si_elig)


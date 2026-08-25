import urllib.request
import json
import collections

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

sb_data = fetch_supabase()
print(f"Total Rows: {len(sb_data)}")

c_fc = collections.Counter([str(x.get('form_completo')).strip().upper() for x in sb_data])
print(f"Form Completo raw counts: {c_fc}")

c_elig = collections.Counter([str(x.get('eligibility')).strip().upper() for x in sb_data])
print(f"Eligibility raw counts: {c_elig}")


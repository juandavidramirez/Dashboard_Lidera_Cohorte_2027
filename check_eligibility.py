import urllib.request
import json
SUPABASE_URL = "https://muyqxxzjcgwyvluzumbt.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11eXF4eHpqY2d3eXZsdXp1bWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxODAzODAsImV4cCI6MjEwMDc1NjM4MH0.dbcSNdYK4psdcAI1XapaTAIkQrZttglJ_kkgODZsICg"

def fetch_all():
    all_data = []
    start = 0
    step = 1000
    while True:
        req = urllib.request.Request(f"{SUPABASE_URL}/rest/v1/candidates_convocatoria?select=eligibility&limit={step}&offset={start}", headers={
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
counts = {}
for d in data:
    val = str(d.get('eligibility')).strip().upper()
    counts[val] = counts.get(val, 0) + 1
print("Current eligibility breakdown in DB:", counts)

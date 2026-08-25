import urllib.request
import json
SUPABASE_URL = "https://muyqxxzjcgwyvluzumbt.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11eXF4eHpqY2d3eXZsdXp1bWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxODAzODAsImV4cCI6MjEwMDc1NjM4MH0.dbcSNdYK4psdcAI1XapaTAIkQrZttglJ_kkgODZsICg"

def fetch_page(start, step):
    req = urllib.request.Request(f"{SUPABASE_URL}/rest/v1/candidates_convocatoria?select=id,registration_date&order=registration_date.desc&limit={step}&offset={start}", headers={
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}'
    })
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode())
    except Exception as e:
        print("Error:", e)
        return []

p1 = fetch_page(0, 1000)
p2 = fetch_page(1000, 1000)

p1_ids = set([x['id'] for x in p1])
p2_ids = set([x['id'] for x in p2])

overlap = p1_ids.intersection(p2_ids)
print("Overlap between pages:", len(overlap))

combined = p1 + p2
print("Total records fetched in pages:", len(combined))
print("Unique IDs fetched in pages:", len(set([x['id'] for x in combined])))

import collections
dates = [x.get('registration_date') for x in combined]
counts = collections.Counter(dates)
dupe_dates = {k: v for k, v in counts.items() if v > 1}
print("Number of identical registration_date timestamps:", sum(dupe_dates.values()))

import urllib.request
import json
import collections
SUPABASE_URL = "https://muyqxxzjcgwyvluzumbt.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11eXF4eHpqY2d3eXZsdXp1bWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxODAzODAsImV4cCI6MjEwMDc1NjM4MH0.dbcSNdYK4psdcAI1XapaTAIkQrZttglJ_kkgODZsICg"
req = urllib.request.Request(f"{SUPABASE_URL}/rest/v1/candidates_convocatoria?select=created_at", headers={
    'apikey': SUPABASE_KEY,
    'Authorization': f'Bearer {SUPABASE_KEY}'
})
try:
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        counts = collections.Counter([x.get('created_at') for x in data])
        print("created_at distribution:")
        for k, v in counts.most_common(5):
            print(f"{k}: {v} records")
except Exception as e:
    print("Error:", e)

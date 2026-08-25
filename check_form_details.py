import urllib.request
import json
import collections
SUPABASE_URL = "https://muyqxxzjcgwyvluzumbt.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11eXF4eHpqY2d3eXZsdXp1bWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxODAzODAsImV4cCI6MjEwMDc1NjM4MH0.dbcSNdYK4psdcAI1XapaTAIkQrZttglJ_kkgODZsICg"
req = urllib.request.Request(f"{SUPABASE_URL}/rest/v1/candidates_convocatoria?select=form_completo,created_at,channel", headers={
    'apikey': SUPABASE_KEY,
    'Authorization': f'Bearer {SUPABASE_KEY}'
})
try:
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        recent = [x for x in data if "2026-08-25T13:44" in str(x.get('created_at'))]
        old = [x for x in data if "2026-08-25T13:44" not in str(x.get('created_at'))]
        
        def breakdown(subset):
            c = collections.Counter([str(x.get('form_completo')) for x in subset])
            return dict(c)
            
        print("Updated at 6:44 (1000 rows):", breakdown(recent))
        print("Untouched (417 rows):", breakdown(old))
except Exception as e:
    print("Error:", e)

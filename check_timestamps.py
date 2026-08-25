import urllib.request
import json
SUPABASE_URL = "https://muyqxxzjcgwyvluzumbt.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11eXF4eHpqY2d3eXZsdXp1bWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxODAzODAsImV4cCI6MjEwMDc1NjM4MH0.dbcSNdYK4psdcAI1XapaTAIkQrZttglJ_kkgODZsICg"
req = urllib.request.Request(f"{SUPABASE_URL}/rest/v1/candidates_convocatoria?select=created_at", headers={
    'apikey': SUPABASE_KEY,
    'Authorization': f'Bearer {SUPABASE_KEY}'
})
try:
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        valid = [x for x in data if x.get('created_at')]
        valid.sort(key=lambda x: x['created_at'], reverse=True)
        print("Most recently created_at records:")
        for x in valid[:5]:
            print(f"Created At: {x['created_at']}")
except Exception as e:
    print("Error:", e)

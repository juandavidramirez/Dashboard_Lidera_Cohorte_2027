import urllib.request
import json

SUPABASE_URL = "https://muyqxxzjcgwyvluzumbt.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11eXF4eHpqY2d3eXZsdXp1bWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxODAzODAsImV4cCI6MjEwMDc1NjM4MH0.dbcSNdYK4psdcAI1XapaTAIkQrZttglJ_kkgODZsICg"

req = urllib.request.Request(f"{SUPABASE_URL}/rest/v1/", headers={
    'apikey': SUPABASE_KEY,
    'Authorization': f'Bearer {SUPABASE_KEY}'
})
try:
    with urllib.request.urlopen(req) as response:
        schema = json.loads(response.read().decode())
        props = schema.get('definitions', {}).get('candidates_convocatoria', {}).get('properties', {})
        print("Real candidates_convocatoria columns in Supabase:")
        for p in sorted(props.keys()):
            print(f"  - {p} ({props[p].get('type')})")
except Exception as e:
    print("Error:", e)

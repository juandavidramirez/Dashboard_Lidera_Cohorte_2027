import urllib.request
import json
SUPABASE_URL = "https://muyqxxzjcgwyvluzumbt.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11eXF4eHpqY2d3eXZsdXp1bWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxODAzODAsImV4cCI6MjEwMDc1NjM4MH0.dbcSNdYK4psdcAI1XapaTAIkQrZttglJ_kkgODZsICg"

def get_count():
    req = urllib.request.Request(f"{SUPABASE_URL}/rest/v1/candidates_convocatoria?select=id", headers={
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Range-Unit': 'items',
        'Prefer': 'count=exact'
    })
    try:
        with urllib.request.urlopen(req) as response:
            count = response.info().get('Content-Range').split('/')[1]
            return int(count)
    except Exception as e:
        print("Error:", e)
        return -1

print("Total in Supabase:", get_count())

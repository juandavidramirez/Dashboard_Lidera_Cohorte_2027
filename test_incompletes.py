import urllib.request
import json
SUPABASE_URL = "https://muyqxxzjcgwyvluzumbt.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11eXF4eHpqY2d3eXZsdXp1bWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxODAzODAsImV4cCI6MjEwMDc1NjM4MH0.dbcSNdYK4psdcAI1XapaTAIkQrZttglJ_kkgODZsICg"
req = urllib.request.Request(f"{SUPABASE_URL}/rest/v1/candidates_convocatoria?select=*", headers={
    'apikey': SUPABASE_KEY,
    'Authorization': f'Bearer {SUPABASE_KEY}'
})
with urllib.request.urlopen(req) as response:
    data = json.loads(response.read().decode())
    incompletes = []
    for cand in data:
        fc = str(cand.get('form_completo', '')).strip().lower()
        if fc not in ['si', 'sí', 'true', 'completo']:
            channel = str(cand.get('channel') or cand.get('fuente_informacion') or cand.get('canal_convocatoria') or '').strip()
            if len(channel) == 0:
                incompletes.append(cand)
    print("Incompletes:", len(incompletes))

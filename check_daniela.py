import urllib.request
import json

SUPABASE_URL = "https://muyqxxzjcgwyvluzumbt.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11eXF4eHpqY2d3eXZsdXp1bWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxODAzODAsImV4cCI6MjEwMDc1NjM4MH0.dbcSNdYK4psdcAI1XapaTAIkQrZttglJ_kkgODZsICg"

req = urllib.request.Request(f"{SUPABASE_URL}/rest/v1/candidates_convocatoria?documento_identificacion=eq.1122143243", headers={
    'apikey': SUPABASE_KEY,
    'Authorization': f'Bearer {SUPABASE_KEY}'
})
try:
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        for r in data:
            print(f"ID: {r.get('id')}")
            print(f"Nombre: {r.get('full_name')}")
            print(f"Canal (DB): {r.get('channel')}")
            print(f"Form Completo: {r.get('form_completo')}")
            print(f"Elegibilidad: {r.get('eligibility')}")
            print(f"Motivo Inel: {r.get('ineligibility_reason')}")
            print("---")
except Exception as e:
    print("Error:", e)

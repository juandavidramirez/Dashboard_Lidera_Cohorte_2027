import urllib.request
import json
SUPABASE_URL = "https://muyqxxzjcgwyvluzumbt.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11eXF4eHpqY2d3eXZsdXp1bWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxODAzODAsImV4cCI6MjEwMDc1NjM4MH0.dbcSNdYK4psdcAI1XapaTAIkQrZttglJ_kkgODZsICg"
all_data = []
start = 0
step = 1000
while True:
    req = urllib.request.Request(f"{SUPABASE_URL}/rest/v1/candidates_convocatoria?select=registration_date,fecha_creacion,created_at&limit={step}&offset={start}", headers={
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}'
    })
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            if not data:
                break
            all_data.extend(data)
            if len(data) < step:
                break
            start += step
    except Exception as e:
        print("Error:", e)
        break

reg_dates = [x for x in all_data if x.get('registration_date')]
f_creacion = [x for x in all_data if x.get('fecha_creacion')]
print("registration_date count:", len(reg_dates))
print("fecha_creacion count:", len(f_creacion))

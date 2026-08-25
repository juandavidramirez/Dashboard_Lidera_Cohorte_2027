import urllib.request
import json

SUPABASE_URL = "https://muyqxxzjcgwyvluzumbt.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11eXF4eHpqY2d3eXZsdXp1bWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxODAzODAsImV4cCI6MjEwMDc1NjM4MH0.dbcSNdYK4psdcAI1XapaTAIkQrZttglJ_kkgODZsICg"

# Let's test inserting a dummy record with only id to see what fails or what columns exist
req = urllib.request.Request(f"{SUPABASE_URL}/rest/v1/candidates_convocatoria", headers={
    'apikey': SUPABASE_KEY,
    'Authorization': f'Bearer {SUPABASE_KEY}',
    'Content-Type': 'application/json',
    'Prefer': 'resolution=merge-duplicates,return=representation'
}, data=json.dumps([{
    "id": "test_column_check_999"
}]).encode())

try:
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode())
        print("Success inserting! Returned fields:")
        if data:
            print(json.dumps(list(data[0].keys()), indent=2))
except urllib.error.HTTPError as e:
    print("HTTPError:", e.code, e.read().decode())
except Exception as e:
    print("Error:", e)

# Clean up test row
req_del = urllib.request.Request(f"{SUPABASE_URL}/rest/v1/candidates_convocatoria?id=eq.test_column_check_999", headers={
    'apikey': SUPABASE_KEY,
    'Authorization': f'Bearer {SUPABASE_KEY}'
})
req_del.get_method = lambda: 'DELETE'
try:
    urllib.request.urlopen(req_del)
except: pass

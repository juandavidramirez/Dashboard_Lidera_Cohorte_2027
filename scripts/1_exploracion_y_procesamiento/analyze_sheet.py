import csv
import json

with open("sheet_headers.json") as f:
    headers = json.load(f)

sheet_id = "1f9Klws7z3NuFgMGK_5QpsCt9p7lwkYeD_vzKj83BMKk"
import urllib.request
import urllib.parse

url = f"https://docs.google.com/spreadsheets/d/{sheet_id}/gviz/tq?tqx=out:csv&sheet={urllib.parse.quote('Respuestas de formulario 1')}"

req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as response:
    content = response.read().decode('utf-8')

reader = list(csv.reader(content.splitlines()))
rows = reader[1:]

fecha_idx = headers.index('Fecha')
print("Fecha column index:", fecha_idx)

# Print unique values or date formats in 'Fecha'
fechas = set(r[fecha_idx] for r in rows if len(r) > fecha_idx)
print(f"Total unique dates in 'Fecha': {len(fechas)}")
print("Sample dates:", sorted(list(fechas))[:30])

# Print columns near the end (calculated columns)
print("\n--- Calculated / Special Columns ---")
for idx in range(70, len(headers)):
    print(f"[{idx}] {headers[idx]}")
    vals = set(r[idx] for r in rows if len(r) > idx and r[idx].strip() != '')
    print(f"   Sample unique non-empty values (up to 10): {list(vals)[:10]}")


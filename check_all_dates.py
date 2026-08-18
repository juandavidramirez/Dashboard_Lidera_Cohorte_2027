import csv
import json
import urllib.request
import urllib.parse
from datetime import datetime
from collections import Counter

sheet_id = "1f9Klws7z3NuFgMGK_5QpsCt9p7lwkYeD_vzKj83BMKk"
url = f"https://docs.google.com/spreadsheets/d/{sheet_id}/gviz/tq?tqx=out:csv&sheet={urllib.parse.quote('Respuestas de formulario 1')}"

req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as response:
    content = response.read().decode('utf-8')

reader = list(csv.reader(content.splitlines()))
headers = reader[0]
rows = reader[1:]

fecha_idx = headers.index('Fecha')

def parse_date(d_str):
    if not d_str or not d_str.strip():
        return None
    parts = d_str.strip().split('/')
    if len(parts) == 3:
        return datetime(int(parts[2]), int(parts[1]), int(parts[0]))
    return None

date_dist = Counter()
invalid_dates = []

for idx, r in enumerate(rows):
    if len(r) > fecha_idx:
        dt = parse_date(r[fecha_idx])
        if dt:
            date_dist[dt.strftime("%Y-%m-%d")] += 1
        else:
            invalid_dates.append((idx, r[fecha_idx]))

print("All dates in sheet (sorted):")
for d in sorted(date_dist.keys()):
    print(f"  {d}: {date_dist[d]}")

print("\nInvalid dates count:", len(invalid_dates))
if invalid_dates:
    print("Invalid dates sample:", invalid_dates[:10])


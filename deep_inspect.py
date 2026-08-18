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

start_date = datetime(2025, 8, 14)
end_date = datetime(2025, 8, 26)

in_range = [r for r in rows if len(r) > fecha_idx and parse_date(r[fecha_idx]) and start_date <= parse_date(r[fecha_idx]) <= end_date]

print(f"Total rows in range 14/08/2025 - 26/08/2025: {len(in_range)}")

# Let's inspect all columns and their distributions for in_range rows
for idx, h in enumerate(headers):
    vals = [r[idx].strip() for r in in_range if len(r) > idx]
    c = Counter(vals)
    # If number of unique values is <= 15, print distribution
    if len(c) <= 15 and len(c) > 0:
        print(f"\nCol [{idx}] '{h}':")
        for k, v in c.most_common():
            print(f"   '{k}': {v}")


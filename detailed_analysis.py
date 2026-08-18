import csv
import json
import urllib.request
import urllib.parse
from datetime import datetime

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
    d_str = d_str.strip()
    parts = d_str.split('/')
    if len(parts) == 3:
        day, month, year = int(parts[0]), int(parts[1]), int(parts[2])
        return datetime(year, month, day)
    return None

start_date = datetime(2025, 8, 14)
end_date = datetime(2025, 8, 26)

filtered_rows = []
out_of_range_rows = []
no_date_rows = []

for idx, r in enumerate(rows):
    if len(r) <= fecha_idx:
        no_date_rows.append((idx, r))
        continue
    f_val = r[fecha_idx]
    dt = parse_date(f_val)
    if dt is None:
        no_date_rows.append((idx, f_val))
    elif start_date <= dt <= end_date:
        filtered_rows.append((idx, dt, r))
    else:
        out_of_range_rows.append((idx, dt, r))

print(f"Total rows in sheet: {len(rows)}")
print(f"Filtered rows (between 14/08/2025 and 26/08/2025): {len(filtered_rows)}")
print(f"Out of range rows: {len(out_of_range_rows)}")
print(f"No date rows: {len(no_date_rows)}")

# Print breakdown by date within range
from collections import Counter
date_counts = Counter(dt.strftime("%Y-%m-%d") for idx, dt, r in filtered_rows)
print("\nRow counts by date within range:")
for d in sorted(date_counts.keys()):
    print(f"  {d}: {date_counts[d]}")


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
estado_idx = headers.index('Estado Proceso de Selección')

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

counts = Counter(r[estado_idx].strip() for r in in_range)
print("State counts (trimmed):")
for k, v in counts.items():
    print(f"  '{k}': {v}")

print("\nLet's test sums of states:")
# Pasa a entrevista (111) + Lectura asignada (90) + Entrevista asignada (69) + Asignar lectura (15) = 285
# What about Pasa a entrevista (111) + Lectura asignada (90) + Entrevista asignada (69) - wait:
# Let's check: 111 + 90 + 69 = 270
# 111 + 69 + 80 = 260
# 111 + 90 + 15 + 41 = ...

# Let's check all subsets of states that sum to 257!
from itertools import combinations
items = list(counts.items())
found_subsets = []
for r in range(1, len(items) + 1):
    for comb in combinations(items, r):
        s = sum(c[1] for c in comb)
        if s == 257:
            found_subsets.append([c[0] for c in comb])

print(f"\nSubsets of 'Estado Proceso de Selección' summing to exactly 257:")
for fs in found_subsets:
    print("  +", " + ".join(fs))


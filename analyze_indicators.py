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
stem_idx = headers.index('STEM')
stem_auto_idx = headers.index('STEM (Automático)')
ingles_idx = headers.index('¿Cuál es tu nivel de inglés?')
lic_prof_idx = headers.index('Licenciatura o Profesional')
uni_idx = headers.index('¿Cuál es la universidad donde realizaste tu última carrera de pregrado?')
form_idx = headers.index('Formulario')

def parse_date(d_str):
    if not d_str or not d_str.strip():
        return None
    parts = d_str.strip().split('/')
    if len(parts) == 3:
        return datetime(int(parts[2]), int(parts[1]), int(parts[0]))
    return None

start_date = datetime(2025, 8, 14)
end_date = datetime(2025, 8, 26)

in_range_rows = []
for r in rows:
    if len(r) > fecha_idx:
        dt = parse_date(r[fecha_idx])
        if dt and start_date <= dt <= end_date:
            in_range_rows.append(r)

print(f"--- Analysis for Period 14/08/2025 to 26/08/2025 (Count: {len(in_range_rows)}) ---")

print("\n1. Unique values in 'Formulario':")
print(Counter(r[form_idx] for r in in_range_rows if len(r) > form_idx))

print("\n2. Unique values in 'Estado Proceso de Selección':")
print(Counter(r[estado_idx] for r in in_range_rows if len(r) > estado_idx))

print("\n3. Unique values in 'STEM':")
print(Counter(r[stem_idx] for r in in_range_rows if len(r) > stem_idx))

print("\n4. Unique values in 'STEM (Automático)':")
print(Counter(r[stem_auto_idx] for r in in_range_rows if len(r) > stem_auto_idx))

print("\n5. Unique values in '¿Cuál es tu nivel de inglés?':")
print(Counter(r[ingles_idx] for r in in_range_rows if len(r) > ingles_idx))

print("\n6. Unique values in 'Licenciatura o Profesional':")
print(Counter(r[lic_prof_idx] for r in in_range_rows if len(r) > lic_prof_idx))


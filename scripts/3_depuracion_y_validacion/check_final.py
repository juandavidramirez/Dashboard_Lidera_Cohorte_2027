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
estado_idx = headers.index('Estado Proceso de Selección')
stem_idx = headers.index('STEM')
stem_auto_idx = headers.index('STEM (Automático)')
ingles_idx = headers.index('¿Cuál es tu nivel de inglés?')
lic_prof_idx = headers.index('Licenciatura o Profesional')
uni_idx = headers.index('¿Cuál es la universidad donde realizaste tu última carrera de pregrado?')

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
elegibles_365 = [r for r in in_range if not r[estado_idx].strip().startswith("No pasa")]

print("=== RECAP ===")
print(f"Total registros del 14 al 26 de agosto de 2025 (Forms + Salesforce): {len(in_range)}")
print(f"Candidatos Elegibles / Pasan mínimos (Estado no 'No pasa'): {len(elegibles_365)}")
print(f"Tasa de Elegibilidad (365 / 687): {len(elegibles_365)/len(in_range)*100:.1f}%")

# Universidades priorizadas check
# Let's see top universities and count
from collections import Counter
unis = Counter(r[uni_idx].strip() for r in elegibles_365)
print("\nUniversidades top entre los 365 elegibles:")
for u, count in unis.most_common(15):
    print(f"  {u}: {count}")


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
fid_idx = headers.index('Fidelización candidaturas')

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

print(f"Total rows in period (14/08/2025 to 26/08/2025): {len(in_range)}")

# Let's define candidate subsets to analyze:
subsets = {
    "1. Total Registros Acumulados (14/08 a 26/08)": in_range,
    "2. Solo Forms (450)": [r for r in in_range if r[form_idx].strip() == 'Forms'],
    "3. No 'No pasa' (365)": [r for r in in_range if not r[estado_idx].strip().startswith("No pasa")],
    "4. Forms No 'No pasa' (266)": [r for r in in_range if r[form_idx].strip() == 'Forms' and not r[estado_idx].strip().startswith("No pasa")],
    "5. Fidelización Encontrado (255)": [r for r in in_range if r[fid_idx].strip() == 'Encontrado'],
    "6. Notificación Cierre (261)": [r for r in in_range if r[headers.index('Notificación cierre y NPS')].strip() == 'Enviada']
}

# Priority universities list or check unique universities
all_unis = Counter(r[uni_idx].strip() for r in in_range if len(r) > uni_idx)
print("\nTop 20 Universities in dataset:")
for u, count in all_unis.most_common(20):
    print(f"  '{u}': {count}")

def compute_metrics(subset, name):
    tot = len(subset)
    if tot == 0:
        return
    print(f"\n==================================================")
    print(f"SUBSET: {name} (N = {tot})")
    print(f"==================================================")
    
    # 1. STEM
    stem_count = sum(1 for r in subset if r[stem_idx].strip().lower() in ['si', 'sí'] or r[stem_auto_idx].strip().lower() in ['si', 'sí'])
    print(f"STEM: {stem_count} de {tot} ({stem_count / tot * 100:.1f}%)")
    
    # 2. B2+ (Inglés: B2, C1, C2)
    b2_plus_count = sum(1 for r in subset if r[ingles_idx].strip().upper() in ['B2', 'C1', 'C2'])
    print(f"B2+: {b2_plus_count} de {tot} ({b2_plus_count / tot * 100:.1f}%)")
    
    # 3. Profesionales (vs Licenciatura)
    prof_count = sum(1 for r in subset if r[lic_prof_idx].strip().lower() == 'profesional')
    lic_count = sum(1 for r in subset if r[lic_prof_idx].strip().lower() == 'licenciatura')
    print(f"Profesionales (Licenciatura o Profesional col): {prof_count} de {tot} ({prof_count / tot * 100:.1f}%)")
    print(f"Licenciaturas (Licenciatura o Profesional col): {lic_count} de {tot} ({lic_count / tot * 100:.1f}%)")

for name, s in subsets.items():
    compute_metrics(s, name)


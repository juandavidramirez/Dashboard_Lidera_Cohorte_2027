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

def parse_date(d_str):
    if not d_str or not d_str.strip():
        return None
    parts = d_str.strip().split('/')
    if len(parts) == 3:
        return datetime(int(parts[2]), int(parts[1]), int(parts[0]))
    return None

start_date = datetime(2025, 8, 14)
end_date = datetime(2025, 8, 26)

# Filter all rows in range 14/08/2025 to 26/08/2025 (Day 13 cumulative)
in_range = [r for r in rows if len(r) > fecha_idx and parse_date(r[fecha_idx]) and start_date <= parse_date(r[fecha_idx]) <= end_date]

total_postulaciones_2025 = len(in_range) # 687

# Define non-eligible statuses: "no pasa", "repetido"
def is_elegible_row(r):
    st = r[estado_idx].strip().lower()
    if 'no pasa' in st or 'repetido' in st:
        return False
    return True

elegibles_2025 = [r for r in in_range if is_elegible_row(r)]
no_elegibles_2025 = [r for r in in_range if not is_elegible_row(r)]

print(f"Total Postulaciones Completas 2025 (al Día 13 - 26/Ago/2025): {total_postulaciones_2025}")
print(f"Candidatos Elegibles 2025: {len(elegibles_2025)}")
print(f"Candidatos No Elegibles 2025: {len(no_elegibles_2025)}")

# Calculate 2025 Pool avance against 1170 goal
goal_2025 = 1170
pct_avance_2025 = (len(elegibles_2025) / goal_2025) * 100

# Calculate 2025 Eligibility Rate
tasa_elegibilidad_2025 = (len(elegibles_2025) / total_postulaciones_2025) * 100

print(f"\nPool mínimo 2025: {len(elegibles_2025)} de {goal_2025} - {pct_avance_2025:.1f}% de avance")
print(f"Tasa de elegibilidad 2025: {len(elegibles_2025)} elegibles de {total_postulaciones_2025} postulaciones completas - {tasa_elegibilidad_2025:.1f}% elegibles")

# Calculate Composition over Elegibles 2025 (N = 365)
top13_keywords = ['andes', 'nacional', 'javeriana', 'antioquia', 'icesi', 'norte', 'valle', 'sabana', 'rosario', 'bolivariana', 'eafit', 'externado', 'uis', 'industrial']
def is_top_uni(r):
    u = r[uni_idx].strip().lower()
    return any(k in u for k in top13_keywords)

n_eleg = len(elegibles_2025)
stem_cnt = sum(1 for r in elegibles_2025 if r[stem_idx].strip().lower() in ['si', 'sí'] or r[stem_auto_idx].strip().lower() in ['si', 'sí'])
b2_cnt = sum(1 for r in elegibles_2025 if r[ingles_idx].strip().upper() in ['B2', 'C1', 'C2'])
uni_prio_cnt = sum(1 for r in elegibles_2025 if is_top_uni(r))
prof_cnt = sum(1 for r in elegibles_2025 if r[lic_prof_idx].strip().lower() == 'profesional')

print(f"\nComposición de elegibles 2025 (N = {n_eleg}):")
print(f"  STEM: {stem_cnt} ({stem_cnt/n_eleg*100:.1f}%)")
print(f"  B2+: {b2_cnt} ({b2_cnt/n_eleg*100:.1f}%)")
print(f"  Universidad priorizada: {uni_prio_cnt} ({uni_prio_cnt/n_eleg*100:.1f}%)")
print(f"  Profesionales: {prof_cnt} ({prof_cnt/n_eleg*100:.1f}%)")

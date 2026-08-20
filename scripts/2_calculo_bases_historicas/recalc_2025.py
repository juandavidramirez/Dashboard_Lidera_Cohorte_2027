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

# ALL 687 rows in the date range
in_range = [r for r in rows if len(r) > fecha_idx and parse_date(r[fecha_idx]) and start_date <= parse_date(r[fecha_idx]) <= end_date]

print(f"Total postulaciones completas en el periodo (Forms + Salesforce): {len(in_range)}")

# Let's inspect 'Estado Proceso de Selección' for all 687
states = Counter(r[estado_idx].strip() for r in in_range)
print("\nDesglose por Estado Proceso de Selección (Total 687):")
for k, v in states.items():
    print(f"  '{k}': {v}")

# Non "No pasa mínimos" states:
elegibles_non_nopasa = [r for r in in_range if not r[estado_idx].strip().startswith("No pasa")]
print(f"\nCandidatos que pasan mínimos / elegibles (No empieza por 'No pasa'): {len(elegibles_non_nopasa)}")

# If 257 elegibles is given by the user prompt:
# Let's check how many elegibles are there in 2025 according to prompt (user said: 2025: 257 de 1170)
# Let's check composition over 257 vs over 365 vs over 687!

def print_composition(candidates_list, label):
    tot = len(candidates_list)
    if tot == 0:
        return
    print(f"\n==========================================")
    print(f"COMPOSICIÓN DE {label} (N = {tot})")
    print(f"==========================================")
    
    # STEM
    stem_c = sum(1 for r in candidates_list if r[stem_idx].strip().lower() in ['si', 'sí'] or r[stem_auto_idx].strip().lower() in ['si', 'sí'])
    print(f"STEM: {stem_c} de {tot} = {stem_c / tot * 100:.2f}% ({stem_c / tot * 100:.1f}%)")
    
    # B2+ (Inglés B2, C1, C2)
    b2_c = sum(1 for r in candidates_list if r[ingles_idx].strip().upper() in ['B2', 'C1', 'C2'])
    print(f"B2+: {b2_c} de {tot} = {b2_c / tot * 100:.2f}% ({b2_c / tot * 100:.1f}%)")
    
    # Profesionales vs Licenciaturas
    prof_c = sum(1 for r in candidates_list if r[lic_prof_idx].strip().lower() == 'profesional')
    lic_c = sum(1 for r in candidates_list if r[lic_prof_idx].strip().lower() == 'licenciatura')
    print(f"Profesionales: {prof_c} de {tot} = {prof_c / tot * 100:.2f}% ({prof_c / tot * 100:.1f}%)")
    print(f"Licenciaturas: {lic_c} de {tot} = {lic_c / tot * 100:.2f}% ({lic_c / tot * 100:.1f}%)")

print_composition(elegibles_non_nopasa, "Elegibles (365 candidatos que no son 'No pasa')")

# What if elegibles is 257? Let's check Fidelización = Encontrado (255) and NPS = Enviada (261)
fid_255 = [r for r in in_range if r[headers.index('Fidelización candidaturas')].strip() == 'Encontrado']
print_composition(fid_255, "Elegibles (Fidelización = Encontrado, N=255)")

nps_261 = [r for r in in_range if r[headers.index('Notificación cierre y NPS')].strip() == 'Enviada']
print_composition(nps_261, "Elegibles (Notificación Cierre = Enviada, N=261)")

# What if we filter the 257 candidates by specific states?
# E.g. 'Pasa a entrevista' (111) + 'Lectura asignada' (90) + 'Entrevista asignada' (69) - wait = 270
# Or 'Pasa a entrevista' (111) + 'Lectura asignada' (90) + 'No pasa mínimos - Año grado' (41) + 'Asignar lectura' (15) = 257
# Let's also compute over total 687 postulaciones completas:
print_composition(in_range, "Todas las Postulaciones Completas (N=687)")


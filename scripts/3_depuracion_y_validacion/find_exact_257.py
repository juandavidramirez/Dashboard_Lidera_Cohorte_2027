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
bilingue_stem_idx = headers.index('Bilingue y/o STEM')

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

# Let's test various candidate subsets
candidates_257_candidates = []

# Check 1: Non-"No pasa" states
pasa_rows = [r for r in in_range if not r[estado_idx].strip().startswith("No pasa")]
print(f"Count of non-'No pasa' states: {len(pasa_rows)}")

# Check 2: 'Fidelización candidaturas' == 'Encontrado'
fid_rows = [r for r in in_range if r[fid_idx].strip() == 'Encontrado']
print(f"Count of 'Fidelización candidaturas' == 'Encontrado': {len(fid_rows)}")

# Check 3: 'Notificación cierre y NPS' == 'Enviada'
nps_idx = headers.index('Notificación cierre y NPS')
nps_rows = [r for r in in_range if r[nps_idx].strip() == 'Enviada']
print(f"Count of 'Notificación cierre y NPS' == 'Enviada': {len(nps_rows)}")

# Check 4: 'Activas 16/10/25' == 'Encontrado'
act_idx = headers.index('Activas 16/10/25')
act_rows = [r for r in in_range if r[act_idx].strip() == 'Encontrado']
print(f"Count of 'Activas 16/10/25' == 'Encontrado': {len(act_rows)}")

# Check 5: Non-'No pasa' in Forms only
forms_pasa = [r for r in in_range if r[form_idx].strip() == 'Forms' and not r[estado_idx].strip().startswith("No pasa")]
print(f"Count of Non-'No pasa' in Forms: {len(forms_pasa)}")

# Check 6: Check custom logic for 257
# What if 257 is: non-'No pasa' in Forms (266) minus something?
# Or what if 257 is from another date filter or specific column?

print("\n--- Let's inspect all rows to see if there is another column indicating elegible ---")
for idx, h in enumerate(headers):
    c = Counter(r[idx].strip() for r in in_range)
    if 250 <= c.get('Si', 0) <= 265 or 250 <= c.get('Sí', 0) <= 265 or 250 <= c.get('Encontrado', 0) <= 265 or 250 <= c.get('Enviada', 0) <= 265:
        print(f"  Col [{idx}] '{h}': {c}")


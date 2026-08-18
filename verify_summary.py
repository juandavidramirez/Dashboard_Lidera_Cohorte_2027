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

in_range = [r for r in rows if len(r) > fecha_idx and parse_date(r[fecha_idx]) and start_date <= parse_date(r[fecha_idx]) <= end_date]
forms_450 = [r for r in in_range if r[form_idx].strip() == 'Forms']
forms_pasa_266 = [r for r in forms_450 if not r[estado_idx].strip().startswith("No pasa")]

print("=== VERIFICATION SUMMARY ===")
print(f"Total range 14-26 aug: {len(in_range)}")
print(f"Forms only: {len(forms_450)}")
print(f"Forms passing minimums: {len(forms_pasa_266)}")

def calc_pcts(subset, label):
    n = len(subset)
    stem = sum(1 for r in subset if r[stem_idx].strip().lower() in ['si', 'sí'] or r[stem_auto_idx].strip().lower() in ['si', 'sí'])
    b2 = sum(1 for r in subset if r[ingles_idx].strip().upper() in ['B2', 'C1', 'C2'])
    prof = sum(1 for r in subset if r[lic_prof_idx].strip().lower() == 'profesional')
    lic = sum(1 for r in subset if r[lic_prof_idx].strip().lower() == 'licenciatura')
    
    print(f"\n--- {label} (N = {n}) ---")
    print(f"  STEM: {stem} / {n} = {stem/n*100:.2f}%")
    print(f"  B2+:  {b2} / {n} = {b2/n*100:.2f}%")
    print(f"  Prof: {prof} / {n} = {prof/n*100:.2f}%")
    print(f"  Lic:  {lic} / {n} = {lic/n*100:.2f}%")

calc_pcts(forms_450, "Forms Completados (450)")
calc_pcts(forms_pasa_266, "Forms Elegibles/Pasa Mínimos (266)")
calc_pcts(in_range, "Todos los Registros Acumulados (687)")


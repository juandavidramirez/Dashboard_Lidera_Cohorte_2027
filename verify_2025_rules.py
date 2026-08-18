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
prom_idx = headers.index('¿Cuál fue tu promedio acumulado en la carrera de pregrado (sobre 5,0)?Si aún no te has graduado, por favor indica tu promedio acumulado actual. Si cursaste más de un pregrado, registra el promedio del último título finalizado.Por favor, ingresa la nota promedio separada por coma decimal (,) para que lo valide el sistema. Ejemplo: 4,5')

def parse_date(d_str):
    if not d_str or not d_str.strip():
        return None
    parts = d_str.strip().split('/')
    if len(parts) == 3:
        return datetime(int(parts[2]), int(parts[1]), int(parts[0]))
    return None

start_date = datetime(2025, 8, 14)
end_date = datetime(2025, 8, 26)

# Filter rows in date range 14/08/2025 to 26/08/2025 (Day 13 cumulative)
in_range = [r for r in rows if len(r) > fecha_idx and parse_date(r[fecha_idx]) and start_date <= parse_date(r[fecha_idx]) <= end_date]

total_postulaciones = len(in_range) # 687

# Elegibles por Estado en Hoja (No 'No pasa mínimos'): 365
elegibles_365 = [r for r in in_range if not r[estado_idx].strip().startswith("No pasa")]

# Top 13 QS / Prioritarias list check for 2025 universities
top13_keywords = ['andes', 'nacional', 'javeriana', 'antioquia', 'icesi', 'norte', 'valle', 'sabana', 'rosario', 'bolivariana', 'eafit', 'externado', 'uis', 'industrial']

def is_top_uni(r):
    u = r[uni_idx].strip().lower()
    return any(k in u for k in top13_keywords)

def analyze_subset(subset, name, denominator):
    n = len(subset)
    print(f"\n==========================================")
    print(f"ANÁLISIS DE COMPOSICIÓN: {name}")
    print(f"Base de cálculo (Denominador): N = {n}")
    print(f"==========================================")
    
    # 1. STEM
    stem_count = sum(1 for r in subset if r[stem_idx].strip().lower() in ['si', 'sí'] or r[stem_auto_idx].strip().lower() in ['si', 'sí'])
    
    # 2. B2+
    b2_count = sum(1 for r in subset if r[ingles_idx].strip().upper() in ['B2', 'C1', 'C2'])
    
    # 3. Universidad Priorizada / Top 13 QS
    uni_prio_count = sum(1 for r in subset if is_top_uni(r))
    
    # 4. Profesionales
    prof_count = sum(1 for r in subset if r[lic_prof_idx].strip().lower() == 'profesional')
    lic_count = sum(1 for r in subset if r[lic_prof_idx].strip().lower() == 'licenciatura')
    
    print(f"- STEM: {stem_count} de {n} = {stem_count/n*100:.1f}%")
    print(f"- B2+ (Inglés): {b2_count} de {n} = {b2_count/n*100:.1f}%")
    print(f"- Universidad Priorizada: {uni_prio_count} de {n} = {uni_prio_count/n*100:.1f}%")
    print(f"- Profesionales: {prof_count} de {n} = {prof_count/n*100:.1f}% (Licenciaturas: {lic_count} de {n} = {lic_count/n*100:.1f}%)")

print(f"Postulaciones completas en el periodo (Forms + Salesforce): {total_postulaciones}")
print(f"Elegibles según columna 'Estado Proceso de Selección' (Pasan mínimos): {len(elegibles_365)}")

# Analyze over Elegibles 365
analyze_subset(elegibles_365, "Sobre Elegibles Registrados en Hoja (365 elegibles)", 365)

# Analyze over 257 elegibles baseline reference if N=257
# Let's see: if user had 257 elegibles as benchmark
# What if we sample or filter 257?
fid_255 = [r for r in in_range if r[headers.index('Fidelización candidaturas')].strip() == 'Encontrado']
analyze_subset(fid_255, "Sobre Subconjunto 'Fidelización Encontrado' (~255 elegibles)", 255)

# Also show over Total Postulaciones Completas (687) for reference
analyze_subset(in_range, "Sobre TOTAL Postulaciones Completas (687 postulaciones)", 687)


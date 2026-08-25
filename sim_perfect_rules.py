import urllib.request
import csv
import io
import re
import unicodedata

def norm(text):
    if not text: return ""
    t = str(text).lower().strip()
    t = ''.join(c for c in unicodedata.normalize('NFD', t) if unicodedata.category(c) != 'Mn')
    t = re.sub(r'[^a-z0-9]', '', t)
    return t

# Let's see how many valid rows meet criteria:
url = "https://docs.google.com/spreadsheets/d/1mkdjjH6m5hZrXbvs-KH9CtQfAEealqu_yKNwje-8uW0/export?format=csv"
req = urllib.request.Request(url)
with urllib.request.urlopen(req) as resp:
    content = resp.read().decode('utf-8')
reader = list(csv.reader(io.StringIO(content)))

rows = reader[1:]
valid_rows = [r for r in rows if r and r[0].strip()]

print(f"Total valid rows: {len(valid_rows)}")
# Level test:
# "Pregrado con título", "Pregrado sin título", "Normalista superior", "Maestría con título", "Maestría sin título", "Doctorado con título", "Doctorado sin título", "Especialización con título", "Especialización sin título"
valid_levels = [
    "pregrado con titulo", "pregrado sin titulo", "normalista superior",
    "maestria con titulo", "maestria sin titulo", "doctorado con titulo",
    "doctorado sin titulo", "especializacion con titulo", "especializacion sin titulo",
    "profesional", "licenciatura", "maestria", "doctorado"
]
invalid_levels = ["tecnico o tecnologo", "tecnologo", "tecnico", "bachiller o estudiante"]

count_level_ok = 0
for r in valid_rows:
    lvl = r[9].lower().strip()
    is_ok = not any(inv in lvl for inv in invalid_levels) and (any(v in lvl for v in ["pregrado", "normalista", "maestria", "doctorado", "especializacion", "profesional", "licenciatura"]))
    if is_ok:
        count_level_ok += 1

print(f"Level OK count: {count_level_ok}/{len(valid_rows)}")


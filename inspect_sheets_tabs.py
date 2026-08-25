import urllib.request
import csv
import io

# Let's inspect the sheets if we can export the other tabs
# The spreadsheet ID is 1mkdjjH6m5hZrXbvs-KH9CtQfAEealqu_yKNwje-8uW0
# Let's see what tabs exist or check what happens with the formulas
# Let's write a python script to test each condition against the live sheet data

url = "https://docs.google.com/spreadsheets/d/1mkdjjH6m5hZrXbvs-KH9CtQfAEealqu_yKNwje-8uW0/export?format=csv"
req = urllib.request.Request(url)
with urllib.request.urlopen(req) as resp:
    content = resp.read().decode('utf-8')
reader = list(csv.reader(io.StringIO(content)))

header = reader[0]
rows = reader[1:]
valid_rows = [r for r in rows if r and r[0].strip()]

print(f"Total rows in Data_raw_conv: {len(valid_rows)}")
print("Header:")
for idx, h in enumerate(header):
    print(f"[{idx}] {h}")

print("\nSample 10 rows columns 22 to 34 (W to AI):")
for r in valid_rows[:10]:
    print(f"Doc: {r[3]} | Prom: {r[10]} | Año: {r[7]} | Uni: {r[8]} | Carrera: {r[6]} | Nivel: {r[9]}")
    print(f"   -> STEM: {r[22]} | Top13: {r[23]} | Prio: {r[24]} | Pre: {r[25]} | Enf: {r[26]} | Cumple: {r[28]} | Motivo: {r[29]}")


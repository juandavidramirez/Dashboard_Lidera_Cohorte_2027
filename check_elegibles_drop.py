import urllib.request
import csv
import io
import json

# Let's inspect the 18 duplicate rows in Google Sheets
url = "https://docs.google.com/spreadsheets/d/1mkdjjH6m5hZrXbvs-KH9CtQfAEealqu_yKNwje-8uW0/export?format=csv"
req = urllib.request.Request(url)
with urllib.request.urlopen(req) as resp:
    content = resp.read().decode('utf-8')
reader = list(csv.reader(io.StringIO(content)))

header = reader[0]
rows = reader[1:]
valid_rows = [r for r in rows if r and r[0].strip()]

# Let's find all duplicate documents and both occurrences (first occurrence vs second occurrence)
docs_map = {}
for idx, r in enumerate(valid_rows):
    doc = r[3].strip()
    if not doc: continue
    if doc not in docs_map:
        docs_map[doc] = []
    docs_map[doc].append((idx+2, r))

dupes = {k: v for k, v in docs_map.items() if len(v) > 1}
print(f"Total documents with duplicates: {len(dupes)}")

for doc, occurrences in dupes.items():
    print(f"\n--- Documento: {doc} ({len(occurrences)} registros) ---")
    for row_num, r in occurrences:
        canal = r[13].strip()
        form = r[34].strip()
        minimos = r[28].strip()
        motivo = r[29].strip()
        gpa = r[10].strip()
        eng = r[11].strip()
        print(f"  Fila {row_num}: ID={r[0]}, Nombre={r[2]}, Canal={canal!r}, Form={form!r}, Minimos={minimos!r}, Motivo={motivo!r}, GPA={gpa}, Eng={eng}")


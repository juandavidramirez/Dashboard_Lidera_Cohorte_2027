import urllib.request
import csv
import io

url = "https://docs.google.com/spreadsheets/d/1mkdjjH6m5hZrXbvs-KH9CtQfAEealqu_yKNwje-8uW0/export?format=csv"
req = urllib.request.Request(url)
with urllib.request.urlopen(req) as resp:
    content = resp.read().decode('utf-8')
reader = list(csv.reader(io.StringIO(content)))

rows = reader[1:]
valid_rows = [r for r in rows if r and r[0].strip()]

# Let's inspect the duplicate pairs
docs_map = {}
for idx, r in enumerate(valid_rows):
    doc = r[3].strip()
    if not doc: continue
    if doc not in docs_map:
        docs_map[doc] = []
    docs_map[doc].append((idx+2, r))

dupes = {k: v for k, v in docs_map.items() if len(v) > 1}
for doc, occurrences in list(dupes.items())[:5]:
    print(f"Doc {doc}:")
    for row_num, r in occurrences:
        print(f"  Fila {row_num}: Canal='{r[13]}', Form='{r[34]}', Minimos='{r[28]}', Motivo='{r[29]}'")


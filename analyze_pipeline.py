# Let's inspect why the count in Google Sheets is 708 and 448
# Let's see what changed or why rows are marked as NO or empty
import urllib.request
import csv
import io
from collections import Counter

url = "https://docs.google.com/spreadsheets/d/1mkdjjH6m5hZrXbvs-KH9CtQfAEealqu_yKNwje-8uW0/export?format=csv"
req = urllib.request.Request(url)
with urllib.request.urlopen(req) as resp:
    content = resp.read().decode('utf-8')
reader = list(csv.reader(io.StringIO(content)))

rows = reader[1:]
valid_rows = [r for r in rows if r and r[0].strip()]

# Check all reasons for "No cumple mínimos" or Form Completo "NO"
reasons_for_no_cumple = Counter([r[29].strip() if len(r) > 29 else "" for r in valid_rows])
print("Motivos no cumplimiento:")
for reason, count in reasons_for_no_cumple.most_common():
    print(f"  {reason or '(Vacio)'}: {count}")

# Check Column 13 (Fuente de información / Canal)
canales = Counter([r[13].strip() if len(r) > 13 else "" for r in valid_rows])
print("\nCanal P (Col 13) non-empty vs empty:")
print(f"  Non-empty (Llenaron canal): {sum(c for val, c in canales.items() if val != '')}")
print(f"  Empty (No llenaron canal): {canales.get('', 0)}")

# Check if there are rows that have canal filled, but Form Completo is NO or empty:
mismatches = []
for idx, r in enumerate(valid_rows):
    canal = r[13].strip() if len(r) > 13 else ""
    form = r[34].strip().upper() if len(r) > 34 else ""
    doc = r[3].strip() if len(r) > 3 else ""
    motivo = r[29].strip() if len(r) > 29 else ""
    # if canal is not empty but form is NO:
    if canal != "" and form != "SI":
        mismatches.append((idx+2, r[0], r[2], doc, canal, form, motivo))

print(f"\nRows where Canal is filled BUT Form Completo is not 'SI': {len(mismatches)}")
for m in mismatches[:10]:
    print(" ", m)


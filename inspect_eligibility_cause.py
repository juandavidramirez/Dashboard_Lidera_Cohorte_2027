import urllib.request
import csv
import io

url = "https://docs.google.com/spreadsheets/d/1mkdjjH6m5hZrXbvs-KH9CtQfAEealqu_yKNwje-8uW0/export?format=csv"
req = urllib.request.Request(url)
with urllib.request.urlopen(req) as resp:
    content = resp.read().decode('utf-8')
reader = list(csv.reader(io.StringIO(content)))

header = reader[0]
rows = reader[1:]

for i, h in enumerate(header):
    print(f"[{i}] {h}")

print("\nFirst 5 rows in Sheets (columns 22 to 34):")
for r in rows[:5]:
    if not r: continue
    print("Row:", r[0], r[2])
    print("  STEM (22):", r[22] if len(r)>22 else "")
    print("  Top13 (23):", r[23] if len(r)>23 else "")
    print("  Prio (24):", r[24] if len(r)>24 else "")
    print("  TipoPre (25):", r[25] if len(r)>25 else "")
    print("  Enfoque (26):", r[26] if len(r)>26 else "")
    print("  Minimos (28):", r[28] if len(r)>28 else "")
    print("  Motivo (29):", r[29] if len(r)>29 else "")


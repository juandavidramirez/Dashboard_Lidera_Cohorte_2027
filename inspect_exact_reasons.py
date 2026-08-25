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

motivos = Counter([r[29] for r in valid_rows])
print("Motivos in Google Sheets:")
for m, c in motivos.most_common():
    print(f"  {m}: {c}")


import csv
import urllib.request
import urllib.parse
import json

sheet_id = "1f9Klws7z3NuFgMGK_5QpsCt9p7lwkYeD_vzKj83BMKk"
sheet_name = "Respuestas de formulario 1"
encoded_sheet_name = urllib.parse.quote(sheet_name)
url = f"https://docs.google.com/spreadsheets/d/{sheet_id}/gviz/tq?tqx=out:csv&sheet={encoded_sheet_name}"

print("Downloading sheet...")
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as response:
    content = response.read().decode('utf-8')

reader = list(csv.reader(content.splitlines()))
headers = reader[0]
rows = reader[1:]

print(f"Total rows: {len(rows)}")
print("Header columns count:", len(headers))
print("\nList of columns:")
for idx, h in enumerate(headers):
    print(f"{idx}: {repr(h)}")

# Save headers and first few rows to inspect
with open("sheet_headers.json", "w") as f:
    json.dump(headers, f, indent=2)


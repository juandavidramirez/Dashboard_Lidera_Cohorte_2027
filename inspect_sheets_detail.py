import urllib.request
import csv
import io
import json
from collections import Counter

url = "https://docs.google.com/spreadsheets/d/1mkdjjH6m5hZrXbvs-KH9CtQfAEealqu_yKNwje-8uW0/export?format=csv"
req = urllib.request.Request(url)
with urllib.request.urlopen(req) as resp:
    content = resp.read().decode('utf-8')
reader = list(csv.reader(io.StringIO(content)))

header = reader[0]
rows = reader[1:]

valid_rows = [r for r in rows if r and r[0].strip()]
print(f"Valid non-empty rows in Google Sheets CSV: {len(valid_rows)}")

# Let's inspect column 34 (Form completo) and column 28 (Cumple mínimos) directly in the Sheet:
col_form_completo = 34
col_cumple_minimos = 28
col_canal_p = 13
col_doc = 3
col_id = 0

sheet_form_raw = [r[col_form_completo].strip().upper() if len(r) > col_form_completo else "" for r in valid_rows]
print("Direct Sheet Col 34 (Form completo) distribution:", Counter(sheet_form_raw))

sheet_cumple_raw = [r[col_cumple_minimos].strip() if len(r) > col_cumple_minimos else "" for r in valid_rows]
print("Direct Sheet Col 28 (Cumple mínimos) distribution:", Counter(sheet_cumple_raw))

# If we look at rows where Form completo == 'SI':
form_si_rows = [r for r in valid_rows if len(r) > col_form_completo and r[col_form_completo].strip().upper() == 'SI']
print(f"Total rows in Sheet with Form Completo == 'SI': {len(form_si_rows)}")

form_si_cumple = [r for r in form_si_rows if len(r) > col_cumple_minimos and "Cumple mínimos" in r[col_cumple_minimos]]
print(f"Total rows in Sheet with Form Completo == 'SI' and Cumple mínimos: {len(form_si_cumple)}")

# Now let's check duplicates:
doc_seen = {}
sheet_unique_rows = []
sheet_dupe_rows = []
for r in valid_rows:
    doc = r[col_doc].strip()
    if doc:
        if doc in doc_seen:
            sheet_dupe_rows.append(r)
            continue
        doc_seen[doc] = r
    sheet_unique_rows.append(r)

print(f"\nUnique rows by Document: {len(sheet_unique_rows)}")
print(f"Dupe rows by Document: {len(sheet_dupe_rows)}")

unique_form_si = [r for r in sheet_unique_rows if len(r) > col_form_completo and r[col_form_completo].strip().upper() == 'SI']
unique_form_si_cumple = [r for r in unique_form_si if len(r) > col_cumple_minimos and "Cumple mínimos" in r[col_cumple_minimos]]

print(f"In Unique rows: Form Completo == 'SI': {len(unique_form_si)}")
print(f"In Unique rows: Form Completo == 'SI' & Cumple mínimos: {len(unique_form_si_cumple)}")


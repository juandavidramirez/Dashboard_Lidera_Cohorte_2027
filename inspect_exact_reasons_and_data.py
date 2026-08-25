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

# Let's inspect why:
# In the live sheet:
# STEM is ALWAYS "No STEM" (1478 times)
# Top13 is ALWAYS "No" (1478 times)
# Prio is ALWAYS "No" (1478 times)
# Enfoque is ALWAYS "No" (1478 times)
# Canal is ALWAYS "Otro" (1478 times)

print("STEM distinct values:", set(r[22] for r in valid_rows))
print("Top13 distinct values:", set(r[23] for r in valid_rows))
print("Prio distinct values:", set(r[24] for r in valid_rows))
print("TipoPre distinct values:", set(r[25] for r in valid_rows))
print("Enfoque distinct values:", set(r[26] for r in valid_rows))
print("Canal distinct values:", set(r[27] for r in valid_rows))
print("Cumple distinct values:", set(r[28] for r in valid_rows))


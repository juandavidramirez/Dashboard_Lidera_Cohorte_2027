import json

with open("sheet_headers.json") as f:
    headers = json.load(f)

for idx, h in enumerate(headers):
    print(f"{idx}: {repr(h)}")

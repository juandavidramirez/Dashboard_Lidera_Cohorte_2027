import urllib.request
import re

# Fetch Google Sheet HTML to see available sheet/gid tabs
url = "https://docs.google.com/spreadsheets/d/1mkdjjH6m5hZrXbvs-KH9CtQfAEealqu_yKNwje-8uW0/edit"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8')
        # Find sheet names and gids
        matches = re.findall(r'\"name\":\"([^\"]+)\"[^}]*\"sheetId\":([0-9]+)', html)
        print("Found sheets:")
        for name, gid in set(matches):
            print(f"  Tab: {name} (gid={gid})")
except Exception as e:
    print("Error fetching sheet edit page:", e)

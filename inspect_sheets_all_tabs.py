import urllib.request
import re

url = "https://docs.google.com/spreadsheets/d/1mkdjjH6m5hZrXbvs-KH9CtQfAEealqu_yKNwje-8uW0/edit"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8')
        # Find sheet names and gid
        # look for "name":"..." and "sheetId":...
        import json
        matches = re.findall(r'(\d+),\[\\"([^\\"]+)\\"', html)
        print("Matches in html:", matches[:10])
        # look for pattern of sheet names in json bootstrap
        names = re.findall(r'\[(\d+),0,\["([^"]+)"', html)
        print("Names pattern:", names)
        
        # let's search for Carreras_STEM or Top13
        gids = re.findall(r'"gid":(\d+).*?"name":"([^"]+)"', html)
        print("Gids:", gids)
        if not gids:
            gids = re.findall(r'gid=(\d+)', html)
            print("all gids found:", set(gids))
except Exception as e:
    print("Error:", e)


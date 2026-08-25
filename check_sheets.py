import urllib.request
import csv
import io

url = "https://docs.google.com/spreadsheets/d/1mkdjjH6m5hZrXbvs-KH9CtQfAEealqu_yKNwje-8uW0/export?format=csv"
try:
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as response:
        data = response.read().decode('utf-8')
        reader = csv.reader(io.StringIO(data))
        rows = list(reader)
        print(f"Total rows in CSV: {len(rows)}")
        if len(rows) > 0:
            print("Headers:", rows[0][:5], "...")
        
        # Let's count form_completo (column AI -> index 34) and eligibility (column AC -> index 28)
        # We need to find the exact column indices from the header if possible, or just use the indices from the script.
        # Script says:
        # colCanalP = 13 (N) -> if not empty -> Form Completo = SI
        # colMinimos = 28 (AC) -> "Cumple mínimos"
        
        form_completo_count = 0
        elegibles_count = 0
        
        for i, row in enumerate(rows[1:]): # skip header
            if not row or not row[0].strip():
                continue
                
            # Form Completo: N column is index 13
            canal_p = row[13].strip() if len(row) > 13 else ""
            form_completo = "SI" if canal_p != "" else "NO"
            
            # Eligibility: AC column is index 28 (or derived)
            cumple_minimos = row[28].strip() if len(row) > 28 else ""
            
            if form_completo == "SI":
                form_completo_count += 1
                if "Cumple mínimos" in cumple_minimos:
                    elegibles_count += 1

        print(f"Sheets - Postulantes (Form SI): {form_completo_count}")
        print(f"Sheets - Elegibles (Cumple mínimos): {elegibles_count}")

except Exception as e:
    print("Error fetching Sheets:", e)

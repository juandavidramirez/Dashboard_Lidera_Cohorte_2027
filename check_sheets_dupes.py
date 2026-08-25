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
        
        valid_rows = 0
        doc_ids = set()
        dupe_docs = 0
        
        for i, row in enumerate(rows[1:]): # skip header
            if not row or not row[0].strip():
                continue
            
            valid_rows += 1
            doc = row[3].strip() if len(row) > 3 else ""
            if doc:
                if doc in doc_ids:
                    dupe_docs += 1
                else:
                    doc_ids.add(doc)
                    
        print(f"Total valid IDs in Sheet: {valid_rows}")
        print(f"Duplicate documents in Sheet: {dupe_docs}")
        print(f"Unique records by document: {valid_rows - dupe_docs}")

except Exception as e:
    print("Error fetching Sheets:", e)

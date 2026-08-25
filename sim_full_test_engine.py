import urllib.request
import csv
import io
import re
import unicodedata

def norm(text):
    if not text: return ""
    t = str(text).lower().strip()
    t = re.sub(r'\(.*?\)', '', t)
    t = ''.join(c for c in unicodedata.normalize('NFD', t) if unicodedata.category(c) != 'Mn')
    t = re.sub(r'[^a-z0-9]', '', t)
    return t

# Let's test the year parse:
# "2015 o antes" -> 2015!
# "2024" -> 2024
def parse_year(val):
    if not val: return None
    s = str(val).strip()
    m = re.search(r'\b(20\d\d)\b', s)
    if m:
        return int(m.group(1))
    return None

print("Year test:")
print("'2015 o antes' ->", parse_year('2015 o antes'))
print("'2024' ->", parse_year('2024'))

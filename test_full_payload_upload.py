import urllib.request
import csv
import io
import json

SUPABASE_URL = "https://muyqxxzjcgwyvluzumbt.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11eXF4eHpqY2d3eXZsdXp1bWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxODAzODAsImV4cCI6MjEwMDc1NjM4MH0.dbcSNdYK4psdcAI1XapaTAIkQrZttglJ_kkgODZsICg"

# Test map exactly as it should be
def test_mapping_row(fila):
    # fila is list of 35 columns
    id_val = str(fila[0] or "").strip()
    if not id_val: return None

    gpa = float(fila[10]) if fila[10] and str(fila[10]).replace('.', '', 1).isdigit() else 0.0
    try:
        grad_year = int(float(fila[7])) if fila[7] else None
    except:
        grad_year = None
    
    english_level = str(fila[11] or "").strip()
    stem_clasificacion = str(fila[22] or "").strip()
    uni_top13 = str(fila[23] or "").strip()
    uni_priorizada = str(fila[24] or "").strip()
    tipo_pregrado = str(fila[25] or "").strip()

    is_stem = stem_clasificacion in ["STEM", "STEM Transición"]
    is_bilingual = english_level.upper() in ["B2", "C1", "C2"]

    try:
        edad_num = int(float(fila[31])) if fila[31] else None
    except:
        edad_num = None

    return {
        "id": id_val,
        "id_primera_revision": id_val,
        "full_name": str(fila[2] or "").strip(),
        "documento_identificacion": str(fila[3] or "").strip(),
        "email": str(fila[4] or "").strip(),
        "phone": str(fila[5] or "").strip(),
        "career": str(fila[6] or "").strip(),
        "graduation_year": grad_year,
        "university_raw": str(fila[8] or "").strip(),
        "university_normalized": str(fila[8] or "").strip(),
        "nivel_educacion": str(fila[9] or "").strip(),
        "gpa": gpa,
        "english_level": english_level,
        "grupo_etnico": str(fila[12] or "").strip(),
        "channel": str(fila[13] or "").strip(),
        "fuente_informacion": str(fila[13] or "").strip(),
        "medio_interes": str(fila[14] or "").strip(),
        "referred_by": str(fila[15] or "").strip(),
        "responsabilidad_familiar": str(fila[17] or "").strip(),
        "monitor": str(fila[18] or "").strip(),
        "pago_estudios": str(fila[19] or "").strip(),
        "department": str(fila[21] or "").strip(),
        "departamento_residencia": str(fila[21] or "").strip(),
        "stem_clasificacion": stem_clasificacion,
        "uni_top13_qs": uni_top13,
        "uni_prioritaria": uni_priorizada,
        "tipo_pregrado": tipo_pregrado,
        "enfoque": str(fila[26] or "").strip(),
        "eligibility": str(fila[28] or "").strip(),
        "ineligibility_reason": str(fila[29] or "").strip(),
        "route": str(fila[30] or "").strip(),
        "edad": edad_num,
        "month": str(fila[32] or "").strip(),
        "hpc": str(fila[33] or "").strip(),
        "form_completo": str(fila[34] or "").strip().upper(),
        "is_stem": is_stem,
        "is_bilingual": is_bilingual
    }

# Test sending a single batch
sample = test_mapping_row([
    "a0FQU00000TEST1", "2026-08-25", "Juan Test", "12345678", "juan@test.com", "3001234567",
    "Ingeniería de Sistemas", "2024", "Universidad Nacional", "Profesional", "4.5", "B2",
    "Mestizo", "Facebook", "Redes", "Amigo", "2000-01-01", "No", "No", "Propio",
    "2026-08-25", "Bogotá D.C.", "STEM", "Si", "Si", "Pregrado", "Si", "Convocatoria 2027",
    "Cumple mínimos", "N/A", "STEM", "26", "Agosto", "No", "SI"
])

req = urllib.request.Request(f"{SUPABASE_URL}/rest/v1/candidates_convocatoria", headers={
    'apikey': SUPABASE_KEY,
    'Authorization': f'Bearer {SUPABASE_KEY}',
    'Content-Type': 'application/json',
    'Prefer': 'resolution=merge-duplicates,return=representation'
}, data=json.dumps([sample]).encode())

try:
    with urllib.request.urlopen(req) as resp:
        print("Success payload verification! Response status:", resp.status)
except urllib.error.HTTPError as e:
    print("HTTP Error:", e.code, e.read().decode())

# Clean up test row
req_del = urllib.request.Request(f"{SUPABASE_URL}/rest/v1/candidates_convocatoria?id=eq.a0FQU00000TEST1", headers={
    'apikey': SUPABASE_KEY,
    'Authorization': f'Bearer {SUPABASE_KEY}'
})
req_del.get_method = lambda: 'DELETE'
try:
    urllib.request.urlopen(req_del)
except: pass


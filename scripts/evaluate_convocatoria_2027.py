#!/usr/bin/env python3
"""
Evaluador de Convocatoria 2027
------------------------------
Descarga directamente la hoja de cálculo de Google Sheets 'Data_Raw_Conv',
ejecuta las reglas de negocio de evaluación (STEM, Top13, Priorizadas,
Enfoque, Elegibilidad, Rutas y HPC) y genera un reporte comparativo completo.

Uso:
    python3 scripts/evaluate_convocatoria_2027.py
"""

import urllib.request
import csv
import io
import re
import unicodedata
from collections import Counter

SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/1mkdjjH6m5hZrXbvs-KH9CtQfAEealqu_yKNwje-8uW0/export?format=csv"

# Listas de criterios oficiales
STEM_PRIORIZADAS = [
    "bioquimica", "mecanica", "mecatronica", "mecatronico", "quimica", "sistemas",
    "medio ambient", "electromecanica", "electronica", "automatizacion", "informatica",
    "teleinformatica", "telematica", "fisica", "estadistica", "matematicas", "biolog",
    "computadores", "electricidad", "tecnologias", "electrica", "naturales", "ambiental",
    "tecnologia", "agropecuaria", "agricola", "forestal", "desarrollo ambiental",
    "agroecologia", "agroecologica", "telecomunicaciones", "agroindustrial",
    "bacteriol", "agronomica", "nanotec", "civil", "produccion animal", "gegrafica",
    "industrial", "materiales", "alimentos", "minas"
]

STEM_RECHAZO = ["cultura fisica", "deporte", "educacion fisica", "politica", "sociales"]

RECHAZO_TAJANTE = [
    "formacion estetica", "religiosas", "estudios religiosos", "biotecnologica", "metalurgica",
    "etica", "economicas y politicas", "administracion comercial", "biblicas", "construccion",
    "danzas", "direccion de banda", "diseno multimedial", "ecologia", "biomedica",
    "interpretacion musical", "recreacion", "democracia", "valores humanos", "desarollo comunitario",
    "teoria politica", "preescolar musical", "musica", "arqueologia", "representativas",
    "bibliotecologia", "enfermeria", "militar", "policial", "instrumentacion quirurgica",
    "educacion especial", "medicina", "veterinaria", "odontologia", "optometria", "publicidad",
    "salud publica", "terapias", "trabajo social", "zootecnia", "teolog", "veterin",
    "licenciatura en filosofia con enfasis en teoria politica",
    "licenciatura en pedagogia y didactica de la educacion fisica, recreacion y deporte",
    "licenciatura en educacion fisica con enfasis en educacion fisica, recreacion y deportes",
    "licenciatura en deporte", "licenciatura en cultura fisica, recreacion, educacion fisica y deporte",
    "licenciatura en cultura fisica y deporte", "licenciatura en ciencias del deporte y la educacion fisica",
    "licenciado en educacion basica con enfasis en educacion fisica, recreacion y deportes",
    "licenciatura en filologia", "licenciatura en geografia", "deportologia",
    "entrenamiento deportivo", "musical", "soldado", "cadete", "educacion basica primaria",
    "educacion infantil", "primera infancia", "preescolar"
]

TOP13_QS = [
    "universidad de los andes", "universidad nacional de colombia", "pontificia universidad javeriana",
    "universidad de antioquia", "universidad eafit", "universidad externado de colombia",
    "universidad de la sabana", "universidad pontificia bolivariana", "universidad icesi",
    "universidad industrial de santander", "universidad del norte", "universidad del valle",
    "rosario", "javeriana"
]

UNIVERSIDADES_PRIORIZADAS = [
    "universidad de los andes", "universidad nacional de colombia", "pontificia universidad javeriana",
    "universidad de antioquia", "universidad icesi", "universidad del norte",
    "universidad del valle", "javeriana"
]

NIVELES_INGLES_TOP = ["B2", "C1", "C2"]
ANOS_VALIDOS = ["2027", "2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015", "2014"]
PROMEDIO_MINIMO = 3.5

def normalizar(txt):
    if not txt: return ""
    t = str(txt).strip().lower()
    t = ''.join(c for c in unicodedata.normalize('NFD', t) if unicodedata.category(c) != 'Mn')
    return t

def parse_promedio(valor):
    if not valor: return None
    s = str(valor).strip().replace(',', '.')
    try:
        return float(s)
    except:
        return None

def extraer_ano(valor):
    if not valor: return ""
    s = str(valor).strip()
    m = re.search(r'\b(20\d\d)\b', s)
    return m.group(1) if m else s

def evaluar():
    print(f"📥 Descargando datos desde Google Sheets...")
    req = urllib.request.Request(SHEET_CSV_URL, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as resp:
        content = resp.read().decode('utf-8')
    
    reader = list(csv.reader(io.StringIO(content)))
    if not reader:
        print("❌ Error: No se encontraron datos en la hoja.")
        return

    header = reader[0]
    filas = [r for r in reader[1:] if r and r[0].strip()]
    print(f"📊 Registros reales de Salesforce analizados: {len(filas)}")

    documentos_vistos = set()
    resultados = []

    for r in filas:
        doc = str(r[3] or "").strip()
        canal_p = str(r[13] or "").strip()
        form_completo = "SI" if canal_p != "" else "NO"

        if doc != "":
            if doc in documentos_vistos:
                resultados.append({
                    "cumple": "No cumple mínimos",
                    "motivos": "Documento duplicado",
                    "stem": "Duplicado",
                    "ruta": "N/A",
                    "form": form_completo
                })
                continue
            documentos_vistos.add(doc)

        uni_norm = normalizar(r[8] if len(r) > 8 else "")
        car_norm = normalizar(r[6] if len(r) > 6 else "")
        nivel_norm = normalizar(r[9] if len(r) > 9 else "")

        # STEM
        es_prio = any(p in car_norm for p in STEM_PRIORIZADAS)
        es_rech = any(rc in car_norm for rc in STEM_RECHAZO)
        
        if "tecnologia" in car_norm:
            estado_stem = "STEM Priorizada"
        elif (es_prio or "naturales" in car_norm) and not es_rech:
            estado_stem = "STEM Priorizada"
        elif ("ingenieria" in car_norm or "ciencia" in car_norm) and not es_rech:
            estado_stem = "STEM No Priorizada"
        else:
            estado_stem = "NO"

        # Tipo Carrera
        es_no_plazable = any(t in car_norm for t in RECHAZO_TAJANTE)
        if "licencia" in car_norm or "lic " in car_norm:
            tipo_carrera = "Carrera no plazable" if es_no_plazable else "Licenciatura"
        elif es_no_plazable or "criminalistica" in car_norm or "audiovisual" in car_norm:
            tipo_carrera = "Carrera no plazable"
        elif "tecn" in nivel_norm or "normal" in nivel_norm or "superio" in nivel_norm or "normalista" in car_norm:
            tipo_carrera = "NO"
        else:
            tipo_carrera = "Profesional"

        # Universidades
        es_top13 = any(u in uni_norm for u in TOP13_QS)
        es_prio_uni = any(u in uni_norm for u in UNIVERSIDADES_PRIORIZADAS)

        # Enfoque
        ingles = str(r[11] or "").strip().upper() if len(r) > 11 else ""
        es_bil = ingles in NIVELES_INGLES_TOP

        if estado_stem == "STEM Priorizada" and es_bil:
            enfoque = "STEM y Bilingüe"
        elif estado_stem == "STEM Priorizada":
            enfoque = "STEM"
        elif es_bil:
            enfoque = "Bilingüe"
        else:
            enfoque = "No STEM no Bilingüe"

        # Criterios
        ano_raw = str(r[7] or "").strip() if len(r) > 7 else ""
        ano_extraido = extraer_ano(ano_raw)
        c_ano = ano_extraido in ANOS_VALIDOS or ano_raw in ANOS_VALIDOS

        prom_val = parse_promedio(r[10] if len(r) > 10 else "")
        c_prom = (prom_val is not None) and (prom_val >= PROMEDIO_MINIMO)

        c_min = (c_ano and c_prom and enfoque != "No STEM no Bilingüe" and tipo_carrera not in ["NO", "Carrera no plazable"])

        cumple_str = "Cumple mínimos" if c_min else "No cumple mínimos"
        
        ruta = "N/A"
        if c_min:
            if enfoque == "STEM y Bilingüe" or es_prio_uni:
                ruta = "Ruta Promisorios"
            else:
                ruta = "Ruta General"

        motivos = []
        if not c_ano: motivos.append("Año")
        if not c_prom: motivos.append("Promedio")
        if enfoque == "No STEM no Bilingüe": motivos.append("Enfoque")
        if tipo_carrera == "NO": motivos.append("Nivel (Normalista o Técnico)")
        if tipo_carrera == "Carrera no plazable": motivos.append("Carrera no plazable")

        resultados.append({
            "cumple": cumple_str,
            "motivos": "; ".join(motivos) or "N/A",
            "stem": estado_stem,
            "enfoque": enfoque,
            "ruta": ruta,
            "form": form_completo
        })

    # Resumen
    print("\n" + "="*50)
    print("📈 RESULTADOS DE LA EVALUACIÓN OFICIAL")
    print("="*50)
    
    total_cumple = Counter([r['cumple'] for r in resultados])
    print(f"Total Convocatoria:")
    for k, v in total_cumple.items():
        print(f"  - {k}: {v} ({v/len(resultados)*100:.1f}%)")

    si_forms = [r for r in resultados if r['form'] == 'SI']
    print(f"\nFormulario Completo ('SI') [{len(si_forms)} candidatos]:")
    for k, v in Counter([r['cumple'] for r in si_forms]).items():
        print(f"  - {k}: {v}")

    rutas = Counter([r['ruta'] for r in si_forms if r['cumple'] == 'Cumple mínimos'])
    print(f"\nDistribución por Rutas (Elegibles con Formulario Completo):")
    for k, v in rutas.items():
        print(f"  - {k}: {v}")

    print("="*50)

if __name__ == "__main__":
    evaluar()

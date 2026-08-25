import urllib.request
import csv
import io
import re
import unicodedata
from collections import Counter

url = "https://docs.google.com/spreadsheets/d/1mkdjjH6m5hZrXbvs-KH9CtQfAEealqu_yKNwje-8uW0/export?format=csv"
req = urllib.request.Request(url)
with urllib.request.urlopen(req) as resp:
    content = resp.read().decode('utf-8')
reader = list(csv.reader(io.StringIO(content)))

header = reader[0]
datos = reader[1:]
valid_datos = [r for r in datos if r and r[0].strip()]
print(f"Total valid rows with ID in Col A: {len(valid_datos)}")

# Logic from original script:
stemPriorizadas = ["bioquimica", "mecanica", "mecatronica", "mecatronico","quimica", "sistemas", "medio ambient", "electromecanica", "electronica", "automatizacion", "informatica", "teleinformatica", "telematica", "fisica", "estadistica", "matematicas", "biolog", "computadores", "electricidad", "tecnologias", "electrica", "naturales", "ambiental","tecnologia","agropecuaria","agricola","forestal","desarrollo ambiental","automatizacion","tecnologica", "agroecologia","agroecologica","informatica","telecomunicaciones","agroindustrial","bacteriol","agronomica","nanotec","civil","produccion animal","gegrafica","industrial","materiales","alimentos","minas"]

stemRechazo = ["cultura fisica", "deporte", "educacion fisica", "politica", "sociales"]

rechazoTajante = ["formacion estetica","religiosas", "estudios religiosos", "biotecnologica", "metalurgica", "etica", "economicas y politicas", "administracion comercial", "biblicas", "construccion", "danzas", "direccion de banda", "diseno multimedial", "ecologia", "biomedica", "interpretacion musical", "recreacion", "democracia", "valores humanos","desarollo comunitario","teoria politica", "preescolar musical", "musica", "arqueologia", "representativas", "bibliotecologia", "enfermeria", "militar", "policial", "instrumentacion quirurgica", "educacion especial", "medicina", "veterinaria", "odontologia", "optometria", "publicidad", "salud publica", "terapias", "trabajo social", "zootecnia","biomedica","teolog","veterin","licenciatura en filosofia con enfasis en teoria politica","licenciatura en pedagogia y didactica de la educacion fisica, recreacion y deporte","licenciatura en educacion fisica con enfasis en educacion fisica, recreacion y deportes",
"licenciatura en deporte","licenciatura en cultura fisica, recreacion, educacion fisica y deporte","licenciatura en cultura fisica y deporte","licenciatura en ciencias del deporte y la educacion fisica","licenciado en educacion basica con enfasis en educacion fisica, recreacion y deportes","licenciatura en filologia","licenciatura en geografia","biotecnologica"
,"biblicas","deportologia","licenciatura en educacion fisica","entrenamiento deportivo","musical","soldado","cadete","educacion basica primaria","educacion infantil","primera infancia",
"preescolar","musica"]

universidadesTOP13QS = ["universidad de los andes", "universidad nacional de colombia", "pontificia universidad javeriana", "universidad de antioquia", "universidad eafit", "universidad externado de colombia", "universidad de la sabana", "universidad pontificia bolivariana", "universidad icesi", "universidad industrial de santander", "universidad del norte", "universidad del valle","rosario","javeriana"]

universidadesPriorizadas = ["universidad de los andes", "universidad nacional de colombia", "pontificia universidad javeriana", "universidad de antioquia", "universidad icesi", "universidad del norte", "universidad del valle","javeriana"]

nivelesInglesTop = ["B2", "C1", "C2"]
anosValidos = ["2027", "2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017","2016", "2015", "2014"]
PROMEDIO_MINIMO = 3.5

def normalizar(txt):
    if not txt: return ""
    t = str(txt).strip().lower()
    t = ''.join(c for c in unicodedata.normalize('NFD', t) if unicodedata.category(c) != 'Mn')
    return t

def parsePromedio(valor):
    if not valor: return None
    s = str(valor).strip().replace(',', '.')
    try:
        return float(s)
    except:
        return None

documentosUnicos = set()
resultados = []

for row in valid_datos:
    doc = str(row[3] or "").strip()
    if doc != "":
        if doc in documentosUnicos:
            resultados.append({
                "cumple": "No cumple mínimos",
                "motivos": "Documento duplicado",
                "stem": "Duplicado",
                "ruta": "N/A"
            })
            continue
        documentosUnicos.add(doc)

    uniNorm = normalizar(row[8])
    carNorm = normalizar(row[6])
    nivelNorm = normalizar(row[9])

    # STEM
    estadoSTEM = "NO"
    esPrio = any(p in carNorm for p in stemPriorizadas)
    esRech = any(r in carNorm for r in stemRechazo)

    if "tecnologia" in carNorm:
        estadoSTEM = "STEM Priorizada"
    elif (esPrio or "naturales" in carNorm) and not esRech:
        estadoSTEM = "STEM Priorizada"
    elif ("ingenieria" in carNorm or "ciencia" in carNorm) and not esRech:
        estadoSTEM = "STEM No Priorizada"

    # Tipo Carrera
    tipoCarrera = "Profesional"
    esNoPlazable = any(t in carNorm for t in rechazoTajante)

    if "licencia" in carNorm or "lic " in carNorm:
        tipoCarrera = "Carrera no plazable" if esNoPlazable else "Licenciatura"
    elif esNoPlazable or "criminalistica" in carNorm or "audiovisual" in carNorm:
        tipoCarrera = "Carrera no plazable"
    elif "tecn" in nivelNorm or "normal" in nivelNorm or "superio" in nivelNorm or "normalista" in carNorm:
        tipoCarrera = "NO"

    # Canales
    canalP = str(row[13] or "").strip()
    canalQ = str(row[14] or "").strip()
    formCompleto = "SI" if canalP != "" else "NO"

    # Universidades
    esUniTop13QS = "SI" if any(u in uniNorm for u in universidadesTOP13QS) else "NO"
    esUniPrioritaria = "SI" if any(u in uniNorm for u in universidadesPriorizadas) else "NO"

    # Cumplimiento
    ingles = str(row[11] or "").strip().upper()
    esBil = ingles in nivelesInglesTop
    if estadoSTEM == "STEM Priorizada" and esBil:
        enfoque = "STEM y Bilingüe"
    elif estadoSTEM == "STEM Priorizada":
        enfoque = "STEM"
    elif esBil:
        enfoque = "Bilingüe"
    else:
        enfoque = "No STEM no Bilingüe"

    # Ano check:
    # "2015 o antes" -> match 2015 or check if any valid year in text
    anoRaw = str(row[7] or "").strip()
    m_ano = re.search(r'\b(20\d\d)\b', anoRaw)
    anoExtracted = m_ano.group(1) if m_ano else anoRaw
    cAnio = anoExtracted in anosValidos or anoRaw in anosValidos

    promedioValor = parsePromedio(row[10])
    cProm = (promedioValor is not None) and (promedioValor >= PROMEDIO_MINIMO)

    cMin = "Cumple mínimos" if (cAnio and cProm and enfoque != "No STEM no Bilingüe" and tipoCarrera not in ["NO", "Carrera no plazable"]) else "No cumple mínimos"

    ruta = "N/A"
    if cMin == "Cumple mínimos":
        if enfoque == "STEM y Bilingüe" or esUniPrioritaria == "SI":
            ruta = "Ruta Promisorios"
        else:
            ruta = "Ruta General"

    motivos = []
    if not cAnio: motivos.append("Año")
    if not cProm: motivos.append("Promedio")
    if enfoque == "No STEM no Bilingüe": motivos.append("Enfoque")
    if tipoCarrera == "NO": motivos.append("Nivel (Normalista o Técnico)")
    if tipoCarrera == "Carrera no plazable": motivos.append("Carrera no plazable")

    resultados.append({
        "cumple": cMin,
        "motivos": "; ".join(motivos) or "N/A",
        "stem": estadoSTEM,
        "enfoque": enfoque,
        "ruta": ruta,
        "form": formCompleto
    })

print("\n--- RESULTS WITH ORIGINAL SCRIPT LOGIC ---")
c_counts = Counter([r['cumple'] for r in resultados])
print("Cumple minimos:", c_counts)

form_counts = Counter([r['form'] for r in resultados])
print("Form completo:", form_counts)

si_forms = [r for r in resultados if r['form'] == 'SI']
si_cumple = Counter([r['cumple'] for r in si_forms])
print("Cumple minimos (Solo Form SI):", si_cumple)

rutas = Counter([r['ruta'] for r in si_forms if r['cumple'] == 'Cumple mínimos'])
print("Rutas (Solo Form SI y Cumple):", rutas)

enf_counts = Counter([r['enfoque'] for r in resultados])
print("Enfoques:", enf_counts)


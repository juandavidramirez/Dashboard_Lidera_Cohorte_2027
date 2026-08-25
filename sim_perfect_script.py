# Let's inspect how Google Sheets classify functions work
# The problem in Google Sheets script:
# 1. clasificarSTEM:
#    In sheet "Carreras_STEM", Column A has canonical names like "Ingeniería de Sistemas", but the raw career has "(solo o con otra opción)".
#    Because normalizarTexto(datos[i][0]) === normalizarTexto(carrera) did EXACT equality, it failed to match!
# 2. clasificarEnfoque:
#    Exact equality failed on "Carrera (solo o con otra opción)"!
# 3. cNivel:
#    var nivelesValidos = ["profesional", "maestría", "licenciatura", "normalista superior"];
#    var nivel = datos[i][colNivel] -> in raw data it says "Pregrado con título"!
#    nivelesValidos.indexOf("pregrado con título") was -1 (NOT FOUND)! So EVERYONE failed cNivel!

print("Analysis of root causes in ProcesarDatos2027.gs:")
print("1. Nivel: Raw data has 'Pregrado con título', 'Pregrado sin título', 'Maestría con título', etc.")
print("   The script checked nivelesValidos.indexOf(nivel) where nivelesValidos was ['profesional', 'maestría', ...].")
print("   Therefore, 100% of candidates failed cNivel!")
print("2. STEM & Enfoque: Raw data has parentheses like '(solo o con otra opción)'.")
print("   The script did exact string equality instead of substring/contains or normalizing parentheses.")

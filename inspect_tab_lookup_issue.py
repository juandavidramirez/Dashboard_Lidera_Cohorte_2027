# Look at why every single lookup function returned default ("No STEM", "No", "No", "Otro"):
# 1. `hoja.getLastRow()` on helper sheets like "Carreras_STEM":
# If the sheet name is slightly different: e.g. "Carreras STEM" (with space instead of underscore),
# or "Top 13 QS" (with space), or "Universidades priorizadas" (with space),
# then `ss.getSheetByName("Carreras_STEM")` returns `null` (undefined)!
# Because `if (!hoja) return "No STEM";` triggers on all 1478 rows, it returns "No STEM" for ALL rows!
# Same for Enfoque, Top13_QS, Universidades_priorizadas, Canal_convocatoria!

# Also:
# In the loop for 1478 candidates, doing:
# `ss.getSheetByName("Carreras_STEM")` inside `clasificarSTEM(carrera)` for every single row
# opens and reads the sheet 1478 times! In Google Apps Script that causes slowdowns and often gets null/timeouts!

# Better architecture:
# Read all reference sheets ONCE at the start of the script into lookup dictionaries/sets, with case-insensitive and space-insensitive sheet name matching!

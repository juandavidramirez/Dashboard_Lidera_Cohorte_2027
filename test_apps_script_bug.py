# Let's analyze the Apps Script helper function:
# function clasificarSTEM(carrera) {
#   if (!carrera) return "No STEM";
#   var ss = SpreadsheetApp.getActiveSpreadsheet();
#   var hoja = ss.getSheetByName("Carreras_STEM");
#   if (!hoja) return "No STEM";
#   var datos = hoja.getRange("A2:B" + hoja.getLastRow()).getValues();
# ...

# WAIT! If "Carreras_STEM", "Enfoque", "Top13_QS", "Universidades_priorizadas"
# What if the sheet names have spaces or different case, or what if getRange("A2:B" + hoja.getLastRow()) fails when getLastRow() < 2?
# OR what if the user has formulas in the Google Sheet?
# Wait! In the original Google Sheet, before our Apps Script was introduced, how were columns W to AI calculated?
# Let's check if the user had Excel / Google Sheet formulas in columns W to AI!

# Let's see what the original evaluation logic in the user's original script was:
# Original levels:
# nivValidos: ["profesional", "maestría", "licenciatura", "normalista superior"]
# Wait! In raw data the strings are:
# "Pregrado con título", "Pregrado sin título", "Normalista superior", "Maestría con título", "Técnico o tecnólogo", etc.

# Let's test the original check vs current:
# In the original script:
# cNivel = (nivel.indexOf("titulo") !== -1 || nivel.indexOf("normalista") !== -1 || nivel.indexOf("profesional") !== -1 || ...) OR how was cNivel defined in the original sheet?

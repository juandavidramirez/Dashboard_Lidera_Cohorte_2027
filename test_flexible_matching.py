def normalizarTexto(texto):
    if not texto: return ""
    import unicodedata, re
    t = str(texto).lower().trim() if hasattr(str(texto), 'trim') else str(texto).lower().strip()
    t = ''.join(c for c in unicodedata.normalize('NFD', t) if unicodedata.category(c) != 'Mn')
    t = re.sub(r'\(.*?\)', '', t) # remove parenthesized parts like (solo o con otra opción)
    t = re.sub(r'[^a-z0-9]', '', t)
    return t

print("Match test:")
raw = "Ingeniería de sistemas (solo o con otra opción)"
canon = "Ingeniería de sistemas"
print("Raw normalized:", normalizarTexto(raw))
print("Canon normalized:", normalizarTexto(canon))
print("Equal?", normalizarTexto(raw) == normalizarTexto(canon))

raw_bio = "Biología (solo, con otra opción o con énfasis)."
canon_bio = "Biología"
print("Bio Raw:", normalizarTexto(raw_bio))
print("Bio Canon:", normalizarTexto(canon_bio))
print("Bio Equal?", normalizarTexto(raw_bio) == normalizarTexto(canon_bio))

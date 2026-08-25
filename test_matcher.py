def normalizarTexto(texto):
    if not texto: return ""
    import unicodedata, re
    t = str(texto).lower().strip()
    # normalize accents
    t = ''.join(c for c in unicodedata.normalize('NFD', t) if unicodedata.category(c) != 'Mn')
    t = re.sub(r'[^a-z0-9]', '', t)
    return t

c1 = "Ingeniería de sistemas (solo o con otra opción)"
c2 = "Ingenieria de sistemas"
print("c1 norm:", normalizarTexto(c1))
print("c2 norm:", normalizarTexto(c2))
print("contains?", normalizarTexto(c2) in normalizarTexto(c1))

# -*- coding: utf-8 -*-
"""Builds prueba-doodle.html from index.html, for looking at the doodle skin.

Generated rather than kept as a second copy of the page, and gitignored, for
two reasons: a copy of index.html drifts out of date the first time the real
one changes, and a skin that is being evaluated has no business sitting in a
file that a push could ship.

    python scripts/prueba-doodle.py
    python -m http.server 8123
    open http://127.0.0.1:8123/prueba-doodle.html
"""
import io
import os
import sys

AQUI = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ORIGEN = os.path.join(AQUI, 'index.html')
DESTINO = os.path.join(AQUI, 'prueba-doodle.html')

AVISO = ('<!-- GENERADO por scripts/prueba-doodle.py. No editar a mano y no '
         'commitear: se regenera desde index.html. -->\n')

s = io.open(ORIGEN, encoding='utf-8').read()

if 'doodle.css' in s:
    sys.exit('index.html ya carga el skin, eso no tendria que pasar')

# El CSS del skin va ultimo para ganarle a style.css sin subir especificidad.
s = s.replace('</head>',
              '<link rel="stylesheet" href="assets/doodle.css">\n</head>', 1)
s = s.replace('</body>',
              '<script src="assets/doodle.js" defer></script>\n</body>', 1)

io.open(DESTINO, 'w', encoding='utf-8', newline='\n').write(AVISO + s)
print('prueba-doodle.html generado desde index.html (%d bytes)' % len(s))

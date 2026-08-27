# -*- coding: utf-8 -*-
"""Genera prueba-doodle.html: el sitio con el interruptor del skin encima.

El skin doodle ya es el diseño del sitio, así que esta página dejó de servir
para encenderlo y pasa a servir para APAGARLO. Suma solo `doodle.js`, que
dibuja el panelito de abajo a la izquierda, y con eso se puede comparar con y
sin sobre el mismo scroll, el mismo contenido y los dos idiomas. Una captura
de un rediseño siempre lo favorece, porque no tiene scroll ni hover.

Generada y no guardada como segunda copia: una copia de index.html queda vieja
la primera vez que cambia la de verdad. Y va en .gitignore.

    python scripts/prueba-doodle.py
    python -m http.server 8123
    http://127.0.0.1:8123/prueba-doodle.html
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

if 'doodle.css' not in s:
    sys.exit('index.html no carga el skin, asi que esta pagina no tiene sentido')

s = s.replace('</body>',
              '<script src="assets/doodle.js" defer></script>\n</body>', 1)

io.open(DESTINO, 'w', encoding='utf-8', newline='\n').write(AVISO + s)
print('prueba-doodle.html generado desde index.html (%d bytes)' % len(s))

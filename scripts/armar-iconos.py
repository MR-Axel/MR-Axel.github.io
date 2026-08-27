# -*- coding: utf-8 -*-
"""Arma el favicon y la imagen que se ve al compartir, desde los doodles.

    python scripts/armar-iconos.py

🔴 LOS DOS NECESITAN FONDO, Y LOS DOODLES SON NEGRO SOBRE TRANSPARENTE.
En la página eso es una ventaja: el mismo archivo sirve en claro y en oscuro
invirtiéndolo por CSS. Acá no hay CSS. Un favicon transparente con tinta negra
desaparece en una pestaña oscura, y una og:image transparente la rellena cada
red con lo que se le ocurre, casi siempre negro. Así que las dos se componen
sobre un fondo opaco de la marca y dejan de depender de quién las mire.
"""
import io
import os

from PIL import Image, ImageDraw

AQUI = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOODLES = os.path.join(AQUI, 'assets', 'doodles')

LIMA = (198, 242, 78, 255)
TINTA = (26, 23, 20, 255)
PAPEL = (251, 249, 243, 255)


def cargar(*partes):
    return Image.open(os.path.join(DOODLES, *partes)).convert('RGBA')


def entintar(im, color):
    """Repinta el trazo sin tocar el alfa. Los doodles vienen en negro puro, y
    el alfa es el que lleva la forma y el antialiasing del borde."""
    solido = Image.new('RGBA', im.size, color)
    solido.putalpha(im.getchannel('A'))
    return solido


def encajar(im, caja):
    """Escala respetando la proporcion, para que entre en un cuadrado."""
    ancho, alto = im.size
    f = min(caja / ancho, caja / alto)
    return im.resize((max(1, int(ancho * f)), max(1, int(alto * f))), Image.LANCZOS)


# ------------------------------------------------------------------ favicon

def favicon(tam=256):
    lienzo = Image.new('RGBA', (tam, tam), (0, 0, 0, 0))
    # El cuadrado redondeado de la marca, el mismo radio que tenia el de "AR".
    ImageDraw.Draw(lienzo).rounded_rectangle(
        [0, 0, tam - 1, tam - 1], radius=int(tam * 0.25), fill=LIMA)

    # 68% y no mas: a 16px, un dibujo que toca los bordes se lee como una mancha.
    # El aire alrededor es lo que deja distinguir la forma cuando es diminuto.
    bulbo = entintar(encajar(cargar('marcas', 'lampara.png'), int(tam * 0.68)), TINTA)
    lienzo.alpha_composite(bulbo, ((tam - bulbo.width) // 2, (tam - bulbo.height) // 2))
    return lienzo


# ------------------------------------------------------------------ og:image

def og(ancho=1200, alto=630):
    lienzo = Image.new('RGBA', (ancho, alto), PAPEL)

    # Un par de marcas sueltas, tenues, para que no sea una figura en el vacio.
    for nombre, x, y, tam, op in (('espiral', 0.07, 0.14, 130, 60),
                                  ('estrella', 0.83, 0.10, 110, 55),
                                  ('flecha', 0.72, 0.62, 150, 50),
                                  ('asterisco', 0.10, 0.70, 95, 55)):
        m = entintar(encajar(cargar('marcas', nombre + '.png'), tam), TINTA)
        m.putalpha(m.getchannel('A').point(lambda v, o=op: v * o // 100))
        lienzo.alpha_composite(m, (int(ancho * x), int(alto * y)))

    # El chico saludando, grande y a la izquierda del centro: las redes recortan
    # los bordes en algunos formatos y el centro es lo unico que sobrevive.
    chico = entintar(encajar(cargar('asistente.png'), int(alto * 0.74)), TINTA)
    lienzo.alpha_composite(chico, (int(ancho * 0.5) - chico.width // 2,
                                   (alto - chico.height) // 2))

    # Una barra lima abajo, que es la unica marca de color y ata la imagen al sitio.
    ImageDraw.Draw(lienzo).rectangle([0, alto - 14, ancho, alto], fill=LIMA)
    return lienzo


if __name__ == '__main__':
    salida = os.path.join(AQUI, 'assets')
    f = favicon()
    f.save(os.path.join(salida, 'favicon.png'), optimize=True)
    f.resize((180, 180), Image.LANCZOS).save(
        os.path.join(salida, 'apple-touch-icon.png'), optimize=True)
    og().convert('RGB').save(os.path.join(salida, 'og.jpg'), quality=88, optimize=True)
    for n in ('favicon.png', 'apple-touch-icon.png', 'og.jpg'):
        r = os.path.join(salida, n)
        print('  %-22s %s  %d KB' % (n, Image.open(r).size, os.path.getsize(r) // 1024))

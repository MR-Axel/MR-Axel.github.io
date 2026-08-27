#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Deja lista una imagen generada por IA: fondo fuera, marca fuera, metadatos fuera.

Solo Pillow y numpy, asi que el archivo se copia a cualquier proyecto y anda.

    python limpiar-imagen.py doodle.png
    python limpiar-imagen.py retrato.jpg --modo sujeto
    python limpiar-imagen.py iconos.png --grilla 3x2 --salida iconos/

🔴 POR QUE `linea` Y NO rembg, QUE ES LA HERRAMIENTA QUE TODO EL MUNDO NOMBRA.

rembg hace segmentacion de objeto: decide que pixeles son "el sujeto" y recorta
el resto. Sobre un dibujo de linea eso esta mal por definicion, porque el sujeto
es el trazo y el blanco de adentro de una cabeza no es fondo para el modelo, es
parte de la figura. Resultado: un doodle con la cara rellena de blanco opaco,
que sobre tema oscuro se ve como un parche.

Para linea sobre blanco la respuesta correcta no es aprendizaje automatico, es
una cuenta: **el alfa es lo oscuro que esta cada pixel**. Blanco puro se va a
transparente, negro puro queda opaco, y el antialiasing del borde sobrevive
solo, con su medio tono convertido en medio alfa. Sale perfecto, tarda
milisegundos y no baja 180 MB de modelo.

rembg sigue siendo lo correcto para una foto, y para eso esta `--modo sujeto`.

🔴 Y LA MARCA DE AGUA SE VA POR SATURACION, NO POR POSICION.

Recortar la esquina es lo que hacen las herramientas online, y es fragil: si el
modelo la puso en otro lado, o si el dibujo llega hasta ahi, o te comes parte del
dibujo o dejas la marca. Pero un dibujo a linea negra **no tiene saturacion**, y
el logo de Gemini es un degrade de colores. Con eso alcanza: lo que tiene color
no es del dibujo. Falla solo si pediste un dibujo con color, y para eso esta
`--marca esquina`.

⚠️ ESTO SACA EL LOGO VISIBLE, NO SynthID. Las imagenes de Google llevan ademas
una marca invisible metida en los pixeles que sobrevive a recortes, reescalados
y a esto. Es a proposito y no hay nada roto: la imagen se sigue pudiendo
identificar como generada. Vale saberlo para no creer que quedo "sin marca".
"""

import argparse
import os
import sys

import numpy as np
from PIL import Image


# ---------------------------------------------------------------- utilidades

def cargar(ruta):
    """Abre y descarta TODO lo que no sean pixeles.

    No hace falta borrar EXIF despues: `np.array` se queda con la matriz y nada
    mas, y el guardado arma un archivo nuevo desde cero. La camara, el GPS, el
    prompt que algunos modelos dejan escrito en los metadatos, la fecha: nada de
    eso llega a la salida porque nunca se copia.
    """
    with Image.open(ruta) as im:
        return np.array(im.convert("RGBA")).astype(np.float32)


def guardar(arr, ruta):
    im = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGBA")
    # `pnginfo` vacio a proposito: sin esto Pillow puede arrastrar los trozos de
    # texto del original en algunos formatos.
    im.save(ruta, "PNG", optimize=True, pnginfo=None)
    return im.size


# ---------------------------------------------------------------- la marca

def sacar_marca_por_color(arr, umbral=42):
    """Borra lo que tiene color. Un dibujo a linea negra no tiene.

    Devuelve cuantos pixeles se fueron, que es lo unico que permite darse cuenta
    de que no encontro nada: cero es 'no habia marca' o 'el umbral esta mal', y
    la diferencia importa.
    """
    rgb = arr[:, :, :3]
    maximo = rgb.max(axis=2)
    minimo = rgb.min(axis=2)
    # Saturacion cruda, sin normalizar: sirve igual y evita dividir por cero.
    coloreado = (maximo - minimo) > umbral
    # Los pixeles con color pasan a ser fondo blanco, y el paso siguiente los
    # convierte en transparente como a cualquier otro blanco.
    arr[coloreado] = [255, 255, 255, 255]
    return int(coloreado.sum())


def sacar_marca_por_esquina(arr, esquina="ir", parte=0.11):
    """La salida de emergencia, cuando el dibujo si tiene color."""
    h, w = arr.shape[:2]
    lado_w, lado_h = int(w * parte), int(h * parte)
    y0, y1 = (h - lado_h, h) if esquina[0] == "i" else (0, lado_h)
    x0, x1 = (w - lado_w, w) if esquina[1] == "r" else (0, lado_w)
    arr[y0:y1, x0:x1] = [255, 255, 255, 255]
    return lado_w * lado_h


# ---------------------------------------------------------------- los modos

def techo_del_fondo(arr, borde=0.02, piso_razonable=140):
    """Cuan oscuro llega a ser el fondo, medido en el marco de la imagen.

    🔴 ESTO EXISTE PORQUE LOS MODELOS DIBUJAN EL DAMERO. Se les pide fondo
    transparente y devuelven un JPEG con el cuadriculado gris y blanco pintado
    adentro, porque aprendieron como SE VE la transparencia, no que es. Dando
    por sentado blanco 255, los cuadros grises quedan en alfa 50 y el resultado
    es un dibujo limpio sobre un ajedrez fantasma.

    El marco sirve para medirlo porque ahi solo hay fondo. Se toma el percentil
    5 y no el minimo: un pixel perdido de tinta que llegue al borde arruinaria
    el minimo y no mueve un percentil.

    ⚠️ Y SI DA DEMASIADO OSCURO, NO SE USA. Un dibujo que toca el borde por los
    cuatro lados haria creer que el fondo es negro, y el umbral se comeria el
    dibujo entero. Ante la duda, blanco.
    """
    h, w = arr.shape[:2]
    m = max(2, int(min(h, w) * borde))
    lum = arr[:, :, :3] @ np.array([0.299, 0.587, 0.114], dtype=np.float32)
    marco = np.concatenate([
        lum[:m, :].ravel(), lum[-m:, :].ravel(),
        lum[:, :m].ravel(), lum[:, -m:].ravel(),
    ])
    nivel = float(np.percentile(marco, 5))
    if nivel < piso_razonable:
        return 246, nivel, False
    # Un poco por debajo del fondo mas oscuro, para no dejarle un velo.
    return max(piso_razonable, nivel - 6), nivel, True


def modo_linea(arr, tinta=(0, 0, 0), piso=8, techo=246):
    """Lo oscuro se vuelve opaco, lo claro se vuelve transparente.

    `piso` y `techo` estiran el rango antes de convertir. Sin eso, un blanco de
    250 en vez de 255 (que es lo que devuelve cualquier modelo) deja un velo gris
    de alfa 5 sobre toda la imagen: invisible en claro, y una mancha cuadrada
    perfectamente visible en oscuro.
    """
    lum = arr[:, :, :3] @ np.array([0.299, 0.587, 0.114], dtype=np.float32)
    alfa = 255.0 - lum
    alfa = (alfa - (255 - techo)) * (255.0 / max(1, techo - piso))
    alfa = np.clip(alfa, 0, 255)

    salida = np.zeros_like(arr)
    salida[:, :, 0] = tinta[0]
    salida[:, :, 1] = tinta[1]
    salida[:, :, 2] = tinta[2]
    salida[:, :, 3] = alfa
    return salida


def modo_sujeto(arr):
    try:
        from rembg import remove  # noqa: PLC0415
    except ImportError:
        sys.exit("Para --modo sujeto falta rembg:\n"
                 "    pip install rembg onnxruntime\n"
                 "La primera corrida baja el modelo, unos 180 MB.")
    im = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGBA")
    return np.array(remove(im).convert("RGBA")).astype(np.float32)


# ---------------------------------------------------------------- recortes

def recortar_a_contenido(arr, margen=0.04):
    """Al contenido y despues un margen parejo.

    Se mide sobre el alfa, no sobre el color: despues de los modos de arriba el
    alfa ya es exactamente 'donde hay dibujo'.
    """
    hay = arr[:, :, 3] > 6
    if not hay.any():
        return arr
    filas = np.where(hay.any(axis=1))[0]
    cols = np.where(hay.any(axis=0))[0]
    y0, y1 = filas[0], filas[-1] + 1
    x0, x1 = cols[0], cols[-1] + 1
    m = int(max(y1 - y0, x1 - x0) * margen)
    h, w = arr.shape[:2]
    return arr[max(0, y0 - m):min(h, y1 + m), max(0, x0 - m):min(w, x1 + m)]


def cortar_grilla(arr, columnas, filas):
    """Parte una lamina de iconos en celdas, y recorta cada una a su contenido.

    ⚠️ COLUMNAS PRIMERO, como lo escribe cualquiera: "3x2" son tres a lo ancho y
    dos a lo alto. Al reves daba recortes de 256x96, tiras horizontales en vez de
    iconos, y el error es silencioso: salen seis archivos y ninguno falla.

    Se corta en partes iguales y despues cada celda se ajusta sola, asi que no
    importa que el modelo no haya centrado nada: alcanza con que no se toquen.
    """
    h, w = arr.shape[:2]
    piezas = []
    for f in range(filas):
        for c in range(columnas):
            celda = arr[h * f // filas:h * (f + 1) // filas,
                        w * c // columnas:w * (c + 1) // columnas]
            piezas.append(recortar_a_contenido(celda.copy(), margen=0.08))
    return piezas


# ---------------------------------------------------------------- cli

def main():
    p = argparse.ArgumentParser(description=__doc__,
                                formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("entrada")
    p.add_argument("--modo", choices=["linea", "sujeto"], default="linea",
                   help="linea: dibujo negro sobre blanco (por defecto). "
                        "sujeto: foto, usa rembg.")
    p.add_argument("--marca", choices=["color", "esquina", "no"], default="color",
                   help="como sacar el logo del generador")
    p.add_argument("--esquina", default="ir",
                   help="con --marca esquina: ir, il, sr, sl (inferior/superior + derecha/izquierda)")
    p.add_argument("--recortar", action="store_true", help="recortar al contenido")
    p.add_argument("--grilla", help="partir una lamina: COLUMNASxFILAS, por ejemplo 3x2")
    p.add_argument("--ancho", type=int, help="ancho final en pixeles")
    p.add_argument("--salida", help="archivo, o carpeta si hay --grilla")
    args = p.parse_args()

    if not os.path.isfile(args.entrada):
        sys.exit("no existe: " + args.entrada)

    arr = cargar(args.entrada)
    alto0, ancho0 = arr.shape[:2]
    print("entrada: %dx%d, metadatos descartados al leer" % (ancho0, alto0))

    if args.marca == "color":
        n = sacar_marca_por_color(arr)
        print("marca por color: %d pixeles (%.2f%%)%s"
              % (n, 100.0 * n / (alto0 * ancho0),
                 "  <- cero, si esperabas una marca probá --marca esquina" if not n else ""))
    elif args.marca == "esquina":
        n = sacar_marca_por_esquina(arr, args.esquina)
        print("marca por esquina %s: %d pixeles" % (args.esquina, n))

    if args.modo == "linea":
        techo, nivel, confiable = techo_del_fondo(arr)
        print("fondo medido en el marco: %.0f -> umbral %.0f%s"
              % (nivel, techo,
                 "" if confiable else "  <- demasiado oscuro, uso blanco por las dudas"))
        arr = modo_linea(arr, techo=techo)
    else:
        arr = modo_sujeto(arr)
    opacos = int((arr[:, :, 3] > 128).sum())
    print("modo %s: %.1f%% del lienzo quedo opaco"
          % (args.modo, 100.0 * opacos / (alto0 * ancho0)))

    if args.grilla:
        columnas, filas = (int(x) for x in args.grilla.lower().split("x"))
        carpeta = args.salida or os.path.splitext(args.entrada)[0] + "-piezas"
        os.makedirs(carpeta, exist_ok=True)
        for i, pieza in enumerate(cortar_grilla(arr, columnas, filas), 1):
            if args.ancho:
                pieza = redimensionar(pieza, args.ancho)
            ruta = os.path.join(carpeta, "%02d.png" % i)
            print("  %s  %dx%d" % (ruta, *guardar(pieza, ruta)))
        return

    if args.recortar:
        arr = recortar_a_contenido(arr)
    if args.ancho:
        arr = redimensionar(arr, args.ancho)

    salida = args.salida or os.path.splitext(args.entrada)[0] + "-limpia.png"
    print("salida: %s  %dx%d" % (salida, *guardar(arr, salida)))


def redimensionar(arr, ancho):
    im = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGBA")
    alto = max(1, round(im.height * ancho / im.width))
    return np.array(im.resize((ancho, alto), Image.LANCZOS)).astype(np.float32)


if __name__ == "__main__":
    main()

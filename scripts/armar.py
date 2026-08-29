#!/usr/bin/env python3
"""Genera las páginas publicadas desde `src/index.html` y el diccionario.

    python scripts/armar.py            # escribe /index.html y /en/index.html
    python scripts/armar.py --revisar  # no escribe, dice si algo quedaría mal

🔴 EL PROBLEMA QUE RESUELVE: el castellano existía solo en el navegador. El HTML
servido era inglés y la traducción la hacía JavaScript, así que un buscador —que
rastrea desde Estados Unidos, donde el guion de arranque elige inglés— nunca vio
una palabra en castellano. Medido con curl haciéndose pasar por Googlebot:
`lang="en"` y 1.544 palabras, todas en inglés.

Ahora `/` se sirve en castellano y `/en/` en inglés, las dos con el texto dentro
del HTML.

⚠️ `src/index.html` es el archivo que se edita. Los dos `index.html` publicados
son generados: lo que se escriba ahí se pierde en la siguiente corrida.

La traducción se hace por texto y no con un árbol DOM, y es a propósito: las
claves del diccionario SON el innerHTML normalizado de cada elemento, así que
alcanza con buscar cada una entre un `>` y un `<`. Un parser reescribiría el
documento entero —comillas, orden de atributos, espacios— y el diff de cada
corrida sería ilegible. Acá el archivo generado se parece al fuente renglón por
renglón.
"""

import io
import json
import os
import pathlib
import re
import sys

from servicios import generar as generar_servicios

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

RAIZ = pathlib.Path(__file__).resolve().parent.parent
FUENTE = RAIZ / "src" / "index.html"
DICCIONARIO = RAIZ / "assets" / "i18n.js"
SITIO = "https://axelrosso.com"

# el título y la descripción no son innerHTML de nada, así que no salen del
# diccionario y viven acá
META = {
    "es": {
        "title": "Agentes de IA, páginas web y productos a medida · Axel Rosso",
        "description": (
            "Agentes de IA para WhatsApp, web y voz, páginas web con medición, "
            "automatizaciones y productos desde cero. Para empresas y para "
            "personas con una idea, en remoto desde Buenos Aires para LatAm."
        ),
        "alt": "Un dibujo a mano de alguien saludando.",
    },
    "en": {
        "title": "AI agents, websites and products built from zero · Axel Rosso",
        "description": (
            "AI agents for WhatsApp, web and voice, websites with the "
            "measurement wired in, automation and whole products from zero. "
            "Remote from Buenos Aires."
        ),
        "alt": "A hand-drawn figure waving.",
    },
}


def leer_diccionario():
    """Saca `window.ES` del archivo de i18n sin ejecutar JavaScript.

    ⚠️ Camina el texto en vez de usar una expresion regular. El archivo es
    JavaScript de verdad: tiene comentarios en el medio de las entradas, valores
    partidos en dos renglones, apostrofos escapados y comas colgando. Una
    expresion regular sobre eso agarraba 42 de 160 claves y las que faltaban se
    veian como frases en ingles en el medio del castellano.
    """
    texto = io.open(DICCIONARIO, encoding="utf-8").read()
    ini = texto.index("window.ES = {")
    fin = texto.index("\n};", ini)
    cuerpo = texto[ini + len("window.ES = {"):fin]

    cadenas = []
    i = 0
    n = len(cuerpo)
    while i < n:
        c = cuerpo[i]
        if c == "/" and i + 1 < n and cuerpo[i + 1] == "*":
            j = cuerpo.find("*/", i + 2)
            i = n if j < 0 else j + 2
            continue
        if c == "/" and i + 1 < n and cuerpo[i + 1] == "/":
            j = cuerpo.find("\n", i)
            i = n if j < 0 else j + 1
            continue
        if c in "'\"":
            comilla = c
            j = i + 1
            trozo = []
            while j < n:
                if cuerpo[j] == "\\" and j + 1 < n:
                    trozo.append(cuerpo[j + 1])
                    j += 2
                    continue
                if cuerpo[j] == comilla:
                    break
                trozo.append(cuerpo[j])
                j += 1
            cadenas.append("".join(trozo))
            i = j + 1
            continue
        i += 1

    if len(cadenas) % 2:
        sys.exit("el diccionario tiene un numero impar de cadenas: %d" % len(cadenas))
    pares = {}
    for k in range(0, len(cadenas), 2):
        clave, valor = cadenas[k], cadenas[k + 1]
        if clave.startswith("_"):
            continue
        pares[clave] = valor
    return pares


def traducir(html, dic):
    """Reemplaza el contenido de cada elemento cuya clave esté en el diccionario.

    Las claves se aplican de la más larga a la más corta: 'Chat' es parte de
    otras y aplicada primero rompería las que la contienen.
    """
    usadas = set()
    for clave in sorted(dic, key=len, reverse=True):
        valor = dic[clave]
        if valor == clave:
            continue
        # el espacio del html es libre: el diccionario guarda la versión con los
        # espacios ya colapsados, así que el patrón los vuelve a abrir.
        # 🔴 Y el apostrofo se acepta de las dos formas. El html lo escribe como
        # `&#39;` y el navegador devuelve el caracter suelto al leer innerHTML,
        # que es la forma con la que quedó escrita la clave. Sin esto, "Let's
        # talk" y "Axel's assistant" no coincidían con nada y el título de la
        # sección de contacto salía en inglés en la página en castellano.
        partes = []
        for palabra in clave.split():
            trozo = re.escape(palabra)
            trozo = trozo.replace(re.escape("'"), "(?:'|&#39;|&apos;|\u2019)")
            partes.append(trozo)
        flexible = r"\s+".join(partes)
        patron = re.compile(r"(>)\s*" + flexible + r"\s*(<)")
        nuevo, cuantas = patron.subn(lambda m: m.group(1) + valor + m.group(2), html)
        if cuantas:
            usadas.add(clave)
            html = nuevo
    return html, usadas


def contribuciones():
    """El total del ultimo anio, del mismo archivo que lee la pagina."""
    try:
        d = json.loads((RAIZ / "data" / "github.json").read_text(encoding="utf-8"))
        return int(d["contributions"]["total"])
    except Exception:
        return None


def plantilla(idioma):
    """La frase de contribuciones sale del propio diccionario, con la clave que
    usa el navegador: asi las dos rutas dicen exactamente lo mismo."""
    texto = io.open(DICCIONARIO, encoding="utf-8").read()
    marca = "window.ES = {" if idioma == "es" else "window.EN_META = {"
    i = texto.index(marca)
    j = texto.index("'_contributions':", i)
    k = texto.index("'", j + len("'_contributions':"))
    fin = texto.index("'", k + 1)
    return texto[k + 1:fin]


def cabecera(html, idioma):
    """Idioma, canónica, alternas y los metadatos de esa versión."""
    otra = "en" if idioma == "es" else "es"
    url = SITIO + ("/" if idioma == "es" else "/en/")
    url_otra = SITIO + ("/" if otra == "es" else "/en/")
    base = "" if idioma == "es" else "../"

    html = html.replace('<html lang="en"', '<html lang="%s"' % idioma, 1)

    total = contribuciones()
    if total:
        sep = "." if idioma == "es" else ","
        numero = "{:,}".format(total).replace(",", sep)
        frase = plantilla(idioma).replace("{n}", numero)
        html = re.sub(r'(<span data-stat="contributions-line">)[^<]*',
                      lambda m: m.group(1) + frase, html, count=1)

    html = re.sub(r'<title>[^<]*</title>',
                  "<title>%s</title>" % META[idioma]["title"], html, count=1)
    html = re.sub(r'<meta name="description" content="[^"]*">',
                  '<meta name="description" content="%s">' % META[idioma]["description"],
                  html, count=1)
    html = re.sub(r'<link rel="canonical" href="[^"]*">',
                  '<link rel="canonical" href="%s">\n'
                  '<link rel="alternate" hreflang="%s" href="%s">\n'
                  '<link rel="alternate" hreflang="%s" href="%s">\n'
                  '<link rel="alternate" hreflang="x-default" href="%s/">'
                  % (url, idioma, url, otra, url_otra, SITIO),
                  html, count=1)
    html = re.sub(r'<meta property="og:url" content="[^"]*">',
                  '<meta property="og:url" content="%s">' % url, html, count=1)
    html = re.sub(r'<meta property="og:title" content="[^"]*">',
                  '<meta property="og:title" content="%s">' % META[idioma]["title"],
                  html, count=1)
    html = re.sub(r'<meta property="og:description" content="[^"]*">',
                  '<meta property="og:description" content="%s">'
                  % META[idioma]["description"], html, count=1)
    # el texto alternativo de la imagen de compartir es lo único de la cabecera
    # que el diccionario no alcanza: vive en un atributo, no en un innerHTML
    html = re.sub(r'<meta property="og:image:alt" content="[^"]*">',
                  '<meta property="og:image:alt" content="%s">' % META[idioma]["alt"],
                  html, count=1)
    html = html.replace('<meta property="og:type" content="website">',
                        '<meta property="og:type" content="website">\n'
                        '<meta property="og:locale" content="%s">'
                        % ("es_AR" if idioma == "es" else "en_US"), 1)

    # ⚠️ `/en/` vive una carpeta adentro, así que toda ruta relativa se corre un
    # nivel. Sin esto la página existe pero sale sin estilos ni imágenes.
    if base:
        html = re.sub(r'(\s(?:href|src)=")(?!https?:|/|#|data:|mailto:)', r'\1' + base, html)
    return html


def armar(idioma, dic):
    html = io.open(FUENTE, encoding="utf-8").read()
    usadas = set()
    if idioma == "es":
        html, usadas = traducir(html, dic)
    else:
        # 🔴 Las paginas de servicio existen SOLO en castellano, asi que sus
        # enlaces salen de la portada en ingles. Dejarlos seria mandar a alguien
        # que esta leyendo en ingles a una pagina que no puede leer, y en el
        # camino declarar contenido en castellano como parte del sitio en
        # ingles. El resto del arbol queda igual: la rama sigue contando lo
        # mismo, sin el enlace al detalle.
        html = re.sub(r'\s*<p class="rama__mas">.*?</p>', "", html, flags=re.S)
    html = cabecera(html, idioma)
    return html, usadas


def sitemap(rutas):
    hoy = os.environ.get("FECHA_SITEMAP") or ""
    filas = ['<?xml version="1.0" encoding="UTF-8"?>',
             '<urlset xmlns="http://www.sitemap.org/schemas/sitemap/0.9">']
    filas[1] = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    for ruta, prioridad in rutas:
        filas.append("  <url>")
        filas.append("    <loc>%s%s</loc>" % (SITIO, ruta))
        if hoy:
            filas.append("    <lastmod>%s</lastmod>" % hoy)
        filas.append("    <priority>%s</priority>" % prioridad)
        filas.append("  </url>")
    filas.append("</urlset>")
    return "\n".join(filas) + "\n"


def main():
    revisar = "--revisar" in sys.argv
    dic = leer_diccionario()
    print("diccionario: %d claves" % len(dic))

    es, usadas = armar("es", dic)
    en, _ = armar("en", dic)

    # 🔴 Una clave que no coincide con nada es una traducción que no se aplicó, y
    # en la página se ve como una frase en inglés en el medio del castellano.
    # Falla la corrida en vez de publicar la página a medio traducir.
    sin_usar = [k for k in dic if k not in usadas and dic[k] != k]
    if sin_usar:
        print("\n🔴 %d claves no coincidieron con nada del html:" % len(sin_usar))
        for k in sin_usar[:12]:
            print("   -", k[:70])
        return 1

    if revisar:
        print("revisado: todas las claves se aplican")
        return 0

    (RAIZ / "index.html").write_text(es, encoding="utf-8", newline="\n")
    (RAIZ / "en").mkdir(exist_ok=True)
    (RAIZ / "en" / "index.html").write_text(en, encoding="utf-8", newline="\n")
    print("escrito: index.html (es) y en/index.html")

    # ⚠️ Se arman del html en castellano YA TERMINADO, no del fuente: así heredan
    # el menú, el asistente y el pie traducidos una sola vez.
    servicios = generar_servicios(RAIZ, es)
    print("servicios: %d páginas" % len(servicios))

    rutas = [("/", "1.0"), ("/en/", "0.8")] + [(r, "0.9") for r in servicios]
    (RAIZ / "sitemap.xml").write_text(sitemap(rutas), encoding="utf-8", newline="\n")
    print("sitemap: %d urls" % len(rutas))
    return 0


if __name__ == "__main__":
    sys.exit(main())

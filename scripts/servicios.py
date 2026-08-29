#!/usr/bin/env python3
"""Las seis páginas de servicio, armadas del mismo fuente que la portada.

🔴 EL ARMAZÓN NO SE DUPLICA. La cabecera, el menú, el asistente, el pie y los
scripts salen de `src/index.html` ya traducido, y lo único que cambia es el
`<main>`. Una plantilla aparte garantiza que dentro de dos semanas la portada
tenga una versión del menú y estas seis páginas otra.

Por qué existen, en una línea: la portada compite por un tema y acá hay siete
intenciones distintas. Quien busca "agente de whatsapp para turnos" y quien
busca "hacer mi landing" no son la misma persona ni quieren leer lo mismo.
"""

import json
import re

SITIO = "https://axelrosso.com"


def esc(t):
    return (t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
             .replace('"', "&quot;"))


# --------------------------------------------------------------- el cuerpo

def cuerpo(s, por_ruta):
    """El `<main>` de una página de servicio."""
    o = []
    a = o.append

    # ⚠️ El color alternado lo lleva un contador y no la posición escrita a
    # mano: los rubros son opcionales, y sin contador la página que no los
    # tiene queda con dos secciones seguidas del mismo tono.
    cuenta = [0]

    def sec():
        cuenta[0] += 1
        return "section section--alt" if cuenta[0] % 2 == 0 else "section"

    a('<main id="main">')

    a('  <article class="srv">')
    a('    <div class="wrap">')
    a('      <nav class="miga" aria-label="Dónde estás">'
      '<a href="/">Inicio</a><span aria-hidden="true">/</span>'
      '<span aria-current="page">%s</span></nav>' % esc(s["nombre"]))
    a('      <header class="srv__head">')
    a('        <h1>%s</h1>' % esc(s["h1"]))
    # ⚠️ Una sola oración, y se banca sola. Es la que un modelo levanta entera
    # cuando alguien le pregunta por esto, así que no puede depender de la
    # anterior ni terminar en "eso".
    a('        <p class="srv__respuesta">%s</p>' % esc(s["respuesta"]))
    a('      </header>')
    a('      <div class="srv__intro">')
    for t in s["intro"]:
        a('        <p>%s</p>' % esc(t))
    a('      </div>')
    a('    </div>')
    a('  </article>')

    a('  <section class="%s">' % sec())
    a('    <div class="wrap">')
    a('      <div class="section__head"><h2>Qué incluye</h2></div>')
    a('      <ul class="srv__lista">')
    for it in s["incluye"]:
        a('        <li><h3>%s</h3><p>%s</p></li>' % (esc(it["t"]), esc(it["p"])))
    a('      </ul>')
    a('    </div>')
    a('  </section>')

    a('  <section class="%s">' % sec())
    a('    <div class="wrap">')
    a('      <div class="section__head"><h2>Para quién es</h2></div>')
    a('      <ul class="srv__quien">')
    for t in s["para_quien"]:
        a('        <li>%s</li>' % esc(t))
    a('      </ul>')
    a('    </div>')
    a('  </section>')

    if s.get("rubros"):
        r = s["rubros"]
        a('  <section class="%s">' % sec())
        a('    <div class="wrap">')
        a('      <div class="section__head"><h2>%s</h2><p>%s</p></div>'
          % (esc(r["titulo"]), esc(r["lede"])))
        a('      <ul class="srv__rubros">')
        for t in r["items"]:
            a('        <li>%s</li>' % esc(t))
        a('      </ul>')
        a('    </div>')
        a('  </section>')

    a('  <section class="%s">' % sec())
    a('    <div class="wrap">')
    a('      <div class="section__head"><h2>Cómo funciona</h2></div>')
    a('      <ol class="srv__pasos">')
    for i, it in enumerate(s["pasos"], 1):
        a('        <li><span class="srv__num" aria-hidden="true">%02d</span>'
          '<h3>%s</h3><p>%s</p></li>' % (i, esc(it["t"]), esc(it["p"])))
    a('      </ol>')
    a('    </div>')
    a('  </section>')

    # 🔴 LAS PREGUNTAS VAN ABIERTAS, sin `<details>`. Es el bloque que más se
    # cita en una respuesta generada, y adentro de un desplegable depende de que
    # el rastreador lo abra.
    a('  <section class="%s" id="preguntas">' % sec())
    a('    <div class="wrap">')
    a('      <div class="section__head"><h2>Preguntas frecuentes</h2></div>')
    a('      <dl class="srv__faq">')
    for f in s["faq"]:
        a('        <div class="srv__qa"><dt>%s</dt><dd>%s</dd></div>'
          % (esc(f["q"]), esc(f["r"])))
    a('      </dl>')
    a('    </div>')
    a('  </section>')

    otros = [por_ruta[x] for x in s.get("relacionados", []) if x in por_ruta]
    if otros:
        a('  <section class="%s">' % sec())
        a('    <div class="wrap">')
        a('      <div class="section__head"><h2>Con qué más te puedo ayudar</h2></div>')
        a('      <ul class="srv__otros">')
        for x in otros:
            a('        <li><a href="/%s/"><strong>%s</strong>'
              '<span>%s</span></a></li>'
              % (x["ruta"], esc(x["nombre"]), esc(x["respuesta"])))
        a('      </ul>')
        a('    </div>')
        a('  </section>')

    # el contacto sigue la misma alternancia, y su clase viaja en la marca
    a("__CONTACTO__%s__" % sec())
    a("</main>")
    return "\n".join(o)


def bloque_contacto(html_es, s, clase):
    """La sección de contacto de la portada, con el tema ya elegido.

    ⚠️ Se recorta del html ya traducido en vez de escribirla de nuevo: el
    formulario tiene honeypot, campo de tiempo, tres mensajes de estado y un
    desplegable que `app.js` reconstruye. Una copia a mano de todo eso se
    desincroniza en el primer cambio.
    """
    i = html_es.index('<section id="contact"')
    j = html_es.index("</section>", html_es.index("</form>", i)) + len("</section>")
    bloque = html_es[i:j]

    bloque = re.sub(r'<section id="contact" class="[^"]*"',
                    '<section id="contact" class="%s contact"' % clase, bloque, count=1)

    # 🔴 El tema de esta página viene elegido, y el que estaba por defecto se
    # suelta. Va por expresión regular y no por texto exacto porque entre el
    # `value` y el `selected` hay un `data-t`, que es lo que marca la opción
    # como traducible: buscando la cadena literal no coincidía nada y las seis
    # páginas mandaban la consulta como "Otro".
    bloque = re.sub(r'(<option value="otro"[^>]*?) selected>', r"\1>", bloque, count=1)
    bloque = re.sub(r'(<option value="%s"[^>]*?)>' % s["tema"], r"\1 selected>",
                    bloque, count=1)

    # el cierre de este servicio reemplaza a la bajada general
    bloque = re.sub(r'(<p class="contact__lede">)[^<]*',
                    lambda m: m.group(1) + esc(s["cierre"]), bloque, count=1)

    # 🔴 SIN `reveal`. En la portada el formulario aparece al llegar scrolleando
    # y está bien: es el final de un recorrido. Acá es el único motivo por el
    # que la página existe, y arrancar en opacidad 0 esperando a un observador
    # deja el bloque invisible en cualquier lectura que no scrollee, incluido un
    # rastreador y una captura.
    bloque = bloque.replace(' reveal"', '"')
    return "  " + bloque


# -------------------------------------------------------------- el JSON-LD

def ld(s):
    url = "%s/%s/" % (SITIO, s["ruta"])
    grafo = [
        # el nodo entero de la persona vive en la portada; acá va la referencia
        # por `@id` y lo mínimo para que se resuelva sola
        {"@type": "Person", "@id": SITIO + "/#axel", "name": "Axel Rosso",
         "url": SITIO + "/"},
        {
            "@type": "Service",
            "@id": url + "#servicio",
            "name": s["nombre"],
            "serviceType": s["h1"],
            "url": url,
            "description": s["respuesta"],
            "provider": {"@id": SITIO + "/#axel"},
            # ⚠️ La región, no una ciudad: el trabajo es remoto y declarar solo
            # Buenos Aires lo deja afuera del resto de LatAm.
            "areaServed": [{"@type": "Country", "name": n} for n in
                           ["Argentina", "Chile", "México", "Uruguay",
                            "Colombia", "Perú", "España"]],
            "availableLanguage": ["es", "en"],
            "availableChannel": {"@type": "ServiceChannel",
                                 "serviceUrl": url + "#contact"},
            "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": s["nombre"],
                "itemListElement": [
                    {"@type": "Offer",
                     "itemOffered": {"@type": "Service", "name": it["t"],
                                     "description": it["p"]}}
                    for it in s["incluye"]
                ],
            },
        },
        {
            "@type": "FAQPage",
            "@id": url + "#preguntas",
            "mainEntity": [
                {"@type": "Question", "name": f["q"],
                 "acceptedAnswer": {"@type": "Answer", "text": f["r"]}}
                for f in s["faq"]
            ],
        },
        {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Inicio",
                 "item": SITIO + "/"},
                {"@type": "ListItem", "position": 2, "name": s["nombre"],
                 "item": url},
            ],
        },
    ]
    return ('<script type="application/ld+json">\n'
            + json.dumps({"@context": "https://schema.org", "@graph": grafo},
                         ensure_ascii=False, indent=1)
            + "\n</script>")


# ---------------------------------------------------------------- la página

def pagina(s, html_es, por_ruta):
    html = html_es
    url = "%s/%s/" % (SITIO, s["ruta"])

    nuevo = re.sub(r"__CONTACTO__(.+?)__",
                   lambda m: bloque_contacto(html_es, s, m.group(1)),
                   cuerpo(s, por_ruta), count=1)
    i = html.index('<main id="main">')
    j = html.index("</main>") + len("</main>")
    html = html[:i] + nuevo + html[j:]

    html = re.sub(r"<title>[^<]*</title>",
                  lambda m: "<title>%s</title>" % esc(s["titulo"]), html, count=1)
    html = re.sub(r'<meta name="description" content="[^"]*">',
                  lambda m: '<meta name="description" content="%s">' % esc(s["descripcion"]),
                  html, count=1)
    # 🔴 SIN `hreflang`. Estas páginas existen solo en castellano, y declarar una
    # alterna en inglés que no existe hace que Google ignore el bloque entero.
    html = re.sub(r'<link rel="canonical" href="[^"]*">(\s*<link rel="alternate"[^>]*>)*',
                  lambda m: '<link rel="canonical" href="%s">' % url, html, count=1)
    html = re.sub(r'<meta property="og:url" content="[^"]*">',
                  lambda m: '<meta property="og:url" content="%s">' % url,
                  html, count=1)
    html = re.sub(r'<meta property="og:title" content="[^"]*">',
                  lambda m: '<meta property="og:title" content="%s">' % esc(s["titulo"]),
                  html, count=1)
    html = re.sub(r'<meta property="og:description" content="[^"]*">',
                  lambda m: '<meta property="og:description" content="%s">' % esc(s["descripcion"]),
                  html, count=1)
    # el `og:locale` ya lo puso `cabecera()` al armar la versión en castellano
    html = re.sub(r'<script type="application/ld\+json">.*?</script>',
                  lambda m: ld(s), html, count=1, flags=re.S)

    # ⚠️ El menú apunta a secciones de la portada, y desde acá `#work` no existe.
    # Se quedan dos: `#main`, que es el salto al contenido, y `#contact`, porque
    # el formulario está más abajo en esta misma página. Mandar el botón de
    # consultar a la portada devolvería a la persona al principio justo cuando
    # terminó de leer.
    html = re.sub(r'href="#(?!main\b|contact\b)([a-z-]+)"', r'href="/#\1"', html)

    # una carpeta adentro, igual que `/en/`
    html = re.sub(r'(\s(?:href|src)=")(?!https?:|/|#|data:|mailto:)', r"\1../", html)
    return html


def llms(todos):
    """`llms.txt`: qué hace y a qué dirección mandar cada intención.

    🔴 SE GENERA, no se escribe a mano. Es el archivo que un modelo lee para
    saber a dónde mandar a alguien, así que una ruta vieja acá manda gente a un
    404 sin que nadie se entere. Armándolo del mismo json que arma las páginas,
    agregar un servicio lo actualiza solo.
    """
    o = ["# Axel Rosso", "",
         "> Agentes de IA, páginas web y productos digitales, para empresas y para",
         "> personas con una idea. Remoto desde Buenos Aires para LatAm y España.",
         "", "Qué hace, en una línea por cosa:", ""]
    for s in todos:
        o.append("- **%s**: %s" % (s["nombre"], s["respuesta"]))
    o += ["", "## Páginas", "",
          "- [Portada en castellano](%s/): quién es, qué construyó y con qué puede" % SITIO,
          "  ayudar.",
          "- [Portada en inglés](%s/en/): la misma, en inglés." % SITIO]
    for s in todos:
        o.append("- [%s](%s/%s/): %s" % (s["h1"], SITIO, s["ruta"], s["descripcion"]))
    o += ["", "## Cómo contactarlo", "",
          "El formulario de %s/#contact le llega al teléfono y contesta él. Sirve" % SITIO,
          "cualquier dato de contacto: un mail, un teléfono o un LinkedIn. Cada página",
          "de servicio tiene el mismo formulario abajo, con el tema ya elegido.", ""]
    return "\n".join(o)


def generar(raiz, html_es):
    """Escribe las páginas y devuelve las rutas que van al sitemap."""
    archivo = raiz / "contenido" / "servicios.json"
    if not archivo.exists():
        return []
    todos = json.loads(archivo.read_text(encoding="utf-8"))
    por_ruta = {x["ruta"]: x for x in todos}

    rutas = []
    for s in todos:
        carpeta = raiz / s["ruta"]
        carpeta.mkdir(exist_ok=True)
        (carpeta / "index.html").write_text(pagina(s, html_es, por_ruta),
                                            encoding="utf-8", newline="\n")
        rutas.append("/" + s["ruta"] + "/")

    (raiz / "llms.txt").write_text(llms(todos), encoding="utf-8", newline="\n")
    return rutas

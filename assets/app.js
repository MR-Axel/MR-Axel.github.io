/* Theme, language, the scroll system, and the contribution heatmap.

   Loaded at the end of <body> without defer, so the language swap happens
   before the browser paints the content: a deferred script would show a
   frame of English to someone whose browser is in Spanish.

   Everything degrades quietly. No script at all still leaves a complete,
   readable English page in whatever theme the OS asked for. */

(function () {
  'use strict';

  var root = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DICT = window.ES || {};
  var META_EN = window.EN_META || {};
  var lang = root.getAttribute('data-lang') === 'es' ? 'es' : 'en';

  function store(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* private mode */ }
  }


  /* ================= la URL se limpia sola ================= */

  /* Al tocar "Escribime" el navegador salta a #contact y DEJA ESO EN LA BARRA,
     que despues entra en el historial. La proxima vez que se escriben tres
     letras del dominio, el autocompletado ofrece la version con el ancla, y el
     sitio abre a mitad de pagina sin que nadie haya pedido eso.

     🔴 Y el ancla sobrevive a las redirecciones: el navegador nunca manda la
     parte de "#..." al servidor, la vuelve a pegar en el destino. Por eso un
     "#contact" viejo guardado sobre el dominio anterior seguia abriendo el
     nuevo directo en el formulario, aunque la redireccion en si estuviera
     limpia.

     ⚠️ El salto se deja pasar tal cual y recien despues se saca el ancla de la
     barra. Cancelando el evento habria que reimplementar a mano el
     desplazamiento suave y el margen de 82px que compensa la barra de arriba, y
     el enlace dejaria de funcionar sin JavaScript. */
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!a || a.getAttribute('href').length < 2) return;
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    if (!document.querySelector(a.getAttribute('href'))) return;
    window.setTimeout(function () {
      try {
        history.replaceState(null, '', location.pathname + location.search);
      } catch (err) { /* file:// y navegadores viejos */ }
    }, 0);
  });


  /* ================= el arbol ================= */

  /* Una rama abierta a la vez. Con mouse alcanza con pasar por encima; con el
     dedo y con el teclado hace falta el click, que tambien sirve para dejarla
     fija.

     ⚠️ El hover NO puede ser solo CSS. Abriendo con `:hover` la rama se cierra
     apenas el puntero sale, asi que leer una hoja larga obliga a mantener el
     mouse quieto arriba del titulo, y bajar la vista la cierra en la cara. Con
     JavaScript la rama abierta se queda abierta hasta que se abre otra. */
  var ramas = [].slice.call(document.querySelectorAll('.arbol__rama'));
  if (ramas.length) {
    var finoYConMouse = window.matchMedia('(hover: hover) and (pointer: fine)');


    /* 🔴 El temblor es determinista, no `Math.random()`. Con azar de verdad, la
       misma flecha se dibuja distinta en cada apertura y en cada `resize`, y
       eso no se lee como un dibujo sino como un error de render. Una funcion
       seno con dos semillas da siempre el mismo garabato para la misma flecha,
       y uno distinto para la de al lado. */
    function temblor(n) {
      var x = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
      return (x - Math.floor(x)) * 2 - 1;
    }

    /* Corre la linea con una ONDA, no con ruido.

       🔴 Corriendo cada muestra por su cuenta, las desviaciones se alternan de
       signo y sale una linea con rulos: no parece dibujada, parece con ruido.
       El anillo del recorrido se lee como hecho a mano por otra cosa: la
       geometria no es perfecta, pero el trazo es uno solo y seguro. Con una
       curva suave a lo largo del camino, mas una segunda mas chica encima, los
       puntos vecinos se mueven juntos y la linea sale panzona en vez de
       peluda. */
    function aMano(puntos, semilla, amplitud) {
      var fase = temblor(semilla) * Math.PI;
      var signo = temblor(semilla + 1) > 0 ? 1 : -1;
      var s = [];
      for (var k = 0; k < puntos.length; k++) {
        var t = k / (puntos.length - 1);
        var ant = puntos[Math.max(0, k - 1)];
        var sig = puntos[Math.min(puntos.length - 1, k + 1)];
        var dx = sig[0] - ant[0], dy = sig[1] - ant[1];
        var largo = Math.sqrt(dx * dx + dy * dy) || 1;
        /* las dos puntas quedan clavadas: si se mueven, la flecha deja de
           salir del titulo y de llegar al texto */
        var d = signo * amplitud * (
          Math.sin(t * Math.PI) * 1.0 +
          Math.sin(t * Math.PI * 2 + fase) * 0.35
        );
        s.push([puntos[k][0] - (dy / largo) * d, puntos[k][1] + (dx / largo) * d]);
      }
      var d2 = 'M' + s[0][0].toFixed(1) + ' ' + s[0][1].toFixed(1);
      for (var m = 1; m < s.length - 1; m++) {
        var mx = (s[m][0] + s[m + 1][0]) / 2, my = (s[m][1] + s[m + 1][1]) / 2;
        d2 += ' Q' + s[m][0].toFixed(1) + ' ' + s[m][1].toFixed(1) +
              ' ' + mx.toFixed(1) + ' ' + my.toFixed(1);
      }
      var u = s[s.length - 1];
      d2 += ' L' + u[0].toFixed(1) + ' ' + u[1].toFixed(1);
      return d2;
    }

    function enCubica(p0, c1, c2, p3, t) {
      var u = 1 - t;
      return [u * u * u * p0[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * p3[0],
              u * u * u * p0[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * p3[1]];
    }

    /* 🔴 La lista reserva el alto del panel MAS LARGO, medido, no uno fijo.
       Los paneles estan fuera del flujo, asi que no empujan nada: el de
       Agentes mide 593px contra 505 de la columna de titulos y se metia encima
       del parrafo de cierre. Reservando el maximo, el hueco es siempre el
       mismo y abrir una rama u otra no mueve ni un pixel de la pagina. */
    function reservarAlto() {
      var lista = document.querySelector('.arbol');
      if (!lista || !window.matchMedia('(min-width: 900px)').matches) {
        if (lista) lista.style.removeProperty('min-height');
        return;
      }
      var abiertaAntes = lista.querySelector('.arbol__rama.esta-abierta');
      var alto = 0;
      [].forEach.call(lista.querySelectorAll('.arbol__rama'), function (r) {
        r.classList.add('esta-abierta');
        var pan = r.querySelector('.panel');
        if (pan) alto = Math.max(alto, pan.getBoundingClientRect().height);
        if (r !== abiertaAntes) r.classList.remove('esta-abierta');
      });
      lista.style.minHeight = Math.ceil(alto + 8) + 'px';
    }

    var lienzo = document.querySelector('.abanico');
    var anchoParaAbanico = window.matchMedia('(min-width: 900px)');
    var SVGNS = 'http://www.w3.org/2000/svg';

    /* 🔴 Una flecha por hoja, del titulo elegido a cada cosa que incluye. Se
       calculan acá y no se pueden escribir a mano en el html: las dos puntas
       dependen del alto del texto, del idioma y del ancho de la ventana, asi
       que cualquier `d` fijo quedaria bien en una sola pantalla y torcido en
       todas las demas.

       ⚠️ Las coordenadas van relativas a la lista, no a la pantalla. El lienzo
       cubre `.arbol`, que es el elemento posicionado, y usar las de la ventana
       manda las flechas a cualquier lado apenas la pagina esta scrolleada. */
    function dibujarAbanico(rama) {
      if (!lienzo) return;
      lienzo.classList.remove('dibuja');
      while (lienzo.firstChild) lienzo.removeChild(lienzo.firstChild);
      if (!anchoParaAbanico.matches || !rama) return;

      var lista = lienzo.parentElement;
      var base = lista.getBoundingClientRect();
      var boton = rama.querySelector('.arbol__titulo');
      var hojas = [].slice.call(rama.querySelectorAll('.hoja h4'));
      if (!boton || !hojas.length) return;

      /* 🔴 EL ORIGEN ES DONDE TERMINA EL TEXTO, NO EL BORDE DEL BOTON. El boton
         ocupa el ancho entero de la columna, asi que arrancando de su borde
         derecho quedaban 45px hasta las hojas contra 400 de caida: seis curvas
         casi verticales, superpuestas en una sola raya gorda. Desde la ultima
         letra del titulo hay 200px de corrida y el abanico se abre. */
      var texto = boton.querySelector('.arbol__nombre') || boton;
      var rb = texto.getBoundingClientRect();
      var x0 = rb.right - base.left + 14;
      var y0 = rb.top - base.top + rb.height / 2;

      lienzo.setAttribute('viewBox', '0 0 ' + Math.round(base.width) + ' ' + Math.round(base.height));

      /* El recuadro del gancho: un rectangulo trazado a mano alrededor del
         texto que abre el panel. Va en el mismo lienzo y no con un `border`,
         porque un borde de CSS no se puede dibujar de a poco ni temblar. */
      var gancho = rama.querySelector('.panel__hook');
      if (gancho) {
        var rg = gancho.getBoundingClientRect();
        var gx = rg.left - base.left - 13;
        var gy = rg.top - base.top - 10;
        var gw = rg.width + 26;
        var gh = rg.height + 20;
        var r = 10;
        var esquinas = [];
        /* arranca en el medio de arriba y da la vuelta: asi la animacion se ve
           como una mano cerrando el recuadro, no como cuatro lados apareciendo */
        esquinas.push([gx + gw * 0.5, gy]);
        esquinas.push([gx + gw - r, gy]);
        esquinas.push([gx + gw, gy + r]);
        esquinas.push([gx + gw, gy + gh - r]);
        esquinas.push([gx + gw - r, gy + gh]);
        esquinas.push([gx + r, gy + gh]);
        esquinas.push([gx, gy + gh - r]);
        esquinas.push([gx, gy + r]);
        esquinas.push([gx + r, gy]);
        esquinas.push([gx + gw * 0.5 - 4, gy + 1.5]);
        var denso = [];
        for (var e = 0; e < esquinas.length - 1; e++) {
          var a = esquinas[e], bq = esquinas[e + 1];
          var pasos = Math.max(2, Math.round(Math.hypot(bq[0] - a[0], bq[1] - a[1]) / 44));
          for (var q = 0; q < pasos; q++) {
            denso.push([a[0] + (bq[0] - a[0]) * (q / pasos), a[1] + (bq[1] - a[1]) * (q / pasos)]);
          }
        }
        denso.push(esquinas[esquinas.length - 1]);
        var caja = document.createElementNS(SVGNS, 'path');
        caja.setAttribute('class', 'caja');
        caja.setAttribute('pathLength', '1');
        caja.setAttribute('d', aMano(denso, 91, 1.1));
        lienzo.appendChild(caja);
      }

      hojas.forEach(function (h, i) {
        var rh = h.getBoundingClientRect();
        var x1 = rh.left - base.left - 9;
        var y1 = rh.top - base.top + rh.height / 2;

        /* Sale horizontal del titulo y llega horizontal a la hoja: las dos
           manijas van sobre la altura de su propia punta. Es lo que separa las
           curvas entre si, porque cada una toma su altura apenas arranca en
           vez de subir todas juntas por el medio.
           ⚠️ La primera manija se corre un poco por indice, o las seis salen
           exactamente del mismo punto con la misma pendiente y los primeros
           veinte pixeles quedan pegados. */
        var dx = x1 - x0;
        if (dx < 60) return;
        var c1x = x0 + dx * (0.34 + i * 0.045);
        var c1y = y0 + (y1 - y0) * 0.06;
        var c2x = x1 - dx * 0.32;
        var c2y = y1;

        var muestras = [];
        for (var t = 0; t <= 24; t++) {
          muestras.push(enCubica([x0, y0], [c1x, c1y], [c2x, c2y], [x1, y1], t / 24));
        }
        var trazo = document.createElementNS(SVGNS, 'path');
        trazo.setAttribute('class', 'trazo');
        trazo.setAttribute('pathLength', '1');
        trazo.style.setProperty('--i', i);
        trazo.setAttribute('d', aMano(muestras, i * 31 + 7, 1.6));
        lienzo.appendChild(trazo);

        /* La punta se orienta con la tangente de llegada, que en una cubica es
           la direccion de la ultima manija a la punta. Con un angulo fijo, las
           flechas que llegan desde arriba apuntan al costado. */
        var ang = Math.atan2(y1 - c2y, x1 - c2x);
        var largo = 7;
        var a1 = ang + 2.5, a2 = ang - 2.5;
        var punta = document.createElementNS(SVGNS, 'path');
        punta.setAttribute('class', 'punta');
        punta.setAttribute('pathLength', '1');
        punta.style.setProperty('--i', i);
        /* las dos patas con largo distinto: una punta de flecha simetrica se
           lee como un icono, y una despareja como algo trazado de un tiron */
        var l1 = largo * (1 + temblor(i * 7) * 0.13);
        var l2 = largo * (1 + temblor(i * 7 + 3) * 0.13);
        punta.setAttribute('d',
          'M' + (x1 + Math.cos(a1) * l1).toFixed(1) + ' ' + (y1 + Math.sin(a1) * l1).toFixed(1) +
          ' L' + x1.toFixed(1) + ' ' + y1.toFixed(1) +
          ' L' + (x1 + Math.cos(a2) * l2).toFixed(1) + ' ' + (y1 + Math.sin(a2) * l2).toFixed(1));
        lienzo.appendChild(punta);
      });

      /* un cuadro despues, para que la clase que dispara el trazado entre como
         un cambio y no junto con el nodo recien creado */
      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () { lienzo.classList.add('dibuja'); });
      });
    }

    var abierta = null;

    function abrirRama(rama) {
      ramas.forEach(function (otra) {
        var esta = otra === rama;
        otra.classList.toggle('esta-abierta', esta);
        var b = otra.querySelector('.arbol__titulo');
        if (b) b.setAttribute('aria-expanded', esta ? 'true' : 'false');
      });
      abierta = rama;
      reservarAlto();
      dibujarAbanico(rama);
    }

    var redibujo;
    function redibujar() {
      window.clearTimeout(redibujo);
      redibujo = window.setTimeout(function () {
        reservarAlto();
        dibujarAbanico(abierta);
      }, 120);
    }
    window.addEventListener('resize', redibujar, { passive: true });
    window.addEventListener('load', redibujar);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(redibujar);
    /* el cambio de idioma mueve cada hoja, porque el castellano corre mas largo */
    var btnIdioma = document.getElementById('lang-toggle');
    if (btnIdioma) btnIdioma.addEventListener('click', function () {
      window.setTimeout(redibujar, 60);
    });

    abierta = document.querySelector('.arbol__rama.esta-abierta');
    if (abierta) window.requestAnimationFrame(function () {
      reservarAlto();
      dibujarAbanico(abierta);
    });

    ramas.forEach(function (rama) {
      var boton = rama.querySelector('.arbol__titulo');
      if (!boton) return;
      boton.addEventListener('click', function () { abrirRama(rama); });
      /* el foco del teclado abre igual que el mouse: tabular por los seis
         titulos tiene que mostrar lo mismo que recorrerlos con el puntero */
      boton.addEventListener('focus', function () { abrirRama(rama); });
      rama.addEventListener('pointerenter', function (e) {
        if (e.pointerType === 'touch' || !finoYConMouse.matches) return;
        abrirRama(rama);
      });
    });
  }

  /* el boton de cada rama se mide, para saber cual mueve la aguja */
  document.querySelectorAll('.rama__cta').forEach(function (b) {
    b.addEventListener('click', function () {
      if (window.medir) window.medir('servicio_consulta');
    });
  });


  /* ================= la tarjeta entera es el enlace ================= */

  /* ⚠️ Delegado en el documento y no atado a cada tarjeta, porque en telefono
     `mobile.js` clona las tarjetas para la marquesina y `cloneNode` NO copia
     los escuchas: atandolo a cada una, las copias quedarian muertas y la mitad
     de la fila no llevaria a ningun lado.

     El arrastre de la marquesina ya frena su propio click en fase de captura,
     asi que mover el carrusel no abre nada. */
  document.addEventListener('click', function (e) {
    if (!e.target.closest) return;
    var tarjeta = e.target.closest('.card');
    if (!tarjeta) return;
    /* lo que ya es clickeable se maneja solo */
    if (e.target.closest('a, button, input, textarea, select, [role="button"]')) return;
    /* si hay texto seleccionado, la persona estaba copiando y no tocando */
    var sel = window.getSelection && window.getSelection();
    if (sel && String(sel).length > 2) return;
    var enlace = tarjeta.querySelector('.card__link');
    if (enlace) enlace.click();
  });


  /* ================= el desplegable ================= */

  /* 🔴 La lista de un <select> NO SE PUEDE ESTILAR. El campo cerrado si, pero
     el menu abierto lo dibuja el sistema operativo: fondo blanco, resaltado
     azul de Windows, tipografia del sistema. Al lado de una pagina dibujada a
     mano canta.

     ⚠️ El <select> NO se saca del formulario: se esconde y sigue siendo el
     dueño del valor. Reemplazandolo por divs se pierde el envio nativo, el
     autocompletado y lo que lee un lector de pantalla; asi, si este script no
     corre, queda el desplegable de siempre y el formulario funciona igual. */
  document.querySelectorAll('.field select').forEach(function (nativo) {
    if (nativo.dataset.propio) return;
    nativo.dataset.propio = '1';

    var campo = nativo.parentElement;
    campo.classList.add('field--sel');
    nativo.classList.add('sel__nativo');

    var boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'sel__boton';
    boton.setAttribute('aria-haspopup', 'listbox');
    boton.setAttribute('aria-expanded', 'false');
    var etiqueta = campo.querySelector('label');
    if (etiqueta) boton.setAttribute('aria-labelledby', etiqueta.id || (etiqueta.id = 'lbl-' + nativo.id));

    var texto = document.createElement('span');
    texto.className = 'sel__texto';
    boton.appendChild(texto);

    var lista = document.createElement('ul');
    lista.className = 'sel__lista';
    lista.setAttribute('role', 'listbox');
    lista.hidden = true;

    function pintar() {
      var elegida = nativo.options[nativo.selectedIndex];
      texto.textContent = elegida ? elegida.textContent : '';
      [].forEach.call(lista.children, function (li, k) {
        li.setAttribute('aria-selected', k === nativo.selectedIndex ? 'true' : 'false');
      });
    }

    function construir() {
      lista.textContent = '';
      [].forEach.call(nativo.options, function (op, k) {
        var li = document.createElement('li');
        li.className = 'sel__op';
        li.setAttribute('role', 'option');
        li.setAttribute('tabindex', '-1');
        li.textContent = op.textContent;
        li.addEventListener('click', function () {
          nativo.selectedIndex = k;
          nativo.dispatchEvent(new Event('change', { bubbles: true }));
          cerrar(true);
        });
        lista.appendChild(li);
      });
      pintar();
    }

    function abrir() {
      lista.hidden = false;
      boton.setAttribute('aria-expanded', 'true');
      campo.classList.add('esta-abierto');
      var sel = lista.children[nativo.selectedIndex];
      if (sel) sel.focus();
    }

    function cerrar(devolverFoco) {
      lista.hidden = true;
      boton.setAttribute('aria-expanded', 'false');
      campo.classList.remove('esta-abierto');
      if (devolverFoco) boton.focus();
    }

    boton.addEventListener('click', function () {
      if (lista.hidden) abrir(); else cerrar(true);
    });

    /* el teclado tiene que hacer lo mismo que hace un <select> de verdad, o el
       reemplazo es peor que el original para quien no usa mouse */
    function mover(paso) {
      var n = nativo.options.length;
      nativo.selectedIndex = (nativo.selectedIndex + paso + n) % n;
      nativo.dispatchEvent(new Event('change', { bubbles: true }));
      if (!lista.hidden) { var f = lista.children[nativo.selectedIndex]; if (f) f.focus(); }
    }
    function teclas(e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); if (lista.hidden) abrir(); else mover(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); if (lista.hidden) abrir(); else mover(-1); }
      else if (e.key === 'Escape' && !lista.hidden) { e.preventDefault(); cerrar(true); }
      else if ((e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        if (lista.hidden) abrir(); else cerrar(true);
      }
    }
    boton.addEventListener('keydown', teclas);
    lista.addEventListener('keydown', teclas);

    document.addEventListener('click', function (e) {
      if (!lista.hidden && !campo.contains(e.target)) cerrar(false);
    });

    nativo.addEventListener('change', pintar);
    /* el cambio de idioma reescribe las opciones del <select>, asi que la lista
       propia se rehace entera en vez de quedar con los textos viejos */
    var btnIdioma = document.getElementById('lang-toggle');
    if (btnIdioma) btnIdioma.addEventListener('click', function () { window.setTimeout(construir, 60); });

    campo.appendChild(boton);
    campo.appendChild(lista);
    construir();
    /* ⚠️ Y otra vez en el proximo turno. Este bloque corre antes de que el
       diccionario traduzca la pagina, asi que la primera copia se lleva los
       textos en ingles: el boton decia "Something else" con la lista ya en
       castellano abajo. */
    window.setTimeout(construir, 0);
  });

  /* ================= language ================= */

  /* Keys are the English innerHTML with whitespace collapsed. Anything not in
     the dictionary is left exactly as authored, which is how product names,
     stack chips and the numbers survive the swap untouched. */
  var I18N_SEL = 'h1, h2, h3, h4, p, li, dt, dd, .pill, .arc__label, .skill-mark, ' +
    '.mini, .skip, .btn, .nav__links a, [data-t]';

  function norm(html) {
    return html.replace(/\s+/g, ' ').trim();
  }

  function translate(to) {
    var nodes = document.querySelectorAll(I18N_SEL);
    var matched = [];

    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      /* an element inside one we already swapped would be rewritten twice,
         and the second pass would be reading generated markup */
      var nested = false;
      for (var m = 0; m < matched.length; m++) {
        if (matched[m].contains(el)) { nested = true; break; }
      }
      if (nested) continue;

      /* The English source is cached on the element the first time it is seen
         and every later lookup reads the cache, never the live DOM. Without
         that, anything decorating the markup afterwards silently breaks the
         match: interact.js splits headlines into per-word spans, and the
         second time you press the toggle the innerHTML no longer resembles
         any key in the dictionary. */
      var src = el.getAttribute('data-en');
      if (src === null) src = el.innerHTML;
      var key = norm(src);
      if (!DICT[key]) continue;

      el.setAttribute('data-en', src);
      el.innerHTML = to === 'es' ? DICT[key] : src;
      /* the content is fresh, so any word split over it is gone with it */
      el.removeAttribute('data-split');
      matched.push(el);
    }

    lang = to;
    root.setAttribute('data-lang', to);
    root.setAttribute('lang', to === 'es' ? 'es' : 'en');

    var label = document.getElementById('lang-label');
    if (label) label.textContent = to === 'es' ? 'EN' : 'ES';
    var btn = document.getElementById('lang-toggle');
    if (btn) btn.setAttribute('title', to === 'es' ? META_EN._switchToEn : DICT._switchToEs);
    var themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) themeBtn.setAttribute('title', (to === 'es' ? DICT : META_EN)._theme || '');

    paintContributions();
  }

  translate(lang);

  var langBtn = document.getElementById('lang-toggle');
  if (langBtn) {
    langBtn.addEventListener('click', function () {
      var to = lang === 'es' ? 'en' : 'es';
      translate(to);
      store('site-lang', to);
    });
  }

  /* ================= theme ================= */

  function aplicarTema(to) {
    root.setAttribute('data-theme', to);
    store('site-theme', to);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', to === 'light' ? '#fbfaf7' : '#08090b');
  }

  /* ---------------- the theme change as an inkwell tipping over ----------

     Ported from the dametrabajo landing, comments and all, because that
     version has already paid for three separate bugs and each one of them is
     a black flash on screen. Rewriting it from scratch would buy them again.

     🔴 THE TRICK IS THE VIEW TRANSITION API AND NOT A LAYER OF OUR OWN. The
     obvious build is a dark <div> that grows, but that does not change the
     theme: it covers the old page with a stain of colour, and when it leaves,
     underneath, the theme jumped all at once anyway. startViewTransition
     photographs the before, applies the change, and lets us animate HOW THE
     AFTER IS REVEALED. So what advances is not colour: it is the entire new
     page, text, borders and shadows already in the new theme.

     🔴 AND THEY ARE TWO DIFFERENT GESTURES, NOT ONE AND ITS REVERSE.

       To dark   it SPILLS: in from the bottom left corner, diagonally out
                 through the top right. The NEW view is animated, the dark one.
       To light  it DRAINS: the stain withdraws the way it came. The OLD view
                 is animated, which is the dark one, so it has to stay painted
                 on top of the new one.

     Running the second as the first reversed looks wrong: on the way to light,
     light entering from a corner does not read as ink leaving, it reads as
     different ink arriving. */

  var PUNTOS = 48;   /* fewer and the waves look faceted */
  var CUADROS = 16;  /* frames computed; the browser interpolates between them */
  var TARDA = 900;

  /* 🔴 A POLYGON OF FIXED POINTS, NOT A path() OR AN inset(). Clips only
     interpolate between shapes with the SAME VERTEX COUNT. A triangle that
     grows into a pentagon changes count halfway and the browser gives up: it
     jumps instead of animating. With a fixed-point front and the closing
     corners always off screen, the count never changes.

     The front is the line x - y = c, running top-left to bottom-right, and
     the stained part is everything on this side of it.

     ⚠️ AND THE AMPLITUDE DIES AT THE ENDS. With the wave alive at the finish
     there would be unpainted bites at the screen edge, which is exactly when
     nobody forgives them, because nothing else is moving to cover them. */
  function mancha(t, W, H) {
    var L = W + H;
    var c = -H - L * 0.12 + t * (W + H + L * 0.24);
    var punta = Math.sin(Math.PI * Math.min(1, Math.max(0, t)));
    var amplitud = L * 0.075 * punta;
    var largoOla = L * 0.42;
    var fase = t * Math.PI * 2.4;

    var puntos = [];
    var desde = -L * 0.5;
    var hasta = L * 1.5;
    for (var i = 0; i < PUNTOS; i++) {
      var w = desde + ((hasta - desde) * i) / (PUNTOS - 1);
      var cc = c + amplitud * Math.sin((2 * Math.PI * w) / largoOla + fase);
      puntos.push(((cc + w) / 2).toFixed(1) + 'px ' + ((w - cc) / 2).toFixed(1) + 'px');
    }
    var lejos = L * 4;
    puntos.push(lejos.toFixed(1) + 'px ' + lejos.toFixed(1) + 'px');
    puntos.push((-lejos).toFixed(1) + 'px ' + lejos.toFixed(1) + 'px');
    puntos.push((-lejos).toFixed(1) + 'px ' + (-lejos).toFixed(1) + 'px');
    return 'polygon(' + puntos.join(', ') + ')';
  }

  /* 🔴 AN ANIMATION WITH FILL DOES NOT DIE WHEN ITS TRANSITION ENDS, AND THAT
     WAS THE BLACK VEIL ON THE THIRD CLICK. fill: both keeps the style applied
     forever, and the animation hangs off the document pointing at a
     pseudo-element that no longer exists. While it does not exist, nothing
     shows. But the next theme change CREATES ANOTHER PSEUDO-ELEMENT WITH THE
     SAME NAME, and the old animation grabs it and applies its last frame.

     Which is why it took three clicks and not two. The turn counter exists so
     that cancelling the old one does not wipe the new one's data-transicion:
     cancelling rejects its promise, and that rejection lands after the new
     change has already written its own. */
  var gestoVivo = null;
  var turno = 0;

  function cambiarTema(to) {
    if (typeof document.startViewTransition !== 'function' || reduced) {
      return aplicarTema(to);
    }

    var derramando = to === 'dark';
    var mio = ++turno;

    /* Before the new pseudo-elements exist, so there is never a single frame
       in which the previous gesture imposes its shape on them. */
    if (gestoVivo) gestoVivo.cancel();
    gestoVivo = null;

    root.setAttribute('data-transicion', derramando ? 'llenando' : 'vaciando');

    var t = document.startViewTransition(function () { aplicarTema(to); });

    function soltar() {
      if (turno === mio) root.removeAttribute('data-transicion');
    }

    t.ready.then(function () {
      if (turno !== mio) return;
      var W = window.innerWidth;
      var H = window.innerHeight;
      var pasos = [];
      for (var i = 0; i < CUADROS; i++) pasos.push(mancha(i / (CUADROS - 1), W, H));

      var gesto = root.animate({ clipPath: derramando ? pasos : pasos.slice().reverse() }, {
        duration: TARDA,
        /* Decisive in, soft stop, the way something spilled settles. No
           bounce: a stain that comes back does not exist. */
        easing: 'cubic-bezier(.3, 0, .1, 1)',
        /* 🔴 both, NOT THE DEFAULT, AND THIS WAS THE BLACK BLINK. Without
           fill, an animation DROPS THE STYLE THE MOMENT IT ENDS. On the way
           to light, what is animated is the old photo, the dark one, and it
           sits on top; in the frame where the animation let the clip go, that
           photo covered the whole screen again and everything went black,
           until the browser tore the transition down an instant later and the
           white appeared. both and not forwards because it also pins the
           first frame. */
        fill: 'both',
        pseudoElement: derramando
          ? '::view-transition-new(root)'
          : '::view-transition-old(root)'
      });

      gestoVivo = gesto;

      /* ⚠️ AND THE ATTRIBUTE COMES OFF WHEN THE GESTURE ENDS, NOT WHEN THE
         TRANSITION DOES. Two different clocks, and the transition's can land
         first; if it does, the z-index rules fall away mid-spill and the two
         layers swap in one frame. */
      gesto.finished.then(soltar, soltar);
    }).catch(function () {
      /* A transition can cancel itself if another lands on top. The theme was
         already applied inside the callback, so there is nothing to repair. */
    });

    t.finished.then(soltar, soltar);
  }

  var themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      cambiarTema(root.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
    });
  }

  /* ================= scroll ================= */

  /* One handler on a rAF for the whole page: nav border, reading progress,
     the hero glow and the background wash all read the same scrollY, so they
     can never disagree about where the page is. */
  var nav = document.querySelector('.nav');
  var bar = document.getElementById('progress-bar');
  var glow = document.querySelector('.glow');
  var bgLayer = document.querySelector('.bg');
  var mascots = [].slice.call(document.querySelectorAll('.mascot'));
  var garabatos = document.getElementById('garabatos');
  var pending = false;

  function frame() {
    pending = false;
    var y = window.pageYOffset || document.documentElement.scrollTop || 0;
    var max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    var progress = Math.min(1, y / max);

    if (nav) nav.classList.toggle('is-stuck', y > 8);
    if (bar) bar.style.width = (progress * 100).toFixed(2) + '%';
    if (reduced) return;

    paintArc(y);

    /* The scattered marks in the hero. One number written once and each mark
       multiplies it by its own factor in CSS, instead of this loop touching
       ten elements every frame. It is driven by raw scrollY and not by page
       progress: they only exist on the first screen, and progress over a
       page this long would barely move them. */
    if (garabatos) garabatos.style.setProperty('--desliz', (y * 0.18).toFixed(1) + 'px');

    /* Each background layer moves at its own rate and some of them the other
       way, which is the whole trick: one layer drifting reads as a bug, five
       at different rates read as depth. Everything is driven off `progress`
       rather than raw scrollY, so the drift is bounded by construction and an
       oversized layer can never show an edge however long the page gets. */
    if (bgLayer) {
      var st = bgLayer.style;
      st.setProperty('--y-wash', Math.round(progress * -190) + 'px');
      st.setProperty('--y-grid', Math.round(progress * 130) + 'px');
      st.setProperty('--y-orb1', Math.round(progress * -340) + 'px');
      st.setProperty('--x-orb1', Math.round(progress * 70) + 'px');
      st.setProperty('--y-orb2', Math.round(progress * 260) + 'px');
      st.setProperty('--x-orb2', Math.round(progress * -90) + 'px');
      st.setProperty('--y-orb3', Math.round(progress * -150) + 'px');
    }

    if (glow) {
      glow.style.setProperty('--sy', Math.round(y * 0.25) + 'px');
      glow.style.opacity = Math.max(0, 1 - y / 900).toFixed(3);
    }

    /* the mascots drift against the cards, each at its own rate. clamped to
       one viewport: without it, an element parked far above the fold reports
       a ratio of 5 and the drift lands hundreds of pixels off */
    for (var i = 0; i < mascots.length; i++) {
      var el = mascots[i];
      var rect = el.getBoundingClientRect();
      var centred = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
      centred = Math.max(-1, Math.min(1, centred));
      el.style.setProperty('--my', Math.round(centred * (i % 2 ? -44 : 44)) + 'px');
    }
  }

  /* ---- the pinned Path scene ----

     The section stays on screen while you travel it and a line draws from the
     first node to the last, lighting each step as it arrives. Measured, never
     assumed: the rail geometry and the point at which each step turns on both
     come from the real node centres, so the Spanish copy running longer than
     the English cannot put the line out of step with the icons.

     Pinning is a privilege, not a default. It happens only if the whole stage
     genuinely fits on the screen, which is the difference between a scene and
     a clipped section on a laptop. Everything below re-measures on resize and
     again once the fonts land, because a font swap moves every node. */
  var arcTrack = document.querySelector('.arc-track');
  var arcStage = document.querySelector('.arc-stage');
  var arcList = document.querySelector('.arc');
  var arcSteps = [].slice.call(document.querySelectorAll('.arc__step'));
  var arc = null;

  function unpinArc() {
    arc = null;
    if (!arcTrack) return;
    arcTrack.classList.remove('is-pinned');
    arcList.classList.remove('is-scrubbing');
    arcList.style.removeProperty('--draw');
    arcSteps.forEach(function (el) {
      el.classList.remove('is-on', 'is-current');
      /* sin escena no hay a donde saltar: la lista esta entera a la vista y un
         boton que no lleva a ningun lado es peor que ninguno */
      el.removeAttribute('role');
      el.removeAttribute('tabindex');
    });
  }

  /* Tocar un paso lleva a ese paso.

     La escena no se mueve sola: todo lo que se ve sale del scroll, asi que
     "ir al paso 4" es en realidad "poner el scroll donde el paso 4 esta
     encendido". Se invierte la misma cuenta que pinta la linea, y de ahi sale
     el pixel exacto.

     ⚠️ Y se recalcula en cada click en vez de guardarse: `arc` se rehace en
     cada resize y cada vez que cambia el idioma, asi que una posicion
     calculada al cargar la pagina queda vieja apenas se toca la ventana. */
  function irAlPaso(i) {
    if (!arc) return;
    /* un pelo pasado del umbral, para caer adentro de la franja del paso y no
       justo en el borde donde todavia manda el anterior */
    var draw = Math.min(1, arc.at[i] + 0.005);
    var y = arc.top + (draw * 0.74 + 0.08) * arc.scrub;
    window.scrollTo({ top: Math.round(y), behavior: reduced ? 'auto' : 'smooth' });
  }

  arcSteps.forEach(function (el, i) {
    el.addEventListener('click', function () { irAlPaso(i); });
    /* Enter y barra espaciadora, porque un <li> con un click encima no es un
       boton para nadie que no use el mouse. La barra ademas scrollea la pagina
       por defecto, asi que hay que frenarla. */
    el.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      if (!arc) return;
      e.preventDefault();
      irAlPaso(i);
    });
  });

  function measureArc() {
    if (!arcTrack || !arcStage || !arcList || arcSteps.length < 2 || reduced) return unpinArc();
    if (window.innerWidth < 900) return unpinArc();

    /* Measure with the scene actually on, because the two modes are different
       shapes: the vertical list is twice the height of the rail, so measuring
       the wrong one answers the wrong question. If the rail does not fit
       either, everything comes back off and the plain list stands. */
    arcTrack.classList.add('is-pinned');
    arcList.classList.add('is-scrubbing');

    /* The content, not the box. The stage carries min-height: 100vh, so its
       own rect always measures exactly one screen and comparing that against
       the screen can only ever say no. */
    var inner = arcStage.firstElementChild;
    var pad = parseFloat(getComputedStyle(arcStage).paddingTop) +
              parseFloat(getComputedStyle(arcStage).paddingBottom);
    if (!inner || inner.getBoundingClientRect().height + pad > window.innerHeight - 24) {
      return unpinArc();
    }

    arc = {
      top: arcTrack.getBoundingClientRect().top + (window.pageYOffset || 0),
      scrub: Math.max(1, arcTrack.offsetHeight - window.innerHeight),
      /* six equal flex columns put the node centres at even fractions of the
         rail, so the thresholds are exact without touching the DOM */
      at: arcSteps.map(function (el, i) { return i / (arcSteps.length - 1); })
    };
    arcSteps.forEach(function (el) {
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');
    });
    frame();
  }

  function paintArc(y) {
    if (!arc) return;
    var p = Math.max(0, Math.min(1, (y - arc.top) / arc.scrub));
    /* head and tail of the track are dead air, so the line finishes before
       the section lets go instead of completing on the very last pixel */
    var draw = Math.max(0, Math.min(1, (p - 0.08) / 0.74));
    arcList.style.setProperty('--draw', draw.toFixed(4));

    /* two different states, and they are not the same question. `is-on` is
       cumulative: everything the line has already passed stays lit, so you can
       see how far you have come. `is-current` is the one step whose story is
       up in the panel, and there is exactly one at a time. */
    var current = 0;
    for (var i = 0; i < arcSteps.length; i++) {
      var reached = draw >= arc.at[i] - 0.02;
      arcSteps[i].classList.toggle('is-on', reached);
      if (reached) current = i;
    }
    for (var j = 0; j < arcSteps.length; j++) {
      arcSteps[j].classList.toggle('is-current', j === current);
    }
  }

  function onScroll() {
    if (pending) return;
    pending = true;
    window.requestAnimationFrame(frame);
  }

  /* first measurement inside a rAF: run it straight away and the stage has not
     been laid out yet, so its height reads as nearly nothing and the section
     pins when it should not */
  window.requestAnimationFrame(measureArc);
  frame();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', measureArc, { passive: true });
  window.addEventListener('load', measureArc);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measureArc);
  /* the language swap changes how many lines each step takes */
  var langBtnArc = document.getElementById('lang-toggle');
  if (langBtnArc) langBtnArc.addEventListener('click', function () { window.setTimeout(measureArc, 60); });

  /* --- which section am I in --- */
  var links = [].slice.call(document.querySelectorAll('.nav__links a[href^="#"]'));
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (el) { spy.observe(el); });
  }

  /* --- reveal on scroll, both directions --- */
  var items = [].slice.call(document.querySelectorAll('.reveal'));

  /* stagger by position inside the element's own group, so a row of cards
     arrives one after another instead of all at once */
  items.forEach(function (el) {
    var sibs = el.parentNode ? el.parentNode.children : [];
    var before = 0;
    for (var i = 0; i < sibs.length; i++) {
      if (sibs[i] === el) break;
      if (sibs[i].classList && sibs[i].classList.contains('reveal')) before++;
    }
    el.style.setProperty('--d', Math.min(before * 70, 350) + 'ms');
  });

  function showAll() {
    items.forEach(function (el) {
      el.classList.remove('reveal', 'is-past');
      el.style.removeProperty('--d');
    });
  }

  if (reduced || !('IntersectionObserver' in window)) {
    showAll();
  } else {
    var fired = false;
    /* never unobserved: leaving the top parks the element in is-past, and
       scrolling back up runs the entrance again */
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var el = entry.target;
        if (entry.isIntersecting) {
          fired = true;
          el.classList.remove('is-past');
          el.classList.add('is-in');
        } else {
          /* 🔴 UN BLOQUE MAS ALTO QUE LA PANTALLA NI SALE NI SE APAGA. El
             estado `is-past` lleva la opacidad a cero, y para un bloque corto
             eso pasa cuando ya salio de la vista. Pero el arbol de servicios en
             telefono mide varias pantallas: apenas su borde de arriba cruza,
             se apagaba entero mientras la persona lo estaba mirando. Medido en
             captura: los seis titulos en blanco y solo el pie legible.

             ⚠️ Y hay que salir ANTES de sacarle `is-in`, no solo evitar el
             `is-past`. Sin ninguna de las dos clases el elemento vuelve al
             estado inicial del reveal, que tambien es opacidad cero: la
             primera version de esta guarda dejaba el arbol igual de apagado. */
          var alto = entry.boundingClientRect.height;
          if (alto >= window.innerHeight * 0.7) return;
          el.classList.remove('is-in');
          el.classList.toggle('is-past', entry.boundingClientRect.top < 0);
        }
      });
    }, { rootMargin: '-4% 0px -10% 0px', threshold: 0.06 });
    items.forEach(function (el) { io.observe(el); });

    /* the decoration fades with whatever it sits in rather than with the
       text: the mascots with the work grid, the orbit with the hero */
    var deco = mascots.concat([].slice.call(document.querySelectorAll('.orbit')));
    if (deco.length) {
      var dio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          entry.target.classList.toggle('is-in', entry.isIntersecting);
        });
      }, { rootMargin: '-8% 0px -8% 0px' });
      deco.forEach(function (el) { dio.observe(el); });
    }

    /* if the observer never fires (headless render, odd embed), show it all.
       `fired`, not a DOM check, because is-in comes and goes by design */
    window.setTimeout(function () {
      if (fired) return;
      io.disconnect();
      showAll();
    }, 1500);
  }

  /* ================= data ================= */

  var nf;
  var contributions = null;
  var contribSemestre = null;

  function paintContributions() {
    if (contributions === null) return;
    if (!nf) nf = new Intl.NumberFormat(lang === 'es' ? 'es-AR' : 'en-US');
    var dicc = lang === 'es' ? DICT : META_EN;

    /* 🔴 EL PIE TIENE QUE DECIR LO QUE EL GRAFICO MUESTRA. En telefono el
       grafico son seis meses, y el pie seguia diciendo "en el ultimo anio" con
       el total del anio debajo de medio anio de cuadraditos. Nadie lo suma a
       mano, se lo cree, y es un numero que no corresponde a lo que esta viendo.
       El de la fila de metricas de arriba SI se queda en el anio: ahi el
       rotulo dice "ultimo anio" y no hay grafico al lado que lo desmienta. */
    var chico = window.matchMedia('(max-width: 760px)').matches;
    var n = (chico && contribSemestre !== null) ? contribSemestre : contributions;
    var tpl = (chico
      ? (dicc._contributions_6m || '{n} contributions in the last six months')
      : (dicc._contributions || '{n} contributions in the last year'));

    setText('[data-stat="contributions"]', nf.format(contributions));
    setText('[data-stat="contributions-line"]', tpl.replace('{n}', nf.format(n)));
  }

  fetch('data/github.json', { cache: 'no-cache' })
    .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
    .then(function (data) {
      if (!data.contributions) return;
      paintHeatmap(data.contributions);
      contributions = data.contributions.total;
      nf = null;
      paintContributions();
    })
    .catch(function () { /* static copy stays as written */ });

  function setText(sel, value) {
    var el = document.querySelector(sel);
    if (el) el.textContent = value;
  }

  /* Quartiles of the active days, not fractions of the busiest day. A single
     132-commit Saturday would otherwise squash every normal day into level 1
     and make a year of real work look empty. */
  function thresholds(days) {
    var counts = days
      .map(function (d) { return d.c; })
      .filter(function (c) { return c > 0; })
      .sort(function (a, b) { return a - b; });
    if (!counts.length) return [1, 1, 1];
    var at = function (p) {
      return counts[Math.min(counts.length - 1, Math.floor(counts.length * p))];
    };
    return [at(0.25), at(0.5), at(0.75)];
  }

  function level(count, t) {
    if (!count) return 0;
    if (count <= t[0]) return 1;
    if (count <= t[1]) return 2;
    if (count <= t[2]) return 3;
    return 4;
  }

  function paintHeatmap(contrib) {
    var grid = document.getElementById('heatmap');
    if (!grid || !contrib.days || !contrib.days.length) return;

    /* 🔴 EN TELEFONO SON SEIS MESES Y NO UN ANIO. Un anio son 53 columnas, que
       con la celda mas chica que sigue siendo tocable no bajan de 700px: en una
       pantalla de 390 eso es scroll lateral adentro de una pagina que ya se
       scrollea vertical, y los dos gestos se pelean. Medio anio entra sin
       arrastrar nada y sigue contestando la unica pregunta que la seccion hace,
       que es si la persona shippea seguido.

       Los umbrales de color se calculan sobre los dias que se muestran y no
       sobre los 365: con los del anio entero, medio anio de actividad pareja
       sale todo del mismo tono. */
    var dias = contrib.days;
    if (window.matchMedia('(max-width: 760px)').matches) {
      dias = dias.slice(-183);
    }
    contribSemestre = dias.reduce(function (a, d) { return a + (d.c || 0); }, 0);

    var t = thresholds(dias);
    var frag = document.createDocumentFragment();

    /* pad so the first column starts on the right weekday */
    var firstDow = new Date(dias[0].d + 'T00:00:00Z').getUTCDay();
    for (var p = 0; p < firstDow; p++) {
      var pad = document.createElement('i');
      pad.style.visibility = 'hidden';
      frag.appendChild(pad);
    }

    dias.forEach(function (day) {
      var cell = document.createElement('i');
      cell.className = 'lv' + level(day.c, t);
      cell.title = day.c + (day.c === 1 ? ' contribution' : ' contributions') + ' on ' + day.d;
      frag.appendChild(cell);
    });

    grid.textContent = '';
    grid.appendChild(frag);
  }
})();

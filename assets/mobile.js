/* La versión de teléfono. Dos patrones, aplicados a seis secciones.

   El problema medido: la página mide 15.353px de alto en un teléfono. Nadie
   scrollea quince mil píxeles, así que las secciones largas no se acortan
   escribiendo menos, se acortan mostrando menos hasta que alguien pide más.

   🔴 TODO ESTO SE ARMA EN EL NAVEGADOR Y NO EN EL HTML. Ni un elemento nuevo en
   index.html: el mismo marcado sirve para las dos vistas y no hay dos versiones
   del contenido que puedan quedar desincronizadas. En escritorio este archivo
   no toca nada, y si el script no corre queda la página larga de siempre, que
   es larga pero completa.

   ⚠️ Y SE DESARMA AL AGRANDAR LA VENTANA. Un acordeón que sobrevive al giro del
   teléfono deja media página plegada en horizontal sin nada que la despliegue. */

(function () {
  'use strict';

  var ANGOSTO = window.matchMedia('(max-width: 760px)');
  var quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var armado = [];

  /* ------------------------------------------------------------ acordeón */

  /* El cuerpo se envuelve en un contenedor de grilla y se anima
     `grid-template-rows` de 0fr a 1fr.

     🔴 Es lo único que anima una altura desconocida sin medirla. `height: auto`
     no interpola, y la alternativa clásica —medir con scrollHeight y escribir
     un px— se rompe apenas el texto reflowea: el contenedor queda con la altura
     de antes y corta la última línea. */
  function acordeon(itemSel, cabezaSel) {
    var items = [].slice.call(document.querySelectorAll(itemSel));
    items.forEach(function (item, i) {
      var cabeza = item.querySelector(cabezaSel);
      if (!cabeza || item.dataset.plegado) return;

      var cuerpo = document.createElement('div');
      cuerpo.className = 'plegable';
      var dentro = document.createElement('div');
      cuerpo.appendChild(dentro);

      /* Todo lo que viene después del encabezado entra al plegable. Se recorre
         al revés y se inserta al principio para no pelear con el índice
         mientras se mueven los nodos. */
      var sueltos = [];
      var n = cabeza.nextSibling;
      while (n) { sueltos.push(n); n = n.nextSibling; }
      sueltos.forEach(function (nodo) { dentro.appendChild(nodo); });
      if (!dentro.childNodes.length) return;

      item.appendChild(cuerpo);
      item.classList.add('es-acordeon');

      var boton = document.createElement('button');
      boton.type = 'button';
      boton.className = 'plegable__tirador';
      boton.setAttribute('aria-expanded', 'false');
      cabeza.parentNode.insertBefore(boton, cabeza);
      boton.appendChild(cabeza);

      boton.addEventListener('click', function () {
        var abierto = item.classList.toggle('esta-abierto');
        boton.setAttribute('aria-expanded', abierto ? 'true' : 'false');
        /* Uno por vez: con todos abiertos vuelve a ser la página larga que se
           quiso evitar, y encima sin el orden que tenía. */
        if (abierto) {
          items.forEach(function (otro) {
            if (otro !== item && otro.classList.contains('esta-abierto')) {
              otro.classList.remove('esta-abierto');
              var b = otro.querySelector('.plegable__tirador');
              if (b) b.setAttribute('aria-expanded', 'false');
            }
          });
        }
      });

      item.dataset.plegado = '1';
      /* El primero abierto: un acordeón entero cerrado no muestra de qué se
         trata la sección, solo una lista de títulos. */
      if (i === 0) { item.classList.add('esta-abierto'); boton.setAttribute('aria-expanded', 'true'); }
      armado.push(item);
    });
  }

  /* ------------------------------------------------------------ carrusel */

  function carrusel(contenedorSel) {
    var cajas = [].slice.call(document.querySelectorAll(contenedorSel));
    cajas.forEach(function (caja) {
      if (caja.dataset.carrusel) return;
      caja.classList.add('es-carrusel');
      caja.dataset.carrusel = '1';
      armado.push(caja);

      if (quieto) return;
      /* Un empujón de una sola vez cuando entra en pantalla, y nada más.
         🔴 No hay desplazamiento continuo a propósito: algo que se mueve solo
         mientras alguien lee es imposible de leer, y encima pelea con el dedo.
         El empujón dice "esto se corre" y después se queda quieto. */
      var visto = false;
      new IntersectionObserver(function (entradas, obs) {
        entradas.forEach(function (e) {
          if (!e.isIntersecting || visto) return;
          visto = true;
          obs.disconnect();
          setTimeout(function () {
            caja.scrollTo({ left: 52, behavior: 'smooth' });
            setTimeout(function () { caja.scrollTo({ left: 0, behavior: 'smooth' }); }, 620);
          }, 420);
        });
      }, { threshold: 0.35 }).observe(caja);
    });
  }



  /* --------------------------------------------------- el volante */

  /* 🔴 EL DESPLAZAMIENTO DEJA DE SER UNA ANIMACION DE CSS Y PASA A JAVASCRIPT,
     y no es un capricho: una animacion declarada en CSS no se puede empujar. Se
     puede pausar y nada mas. Para que un envion la acelere y despues la deje
     frenar sola hace falta una velocidad que sea un numero y no una duracion, y
     eso obliga a mover la posicion cuadro a cuadro.

     Un solo reloj para todas las pistas. Cinco `requestAnimationFrame` en
     paralelo se sincronizan mal entre si y cada uno vuelve a leer el reloj del
     sistema por su cuenta; con uno solo, todas avanzan con el mismo `dt` y
     nunca se ven desfasadas.

     ⚠️ El periodo NO es la mitad del ancho de la pista. El contenido esta
     duplicado, pero entre las fichas hay separacion, asi que la mitad exacta
     cae medio hueco corrida y el bucle salta un poquito cada vuelta. El
     periodo real es la distancia entre la primera ficha y su copia, y eso se
     mide, no se calcula. */

  var pistas = [];
  var reloj = null;
  var cuadroPrevio = 0;

  function medirPeriodo(m) {
    var hijos = m.el.children;
    if (hijos.length < m.cuantas + 1) return;
    m.periodo = hijos[m.cuantas].offsetLeft - hijos[0].offsetLeft;
    /* px por segundo, sacados de los segundos que decia la version vieja: la
       fila entera tarda `vel` en recorrer un periodo */
    m.base = m.periodo > 0 ? -m.periodo / m.segundos : 0;
  }

  function ubicar(m) {
    if (m.periodo > 0) {
      while (m.x <= -m.periodo) m.x += m.periodo;
      while (m.x > 0) m.x -= m.periodo;
    }
    m.el.style.transform = 'translate3d(' + m.x.toFixed(2) + 'px,0,0)';
  }

  function cuadro(t) {
    /* el tope de 50ms es para volver de una pestana en segundo plano: sin el,
       el primer cuadro trae medio minuto de `dt` y la fila se teletransporta */
    var dt = Math.min(0.05, (t - cuadroPrevio) / 1000);
    cuadroPrevio = t;
    if (!(dt > 0)) dt = 0.016;

    for (var i = 0; i < pistas.length; i++) {
      var m = pistas[i];
      if (m.agarrado) continue;
      /* vuelta suave a la velocidad de siempre. Exponencial y no lineal: un
         envion fuerte pierde mucho al principio y despues se va arrimando, que
         es como frena cualquier cosa que rueda. */
      m.v += (m.base - m.v) * (1 - Math.exp(-dt / 0.55));
      m.x += m.v * dt;
      ubicar(m);
    }
    reloj = window.requestAnimationFrame(cuadro);
  }

  function arrancarReloj() {
    if (reloj !== null) return;
    cuadroPrevio = window.performance.now();
    reloj = window.requestAnimationFrame(cuadro);
  }

  function pararReloj() {
    if (reloj === null) return;
    window.cancelAnimationFrame(reloj);
    reloj = null;
    pistas = [];
  }

  /* Arrastre con envion.

     ⚠️ `touch-action: pan-y` en el CSS es la mitad de esto. Le dice al
     navegador que el movimiento horizontal es nuestro y el vertical suyo, asi
     que la pagina sigue scrolleando normal con el dedo encima de la fila. Y
     cuando el navegador decide que el gesto era vertical, se lleva el puntero y
     dispara `pointercancel`: por eso hay que soltar ahi tambien y no solo en
     `pointerup`, o la fila queda congelada esperando un dedo que ya no esta. */
  function volante(fila, m) {
    var ultimoX = 0;
    var ultimoT = 0;
    var recorrido = 0;
    var arrastrando = false;

    fila.addEventListener('pointerdown', function (e) {
      if (e.button !== undefined && e.button !== 0) return;
      /* apoyar el dedo frena la fila: es lo primero que hace alguien que quiere
         leer una tarjeta que se le esta yendo */
      m.agarrado = true;
      m.v = 0;
      recorrido = 0;
      arrastrando = false;
      ultimoX = e.clientX;
      ultimoT = e.timeStamp;
      m.envion = 0;
    });

    fila.addEventListener('pointermove', function (e) {
      if (!m.agarrado) return;
      var dx = e.clientX - ultimoX;
      var dt = (e.timeStamp - ultimoT) / 1000;
      recorrido += Math.abs(dx);

      /* 🔴 EL PUNTERO SE CAPTURA RECIEN ACA, PASADO EL UMBRAL, Y NUNCA AL
         APOYAR EL DEDO. Capturando en `pointerdown`, el `click` que viene
         despues se dispara sobre la fila y no sobre el enlace que se toco:
         medido, un toque limpio sobre el nombre de un producto no abria nada.
         El capture existe para no perder el dedo si se sale de la fila
         mientras se arrastra, y eso solo hace falta cuando ya se esta
         arrastrando. */
      if (!arrastrando) {
        if (recorrido <= 6) { ultimoX = e.clientX; ultimoT = e.timeStamp; return; }
        arrastrando = true;
        fila.classList.add('agarrando');
        try { fila.setPointerCapture(e.pointerId); } catch (err) { /* raton viejo */ }
      }

      m.x += dx;
      /* la velocidad del envion se suaviza: el ultimo movimiento antes de
         soltar suele ser de un pixel y solo con ese la fila quedaria quieta */
      if (dt > 0) m.envion = m.envion * 0.7 + (dx / dt) * 0.3;
      ultimoX = e.clientX;
      ultimoT = e.timeStamp;
      ubicar(m);
    });

    function soltar() {
      if (!m.agarrado) return;
      m.agarrado = false;
      arrastrando = false;
      fila.classList.remove('agarrando');
      /* tope de velocidad: un envion muy corto y muy rapido da numeros
         absurdos y la fila desaparece de un cuadro al otro */
      m.v = Math.max(-5000, Math.min(5000, m.envion));
      m.envion = 0;
      m.arrastro = recorrido > 8;
      /* la marca de "esto fue un arrastre" dura lo que tarda en llegar el
         click que viene detras del dedo, y se limpia sola */
      if (m.arrastro) window.setTimeout(function () { m.arrastro = false; }, 60);
    }

    fila.addEventListener('pointerup', soltar);
    fila.addEventListener('pointercancel', soltar);
    fila.addEventListener('lostpointercapture', soltar);

    /* 🔴 En captura y no en burbujeo. Un arrastre que empieza arriba de una
       tarjeta termina con un click sobre el enlace de esa tarjeta, asi que
       mover el carrusel abria el producto. Hay que interceptarlo antes de que
       llegue al <a>, y para eso el escucha tiene que estar en la fase de
       captura. */
    fila.addEventListener('click', function (e) {
      if (!m.arrastro) return;
      e.preventDefault();
      e.stopPropagation();
    }, true);
  }

  /* ------------------------------------------------------------ marquesina */

  /* Reparte las fichas en dos filas y las hace correr sin fin.

     🔴 Cada fila lleva su contenido DUPLICADO y el recorrido es -50% exacto.
     Es lo unico que evita el salto al reiniciar: con la copia detras, el
     ultimo fotograma es identico al primero. Animar el ancho entero y volver
     a cero se ve como un tiron cada vuelta.

     ⚠️ La duracion sale de la cantidad de fichas y no es fija. Con un valor
     fijo, una fila de seis vuela y una de veinte se arrastra, porque las dos
     recorren su propio ancho en el mismo tiempo. */
  function marquesina(sel, filas, segPorFicha) {
    var lista = document.querySelector(sel);
    if (!lista || lista.dataset.marquesina) return;

    var fichas = [].slice.call(lista.children);
    if (fichas.length < filas * 2) return;

    var caja = document.createElement('div');
    caja.className = 'marquesina';
    lista.parentNode.insertBefore(caja, lista);
    lista.style.display = 'none';
    caja.appendChild(lista);

    for (var f = 0; f < filas; f++) {
      var fila = document.createElement('div');
      fila.className = 'marquesina' + (f % 2 ? ' marquesina--lenta' : '');
      var pista = document.createElement('div');
      /* 🔴 LA PISTA HEREDA LAS CLASES DE LA LISTA ORIGINAL, y sin esto las
         fichas salian desnudas. Los estilos de cada ficha viven en selectores
         de descendencia: `.chips li`, `.minis .mini`. Clonandolas dentro de un
         div propio dejan de tener ese ancestro y pierden borde, relleno y
         fondo de golpe: quedaban como texto suelto pisandose entre si, que es
         exactamente la mancha que se veia en el medio del stack. */
      pista.className = 'marquesina__pista ' + lista.className;

      /* 🔴 AL CLON HAY QUE SACARLE `reveal`, Y SIN ESTO LA MARQUESINA SALIA
         VACIA. El observador de entradas se arma una sola vez al cargar la
         pagina, con los elementos que existian en ese momento; un nodo creado
         despues no lo mira nadie, asi que se queda con la clase puesta y en
         opacidad 0 para siempre. Se veia un hueco del alto exacto de las dos
         filas, con las fichas adentro, invisibles. Es el mismo error que dejo
         escondida la linea del MBA. */
      function limpiar(nodo) {
        nodo.classList.remove('reveal', 'is-in', 'is-past');
        nodo.querySelectorAll('.reveal').forEach(function (h) {
          h.classList.remove('reveal', 'is-in', 'is-past');
        });
        nodo.style.removeProperty('--d');
        return nodo;
      }

      var mias = fichas.filter(function (_, i) { return i % filas === f; });
      mias.forEach(function (n) { pista.appendChild(limpiar(n.cloneNode(true))); });
      mias.forEach(function (n) {
        var copia = limpiar(n.cloneNode(true));
        copia.setAttribute('aria-hidden', 'true');
        /* 🔴 Y ADEMAS FUERA DEL TABULADOR. `aria-hidden` calla al lector de
           pantalla pero NO saca del recorrido del teclado: sin esto, tabular
           por la seccion pasa dos veces por cada producto, y la segunda vez el
           foco aterriza en algo que el lector declara inexistente. Es la
           combinacion que mas confunde: un foco donde no hay nada. */
        [].forEach.call(copia.querySelectorAll('a, button, [tabindex]'), function (f) {
          f.setAttribute('tabindex', '-1');
        });
        if (copia.matches('a, button')) copia.setAttribute('tabindex', '-1');
        pista.appendChild(copia);
      });

      var seg = segPorFicha || 3.4;
      fila.appendChild(pista);
      caja.appendChild(fila);

      /* con movimiento reducido no hay motor: el CSS deja la caja como un
         scroll horizontal comun y la persona la mueve con el dedo, que es
         exactamente lo que pidio quien puso esa preferencia */
      if (!quieto) {
        var m = {
          el: pista,
          cuantas: mias.length,
          segundos: Math.max(24, mias.length * seg) * (f % 2 ? 1.3 : 1),
          x: 0, v: 0, base: 0, periodo: 0,
          agarrado: false, envion: 0, arrastro: false
        };
        medirPeriodo(m);
        m.v = m.base;
        pistas.push(m);
        volante(fila, m);
      }
    }

    lista.dataset.marquesina = '1';
    caja.dataset.marquesinaCaja = '1';
    armado.push(caja);
  }

  /* ------------------------------------------------------------ armado */

  function montar() {
    acordeon('.arc__step', '.arc__label');
    acordeon('.offer', 'h3');
    /* 🔴 Un boton adentro de cada servicio, y no solo el del final. Plegado, el
       unico camino para consultar quedaba despues de cinco titulos: la persona
       lee el que le sirve, lo abre, y para escribir tiene que cerrarlo y seguir
       bajando. El pedido se hace donde nacio el interes. */
    document.querySelectorAll('.offer .plegable > div').forEach(function (cuerpo) {
      if (cuerpo.querySelector('.offer__cta')) return;
      var a = document.createElement('a');
      a.className = 'btn btn--sm offer__cta';
      a.href = '#contact';
      a.textContent = document.documentElement.getAttribute('data-lang') === 'es'
        ? 'Consultar por esto' : 'Ask about this';
      a.addEventListener('click', function () {
        if (window.medir) window.medir('servicio_consulta');
      });
      cuerpo.appendChild(a);
    });
    /* Una fila y despacio: son tarjetas que hay que leer y tocar, no fichas.
       La velocidad sale de la cantidad, y el gesto se frena al tocarlo. */
    marquesina('.cards', 1, 13);
    marquesina('.skills-grid', 1, 13);
    marquesina('.sidelist', 1, 11);
    marquesina('.stack .chips', 2);
    marquesina('.minis', 2);

    if (pistas.length) {
      arrancarReloj();
      /* Las fichas cambian de ancho cuando llegan las fuentes y cuando se gira
         el telefono, y el periodo medido antes de eso queda viejo: el bucle
         empieza a saltar de a unos pixeles por vuelta. */
      var remedir = function () { pistas.forEach(medirPeriodo); };
      window.addEventListener('load', remedir);
      window.addEventListener('resize', remedir, { passive: true });
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(remedir);
    }
  }

  function desmontar() {
    armado.forEach(function (el) {
      el.classList.remove('es-acordeon', 'esta-abierto', 'es-carrusel');
      var boton = el.querySelector(':scope > .plegable__tirador');
      var cuerpo = el.querySelector(':scope > .plegable');
      if (boton) {
        while (boton.firstChild) el.insertBefore(boton.firstChild, boton);
        boton.remove();
      }
      if (cuerpo) {
        var dentro = cuerpo.firstElementChild;
        while (dentro && dentro.firstChild) el.appendChild(dentro.firstChild);
        cuerpo.remove();
      }
      if (el.dataset.marquesinaCaja) {
        var orig = el.querySelector('[data-marquesina]');
        if (orig) {
          orig.style.display = '';
          delete orig.dataset.marquesina;
          el.parentNode.insertBefore(orig, el);
        }
        el.remove();
        return;
      }
      delete el.dataset.plegado;
      delete el.dataset.carrusel;
    });
    armado = [];
    pararReloj();
  }

  function mirar() {
    if (ANGOSTO.matches) { if (!armado.length) montar(); }
    else if (armado.length) desmontar();
  }

  mirar();
  ANGOSTO.addEventListener('change', mirar);
})();

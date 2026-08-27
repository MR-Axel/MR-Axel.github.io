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
      pista.style.setProperty('--vel', Math.max(24, mias.length * seg) + 's');
      pista.style.setProperty('--vel2', Math.max(30, mias.length * seg * 1.3) + 's');
      fila.appendChild(pista);
      caja.appendChild(fila);
    }

    lista.dataset.marquesina = '1';
    caja.dataset.marquesinaCaja = '1';
    armado.push(caja);
  }

  /* ------------------------------------------------------------ armado */

  function montar() {
    acordeon('.arc__step', '.arc__label');
    acordeon('.craft__item', 'h3');
    /* ⚠️ El icono entra al boton DESPUES de armar el acordeon. El acordeon
       envuelve solo el encabezado que se le pide, y en Oficio el icono es
       hermano anterior del h3: quedaba afuera y arriba, apilado, que es
       justamente el alto que se queria sacar. Adentro del boton va a la
       izquierda del titulo y la caja cerrada pasa a medir un renglon. */
    document.querySelectorAll('.craft__item .plegable__tirador').forEach(function (b) {
      var icono = b.parentElement.querySelector(':scope > .craft__icon');
      if (icono) b.insertBefore(icono, b.firstChild);
    });
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
  }

  function mirar() {
    if (ANGOSTO.matches) { if (!armado.length) montar(); }
    else if (armado.length) desmontar();
  }

  mirar();
  ANGOSTO.addEventListener('change', mirar);
})();

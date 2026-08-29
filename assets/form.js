/* The contact form.

   GitHub Pages is static, so this posts to a small service on my own VPS
   behind api.eixol.tech and the message lands on my phone.

   Two things that matter here and are easy to get wrong:

   The three status lines live in the HTML, hidden, instead of being written
   from JS. That is what keeps them translated: the dictionary in i18n.js is
   keyed on the English innerHTML of elements already in the page, so a string
   built at runtime would have no key and would stay in English on the Spanish
   page.

   And validation is left to the browser on purpose. It writes 'please fill in
   this field' in whoever is reading's own language, which is better i18n than
   anything I would ship by hand.

   No script, or a service that is down, still leaves the LinkedIn button
   sitting right next to it. */

(function () {
  'use strict';

  var ENDPOINT = 'https://api.eixol.tech/portfolio/contacto';

  var form = document.getElementById('contact-form');
  if (!form || !window.fetch) return;

  /* When the page was opened. The service refuses anything filled in under
     four seconds, which no person manages across three fields. */
  var abierto = Date.now();

  var mensajes = {};
  Array.prototype.forEach.call(form.querySelectorAll('[data-estado]'), function (el) {
    mensajes[el.getAttribute('data-estado')] = el;
  });
  var boton = form.querySelector('button[type="submit"]');
  var enviando = false;

  /* ---- el tema llega elegido ----

     Dos caminos, y los dos terminan igual. Desde el árbol de la portada el
     botón de cada rama trae `data-tema`, porque el formulario está en la misma
     página y una recarga sería absurda. Desde afuera viene en la dirección
     (`/?tema=agentes#contact`), que es lo que hace que un enlace pegado en
     cualquier lado llegue con la consulta ya encuadrada.

     Sirve para las dos puntas: la persona se saltea un campo, y el aviso que me
     llega dice de qué salió la consulta sin que nadie lo haya escrito. */
  function elegirTema(clave) {
    var campo = form.elements['tema'];
    if (!campo || !clave) return;
    for (var k = 0; k < campo.options.length; k++) {
      if (campo.options[k].value !== clave) continue;
      campo.selectedIndex = k;
      /* 🔴 El <select> nativo está escondido y el que se ve lo dibuja app.js.
         Sin avisar del cambio, el valor que se manda es el nuevo pero el botón
         sigue mostrando el anterior, que es peor que no preseleccionar nada. */
      campo.dispatchEvent(new Event('change', { bubbles: true }));
      return;
    }
  }

  elegirTema((window.location.search.match(/[?&]tema=([a-z]+)/) || [])[1]);

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-tema]');
    if (a) elegirTema(a.getAttribute('data-tema'));
  });

  function mostrar(estado) {
    for (var k in mensajes) {
      if (Object.prototype.hasOwnProperty.call(mensajes, k)) {
        mensajes[k].hidden = k !== estado;
      }
    }
  }

  function valor(nombre) {
    var el = form.elements[nombre];
    return el ? el.value.trim() : '';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (enviando) return;

    enviando = true;
    boton.disabled = true;
    mostrar('enviando');
    if (window.medir) window.medir('form_intento');

    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: valor('nombre'),
        mail: valor('mail'),
        origen: window.origenVisita ? window.origenVisita() : '',
        tema: valor('tema'),
        busca: valor('busca'),
        web: valor('web'),
        t: abierto
      })
    })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (d) {
        if (!d || !d.ok) throw new Error('respuesta sin ok');
        /* The fields go away rather than sitting there filled: an empty form
           under a success line reads like it did not send. */
        form.classList.add('is-sent');
        mostrar('listo');
        if (window.medir) window.medir('form_enviado');
      })
      .catch(function () {
        if (window.medir) window.medir('form_fallo');
        mostrar('error');
        boton.disabled = false;
        enviando = false;
      });
  });
})();

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

    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: valor('nombre'),
        mail: valor('mail'),
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
      })
      .catch(function () {
        mostrar('error');
        boton.disabled = false;
        enviando = false;
      });
  });
})();

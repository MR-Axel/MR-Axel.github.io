/* Lima, the assistant in the corner.

   Every string it says comes out of the markup, never out of this file. The
   dictionary is keyed on the English innerHTML of elements already in the
   page, so a line written here would have no key and would sit in English on
   the Spanish side. That is why the greeting and the two failure lines live
   in a hidden block in the HTML and get read from the DOM at the moment they
   are needed, after the translator has already been over them.

   The launcher stays out of the way until the hero is behind you. A chat
   bubble covering the first screen is the thing people close before reading
   anything. */

(function () {
  'use strict';

  var ENDPOINT = 'https://api.eixol.tech/portfolio/chat';
  var GUARDADO = 'lima-charla';

  var root = document.documentElement;
  var caja = document.getElementById('lima');
  if (!caja || !window.fetch) return;

  var launch = document.getElementById('lima-launch');
  var panel = document.getElementById('lima-panel');
  var cerrar = document.getElementById('lima-close');
  var log = document.getElementById('lima-log');
  var ask = document.getElementById('lima-ask');
  var input = document.getElementById('lima-input');

  var frases = {};
  Array.prototype.forEach.call(caja.querySelectorAll('[data-frase]'), function (el) {
    frases[el.getAttribute('data-frase')] = el;
  });

  /* El atributo se saca ni bien arranca el script y no vuelve: `display: none`
     no interpola, asi que mientras este puesto no hay transicion posible. Si
     el script nunca corre, se queda y el panel no aparece, que es lo que
     corresponde. */
  panel.hidden = false;

  var charla = [];
  var ocupada = false;
  var cerrada = false;
  var abierta = false;

  /* ------------------------------------------------------------ storage */

  try {
    var crudo = sessionStorage.getItem(GUARDADO);
    if (crudo) charla = JSON.parse(crudo) || [];
  } catch (e) { charla = []; }

  function guardar() {
    try { sessionStorage.setItem(GUARDADO, JSON.stringify(charla)); } catch (e) {}
  }

  /* ------------------------------------------------------------ painting */

  function burbuja(rol, texto) {
    var el = document.createElement('div');
    el.className = 'lima__msg lima__msg--' + rol;
    el.textContent = texto;
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
    return el;
  }

  /* Read at call time, not cached: the language can change under us while
     the panel is open, and the next line has to come out in the new one. */
  function frase(clave) {
    var el = frases[clave];
    return el ? el.textContent.trim() : '';
  }

  function pintarTodo() {
    log.textContent = '';
    if (!charla.length) {
      burbuja('bot', frase('hola'));
    } else {
      charla.forEach(function (t) { burbuja(t.rol, t.texto); });
    }
  }

  /* ------------------------------------------------------------ opening */

  function abrir() {
    abierta = true;
    launch.setAttribute('aria-expanded', 'true');
    caja.classList.add('is-open');
    pintarTodo();
    input.focus();
  }

  function cerrarPanel() {
    abierta = false;
    launch.setAttribute('aria-expanded', 'false');
    caja.classList.remove('is-open');
    launch.focus();
  }

  launch.addEventListener('click', function () {
    if (abierta) cerrarPanel(); else abrir();
  });
  cerrar.addEventListener('click', cerrarPanel);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && abierta) cerrarPanel();
  });

  /* ------------------------------------------------------------ asking */

  ask.addEventListener('submit', function (e) {
    e.preventDefault();
    var texto = input.value.trim();
    if (!texto || ocupada || cerrada) return;

    input.value = '';
    charla.push({ rol: 'yo', texto: texto });
    burbuja('yo', texto);
    guardar();

    ocupada = true;
    input.disabled = true;
    var esperando = burbuja('bot', frase('pensando'));
    esperando.classList.add('is-waiting');

    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        idioma: document.documentElement.getAttribute('data-lang') === 'es' ? 'es' : 'en',
        mensajes: charla
      })
    })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (d) {
        if (!d || !d.ok || !d.respuesta) throw new Error('respuesta vacia');
        esperando.remove();
        charla.push({ rol: 'bot', texto: d.respuesta });
        burbuja('bot', d.respuesta);
        guardar();
        /* The model asked for a person. The button is the whole point of
           the chat, so it goes on screen instead of being described. */
        if (d.contacto && !document.getElementById('lima-salto')) {
          var salto = document.createElement('button');
          salto.id = 'lima-salto';
          salto.type = 'button';
          salto.className = 'lima__salto';
          salto.textContent = frase('dejar');
          salto.addEventListener('click', function () {
            cerrarPanel();
            var campo = document.getElementById('f-name');
            if (campo) {
              campo.scrollIntoView({ block: 'center', behavior: 'smooth' });
              setTimeout(function () { campo.focus(); }, 400);
            }
          });
          log.appendChild(salto);
          log.scrollTop = log.scrollHeight;
        }
        if (d.cerrado) {
          /* The service is rate limited, capped or out of budget. It never
             says which, and neither does this: the visitor gets a way
             forward and an attacker gets no confirmation. */
          cerrada = true;
          ask.hidden = true;
        }
      })
      .catch(function () {
        esperando.remove();
        burbuja('bot', frase('caido'));
      })
      .then(function () {
        ocupada = false;
        if (!cerrada) {
          input.disabled = false;
          if (abierta) input.focus();
        }
      });
  });

  /* ------------------------------------------------------------ entrance */

  /* Desde el arranque y no despues del hero. Estaba atado al scroll para no
     tapar la primera pantalla, y el costo era peor que el problema: quien
     entra y no baja nunca ve que hay alguien para preguntarle, que es
     justamente la gente que mas lo necesita.

     Entra con una demora corta para que se lea como que llego, y no como que
     siempre estuvo ahi. */
  caja.hidden = false;
  setTimeout(function () { caja.classList.add('is-visible'); }, 900);

  /* ------------------------------------------------------- language swap */

  /* 🔴 THE GREETING IS PAINTED ONCE, AND THAT WAS THE BUG. The hidden strings
     in the markup do get retranslated when the language toggles, but the
     bubble is a div this file created with textContent: it has no key, so it
     kept whatever language it was born in. Open the panel in English, switch
     to Spanish, and the assistant was still greeting in English on a Spanish
     page.

     Only the greeting is repainted, and only while nothing has been said. A
     real exchange stays exactly as it happened: retranslating what a person
     typed, or an answer the model already gave, would be rewriting history to
     match a button. */
  var idiomaAnterior = root.getAttribute('data-lang');
  new MutationObserver(function () {
    var ahora = root.getAttribute('data-lang');
    if (ahora === idiomaAnterior) return;
    idiomaAnterior = ahora;
    if (abierta && !charla.length) pintarTodo();
  }).observe(root, { attributes: true, attributeFilter: ['data-lang'] });
})();

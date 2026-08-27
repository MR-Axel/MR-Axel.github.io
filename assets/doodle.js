/* The switch for the doodle skin. LOCAL ONLY, never linked from index.html
   on the deployed site.

   It exists so the skin can be judged against the real page instead of
   against a mockup: same content, same scroll, same theme, one attribute
   apart. A screenshot of a redesign always flatters it, because a screenshot
   has no scrolling, no hover and no second language.

   Load it by hand while testing:
     <link rel="stylesheet" href="assets/doodle.css">
     <script src="assets/doodle.js" defer></script> */

(function () {
  'use strict';

  var root = document.documentElement;

  function recordar(clave, valor) {
    try { localStorage.setItem(clave, valor); } catch (e) { /* private mode */ }
  }

  function leer(clave) {
    try { return localStorage.getItem(clave); } catch (e) { return null; }
  }

  if (leer('doodle') === 'si') root.setAttribute('data-skin', 'doodle');
  if (leer('doodle-tipo') === 'hand') root.setAttribute('data-doodle-type', 'hand');

  /* Caveat is only fetched if the handwriting mode is actually turned on. A
     display face pulled down on every load to sit unused is a request nobody
     asked for. */
  var caveat = null;
  function tipografia(encendida) {
    if (!encendida) {
      root.removeAttribute('data-doodle-type');
      return;
    }
    if (!caveat) {
      caveat = document.createElement('link');
      caveat.rel = 'stylesheet';
      caveat.href = 'https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&display=swap';
      document.head.appendChild(caveat);
    }
    root.setAttribute('data-doodle-type', 'hand');
  }

  function casilla(texto, encendida, alCambiar) {
    var label = document.createElement('label');
    var caja = document.createElement('input');
    caja.type = 'checkbox';
    caja.checked = encendida;
    caja.addEventListener('change', function () { alCambiar(caja.checked); });
    label.appendChild(caja);
    label.appendChild(document.createTextNode(texto));
    return label;
  }

  var panel = document.createElement('div');
  panel.className = 'doodle-panel';

  var titulo = document.createElement('strong');
  titulo.textContent = 'prueba local';
  panel.appendChild(titulo);

  panel.appendChild(casilla('skin doodle', root.getAttribute('data-skin') === 'doodle',
    function (si) {
      if (si) root.setAttribute('data-skin', 'doodle');
      else root.removeAttribute('data-skin');
      recordar('doodle', si ? 'si' : 'no');
    }));

  panel.appendChild(casilla('letra a mano', root.getAttribute('data-doodle-type') === 'hand',
    function (si) {
      tipografia(si);
      recordar('doodle-tipo', si ? 'hand' : 'no');
    }));

  if (root.getAttribute('data-doodle-type') === 'hand') tipografia(true);

  document.addEventListener('DOMContentLoaded', function () {
    document.body.appendChild(panel);
  });
})();

/* The interaction layer: pointer spotlight, tilt, magnetic buttons, per-word
   headline reveals and counting stats.

   Three rules hold the whole file together:

   1. Nothing here is required for the page to work. Every effect is added on
      top of a page that already reads and already animates without it.
   2. It never runs for a coarse pointer or under prefers-reduced-motion. A
      tilt that fires on a phone is a tap that feels broken, and a magnetic
      button on a touch screen is a button that misses.
   3. Everything pointer-driven writes to a custom property inside one rAF and
      lets CSS do the painting, so moving the mouse never triggers layout. */

(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var rich = fine && !reduced;

  document.documentElement.classList.add(rich ? 'rich' : 'plain');

  /* ---------------- pointer spotlight + tilt ---------------- */

  /* One listener per card rather than one on the document: the handler then
     needs no hit testing, and a card that scrolls away stops costing anything. */
  function bindCard(el, maxTilt) {
    var frame = null;
    var rect = null;

    function measure() { rect = el.getBoundingClientRect(); }

    function onMove(e) {
      if (!rect) measure();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      if (frame) return;
      frame = window.requestAnimationFrame(function () {
        frame = null;
        var px = x / rect.width;
        var py = y / rect.height;
        el.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
        el.style.setProperty('--my', (py * 100).toFixed(1) + '%');
        if (maxTilt) {
          el.style.setProperty('--rx', ((0.5 - py) * maxTilt).toFixed(2) + 'deg');
          el.style.setProperty('--ry', ((px - 0.5) * maxTilt).toFixed(2) + 'deg');
        }
      });
    }

    function onEnter() { measure(); el.classList.add('is-lit'); }
    function onLeave() {
      el.classList.remove('is-lit');
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
    }

    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
  }

  if (rich) {
    [].forEach.call(document.querySelectorAll('.card'), function (el) { bindCard(el, 5); });
    [].forEach.call(document.querySelectorAll('.skill-card'), function (el) { bindCard(el, 4); });
    [].forEach.call(document.querySelectorAll('.offer'), function (el) { bindCard(el, 4); });
    [].forEach.call(document.querySelectorAll('.sideitem, .craft__item, .arc__step'), function (el) {
      bindCard(el, 0);
    });
  }

  /* ---------------- magnetic buttons ---------------- */

  /* The pull is capped well under the button's own padding, so the label can
     never wander outside its own box and the click target stays where the eye
     put it. */
  if (rich) {
    [].forEach.call(document.querySelectorAll('.btn, .sw'), function (el) {
      var frame = null;
      var rect = null;
      var pull = el.classList.contains('sw') ? 3 : 6;

      el.addEventListener('pointerenter', function () { rect = el.getBoundingClientRect(); });
      el.addEventListener('pointermove', function (e) {
        if (!rect) rect = el.getBoundingClientRect();
        var dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
        var dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
        if (frame) return;
        frame = window.requestAnimationFrame(function () {
          frame = null;
          el.style.setProperty('--pull-x', (dx * pull).toFixed(1) + 'px');
          el.style.setProperty('--pull-y', (dy * pull).toFixed(1) + 'px');
        });
      });
      el.addEventListener('pointerleave', function () {
        el.style.setProperty('--pull-x', '0px');
        el.style.setProperty('--pull-y', '0px');
      });
    });
  }

  /* ---------------- headlines, word by word ---------------- */

  /* Splitting rewrites the element, so it runs before anything reads the text
     and re-runs after a language swap. <br> survives as a real break; every
     other tag is left alone by only ever splitting bare text nodes. */
  function splitWords(el) {
    if (el.dataset.split === '1') return;
    var out = document.createDocumentFragment();
    var index = 0;

    function walk(node, target) {
      [].slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          child.nodeValue.split(/(\s+)/).forEach(function (piece) {
            if (!piece) return;
            if (!piece.trim()) { target.appendChild(document.createTextNode(piece)); return; }
            var span = document.createElement('span');
            span.className = 'w';
            span.style.setProperty('--wi', index++);
            span.textContent = piece;
            target.appendChild(span);
          });
        } else if (child.nodeType === 1) {
          var clone = child.cloneNode(false);
          target.appendChild(clone);
          if (child.childNodes.length) walk(child, clone);
        }
      });
    }

    walk(el, out);
    el.textContent = '';
    el.appendChild(out);
    el.dataset.split = '1';
  }

  /* The marker is the whole handshake with app.js: it drops data-split from
     every element whose innerHTML it rewrites, so those get split again here
     and the ones it left alone are skipped. Clearing the flag unconditionally
     would split the spans that are already there, one nesting deeper each
     time the language is toggled. */
  function splitAll() {
    if (reduced) return;
    [].forEach.call(document.querySelectorAll('.hero h1, .section__head h2, .contact h2'), splitWords);
  }

  splitAll();
  /* the language toggle replaces innerHTML, which throws the spans away */
  var langBtn = document.getElementById('lang-toggle');
  if (langBtn) langBtn.addEventListener('click', function () { window.setTimeout(splitAll, 0); });

  /* ---------------- stats counting up ---------------- */

  /* Counts the digits only. "10+" keeps its plus and "4,845" keeps the comma,
     because the separator is re-derived from the locale on every frame rather
     than sliced off the string and pasted back on. */
  function countUp(el) {
    /* el destino vive en el atributo si alguien ya lo dejo ahi: es lo que
       permite que `github.json` actualice la meta sin pelear con el texto */
    var raw = (el.getAttribute('data-meta') || el.textContent).trim();
    var match = raw.match(/^([\d.,]+)(\D*)$/);
    if (!match) return;
    var digits = match[1].replace(/[.,]/g, '');
    var target = parseInt(digits, 10);
    if (!isFinite(target) || target === 0) return;

    var suffix = match[2] || '';
    var grouped = /[.,]/.test(match[1]);
    var locale = document.documentElement.getAttribute('data-lang') === 'es' ? 'es-AR' : 'en-US';
    var nf = new Intl.NumberFormat(locale);
    var start = null;
    var dur = 900;

    function render(value) {
      el.textContent = (grouped ? nf.format(value) : String(value)) + suffix;
    }

    function step(now) {
      if (start === null) start = now;
      var t = Math.min(1, (now - start) / dur);
      /* ease-out cubic: fast first, so the number is legible almost at once */
      var eased = 1 - Math.pow(1 - t, 3);
      render(Math.round(target * eased));
      if (t < 1) window.requestAnimationFrame(step);
    }

    render(0);
    window.requestAnimationFrame(step);
  }

  if (!reduced && 'IntersectionObserver' in window) {
    var statsEl = document.querySelector('.stats');
    if (statsEl) {
      /* Los ceros los puso el guion en linea del html, antes del pintado.
         Aca solo se decide cuando empieza la cuenta. */
      function contarStats() {
        [].forEach.call(statsEl.querySelectorAll('dd'), function (el) {
          countUp(el);
          el.removeAttribute('data-meta');
        });
      }

      var counted = false;
      /* red de seguridad: si el observador nunca dispara, nadie se queda
         mirando una fila de ceros */
      var red = window.setTimeout(function () {
        if (!counted) { counted = true; contarStats(); }
      }, 2500);

      var sio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting || counted) return;
          counted = true;
          window.clearTimeout(red);
          sio.disconnect();
          /* un respiro para que la cifra de github.json ya haya llegado y la
             cuenta termine en el numero real y no en el del html */
          window.setTimeout(contarStats, 220);
        });
      }, { threshold: 0.3 });
      sio.observe(statsEl);
    }
  }
})();

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
    arcSteps.forEach(function (el) { el.classList.remove('is-on', 'is-current'); });
  }

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
          el.classList.remove('is-in');
          /* above the fold means read; below still means not yet */
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

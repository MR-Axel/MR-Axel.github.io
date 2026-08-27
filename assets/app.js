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

  var themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var to = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', to);
      store('site-theme', to);
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', to === 'light' ? '#fbfaf7' : '#08090b');
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

  function paintContributions() {
    if (contributions === null) return;
    if (!nf) nf = new Intl.NumberFormat(lang === 'es' ? 'es-AR' : 'en-US');
    var total = nf.format(contributions);
    var tpl = (lang === 'es' ? DICT : META_EN)._contributions || '{n} contributions in the last year';
    setText('[data-stat="contributions"]', total);
    setText('[data-stat="contributions-line"]', tpl.replace('{n}', total));
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

  /* The "live right now" figure is counted from the cards instead of being
     typed into the markup. It drifted once already: the number said six while
     eight cards carried a Live pill, and the number is the first thing a
     reader checks against what they can see. */
  (function countLive() {
    var slot = document.querySelector('[data-stat="live"]');
    if (!slot) return;
    slot.textContent = String(document.querySelectorAll('.pill--live').length);
  })();

  function paintHeatmap(contrib) {
    var grid = document.getElementById('heatmap');
    if (!grid || !contrib.days || !contrib.days.length) return;

    var t = thresholds(contrib.days);
    var frag = document.createDocumentFragment();

    /* pad so the first column starts on the right weekday */
    var firstDow = new Date(contrib.days[0].d + 'T00:00:00Z').getUTCDay();
    for (var p = 0; p < firstDow; p++) {
      var pad = document.createElement('i');
      pad.style.visibility = 'hidden';
      frag.appendChild(pad);
    }

    contrib.days.forEach(function (day) {
      var cell = document.createElement('i');
      cell.className = 'lv' + level(day.c, t);
      cell.title = day.c + (day.c === 1 ? ' contribution' : ' contributions') + ' on ' + day.d;
      frag.appendChild(cell);
    });

    grid.textContent = '';
    grid.appendChild(frag);
  }
})();

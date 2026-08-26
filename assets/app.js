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
  var I18N_SEL = 'h1, h2, h3, h4, p, li, dt, dd, .pill, .skip, .btn, .nav__links a, [data-t]';

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

      if (to === 'es') {
        var key = norm(el.innerHTML);
        if (DICT[key]) {
          el.setAttribute('data-en', el.innerHTML);
          el.innerHTML = DICT[key];
          matched.push(el);
        }
      } else if (el.hasAttribute('data-en')) {
        el.innerHTML = el.getAttribute('data-en');
        el.removeAttribute('data-en');
        matched.push(el);
      }
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

    /* capped at a fraction of the page so the oversized layer never shows an
       edge, however long the page gets */
    if (bgLayer) bgLayer.style.setProperty('--bg-y', Math.round(progress * -180) + 'px');

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

  function onScroll() {
    if (pending) return;
    pending = true;
    window.requestAnimationFrame(frame);
  }

  frame();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

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

    /* the mascots fade with their section rather than with the cards */
    if (mascots.length) {
      var mio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          entry.target.classList.toggle('is-in', entry.isIntersecting);
        });
      }, { rootMargin: '-8% 0px -8% 0px' });
      mascots.forEach(function (el) { mio.observe(el); });
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

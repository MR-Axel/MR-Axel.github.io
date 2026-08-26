/* Scroll behaviour (progress bar, nav state, hero parallax, staggered reveals)
   and the contribution heatmap, painted from data/github.json which a GitHub
   Action refreshes daily. Everything degrades quietly if the file is missing:
   the page still reads fine without it. */

(function () {
  'use strict';

  var nf = new Intl.NumberFormat('en-US');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- one scroll handler for the whole page, on a rAF ---
     nav border, reading progress and the hero glow all read the same
     scrollY, so they can never disagree about where the page is. */
  var nav = document.querySelector('.nav');
  var bar = document.getElementById('progress-bar');
  var glow = document.querySelector('.glow');
  var pending = false;

  function frame() {
    pending = false;
    var y = window.pageYOffset || document.documentElement.scrollTop || 0;

    if (nav) nav.classList.toggle('is-stuck', y > 8);

    if (bar) {
      var doc = document.documentElement;
      var max = Math.max(1, doc.scrollHeight - window.innerHeight);
      bar.style.width = Math.min(100, (y / max) * 100).toFixed(2) + '%';
    }

    /* the glow drifts at a quarter speed and gives out before the next
       section arrives, so it never bleeds into Work */
    if (glow && !reduced) {
      glow.style.setProperty('--sy', Math.round(y * 0.25) + 'px');
      glow.style.opacity = Math.max(0, 1 - y / 900).toFixed(3);
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

  /* --- reveal on scroll --- */
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

  /* `.js .reveal` outranks each component's own transition, so once the
     entrance is done the classes come off and hover goes back to normal */
  function settle(el) {
    var delay = parseInt(el.style.getPropertyValue('--d'), 10) || 0;
    window.setTimeout(function () {
      el.classList.remove('reveal', 'is-in');
      el.style.removeProperty('--d');
    }, delay + 900);
  }

  function showAll() {
    items.forEach(function (el) {
      el.classList.remove('reveal', 'is-in');
      el.style.removeProperty('--d');
    });
  }

  if (reduced || !('IntersectionObserver' in window)) {
    showAll();
  } else {
    var fired = false;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        fired = true;
        entry.target.classList.add('is-in');
        settle(entry.target);
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });

    /* if the observer never fires (headless render, odd embed), show everything.
       `fired`, not a DOM check: settled elements have already lost the class */
    window.setTimeout(function () {
      if (fired) return;
      io.disconnect();
      showAll();
    }, 1500);
  }

  /* --- data --- */
  fetch('data/github.json', { cache: 'no-cache' })
    .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
    .then(render)
    .catch(function () { /* static copy stays as written */ });

  function render(data) {
    if (!data.contributions) return;
    paintHeatmap(data.contributions);
    var total = nf.format(data.contributions.total);
    setText('[data-stat="contributions"]', total);
    setText('[data-stat="contributions-line"]', total + ' contributions in the last year');
  }

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

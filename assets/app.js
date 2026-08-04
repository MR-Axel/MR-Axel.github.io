/* Renders the contribution heatmap and public repo list from data/github.json,
   which a GitHub Action refreshes daily. Everything degrades quietly if the
   file is missing: the page still reads fine without it. */

(function () {
  'use strict';

  var nf = new Intl.NumberFormat('en-US');

  /* --- sticky nav border --- */
  var nav = document.querySelector('.nav');
  if (nav) {
    var onScroll = function () { nav.classList.toggle('is-stuck', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* --- reveal on scroll --- */
  var items = document.querySelectorAll('.reveal');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        setTimeout(function () { el.classList.add('is-in'); }, Math.min(i * 55, 220));
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });

    /* if the observer never fires (headless render, odd embed), show everything */
    setTimeout(function () {
      if (document.querySelectorAll('.reveal.is-in').length) return;
      io.disconnect();
      items.forEach(function (el) { el.classList.add('is-in'); });
    }, 1500);
  }

  /* --- data --- */
  fetch('data/github.json', { cache: 'no-cache' })
    .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
    .then(render)
    .catch(function () { /* static copy stays as written */ });

  function render(data) {
    if (data.contributions) {
      paintHeatmap(data.contributions);
      var total = nf.format(data.contributions.total);
      setText('[data-stat="contributions"]', total);
      setText('[data-stat="contributions-line"]', total + ' contributions in the last year');
    }
    if (data.repos) paintRepos(data.repos);
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

  function paintRepos(repos) {
    var list = document.getElementById('repos');
    if (!list) return;

    /* 'MR-Axel' is the profile README repo, not a project */
    var visible = repos
      .filter(function (r) { return !r.archived && r.name !== 'MR-Axel'; })
      .sort(function (a, b) {
        if (a.updated !== b.updated) return a.updated < b.updated ? 1 : -1;
        return b.stars - a.stars;
      })
      .slice(0, 8);

    if (!visible.length) return;

    list.textContent = '';
    visible.forEach(function (repo) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = repo.url;
      a.target = '_blank';
      a.rel = 'noopener';

      var name = document.createElement('span');
      name.className = 'repo__name';
      name.textContent = repo.name;

      var desc = document.createElement('span');
      desc.className = 'repo__desc';
      desc.textContent = repo.description || '';

      var meta = document.createElement('span');
      meta.className = 'repo__meta';
      var bits = [];
      if (repo.language) bits.push(repo.language);
      if (repo.stars) bits.push('★ ' + repo.stars);
      bits.push(repo.updated.slice(0, 7));
      meta.textContent = bits.join(' · ');

      a.append(name, desc, meta);
      li.appendChild(a);
      list.appendChild(li);
    });
  }
})();

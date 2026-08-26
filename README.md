# mr-axel.github.io

Personal site for Axel Rosso, served by GitHub Pages from `main` at the repo root.
Static HTML, one stylesheet, one script. No build step, no framework.

```
index.html                       page content
assets/style.css                 design system, dark only
assets/app.js                    theme, language, scroll system, heatmap
assets/i18n.js                   the Spanish half of the page, keyed by English
assets/mascots/                  hornero (dametrabajo) and carpincho (Nuchus)
data/github.json                 refreshed daily by Actions, committed to the repo
scripts/fetch_github.py          the fetcher
.github/workflows/refresh-data.yml
```

## Local preview

```bash
python -m http.server 8000
```

Then open http://localhost:8000. Opening `index.html` straight from the filesystem
works too, except the `fetch` of `data/github.json` is blocked by CORS, so the
heatmap stays empty.

## Refreshing the data by hand

```bash
GH_TOKEN=$(gh auth token) python scripts/fetch_github.py
```

## The one piece of setup

The contribution total is only interesting because it counts private work. For the
scheduled job to see it, add a repo secret named `PROFILE_TOKEN`: a fine grained or
classic personal access token with the `read:user` scope. Without the secret the
workflow falls back to the default Actions token and reports public activity only.

Related: turn on **Settings → Public profile → Contributions → Include private
contributions on my profile** so the graph on github.com/MR-Axel matches this one.

## Cache busting

GitHub Pages caches assets for ten minutes, which is enough to make a fresh deploy
look broken while you are iterating. `index.html` loads the CSS and JS with a `?v=N`
query, so bump that number in both `<link>` and `<script>` whenever you change
`assets/`. The HTML itself is never cached that way.

## Editing content

Project cards, the "Also built" list, craft items, skills and copy are plain HTML
in `index.html`. The only generated part is the heatmap.

## Themes

Every colour is a token on `:root` (dark) with an override inside
`[data-theme="light"]`. Nothing hardcodes a hex outside that block. The accent
splits in two on purpose: `--accent` is the fill and stays lime in both themes
because it is the brand, `--accent-ink` is the same idea as text and gets darker
in light mode, because lime text on white cannot be read.

An inline script in `<head>` sets `data-theme` and `data-lang` before the body
parses, so the page never flashes the wrong theme. Both fall back to what the
browser already knows: `prefers-color-scheme` and `navigator.language`.

## Spanish

`assets/i18n.js` is keyed by the English source: the element's `innerHTML` with
whitespace collapsed. Nothing in `index.html` needs an id or a data attribute,
and a string that reads the same in both languages (product names, stack chips)
is simply absent from the dictionary and left alone.

When you edit English copy, edit the matching key too, or that element silently
stops translating. To find those, switch to Spanish in the browser and run:

```js
const norm = h => h.replace(/\s+/g, ' ').trim();
const used = new Set([...document.querySelectorAll('[data-en]')].map(e => norm(e.getAttribute('data-en'))));
Object.keys(window.ES).filter(k => k[0] !== '_' && !used.has(norm(k)));
```

An empty array means every key found its element.

## The background

Five fixed layers, each drifting at its own rate and some of them the other
way: `.bg__wash` (the colour gradients), `.bg__grid` (a 64px rule grid, masked
so it fades before it reaches an edge) and three `.bg__orb` bodies. `app.js`
writes one custom property per layer on `.bg`, and the children inherit them.

Every drift is a fraction of `progress` (0 to 1) rather than raw scrollY, so
the movement is bounded by construction: a layer can never travel far enough to
show an edge, however long the page gets.

The orbs also carry a slow ambient `translate` animation. It is on `translate`
and not `transform` on purpose, because `transform` is what JS is writing.

## Iconography

The SVG set is inline and hand-written, 24x24 on a 1.6 stroke with round caps,
so the whole page draws from one hand. The generator that emitted it lives in
the scratchpad, not the repo: the icons are content now, edit them in place.

The hero orbit places each chip with three rotations, not one:
`rotate(--a)` to put it on the clock face, `translateY(-r)` to push it to the
radius, then `rotate(calc(--a * -1))` to stand the glyph back up. The inner span
counter-spins at the track's own duration for the same reason. Drop either and
the icons tumble.

## Motion

The reveal is three states, not two: below and unseen, on stage, and `is-past`
above the top. The observer is never disconnected, so scrolling back up replays
the entrance. `translate` and `scale` are used instead of `transform`, because
they are separate animatable properties: a card can slide into place and lift on
hover at the same time without the two fighting over one property.

Everything stops under `prefers-reduced-motion`.

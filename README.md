# mr-axel.github.io

Personal site for Axel Rosso, served by GitHub Pages from `main` at the repo root.
Static HTML, one stylesheet, one script. No build step, no framework.

```
index.html                       page content
assets/style.css                 design system, dark only
assets/app.js                    scroll system (progress, parallax, staggered reveals) + heatmap
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

The reveal animation lives on the `reveal` class. `app.js` staggers each element by
its position inside its own group, then strips both classes once the entrance is
over — `.js .reveal` outranks every component's own transition, so anything left
with the class would lose its hover timing.

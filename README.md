# mr-axel.github.io

Personal site for Axel Rosso, served by GitHub Pages from `main` at the repo root.
Static HTML, one stylesheet, one script. No build step, no framework.

```
index.html                       page content
assets/style.css                 design system, dark only
assets/app.js                    heatmap + repo list rendering, scroll reveals
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
heatmap and repo list stay empty.

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

## Editing content

Project cards, craft items and copy are plain HTML in `index.html`. The only
generated parts are the heatmap and the public repo list.

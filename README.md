# devlog

A clean, minimal developer journal to log what you build, fix, learn and figure out. Host it free on Netlify or GitHub Pages.

## Features

- six entry types: built, learned, fixed, figured out, keep, wins
- Filter by tag, live search
- Grouped by month with timeline view
- Color coded dots and cards per entry type
- Light and dark mode (remembers your preference)
- IBM Plex Mono + IBM Plex Sans typography
- Subtle grid background
- Fully static — no backend, no build step

## Deploy in 2 minutes

**— GITHUBPAGES (recommended)**

1. Fork this repo
2. Go to repo Settings → Pages → set source to main branch
3. Live at `yourusername.github.io/devlog`

## Add entries

Open `data/entries.json` and add a new object at the top of the array:

```json
{
  "date": "2026-03-18",
  "tag": "built",
  "title": "Your entry title",
  "desc": "A short description of what happened.",
  "stack": ["Node.js", "Express"]
}
```

Tags: `built` · `learned` · `fixed` · `figured out`· `keep` · `wins`

Or use the [devlg](https://github.com/HassanAmirii/devlog-cli) CLI tool to add entries from your terminal anywhere on your machine:

```bash
npm install -g @hassan2bit/devlg
devlg init
devlg
```

## File structure

```
devlog/
├── index.html
├── style.css
├── app.js
└── data/
    └── entries.json   ← only file you ever need to edit
```

## Embed on your portfolio

Drop it as an iframe anywhere:

```html
<iframe
  src="https://your-devlog.netlify.app"
  width="100%"
  height="500"
  frameborder="0"
  style="border-radius: 12px;"
></iframe>
```

## License

MIT — fork it, change it, make it yours.

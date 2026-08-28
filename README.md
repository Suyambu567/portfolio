# Suyambu — Portfolio

A personal engineering portfolio: a hiring-oriented single page plus one long-form
technical case study.

Built as a **zero-dependency static site** — no framework, no build step, no package
manager, and no external network requests at runtime. Two HTML files, one stylesheet,
one small script. It renders correctly with JavaScript disabled.

---

## What it contains

| Section | Content |
|---|---|
| Hero | Name, title, positioning, and four calls to action |
| About | Why these three projects form one line of work |
| Technical skills | Restricted to technologies the three featured projects actually use |
| Featured projects | `01` Citizen Complaint Voice Assistant (hero) · `02` Tamil BPE Tokenizer · `03` Fake User Detection |
| Experience · Education · Certifications | Placeholders where nothing could be verified |
| GitHub · LinkedIn · Contact · Footer | Direct routes to code and to a reply |

The voice assistant additionally has a full case study at
`case-study-voice-assistant.html`, structured `01 Problem` → `08 Links`.

### Evidence rule

Every metric on this site was measured in the project it describes and is presented
next to the baseline or caveat that makes it meaningful. Nothing was estimated,
rounded up, or invented. Where information was not verifiable it appears as a
`[ADD ...]` placeholder rather than as plausible-sounding filler.

---

## Tech stack

- **HTML5** — semantic sectioning, one `<h1>` per page, descriptive headings
- **CSS** — custom properties for theming, `grid` and `flexbox`, no preprocessor
- **JavaScript** — one file, ~50 lines, for the light/dark toggle only
- **SVG** — architecture diagrams inline in the HTML, theme-aware via CSS variables

No fonts, scripts, styles, analytics or images are loaded from third parties.

---

## Project structure

```
Portfolio/
├── index.html                        # the portfolio itself
├── case-study-voice-assistant.html   # long-form case study, 01 → 08
├── css/
│   └── styles.css                    # design tokens, layout, light + dark
├── js/
│   └── theme.js                      # theme toggle (progressive enhancement)
├── assets/
│   └── favicon.svg
├── .nojekyll                         # stop GitHub Pages running Jekyll
└── README.md
```

Content lives directly in the HTML rather than in a JavaScript data file. That keeps
the page readable with JavaScript disabled, keeps it crawlable for search engines and
link previews, and — for a two-page site — is less machinery to maintain, not more.

---

## Run locally

There is nothing to install and nothing to build. Open `index.html` in a browser, or
serve the folder if you prefer a real origin:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
# then open http://127.0.0.1:8000
```

## Build

None. The files in this repository are the files that get served.

## Deploy

Any static host works — GitHub Pages, Netlify, Cloudflare Pages, S3.

**GitHub Pages:** push this directory as the root of its own repository, then
*Settings → Pages → Source → Deploy from a branch → `main` / `(root)`*.
`.nojekyll` is already present so nothing is silently skipped.

> **Note.** GitHub serves **one** Pages site per repository. Publishing this portfolio
> from a repository that already deploys another site to Pages will replace that site.
> Give the portfolio its own repository.

---

## Where to update personal links

Every unverified value is written as an uppercase token in square brackets. Find them
all with:

```bash
grep -rn '\[ADD ' index.html case-study-voice-assistant.html
```

| Placeholder | Appears in | What to put there |
|---|---|---|
| `[ADD EMAIL]` | `index.html` (contact, footer) | Contact email address |
| `[ADD LINKEDIN URL]` | `index.html` (hero button, LinkedIn section, contact, footer), case study footer | Full LinkedIn profile URL |
| `[ADD RESUME URL]` | `index.html` (contact) | Link to a hosted PDF résumé |
| `[ADD TAMIL TOKENIZER GITHUB URL]` | `index.html` (project 02, GitHub table) | Repository URL once the tokenizer is pushed |
| `[ADD PUBLIC DEMO OR WRITE-UP URL]` | `index.html` (project 01) | Anything public that evidences the voice assistant |
| `[ADD LIVE DEMO URL]` | `index.html` (project 03) | Deployed URL of the browser classifier |
| `[ADD DEMO URL IF AVAILABLE]`, `[ADD PUBLIC WRITE-UP URL IF AVAILABLE]` | case study (08) | Same, on the case study page |
| `[ADD YOUR SPECIFIC ROLE ...]` | all three projects, case study (04) | Team size and the components personally owned |
| `[ADD ROLE]`, `[ADD COMPANY]`, `[ADD DATES]`, `[ADD RESPONSIBILITIES ...]` | `index.html` (experience) | Employment history — or delete the section |
| `[ADD YEARS]`, `[ADD CGPA IF YOU WANT IT SHOWN]` | `index.html` (education) | Degree dates and grade |
| `[ADD VERIFIED CERTIFICATIONS ...]` | `index.html` (certifications) | Name, issuer, year, credential URL |

Placeholders render in a dashed amber chip, so an unfilled one is impossible to miss
on the page. **Do not deploy with placeholders still visible** — fill them, or delete
the element that contains them.

### Verified links already in place

| Link | Status |
|---|---|
| `https://github.com/Suyambu567` | Live — taken from this workspace's git remote. Confirm it is the profile you want shown. |
| `https://github.com/Suyambu567/FAKE_USER_DEC` | Live and public |

### Certifications — candidates awaiting verification

Not placed on the page because none could be verified: JPMorgan Chase Quantitative
Research virtual experience, Infosys Springboard, Coursera, Great Learning. Add each
only with its issuer, year and credential URL.

---

## Where project data is stored

Project copy, metrics and diagrams are written inline in the two HTML files:

| Project | Location |
|---|---|
| `01` Citizen Complaint Voice Assistant | `index.html` → `<article id="voice-assistant">`, plus all of `case-study-voice-assistant.html` |
| `02` Tamil BPE Tokenizer | `index.html` → `<article id="tamil-tokenizer">` |
| `03` Fake User Detection | `index.html` → `<article id="fake-user-detection">` |

Diagrams are inline `<svg>` inside those articles. They take their colours from the
CSS custom properties in `css/styles.css` (`.d-box`, `.d-line`, `.d-label`, `.d-sub`),
so they follow the light/dark theme without duplicated markup.

### Confidentiality

The voice assistant was built in a private repository. This site deliberately contains
**no** source code, file paths, internal URLs, server addresses, ports, credentials or
citizen data from it — only architecture, engineering decisions and evaluation results.
Keep it that way when editing.

---

## Accessibility and SEO

- Skip link, semantic landmarks, one `<h1>` per page, headings in order
- Every diagram carries `<title>` and `<desc>` and is exposed as `role="img"`
- Visible focus rings; the theme toggle is a real `<button>` with an `aria-label`
- Colour pairs meet WCAG AA contrast in both themes
- Wide tables and diagrams scroll inside their own container — the page body never
  scrolls horizontally
- `prefers-reduced-motion` is respected
- Page title, meta description, Open Graph and Twitter card tags on both pages

## Licence

All rights reserved unless stated otherwise.

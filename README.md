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
| Hero | Name, title, positioning, and four calls to action (Projects · GitHub · Contact · Résumé) |
| About | Why these three projects form one line of work |
| Technical skills | Restricted to technologies the three featured projects actually use |
| Featured projects | `01` Citizen Complaint Voice Assistant (hero) · `02` Tamil BPE Tokenizer · `03` Fake User Detection |
| Education | The one credential that could be stated without guessing |
| GitHub · Contact · Footer | Direct routes to the code and to a reply |

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
├── Suyambulingaraj_Resume_ATS.pdf     # résumé, linked from the hero and Contact
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

**No placeholders remain.** Email, LinkedIn and the résumé were all supplied and are
live links — see *Verified links* below. The command above should print nothing.

If a placeholder is ever reintroduced it renders as a quiet monospace chip (`.ph` in
`css/styles.css`) — subtle enough that the page reads as finished, distinct enough that
one cannot be shipped unnoticed. **Do not deploy with placeholders visible**: fill them,
or delete the element that contains them.

## Before you publish

1. **Confirm the contribution framing.** Each project's *My contribution* section lists
   what the implementation contains, verified against the source. If any of these were
   team projects, edit those bullets to describe your part specifically — the page makes
   no claim about team size either way.
2. **Fix `github.com/yourusername` inside the résumé PDF** — the template placeholder
   was never replaced, and the PDF is now linked publicly from two places on the page.
   See *Résumé* below for the other things worth checking in it.
3. **Confirm `https://github.com/Suyambu567`** is the profile you want linked. It was
   taken from this workspace's git remote, not guessed.
4. **Check the speech-recognition figures are still current** before publishing them —
   they describe two specific fine-tuning rounds and carry no date on the page.
5. **Give the portfolio its own repository** — see the Pages note above.

### Sections deliberately absent

Experience, Certifications and a standalone LinkedIn section were removed rather than
shipped as empty placeholder blocks. Nothing about employment history or credentials
could be verified from the project sources, and an unverified credential on a portfolio
is worse than none. If you want them back, they are three `<section>` blocks following
the same pattern as Education.

Certification candidates mentioned but never verified: JPMorgan Chase Quantitative
Research virtual experience, Infosys Springboard, Coursera, Great Learning. Add each
only with its issuer, year and credential URL.

### Verified links already in place

| Link | Status |
|---|---|
| `https://github.com/Suyambu567` | Live — taken from this workspace's git remote. Confirm it is the profile you want shown. |
| `mailto:suyambulingaraj7@gmail.com` | Supplied by the site owner |
| `https://www.linkedin.com/in/suyambulingaraj-s-165590250` | Supplied by the site owner. LinkedIn answers automated checks with HTTP 999, so open it by hand to confirm. |
| `Suyambulingaraj_Resume_ATS.pdf` | In this repository; served as `application/pdf`. Linked from the hero CTA row and the Contact grid. |
| `https://github.com/Suyambu567/FAKE_USER_DEC` | Live and public |
| `https://github.com/Suyambu567/Tamil-BPE-Tokenizer` | Live and public |

---

## Résumé

`Suyambulingaraj_Resume_ATS.pdf` ships in this repository and is linked from the hero
CTA row and the Contact grid. It is a one-page A4 PDF generated by ReportLab.

It was read before being linked. These points were **not** changed — the PDF is the
owner's document — but each one is visible to anyone who opens it from the site:

| Finding | Why it matters |
|---|---|
| The résumé contains the literal string **`github.com/yourusername`** | An unreplaced template placeholder, now published. Fix this before sharing the site. |
| It publishes a **phone number** | Normal on a résumé handed to a recruiter; worth a deliberate decision when the same file sits at a public URL. |
| Degree is **B.Tech, 2024**; `index.html` Education says **B.E.** with no year | Same college, two different degree names. One of them is wrong — reconcile them. |
| Positioning is **"Data Analyst \| Fresher"**, built on Power BI, Tableau and Excel | The site positions as an AI/ML engineer. A recruiter reading both sees two different candidates. |
| The résumé does **not mention the voice assistant or the Tamil BPE tokenizer** | These are the two strongest projects on the site. It lists a "Retail Business Performance Analyst" project that the site does not carry at all. |
| The fake-profile entry claims **"Achieved high accuracy"** | The site deliberately reports that project against its majority-class baseline *instead of* accuracy alone, because accuracy alone is misleading on imbalanced data. The résumé makes the claim the site avoids. |
| PDF metadata reads `Author: anonymous`, `Title: untitled` | Some ATS parsers and every browser tab read these fields. |

The site and the résumé are the two halves of one application. Where they disagree, the
disagreement is what a reader notices.

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
- No dead controls: a link is only rendered as a button when it has somewhere to go
- Colour pairs meet WCAG AA contrast in both themes
- Wide tables and diagrams scroll inside their own container — the page body never
  scrolls horizontally
- `prefers-reduced-motion` is respected
- Page title, meta description, Open Graph and Twitter card tags on both pages

## Licence

All rights reserved unless stated otherwise.

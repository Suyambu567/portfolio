# Suyambu — Portfolio

A personal engineering portfolio: a hiring-oriented single page plus one long-form
technical case study.

Built as a **zero-dependency static site** — no framework, no build step, no package
manager. Two HTML files, one stylesheet (`css/hud.css`), one script (`js/hud.js`). The
only third-party request is Google Fonts. It renders correctly with JavaScript disabled.

**Look:** a dark JARVIS/HUD "AI command console" theme in a cyan + violet palette, with
original SVG robot mascots. Dark only — there is no light theme.

**Positioning is AI/ML Engineer, and only that.** The résumé in this repository is
written for Data Analyst roles; the site is not. Where the two disagree the site keeps
the AI/ML framing, because that is the work the three projects and their repositories
actually evidence. The phrase "Data Analyst" does not appear anywhere on the site.

---

## What it contains

| Section | Content |
|---|---|
| Hero | Status pill, name on one line, typewriter role line, pitch, tech chips, CTAs; side panel with photo matrix (or animated HUD avatar), four tiles, a live "current role" clock and the AI crew strip |
| Recruiter snapshot | Four focus tiles plus Résumé · Copy Email · Request Interview · LinkedIn |
| About | Dossier, stat boxes (`3` projects · `24` categories · `25` departments · `+0.31` lift — each measured in its project), ID card with a talk-bot, progress ladder ML → Tamil NLP → Voice AI, strengths, languages, and the six-bot "AI crew" |
| Experience | Live industry clock (Elevate Labs Jan–Mar 2025 + Dec 2025 → now; the gap is not counted) and a timeline: XMEDIA Solutions (current) · MSL Infotech · Elevate Labs |
| Projects | Filter tabs, three project cards, then "Mission files" — collapsible deep dives holding every diagram, results table and caveat note. `01` opens by default |
| Skills | Seven subsystem panels. The bars show how many items each group holds — a count, never a self-rating |
| Credentials | Education, the three résumé-named certifications ("file pending"), and the GitHub repository list |
| Contact | Email / LinkedIn / location tiles, an "Open to" panel, and a form that composes an email in the visitor's mail app — nothing is sent from the page |
| Extras | Scroll progress bar, scroll rail with a riding bot, scrollspy nav, mobile menu, Ctrl/⌘ + K command palette, certificate viewer |

The voice assistant additionally has a full case study at
`case-study-voice-assistant.html`, structured `01 Problem` → `08 Links`.

### Evidence rule

Every metric on this site was measured in the project it describes and is presented
next to the baseline or caveat that makes it meaningful. Nothing was estimated,
rounded up, or invented. Where information was not verifiable it appears as a
`[ADD ...]` placeholder rather than as plausible-sounding filler.

---

## Tech stack

- **HTML5** — semantic sectioning, one `<h1>` per page, native `<details>` and `<dialog>`
- **CSS** — one file, custom properties for the palette, `grid` and `flexbox`, no preprocessor
- **JavaScript** — one file, all progressive enhancement and null-guarded so it runs on
  both pages: scroll/progress/rail/scrollspy, mobile menu, typewriter, photo autoload,
  live clocks, reveal + counters, bots, copy email, project filters, contact form → mailto,
  command palette, certificate viewer
- **SVG** — architecture diagrams and the robot sprite are inline in the HTML
- **Fonts** — Inter, JetBrains Mono, Noto Sans Tamil and Space Grotesk from Google Fonts

No analytics, trackers or third-party scripts.

---

## Project structure

```
Portfolio/
├── index.html                        # the portfolio itself
├── case-study-voice-assistant.html   # long-form case study, 01 → 08
├── Suyambulingaraj_Resume_ATS.pdf     # résumé, linked from the hero and Contact
├── css/
│   ├── hud.css                       # HUD theme for both pages
│   └── styles.css                    # previous light/dark theme — no longer used
├── js/
│   ├── hud.js                        # all behaviour (progressive enhancement)
│   └── theme.js                      # previous theme script — no longer used
├── tools/
│   └── build_resume.py               # regenerates the résumé PDF + TXT
├── assets/
│   ├── favicon.svg
│   ├── projects/                     # project cover images (.webp)
│   ├── profile/                      # owner photos — see below
│   ├── certificates/                 # certificate files, when supplied
│   └── backgrounds/                  # previous theme's backgrounds — no longer used
├── .nojekyll                         # stop GitHub Pages running Jekyll
└── README.md
```

Content lives directly in the HTML rather than in a JavaScript data file. That keeps
the page readable with JavaScript disabled, keeps it crawlable for search engines and
link previews, and — for a two-page site — is less machinery to maintain, not more.

### Profile photos

Drop up to three photos into `assets/profile/` named `photo-1`, `photo-2`, `photo-3`
(`.webp`, `.jpg`, `.jpeg` or `.png`). `photo-1` is the main one. The page finds them on
its own — no code change. Until a photo exists the hero shows an animated HUD avatar,
and the browser console shows harmless 404s from the lookup.

---

## Run locally

There is nothing to install and nothing to build. Open `index.html` in a browser, or
serve the folder if you prefer a real origin:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
# then open http://127.0.0.1:8000
```

## Build

None for the site. The files in this repository are the files that get served.

The résumé is the one generated artifact. `tools/build_resume.py` is its single
source of truth — edit the Python, not the PDF:

```bash
python3 tools/build_resume.py          # rewrites Suyambulingaraj_Resume_ATS.pdf + .txt
```

Requires `reportlab`. Output is two A4 pages: page 1 carries the summary, skills,
experience and project 01; page 2 carries projects 02–03, education, certifications
and links. The section heading is bound to the first project, so no heading is ever
orphaned at a page foot and no project is split across the break.

**The résumé carries no phone number, and neither does this repository.** The PDF is
served from a public URL, so anything in it is published rather than handed to one
recruiter. For a private copy sent directly to an employer, pass the number at build
time and write it outside the repository:

```bash
python3 tools/build_resume.py ~/resume-private.pdf --phone <number>
```

Never commit that output.

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

**Do not deploy with placeholders visible**: fill them, or delete the element that
contains them.

## Before you publish

1. **Confirm the contribution framing.** Each project's *My contribution* section lists
   what the implementation contains, verified against the source. If any of these were
   team projects, edit those bullets to describe your part specifically — the page makes
   no claim about team size either way.
2. **Review what is still open in the résumé PDF** — see *Résumé* below. The degree,
   year and GitHub URL were corrected; the positioning mismatch, the missing projects
   and the margin overrun were not.
3. **Confirm `https://github.com/Suyambu567`** is the profile you want linked. It was
   taken from this workspace's git remote, not guessed.
4. **Check the speech-recognition figures are still current** before publishing them —
   they describe two specific fine-tuning rounds and carry no date on the page.
5. **Give the portfolio its own repository** — see the Pages note above.

### Experience — present, and sourced

The Experience section is built from the LinkedIn profile supplied by the site owner:
XMEDIA Solutions (AI/ML Engineer, current), MSL Infotech India Pvt. Ltd. (Engineer
Intern) and Elevate Labs (Data Analyst). **Job titles are recorded exactly as held.**
The Elevate Labs entry reads "Data Analyst" because that is the role that was held —
a historical title is a fact, not a positioning statement, and the site's positioning
remains AI/ML Engineer throughout.

**MSL Infotech carries employment metadata only.** No responsibilities were supplied
for it, so none are shown and none were invented. It is not padded with a
"details unavailable" line either — a dated role with no bullets reads as normal,
whereas that sentence advertises the gap.

**The XMEDIA entry is labelled `Role scope as stated on LinkedIn`.** That matters:
the project case studies below it say "verified in the repository", and the two claims
have different strength. RAG pipelines and AI agents appear **only** in that XMEDIA
entry, because the repository audit found no implementation evidence for either. They
are deliberately absent from the Skills section and from all three project
descriptions, and must stay absent until a repository supports them.

**Certifications are present**, sourced from the résumé, which names three: Python
Programming, SQL for Data Analytics, and Power BI / Tableau. They are listed by name
only because the résumé records no issuer, date or credential ID. Fill those from
LinkedIn when it can be read; do not fill them from memory.

Certification candidates mentioned in earlier drafts but never verified, and therefore
never shipped: JPMorgan Chase Quantitative Research virtual experience, Infosys
Springboard, Coursera, Great Learning. Add each only with its issuer, year and
credential URL.

### Location

The primary professional location is **Chennai, Tamil Nadu** — the base of the current
on-site role — shown in the hero and About. **Mahendra Engineering College remains in
Salem**, and the historical role locations are unchanged: a past location is part of
the record.

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
CTA row and the Contact grid. One-page A4, generated by ReportLab, ASCII85 + Flate
content stream.

### Corrections applied to the PDF

The degree and graduation year were confirmed by the site owner as **B.E. Computer
Science and Engineering, 2025**. The PDF disagreed, so its content stream was decoded,
patched and re-encoded in place. Text was edited; nothing was re-laid-out.

| Was | Now |
|---|---|
| `Bachelor of Technology (B.Tech) — Computer Science Engineering` | `Bachelor of Engineering (B.E.) — Computer Science Engineering` |
| `2024` | `2025` |
| `Data Analyst \| B.Tech Graduate \| Fresher` | `Data Analyst \| B.E. Graduate \| Fresher` |
| `A motivated and detail-oriented B.Tech graduate…` | `…detail-oriented B.E. graduate…` |
| `github.com/yourusername` | `github.com/Suyambu567` |

The GitHub URL is right-aligned by absolute text position, so its `Tm` x-coordinate was
recomputed from Helvetica AFM widths to keep the same right edge rather than left the
string hanging short. Verified after patching: 1 page, same 48 lines / 325 words as the
original, no stale `B.Tech` / `2024` / `yourusername` anywhere in the extracted text.

> Re-patching note: ReportLab writes the ASCII85 stream with **no leading `<~`**, only
> the trailing `~>`. Python's `base64.a85encode(adobe=True)` adds `<~`, which PDF's
> `ASCII85Decode` rejects — the page silently extracts as empty. Strip the two leading
> bytes, then rebuild the xref offsets and `startxref`.

### Still open in the résumé — the owner's call

| Finding | Why it matters |
|---|---|
| It publishes a **phone number** | Normal on a résumé handed to a recruiter; a deliberate decision when the same file sits at a public URL. |
| Positioning is **"Data Analyst \| Fresher"** built on Power BI, Tableau and Excel | **Now the largest open gap.** The site has been settled as AI/ML Engineer only; the résumé still reads Data Analyst. A recruiter opening both sees two different candidates, and the résumé is the half that no longer matches. |
| It does **not mention the voice assistant or the Tamil BPE tokenizer** | The two strongest projects on the site. It lists a "Retail Business Performance Analyst" project the site does not carry at all. |
| The fake-profile entry claims **"Achieved high accuracy"** | The site reports that project against its majority-class baseline *instead of* accuracy alone, because accuracy alone misleads on imbalanced data. The résumé makes the claim the site avoids. |
| **AREAS OF INTEREST overruns the right margin** — the line ends mid-word at "Predictive Analyt" | Pre-existing; present in the original PDF, not introduced by the patch above. Needs the line shortened or wrapped. |
| PDF metadata reads `Author: anonymous`, `Title: untitled` | Some ATS parsers and every browser tab read these fields. |

The site and the résumé are the two halves of one application. Where they disagree, the
disagreement is what a reader notices — and after the AI/ML repositioning, the résumé is
the half that is out of step. Rewriting it to lead with the voice assistant and the
tokenizer is the single highest-value change left in this repository.

---

## Where project data is stored

Project copy, metrics and diagrams are written inline in the two HTML files:

| Project | Location |
|---|---|
| `01` Citizen Complaint Voice Assistant | `index.html` → first `<article class="pcard">` and `<details id="voice-assistant">`, plus all of `case-study-voice-assistant.html` |
| `02` Tamil BPE Tokenizer | `index.html` → second `<article class="pcard">` and `<details id="tamil-tokenizer">` |
| `03` Fake User Detection | `index.html` → third `<article class="pcard">` and `<details id="fake-user-detection">` |

Diagrams are inline `<svg>` inside those `<details>` blocks. They keep their original
class names (`.d-box`, `.d-line`, `.d-label`, `.d-sub`, `.t-*`, `.b-*`), and `css/hud.css`
gives them the HUD colours.

### Confidentiality

The voice assistant was built in a private repository. This site deliberately contains
**no** source code, file paths, internal URLs, server addresses, ports, credentials or
citizen data from it — only architecture, engineering decisions and evaluation results.
Keep it that way when editing.

---

## Accessibility and SEO

- Skip link, semantic landmarks, one `<h1>` per page, headings in order
- Every diagram carries `<title>` and `<desc>` and is exposed as `role="img"`
- Visible focus rings; the menu, palette and bot controls are real `<button>`s with labels
- No dead controls: a link is only rendered as a button when it has somewhere to go
- Text colours are chosen for contrast on the dark background
- Wide tables and diagrams scroll inside their own container — the page body never
  scrolls horizontally
- `prefers-reduced-motion` is respected
- Page title, meta description, Open Graph and Twitter card tags on both pages

## Licence

All rights reserved unless stated otherwise.

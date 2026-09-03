# Certificates

Actual certificate files go here — PDF preferred; PNG/JPG/WebP only when the
certificate was issued as an image. No placeholder or fabricated files.

Expected files for the certifications currently on the site:

| Certification            | Expected filename                |
|--------------------------|----------------------------------|
| Python Programming       | `python-programming.pdf`         |
| SQL for Data Analytics   | `sql-for-data-analytics.pdf`     |
| Power BI / Tableau       | `power-bi-tableau.pdf`           |

To activate a certificate card in `index.html`, drop the file here and replace
that card's

```html
<span class="cert-pending">Certificate file pending</span>
```

with

```html
<button class="cert-view" type="button"
        data-cert="assets/certificates/python-programming.pdf">
  View certificate</button>
```

The viewer (`#cert-dialog` in `index.html`, `initCertViewer` in `js/theme.js`)
handles the rest: modal open, ESC / close button / backdrop click, scroll lock,
focus restore, and an "Open in new tab" link.

Before publishing any certificate, check it for private information — phone
numbers, addresses, credential secrets — and redact or withhold if present.

# Zain Nadeem — Engineering Portfolio

A static, editorial portfolio for [Zain Nadeem](https://zainnadeem786.github.io/), presenting software engineering projects, verified security research, and selected open-source contributions.

## Technology

- Semantic HTML5
- Modern CSS with reusable light/dark theme tokens
- Vanilla JavaScript for theme persistence, navigation, reveal behavior, and the current year
- Local SVG favicon and social-preview artwork
- No framework, backend, analytics, or production build dependency

The committed files are served directly by GitHub Pages.

## Repository structure

```text
.
├── index.html                 Homepage
├── research.html              Security research index
├── open-source.html           Verified contribution index
├── projects/                  Project case studies
├── research/                  Detailed CVE technical articles
├── css/style.css              Shared design system and responsive styles
├── js/main.js                 Theme and interaction logic
├── assets/                    Favicon and social-preview assets
├── sitemap.xml                Canonical public URLs
├── robots.txt                 Crawl policy and sitemap reference
└── manifest.webmanifest       Portfolio web-app metadata
```

## Preview locally

From the repository root, run:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000/`. A local server is preferable to opening the HTML files directly because it tests paths in a GitHub Pages-like environment.

## Update content

### Projects

1. Update the project preview in `index.html`.
2. Edit the matching case study in `projects/`.
3. Keep the title, description, canonical URL, Open Graph URL, H1, and structured data consistent.
4. Add any new public page to `sitemap.xml`.

Only publish features, architecture, status, and repository links that can be verified.

### Security research

The research index is `research.html`; full analyses live in `research/`. For a new public advisory:

1. Confirm the CVE/GHSA identifiers, official title, affected project, severity, versions, credit, and advisory URL from the project’s public record.
2. Distinguish reporter, patch author, and maintainer roles.
3. Add a concise index entry and an original technical article only when there is enough verified material for a useful page.
4. Use a self-referencing canonical URL and valid `TechArticle`/breadcrumb JSON-LD.
5. Link the article from the homepage and add it to `sitemap.xml`.

Do not publish private disclosure material, unverified impact, CVSS values not taken from an official record, or exploit instructions that could cause harm.

### Open source

Contribution records live in `open-source.html`. Verify the public author, state, title, and technical purpose directly from the linked GitHub PR or issue before editing. Keep normal authored contributions separate from related upstream remediation by maintainers.

### Contact details

The verified email, LinkedIn, GitHub, phone, and WhatsApp links appear in `index.html`. When replacing any value, update every visible occurrence and relevant metadata together. Avoid adding phone information to structured data unless there is a clear need.

## Deploy with GitHub Pages

1. Push the reviewed static files to the repository’s default branch.
2. In GitHub, open **Settings → Pages**.
3. Select **Deploy from a branch**, then choose the default branch and `/ (root)`.
4. Confirm the canonical production URL remains `https://zainnadeem786.github.io/`.
5. Smoke-test the homepage, research index, one nested research article, one project page, and the theme toggle after deployment.

No server process or package installation is required in production.

## Search Console and sitemap

The Google verification file in the repository root must remain in place.

1. Verify the HTTPS property in [Google Search Console](https://search.google.com/search-console/).
2. Open **Sitemaps** and submit `https://zainnadeem786.github.io/sitemap.xml`.
3. Use **URL Inspection** for substantially updated pages and request indexing where appropriate.
4. Recheck the sitemap after public URLs are added or removed.

Indexing and ranking are controlled by search engines; submission makes discovery easier but does not guarantee placement.

## Custom domain later

Add the domain in **GitHub Pages → Custom domain**, configure the required DNS records with the domain provider, enable HTTPS after GitHub validates the records, and add a root `CNAME` file containing only the domain. Then update canonical URLs, Open Graph URLs, structured-data IDs, `robots.txt`, `sitemap.xml`, and Search Console to use the new origin.

# Zain Nadeem — Engineering Portfolio

A lightweight multi-page portfolio for **Zain Nadeem**, presenting backend engineering, local AI systems, responsible security research, and open-source work as an editorial technical publication.

- Production: [zainnadeem786.github.io](https://zainnadeem786.github.io/)
- GitHub: [@zainnadeem786](https://github.com/zainnadeem786)

## Technology

- Semantic HTML5
- Modern CSS with custom properties, responsive layouts, and reduced-motion support
- Small, dependency-free JavaScript for navigation, active sections, reveals, and the footer year
- Local SVG favicon and social preview
- No Node.js, npm, backend, framework, or production build step

## Structure

```text
.
|-- index.html
|-- research.html
|-- open-source.html
|-- projects/
|   |-- codeguardian-ai.html
|   |-- secops-ai.html
|   |-- ai-brain.html
|   |-- echomind-ai.html
|   `-- ai-interview-platform.html
|-- css/style.css
|-- js/main.js
|-- assets/
|   |-- favicon/favicon.svg
|   `-- images/social-preview.svg
|-- manifest.webmanifest
|-- robots.txt
`-- sitemap.xml
```

## Preview locally

Run a static server from the repository root:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000/`. On Windows, `py -m http.server 8000` is an equivalent command when the Python launcher is installed.

## Maintain the portfolio

Project previews live in `index.html`; the corresponding editorial case studies live in `projects/`. Keep status, stack, and capability claims aligned across both locations. Add a repository or live-demo link only after its URL is public and verified.

Curated public contribution records live in `open-source.html`. Keep pull-request state, attribution, category, and source URLs aligned with the public GitHub record. Security remediation that is not publicly authored by Zain remains connected to `research.html` instead of the authored contribution list.

Public research records appear on the homepage and in `research.html`. Add future entries only after publication, linking directly to an authoritative advisory. Do not infer CVSS scores, titles, credit, or disclosure details that are absent from the official record.

Email and LinkedIn are intentionally omitted until real values are supplied. When available, add them to the contact section. Add verified social profiles to the homepage JSON-LD `sameAs` array as well.

## Deploy with GitHub Pages

1. Use a public repository named `zainnadeem786.github.io` for the root production URL.
2. Commit the static files and push them to the default branch, normally `main`.
3. Open **Settings → Pages** in GitHub.
4. Choose **Deploy from a branch**, then select `main` and `/ (root)`.
5. Confirm the live canonical URLs, project pages, research page, favicon, `robots.txt`, and `sitemap.xml`.

## Search indexing

Add `https://zainnadeem786.github.io/` as a URL-prefix property in [Google Search Console](https://search.google.com/search-console/), complete verification, then submit `sitemap.xml` under **Sitemaps**. Use URL Inspection to request homepage indexing if needed.

## Custom domain later

Add the domain under **Settings → Pages → Custom domain**, follow GitHub's current DNS instructions, and enable HTTPS after DNS resolves. Add a root-level `CNAME` file containing the chosen domain, then update every canonical URL, Open Graph URL, the sitemap, and the Search Console property.

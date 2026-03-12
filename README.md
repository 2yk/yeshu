# yeshu.in — Portfolio Landing Page

Professional dark-mode portfolio / resume landing page for **Yeshu Kochher**, Full Stack Developer.

## 🚀 Deployment Checklist (GitHub Pages + Custom Domain)

### 1. Repository & GitHub Pages Setup
- [ ] Push this branch and merge into `main`
- [ ] Go to **Repository → Settings → Pages**
- [ ] Set **Source** to `GitHub Actions`
- [ ] The workflow `.github/workflows/deploy.yml` will auto-deploy on every push to `main`

### 2. Custom Domain (`yeshu.in`)
- [ ] In **Settings → Pages → Custom domain**, enter `yeshu.in` and save
- [ ] GitHub will create a `CNAME` file at the root of the repo automatically
- [ ] At your DNS provider, add these records:

  | Type  | Host | Value                  |
  |-------|------|------------------------|
  | A     | @    | 185.199.108.153        |
  | A     | @    | 185.199.109.153        |
  | A     | @    | 185.199.110.153        |
  | A     | @    | 185.199.111.153        |
  | CNAME | www  | 2yk.github.io          |

- [ ] Enable **Enforce HTTPS** in Settings → Pages (available once DNS propagates, ~24 h)

### 3. Google Search Console (SEO)
- [ ] Go to [Google Search Console](https://search.google.com/search-console)
- [ ] Add property `https://yeshu.in/`
- [ ] Verify ownership via the **HTML meta tag** method — paste the tag into the `<head>` of `index.html`:
  ```html
  <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
  ```
- [ ] Submit `https://yeshu.in/sitemap.xml` under **Sitemaps**
- [ ] Request indexing for the homepage via **URL Inspection → Request Indexing**

### 4. Google Analytics (optional but recommended)
- [ ] Create a GA4 property at [analytics.google.com](https://analytics.google.com)
- [ ] Copy the `<script>` snippet and add it to `<head>` in `index.html`

### 5. Contact Form — replace mailto fallback
- [ ] The contact form currently uses `mailto:` (works without a backend)
- [ ] For a real form, sign up at [Formspree](https://formspree.io) or [EmailJS](https://www.emailjs.com) and update `assets/js/main.js`

### 6. Social / Open Graph Image
- [ ] Create a `1200×630 px` image and save it as `assets/images/og-cover.png`
- [ ] This improves link previews on Twitter, LinkedIn, etc.

### 7. Performance & Lighthouse
- [ ] Run [PageSpeed Insights](https://pagespeed.web.dev/) on `https://yeshu.in/`
- [ ] Target 90+ score in all categories
- [ ] Compress any added images with [Squoosh](https://squoosh.app/)

---

## Local Development

```bash
# Serve locally with any static file server, e.g.:
npx serve .
# Then open http://localhost:3000
```

## Tech Stack

- Pure HTML5 / CSS3 / Vanilla JS — zero framework dependency
- Hosted on **GitHub Pages** (free, CDN-backed)
- Deployed automatically via **GitHub Actions**

# Domain Migration & Permanent Backup Guide

This document guarantees that your **Digitally Kolkata** web platform is 100% backed up and can be deployed to any new domain (or renewed) in under 2 minutes.

---

## 🔒 1. Where Your Backups Are Stored

Your website is backed up across multiple redundant locations:

1. **Remote Cloud Backup (GitHub Permanent Release Tag):**
   - Repository: `https://github.com/imsneh06/Digitally-Kolkata`
   - Production Release Tag: `v1.0-stable`
   - Every file, image, WebP asset, stylesheet, and commit history is stored on GitHub.

2. **Local Standalone Offline Archive:**
   - File: `Digitally-Kolkata-Production-Backup.zip` (located in your project root: `d:\Git\Portfolio\DK\`)
   - Size: ~25.6 MB self-contained archive containing all production files, ready to be extracted and deployed anywhere without Git.

---

## 🚀 2. How to Deploy to a New Domain (in Jan 2027 or Anytime)

If you renew `digitallykolkata.online` OR purchase a new domain (e.g. `digitallykolkata.com`, `digitallykolkata.in`):

### Scenario A: If Hosted on Vercel (1-Click)
1. Log in to [vercel.com](https://vercel.com).
2. Open your `Digitally-Kolkata` project.
3. Go to **Settings → Domains**.
4. Click **Add** → type your new domain (e.g. `yournewdomain.com`).
5. Copy the DNS records Vercel shows you (usually `A` pointing to `76.76.21.21` and `CNAME` for `www` to `cname.vercel-dns.com`).
6. Paste those records into your new domain registrar's DNS panel. Vercel automatically generates a new SSL certificate for free.

---

## 🔄 3. Updating Domain References in Code (4 Files)

All images, styles, and scripts in this codebase use **relative paths** (`assets/...`, `styles.css`), meaning the website will visually render perfectly on **any domain** without changes.

To update SEO canonical tags, sitemaps, and Schema to match your new domain, find & replace `https://www.digitallykolkata.online` with your new domain in these 4 files:

| File | What to Update |
| :--- | :--- |
| **`index.html`** | Canonical tag, Open Graph URL, and JSON-LD Schema `url` / `sameAs` |
| **`sitemap.xml`** | `<loc>` URLs for your homepage and section anchors |
| **`robots.txt`** | `Sitemap:` and `Host:` directives |
| **`llms.txt`** | AI agent quick links |

### Automated 1-Click Update Script (PowerShell):
Whenever you get your new domain, run this single command in PowerShell inside your project folder:
```powershell
$old = "digitallykolkata.online"
$new = "YOUR_NEW_DOMAIN_HERE"   # e.g. "digitallykolkata.com"

(Get-Content index.html) -replace $old, $new | Set-Content index.html
(Get-Content sitemap.xml) -replace $old, $new | Set-Content sitemap.xml
(Get-Content robots.txt)  -replace $old, $new | Set-Content robots.txt
(Get-Content llms.txt)    -replace $old, $new | Set-Content llms.txt
```
Then commit and push:
```bash
git add .
git commit -m "chore: migrate canonical URLs to new domain"
git push origin main
```
Your new domain will instantly be live, fully indexed, and protected.

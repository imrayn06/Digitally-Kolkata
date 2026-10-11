# Custom Domain Integration & Deployment Guide: `digitallykolkata.online`

This guide details how to host your new **Digitally Kolkata** agency website for free and connect your custom domain (`digitallykolkata.online`) with **100% free automatic SSL**, global CDN caching, and zero anti-bot challenges.

---

## 🚀 Recommended Deployment Options (100% Free Tiers)

You can choose either **Vercel** or **Cloudflare Pages**. Both provide:
- **Free Automatic SSL Certificate** (Let's Encrypt / Cloudflare Edge).
- **Global CDN Edge Caching** (< 50ms latency across India).
- **Full SEO Crawler Support** (No InfinityFree AES anti-bot blockers; Google and social media preview cards will index your site immediately).

---

### Option A: Deploy via Vercel (Fastest & Easiest)

#### Step 1: Push or Deploy to Vercel
1. If using Git, push this repository `d:\Git\Portfolio\DK` to your GitHub account:
   ```bash
   git init
   git add .
   git commit -m "feat: initial Digitally Kolkata agency portal"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/digitally-kolkata.git
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com) and log in.
3. Click **"Add New Project"** → select your `digitally-kolkata` repository → click **Deploy**.
   *(Alternatively, run `npx vercel` directly in your terminal in this directory).*

#### Step 2: Connect Your Domain `digitallykolkata.online`
1. In your Vercel Project Dashboard, navigate to **Settings → Domains**.
2. Enter `digitallykolkata.online` and click **Add**.
3. Vercel will provide the required DNS records (e.g., `A` record pointing to `76.76.21.21` and `CNAME` for `www` pointing to `cname.vercel-dns.com`).

#### Step 3: Update DNS Records at Your Domain Registrar
Log into wherever you purchased `digitallykolkata.online` (GoDaddy, Namecheap, Hostinger, BigRock, etc.) and open **DNS Management**:
- **Delete / Replace** the old InfinityFree `A` record (`185.27.134.60`).
- **Add A Record:**
  - **Type:** `A`
  - **Name / Host:** `@`
  - **Value:** `76.76.21.21`
  - **TTL:** Automatic or 300
- **Add CNAME Record:**
  - **Type:** `CNAME`
  - **Name / Host:** `www`
  - **Value:** `cname.vercel-dns.com`

---

### Option B: Deploy via Cloudflare Pages (Unmatched Speed & DDoS Security)

1. Log in to [dash.cloudflare.com](https://dash.cloudflare.com).
2. Go to **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
3. Select your `digitally-kolkata` repository.
   - **Framework preset:** `None` (Static HTML)
   - **Build command:** *(leave empty)*
   - **Build output directory:** `.`
4. Click **Save and Deploy**.
5. Once deployed, click **Custom domains** → **Set up a domain** → enter `digitallykolkata.online`.
6. Follow Cloudflare's 1-click DNS configuration.

---

## 📋 What Was Upgraded & Fixed

| Feature | Old InfinityFree WordPress Site | New Modern Web Platform |
| :--- | :--- | :--- |
| **SSL / HTTPS** | Untrusted dummy cert (`CN=*`), browser warning | Valid, auto-renewing global SSL certificate |
| **Search Indexing** | Blocked by `noindex, nofollow` and AES challenge | Fully indexable, semantic HTML5 + JSON-LD Schema |
| **Subpages / CTAs** | 4 empty blank templates, unlinked `#` buttons | Interactive portfolio filter, modals, live cost calculator |
| **Conversions** | Zero phone/email/contact forms | Working inquiry form with instant WhatsApp lead redirection |
| **Speed & Performance** | Shared hosting with slow TTFB | Instant edge delivery (< 1.2s load time) |

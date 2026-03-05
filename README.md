# 👑 Royal Coffee & Tea — Website

## Stack
- **Next.js 15** + TypeScript
- **Tailwind CSS** — Black / White / Gold
- **Framer Motion** — Full-screen page transitions
- **Zustand** — Cart state
- **Sanity CMS** — Owner dashboard (full CRUD)

---

## 🚀 Run Locally

```bash
npm install
npm run dev
```
Open http://localhost:3000

---

## 🗄️ Connect Sanity CMS (Owner Dashboard)

### Step 1 — Create Sanity project
1. Go to https://sanity.io and sign up free
2. Create a new project → name it "Royal Coffee"
3. Copy your **Project ID** from the dashboard

### Step 2 — Create .env.local
Duplicate `.env.local.example` → rename to `.env.local`
Fill in your Project ID:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=abc123xyz
NEXT_PUBLIC_SANITY_DATASET=production
```

### Step 3 — Deploy Studio & add CORS
In your Sanity dashboard → API → CORS Origins → add:
- http://localhost:3000
- https://yourdomain.com (when live)

### Step 4 — Open Owner Dashboard
http://localhost:3000/studio

---

## 🎛️ What the Owner Can Manage (at /studio)

| Section | What they can do |
|---------|-----------------|
| **⚙️ Site Settings** | Business name, tagline, phone numbers, WhatsApp, Telegram, Instagram, Facebook, TikTok, address, hours, map URL, payment methods |
| **📂 Categories** | Create / edit / delete / reorder menu categories |
| **☕ Products & Services** | Full CRUD — name, description, price, photo, category, badge, availability, display order |
| **📸 Gallery** | Upload photos and videos, set captions, reorder |

---

## 🌐 Deploy to Vercel
1. Push to GitHub
2. Go to vercel.com → Import repo
3. Add environment variables (NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET)
4. Deploy → live in 60 seconds

## 🌐 Deploy to Hostinger
```bash
npm run build
```
Upload `.next/`, `public/`, `package.json`, `next.config.js`, `.env.local` to your Node.js hosting.

---

## ✏️ Quick Edits Without Sanity

| What | File |
|------|------|
| Demo products | `components/sections/MenuSection.tsx` → `DEMO_PRODUCTS` |
| Demo categories | `components/sections/MenuSection.tsx` → `DEMO_CATEGORIES` |
| Default contact info | `components/sections/ContactSection.tsx` |
| Default map | `components/sections/LocationSection.tsx` |

---

## 📱 Navigation
- **Desktop** — Floating pill nav at top
- **Mobile** — Vertical side strip (left edge)
- **Keyboard** — Arrow keys navigate between sections
- **Side dots** — Desktop right edge, one per section

## 🎨 Brand Colors
```
Gold:    #c9922a / #e4af2e / #a87020
Black:   #0a0a0a / #141414
White:   #f5f0e8
```

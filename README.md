# DAAN IITG — Developer & Admin Handover Guide

> **Dakshana Alumni Network — IIT Guwahati**
> Official community platform for Dakshana Scholars.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Folder Structure](#3-folder-structure)
4. [Getting Started (Local Development)](#4-getting-started-local-development)
5. [Supabase Setup](#5-supabase-setup)
6. [Environment Variables](#6-environment-variables)
7. [VAPID Keys for Push Notifications](#7-vapid-keys-for-push-notifications)
8. [Deploying to Vercel](#8-deploying-to-vercel)
9. [Connecting a Custom Domain](#9-connecting-a-custom-domain)
10. [Adding a Favicon](#10-adding-a-favicon)
11. [User Roles & Permissions](#11-user-roles--permissions)
12. [Admin Panel Guide](#12-admin-panel-guide)
13. [Features Reference](#13-features-reference)
14. [Database Schema](#14-database-schema)
15. [Adding New Features](#15-adding-new-features)
16. [SEO & Google Ranking](#16-seo--google-ranking)
17. [PWA & Push Notifications](#17-pwa--push-notifications)
18. [Common Issues & Fixes](#18-common-issues--fixes)
19. [Supabase Storage Setup](#19-supabase-storage-setup)
20. [Making Someone an Admin](#20-making-someone-an-admin)

---

## 1. Project Overview

DAAN IITG is a full-stack web application and Progressive Web App (PWA) for the Dakshana Alumni Network at IIT Guwahati.

**Key capabilities:**
- User registration & login (Supabase Auth)
- Alumni directory with Excel upload & search/filter by batch, COE
- Achievements, Events, Council Member sections (admin-managed)
- Academic Calendar (PDF upload + manual editing + FullCalendar display)
- Push notifications to all users on new posts
- PWA — installable on mobile, tablet, desktop
- SEO-optimised with sitemap, structured metadata
- Role-based access: Admin / Sub-Admin / User
- Fully responsive (mobile, tablet, laptop)

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| File Storage | Supabase Storage |
| Hosting | Vercel |
| Push Notifications | Web Push API + VAPID |
| Excel Parsing | xlsx (server-side) |
| PDF Parsing | pdf-parse (server-side) |
| Calendar UI | FullCalendar React |
| Fonts | Fredoka (headings) + Nunito (body) via Google Fonts |

---

## 3. Folder Structure

```
daan-iitg/
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                  # Service worker
│   └── icons/                 # App icons (192x192, 512x512)
├── src/
│   ├── app/
│   │   ├── (app)/             # Authenticated route group
│   │   │   ├── dashboard/     # Home dashboard
│   │   │   ├── achievements/  # Achievements listing
│   │   │   ├── alumni/        # Alumni directory + search
│   │   │   ├── council/       # Council members
│   │   │   ├── events/        # Events listing
│   │   │   ├── calendar/      # Interactive calendar
│   │   │   └── admin/         # Admin panel
│   │   │       ├── achievements/
│   │   │       ├── alumni/    # Excel upload
│   │   │       ├── council/
│   │   │       ├── events/
│   │   │       ├── calendar/  # PDF upload
│   │   │       ├── notifications/
│   │   │       └── users/     # Role management
│   │   ├── api/
│   │   │   ├── admin/alumni-upload/    # Excel parse API
│   │   │   ├── admin/calendar-upload/  # PDF parse API
│   │   │   ├── notify/                 # Send push notification
│   │   │   └── push-subscribe/         # Subscribe/unsubscribe
│   │   ├── login/
│   │   ├── register/
│   │   ├── privacy/
│   │   ├── terms/
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Public landing page
│   │   ├── sitemap.ts         # SEO sitemap
│   │   └── robots.ts          # robots.txt
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── PWAInstallPrompt.tsx
│   │   ├── ServiceWorkerRegistration.tsx
│   │   └── NotificationSubscriber.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts      # Browser Supabase client
│   │   │   └── server.ts      # Server Supabase client
│   │   └── types.ts           # TypeScript types
│   └── middleware.ts          # Auth middleware (route protection)
├── .env.local                 # Environment variables (never commit)
├── .env.example               # Template for env vars
└── supabase/
    └── schema.sql             # Full DB schema
```

---

## 4. Getting Started (Local Development)

### Prerequisites
- Node.js v18+ (we used v22)
- npm v9+
- A Supabase account (free at supabase.com)

### Steps

```bash
# 1. Clone/open the project
cd daan-iitg

# 2. Install dependencies (already done)
npm install

# 3. Set up environment variables
# Copy .env.example to .env.local and fill in your values
cp .env.example .env.local

# 4. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 5. Supabase Setup

1. Go to [supabase.com](https://supabase.com) → New Project
2. Choose a name (e.g. `daan-iitg`), set a strong database password, choose region: **Singapore** (closest to India)
3. Once created, go to **Settings → API**:
   - Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - Copy **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Copy **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`
4. Go to **SQL Editor** → paste the entire contents of `supabase/schema.sql` → Run
5. Go to **Storage** → Create a new bucket named `daan-media` → set to **Public**
6. In the `daan-media` bucket, create folders: `achievements/`, `events/`, `council/`

---

## 6. Environment Variables

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_SITE_URL=https://daaniitg.com
NEXT_PUBLIC_APP_NAME=DAAN IITG
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxA=
VAPID_PUBLIC_KEY=BxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxA=
VAPID_PRIVATE_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VAPID_EMAIL=mailto:admin@daaniitg.com
```

**Never commit `.env.local` to Git.**

---

## 7. VAPID Keys for Push Notifications

Generate VAPID keys once and save them securely:

```bash
npx web-push generate-vapid-keys
```

Copy the output into your `.env.local` and Vercel environment variables.

---

## 8. Deploying to Vercel

1. Push your code to a GitHub repository
2. Go to [vercel.com](https://vercel.com) → Import Repository
3. Select your `daan-iitg` repo
4. In **Environment Variables**, add all variables from `.env.local`
5. Click **Deploy**
6. Vercel will auto-deploy on every push to `main`

---

## 9. Connecting a Custom Domain

1. In Vercel Dashboard → your project → **Settings → Domains**
2. Add your domain (e.g. `daaniitg.com`)
3. Update your domain's DNS:
   - Add `A` record pointing to Vercel's IP: `76.76.21.21`
   - Or add `CNAME` → `cname.vercel-dns.com`
4. Update `NEXT_PUBLIC_SITE_URL` in Vercel environment variables to your domain
5. SSL is automatic via Vercel

**Before launch checklist:**
- [ ] Custom domain connected
- [ ] Favicon added (`public/icons/`)
- [ ] Privacy Policy reviewed
- [ ] Terms & Conditions reviewed
- [ ] Admin account created and promoted

---

## 10. Adding a Favicon

Replace the placeholder icons in `public/icons/`:

```
public/
└── icons/
    ├── icon-192.png        (192×192 px)
    ├── icon-512.png        (512×512 px)
    └── apple-touch-icon.png (180×180 px)
```

Also replace `src/app/favicon.ico` with your `.ico` file.

**Tools to generate all sizes:** [favicon.io](https://favicon.io) or [realfavicongenerator.net](https://realfavicongenerator.net)

---

## 11. User Roles & Permissions

| Permission | User | Sub-Admin | Admin |
|---|:---:|:---:|:---:|
| View dashboard, alumni, events | ✅ | ✅ | ✅ |
| Post achievements | ✗ | ✅ | ✅ |
| Post events | ✗ | ✅ | ✅ |
| Manage council members | ✗ | ✅ | ✅ |
| Manage calendar (manual events) | ✗ | ✅ | ✅ |
| Upload Excel (alumni) | ✗ | ✗ | ✅ |
| Upload PDF (calendar) | ✗ | ✅ | ✅ |
| Send push notifications | ✗ | ✗ | ✅ |
| Delete any content | ✗ | ✗ | ✅ |
| Manage user roles | ✗ | ✗ | ✅ |

**Maximum 1 Admin + 2 Sub-Admins.**

---

## 12. Admin Panel Guide

Navigate to `/admin` after logging in with an admin or sub-admin account.

### Posting an Achievement
1. Admin Panel → Achievements → "New Achievement"
2. Enter title, caption, description, and optionally upload a photo
3. Click "Post Achievement" — users receive a push notification automatically

### Uploading Alumni Data (Excel)
1. Admin Panel → Alumni Upload
2. Prepare your Excel file with these columns:
   `DRN | Scholar Name | COE | Parent School | Batch | Phone Number | Email`
3. Upload the `.xlsx` file — preview shows first 5 rows
4. Click "Upload All Records" — data is upserted (no duplicates by DRN)

### Uploading Academic Calendar (PDF)
1. Admin Panel → Calendar → Upload PDF Calendar
2. The system automatically extracts dates and event names
3. Detected events appear in the interactive calendar
4. Add/edit individual events manually by clicking dates on the Calendar page

### Managing User Roles
1. Admin Panel → Manage Users (admin only)
2. Find the user → click "Sub-Admin" to promote, or "Demote" to revert
3. Maximum 2 sub-admins at any time

### Sending Push Notifications
1. Admin Panel → Notifications (admin only)
2. Enter title, message, and link URL
3. Click "Send to All Users" — delivered to all subscribed users

---

## 13. Features Reference

| Feature | Route | Description |
|---|---|---|
| Landing Page | `/` | Public intro page |
| Login | `/login` | Email + password auth |
| Register | `/register` | Create account |
| Dashboard | `/dashboard` | Home after login |
| Achievements | `/achievements` | Achievement posts grid |
| Alumni Directory | `/alumni` | Search + filter by batch/COE |
| Council | `/council` | Current council members |
| Events | `/events` | Upcoming + past events |
| Calendar | `/calendar` | Interactive FullCalendar |
| Admin Panel | `/admin` | Admin dashboard |
| Privacy Policy | `/privacy` | Legal page |
| Terms | `/terms` | Legal page |

---

## 14. Database Schema

All tables are in Supabase PostgreSQL with Row Level Security enabled.

| Table | Purpose |
|---|---|
| `profiles` | User accounts with role |
| `achievements` | Achievement posts |
| `alumni` | Alumni directory |
| `council_members` | Council profiles |
| `events` | Event posts |
| `calendar_events` | Calendar entries |
| `push_subscriptions` | Web push endpoints |
| `notifications` | Notification history |

Full schema in `supabase/schema.sql`.

---

## 15. Adding New Features

The project is structured to be extensible:

1. **New page**: Create `src/app/(app)/your-feature/page.tsx` (server component)
2. **New admin section**: Add to `src/app/(app)/admin/your-feature/`
3. **New API route**: Create `src/app/api/your-feature/route.ts`
4. **New DB table**: Add to `supabase/schema.sql`, run in Supabase SQL editor
5. **New type**: Add to `src/lib/types.ts`
6. **Add to navbar**: Edit `src/components/Navbar.tsx` → `navLinks` array
7. **Add to admin panel**: Edit `src/app/(app)/admin/page.tsx` → `adminLinks` array

---

## 16. SEO & Google Ranking

The site is optimised for search engines:

- **Sitemap**: Auto-generated at `/sitemap.xml`
- **robots.txt**: Auto-generated at `/robots.txt`
- **Metadata**: Each page has unique `title`, `description`, `og:image`
- **Structured data**: Can be added per page using `JSON-LD`
- **Performance**: Server-side rendering (SSR) for fast TTFB

**To improve Google ranking:**
1. Submit sitemap to [Google Search Console](https://search.google.com/search-console)
2. Get backlinks from official Dakshana Foundation website
3. Keep content fresh (post achievements, events regularly)
4. Ensure HTTPS (automatic on Vercel)

---

## 17. PWA & Push Notifications

### PWA Install
- Users see an install prompt after 3 seconds on first visit
- Prompt is dismissed permanently if closed (stored in `localStorage`)
- Clicking "Install App" triggers the native browser install

### Push Notifications
- Users see a "Enable Notifications" button if they haven't granted permission
- On subscribing, their endpoint is stored in `push_subscriptions`
- Notifications are automatically sent when admins post achievements or events
- Admin can also send manual notifications from the admin panel

### Generating VAPID Keys
```bash
npx web-push generate-vapid-keys
```

---

## 18. Common Issues & Fixes

**Build error: "Module not found: pdf-parse"**
```bash
npm install pdf-parse @types/pdf-parse
```

**Supabase auth not working**
- Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
- In Supabase → Auth → Settings, ensure email auth is enabled

**Images not loading**
- Ensure the `daan-media` storage bucket is set to **Public** in Supabase

**Push notifications not working**
- Ensure VAPID keys are set in both `.env.local` and Vercel environment variables
- HTTPS is required for push notifications (works on Vercel, not on `localhost`)

**Admin panel redirects to dashboard**
- The user's role in the `profiles` table must be `admin` or `sub_admin`
- See Section 20 to manually promote a user

**Calendar PDF extraction misses events**
- PDF text extraction depends on the PDF being text-based (not scanned/image)
- For scanned PDFs, add events manually on the Calendar page

---

## 19. Supabase Storage Setup

In Supabase dashboard → Storage:

1. Create bucket: `daan-media` → **Public bucket**
2. Add storage policy:
   - INSERT: Authenticated users with `admin` or `sub_admin` role
   - SELECT: All users (public)

Or run this in SQL Editor:
```sql
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'daan-media');

CREATE POLICY "Allow public read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'daan-media');
```

---

## 20. Making Someone an Admin

**First-time setup** — make yourself the super admin:

1. Register an account on the website with your email
2. Go to Supabase Dashboard → Table Editor → `profiles`
3. Find your row → edit `role` column → change from `user` to `admin`
4. Save

You now have full admin access. Use the Admin Panel → Manage Users to assign sub-admins through the UI.

---

## Contact & Handover

This README should be updated whenever:
- New features are added
- Database schema changes
- Deployment configuration changes
- New admin accounts are created

The DAAN IITG platform is built with Next.js 15, Supabase, and Tailwind CSS. It is designed to be maintainable by a small technical team.

---

*Built for DAAN IITG — Dakshana Alumni Network, IIT Guwahati.*

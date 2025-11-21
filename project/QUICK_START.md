# Quick Start Guide

Get your cybersecurity portfolio up and running in minutes!

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier is perfect)
- Your favorite code editor

---

## Installation (5 minutes)

### 1. Install Dependencies

```bash
cd project
npm install
```

This will install:
- Next.js 14
- React & TypeScript
- Tailwind CSS
- Framer Motion
- Supabase client
- Lucide React icons

---

## Supabase Setup (10 minutes)

Follow the complete guide in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

**Quick version:**

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL schemas (provided in SUPABASE_SETUP.md)
3. Enable Row Level Security policies
4. Add sample data
5. Get your API keys from Settings → API
6. Create `.env.local` with your keys:

```env
NEXT_PUBLIC_SUPABASE_URL=your_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
```

---

## Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

You should see your cybersecurity portfolio with:
- ✅ Animated hero section
- ✅ About section
- ✅ Experience timeline (from Supabase)
- ✅ Skills grid
- ✅ Projects gallery (from Supabase)
- ✅ Interactive SIEM simulator
- ✅ PlayCanvas game hub (from Supabase)
- ✅ Social links (from Supabase)
- ✅ Contact form

---

## Project Structure

```
project/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout with fonts
│   │   ├── page.tsx            # Main page
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── layout/             # Navbar, Footer, SectionContainer
│   │   ├── ui/                 # Button, Card, Badge, Modal, AnimatedSection
│   │   └── sections/           # HeroSection, AboutSection, etc.
│   ├── features/
│   │   ├── siem/               # SIEM simulator components
│   │   └── games/              # Game hub components
│   ├── lib/
│   │   ├── supabaseClient.ts   # Supabase connection
│   │   ├── cn.ts               # Class name utility
│   │   └── data-access/        # Database queries
│   ├── types/                  # TypeScript types
│   └── config/                 # Theme & skills config
├── .env.local                  # Your API keys (create this!)
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
```

---

## Customization

### 1. Update Your Information

**Edit [src/config/theme.ts](src/config/theme.ts):**
- Update skills in each category
- Modify theme colors if desired

**Edit Supabase data:**
- Go to your Supabase project → Table Editor
- Update `experiences`, `projects`, `games`, `links` tables with your real data

### 2. Customize Colors

**Edit [tailwind.config.js](tailwind.config.js):**

```js
colors: {
  primary: {
    DEFAULT: '#00f0ff',  // Change cyan accent
    purple: '#a855f7',   // Change purple accent
    green: '#00ff88',    // Change green accent
  },
  // ... more colors
}
```

### 3. Update SEO Metadata

**Edit [src/app/layout.tsx](src/app/layout.tsx):**

```tsx
export const metadata: Metadata = {
  title: 'Your Name | Cybersecurity Portfolio',
  description: 'Your custom description',
  keywords: ['your', 'keywords'],
  authors: [{ name: 'Your Name' }],
};
```

### 4. Customize Hero Section

**Edit [src/components/sections/HeroSection.tsx](src/components/sections/HeroSection.tsx):**

```tsx
<h1>
  <span>Your Title</span> Engineer
</h1>
<p>
  Your custom tagline
</p>
```

### 5. Update Contact Email

**Edit [src/components/sections/ContactSection.tsx](src/components/sections/ContactSection.tsx):**

Search for `your.email@example.com` and replace with your actual email.

---

## Adding Content

### Add a New Project

1. Go to Supabase → Table Editor → `projects`
2. Click "Insert row"
3. Fill in:
   - `name`: Project name
   - `short_description`: Brief summary
   - `long_description`: Detailed info
   - `tech_stack`: `{"React", "TypeScript"}` (array format)
   - `github_url`: GitHub repo link
   - `live_url`: Demo link (optional)
   - `category`: `cybersecurity`, `software`, `game`, or `other`
   - `featured`: `true` or `false`
4. Save

### Add Work Experience

1. Go to Supabase → Table Editor → `experiences`
2. Click "Insert row"
3. Fill in all fields
4. For `tech_stack`, use array format: `{"Python", "AWS", "Docker"}`
5. For current role, leave `end_date` empty
6. Save

### Add a Game

1. Go to Supabase → Table Editor → `games`
2. Click "Insert row"
3. Add your PlayCanvas game URL
4. Set difficulty: `Easy`, `Medium`, `Hard`, or `Expert`
5. For `tags`, use array format: `{"puzzle", "strategy"}`
6. Save

### Add Social Links

1. Go to Supabase → Table Editor → `links`
2. Edit existing rows or insert new ones
3. Supported types:
   - `github`
   - `linkedin`
   - `twitter`
   - `discord`
   - `email`
   - `resume_download`
   - `resume_preview`

---

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Click "Deploy"
7. Done! Your site will be live in ~2 minutes

### Deploy to Netlify

1. Build command: `npm run build`
2. Publish directory: `.next`
3. Add the same environment variables
4. Deploy

---

## Features Checklist

### Core Features
- [x] Responsive navigation with mobile menu
- [x] Smooth scroll animations (Framer Motion)
- [x] Dark cybersecurity theme
- [x] All data fetched from Supabase
- [x] TypeScript throughout

### Sections
- [x] Hero landing with animated entrance
- [x] About section with role cards
- [x] Experience timeline
- [x] Skills organized by category
- [x] Projects gallery with filtering
- [x] Interactive SIEM simulator
- [x] PlayCanvas game hub
- [x] Social & resume links
- [x] Contact form with validation

### SIEM Simulator
- [x] Live log stream (auto-updates every 3 seconds)
- [x] Alert list with severity indicators
- [x] Detailed alert view with threat intel
- [x] Filter by severity, category, and search
- [x] MITRE ATT&CK tactics
- [x] Recommended response actions

### Game Hub
- [x] Game cards with thumbnails
- [x] Difficulty badges
- [x] Tag system
- [x] Fullscreen modal player
- [x] PlayCanvas iframe embedding

---

## Troubleshooting

### Issue: "Module not found" errors

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Supabase connection fails

**Solution:**
1. Check `.env.local` exists and has correct values
2. Verify environment variables start with `NEXT_PUBLIC_`
3. Restart dev server: `npm run dev`

### Issue: No data showing

**Solution:**
1. Verify data exists in Supabase tables
2. Check RLS policies are enabled
3. Open browser console (F12) and check for errors

### Issue: TypeScript errors

**Solution:**
```bash
npm install --save-dev @types/node @types/react @types/react-dom
```

---

## Next Steps

1. ✅ Replace all sample data with your real information
2. ✅ Upload project screenshots to Supabase Storage
3. ✅ Add your actual resume PDF
4. ✅ Customize theme colors to match your brand
5. ✅ Update SEO metadata
6. ✅ Test on mobile devices
7. ✅ Deploy to production
8. ✅ Share with the world!

---

## Support & Resources

- **Supabase Setup**: See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
- **Implementation Details**: See [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)
- **Full Documentation**: See [README.md](./README.md)

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Framer Motion Docs](https://www.framer.com/motion/)

---

**Your cybersecurity portfolio is ready to launch!** 🚀

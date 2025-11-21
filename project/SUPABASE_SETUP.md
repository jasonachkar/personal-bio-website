# Supabase Database Setup Guide

Complete step-by-step guide to configure your Supabase database for the cybersecurity portfolio.

## Table of Contents
1. [Create Supabase Project](#step-1-create-supabase-project)
2. [Create Database Tables](#step-2-create-database-tables)
3. [Configure Row Level Security](#step-3-configure-row-level-security)
4. [Add Sample Data](#step-4-add-sample-data)
5. [Get Your API Keys](#step-5-get-your-api-keys)
6. [Configure Environment Variables](#step-6-configure-environment-variables)

---

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"New Project"**
3. Sign in with GitHub (recommended) or email
4. Create a new organization if you don't have one
5. Click **"New Project"**
6. Fill in the project details:
   - **Name**: `portfolio` (or any name you prefer)
   - **Database Password**: Create a strong password (save it somewhere safe!)
   - **Region**: Choose the closest region to you
   - **Pricing Plan**: Free tier is perfect for this project
7. Click **"Create new project"**
8. Wait 1-2 minutes for Supabase to set up your project

---

## Step 2: Create Database Tables

Once your project is ready:

1. Click on the **"SQL Editor"** icon in the left sidebar (looks like `</>`)
2. Click **"New query"**
3. Copy and paste the following SQL to create all tables at once:

```sql
-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE: experiences
-- =====================================================
CREATE TABLE experiences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT,
  description TEXT NOT NULL,
  tech_stack TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLE: projects
-- =====================================================
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  short_description TEXT NOT NULL,
  long_description TEXT NOT NULL,
  tech_stack TEXT[] NOT NULL,
  github_url TEXT,
  live_url TEXT,
  thumbnail_url TEXT,
  category TEXT NOT NULL CHECK (category IN ('cybersecurity', 'software', 'game', 'other')),
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLE: games
-- =====================================================
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  playcanvas_url TEXT NOT NULL,
  thumbnail_url TEXT,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard', 'Expert')),
  tags TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLE: links
-- =====================================================
CREATE TABLE links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('github', 'linkedin', 'email', 'resume_download', 'resume_preview', 'twitter', 'discord')),
  url TEXT NOT NULL,
  label TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  "order" INTEGER DEFAULT 0
);
```

4. Click **"Run"** (or press `Ctrl/Cmd + Enter`)
5. You should see "Success. No rows returned" for each table created

---

## Step 3: Configure Row Level Security (RLS)

Enable public read access to your tables:

1. Still in the SQL Editor, create a **new query**
2. Copy and paste this SQL:

```sql
-- Enable RLS on all tables
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE links ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read access
-- (Your portfolio is public, so anyone can view the data)

-- Experiences: Public read access
CREATE POLICY "Allow public read access to experiences"
ON experiences FOR SELECT
TO public
USING (true);

-- Projects: Public read access
CREATE POLICY "Allow public read access to projects"
ON projects FOR SELECT
TO public
USING (true);

-- Games: Public read access
CREATE POLICY "Allow public read access to games"
ON games FOR SELECT
TO public
USING (true);

-- Links: Public read access
CREATE POLICY "Allow public read access to links"
ON links FOR SELECT
TO public
USING (true);
```

3. Click **"Run"**
4. You should see success messages

**Note:** These policies allow anyone to READ your data (perfect for a public portfolio). To INSERT/UPDATE/DELETE data, you'll use the Supabase dashboard or authenticated connections.

---

## Step 4: Add Sample Data

Now let's add some sample data to test everything:

### Add Sample Experiences

```sql
INSERT INTO experiences (company, role, start_date, end_date, description, tech_stack)
VALUES
  (
    'Tech Security Corp',
    'Senior Security Engineer',
    '2022-01',
    NULL,
    'Leading security initiatives including penetration testing, vulnerability assessments, and SIEM implementation. Developed automated threat detection systems and reduced security incidents by 40%.',
    ARRAY['Python', 'Splunk', 'AWS', 'Docker', 'Kubernetes']
  ),
  (
    'DevSoft Solutions',
    'Full-Stack Developer',
    '2020-06',
    '2021-12',
    'Built and maintained web applications using React, Node.js, and PostgreSQL. Implemented CI/CD pipelines and improved application performance by 60%.',
    ARRAY['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'GraphQL']
  ),
  (
    'GameStudio Inc',
    'Junior Game Developer',
    '2019-03',
    '2020-05',
    'Developed interactive web-based games using PlayCanvas and Three.js. Optimized game performance and implemented multiplayer features.',
    ARRAY['PlayCanvas', 'JavaScript', 'Three.js', 'WebGL', 'Node.js']
  );
```

### Add Sample Projects

```sql
INSERT INTO projects (name, short_description, long_description, tech_stack, github_url, live_url, category, featured)
VALUES
  (
    'Threat Intelligence Platform',
    'Real-time threat monitoring and analysis system',
    'A comprehensive security platform that aggregates threat data from multiple sources, performs automated analysis, and provides actionable insights. Features include real-time log analysis, automated threat hunting, and custom alert rules.',
    ARRAY['React', 'TypeScript', 'Python', 'Elasticsearch', 'Docker'],
    'https://github.com/yourusername/threat-intel',
    'https://threat-intel-demo.vercel.app',
    'cybersecurity',
    true
  ),
  (
    'Vulnerability Scanner',
    'Automated web application vulnerability scanner',
    'Open-source tool for detecting common web vulnerabilities including SQL injection, XSS, and CSRF. Supports custom scan configurations and generates detailed reports.',
    ARRAY['Python', 'Flask', 'Selenium', 'Beautiful Soup'],
    'https://github.com/yourusername/vuln-scanner',
    NULL,
    'cybersecurity',
    true
  ),
  (
    'Portfolio Dashboard',
    'Modern portfolio template with analytics',
    'A beautiful, responsive portfolio template built with Next.js and Tailwind CSS. Includes integrated analytics, dark mode, and CMS support.',
    ARRAY['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase'],
    'https://github.com/yourusername/portfolio-template',
    'https://portfolio-template-demo.vercel.app',
    'software',
    false
  ),
  (
    'API Rate Limiter',
    'Distributed rate limiting middleware',
    'High-performance rate limiting middleware for Node.js applications. Supports Redis backend and multiple limiting strategies.',
    ARRAY['Node.js', 'Redis', 'TypeScript'],
    'https://github.com/yourusername/rate-limiter',
    NULL,
    'software',
    false
  );
```

### Add Sample Games

```sql
INSERT INTO games (title, description, playcanvas_url, thumbnail_url, difficulty, tags)
VALUES
  (
    'Cyber Defense',
    'Defend your network from incoming cyber threats. Deploy firewalls, detect malware, and stop hackers in this fast-paced security simulation.',
    'https://playcanv.as/p/example-game-1/',
    'https://via.placeholder.com/400x225/0a0a0f/00f0ff?text=Cyber+Defense',
    'Medium',
    ARRAY['strategy', 'defense', 'cybersecurity', 'educational']
  ),
  (
    'Code Breaker',
    'Solve cryptographic puzzles and crack encryption codes in this brain-teasing puzzle game. Learn about classic ciphers while having fun!',
    'https://playcanv.as/p/example-game-2/',
    'https://via.placeholder.com/400x225/0a0a0f/a855f7?text=Code+Breaker',
    'Easy',
    ARRAY['puzzle', 'cryptography', 'educational', 'casual']
  ),
  (
    'Network Runner',
    'Navigate through dangerous networks, avoid security systems, and reach your objective. A challenging platformer with a hacker theme.',
    'https://playcanv.as/p/example-game-3/',
    'https://via.placeholder.com/400x225/0a0a0f/00ff88?text=Network+Runner',
    'Hard',
    ARRAY['platformer', 'action', 'arcade', 'challenging']
  );
```

### Add Sample Links

```sql
INSERT INTO links (type, url, label, icon_name, "order")
VALUES
  ('github', 'https://github.com/yourusername', 'GitHub', 'Github', 1),
  ('linkedin', 'https://linkedin.com/in/yourprofile', 'LinkedIn', 'Linkedin', 2),
  ('email', 'mailto:your.email@example.com', 'Email Me', 'Mail', 3),
  ('resume_download', '/resume.pdf', 'Download Resume', 'Download', 4),
  ('resume_preview', '/resume-preview', 'View Resume', 'FileText', 5);
```

Run each INSERT query separately or all together. You should see "Success" messages.

---

## Step 5: Get Your API Keys

1. In your Supabase project dashboard, click **"Settings"** (gear icon) in the left sidebar
2. Click **"API"** under Project Settings
3. You'll see two important values:

   - **Project URL**: Looks like `https://xxxxxxxxxxxxx.supabase.co`
   - **API Key (anon public)**: A long string starting with `eyJ...`

4. **Copy both values** - you'll need them in the next step

**Important:** The `anon` key is safe to use in your frontend. It respects Row Level Security policies.

---

## Step 6: Configure Environment Variables

1. In your portfolio project, navigate to the `project` folder
2. Create a file called `.env.local` (if it doesn't exist)
3. Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey...
```

Replace the values with YOUR actual URL and key from Step 5.

4. Save the file
5. **Restart your development server** if it's running:

```bash
npm run dev
```

---

## Verify Everything Works

1. Open your browser and go to `http://localhost:3000`
2. You should see:
   - ✅ Sample experiences in the Experience section
   - ✅ Sample projects in the Projects section
   - ✅ Sample games in the Game Hub
   - ✅ Sample links in the Links section

3. If something doesn't show up:
   - Check the browser console for errors (F12 → Console)
   - Verify your `.env.local` file has the correct values
   - Make sure you restarted the dev server after creating `.env.local`
   - Check that RLS policies are enabled in Supabase

---

## Managing Your Data

### Option 1: Supabase Dashboard (Easy)

1. Go to your Supabase project
2. Click **"Table Editor"** in the left sidebar
3. Select a table (e.g., `projects`)
4. Click **"Insert row"** to add new data
5. Click on any row to **edit** it
6. Use the **delete** button to remove rows

### Option 2: SQL Editor (Advanced)

Use SQL queries to insert, update, or delete data:

**Example: Add a new project**
```sql
INSERT INTO projects (name, short_description, long_description, tech_stack, github_url, category)
VALUES (
  'My New Project',
  'A cool new app I built',
  'Detailed description here...',
  ARRAY['React', 'Node.js', 'MongoDB'],
  'https://github.com/yourusername/new-project',
  'software'
);
```

**Example: Update a project**
```sql
UPDATE projects
SET featured = true
WHERE name = 'My New Project';
```

**Example: Delete old data**
```sql
DELETE FROM experiences
WHERE company = 'Old Company Name';
```

---

## Customizing Your Data

### Update Sample Data with Your Information

1. Go to **Table Editor** → **experiences**
2. Edit each row with your actual work experience
3. Update company names, roles, dates, descriptions, and tech stacks

4. Go to **Table Editor** → **projects**
5. Replace sample projects with your real projects
6. Add GitHub URLs, live demo links, and screenshots

7. Go to **Table Editor** → **links**
8. Update with your actual GitHub, LinkedIn, email
9. Upload your resume PDF to Supabase Storage (or link to an external URL)

### Add Project Thumbnails

**Option A: Upload to Supabase Storage**

1. Click **"Storage"** in the left sidebar
2. Click **"Create bucket"**
3. Name it `project-images` and make it **public**
4. Upload your project screenshots
5. Copy the public URL for each image
6. Paste URLs into the `thumbnail_url` field in your `projects` table

**Option B: Use External URLs**

Simply paste any image URL (e.g., from Imgur, Cloudinary, or your own hosting) into the `thumbnail_url` field.

---

## Troubleshooting

### Error: "No rows returned"

**Cause:** RLS policies are blocking access

**Solution:**
1. Go to **Authentication** → **Policies**
2. Verify that SELECT policies exist for all tables
3. Make sure policies have `USING (true)` to allow public read access

### Error: "Failed to fetch"

**Cause:** Wrong API URL or key

**Solution:**
1. Double-check `.env.local` values
2. Make sure keys have the `NEXT_PUBLIC_` prefix
3. Restart dev server: `npm run dev`

### Data not showing in app

**Cause:** Empty tables or connection issue

**Solution:**
1. Go to Supabase **Table Editor**
2. Verify data exists in tables
3. Check browser console (F12) for error messages
4. Test the connection by visiting: `https://YOUR-PROJECT-ID.supabase.co/rest/v1/projects?select=*&apikey=YOUR-ANON-KEY`

---

## Next Steps

- ✅ Customize all sample data with your real information
- ✅ Upload project screenshots to Supabase Storage
- ✅ Add your actual resume PDF
- ✅ Test all sections of your portfolio
- ✅ Deploy to Vercel or Netlify (don't forget to add environment variables!)

---

## Security Best Practices

1. **Never commit `.env.local` to Git** (it's in `.gitignore` by default)
2. **Use RLS policies** to control data access (already configured)
3. **Use `anon` key for frontend** (never use the `service_role` key in client-side code)
4. **Keep your database password safe** (you won't need it for normal operations)

---

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

---

**Congratulations! Your Supabase database is now fully configured and connected to your portfolio.** 🎉

# Cybersecurity Portfolio - Next.js 14

A modern, cybersecurity-themed personal portfolio built with Next.js 14, TypeScript, Tailwind CSS, Framer Motion, and Supabase.

## Features

- **Cybersecurity-themed Design**: Dark mode with neon accents (cyan, purple, green)
- **Interactive SIEM Simulator**: Live log stream, alert management, threat intelligence panel
- **PlayCanvas Game Hub**: Embedded game experiences with metadata
- **Dynamic Content**: All data pulled from Supabase (experiences, projects, games, links)
- **Smooth Animations**: Framer Motion for entrance effects and transitions
- **Fully Responsive**: Mobile-first design with Tailwind CSS
- **Type-Safe**: Complete TypeScript coverage

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Database**: Supabase
- **Icons**: Lucide React
- **Package Manager**: npm

## Installation

### 1. Clone and Navigate

```bash
cd project
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env.local` file in the `project` directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# EmailJS Configuration (for contact form)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_emailjs_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

> **Note**: To use EmailJS for the contact form:
> 1. Create a free account at [emailjs.com](https://www.emailjs.com/)
> 2. Create an email service and template
> 3. In your EmailJS template settings:
>    - **Subject**: Add `{{from_name}} - Contact Form Submission` or similar
>    - **Content**: Use these template variables:
>      - `{{from_name}}` - Sender's name
>      - `{{from_email}}` or `{{email}}` - Sender's email address
>      - `{{message}}` - Message content
>    - **Reply-To field**: Set to `{{email}}` or `{{from_email}}` so replies go directly to the sender
> 4. Copy your Service ID, Template ID, and Public Key to the `.env.local` file
> 
> **Example EmailJS Template:**
> ```
> From: {{from_name}} <your-email@example.com>
> Reply-To: {{email}}
> 
> Subject: Contact Form: {{from_name}}
> 
> You have received a new message from your portfolio contact form.
> 
> Name: {{from_name}}
> Email: {{email}}
> 
> Message:
> {{message}}
> ```
> 
> If EmailJS is not configured, the form will fallback to opening a mailto link.

### 4. Supabase Database Setup

Create the following tables in your Supabase project:

#### `experiences` table

```sql
CREATE TABLE experiences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT,
  description TEXT NOT NULL,
  tech_stack TEXT[] NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `projects` table

```sql
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
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `games` table

```sql
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  playcanvas_url TEXT NOT NULL,
  thumbnail_url TEXT,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard', 'Expert')),
  tags TEXT[] NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `links` table

```sql
CREATE TABLE links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('github', 'linkedin', 'email', 'resume_download', 'resume_preview', 'twitter', 'discord')),
  url TEXT NOT NULL,
  label TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  "order" INTEGER DEFAULT 0
);
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view your portfolio.

### 6. Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
project/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with fonts
│   │   ├── page.tsx            # Main page with all sections
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx      # Navigation bar
│   │   │   ├── Footer.tsx      # Footer component
│   │   │   └── SectionContainer.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx      # Reusable button component
│   │   │   ├── Card.tsx        # Card component
│   │   │   ├── Badge.tsx       # Badge/tag component
│   │   │   ├── Modal.tsx       # Modal dialog
│   │   │   └── AnimatedSection.tsx
│   │   └── sections/
│   │       ├── HeroSection.tsx
│   │       ├── AboutSection.tsx
│   │       ├── ExperienceSection.tsx
│   │       ├── SkillsSection.tsx
│   │       ├── ProjectsSection.tsx
│   │       ├── ContactSection.tsx
│   │       └── LinksSection.tsx
│   ├── features/
│   │   ├── siem/
│   │   │   ├── SiemDashboard.tsx
│   │   │   ├── LogStream.tsx
│   │   │   ├── AlertList.tsx
│   │   │   ├── AlertDetails.tsx
│   │   │   ├── FilterBar.tsx
│   │   │   ├── types.ts
│   │   │   └── mockSiemData.ts
│   │   └── games/
│   │       ├── GameHub.tsx
│   │       ├── GameCard.tsx
│   │       ├── GameModal.tsx
│   │       └── types.ts
│   ├── lib/
│   │   ├── supabaseClient.ts
│   │   ├── cn.ts
│   │   └── data-access/
│   │       ├── experiences.ts
│   │       ├── projects.ts
│   │       ├── games.ts
│   │       └── links.ts
│   ├── types/
│   │   └── index.ts
│   └── config/
│       └── theme.ts
├── .env.local.example
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── postcss.config.js
└── package.json
```

## Data Access Layer

All Supabase queries are centralized in `src/lib/data-access/`:

- `getExperiences()` - Fetch all work experiences
- `getProjects()` - Fetch all projects
- `getProjectsByCategory(category)` - Filter projects
- `getGames()` - Fetch all games
- `getLinks()` - Fetch social/resume links
- `getSocialLinks()` - Fetch only social links
- `getResumeLinks()` - Fetch resume download/preview links

## Customization

### Update Theme Colors

Edit `tailwind.config.js` to change the cybersecurity color scheme:

```js
colors: {
  primary: {
    DEFAULT: '#00f0ff', // Cyan
    purple: '#a855f7',  // Purple
    green: '#00ff88',   // Green
  },
  // ...
}
```

### Add New Skills

Edit `src/config/theme.ts` to update the skills section:

```ts
export const skillCategories = [
  {
    name: 'Software Development',
    skills: ['React', 'TypeScript', /* add more */],
    icon: 'Code2',
  },
  // ...
];
```

### Modify SIEM Data

Edit `src/features/siem/mockSiemData.ts` to customize logs and alerts.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
4. Deploy

### Netlify

1. Build command: `npm run build`
2. Publish directory: `.next`
3. Add environment variables
4. Deploy

## Sections Overview

1. **Hero** - Landing with animated entrance, role badges, CTAs
2. **About** - Bio pulled from Supabase (can add `profile` table)
3. **Experience** - Timeline of roles from `experiences` table
4. **Skills** - Grouped skill categories (Software, Cybersecurity, Game Dev)
5. **Projects** - Filterable gallery from `projects` table
6. **SIEM Simulator** - Interactive SOC dashboard with live logs and alerts
7. **Game Hub** - PlayCanvas games from `games` table
8. **Links & Resume** - Social links and resume access from `links` table
9. **Contact** - Form with client-side validation (currently logs to console)

## Troubleshooting

**Supabase connection fails:**
- Check `.env.local` has correct credentials
- Verify Supabase project URL and anon key
- Check Row Level Security (RLS) policies allow public read access

**Styles not applying:**
- Ensure Tailwind config `content` paths are correct
- Run `npm run dev` to rebuild

**TypeScript errors:**
- Ensure all interfaces in `src/types/index.ts` match your Supabase schema
- Run `npm install` to ensure dependencies are installed

## License

MIT

## Support

For issues or questions, open an issue in the repository or refer to:
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

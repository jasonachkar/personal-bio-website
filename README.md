# Cybersecurity Portfolio Website

A modern, single-page portfolio website built with Next.js 14, featuring an integrated admin panel for content management.

## Features

- **Single Page Application** - Smooth scrolling navigation
- **Built-in Admin Panel** - Edit all content through a secure web interface
- **Content Management** - All content stored in JSON files with validation
- **GitHub Integration** - Optional automatic commits
- **Dark/Light Mode** - Theme toggle with system preference detection
- **Responsive Design** - Mobile-first, accessible design
- **Contact Form** - Functional contact form with Formspree integration

## Quick Start

```bash
cd project
npm install --legacy-peer-deps
cp ../.env.example ../.env.local
# Edit .env.local with your configuration
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Admin Panel

Navigate to `/admin/login` and enter your password (set in `.env.local`)

See [CONTENT_GUIDE.md](./CONTENT_GUIDE.md) for editing instructions.

## Configuration

Create `.env.local` from `.env.example` and configure:

```env
ADMIN_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
GITHUB_TOKEN=your_github_token (optional)
GITHUB_REPO=username/repo (optional)
NEXT_PUBLIC_FORMSPREE_ENDPOINT=https://formspree.io/f/xxx (optional)
```

## Deployment

Deploy to Vercel or Netlify. Set environment variables in your hosting dashboard.

## License

MIT License

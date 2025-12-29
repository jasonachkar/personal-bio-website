# Content Management Guide

This portfolio website features a built-in admin panel for easy content editing. You can update all content without touching code.

## Quick Start

1. **Access the admin panel**: Navigate to `/admin/login`
2. **Login**: Enter your admin password (set in `.env` file)
3. **Edit content**: Select a section from the sidebar and edit the JSON
4. **Save**: Click "Save Changes" to persist your edits

## Admin Panel Features

### Authentication
- Secure password-based authentication
- Session management with HTTP-only cookies
- Automatic redirection if not authenticated

### Content Sections

You can edit the following sections through the admin panel:

1. **Hero** - Main landing section with name, tagline, focus areas, and stats
2. **About** - Professional narrative and core strengths
3. **Certifications** - Security certifications
4. **Education** - Academic background
5. **Experience** - Work history with security highlights
6. **Projects** - Portfolio projects
7. **Writeups** - Technical articles and blog posts
8. **Contact** - Contact form copy
9. **Social** - Social media links and resume link

### Content Storage

All content is stored as JSON files in the `/content` directory

### GitHub Integration (Optional)

If configured, the admin panel can automatically commit changes to your GitHub repository

### Deployment Integration (Optional)

Trigger automatic rebuilds after content changes

See README.md for full setup instructions.

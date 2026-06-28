# Security

This portfolio is a static-friendly Next.js App Router site.

## Runtime Surface

- No admin panel.
- No login or authentication flow.
- No external database client, database migrations, or keepalive workflow.
- No scanner execution or user-supplied target scanning.
- Labs run entirely client-side on committed sample data in `content/labs/`.
- The contact form validates input client-side and opens a local email compose flow.

## Content Guardrails

Portfolio claims should come from `content/profile.ts`, `content/experience.ts`, and `content/projects.ts`.
Do not add quantified outcomes, employer-attributed narratives, or role claims unless they are verified and defensible.

## Dependency Checks

Use the standard project checks before deployment:

```bash
npm run typecheck
npm run lint
npm run build
```

Run `npm audit` when changing dependencies.

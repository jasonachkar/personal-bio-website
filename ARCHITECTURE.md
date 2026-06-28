# Architecture Documentation

## Overview

This Next.js 14 portfolio is structured using **clean architecture principles** with clear separation of concerns across four main layers:

1. **App Layer** (`src/app/`) - Next.js routing, pages, and thin API controllers
2. **Domain Layer** (`src/domain/`) - Pure business logic, independent of frameworks
3. **Infrastructure Layer** (`src/infra/`) - External integrations, data access, security
4. **UI Layer** (`src/components/`, `src/features/`) - React components and feature modules

---

## Directory Structure

```
src/
├── app/                    # Next.js App Router (Route Layer)
│   ├── (routes)/          # Application routes
│   │   ├── page.tsx       # Homepage
│   │   ├── siem/          # SIEM showcase
│   │   ├── threat-modeling/
│   │   ├── azure-blueprint/
│   │   ├── devsecops/
│   │   └── admin/         # Admin panel
│   └── api/               # API Routes (thin controllers)
│       ├── siem/
│       ├── auth/
│       └── ...
│
├── domain/                # Domain Layer (Pure Business Logic)
│   ├── siem/             # SIEM query parsing, detection engine
│   ├── threat-modeling/  # Threat modeling logic
│   ├── azure/            # Azure security models
│   └── devsecops/        # Pipeline scoring logic
│
├── infra/                # Infrastructure Layer
│   ├── content/          # Content repository (loads /content JSON files)
│   ├── security/         # Security utilities (auth, headers, audit)
│   └── http/             # HTTP utilities (responses, validation)
│
├── features/             # Feature Modules
│   ├── siem/            # SIEM feature
│   │   ├── ui/          # React components
│   │   ├── api/         # Client-side API calls
│   │   └── state/       # State management (context/hooks)
│   ├── threat-modeling/
│   ├── azure-blueprint/
│   └── devsecops/
│
├── components/           # Shared UI Components
│   ├── ui/              # Reusable primitives (Button, Card, Badge)
│   ├── layout/          # Layout components (Navbar, Footer)
│   ├── sections/        # Homepage sections
│   └── admin/           # Admin-specific components
│
├── config/              # Configuration
│   └── env.ts           # Environment variable validation (Zod)
│
├── lib/                 # Shared utilities
│   ├── cn.ts            # Class name utility
│   └── schemas.ts       # Validation schemas
│
└── __tests__/           # Unit tests
    └── siem/            # Domain logic tests
```

---

## Layer Responsibilities

### 1. App Layer (`src/app/`)

**Purpose**: Next.js routing and request handling

**Rules**:
- Route pages should be **thin** - only handle routing, metadata, and rendering
- API routes should be **controllers** - parse input, call domain/infra, return response
- NO business logic in routes
- NO direct file system access (use infra layer)
- NO JWT signing/verification (use infra/security)

**Example**:
```typescript
// src/app/api/siem/events/route.ts
import { loadContent } from '@/infra/content/contentRepository';
import { jsonResponse, errorResponse } from '@/infra/http/responses';
import { siemEventsSchema } from '@/lib/schemas';

export async function GET() {
  try {
    const events = loadContent('siem/events.json', siemEventsSchema);
    return jsonResponse({ events, total: events.length });
  } catch (error) {
    return errorResponse('Failed to load events', { status: 500, logError: error });
  }
}
```

### 2. Domain Layer (`src/domain/`)

**Purpose**: Core business logic, pure and framework-independent

**Rules**:
- **NO React imports**
- **NO Next.js imports**
- **NO direct I/O** (no fs, fetch, DB calls)
- Pure functions and classes
- Well-documented with JSDoc
- Fully unit tested

**Example**:
```typescript
// src/domain/siem/queryParser.ts
/**
 * Parses KQL-like query strings into AST
 * @param query - Query string to parse
 * @returns Abstract syntax tree or null if invalid
 */
export function parseQuery(query: string): QueryAST | null {
  // Pure parsing logic
}
```

### 3. Infrastructure Layer (`src/infra/`)

**Purpose**: External integrations, I/O, security, data access

**Modules**:

#### `infra/content/`
- Loads and validates JSON files from `/content`
- Caching layer
- Zod schema validation
- Safe error handling

#### `infra/security/`
- **headers.ts** - CSP, security headers
- **auth.ts** - JWT token creation/verification, session management
- **rateLimit.ts** - Rate limiting (if implemented)
- **audit.ts** - Audit logging

#### `infra/http/`
- **responses.ts** - Type-safe response builders
- Request validation
- Error handling middleware

**Rules**:
- Mark files with `'use server'` if server-only
- Never expose sensitive data to client
- Always validate inputs
- Log errors but sanitize client responses

### 4. UI Layer (`src/components/`, `src/features/`)

**Purpose**: React components and feature-specific UI

**Feature Module Structure**:
```
features/siem/
├── ui/              # React components
│   ├── SiemDetectionConsole.tsx
│   ├── EventsTable.tsx
│   └── ...
├── api/             # Client-side API helpers
│   └── siemApi.ts
└── state/           # State management
    └── siemContext.tsx
```

**Rules**:
- Components should be **presentational** where possible
- Business logic lives in domain layer
- API calls go through `api/` adapters
- Use TypeScript strictly
- Accessibility (a11y) is required

---

## Data Flow

### Read Path (e.g., Loading SIEM Events)

```
1. Client Request
   ↓
2. API Route Controller (app/api/siem/events/route.ts)
   ↓
3. Infrastructure Layer (infra/content/contentRepository.ts)
   ↓
4. File System (/content/siem/events.json)
   ↓
5. Validation (Zod schema)
   ↓
6. Response (infra/http/responses.ts)
   ↓
7. Client (features/siem/ui/SiemDetectionConsole.tsx)
```

### Write Path (e.g., Admin Login)

```
1. Client Request (POST /api/auth/login)
   ↓
2. Controller validates input (infra/http/validateRequestBody)
   ↓
3. Auth service verifies password (infra/security/auth.ts)
   ↓
4. Create session token (infra/security/auth.ts)
   ↓
5. Set secure cookie
   ↓
6. Return success response
```

---

## Security Architecture

### Defense in Depth

1. **Environment Validation** (`config/env.ts`)
   - Validates all environment variables at startup
   - Fails fast if misconfigured

2. **Security Headers** (`infra/security/headers.ts`)
   - CSP, X-Frame-Options, HSTS, etc.
   - Applied via middleware to all routes

3. **Authentication** (`infra/security/auth.ts`)
   - JWT-based sessions
   - Secure cookie storage (httpOnly, secure, sameSite)
   - Bcrypt password hashing
   - Session expiration

4. **Input Validation**
   - All inputs validated with Zod schemas
   - Type-safe parsing
   - Sanitized error messages

5. **API Security**
   - CORS configured
   - Rate limiting (middleware)
   - Audit logging for admin actions

### Secure Defaults

- **Server-only code** marked explicitly
- **No secrets in client bundles** (validated by env schema)
- **Error messages sanitized** (no stack traces to client)
- **HTTPS enforced** in production
- **CSP headers** block unauthorized resources

---

## Development Workflow

### Adding a New Feature

1. **Define domain models** in `src/domain/<feature>/types.ts`
2. **Implement business logic** in `src/domain/<feature>/`
3. **Create infra adapters** if needed (e.g., data loading)
4. **Add API routes** in `src/app/api/<feature>/`
5. **Build UI components** in `src/features/<feature>/ui/`
6. **Write tests** in `src/__tests__/<feature>/`
7. **Update docs**

### Testing Strategy

- **Unit tests** for domain layer (pure logic)
- **Integration tests** for API routes
- **Component tests** for React components
- **E2E tests** for critical flows (optional)

### Code Quality

- **TypeScript strict mode** enforced
- **ESLint** with Next.js config
- **Prettier** for formatting
- **JSDoc** for public APIs
- **No implicit any**, no type assertions without reason

---

## Migration Guide

### Updating Old Code

If you find code that doesn't follow this architecture:

1. **API Routes**: Extract business logic to domain layer
2. **Components**: Move logic to services/domain
3. **Direct file reads**: Use `infra/content/contentRepository`
4. **Security**: Use `infra/security/*` utilities
5. **Responses**: Use `infra/http/responses` helpers

### Example Refactor

**Before** (mixed concerns):
```typescript
// app/api/siem/events/route.ts
export async function GET() {
  const filePath = join(process.cwd(), '../content/siem/events.json');
  const data = JSON.parse(readFileSync(filePath, 'utf8'));
  return NextResponse.json({ events: data });
}
```

**After** (clean architecture):
```typescript
// app/api/siem/events/route.ts
import { loadContent } from '@/infra/content/contentRepository';
import { jsonResponse, errorResponse } from '@/infra/http/responses';
import { siemEventsSchema } from '@/lib/schemas';

export async function GET() {
  try {
    const events = loadContent('siem/events.json', siemEventsSchema);
    return jsonResponse({ events, total: events.length });
  } catch (error) {
    return errorResponse('Failed to load events', { status: 500, logError: error });
  }
}
```

---

## Best Practices

### DO ✅

- Use Zod for all validation
- Log errors server-side
- Sanitize errors client-side
- Use TypeScript strictly
- Write JSDoc for exported functions
- Colocate tests with code
- Keep functions small and focused
- Follow DRY principle

### DON'T ❌

- Mix business logic with routing
- Expose stack traces to clients
- Hard-code configuration
- Use `any` type without justification
- Import client code in server modules
- Skip input validation
- Commit secrets
- Over-engineer simple problems

---

## Environment Variables

All environment variables are validated at startup using Zod.

### Required Variables

```bash
JWT_SECRET=<minimum 32 characters>
ADMIN_PASSWORD_HASH=<bcrypt hash>
NODE_ENV=development|production|test
```

### Optional Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=<supabase URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase key>
```

See `.env.example` for details.

---

## Performance

- **Content caching**: JSON files cached in memory
- **Static generation**: Most pages are static
- **Code splitting**: Dynamic imports for heavy components
- **Image optimization**: Next.js Image component
- **Bundle analysis**: `npm run analyze`

---

## Troubleshooting

### Build Errors

- Run `npm install` to ensure deps are up to date
- Check `next.config.js` for experimental features
- Verify environment variables are set

### TypeScript Errors

- Run `npx tsc --noEmit` to check types
- Ensure imports use `@/` path alias correctly
- Check for circular dependencies

### Runtime Errors

- Check server logs (not client console)
- Verify `/content` files exist and are valid JSON
- Ensure environment variables are set correctly

---

## Contributing

1. Follow this architecture
2. Write tests for new features
3. Update documentation
4. Run `npm run build` and `npm test` before committing
5. Use conventional commits (feat:, fix:, docs:, etc.)

---

## References

- [Next.js App Router](https://nextjs.org/docs/app)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

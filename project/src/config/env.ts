import { z } from 'zod';

/**
 * Server-side environment variable schema
 * Validates required environment variables at startup
 */
const serverEnvSchema = z.object({
  // Authentication
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  ADMIN_PASSWORD_HASH: z.string().min(1, 'ADMIN_PASSWORD_HASH is required'),

  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Optional: Supabase (if used)
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
});

/**
 * Client-side environment variable schema
 * Only public variables are exposed to the client
 */
const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
});

/**
 * Validates and returns server environment variables
 * Throws if validation fails
 * @throws {ZodError} If environment variables are invalid
 */
export function getServerEnv() {
  const parsed = serverEnvSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error('❌ Invalid server environment variables:');
    console.error(parsed.error.format());
    throw new Error('Invalid server environment variables');
  }

  return parsed.data;
}

/**
 * Validates and returns client environment variables
 * Safe to use in client components
 */
export function getClientEnv() {
  const parsed = clientEnvSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });

  if (!parsed.success) {
    console.error('❌ Invalid client environment variables:');
    console.error(parsed.error.format());
    return {};
  }

  return parsed.data;
}

/**
 * Type-safe server environment variables
 * Use this in API routes and server components
 */
export type ServerEnv = z.infer<typeof serverEnvSchema>;

/**
 * Type-safe client environment variables
 * Use this in client components
 */
export type ClientEnv = z.infer<typeof clientEnvSchema>;

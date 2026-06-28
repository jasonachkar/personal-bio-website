import { z } from 'zod';

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

const clientEnvSchema = z.object({
  NEXT_PUBLIC_EMAILJS_SERVICE_ID: z.string().optional(),
  NEXT_PUBLIC_EMAILJS_TEMPLATE_ID: z.string().optional(),
  NEXT_PUBLIC_EMAILJS_PUBLIC_KEY: z.string().optional(),
});

export function getServerEnv() {
  const parsed = serverEnvSchema.safeParse(process.env);

  if (!parsed.success) {
    throw new Error('Invalid server environment variables');
  }

  return parsed.data;
}

export function getClientEnv() {
  const parsed = clientEnvSchema.safeParse({
    NEXT_PUBLIC_EMAILJS_SERVICE_ID: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
    NEXT_PUBLIC_EMAILJS_TEMPLATE_ID: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
    NEXT_PUBLIC_EMAILJS_PUBLIC_KEY: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
  });

  return parsed.success ? parsed.data : {};
}

export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type ClientEnv = z.infer<typeof clientEnvSchema>;

import { readFileSync } from 'fs';
import { join } from 'path';
import { z } from 'zod';

/**
 * Content repository for loading and validating JSON files from the /content directory
 * Implements caching and safe parsing with Zod validation
 */

// In-memory cache for content files
const contentCache = new Map<string, unknown>();

/**
 * Base error for content loading failures
 */
export class ContentLoadError extends Error {
  constructor(
    message: string,
    public readonly path: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = 'ContentLoadError';
  }
}

/**
 * Loads and validates content from a JSON file
 * @param relativePath - Path relative to /content directory
 * @param schema - Zod schema for validation
 * @param options - Loading options
 * @returns Parsed and validated content
 * @throws {ContentLoadError} If file cannot be loaded or validated
 */
export function loadContent<T>(
  relativePath: string,
  schema: z.ZodSchema<T>,
  options: { cache?: boolean } = { cache: true }
): T {
  const cacheKey = relativePath;

  // Check cache first
  if (options.cache && contentCache.has(cacheKey)) {
    return contentCache.get(cacheKey) as T;
  }

  try {
    // Construct absolute path to content file
    const contentDir = join(process.cwd(), '../content');
    const fullPath = join(contentDir, relativePath);

    // Read file
    const fileContents = readFileSync(fullPath, 'utf8');

    // Parse JSON
    const rawData = JSON.parse(fileContents);

    // Validate with schema
    const validatedData = schema.parse(rawData);

    // Cache if enabled
    if (options.cache) {
      contentCache.set(cacheKey, validatedData);
    }

    return validatedData;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ContentLoadError(
        `Content validation failed for ${relativePath}: ${error.message}`,
        relativePath,
        error
      );
    }

    if (error instanceof SyntaxError) {
      throw new ContentLoadError(
        `Invalid JSON in ${relativePath}: ${error.message}`,
        relativePath,
        error
      );
    }

    throw new ContentLoadError(
      `Failed to load content from ${relativePath}`,
      relativePath,
      error
    );
  }
}

/**
 * Clears the content cache
 * Useful for development and testing
 */
export function clearContentCache(): void {
  contentCache.clear();
}

/**
 * Checks if content exists in cache
 */
export function hasContentCached(relativePath: string): boolean {
  return contentCache.has(relativePath);
}

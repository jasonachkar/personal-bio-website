import { NextRequest, NextResponse } from 'next/server';

// Disable Next.js caching for this route - always fetch fresh content
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/writeups/fetch
 * 
 * Fetches and renders GitHub README content using GitHub's Markdown API.
 * Returns rendered HTML that matches GitHub's preview styling.
 * 
 * Query params:
 * - url: The raw GitHub URL to fetch (required)
 */
export async function GET(request: NextRequest) {
  // Response headers to prevent any caching
  const noCacheHeaders = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  };

  try {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400, headers: noCacheHeaders }
      );
    }

    // Validate that the URL is from raw.githubusercontent.com
    if (!url.startsWith('https://raw.githubusercontent.com/')) {
      return NextResponse.json(
        { error: 'Invalid URL. Only raw.githubusercontent.com URLs are allowed' },
        { status: 400, headers: noCacheHeaders }
      );
    }

    // Fetch the raw markdown content from GitHub - disable caching
    const markdownResponse = await fetch(url, {
      headers: {
        'Accept': 'text/plain',
        'User-Agent': 'Mozilla/5.0 (compatible; Portfolio/1.0)',
      },
      cache: 'no-store',
    });

    if (!markdownResponse.ok) {
      return NextResponse.json(
        { error: `Failed to fetch: ${markdownResponse.statusText}` },
        { status: markdownResponse.status, headers: noCacheHeaders }
      );
    }

    const markdown = await markdownResponse.text();

    // Render markdown using GitHub's Markdown API
    try {
      const renderResponse = await fetch('https://api.github.com/markdown', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github+json',
          'User-Agent': 'Portfolio/1.0',
        },
        body: JSON.stringify({
          text: markdown,
          mode: 'gfm', // GitHub Flavored Markdown
        }),
        cache: 'no-store',
      });

      if (!renderResponse.ok) {
        throw new Error(`GitHub API error: ${renderResponse.statusText}`);
      }

      const html = await renderResponse.text();

      return NextResponse.json(
        { content: html, rendered: true },
        { headers: noCacheHeaders }
      );
    } catch (apiError) {
      // Fallback: return raw markdown if GitHub API fails
      console.warn('GitHub Markdown API failed, falling back to raw markdown:', apiError);
      return NextResponse.json(
        { content: markdown, rendered: false },
        { headers: noCacheHeaders }
      );
    }
  } catch (error) {
    console.error('Error fetching writeup content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500, headers: noCacheHeaders }
    );
  }
}


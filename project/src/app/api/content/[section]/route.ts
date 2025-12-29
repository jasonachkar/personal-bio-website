import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getSession } from '@/lib/auth';
import {
  heroSchema,
  aboutSchema,
  certificationsSchema,
  educationSchema,
  experienceSchema,
  projectsSchema,
  writeupsSchema,
  contactSchema,
  socialSchema,
} from '@/lib/schemas';

const contentDir = path.join(process.cwd(), '..', 'content');

const schemaMap: Record<string, any> = {
  hero: heroSchema,
  about: aboutSchema,
  certifications: certificationsSchema,
  education: educationSchema,
  experience: experienceSchema,
  projects: projectsSchema,
  writeups: writeupsSchema,
  contact: contactSchema,
  social: socialSchema,
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  try {
    const { section } = await params;
    const filePath = path.join(contentDir, `${section}.json`);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const jsonData = JSON.parse(fileContent);

    return NextResponse.json(jsonData);
  } catch (error) {
    console.error('Error reading content:', error);
    return NextResponse.json({ error: 'Failed to read content' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  try {
    // Check authentication
    const isAuthenticated = await getSession();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { section } = await params;
    const newContent = await request.json();

    // Validate content with Zod schema
    const schema = schemaMap[section];
    if (!schema) {
      return NextResponse.json({ error: 'Invalid section' }, { status: 400 });
    }

    try {
      schema.parse(newContent);
    } catch (validationError: any) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationError.errors },
        { status: 400 }
      );
    }

    // In development, write directly to file
    // In production, this would use GitHub API
    const filePath = path.join(contentDir, `${section}.json`);
    fs.writeFileSync(filePath, JSON.stringify(newContent, null, 2), 'utf-8');

    // If GitHub integration is enabled, commit the changes
    if (process.env.GITHUB_TOKEN && process.env.GITHUB_REPO) {
      await commitToGitHub(section, newContent);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving content:', error);
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 });
  }
}

async function commitToGitHub(section: string, content: any) {
  // This function will commit changes to GitHub
  // We'll implement it in the next step
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_REPO = process.env.GITHUB_REPO; // Format: owner/repo
  const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

  if (!GITHUB_TOKEN || !GITHUB_REPO) {
    console.log('GitHub integration not configured');
    return;
  }

  try {
    const [owner, repo] = GITHUB_REPO.split('/');
    const filePath = `content/${section}.json`;
    const fileContent = JSON.stringify(content, null, 2);
    const encodedContent = Buffer.from(fileContent).toString('base64');

    // Get current file SHA
    const getFileResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${GITHUB_BRANCH}`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    let sha: string | undefined;
    if (getFileResponse.ok) {
      const fileData = await getFileResponse.json();
      sha = fileData.sha;
    }

    // Update or create file
    const updateResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Update ${section} content via admin panel`,
          content: encodedContent,
          branch: GITHUB_BRANCH,
          ...(sha && { sha }),
        }),
      }
    );

    if (!updateResponse.ok) {
      const error = await updateResponse.json();
      console.error('GitHub commit error:', error);
    } else {
      console.log(`Successfully committed ${section} to GitHub`);

      // Trigger rebuild if webhook URL is provided
      if (process.env.REBUILD_WEBHOOK_URL) {
        await fetch(process.env.REBUILD_WEBHOOK_URL, { method: 'POST' });
      }
    }
  } catch (error) {
    console.error('Error committing to GitHub:', error);
  }
}

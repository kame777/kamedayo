import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getFileSha, upsertFile } from '@/app/blog/lib/github-api';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

function getEnvVars() {
  let ownerUsername = '';
  let ghToken = '';
  let ghOwner = '';
  let ghRepo = '';

  try {
    const { env } = getRequestContext();
    const e = env as Record<string, string>;
    ownerUsername = e.GITHUB_OWNER_USERNAME ?? '';
    ghToken = e.GITHUB_TOKEN ?? '';
    ghOwner = e.GITHUB_REPO_OWNER ?? '';
    ghRepo = e.GITHUB_REPO_NAME ?? '';
  } catch {
    ownerUsername = process.env.GITHUB_OWNER_USERNAME ?? '';
    ghToken = process.env.GITHUB_TOKEN ?? '';
    ghOwner = process.env.GITHUB_REPO_OWNER ?? '';
    ghRepo = process.env.GITHUB_REPO_NAME ?? '';
  }

  return { ownerUsername, ghToken, ghOwner, ghRepo };
}

export async function POST(req: NextRequest) {
  const session = await auth();
  const username = (session as { githubUsername?: string } | null)?.githubUsername;

  const { ownerUsername, ghToken, ghOwner, ghRepo } = getEnvVars();

  if (!username || username !== ownerUsername) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json() as { slug?: string; markdown?: string };
  const { slug, markdown } = body;

  if (!slug || !markdown) {
    return NextResponse.json({ error: 'slug and markdown required' }, { status: 400 });
  }

  if (!/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: 'Invalid slug (lowercase alphanumeric and hyphens only)' }, { status: 400 });
  }

  const filePath = `content/blog/${slug}.md`;
  const env = { token: ghToken, owner: ghOwner, repo: ghRepo };

  try {
    const sha = await getFileSha(env, filePath);
    const base64Content = btoa(unescape(encodeURIComponent(markdown)));
    const verb = sha ? 'Update' : 'Add';
    await upsertFile(env, filePath, base64Content, `${verb} blog post: ${slug}`, sha);
    return NextResponse.json({ ok: true, slug });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'GitHub API error' }, { status: 502 });
  }
}

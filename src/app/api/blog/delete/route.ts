import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getFileSha, deleteFile } from '@/app/blog/lib/github-api';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

function getEnvVars() {
  let ownerUsername = '';
  let ghToken = '';
  let ghOwner = '';
  let ghRepo = '';
  let ghBranch = '';

  try {
    const { env } = getRequestContext();
    const e = env as Record<string, string>;
    ownerUsername = e.GITHUB_OWNER_USERNAME ?? '';
    ghToken = e.GITHUB_TOKEN ?? '';
    ghOwner = e.GITHUB_REPO_OWNER ?? '';
    ghRepo = e.GITHUB_REPO_NAME ?? '';
    ghBranch = e.GITHUB_BRANCH ?? 'main';
  } catch {
    ownerUsername = process.env.GITHUB_OWNER_USERNAME ?? '';
    ghToken = process.env.GITHUB_TOKEN ?? '';
    ghOwner = process.env.GITHUB_REPO_OWNER ?? '';
    ghRepo = process.env.GITHUB_REPO_NAME ?? '';
    ghBranch = process.env.GITHUB_BRANCH ?? 'main';
  }

  return { ownerUsername, ghToken, ghOwner, ghRepo, ghBranch };
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  const username = (session as { githubUsername?: string } | null)?.githubUsername;

  const { ownerUsername, ghToken, ghOwner, ghRepo, ghBranch } = getEnvVars();

  if (!username || username !== ownerUsername) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json() as { slug?: string };
  const { slug } = body;

  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: 'Invalid slug' }, { status: 400 });
  }

  const filePath = `content/blog/${slug}.md`;
  const env = { token: ghToken, owner: ghOwner, repo: ghRepo, branch: ghBranch };

  try {
    const sha = await getFileSha(env, filePath);
    if (!sha) return NextResponse.json({ error: 'File not found' }, { status: 404 });
    await deleteFile(env, filePath, sha, `Delete blog post: ${slug}`);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'GitHub API error' }, { status: 502 });
  }
}

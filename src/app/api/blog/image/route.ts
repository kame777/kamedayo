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

  const body = await req.json() as { filename?: string; base64?: string };
  const { filename, base64 } = body;

  if (!filename || !base64) {
    return NextResponse.json({ error: 'filename and base64 required' }, { status: 400 });
  }

  const rawBase64 = base64.includes(',') ? base64.split(',')[1] : base64;
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  const filePath = `public/blog/images/${safeName}`;
  const env = { token: ghToken, owner: ghOwner, repo: ghRepo };

  try {
    const sha = await getFileSha(env, filePath);
    await upsertFile(env, filePath, rawBase64, `Upload blog image: ${safeName}`, sha);
    const rawUrl = `https://raw.githubusercontent.com/${ghOwner}/${ghRepo}/main/${filePath}`;
    return NextResponse.json({ url: rawUrl, staticPath: `/blog/images/${safeName}` });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Upload failed' }, { status: 502 });
  }
}

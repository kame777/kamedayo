const GITHUB_API = 'https://api.github.com';

export type GitHubEnv = {
  token: string;
  owner: string;
  repo: string;
};

function headers(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
  };
}

export async function getFileSha(
  env: GitHubEnv,
  filePath: string,
): Promise<string | null> {
  const url = `${GITHUB_API}/repos/${env.owner}/${env.repo}/contents/${filePath}`;
  const res = await fetch(url, { headers: headers(env.token) });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub GET ${filePath} failed: ${res.status}`);
  const json = (await res.json()) as { sha: string };
  return json.sha;
}

export async function deleteFile(
  env: GitHubEnv,
  filePath: string,
  sha: string,
  commitMessage: string,
): Promise<void> {
  const url = `${GITHUB_API}/repos/${env.owner}/${env.repo}/contents/${filePath}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: headers(env.token),
    body: JSON.stringify({ message: commitMessage, sha, branch: 'main' }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub DELETE ${filePath} failed: ${res.status} ${err}`);
  }
}

export async function upsertFile(
  env: GitHubEnv,
  filePath: string,
  contentBase64: string,
  commitMessage: string,
  sha: string | null,
): Promise<void> {
  const url = `${GITHUB_API}/repos/${env.owner}/${env.repo}/contents/${filePath}`;
  const body: Record<string, unknown> = {
    message: commitMessage,
    content: contentBase64,
    branch: 'main',
  };
  if (sha) body.sha = sha;
  const res = await fetch(url, {
    method: 'PUT',
    headers: headers(env.token),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub PUT ${filePath} failed: ${res.status} ${err}`);
  }
}

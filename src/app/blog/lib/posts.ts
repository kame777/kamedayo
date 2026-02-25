import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Post, PostMeta } from './types';

const POSTS_DIR = path.join(process.cwd(), 'content', 'blog');

export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''));
}

export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(POSTS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  return {
    slug,
    content,
    title: data.title ?? '',
    date: data.date ?? '',
    updatedAt: data.updatedAt,
    summary: data.summary ?? '',
    category: data.category ?? '',
    tags: Array.isArray(data.tags) ? data.tags : [],
    draft: data.draft ?? false,
    ogTitle: data.ogTitle,
    ogDescription: data.ogDescription,
  };
}

export function getAllPosts(includeDrafts = false): PostMeta[] {
  return getAllPostSlugs()
    .map((slug) => {
      const post = getPostBySlug(slug);
      if (!post) return null;
      if (!includeDrafts && post.draft) return null;
      const { content: _content, ...meta } = post;
      return meta;
    })
    .filter((p): p is PostMeta => p !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

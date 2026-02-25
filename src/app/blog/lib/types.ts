export type PostFrontmatter = {
  title: string;
  date: string;
  updatedAt?: string;
  summary: string;
  category: string;
  tags: string[];
  draft: boolean;
  ogTitle?: string;
  ogDescription?: string;
};

export type Post = PostFrontmatter & {
  slug: string;
  content: string;
};

export type PostMeta = Omit<Post, 'content'>;

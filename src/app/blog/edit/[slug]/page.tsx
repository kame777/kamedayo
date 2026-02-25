export const runtime = 'edge';

import EditPostClient from './EditPostClient';

export default function EditPostPage({ params }: { params: { slug: string } }) {
  return <EditPostClient params={params} />;
}

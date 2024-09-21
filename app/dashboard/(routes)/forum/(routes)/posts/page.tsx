import { auth } from "@clerk/nextjs/server";

import PostsContent from "@/components/contents/posts-content";

export default function Page() {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  return <PostsContent />;
}

import { auth } from "@clerk/nextjs/server";

import CommentsContent from "@/components/contents/comments-content";

export default function Page() {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  return <CommentsContent level={0} />;
}

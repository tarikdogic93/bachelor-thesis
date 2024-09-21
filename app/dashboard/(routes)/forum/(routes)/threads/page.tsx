import { auth } from "@clerk/nextjs/server";

import ThreadsContent from "@/components/contents/threads-content";

export default function Page() {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  return <ThreadsContent />;
}

import { auth } from "@clerk/nextjs/server";

import ConversationsContent from "@/components/contents/conversations-content";

export default async function Page() {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  return <ConversationsContent />;
}

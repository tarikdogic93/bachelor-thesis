import { notFound } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";

import ChatPageContent from "@/components/contents/chat-page-content";

export default async function Page() {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  const user = await currentUser();

  if (user?.publicMetadata.role === "Admin") {
    return notFound();
  }

  return <ChatPageContent userRole={"Company"} />;
}

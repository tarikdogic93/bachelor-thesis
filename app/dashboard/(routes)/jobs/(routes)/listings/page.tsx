import { auth } from "@clerk/nextjs/server";

import ListingsContent from "@/components/contents/listings-content";

export default function Page() {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  return <ListingsContent />;
}

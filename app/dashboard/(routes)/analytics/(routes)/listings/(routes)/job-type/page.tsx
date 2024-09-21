import { notFound } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";

import ListingsJobTypeInfoContent from "@/components/contents/listings-job-type-info-content";

export default async function Page() {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  const user = await currentUser();

  if (user?.publicMetadata.role !== "Admin") {
    return notFound();
  }

  return <ListingsJobTypeInfoContent />;
}

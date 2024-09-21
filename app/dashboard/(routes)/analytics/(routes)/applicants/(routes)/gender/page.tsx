import { notFound } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";

import ApplicantsGenderInfoContent from "@/components/contents/applicants-gender-info-content";

export default async function Page() {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  const user = await currentUser();

  if (user?.publicMetadata.role !== "Admin") {
    return notFound();
  }

  return <ApplicantsGenderInfoContent />;
}

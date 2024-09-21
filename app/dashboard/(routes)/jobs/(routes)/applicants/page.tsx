import { notFound } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";

import ApplicantsContent from "@/components/contents/applicants-content";

export default async function Page() {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  const user = await currentUser();

  if (user?.publicMetadata.role === "Applicant") {
    return notFound();
  }

  return <ApplicantsContent />;
}

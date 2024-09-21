import { notFound } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";

import ApplicantsCountryInfoContent from "@/components/contents/applicants-country-info-content";

export default async function Page() {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  const user = await currentUser();

  if (user?.publicMetadata.role !== "Admin") {
    return notFound();
  }

  return <ApplicantsCountryInfoContent />;
}

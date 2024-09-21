import { notFound } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";

export default async function Page() {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  const user = await currentUser();

  if (user?.publicMetadata.role !== "Admin") {
    return notFound();
  }

  return (
    <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center gap-y-3 p-8 text-center">
      <h1 className="text-3xl font-semibold">Envision success</h1>
      <p className="text-lg text-muted-foreground">
        Visualize this journey and make informed decisions
      </p>
    </div>
  );
}
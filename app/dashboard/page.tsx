import { auth } from "@clerk/nextjs/server";

export default function Page() {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  return (
    <div className="mx-auto flex h-full w-2/3 flex-col items-center justify-center gap-y-3 text-center">
      <h1 className="text-3xl font-semibold">Welcome to your dashboard</h1>
      <p className="text-lg text-muted-foreground">
        Explore and access a wide range of features and tools to manage your
        account and make the most of your experience
      </p>
    </div>
  );
}

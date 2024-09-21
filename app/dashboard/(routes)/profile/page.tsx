import { auth } from "@clerk/nextjs/server";

export default function Page() {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  return (
    <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center gap-y-3 p-8 text-center">
      <h1 className="text-3xl font-semibold">Personalize your profile</h1>
      <p className="text-lg text-muted-foreground">
        Easily fine-tune every detail to create a unique online presence
      </p>
    </div>
  );
}

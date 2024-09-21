import { auth } from "@clerk/nextjs/server";

import AccountContent from "@/components/contents/account-content";

export default function Page() {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  return (
    <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center gap-y-6 p-8">
      <div className="flex flex-col gap-y-3 text-center">
        <h2 className="text-3xl font-semibold">Manage your account</h2>
        <p className="text-lg text-muted-foreground">
          Take control of your account. Easily change your password and, if
          necessary, securely delete your account.
        </p>
      </div>
      <AccountContent />
    </div>
  );
}

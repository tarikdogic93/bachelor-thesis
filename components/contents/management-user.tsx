"use client";

import { useState } from "react";
import { CalendarDays, Copy, CopyCheck } from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Doc } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import Hint from "@/components/ui/hint";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import DeleteAccountAlert from "@/components/alerts/delete-account-alert";

type ManagementUserProps = {
  user: Doc<"users">;
};

export default function ManagementUser({ user }: ManagementUserProps) {
  const [isCopyingIcon, setIsCopyingIcon] = useState(false);

  const handleCopyUserId = () => {
    navigator.clipboard.writeText(user._id).then(() => {
      setIsCopyingIcon(true);

      setTimeout(() => setIsCopyingIcon(false), 1000);
    });
  };

  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-x-2 p-4">
        <div className="flex w-full flex-1 flex-col gap-y-4">
          <Avatar className="h-48 w-full rounded-md">
            <AvatarImage src={user.imageUrl} />
            <AvatarFallback className="rounded-md bg-gradient-to-b from-muted to-card">
              {user.firstName?.[0]}
              {user.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex w-full flex-col justify-between gap-y-4 sm:flex-row sm:items-end">
            <div className="flex flex-col justify-between">
              <p className="max-w-52 truncate font-semibold">
                {user.companyName
                  ? user.companyName
                  : `${user.firstName} ${user.lastName}`}
              </p>
              <p className="max-w-52 truncate text-sm text-primary/80">
                {user.emailAddress}
              </p>
              <div className="mt-2 flex items-center gap-x-2">
                <CalendarDays className="h-4 w-4 shrink-0 opacity-70" />
                <span className="max-w-44 truncate text-xs font-medium text-primary/50">
                  Joined {format(user._creationTime, "PPP")}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-x-2">
              <Hint label="Copy ID" side="bottom" sideOffset={10} asChild>
                <Button
                  className={cn({
                    "bg-accent text-accent-foreground": isCopyingIcon,
                  })}
                  variant="outline"
                  size="icon"
                  onClick={handleCopyUserId}
                >
                  {isCopyingIcon ? (
                    <CopyCheck className="h-4 w-4 shrink-0" />
                  ) : (
                    <Copy className="h-4 w-4 shrink-0" />
                  )}
                </Button>
              </Hint>
              <DeleteAccountAlert user={user} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

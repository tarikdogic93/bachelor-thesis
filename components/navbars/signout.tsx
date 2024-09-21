"use client";

import { useRouter } from "next/navigation";
import { LogOut, Settings2, UserRound } from "lucide-react";
import { useQuery } from "convex/react";
import { toast } from "sonner";
import { useClerk } from "@clerk/nextjs";

import { handleError } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import { useLayoutStore } from "@/stores/use-layout-store";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Signout() {
  const router = useRouter();
  const { position } = useLayoutStore();
  const { signOut } = useClerk();
  const currentUser = useQuery(api.users.currentUser);

  async function handleSignOut() {
    try {
      await signOut();
    } catch (error) {
      toast.error(handleError(error, undefined, undefined, true));
    }
  }

  return (
    <>
      {currentUser ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-10 w-10 cursor-pointer">
              <AvatarImage src={currentUser.imageUrl} />
              <AvatarFallback>
                {currentUser.firstName[0]}
                {currentUser.lastName[0]}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-72"
            align={position === "left" ? "end" : "start"}
            sideOffset={10}
          >
            <div className="flex flex-col gap-y-4 p-2">
              <p className="text-xs font-medium leading-none text-muted-foreground">
                {currentUser.emailAddress}
              </p>
              <div className="flex items-center gap-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={currentUser.imageUrl} />
                  <AvatarFallback>
                    {currentUser.firstName[0]} {currentUser.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex w-full flex-col">
                  <p className="max-w-52 truncate text-sm">
                    {currentUser.firstName} {currentUser.lastName}
                  </p>
                  <p className="truncate text-xs">{currentUser.role}</p>
                </div>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="w-full cursor-pointer p-0">
              <Button
                className="w-full gap-x-2"
                variant="ghost"
                size="sm"
                onClick={() => router.push("/dashboard/settings/preferences")}
              >
                <Settings2 className="h-4 w-4 shrink-0" />
                <span className="font-semibold">Preferences</span>
              </Button>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="w-full cursor-pointer p-0">
              <Button
                className="w-full gap-x-2"
                variant="ghost"
                size="sm"
                onClick={() => router.push("/dashboard/settings/account")}
              >
                <UserRound className="h-4 w-4 shrink-0" />
                <span className="font-semibold">Account settings</span>
              </Button>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="w-full cursor-pointer p-0">
              <Button
                className="w-full gap-x-2"
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 shrink-0" />
                <span className="font-semibold">Sign out</span>
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="h-10 w-10 shrink-0 rounded-full bg-muted" />
      )}
    </>
  );
}

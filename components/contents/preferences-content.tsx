"use client";

import { useQuery } from "convex/react";
import { useMediaQuery } from "usehooks-ts";
import { BellRing, Shield } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { useModalStore } from "@/stores/use-modal-store";
import { Button } from "@/components/ui/button";
import Hint from "@/components/ui/hint";

export default function PreferencesContent() {
  const { handleOpen } = useModalStore();
  const matchesSmMediaQuery = useMediaQuery("(min-width: 640px)");
  const currentUser = useQuery(api.users.currentUser);
  const notificationPreferences = useQuery(
    api.notification_preferences.getNotificationPreferences,
  );
  const presencePreferences = useQuery(
    api.presence_preferences.getPresencePreferences,
  );

  return (
    <div className="flex items-center gap-x-4">
      {currentUser && (
        <>
          {matchesSmMediaQuery ? (
            <>
              <Button
                className="gap-x-2"
                onClick={() =>
                  handleOpen("manageNotifications", {
                    user: currentUser,
                    notificationPreferences,
                  })
                }
              >
                <BellRing className="h-4 w-4 shrink-0" />
                <span className="font-semibold">Configure notifications</span>
              </Button>
              <Button
                className="gap-x-2"
                variant="secondary"
                onClick={() =>
                  handleOpen("managePresence", { presencePreferences })
                }
              >
                <Shield className="h-4 w-4 shrink-0" />
                <span className="font-semibold">Manage presence</span>
              </Button>
            </>
          ) : (
            <>
              <Hint
                label="Configure notifications"
                side="bottom"
                sideOffset={10}
                asChild
              >
                <Button
                  size="icon"
                  onClick={() =>
                    handleOpen("manageNotifications", {
                      user: currentUser,
                      notificationPreferences,
                    })
                  }
                >
                  <BellRing className="h-4 w-4 shrink-0" />
                </Button>
              </Hint>
              <Hint
                label="Manage presence"
                side="bottom"
                sideOffset={10}
                asChild
              >
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() =>
                    handleOpen("managePresence", { presencePreferences })
                  }
                >
                  <Shield className="h-4 w-4 shrink-0" />
                </Button>
              </Hint>
            </>
          )}
        </>
      )}
    </div>
  );
}

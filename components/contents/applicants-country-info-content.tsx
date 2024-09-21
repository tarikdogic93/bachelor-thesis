"use client";

import { useQuery } from "convex/react";
import { Earth } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { Spinner } from "@/components/ui/spinner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import GeoChart from "@/components/charts/geo-chart";

export default function ApplicantsCountryInfoContent() {
  const result = useQuery(api.analytics.getUsersCountryInfo, {
    role: "Applicant",
  });

  return (
    <div className="flex h-full items-center justify-center py-8">
      <Card className="w-80 sm:w-[400px] md:w-[500px]">
        <CardHeader className="border-b">
          <CardTitle className="break-words text-center">
            Applicants geographic distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="flex h-80 w-full flex-col items-center p-0 px-6">
          {result ? (
            <>
              {result.usersWithCountryCount > 0 ? (
                <div className="w-full flex-1">
                  <GeoChart data={result.usersCountryInfo} />
                </div>
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-x-2 gap-y-1 text-center text-muted-foreground md:flex-row">
                  <Earth className="h-5 w-5 shrink-0" />
                  <p>No country info provided.</p>
                </div>
              )}
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Spinner type="circular" size="sm" />
            </div>
          )}
        </CardContent>
        {result && result.usersWithCountryCount > 0 && (
          <CardFooter className="px-0">
            <div className="w-full text-center">
              <p className="font-semibold text-primary/80">{`Total applicants: ${result.usersCount}`}</p>
              <p className="text-sm font-medium text-primary/50">{`Applicants with country info provided: ${result.usersWithCountryCount}`}</p>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

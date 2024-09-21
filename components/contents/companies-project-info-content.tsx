"use client";

import { useQuery } from "convex/react";
import { Presentation } from "lucide-react";

import { cn } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import { Spinner } from "@/components/ui/spinner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CompaniesProjectInfoChart from "@/components/charts/companies-project-info-chart";

export default function CompaniesProjectInfoContent() {
  const result = useQuery(api.analytics.getCompaniesProjectInfo);

  return (
    <div className="flex h-full items-center justify-center py-8">
      <Card
        className={cn("w-80 sm:w-[400px] md:w-[500px]", {
          "xl:w-[850px]": result && result.companiesWithProjectCount > 0,
        })}
      >
        <CardHeader className="border-b">
          <CardTitle className="break-words text-center">
            Project categories across companies
          </CardTitle>
        </CardHeader>
        <CardContent className="flex h-80 w-full flex-col items-center p-0">
          {result ? (
            <>
              {result.companiesWithProjectCount > 0 ? (
                <div className="w-full flex-1">
                  <CompaniesProjectInfoChart
                    data={result.companiesProjectInfo}
                  />
                </div>
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-x-2 gap-y-1 text-center text-muted-foreground md:flex-row">
                  <Presentation className="h-5 w-5 shrink-0" />
                  <p>No project info provided.</p>
                </div>
              )}
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Spinner type="circular" size="sm" />
            </div>
          )}
        </CardContent>
        {result && result.companiesWithProjectCount > 0 && (
          <CardFooter className="px-0">
            <div className="w-full text-center">
              <p className="font-semibold text-primary/80">{`Total companies: ${result.companiesCount}`}</p>
              <p className="text-sm font-medium text-primary/50">{`Companies with project info provided: ${result.companiesWithProjectCount}`}</p>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

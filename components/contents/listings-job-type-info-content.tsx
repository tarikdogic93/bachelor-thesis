"use client";

import { useQuery } from "convex/react";
import { List } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { Spinner } from "@/components/ui/spinner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ListingsJobTypeInfoChart from "@/components/charts/listings-job-type-info-chart";

export default function ListingsJobTypeInfoContent() {
  const result = useQuery(api.analytics.getListingsJobTypeInfo);

  return (
    <div className="flex h-full items-center justify-center py-8">
      <Card className="w-80 sm:w-[400px] md:w-[500px]">
        <CardHeader className="border-b">
          <CardTitle className="break-words text-center">
            Discover trends in job types
          </CardTitle>
        </CardHeader>
        <CardContent className="flex h-80 w-full flex-col items-center p-0">
          {result ? (
            <>
              {result.companiesWithJobListingsCount > 0 ? (
                <>
                  <div className="w-full flex-1">
                    <ListingsJobTypeInfoChart
                      data={result.listingsJobTypeInfo}
                    />
                  </div>
                </>
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-x-2 gap-y-1 text-center text-muted-foreground md:flex-row">
                  <List className="h-5 w-5 shrink-0" />
                  <p>No job listings posted.</p>
                </div>
              )}
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Spinner type="circular" size="sm" />
            </div>
          )}
        </CardContent>
        {result && (
          <CardFooter className="px-0">
            <div className="w-full text-center">
              <p className="font-semibold text-primary/80">{`Total companies: ${result.companiesCount}`}</p>
              <p className="text-sm font-medium text-primary/50">{`Total job listings posted: ${result.listingsCount}`}</p>
              <p className="text-xs font-medium text-primary/30">{`Companies with posted job listings: ${result.companiesWithJobListingsCount}`}</p>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

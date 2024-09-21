"use client";

import { useQuery } from "convex/react";
import { Calendar } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { Spinner } from "@/components/ui/spinner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CompaniesEstablishmentInfoChart from "@/components/charts/companies-establishment-info-chart";

export default function CompaniesEstablishmentInfoContent() {
  const result = useQuery(api.analytics.getCompaniesEstablishmentInfo);

  return (
    <div className="flex h-full items-center justify-center py-8">
      <Card className="w-80 sm:w-[400px] md:w-[500px]">
        <CardHeader className="border-b">
          <CardTitle className="break-words text-center">
            Companies establishment year overview
          </CardTitle>
        </CardHeader>
        <CardContent className="flex h-80 w-full flex-col items-center p-0">
          {result ? (
            <>
              {result.companiesWithEstablishmentCount > 0 ? (
                <div className="w-full flex-1">
                  <CompaniesEstablishmentInfoChart
                    data={[
                      {
                        id: "establishment",
                        data: result.companiesEstablishmentInfo,
                      },
                    ]}
                  />
                </div>
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-x-2 gap-y-1 text-center text-muted-foreground md:flex-row">
                  <Calendar className="h-5 w-5 shrink-0" />
                  <p>No establishment year info provided.</p>
                </div>
              )}
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Spinner type="circular" size="sm" />
            </div>
          )}
        </CardContent>
        {result && result.companiesWithEstablishmentCount > 0 && (
          <CardFooter className="px-0">
            <div className="w-full text-center">
              <p className="font-semibold text-primary/80">{`Total companies: ${result.companiesCount}`}</p>
              <p className="text-sm font-medium text-primary/50">{`Companies with estab. year info provided: ${result.companiesWithEstablishmentCount}`}</p>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

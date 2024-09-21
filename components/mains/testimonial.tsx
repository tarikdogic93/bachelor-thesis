import Image from "next/image";
import { CalendarDays } from "lucide-react";

import { TestimonialType } from "@/data/testimonials-data";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

type TestimonialProps = {
  testimonial: TestimonialType;
};

export default function Testimonial({
  testimonial: { src, alt, content, description, name, company, role, date },
}: TestimonialProps) {
  return (
    <Card>
      <CardHeader className="relative">
        <Avatar className="h-28 w-28">
          <AvatarImage src={src} />
          <AvatarFallback>{alt}</AvatarFallback>
        </Avatar>
        <div className="absolute left-28 top-2 h-10 w-10">
          <Image
            className="-skew-x-[24deg] -scale-x-100 object-contain"
            src="/icons/quotes.svg"
            alt="Quotes"
            fill
          />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-md text-primary">&mdash; {content}</p>
      </CardContent>
      <Separator className="mb-4 w-3/4" />
      <CardFooter>
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button className="text-md p-0 font-semibold" variant="link">
              {description}
              {" / "}
              {name}
            </Button>
          </HoverCardTrigger>
          <HoverCardContent>
            <div className="flex justify-between gap-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={src} />
                <AvatarFallback>{alt}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">@{company}</h4>
                <p className="text-sm">{role}</p>
                <div className="flex items-center pt-2">
                  <CalendarDays className="mr-2 h-4 w-4 shrink-0 opacity-70" />{" "}
                  <span className="text-xs text-muted-foreground">
                    Joined {date}
                  </span>
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </CardFooter>
    </Card>
  );
}

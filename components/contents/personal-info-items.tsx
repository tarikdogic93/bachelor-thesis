"use client";

import {
  ALargeSmall,
  Building2,
  Cake,
  Calendar,
  CalendarDays,
  CaseSensitive,
  CaseUpper,
  Dna,
  Earth,
  Languages,
  Link2,
  Mail,
  MapPin,
  Phone,
  Users,
} from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Doc } from "@/convex/_generated/dataModel";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import PersonalInfoItem from "@/components/contents/personal-info-item";

type PersonalInfoItemsProps = {
  user: Doc<"users">;
  viewOnly?: boolean;
};

export default function PersonalInfoItems({
  user,
  viewOnly,
}: PersonalInfoItemsProps) {
  return (
    <ScrollArea
      className={cn("px-6 sm:pl-0 sm:pr-6", {
        "px-6 sm:px-6": !!viewOnly,
      })}
    >
      <div
        className={cn("flex max-h-40 w-72 flex-col items-start gap-y-6", {
          "w-full": !!viewOnly,
        })}
      >
        <PersonalInfoItem
          icon={CaseSensitive}
          hintLabel="First name"
          label={
            user.firstName
              ? user.firstName
              : viewOnly
                ? "First name not provided"
                : "Add first name"
          }
          user={user}
          addMissingData={viewOnly ? false : !user.firstName}
          disableEdit={viewOnly}
          viewOnly={viewOnly}
          focusField="firstName"
        />
        <PersonalInfoItem
          icon={ALargeSmall}
          hintLabel="Last name"
          label={
            user.lastName
              ? user.lastName
              : viewOnly
                ? "Last name not provided"
                : "Add last name"
          }
          user={user}
          addMissingData={viewOnly ? false : !user.lastName}
          disableEdit={viewOnly}
          viewOnly={viewOnly}
          focusField="lastName"
        />
        {user.role === "Company" && (
          <PersonalInfoItem
            icon={CaseUpper}
            hintLabel="Company name"
            label={
              user.companyName
                ? user.companyName
                : viewOnly
                  ? "Company name not provided"
                  : "Add company name"
            }
            user={user}
            addMissingData={viewOnly ? false : !user.companyName}
            disableEdit={viewOnly}
            viewOnly={viewOnly}
            focusField="companyName"
          />
        )}
        <PersonalInfoItem
          icon={Mail}
          hintLabel="Email address"
          label={
            user.emailAddress
              ? user.emailAddress
              : viewOnly
                ? "Email address not provided"
                : "Add email address"
          }
          user={user}
          disableEdit
          viewOnly={viewOnly}
        />
        <PersonalInfoItem
          icon={CalendarDays}
          hintLabel="Date joined"
          label={format(user._creationTime, "PPP")}
          user={user}
          disableEdit
          viewOnly={viewOnly}
        />
        {user.role === "Applicant" && (
          <>
            <PersonalInfoItem
              icon={Dna}
              hintLabel="Gender"
              label={
                user.gender
                  ? user.gender
                  : viewOnly
                    ? "Gender not provided"
                    : "Add gender"
              }
              user={user}
              addMissingData={viewOnly ? false : !user.gender}
              disableEdit={viewOnly}
              viewOnly={viewOnly}
              focusField="gender"
            />
            <PersonalInfoItem
              icon={Cake}
              hintLabel="Age"
              label={
                user.age
                  ? `${user.age} years old`
                  : viewOnly
                    ? "Age not provided"
                    : "Add age"
              }
              user={user}
              addMissingData={viewOnly ? false : !user.age}
              disableEdit={viewOnly}
              viewOnly={viewOnly}
              focusField="age"
            />
          </>
        )}
        {user.role !== "Admin" && (
          <>
            <Separator />
            <PersonalInfoItem
              icon={Earth}
              hintLabel="Country"
              label={
                user.country && user.country.name
                  ? user.country.name
                  : viewOnly
                    ? "Country not provided"
                    : "Add country"
              }
              user={user}
              addMissingData={viewOnly ? false : !user.country}
              disableEdit={viewOnly}
              viewOnly={viewOnly}
              focusField="country"
            />
            <PersonalInfoItem
              icon={Building2}
              hintLabel="City"
              label={
                user.city
                  ? user.city
                  : viewOnly
                    ? "City not provided"
                    : "Add city"
              }
              user={user}
              addMissingData={viewOnly ? false : !user.city}
              disableEdit={viewOnly}
              viewOnly={viewOnly}
              focusField="city"
            />
            <PersonalInfoItem
              icon={MapPin}
              hintLabel="Street address"
              label={
                user.streetAddress
                  ? user.streetAddress
                  : viewOnly
                    ? "Street address not provided"
                    : "Add street address"
              }
              user={user}
              addMissingData={viewOnly ? false : !user.streetAddress}
              disableEdit={viewOnly}
              viewOnly={viewOnly}
              focusField="streetAddress"
            />
            <PersonalInfoItem
              icon={Phone}
              hintLabel="Phone number"
              label={
                user.phoneNumber
                  ? user.phoneNumber
                  : viewOnly
                    ? "Phone number not provided"
                    : "Add phone number"
              }
              user={user}
              addMissingData={viewOnly ? false : !user.phoneNumber}
              disableEdit={viewOnly}
              viewOnly={viewOnly}
              focusField="phoneNumber"
            />
          </>
        )}
        {user.role === "Company" && (
          <>
            <Separator />
            <PersonalInfoItem
              icon={Calendar}
              hintLabel="Establishment year"
              label={
                user.establishmentYear
                  ? user.establishmentYear
                  : viewOnly
                    ? "Establishment year not provided"
                    : "Add establishment year"
              }
              user={user}
              addMissingData={viewOnly ? false : !user.establishmentYear}
              disableEdit={viewOnly}
              viewOnly={viewOnly}
              focusField="establishmentYear"
            />
            <PersonalInfoItem
              icon={Users}
              hintLabel="Number of employees"
              label={
                user.numberOfEmployees
                  ? user.numberOfEmployees
                  : viewOnly
                    ? "Number of employees not provided"
                    : "Add number of employees"
              }
              user={user}
              addMissingData={viewOnly ? false : !user.numberOfEmployees}
              disableEdit={viewOnly}
              viewOnly={viewOnly}
              focusField="numberOfEmployees"
            />
          </>
        )}
        {user.role === "Applicant" && (
          <>
            <Separator />
            {user.languages && user.languages.length > 0
              ? user.languages.map((language, index: number) => (
                  <PersonalInfoItem
                    key={`languages-${index}`}
                    icon={Languages}
                    hintLabel="Language"
                    label={language}
                    user={user}
                    disableEdit={viewOnly}
                    viewOnly={viewOnly}
                    focusField="addLanguages"
                  />
                ))
              : viewOnly && (
                  <PersonalInfoItem
                    icon={Languages}
                    hintLabel="Language"
                    label="Languages not provided"
                    user={user}
                    disableEdit={viewOnly}
                    viewOnly={viewOnly}
                  />
                )}
            {!viewOnly && (
              <PersonalInfoItem
                icon={Languages}
                hintLabel="Language"
                label="Add languages"
                user={user}
                addMissingData
                disableEdit
                viewOnly={viewOnly}
                focusField="addLanguages"
              />
            )}
          </>
        )}
        {user.role !== "Admin" && (
          <>
            <Separator />
            {user.socialMediaLinks && user.socialMediaLinks.length > 0
              ? user.socialMediaLinks.map((link: string, index: number) => (
                  <PersonalInfoItem
                    key={`social-media-links-${index}`}
                    icon={Link2}
                    hintLabel="Social media link"
                    label={link}
                    user={user}
                    isLink
                    href={link}
                    disableEdit={viewOnly}
                    viewOnly={viewOnly}
                    focusField={`socialMediaLinks${index}`}
                  />
                ))
              : viewOnly && (
                  <PersonalInfoItem
                    icon={Link2}
                    hintLabel="Social media link"
                    label="Social media links not provided"
                    user={user}
                    disableEdit={viewOnly}
                    viewOnly={viewOnly}
                  />
                )}
            {!viewOnly && (
              <PersonalInfoItem
                icon={Link2}
                hintLabel="Social media link"
                label="Add social media link"
                user={user}
                addMissingData
                disableEdit
                viewOnly={viewOnly}
                focusField="addSocialMediaLink"
              />
            )}
          </>
        )}
      </div>
    </ScrollArea>
  );
}

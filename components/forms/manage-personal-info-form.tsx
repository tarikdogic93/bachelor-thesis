"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import { useMutation } from "convex/react";
import { zodResolver } from "@hookform/resolvers/zod";

import { handleError } from "@/lib/utils";
import { countries } from "@/data/countries-data";
import { languages } from "@/data/languages-data";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { createPersonalInfoFormSchema } from "@/schemas/profile-schemas";
import { updateClerkUser } from "@/actions/users";
import { FocusFieldType, useModalStore } from "@/stores/use-modal-store";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { LoadingButton } from "@/components/buttons/loading-button";
import InputControl from "@/components/form-controls/input-control";
import CommandControl from "@/components/form-controls/command-control";
import MultiCommandControl from "@/components/form-controls/multi-command-control";
import SelectControl from "@/components/form-controls/select-control";
import MultiInputControl from "@/components/form-controls/multi-input-control";

type ManagePersonalInfoFormProps = {
  user: Doc<"users">;
  focusField: FocusFieldType | null;
};

export default function ManagePersonalInfoForm({
  user,
  focusField,
}: ManagePersonalInfoFormProps) {
  const [isPending, startTransition] = useTransition();
  const [editImage, setEditImage] = useState(false);
  const { handleClose } = useModalStore();
  const imageDivRef = useRef<HTMLDivElement>(null);
  const updateUser = useMutation(api.users.updateUser);

  const personalInfoFormSchema = createPersonalInfoFormSchema(user.role);

  type PersonalInfoFormValuesType = z.infer<typeof personalInfoFormSchema>;

  const defaultValues: PersonalInfoFormValuesType = {
    firstName: "",
    lastName: "",
    companyName: "",
    image: undefined,
    gender: "",
    age: "",
    streetAddress: "",
    phoneNumber: "",
    country: "",
    city: "",
    establishmentYear: "",
    numberOfEmployees: "",
    languages: [],
    socialMediaLinks: [],
  };

  let newDefaultValues = defaultValues;

  if (user) {
    const commonKeys = Object.keys(defaultValues) as Array<
      keyof PersonalInfoFormValuesType
    >;

    newDefaultValues = Object.fromEntries(
      commonKeys.map((key) => {
        if (key === "image") {
          return [key, defaultValues[key]];
        }

        if (key === "age") {
          return [key, user.age?.toString() || defaultValues[key]];
        }

        if (key === "country") {
          return [key, user.country?.name || defaultValues[key]];
        }

        if (key === "establishmentYear") {
          return [
            key,
            user.establishmentYear?.toString() || defaultValues[key],
          ];
        }

        if (key === "numberOfEmployees") {
          return [
            key,
            user.numberOfEmployees?.toString() || defaultValues[key],
          ];
        }

        if (key === "socialMediaLinks") {
          return [
            key,
            user.socialMediaLinks?.map((link) => ({ value: link })) ||
              defaultValues[key],
          ];
        }

        return [key, user[key] || defaultValues[key]];
      }),
    ) as PersonalInfoFormValuesType;
  }

  const personalInfoForm = useForm<PersonalInfoFormValuesType>({
    resolver: zodResolver(personalInfoFormSchema),
    defaultValues: newDefaultValues,
  });

  function handlePersonalInfoUpdate({
    firstName,
    lastName,
    image,
    gender,
    age,
    country,
    establishmentYear,
    numberOfEmployees,
    socialMediaLinks,
    ...restValues
  }: PersonalInfoFormValuesType) {
    if (user) {
      startTransition(async () => {
        const alpha3Code = countries.find(
          (obj) => obj.name === country,
        )?.alpha3Code;

        if (
          user.firstName !== firstName ||
          user.lastName !== lastName ||
          image
        ) {
          const values = new FormData();

          if (user.firstName !== firstName) {
            values.append("firstName", firstName);
          }

          if (user.lastName !== lastName) {
            values.append("lastName", lastName);
          }

          if (image) {
            values.append("image", image);
          }

          const response = await updateClerkUser(user.externalId, values);

          if ("error" in response) {
            toast.error(response.error);

            return;
          }
        }

        try {
          await updateUser({
            ...restValues,
            userId: user._id,
            gender: gender as Doc<"users">["gender"],
            age: age ? Number(age) : undefined,
            country:
              country && alpha3Code ? { name: country, alpha3Code } : undefined,
            establishmentYear: establishmentYear
              ? Number(establishmentYear)
              : undefined,
            numberOfEmployees: numberOfEmployees
              ? Number(numberOfEmployees)
              : undefined,
            socialMediaLinks: socialMediaLinks
              ? socialMediaLinks.map((link) => link.value)
              : undefined,
          });

          toast.success("Your information has been successfully updated.");

          setEditImage(false);

          handleClose();
        } catch (error) {
          toast.error(handleError(error));
        }
      });
    }
  }

  useEffect(() => {
    if (focusField === "image" && imageDivRef.current) {
      imageDivRef.current.focus();
    }
  }, [focusField]);

  return (
    <Form {...personalInfoForm}>
      <form
        className="space-y-4"
        onSubmit={personalInfoForm.handleSubmit(handlePersonalInfoUpdate)}
        noValidate
      >
        <InputControl
          control={personalInfoForm.control}
          name="firstName"
          label="First name"
          autoFocus={focusField === "firstName"}
          placeholder="Enter first name"
          disabled={isPending}
        />
        <InputControl
          control={personalInfoForm.control}
          name="lastName"
          label="Last name"
          autoFocus={focusField === "lastName"}
          placeholder="Enter last name"
          disabled={isPending}
        />
        {user.role === "Company" && (
          <InputControl
            control={personalInfoForm.control}
            name="companyName"
            label="Company name"
            autoFocus={focusField === "companyName"}
            placeholder="Enter company name"
            disabled={isPending}
          />
        )}
        {!editImage && user.imageUrl ? (
          <div
            className="group relative aspect-square w-1/2 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            tabIndex={0}
            ref={imageDivRef}
          >
            <Image
              className="rounded-md object-cover"
              src={user.imageUrl}
              alt="User image"
              fill
            />
            <Button
              className="absolute -right-2 -top-2 hidden h-6 w-6 cursor-pointer rounded-full disabled:opacity-80 group-hover:flex"
              variant="secondary"
              size="icon"
              onClick={() => setEditImage(true)}
            >
              <Pencil className="h-3.5 w-3.5 shrink-0" />
            </Button>
          </div>
        ) : (
          <InputControl
            control={personalInfoForm.control}
            type="file"
            name="image"
            label="Upload image"
            accept="image/*"
            autoFocus={focusField === "image"}
            disabled={isPending}
          />
        )}
        {user.role === "Applicant" && (
          <>
            <SelectControl
              control={personalInfoForm.control}
              name="gender"
              label="Gender"
              autoFocus={focusField === "gender"}
              placeholder="Choose your gender"
              items={Object.values(["Male", "Female"] as Exclude<
                Doc<"users">["gender"],
                undefined
              >[]).map((gender) => ({
                label: gender,
                value: gender,
              }))}
              disabled={isPending}
            />
            <InputControl
              control={personalInfoForm.control}
              type="number"
              step={1}
              min={18}
              name="age"
              label="Age"
              autoFocus={focusField === "age"}
              placeholder="Enter your age"
              disabled={isPending}
            />
          </>
        )}
        {user.role !== "Admin" && (
          <>
            <CommandControl
              control={personalInfoForm.control}
              name="country"
              label="Country"
              items={countries.map((country) => country.name)}
              placeholder="Choose your country"
              autoFocus={focusField === "country"}
              disabled={isPending}
            />
            <InputControl
              control={personalInfoForm.control}
              name="city"
              label="City"
              autoFocus={focusField === "city"}
              placeholder="Enter your city"
              disabled={isPending}
            />
            <InputControl
              control={personalInfoForm.control}
              name="streetAddress"
              label="Street address"
              autoFocus={focusField === "streetAddress"}
              placeholder="Enter your street address"
              disabled={isPending}
            />
            <InputControl
              control={personalInfoForm.control}
              type="tel"
              name="phoneNumber"
              label="Phone number"
              autoFocus={focusField === "phoneNumber"}
              placeholder="Enter your phone number"
              disabled={isPending}
            />
          </>
        )}
        {user.role === "Company" && (
          <>
            <SelectControl
              control={personalInfoForm.control}
              name="establishmentYear"
              label="Establishment year"
              placeholder="Choose a year"
              autoFocus={focusField === "establishmentYear"}
              items={Array.from(
                { length: new Date().getFullYear() - 1970 + 1 },
                (_, index) => ({
                  label: (1970 + index).toString(),
                  value: (1970 + index).toString(),
                }),
              )}
              disabled={isPending}
            />
            <InputControl
              control={personalInfoForm.control}
              type="number"
              step={1}
              min={1}
              name="numberOfEmployees"
              label="Number of employees"
              autoFocus={focusField === "numberOfEmployees"}
              placeholder="Enter number of employees"
              disabled={isPending}
            />
          </>
        )}
        {user.role === "Applicant" && (
          <MultiCommandControl
            control={personalInfoForm.control}
            name="languages"
            label="Languages"
            placeholder="Choose your languages"
            items={languages}
            autoFocus={focusField === "addLanguages"}
            disabled={isPending}
          />
        )}
        {user.role !== "Admin" && (
          <MultiInputControl
            control={personalInfoForm.control}
            name="socialMediaLinks"
            label="Social media links"
            placeholder="Enter social media link"
            buttonText="Add social media link"
            inputAutoFocus={
              focusField?.includes("socialMediaLinks")
                ? parseInt(focusField.substring("socialMediaLinks".length))
                : undefined
            }
            buttonAutoFocus={focusField === "addSocialMediaLink"}
            disabled={isPending}
          />
        )}
        {isPending ? <LoadingButton /> : <Button type="submit">Submit</Button>}
      </form>
    </Form>
  );
}

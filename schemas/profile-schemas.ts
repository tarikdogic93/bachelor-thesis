import { z } from "zod";
import { Doc } from "@/convex/_generated/dataModel";

const MAX_UPLOAD_SIZE = 1024 * 1024;
const ACCEPTED_FILE_TYPES = ["image/jpg", "image/jpeg", "image/png"];

const phoneRegex = new RegExp(/^\+?\d+$/);

export const createPersonalInfoFormSchema = (role: Doc<"users">["role"]) => {
  return z.object({
    firstName: z
      .string()
      .refine((firstName) => (firstName ? !!firstName.trim() : false), {
        message: "First name is required",
      })
      .transform((firstName) => firstName.trim()),
    lastName: z
      .string()
      .refine((lastName) => (lastName ? !!lastName.trim() : false), {
        message: "Last name is required",
      })
      .transform((lastName) => lastName.trim()),
    companyName: z
      .string()
      .optional()
      .transform((companyName) =>
        companyName && companyName.trim() ? companyName.trim() : undefined,
      ),
    image: z
      .instanceof(File, {
        message: "Must be a file",
      })
      .optional()
      .refine((file) => {
        return !file || file.size <= MAX_UPLOAD_SIZE;
      }, "File size cannot be more than 1MB")
      .refine((file) => {
        return !file || ACCEPTED_FILE_TYPES.includes(file.type);
      }, "File must be an image"),
    gender: z
      .string()
      .optional()
      .transform((gender) =>
        gender && gender.trim() ? gender.trim() : undefined,
      )
      .refine(
        (gender) => {
          if (gender) {
            return Object.values([
              "Male",
              "Female",
            ] as Doc<"users">["gender"][]).includes(
              gender as Doc<"users">["gender"],
            );
          }

          return true;
        },
        { message: "Invalid gender" },
      ),
    age: z
      .string()
      .optional()
      .refine(
        (age) => {
          if (age) {
            return (
              !isNaN(Number(age)) &&
              parseInt(age, 10).toString() === age &&
              Number(age) >= 18
            );
          }

          return true;
        },
        {
          message: "Age must be an integer greater than or equal to 18",
        },
      )
      .transform((age) => (age && age.trim() ? age.trim() : undefined)),
    country: z
      .string()
      .optional()
      .transform((country) =>
        country && country.trim() ? country.trim() : undefined,
      ),
    city: z
      .string()
      .optional()
      .transform((city) => (city && city.trim() ? city.trim() : undefined)),
    streetAddress: z
      .string()
      .optional()
      .transform((streetAddress) =>
        streetAddress && streetAddress.trim()
          ? streetAddress.trim()
          : undefined,
      ),
    phoneNumber: z
      .string()
      .optional()
      .transform((phoneNumber) =>
        phoneNumber && phoneNumber.trim() ? phoneNumber.trim() : undefined,
      )
      .refine(
        (phoneNumber) => {
          if (phoneNumber) {
            return phoneRegex.test(phoneNumber.trim());
          }

          return true;
        },
        {
          message:
            "Phone number must contain at least one digit, can start with a + and otherwise cannot have non-digit characters",
        },
      ),
    establishmentYear: z
      .string()
      .optional()
      .refine(
        (establishmentYear) => {
          if (establishmentYear) {
            return (
              !isNaN(Number(establishmentYear)) &&
              parseInt(establishmentYear, 10).toString() ===
                establishmentYear &&
              Number(establishmentYear) >= 1970
            );
          }

          return true;
        },
        {
          message:
            "Establishment year must be an integer greater than or equal 1970",
        },
      )
      .transform((establishmentYear) =>
        establishmentYear && establishmentYear.trim()
          ? establishmentYear.trim()
          : undefined,
      ),
    numberOfEmployees: z
      .string()
      .optional()
      .refine(
        (numberOfEmployees) => {
          if (numberOfEmployees) {
            return (
              !isNaN(Number(numberOfEmployees)) &&
              parseInt(numberOfEmployees, 10).toString() ===
                numberOfEmployees &&
              Number(numberOfEmployees) > 0
            );
          }

          return true;
        },
        {
          message: "Number of employees must be an integer greater than 0",
        },
      )
      .transform((numberOfEmployees) =>
        numberOfEmployees && numberOfEmployees.trim()
          ? numberOfEmployees.trim()
          : undefined,
      ),
    languages: z
      .array(z.string().transform((value) => value.trim()))
      .transform((languages) => (role === "Applicant" ? languages : undefined)),
    socialMediaLinks: z
      .array(
        z.object({
          value: z.string().transform((value) => value.trim()),
        }),
      )
      .transform((socialMediaLinks) =>
        role !== "Admin" ? socialMediaLinks : undefined,
      ),
  });
};

export const skillFormSchema = z.object({
  name: z
    .string()
    .refine((name) => (name ? !!name.trim() : false), {
      message: "Skill name is required",
    })
    .transform((name) => name.trim()),
  rating: z
    .number()
    .int()
    .min(0, {
      message: "Rating must be at least 0",
    })
    .max(10, {
      message: "Rating cannot exceed 10",
    }),
  description: z
    .string()
    .max(500, { message: "Description cannot exceed 500 characters" })
    .optional()
    .transform((description) =>
      description && description.trim() ? description.trim() : undefined,
    ),
});

export const achievementFormSchema = z.object({
  title: z
    .string()
    .refine((title) => (title ? !!title.trim() : false), {
      message: "Title is required",
    })
    .transform((title) => title.trim()),
  category: z
    .string()
    .refine((category) => (category ? !!category.trim() : false), {
      message: "Category is required",
    })
    .transform((category) => category.trim())
    .refine(
      (category) =>
        Object.values([
          "Academic",
          "Professional",
          "Personal",
        ] as Doc<"achievements">["category"][]).includes(
          category as Doc<"achievements">["category"],
        ),
      { message: "Invalid category" },
    ),
  date: z
    .string()
    .refine((date) => (date ? !!date.trim() : false), {
      message: "Date is required",
    })
    .transform((date) => date.trim()),
  affiliatedWith: z
    .string()
    .refine(
      (affiliatedWith) => (affiliatedWith ? !!affiliatedWith.trim() : false),
      {
        message: "Affiliation information is required",
      },
    )
    .transform((affiliatedWith) => affiliatedWith.trim()),
  description: z
    .string()
    .max(500, { message: "Description cannot exceed 500 characters" })
    .optional()
    .transform((description) =>
      description && description.trim() ? description.trim() : undefined,
    ),
});

export const experienceFormSchema = z
  .object({
    title: z
      .string()
      .refine((title) => (title ? !!title.trim() : false), {
        message: "Title is required",
      })
      .transform((title) => title.trim()),
    establishment: z
      .string()
      .refine(
        (establishment) => (establishment ? !!establishment.trim() : false),
        {
          message: "Establishment is required",
        },
      )
      .transform((establishment) => establishment.trim()),
    category: z
      .string()
      .refine((category) => (category ? !!category.trim() : false), {
        message: "Category is required",
      })
      .transform((category) => category.trim())
      .refine(
        (category) =>
          Object.values([
            "Education",
            "Certification",
            "Competition",
            "Internship",
            "Volunteer",
            "Freelance",
            "Work",
            "Research",
            "Entrepreneurial",
          ] as Doc<"experiences">["category"][]).includes(
            category as Doc<"experiences">["category"],
          ),
        { message: "Invalid category" },
      ),
    startDate: z
      .string()
      .refine((startDate) => (startDate ? !!startDate.trim() : false), {
        message: "Start date is required",
      })
      .transform((startDate) => startDate.trim()),
    endDate: z
      .string()
      .optional()
      .transform((endDate) =>
        endDate && endDate.trim() ? endDate.trim() : undefined,
      ),
    isOngoing: z.boolean(),
    country: z
      .string()
      .optional()
      .transform((country) =>
        country && country.trim() ? country.trim() : undefined,
      ),
    city: z
      .string()
      .optional()
      .transform((city) => (city && city.trim() ? city.trim() : undefined)),
    settingType: z
      .string()
      .refine((settingType) => (settingType ? !!settingType.trim() : false), {
        message: "Setting type is required",
      })
      .transform((settingType) => settingType.trim())
      .refine(
        (settingType) =>
          Object.values([
            "Onsite",
            "Hybrid",
            "Remote",
          ] as Doc<"experiences">["settingType"][]).includes(
            settingType as Doc<"experiences">["settingType"],
          ),
        { message: "Invalid setting type" },
      ),
    description: z
      .string()
      .max(500, { message: "Description cannot exceed 500 characters" })
      .optional()
      .transform((description) =>
        description && description.trim() ? description.trim() : undefined,
      ),
  })
  .refine(
    (data) => {
      if (!data.isOngoing) {
        return data.endDate ? !!data.endDate.trim() : false;
      }

      data.endDate = undefined;

      return true;
    },
    {
      message: "End date is required",
      path: ["endDate"],
    },
  )
  .superRefine((data, ctx) => {
    if (
      data.startDate &&
      data.endDate &&
      new Date(data.endDate).getTime() < new Date(data.startDate).getTime()
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End date cannot be before start date",
        path: ["startDate"],
      });

      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End date cannot be before start date",
        path: ["endDate"],
      });
    }
  })
  .refine(
    (data) => {
      if (data.settingType !== "Remote") {
        return data.country ? !!data.country.trim() : false;
      }

      data.country = undefined;

      return true;
    },
    {
      message: "Country is required",
      path: ["country"],
    },
  )
  .refine(
    (data) => {
      if (data.settingType !== "Remote") {
        return data.city ? !!data.city.trim() : false;
      }

      data.city = undefined;

      return true;
    },
    {
      message: "City is required",
      path: ["city"],
    },
  );

export const projectFormSchema = z
  .object({
    title: z
      .string()
      .refine((title) => (title ? !!title.trim() : false), {
        message: "Title is required",
      })
      .transform((title) => title.trim()),
    category: z
      .string()
      .refine((category) => (category ? !!category.trim() : false), {
        message: "Category is required",
      })
      .transform((category) => category.trim())
      .refine(
        (category) =>
          Object.values([
            "Web development",
            "Mobile app development",
            "Desktop app development",
            "Game development",
            "Database management system",
            "Content management system",
            "E-commerce platform development",
            "Artificial intelligence",
            "DevOps tools",
            "Cloud computing",
          ] as Doc<"projects">["category"][]).includes(
            category as Doc<"projects">["category"],
          ),
        { message: "Invalid category" },
      ),
    startDate: z
      .string()
      .refine((startDate) => (startDate ? !!startDate.trim() : false), {
        message: "Start date is required",
      })
      .transform((startDate) => startDate.trim()),
    endDate: z
      .string()
      .optional()
      .transform((endDate) =>
        endDate && endDate.trim() ? endDate.trim() : undefined,
      ),
    isOngoing: z.boolean(),
    numberOfPeople: z
      .string()
      .optional()
      .refine(
        (numberOfPeople) => {
          if (numberOfPeople) {
            return (
              !isNaN(Number(numberOfPeople)) &&
              parseInt(numberOfPeople, 10).toString() === numberOfPeople &&
              Number(numberOfPeople) > 0
            );
          }

          return true;
        },
        {
          message: "Number of people must be an integer greater than 0",
        },
      )
      .transform((numberOfPeople) =>
        numberOfPeople && numberOfPeople.trim()
          ? numberOfPeople.trim()
          : undefined,
      ),
    priceRangeMin: z
      .string()
      .optional()
      .refine(
        (priceRangeMin) => {
          if (priceRangeMin) {
            return (
              !isNaN(Number(priceRangeMin)) &&
              parseInt(priceRangeMin, 10).toString() === priceRangeMin &&
              Number(priceRangeMin) > 0
            );
          }

          return true;
        },
        {
          message: "Min price must be an integer greater than 0",
        },
      )
      .transform((priceRangeMin) =>
        priceRangeMin && priceRangeMin.trim()
          ? priceRangeMin.trim()
          : undefined,
      ),
    priceRangeMax: z
      .string()
      .optional()
      .refine(
        (priceRangeMax) => {
          if (priceRangeMax) {
            return (
              !isNaN(Number(priceRangeMax)) &&
              parseInt(priceRangeMax, 10).toString() === priceRangeMax &&
              Number(priceRangeMax) > 0
            );
          }

          return true;
        },
        {
          message: "Max price must be an integer greater than 0",
        },
      )
      .transform((priceRangeMax) =>
        priceRangeMax && priceRangeMax.trim()
          ? priceRangeMax.trim()
          : undefined,
      ),
    image: z
      .instanceof(File, {
        message: "Must be a file",
      })
      .optional()
      .refine((file) => {
        return !file || file.size <= MAX_UPLOAD_SIZE;
      }, "File size cannot be more than 1MB")
      .refine((file) => {
        return !file || ACCEPTED_FILE_TYPES.includes(file.type);
      }, "File must be an image"),
    description: z
      .string()
      .max(500, { message: "Description cannot exceed 500 characters" })
      .optional()
      .transform((description) =>
        description && description.trim() ? description.trim() : undefined,
      ),
  })
  .refine(
    (data) => {
      if (!data.isOngoing) {
        return data.endDate ? !!data.endDate.trim() : false;
      }

      data.endDate = undefined;

      return true;
    },
    {
      message: "End date is required",
      path: ["endDate"],
    },
  )
  .superRefine((data, ctx) => {
    if (
      data.startDate &&
      data.endDate &&
      new Date(data.endDate).getTime() < new Date(data.startDate).getTime()
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End date cannot be before start date",
        path: ["startDate"],
      });

      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End date cannot be before start date",
        path: ["endDate"],
      });
    }
  })
  .superRefine((data, ctx) => {
    if (data.priceRangeMin && !data.priceRangeMax) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Cannot have min price without max price",
        path: ["priceRangeMax"],
      });
    }

    if (data.priceRangeMax && !data.priceRangeMin) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Cannot have max price without min price",
        path: ["priceRangeMin"],
      });
    }

    if (
      data.priceRangeMin &&
      data.priceRangeMax &&
      Number(data.priceRangeMax) < Number(data.priceRangeMin)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Max price cannot be less than min price",
        path: ["priceRangeMin"],
      });

      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Max price cannot be less than min price",
        path: ["priceRangeMax"],
      });
    }
  });

import { z } from "zod";
import { Doc } from "@/convex/_generated/dataModel";

export const jobFormSchema = z
  .object({
    title: z
      .string()
      .refine((title) => (title ? !!title.trim() : false), {
        message: "Title is required",
      })
      .transform((title) => title.trim()),
    jobSector: z
      .string()
      .refine((jobSector) => (jobSector ? !!jobSector.trim() : false), {
        message: "Job sector is required",
      })
      .transform((jobSector) => jobSector.trim())
      .refine(
        (jobSector) =>
          Object.values([
            "Web development",
            "Mobile development",
            "Artificial intelligence",
            "DevOps engineering",
            "Cloud computing",
            "Other",
          ] as Doc<"jobs">["jobSector"][]).includes(
            jobSector as Doc<"jobs">["jobSector"],
          ),
        { message: "Invalid job sector" },
      ),
    jobType: z
      .string()
      .refine((jobType) => (jobType ? !!jobType.trim() : false), {
        message: "Job type is required",
      })
      .transform((jobType) => jobType.trim())
      .refine(
        (jobType) =>
          Object.values([
            "Full-time",
            "Part-time",
            "Contract",
            "Internship",
          ] as Doc<"jobs">["jobType"][]).includes(
            jobType as Doc<"jobs">["jobType"],
          ),
        { message: "Invalid job type" },
      ),
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
          ] as Doc<"jobs">["settingType"][]).includes(
            settingType as Doc<"jobs">["settingType"],
          ),
        { message: "Invalid setting type" },
      ),
    salaryRangeMin: z
      .string()
      .refine(
        (salaryRangeMin) => (salaryRangeMin ? !!salaryRangeMin.trim() : false),
        {
          message: "Min salary is required",
        },
      )
      .refine(
        (salaryRangeMin) => {
          if (salaryRangeMin) {
            return (
              !isNaN(Number(salaryRangeMin)) &&
              parseInt(salaryRangeMin, 10).toString() === salaryRangeMin &&
              Number(salaryRangeMin) > 0
            );
          }

          return true;
        },
        {
          message: "Min salary must be an integer greater than 0",
        },
      )
      .transform((salaryRangeMin) => salaryRangeMin.trim()),
    salaryRangeMax: z
      .string()
      .refine(
        (salaryRangeMax) => (salaryRangeMax ? !!salaryRangeMax.trim() : false),
        {
          message: "Max salary is required",
        },
      )
      .refine(
        (salaryRangeMax) => {
          if (salaryRangeMax) {
            return (
              !isNaN(Number(salaryRangeMax)) &&
              parseInt(salaryRangeMax, 10).toString() === salaryRangeMax &&
              Number(salaryRangeMax) > 0
            );
          }

          return true;
        },
        {
          message: "Max salary must be an integer greater than 0",
        },
      )
      .transform((salaryRangeMax) => salaryRangeMax.trim()),
    benefits: z.array(
      z.object({ value: z.string().transform((value) => value.trim()) }),
    ),
    educationLevel: z
      .string()
      .refine(
        (educationLevel) => (educationLevel ? !!educationLevel.trim() : false),
        {
          message: "Education level is required",
        },
      )
      .transform((educationLevel) => educationLevel.trim())
      .refine(
        (educationLevel) =>
          Object.values([
            "High school diploma",
            "Associate degree",
            "Bachelor's degree",
            "Master's degree",
            "PhD",
          ] as Doc<"jobs">["educationLevel"][]).includes(
            educationLevel as Doc<"jobs">["educationLevel"],
          ),
        { message: "Invalid education level" },
      ),
    experienceLevel: z
      .string()
      .refine(
        (experienceLevel) =>
          experienceLevel ? !!experienceLevel.trim() : false,
        {
          message: "Experience level is required",
        },
      )
      .transform((experienceLevel) => experienceLevel.trim())
      .refine(
        (experienceLevel) =>
          Object.values([
            "Entry level",
            "Mid-level",
            "Senior level",
          ] as Doc<"jobs">["experienceLevel"][]).includes(
            experienceLevel as Doc<"jobs">["experienceLevel"],
          ),
        { message: "Invalid experience level" },
      ),
    startDate: z
      .string()
      .refine((startDate) => (startDate ? !!startDate.trim() : false), {
        message: "Start date is required",
      })
      .transform((startDate) => startDate.trim()),
    techStack: z.array(
      z.object({ value: z.string().transform((value) => value.trim()) }),
    ),
    requirements: z.array(
      z.object({ value: z.string().transform((value) => value.trim()) }),
    ),
    responsibilities: z.array(
      z.object({ value: z.string().transform((value) => value.trim()) }),
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
  )
  .superRefine((data, ctx) => {
    if (
      data.salaryRangeMin &&
      data.salaryRangeMax &&
      Number(data.salaryRangeMax) < Number(data.salaryRangeMin)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Max salary cannot be less than min salary",
        path: ["salaryRangeMin"],
      });

      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Max salary cannot be less than min salary",
        path: ["salaryRangeMax"],
      });
    }
  });

export const manageJobRejectionFormSchema = z.object({
  text: z
    .string()
    .max(500, { message: "Text cannot exceed 500 characters" })
    .refine((text) => (text ? !!text.trim() : false), {
      message: "Text is required",
    })
    .transform((text) => text.trim()),
});

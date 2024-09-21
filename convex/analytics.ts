import { v } from "convex/values";

import { Doc } from "./_generated/dataModel";
import { query } from "./_generated/server";
import { checkUserRole, getCurrentUser } from "./users";

export const getApplicantsGenderInfo = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);

    if (!user) {
      return {
        applicantsCount: 0,
        applicantsWithGenderCount: 0,
        applicantsGenderInfo: [],
      };
    }

    await checkUserRole(user, "Admin");

    const users = await ctx.db
      .query("users")
      .withIndex("byRole", (q) => q.eq("role", "Applicant"))
      .collect();

    const applicantsCount = users.length;

    const applicantsWithGenderCount = users.reduce(
      (total, user) => total + (user.gender ? 1 : 0),
      0,
    );

    let applicantsGenderInfo: {
      id: Exclude<Doc<"users">["gender"], undefined>;
      label: string;
      value: number;
    }[] = [];

    users.forEach((user) => {
      const gender = user.gender;

      if (gender) {
        const existingGender = applicantsGenderInfo.find(
          (item) => item.id === gender,
        );

        if (existingGender) {
          existingGender.value = existingGender.value + 1;
        } else {
          applicantsGenderInfo.push({
            id: gender as Exclude<Doc<"users">["gender"], undefined>,
            label: gender as Exclude<Doc<"users">["gender"], undefined>,
            value: 1,
          });
        }
      }
    });

    return {
      applicantsCount,
      applicantsWithGenderCount,
      applicantsGenderInfo,
    };
  },
});

export const getApplicantsAgeInfo = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);

    if (!user) {
      return {
        applicantsCount: 0,
        applicantsWithAgeCount: 0,
        applicantsAgeInfo: [],
      };
    }

    await checkUserRole(user, "Admin");

    const users = await ctx.db
      .query("users")
      .withIndex("byRole", (q) => q.eq("role", "Applicant"))
      .collect();

    const applicantsCount = users.length;

    const applicantsWithAgeCount = users.reduce(
      (total, user) => total + (user.age ? 1 : 0),
      0,
    );

    let applicantsAgeInfo: {
      range: "18-29" | "30-39" | "40-49" | "50+";
      count: number;
    }[] = [];

    users.forEach((user) => {
      const age = user.age;

      if (age) {
        if (age >= 18 && age <= 29) {
          incrementAgeRange(applicantsAgeInfo, "18-29");
        } else if (age >= 30 && age <= 39) {
          incrementAgeRange(applicantsAgeInfo, "30-39");
        } else if (age >= 40 && age <= 49) {
          incrementAgeRange(applicantsAgeInfo, "40-49");
        } else if (age >= 50) {
          incrementAgeRange(applicantsAgeInfo, "50+");
        }
      }
    });

    return {
      applicantsCount,
      applicantsWithAgeCount,
      applicantsAgeInfo,
    };
  },
});

export const getApplicantsLanguageInfo = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);

    if (!user) {
      return {
        applicantsCount: 0,
        applicantsWithLanguagesCount: 0,
        applicantsLanguageInfo: [],
      };
    }

    await checkUserRole(user, "Admin");

    const users = await ctx.db
      .query("users")
      .withIndex("byRole", (q) => q.eq("role", "Applicant"))
      .collect();

    const applicantsCount = users.length;

    const applicantsWithLanguagesCount = users.reduce(
      (total, user) =>
        total + (user.languages && user.languages.length > 0 ? 1 : 0),
      0,
    );

    let languageCountMap: { [language: string]: number } = {};

    users.forEach((user) => {
      if (user.languages && user.languages.length > 0) {
        user.languages.forEach((language) => {
          if (languageCountMap[language]) {
            languageCountMap[language] = languageCountMap[language] + 1;
          } else {
            languageCountMap[language] = 1;
          }
        });
      }
    });

    let applicantsLanguageInfo: { language: string; count: number }[] =
      Object.keys(languageCountMap).map((language) => ({
        language,
        count: languageCountMap[language],
      }));

    applicantsLanguageInfo.sort((a, b) => b.count - a.count);

    applicantsLanguageInfo = applicantsLanguageInfo.slice(
      0,
      Math.min(applicantsLanguageInfo.length, 5),
    );

    return {
      applicantsCount,
      applicantsWithLanguagesCount,
      applicantsLanguageInfo,
    };
  },
});

export const getCompaniesEstablishmentInfo = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);

    if (!user) {
      return {
        companiesCount: 0,
        companiesWithEstablishmentCount: 0,
        companiesEstablishmentInfo: [],
      };
    }

    await checkUserRole(user, "Admin");

    const users = await ctx.db
      .query("users")
      .withIndex("byRole", (q) => q.eq("role", "Company"))
      .collect();

    const companiesCount = users.length;

    const companiesWithEstablishmentCount = users.reduce(
      (total, user) => total + (user.establishmentYear ? 1 : 0),
      0,
    );

    let companiesEstablishmentInfo: { x: string; y: number }[] = [];

    users.forEach((user) => {
      const establishmentYear = user.establishmentYear;

      if (establishmentYear) {
        const existingYear = companiesEstablishmentInfo.find(
          (obj) => obj.x === establishmentYear.toString(),
        );

        if (existingYear) {
          existingYear.y = existingYear.y + 1;
        } else {
          companiesEstablishmentInfo.push({
            x: establishmentYear.toString(),
            y: 1,
          });
        }
      }
    });

    companiesEstablishmentInfo.sort((a, b) => parseInt(a.x) - parseInt(b.x));

    return {
      companiesCount,
      companiesWithEstablishmentCount,
      companiesEstablishmentInfo,
    };
  },
});

export const getCompaniesEmployeeInfo = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);

    if (!user) {
      return {
        companiesCount: 0,
        companiesWithEmployeeCount: 0,
        companiesEmployeeInfo: [],
      };
    }

    await checkUserRole(user, "Admin");

    const users = await ctx.db
      .query("users")
      .withIndex("byRole", (q) => q.eq("role", "Company"))
      .collect();

    const companiesCount = users.length;

    const companiesWithEmployeeCount = users.reduce(
      (total, user) => total + (user.numberOfEmployees ? 1 : 0),
      0,
    );

    let companiesEmployeeInfo: {
      range: "1-10" | "11-50" | "51-250" | "250+";
      count: number;
    }[] = [];

    users.forEach((user) => {
      const numberOfEmployees = user.numberOfEmployees;

      if (numberOfEmployees) {
        if (numberOfEmployees >= 1 && numberOfEmployees <= 10) {
          incrementEmployeesRange(companiesEmployeeInfo, "1-10");
        } else if (numberOfEmployees >= 11 && numberOfEmployees <= 50) {
          incrementEmployeesRange(companiesEmployeeInfo, "11-50");
        } else if (numberOfEmployees >= 51 && numberOfEmployees <= 250) {
          incrementEmployeesRange(companiesEmployeeInfo, "51-250");
        } else if (numberOfEmployees >= 251) {
          incrementEmployeesRange(companiesEmployeeInfo, "250+");
        }
      }
    });

    return {
      companiesCount,
      companiesWithEmployeeCount,
      companiesEmployeeInfo,
    };
  },
});

export const getCompaniesProjectInfo = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);

    if (!user) {
      return {
        companiesCount: 0,
        companiesWithProjectCount: 0,
        companiesProjectInfo: [],
      };
    }

    await checkUserRole(user, "Admin");

    const users = await ctx.db
      .query("users")
      .withIndex("byRole", (q) => q.eq("role", "Company"))
      .collect();

    const companiesCount = users.length;

    const projects = await ctx.db.query("projects").collect();

    const companiesWithProjectsSet = new Set(
      projects.map((project) => project.userId),
    );
    const companiesWithProjectCount = users.filter((user) =>
      companiesWithProjectsSet.has(user._id),
    ).length;

    let companiesProjectInfo: {
      id: Doc<"projects">["category"];
      label: string;
      value: number;
    }[] = [];

    projects.forEach((project) => {
      const category = project.category;

      if (category) {
        const existingCategory = companiesProjectInfo.find(
          (item) => item.id === category,
        );

        if (existingCategory) {
          existingCategory.value = existingCategory.value + 1;
        } else {
          companiesProjectInfo.push({
            id: category,
            label: category,
            value: 1,
          });
        }
      }
    });

    return {
      companiesCount,
      companiesWithProjectCount,
      companiesProjectInfo,
    };
  },
});

export const getListingsJobTypeInfo = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);

    if (!user) {
      return {
        companiesCount: 0,
        listingsCount: 0,
        companiesWithJobListingsCount: 0,
        listingsJobTypeInfo: [],
      };
    }

    await checkUserRole(user, "Admin");

    const companies = await ctx.db
      .query("users")
      .withIndex("byRole", (q) => q.eq("role", "Company"))
      .collect();

    const jobs = await ctx.db.query("jobs").collect();

    const companiesCount = companies.length;
    const listingsCount = jobs.length;

    const companiesWithJobListingsSet = new Set(jobs.map((job) => job.userId));
    const companiesWithJobListingsCount = companies.filter((company) =>
      companiesWithJobListingsSet.has(company._id),
    ).length;

    let listingsJobTypeInfo: {
      jobType: Doc<"jobs">["jobType"];
      count: number;
    }[] = [];

    jobs.forEach((job) => {
      const jobType = job.jobType;

      if (jobType === "Full-time") {
        incrementJobType(listingsJobTypeInfo, "Full-time");
      } else if (jobType === "Part-time") {
        incrementJobType(listingsJobTypeInfo, "Part-time");
      } else if (jobType === "Contract") {
        incrementJobType(listingsJobTypeInfo, "Contract");
      } else if (jobType === "Internship") {
        incrementJobType(listingsJobTypeInfo, "Internship");
      }
    });

    return {
      companiesCount,
      listingsCount,
      companiesWithJobListingsCount,
      listingsJobTypeInfo,
    };
  },
});

export const getListingsSettingTypeInfo = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);

    if (!user) {
      return {
        companiesCount: 0,
        listingsCount: 0,
        companiesWithJobListingsCount: 0,
        listingsSettingTypeInfo: [],
      };
    }

    await checkUserRole(user, "Admin");

    const companies = await ctx.db
      .query("users")
      .withIndex("byRole", (q) => q.eq("role", "Company"))
      .collect();

    const jobs = await ctx.db.query("jobs").collect();

    const companiesCount = companies.length;
    const listingsCount = jobs.length;

    const companiesWithJobListingsSet = new Set(jobs.map((job) => job.userId));
    const companiesWithJobListingsCount = companies.filter((company) =>
      companiesWithJobListingsSet.has(company._id),
    ).length;

    let listingsSettingTypeInfo: {
      id: Doc<"jobs">["settingType"];
      label: string;
      value: number;
    }[] = [];

    jobs.forEach((job) => {
      const settingType = job.settingType;

      const existingSettingType = listingsSettingTypeInfo.find(
        (item) => item.id === settingType,
      );

      if (existingSettingType) {
        existingSettingType.value = existingSettingType.value + 1;
      } else {
        listingsSettingTypeInfo.push({
          id: settingType,
          label: settingType,
          value: 1,
        });
      }
    });

    return {
      companiesCount,
      listingsCount,
      companiesWithJobListingsCount,
      listingsSettingTypeInfo,
    };
  },
});

export const getListingsEducationLevelInfo = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);

    if (!user) {
      return {
        companiesCount: 0,
        listingsCount: 0,
        companiesWithJobListingsCount: 0,
        listingsEducationLevelInfo: [],
      };
    }

    await checkUserRole(user, "Admin");

    const companies = await ctx.db
      .query("users")
      .withIndex("byRole", (q) => q.eq("role", "Company"))
      .collect();

    const jobs = await ctx.db.query("jobs").collect();

    const companiesCount = companies.length;
    const listingsCount = jobs.length;

    const companiesWithJobListingsSet = new Set(jobs.map((job) => job.userId));
    const companiesWithJobListingsCount = companies.filter((company) =>
      companiesWithJobListingsSet.has(company._id),
    ).length;

    type ListingsEducationLevelInfoItemType = {
      educationLevel: Doc<"jobs">["educationLevel"];
    } & Record<Doc<"jobs">["jobSector"], number>;

    const educationLevels: Doc<"jobs">["educationLevel"][] = [
      "High school diploma",
      "Associate degree",
      "Bachelor's degree",
      "Master's degree",
      "PhD",
    ];

    const jobSectors: Doc<"jobs">["jobSector"][] = [
      "Web development",
      "Mobile development",
      "Artificial intelligence",
      "DevOps engineering",
      "Cloud computing",
      "Other",
    ];

    let listingsEducationLevelInfo: ListingsEducationLevelInfoItemType[] =
      educationLevels.map((educationLevel) => ({
        educationLevel,
        ...(Object.fromEntries(
          jobSectors.map((jobSector) => [jobSector, 0]),
        ) as Record<Doc<"jobs">["jobSector"], number>),
      }));

    jobs.forEach((job) => {
      const educationLevel = job.educationLevel;
      const jobSector = job.jobSector;

      const existingItem = listingsEducationLevelInfo.find(
        (item) => item.educationLevel === educationLevel,
      );

      if (existingItem) {
        existingItem[jobSector] = (existingItem[jobSector] || 0) + 1;
      } else {
        listingsEducationLevelInfo.push({
          educationLevel,
          [jobSector]: 1,
        } as ListingsEducationLevelInfoItemType);
      }
    });

    return {
      companiesCount,
      listingsCount,
      companiesWithJobListingsCount,
      listingsEducationLevelInfo,
    };
  },
});

export const getListingsExperienceLevelInfo = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);

    if (!user) {
      return {
        companiesCount: 0,
        listingsCount: 0,
        companiesWithJobListingsCount: 0,
        listingsExperienceLevelInfo: [],
      };
    }

    await checkUserRole(user, "Admin");

    const companies = await ctx.db
      .query("users")
      .withIndex("byRole", (q) => q.eq("role", "Company"))
      .collect();

    const jobs = await ctx.db.query("jobs").collect();

    const companiesCount = companies.length;
    const listingsCount = jobs.length;

    const companiesWithJobListingsSet = new Set(jobs.map((job) => job.userId));
    const companiesWithJobListingsCount = companies.filter((company) =>
      companiesWithJobListingsSet.has(company._id),
    ).length;

    const experienceLevels: Doc<"jobs">["experienceLevel"][] = [
      "Entry level",
      "Mid-level",
      "Senior level",
    ];

    const jobSectors: Doc<"jobs">["jobSector"][] = [
      "Web development",
      "Mobile development",
      "Artificial intelligence",
      "DevOps engineering",
      "Cloud computing",
      "Other",
    ];

    let listingsExperienceLevelInfo: {
      id: Doc<"jobs">["experienceLevel"];
      data: { x: Doc<"jobs">["jobSector"]; y: number }[];
    }[] = experienceLevels.map((experienceLevel) => ({
      id: experienceLevel,
      data: jobSectors.map((jobSector) => ({
        x: jobSector,
        y: 0,
      })),
    }));

    jobs.forEach((job) => {
      const experienceLevel = job.experienceLevel;
      const jobSector = job.jobSector;

      const existingItem = listingsExperienceLevelInfo.find(
        (item) => item.id === experienceLevel,
      );

      if (existingItem) {
        const sectorData = existingItem.data.find(
          (dataItem) => dataItem.x === jobSector,
        );

        if (sectorData) {
          sectorData.y = sectorData.y + 1;
        } else {
          existingItem.data.push({
            x: jobSector,
            y: 1,
          });
        }
      } else {
        listingsExperienceLevelInfo.push({
          id: experienceLevel,
          data: [
            {
              x: jobSector,
              y: 1,
            },
          ],
        });
      }
    });

    return {
      companiesCount,
      listingsCount,
      companiesWithJobListingsCount,
      listingsExperienceLevelInfo,
    };
  },
});

export const getUsersCountryInfo = query({
  args: {
    role: v.union(
      v.literal("Admin"),
      v.literal("Applicant"),
      v.literal("Company"),
    ),
  },
  handler: async (ctx, { role }) => {
    const user = await getCurrentUser(ctx);

    if (!user) {
      return {
        usersCount: 0,
        usersWithCountryCount: 0,
        usersCountryInfo: [],
      };
    }

    await checkUserRole(user, "Admin");

    const users = await ctx.db
      .query("users")
      .withIndex("byRole", (q) => q.eq("role", role))
      .collect();

    const usersCount = users.length;

    const usersWithCountryCount = users.reduce(
      (total, user) => total + (user.country ? 1 : 0),
      0,
    );

    let countryCountMap: { [alpha3Code: string]: number } = {};

    users.forEach((user) => {
      const country = user.country;

      if (country) {
        if (countryCountMap[country.alpha3Code]) {
          countryCountMap[country.alpha3Code] =
            countryCountMap[country.alpha3Code] + 1;
        } else {
          countryCountMap[country.alpha3Code] = 1;
        }
      }
    });

    const usersCountryInfo = Object.keys(countryCountMap).map((alpha3Code) => ({
      id: alpha3Code,
      value: countryCountMap[alpha3Code],
    }));

    return {
      usersCount,
      usersWithCountryCount,
      usersCountryInfo,
    };
  },
});

function incrementAgeRange(
  applicantsAgeInfo: {
    range: "18-29" | "30-39" | "40-49" | "50+";
    count: number;
  }[],
  range: "18-29" | "30-39" | "40-49" | "50+",
) {
  const existingRange = applicantsAgeInfo.find((item) => item.range === range);

  if (existingRange) {
    existingRange.count = existingRange.count + 1;
  } else {
    applicantsAgeInfo.push({ range, count: 1 });
  }
}

function incrementEmployeesRange(
  companiesEmployeeInfo: {
    range: "1-10" | "11-50" | "51-250" | "250+";
    count: number;
  }[],
  range: "1-10" | "11-50" | "51-250" | "250+",
) {
  const existingRange = companiesEmployeeInfo.find(
    (item) => item.range === range,
  );

  if (existingRange) {
    existingRange.count = existingRange.count + 1;
  } else {
    companiesEmployeeInfo.push({ range, count: 1 });
  }
}

function incrementJobType(
  listingsJobTypeInfo: {
    jobType: Doc<"jobs">["jobType"];
    count: number;
  }[],
  jobType: Doc<"jobs">["jobType"],
) {
  const existingJobType = listingsJobTypeInfo.find(
    (item) => item.jobType === jobType,
  );

  if (existingJobType) {
    existingJobType.count = existingJobType.count + 1;
  } else {
    listingsJobTypeInfo.push({ jobType, count: 1 });
  }
}

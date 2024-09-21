import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ConvexError } from "convex/values";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function handleError(
  error: unknown,
  context?: string,
  logToConsole?: boolean,
  isClientError?: boolean,
) {
  let errorMessage: string;

  if (isClientError && isClerkAPIResponseError(error)) {
    errorMessage =
      error.errors[0].longMessage || "An unexpected error occurred.";
  } else if (error instanceof ConvexError) {
    errorMessage = (error.data as { message: string }).message;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (error && typeof error === "object" && "message" in error) {
    errorMessage = String(error.message);
  } else if (typeof error === "string") {
    errorMessage = error;
  } else {
    errorMessage = "An unexpected error occurred.";
  }

  if (logToConsole) {
    const log = context
      ? `❌ ERROR (${context}): ${errorMessage}`
      : `❌ ERROR: ${errorMessage}`;

    console.log(log);
  }

  return errorMessage;
}

export function addThemeClass(theme: string) {
  const existingClasses = document.documentElement.classList;

  Array.from(existingClasses).forEach((className) => {
    if (className.startsWith("theme-")) {
      existingClasses.remove(className);
    }
  });

  document.documentElement.classList.add(`theme-${theme}`);
}

export function handleThemeChange(
  theme: string,
  setTheme: (theme: string) => void,
) {
  addThemeClass(theme);

  setTheme(theme);
}

export function capitalizeFirstLetter(input: string) {
  return input.charAt(0).toUpperCase() + input.slice(1);
}

export function calculateProficiency(rating: number) {
  switch (true) {
    case rating >= 8 && rating <= 10:
      return "Expert";
    case rating >= 4 && rating < 8:
      return "Intermediate";
    case rating >= 1 && rating < 4:
      return "Novice";
    case rating === 0:
      return "Inexperienced";
    default:
      return "Invalid Rating";
  }
}

export function formatCurrency(
  amount: number,
  options: {
    currencyCode?: string;
    locale?: string;
    minimumFractionDigits?: number;
  } = {},
) {
  const {
    currencyCode = "USD",
    locale = "en-US",
    minimumFractionDigits,
  } = options;

  const formattedCurrency = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits,
  }).format(amount);

  return formattedCurrency;
}

export function formatNumber(number: number) {
  if (number < 1000) {
    return number.toString();
  } else if (number < 10000) {
    return (number / 1000).toFixed(1) + "k";
  } else {
    return Math.round(number / 1000) + "k";
  }
}

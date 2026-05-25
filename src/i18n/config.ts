export const locales = ["en", "zh"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  zh: "Chinese",
};

export const localeLabels: Record<Locale, { native: string; english: string }> =
  {
    en: { native: "English", english: "English" },
    zh: { native: "中文", english: "Chinese" },
  };

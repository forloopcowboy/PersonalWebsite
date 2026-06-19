import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enUS from "./en-us.json";
import ptBR from "./pt-br.json";

export const supportedLanguages = [
  { code: "en-US", label: "EN" },
  { code: "pt-BR", label: "PT" },
] as const;

export const defaultLanguage = "en-US";

export type LocaleSlug = "en-us" | "pt-br";

const slugToCode: Record<LocaleSlug, string> = {
  "en-us": "en-US",
  "pt-br": "pt-BR",
};

const codeToSlug: Record<string, LocaleSlug> = {
  "en-US": "en-us",
  "pt-BR": "pt-br",
};

export function localeFromSlug(slug: string): string | undefined {
  return slugToCode[slug as LocaleSlug];
}

export function slugFromLocale(code: string): LocaleSlug {
  return codeToSlug[code] ?? "en-us";
}

export function isValidLocaleSlug(slug: string): slug is LocaleSlug {
  return slug in slugToCode;
}

export function detectLocaleSlug(acceptLanguage?: string | null): LocaleSlug {
  if (acceptLanguage) {
    const lower = acceptLanguage.toLowerCase();
    if (lower.startsWith("pt")) return "pt-br";
  }
  return "en-us";
}

export function resolveLocale(
  paramLocale: string | undefined,
  request: Request,
): LocaleSlug {
  if (paramLocale && isValidLocaleSlug(paramLocale)) {
    return paramLocale;
  }
  return detectLocaleSlug(request.headers.get("Accept-Language"));
}

function getInitialLocale(): string {
  if (typeof window !== "undefined") {
    const htmlLang = document.documentElement.lang;
    if (htmlLang && Object.values(slugToCode).includes(htmlLang)) {
      return htmlLang;
    }
    const match = window.location.pathname.match(/^\/([a-z]{2}-[a-z]{2})/);
    if (match) {
      const code = slugToCode[match[1] as LocaleSlug];
      if (code) return code;
    }
  }
  return defaultLanguage;
}

i18n.use(initReactI18next).init({
  resources: {
    "en-US": { translation: enUS },
    "pt-BR": { translation: ptBR },
  },
  lng: getInitialLocale(),
  fallbackLng: defaultLanguage,
  interpolation: { escapeValue: false },
});

export default i18n;

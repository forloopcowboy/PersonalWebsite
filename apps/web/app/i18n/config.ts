import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enUS from "./en-us.json";

export const supportedLanguages = [
  { code: "en-US", label: "EN" },
] as const;

export const defaultLanguage = "en-US";

i18n.use(initReactI18next).init({
  resources: {
    "en-US": { translation: enUS },
  },
  lng: defaultLanguage,
  fallbackLng: defaultLanguage,
  interpolation: { escapeValue: false },
});

export default i18n;

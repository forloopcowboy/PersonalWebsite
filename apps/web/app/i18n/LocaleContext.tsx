import { createContext, useContext } from "react";
import type { LocaleSlug } from "./config";

export interface LocaleInfo {
  locale: LocaleSlug;
  localePrefix: string;
}

const LocaleContext = createContext<LocaleInfo | null>(null);

export function LocaleProvider({
  value,
  children,
}: {
  value: LocaleInfo;
  children: React.ReactNode;
}) {
  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): LocaleInfo {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within a <LocaleProvider>");
  }
  return ctx;
}

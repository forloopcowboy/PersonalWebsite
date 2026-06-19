import { Outlet, data, useParams } from "react-router";
import { isValidLocaleSlug, localeFromSlug } from "../i18n/config";
import i18n from "../i18n/config";
import type { Route } from "./+types/$locale";

export function loader({ params }: Route.LoaderArgs) {
  const slug = params.locale;
  if (!slug || !isValidLocaleSlug(slug)) {
    throw data("Not found", { status: 404 });
  }
  const code = localeFromSlug(slug)!;
  i18n.changeLanguage(code);
  return { locale: slug };
}

export default function LocaleLayout() {
  const { locale } = useParams<{ locale: string }>();
  const code = localeFromSlug(locale!);
  if (code && i18n.language !== code) {
    i18n.changeLanguage(code);
  }
  return <Outlet />;
}

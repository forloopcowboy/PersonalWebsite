import { Outlet, data, useLoaderData } from "react-router";
import {
  isValidLocaleSlug,
  localeFromSlug,
  detectLocaleSlug,
} from "../i18n/config";
import i18n from "../i18n/config";
import { LocaleProvider } from "../i18n/LocaleContext";
import type { Route } from "./+types/$locale";

export function loader({ params, request }: Route.LoaderArgs) {
  if (params.locale && !isValidLocaleSlug(params.locale)) {
    throw data("Not found", { status: 404 });
  }

  const locale = params.locale && isValidLocaleSlug(params.locale)
    ? params.locale
    : detectLocaleSlug(request.headers.get("Accept-Language"));

  const code = localeFromSlug(locale)!;
  i18n.changeLanguage(code);

  return {
    locale,
    localePrefix: params.locale ? `/${params.locale}` : "",
  };
}

export default function LocaleLayout() {
  const { locale, localePrefix } = useLoaderData<typeof loader>();
  const code = localeFromSlug(locale);
  if (code && i18n.language !== code) {
    i18n.changeLanguage(code);
  }

  return (
    <LocaleProvider value={{ locale, localePrefix }}>
      <Outlet />
    </LocaleProvider>
  );
}

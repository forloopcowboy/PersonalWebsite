import { redirect } from "react-router";
import { detectLocaleSlug } from "../i18n/config";
import type { Route } from "./+types/locale-redirect";

export function loader({ request }: Route.LoaderArgs) {
  const acceptLanguage = request.headers.get("Accept-Language");
  const slug = detectLocaleSlug(acceptLanguage);
  throw redirect(`/${slug}`);
}

export default function LocaleRedirect() {
  return null;
}

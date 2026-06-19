import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router";
import { LanguagePicker, Link, Logo } from "@personal/ui";
import { supportedLanguages, slugFromLocale } from "../i18n/config";

export function SiteHeader() {
  const { t, i18n } = useTranslation();
  const { locale } = useParams<{ locale: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between py-8">
      <a
        href={`/${locale}`}
        className="group inline-flex items-center gap-3"
        aria-label="forloopcowboy — home"
      >
        <Logo className="h-7 w-7" />
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink-soft transition-colors duration-200 group-hover:text-ink">
          {t("nav.home")}
        </span>
      </a>
      <nav className="flex items-center gap-6">
        <Link
          href={`/${locale}#work`}
          className="font-mono text-xs uppercase tracking-[0.18em]"
        >
          {t("nav.work")}
        </Link>
        <Link
          href={`/${locale}#side`}
          className="font-mono text-xs uppercase tracking-[0.18em]"
        >
          {t("nav.side")}
        </Link>
        <Link
          href={`/${locale}/contact`}
          className="font-mono text-xs uppercase tracking-[0.18em]"
        >
          {t("nav.contact")}
        </Link>
        <LanguagePicker
          value={i18n.language}
          options={supportedLanguages}
          onChange={(code) => {
            const newSlug = slugFromLocale(code);
            const newPath = location.pathname.replace(
              /^\/[a-z]{2}-[a-z]{2}/,
              `/${newSlug}`,
            );
            navigate(newPath);
          }}
        />
      </nav>
    </header>
  );
}

export function SiteFooter() {
  const { t } = useTranslation();

  return (
    <footer className="mt-8 flex flex-col gap-6 border-t border-rule py-10 md:flex-row md:items-center md:justify-between">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink-soft">
        {t("footer.copyright")}
      </p>
      <div className="flex items-center gap-6 font-sans text-sm">
        <Link href="mailto:leo@forloopcowboy.com">{t("footer.email")}</Link>
        <Link href="https://github.com/forloopcowboy">{t("footer.github")}</Link>
        <Link href="https://www.linkedin.com/in/leogonsalves">
          {t("footer.linkedin")}
        </Link>
      </div>
    </footer>
  );
}

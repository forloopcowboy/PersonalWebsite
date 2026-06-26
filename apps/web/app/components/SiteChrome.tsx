import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { LanguagePicker, Link, Logo } from '@personal/ui';
import { supportedLanguages, slugFromLocale } from '../i18n/config';
import { useLocale } from '../i18n/LocaleContext';

export function SiteHeader() {
  const { t, i18n } = useTranslation();
  const { localePrefix } = useLocale();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <header className="flex flex-col items-center justify-between gap-5 py-8 md:flex-row">
      <a
        href={localePrefix || '/'}
        className="group inline-flex items-center gap-3"
        aria-label="forloopcowboy — home"
      >
        <Logo className="h-7 w-7" />
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink-soft transition-colors duration-200 group-hover:text-ink">
          {t('nav.home')}
        </span>
      </a>
      <nav className="flex items-center gap-6">
        <Link
          href={`${localePrefix}/#work`}
          className="font-mono text-xs uppercase tracking-[0.18em]"
        >
          {t('nav.work')}
        </Link>
        <Link
          href={`${localePrefix}/#side`}
          className="font-mono text-xs uppercase tracking-[0.18em]"
        >
          {t('nav.side')}
        </Link>
        <Link
          href={`${localePrefix}/projects`}
          className="font-mono text-xs uppercase tracking-[0.18em]"
        >
          {t('nav.projects')}
        </Link>
        <Link
          href={`${localePrefix}/contact`}
          className="font-mono text-xs uppercase tracking-[0.18em]"
        >
          {t('nav.contact')}
        </Link>
        <div className="hidden md:block">
          <LanguagePicker
            value={i18n.language}
            options={supportedLanguages}
            onChange={(code) => {
              const newSlug = slugFromLocale(code);
              const pathWithoutLocale =
                location.pathname.replace(/^\/[a-z]{2}-[a-z]{2}/, '') || '/';
              navigate(`/${newSlug}${pathWithoutLocale}`);
            }}
          />
        </div>
      </nav>
      <div className="block md:hidden">
        <LanguagePicker
          value={i18n.language}
          options={supportedLanguages}
          onChange={(code) => {
            const newSlug = slugFromLocale(code);
            const pathWithoutLocale =
              location.pathname.replace(/^\/[a-z]{2}-[a-z]{2}/, '') || '/';
            navigate(`/${newSlug}${pathWithoutLocale}`);
          }}
        />
      </div>
    </header>
  );
}

export function SiteFooter() {
  const { t } = useTranslation();

  return (
    <footer className="mt-8 flex flex-col gap-6 border-t border-rule py-10 md:flex-row md:items-center md:justify-between">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink-soft">
        {t('footer.copyright')}
      </p>
      <div className="flex items-center gap-6 font-sans text-sm">
        <Link href="mailto:leo@forloopcowboy.com">{t('footer.email')}</Link>
        <Link href="https://github.com/forloopcowboy">
          {t('footer.github')}
        </Link>
        <Link href="https://www.linkedin.com/in/leogonsalves">
          {t('footer.linkedin')}
        </Link>
      </div>
    </footer>
  );
}

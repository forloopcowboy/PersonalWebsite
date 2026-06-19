import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { data, useFetcher, useLoaderData } from 'react-router';
import { Alert, Button, Link, SectionHeader, cn } from '@personal/ui';
import { SiteFooter, SiteHeader } from '../components/SiteChrome';
import i18n from '../i18n/config';
import {
  TOPIC_KEYS,
  type ContactFormErrors,
  type TopicKey,
  validateContactFields,
} from '../lib/contact-form';
import {
  createSignedTimestamp,
  isTimestampValid,
  sendContactEmail,
} from '../lib/contact-form.server';
import type { Route } from './+types/contact';

export function meta() {
  return [
    { title: i18n.t('contact_form.meta_title') },
    {
      name: 'description',
      content: i18n.t('contact_form.meta_description'),
    },
  ];
}

export function loader({}: Route.LoaderArgs) {
  return createSignedTimestamp();
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const honeypot = formData.get('company_website');
  if (honeypot && typeof honeypot === 'string' && honeypot.length > 0) {
    return { success: true as const };
  }

  const rendered = Number(formData.get('_rendered'));
  const sig = String(formData.get('_signature') ?? '');
  if (!rendered || !sig || !isTimestampValid(rendered, sig)) {
    return data(
      { success: false as const, errors: { form: 'form_expired' } },
      { status: 400 },
    );
  }

  const result = validateContactFields({
    name: formData.get('name'),
    email: formData.get('email'),
    topics: formData.getAll('topic'),
    message: formData.get('message'),
  });

  if (!result.valid) {
    return data(
      { success: false as const, errors: result.errors },
      { status: 400 },
    );
  }

  const sendResult = await sendContactEmail(result.data);
  if (!sendResult.success) {
    return data(
      { success: false as const, errors: { form: 'send_failed' } },
      { status: 500 },
    );
  }

  return { success: true as const };
}

export default function ContactPage() {
  const { t } = useTranslation();
  const loaderData = useLoaderData<typeof loader>();

  return (
    <main className="min-h-dvh bg-paper text-ink">
      <div className="mx-auto flex max-w-page flex-col px-6 md:px-10 lg:px-gutter">
        <SiteHeader />

        <div className="flex-1 py-20 md:py-28">
          <SectionHeader
            eyebrow={t('contact.eyebrow')}
            title={t('contact_form.title')}
          />

          <p className="mt-6 max-w-prose font-sans text-lg leading-relaxed text-ink-soft [text-wrap:pretty]">
            {t('contact_form.opener')}
          </p>

          <div className="mt-16 max-w-prose">
            <ContactForm
              timestamp={loaderData.timestamp}
              signature={loaderData.signature}
            />
          </div>

          <div className="mt-14 flex items-baseline gap-3">
            <span className="font-sans text-sm text-ink-soft">
              {t('contact_form.email_fallback')}
            </span>
            <Link href="mailto:contact@forloopcowboy.com" className="text-base">
              contact@forloopcowboy.com
            </Link>
          </div>
        </div>

        <SiteFooter />
      </div>
    </main>
  );
}

type ActionData =
  | { success: true }
  | { success: false; errors: ContactFormErrors };

function ContactForm({
  timestamp,
  signature,
}: {
  timestamp: number;
  signature: string;
}) {
  const { t } = useTranslation();
  const fetcher = useFetcher<ActionData>();

  const [topics, setTopics] = useState<TopicKey[]>([]);
  const [message, setMessage] = useState('');
  const [touched, setTouched] = useState(false);
  const [clientErrors, setClientErrors] = useState<ContactFormErrors>({});
  const [sent, setSent] = useState(false);

  const appliedTemplate = useRef('');

  const isSubmitting = fetcher.state === 'submitting';
  const serverData = fetcher.data;
  const serverErrors =
    serverData && !serverData.success ? serverData.errors : null;

  useEffect(() => {
    if (serverData?.success && fetcher.state === 'idle') {
      setSent(true);
    }
  }, [serverData, fetcher.state]);

  const errors = serverErrors ?? clientErrors;

  function toggleTopic(key: TopicKey) {
    const isAdding = !topics.includes(key);
    const next = isAdding ? [...topics, key] : topics.filter((t) => t !== key);
    setTopics(next);

    if (isAdding && !touched) {
      const template = t(`contact_form.templates.${key}`);
      appliedTemplate.current = template;
      setMessage(template);
    }

    if (clientErrors.topics) {
      setClientErrors((prev) => ({ ...prev, topics: undefined }));
    }
  }

  function handleMessageChange(value: string) {
    setMessage(value);
    if (value !== appliedTemplate.current) {
      setTouched(true);
    }
    if (clientErrors.message) {
      setClientErrors((prev) => ({ ...prev, message: undefined }));
    }
  }

  function resetToTemplate() {
    if (topics.length > 0) {
      const lastTopic = topics[topics.length - 1];
      const template = t(`contact_form.templates.${lastTopic}`);
      appliedTemplate.current = template;
      setMessage(template);
      setTouched(false);
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const result = validateContactFields({
      name: new FormData(e.currentTarget).get('name'),
      email: new FormData(e.currentTarget).get('email'),
      topics,
      message,
    });

    if (!result.valid) {
      e.preventDefault();
      setClientErrors(result.errors);
      return;
    }

    setClientErrors({});
  }

  function handleReset() {
    setSent(false);
    setTopics([]);
    setMessage('');
    setTouched(false);
    setClientErrors({});
    appliedTemplate.current = '';
  }

  if (sent) {
    return (
      <div className="animate-settle-in">
        <h3 className="font-display text-3xl font-light tracking-[-0.015em]">
          {t('contact_form.success_title')}
        </h3>
        <p className="mt-3 text-lg text-ink-soft">
          {t('contact_form.success_body')}
        </p>
        <button
          type="button"
          onClick={handleReset}
          className={cn(
            'mt-8 font-sans text-sm font-medium text-ink',
            'bg-[linear-gradient(currentColor,currentColor)] bg-no-repeat',
            'bg-[length:100%_1px] bg-[position:0_92%]',
            'transition-colors duration-300 ease-settle',
            'hover:text-ember focus-visible:text-ember focus-visible:outline-none',
          )}
        >
          {t('contact_form.send_another')}
        </button>
      </div>
    );
  }

  return (
    <fetcher.Form
      method="post"
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-8"
    >
      <input type="hidden" name="_rendered" value={timestamp} />
      <input type="hidden" name="_signature" value={signature} />

      {/* Honeypot — visually hidden, aria-hidden, not focusable */}
      <div
        className="absolute -left-[9999px] h-px w-px overflow-hidden"
        aria-hidden="true"
      >
        <label htmlFor="company_website">Company website</label>
        <input
          type="text"
          id="company_website"
          name="company_website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Hidden inputs for selected topics */}
      {topics.map((key) => (
        <input type="hidden" name="topic" value={key} key={key} />
      ))}

      <Field
        label={t('contact_form.name_label')}
        htmlFor="contact-name"
        error={
          errors.name ? t(`contact_form.validation.${errors.name}`) : undefined
        }
      >
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          placeholder={t('contact_form.name_placeholder')}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'contact-name-error' : undefined}
          onChange={() =>
            clientErrors.name &&
            setClientErrors((p) => ({ ...p, name: undefined }))
          }
          className={cn(
            'w-full rounded-sm border bg-transparent px-3 py-2.5 font-sans text-base text-ink placeholder:text-ink-soft/50',
            'transition-colors duration-150',
            'focus:border-ember focus:outline-none focus:ring-1 focus:ring-ember/40',
            errors.name ? 'border-ember/60' : 'border-rule',
          )}
        />
      </Field>

      <Field
        label={t('contact_form.email_label')}
        htmlFor="contact-email"
        error={
          errors.email
            ? t(`contact_form.validation.${errors.email}`)
            : undefined
        }
      >
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          placeholder={t('contact_form.email_placeholder')}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'contact-email-error' : undefined}
          onChange={() =>
            clientErrors.email &&
            setClientErrors((p) => ({ ...p, email: undefined }))
          }
          className={cn(
            'w-full rounded-sm border bg-transparent px-3 py-2.5 font-sans text-base text-ink placeholder:text-ink-soft/50',
            'transition-colors duration-150',
            'focus:border-ember focus:outline-none focus:ring-1 focus:ring-ember/40',
            errors.email ? 'border-ember/60' : 'border-rule',
          )}
        />
      </Field>

      <Field
        label={t('contact_form.topic_label')}
        htmlFor="topic-group"
        hint={t('contact_form.topic_hint')}
        error={
          errors.topics
            ? t(`contact_form.validation.${errors.topics}`)
            : undefined
        }
      >
        <div
          id="topic-group"
          role="group"
          aria-label={t('contact_form.topic_label')}
          className="flex flex-wrap gap-2"
        >
          {TOPIC_KEYS.map((key) => {
            const selected = topics.includes(key);
            return (
              <button
                key={key}
                type="button"
                role="checkbox"
                aria-checked={selected}
                onClick={() => toggleTopic(key)}
                className={cn(
                  'rounded-sm border px-3 py-1.5 font-sans text-sm',
                  'transition-colors duration-150',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/40 focus-visible:ring-offset-2 focus-visible:ring-offset-paper',
                  selected
                    ? 'border-ember bg-ember/[0.06] text-ember'
                    : 'border-rule text-ink-soft hover:border-ink/50 hover:text-ink',
                )}
              >
                {t(`contact_form.topics.${key}`)}
              </button>
            );
          })}
        </div>
      </Field>

      <Field
        label={t('contact_form.message_label')}
        htmlFor="contact-message"
        error={
          errors.message
            ? t(`contact_form.validation.${errors.message}`)
            : undefined
        }
        trailing={
          touched && topics.length > 0 ? (
            <button
              type="button"
              onClick={resetToTemplate}
              className="font-sans text-xs text-ink-soft transition-colors duration-150 hover:text-ember focus-visible:text-ember focus-visible:outline-none"
            >
              {t('contact_form.reset_template')}
            </button>
          ) : null
        }
      >
        <textarea
          id="contact-message"
          name="message"
          required
          rows={8}
          value={message}
          onChange={(e) => handleMessageChange(e.target.value)}
          aria-invalid={!!errors.message}
          aria-describedby={
            errors.message ? 'contact-message-error' : undefined
          }
          className={cn(
            'w-full resize-y rounded-sm border bg-transparent px-3 py-2.5 font-sans text-base leading-relaxed text-ink placeholder:text-ink-soft/50',
            'transition-colors duration-150',
            'focus:border-ember focus:outline-none focus:ring-1 focus:ring-ember/40',
            errors.message ? 'border-ember/60' : 'border-rule',
          )}
        />
      </Field>

      {errors.form && (
        <Alert variant="error">
          {errors.form === 'form_expired'
            ? t('contact_form.error_expired')
            : t('contact_form.error_generic')}
        </Alert>
      )}

      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {serverData?.success && t('contact_form.success_title')}
        {serverErrors?.form && t('contact_form.error_generic')}
      </div>

      <div>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? t('contact_form.submitting')
            : t('contact_form.submit')}
        </Button>
      </div>
    </fetcher.Form>
  );
}

function Field({
  label,
  htmlFor,
  hint,
  error,
  trailing,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  trailing?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-4">
        <label
          htmlFor={htmlFor}
          className="font-sans text-sm font-medium text-ink"
        >
          {label}
          {hint && (
            <span className="ml-2 font-normal text-ink-soft">{hint}</span>
          )}
        </label>
        {trailing}
      </div>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} className="text-sm text-ember" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

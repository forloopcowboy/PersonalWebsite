export const TOPIC_KEYS = [
  "quote",
  "games",
  "technical",
  "meeting",
  "other",
] as const;

export type TopicKey = (typeof TOPIC_KEYS)[number];

export const TOPIC_EMAIL_LABELS: Record<TopicKey, string> = {
  quote: "Quote a project",
  games: "Games & entertainment",
  technical: "Technical question",
  meeting: "Book a meeting",
  other: "Other",
};

export function isValidTopicKey(key: string): key is TopicKey {
  return (TOPIC_KEYS as readonly string[]).includes(key);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ContactFormErrors {
  name?: string;
  email?: string;
  topics?: string;
  message?: string;
  form?: string;
}

export interface ContactFormFields {
  name: string;
  email: string;
  topics: TopicKey[];
  message: string;
}

export function validateContactFields(raw: {
  name: unknown;
  email: unknown;
  topics: unknown[];
  message: unknown;
}):
  | { valid: true; data: ContactFormFields }
  | { valid: false; errors: ContactFormErrors } {
  const errors: ContactFormErrors = {};

  const name = typeof raw.name === "string" ? raw.name.trim() : "";
  const email = typeof raw.email === "string" ? raw.email.trim() : "";
  const topics = (Array.isArray(raw.topics) ? raw.topics : []).filter(
    (t): t is TopicKey => typeof t === "string" && isValidTopicKey(t),
  );
  const message = typeof raw.message === "string" ? raw.message.trim() : "";

  if (!name) errors.name = "name_required";
  if (!email) errors.email = "email_required";
  else if (!EMAIL_RE.test(email)) errors.email = "email_invalid";
  if (topics.length === 0) errors.topics = "topic_required";
  if (!message) errors.message = "message_required";

  if (Object.keys(errors).length > 0) return { valid: false, errors };
  return { valid: true, data: { name, email, topics, message } };
}

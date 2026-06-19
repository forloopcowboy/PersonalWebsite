import { createHmac, timingSafeEqual } from "node:crypto";
import { Resend } from "resend";
import {
  TOPIC_EMAIL_LABELS,
  type ContactFormFields,
  type TopicKey,
} from "./contact-form";

export function signTimestamp(ts: number, secret: string): string {
  return createHmac("sha256", secret).update(String(ts)).digest("hex");
}

function verifyTimestamp(
  ts: number,
  signature: string,
  secret: string,
): boolean {
  const expected = signTimestamp(ts, secret);
  if (expected.length !== signature.length) return false;
  return timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

const MIN_SUBMIT_MS = 2_000;
const MAX_SUBMIT_MS = 24 * 60 * 60 * 1_000;

export function isTimestampValid(ts: number, signature: string): boolean {
  const secret = process.env.CONTACT_FORM_SECRET;
  if (!secret) {
    console.error("[contact] CONTACT_FORM_SECRET is not set");
    return false;
  }
  if (!verifyTimestamp(ts, signature, secret)) return false;
  const elapsed = Date.now() - ts;
  return elapsed >= MIN_SUBMIT_MS && elapsed <= MAX_SUBMIT_MS;
}

export function createSignedTimestamp(): {
  timestamp: number;
  signature: string;
} {
  const secret = process.env.CONTACT_FORM_SECRET;
  if (!secret) {
    console.error("[contact] CONTACT_FORM_SECRET is not set");
    return { timestamp: 0, signature: "" };
  }
  const timestamp = Date.now();
  return { timestamp, signature: signTimestamp(timestamp, secret) };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildHtmlEmail(
  fields: ContactFormFields,
  topicLabels: string[],
): string {
  const name = escapeHtml(fields.name);
  const email = escapeHtml(fields.email);
  const message = escapeHtml(fields.message);
  const topics = topicLabels.map(escapeHtml).join(", ");

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background-color:#15110D;color:#F0E8DA;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:16px;line-height:1.625;">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px;">
    <div style="border-bottom:1px solid #2D2620;padding-bottom:16px;margin-bottom:32px;">
      <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:0.18em;color:#A8978A;font-family:'JetBrains Mono',monospace;">
        forloopcowboy.com contact
      </p>
    </div>
    <table style="margin-bottom:32px;font-size:14px;line-height:1.6;border-collapse:collapse;" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding:4px 20px 4px 0;color:#A8978A;vertical-align:top;white-space:nowrap;">From</td>
        <td style="padding:4px 0;">${name}</td>
      </tr>
      <tr>
        <td style="padding:4px 20px 4px 0;color:#A8978A;vertical-align:top;white-space:nowrap;">Email</td>
        <td style="padding:4px 0;"><a href="mailto:${email}" style="color:#C2575A;text-decoration:none;">${email}</a></td>
      </tr>
      <tr>
        <td style="padding:4px 20px 4px 0;color:#A8978A;vertical-align:top;white-space:nowrap;">Topics</td>
        <td style="padding:4px 0;">${topics}</td>
      </tr>
    </table>
    <div style="border-top:1px solid #2D2620;padding-top:24px;white-space:pre-wrap;">${message}</div>
  </div>
</body>
</html>`;
}

// Upstash Ratelimit (@upstash/ratelimit) is the lightweight upgrade path
// if abuse becomes a real problem. The stateless honeypot + timestamp
// checks here are sufficient for a personal site's traffic level.

export async function sendContactEmail(
  fields: ContactFormFields,
): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY is not set");
    return { success: false, error: "Server configuration error" };
  }

  const resend = new Resend(apiKey);
  const topicLabels = fields.topics.map((t) => TOPIC_EMAIL_LABELS[t]);

  const text = [
    `New message from ${fields.name} <${fields.email}>`,
    `Topics: ${topicLabels.join(", ")}`,
    "",
    "---",
    "",
    fields.message,
  ].join("\n");

  const html = buildHtmlEmail(fields, topicLabels);

  const { error } = await resend.emails.send({
    from: "forloopcowboy contact <forms@forloopcowboy.com>",
    to: "contact@forloopcowboy.com",
    replyTo: fields.email,
    subject: `[Contact] [${topicLabels.join(", ")}] ${fields.name}`,
    text,
    html,
  });

  if (error) {
    console.error("[contact] Resend error:", error);
    return { success: false, error: "Failed to send message" };
  }

  return { success: true };
}

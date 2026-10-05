import type { SESv2Client } from '@aws-sdk/client-sesv2';
import { site } from './site';

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

/*
 * Where enquiries go, and who they are sent as.
 *
 * Read from the environment: `.env` in development, and constants compiled
 * into the bundle in production, because a Lambda@Edge function cannot carry
 * environment variables. Neither is a secret — the IAM role, not a key, is
 * what authorises sending.
 */
const TO = process.env.CONTACT_TO_EMAIL;
const FROM = process.env.CONTACT_FROM_EMAIL ?? TO;
const REGION = process.env.SES_REGION ?? 'us-east-1';

let client: SESv2Client | undefined = undefined;

/**
 * Delivers a contact form submission by email.
 *
 * The message is sent *from* our own verified address with the visitor's
 * address as Reply-To. Sending as the visitor would be spoofing, and would be
 * rejected by their domain's DMARC policy in any case.
 */
export const sendContactMessage = async ({
  name,
  email,
  message,
}: ContactMessage): Promise<void> => {
  if (!TO || !FROM) {
    if (import.meta.env.PROD) throw new Error('CONTACT_TO_EMAIL is not configured');

    // Development without mail configured: show what would have been sent.
    console.info('[contact] not sent — set CONTACT_TO_EMAIL to deliver', { name, email, message });
    return;
  }

  /*
   * Loaded on first use rather than at the top of the file. The AWS SDK is by
   * far the heaviest thing this server can import, and only this one action
   * needs it — every page render would otherwise pay for it on a cold start.
   */
  const { SESv2Client: Client, SendEmailCommand } = await import('@aws-sdk/client-sesv2');
  client ??= new Client({ region: REGION });

  await client.send(
    new SendEmailCommand({
      FromEmailAddress: FROM,
      Destination: { ToAddresses: [TO] },
      ReplyToAddresses: [email],
      Content: {
        Simple: {
          Subject: { Charset: 'UTF-8', Data: `Сообщение с сайта ${new URL(site.url).host}` },
          Body: {
            Text: {
              Charset: 'UTF-8',
              Data: `От: ${name} <${email}>\n\n${message}`,
            },
          },
        },
      },
    }),
  );
};

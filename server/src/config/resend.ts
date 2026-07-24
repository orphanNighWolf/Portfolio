import { Resend } from "resend";
import pino from "pino";

const logger = pino({
  transport: {
    target: "pino-pretty",
  },
});

const resendApiKey = process.env.RESEND_API_KEY || "re_mockKey123";
export const resendClient = new Resend(resendApiKey);

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

/**
 * Send an email using Resend service.
 * (Stub/wrapper utility implementation)
 */
export async function sendEmail({ to, subject, html: _html, from: _from = "Portfolio <noreply@anni.dev>" }: SendEmailOptions): Promise<{ id: string }> {
  logger.info(`Resend: Sending email stub called to: ${to}, subject: "${subject}"`);
  return {
    id: "mock_resend_email_id_12345",
  };
}

import { appConfig } from "../../config/app-config.js";
import { logger } from "../../shared/logging/logger.js";

export interface OutboundEmail {
  to: string;
  subject: string;
  text: string;
}

export async function sendEmail(message: OutboundEmail): Promise<void> {
  if (appConfig.NODE_ENV === "production") {
    logger.warn(
      { to: message.to, subject: message.subject },
      "email delivery is not configured for production yet"
    );
    return;
  }

  logger.info(
    {
      from: appConfig.EMAIL_FROM,
      to: message.to,
      subject: message.subject,
      preview: message.text.slice(0, 240)
    },
    "dev email dispatched"
  );
}

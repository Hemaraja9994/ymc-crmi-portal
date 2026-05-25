import { Resend } from "resend";

export function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

export const scheduleEmailFrom = process.env.SCHEDULE_EMAIL_FROM || "YMC CRMI Portal <onboarding@resend.dev>";

import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

/** Whether the app is on internal network and should send real emails */
export function shouldSendEmail(): boolean {
  return process.env.KFIA_INTERNAL_NETWORK === "1";
}

/** Create Nodemailer transporter (same config as contact.ts) */
export function createContactTransporter(): Transporter {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

/** Riyadh time for email footers */
export function submittedAt(): string {
  return new Date().toLocaleString("en-US", { timeZone: "Asia/Riyadh" });
}

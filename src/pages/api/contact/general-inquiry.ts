import type { NextApiRequest, NextApiResponse } from "next";
import { createContactTransporter, shouldSendEmail, submittedAt } from "lib/email";

type GeneralInquiryBody = {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  category: string;
  subject: string;
  message: string;
};

const CATEGORY_LABELS: Record<string, string> = {
  procurement: "Procurement",
  operations: "Operations",
  general: "General Inquiry",
};

const SUBJECT_LABELS: Record<string, string> = {
  services: "Airport Services",
  opportunities: "Business Opportunities",
  other: "Other",
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!shouldSendEmail()) {
    console.log("[General Inquiry] Skipping email (not on internal network)");
    return res.status(200).json({
      success: true,
      message: "Form submitted successfully (development mode - email not sent)",
    });
  }

  const body = req.body as GeneralInquiryBody;
  const { fullName, company, email, phone, category, subject, message } = body;

  if (!fullName?.trim() || !company?.trim() || !email?.trim() || !category || !subject || !message?.trim()) {
    return res.status(400).json({ error: "Required fields are missing" });
  }

  try {
    const transporter = createContactTransporter();
    const categoryText = CATEGORY_LABELS[category] || category;
    const subjectText = SUBJECT_LABELS[subject] || subject;

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      replyTo: email,
      subject: `General Inquiry: ${categoryText} - ${subjectText}`,
      html: `
        <h2>New General Inquiry</h2>
        <p><strong>Full Name:</strong> ${escapeHtml(fullName)}</p>
        <p><strong>Company / Organization:</strong> ${escapeHtml(company)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone || "—")}</p>
        <p><strong>Category:</strong> ${escapeHtml(categoryText)}</p>
        <p><strong>Subject of Inquiry:</strong> ${escapeHtml(subjectText)}</p>
        <hr>
        <h3>Message</h3>
        <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
        <hr>
        <p style="color:#666;font-size:12px;">Submitted at: ${submittedAt()} (Riyadh Time)</p>
      `,
      text: `
New General Inquiry

Full Name: ${fullName}
Company: ${company}
Email: ${email}
Phone: ${phone || "—"}
Category: ${categoryText}
Subject: ${subjectText}

Message:
${message}

Submitted at: ${submittedAt()} (Riyadh Time)
      `.trim(),
    });

    console.log("[General Inquiry] Email sent to", process.env.SMTP_USER);
    return res.status(200).json({ success: true, message: "Your inquiry has been sent successfully." });
  } catch (err: unknown) {
    console.error("[General Inquiry] Error:", err);
    return res.status(500).json({
      error: "Failed to send inquiry",
      details: err instanceof Error ? err.message : "Unknown error",
    });
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

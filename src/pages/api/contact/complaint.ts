import type { NextApiRequest, NextApiResponse } from "next";
import { createContactTransporter, shouldSendEmail, submittedAt } from "lib/email";
import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

const parseForm = (req: NextApiRequest): Promise<{ fields: any; files: any }> =>
  new Promise((resolve, reject) => {
    const form = formidable({ multiples: false });

    form.parse(req, (err: any, fields: any, files: any) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });

type ComplaintBody = {
  fullName: string;
  phone: string;
  email: string;
  complaintType: string;
  details: string;
  attachedFileNames?: string[];
};

const COMPLAINT_TYPE_LABELS: Record<string, string> = {
  service: "Service Quality",
  facility: "Facility Issue",
  staff: "Staff Conduct",
  other: "Other",
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Parse the multipart/form-data
    const form = formidable({ multiples: false });
    const { fields, files } = await new Promise<{ fields: any; files: any }>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const fullName = fields.fullName?.toString() || "";
    const phone = fields.phone?.toString() || "";
    const email = fields.email?.toString() || "";
    const complaintType = fields.complaintType?.toString() || "";
    const details = fields.details?.toString() || "";

    // Collect uploaded files safely
    const attachedFiles = files.file
      ? Array.isArray(files.file)
        ? files.file
        : [files.file]
      : [];

    // Validation
    if (!fullName.trim() || !email.trim() || !complaintType || !details.trim()) {
      return res.status(400).json({ error: "Required fields are missing" });
    }

    if (!shouldSendEmail()) {
      console.log("[Complaint] Skipping email (not on internal network)");
      return res.status(200).json({
        success: true,
        message: "Complaint submitted successfully (development mode - email not sent)",
      });
    }

    const transporter = createContactTransporter();
    const typeText = COMPLAINT_TYPE_LABELS[complaintType] || complaintType;

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      replyTo: email,
      subject: `Complaint: ${typeText} - ${fullName.trim()}`,
      html: `
        <h2>New Complaint Submission</h2>
        <p><strong>Full Name:</strong> ${escapeHtml(fullName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone || "—")}</p>
        <p><strong>Type of Complaint:</strong> ${escapeHtml(typeText)}</p>
        <hr>
        <h3>Details</h3>
        <p>${escapeHtml(details).replace(/\n/g, "<br>")}</p>
        <hr>
        <h3>Attachments</h3>
        ${attachedFiles.length
          ? `<p>${attachedFiles.map((f: any) => escapeHtml(f.originalFilename || f.newFilename)).join("<br>")}</p>`
          : "<p><em>No files attached.</em></p>"
        }
        <hr>
        <p style="color:#666;font-size:12px;">Submitted at: ${submittedAt()} (Riyadh Time)</p>
      `,
      text: `
New Complaint Submission
Full Name: ${fullName}
Email: ${email}
Phone: ${phone || "—"}
Type: ${typeText}

Details:
${details}

Attached file names: ${attachedFiles.map((f: any) => f.originalFilename).join(", ") || "None"}

Submitted at: ${submittedAt()} (Riyadh Time)
      `.trim(),
      attachments: attachedFiles.map((f: any) => ({
        filename: f.originalFilename || "file",
        path: f.filepath,
      })),
    });

    console.log("[Complaint] Email sent to", process.env.SMTP_USER);
    return res.status(200).json({
      success: true,
      message: "Your complaint has been submitted successfully.",
    });
  } catch (err: unknown) {
    console.error("[Complaint] Error:", err);
    return res.status(500).json({
      error: "Failed to submit complaint",
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

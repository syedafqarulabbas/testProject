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

type InvestmentAreas = {
  airline: boolean;
  cargo: boolean;
  realEstate: boolean;
  mro: boolean;
  retail: boolean;
  other: boolean;
};

type InvestmentBody = {
  fullName: string;
  companyName: string;
  positionTitle: string;
  nationality: string;
  businessRegistrationNumber: string;
  contactEmail: string;
  contactPhone: string;
  investmentAreas: InvestmentAreas;
  otherAreaSpecify: string;
  projectTitle: string;
  briefDescription: string;
  estimatedInvestment: string;
  proposedTimeline: string;
  locationPreference: string;
  businessProfileFileNames?: string[];
  proposalFileNames?: string[];
};

const AREA_LABELS: Record<keyof InvestmentAreas, string> = {
  airline: "Airline Partnerships",
  cargo: "Cargo & Logistics",
  realEstate: "Real Estate & Leasing",
  mro: "Maintenance, Repair & Overhaul (MRO)",
  retail: "Retail & F&B Concessions",
  other: "Other",
};

function areasToList(areas: InvestmentAreas, otherSpecify: string): string {
  const lines = (Object.entries(areas) as [keyof InvestmentAreas, boolean][])
    .filter(([, v]) => v)
    .map(([k]) => AREA_LABELS[k] || k);
  if (areas.other && otherSpecify?.trim()) {
    lines[lines.length - 1] = `Other: ${otherSpecify.trim()}`;
  }
  return lines.length ? lines.join(", ") : "—";
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!shouldSendEmail()) {
    console.log("[Investment Inquiry] Skipping email (not on internal network)");
    return res.status(200).json({
      success: true,
      message: "Proposal submitted successfully (development mode - email not sent)",
    });
  }

  const { fields, files } = await parseForm(req);

  // Extract text fields
  const fullName = fields.fullName?.toString();
  const companyName = fields.companyName?.toString();
  const positionTitle = fields.positionTitle?.toString();
  const nationality = fields.nationality?.toString();
  const businessRegistrationNumber = fields.businessRegistrationNumber?.toString();
  const contactEmail = fields.contactEmail?.toString();
  const contactPhone = fields.contactPhone?.toString();
  const projectTitle = fields.projectTitle?.toString();
  const briefDescription = fields.briefDescription?.toString();
  const estimatedInvestment = fields.estimatedInvestment?.toString();
  const proposedTimeline = fields.proposedTimeline?.toString();
  const locationPreference = fields.locationPreference?.toString();
  const otherAreaSpecify = fields.otherAreaSpecify?.toString();
  const investmentAreas: InvestmentAreas = fields.investmentAreas as InvestmentAreas || {} as InvestmentAreas;

  // Collect uploaded files
  const businessProfileFiles = files.businessProfile
    ? Array.isArray(files.businessProfile)
      ? files.businessProfile
      : [files.businessProfile]
    : [];

  const proposalFiles = files.proposal
    ? Array.isArray(files.proposal)
      ? files.proposal
      : [files.proposal]
    : [];

  if (
    !fullName?.trim() ||
    !companyName?.trim() ||
    !positionTitle?.trim() ||
    !contactEmail?.trim() ||
    !contactPhone?.trim() ||
    !projectTitle?.trim() ||
    !briefDescription?.trim()
  ) {
    return res.status(400).json({ error: "Required fields are missing" });
  }

  try {
    const transporter = createContactTransporter();
    const areasText = areasToList(investmentAreas || ({} as InvestmentAreas), otherAreaSpecify || "");
    const profileList =
      businessProfileFiles.length > 0
        ? `<ul>${businessProfileFiles
          .map((f: any) => `<li>${escapeHtml(f.originalFilename || "businessProfile")}</li>`)
          .join("")}</ul>`
        : "<p><em>None</em></p>";

    const proposalList =
      proposalFiles.length > 0
        ? `<ul>${proposalFiles
          .map((f: any) => `<li>${escapeHtml(f.originalFilename || "proposal")}</li>`)
          .join("")}</ul>`
        : "<p><em>None</em></p>";

    // Prepare attachments
    const attachments: any[] = [];

    // Add business profile files
    businessProfileFiles.forEach((f: any) => {
      if (f?.filepath) {
        attachments.push({
          filename: f.originalFilename || "businessProfile",
          path: f.filepath, // Nodemailer will attach from file path
        });
      }
    });

    // Add proposal files
    proposalFiles.forEach((f: any) => {
      if (f?.filepath) {
        attachments.push({
          filename: f.originalFilename || "proposal",
          path: f.filepath,
        });
      }
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      replyTo: contactEmail,
      subject: `Investment Proposal: ${projectTitle.trim()}`,
      html: `
        <h2>New Investment Proposal</h2>
        <h3>Investor Information</h3>
        <p><strong>Full Name:</strong> ${escapeHtml(fullName)}</p>
        <p><strong>Company:</strong> ${escapeHtml(companyName)}</p>
        <p><strong>Position / Title:</strong> ${escapeHtml(positionTitle)}</p>
        <p><strong>Nationality:</strong> ${escapeHtml(nationality || "—")}</p>
        <p><strong>Business Registration Number:</strong> ${escapeHtml(businessRegistrationNumber || "—")}</p>
        <p><strong>Contact Email:</strong> ${escapeHtml(contactEmail)}</p>
        <p><strong>Contact Phone:</strong> ${escapeHtml(contactPhone)}</p>
        <hr>
        <h3>Investment Area(s)</h3>
        <p>${escapeHtml(areasText)}</p>
        <hr>
        <h3>Proposal Details</h3>
        <p><strong>Project Title:</strong> ${escapeHtml(projectTitle)}</p>
        <p><strong>Brief Description:</strong></p>
        <p>${escapeHtml(briefDescription).replace(/\n/g, "<br>")}</p>
        <p><strong>Estimated Investment:</strong> ${escapeHtml(estimatedInvestment || "—")}</p>
        <p><strong>Proposed Timeline:</strong> ${escapeHtml(proposedTimeline || "—")}</p>
        <p><strong>Location Preference:</strong> ${escapeHtml(locationPreference || "—")}</p>
        <hr>
        <h3>Supporting Documents (listed)</h3>
        <p><strong>Business Profile / Brochure:</strong></p>
        ${profileList}
        <p><strong>Detailed Proposal:</strong></p>
        ${proposalList}
        <hr>
        <p style="color:#666;font-size:12px;">Submitted at: ${submittedAt()} (Riyadh Time)</p>
      `,
      text: `
New Investment Proposal

Investor Information
Full Name: ${fullName}
Company: ${companyName}
Position: ${positionTitle}
Nationality: ${nationality || "—"}
Business Reg.: ${businessRegistrationNumber || "—"}
Email: ${contactEmail}
Phone: ${contactPhone}

Investment Areas: ${areasText}

Proposal
Title: ${projectTitle}
Description: ${briefDescription}
Estimated Investment: ${estimatedInvestment || "—"}
Timeline: ${proposedTimeline || "—"}
Location: ${locationPreference || "—"}

Business profile files: ${businessProfileFiles.join(", ") || "None"}
Proposal files: ${proposalFiles.join(", ") || "None"}

Submitted at: ${submittedAt()} (Riyadh Time)
      `.trim(),
      attachments,
    });

    console.log("[Investment Inquiry] Email sent to", process.env.SMTP_USER);
    return res.status(200).json({ success: true, message: "Your investment proposal has been submitted successfully." });
  } catch (err: unknown) {
    console.error("[Investment Inquiry] Error:", err);
    return res.status(500).json({
      error: "Failed to submit proposal",
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

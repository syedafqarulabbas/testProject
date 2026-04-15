import type { NextApiRequest, NextApiResponse } from 'next';
import { createContactTransporter, shouldSendEmail, submittedAt } from 'lib/email';

type ContactFormData = {
  first: string;
  last: string;
  phone: string;
  email: string;
  subject: string;
  comments: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!shouldSendEmail()) {
    console.log('[Contact Form] Skipping email send (not on internal network)');
    return res.status(200).json({
      success: true,
      message: 'Form submitted successfully (development mode - email not sent)'
    });
  }

  const { first, last, phone, email, subject, comments } = req.body as ContactFormData;

  // Validate required fields
  if (!first || !last || !phone || !email || !subject || !comments) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const transporter = createContactTransporter();

    // Map subject values to readable text
    const subjectMap: Record<string, string> = {
      'lost-found': 'Lost & Found',
      'immigration': 'Immigration',
      'help-desk': 'Help Desk',
      'baggage-services': 'Baggage Services',
      'security': 'Security',
      'customs': 'Customs',
      'airline': 'Airline',
      'ground-transport': 'Ground Transportation',
      'parking': 'Parking',
      'accessibility': 'Accessibility Services',
      'flight-info': 'Flight Information',
      'other': 'Other',
    };

    const subjectText = subjectMap[subject] || subject;

    // Email content
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER, // Send to contact-us@kfia.sa
      replyTo: email,
      subject: `Contact Form: ${subjectText}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${first} ${last}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Subject:</strong> ${subjectText}</p>
        <hr>
        <h3>Message:</h3>
        <p>${comments.replace(/\n/g, '<br>')}</p>
        <hr>
        <p style="color: #666; font-size: 12px;">
          Submitted at: ${submittedAt()} (Riyadh Time)
        </p>
      `,
      text: `
New Contact Form Submission

From: ${first} ${last}
Email: ${email}
Phone: ${phone}
Subject: ${subjectText}

Message:
${comments}

Submitted at: ${submittedAt()} (Riyadh Time)
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    console.log('[Contact Form] Email sent successfully to', process.env.SMTP_USER);
    return res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully!'
    });

  } catch (error: any) {
    console.error('[Contact Form] Error sending email:', error);
    return res.status(500).json({
      error: 'Failed to send email',
      details: error.message
    });
  }
}

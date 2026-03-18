// ---------------------------------------------------------------------------
// Gmail SMTP email utility (via nodemailer)
// Env vars required:
//   SMTP_USER              — Gmail address (e.g. sjcbrmarketing@gmail.com)
//   SMTP_PASS              — Gmail App Password (16-char, NOT your account password)
//   NEXT_PUBLIC_APP_URL    — base URL of the app (e.g. https://yoursite.vercel.app)
// ---------------------------------------------------------------------------
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const ADMIN_EMAIL = 'reservation@stjamescourtbeachresort.com';
const RESORT_NAME = 'St. James Court Beach Resort';

// ---------------------------------------------------------------------------
// Shared types
// ---------------------------------------------------------------------------
interface NightDetail {
  date: string;
  rooms: number;
  basePrice: number;
  discountPercent: number | null;
  finalPrice: number;
}

export interface BookingEmailData {
  bookingId: number;
  fullName: string;
  phone: string;
  email?: string;
  categoryName: string;
  categoryCode: string;
  checkIn: string;
  checkOut: string;
  nights: NightDetail[];
  rooms: number;
  adults: number;
  children: number;
  extraBeds: number;
  extraBedTotal: number;
  privilegeApplied: boolean;
  privilegeCardNumber?: string;
  baseAmount: number;
  discountAmount: number;
  finalAmount: number;
  paymentStatus: string;
  specialRequests?: string;
}

export interface ContactEmailData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  submittedAt?: string;
}

// ---------------------------------------------------------------------------
// Format helpers
// ---------------------------------------------------------------------------
function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

// ---------------------------------------------------------------------------
// Shared email wrapper (header + footer)
// ---------------------------------------------------------------------------
function wrapEmail(headerBg: string, headerContent: string, bodyContent: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
</head>
<body style="margin:0;padding:0;background:#f5f0eb;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0eb;padding:32px 0;">
    <tr><td align="center">
      <table width="620" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:${headerBg};padding:36px 40px;text-align:center;">
            <p style="margin:0;color:#c9a96e;font-size:11px;letter-spacing:3px;text-transform:uppercase;font-weight:600;">${RESORT_NAME}</p>
            ${headerContent}
          </td>
        </tr>

        <!-- Body -->
        <tr><td style="padding:36px 40px;">${bodyContent}</td></tr>

        <!-- Footer -->
        <tr>
          <td style="background:#1a3a2a;padding:20px 40px;text-align:center;">
            <p style="margin:0;color:#a8c5b0;font-size:12px;">${RESORT_NAME}</p>
            <p style="margin:4px 0 0;color:#6a9a78;font-size:11px;">State Highway 49, Chinna Kalapet, Puducherry 605014</p>
            <p style="margin:4px 0 0;color:#6a9a78;font-size:11px;">This is an automated message — please do not reply.</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function sectionHeading(title: string): string {
  return `<h2 style="margin:0 0 16px;color:#1a3a2a;font-size:15px;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid #c9a96e;padding-bottom:8px;">${title}</h2>`;
}

function infoRow(label: string, value: string, highlight = false): string {
  return `<tr>
    <td style="padding:6px 0;color:#888;font-size:13px;width:150px;vertical-align:top;">${label}</td>
    <td style="padding:6px 0;font-size:13px;font-weight:${highlight ? '700' : '600'};color:${highlight ? '#1a3a2a' : '#2c2c2c'};">${value}</td>
  </tr>`;
}

// ===========================================================================
// 1. ADMIN — Booking Notification
// ===========================================================================
function buildAdminBookingHtml(data: BookingEmailData): string {
  const nightCount = data.nights.length;
  const roomLabel: Record<string, string> = { DELUXE: 'Deluxe Room', SUPER_DELUXE: 'Super Deluxe Room', SUITE: 'Suite' };
  const roomName = roomLabel[data.categoryCode] ?? data.categoryName;

  const nightRows = data.nights.map((n) => `
    <tr>
      <td style="padding:7px 12px;border-bottom:1px solid #f0ebe4;color:#555;font-size:13px;">${formatDate(n.date)}</td>
      <td style="padding:7px 12px;border-bottom:1px solid #f0ebe4;color:#555;font-size:13px;text-align:right;">${formatCurrency(n.basePrice)}</td>
      <td style="padding:7px 12px;border-bottom:1px solid #f0ebe4;color:#555;font-size:13px;text-align:right;">${n.discountPercent ? `${n.discountPercent}%` : '—'}</td>
      <td style="padding:7px 12px;border-bottom:1px solid #f0ebe4;font-weight:600;color:#2c2c2c;font-size:13px;text-align:right;">${formatCurrency(n.finalPrice)}</td>
    </tr>`).join('');

  const header = `
    <h1 style="margin:10px 0 0;color:#ffffff;font-size:24px;font-weight:700;">New Reservation Received</h1>
    <p style="margin:8px 0 0;color:#a8c5b0;font-size:13px;">Booking ID: <strong style="color:#fff;">#${data.bookingId}</strong></p>`;

  const body = `
    ${sectionHeading('Guest Details')}
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      ${infoRow('Full Name', data.fullName)}
      ${infoRow('Phone', data.phone)}
      ${data.email ? infoRow('Email', data.email) : ''}
      ${data.privilegeApplied ? infoRow('Privilege Card', `<span style="color:#c9a96e;">${data.privilegeCardNumber}</span>`) : ''}
    </table>

    ${sectionHeading('Reservation Details')}
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      ${infoRow('Room Type', roomName)}
      ${infoRow('Check-In', formatDate(data.checkIn))}
      ${infoRow('Check-Out', formatDate(data.checkOut))}
      ${infoRow('Duration', `${nightCount} Night${nightCount > 1 ? 's' : ''}`)}
      ${infoRow('Rooms', String(data.rooms))}
      ${infoRow('Guests', `${data.adults} Adult${data.adults > 1 ? 's' : ''}${data.children > 0 ? `, ${data.children} Child${data.children > 1 ? 'ren' : ''}` : ''}${data.extraBeds > 0 ? `, ${data.extraBeds} Extra Bed${data.extraBeds > 1 ? 's' : ''}` : ''}`)}
      ${data.specialRequests ? infoRow('Special Requests', `<em>${data.specialRequests}</em>`) : ''}
    </table>

    ${sectionHeading('Night-by-Night Pricing')}
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f0ebe4;border-radius:6px;overflow:hidden;margin-bottom:28px;">
      <thead><tr style="background:#f5f0eb;">
        <th style="padding:9px 12px;text-align:left;color:#888;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Date</th>
        <th style="padding:9px 12px;text-align:right;color:#888;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Base Rate</th>
        <th style="padding:9px 12px;text-align:right;color:#888;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Discount</th>
        <th style="padding:9px 12px;text-align:right;color:#888;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Final</th>
      </tr></thead>
      <tbody>${nightRows}</tbody>
    </table>

    ${sectionHeading('Amount Summary')}
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0eb;border-radius:6px;padding:18px;margin-bottom:8px;">
      <tr>
        <td style="padding:4px 0;color:#555;font-size:13px;">Room Charges</td>
        <td style="padding:4px 0;color:#2c2c2c;font-size:13px;text-align:right;">${formatCurrency(data.baseAmount - data.extraBedTotal)}</td>
      </tr>
      ${data.extraBeds > 0 ? `<tr><td style="padding:4px 0;color:#555;font-size:13px;">Extra Bed Charges</td><td style="padding:4px 0;color:#2c2c2c;font-size:13px;text-align:right;">${formatCurrency(data.extraBedTotal)}</td></tr>` : ''}
      ${data.discountAmount > 0 ? `<tr><td style="padding:4px 0;color:#c9a96e;font-size:13px;">Privilege Discount</td><td style="padding:4px 0;color:#c9a96e;font-size:13px;text-align:right;">− ${formatCurrency(data.discountAmount)}</td></tr>` : ''}
      <tr><td colspan="2" style="padding:8px 0 0;border-top:1px solid #ddd;"></td></tr>
      <tr>
        <td style="padding:4px 0;color:#1a3a2a;font-size:15px;font-weight:700;">Total Amount</td>
        <td style="padding:4px 0;color:#1a3a2a;font-size:15px;font-weight:700;text-align:right;">${formatCurrency(data.finalAmount)}</td>
      </tr>
      <tr><td colspan="2" style="padding:6px 0 0;color:#888;font-size:12px;">Payment Status: <strong style="color:${data.paymentStatus === 'PAID' ? '#2d7a4a' : '#d97706'};">${data.paymentStatus}</strong></td></tr>
    </table>`;

  return wrapEmail('linear-gradient(135deg,#1a3a2a 0%,#2d5a3d 100%)', header, body);
}

// ===========================================================================
// 2. USER — Booking Confirmation
// ===========================================================================
function buildUserBookingHtml(data: BookingEmailData): string {
  const nightCount = data.nights.length;
  const roomLabel: Record<string, string> = { DELUXE: 'Deluxe Room', SUPER_DELUXE: 'Super Deluxe Room', SUITE: 'Suite' };
  const roomName = roomLabel[data.categoryCode] ?? data.categoryName;

  const header = `
    <h1 style="margin:10px 0 0;color:#ffffff;font-size:24px;font-weight:700;">Booking Confirmed!</h1>
    <p style="margin:8px 0 0;color:#a8c5b0;font-size:13px;">Your reservation is confirmed. We look forward to welcoming you!</p>
    <div style="margin:16px auto 0;background:rgba(255,255,255,0.12);border-radius:8px;padding:12px 24px;display:inline-block;">
      <p style="margin:0;color:#c9a96e;font-size:11px;text-transform:uppercase;letter-spacing:2px;">Booking Reference</p>
      <p style="margin:4px 0 0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:1px;">#${data.bookingId}</p>
    </div>`;

  const body = `
    <p style="margin:0 0 24px;color:#555;font-size:14px;line-height:1.6;">Dear <strong>${data.fullName}</strong>,<br/>
    Thank you for choosing ${RESORT_NAME}. Your booking has been successfully received and confirmed. Below is a summary of your reservation.</p>

    ${sectionHeading('Your Stay')}
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      ${infoRow('Room Type', `<strong style="color:#1a3a2a;">${roomName}</strong>`)}
      ${infoRow('Check-In', `<strong>${formatDate(data.checkIn)}</strong>`)}
      ${infoRow('Check-Out', `<strong>${formatDate(data.checkOut)}</strong>`)}
      ${infoRow('Duration', `${nightCount} Night${nightCount > 1 ? 's' : ''}`)}
      ${infoRow('Rooms', String(data.rooms))}
      ${infoRow('Guests', `${data.adults} Adult${data.adults > 1 ? 's' : ''}${data.children > 0 ? `, ${data.children} Child${data.children > 1 ? 'ren' : ''}` : ''}${data.extraBeds > 0 ? `, ${data.extraBeds} Extra Bed${data.extraBeds > 1 ? 's' : ''}` : ''}`)}
      ${data.specialRequests ? infoRow('Special Requests', `<em style="color:#555;">${data.specialRequests}</em>`) : ''}
    </table>

    ${sectionHeading('Amount Summary')}
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0eb;border-radius:8px;padding:20px;margin-bottom:28px;">
      <tr>
        <td style="padding:5px 0;color:#555;font-size:13px;">Room Charges (${nightCount} night${nightCount > 1 ? 's' : ''})</td>
        <td style="padding:5px 0;color:#2c2c2c;font-size:13px;text-align:right;">${formatCurrency(data.baseAmount - data.extraBedTotal)}</td>
      </tr>
      ${data.extraBeds > 0 ? `<tr><td style="padding:5px 0;color:#555;font-size:13px;">Extra Bed Charges</td><td style="padding:5px 0;color:#2c2c2c;font-size:13px;text-align:right;">${formatCurrency(data.extraBedTotal)}</td></tr>` : ''}
      ${data.discountAmount > 0 ? `<tr><td style="padding:5px 0;color:#c9a96e;font-size:13px;">✦ Privilege Member Discount</td><td style="padding:5px 0;color:#c9a96e;font-size:13px;text-align:right;">− ${formatCurrency(data.discountAmount)}</td></tr>` : ''}
      <tr><td colspan="2" style="padding:10px 0 0;border-top:1px solid #ddd;"></td></tr>
      <tr>
        <td style="padding:4px 0;color:#1a3a2a;font-size:16px;font-weight:700;">Total Amount</td>
        <td style="padding:4px 0;color:#1a3a2a;font-size:16px;font-weight:700;text-align:right;">${formatCurrency(data.finalAmount)}</td>
      </tr>
    </table>

    <!-- Check-in info box -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#e8f4ec;border-left:4px solid #2d7a4a;border-radius:4px;padding:16px;margin-bottom:28px;">
      <tr><td>
        <p style="margin:0;color:#1a3a2a;font-size:13px;font-weight:700;">Check-in Information</p>
        <p style="margin:6px 0 0;color:#2d5a3d;font-size:13px;line-height:1.6;">
          • Check-in time: <strong>2:00 PM</strong> &nbsp;|&nbsp; Check-out time: <strong>11:00 AM</strong><br/>
          • Please carry a valid photo ID at check-in<br/>
          • For early check-in or late check-out, contact us in advance
        </p>
      </td></tr>
    </table>

    <p style="margin:0;color:#888;font-size:12px;line-height:1.6;">
      Need help? Call us at <strong>+91 94432 52776</strong> or email <strong>reservation@stjamescourtbeachresort.com</strong>
    </p>`;

  return wrapEmail('linear-gradient(135deg,#1a4a3a 0%,#2d7a5d 100%)', header, body);
}

// ===========================================================================
// 3. ADMIN — Contact / Enquiry Notification
// ===========================================================================
function buildContactEnquiryHtml(data: ContactEmailData): string {
  const submittedAt = data.submittedAt ?? new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const header = `
    <h1 style="margin:10px 0 0;color:#ffffff;font-size:24px;font-weight:700;">New Guest Enquiry</h1>
    <p style="margin:8px 0 0;color:#a8c5b0;font-size:13px;">A visitor has submitted a message via the website contact form.</p>`;

  const body = `
    ${sectionHeading('Contact Details')}
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      ${infoRow('Name', data.name)}
      ${infoRow('Email', `<a href="mailto:${data.email}" style="color:#2563eb;text-decoration:none;">${data.email}</a>`)}
      ${data.phone ? infoRow('Phone', `<a href="tel:${data.phone}" style="color:#2563eb;text-decoration:none;">${data.phone}</a>`) : ''}
      ${infoRow('Submitted At', submittedAt)}
    </table>

    ${sectionHeading('Message')}
    <div style="background:#f5f0eb;border-left:4px solid #c9a96e;border-radius:4px;padding:16px 20px;margin-bottom:28px;">
      <p style="margin:0;color:#2c2c2c;font-size:14px;line-height:1.7;white-space:pre-wrap;">${data.message}</p>
    </div>

    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td>
          <a href="mailto:${data.email}?subject=Re: Your enquiry at ${RESORT_NAME}"
             style="display:inline-block;background:linear-gradient(135deg,#1a3a2a,#2d5a3d);color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:6px;font-size:13px;font-weight:600;">
            Reply to ${data.name}
          </a>
        </td>
      </tr>
    </table>`;

  return wrapEmail('linear-gradient(135deg,#1e3a5f 0%,#2563eb 100%)', header, body);
}

// ===========================================================================
// 4. USER — Password Reset
// ===========================================================================
function buildPasswordResetHtml(name: string, resetLink: string): string {
  const header = `
    <h1 style="margin:10px 0 0;color:#ffffff;font-size:24px;font-weight:700;">Reset Your Password</h1>
    <p style="margin:8px 0 0;color:#a8c5b0;font-size:13px;">You requested a password reset for your account.</p>`;

  const body = `
    <p style="margin:0 0 24px;color:#555;font-size:14px;line-height:1.6;">Hi <strong>${name}</strong>,<br/>
    We received a request to reset the password for your ${RESORT_NAME} account. Click the button below to set a new password.</p>

    <!-- CTA Button -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      <tr><td align="center">
        <a href="${resetLink}"
           style="display:inline-block;background:linear-gradient(135deg,#1a3a2a,#2d5a3d);color:#ffffff;text-decoration:none;padding:16px 40px;border-radius:8px;font-size:15px;font-weight:700;letter-spacing:0.3px;">
          Reset My Password
        </a>
      </td></tr>
    </table>

    <!-- Expiry notice -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff8e8;border:1px solid #f0d080;border-radius:6px;padding:14px 18px;margin-bottom:24px;">
      <tr><td>
        <p style="margin:0;color:#92610a;font-size:13px;font-weight:600;">⏱ This link expires in 1 hour</p>
        <p style="margin:4px 0 0;color:#b07820;font-size:12px;">If you did not request a password reset, you can safely ignore this email — your password will not change.</p>
      </td></tr>
    </table>

    <!-- Link fallback -->
    <p style="margin:0 0 6px;color:#888;font-size:12px;">If the button doesn't work, copy and paste this link into your browser:</p>
    <p style="margin:0;background:#f5f5f5;border-radius:4px;padding:10px 12px;font-size:11px;word-break:break-all;color:#555;">${resetLink}</p>

    <p style="margin:24px 0 0;color:#aaa;font-size:11px;">For security, this request was initiated from our website. If you didn't request this, contact us immediately at reservation@stjamescourtbeachresort.com</p>`;

  return wrapEmail('linear-gradient(135deg,#2c1654 0%,#4c2d8a 100%)', header, body);
}

// ===========================================================================
// Plain-text helpers
// ===========================================================================
function adminBookingText(data: BookingEmailData): string {
  return `NEW RESERVATION — ${RESORT_NAME}
Booking ID: #${data.bookingId}

Guest: ${data.fullName} | Phone: ${data.phone}${data.email ? ` | Email: ${data.email}` : ''}
Room: ${data.categoryName} (${data.categoryCode}) | Check-In: ${data.checkIn} | Check-Out: ${data.checkOut}
Nights: ${data.nights.length} | Rooms: ${data.rooms} | Adults: ${data.adults} | Children: ${data.children} | Extra Beds: ${data.extraBeds}
${data.specialRequests ? `Special Requests: ${data.specialRequests}\n` : ''}
Total: ${formatCurrency(data.finalAmount)} | Status: ${data.paymentStatus}`;
}

function userBookingText(data: BookingEmailData): string {
  return `Booking Confirmed — ${RESORT_NAME}
Booking Reference: #${data.bookingId}

Dear ${data.fullName},
Your booking is confirmed. Details below:

Room: ${data.categoryName} | Check-In: ${data.checkIn} | Check-Out: ${data.checkOut}
Nights: ${data.nights.length} | Total: ${formatCurrency(data.finalAmount)}

Check-in: 2:00 PM | Check-out: 11:00 AM
Please carry a valid photo ID.

Contact: +91 94432 52776 | reservation@stjamescourtbeachresort.com`;
}

function contactEnquiryText(data: ContactEmailData): string {
  return `NEW ENQUIRY — ${RESORT_NAME}

From: ${data.name}
Email: ${data.email}${data.phone ? `\nPhone: ${data.phone}` : ''}
Submitted: ${data.submittedAt ?? new Date().toISOString()}

Message:
${data.message}`;
}

function passwordResetText(name: string, resetLink: string): string {
  return `Hi ${name},

You requested a password reset for your ${RESORT_NAME} account.

Reset your password here (expires in 1 hour):
${resetLink}

If you did not request this, ignore this email — your password will not change.

— ${RESORT_NAME}`;
}

// ===========================================================================
// Core send helper
// ===========================================================================
async function sendEmail(to: string, toName: string, subject: string, html: string, text: string): Promise<void> {
  const fromEmail = process.env.SMTP_USER;

  if (!fromEmail || !process.env.SMTP_PASS) {
    console.warn('[Email] SMTP_USER or SMTP_PASS not set — skipping email');
    return;
  }

  await transporter.sendMail({
    from: `"${RESORT_NAME}" <${fromEmail}>`,
    to: `"${toName}" <${to}>`,
    subject,
    text,
    html,
  });
}

// ===========================================================================
// Public functions
// ===========================================================================

/** Called after booking creation — notifies admin */
export async function sendBookingNotification(data: BookingEmailData): Promise<void> {
  const nightCount = data.nights.length;
  await sendEmail(
    ADMIN_EMAIL,
    'Reservations Team',
    `[New Booking #${data.bookingId}] ${data.fullName} — ${data.categoryCode} × ${data.rooms} room${data.rooms > 1 ? 's' : ''}, ${nightCount} night${nightCount > 1 ? 's' : ''} (${data.checkIn})`,
    buildAdminBookingHtml(data),
    adminBookingText(data),
  );
}

/** Called after booking creation — confirms to user (only if they have an email) */
export async function sendUserBookingConfirmation(data: BookingEmailData): Promise<void> {
  if (!data.email) return;
  await sendEmail(
    data.email,
    data.fullName,
    `Booking Confirmed #${data.bookingId} — ${RESORT_NAME}`,
    buildUserBookingHtml(data),
    userBookingText(data),
  );
}

/** Called when contact form is submitted — notifies admin */
export async function sendContactEnquiry(data: ContactEmailData): Promise<void> {
  await sendEmail(
    ADMIN_EMAIL,
    'Reservations Team',
    `[Guest Enquiry] ${data.name} — ${data.email}`,
    buildContactEnquiryHtml(data),
    contactEnquiryText(data),
  );
}

/** Called on forgot-password — sends reset link to user */
export async function sendPasswordResetEmail(email: string, name: string, resetLink: string): Promise<void> {
  await sendEmail(
    email,
    name,
    `Reset Your Password — ${RESORT_NAME}`,
    buildPasswordResetHtml(name, resetLink),
    passwordResetText(name, resetLink),
  );
}

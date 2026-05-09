import nodemailer from "nodemailer";

const transporter = process.env.SMTP_HOST
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  : null;

export async function sendVerificationEmail(
  email: string,
  code: string,
  name?: string | null
) {
  const subject = `TaskFlow — Your verification code is ${code}`;
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 400px; margin: 0 auto; padding: 40px 0;">
      <h2 style="font-size: 20px; font-weight: 600; margin: 0 0 8px;">Verify your email</h2>
      <p style="color: #666; font-size: 14px; margin: 0 0 24px;">
        Hi${name ? ` ${name}` : ""}, enter this code to complete your registration:
      </p>
      <div style="background: #f5f5f5; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
        <span style="font-size: 32px; font-weight: 700; letter-spacing: 8px; font-family: monospace;">
          ${code}
        </span>
      </div>
      <p style="color: #999; font-size: 12px; margin: 0;">
        This code expires in 10 minutes. If you didn't request this, ignore this email.
      </p>
    </div>
  `;

  if (transporter) {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || "TaskFlow <noreply@taskflow.app>",
      to: email,
      subject,
      html,
    });
    console.log(`📧 Verification email sent to ${email}`);
  } else {
    // Fallback: log code to console when SMTP not configured
    console.log(`\n📧 ===== VERIFICATION CODE =====`);
    console.log(`   Email: ${email}`);
    console.log(`   Code:  ${code}`);
    console.log(`   ===============================\n`);
  }
}

export function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

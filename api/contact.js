import { Resend } from "resend";

const RECEIVER = process.env.CONTACT_RECEIVER_EMAIL || "deepakk.hq@gmail.com";
const FROM = process.env.CONTACT_FROM_EMAIL || "Deepak <onboarding@resend.dev>";

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, message, website } = req.body || {};

  // Honeypot: bots fill the hidden "website" field
  if (website) return res.status(201).json({ success: true });

  if (!name || typeof name !== "string" || name.length > 100) {
    return res.status(400).json({ message: "Invalid input", field: "name" });
  }
  if (!email || typeof email !== "string" || !isEmail(email)) {
    return res.status(400).json({ message: "Invalid input", field: "email" });
  }
  if (!message || typeof message !== "string" || message.length > 5000) {
    return res.status(400).json({ message: "Invalid input", field: "message" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set");
    return res.status(500).json({ message: "Email service is not configured" });
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM,
      to: RECEIVER,
      replyTo: email,
      subject: `New message from ${name} (Portfolio Contact Form)`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });
    if (error) {
      console.error("Resend error:", error);
      return res.status(502).json({ message: "Failed to send email" });
    }
    return res.status(201).json({ success: true, message: "Message sent successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

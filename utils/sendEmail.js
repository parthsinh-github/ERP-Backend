  import nodemailer from "nodemailer";

  export const sendEmail = async (to, subject, text) => {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST, // e.g. smtp.gmail.com
        port: process.env.SMTP_PORT, // e.g. 587
        secure: false, // true for port 465, false for 587
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: `"ERP Team" <${process.env.SMTP_USER}>`,
        to,
        subject,
        text,
      });

      console.log("EMAIL_HOST:", process.env.EMAIL_HOST);
  console.log("EMAIL_PORT:", process.env.EMAIL_PORT);
  console.log("EMAIL_USER:", process.env.EMAIL_USER);

      console.log(`✅ Email sent to ${to}`);
      
    } catch (error) {
      console.error("❌ Email sending failed:", error);
      throw new Error("Email could not be sent");
    }
  };

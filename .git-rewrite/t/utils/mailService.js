import nodemailer from 'nodemailer';

export const sendOtpMail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,     // use app password
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'College ERP OTP',
    html: `<p>Your OTP for registration is: <strong>${otp}</strong></p>`,
  };

  await transporter.sendMail(mailOptions);
};

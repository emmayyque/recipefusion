const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, otp) => {
  if (!to || !subject || !otp) {
    console.error("Missing email details:", { to, subject, otp });
    throw new Error("Email 'to', 'subject', and 'otp' fields are required.");
  }

  try {
    const transporter = nodemailer.createTransport({
      secure: true,
      host: process.env.NM_HOST,
      port: process.env.NM_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const text = `Hello,\n\nYour OTP is ${otp}. It will expire in 10 minutes.\n\nIf you did not request this, please ignore this email.`;

    const html = `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
        <h2 style="color: #00d131;">RecipeFusion Password Reset</h2>
        <p style="font-size: 16px;">Hello,</p>
        <p style="font-size: 16px;">
          Your OTP is: 
          <span style="font-size: 18px; font-weight: bold; color: #dc3545;">${otp}</span>
        </p>
        <p style="font-size: 16px;">It will expire in <strong>10 minutes</strong>.</p>
        <p style="font-size: 14px; color: #555;">
          If you did not request this, please ignore this email.
        </p>

        <hr style="margin: 20px 0;" />

        <p style="font-size: 14px;">
          <br>
          <strong>RecipeFusion</strong><br>
         
        </p>
      </div>
    `;

    const info = await transporter.sendMail({
      from: `"RecipeFusion Support" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

  } catch (error) {
    console.error("Failed to send email:", error.message);
    throw error;
  }
};

module.exports = sendEmail;

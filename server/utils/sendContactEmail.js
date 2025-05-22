const nodemailer = require('nodemailer');

const sendContactEmail = async (name, email, subject, message) => {
  const transporter = nodemailer.createTransport({
    secure: true,
    host: process.env.NM_HOST,
    port: process.env.NM_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const html = `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; padding: 30px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); padding: 30px;">
      <h2 style="color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px;">📩 New Message</h2>
      <table style="width: 100%; margin-top: 20px; font-size: 16px; color: #555;">
        <tr>
          <td style="padding: 10px 0;"><strong>Name:</strong></td>
          <td style="padding: 10px 0;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0;"><strong>Email:</strong></td>
          <td style="padding: 10px 0;">${email}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0;"><strong>Subject:</strong></td>
          <td style="padding: 10px 0;">${subject}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; vertical-align: top;"><strong>Message:</strong></td>
          <td style="padding: 10px 0; white-space: pre-wrap;">${message}</td>
        </tr>
      </table>
      <p style="margin-top: 30px; font-size: 14px; color: #888; text-align: center;">
        — RecipeFusion Contact Form —
      </p>
    </div>
  </div>
`;


  await transporter.sendMail({
    from: `"RecipeFusion Contact" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER, 
    subject: `New Contact Form Submission: ${subject}`,
    text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage:\n${message}`,
    html,
  });
};

module.exports = sendContactEmail;

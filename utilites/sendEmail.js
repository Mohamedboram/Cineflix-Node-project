const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
  // Create transporter
  const transporter = nodeMailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Define email options
  const emailOptions = {
    from: 'Cinema support <support@cineflex.com>',
    to: options.email,
    subject: options.subject,
    text: options.text,
  };

  // Send the email
  await transporter.sendMail(emailOptions);
};

module.exports = sendEmail;

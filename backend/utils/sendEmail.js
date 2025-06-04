const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // or use SMTP
  auth: {
    user: process.env.EMAIL_USER,     // e.g., your Gmail
    pass: process.env.EMAIL_PASS,     // use app password or environment-safe credential
  },
});

const sendOrderConfirmation = async (to, orderId) => {
  const mailOptions = {
    from: `"Kwalas Tech" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Your Order Confirmation',
    html: `
      <h2>Thank you for your order!</h2>
      <p>Your order has been placed successfully.</p>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p>You can track your order at: 
        <a href="https://yourdomain.com/track-order" target="_blank">Track Order</a>
      </p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendOrderConfirmation;

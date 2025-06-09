const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendOrderEmail({ to, orderId }) {

  await resend.emails.send({
    from: 'Kwalas Tech <onboarding@resend.dev>',
    to,
    subject: '✅ Your Order Confirmation - Kwalas Tech',
    html: `
      <h2>Thank you for your order!</h2>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <br /><br />
      <p>Need help? Contact us anytime.</p>
    `
  });
}

module.exports = sendOrderEmail;

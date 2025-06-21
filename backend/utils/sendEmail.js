const SibApiV3Sdk = require('sib-api-v3-sdk');
require('dotenv').config();

const sendOrderEmail = async ({ to, orderId }) => {
  const client = SibApiV3Sdk.ApiClient.instance;
  client.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;

  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  const emailData = {
    sender: { name: 'Kwalas Tech', email: 'nathanrufus540@gmail.com' },
    to: [{ email: to }],
    subject: '✅ Your Order Confirmation - Kwalas Tech',
    htmlContent: `
      <h2>Thank you for your order!</h2>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p>We’ll process it soon. Contact us if you need help.</p>
    `,
  };

  try {
    await apiInstance.sendTransacEmail(emailData);
    console.log('✅ Email sent via Brevo to', to);
  } catch (error) {
    console.error('❌ Brevo send error:', error.response?.body || error.message);
  }
};

module.exports = sendOrderEmail;

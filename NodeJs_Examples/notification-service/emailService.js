// emailService.js
require('dotenv').config();
const nodemailer = require('nodemailer');
const redis = require('./redisClient');
const {
  emailsSentCounter,
  emailsFailedCounter,
  deduplicatedCounter,
} = require('./metrics');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

async function sendEmail(order) {

    const isDuplicate = await redis.get(`order:${order.id}`);
    if (isDuplicate) {
        deduplicatedCounter.inc();
        console.log(`⚠️ Duplicate email skipped for Order ID: ${order.id}`);
        return;
    }

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: process.env.EMAIL_TO,
        subject: `🧾 Order Confirmation - #${order.id}`,
        html: `
  <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      
      <div style="background-color: #4F46E5; color: #ffffff; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">Zeus Instamart</h1>
        <p style="margin: 5px 0 0;">Order Confirmation</p>
      </div>

      <div style="padding: 20px;">
        <h2 style="color: #333;">Hi there,</h2>
        <p>We’ve received your order and are currently processing it. Below are the order details:</p>

        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Order ID:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${order.id}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Item:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${order.item}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Quantity:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${order.quantity}</td>
          </tr>
        </table>

        <p style="margin-top: 20px;">Thank you for shopping with us!</p>
        <p style="margin-bottom: 0;">– The Zeus Instamart Team</p>
      </div>

      <div style="background-color: #f0f0f0; text-align: center; padding: 10px; font-size: 12px; color: #666;">
        This is an automated message. Please do not reply.
      </div>
    </div>
  </div>
    `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent for Order ID: ${order.id} – ${info.messageId}`);
        emailsSentCounter.inc()
        await redis.set(`order:${order.id}`, '1', 'EX', 3600); // 1-hour deduplication
    } catch (err) {
        console.error(`❌ Failed to send email for order ${order.id}:`, error.message);
        emailsFailedCounter.inc();
        await redis.lpush('failed-orders', JSON.stringify(order)); // push to DLQ
    }
}

module.exports = sendEmail;

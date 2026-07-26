const SibApiV3Sdk = require('sib-api-v3-sdk');

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

const sendEmail = async ({ to, toName, subject, htmlContent, textContent }) => {
  try {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    
    sendSmtpEmail.sender = {
      email: process.env.BREVO_SENDER_EMAIL,
      name: process.env.BREVO_SENDER_NAME
    };
    
    sendSmtpEmail.to = [{ email: to, name: toName }];
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlContent;
    if (textContent) sendSmtpEmail.textContent = textContent;

    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`✅ Email sent to ${to}`);
    return true;
  } catch (error) {
    console.error('❌ Email send failed:', error.message);
    return false;
  }
};

// Pre-built email templates
const emailTemplates = {
  welcome: (firstName) => ({
    subject: 'Welcome to SUG Hotel! 🏨',
    htmlContent: `
      <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
        <div style="background: #1a1a1a; padding: 40px; text-align: center;">
          <h1 style="color: #c9a96e; margin: 0; font-size: 32px; letter-spacing: 2px;">SUG HOTEL</h1>
          <p style="color: #fff; margin-top: 10px; font-size: 14px;">Experience comfort, elegance and unforgettable moments.</p>
        </div>
        <div style="padding: 40px; background: #fafafa;">
          <h2 style="color: #1a1a1a; font-weight: 400;">Welcome, ${firstName}!</h2>
          <p style="line-height: 1.8; color: #555;">Thank you for creating an account with SUG Hotel. We're thrilled to have you join our community of discerning travelers.</p>
          <p style="line-height: 1.8; color: #555;">Start exploring our luxurious rooms and book your perfect stay today.</p>
          <a href="${process.env.FRONTEND_URL}/rooms" 
             style="display: inline-block; background: #c9a96e; color: #fff; padding: 14px 32px; text-decoration: none; border-radius: 4px; margin-top: 20px; font-size: 14px;">
            Explore Rooms →
          </a>
        </div>
        <div style="padding: 20px 40px; text-align: center; color: #999; font-size: 12px;">
          <p>SUG Hotel, 123 Luxury Lane, Cityville, ST 12345</p>
        </div>
      </div>
    `
  }),

  bookingConfirmation: (booking, room, user) => ({
    subject: `Booking Confirmed — ${room.name} at SUG Hotel`,
    htmlContent: `
      <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
        <div style="background: #1a1a1a; padding: 40px; text-align: center;">
          <h1 style="color: #c9a96e; margin: 0; font-size: 32px;">SUG HOTEL</h1>
        </div>
        <div style="padding: 40px; background: #fafafa;">
          <h2 style="color: #1a1a1a; font-weight: 400;">Booking Confirmed ✅</h2>
          <p style="line-height: 1.8; color: #555;">Dear ${user.firstName},</p>
          <p style="line-height: 1.8; color: #555;">Your reservation has been confirmed. Here are your booking details:</p>
          
          <div style="background: #fff; padding: 24px; border-radius: 8px; margin: 24px 0; border-left: 4px solid #c9a96e;">
            <p style="margin: 8px 0;"><strong>Room:</strong> ${room.name}</p>
            <p style="margin: 8px 0;"><strong>Check-in:</strong> ${new Date(booking.checkIn).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p style="margin: 8px 0;"><strong>Check-out:</strong> ${new Date(booking.checkOut).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p style="margin: 8px 0;"><strong>Nights:</strong> ${booking.nights}</p>
            <p style="margin: 8px 0;"><strong>Guests:</strong> ${booking.guests}</p>
            <p style="margin: 8px 0;"><strong>Total:</strong> ₦${Number(booking.totalAmount).toLocaleString()}</p>
            <p style="margin: 8px 0;"><strong>Booking ID:</strong> ${booking.id}</p>
          </div>
          
          <p style="line-height: 1.8; color: #555;">We look forward to welcoming you. If you have any questions, please don't hesitate to contact us.</p>
        </div>
      </div>
    `
  }),

  bookingReminder: (booking, room, user) => ({
    subject: `Reminder: Your Stay at SUG Hotel Tomorrow`,
    htmlContent: `
      <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1a1a1a; padding: 40px; text-align: center;">
          <h1 style="color: #c9a96e; margin: 0;">SUG HOTEL</h1>
        </div>
        <div style="padding: 40px; background: #fafafa;">
          <h2 style="font-weight: 400;">Tomorrow is Your Check-in Day! 🎉</h2>
          <p>Hi ${user.firstName},</p>
          <p>Just a friendly reminder that your stay at <strong>${room.name}</strong> begins tomorrow.</p>
          <p><strong>Check-in:</strong> ${new Date(booking.checkIn).toLocaleDateString()}</p>
          <p>Check-in time is from 2:00 PM. We can't wait to welcome you!</p>
        </div>
      </div>
    `
  }),

  checkoutReminder: (booking, room, user) => ({
    subject: `Checkout Reminder — SUG Hotel`,
    htmlContent: `
      <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1a1a1a; padding: 40px; text-align: center;">
          <h1 style="color: #c9a96e; margin: 0;">SUG HOTEL</h1>
        </div>
        <div style="padding: 40px; background: #fafafa;">
          <h2 style="font-weight: 400;">Checkout Tomorrow</h2>
          <p>Hi ${user.firstName},</p>
          <p>This is a reminder that your checkout from <strong>${room.name}</strong> is scheduled for tomorrow.</p>
          <p><strong>Checkout:</strong> ${new Date(booking.checkOut).toLocaleDateString()}</p>
          <p>Checkout time is 12:00 PM. We hope you enjoyed your stay!</p>
          <p>Please complete your checkout from your account to make the room available for future guests.</p>
          <a href="${process.env.FRONTEND_URL}/bookings" 
             style="display: inline-block; background: #c9a96e; color: #fff; padding: 14px 32px; text-decoration: none; border-radius: 4px; margin-top: 20px;">
            Manage My Booking →
          </a>
        </div>
      </div>
    `
  }),

  contactReply: (name) => ({
    subject: 'We Received Your Message — SUG Hotel',
    htmlContent: `
      <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1a1a1a; padding: 40px; text-align: center;">
          <h1 style="color: #c9a96e; margin: 0;">SUG HOTEL</h1>
        </div>
        <div style="padding: 40px; background: #fafafa;">
          <h2 style="font-weight: 400;">Thank You, ${name}</h2>
          <p>We've received your message and will get back to you within 24 hours.</p>
          <p style="color: #999; font-size: 14px; margin-top: 30px;">SUG Hotel Team</p>
        </div>
      </div>
    `
  })
};

module.exports = {
  sendEmail,
  emailTemplates
};
import nodemailer from 'nodemailer';

// Configure Gmail transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_APP_PASSWORD, // Use App Password, not regular password
    },
  });
};

// Send OTP email
export const sendOTPEmail = async (email: string, otp: string) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: process.env.GMAIL_EMAIL,
    to: email,
    subject: 'ANVEDA - Email Verification OTP',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f5ef;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; text-align: center;">
          <h1 style="color: #7d3600; margin-bottom: 20px;">
            <span style="color: #EDBC7E;">ANVEDA</span>
          </h1>
          <h2 style="color: #333; margin-bottom: 20px;">Email Verification</h2>
          <p style="color: #666; margin-bottom: 30px;">
            Please use the following OTP to verify your email address:
          </p>
          <div style="background-color: #7d3600; color: white; padding: 15px; border-radius: 5px; font-size: 24px; font-weight: bold; letter-spacing: 3px; margin: 20px 0;">
            ${otp}
          </div>
          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            This OTP is valid for 10 minutes only.
          </p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            If you didn't request this verification, please ignore this email.
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return { success: false, error: error };
  }
};

// Send order confirmation email
export const sendOrderConfirmationEmail = async (orderDetails: any) => {
  const transporter = createTransporter();
  
  const { email, name, orderId, items, totalPrice, address, phone } = orderDetails;
  
  const itemsHtml = items.map((item: any) => `
    <tr style="border-bottom: 1px solid #eee;">
      <td style="padding: 10px; text-align: left;">${item.product_name}</td>
      <td style="padding: 10px; text-align: center;">${item.variant_quantity}</td>
      <td style="padding: 10px; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; text-align: right;">₹${item.unit_price}</td>
      <td style="padding: 10px; text-align: right; font-weight: bold;">₹${item.total_price}</td>
    </tr>
  `).join('');

  const mailOptions = {
    from: process.env.GMAIL_EMAIL,
    to: email,
    subject: `Order Confirmation - #${orderId} - ANVEDA`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px; background-color: #f9f5ef;">
        <div style="background-color: white; padding: 30px; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #7d3600; margin-bottom: 10px;">
              <span style="color: #EDBC7E;">ANVEDA</span>
            </h1>
            <div style="background-color: #4CAF50; color: white; padding: 10px; border-radius: 5px; display: inline-block;">
              ✅ Order Confirmed
            </div>
          </div>
          
          <h2 style="color: #333; margin-bottom: 20px;">Thank you for your order, ${name}!</h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
            <h3 style="color: #7d3600; margin-top: 0;">Order Details</h3>
            <p><strong>Order ID:</strong> #${orderId}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Delivery Address:</strong><br>${address}</p>
          </div>

          <h3 style="color: #7d3600; margin-bottom: 15px;">Items Ordered</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background-color: #7d3600; color: white;">
                <th style="padding: 12px; text-align: left;">Product</th>
                <th style="padding: 12px; text-align: center;">Size</th>
                <th style="padding: 12px; text-align: center;">Qty</th>
                <th style="padding: 12px; text-align: right;">Price</th>
                <th style="padding: 12px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div style="text-align: right; margin-bottom: 30px;">
            <div style="background-color: #7d3600; color: white; padding: 15px; border-radius: 5px; display: inline-block;">
              <h3 style="margin: 0;">Total Amount: ₹${totalPrice}</h3>
            </div>
          </div>

          <div style="background-color: #e8f5e8; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
            <h4 style="color: #2e7d32; margin-top: 0;">What's Next?</h4>
            <ul style="color: #666; margin: 0; padding-left: 20px;">
              <li>We'll process your order within 24 hours</li>
              <li>You'll receive a shipping confirmation with tracking details</li>
              <li>Expected delivery: 3-5 business days</li>
              <li>Free delivery on all orders</li>
            </ul>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #666;">Need help? Contact us:</p>
            <p style="color: #7d3600; font-weight: bold;">
              📱 +91 75200 81717 | 📧 rakshittgupta@gmail.com
            </p>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px;">
              Thank you for choosing ANVEDA - Premium A2 Ghee<br>
              Traditional Methods • Modern Quality
            </p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return { success: false, error: error };
  }
};

// Send newsletter subscription email
export const sendNewsletterWelcomeEmail = async (email: string) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: process.env.GMAIL_EMAIL,
    to: email,
    subject: 'Welcome to ANVEDA Newsletter!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f5ef;">
        <div style="background-color: white; padding: 30px; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #7d3600; margin-bottom: 10px;">
              <span style="color: #EDBC7E;">ANVEDA</span>
            </h1>
            <div style="background-color: #4CAF50; color: white; padding: 10px; border-radius: 5px; display: inline-block;">
              🎉 Welcome to the Family!
            </div>
          </div>
          
          <h2 style="color: #333; margin-bottom: 20px;">Thank you for subscribing!</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            You're now part of the ANVEDA family! We're excited to share with you:
          </p>

          <ul style="color: #666; line-height: 1.8; margin-bottom: 30px;">
            <li>🌟 Exclusive offers and discounts</li>
            <li>🥛 Health tips and A2 ghee benefits</li>
            <li>📰 Latest product launches</li>
            <li>👨‍🍳 Traditional recipes and cooking tips</li>
            <li>🎁 Special subscriber-only deals</li>
          </ul>

          <div style="background-color: #fff8e1; padding: 20px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #EDBC7E;">
            <h3 style="color: #7d3600; margin-top: 0;">Did you know?</h3>
            <p style="color: #666; margin: 0;">
              A2 ghee contains only A2 beta-casein protein, which is easier to digest and may have additional health benefits compared to regular ghee. Our traditional churning methods preserve all the natural goodness!
            </p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://anveda.com'}" 
               style="background-color: #7d3600; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Shop Premium A2 Ghee
            </a>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #666;">Stay connected with us:</p>
            <p style="color: #7d3600; font-weight: bold;">
              📱 +91 75200 81717 | 📧 rakshittgupta@gmail.com
            </p>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px;">
              You can unsubscribe at any time by replying to this email.<br>
              ANVEDA - Premium A2 Ghee • Traditional Methods • Modern Quality
            </p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending newsletter welcome email:', error);
    return { success: false, error: error };
  }
};

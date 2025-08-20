# Email Functionality Setup Guide

This guide will help you set up the email functionality for your ANVEDA website, including OTP verification, order confirmation emails, and newsletter signup.

## 🚀 Features Implemented

1. **OTP Email Verification** - Users verify their email before checkout
2. **Order Confirmation Emails** - Detailed order information sent after purchase
3. **Newsletter Signup** - Beautiful newsletter signup in footer with welcome emails

## 📧 Gmail Setup (Required)

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings: https://myaccount.google.com/
2. Navigate to **Security** → **2-Step Verification**
3. Follow the steps to enable 2-factor authentication

### Step 2: Generate App Password
1. In Google Account settings, go to **Security** → **App passwords**
2. Select "Mail" as the app
3. Generate a new app password (16 characters)
4. **Save this password** - you'll need it for `.env.local`

## 🔧 Environment Variables Setup

### Step 1: Create .env.local file
Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```

### Step 2: Fill in your Gmail credentials
Edit `.env.local` with your information:
```env
GMAIL_EMAIL=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Important**: Use the App Password from Step 2 above, NOT your regular Gmail password.

## 🗄️ Database Setup

### Option 1: Using Supabase (Recommended)
1. Make sure you have Supabase connected to your project
2. Go to your Supabase dashboard → SQL Editor
3. Copy and paste the content from `database-schema.sql`
4. Run the SQL commands to create the required tables

### Option 2: Using PostgreSQL directly
1. Connect to your PostgreSQL database
2. Run the SQL commands from `database-schema.sql`

## 📋 Required Database Tables

The setup creates these tables:
- `otps` - Stores email verification codes
- `newsletter_subscriptions` - Stores newsletter subscriber emails
- `orders` - Enhanced orders table (if not exists)

## 🧪 Testing the Email Features

### Test OTP Verification
1. Go to your website and add items to cart
2. Click "Proceed to Checkout"
3. Enter your email and click "Send OTP"
4. Check your Gmail inbox for the OTP email
5. Enter the OTP to verify

### Test Order Confirmation
1. Complete the checkout process
2. Check your email for the order confirmation
3. Verify all order details are correct

### Test Newsletter Signup
1. Scroll to the footer
2. Enter your email in the newsletter section
3. Click "Subscribe Now"
4. Check your email for the welcome message

## 🎨 Design Features

### Professional Checkout Form
- Clean, modern design with proper spacing
- Icons for visual clarity
- Real-time validation
- Loading states for better UX
- Success/error messaging

### Enhanced Footer Newsletter
- Prominent newsletter signup section
- Beautiful design with benefits listed
- Real-time feedback for subscriptions
- Success/error handling

### Email Templates
- Professional HTML email templates
- Branded with ANVEDA colors and styling
- Mobile-responsive design
- Clear call-to-action buttons

## 🔒 Security Features

- Email validation on both frontend and backend
- OTP expiration (10 minutes)
- Rate limiting protection
- Secure password handling (App Passwords)
- Input sanitization

## 🐛 Troubleshooting

### Email not sending?
1. Check your Gmail App Password is correct
2. Verify 2-factor authentication is enabled
3. Check server logs for error messages
4. Ensure .env.local file is not committed to git

### OTP not working?
1. Check database connection
2. Verify the `otps` table exists
3. Check if OTP has expired (10 minutes)
4. Look for errors in browser console

### Newsletter signup issues?
1. Check if `newsletter_subscriptions` table exists
2. Verify email validation is working
3. Check for duplicate email entries

## 📝 Customization

### Email Templates
Edit the templates in `lib/emailService.ts`:
- Change colors and branding
- Modify email content
- Add/remove sections
- Update contact information

### Checkout Form
Modify `components/PaymentForm.tsx`:
- Add/remove form fields
- Change validation rules
- Update styling
- Modify success messages

### Newsletter Section
Update `components/Footer.tsx`:
- Change newsletter benefits
- Modify styling
- Update success/error messages

## 🚀 Going Live

1. **Update environment variables** for production
2. **Set up domain authentication** for better email deliverability
3. **Consider using a dedicated email service** (SendGrid, Mailgun) for production
4. **Test all email functionality** on production environment
5. **Monitor email delivery rates** and spam scores

## 📞 Support

If you need help with setup:
1. Check the browser console for errors
2. Review server logs
3. Verify all environment variables are set
4. Ensure database tables are created properly

The email functionality is now fully integrated and ready to use!

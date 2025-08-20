import { NextRequest, NextResponse } from 'next/server';
import { sendOTPEmail } from '@/lib/emailService';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete any existing OTPs for this email
    await supabase.from('otps').delete().eq('email', email);

    // Store OTP in database
    const { error: dbError } = await supabase
      .from('otps')
      .insert({ email, code: otp });

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to store OTP' },
        { status: 500 }
      );
    }

    // Send OTP via email
    const emailResult = await sendOTPEmail(email, otp);

    if (!emailResult.success) {
      console.error('Email error:', emailResult.error);
      return NextResponse.json(
        { error: 'Failed to send OTP email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'OTP sent successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

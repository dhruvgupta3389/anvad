import { NextRequest, NextResponse } from 'next/server';
import { sendNewsletterWelcomeEmail } from '@/lib/emailService';
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

    // Check if email already exists in newsletter subscriptions
    const { data: existingSubscription } = await supabase
      .from('newsletter_subscriptions')
      .select('email')
      .eq('email', email)
      .single();

    if (existingSubscription) {
      return NextResponse.json(
        { message: 'You are already subscribed to our newsletter!' },
        { status: 200 }
      );
    }

    // Add email to newsletter subscriptions
    const { error: dbError } = await supabase
      .from('newsletter_subscriptions')
      .insert({ email, subscribed_at: new Date().toISOString() });

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to subscribe to newsletter' },
        { status: 500 }
      );
    }

    // Send welcome email
    const emailResult = await sendNewsletterWelcomeEmail(email);

    if (!emailResult.success) {
      console.error('Email error:', emailResult.error);
      // Don't return error here, subscription was successful even if email failed
      console.log('Newsletter subscription saved but welcome email failed to send');
    }

    return NextResponse.json(
      { success: true, message: 'Successfully subscribed to newsletter!' },
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

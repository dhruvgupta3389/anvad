import { NextRequest, NextResponse } from 'next/server';
import { sendOrderConfirmationEmail } from '@/lib/emailService';

export async function POST(request: NextRequest) {
  try {
    const orderDetails = await request.json();

    const { email, name, orderId, items, totalPrice, address, phone } = orderDetails;

    // Validate required fields
    if (!email || !name || !orderId || !items || !totalPrice || !address || !phone) {
      return NextResponse.json(
        { error: 'Missing required order details' },
        { status: 400 }
      );
    }

    // Send order confirmation email
    const emailResult = await sendOrderConfirmationEmail(orderDetails);

    if (!emailResult.success) {
      console.error('Email error:', emailResult.error);
      return NextResponse.json(
        { error: 'Failed to send order confirmation email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Order confirmation email sent successfully' },
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

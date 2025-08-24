import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  variant?: {
    id: string;
    title: string;
    price: number;
  };
}

interface CartData {
  items: CartItem[];
  total: number;
  currency?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { cart_data }: { cart_data: CartData } = await request.json();

    if (!cart_data || !cart_data.items || cart_data.items.length === 0) {
      return NextResponse.json(
        { error: 'Cart data is required and must contain items' },
        { status: 400 }
      );
    }

    // Get environment variables
    const SR_API_KEY = process.env.SR_API_KEY;
    const SR_SECRET = process.env.SR_SECRET;
    const BASE_URL = process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL;

    if (!SR_API_KEY || !SR_SECRET) {
      console.error('Missing Shiprocket credentials');
      return NextResponse.json(
        { error: 'Shiprocket configuration missing' },
        { status: 500 }
      );
    }

    // Prepare data for HMAC
    const timestamp = Math.floor(Date.now() / 1000);
    const orderId = `ORDER_${timestamp}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Prepare cart data for Shiprocket
    const cartItems = cart_data.items.map(item => ({
      id: item.id,
      name: item.name,
      price: item.variant?.price || item.price,
      quantity: item.quantity,
      variant: item.variant?.title || 'Default'
    }));

    const checkoutData = {
      order_id: orderId,
      amount: cart_data.total,
      currency: cart_data.currency || 'INR',
      items: cartItems,
      timestamp,
      return_url: `${BASE_URL}/order-success`,
      cancel_url: `${BASE_URL}/cart`,
      webhook_url: `${BASE_URL}/api/webhook/order`
    };

    // Create HMAC-SHA256 signature
    const dataString = JSON.stringify(checkoutData);
    const hmac = crypto.createHmac('sha256', SR_SECRET);
    hmac.update(dataString);
    const signature = hmac.digest('hex');

    // Call Shiprocket checkout token endpoint
    const shiprocketResponse = await fetch('https://api.shiprocket.in/v1/access-token/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SR_API_KEY}`,
        'X-Signature': signature
      },
      body: JSON.stringify(checkoutData)
    });

    if (!shiprocketResponse.ok) {
      const errorText = await shiprocketResponse.text();
      console.error('Shiprocket API error:', errorText);
      return NextResponse.json(
        { error: 'Failed to generate checkout token' },
        { status: 500 }
      );
    }

    const shiprocketData = await shiprocketResponse.json();

    if (!shiprocketData.token) {
      console.error('No token received from Shiprocket');
      return NextResponse.json(
        { error: 'Invalid response from payment gateway' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      token: shiprocketData.token,
      order_id: orderId,
      amount: cart_data.total,
      currency: checkoutData.currency
    });

  } catch (error) {
    console.error('Generate token API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

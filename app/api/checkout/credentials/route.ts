import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import crypto from 'crypto';

// Function to generate PayU hash
function generateHash(data: Record<string, string>, salt: string) {
  const hashString = Object.values(data).join('|') + '|' + salt;
  return crypto.createHash('sha512').update(hashString).digest('hex');
}

export async function GET() {
  try {
    // Get public credentials that are safe to expose to the client
    const checkoutCredentials = {
      merchant_name: process.env.MERCHANT_NAME || 'Anveda Farms',
      merchant_logo: process.env.MERCHANT_LOGO || '/logo.png',
      currency: 'INR',
      currency_symbol: '₹',
      payment_gateway: 'payu',
      payu_merchant_key: process.env.NEXT_PUBLIC_PAYU_MERCHANT_KEY,
      payu_merchant_id: process.env.PAYU_MERCHANT_ID,
      // Add any other public configuration needed for checkout
    };

    return NextResponse.json({
      success: true,
      data: checkoutCredentials
    });
  } catch (error) {
    console.error('Error fetching checkout credentials:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch checkout credentials' 
      },
      { status: 500 }
    );
  }
}

// POST endpoint to validate checkout credentials (if needed)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate the session or any required parameters
    if (!body.orderId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Order ID is required' 
        },
        { status: 400 }
      );
    }

    // Verify if the order exists in the database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', body.orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid order' 
        },
        { status: 404 }
      );
    }

    // Generate unique transaction ID
    const txnid = `TXN_${Date.now()}_${order.id}`;
    
    // Prepare PayU form data
    const payuData = {
      key: process.env.NEXT_PUBLIC_PAYU_MERCHANT_KEY || '',
      txnid: txnid,
      amount: (order.amount_paisa / 100).toFixed(2), // Convert paisa to rupees
      productinfo: `Order #${order.id}`,
      firstname: order.name,
      email: order.email,
      phone: order.phone,
      surl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/checkout/success`,
      furl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/checkout/failure`,
    };

    // Generate hash for PayU
    const hash = generateHash(payuData, process.env.PAYU_MERCHANT_SALT || '');

    // Return checkout session credentials
    const checkoutSession = {
      ...payuData,
      hash: hash,
      service_provider: 'payu_paisa',
      currency: 'INR',
      order_id: order.id,
    };

    return NextResponse.json({
      success: true,
      data: checkoutSession
    });

  } catch (error) {
    console.error('Error validating checkout credentials:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to validate checkout credentials' 
      },
      { status: 500 }
    );
  }
}

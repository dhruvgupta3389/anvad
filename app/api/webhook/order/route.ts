import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import crypto from 'crypto';

interface OrderWebhookData {
  order_id: string;
  status: string;
  amount: number;
  currency: string;
  payment_id?: string;
  customer_details?: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items?: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    variant?: string;
  }>;
  timestamp: number;
}

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('x-signature');
    const SR_SECRET = process.env.SR_SECRET;

    if (!SR_SECRET) {
      console.error('Missing SR_SECRET for webhook verification');
      return NextResponse.json(
        { error: 'Webhook configuration missing' },
        { status: 500 }
      );
    }

    if (!signature) {
      console.error('Missing signature in webhook request');
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    // Get request body
    const rawBody = await request.text();
    const webhookData: OrderWebhookData = JSON.parse(rawBody);

    // Verify HMAC signature
    const hmac = crypto.createHmac('sha256', SR_SECRET);
    hmac.update(rawBody);
    const calculatedSignature = hmac.digest('hex');

    if (calculatedSignature !== signature) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    console.log('Webhook received:', webhookData);

    // Only process successful payments
    if (webhookData.status === 'SUCCESS') {
      try {
        // Insert order into Supabase orders table
        const orderData = {
          name: webhookData.customer_details?.name || 'Unknown',
          email: webhookData.customer_details?.email || 'unknown@example.com',
          phone: webhookData.customer_details?.phone || '',
          address: webhookData.customer_details?.address || '',
          product_details: webhookData.items || [],
          total_price: webhookData.amount,
          payment_status: 'completed',
          phonepe_order_id: webhookData.order_id,
          amount_paisa: webhookData.amount * 100, // Convert to paisa
          cart_snapshot: webhookData.items || [],
          paid_at: new Date().toISOString()
        };

        const { data: insertedOrder, error: insertError } = await supabaseServer
          .from('orders')
          .insert(orderData)
          .select('id')
          .single();

        if (insertError) {
          console.error('Failed to insert order:', insertError);
          return NextResponse.json(
            { error: 'Failed to save order' },
            { status: 500 }
          );
        }

        console.log('Order saved successfully:', insertedOrder);

        // TODO: Send order confirmation email
        // TODO: Update inventory/stock levels
        // TODO: Trigger fulfillment process

        return NextResponse.json({
          success: true,
          message: 'Order processed successfully',
          order_id: insertedOrder.id
        });

      } catch (dbError) {
        console.error('Database error:', dbError);
        return NextResponse.json(
          { error: 'Database error' },
          { status: 500 }
        );
      }
    } else {
      // Log non-successful payments for monitoring
      console.log('Non-successful payment webhook:', webhookData);
      
      return NextResponse.json({
        success: true,
        message: 'Webhook received but payment not successful'
      });
    }

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

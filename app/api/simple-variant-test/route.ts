import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Missing env vars' });
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get just one variant to check the exact data
    const { data: variants } = await supabase
      .from('variants')
      .select('*')
      .limit(1);
    
    const variant = variants?.[0];
    
    return NextResponse.json({
      raw_variant: variant,
      transformed_variant: variant ? {
        id: variant.sku || variant.id || '',
        title: variant.quantity || '',
        price: parseFloat(variant.price || '0'),
        original_price: parseFloat(variant.original_price || variant.price || '0'),
        sku: variant.sku || '',
        in_stock: variant.in_stock !== false,
        stock_quantity: variant.stock_quantity || 0
      } : null
    });
    
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
}

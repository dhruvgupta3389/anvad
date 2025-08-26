import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        success: false,
        error: 'Missing Supabase environment variables'
      });
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get all data
    const { data: collections } = await supabase.from('collections').select('*');
    const { data: products } = await supabase.from('products').select('*');
    const { data: variants } = await supabase.from('variants').select('*');
    
    return NextResponse.json({
      success: true,
      collections: collections || [],
      products: products || [],
      variants: variants || [],
      summary: {
        collections_count: collections?.length || 0,
        products_count: products?.length || 0,
        variants_count: variants?.length || 0
      }
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

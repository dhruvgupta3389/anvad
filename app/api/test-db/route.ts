import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    console.log('🔗 Testing Supabase connection...');
    console.log('URL:', supabaseUrl ? 'Present' : 'Missing');
    console.log('Key:', supabaseKey ? 'Present' : 'Missing');
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        success: false,
        error: 'Missing Supabase environment variables',
        url: !!supabaseUrl,
        key: !!supabaseKey
      });
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test collections table
    const { data: collections, error: collError } = await supabase
      .from('collections')
      .select('*');
    
    // Test products table  
    const { data: products, error: prodError } = await supabase
      .from('products')
      .select('*');
    
    // Test variants table
    const { data: variants, error: varError } = await supabase
      .from('variants')
      .select('*');
    
    return NextResponse.json({
      success: true,
      tables: {
        collections: {
          count: collections?.length || 0,
          error: collError?.message || null,
          sample: collections?.[0] || null
        },
        products: {
          count: products?.length || 0,
          error: prodError?.message || null,
          sample: products?.[0] || null
        },
        variants: {
          count: variants?.length || 0,
          error: varError?.message || null,
          sample: variants?.[0] || null
        }
      }
    });
    
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

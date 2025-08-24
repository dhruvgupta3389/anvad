import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create Supabase client with proper error handling
const createSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
  }
  
  return createClient(supabaseUrl, supabaseKey);
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const featured = searchParams.get('featured');
    
    const offset = (page - 1) * limit;

    // Initialize Supabase client
    let supabase;
    try {
      supabase = createSupabaseClient();
    } catch (envError) {
      console.error('Supabase environment error:', envError);
      return NextResponse.json(
        { error: 'Database configuration error' },
        { status: 500 }
      );
    }

    // Image mapping for legacy data
    const imageMap: { [key: string]: string } = {
      'girCowGhee': 'https://images.pexels.com/photos/9105966/pexels-photo-9105966.jpeg?w=500&h=600&fit=crop&crop=center',
      'desiCowGhee': 'https://images.pexels.com/photos/8805026/pexels-photo-8805026.jpeg?w=500&h=600&fit=crop&crop=center',
      'buffaloGhee': 'https://images.pexels.com/photos/315420/pexels-photo-315420.jpeg?w=500&h=600&fit=crop&crop=center'
    };

    // Test basic connection first
    const { data: testData, error: testError } = await supabase
      .from('products')
      .select('count', { count: 'exact', head: true });

    if (testError) {
      console.error('Supabase connection test failed:', testError);
      return NextResponse.json(
        { error: 'Database connection failed', details: testError.message },
        { status: 500 }
      );
    }

    // Build query step by step
    let query = supabase
      .from('products')
      .select(`
        id,
        name,
        description,
        image,
        base_price,
        sku,
        rating,
        reviews,
        is_featured,
        in_stock
      `)
      .order('id', { ascending: true });

    // Filter by featured if specified
    if (featured === 'true') {
      query = query.eq('is_featured', true);
    }

    // Apply pagination
    const { data: products, error: productsError } = await query
      .range(offset, offset + limit - 1);

    if (productsError) {
      console.error('Products query error:', productsError);
      return NextResponse.json(
        { error: 'Failed to fetch products', details: productsError.message },
        { status: 500 }
      );
    }

    // Get variants separately to avoid complex joins
    const productIds = (products || []).map(p => p.id);
    const { data: variants, error: variantsError } = await supabase
      .from('variants')
      .select('*')
      .in('product_id', productIds);

    if (variantsError) {
      console.warn('Variants query error:', variantsError);
      // Continue without variants rather than failing
    }

    // Transform the data to match the expected format
    const transformedProducts = (products || []).map(product => {
      const productVariants = (variants || []).filter(v => v.product_id === product.id);
      
      return {
        id: product.id,
        title: product.name || '',
        description: product.description || '',
        image_url: imageMap[product.image] || product.image || 'https://images.pexels.com/photos/9105966/pexels-photo-9105966.jpeg?w=500&h=600&fit=crop&crop=center',
        price: parseFloat(product.base_price || '0'),
        sku: product.sku || '',
        rating: parseFloat(product.rating || '0'),
        reviews_count: product.reviews || 0,
        is_featured: product.is_featured || false,
        in_stock: product.in_stock !== false,
        variants: productVariants.map((variant: any) => ({
          id: variant.sku || variant.id || '',
          title: variant.quantity || '',
          price: parseFloat(variant.price || '0'),
          original_price: parseFloat(variant.original_price || variant.price || '0'),
          sku: variant.sku || '',
          in_stock: variant.in_stock !== false,
          stock_quantity: variant.stock_quantity || 0
        }))
      };
    });

    // Get total count for pagination
    const totalCount = testData || 0;

    return NextResponse.json({
      success: true,
      data: transformedProducts,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page * limit < totalCount,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Products API unexpected error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

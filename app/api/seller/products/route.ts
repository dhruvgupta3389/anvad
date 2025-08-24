import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// Try to use server-side client if available, fallback to client-side
let supabaseClient = supabase;
try {
  const { supabaseServer } = require('@/lib/supabaseServer');
  if (supabaseServer) {
    supabaseClient = supabaseServer;
  }
} catch (error) {
  console.log('Using client-side Supabase client in API route');
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const featured = searchParams.get('featured');

    const offset = (page - 1) * limit;

    // Image mapping for legacy data
    const imageMap: { [key: string]: string } = {
      'girCowGhee': 'https://images.pexels.com/photos/9105966/pexels-photo-9105966.jpeg?w=500&h=600&fit=crop&crop=center',
      'desiCowGhee': 'https://images.pexels.com/photos/8805026/pexels-photo-8805026.jpeg?w=500&h=600&fit=crop&crop=center',
      'buffaloGhee': 'https://images.pexels.com/photos/315420/pexels-photo-315420.jpeg?w=500&h=600&fit=crop&crop=center'
    };

    // Build query - order by id since created_at might not exist
    let query = supabaseClient
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
        in_stock,
        variants (
          id,
          quantity,
          price,
          original_price,
          sku,
          in_stock,
          stock_quantity
        )
      `)
      .order('created_at', { ascending: false });

    // Filter by featured if specified
    if (featured === 'true') {
      query = query.eq('is_featured', true);
    }

    // Apply pagination
    const { data: products, error } = await query
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Products API error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch products', details: error.message },
        { status: 500 }
      );
    }

    // Transform the data to match the expected format
    const transformedProducts = (products || []).map(product => ({
      id: product.id,
      title: product.name,
      description: product.description,
      image_url: imageMap[product.image] || product.image || 'https://images.pexels.com/photos/9105966/pexels-photo-9105966.jpeg?w=500&h=600&fit=crop&crop=center',
      price: parseFloat(product.base_price || '0'),
      sku: product.sku,
      rating: parseFloat(product.rating || '0'),
      reviews_count: product.reviews || 0,
      is_featured: product.is_featured || false,
      in_stock: product.in_stock !== false,
      variants: (product.variants || []).map((variant: any) => ({
        id: variant.sku || variant.id,
        title: variant.quantity,
        price: parseFloat(variant.price || '0'),
        original_price: parseFloat(variant.original_price || variant.price || '0'),
        sku: variant.sku,
        in_stock: variant.in_stock !== false,
        stock_quantity: variant.stock_quantity || 0
      }))
    }));

    // Get total count for pagination
    const { count: totalCount } = await supabaseClient
      .from('products')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json({
      success: true,
      data: transformedProducts,
      pagination: {
        page,
        limit,
        total: totalCount || 0,
        totalPages: Math.ceil((totalCount || 0) / limit),
        hasNext: page * limit < (totalCount || 0),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

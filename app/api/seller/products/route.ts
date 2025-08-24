import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const featured = searchParams.get('featured');
    
    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from('products')
      .select(`
        id,
        name as title,
        description,
        image as image_url,
        base_price as price,
        sku,
        rating,
        reviews as reviews_count,
        is_featured,
        in_stock,
        variants (
          id,
          quantity as title,
          price,
          original_price,
          sku,
          in_stock,
          stock_quantity
        )
      `)
      .eq('in_stock', true)
      .order('created_at', { ascending: false });

    // Filter by featured if specified
    if (featured === 'true') {
      query = query.eq('is_featured', true);
    }

    // Apply pagination
    const { data: products, error, count } = await query
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Products API error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      );
    }

    // Get total count for pagination
    const { count: totalCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('in_stock', true);

    return NextResponse.json({
      success: true,
      data: products || [],
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
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

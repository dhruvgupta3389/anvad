import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const collectionId = searchParams.get('collection_id');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    if (!collectionId) {
      return NextResponse.json(
        { error: 'collection_id parameter is required' },
        { status: 400 }
      );
    }

    const offset = (page - 1) * limit;

    // Build query with collection filter
    const { data: products, error } = await supabase
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
        collection_id,
        variants (
          id,
          quantity as title,
          price,
          original_price,
          sku,
          in_stock,
          stock_quantity
        ),
        collections (
          id,
          title,
          slug
        )
      `)
      .eq('collection_id', collectionId)
      .eq('in_stock', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Products by Collection API error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      );
    }

    // Get total count for pagination
    const { count: totalCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('collection_id', collectionId)
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
    console.error('Products by Collection API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

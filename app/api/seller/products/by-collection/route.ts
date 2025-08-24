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

    // Build query with collection filter - simplified approach
    const { data: products, error: productsError } = await supabase
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
        collection_id
      `)
      .eq('collection_id', collectionId)
      .order('id', { ascending: true })
      .range(offset, offset + limit - 1);

    if (productsError) {
      console.error('Products by collection query error:', productsError);
      return NextResponse.json(
        { error: 'Failed to fetch products', details: productsError.message },
        { status: 500 }
      );
    }

    // Get variants separately
    const productIds = (products || []).map(p => p.id);
    const { data: variants, error: variantsError } = await supabase
      .from('variants')
      .select('*')
      .in('product_id', productIds);

    if (variantsError) {
      console.warn('Variants query error:', variantsError);
    }

    // Get collection info
    const { data: collection, error: collectionError } = await supabase
      .from('collections')
      .select('id, title, slug')
      .eq('id', collectionId)
      .single();

    if (collectionError) {
      console.warn('Collection info error:', collectionError);
    }

    // Transform the data
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
        collection_id: product.collection_id,
        collection: collection ? {
          id: collection.id,
          title: collection.title,
          slug: collection.slug
        } : null,
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
    const { count: totalCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('collection_id', collectionId);

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
    console.error('Products by collection API unexpected error:', error);
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

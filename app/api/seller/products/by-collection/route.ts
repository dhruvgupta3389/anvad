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

// Input validation helper
const validateQueryParams = (searchParams: URLSearchParams) => {
  const collectionId = searchParams.get('collection_id');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  
  const errors: string[] = [];
  
  if (!collectionId) {
    errors.push('collection_id parameter is required');
  } else if (isNaN(parseInt(collectionId))) {
    errors.push('collection_id must be a valid number');
  }
  
  if (page < 1) {
    errors.push('page must be greater than 0');
  }
  
  if (limit < 1 || limit > 100) {
    errors.push('limit must be between 1 and 100');
  }
  
  return {
    collectionId: parseInt(collectionId || '0'),
    page,
    limit,
    errors
  };
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const { collectionId, page, limit, errors } = validateQueryParams(searchParams);
    
    if (errors.length > 0) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid parameters',
          details: errors,
          timestamp: new Date().toISOString()
        },
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
        { 
          success: false,
          error: 'Database configuration error',
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }

    // Image mapping for legacy data
    const imageMap: { [key: string]: string } = {
      'girCowGhee': 'https://images.pexels.com/photos/9105966/pexels-photo-9105966.jpeg?w=500&h=600&fit=crop&crop=center',
      'desiCowGhee': 'https://images.pexels.com/photos/8805026/pexels-photo-8805026.jpeg?w=500&h=600&fit=crop&crop=center',
      'buffaloGhee': 'https://images.pexels.com/photos/315420/pexels-photo-315420.jpeg?w=500&h=600&fit=crop&crop=center'
    };

    // Verify collection exists first
    const { data: collection, error: collectionError } = await supabase
      .from('collections')
      .select('id, title, slug')
      .eq('id', collectionId)
      .single();

    if (collectionError) {
      if (collectionError.code === 'PGRST116') {
        return NextResponse.json(
          { 
            success: false,
            error: 'Collection not found',
            timestamp: new Date().toISOString()
          },
          { status: 404 }
        );
      }
      
      console.error('Collection verification error:', collectionError);
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to verify collection',
          details: collectionError.message,
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }

    // Build query with collection filter
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
        { 
          success: false,
          error: 'Failed to fetch products',
          details: productsError.message,
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }

    // Get variants separately to avoid complex joins
    const productIds = (products || []).map(p => p.id);
    let variants: any[] = [];
    
    if (productIds.length > 0) {
      const { data: variantsData, error: variantsError } = await supabase
        .from('variants')
        .select('*')
        .in('product_id', productIds);

      if (variantsError) {
        console.warn('Variants query error:', variantsError);
        // Continue without variants rather than failing
      } else {
        variants = variantsData || [];
      }
    }

    // Transform the data with proper error handling
    const transformedProducts = (products || []).map(product => {
      try {
        const productVariants = variants.filter(v => v.product_id === product.id);
        
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
          collection: {
            id: collection.id,
            title: collection.title,
            slug: collection.slug
          },
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
      } catch (transformError) {
        console.error('Product transformation error:', transformError, product);
        return null;
      }
    }).filter(Boolean); // Remove any null values from transformation errors

    // Get total count for pagination
    const { count: totalCount, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('collection_id', collectionId);

    if (countError) {
      console.warn('Count query error:', countError);
    }

    const total = totalCount || 0;

    return NextResponse.json({
      success: true,
      data: transformedProducts,
      collection: {
        id: collection.id,
        title: collection.title,
        slug: collection.slug
      },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      },
      meta: {
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Products by collection API unexpected error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

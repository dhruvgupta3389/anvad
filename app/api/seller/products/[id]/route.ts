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

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productId = parseInt(params.id);
    
    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

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

    // Get specific product
    const { data: product, error: productError } = await supabase
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
      .eq('id', productId)
      .single();

    if (productError) {
      console.error('Product query error:', productError);
      if (productError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: 'Failed to fetch product', details: productError.message },
        { status: 500 }
      );
    }

    // Get variants for this product
    const { data: variants, error: variantsError } = await supabase
      .from('variants')
      .select('*')
      .eq('product_id', productId);

    if (variantsError) {
      console.warn('Variants query error:', variantsError);
    }

    // Get collection info if available
    let collection = null;
    if (product.collection_id) {
      const { data: collectionData } = await supabase
        .from('collections')
        .select('id, title, slug')
        .eq('id', product.collection_id)
        .single();
      collection = collectionData;
    }

    // Transform the data
    const transformedProduct = {
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
      collection: collection,
      variants: (variants || []).map((variant: any) => ({
        id: variant.sku || variant.id || '',
        title: variant.quantity || '',
        price: parseFloat(variant.price || '0'),
        original_price: parseFloat(variant.original_price || variant.price || '0'),
        sku: variant.sku || '',
        in_stock: variant.in_stock !== false,
        stock_quantity: variant.stock_quantity || 0
      }))
    };

    return NextResponse.json({
      success: true,
      data: transformedProduct
    });

  } catch (error) {
    console.error('Product API unexpected error:', error);
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

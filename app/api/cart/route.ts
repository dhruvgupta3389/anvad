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

interface CartItem {
  product_id: number;
  variant_sku: string;
  quantity: number;
}

interface GetCartRequest {
  user_id?: string;
  session_id?: string;
}

interface AddToCartRequest {
  user_id?: string;
  session_id?: string;
  product_id: number;
  variant_sku: string;
  quantity: number;
}

// GET - Retrieve user's cart
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('user_id');
    const sessionId = searchParams.get('session_id');
    
    if (!userId && !sessionId) {
      return NextResponse.json(
        { error: 'User ID or Session ID is required' },
        { status: 400 }
      );
    }

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

    // For now, we'll use localStorage-based cart since we don't have user authentication
    // This endpoint will return recommendations or recently viewed items
    
    // Get some featured products as cart recommendations
    const { data: featuredProducts, error: productsError } = await supabase
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
      .eq('is_featured', true)
      .eq('in_stock', true)
      .limit(6);

    if (productsError) {
      console.error('Featured products query error:', productsError);
      return NextResponse.json(
        { error: 'Failed to fetch recommendations' },
        { status: 500 }
      );
    }

    // Get variants for featured products
    const productIds = (featuredProducts || []).map(p => p.id);
    const { data: variants } = await supabase
      .from('variants')
      .select('*')
      .in('product_id', productIds);

    // Image mapping for legacy data
    const imageMap: { [key: string]: string } = {
      'girCowGhee': 'https://images.pexels.com/photos/9105966/pexels-photo-9105966.jpeg?w=500&h=600&fit=crop&crop=center',
      'desiCowGhee': 'https://images.pexels.com/photos/8805026/pexels-photo-8805026.jpeg?w=500&h=600&fit=crop&crop=center',
      'buffaloGhee': 'https://images.pexels.com/photos/315420/pexels-photo-315420.jpeg?w=500&h=600&fit=crop&crop=center'
    };

    // Transform products for cart recommendations
    const recommendations = (featuredProducts || []).map(product => {
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

    return NextResponse.json({
      success: true,
      cart_items: [], // Empty since we're using localStorage
      recommendations,
      message: 'Cart is managed locally. Here are some recommendations.',
      total_items: 0,
      total_price: 0
    });

  } catch (error) {
    console.error('Cart GET API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

// POST - Add item to cart (validation only since cart is localStorage-based)
export async function POST(request: NextRequest) {
  try {
    const { user_id, session_id, product_id, variant_sku, quantity }: AddToCartRequest = await request.json();

    if (!product_id || !variant_sku || !quantity) {
      return NextResponse.json(
        { error: 'Product ID, variant SKU, and quantity are required' },
        { status: 400 }
      );
    }

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

    // Validate the product and variant exist
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, name, in_stock')
      .eq('id', product_id)
      .single();

    if (productError || !product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    if (!product.in_stock) {
      return NextResponse.json(
        { error: 'Product is out of stock' },
        { status: 400 }
      );
    }

    // Validate variant
    const { data: variant, error: variantError } = await supabase
      .from('variants')
      .select('sku, price, in_stock, stock_quantity')
      .eq('sku', variant_sku)
      .eq('product_id', product_id)
      .single();

    if (variantError || !variant) {
      return NextResponse.json(
        { error: 'Product variant not found' },
        { status: 404 }
      );
    }

    if (!variant.in_stock) {
      return NextResponse.json(
        { error: 'Product variant is out of stock' },
        { status: 400 }
      );
    }

    if (variant.stock_quantity && variant.stock_quantity < quantity) {
      return NextResponse.json(
        { 
          error: 'Insufficient stock', 
          available: variant.stock_quantity,
          requested: quantity 
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Item validated successfully. Cart is managed locally.',
      product: {
        id: product.id,
        name: product.name
      },
      variant: {
        sku: variant.sku,
        price: variant.price
      },
      quantity,
      total_price: variant.price * quantity
    });

  } catch (error) {
    console.error('Cart POST API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

// DELETE - Remove item from cart (validation only)
export async function DELETE(request: NextRequest) {
  try {
    const { user_id, session_id, product_id, variant_sku }: { 
      user_id?: string; 
      session_id?: string; 
      product_id: number; 
      variant_sku: string; 
    } = await request.json();

    if (!product_id || !variant_sku) {
      return NextResponse.json(
        { error: 'Product ID and variant SKU are required' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Item removal validated. Cart is managed locally.',
      removed: {
        product_id,
        variant_sku
      }
    });

  } catch (error) {
    console.error('Cart DELETE API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

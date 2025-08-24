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
  product: {
    id: number;
    name: string;
  };
  variant: {
    id: string;
    quantity: string;
    price: number;
    sku: string;
  };
  quantity: number;
}

interface CartValidationRequest {
  items: CartItem[];
}

export async function POST(request: NextRequest) {
  try {
    const { items }: CartValidationRequest = await request.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart items are required' },
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

    // Validate each cart item
    const validationResults = [];
    let totalPrice = 0;
    let hasErrors = false;

    for (const item of items) {
      const validation = {
        product_id: item.product.id,
        variant_id: item.variant.id,
        requested_quantity: item.quantity,
        status: 'valid',
        errors: [] as string[],
        current_price: 0,
        original_price: 0,
        in_stock: false,
        available_quantity: 0
      };

      try {
        // Check product exists and is available
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('id, name, in_stock, base_price')
          .eq('id', item.product.id)
          .single();

        if (productError || !productData) {
          validation.status = 'error';
          validation.errors.push('Product not found or no longer available');
          hasErrors = true;
        } else if (!productData.in_stock) {
          validation.status = 'error';
          validation.errors.push('Product is out of stock');
          hasErrors = true;
        }

        // Check variant exists and validate pricing
        const { data: variantData, error: variantError } = await supabase
          .from('variants')
          .select('id, sku, price, original_price, in_stock, stock_quantity, quantity')
          .eq('sku', item.variant.sku)
          .eq('product_id', item.product.id)
          .single();

        if (variantError || !variantData) {
          validation.status = 'error';
          validation.errors.push('Product variant not found');
          hasErrors = true;
        } else {
          validation.current_price = parseFloat(variantData.price || '0');
          validation.original_price = parseFloat(variantData.original_price || variantData.price || '0');
          validation.in_stock = variantData.in_stock;
          validation.available_quantity = variantData.stock_quantity || 0;

          // Check stock availability
          if (!variantData.in_stock) {
            validation.status = 'error';
            validation.errors.push('Variant is out of stock');
            hasErrors = true;
          } else if (variantData.stock_quantity && variantData.stock_quantity < item.quantity) {
            validation.status = 'warning';
            validation.errors.push(`Only ${variantData.stock_quantity} items available, requested ${item.quantity}`);
          }

          // Check price changes
          if (validation.current_price !== item.variant.price) {
            validation.status = 'warning';
            validation.errors.push(`Price changed from ₹${item.variant.price} to ₹${validation.current_price}`);
          }

          // Calculate total for valid items
          if (validation.status !== 'error') {
            totalPrice += validation.current_price * item.quantity;
          }
        }

      } catch (itemError) {
        console.error(`Validation error for item ${item.product.id}:`, itemError);
        validation.status = 'error';
        validation.errors.push('Failed to validate item');
        hasErrors = true;
      }

      validationResults.push(validation);
    }

    // Calculate summary
    const summary = {
      total_items: items.length,
      valid_items: validationResults.filter(v => v.status === 'valid').length,
      warning_items: validationResults.filter(v => v.status === 'warning').length,
      error_items: validationResults.filter(v => v.status === 'error').length,
      total_price: totalPrice,
      can_proceed: !hasErrors
    };

    return NextResponse.json({
      success: true,
      valid: !hasErrors,
      summary,
      items: validationResults,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Cart validation API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

// GET method to retrieve cart recommendations/suggestions
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');

    let supabase;
    try {
      supabase = createSupabaseClient();
    } catch (envError) {
      return NextResponse.json(
        { error: 'Database configuration error' },
        { status: 500 }
      );
    }

    // Get featured or recommended products
    let query = supabase
      .from('products')
      .select(`
        id,
        name,
        image,
        base_price,
        rating,
        variants (
          id,
          quantity,
          price,
          sku,
          in_stock
        )
      `)
      .eq('in_stock', true)
      .limit(6);

    if (category) {
      // Get collection id for category
      const { data: collection } = await supabase
        .from('collections')
        .select('id')
        .eq('slug', category)
        .single();
      
      if (collection) {
        query = query.eq('collection_id', collection.id);
      }
    } else {
      query = query.eq('is_featured', true);
    }

    const { data: products, error } = await query.order('rating', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch recommendations' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      recommendations: products || []
    });

  } catch (error) {
    console.error('Cart recommendations API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

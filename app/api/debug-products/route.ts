import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        success: false,
        error: 'Missing Supabase environment variables'
      });
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get products with variants
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
        in_stock
      `)
      .order('id', { ascending: true });

    if (productsError) {
      return NextResponse.json({
        success: false,
        error: 'Products query failed',
        details: productsError
      });
    }

    // Get variants
    const { data: variants, error: variantsError } = await supabase
      .from('variants')
      .select('*');

    if (variantsError) {
      return NextResponse.json({
        success: false,
        error: 'Variants query failed',
        details: variantsError
      });
    }

    // Show raw data and transformed data
    const transformedProducts = (products || []).map(product => {
      const productVariants = (variants || []).filter(v => v.product_id === product.id);
      
      return {
        raw_product: product,
        product_variants: productVariants,
        transformed: {
          id: product.id,
          title: product.name || '',
          description: product.description || '',
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
        }
      };
    });

    return NextResponse.json({
      success: true,
      debug_info: {
        products_count: products?.length || 0,
        variants_count: variants?.length || 0,
        stock_analysis: transformedProducts.map(p => ({
          product_id: p.raw_product.id,
          product_name: p.raw_product.name,
          product_in_stock: p.raw_product.in_stock,
          variants_count: p.product_variants.length,
          variants_in_stock: p.product_variants.filter(v => v.in_stock).length,
          first_variant_stock: p.product_variants[0]?.in_stock || null,
          first_variant_stock_qty: p.product_variants[0]?.stock_quantity || null
        }))
      },
      transformed_products: transformedProducts
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

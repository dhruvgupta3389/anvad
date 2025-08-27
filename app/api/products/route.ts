import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  try {
    // Fetch products from Supabase with their variants
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        *,
        variants(*)
      `);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch products from database' },
        { status: 500 }
      );
    }

    if (!products || products.length === 0) {
      return NextResponse.json({
        data: {
          total: 0,
          products: []
        }
      });
    }

    // Transform Supabase data to match the requested API structure
    const transformedProducts = products.map(product => {
      // Generate handle from product name (lowercase, replace spaces with hyphens)
      const handle = (product.name || product.title || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

      // Transform variants to match the requested structure
      const transformedVariants = (product.variants || []).map((variant: any) => ({
        id: variant.id || Math.floor(Math.random() * 1000000),
        title: variant.quantity || variant.title || '',
        price: (variant.price || 0).toFixed(2),
        sku: variant.sku || `${handle.toUpperCase()}-${(variant.quantity || '').toUpperCase()}`,
        created_at: variant.created_at || new Date().toISOString(),
        updated_at: variant.updated_at || new Date().toISOString(),
        taxable: variant.taxable !== undefined ? variant.taxable : true,
        grams: variant.grams || 0,
        image: {
          src: variant.image || product.image || ''
        },
        weight: variant.weight || 0,
        weight_unit: variant.weight_unit || "kg"
      }));

      return {
        id: product.id,
        title: product.name || product.title || '',
        body_html: product.description ? `<p>${product.description}</p>` : '',
        vendor: product.vendor || '',
        product_type: product.category || product.product_type || '',
        created_at: product.created_at || new Date().toISOString(),
        handle: handle,
        updated_at: product.updated_at || new Date().toISOString(),
        tags: product.tags || '',
        status: product.status || 'active',
        variants: transformedVariants,
        image: {
          src: product.image || ''
        }
      };
    });

    // Return the response in the requested format
    return NextResponse.json({
      data: {
        total: transformedProducts.length,
        products: transformedProducts
      }
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

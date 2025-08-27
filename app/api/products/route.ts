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
      const handle = (product.name || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

      // Transform variants to match the requested structure
      const transformedVariants = (product.variants || []).map((variant: any) => ({
        id: variant.id,
        title: variant.quantity || '',
        price: (variant.price || 0).toFixed(2),
        sku: variant.sku || `${handle.toUpperCase()}-${(variant.quantity || '').toUpperCase()}`,
        created_at: variant.created_at || new Date().toISOString(),
        updated_at: variant.updated_at || new Date().toISOString(),
        taxable: true,
        grams: 0,
        image: {
          src: product.image || ''
        },
        weight: 0,
        weight_unit: "kg"
      }));

      return {
        id: product.id,
        title: product.name || '',
        body_html: product.description ? `<p>${product.description}</p>` : '',
        vendor: '',
        product_type: product.category || '',
        created_at: product.created_at || new Date().toISOString(),
        handle: handle,
        updated_at: product.updated_at || new Date().toISOString(),
        tags: '',
        status: product.in_stock ? 'active' : 'inactive',
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

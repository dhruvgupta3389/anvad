import { NextResponse } from 'next/server';
import { products } from '@/data/products';

export async function GET() {
  try {
    // Transform our product data to match the requested API structure
    const transformedProducts = products.map(product => {
      // Generate handle from product name (lowercase, replace spaces with hyphens)
      const handle = product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      
      // Transform variants to match the requested structure
      const transformedVariants = product.variants.map(variant => ({
        id: parseInt(variant.id.replace(/[^0-9]/g, '') || '0', 10),
        title: variant.quantity,
        price: variant.price.toFixed(2),
        sku: `${handle.toUpperCase()}-${variant.quantity.toUpperCase()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        taxable: true,
        grams: 0, // Not available in our data
        image: {
          src: product.image
        },
        weight: 0, // Not available in our data
        weight_unit: "kg"
      }));

      return {
        id: product.id,
        title: product.name,
        body_html: `<p>${product.description}</p>`,
        vendor: "", // Not available in our data
        product_type: product.category,
        created_at: new Date().toISOString(),
        handle: handle,
        updated_at: new Date().toISOString(),
        tags: "", // Not available in our data
        status: "active",
        variants: transformedVariants,
        image: {
          src: product.image
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

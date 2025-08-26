import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch from our own API to see the exact format
    const response = await fetch('http://localhost:3000/api/seller/products');
    const data = await response.json();
    
    if (data.success && data.data && data.data.length > 0) {
      const firstProduct = data.data[0];
      
      return NextResponse.json({
        success: true,
        sample_product: firstProduct,
        first_variant: firstProduct.variants?.[0] || null,
        variant_properties: firstProduct.variants?.[0] ? Object.keys(firstProduct.variants[0]) : [],
        in_stock_check: {
          variant_has_in_stock: firstProduct.variants?.[0]?.hasOwnProperty('in_stock'),
          in_stock_value: firstProduct.variants?.[0]?.in_stock,
          in_stock_type: typeof firstProduct.variants?.[0]?.in_stock
        }
      });
    }
    
    return NextResponse.json({
      success: false,
      error: 'No products found',
      raw_response: data
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

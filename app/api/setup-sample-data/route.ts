import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST() {
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
    
    // Sample collections
    const collections = [
      {
        id: 1,
        title: "A2 Ghee",
        description: "Premium A2 Ghee from indigenous cows",
        slug: "a2-ghee"
      },
      {
        id: 2,
        title: "Honey",
        description: "Pure raw honey from natural sources", 
        slug: "honey"
      },
      {
        id: 3,
        title: "Oil",
        description: "Cold-pressed natural oils",
        slug: "oil"
      },
      {
        id: 4,
        title: "Spices",
        description: "Organic spices and masalas",
        slug: "spices"
      }
    ];
    
    // Sample products
    const products = [
      {
        id: 1,
        name: "Gir Cow A2 Ghee",
        description: "Pure A2 ghee from Gir cows, traditionally prepared using the bilona method",
        image: "girCowGhee",
        base_price: 599,
        sku: "GCG001",
        rating: 4.8,
        reviews: 124,
        is_featured: true,
        in_stock: true,
        collection_id: 1
      },
      {
        id: 2,
        name: "Desi Cow A2 Ghee",
        description: "Traditional desi cow ghee with rich aroma and taste",
        image: "desiCowGhee", 
        base_price: 549,
        sku: "DCG001",
        rating: 4.7,
        reviews: 98,
        is_featured: true,
        in_stock: true,
        collection_id: 1
      },
      {
        id: 3,
        name: "Buffalo Ghee",
        description: "Pure buffalo ghee for cooking and traditional recipes",
        image: "buffaloGhee",
        base_price: 399,
        sku: "BG001", 
        rating: 4.5,
        reviews: 76,
        is_featured: false,
        in_stock: true,
        collection_id: 1
      },
      {
        id: 4,
        name: "Raw Forest Honey",
        description: "Unprocessed honey harvested from forest flowers",
        image: "https://images.pexels.com/photos/33162/honey-spoon-organic-sweet.jpg?w=500&h=600&fit=crop&crop=center",
        base_price: 299,
        sku: "RFH001",
        rating: 4.6,
        reviews: 89,
        is_featured: true,
        in_stock: true,
        collection_id: 2
      },
      {
        id: 5,
        name: "Coconut Oil",
        description: "Cold-pressed virgin coconut oil",
        image: "https://images.pexels.com/photos/1322343/pexels-photo-1322343.jpeg?w=500&h=600&fit=crop&crop=center",
        base_price: 249,
        sku: "CO001",
        rating: 4.4,
        reviews: 67,
        is_featured: false,
        in_stock: true,
        collection_id: 3
      }
    ];
    
    // Sample variants
    const variants = [
      // Gir Cow Ghee variants
      { id: 1, product_id: 1, quantity: "250ml", price: 299, original_price: 349, sku: "GCG001-250", in_stock: true, stock_quantity: 50 },
      { id: 2, product_id: 1, quantity: "500ml", price: 599, original_price: 699, sku: "GCG001-500", in_stock: true, stock_quantity: 30 },
      { id: 3, product_id: 1, quantity: "1L", price: 1199, original_price: 1399, sku: "GCG001-1000", in_stock: true, stock_quantity: 20 },
      
      // Desi Cow Ghee variants
      { id: 4, product_id: 2, quantity: "250ml", price: 279, original_price: 329, sku: "DCG001-250", in_stock: true, stock_quantity: 45 },
      { id: 5, product_id: 2, quantity: "500ml", price: 549, original_price: 649, sku: "DCG001-500", in_stock: true, stock_quantity: 35 },
      { id: 6, product_id: 2, quantity: "1L", price: 1099, original_price: 1299, sku: "DCG001-1000", in_stock: true, stock_quantity: 15 },
      
      // Buffalo Ghee variants
      { id: 7, product_id: 3, quantity: "250ml", price: 199, original_price: 249, sku: "BG001-250", in_stock: true, stock_quantity: 60 },
      { id: 8, product_id: 3, quantity: "500ml", price: 399, original_price: 499, sku: "BG001-500", in_stock: true, stock_quantity: 40 },
      
      // Honey variants
      { id: 9, product_id: 4, quantity: "250g", price: 199, original_price: 249, sku: "RFH001-250", in_stock: true, stock_quantity: 80 },
      { id: 10, product_id: 4, quantity: "500g", price: 399, original_price: 499, sku: "RFH001-500", in_stock: true, stock_quantity: 60 },
      
      // Coconut Oil variants
      { id: 11, product_id: 5, quantity: "200ml", price: 149, original_price: 199, sku: "CO001-200", in_stock: true, stock_quantity: 100 },
      { id: 12, product_id: 5, quantity: "500ml", price: 349, original_price: 449, sku: "CO001-500", in_stock: true, stock_quantity: 75 }
    ];

    // Insert data
    const results = {
      collections: await supabase.from('collections').upsert(collections, { onConflict: 'id' }),
      products: await supabase.from('products').upsert(products, { onConflict: 'id' }),
      variants: await supabase.from('variants').upsert(variants, { onConflict: 'id' })
    };

    return NextResponse.json({
      success: true,
      message: 'Sample data inserted successfully',
      results: {
        collections: { success: !results.collections.error, error: results.collections.error?.message },
        products: { success: !results.products.error, error: results.products.error?.message },
        variants: { success: !results.variants.error, error: results.variants.error?.message }
      }
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

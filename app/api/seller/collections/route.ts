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

export async function GET(request: NextRequest) {
  try {
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

    // Test connection before querying
    const { data: testData, error: testError } = await supabase
      .from('collections')
      .select('count', { count: 'exact', head: true });

    if (testError) {
      console.error('Collections connection test failed:', testError);
      return NextResponse.json(
        { 
          success: false,
          error: 'Database connection failed',
          details: testError.message,
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }

    // Query collections with error handling
    const { data: collections, error } = await supabase
      .from('collections')
      .select('id, title, description, slug')
      .order('title', { ascending: true });

    if (error) {
      console.error('Collections API error:', error);
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to fetch collections',
          details: error.message,
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }

    // Validate and sanitize response data
    const sanitizedCollections = (collections || []).map(collection => ({
      id: collection.id,
      title: collection.title || '',
      description: collection.description || '',
      slug: collection.slug || ''
    }));

    return NextResponse.json({
      success: true,
      data: sanitizedCollections,
      meta: {
        total: sanitizedCollections.length,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Collections API unexpected error:', error);
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

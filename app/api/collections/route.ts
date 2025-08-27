import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  try {
    // Fetch all collections from Supabase
    const { data: collections, error } = await supabase
      .from('collections')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch collections from database' },
        { status: 500 }
      );
    }

    if (!collections || collections.length === 0) {
      return NextResponse.json({
        data: {
          total: 0,
          collections: []
        }
      });
    }

    // Transform Supabase data to match the requested API structure
    const transformedCollections = collections.map(collection => ({
      id: collection.id,
      updated_at: collection.updated_at || new Date().toISOString(),
      body_html: collection.description ? `<p>${collection.description}</p>` : '',
      handle: collection.slug || '',
      image: {
        src: collection.image || ''
      },
      title: collection.title || '',
      created_at: collection.created_at || new Date().toISOString()
    }));

    // Return the response in the requested format
    return NextResponse.json({
      data: {
        total: transformedCollections.length,
        collections: transformedCollections
      }
    });

  } catch (error) {
    console.error('Error fetching collections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch collections' },
      { status: 500 }
    );
  }
}

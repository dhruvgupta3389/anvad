import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request: NextRequest) {
  try {
    const { data: collections, error } = await supabase
      .from('collections')
      .select('id, title, description, slug')
      .order('title', { ascending: true });

    if (error) {
      console.error('Collections API error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch collections' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: collections || []
    });

  } catch (error) {
    console.error('Collections API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

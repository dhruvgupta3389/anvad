const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://scxpgzgxqgjnrvfybcyc.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjeHBnemd4cWdqbnJ2ZnliY3ljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3NDk0NjgsImV4cCI6MjA2NzMyNTQ2OH0.l84EQBLql2WKQoRTD-0CPsLtOF5bVEdmS6IYmrKzwmg';

async function testSupabase() {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  console.log('🔗 Testing Supabase connection...');
  console.log('URL:', supabaseUrl);
  console.log('Key:', supabaseKey ? 'Present' : 'Missing');
  
  try {
    // Test basic connection
    const { data, error } = await supabase.from('collections').select('count', { count: 'exact', head: true });
    if (error) {
      console.error('❌ Connection test failed:', error);
      return;
    }
    console.log('✅ Connection successful');
    
    // Check collections table
    const { data: collections, error: collError } = await supabase.from('collections').select('*');
    console.log('📦 Collections:', collections?.length || 0, 'records');
    if (collError) console.error('Collections error:', collError);
    
    // Check products table  
    const { data: products, error: prodError } = await supabase.from('products').select('*');
    console.log('🛍️ Products:', products?.length || 0, 'records');
    if (prodError) console.error('Products error:', prodError);
    
    // Check variants table
    const { data: variants, error: varError } = await supabase.from('variants').select('*');
    console.log('📝 Variants:', variants?.length || 0, 'records');
    if (varError) console.error('Variants error:', varError);
    
    // Show sample data if exists
    if (collections && collections.length > 0) {
      console.log('Sample collection:', collections[0]);
    }
    if (products && products.length > 0) {
      console.log('Sample product:', products[0]);
    }
    if (variants && variants.length > 0) {
      console.log('Sample variant:', variants[0]);
    }
    
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

testSupabase();

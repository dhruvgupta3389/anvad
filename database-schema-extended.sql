-- Extended Database schema for e-commerce functionality
-- Run these commands in your Supabase SQL editor after the basic schema

-- Table for product collections/categories
CREATE TABLE IF NOT EXISTS collections (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  slug VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for products
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  price DECIMAL(10,2) NOT NULL,
  sku VARCHAR(100) UNIQUE NOT NULL,
  collection_id INTEGER REFERENCES collections(id),
  rating DECIMAL(2,1) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  in_stock BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for product variants (sizes, quantities)
CREATE TABLE IF NOT EXISTS variants (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL, -- e.g., "500ml", "1000ml"
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  sku VARCHAR(100) UNIQUE NOT NULL,
  in_stock BOOLEAN DEFAULT TRUE,
  stock_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_collection_id ON products(collection_id);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_variants_product_id ON variants(product_id);
CREATE INDEX IF NOT EXISTS idx_variants_sku ON variants(sku);
CREATE INDEX IF NOT EXISTS idx_collections_slug ON collections(slug);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
DROP TRIGGER IF EXISTS update_collections_updated_at ON collections;
CREATE TRIGGER update_collections_updated_at
    BEFORE UPDATE ON collections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_variants_updated_at ON variants;
CREATE TRIGGER update_variants_updated_at
    BEFORE UPDATE ON variants
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE variants ENABLE ROW LEVEL SECURITY;

-- Public read access for products, collections, and variants
CREATE POLICY "Allow public read access to collections" ON collections
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to products" ON products
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to variants" ON variants
  FOR SELECT USING (true);

-- Grant necessary permissions
GRANT SELECT ON collections TO anon, authenticated;
GRANT SELECT ON products TO anon, authenticated;
GRANT SELECT ON variants TO anon, authenticated;

-- Insert initial collections
INSERT INTO collections (title, description, slug) VALUES 
('A2 Ghee', 'Premium A2 Ghee from indigenous cows', 'a2-ghee'),
('Honey', 'Pure raw honey from natural sources', 'honey'),
('Oil', 'Cold-pressed natural oils', 'oil'),
('Spices', 'Organic spices and seasonings', 'spices')
ON CONFLICT (slug) DO NOTHING;

-- Insert products based on existing data/products.ts
INSERT INTO products (id, title, description, image_url, price, sku, collection_id, rating, reviews_count, is_featured) VALUES 
(1, 'Gir Cow A2 Ghee', 'Pure A2 Ghee made from Gir cow milk, traditionally churned for authentic taste and nutrition', 'https://images.pexels.com/photos/9105966/pexels-photo-9105966.jpeg?w=500&h=600&fit=crop&crop=center', 1299.00, 'GIR-GHEE-001', 1, 4.9, 245, true),
(2, 'Desi Cow A2 Ghee', 'Premium A2 Ghee from indigenous desi cows, rich in nutrients and traditional flavor', 'https://images.pexels.com/photos/8805026/pexels-photo-8805026.jpeg?w=500&h=600&fit=crop&crop=center', 1199.00, 'DESI-GHEE-001', 1, 4.8, 189, true),
(3, 'Buffalo A2 Ghee', 'Rich and creamy A2 Ghee from buffalo milk, perfect for cooking and health benefits', 'https://images.pexels.com/photos/315420/pexels-photo-315420.jpeg?w=500&h=600&fit=crop&crop=center', 899.00, 'BUFFALO-GHEE-001', 1, 4.7, 156, true),
(4, 'Cold Pressed Coconut Oil', 'Pure cold-pressed coconut oil extracted from fresh coconuts, rich in natural nutrients and flavor', 'https://images.pexels.com/photos/315420/pexels-photo-315420.jpeg?w=500&h=600&fit=crop&crop=center', 599.00, 'COCONUT-OIL-001', 3, 4.6, 78, false),
(5, 'Mustard Oil - Cold Pressed', 'Traditional cold-pressed mustard oil with authentic flavor, perfect for cooking and health benefits', 'https://images.pexels.com/photos/315420/pexels-photo-315420.jpeg?w=500&h=600&fit=crop&crop=center', 449.00, 'MUSTARD-OIL-001', 3, 4.5, 92, false),
(6, 'Sesame Oil - Pure', 'Premium quality sesame oil, cold-pressed for maximum nutrition and authentic taste', 'https://images.pexels.com/photos/315420/pexels-photo-315420.jpeg?w=500&h=600&fit=crop&crop=center', 699.00, 'SESAME-OIL-001', 3, 4.7, 45, false),
(7, 'Raw Wildflower Honey', 'Pure raw honey collected from wildflower meadows, unprocessed and natural with rich floral taste', 'https://images.pexels.com/photos/9105966/pexels-photo-9105966.jpeg?w=500&h=600&fit=crop&crop=center', 799.00, 'WILDFLOWER-HONEY-001', 2, 4.8, 156, false),
(8, 'Acacia Honey - Raw', 'Premium acacia honey with delicate floral flavor, slow to crystallize and perfect for daily use', 'https://images.pexels.com/photos/9105966/pexels-photo-9105966.jpeg?w=500&h=600&fit=crop&crop=center', 899.00, 'ACACIA-HONEY-001', 2, 4.9, 89, false),
(9, 'Forest Honey - Pure', 'Deep amber forest honey harvested from deep forest hives, rich in minerals and antioxidants', 'https://images.pexels.com/photos/9105966/pexels-photo-9105966.jpeg?w=500&h=600&fit=crop&crop=center', 1199.00, 'FOREST-HONEY-001', 2, 4.7, 67, false)
ON CONFLICT (id) DO NOTHING;

-- Insert product variants
INSERT INTO variants (product_id, title, price, original_price, sku, in_stock, stock_quantity) VALUES 
-- Gir Cow A2 Ghee variants
(1, '1000ml', 1299.00, 1599.00, 'GIR-1000ML', true, 100),
(1, '500ml', 699.00, 849.00, 'GIR-500ML', true, 150),
(1, '220ml', 349.00, 399.00, 'GIR-220ML', true, 200),

-- Desi Cow A2 Ghee variants
(2, '1000ml', 1199.00, 1449.00, 'DESI-1000ML', true, 80),
(2, '500ml', 649.00, 799.00, 'DESI-500ML', true, 120),
(2, '220ml', 329.00, 379.00, 'DESI-220ML', true, 180),

-- Buffalo A2 Ghee variants
(3, '1000ml', 899.00, 1099.00, 'BUFFALO-1000ML', true, 90),
(3, '500ml', 499.00, 599.00, 'BUFFALO-500ML', true, 140),
(3, '220ml', 249.00, 299.00, 'BUFFALO-220ML', true, 220),

-- Coconut Oil variants
(4, '1000ml', 599.00, 749.00, 'COCONUT-1000ML', true, 60),
(4, '500ml', 329.00, 399.00, 'COCONUT-500ML', true, 100),
(4, '250ml', 179.00, 219.00, 'COCONUT-250ML', true, 150),

-- Mustard Oil variants
(5, '1000ml', 449.00, 549.00, 'MUSTARD-1000ML', true, 70),
(5, '500ml', 249.00, 299.00, 'MUSTARD-500ML', true, 110),

-- Sesame Oil variants
(6, '500ml', 699.00, 849.00, 'SESAME-500ML', true, 50),
(6, '250ml', 379.00, 449.00, 'SESAME-250ML', true, 80),

-- Wildflower Honey variants
(7, '1000g', 799.00, 999.00, 'WILDFLOWER-1000G', true, 40),
(7, '500g', 449.00, 549.00, 'WILDFLOWER-500G', true, 70),
(7, '250g', 249.00, 299.00, 'WILDFLOWER-250G', true, 100),

-- Acacia Honey variants
(8, '500g', 899.00, 1099.00, 'ACACIA-500G', true, 30),
(8, '250g', 479.00, 579.00, 'ACACIA-250G', true, 60),

-- Forest Honey variants
(9, '500g', 1199.00, 1449.00, 'FOREST-500G', true, 25),
(9, '250g', 649.00, 779.00, 'FOREST-250G', true, 45)
ON CONFLICT (sku) DO NOTHING;

-- Reset sequences to match inserted IDs
SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));
SELECT setval('variants_id_seq', (SELECT MAX(id) FROM variants));
SELECT setval('collections_id_seq', (SELECT MAX(id) FROM collections));

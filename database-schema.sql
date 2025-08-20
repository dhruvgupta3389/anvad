-- Database schema for email functionality
-- Run these commands in your Supabase SQL editor or PostgreSQL database

-- Table for storing OTPs (One-Time Passwords)
CREATE TABLE IF NOT EXISTS otps (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  code VARCHAR(6) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '10 minutes')
);

-- Index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_otps_email ON otps(email);
CREATE INDEX IF NOT EXISTS idx_otps_created_at ON otps(created_at);

-- Table for newsletter subscriptions
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscriptions(email);

-- Table for orders (if not already exists)
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  product_details JSONB NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster order lookups
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at on orders table
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Clean up expired OTPs (optional - run periodically)
-- DELETE FROM otps WHERE created_at < (NOW() - INTERVAL '10 minutes');

-- Row Level Security (RLS) policies for Supabase
-- Enable RLS on tables
ALTER TABLE otps ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policies for anonymous users (for checkout process)
CREATE POLICY "Allow anonymous OTP operations" ON otps
  FOR ALL USING (true);

CREATE POLICY "Allow anonymous newsletter subscription" ON newsletter_subscriptions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous order creation" ON orders
  FOR INSERT WITH CHECK (true);

-- Policy to allow users to view their own orders
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (true); -- Adjust based on your auth requirements

-- Grant necessary permissions
GRANT ALL ON otps TO anon, authenticated;
GRANT ALL ON newsletter_subscriptions TO anon, authenticated;
GRANT ALL ON orders TO anon, authenticated;
GRANT USAGE ON SEQUENCE otps_id_seq TO anon, authenticated;
GRANT USAGE ON SEQUENCE newsletter_subscriptions_id_seq TO anon, authenticated;
GRANT USAGE ON SEQUENCE orders_id_seq TO anon, authenticated;

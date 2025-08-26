"use client";

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Star, ShoppingCart, Minus, Plus, ArrowLeft } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VariantCard from '@/components/VariantCard';
import { Loading } from '@/components/Loading';

interface ProductVariant {
  id: string;
  title: string;
  price: number;
  original_price: number;
  sku: string;
  in_stock: boolean;
  stock_quantity: number;
}

interface Product {
  id: number;
  title: string;
  description: string;
  image_url: string;
  price: number;
  sku: string;
  rating: number;
  reviews_count: number;
  is_featured: boolean;
  in_stock: boolean;
  variants: ProductVariant[];
}

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const id = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Fetch product data from API
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await fetch(`/api/seller/products/${id}`);

        if (response.status === 404) {
          setError('Product not found');
          return;
        }

        if (!response.ok) throw new Error('Failed to fetch product');

        const data = await response.json();
        if (data.success && data.data) {
          setProduct(data.data);
          setSelectedVariant(data.data.variants[0] || null);
        } else {
          setError(data.error || 'Failed to load product');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;
    
    // Convert to the format expected by CartContext
    const cartProduct = {
      id: product.id,
      name: product.title,
      description: product.description,
      basePrice: product.price,
      image: product.image_url,
      category: '', // Will be fetched if needed
      rating: product.rating,
      reviews: product.reviews_count,
      highlight: product.is_featured,
      variants: product.variants.map(v => ({
        id: v.sku,
        quantity: v.title,
        price: v.price,
        originalPrice: v.original_price,
        inStock: v.in_stock
      }))
    };

    const cartVariant = {
      id: selectedVariant.sku,
      quantity: selectedVariant.title,
      price: selectedVariant.price,
      originalPrice: selectedVariant.original_price,
      inStock: selectedVariant.in_stock
    };

    addToCart(cartProduct, cartVariant, quantity);
    toast({
      title: "Added to cart!",
      description: `${product.title} (${selectedVariant.title}) x${quantity} added to your cart.`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F1E6]">
        <Header hasAnnouncementBar={false} />
        <main className="max-w-7xl mx-auto px-4 py-16">
          <Loading text="Loading product..." />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#F9F1E6]">
        <Header hasAnnouncementBar={false} />
        <main className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-8">{error || 'The product you are looking for does not exist.'}</p>
            <Button
              onClick={() => router.push('/')}
              className="bg-[#5D4733] hover:bg-[#7A3E2F] text-white px-6 py-2 rounded-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back Home
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const discountPercentage = selectedVariant ? Math.round(
    ((selectedVariant.original_price - selectedVariant.price) / selectedVariant.original_price) * 100
  ) : 0;

  return (
    <div className="min-h-screen bg-[#F9F1E6]">
      <Header hasAnnouncementBar={false} />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-[#5D4733] hover:bg-[#5D4733]/10 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative">
            <img
              src={product.image_url}
              alt={product.title}
              className="w-full h-96 lg:h-[500px] object-cover rounded-2xl shadow-lg"
            />
            {discountPercentage > 0 && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {discountPercentage}% OFF
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 bg-white/80 hover:bg-white"
              onClick={() => setIsWishlisted(!isWishlisted)}
            >
              <Heart
                className={`h-5 w-5 ${
                  isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'
                }`}
              />
            </Button>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.title}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-gray-600 ml-2">
                    {product.rating} ({product.reviews_count} reviews)
                  </span>
                </div>
              </div>
            </div>

            <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>

            {/* Variant Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Select Size:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.variants.map((variant) => (
                  <VariantCard
                    key={variant.id}
                    variant={variant}
                    isSelected={selectedVariant?.id === variant.id}
                    onClick={() => setSelectedVariant(variant)}
                  />
                ))}
              </div>
            </div>

            {/* Price */}
            {selectedVariant && (
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-[#5D4733]">
                    ₹{selectedVariant.price}
                  </span>
                  {discountPercentage > 0 && (
                    <span className="text-xl text-gray-500 line-through">
                      ₹{selectedVariant.original_price}
                    </span>
                  )}
                </div>
                {discountPercentage > 0 && (
                  <p className="text-green-600 font-medium">
                    You save ₹{selectedVariant.original_price - selectedVariant.price}
                  </p>
                )}
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-800">Quantity:</h3>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="border-[#5D4733] text-[#5D4733] hover:bg-[#5D4733] hover:text-white"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  className="border-[#5D4733] text-[#5D4733] hover:bg-[#5D4733] hover:text-white"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex gap-4">
              <Button
                onClick={handleAddToCart}
                disabled={!selectedVariant?.in_stock}
                className="flex-1 bg-[#5D4733] hover:bg-[#7A3E2F] text-white py-3 text-lg font-semibold"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {selectedVariant?.in_stock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
            </div>

            {/* Stock Status */}
            {selectedVariant && (
              <div className="text-sm text-gray-600">
                {selectedVariant.in_stock ? (
                  selectedVariant.stock_quantity > 0 ? (
                    <span className="text-green-600">
                      ✓ {selectedVariant.stock_quantity} items in stock
                    </span>
                  ) : (
                    <span className="text-green-600">✓ In stock</span>
                  )
                ) : (
                  <span className="text-red-600">✗ Out of stock</span>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

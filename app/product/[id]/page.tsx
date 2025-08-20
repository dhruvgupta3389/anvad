"use client";

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Star, ShoppingCart, Minus, Plus, ArrowLeft } from 'lucide-react';
import { getProductById, ProductVariant } from '@/data/products';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VariantCard from '@/components/VariantCard';

export default function ProductDetails() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { addToCart } = useCart();
  const { toast } = useToast();

  const product = getProductById(Number(id));
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product?.variants[0] || ({} as ProductVariant)
  );
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F9F1E6] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Product not found</h1>
          <Button onClick={() => router.push('/')} className="bg-[#5D4733] hover:bg-[#7A3E2F]">
            Go back to home
          </Button>
        </div>
      </div>
    );
  }

  const handleVariantChange = (variantId: string) => {
    const variant = product.variants.find((v) => v.id === variantId);
    if (variant) {
      setSelectedVariant(variant);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity);
    toast({
      title: 'Added to cart!',
      description: `${product.name} (${selectedVariant.quantity}) x${quantity} added to your cart.`,
    });
    router.push('/');
  };

  const discountPercentage = Math.round(
    ((selectedVariant.originalPrice - selectedVariant.price) / selectedVariant.originalPrice) * 100
  );

  return (
    <div className="min-h-screen bg-[#F9F1E6]">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => router.push('/')}
          className="mb-6 text-[#5D4733] hover:bg-[#5D4733]/10 animate-fade-in"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 animate-fade-in">
          {/* Product Image */}
          <div className="space-y-4">
            <Card className="overflow-hidden shadow-xl hover-lift">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-64 sm:h-80 lg:h-96 object-cover transition-transform duration-500 hover:scale-105"
              />
            </Card>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
              <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex">
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
              </div>
              <span className="text-gray-600">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            {/* Variant Selection (Amazon Style) */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Choose a Variant:</label>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                {product.variants.map((variant) => (
                  <VariantCard
                    key={variant.id}
                    variant={variant}
                    isSelected={selectedVariant.id === variant.id}
                    onSelect={() => handleVariantChange(variant.id)}
                  />
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-[#5D4733]">₹{selectedVariant.price}</span>
              <span className="text-xl text-gray-500 line-through">₹{selectedVariant.originalPrice}</span>
              <span className="bg-[#5D4733] text-white px-3 py-1 rounded-full text-sm font-bold">
                {discountPercentage}% OFF
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Quantity:</label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="border-[#EDBC7E] text-[#EDBC7E] hover:bg-[#EDBC7E] hover:text-white"
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

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                onClick={handleAddToCart}
                disabled={!selectedVariant.inStock}
                className="flex-1 bg-[#5D4733] hover:bg-[#7A3E2F] text-white py-3 text-lg rounded-full transition-all duration-300 transform hover:scale-105"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {selectedVariant.inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>

              <Button
                variant="outline"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="border-[#5D4733] text-[#5D4733] hover:bg-[#5D4733] hover:text-white rounded-full px-6"
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </Button>
            </div>

            {/* Product Details */}
            <Card className="mt-8">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Product Details</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <strong>Category:</strong> {product.category}
                  </p>
                  <p>
                    <strong>Available Sizes:</strong> {product.variants.map((v) => v.quantity).join(', ')}
                  </p>
                  <p>
                    <strong>Stock Status:</strong>{' '}
                    {selectedVariant.inStock ? 'In Stock' : 'Out of Stock'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

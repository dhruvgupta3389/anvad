"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Star, ShoppingCart, Plus, Minus } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Product, ProductVariant } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import DiscountBadge from "./DiscountBadge";

interface ProductCardProps { product: Product; }

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

const ProductCard = ({ product }: ProductCardProps) => {
  const router = useRouter();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);
  const [quantity, setQuantity] = useState(1);

  const discountPercentage = Math.round(
    ((selectedVariant.originalPrice - selectedVariant.price) / selectedVariant.originalPrice) * 100
  );

  const handleVariantChange = (variantId: string) => {
    const variant = product.variants.find(v => v.id === variantId);
    if (variant) setSelectedVariant(variant);
  };

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity);
    toast({
      title: "Added to cart!",
      description: `${product.name} (${selectedVariant.quantity}) x${quantity} added to your cart.`,
    });
  };

  const handleViewDetails = () => {
    scrollToTop();
    router.push(`/product/${product.id}`);
  };

  return (
    <Card className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden animate-fade-in hover-lift">
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-32 sm:h-48 object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"
          data-href={`/product/${product.id}`}
          onClick={handleViewDetails}
        />

        {/* Discount Badge */}
        <DiscountBadge
          discountPercentage={discountPercentage}
          variant="tab"
        />

        {/* Wishlist Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 bg-white/80 hover:bg-white transition-all duration-300 hover:scale-110 z-10"
          onClick={() => setIsWishlisted(!isWishlisted)}
        >
          <Heart
            className={`h-4 w-4 transition-colors duration-300 ${
              isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`}
          />
        </Button>
      </div>

      <CardContent className="p-3 sm:p-4">
        <h3
          className="font-semibold text-sm sm:text-lg text-gray-800 mb-2 line-clamp-2 cursor-pointer hover:text-[#7d3600] transition-colors duration-300"
          data-href={`/product/${product.id}`}
          onClick={handleViewDetails}
        >
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2 sm:mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs sm:text-sm text-gray-600">
            {product.rating} ({product.reviews})
          </span>
        </div>

        {/* Variant Selector */}
        <div className="mb-3">
          <Select value={selectedVariant.id} onValueChange={handleVariantChange}>
            <SelectTrigger className="w-full hover:border-[#7d3600] transition-all duration-300">
              <SelectValue placeholder="Select quantity" />
            </SelectTrigger>
            <SelectContent>
              {product.variants.map(variant => (
                <SelectItem key={variant.id} value={variant.id}>
                  {variant.quantity}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg sm:text-xl font-bold text-[#7d3600]">₹{selectedVariant.price}</span>
          {discountPercentage > 0 && (
            <>
              <span className="text-xs sm:text-sm text-gray-500 line-through relative">
                ₹{selectedVariant.originalPrice}
                <div className="absolute inset-0 bg-[#7d3600] h-0.5 top-1/2 transform -translate-y-1/2 opacity-60"></div>
              </span>
              <span className="text-xs sm:text-sm text-[#7d3600] font-medium bg-[#b84d00]/20 px-2 py-0.5 rounded-full">
                Save ₹{selectedVariant.originalPrice - selectedVariant.price}
              </span>
            </>
          )}
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs sm:text-sm font-medium text-gray-700">Qty:</span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="h-6 w-6 sm:h-8 sm:w-8 border-[#b84d00] text-[#b84d00] hover:bg-[#b84d00] hover:text-white transition-all duration-300"
            >
              <Minus className="h-2 w-2 sm:h-3 sm:w-3" />
            </Button>
            <span className="text-xs sm:text-sm font-semibold w-6 sm:w-8 text-center">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity(quantity + 1)}
              className="h-6 w-6 sm:h-8 sm:w-8 border-[#7d3600] text-[#7d3600] hover:bg-[#7d3600] hover:text-white transition-all duration-300"
            >
              <Plus className="h-2 w-2 sm:h-3 sm:w-3" />
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleAddToCart}
            className="flex-1 bg-[#7d3600] hover:bg-[#b84d00] text-white rounded-full transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm shadow-lg"
            size="sm"
            disabled={!selectedVariant.inStock}
          >
            <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            {selectedVariant.inStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
          
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ProductVariant {
  id: string;
  title: string;
  price: number;
  original_price: number;
  sku: string;
  in_stock: boolean;
  stock_quantity: number;
}

interface VariantCardProps {
  variant: ProductVariant;
  isSelected: boolean;
  onClick: () => void;
}

const VariantCard = ({ variant, isSelected, onClick }: VariantCardProps) => {
  const discountPercentage = Math.round(
    ((variant.original_price - variant.price) / variant.original_price) * 100
  );

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md",
        isSelected
          ? "ring-2 ring-[#5D4733] bg-[#5D4733]/5"
          : "hover:ring-1 hover:ring-[#5D4733]/50",
        !variant.in_stock && "opacity-50 cursor-not-allowed"
      )}
      onClick={variant.in_stock ? onClick : undefined}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-medium text-gray-800">{variant.title}</h4>
          {discountPercentage > 0 && (
            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
              {discountPercentage}% OFF
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg font-bold text-[#5D4733]">₹{variant.price}</span>
          {discountPercentage > 0 && (
            <span className="text-sm text-gray-500 line-through">
              ₹{variant.original_price}
            </span>
          )}
        </div>

        <div className="text-xs text-gray-600">
          {variant.in_stock ? (
            variant.stock_quantity > 0 ? (
              <span className="text-green-600">
                {variant.stock_quantity} in stock
              </span>
            ) : (
              <span className="text-green-600">In stock</span>
            )
          ) : (
            <span className="text-red-600">Out of stock</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VariantCard;

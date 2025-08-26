import { ProductVariant } from "@/types/product";
import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";

interface VariantCardProps {
  variant: ProductVariant;
  isSelected: boolean;
  onSelect: () => void;
}

const VariantCard: React.FC<VariantCardProps> = ({ variant, isSelected, onSelect }) => {
  const discount = Math.round(
    ((variant.originalPrice - variant.price) / variant.originalPrice) * 100
  );

  return (
    <motion.button
      layout
      onClick={onSelect}
      disabled={!variant.inStock}
      className={`relative w-full rounded-xl border p-4 text-left transition-all duration-300 ease-in-out transform group
        ${isSelected ? 'border-[#7d3600] bg-[#b84d00]/10 scale-[1.03] shadow-lg' : 'border-gray-200 bg-[#F9F1E6] hover:bg-[#b84d00]/5 hover:border-[#7d3600]'}
        ${!variant.inStock ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {/* Quantity */}
      <div className="text-lg font-bold text-gray-800">{variant.quantity}</div>

      {/* Divider line */}
      <div className="border-t border-dashed border-gray-300 my-2"></div>

      {/* Price and discount */}
      <div className="flex items-center gap-2">
        <span className="text-[#7d3600] font-semibold text-base">₹{variant.price}</span>
        <span className="line-through text-sm text-gray-400">₹{variant.originalPrice}</span>
      </div>

      <div className="mt-1">
        <span className="inline-block bg-[#b84d00]/20 text-[#7d3600] text-xs font-medium px-2 py-0.5 rounded-full">
          {discount}% OFF
        </span>
      </div>

      {/* Selection check icon */}
      {isSelected && (
        <span className="absolute top-2 right-2 text-[#7d3600] bg-white border border-[#7d3600] rounded-full p-1">
          <CheckCircle className="h-4 w-4" />
        </span>
      )}

      {/* Out of Stock badge */}
      {!variant.inStock && (
        <span className="absolute top-2 left-2 text-red-600 bg-white border border-red-300 rounded-full px-2 py-0.5 text-xs font-semibold">
          Out of Stock
        </span>
      )}
    </motion.button>
  );
};

export default VariantCard;

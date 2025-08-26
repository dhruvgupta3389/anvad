import React, { forwardRef } from "react";
import ProductCard from "./ProductCard";
import { Product } from "@/types/product";

interface ProductSectionProps {
  products: Product[];
  sectionTitle?: string;
  showTitle?: boolean;
}

const ProductSection = forwardRef<HTMLDivElement, ProductSectionProps>(
  ({ products, sectionTitle = "Pure A2 Ghee Collection | Traditional & Healthy", showTitle = true }, ref) => {

    return (
      <section ref={ref} className="max-w-7xl mx-auto px-4" id="ProductSection">
        {showTitle && (
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#5D4733] mb-4 mt-8">
              {sectionTitle}
            </h2>
            <div className="w-24 h-1 bg-[#5D4733] mx-auto rounded-full"></div>
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    );
  }
);

export default ProductSection;

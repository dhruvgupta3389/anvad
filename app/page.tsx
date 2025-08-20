"use client";

import { useEffect, useMemo, useRef, lazy, Suspense } from "react";
import Header from "@/components/Header";
import AnnouncementBar from "@/components/AnnouncementBar";
import HeroBanner from "@/components/HeroBanner";
import { Loading, ProductCardSkeleton } from "@/components/Loading";
import { products, getHighlightedProducts } from "@/data/products";
import { useSearch } from "@/contexts/SearchContext";

// Lazy load components for better performance
const CategoryNavigation = lazy(() => import("@/components/CategoryNavigation"));
const ProductSection = lazy(() => import("@/components/ProductSection"));
const ProductCard = lazy(() => import("@/components/ProductCard"));
const BrandPromise = lazy(() => import("@/components/BrandPromise"));
const Footer = lazy(() => import("@/components/Footer"));

export default function HomePage() {
  const { searchQuery, setFilteredProducts } = useSearch();

  // Create a ref for the ProductSection
  const productSectionRef = useRef<HTMLDivElement | null>(null);

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) {
      return products;
    }

    return products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Update filtered products in context
  useEffect(() => {
    setFilteredProducts(filteredProducts);
  }, [filteredProducts, setFilteredProducts]);

  const highlightedProducts = getHighlightedProducts();

  return (
    <div className="min-h-screen bg-[#F9F1E6] animate-fade-in">
      <AnnouncementBar />
      {/* Pass the productSectionRef to the Header and HeroBanner */}
      <Header productSectionRef={productSectionRef} hasAnnouncementBar={true} />
      <HeroBanner productSectionRef={productSectionRef} />

      {/* Category Navigation */}
      {!searchQuery && (
        <Suspense fallback={<Loading text="Loading categories..." />}>
          <CategoryNavigation />
        </Suspense>
      )}

      <main className="space-y-16 pb-16">
        {searchQuery ? (
          <div className="max-w-7xl mx-auto px-4 pt-8">
            <h2 className="text-2xl font-bold text-[#5D4733] mb-6">
              Search Results for "{searchQuery}" ({filteredProducts.length} found)
            </h2>
            <ProductSection
              ref={productSectionRef} // Attach the ref here
              products={filteredProducts}
            />
          </div>
        ) : (
          <>
            {/* Highlighted Products Section */}
            {highlightedProducts.length > 0 && (
              <section className="bg-gradient-to-r from-[#EDBC7E]/10 to-[#F9F1E6] py-12">
                <div className="max-w-7xl mx-auto px-4">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#5D4733] mb-2">
                      Featured Products
                    </h2>
                    <p className="text-gray-600">
                      Our most popular A2 pure ghee collection
                    </p>
                  </div>
                  <Suspense fallback={
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                      {Array.from({length: 4}).map((_, i) => (
                        <ProductCardSkeleton key={i} />
                      ))}
                    </div>
                  }>
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                      {highlightedProducts.map((product) => (
                        <div key={product.id} className="animate-fade-in">
                          <ProductCard product={product} />
                        </div>
                      ))}
                    </div>
                  </Suspense>
                </div>
              </section>
            )}

            {/* All Products Section */}
            {/* <ProductSection
              ref={productSectionRef} // Attach the ref here
              products={products}
              sectionTitle="All Products"
            /> */}
          </>
        )}

        {!searchQuery && (
          <Suspense fallback={<Loading text="Loading brand promise..." />}>
            <BrandPromise />
          </Suspense>
        )}
      </main>

      <Suspense fallback={<Loading text="Loading footer..." />}>
        <Footer />
      </Suspense>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useRef, lazy, Suspense, useState } from "react";
import Header from "@/components/Header";
import AnnouncementBar from "@/components/AnnouncementBar";
import HeroBanner from "@/components/HeroBanner";
import { Loading, ProductCardSkeleton } from "@/components/Loading";
import { useSearch } from "@/contexts/SearchContext";

// Lazy load components for better performance
const CategoryNavigation = lazy(() => import("@/components/CategoryNavigation"));
const ProductSection = lazy(() => import("@/components/ProductSection"));
const ProductCard = lazy(() => import("@/components/ProductCard"));
const BrandPromise = lazy(() => import("@/components/BrandPromise"));
const Footer = lazy(() => import("@/components/Footer"));

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
  variants: Array<{
    id: string;
    title: string;
    price: number;
    original_price: number;
    sku: string;
    in_stock: boolean;
    stock_quantity: number;
  }>;
}

export default function HomePage() {
  const { searchQuery, setFilteredProducts } = useSearch();
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create a ref for the ProductSection
  const productSectionRef = useRef<HTMLDivElement | null>(null);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Fetch all products
        const allProductsResponse = await fetch('/api/seller/products');
        if (!allProductsResponse.ok) throw new Error('Failed to fetch products');
        const allProductsData = await allProductsResponse.json();
        
        // Fetch featured products
        const featuredProductsResponse = await fetch('/api/seller/products?featured=true');
        if (!featuredProductsResponse.ok) throw new Error('Failed to fetch featured products');
        const featuredProductsData = await featuredProductsResponse.json();
        
        if (allProductsData.success) {
          setProducts(allProductsData.data);
        }
        
        if (featuredProductsData.success) {
          setFeaturedProducts(featuredProductsData.data);
        }
        
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) {
      return products;
    }

    return products.filter((product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, products]);

  // Update filtered products in context
  useEffect(() => {
    setFilteredProducts(filteredProducts);
  }, [filteredProducts, setFilteredProducts]);

  // Convert API product format to component format
  const convertProduct = (product: Product) => ({
    id: product.id,
    name: product.title,
    description: product.description,
    basePrice: product.price,
    image: product.image_url,
    category: "", // Will be fetched from collections
    rating: product.rating,
    reviews: product.reviews_count,
    highlight: product.is_featured,
    variants: product.variants.map(variant => ({
      id: variant.sku,
      quantity: variant.title,
      price: variant.price,
      originalPrice: variant.original_price,
      inStock: variant.in_stock
    }))
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F1E6] animate-fade-in">
        <AnnouncementBar />
        <Header productSectionRef={productSectionRef} hasAnnouncementBar={true} />
        <HeroBanner productSectionRef={productSectionRef} />
        <main className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {Array.from({length: 8}).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F9F1E6] animate-fade-in">
        <AnnouncementBar />
        <Header productSectionRef={productSectionRef} hasAnnouncementBar={true} />
        <HeroBanner productSectionRef={productSectionRef} />
        <main className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Products</h2>
            <p className="text-gray-600 mb-8">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-[#5D4733] text-white px-6 py-2 rounded-full hover:bg-[#7A3E2F]"
            >
              Retry
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="animate-fade-in">
                  <ProductCard product={convertProduct(product)} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Featured Products Section */}
            {featuredProducts.length > 0 && (
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
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                    {featuredProducts.map((product) => (
                      <div key={product.id} className="animate-fade-in">
                        <ProductCard product={convertProduct(product)} />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* All Products Section */}
            <section ref={productSectionRef} className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-[#5D4733] mb-2">
                  All Products
                </h2>
                <p className="text-gray-600">
                  Discover our premium collection of natural products
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                {products.map((product) => (
                  <div key={product.id} className="animate-fade-in">
                    <ProductCard product={convertProduct(product)} />
                  </div>
                ))}
              </div>
            </section>
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

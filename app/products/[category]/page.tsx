"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Loading, ProductCardSkeleton } from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Filter } from "lucide-react";
import { useSearch } from "@/contexts/SearchContext";

// Category mapping
const categoryMap: { [key: string]: string } = {
  "a2-ghee": "A2 Ghee",
  "honey": "Honey", 
  "oil": "Oil",
  "spices": "Spices"
};

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

interface Collection {
  id: number;
  title: string;
  description: string;
  slug: string;
}

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const { searchQuery } = useSearch();
  const category = params?.category as string;

  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("featured");

  // Fetch collections and products
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch collections to get the collection ID
        const collectionsResponse = await fetch('/api/seller/collections');
        if (!collectionsResponse.ok) throw new Error('Failed to fetch collections');
        
        const collectionsData = await collectionsResponse.json();
        if (!collectionsData.success) throw new Error('Failed to load collections');
        
        setCollections(collectionsData.data);
        
        // Find the collection that matches the category
        const collection = collectionsData.data.find((c: Collection) => c.slug === category);
        
        if (collection) {
          // Fetch products for this collection
          const productsResponse = await fetch(`/api/seller/products/by-collection?collection_id=${collection.id}`);
          if (!productsResponse.ok) throw new Error('Failed to fetch products');
          
          const productsData = await productsResponse.json();
          if (productsData.success) {
            setProducts(productsData.data);
          } else {
            throw new Error('Failed to load products');
          }
        } else {
          setError('Category not found');
        }
        
      } catch (err) {
        console.error('Error fetching category data:', err);
        setError('Failed to load category products');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category]);

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) {
      return products;
    }

    return products.filter(product =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const productsToSort = [...filteredProducts];
    
    switch (sortBy) {
      case "price-low":
        return productsToSort.sort((a, b) => a.price - b.price);
      case "price-high":
        return productsToSort.sort((a, b) => b.price - a.price);
      case "rating":
        return productsToSort.sort((a, b) => b.rating - a.rating);
      case "newest":
        return productsToSort.sort((a, b) => b.id - a.id);
      case "featured":
      default:
        return productsToSort.sort((a, b) => {
          if (a.is_featured && !b.is_featured) return -1;
          if (!a.is_featured && b.is_featured) return 1;
          return b.rating - a.rating;
        });
    }
  }, [filteredProducts, sortBy]);

  // Convert API product format to component format
  const convertProduct = (product: Product) => ({
    id: product.id,
    name: product.title,
    description: product.description,
    basePrice: product.price,
    image: product.image_url,
    category: categoryMap[category] || category,
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

  const categoryName = categoryMap[category] || category;
  const currentCollection = collections.find(c => c.slug === category);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F1E6]">
        <Header hasAnnouncementBar={false} />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
      <div className="min-h-screen bg-[#F9F1E6]">
        <Header hasAnnouncementBar={false} />
        <main className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Category Not Found</h1>
            <p className="text-gray-600 mb-8">{error}</p>
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

  return (
    <div className="min-h-screen bg-[#F9F1E6]">
      <Header hasAnnouncementBar={false} />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-[#5D4733] hover:bg-[#5D4733]/10 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[#5D4733] mb-2">
              {currentCollection?.title || categoryName}
            </h1>
            <p className="text-gray-600 text-lg">
              {currentCollection?.description || `Explore our premium ${categoryName.toLowerCase()} collection`}
            </p>
          </div>

          {/* Search Results Info */}
          {searchQuery && (
            <div className="mb-6">
              <p className="text-gray-600">
                {filteredProducts.length} products found for "{searchQuery}" in {categoryName}
              </p>
            </div>
          )}

          {/* Sort and Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">
                Showing {sortedProducts.length} products
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm text-gray-600">Sort by:</label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#5D4733]"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {sortedProducts.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              No products found
            </h2>
            <p className="text-gray-600 mb-8">
              {searchQuery 
                ? `No products match "${searchQuery}" in this category.`
                : `No products available in ${categoryName} category.`
              }
            </p>
            <Button
              onClick={() => router.push('/')}
              className="bg-[#5D4733] hover:bg-[#7A3E2F] text-white px-6 py-2 rounded-full"
            >
              Browse All Products
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <div key={product.id} className="animate-fade-in">
                <ProductCard product={convertProduct(product)} />
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

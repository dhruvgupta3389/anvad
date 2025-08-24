// Shared product types for API-based data

export interface ProductVariant {
  id: string;
  quantity: string;
  price: number;
  originalPrice: number;
  inStock: boolean;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  highlight: boolean;
  variants: ProductVariant[];
}

// API response types
export interface ApiProductVariant {
  id: string;
  title: string;
  price: number;
  original_price: number;
  sku: string;
  in_stock: boolean;
  stock_quantity: number;
}

export interface ApiProduct {
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
  variants: ApiProductVariant[];
}

export interface Collection {
  id: number;
  title: string;
  description: string;
  slug: string;
}

// Utility function to convert API product to UI product
export const convertApiProductToProduct = (apiProduct: ApiProduct, category?: string): Product => ({
  id: apiProduct.id,
  name: apiProduct.title,
  description: apiProduct.description,
  basePrice: apiProduct.price,
  image: apiProduct.image_url,
  category: category || '',
  rating: apiProduct.rating,
  reviews: apiProduct.reviews_count,
  highlight: apiProduct.is_featured,
  variants: apiProduct.variants.map(variant => ({
    id: variant.sku,
    quantity: variant.title,
    price: variant.price,
    originalPrice: variant.original_price,
    inStock: variant.in_stock
  }))
});

// Image URLs for ghee products
const girCowGhee = "https://images.pexels.com/photos/9105966/pexels-photo-9105966.jpeg?w=500&h=600&fit=crop&crop=center";
const desiCowGhee = "https://images.pexels.com/photos/8805026/pexels-photo-8805026.jpeg?w=500&h=600&fit=crop&crop=center";
const buffaloGhee = "https://images.pexels.com/photos/315420/pexels-photo-315420.jpeg?w=500&h=600&fit=crop&crop=center";

export interface Product {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  variants: ProductVariant[];
  highlight?: boolean;
}

export interface ProductVariant {
  id: string;
  quantity: string;
  price: number;
  originalPrice: number;
  inStock: boolean;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Gir Cow A2 Ghee",
    description: "Pure A2 Ghee made from Gir cow milk, traditionally churned for authentic taste and nutrition",
    basePrice: 1299,
    image: girCowGhee,
    category: "A2 Ghee",
    rating: 4.9,
    reviews: 245,
    highlight: true,
    variants: [
      {
        id: "gir-1000ml",
        quantity: "1000ml",
        price: 1299,
        originalPrice: 1599,
        inStock: true
      },
      {
        id: "gir-500ml",
        quantity: "500ml",
        price: 699,
        originalPrice: 849,
        inStock: true
      },
      {
        id: "gir-220ml",
        quantity: "220ml",
        price: 349,
        originalPrice: 399,
        inStock: true
      }
    ]
  },
  {
    id: 2,
    name: "Desi Cow A2 Ghee",
    description: "Premium A2 Ghee from indigenous desi cows, rich in nutrients and traditional flavor",
    basePrice: 1199,
    image: desiCowGhee,
    category: "A2 Ghee",
    rating: 4.8,
    reviews: 189,
    highlight: true,
    variants: [
      {
        id: "desi-1000ml",
        quantity: "1000ml",
        price: 1199,
        originalPrice: 1449,
        inStock: true
      },
      {
        id: "desi-500ml",
        quantity: "500ml",
        price: 649,
        originalPrice: 799,
        inStock: true
      },
      {
        id: "desi-220ml",
        quantity: "220ml",
        price: 329,
        originalPrice: 379,
        inStock: true
      }
    ]
  },
  {
    id: 3,
    name: "Buffalo A2 Ghee",
    description: "Rich and creamy A2 Ghee from buffalo milk, perfect for cooking and health benefits",
    basePrice: 899,
    image: buffaloGhee,
    category: "A2 Ghee",
    rating: 4.7,
    reviews: 156,
    highlight: true,
    variants: [
      {
        id: "buffalo-1000ml",
        quantity: "1000ml",
        price: 899,
        originalPrice: 1099,
        inStock: true
      },
      {
        id: "buffalo-500ml",
        quantity: "500ml",
        price: 499,
        originalPrice: 599,
        inStock: true
      },
      {
        id: "buffalo-220ml",
        quantity: "220ml",
        price: 249,
        originalPrice: 299,
        inStock: true
      }
    ]
  },
  {
    id: 4,
    name: "Cold Pressed Coconut Oil",
    description: "Pure cold-pressed coconut oil extracted from fresh coconuts, rich in natural nutrients and flavor",
    basePrice: 599,
    image: "https://images.pexels.com/photos/315420/pexels-photo-315420.jpeg?w=500&h=600&fit=crop&crop=center",
    category: "Oil",
    rating: 4.6,
    reviews: 78,
    highlight: false,
    variants: [
      {
        id: "coconut-1000ml",
        quantity: "1000ml",
        price: 599,
        originalPrice: 749,
        inStock: true
      },
      {
        id: "coconut-500ml",
        quantity: "500ml",
        price: 329,
        originalPrice: 399,
        inStock: true
      },
      {
        id: "coconut-250ml",
        quantity: "250ml",
        price: 179,
        originalPrice: 219,
        inStock: true
      }
    ]
  },
  {
    id: 5,
    name: "Mustard Oil - Cold Pressed",
    description: "Traditional cold-pressed mustard oil with authentic flavor, perfect for cooking and health benefits",
    basePrice: 449,
    image: "https://images.pexels.com/photos/315420/pexels-photo-315420.jpeg?w=500&h=600&fit=crop&crop=center",
    category: "Oil",
    rating: 4.5,
    reviews: 92,
    highlight: false,
    variants: [
      {
        id: "mustard-1000ml",
        quantity: "1000ml",
        price: 449,
        originalPrice: 549,
        inStock: true
      },
      {
        id: "mustard-500ml",
        quantity: "500ml",
        price: 249,
        originalPrice: 299,
        inStock: true
      }
    ]
  },
  {
    id: 6,
    name: "Sesame Oil - Pure",
    description: "Premium quality sesame oil, cold-pressed for maximum nutrition and authentic taste",
    basePrice: 699,
    image: "https://images.pexels.com/photos/315420/pexels-photo-315420.jpeg?w=500&h=600&fit=crop&crop=center",
    category: "Oil",
    rating: 4.7,
    reviews: 45,
    highlight: false,
    variants: [
      {
        id: "sesame-500ml",
        quantity: "500ml",
        price: 699,
        originalPrice: 849,
        inStock: true
      },
      {
        id: "sesame-250ml",
        quantity: "250ml",
        price: 379,
        originalPrice: 449,
        inStock: true
      }
    ]
  },
  {
    id: 7,
    name: "Raw Wildflower Honey",
    description: "Pure raw honey collected from wildflower meadows, unprocessed and natural with rich floral taste",
    basePrice: 799,
    image: "https://images.pexels.com/photos/9105966/pexels-photo-9105966.jpeg?w=500&h=600&fit=crop&crop=center",
    category: "Honey",
    rating: 4.8,
    reviews: 156,
    highlight: false,
    variants: [
      {
        id: "wildflower-1000g",
        quantity: "1000g",
        price: 799,
        originalPrice: 999,
        inStock: true
      },
      {
        id: "wildflower-500g",
        quantity: "500g",
        price: 449,
        originalPrice: 549,
        inStock: true
      },
      {
        id: "wildflower-250g",
        quantity: "250g",
        price: 249,
        originalPrice: 299,
        inStock: true
      }
    ]
  },
  {
    id: 8,
    name: "Acacia Honey - Raw",
    description: "Premium acacia honey with delicate floral flavor, slow to crystallize and perfect for daily use",
    basePrice: 899,
    image: "https://images.pexels.com/photos/9105966/pexels-photo-9105966.jpeg?w=500&h=600&fit=crop&crop=center",
    category: "Honey",
    rating: 4.9,
    reviews: 89,
    highlight: false,
    variants: [
      {
        id: "acacia-500g",
        quantity: "500g",
        price: 899,
        originalPrice: 1099,
        inStock: true
      },
      {
        id: "acacia-250g",
        quantity: "250g",
        price: 479,
        originalPrice: 579,
        inStock: true
      }
    ]
  },
  {
    id: 9,
    name: "Forest Honey - Pure",
    description: "Deep amber forest honey harvested from deep forest hives, rich in minerals and antioxidants",
    basePrice: 1199,
    image: "https://images.pexels.com/photos/9105966/pexels-photo-9105966.jpeg?w=500&h=600&fit=crop&crop=center",
    category: "Honey",
    rating: 4.7,
    reviews: 67,
    highlight: false,
    variants: [
      {
        id: "forest-500g",
        quantity: "500g",
        price: 1199,
        originalPrice: 1449,
        inStock: true
      },
      {
        id: "forest-250g",
        quantity: "250g",
        price: 649,
        originalPrice: 779,
        inStock: true
      }
    ]
  }
];

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};

export const getProductById = (id: number): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getHighlightedProducts = (): Product[] => {
  return products.filter(product => product.highlight === true);
};

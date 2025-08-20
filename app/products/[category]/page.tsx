"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { products, getProductsByCategory } from "@/data/products";
import { 
  ArrowLeft, 
  Mail, 
  Bell, 
  Filter, 
  Grid3X3, 
  List, 
  Search,
  Star,
  Shield,
  Truck,
  Award,
  Leaf,
  Heart,
  ChefHat,
  Crown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface CategoryConfig {
  name: string;
  description: string;
  icon: string;
  comingSoonDescription: string;
  heroImage: string;
  benefits: string[];
  features: Array<{
    icon: React.ReactNode;
    title: string;
    description: string;
  }>;
}

const categoryConfigs: Record<string, CategoryConfig> = {
  "all-products": {
    name: "All Products",
    description: "Discover our complete collection of premium A2 ghee and natural products crafted with traditional methods and modern quality standards",
    icon: "🛍️",
    comingSoonDescription: "",
    heroImage: "https://images.unsplash.com/photo-1556909114-4f29305fb654?w=1200&h=400&fit=crop&crop=center",
    benefits: ["100% Natural", "Premium Quality", "Traditional Methods", "Lab Tested"],
    features: [
      {
        icon: <Leaf className="h-6 w-6" />,
        title: "100% Natural",
        description: "Pure ingredients without harmful additives"
      },
      {
        icon: <Award className="h-6 w-6" />,
        title: "Premium Quality",
        description: "Highest quality standards maintained"
      },
      {
        icon: <Heart className="h-6 w-6" />,
        title: "Health Focused",
        description: "Rich in nutrients for healthy lifestyle"
      }
    ]
  },
  "a2-ghee": {
    name: "A2 Ghee Collection",
    description: "Pure A2 ghee made from the finest quality milk of grass-fed cows using traditional bilona method. Experience the authentic taste and unmatched nutritional benefits.",
    icon: "🧈",
    comingSoonDescription: "",
    heroImage: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=1200&h=400&fit=crop&crop=center",
    benefits: ["A2 Beta-Casein", "Bilona Method", "Grass-Fed Cows", "Chemical Free"],
    features: [
      {
        icon: <Crown className="h-6 w-6" />,
        title: "Pure A2 Milk",
        description: "From indigenous cows producing A2 beta-casein protein"
      },
      {
        icon: <ChefHat className="h-6 w-6" />,
        title: "Traditional Bilona",
        description: "Prepared using age-old bilona method"
      },
      {
        icon: <Star className="h-6 w-6" />,
        title: "Premium Quality",
        description: "Rich in vitamins and healthy fats"
      }
    ]
  },
  "honey": {
    name: "Premium Honey Collection",
    description: "Raw, unprocessed honey sourced directly from trusted beekeepers. Pure wildflower honey with natural enzymes and antioxidants.",
    icon: "🍯",
    comingSoonDescription: "Get ready for our premium collection of pure, raw honey sourced directly from trusted beekeepers. Experience the natural sweetness and health benefits of our carefully curated honey varieties.",
    heroImage: "https://images.unsplash.com/photo-1587049016823-c80767480df6?w=1200&h=400&fit=crop&crop=center",
    benefits: ["Raw & Unprocessed", "Wildflower Source", "Natural Enzymes", "Antioxidant Rich"],
    features: [
      {
        icon: <Leaf className="h-6 w-6" />,
        title: "Raw & Unprocessed",
        description: "Pure honey collected directly from beehives"
      },
      {
        icon: <Star className="h-6 w-6" />,
        title: "Wildflower Source",
        description: "Rich, complex flavors from wildflower meadows"
      },
      {
        icon: <Heart className="h-6 w-6" />,
        title: "Health Benefits",
        description: "Natural antioxidants and immune support"
      }
    ]
  },
  "oil": {
    name: "Premium Oil Collection",
    description: "Cold-pressed, organic oils extracted using traditional methods to preserve maximum nutrients and authentic flavors.",
    icon: "🛢️",
    comingSoonDescription: "Discover our upcoming collection of cold-pressed, organic oils including coconut oil, mustard oil, and other traditional cooking oils. Pure, natural, and packed with nutrients for healthy cooking.",
    heroImage: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=1200&h=400&fit=crop&crop=center",
    benefits: ["Cold Pressed", "100% Pure", "No Additives", "High Smoke Point"],
    features: [
      {
        icon: <Leaf className="h-6 w-6" />,
        title: "Cold Pressed",
        description: "Traditional extraction retains nutrients"
      },
      {
        icon: <Shield className="h-6 w-6" />,
        title: "Pure & Organic",
        description: "No chemicals or preservatives added"
      },
      {
        icon: <ChefHat className="h-6 w-6" />,
        title: "Cooking Excellence",
        description: "Perfect for healthy cooking with authentic flavors"
      }
    ]
  },
  "spices": {
    name: "Authentic Spice Collection",
    description: "Handpicked spices with intense aroma and authentic traditional flavors. Freshly ground from whole spices to preserve maximum potency.",
    icon: "🌶️",
    comingSoonDescription: "Explore our forthcoming range of authentic, aromatic spices sourced from the finest farms. From turmeric to cardamom, experience the true flavors of traditional Indian spices in their purest form.",
    heroImage: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1200&h=400&fit=crop&crop=center",
    benefits: ["Authentic Flavor", "Fresh Ground", "Farm Direct", "Traditional Quality"],
    features: [
      {
        icon: <Star className="h-6 w-6" />,
        title: "Authentic Flavor",
        description: "Handpicked spices with intense aroma"
      },
      {
        icon: <Leaf className="h-6 w-6" />,
        title: "Fresh Ground",
        description: "Freshly ground to preserve maximum potency"
      },
      {
        icon: <Award className="h-6 w-6" />,
        title: "Traditional Quality",
        description: "Sourced using traditional cultivation methods"
      }
    ]
  }
};

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const category = params.category as string;
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [emailNotification, setEmailNotification] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [category]);

  const categoryConfig = categoryConfigs[category || "all-products"];
  
  const categoryProducts = useMemo(() => {
    if (!category || category === "all-products") {
      return products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    const categoryMap: Record<string, string> = {
      "a2-ghee": "A2 Ghee",
      "honey": "Honey",
      "oil": "Oil", 
      "spices": "Spices"
    };

    const categoryName = categoryMap[category];
    const categoryProductsList = categoryName ? getProductsByCategory(categoryName) : [];
    return categoryProductsList.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [category, searchTerm]);

  const groupedProducts = useMemo(() => {
    if (category !== "all-products") return null;

    const groups: Record<string, typeof products> = {};
    categoryProducts.forEach(product => {
      if (!groups[product.category]) {
        groups[product.category] = [];
      }
      groups[product.category].push(product);
    });
    return groups;
  }, [category, categoryProducts]);

  const hasProducts = categoryProducts.length > 0;

  const handleNotifyMe = () => {
    if (emailNotification) {
      toast("🔔 Thank you!", {
        description: `We'll notify you when ${categoryConfig.name} products are available!`,
        duration: 3000,
      });
      setEmailNotification('');
    }
  };

  if (!categoryConfig) {
    router.push("/products/all-products");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F1E6] via-white to-[#F9F1E6]">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            className="text-[#7d3600] hover:bg-[#7d3600]/10 hover:scale-105 transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          
          {hasProducts && (
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="bg-[#7d3600] hover:bg-[#b84d00]"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="bg-[#7d3600] hover:bg-[#b84d00]"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Hero Section */}
        <div className="relative mb-16 rounded-3xl overflow-hidden shadow-2xl">
          <div className="relative h-64 md:h-80">
            <img
              src={categoryConfig.heroImage}
              alt={categoryConfig.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#7d3600]/80 via-[#7d3600]/60 to-transparent"></div>
            
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-2xl mx-auto px-8 text-center text-white">
                <div className="text-6xl mb-4 animate-bounce">
                  {categoryConfig.icon}
                </div>
                <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                  {categoryConfig.name}
                </h1>
                <p className="text-lg md:text-xl mb-6 text-white/90 leading-relaxed">
                  {categoryConfig.description}
                </p>
                
                {/* Benefits Pills */}
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {categoryConfig.benefits.map((benefit, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="bg-white/20 text-white border-white/30 hover:bg-white/30 transition-all duration-300"
                    >
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar (only if has products) */}
        {hasProducts && (
          <div className="mb-8">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-full border-2 focus:border-[#7d3600] transition-all duration-300"
              />
            </div>
          </div>
        )}

        {hasProducts ? (
          <>
            {/* Products Grid */}
            {category === "all-products" && groupedProducts ? (
              <div className="space-y-16">
                {Object.entries(groupedProducts).map(([categoryName, categoryProductsList]) => (
                  <div key={categoryName} className="animate-fade-in">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl md:text-3xl font-bold text-[#7d3600] mb-2">
                        {categoryName}
                      </h2>
                      <div className="w-16 h-0.5 bg-gradient-to-r from-[#7d3600] to-[#b84d00] mx-auto rounded-full"></div>
                    </div>
                    <div className={`grid ${
                      viewMode === 'grid' 
                        ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6' 
                        : 'grid-cols-1 gap-4'
                    }`}>
                      {categoryProductsList.map((product) => (
                        <div key={product.id} className="animate-fade-in hover:scale-105 transition-transform duration-300">
                          <ProductCard product={product} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`grid ${
                viewMode === 'grid' 
                  ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6' 
                  : 'grid-cols-1 gap-4'
              }`}>
                {categoryProducts.map((product) => (
                  <div key={product.id} className="animate-fade-in hover:scale-105 transition-transform duration-300">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}

            {/* Features Section */}
            <div className="mt-20 bg-gradient-to-r from-[#7d3600]/5 via-white to-[#b84d00]/5 rounded-3xl p-8 md:p-12 shadow-xl">
              <h2 className="text-3xl font-bold text-[#7d3600] mb-8 text-center">
                Why Choose Our {categoryConfig.name}?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {categoryConfig.features.map((feature, index) => (
                  <div key={index} className="text-center group hover:scale-105 transition-all duration-300">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#7d3600] to-[#b84d00] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <span className="text-white text-2xl">
                        {feature.icon}
                      </span>
                    </div>
                    <h3 className="font-bold text-[#7d3600] mb-3 text-lg">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: <Shield className="h-8 w-8" />, title: "Quality Assured", desc: "Lab tested purity" },
                { icon: <Truck className="h-8 w-8" />, title: "Fast Delivery", desc: "Free shipping above ₹500" },
                { icon: <Star className="h-8 w-8" />, title: "5 Star Rated", desc: "1000+ happy customers" },
                { icon: <Award className="h-8 w-8" />, title: "Premium Brand", desc: "Trusted since 2020" }
              ].map((item, index) => (
                <div key={index} className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="text-[#7d3600] mb-3 flex justify-center">
                    {item.icon}
                  </div>
                  <h4 className="font-semibold text-[#7d3600] mb-1">{item.title}</h4>
                  <p className="text-xs text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Coming Soon Section */}
            <div className="text-center py-16">
              <div className="inline-block bg-gradient-to-r from-[#b84d00] to-[#7d3600] text-white px-8 py-3 rounded-full font-bold mb-8 shadow-lg">
                Coming Soon
              </div>
              
              <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                {categoryConfig.comingSoonDescription}
              </p>

              {/* Notification Signup */}
              <Card className="max-w-lg mx-auto mb-16 shadow-xl border-2 border-[#7d3600]/10">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6 justify-center">
                    <Bell className="h-6 w-6 text-[#7d3600]" />
                    <h3 className="font-bold text-[#7d3600] text-xl">Get Notified First</h3>
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Be the first to know when our {categoryConfig.name.toLowerCase()} products are available! Get exclusive early access and special launch offers.
                  </p>
                  <div className="flex gap-3">
                    <Input 
                      type="email"
                      placeholder="Enter your email address"
                      value={emailNotification}
                      onChange={(e) => setEmailNotification(e.target.value)}
                      className="flex-1 border-2 focus:border-[#7d3600]"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleNotifyMe();
                        }
                      }}
                    />
                    <Button 
                      className="bg-gradient-to-r from-[#7d3600] to-[#b84d00] hover:from-[#b84d00] hover:to-[#7d3600] px-6"
                      onClick={handleNotifyMe}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Notify Me
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Expected Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                {categoryConfig.features.map((feature, index) => (
                  <div key={index} className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#7d3600] to-[#b84d00] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <span className="text-white text-xl">
                        {feature.icon}
                      </span>
                    </div>
                    <h3 className="font-bold text-[#7d3600] mb-3 text-lg">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

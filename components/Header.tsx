"use client";

import { Search, ShoppingCart, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import { useSearch } from "@/contexts/SearchContext";

// Category data from CategoryNavigation
const mobileMenuCategories = [
  {
    name: "All Products",
    image: "https://images.pexels.com/photos/9105966/pexels-photo-9105966.jpeg?w=300&h=200&fit=crop&crop=center",
    route: "/products/all-products",
    hasProducts: true
  },
  {
    name: "A2 Ghee",
    image: "https://images.pexels.com/photos/8805026/pexels-photo-8805026.jpeg?w=300&h=200&fit=crop&crop=center",
    route: "/products/a2-ghee",
    hasProducts: true
  },
  {
    name: "Honey",
    image: "https://images.pexels.com/photos/9105966/pexels-photo-9105966.jpeg?w=300&h=200&fit=crop&crop=center",
    route: "/products/honey",
    hasProducts: false
  },
  {
    name: "Oil",
    image: "https://images.pexels.com/photos/315420/pexels-photo-315420.jpeg?w=300&h=200&fit=crop&crop=center",
    route: "/products/oil",
    hasProducts: false
  },
  {
    name: "Spices",
    image: "https://images.pexels.com/photos/315420/pexels-photo-315420.jpeg?w=300&h=200&fit=crop&crop=center",
    route: "/products/spices",
    hasProducts: false
  }
];

interface HeaderProps {
  productSectionRef?: React.RefObject<HTMLDivElement>;
  hasAnnouncementBar?: boolean;
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const Header = ({ productSectionRef, hasAnnouncementBar = false }: HeaderProps) => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const { state } = useCart();
  const { searchQuery, setSearchQuery } = useSearch();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToProductSection = () => {
    router.push("/");
    if (productSectionRef?.current) {
      const topOffset = productSectionRef.current.offsetTop;
      const announcementBarHeight = isScrolled ? 0 : 60; // Adjust based on announcement bar height
      window.scrollTo({
        top: topOffset - 130 - announcementBarHeight,
        behavior: "smooth",
      });
    }
  };


  return (
    <header className={`sticky z-50 shadow-md bg-white transition-all duration-500 ease-in-out ${
      hasAnnouncementBar ? (isScrolled ? 'top-0' : 'top-[60px]') : 'top-0'
    }`}>
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between">
          {/* Left: Logo */}
          <div
            className="flex-shrink-0 flex items-center cursor-pointer"
            onClick={() => router.push("/")}
          >
            <div className="h-12 w-auto lg:h-14 flex items-center text-2xl font-bold text-[#7d3600]">
              ANVEDA
            </div>
          </div>

          {/* Right: Icons */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="transition-all hover:bg-[#7d3600]/10"
              onClick={() => setIsSearchVisible(!isSearchVisible)}
            >
              <Search className="h-5 w-5 text-gray-600" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-[#7d3600]/10 transition-all transform hover:scale-110"
              data-href="/cart"
              onClick={() => {
                scrollToTop();
                router.push("/cart");
              }}
            >
              <ShoppingCart className="h-7 w-7 text-gray-600" />
              {state.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#7d3600] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {state.itemCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Layout - 3 column grid for perfect centering */}
        <div className="md:hidden grid grid-cols-3 items-center">
          {/* Left: Menu Button */}
          <div className="justify-self-start">
            <Button
              variant="ghost"
              size="icon"
              className="flex-shrink-0"
              onClick={() => setIsMenuOpen((v) => !v)}
              aria-label="Menu"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </Button>
          </div>

          {/* Center: Logo */}
          <div
            className="justify-self-center cursor-pointer"
            onClick={() => router.push("/")}
          >
            <div className="h-10 w-auto sm:h-12 flex items-center text-xl font-bold text-[#7d3600]">
              ANVEDA
            </div>
          </div>

          {/* Right: Icons */}
          <div className="justify-self-end flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className="transition-all hover:bg-[#7d3600]/10"
              onClick={() => setIsSearchVisible(!isSearchVisible)}
              aria-label="Toggle Search"
            >
              <Search className="h-5 w-5 text-gray-600" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-[#7d3600]/10 transition-all transform hover:scale-110"
              data-href="/cart"
              onClick={() => {
                scrollToTop();
                router.push("/cart");
              }}
              aria-label="Cart"
            >
              <ShoppingCart className="h-6 w-6 text-gray-600" />
              {state.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#7d3600] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {state.itemCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchVisible && (
          <div className="mt-4 animate-fade-in">
            <div className="relative max-w-xl mx-auto">
              <Input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={scrollToProductSection}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-[#7d3600] focus:border-transparent transition-all duration-300 w-full"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
          </div>
        )}

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="mt-4 flex flex-col space-y-2 md:hidden animate-fade-in bg-white border rounded-lg shadow-lg p-3">
            {mobileMenuCategories.map((category) => (
              <button
                key={category.name}
                data-href={category.route}
                onClick={() => {
                  router.push(category.route);
                  setIsMenuOpen(false);
                }}
                className="flex items-center space-x-3 text-gray-700 hover:text-[#7d3600] hover:bg-[#7d3600]/5 text-left px-3 py-3 rounded-lg transition-all duration-200 relative"
              >
                <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <span className="font-medium text-sm">{category.name}</span>
                  {!category.hasProducts && (
                    <div className="text-xs text-gray-500 mt-0.5">Coming Soon</div>
                  )}
                </div>
                {!category.hasProducts && (
                  <div className="bg-[#b84d00] text-[#7d3600] text-xs font-bold px-2 py-1 rounded-full">
                    Soon
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

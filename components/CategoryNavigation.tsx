"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";

interface CategoryItem {
  name: string;
  image: string;
  category: string;
  hasProducts: boolean;
  route: string;
}

const categories: CategoryItem[] = [
  {
    name: "A2 Ghee",
    image: "https://images.pexels.com/photos/8805026/pexels-photo-8805026.jpeg?w=300&h=200&fit=crop&crop=center",
    category: "A2 Ghee",
    hasProducts: true,
    route: "/products/a2-ghee"
  },
  {
    name: "Honey",
    image: "https://images.pexels.com/photos/9105966/pexels-photo-9105966.jpeg?w=300&h=200&fit=crop&crop=center",
    category: "Honey",
    hasProducts: false,
    route: "/products/honey"
  },
  {
    name: "Oil",
    image: "https://images.pexels.com/photos/315420/pexels-photo-315420.jpeg?w=300&h=200&fit=crop&crop=center",
    category: "Oil",
    hasProducts: false,
    route: "/products/oil"
  },
  {
    name: "Spices",
    image: "https://images.pexels.com/photos/315420/pexels-photo-315420.jpeg?w=300&h=200&fit=crop&crop=center",
    category: "Spices",
    hasProducts: false,
    route: "/products/spices"
  }
];

const CategoryNavigation = () => {
  const router = useRouter();

  const handleCategoryClick = (category: CategoryItem) => {
    router.push(category.route);
  };

  return (
    <section className="bg-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#7d3600] mb-2">
            Shop by Category
          </h2>
          <p className="text-gray-600">
            Discover our premium collection of natural products
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {categories.map((category, index) => (
            <Card
              key={index}
              className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 w-28 sm:w-40 md:w-44 lg:w-48"
              data-href={category.route}
              onClick={() => handleCategoryClick(category)}
            >
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-32 md:h-40 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {!category.hasProducts && (
                    <div className="absolute top-2 right-2 bg-[#b84d00] text-[#7d3600] text-xs font-bold px-2 py-1 rounded-full">
                      Soon
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-3 md:p-4 text-center">
                  <h3 className="font-semibold text-[#7d3600] text-sm md:text-base group-hover:text-[#b84d00] transition-colors">
                    {category.name}
                  </h3>
                  {!category.hasProducts && (
                    <p className="text-xs text-gray-500 mt-1">Coming Soon</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryNavigation;

"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroBannerProps {
  productSectionRef: React.RefObject<HTMLDivElement>;
}

const images = [
  "https://images.pexels.com/photos/9105966/pexels-photo-9105966.jpeg?w=1200&h=800&fit=crop&crop=center",
  "https://images.pexels.com/photos/8805026/pexels-photo-8805026.jpeg?w=1200&h=800&fit=crop&crop=center",
  "https://images.pexels.com/photos/315420/pexels-photo-315420.jpeg?w=1200&h=800&fit=crop&crop=center"
];

const HeroBanner = ({ productSectionRef }: HeroBannerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const scrollToProductSection = () => {
    if (productSectionRef.current) {
      const topOffset = productSectionRef.current.offsetTop;
      window.scrollTo({
        top: topOffset - 80,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 4000); // Auto-slide every 4 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-[90vh] overflow-hidden">
      {/* Slides */}
      <div
        className="absolute inset-0 w-full h-full transition-all duration-700"
        style={{
          backgroundImage: `url(${images[currentIndex]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center">
        <div className="text-white max-w-2xl space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight drop-shadow-lg">
            Pure A2 Ghee Collection <br />
            <span className="text-[#EDBC7E] animate-pulse">Traditional & Authentic</span>
          </h1>
          <p className="text-lg md:text-xl drop-shadow leading-relaxed">
            Experience the richness of tradition with our premium A2 ghee made from Gir cow, Desi cow, and Buffalo milk.
            Traditionally churned for authentic taste and maximum nutrition.
          </p>
          <Button
            onClick={scrollToProductSection}
            className="bg-[#7d3600] hover:bg-[#b84d00] text-white px-8 py-3 text-lg rounded-full transition-all duration-300"
          >
            Shop Now
          </Button>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-[#7d3600] p-2 rounded-full shadow z-30 transition"
      >
        <ChevronLeft />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-[#7d3600] p-2 rounded-full shadow z-30 transition"
      >
        <ChevronRight />
      </button>
    </section>
  );
};

export default HeroBanner;

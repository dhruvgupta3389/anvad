import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HeroBannerProps {
  productSectionRef: React.RefObject<HTMLDivElement>;
}

const images = [
  "https://imgv3.fotor.com/images/videoImage/wonderland-girl-generated-by-Fotor-ai-art-generator.jpg?w=500&h=600&fit=crop",
  "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500&h=600&fit=crop",
  "https://cdn.pixabay.com/photo/2017/07/19/13/50/image-2519143_1280.jpg?w=500&h=600&fit=crop",
];

const HeroBanner = ({ productSectionRef }: HeroBannerProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Scroll to product section with offset
  const scrollToProductSection = () => {
    if (productSectionRef.current) {
      const topOffset = productSectionRef.current.offsetTop;
      window.scrollTo({
        top: topOffset - 100,
        behavior: "smooth",
      });
    }
  };

  // Move to next image
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  // Move to previous image
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Auto-slide every 4 seconds
  useEffect(() => {
    intervalRef.current = setInterval(nextImage, 4000);
    return () => clearInterval(intervalRef.current!);
  }, []);

  return (
    <section className="bg-gradient-to-r from-[#b84d00] to-[#F9F1E6] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Text Left */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-[#7d3600] leading-tight">
              Pure Green
              <br />
              <span className="text-[#b84d00]">Wellness</span>
            </h1>
            <p className="text-lg text-gray-700 leading-relaxed">
              Experience the power of nature with our premium collection of
              cold-pressed juices, detox shots, and organic superfoods.
              Crafted for your wellness journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={scrollToProductSection}
                className="bg-[#7d3600] hover:bg-[#b84d00] text-white px-8 py-3 text-lg rounded-full transition-all duration-300 transform hover:scale-105"
              >
                Shop Now
              </Button>
              <Button
                variant="outline"
                className="border-[#7d3600] text-[#7d3600] hover:bg-[#7d3600] hover:text-white px-8 py-3 text-lg rounded-full transition-all duration-300"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Image Carousel Right */}
          <div className="relative group">
            <div className="bg-white rounded-3xl p-4 shadow-2xl transition-transform duration-500 transform rotate-3 hover:rotate-0">
              <img
                src={images[currentImageIndex]}
                alt="Hero Slide"
                className="w-full h-96 object-cover rounded-2xl"
              />
              <div className="mt-4 text-center">
                <h3 className="text-xl font-bold text-[#7d3600]">Green Detox Shot</h3>
                <p className="text-gray-600">Daily Wellness Boost</p>
              </div>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevImage}
              className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white text-[#7d3600] p-2 rounded-full shadow hover:bg-[#7d3600] hover:text-white transition duration-300"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={nextImage}
              className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white text-[#7d3600] p-2 rounded-full shadow hover:bg-[#7d3600] hover:text-white transition duration-300"
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;

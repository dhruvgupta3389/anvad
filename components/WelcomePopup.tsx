"use client";

import { useState, useEffect } from "react";
import { X, Gift, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const WelcomePopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    phone: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    sessionStorage.removeItem('welcomePopupShown');
    const timer = setTimeout(() => {
      setIsVisible(true);
      setIsAnimating(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem('welcomePopupShown', 'true');
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.firstName && formData.email && formData.phone) {
      toast({
        title: "🎉 Welcome to Anveda!",
        description: "Your 40% discount code has been sent to your email!",
        duration: 5000,
      });
      handleClose();
    } else {
      toast({
        title: "Please fill all fields",
        description: "We need your complete information to send the discount code.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Popup Container */}
      <div
        className={`relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden w-full max-w-[95vw] sm:max-w-4xl max-h-[95vh] transition-all duration-500 transform ${
          isAnimating ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-8'
        }`}
      >
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 bg-white/90 hover:bg-white rounded-full shadow-lg backdrop-blur-sm"
        >
          <X className="h-5 w-5" />
        </Button>

        <div className="flex flex-col lg:flex-row h-full overflow-auto">
          {/* Left Section - Product Showcase */}

          <div className="lg:w-1/2 bg-gradient-to-br from-[#F9F1E6] to-[#EDBC7E]/30 p-4 sm:p-8 flex flex-col justify-center items-center relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-10 left-10 w-12 h-12 sm:w-20 sm:h-20 bg-[#EDBC7E] rounded-full animate-pulse"></div>
              <div className="absolute bottom-20 right-10 w-10 h-10 sm:w-16 sm:h-16 bg-[#5D4733] rounded-full animate-bounce delay-300"></div>
              <div className="absolute top-1/2 left-1/4 w-8 h-8 sm:w-12 sm:h-12 bg-[#7A3E2F] rounded-full animate-ping delay-700"></div>

            </div>

            {/* Product Images Grid */}
            <div className="relative z-10 grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
              {[
                "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=150&h=150&fit=crop&crop=center",
                "https://images.unsplash.com/photo-1587049016823-c80767480df6?w=150&h=150&fit=crop&crop=center",
                "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=150&h=150&fit=crop&crop=center",
                "https://images.unsplash.com/photo-1556909114-4f29305fb654?w=150&h=150&fit=crop&crop=center"
              ].map((src, index) => (
                <div
                  key={index}
                  className={`transform hover:scale-105 transition-transform duration-300 delay-${index * 100}`}
                >
                  <img
                    src={src}
                    alt="Product"
                    className="w-full h-24 sm:h-32 object-cover rounded-xl sm:rounded-2xl shadow-lg border-2 border-white"
                  />
                </div>
              ))}
            </div>

            {/* Trust Badges */}

            <div className="flex items-center gap-3 text-xs sm:text-sm text-[#5D4733] font-medium">

              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>Premium Quality</span>
              </div>
              <div className="flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-[#b84d00]" />
                <span>100% Natural</span>
              </div>
            </div>
          </div>

          {/* Right Section - Form */}

          <div className="lg:w-1/2 p-4 sm:p-8 lg:p-12 flex flex-col justify-center">
            {/* Branding */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="mx-auto w-24 sm:w-28 lg:w-32 h-12 sm:h-14 lg:h-16 flex items-center justify-center text-2xl sm:text-3xl lg:text-4xl font-bold text-[#7d3600] animate-pulse">
                ANVEDA
              </div>
              <div className="h-1 w-16 sm:w-20 bg-gradient-to-r from-[#EDBC7E] to-[#5D4733] mx-auto rounded-full mt-2"></div>
            </div>

            {/* Welcome Text */}
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#5D4733] mb-2 sm:mb-4 leading-tight">

                Welcome to{" "}
                <span className="bg-gradient-to-r from-[#b84d00] to-[#7d3600] bg-clip-text text-transparent">
                  Premium Quality
                </span>
              </h2>

              <p className="text-base sm:text-lg text-gray-600 mb-1">
                <Gift className="inline w-5 h-5 mr-2 text-[#EDBC7E]" />

                Unlock up to{" "}
                <span className="text-2xl sm:text-3xl font-bold text-red-600 animate-bounce inline-block">
                  40% OFF
                </span>
              </p>

              <p className="text-sm sm:text-base text-[#5D4733] font-medium">
                on your <span className="underline decoration-[#EDBC7E] decoration-2">first order</span>

              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {["firstName", "email", "phone"].map((field, index) => {
                const placeholders = {
                  firstName: "First Name",
                  email: "Email Address",
                  phone: "Phone Number"
                };
                return (
                  <div key={index} className="relative group">
                    <Input
                      type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                      placeholder={placeholders[field as keyof typeof placeholders]}
                      value={formData[field as keyof typeof formData]}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#5D4733] transition-all duration-300 text-base sm:text-lg group-hover:border-[#EDBC7E]"
                      required
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#EDBC7E]/10 to-[#5D4733]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                );
              })}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#5D4733] to-[#7A3E2F] hover:from-[#7A3E2F] hover:to-[#5D4733] text-white p-4 rounded-xl text-base sm:text-lg font-bold shadow-lg transform hover:scale-105 transition-all duration-300 mt-4"

              >
                <Gift className="w-5 h-5 mr-2" />
                Claim My 40% Discount
              </Button>
            </form>

            {/* Footer Text */}
            <p className="text-xs sm:text-sm text-gray-500 text-center mt-4 leading-relaxed">
              🔒 Your information is secure and will only be used to send your discount code.
              <br />
              <span className="text-[#7d3600] font-medium">No spam, just premium deals!</span>
            </p>
          </div>
        </div>


        {/* Decorative Bar */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#5D4733] via-[#EDBC7E] to-[#7A3E2F]"></div>

      </div>
    </div>
  );
};

export default WelcomePopup;

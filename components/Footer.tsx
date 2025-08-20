import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";


const Footer = () => {
  return (
    <>
      {/* Buy in Bulk CTA Bar */}
      <div className="bg-[#6f553d] text-white py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">Need to Buy in Bulk?</h3>
            <p className="text-sm opacity-90">Get special pricing for bulk orders</p>
          </div>
          <a
            href="https://wa.me/917520081717"  
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-[#7d3600]"
          >
          <Button 
            variant="outline" 
            className="border-white text-[#7d3600] hover:bg-white hover:text-[#7d3600] rounded-full px-6"
          >
            Contact Us
          </Button>
          </a>
        </div>
      </div>

      {/* Main Footer */}
      <footer className="bg-[#7d3600] text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            
            {/* About */}
            <div>
              <div className="flex items-center mb-4">
                <h3 className="text-2xl font-bold text-[#EDBC7E]">ANVEDA</h3>
                <div className="ml-2 text-xs bg-green-600 text-white px-2 py-1 rounded-full">Verified</div>
              </div>
              <p className="text-gray-300 mb-4 leading-relaxed">
                India's most trusted source for premium A2 ghee and organic products.
                Traditionally made, scientifically tested, and loved by thousands.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon" className="text-white hover:text-[#7d3600] hover:bg-white">
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-white hover:text-[#7d3600] hover:bg-white">
                  <Instagram className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-white hover:text-[#7d3600] hover:bg-white">
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-white hover:text-[#7d3600] hover:bg-white">
                  <Youtube className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Our Story</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Products</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>

            {/* Policies */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Policies</h4>
              <ul className="space-y-2">
                <li><a href="/privacy-policy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/terms-of-service" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="/shipping-policy" className="text-gray-300 hover:text-white transition-colors">Shipping Policy</a></li>
                <li><a href="/refund-policy" className="text-gray-300 hover:text-white transition-colors">Refund Policy</a></li>
                {/* <li><a href="#" className="text-gray-300 hover:text-white transition-colors">FAQ</a></li> */}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <div>
      <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
      <div className="space-y-3">
        
        <div className="flex items-center space-x-3">
          <Phone className="h-4 w-4 text-[#7d3600]" />
          <a
            href="https://wa.me/917520081717"  
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-[#7d3600]"
          >
            +91 75200 81717
          </a>
        </div>
        
        {/* Email: Link to Mail Client */}
        <div className="flex items-center space-x-3">
          <Mail className="h-4 w-4 text-[#7d3600]" />
          <a
            href="mailto:rakshittgupta@gmail.com" // Mailto link
            className="text-gray-300 hover:text-[#7d3600]"
          >
            rakshittgupta@gmail.com
          </a>
        </div>
        
        {/* Location: Simple Text */}
        <div className="flex items-center space-x-3">
          <MapPin className="h-4 w-4 text-[#7d3600]" />
          <span className="text-gray-300">Mumbai, India</span>
        </div>
      </div>
    </div>
              
              {/* Newsletter */}
              <div className="mt-6">
                <h5 className="font-semibold mb-2">Stay Updated</h5>
                <p className="text-sm text-gray-300 mb-3">Get the latest offers and health tips</p>
                <div className="flex flex-col gap-2">
                  <Input
                    placeholder="Enter your email"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                  <Button
                    className="bg-[#EDBC7E] hover:bg-[#d4a366] text-[#7d3600] font-semibold"
                  >
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-white/20 mt-8 pt-6">

            <div className="text-center">
              <p className="text-gray-300 text-sm">
                © 2024 <span className="text-[#EDBC7E] font-semibold">ANVEDA</span>. All rights reserved. |
                Crafted with 💛 for your health and wellness
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Premium A2 Ghee • Traditional Methods • Modern Quality
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;

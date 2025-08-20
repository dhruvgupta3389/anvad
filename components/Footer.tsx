import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, CheckCircle } from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/subscribe-newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(result.message || 'Successfully subscribed!');
        setEmail('');
        setTimeout(() => setSuccess(''), 5000);
      } else {
        setError(result.error || 'Failed to subscribe');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    }

    setLoading(false);
  };

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

      {/* Newsletter Signup Section */}
      <div className="bg-[#EDBC7E] py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <Mail className="h-8 w-8 text-[#7d3600] mr-3" />
            <h2 className="text-3xl font-bold text-[#7d3600]">Stay Connected with ANVEDA</h2>
          </div>
          <p className="text-[#7d3600] text-lg mb-8 max-w-2xl mx-auto">
            Get exclusive offers, health tips, traditional recipes, and be the first to know about our latest premium A2 ghee products!
          </p>
          
          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="h-12 text-base border-[#7d3600] focus-visible:ring-[#7d3600]"
                  disabled={loading}
                />
              </div>
              <Button
                type="submit"
                disabled={loading || !email}
                className="h-12 bg-[#7d3600] hover:bg-[#6d2f00] text-white font-semibold px-8"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Subscribing...
                  </div>
                ) : (
                  'Subscribe Now'
                )}
              </Button>
            </div>
            
            {success && (
              <div className="mt-4 bg-green-100 border border-green-300 rounded-lg p-3 flex items-center justify-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="text-green-800 font-medium">{success}</p>
              </div>
            )}
            
            {error && (
              <div className="mt-4 bg-red-100 border border-red-300 rounded-lg p-3">
                <p className="text-red-800">{error}</p>
              </div>
            )}
          </form>
          
          <div className="mt-6 flex flex-wrap justify-center items-center gap-6 text-sm text-[#7d3600]">
            <div className="flex items-center gap-1">
              <span>���</span>
              <span>Exclusive Offers</span>
            </div>
            <div className="flex items-center gap-1">
              <span>🥛</span>
              <span>Health Tips</span>
            </div>
            <div className="flex items-center gap-1">
              <span>👨‍🍳</span>
              <span>Traditional Recipes</span>
            </div>
            <div className="flex items-center gap-1">
              <span>📰</span>
              <span>Product Updates</span>
            </div>
          </div>
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
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <div className="space-y-3">
                
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-[#EDBC7E]" />
                  <a
                    href="https://wa.me/917520081717"  
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    +91 75200 81717
                  </a>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-[#EDBC7E]" />
                  <a
                    href="mailto:rakshittgupta@gmail.com"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    rakshittgupta@gmail.com
                  </a>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-[#EDBC7E]" />
                  <span className="text-gray-300">Mumbai, India</span>
                </div>
              </div>
              
              {/* Customer Support Hours */}
              <div className="mt-6">
                <h5 className="font-semibold mb-2">Support Hours</h5>
                <div className="text-sm text-gray-300 space-y-1">
                  <p>Mon - Sat: 9:00 AM - 8:00 PM</p>
                  <p>Sunday: 10:00 AM - 6:00 PM</p>
                  <p className="text-[#EDBC7E]">Response within 2-4 hours</p>
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

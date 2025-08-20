"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
} from "lucide-react";

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
                {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                  <Button key={i} variant="ghost" size="icon" className="text-white hover:text-[#7d3600] hover:bg-white">
                    <Icon className="h-5 w-5" />
                  </Button>
                ))}
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

            {/* Newsletter (Moved + Smaller) */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Subscribe to Newsletter</h4>
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="h-10 text-sm border-[#EDBC7E] focus-visible:ring-[#EDBC7E]"
                  disabled={loading}
                />
                <Button
                  type="submit"
                  disabled={loading || !email}
                  className="h-10 bg-[#EDBC7E] text-[#7d3600] hover:bg-white font-semibold w-full"
                >
                  {loading ? 'Subscribing...' : 'Subscribe'}
                </Button>

                {success && (
                  <div className="flex items-center gap-2 text-green-200 text-sm">
                    <CheckCircle className="h-4 w-4" />
                    <span>{success}</span>
                  </div>
                )}

                {error && (
                  <div className="text-red-200 text-sm">
                    {error}
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-[#EDBC7E]" />
              <a href="https://wa.me/917520081717" target="_blank" rel="noopener noreferrer">
                +91 75200 81717
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-[#EDBC7E]" />
              <a href="mailto:rakshittgupta@gmail.com">rakshittgupta@gmail.com</a>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#EDBC7E]" />
              <span>Mumbai, India</span>
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

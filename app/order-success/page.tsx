"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Package, Home, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const orderIdParam = searchParams.get('order_id');
    setOrderId(orderIdParam);
  }, [searchParams]);

  const handleContinueShopping = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#F9F1E6]">
      <Header hasAnnouncementBar={false} />
      
      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center">
          <Card className="bg-white shadow-lg">
            <CardContent className="p-8 space-y-6">
              {/* Success Icon */}
              <div className="flex justify-center">
                <div className="bg-green-100 rounded-full p-4">
                  <CheckCircle className="h-16 w-16 text-green-600" />
                </div>
              </div>

              {/* Success Message */}
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-800">
                  Order Placed Successfully! 🎉
                </h1>
                <p className="text-gray-600 text-lg">
                  Thank you for your purchase. Your order has been confirmed.
                </p>
              </div>

              {/* Order Details */}
              {orderId && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <h3 className="font-semibold text-gray-800">Order Details</h3>
                  <p className="text-sm text-gray-600">
                    <strong>Order ID:</strong> {orderId}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Status:</strong> Payment Successful
                  </p>
                </div>
              )}

              {/* What's Next */}
              <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-800">What's Next?</h3>
                </div>
                <div className="text-left space-y-2 text-sm text-gray-600">
                  <p>📧 You'll receive an order confirmation email shortly</p>
                  <p>📦 Your order will be processed within 1-2 business days</p>
                  <p>🚚 You'll get tracking details once your order ships</p>
                  <p>📞 Our team will contact you for any clarifications</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={handleContinueShopping}
                  className="bg-[#7d3600] hover:bg-[#6d2f00] text-white px-8 py-3"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => router.push('/products/a2-ghee')}
                  className="border-[#7d3600] text-[#7d3600] hover:bg-[#7d3600] hover:text-white px-8 py-3"
                >
                  View More Products
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>

              {/* Support Message */}
              <div className="border-t pt-6">
                <p className="text-sm text-gray-500">
                  Need help? Contact us at{' '}
                  <a href="mailto:support@anveda.com" className="text-[#7d3600] hover:underline">
                    support@anveda.com
                  </a>{' '}
                  or call{' '}
                  <a href="tel:+911234567890" className="text-[#7d3600] hover:underline">
                    +91 123 456 7890
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}

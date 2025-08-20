"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabaseClient';
import PaymentForm from '@/components/PaymentForm';

export default function Cart() {
  const router = useRouter();
  const { state, removeFromCart, updateQuantity, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  // ✅ Supabase connection check
  useEffect(() => {
    const testConnection = async () => {
      const { error } = await supabase.from('products').select('id').limit(1);
      if (!error) {
        console.log('✅ Supabase connected!');
      } else {
        console.error('❌ Supabase connection failed:', error.message);
      }
    };
    testConnection();
  }, []);

  const handleCheckout = async () => {
    setIsProcessing(true);

    try {
      for (const item of state.items) {
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('id')
          .eq('id', item.product.id)
          .single();

        if (productError || !productData) {
          alert(`❌ Product "${item.product.name}" is no longer available.`);
          setIsProcessing(false);
          return;
        }

        const { data: variantData, error: variantError } = await supabase
          .from('variants')
          .select('price, original_price, in_stock')
          .eq('id', item.variant.id)
          .eq('product_id', item.product.id)
          .single();

        if (variantError || !variantData) {
          alert(`❌ Variant "${item.variant.quantity}" for ${item.product.name} is missing.`);
          setIsProcessing(false);
          return;
        }

        if (variantData.price !== item.variant.price) {
          alert(`⚠️ Price for "${item.product.name}" (${item.variant.quantity}) has changed.`);
          setIsProcessing(false);
          return;
        }

        if (!variantData.in_stock) {
          alert(`❌ "${item.product.name}" (${item.variant.quantity}) is out of stock.`);
          setIsProcessing(false);
          return;
        }
      }

      // ✅ Verified — show Payment Form
      setShowPaymentForm(true);

    } catch (err) {
      console.error('Checkout error:', err);
      alert('❌ Something went wrong during checkout.');
    }

    setIsProcessing(false);
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F9F1E6]">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center animate-fade-in">
            <ShoppingBag className="h-24 w-24 text-gray-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Add some delicious A2 Ghee products to get started!</p>
            <Button
              onClick={() => router.push('/')}
              className="bg-[#5D4733] hover:bg-[#7A3E2F] text-white px-8 py-3 rounded-full"
            >
              Continue Shopping
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`relative min-h-screen bg-[#F9F1E6] ${showPaymentForm ? 'overflow-hidden' : ''}`}>
      <Header />

      <main className={`max-w-7xl mx-auto px-4 py-8 ${showPaymentForm ? 'blur-sm pointer-events-none select-none' : ''}`}>
        {/* ✅ MAIN CART */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.push('/')}
              className="text-[#5D4733] hover:bg-[#5D4733]/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
            <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
          </div>

          <Button
            variant="outline"
            onClick={clearCart}
            className="text-red-600 border-red-600 hover:bg-red-50 w-full sm:w-auto"
          >
            Clear Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {state.items.map((item) => (
              <Card key={`${item.product.id}-${item.variant.id}`} className="animate-fade-in hover-lift">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-800">{item.product.name}</h3>
                      <p className="text-gray-600">{item.quantity} x {item.variant.quantity}</p>
                      <p className="text-[#5D4733] font-bold text-lg">₹{item.variant.price}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.product.id, item.variant.id, item.quantity - 1)}
                        className="border-[#5D4733] text-[#5D4733] hover:bg-[#5D4733] hover:text-white"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-lg font-semibold w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.product.id, item.variant.id, item.quantity + 1)}
                        className="border-[#5D4733] text-[#5D4733] hover:bg-[#5D4733] hover:text-white"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="text-right mt-2 sm:mt-0">
                      <p className="text-lg font-bold text-gray-800">₹{item.variant.price * item.quantity}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.product.id, item.variant.id)}
                        className="text-red-600 hover:bg-red-50 mt-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-4">
            <Card className="lg:sticky top-4 animate-fade-in w-full">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Items ({state.itemCount})</span>
                    <span className="font-semibold">₹{state.total}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold">Total</span>
                      <span className="text-lg font-bold text-[#5D4733]">₹{state.total}</span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full bg-[#5D4733] hover:bg-[#7A3E2F] text-white py-3 rounded-full transition-all duration-300 transform hover:scale-105"
                >
                  {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
                </Button>
                <div className="mt-4 text-center text-sm text-gray-500">
                  <p>🔒 Secure checkout</p>
                  <p>📦 Free delivery on all orders</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* ✅ Payment Form Modal */}
      {showPaymentForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <PaymentForm cartItems={state.items} />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

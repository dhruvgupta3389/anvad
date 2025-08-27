import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { CheckCircle, Mail, Phone, MapPin, User, Shield, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PaymentFormProps {
  cartItems: any[];
}

const PaymentForm: React.FC<PaymentFormProps> = ({ cartItems }) => {
  const router = useRouter();
  const { clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    otp: ''
  });
  const [showOtp, setShowOtp] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState({
    sendingOtp: false,
    verifyingOtp: false,
    placingOrder: false
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState('');

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const validatePhone = (value: string) => /^[+]?[\d\s\-()]{7,15}$/.test(value);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSendOtp = async () => {
    if (!validateEmail(formData.email)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
      return;
    }

    setLoading(prev => ({ ...prev, sendingOtp: true }));
    
    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });

      const result = await response.json();

      if (response.ok) {
        setShowOtp(true);
        setSuccess('OTP sent successfully! Please check your email.');
        setTimeout(() => setSuccess(''), 5000);
      } else {
        setErrors(prev => ({ ...prev, email: result.error || 'Failed to send OTP' }));
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, email: 'Network error. Please try again.' }));
    }

    setLoading(prev => ({ ...prev, sendingOtp: false }));
  };

  const handleVerifyOtp = async () => {
    if (!formData.otp || formData.otp.length !== 6) {
      setErrors(prev => ({ ...prev, otp: 'Please enter a valid 6-digit OTP' }));
      return;
    }

    setLoading(prev => ({ ...prev, verifyingOtp: true }));

    try {
      const { data, error } = await supabase
        .from('otps')
        .select('*')
        .eq('email', formData.email)
        .eq('code', formData.otp)
        .gte('created_at', new Date(Date.now() - 10 * 60 * 1000).toISOString())
        .single();

      if (error || !data) {
        setErrors(prev => ({ ...prev, otp: 'Invalid or expired OTP' }));
      } else {
        await supabase.from('otps').delete().eq('id', data.id);
        setIsVerified(true);
        setSuccess('Email verified successfully!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, otp: 'Verification failed. Please try again.' }));
    }

    setLoading(prev => ({ ...prev, verifyingOtp: false }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Test database connection
    try {
      const { data, error } = await supabase.from('orders').select('id').limit(1);
      if (error) {
        console.error('Database connection test failed:', error);
        throw new Error('Database connection failed');
      }
    } catch (error) {
      console.error('Connection test error:', error);
      throw new Error('Database connection failed');
    }
    
    const newErrors: typeof errors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!validateEmail(formData.email)) newErrors.email = 'Valid email is required';
    if (!validatePhone(formData.phone)) newErrors.phone = 'Valid phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!isVerified) newErrors.otp = 'Please verify your email before placing order';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(prev => ({ ...prev, placingOrder: true }));

    try {
      const simplifiedCartItems = cartItems.map((item) => ({
        product_id: item.product.id,
        product_name: item.product.name,
        variant_id: item.variant.id,
        variant_quantity: item.variant.quantity,
        unit_price: item.variant.price,
        quantity: item.quantity,
        total_price: item.variant.price * item.quantity,
      }));

      const totalPrice = simplifiedCartItems.reduce((sum, item) => sum + item.total_price, 0);

      // Create a complete cart snapshot
      const cartSnapshot = cartItems.map((item) => ({
        product: {
          id: item.product.id,
          name: item.product.name,
          description: item.product.description,
          category: item.product.category,
          images: item.product.images,
          price: item.product.price,
          // Include any other product fields that exist
        },
        variant: {
          id: item.variant.id,
          quantity: item.variant.quantity,
          price: item.variant.price,
          // Include any other variant fields that exist
        },
        quantity: item.quantity,
        total_price: item.variant.price * item.quantity,
      }));

      // Save order to database
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          product_details: simplifiedCartItems,
          total_price: totalPrice,
          amount_paisa: Math.round(totalPrice * 100), // Convert rupees to paisa
          cart_snapshot: cartSnapshot, // Add the complete cart snapshot
        })
        .select('id')
        .single();

      if (orderError) {
        console.error('Order insertion error:', orderError);
        throw new Error(`Failed to save order: ${orderError.message}`);
      }

      // Send order confirmation email
      const emailResponse = await fetch('/api/send-order-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          orderId: orderData.id,
          items: simplifiedCartItems,
          totalPrice,
          address: formData.address,
          phone: formData.phone,
        }),
      });

      if (!emailResponse.ok) {
        console.warn('Order confirmation email failed to send');
      }

      // Clear cart and show success
      clearCart();
      setSuccess('🎉 Order placed successfully! Check your email for confirmation.');
      
      // Redirect to home after 3 seconds
      setTimeout(() => {
        router.push('/');
      }, 3000);

    } catch (error) {
      console.error('Order placement error:', error);
      setErrors(prev => ({ ...prev, submit: 'Failed to place order. Please try again.' }));
    }

    setLoading(prev => ({ ...prev, placingOrder: false }));
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.variant.price * item.quantity), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <CardHeader className="relative pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Shield className="h-6 w-6 text-[#7d3600]" />
              Secure Checkout
            </CardTitle>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => window.location.reload()}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-gray-600">Complete your order securely</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Success/Error Messages */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <p className="text-green-800">{success}</p>
            </div>
          )}

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{errors.submit}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">Full Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                    className={errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}
                    autoComplete="name"
                  />
                  {errors.name && <p className="text-red-600 text-xs">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+91 1234567890"
                      className={`pl-10 ${errors.phone ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      autoComplete="tel"
                    />
                  </div>
                  {errors.phone && <p className="text-red-600 text-xs">{errors.phone}</p>}
                </div>
              </div>
            </div>

            {/* Email Verification */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Verification
              </h3>
              
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email Address *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="your.email@example.com"
                        className={`pl-10 ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                        autoComplete="email"
                        disabled={isVerified}
                      />
                      {isVerified && (
                        <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-600" />
                      )}
                    </div>
                    {errors.email && <p className="text-red-600 text-xs">{errors.email}</p>}
                  </div>
                  
                  <div className="flex items-end">
                    <Button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={loading.sendingOtp || isVerified || !formData.email}
                      className="bg-[#7d3600] hover:bg-[#6d2f00] px-6"
                    >
                      {loading.sendingOtp ? 'Sending...' : isVerified ? 'Verified' : 'Send OTP'}
                    </Button>
                  </div>
                </div>

                {showOtp && !isVerified && (
                  <div className="flex gap-2">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="otp" className="text-sm font-medium">Enter OTP *</Label>
                      <Input
                        id="otp"
                        type="text"
                        value={formData.otp}
                        onChange={(e) => handleInputChange('otp', e.target.value)}
                        placeholder="123456"
                        maxLength={6}
                        className={errors.otp ? 'border-red-500 focus-visible:ring-red-500' : ''}
                        autoComplete="one-time-code"
                      />
                      {errors.otp && <p className="text-red-600 text-xs">{errors.otp}</p>}
                    </div>
                    
                    <div className="flex items-end">
                      <Button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={loading.verifyingOtp || !formData.otp}
                        variant="outline"
                        className="px-6"
                      >
                        {loading.verifyingOtp ? 'Verifying...' : 'Verify'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Delivery Address
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium">Complete Address *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter your complete address including street, city, state, and postal code"
                  className={`min-h-[100px] ${errors.address ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  autoComplete="street-address"
                />
                {errors.address && <p className="text-red-600 text-xs">{errors.address}</p>}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-gray-800">Order Summary</h4>
              <div className="space-y-2">
                {cartItems.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.product.name} ({item.variant.quantity}) x {item.quantity}</span>
                    <span>₹{item.variant.price * item.quantity}</span>
                  </div>
                ))}
                {cartItems.length > 3 && (
                  <div className="text-sm text-gray-600">+ {cartItems.length - 3} more items</div>
                )}
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total Amount:</span>
                <span className="text-[#7d3600]">₹{totalAmount}</span>
              </div>
            </div>

            {/* Place Order Button */}
            <Button
              type="submit"
              disabled={!isVerified || loading.placingOrder}
              className="w-full bg-[#7d3600] hover:bg-[#6d2f00] text-white py-3 text-lg font-semibold"
            >
              {loading.placingOrder ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing Order...
                </div>
              ) : (
                `Place Order - ₹${totalAmount}`
              )}
            </Button>

            {/* Security Notice */}
            <div className="text-center text-sm text-gray-500 space-y-1">
              <p className="flex items-center justify-center gap-1">
                🔒 Your information is secure and encrypted
              </p>
              <p>📦 Free delivery on all orders • 💯 100% authentic products</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentForm;

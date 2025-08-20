import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface PaymentFormProps {
  cartItems: any[];
}

const PaymentForm: React.FC<PaymentFormProps> = ({ cartItems }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const validatePhone = (value: string) => /^\+?\d{7,15}$/.test(value);

  // Autofill for development/testing (optional)
  useEffect(() => {
    const autofill = async () => {
      const user = await supabase.auth.getUser();
      if (user?.data?.user) {
        setEmail(user.data.user.email || '');
      }
    };
    autofill();
  }, []);

  const handleSendOtp = async () => {
    if (!validateEmail(email)) {
      setErrors((prev) => ({ ...prev, email: 'Enter a valid email to get OTP.' }));
      return;
    }
    setIsSending(true);
    setShowOtp(true);

    await supabase.from('otps').delete().eq('email', email);

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const { error } = await supabase.from('otps').insert({ email, code });

    if (error) {
      console.error(error);
      alert('Error sending OTP. Try again.');
    } else {
      alert(`✅ OTP sent! (Dev: ${code})`);
    }
    setIsSending(false);
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      alert('Enter OTP first.');
      return;
    }

    setIsVerifying(true);

    const { data, error } = await supabase
      .from('otps')
      .select('*')
      .eq('email', email)
      .eq('code', otp)
      .gte('created_at', new Date(Date.now() - 10 * 60 * 1000).toISOString())
      .single();

    if (error || !data) {
      alert('❌ Invalid/Expired OTP.');
    } else {
      await supabase.from('otps').delete().eq('id', data.id);
      setIsVerified(true);
      alert('✅ Email verified!');
    }

    setIsVerifying(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!name.trim()) newErrors.name = 'Name is required.';
    if (!validateEmail(email)) newErrors.email = 'Invalid email.';
    if (!validatePhone(phone)) newErrors.phone = 'Invalid phone.';
    if (!address.trim()) newErrors.address = 'Address required.';
    if (!isVerified) newErrors.otp = 'Please verify email before order.';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
const simplifiedCartItems = cartItems.map((item) => ({
  product_id: item.product.id,
  product_name: item.product.name,
  variant_id: item.variant.id,
  variant_quantity: item.variant.quantity,
  unit_price: item.variant.price,
  quantity: item.quantity,
  total_price: item.variant.price * item.quantity,
}));

    const { error } = await supabase.from('orders').insert({
      name,
  email,
  phone,
  address,
  product_details: simplifiedCartItems,
  total_price: simplifiedCartItems.reduce((sum, item) => sum + item.total_price, 0),
    });


    if (error) {
      console.error(error);
      alert('❌ Failed to place order.');
    } else {
      alert('✅ Order placed & saved!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f5ef] px-4 sm:px-2">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white shadow-md rounded-lg p-6 space-y-4"
        autoComplete="on"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Checkout</h2>

        {/* Name */}
        <div className="flex flex-col">
          <label className="text-sm mb-1">Full Name</label>
          <input
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`border rounded px-3 py-2 focus:ring text-sm ${
              errors.name ? 'border-red-500' : 'border-gray-300 focus:ring-[#2f7a4d]'
            }`}
            placeholder="John Doe"
          />
          {errors.name && <p className="text-red-600 text-xs">{errors.name}</p>}
        </div>

        {/* Email & OTP */}
        <div className="flex flex-col">
          <label className="text-sm mb-1">Email</label>
          <div className="flex gap-2 flex-col sm:flex-row">
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`flex-1 border rounded px-3 py-2 focus:ring text-sm ${
                errors.email ? 'border-red-500' : 'border-gray-300 focus:ring-[#2f7a4d]'
              }`}
              placeholder="john@example.com"
            />
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={isSending}
              className="bg-[#2f7a4d] text-white px-4 py-2 rounded hover:bg-[#245a3a] text-sm"
            >
              {isSending ? 'Sending...' : 'Send OTP'}
            </button>
          </div>
          {errors.email && <p className="text-red-600 text-xs">{errors.email}</p>}
        </div>

        {/* OTP */}
        {showOtp && (
          <div className="flex flex-col">
            <label className="text-sm mb-1">OTP</label>
            <div className="flex gap-2 flex-col sm:flex-row">
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-[#2f7a4d] text-sm"
              />
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={isVerified || isVerifying}
                className="bg-[#2f7a4d] text-white px-4 py-2 rounded hover:bg-[#245a3a] text-sm"
              >
                {isVerified ? 'Verified' : isVerifying ? 'Verifying...' : 'Verify'}
              </button>
            </div>
            {errors.otp && <p className="text-red-600 text-xs">{errors.otp}</p>}
          </div>
        )}

        {/* Phone */}
        <div className="flex flex-col">
          <label className="text-sm mb-1">Phone</label>
          <input
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={`border rounded px-3 py-2 focus:ring text-sm ${
              errors.phone ? 'border-red-500' : 'border-gray-300 focus:ring-[#2f7a4d]'
            }`}
            placeholder="+91 1234567890"
          />
          {errors.phone && <p className="text-red-600 text-xs">{errors.phone}</p>}
        </div>

        {/* Address */}
        <div className="flex flex-col">
          <label className="text-sm mb-1">Address</label>
          <textarea
            autoComplete="street-address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className={`border rounded px-3 py-2 focus:ring text-sm ${
              errors.address ? 'border-red-500' : 'border-gray-300 focus:ring-[#2f7a4d]'
            }`}
            placeholder="Street, City, State, Postal Code"
          />
          {errors.address && <p className="text-red-600 text-xs">{errors.address}</p>}
        </div>

                <button
          type="submit"
          className="w-full bg-[#2f7a4d] text-white py-3 rounded-md font-semibold hover:bg-[#245a3a] transition-all text-sm"
        >
          Place Order
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;

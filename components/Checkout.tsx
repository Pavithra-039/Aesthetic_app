import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, CreditCard, Truck, ShieldCheck } from 'lucide-react';
import { CartItem } from '../types';

interface CheckoutProps {
  items: CartItem[];
  onBack: () => void;
  onComplete: (details: BuyingDetails) => void;
}

export interface BuyingDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  paymentMethod: 'cod' | 'online' | 'upi';
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
  upiId?: string;
  upiApp?: 'gpay' | 'paytm' | 'phonepe' | 'other';
}

export default function Checkout({ items, onBack, onComplete }: CheckoutProps) {
  const [details, setDetails] = useState<BuyingDetails>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    paymentMethod: 'cod',
    cardNumber: '',
    expiry: '',
    cvv: '',
    upiId: '',
    upiApp: 'gpay',
  });

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(details);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDetails(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-brand-cream pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16">
        {/* Left Side: Form */}
        <div className="space-y-12">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-sm uppercase tracking-widest font-bold hover:text-brand-clay transition-colors"
          >
            <ChevronLeft size={16} />
            Back to Bag
          </button>

          <div className="space-y-4">
            <h2 className="text-4xl font-serif">Checkout</h2>
            <p className="text-brand-ink/60">Please provide your shipping details and select a payment method.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-xl font-serif border-b border-brand-ink/10 pb-2 flex items-center gap-2">
                <Truck size={20} className="text-brand-clay" />
                Shipping Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-brand-ink/40">Full Name</label>
                  <input 
                    required
                    name="fullName"
                    value={details.fullName}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-brand-ink/20 py-2 focus:border-brand-clay outline-none transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-brand-ink/40">Email Address</label>
                  <input 
                    required
                    type="email"
                    name="email"
                    value={details.email}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-brand-ink/20 py-2 focus:border-brand-clay outline-none transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-brand-ink/40">Phone Number</label>
                  <input 
                    required
                    type="tel"
                    name="phone"
                    value={details.phone}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-brand-ink/20 py-2 focus:border-brand-clay outline-none transition-colors"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-brand-ink/40">Shipping Address</label>
                  <input 
                    required
                    name="address"
                    value={details.address}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-brand-ink/20 py-2 focus:border-brand-clay outline-none transition-colors"
                    placeholder="123 Serenity Lane"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-brand-ink/40">City</label>
                  <input 
                    required
                    name="city"
                    value={details.city}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-brand-ink/20 py-2 focus:border-brand-clay outline-none transition-colors"
                    placeholder="San Francisco"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-brand-ink/40">ZIP Code</label>
                  <input 
                    required
                    name="zipCode"
                    value={details.zipCode}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-brand-ink/20 py-2 focus:border-brand-clay outline-none transition-colors"
                    placeholder="94103"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-serif border-b border-brand-ink/10 pb-2 flex items-center gap-2">
                <CreditCard size={20} className="text-brand-clay" />
                Payment Method
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setDetails(prev => ({ ...prev, paymentMethod: 'cod' }))}
                  className={`p-6 rounded-2xl border transition-all duration-300 text-left space-y-2 ${
                    details.paymentMethod === 'cod' 
                      ? 'border-brand-clay bg-brand-clay/5 ring-1 ring-brand-clay' 
                      : 'border-brand-ink/10 bg-transparent hover:border-brand-ink/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Truck size={20} className={details.paymentMethod === 'cod' ? 'text-brand-clay' : 'text-brand-ink/40'} />
                    {details.paymentMethod === 'cod' && <div className="w-2 h-2 rounded-full bg-brand-clay" />}
                  </div>
                  <div>
                    <h4 className="font-serif">Cash on Delivery</h4>
                    <p className="text-[10px] text-brand-ink/40 uppercase tracking-widest font-bold">Pay at your door</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDetails(prev => ({ ...prev, paymentMethod: 'online' }))}
                  className={`p-6 rounded-2xl border transition-all duration-300 text-left space-y-2 ${
                    details.paymentMethod === 'online' 
                      ? 'border-brand-clay bg-brand-clay/5 ring-1 ring-brand-clay' 
                      : 'border-brand-ink/10 bg-transparent hover:border-brand-ink/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <CreditCard size={20} className={details.paymentMethod === 'online' ? 'text-brand-clay' : 'text-brand-ink/40'} />
                    {details.paymentMethod === 'online' && <div className="w-2 h-2 rounded-full bg-brand-clay" />}
                  </div>
                  <div>
                    <h4 className="font-serif">Online</h4>
                    <p className="text-[10px] text-brand-ink/40 uppercase tracking-widest font-bold">Secure Card</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDetails(prev => ({ ...prev, paymentMethod: 'upi' }))}
                  className={`p-6 rounded-2xl border transition-all duration-300 text-left space-y-2 ${
                    details.paymentMethod === 'upi' 
                      ? 'border-brand-clay bg-brand-clay/5 ring-1 ring-brand-clay' 
                      : 'border-brand-ink/10 bg-transparent hover:border-brand-ink/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-xl font-bold italic text-brand-clay">UPI</div>
                    {details.paymentMethod === 'upi' && <div className="w-2 h-2 rounded-full bg-brand-clay" />}
                  </div>
                  <div>
                    <h4 className="font-serif">UPI Payment</h4>
                    <p className="text-[10px] text-brand-ink/40 uppercase tracking-widest font-bold">Instant Transfer</p>
                  </div>
                </button>
              </div>

              {details.paymentMethod === 'cod' && (
                <div className="bg-brand-sand/20 p-6 rounded-2xl border border-brand-ink/5">
                  <p className="text-sm text-brand-ink/60 leading-relaxed">
                    Please ensure someone is available at the shipping address to receive the package and provide payment.
                  </p>
                </div>
              )}

              {details.paymentMethod === 'online' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4"
                >
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold text-brand-ink/40">Card Number</label>
                    <input 
                      required={details.paymentMethod === 'online'}
                      name="cardNumber"
                      value={details.cardNumber}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b border-brand-ink/20 py-2 focus:border-brand-clay outline-none transition-colors"
                      placeholder="0000 0000 0000 0000"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold text-brand-ink/40">Expiry Date</label>
                    <input 
                      required={details.paymentMethod === 'online'}
                      name="expiry"
                      value={details.expiry}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b border-brand-ink/20 py-2 focus:border-brand-clay outline-none transition-colors"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold text-brand-ink/40">CVV</label>
                    <input 
                      required={details.paymentMethod === 'online'}
                      name="cvv"
                      value={details.cvv}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b border-brand-ink/20 py-2 focus:border-brand-clay outline-none transition-colors"
                      placeholder="123"
                    />
                  </div>
                </motion.div>
              )}

              {details.paymentMethod === 'upi' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6 pt-4"
                >
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'gpay', label: 'GPay', color: 'bg-[#4285F4]' },
                      { id: 'paytm', label: 'Paytm', color: 'bg-[#00BAF2]' },
                      { id: 'phonepe', label: 'PhonePe', color: 'bg-[#5f259f]' },
                    ].map((app) => (
                      <button
                        key={app.id}
                        type="button"
                        onClick={() => setDetails(prev => ({ ...prev, upiApp: app.id as any }))}
                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                          details.upiApp === app.id 
                            ? 'border-brand-clay bg-brand-clay/5' 
                            : 'border-brand-ink/5 bg-white hover:border-brand-ink/20'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg ${app.color} flex items-center justify-center text-white font-bold text-[10px]`}>
                          {app.label}
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest">{app.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold text-brand-ink/40">
                      {details.upiApp === 'other' ? 'UPI ID' : `${details.upiApp?.toUpperCase()} ID`}
                    </label>
                    <input 
                      required={details.paymentMethod === 'upi'}
                      name="upiId"
                      value={details.upiId}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b border-brand-ink/20 py-2 focus:border-brand-clay outline-none transition-colors"
                      placeholder="username@bank"
                    />
                  </div>
                  <p className="text-xs text-brand-ink/40 italic">
                    You will be redirected to your {details.upiApp} app to complete the payment.
                  </p>
                </motion.div>
              )}
            </div>

            <button 
              type="submit"
              className="w-full bg-brand-ink text-brand-cream py-5 rounded-full font-bold hover:bg-brand-sage transition-all duration-300 shadow-xl hover:shadow-brand-sage/20 flex items-center justify-center gap-3"
            >
              {details.paymentMethod === 'cod' ? 'Place Order' : details.paymentMethod === 'upi' ? 'Pay with UPI' : 'Complete Purchase'} — ${total}
            </button>

            <div className="flex items-center justify-center gap-2 text-brand-ink/40 text-xs uppercase tracking-widest font-bold">
              <ShieldCheck size={14} />
              Secure Checkout
            </div>
          </form>
        </div>

        {/* Right Side: Summary */}
        <div className="bg-brand-sand/30 rounded-3xl p-8 lg:p-12 h-fit space-y-8">
          <h3 className="text-2xl font-serif">Order Summary</h3>
          <div className="space-y-6">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="w-16 h-20 bg-brand-sand rounded-lg overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1">
                  <h4 className="font-serif leading-tight">{item.name}</h4>
                  <p className="text-sm text-brand-ink/40">Qty: {item.quantity}</p>
                </div>
                <span className="font-serif">${item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-brand-ink/10 space-y-4">
            <div className="flex justify-between text-sm text-brand-ink/60">
              <span>Subtotal</span>
              <span>${total}</span>
            </div>
            <div className="flex justify-between text-sm text-brand-ink/60">
              <span>Shipping</span>
              <span className="text-brand-sage font-bold uppercase tracking-widest text-[10px]">Free</span>
            </div>
            <div className="flex justify-between text-sm text-brand-ink/60">
              <span>Order Type</span>
              <span className="font-medium">
                {details.paymentMethod === 'cod' 
                  ? 'Cash on Delivery' 
                  : details.paymentMethod === 'upi' 
                    ? `UPI (${details.upiApp === 'gpay' ? 'Google Pay' : details.upiApp === 'paytm' ? 'Paytm' : 'PhonePe'})` 
                    : 'Online Transaction'}
              </span>
            </div>
            <div className="flex justify-between text-2xl font-serif pt-4 border-t border-brand-ink/5">
              <span>Total</span>
              <span>${total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

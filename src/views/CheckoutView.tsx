import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  QrCode, 
  Building2, 
  Banknote, 
  ArrowLeft, 
  CheckCircle2, 
  Lock, 
  MapPin, 
  Phone, 
  User, 
  AlertCircle,
  Copy,
  Check,
  PackageCheck,
  Printer
} from 'lucide-react';
import { BookImage } from '../components/BookImage';
import { HardCopyOrder } from '../types';
import confetti from 'canvas-confetti';

export const CheckoutView: React.FC = () => {
  const { 
    cart, 
    cartSubtotal, 
    cartCount, 
    user, 
    placeOrder, 
    setCurrentView,
    setPortalMode,
    showToast 
  } = useApp();

  // Address state initialized with user info
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [street, setStreet] = useState(user?.address?.street || '');
  const [city, setCity] = useState(user?.address?.city || '');
  const [state, setState] = useState(user?.address?.state || '');
  const [pinCode, setPinCode] = useState(user?.address?.pinCode || '');
  const [landmark, setLandmark] = useState(user?.address?.landmark || '');
  const [deliverySpeed, setDeliverySpeed] = useState<'standard' | 'express'>('standard');

  // Razorpay Gateway Modal State
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);
  const [activePaymentMethod, setActivePaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'cod'>('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [selectedBank, setSelectedBank] = useState('SBI');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'idle' | 'processing' | 'success'>('idle');

  // Confirmed Order
  const [confirmedOrder, setConfirmedOrder] = useState<HardCopyOrder | null>(null);

  // Financial calculations
  const shippingFee = cartSubtotal >= 499 ? 0 : 50;
  const expressFee = deliverySpeed === 'express' ? 40 : 0;
  const totalAmount = cartSubtotal + shippingFee + expressFee;

  if (cart.length === 0 && !confirmedOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
          <Truck className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 font-display">Your BooksBoon Cart is Empty</h2>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          Explore our wide collection of hard copy books, magazines, and exam guides to start your preparation.
        </p>
        <button
          onClick={() => {
            setPortalMode('booksboon');
            setCurrentView('product');
          }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse BooksBoon Hard Copy Catalog</span>
        </button>
      </div>
    );
  }

  // Handle address submit & open Razorpay
  const handleProceedToRazorpay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !street.trim() || !city.trim() || !pinCode.trim()) {
      showToast('Please fill in complete delivery address details', 'error');
      return;
    }
    if (pinCode.length < 6) {
      showToast('Please enter a valid 6-digit Indian PIN code', 'error');
      return;
    }
    setShowRazorpayModal(true);
    setPaymentStep('idle');
  };

  // Simulate Razorpay Gateway Transaction
  const handleCompleteRazorpayPayment = async () => {
    setIsProcessingPayment(true);
    setPaymentStep('processing');

    // Simulate 1.8s realistic bank authentication
    setTimeout(async () => {
      setIsProcessingPayment(false);
      setPaymentStep('success');

      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.warn('Confetti error:', err);
      }

      const generatedOrderId = `BB-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      const trackingNumber = `IP-EXP-2026-${Math.floor(1000 + Math.random() * 9000)}IN`;
      const paymentId = activePaymentMethod === 'cod' ? 'COD_PENDING' : `pay_rzp_${Date.now().toString(36)}`;

      const newOrder: HardCopyOrder = {
        orderId: generatedOrderId,
        trackingId: trackingNumber,
        createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        studentEmail: user?.email || 'shukla.mohit52@gmail.com',
        studentName: fullName,
        phone,
        address: {
          street,
          city,
          state,
          pinCode,
          landmark
        },
        items: cart.map(item => ({
          bookId: item.book.id,
          title: item.book.title,
          format: item.format,
          quantity: item.quantity,
          price: item.format === 'Paperback' ? item.book.paperbackPrice : (item.format === 'Magazine' ? item.book.paperbackPrice : Math.round(item.book.paperbackPrice * 0.45)),
          coverImage: item.book.bannerImage
        })),
        subtotal: cartSubtotal,
        shippingFee: shippingFee + expressFee,
        totalAmount,
        paymentMethod: activePaymentMethod === 'upi' ? 'UPI' : (activePaymentMethod === 'card' ? 'Card' : (activePaymentMethod === 'cod' ? 'COD' : 'Razorpay')),
        paymentId,
        paymentStatus: activePaymentMethod === 'cod' ? 'Pending' : 'Paid',
        shippingStatus: 'Processing',
        courierPartner: deliverySpeed === 'express' ? 'Bluedart Express Courier' : 'India Post Speed Post',
        estimatedDelivery: new Date(Date.now() + 4 * 86400000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      };

      await placeOrder(newOrder);
      setConfirmedOrder(newOrder);
      setShowRazorpayModal(false);
    }, 1800);
  };

  // Order Confirmed Screen
  if (confirmedOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 animate-fadeIn">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-8 text-center space-y-3">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl mx-auto flex items-center justify-center border border-white/20 shadow-inner">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Order Confirmed & Placed!
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-md mx-auto">
              Thank you for ordering with BooksBoon.com. Your physical hard copies are being packaged with waterproof protective cushioning.
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Tracking Badge */}
            <div className="bg-slate-50 rounded-2xl p-4 sm:p-6 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Order ID</span>
                <span className="text-lg font-black text-slate-900 font-mono">{confirmedOrder.orderId}</span>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Tracking ID (India Post / Courier)</span>
                <span className="text-base font-bold text-indigo-700 font-mono bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-200 block sm:inline-block">
                  {confirmedOrder.trackingId}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Estimated Delivery</span>
                <span className="text-sm font-bold text-emerald-700">{confirmedOrder.estimatedDelivery}</span>
              </div>
            </div>

            {/* Delivery Steps visualizer */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Delivery Progress</h3>
              <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 font-bold text-emerald-800">
                  <PackageCheck className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                  1. Order Placed
                </div>
                <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200 font-semibold text-indigo-800">
                  <div className="w-2 h-2 rounded-full bg-indigo-600 mx-auto mb-2 animate-ping" />
                  2. Packaging
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-400">
                  3. Dispatched
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-400">
                  4. Delivered
                </div>
              </div>
            </div>

            {/* Items summary */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Ordered Hard Copies</h3>
              <div className="space-y-3">
                {confirmedOrder.items.map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-14 rounded overflow-hidden shrink-0 bg-slate-200">
                        {it.coverImage ? (
                          <img src={it.coverImage} alt={it.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[9px] text-slate-400">Book</div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 line-clamp-1">{it.title}</h4>
                        <span className="text-slate-500 text-[11px]">Format: {it.format} • Qty: {it.quantity}</span>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900">₹{it.price * it.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Address summary */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <span className="font-bold text-slate-800 block">Shipping To:</span>
              <p className="text-slate-700 font-medium">{confirmedOrder.studentName} ({confirmedOrder.phone})</p>
              <p className="text-slate-600">{confirmedOrder.address.street}, {confirmedOrder.address.landmark ? `${confirmedOrder.address.landmark}, ` : ''}{confirmedOrder.address.city}, {confirmedOrder.address.state} - {confirmedOrder.address.pinCode}</p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-slate-200">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Tax Invoice</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setCurrentView('student-dashboard');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold hover:bg-indigo-100 cursor-pointer"
                >
                  View in Student Dashboard
                </button>

                <button
                  onClick={() => {
                    setPortalMode('booksboon');
                    setCurrentView('product');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Breadcrumb / Top Bar */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
        <button
          onClick={() => setCurrentView('cart')}
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Cart</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Razorpay 256-bit Encrypted Checkout</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form: Delivery Address */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Hard Copy Delivery Address</h2>
                <p className="text-xs text-slate-500">Provide complete postal address for swift courier dispatch via India Post</p>
              </div>
            </div>

            <form onSubmit={handleProceedToRazorpay} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Student / Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Mohit Shukla"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone / WhatsApp Number (For Courier OTP) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 97737 40485"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Street Address (House No, Ward, Street, Area) *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <textarea
                    required
                    rows={2}
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Ward No 24, Near Nehru Park, Chawani"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    PIN Code (6 Digits) *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="332713"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City / District *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Neem Ka Thana"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Rajasthan"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nearby Landmark (Optional)
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Opposite State Bank Branch"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              {/* Delivery Speed selection */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Shipping Partner & Speed
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDeliverySpeed('standard')}
                    className={`p-3 rounded-xl border text-left flex items-start justify-between cursor-pointer ${
                      deliverySpeed === 'standard'
                        ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-indigo-600" />
                        <span>India Post Speed Post</span>
                      </div>
                      <span className="text-[11px] text-slate-500 block mt-0.5">3-5 Business Days Delivery</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-700">
                      {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliverySpeed('express')}
                    className={`p-3 rounded-xl border text-left flex items-start justify-between cursor-pointer ${
                      deliverySpeed === 'express'
                        ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-amber-600" />
                        <span>Bluedart Air Express</span>
                      </div>
                      <span className="text-[11px] text-slate-500 block mt-0.5">1-2 Days Priority Dispatch</span>
                    </div>
                    <span className="text-xs font-bold text-slate-900">+₹40</span>
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Proceed to Pay ₹{totalAmount} with Razorpay</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Summary: Order Items & Pricing */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">BooksBoon Order Summary</h3>
              <span className="text-xs font-semibold text-slate-500">{cartCount} Item(s)</span>
            </div>

            {/* Cart item list */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={`${item.book.id}-${item.format}`} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-12 h-16 shrink-0 rounded overflow-hidden shadow-xs">
                    <BookImage book={item.book} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{item.book.title}</h4>
                    <p className="text-[11px] text-slate-500">{item.format} • Qty: {item.quantity}</p>
                    <span className="text-xs font-bold text-indigo-700">
                      ₹{(item.format === 'Paperback' ? item.book.paperbackPrice : (item.format === 'Magazine' ? item.book.paperbackPrice : Math.round(item.book.paperbackPrice * 0.45))) * item.quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2 pt-4 border-t border-slate-100 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Hard Copies Subtotal</span>
                <span className="font-semibold text-slate-900">₹{cartSubtotal}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping & Packaging</span>
                <span className="font-semibold text-emerald-700">
                  {shippingFee === 0 ? 'FREE (Orders > ₹499)' : `₹${shippingFee}`}
                </span>
              </div>
              {deliverySpeed === 'express' && (
                <div className="flex justify-between text-slate-600">
                  <span>Bluedart Air Express Surcharge</span>
                  <span className="font-semibold text-slate-900">₹40</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>GST (5% Books Publication)</span>
                <span className="font-semibold text-emerald-700">Inclusive</span>
              </div>

              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-3 border-t border-slate-200">
                <span>Grand Total</span>
                <span className="text-indigo-700">₹{totalAmount}</span>
              </div>
            </div>

            {/* Trust badge */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Genuine Physical Print Guarantee</span>
              </div>
              <p>Every textbook is printed on 70 GSM maplitho paper with crisp thermal lamination.</p>
            </div>

          </div>
        </div>

      </div>

      {/* RAZORPAY GATEWAY MODAL */}
      {showRazorpayModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
          <div 
            className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-300 overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Razorpay Brand Header */}
            <div className="bg-[#0c2340] text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#3399cc] flex items-center justify-center text-white font-black text-sm">
                  R
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold tracking-tight">Razorpay</span>
                    <span className="text-[10px] bg-white/10 px-1.5 py-0.2 rounded font-semibold text-cyan-300">TRUSTED</span>
                  </div>
                  <span className="text-[11px] text-slate-300 block">BooksBoon (Samwedna Prakashan)</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase">Amount to Pay</span>
                <span className="text-xl font-extrabold text-white">₹{totalAmount}</span>
              </div>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-4 border-b border-slate-200 text-xs font-semibold bg-slate-50">
              <button
                onClick={() => setActivePaymentMethod('upi')}
                className={`py-3 px-2 flex flex-col items-center gap-1 border-b-2 transition-colors cursor-pointer ${
                  activePaymentMethod === 'upi' ? 'border-[#3399cc] text-[#0c2340] bg-white' : 'border-transparent text-slate-500'
                }`}
              >
                <QrCode className="w-4 h-4 text-[#3399cc]" />
                <span>UPI / QR</span>
              </button>

              <button
                onClick={() => setActivePaymentMethod('card')}
                className={`py-3 px-2 flex flex-col items-center gap-1 border-b-2 transition-colors cursor-pointer ${
                  activePaymentMethod === 'card' ? 'border-[#3399cc] text-[#0c2340] bg-white' : 'border-transparent text-slate-500'
                }`}
              >
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>Card</span>
              </button>

              <button
                onClick={() => setActivePaymentMethod('netbanking')}
                className={`py-3 px-2 flex flex-col items-center gap-1 border-b-2 transition-colors cursor-pointer ${
                  activePaymentMethod === 'netbanking' ? 'border-[#3399cc] text-[#0c2340] bg-white' : 'border-transparent text-slate-500'
                }`}
              >
                <Building2 className="w-4 h-4 text-amber-600" />
                <span>NetBanking</span>
              </button>

              <button
                onClick={() => setActivePaymentMethod('cod')}
                className={`py-3 px-2 flex flex-col items-center gap-1 border-b-2 transition-colors cursor-pointer ${
                  activePaymentMethod === 'cod' ? 'border-[#3399cc] text-[#0c2340] bg-white' : 'border-transparent text-slate-500'
                }`}
              >
                <Banknote className="w-4 h-4 text-purple-600" />
                <span>COD</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-6 space-y-4">
              
              {/* UPI Tab */}
              {activePaymentMethod === 'upi' && (
                <div className="space-y-4 text-center">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 inline-block mx-auto shadow-inner">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=upi://pay?pa=booksboon17@okaxis&pn=BooksBoon&am=${totalAmount}&cu=INR`}
                      alt="Razorpay Dynamic UPI QR"
                      className="w-36 h-36 mx-auto rounded-lg"
                    />
                    <span className="text-[10px] text-slate-500 mt-2 block font-medium">Scan with any UPI App</span>
                  </div>

                  <div className="flex items-center justify-center gap-3 text-xs text-slate-600">
                    <span className="font-semibold text-slate-800">Supported:</span>
                    <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-bold">GPay</span>
                    <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-bold">PhonePe</span>
                    <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-bold">Paytm</span>
                    <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-bold">BHIM</span>
                  </div>

                  <div className="relative text-left">
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Or enter UPI ID / VPA</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. yourname@okhdfcbank"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#3399cc] focus:outline-hidden"
                    />
                  </div>
                </div>
              )}

              {/* Card Tab */}
              {activePaymentMethod === 'card' && (
                <div className="space-y-3 text-left">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Card Number</label>
                    <input
                      type="text"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())}
                      placeholder="4532 8912 3456 7890"
                      className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#3399cc] focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="12/28"
                        className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#3399cc] focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">CVV</label>
                      <input
                        type="password"
                        maxLength={3}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                        placeholder="•••"
                        className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#3399cc] focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Name on Card</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="MOHIT SHUKLA"
                      className="w-full px-3 py-2 text-xs uppercase rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#3399cc] focus:outline-hidden"
                    />
                  </div>
                </div>
              )}

              {/* NetBanking Tab */}
              {activePaymentMethod === 'netbanking' && (
                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Select Bank</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['SBI', 'HDFC', 'ICICI', 'Axis', 'PNB', 'Kotak'].map((b) => (
                      <button
                        key={b}
                        onClick={() => setSelectedBank(b)}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          selectedBank === b ? 'border-[#3399cc] bg-cyan-50 text-[#0c2340]' : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        {b} Bank
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Cash On Delivery Tab */}
              {activePaymentMethod === 'cod' && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
                  <span className="font-bold block">Cash on Delivery Available</span>
                  <p>Pay cash directly to the courier executive upon physical inspection of books package.</p>
                </div>
              )}

              {/* Action Button */}
              <div className="pt-3">
                <button
                  onClick={handleCompleteRazorpayPayment}
                  disabled={isProcessingPayment}
                  className="w-full py-3.5 rounded-xl bg-[#3399cc] hover:bg-[#287da8] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessingPayment ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying with Razorpay...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Pay ₹{totalAmount} Now</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-100">
                <span>Secured by Razorpay Payments</span>
                <span>PCI-DSS Level 1 Compliant</span>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

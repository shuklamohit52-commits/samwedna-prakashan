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

  // Real Razorpay Standard Web Checkout flow
  const handleProceedToRazorpay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !street.trim() || !city.trim() || !pinCode.trim()) {
      showToast('Please fill in complete delivery address details', 'error');
      return;
    }
    if (pinCode.length < 6) {
      showToast('Please enter a valid 6-digit Indian PIN code', 'error');
      return;
    }

    if (typeof (window as any).Razorpay === 'undefined') {
      showToast('Razorpay checkout SDK is loading, please wait a moment...', 'info');
      return;
    }

    setIsProcessingPayment(true);
    showToast('Creating secure Razorpay order...', 'info');

    try {
      // Step 1: Backend creates order
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(totalAmount * 100), // paise (minimum 100)
          currency: 'INR',
          receipt: `rcpt_bb_${Date.now()}`,
          notes: {
            customerName: fullName,
            email: user?.email || 'guest@booksboon.com',
            phone,
            deliverySpeed,
          },
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with status ${res.status}`);
      }

      const orderData = await res.json();
      const razorpayKey = (import.meta as any).env.VITE_RAZORPAY_KEY_ID || 'rzp_test_TpIjIwCL0MqGjE';

      // Step 2: Open official Razorpay modal with order_id
      const options = {
        key: razorpayKey,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'BooksBoon (Samwedna Prakashan)',
        description: 'Hard Copy Printed Textbooks & Magazines',
        image: 'https://cdn.jsdelivr.net/gh/luckymohittiwari52-oss/quiz-assets@main/images/bokbon.jpg',
        order_id: orderData.order_id,
        prefill: {
          name: fullName,
          email: user?.email || '',
          contact: phone,
        },
        notes: {
          address: `${street}, ${city}, ${state} - ${pinCode}`,
          shippingPartner: deliverySpeed === 'express' ? 'Bluedart Air Express' : 'India Post Speed Post',
        },
        theme: {
          color: '#059669', // Professional Emerald Green
        },
        handler: async function (response: any) {
          // Step 3: Backend signature verification
          try {
            showToast('Verifying payment signature with Razorpay...', 'info');
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              try {
                confetti({
                  particleCount: 120,
                  spread: 70,
                  origin: { y: 0.6 }
                });
              } catch (err) {
                console.warn('Confetti error:', err);
              }

              const trackingNumber = `IP-EXP-2026-${Math.floor(1000 + Math.random() * 9000)}IN`;
              const newOrder: HardCopyOrder = {
                orderId: response.razorpay_order_id || `BB-ORD-${Math.floor(100000 + Math.random() * 900000)}`,
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
                paymentMethod: 'Razorpay',
                paymentId: response.razorpay_payment_id,
                paymentStatus: 'Paid',
                shippingStatus: 'Processing',
                courierPartner: deliverySpeed === 'express' ? 'Bluedart Express Courier' : 'India Post Speed Post',
                estimatedDelivery: new Date(Date.now() + 4 * 86400000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
              };

              await placeOrder(newOrder);
              setConfirmedOrder(newOrder);
              showToast('Payment verified successfully via Razorpay!', 'success');
            } else {
              showToast(verifyData.error || 'Payment signature mismatch. Transaction not marked as paid.', 'error');
            }
          } catch (err: any) {
            console.error('Verification error:', err);
            showToast(err?.message || 'Failed to verify payment', 'error');
          } finally {
            setIsProcessingPayment(false);
          }
        },
        modal: {
          ondismiss: function () {
            showToast('Razorpay checkout window was dismissed.', 'info');
            setIsProcessingPayment(false);
          },
        },
      };

      const rzpInstance = new (window as any).Razorpay(options);
      rzpInstance.on('payment.failed', function (failResp: any) {
        console.error('Razorpay payment failed:', failResp);
        showToast(`Payment Failed: ${failResp?.error?.description || 'Bank transaction declined'}`, 'error');
        setIsProcessingPayment(false);
      });
      rzpInstance.open();
    } catch (err: any) {
      console.error('Error starting Razorpay checkout:', err);
      showToast(err?.message || 'Failed to initiate Razorpay checkout', 'error');
      setIsProcessingPayment(false);
    }
  };

  // Alternative Cash on Delivery Option
  const handlePlaceCodOrder = async () => {
    if (!fullName.trim() || !phone.trim() || !street.trim() || !city.trim() || !pinCode.trim()) {
      showToast('Please fill in complete delivery address details before placing COD order', 'error');
      return;
    }
    setIsProcessingPayment(true);
    const trackingNumber = `IP-EXP-2026-${Math.floor(1000 + Math.random() * 9000)}IN`;
    const newOrder: HardCopyOrder = {
      orderId: `BB-COD-${Math.floor(100000 + Math.random() * 900000)}`,
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
      paymentMethod: 'COD',
      paymentId: 'COD_ON_DELIVERY',
      paymentStatus: 'Pending',
      shippingStatus: 'Processing',
      courierPartner: deliverySpeed === 'express' ? 'Bluedart Express Courier' : 'India Post Speed Post',
      estimatedDelivery: new Date(Date.now() + 4 * 86400000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    await placeOrder(newOrder);
    setConfirmedOrder(newOrder);
    setIsProcessingPayment(false);
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

              <div className="pt-4 space-y-3">
                <button
                  type="submit"
                  disabled={isProcessingPayment}
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessingPayment ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Opening Secure Razorpay Gateway...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Pay ₹{totalAmount} with Razorpay (Cards, UPI, NetBanking)</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                  <div>
                    <span className="font-semibold text-slate-800 block">Prefer Cash on Delivery?</span>
                    <span className="text-[11px] text-slate-500">Pay cash upon delivery to courier executive</span>
                  </div>
                  <button
                    type="button"
                    onClick={handlePlaceCodOrder}
                    disabled={isProcessingPayment}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer disabled:opacity-50"
                  >
                    Place COD Order
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Right Summary: Order Items & Pricing */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg overflow-hidden border border-amber-300 bg-white p-0.5 shadow-xs shrink-0">
                  <img 
                    src="https://cdn.jsdelivr.net/gh/luckymohittiwari52-oss/quiz-assets@main/images/bokbon.jpg" 
                    alt="BooksBoon" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="font-bold text-sm text-slate-900">BooksBoon Order Summary</h3>
              </div>
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
                <span className="text-emerald-700">₹{totalAmount}</span>
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

    </div>
  );
};

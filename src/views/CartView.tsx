import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShieldCheck, 
  Tag, 
  CreditCard, 
  CheckCircle2, 
  Truck, 
  MapPin, 
  ChevronLeft 
} from 'lucide-react';
import { BookImage } from '../components/BookImage';

export const CartView: React.FC = () => {
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart, 
    cartSubtotal, 
    user, 
    setCurrentView, 
    showToast 
  } = useApp();

  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<'upi' | 'card' | 'cod'>('upi');
  const [orderPlaced, setOrderPlaced] = useState<string | null>(null);

  const deliveryFee = cartSubtotal >= 499 || cartSubtotal === 0 ? 0 : 50;
  const finalTotal = Math.max(0, cartSubtotal + deliveryFee - discountAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    if (couponCode.toUpperCase() === 'SAMVEDNA10' || couponCode.toUpperCase() === 'TOPPER10') {
      const discount = Math.round(cartSubtotal * 0.10);
      setDiscountAmount(discount);
      setCouponApplied(true);
      showToast(`Coupon applied! You saved ₹${discount}`, 'success');
    } else {
      showToast('Invalid coupon code. Try "SAMVEDNA10"', 'error');
    }
  };

  const handleProceedToCheckout = () => {
    if (cart.length === 0) return;
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (orderPlaced) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6 animate-fadeIn">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
            Order Confirmed & Payment Received
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 font-display">
            Thank You for Your Order!
          </h1>
          <p className="text-xs text-slate-600">
            Order Reference ID: <strong className="font-mono text-slate-900">{orderPlaced}</strong>
          </p>
        </div>

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-left text-xs space-y-3">
          <p className="font-bold text-slate-800">What Happens Next?</p>
          <ul className="space-y-2 text-slate-600 list-disc list-inside">
            <li>Your books will be packed with waterproof protective bubble packaging at our Jaipur/Sikar press.</li>
            <li>Tracking details will be SMS-dispatched via Bluedart/Delhivery within 24 hours.</li>
            <li>Expected delivery: 2-4 business days across India.</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            onClick={() => {
              setOrderPlaced(null);
              setCurrentView('product');
            }}
            className="px-6 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-indigo-700 cursor-pointer"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => {
              setOrderPlaced(null);
              setCurrentView('account');
            }}
            className="px-6 py-2.5 bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-200 cursor-pointer"
          >
            View in My Account
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4 animate-fadeIn">
        <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 font-display">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500">
          Looks like you haven&apos;t added any physical textbooks or test series to your cart yet.
        </p>
        <button
          onClick={() => setCurrentView('product')}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
        >
          Explore Books & Test Series
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
        <div>
          <button
            onClick={() => setCurrentView('product')}
            className="text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1 mb-1 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>
          <h1 className="text-3xl font-extrabold text-slate-900 font-display">
            Shopping Cart ({cart.length} {cart.length === 1 ? 'Title' : 'Titles'})
          </h1>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-slate-400 hover:text-red-600 cursor-pointer"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 divide-y divide-slate-100 shadow-xs overflow-hidden">
            {cart.map((item) => {
              const unitPrice = item.format === 'Paperback' 
                ? item.book.paperbackPrice 
                : Math.round(item.book.paperbackPrice * 0.45);

              return (
                <div key={item.book.id} className="p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
                  
                  <div className="flex items-center gap-4">
                    {/* Visual Cover */}
                    {item.book.bannerImage ? (
                      <div className="w-16 h-20 rounded-xl overflow-hidden shadow-xs shrink-0 bg-slate-950 border border-slate-200">
                        <BookImage 
                          book={item.book} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className={`w-16 h-20 rounded-xl bg-gradient-to-br ${item.book.coverGradient} p-2 text-white shrink-0 flex flex-col justify-between shadow-xs`}>
                        <span className="text-[8px] uppercase font-bold text-cyan-200">{item.book.language}</span>
                        <ShoppingBag className="w-4 h-4 mx-auto text-cyan-300" />
                        <span className="text-[8px] font-mono text-slate-300 truncate">{item.book.pages}p</span>
                      </div>
                    )}

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                        {item.format}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 font-display">
                        {item.book.title}
                      </h4>
                      <p className="text-xs text-slate-500">By {item.book.author}</p>
                      <p className="text-xs font-bold text-slate-900 pt-1">
                        ₹{unitPrice} <span className="text-[11px] font-normal text-slate-400">each</span>
                      </p>
                    </div>
                  </div>

                  {/* Quantity Stepper & Price */}
                  <div className="flex items-center gap-6 self-end sm:self-auto">
                    <div className="flex items-center border border-slate-300 rounded-xl bg-slate-50">
                      <button
                        onClick={() => updateCartQuantity(item.book.id, item.quantity - 1)}
                        className="p-1.5 text-slate-600 hover:text-slate-900 cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-mono font-bold text-slate-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.book.id, item.quantity + 1)}
                        className="p-1.5 text-slate-600 hover:text-slate-900 cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right min-w-[70px]">
                      <p className="text-base font-bold text-slate-900 font-display">
                        ₹{unitPrice * item.quantity}
                      </p>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.book.id)}
                      className="p-2 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                      title="Remove Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Delivery Address Review */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-600" />
                <span>Shipping Address</span>
              </h3>
              <button
                onClick={() => setCurrentView('account')}
                className="text-xs text-indigo-600 hover:underline font-semibold cursor-pointer"
              >
                Change Address
              </button>
            </div>

            <p className="text-xs text-slate-700">
              Deliver to: <strong>{user ? user.name : 'Mohit Shukla'}</strong> · {user ? user.phone : '+91 97737-40485'}
            </p>
            <p className="text-xs text-slate-500">
              {user ? `${user.address.street}, ${user.address.city}, ${user.address.state} - ${user.address.pinCode}` : 'Ward No 24, Near Nehru Park, Chawani, Neem Ka Thana, Rajasthan - 332713'}
            </p>
          </div>
        </div>

        {/* Right Column: Order Summary & Checkout */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
            <h3 className="text-base font-bold text-slate-900 font-display">
              Order Summary
            </h3>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-slate-900 font-mono">₹{cartSubtotal}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-slate-400" />
                  <span>Tracked Courier Shipping</span>
                </span>
                <span className="font-semibold text-slate-900 font-mono">
                  {deliveryFee === 0 ? <strong className="text-emerald-600">FREE</strong> : `₹${deliveryFee}`}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Coupon Discount (SAMVEDNA10)</span>
                  <span className="font-mono font-bold">-₹{discountAmount}</span>
                </div>
              )}

              <div className="border-t border-slate-200 pt-3 flex justify-between text-sm font-bold text-slate-900">
                <span>Total Amount</span>
                <span className="text-lg font-extrabold text-indigo-600 font-display">₹{finalTotal}</span>
              </div>
            </div>

            {/* Coupon Code Input */}
            <form onSubmit={handleApplyCoupon} className="pt-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Coupon (e.g. SAMVEDNA10)"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl uppercase font-mono tracking-wider focus:outline-hidden focus:border-indigo-600"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer shrink-0"
                >
                  Apply
                </button>
              </div>
            </form>

            {/* Payment Method Selector */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <p className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Select Payment Mode:
              </p>

              <div className="space-y-2 text-xs">
                <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedPayment === 'upi' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={selectedPayment === 'upi'}
                    onChange={() => setSelectedPayment('upi')}
                    className="accent-indigo-600"
                  />
                  <div className="flex-1">
                    <p className="font-bold text-slate-900">UPI Instant Payment</p>
                    <p className="text-[11px] text-slate-500">Google Pay, PhonePe, Paytm, BHIM</p>
                  </div>
                </label>

                <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedPayment === 'card' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={selectedPayment === 'card'}
                    onChange={() => setSelectedPayment('card')}
                    className="accent-indigo-600"
                  />
                  <div className="flex-1">
                    <p className="font-bold text-slate-900">Credit / Debit Card / Netbanking</p>
                    <p className="text-[11px] text-slate-500">All major Indian banks & Rupay cards</p>
                  </div>
                </label>

                <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedPayment === 'cod' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={selectedPayment === 'cod'}
                    onChange={() => setSelectedPayment('cod')}
                    className="accent-indigo-600"
                  />
                  <div className="flex-1">
                    <p className="font-bold text-slate-900">Cash on Delivery (COD)</p>
                    <p className="text-[11px] text-slate-500">Pay cash upon delivery by courier</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Proceed to Razorpay Checkout CTA */}
            <div className="pt-3">
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Razorpay Checkout (₹{finalTotal})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Genuine Books · Safe & Encrypted Checkout</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

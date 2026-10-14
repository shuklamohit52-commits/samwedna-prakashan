import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User, 
  MapPin, 
  CreditCard, 
  CheckCircle2, 
  ArrowRight, 
  ChevronLeft, 
  ShieldCheck, 
  Lock, 
  Mail, 
  Phone, 
  Sparkles 
} from 'lucide-react';
import { PRICING_PLANS } from '../data/mockData';

export const SignUpView: React.FC = () => {
  const { registerUser, setCurrentView, showToast } = useApp();
  
  // 3-step wizard state
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Basic Details
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [targetExam, setTargetExam] = useState('SSC CGL & Railway NTPC');

  // Step 2: Address
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Rajasthan');
  const [pinCode, setPinCode] = useState('');
  const [landmark, setLandmark] = useState('');

  // Step 3: Pricing Plan
  const [selectedPlanId, setSelectedPlanId] = useState<'free' | 'monthly' | 'yearly'>('yearly');

  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      showToast('Please fill all basic details', 'error');
      return;
    }
    setStep(2);
  };

  const handleStep2Next = (e: React.FormEvent) => {
    e.preventDefault();
    if (!street || !city || !pinCode) {
      showToast('Please provide your complete delivery address', 'error');
      return;
    }
    setStep(3);
  };

  const handleCompleteSignUp = () => {
    registerUser(
      {
        name,
        email,
        phone,
        targetExam,
        address: {
          street,
          city,
          state,
          pinCode,
          landmark
        }
      },
      selectedPlanId
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fadeIn">
      
      {/* Title & Step Tracker */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase">
          Create Aspirant Account
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 font-display">
          Join Samvedna Prakashan
        </h1>
        <p className="text-xs text-slate-500">
          Get unlimited e-books, mock test series, and physical textbook discounts.
        </p>

        {/* 3 Step Wizard Progress Bar */}
        <div className="grid grid-cols-3 gap-2 pt-4">
          <div className={`p-2.5 rounded-xl border text-center transition-all ${
            step === 1 ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold' : (step > 1 ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-slate-200 text-slate-400')
          }`}>
            <span className="text-xs">1. Basic Details</span>
          </div>

          <div className={`p-2.5 rounded-xl border text-center transition-all ${
            step === 2 ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold' : (step > 2 ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-slate-200 text-slate-400')
          }`}>
            <span className="text-xs">2. Delivery Address</span>
          </div>

          <div className={`p-2.5 rounded-xl border text-center transition-all ${
            step === 3 ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold' : 'border-slate-200 text-slate-400'
          }`}>
            <span className="text-xs">3. Pricing Plan</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-lg">
        
        {/* STEP 1: BASIC DETAILS */}
        {step === 1 && (
          <form onSubmit={handleStep1Next} className="space-y-5 animate-fadeIn">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-600" />
                <span>Step 1: Basic Information</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Tell us about yourself and your target examination.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mohit Shukla"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-indigo-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-indigo-600 focus:bg-white"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Mobile Number / WhatsApp <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 97737-40485"
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-indigo-600 focus:bg-white"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Account Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-indigo-600 focus:bg-white"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Primary Target Examination
              </label>
              <select
                value={targetExam}
                onChange={(e) => setTargetExam(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-indigo-600 focus:bg-white"
              >
                <option value="SSC CGL & Railway NTPC">SSC CGL & Railway NTPC</option>
                <option value="SSC GD & Police Constable">SSC GD & Police Constable</option>
                <option value="Banking PO & Clerk (SBI / IBPS)">Banking PO & Clerk (SBI / IBPS)</option>
                <option value="Railway NTPC, Group D & ALP">Railway NTPC, Group D & ALP</option>
                <option value="Defence NDA, CDS & Agniveer">Defence NDA, CDS & Agniveer</option>
                <option value="State PSC (Rajasthan, UP, Bihar, MP)">State PSC (Rajasthan, UP, Bihar, MP)</option>
                <option value="UPSC Civil Services">UPSC Civil Services</option>
              </select>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCurrentView('signin')}
                className="text-xs text-indigo-600 hover:underline font-semibold cursor-pointer"
              >
                Already have an account? Sign In →
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Proceed to Address</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: ADDRESS */}
        {step === 2 && (
          <form onSubmit={handleStep2Next} className="space-y-5 animate-fadeIn">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
                <MapPin className="w-5 h-5 text-indigo-600" />
                <span>Step 2: Shipping & Delivery Address</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Required for direct home delivery of printed textbooks and magazine issues.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Street Address / House / Colony <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="e.g. Ward No 24, Near Nehru Park, Chawani"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-indigo-600 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  City / Town <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Neem Ka Thana"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-indigo-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Rajasthan"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-indigo-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  PIN Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  placeholder="332713"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-indigo-600 focus:bg-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nearby Landmark (Optional)
              </label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="e.g. Opposite State Bank Branch / Near Water Tank"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-indigo-600 focus:bg-white"
              />
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Proceed to Pricing Plan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: PRICING PLAN (Free, Monthly, Yearly) */}
        {step === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-600" />
                <span>Step 3: Select Pricing Plan</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Choose your membership tier. You can switch or cancel anytime.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {PRICING_PLANS.map((plan) => {
                const isSelected = selectedPlanId === plan.id;
                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlanId(plan.id as any)}
                    className={`rounded-2xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between relative ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/60 shadow-md'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    {plan.popular && (
                      <span className="absolute -top-3 right-4 bg-indigo-600 text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow-xs">
                        Best Value
                      </span>
                    )}

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          {plan.name}
                        </span>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
                        }`}>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                      </div>

                      <div>
                        <span className="text-2xl font-extrabold text-slate-900 font-display">
                          {plan.price === 0 ? '₹0' : `₹${plan.price}`}
                        </span>
                        <span className="text-[11px] text-slate-500 block">{plan.billingPeriod}</span>
                      </div>

                      <p className="text-[11px] text-slate-600">{plan.description}</p>

                      <div className="space-y-1.5 pt-2 border-t border-slate-200/60 text-[11px]">
                        {plan.features.slice(0, 4).map((f, i) => (
                          <div key={i} className="flex items-start gap-2 text-slate-700">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      className={`w-full mt-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {isSelected ? 'Selected Plan' : 'Choose This'}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back to Address</span>
              </button>

              <button
                onClick={handleCompleteSignUp}
                className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Complete Sign Up & Enter Portal</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

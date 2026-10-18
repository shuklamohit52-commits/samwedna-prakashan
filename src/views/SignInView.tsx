import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  BookOpen, 
  Eye, 
  EyeOff, 
  Sparkles, 
  User, 
  Phone, 
  GraduationCap, 
  CheckCircle2, 
  X, 
  Key,
  Layers,
  Store,
  HelpCircle
} from 'lucide-react';
import { ExamCategory } from '../types';

export const SignInView: React.FC = () => {
  const { loginUser, registerUser, setCurrentView, showToast } = useApp();
  
  // Tab: 'signin' or 'signup'
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');

  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up Form State
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpExam, setSignUpExam] = useState('SSC CGL & Railway NTPC');
  const [signUpPlan, setSignUpPlan] = useState<'free' | 'yearly'>('free');

  // Social OAuth Modals
  const [googleModalOpen, setGoogleModalOpen] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');

  const [facebookModalOpen, setFacebookModalOpen] = useState(false);
  const [customFacebookName, setCustomFacebookName] = useState('');
  const [customFacebookEmail, setCustomFacebookEmail] = useState('');

  // Forgot Password Modal
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSubmitted, setResetSubmitted] = useState(false);

  // Loading indicator for sign in
  const [isLoading, setIsLoading] = useState(false);

  // Handle Standard Email Sign In
  const handleEmailSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInEmail) {
      showToast('Please enter your email address', 'error');
      return;
    }
    if (!signInPassword) {
      showToast('Please enter your password', 'error');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      loginUser(signInEmail, undefined, undefined, 'email');
    }, 400);
  };

  // Handle Sign Up Registration
  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpName.trim() || !signUpEmail.trim()) {
      showToast('Please provide your Name and Email', 'error');
      return;
    }
    if (!signUpEmail.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      registerUser(
        {
          name: signUpName,
          email: signUpEmail,
          phone: signUpPhone || '+91 97929 03247',
          targetExam: signUpExam
        },
        signUpPlan
      );
    }, 450);
  };

  // Google / Gmail Auth
  const handleGoogleLogin = (email: string, name: string) => {
    setIsLoading(true);
    setGoogleModalOpen(false);
    setTimeout(() => {
      setIsLoading(false);
      loginUser(
        email, 
        name, 
        '+91 97929 03247', 
        'google',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
      );
    }, 500);
  };

  // Facebook Auth
  const handleFacebookLogin = (email: string, name: string) => {
    setIsLoading(true);
    setFacebookModalOpen(false);
    setTimeout(() => {
      setIsLoading(false);
      loginUser(
        email, 
        name, 
        '+91 97929 03247', 
        'facebook',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
      );
    }, 500);
  };

  // Demo 1-Click Logins
  const handleDemoMohit = () => {
    loginUser('shukla.mohit52@gmail.com', 'Mohit Shukla', '+91 97929 03247', 'google');
  };

  const handleDemoBooksBoon = () => {
    loginUser('booksboon17@gmail.com', 'BooksBoon Administrator', '+91 97929 03247', 'google');
  };

  const handleDemoInstitute = () => {
    loginUser('sgi181069@gmail.com', 'Samwedna Institute Administrator', '+91 97929 03247', 'google');
  };

  const handleDemoPrakashan = () => {
    loginUser('spiindia181069@gmail.com', 'Samwedna Prakashan Administrator', '+91 97929 03247', 'google');
  };

  const handleDemoPriya = () => {
    loginUser('priya.sharma2026@gmail.com', 'Priya Sharma (UGC NET)', '+91 97929 03247', 'email');
  };

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-100 via-indigo-50/30 to-slate-100 animate-fadeIn flex flex-col justify-center items-center">
      
      {/* Branding Header */}
      <div className="text-center max-w-lg mb-8 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider">
          <GraduationCap className="w-4 h-4 text-indigo-600" />
          <span>Unified Student & Reader Portal</span>
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display tracking-tight">
          Samwedna & BooksBoon Account
        </h1>
        
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Single login for Samwedna Institute CBT mock tests, daily current affairs, and BooksBoon hard copy order tracking.
        </p>
      </div>

      {/* Main Card Container */}
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl relative overflow-hidden">
        
        {/* Glow Accent */}
        <div className="absolute -right-16 -top-16 w-36 h-36 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -left-16 -bottom-16 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* Tab Switcher: Sign In vs Sign Up */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('signin')}
            className={`py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'signin'
                ? 'bg-white text-indigo-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('signup')}
            className={`py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'signup'
                ? 'bg-white text-indigo-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* ======================================================== */}
        {/* SOCIAL AUTH BUTTONS: GMAIL / GOOGLE & FACEBOOK */}
        {/* ======================================================== */}
        <div className="space-y-3 mb-6">
          {/* Google / Gmail Button */}
          <button
            type="button"
            onClick={() => setGoogleModalOpen(true)}
            className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl border border-slate-300 shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-3 cursor-pointer group"
          >
            {/* Real Official 4-Color Google "G" Icon */}
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span className="group-hover:text-slate-900">
              {activeTab === 'signin' ? 'Sign in with Google (Gmail)' : 'Sign up with Google (Gmail)'}
            </span>
          </button>

          {/* Facebook Button */}
          <button
            type="button"
            onClick={() => setFacebookModalOpen(true)}
            className="w-full py-2.5 px-4 bg-[#1877F2] hover:bg-[#166fe5] text-white font-semibold text-xs rounded-xl shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            {/* Official Facebook 'f' Logo */}
            <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span>
              {activeTab === 'signin' ? 'Sign in with Facebook' : 'Sign up with Facebook'}
            </span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex py-2 items-center mb-6">
          <div className="grow border-t border-slate-200"></div>
          <span className="shrink mx-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            or continue with email
          </span>
          <div className="grow border-t border-slate-200"></div>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: SIGN IN FORM */}
        {/* ======================================================== */}
        {activeTab === 'signin' && (
          <form onSubmit={handleEmailSignIn} className="space-y-4 animate-fadeIn">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address or Student ID <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  placeholder="e.g. shukla.mohit52@gmail.com"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-indigo-600 focus:bg-white text-slate-900 transition-colors"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Password <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setForgotPasswordOpen(true)}
                  className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-indigo-600 focus:bg-white text-slate-900 transition-colors"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500"
                />
                <span>Keep me signed in</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In to Student Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* ======================================================== */}
        {/* TAB 2: SIGN UP / REGISTRATION FORM */}
        {/* ======================================================== */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignUpSubmit} className="space-y-4 animate-fadeIn">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={signUpName}
                  onChange={(e) => setSignUpName(e.target.value)}
                  placeholder="e.g. Mohit Shukla"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-indigo-600 focus:bg-white text-slate-900 transition-colors"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address (Gmail / Personal) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  placeholder="e.g. aspirant@gmail.com"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-indigo-600 focus:bg-white text-slate-900 transition-colors"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Mobile Number (Call & WhatsApp)
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={signUpPhone}
                  onChange={(e) => setSignUpPhone(e.target.value)}
                  placeholder="+91 97929 03247"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-indigo-600 focus:bg-white text-slate-900 transition-colors"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Target Competitive Exam
              </label>
              <select
                value={signUpExam}
                onChange={(e) => setSignUpExam(e.target.value)}
                className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-indigo-600 text-slate-900"
              >
                <option value="UPSC Civil Services (IAS / IPS)">UPSC Civil Services (IAS / IPS)</option>
                <option value="SSC CGL & CHSL 2026">SSC CGL & CHSL 2026</option>
                <option value="Banking PO & Clerk (IBPS / SBI)">Banking PO & Clerk (IBPS / SBI)</option>
                <option value="Railway RRB NTPC & Group D">Railway RRB NTPC & Group D</option>
                <option value="Teaching & UGC NET (Hindi Sahitya)">Teaching & UGC NET (Hindi Sahitya)</option>
                <option value="State PSC (UPPSC, BPSC, MPPSC)">State PSC (UPPSC, BPSC, MPPSC)</option>
                <option value="Defence (CDS, NDA, AFCAT)">Defence (CDS, NDA, AFCAT)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Create Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-9 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-indigo-600 focus:bg-white text-slate-900 transition-colors"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Plan selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Membership Pass
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div
                  onClick={() => setSignUpPlan('free')}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    signUpPlan === 'free'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-bold'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <p className="font-bold">Free Forever Pass</p>
                  <p className="text-[10px] text-slate-500">₹0 (Current Affairs & Free PDFs)</p>
                </div>
                <div
                  onClick={() => setSignUpPlan('yearly')}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    signUpPlan === 'yearly'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-bold'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <p className="font-bold">Yearly Elite Pass</p>
                  <p className="text-[10px] text-slate-500">₹999/yr (All-India CBT Test Series)</p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Create Student Account</span>
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* ======================================================== */}
        {/* 1-CLICK DEMO LOGIN PILLS */}
        {/* ======================================================== */}
        <div className="mt-6 pt-5 border-t border-slate-100 space-y-2">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
            One-Click Profiles (Students & Administrators)
          </p>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleDemoMohit}
              className="p-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 rounded-xl text-left transition-colors cursor-pointer"
              title="Primary Administrator"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                  M
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-indigo-950 truncate">Mohit Shukla</p>
                  <p className="text-[10px] text-indigo-600 font-semibold truncate">Primary Admin ID</p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={handleDemoBooksBoon}
              className="p-2 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200/80 rounded-xl text-left transition-colors cursor-pointer"
              title="BooksBoon Admin Email"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-cyan-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                  B
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-cyan-950 truncate">BooksBoon</p>
                  <p className="text-[10px] text-cyan-700 font-semibold truncate">booksboon17@gmail.com</p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={handleDemoInstitute}
              className="p-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-xl text-left transition-colors cursor-pointer"
              title="Institute Admin Email"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                  S
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-emerald-950 truncate">Institute SGI</p>
                  <p className="text-[10px] text-emerald-700 font-semibold truncate">sgi181069@gmail.com</p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={handleDemoPriya}
              className="p-2 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded-xl text-left transition-colors cursor-pointer"
              title="Student User (Non-Admin)"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                  P
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-amber-950 truncate">Priya Sharma</p>
                  <p className="text-[10px] text-amber-700 truncate">Student User</p>
                </div>
              </div>
            </button>
          </div>
        </div>

      </div>

      {/* Trust & Dual Platform Feature Card */}
      <div className="mt-8 max-w-md w-full grid grid-cols-2 gap-3 text-xs">
        <div className="p-3.5 bg-white/80 backdrop-blur-xs rounded-2xl border border-slate-200 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-slate-800">Samwedna Institutes</p>
            <p className="text-[10px] text-slate-500">CBT Tests, CA & Free PDFs</p>
          </div>
        </div>

        <div className="p-3.5 bg-white/80 backdrop-blur-xs rounded-2xl border border-slate-200 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <Store className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-slate-800">BooksBoon.com</p>
            <p className="text-[10px] text-slate-500">Hard Copies & Tracking</p>
          </div>
        </div>
      </div>

      {/* Official Student Support Contacts */}
      <div className="mt-4 max-w-md w-full bg-white/70 backdrop-blur-xs rounded-2xl border border-slate-200 p-3.5 text-center space-y-2">
        <p className="text-[11px] font-bold text-slate-700">Need Help Logging In or Registering?</p>
        <div className="flex flex-col gap-1 text-[11px] text-slate-600">
          <div className="flex items-center justify-between px-2 py-1 bg-slate-50 rounded-lg">
            <span className="font-semibold text-slate-700">BooksBoon Store:</span>
            <a href="mailto:booksboon17@gmail.com" className="text-indigo-600 font-mono hover:underline">booksboon17@gmail.com</a>
          </div>
          <div className="flex items-center justify-between px-2 py-1 bg-slate-50 rounded-lg">
            <span className="font-semibold text-slate-700">Samwedna Institute:</span>
            <a href="mailto:sgi181069@gmail.com" className="text-indigo-600 font-mono hover:underline">sgi181069@gmail.com</a>
          </div>
          <div className="flex items-center justify-between px-2 py-1 bg-slate-50 rounded-lg">
            <span className="font-semibold text-slate-700">Samwedna Prakashan:</span>
            <a href="mailto:spiindia181069@gmail.com" className="text-indigo-600 font-mono hover:underline">spiindia181069@gmail.com</a>
          </div>
        </div>
        <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-100">
          Direct Helpline: <a href="tel:+919792903247" className="font-bold text-emerald-700 hover:underline">+91 9792903247</a>
        </p>
      </div>

      {/* ======================================================== */}
      {/* GOOGLE / GMAIL OAUTH MODAL */}
      {/* ======================================================== */}
      {googleModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-scaleUp">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                </svg>
                <h3 className="text-sm font-bold text-slate-900 font-display">Sign in with Google</h3>
              </div>
              <button
                onClick={() => setGoogleModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Choose an account to continue to <strong>Samwedna Student Portal & BooksBoon</strong>.
            </p>

            {/* List of accounts */}
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              <div
                onClick={() => handleGoogleLogin('shukla.mohit52@gmail.com', 'Mohit Shukla')}
                className="p-3 rounded-2xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50 flex items-center justify-between cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                    MS
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-slate-900">Mohit Shukla</p>
                      <span className="text-[9px] bg-indigo-100 text-indigo-700 px-1.5 py-0.2 rounded font-bold">Admin</span>
                    </div>
                    <p className="text-[11px] text-slate-500">shukla.mohit52@gmail.com</p>
                  </div>
                </div>
                <span className="text-[11px] text-indigo-600 font-bold">Select</span>
              </div>

              <div
                onClick={() => handleGoogleLogin('booksboon17@gmail.com', 'BooksBoon Administrator')}
                className="p-3 rounded-2xl border border-slate-200 hover:border-cyan-500 hover:bg-cyan-50/50 flex items-center justify-between cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-cyan-600 text-white font-bold flex items-center justify-center text-xs">
                    BB
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-slate-900">BooksBoon Store</p>
                      <span className="text-[9px] bg-cyan-100 text-cyan-700 px-1.5 py-0.2 rounded font-bold">Admin</span>
                    </div>
                    <p className="text-[11px] text-slate-500">booksboon17@gmail.com</p>
                  </div>
                </div>
                <span className="text-[11px] text-cyan-600 font-bold">Select</span>
              </div>

              <div
                onClick={() => handleGoogleLogin('sgi181069@gmail.com', 'Samwedna Institute Administrator')}
                className="p-3 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 flex items-center justify-between cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                    SG
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-slate-900">Samwedna Institute (SGI)</p>
                      <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.2 rounded font-bold">Admin</span>
                    </div>
                    <p className="text-[11px] text-slate-500">sgi181069@gmail.com</p>
                  </div>
                </div>
                <span className="text-[11px] text-emerald-600 font-bold">Select</span>
              </div>

              <div
                onClick={() => handleGoogleLogin('spiindia181069@gmail.com', 'Samwedna Prakashan Administrator')}
                className="p-3 rounded-2xl border border-slate-200 hover:border-violet-500 hover:bg-violet-50/50 flex items-center justify-between cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-violet-600 text-white font-bold flex items-center justify-center text-xs">
                    SP
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-slate-900">Samwedna Prakashan HQ (SPI)</p>
                      <span className="text-[9px] bg-violet-100 text-violet-700 px-1.5 py-0.2 rounded font-bold">Admin</span>
                    </div>
                    <p className="text-[11px] text-slate-500">spiindia181069@gmail.com</p>
                  </div>
                </div>
                <span className="text-[11px] text-violet-600 font-bold">Select</span>
              </div>

              <div
                onClick={() => handleGoogleLogin('priya.sharma2026@gmail.com', 'Priya Sharma')}
                className="p-3 rounded-2xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50 flex items-center justify-between cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center text-xs">
                    PS
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-slate-900">Priya Sharma</p>
                      <span className="text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.2 rounded font-bold">Student</span>
                    </div>
                    <p className="text-[11px] text-slate-500">priya.sharma2026@gmail.com</p>
                  </div>
                </div>
                <span className="text-[11px] text-indigo-600 font-bold">Select</span>
              </div>
            </div>

            {/* Use custom Gmail option */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <p className="text-[11px] font-semibold text-slate-700">Or enter your own Gmail address:</p>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Your Name (e.g. Amit Kumar)"
                  value={customGoogleName}
                  onChange={(e) => setCustomGoogleName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
                <input
                  type="email"
                  placeholder="your.email@gmail.com"
                  value={customGoogleEmail}
                  onChange={(e) => setCustomGoogleEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!customGoogleEmail || !customGoogleEmail.includes('@')) {
                      showToast('Please enter a valid Gmail address', 'error');
                      return;
                    }
                    handleGoogleLogin(
                      customGoogleEmail, 
                      customGoogleName || customGoogleEmail.split('@')[0]
                    );
                  }}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Continue with this Gmail Account
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* FACEBOOK AUTH MODAL */}
      {/* ======================================================== */}
      {facebookModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-scaleUp">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#1877F2] text-white flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-slate-900 font-display">Log in with Facebook</h3>
              </div>
              <button
                onClick={() => setFacebookModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-900">
              <p className="font-semibold">Samwedna Student Portal Authorization</p>
              <p className="text-[11px] text-blue-700 mt-0.5">
                Will receive: Name and profile picture, and email address. No posts will be shared without your permission.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Facebook User Name</label>
                <input
                  type="text"
                  placeholder="e.g. Mohit Shukla"
                  value={customFacebookName}
                  onChange={(e) => setCustomFacebookName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Facebook Email or Phone</label>
                <input
                  type="text"
                  placeholder="e.g. shukla.mohit52@facebook.com"
                  value={customFacebookEmail}
                  onChange={(e) => setCustomFacebookEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setFacebookModalOpen(false)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const finalName = customFacebookName || 'Student Aspirant';
                    const finalEmail = customFacebookEmail || `${finalName.toLowerCase().replace(/\s+/g, '.')}@facebook.com`;
                    handleFacebookLogin(finalEmail, finalName);
                  }}
                  className="w-1/2 py-2.5 bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-xs rounded-xl cursor-pointer shadow-md"
                >
                  Continue
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* FORGOT PASSWORD MODAL */}
      {/* ======================================================== */}
      {forgotPasswordOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scaleUp">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900 font-display">Reset Student Password</h3>
              </div>
              <button
                onClick={() => {
                  setForgotPasswordOpen(false);
                  setResetSubmitted(false);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {resetSubmitted ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="text-xs font-bold text-emerald-950">Password Reset Link Sent!</h4>
                <p className="text-[11px] text-emerald-800">
                  We have dispatched a one-time reset link and OTP to <strong>{resetEmail}</strong>.
                </p>
                <button
                  onClick={() => {
                    setForgotPasswordOpen(false);
                    setResetSubmitted(false);
                  }}
                  className="mt-2 px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl"
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-500">
                  Enter your registered student email address. We will send you an OTP verification link to reset your password.
                </p>

                <input
                  type="email"
                  required
                  placeholder="e.g. shukla.mohit52@gmail.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-indigo-600 text-slate-900"
                />

                <button
                  type="button"
                  onClick={() => {
                    if (!resetEmail || !resetEmail.includes('@')) {
                      showToast('Please enter your valid email address', 'error');
                      return;
                    }
                    setResetSubmitted(true);
                    showToast('Reset link sent to registered email!', 'success');
                  }}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Send OTP Reset Link
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

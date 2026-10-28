import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  User, 
  Phone, 
  GraduationCap, 
  CheckCircle2, 
  X, 
  Key,
  Store,
  AlertCircle
} from 'lucide-react';
import { 
  signInWithGoogle, 
  signInWithFacebook, 
  loginWithEmail, 
  registerWithEmail, 
  resetUserPassword 
} from '../services/firebase';

export const SignInView: React.FC = () => {
  const { loginUser, registerUser, showToast, isRegisteredStudent, verifyStudentCredentials } = useApp();
  
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

  // Forgot Password Modal State
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSubmitted, setResetSubmitted] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  // Auth processing status & in-line error alerts
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Handle Real Google Authentication via Firebase
  const handleRealGoogleAuth = async () => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const { user, error } = await signInWithGoogle();
      if (error) {
        setAuthError(error);
        showToast(error, 'error');
        setIsLoading(false);
        return;
      }
      if (user) {
        loginUser(
          user.email || '', 
          user.displayName || undefined, 
          user.phoneNumber || undefined, 
          'google',
          user.photoURL || undefined
        );
      }
    } catch (err: any) {
      const msg = err?.message || 'Google Sign-In failed. Please try again.';
      setAuthError(msg);
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Real Facebook Authentication via Firebase
  const handleRealFacebookAuth = async () => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const { user, error } = await signInWithFacebook();
      if (error) {
        setAuthError(error);
        showToast(error, 'error');
        setIsLoading(false);
        return;
      }
      if (user) {
        loginUser(
          user.email || '', 
          user.displayName || undefined, 
          user.phoneNumber || undefined, 
          'facebook',
          user.photoURL || undefined
        );
      }
    } catch (err: any) {
      const msg = err?.message || 'Facebook authentication failed. Please try again.';
      setAuthError(msg);
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Real Email Sign In via Firebase & Strict Registered Accounts verification
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const cleanEmail = signInEmail.trim().toLowerCase();

    if (!cleanEmail) {
      setAuthError('Please enter your email address');
      showToast('Please enter your email address', 'error');
      return;
    }
    if (!signInPassword) {
      setAuthError('Please enter your password');
      showToast('Please enter your password', 'error');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Try Firebase Auth
      const { user } = await loginWithEmail(cleanEmail, signInPassword);

      if (user) {
        loginUser(
          user.email || cleanEmail, 
          user.displayName || undefined, 
          user.phoneNumber || undefined, 
          'email'
        );
        setIsLoading(false);
        return;
      }

      // 2. Strict account check: does this student account exist in registered records?
      const check = verifyStudentCredentials(cleanEmail, signInPassword);

      if (!check.valid) {
        if (check.reason === 'not_found') {
          const msg = 'No student account found with this email. You must click "Create Account" below and sign up first before signing in.';
          setAuthError(msg);
          showToast('Account not found. Please Sign Up first.', 'error');
        } else {
          setAuthError('Incorrect password. Please verify your password and try again.');
          showToast('Incorrect password.', 'error');
        }
        setIsLoading(false);
        return;
      }

      // Valid registered student
      loginUser(cleanEmail, undefined, undefined, 'email');
    } catch (err: any) {
      const msg = err?.message || 'Sign in failed. Please verify your credentials.';
      setAuthError(msg);
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Real Email Registration / Sign Up via Firebase
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!signUpName.trim() || !signUpEmail.trim()) {
      setAuthError('Please provide your Full Name and Email address');
      showToast('Please provide your Full Name and Email', 'error');
      return;
    }
    if (!signUpEmail.includes('@')) {
      setAuthError('Please enter a valid email address');
      showToast('Please enter a valid email address', 'error');
      return;
    }
    if (signUpPassword.length < 6) {
      setAuthError('Password must be at least 6 characters long');
      showToast('Password must be at least 6 characters long', 'error');
      return;
    }

    setIsLoading(true);
    try {
      try {
        const { user, error } = await registerWithEmail(
          signUpEmail, 
          signUpPassword, 
          signUpName.trim(),
          {
            phone: signUpPhone.trim() || undefined,
            targetExam: signUpExam
          }
        );
        if (error && (error.toLowerCase().includes('already in use') || error.toLowerCase().includes('already exists'))) {
          setAuthError('An account with this email already exists. Please sign in instead.');
          showToast('Account already exists. Please sign in.', 'error');
          setIsLoading(false);
          return;
        }
      } catch (fbErr) {
        console.warn('Firebase registration notice:', fbErr);
      }

      // Complete registration: establishes persistent session and syncs to Firestore users collection
      registerUser(
        {
          name: signUpName.trim(),
          email: signUpEmail.trim(),
          phone: signUpPhone.trim() || '+91 97929 03247',
          targetExam: signUpExam
        },
        signUpPlan,
        signUpPassword
      );
    } catch (err: any) {
      const msg = err?.message || 'Registration failed. Please try again.';
      setAuthError(msg);
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Real Forgot Password Reset Email via Firebase
  const handlePasswordReset = async () => {
    if (!resetEmail.trim() || !resetEmail.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    setResetLoading(true);
    try {
      const { success, error } = await resetUserPassword(resetEmail);
      if (error) {
        showToast(error, 'error');
      } else if (success) {
        setResetSubmitted(true);
        showToast('Password reset link sent to your email inbox!', 'success');
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to send reset email', 'error');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-100 via-indigo-50/30 to-slate-100 animate-fadeIn flex flex-col justify-center items-center">
      
      {/* Branding Header */}
      <div className="text-center max-w-lg mb-8 space-y-3">
        <div className="flex items-center justify-center -space-x-3 mb-2">
          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white border-2 border-amber-300 shadow-lg flex items-center justify-center p-1 z-10 shrink-0">
            <img 
              src="https://cdn.jsdelivr.net/gh/luckymohittiwari52-oss/quiz-assets@main/images/bokbon.jpg" 
              alt="BooksBoon Logo" 
              className="w-full h-full object-contain rounded-xl"
            />
          </div>
          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white border-2 border-indigo-400 shadow-lg flex items-center justify-center p-1 z-0 shrink-0">
            <img 
              src="https://cdn.jsdelivr.net/gh/luckymohittiwari52-oss/quiz-assets@main/images/sjgj.jpg" 
              alt="Samwedna Group of Institutes Logo" 
              className="w-full h-full object-contain rounded-xl"
            />
          </div>
        </div>

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
        
        {/* Glow Accents */}
        <div className="absolute -right-16 -top-16 w-36 h-36 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -left-16 -bottom-16 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* Tab Switcher: Sign In vs Sign Up */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => {
              setActiveTab('signin');
              setAuthError(null);
            }}
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
            onClick={() => {
              setActiveTab('signup');
              setAuthError(null);
            }}
            className={`py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'signup'
                ? 'bg-white text-indigo-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Auth Error Banner if any */}
        {authError && (
          <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5 text-xs text-red-800 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold leading-relaxed">{authError}</p>
              {authError.includes('sign up first') && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('signup');
                    setSignUpEmail(signInEmail);
                    setAuthError(null);
                  }}
                  className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-[11px] transition-colors cursor-pointer shadow-xs"
                >
                  <span>Click to Create Account with this email →</span>
                </button>
              )}
            </div>
            <button 
              onClick={() => setAuthError(null)} 
              className="text-red-400 hover:text-red-700 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* ======================================================== */}
        {/* REAL SOCIAL AUTH BUTTONS: GOOGLE / GMAIL & FACEBOOK */}
        {/* ======================================================== */}
        <div className="space-y-3 mb-6">
          {/* Real Google / Gmail Button */}
          <button
            type="button"
            onClick={handleRealGoogleAuth}
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl border border-slate-300 shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-3 cursor-pointer group disabled:opacity-50"
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

          {/* Real Facebook Button */}
          <button
            type="button"
            onClick={handleRealFacebookAuth}
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-[#1877F2] hover:bg-[#166fe5] text-white font-semibold text-xs rounded-xl shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
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
        {/* TAB 1: REAL SIGN IN FORM */}
        {/* ======================================================== */}
        {activeTab === 'signin' && (
          <form onSubmit={handleEmailSignIn} className="space-y-4 animate-fadeIn">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address <span className="text-red-500">*</span>
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
                  onClick={() => {
                    setForgotPasswordOpen(true);
                    setResetSubmitted(false);
                    setResetEmail(signInEmail);
                  }}
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
        {/* TAB 2: REAL SIGN UP / REGISTRATION FORM */}
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
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Membership Pass
                </label>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  100% Free Offer Active (₹0 Fees)
                </span>
              </div>
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
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all relative ${
                    signUpPlan === 'yearly'
                      ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 font-bold ring-2 ring-emerald-500/20'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span className="absolute -top-2 right-2 bg-emerald-600 text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full">
                    FREE NOW
                  </span>
                  <p className="font-bold">Yearly Elite Pass</p>
                  <p className="text-[10px] text-slate-500">
                    <span className="line-through text-slate-400 mr-1">₹999/yr</span>
                    <strong className="text-emerald-700">₹0 Free Scholarship</strong>
                  </p>
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

      </div>

      {/* Trust & Dual Platform Feature Cards */}
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
                  Firebase has dispatched a secure password reset link to <strong>{resetEmail}</strong>. Please check your inbox and spam folder.
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
                  Enter your registered student email address. Firebase will send you an official password reset link.
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
                  disabled={resetLoading}
                  onClick={handlePasswordReset}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {resetLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <span>Send Password Reset Link</span>
                  )}
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

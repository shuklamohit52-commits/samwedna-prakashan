import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, Mail, ArrowRight, ShieldCheck, UserCheck, BookOpen } from 'lucide-react';

export const SignInView: React.FC = () => {
  const { loginUser, setCurrentView, showToast } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast('Please enter your email address', 'error');
      return;
    }
    loginUser(email);
  };

  const handleQuickDemoLogin = () => {
    loginUser('shukla.mohit52@gmail.com', 'Mohit Shukla');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 animate-fadeIn">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
            <BookOpen className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-display">
            Aspirant Sign In
          </h1>
          <p className="text-xs text-slate-500">
            Sign in to access your downloaded library, mock test series, and past orders.
          </p>
        </div>

        {/* 1-Click Demo Login Pill for effortless testing */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 flex items-center justify-between text-xs">
          <div>
            <p className="font-semibold text-indigo-950">Quick Testing Access</p>
            <p className="text-indigo-800 text-[11px]">Login as Mohit Shukla (Yearly Elite Plan)</p>
          </div>
          <button
            onClick={handleQuickDemoLogin}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] rounded-lg transition-colors cursor-pointer"
          >
            1-Click Sign In
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="shukla.mohit52@gmail.com"
                className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-indigo-600 focus:bg-white"
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
                onClick={() => showToast('Password reset link sent to registered email!', 'info')}
                className="text-[11px] text-indigo-600 hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
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

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Sign In to Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="border-t border-slate-100 pt-4 text-center">
          <p className="text-xs text-slate-500">
            Don&apos;t have an account yet?{' '}
            <button
              onClick={() => setCurrentView('signup')}
              className="font-bold text-indigo-600 hover:underline cursor-pointer"
            >
              Sign Up (Free, Monthly or Yearly)
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};

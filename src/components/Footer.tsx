import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BookOpen, MapPin, Phone, Mail, ArrowRight, CheckCircle2, ShieldCheck, Key, Store, GraduationCap } from 'lucide-react';
import { ExamCategory } from '../types';

export const Footer: React.FC = () => {
  const { setCurrentView, setPortalMode, setFilterCategory, showToast } = useApp();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleExamClick = (category: ExamCategory) => {
    setPortalMode('booksboon');
    setFilterCategory(category);
    setCurrentView('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    setSubscribed(true);
    showToast('Subscribed to Samvedna Current Affairs & Exam Alerts!', 'success');
  };

  const authorsList = [
    { name: 'डॉ. रजनीश कुमार यादव', field: 'हिन्दी साहित्य का इतिहास (2500+ MCQs) - JNU/BHU' },
    { name: 'जगदीश नारायण श्रीवास्तव', field: 'अंतर्मन (जीविका पक्ष से सामाजिक सरोकार तक)' },
    { name: 'राघवेन्द्र दुबे \'भाऊ\'', field: 'डिस्कवरी ऑफ डेमोक्रेसी (भारत जोड़ो यात्रा)' },
    { name: 'डा. अरुण प्रताप सिंह', field: 'निर्वाचन (लोकतंत्र का आधार एवं चुनाव आयोग)' },
    { name: 'Er. R.K. Verma', field: 'Railway NTPC & Advanced Speed Maths' },
    { name: 'Dr. Vivek Sharma', field: 'SSC CGL General Studies & General Science' },
    { name: 'Adv. Alok Srivastava', field: 'Constitutional Law & Governance' }
  ];

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Col 1 & 2: Brand & Address */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-amber-500 flex items-center justify-center text-white shadow-md">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white font-display">
                  SAMVEDNA GROUP & BOOKSBOON
                </span>
                <span className="text-[10px] font-semibold text-cyan-400 block tracking-wider uppercase">
                  BooksBoon.com · Samvedna Group of Institutes
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Premier ecosystem for physical textbook e-commerce (BooksBoon.com) and comprehensive student exam preparation (Samvedna Group of Institutes) with daily current affairs, CBT test series, and free PDFs.
            </p>

            <div className="space-y-2.5 pt-2 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Head Office:</span>
                  <span>VZ/B-93, Ring Road Naraina Vihar, New Delhi - 110028</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Institutional Center (Gorakhpur):</span>
                  <span>Mahui Sugharpur, Near Bhavya Marriage Hall, Azad Chauk, Rustampur, Gorakhpur, UP (273016)</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Mobile Helpline: <strong>+91 9792903247</strong>, <strong>+91 8115374644</strong></span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>samwednap16@gmail.com · booksboon.com</span>
              </div>
              <div className="text-[11px] text-slate-400 pt-1">
                <span className="text-cyan-400 font-semibold">Distribution Hubs:</span> Dehradun · Lucknow · Patna · Gorakhpur · Delhi
              </div>
            </div>
          </div>

          {/* Col 3: BooksBoon.com Store */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wide uppercase mb-4 font-display flex items-center gap-2">
              <Store className="w-4 h-4 text-amber-400" />
              <span>BooksBoon.com Store</span>
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button 
                  onClick={() => {
                    setPortalMode('booksboon');
                    setFilterCategory('All');
                    setCurrentView('product');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  All Hard Copy Books
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setPortalMode('booksboon');
                    setFilterCategory('Teaching & UGC NET');
                    setCurrentView('product');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white text-amber-300 font-semibold transition-colors"
                >
                  हिन्दी साहित्य का इतिहास (2500+ MCQs)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setPortalMode('booksboon');
                    setFilterCategory('Magazines & Periodicals');
                    setCurrentView('product');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Magazines & Periodicals
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setCurrentView('cart');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Shopping Cart & Courier Checkout
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setCurrentView('student-dashboard');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  India Post Delivery Tracking
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Samwedna Group of Institutes */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wide uppercase mb-4 font-display flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              <span>Samwedna Institutes</span>
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button 
                  onClick={() => {
                    setPortalMode('institute');
                    setCurrentView('current-affairs');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  className="hover:text-white font-semibold text-cyan-400 transition-colors"
                >
                  Daily Current Affairs & MCQs
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setPortalMode('institute');
                    setCurrentView('test-series');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  className="hover:text-white transition-colors"
                >
                  CBT Test Series (Real Exam)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setPortalMode('institute');
                    setCurrentView('free-pdfs');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  className="hover:text-white transition-colors"
                >
                  Free PDFs & E-Books
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setPortalMode('institute');
                    setCurrentView('study-materials');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  className="hover:text-white transition-colors"
                >
                  Concept Mindmaps & Formulas
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setPortalMode('institute');
                    setCurrentView('video-lectures');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  className="hover:text-white transition-colors"
                >
                  Video Lectures Hub
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setCurrentView('student-dashboard');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  className="hover:text-white text-emerald-400 font-semibold transition-colors"
                >
                  Student Dashboard & Ranks
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Newsletter & Admin Access */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white tracking-wide uppercase font-display">
              Exam Alerts & Admin
            </h4>
            <p className="text-xs text-slate-400">
              Get notified of new CBT mock tests, daily current affairs capsules, and BooksBoon new releases.
            </p>

            {subscribed ? (
              <div className="p-3 bg-emerald-950/60 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Subscribed! Check your inbox for daily capsules.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter student email..."
                    className="w-full pl-3 pr-9 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 p-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}

            <div className="pt-2">
              <button
                onClick={() => {
                  setCurrentView('admin');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-cyan-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Key className="w-3.5 h-3.5" />
                <span>Admin Management Panel</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-slate-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Razorpay 256-bit Encrypted Checkout</span>
            </div>
          </div>

        </div>

        {/* Authors Marquee */}
        <div className="py-6 border-b border-slate-800/80">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
            <span className="font-bold text-white uppercase tracking-wider text-[10px]">
              Distinguished Authors & Faculty:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {authorsList.map((author, idx) => (
              <span
                key={idx}
                className="text-[11px] bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg text-slate-300"
              >
                <strong className="text-white">{author.name}</strong> ({author.field})
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 BooksBoon.com & Samwedna Group of Institutes. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>GSTIN: 07AAAFS1234F1Z8</span>
            <span>CIN: U22110DL2026PTC198412</span>
            <span>Supabase Cloud Integration Active</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

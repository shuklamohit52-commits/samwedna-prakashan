import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BookOpen, MapPin, Phone, Mail, ArrowRight, CheckCircle2, ShieldCheck, Key, Store, GraduationCap } from 'lucide-react';
import { ExamCategory } from '../types';

export const Footer: React.FC = () => {
  const { setCurrentView, setPortalMode, setFilterCategory, showToast, isAdmin } = useApp();
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
    showToast('Subscribed to Samwedna Current Affairs & Exam Alerts!', 'success');
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
    <footer className="bg-gradient-to-b from-emerald-50/80 via-white to-emerald-100/40 text-slate-700 border-t border-emerald-200/80 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-emerald-200/70">
          
          {/* Col 1 & 2: Brand & Address */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center -space-x-2">
                <div className="w-11 h-11 rounded-xl overflow-hidden bg-white border border-emerald-300 shadow-sm flex items-center justify-center p-0.5 z-10 shrink-0">
                  <img 
                    src="https://cdn.jsdelivr.net/gh/luckymohittiwari52-oss/quiz-assets@main/images/bokbon.jpg" 
                    alt="BooksBoon Official Logo" 
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>
                <div className="w-11 h-11 rounded-xl overflow-hidden bg-white border border-emerald-300 shadow-sm flex items-center justify-center p-0.5 z-0 shrink-0">
                  <img 
                    src="https://cdn.jsdelivr.net/gh/luckymohittiwari52-oss/quiz-assets@main/images/sjgj.jpg" 
                    alt="Samwedna Group of Institutes Official Logo" 
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-emerald-950 font-display">
                  SAMWEDNA GROUP & BOOKSBOON
                </span>
                <span className="text-[10px] font-bold text-emerald-700 block tracking-wider uppercase">
                  BooksBoon.com · Samwedna Group of Institutes
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
              Premier ecosystem for physical textbook e-commerce (BooksBoon.com) and comprehensive student exam preparation (Samwedna Group of Institutes) with daily current affairs, CBT test series, and free PDFs.
            </p>

            <div className="space-y-2.5 pt-2 text-xs text-slate-700">
              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-white/80 border border-emerald-100">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-emerald-950 block">Head Office:</span>
                  <span className="text-slate-600">VZ/B-93, Ring Road Naraina Vihar, New Delhi - 110028</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-white/80 border border-emerald-100">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-emerald-950 block">Institutional Center (Gorakhpur):</span>
                  <span className="text-slate-600">Mahui Sugharpur, Near Bhavya Marriage Hall, Azad Chauk, Rustampur, Gorakhpur, UP (273016)</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5 px-2">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Call / WhatsApp Helpline: <strong className="text-emerald-900">+91 9792903247</strong></span>
              </div>
              <div className="space-y-1.5 pt-2 border-t border-emerald-200/60 px-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="text-[11px]"><strong className="text-slate-800">BooksBoon Store:</strong> booksboon17@gmail.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="text-[11px]"><strong className="text-slate-800">Samwedna Institute (SGI):</strong> sgi181069@gmail.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="text-[11px]"><strong className="text-slate-800">Prakashan HQ (SPI):</strong> spiindia181069@gmail.com</span>
                </div>
              </div>
              <div className="text-[11px] text-slate-500 pt-1 px-2">
                <span className="text-emerald-800 font-bold">Distribution Hubs:</span> Dehradun · Lucknow · Patna · Gorakhpur · Delhi
              </div>
            </div>
          </div>

          {/* Col 3: BooksBoon.com Store */}
          <div>
            <h4 className="text-sm font-bold text-emerald-950 tracking-wide uppercase mb-4 font-display flex items-center gap-2">
              <Store className="w-4 h-4 text-emerald-700" />
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
                  className="hover:text-emerald-700 text-slate-700 font-medium transition-colors cursor-pointer"
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
                  className="hover:text-emerald-800 text-emerald-900 font-bold transition-colors cursor-pointer"
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
                  className="hover:text-emerald-700 text-slate-700 font-medium transition-colors cursor-pointer"
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
                  className="hover:text-emerald-700 text-slate-700 font-medium transition-colors cursor-pointer"
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
                  className="hover:text-emerald-700 text-slate-700 font-medium transition-colors cursor-pointer"
                >
                  India Post Delivery Tracking
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Samwedna Group of Institutes */}
          <div>
            <h4 className="text-sm font-bold text-emerald-950 tracking-wide uppercase mb-4 font-display flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-emerald-700" />
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
                  className="hover:text-emerald-800 font-bold text-emerald-700 transition-colors cursor-pointer"
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
                  className="hover:text-emerald-700 text-slate-700 font-medium transition-colors cursor-pointer"
                >
                  CBT Test Series (₹0 Free Access)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setPortalMode('institute');
                    setCurrentView('free-pdfs');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  className="hover:text-emerald-700 text-slate-700 font-medium transition-colors cursor-pointer"
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
                  className="hover:text-emerald-700 text-slate-700 font-medium transition-colors cursor-pointer"
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
                  className="hover:text-emerald-700 text-slate-700 font-medium transition-colors cursor-pointer"
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
                  className="hover:text-emerald-800 text-emerald-700 font-bold transition-colors cursor-pointer"
                >
                  Student Dashboard & Ranks
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Newsletter & Updates */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-emerald-950 tracking-wide uppercase font-display">
              Exam Alerts & Newsletter
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Get notified of new CBT mock tests, daily current affairs capsules, and BooksBoon new releases.
            </p>

            {subscribed ? (
              <div className="p-3 bg-emerald-100/80 border border-emerald-300 rounded-xl text-emerald-900 text-xs flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
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
                    className="w-full pl-3 pr-9 py-2 text-xs bg-white border border-emerald-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 p-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors cursor-pointer shadow-xs"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}

            {isAdmin && (
              <div className="pt-2">
                <button
                  onClick={() => {
                    setCurrentView('admin');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full py-2 rounded-xl bg-white hover:bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Key className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Admin Management Panel</span>
                </button>
              </div>
            )}

            <div className="flex items-center gap-2 text-[10px] text-slate-600 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Razorpay 256-bit Encrypted Checkout</span>
            </div>
          </div>

        </div>

        {/* Authors Marquee */}
        <div className="py-6 border-b border-emerald-200/70">
          <div className="flex items-center gap-2 text-xs text-slate-600 mb-3">
            <span className="font-bold text-emerald-950 uppercase tracking-wider text-[10px]">
              Distinguished Authors & Faculty:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {authorsList.map((author, idx) => (
              <span
                key={idx}
                className="text-[11px] bg-white border border-emerald-200/90 px-2.5 py-1 rounded-lg text-slate-700 shadow-2xs"
              >
                <strong className="text-emerald-950">{author.name}</strong> ({author.field})
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 BooksBoon.com & Samwedna Group of Institutes. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>GSTIN: 07AAAFS1234F1Z8</span>
            <span>CIN: U22110DL2026PTC198412</span>
            <span>Razorpay Payment Gateway Active</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

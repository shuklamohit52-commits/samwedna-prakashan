import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User, 
  BookOpen, 
  CreditCard, 
  LogOut, 
  Download, 
  Eye, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Package, 
  Receipt, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { DownloadedBook } from '../types';
import { BOOKS_DATA } from '../data/mockData';

export const MyAccountView: React.FC = () => {
  const { 
    user, 
    accountTab, 
    setAccountTab, 
    logoutUser, 
    setReadingEbook, 
    showToast,
    setCurrentView 
  } = useApp();

  const [editMode, setEditMode] = useState(false);
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [targetExam, setTargetExam] = useState(user?.targetExam || 'SSC CGL');
  const [street, setStreet] = useState(user?.address.street || '');
  const [city, setCity] = useState(user?.address.city || '');
  const [state, setState] = useState(user?.address.state || '');
  const [pinCode, setPinCode] = useState(user?.address.pinCode || '');

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 font-display">Please Sign In to Access My Account</h2>
        <p className="text-xs text-slate-500">Sign in to view your downloaded books, payment details, and address.</p>
        <button
          onClick={() => setCurrentView('signin')}
          className="px-6 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md"
        >
          Go to Sign In
        </button>
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setEditMode(false);
    showToast('Profile & Address updated successfully!', 'success');
  };

  const handleDownloadAgain = (book: DownloadedBook) => {
    // Generate text/pdf simulated download blob
    const content = `SAMWEDNA PRAKASHAN E-BOOK
Title: ${book.title}
Author: ${book.author}
Category: ${book.category}
Verified Digital Release: 2026 Edition
Downloaded on: ${book.downloadedAt}
Total Pages: ${book.totalPages}

This official digital copy is licensed to: ${user.email} (Samwedna Scholar Pass).
=============================================================`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${book.title.replace(/\s+/g, '_')}_Official.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Downloading "${book.title}" (${book.fileSize})`, 'success');
  };

  const handleDownloadInvoice = (orderId: string) => {
    showToast(`Invoice for ${orderId} generated and downloaded!`, 'info');
  };

  const mockOrders = [
    {
      id: 'ORD-2026-9812',
      date: '02 Oct 2026',
      items: 'SSC GD Constable (2026 Latest Pattern) Paperback + Static GK Encyclopedia',
      amount: 838,
      status: 'Delivered',
      tracking: 'BLUEDART: 9482710382'
    },
    {
      id: 'ORD-2026-8941',
      date: '15 Sep 2026',
      items: 'RRB NTPC Stage-I & II 10 Test Series Paperback',
      amount: 479,
      status: 'Delivered',
      tracking: 'DELHIVERY: 7728192301'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fadeIn">
      
      {/* Top Profile Summary Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-700 to-cyan-600 text-white flex items-center justify-center font-bold text-2xl shadow-md">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 font-display">{user.name}</h1>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                {user.subscription.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{user.email} · {user.phone}</p>
            <p className="text-xs font-semibold text-indigo-600 mt-1">
              Active Plan: {user.subscription.planName}
            </p>
          </div>
        </div>

        {/* Quick Tabs Control */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1.5 rounded-2xl w-full md:w-auto">
          <button
            onClick={() => setAccountTab('profile')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              accountTab === 'profile'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Profile
          </button>

          <button
            onClick={() => setAccountTab('library')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              accountTab === 'library'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            <span>My Library ({user.library.length})</span>
          </button>

          <button
            onClick={() => setAccountTab('payment')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              accountTab === 'payment'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Payment Details
          </button>

          <button
            onClick={logoutUser}
            className="px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer flex items-center gap-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* TAB 1: MY PROFILE */}
      {accountTab === 'profile' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-8 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-display">Personal Profile & Address</h2>
              <p className="text-xs text-slate-500">Manage your contact information and physical book delivery location.</p>
            </div>
            <button
              onClick={() => setEditMode(!editMode)}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              {editMode ? 'Cancel Editing' : 'Edit Information'}
            </button>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  disabled={!editMode}
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl disabled:bg-slate-100 disabled:text-slate-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email (Registered)</label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  disabled={!editMode}
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl disabled:bg-slate-100 disabled:text-slate-600 font-medium"
                />
              </div>
            </div>

            <div className="border-t border-slate-100 pt-6">
              <h3 className="text-sm font-bold text-slate-900 mb-4 font-display">Delivery Address</h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Street Address</label>
                  <input
                    type="text"
                    disabled={!editMode}
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl disabled:bg-slate-100 disabled:text-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">City</label>
                  <input
                    type="text"
                    disabled={!editMode}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl disabled:bg-slate-100 disabled:text-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">PIN Code</label>
                  <input
                    type="text"
                    disabled={!editMode}
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl disabled:bg-slate-100 disabled:text-slate-600 font-mono"
                  />
                </div>
              </div>
            </div>

            {editMode && (
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </div>
            )}
          </form>

          {/* Subscription Status Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                Active Subscription
              </span>
              <h4 className="text-lg font-bold font-display">{user.subscription.planName}</h4>
              <p className="text-xs text-slate-400">
                Valid until {user.subscription.expiryDate} · Unlimited PDF E-Books & All Online Test Series
              </p>
            </div>

            <button
              onClick={() => setCurrentView('signup')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 cursor-pointer"
            >
              Change / Upgrade Plan
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: MY LIBRARY (All Downloaded books here - Explicitly requested in prompt) */}
      {accountTab === 'library' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 font-display">
                My Library (All Downloaded Books)
              </h2>
              <p className="text-xs text-slate-500">
                You have {user.library.length} downloaded books ready for offline & online reading.
              </p>
            </div>

            <button
              onClick={() => setCurrentView('product')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
            >
              + Download More Books
            </button>
          </div>

          {user.library.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {user.library.map((item) => {
                const matchedBook = BOOKS_DATA.find(b => b.id === item.bookId);
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    {matchedBook?.bannerImage ? (
                      <div className="h-44 bg-slate-950 relative overflow-hidden group">
                        <img 
                          src={matchedBook.bannerImage} 
                          alt={item.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
                        <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between items-start pointer-events-none">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-200 bg-black/60 px-2 py-0.5 rounded">
                            {item.category}
                          </span>
                          <span className="text-[10px] font-mono text-slate-300 bg-black/60 px-2 py-0.5 rounded">
                            {item.fileSize}
                          </span>
                        </div>
                        <div className="absolute bottom-2 left-2.5 right-2.5 flex justify-between text-[11px] text-white pointer-events-none">
                          <span className="text-slate-200">Downloaded: {item.downloadedAt}</span>
                          <span className="font-semibold text-cyan-300">{item.totalPages} Pages</span>
                        </div>
                      </div>
                    ) : (
                      <div className={`p-6 bg-gradient-to-br ${item.coverGradient} text-white flex flex-col justify-between h-44 relative`}>
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-200 bg-white/10 px-2 py-0.5 rounded">
                            {item.category}
                          </span>
                          <span className="text-[10px] font-mono text-slate-300 bg-black/30 px-2 py-0.5 rounded">
                            {item.fileSize}
                          </span>
                        </div>

                        <div className="my-auto py-1">
                          <h3 className="text-base font-bold font-display leading-tight">{item.title}</h3>
                          <p className="text-[10px] text-slate-300 mt-0.5">By {item.author}</p>
                        </div>

                        <div className="pt-2 border-t border-white/20 flex items-center justify-between text-[11px] text-slate-300">
                          <span>Downloaded: {item.downloadedAt}</span>
                          <span>{item.totalPages} Pages</span>
                        </div>
                      </div>
                    )}

                  <div className="p-5 space-y-4">
                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-600 font-medium">
                        <span>Reading Progress</span>
                        <span>{Math.round((item.lastReadPage / item.totalPages) * 100)}% (Page {item.lastReadPage})</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-indigo-600 h-full rounded-full"
                          style={{ width: `${(item.lastReadPage / item.totalPages) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Actions: Read & Re-download */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => setReadingEbook(item)}
                        className="py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Read E-Book</span>
                      </button>

                      <button
                        onClick={() => handleDownloadAgain(item)}
                        className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download PDF</span>
                      </button>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">Your Library is Empty</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore our catalog and click &quot;PDF Download&quot; on any book or test series to add it to your personal library.
              </p>
              <button
                onClick={() => setCurrentView('product')}
                className="px-5 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl"
              >
                Browse Books Catalog
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PAYMENT DETAILS */}
      {accountTab === 'payment' && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Subscription & Payment Method */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <h2 className="text-xl font-bold text-slate-900 font-display">Subscription & Billing Method</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wide">
                  Current Billing Cycle
                </span>
                <p className="text-lg font-bold text-slate-900 font-display">{user.subscription.planName}</p>
                <p className="text-xs text-slate-500">
                  Renews on <strong>{user.subscription.expiryDate}</strong> (Annual pass)
                </p>
                <div className="pt-2">
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    Status: Auto-Renewal Active
                  </span>
                </div>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wide">
                  Saved Payment Method
                </span>
                <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-indigo-600" />
                  <span>UPI Autopay (PhonePe / GPay)</span>
                </p>
                <p className="text-xs text-slate-500">Linked to: shukla.mohit52@okhdfcbank</p>
                <div className="pt-2">
                  <span className="text-xs text-slate-600">Secure 256-Bit Encrypted Payments</span>
                </div>
              </div>
            </div>
          </div>

          {/* Physical Orders History & Tracking */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-display">Paperback Order History</h3>
                <p className="text-xs text-slate-500">Track and download invoices for your physical book purchases.</p>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {mockOrders.map((ord) => (
                <div key={ord.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-900 font-mono">{ord.id}</span>
                      <span className="text-slate-400">· {ord.date}</span>
                      <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {ord.status}
                      </span>
                    </div>
                    <p className="text-slate-700 font-medium">{ord.items}</p>
                    <p className="text-[11px] text-slate-400">{ord.tracking}</p>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-auto">
                    <span className="text-base font-bold text-slate-900 font-display">₹{ord.amount}</span>
                    <button
                      onClick={() => handleDownloadInvoice(ord.id)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg flex items-center gap-1 cursor-pointer"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>Invoice</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

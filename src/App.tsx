import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { BookDetailModal } from './components/BookDetailModal';
import { CBTTestModal } from './components/CBTTestModal';
import { EbookReaderModal } from './components/EbookReaderModal';

import { HomeView } from './views/HomeView';
import { ProductView } from './views/ProductView';
import { DailyCurrentAffairsView } from './views/DailyCurrentAffairsView';
import { TestSeriesView } from './views/TestSeriesView';
import { FreePdfsView } from './views/FreePdfsView';
import { StudyMaterialsView } from './views/StudyMaterialsView';
import { VideoLecturesView } from './views/VideoLecturesView';
import { StudentDashboardView } from './views/StudentDashboardView';
import { CartView } from './views/CartView';
import { CheckoutView } from './views/CheckoutView';
import { AdminPanelView } from './views/AdminPanelView';
import { SignInView } from './views/SignInView';
import { SignUpView } from './views/SignUpView';
import { HouseOfSamwednaView } from './views/HouseOfSamwednaView';
import { BlogView } from './views/BlogView';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { 
    currentView, 
    selectedBook, 
    setSelectedBook, 
    toast 
  } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      
      {/* Toast notifications */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className={`px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-semibold text-white ${
            toast.type === 'error' 
              ? 'bg-rose-600' 
              : (toast.type === 'info' ? 'bg-indigo-600' : 'bg-emerald-600')
          }`}>
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 shrink-0" />}
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Main Top Navigation */}
      <Navbar />

      {/* View routing */}
      <main className="flex-1">
        {currentView === 'home' && <HomeView />}
        {(currentView === 'product' || currentView === 'booksboon') && <ProductView />}
        {currentView === 'current-affairs' && <DailyCurrentAffairsView />}
        {currentView === 'test-series' && <TestSeriesView />}
        {currentView === 'free-pdfs' && <FreePdfsView />}
        {currentView === 'study-materials' && <StudyMaterialsView />}
        {currentView === 'video-lectures' && <VideoLecturesView />}
        {(currentView === 'account' || currentView === 'student-dashboard') && <StudentDashboardView />}
        {currentView === 'cart' && <CartView />}
        {currentView === 'checkout' && <CheckoutView />}
        {currentView === 'admin' && <AdminPanelView />}
        {currentView === 'signin' && <SignInView />}
        {currentView === 'signup' && <SignUpView />}
        {(currentView === 'house-of-samwedna' || currentView === 'house-of-samvedna') && <HouseOfSamwednaView />}
        {currentView === 'blog' && <BlogView />}
      </main>

      {/* Modals */}
      {selectedBook && (
        <BookDetailModal 
          book={selectedBook} 
          onClose={() => setSelectedBook(null)} 
        />
      )}
      <CBTTestModal />
      <EbookReaderModal />

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

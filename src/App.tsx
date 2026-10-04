import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { FaqSection } from './components/FaqSection';
import { DownloadAppSection } from './components/DownloadAppSection';
import { GamesSection } from './components/GamesSection';
import { DepositCalculator } from './components/DepositCalculator';
import { LoanRepaymentSchedule } from './components/LoanRepaymentSchedule';
import { FeaturedProducts } from './components/FeaturedProducts';
import { BranchesSection } from './components/BranchesSection';
import { Footer } from './components/Footer';
import contentData from './data/contentData.json';
import { 
  HelpCircle, 
  Smartphone, 
  Gamepad2, 
  PiggyBank, 
  Calculator, 
  Sparkles, 
  MapPin, 
  ChevronRight,
  ShieldCheck,
  Fuel,
  ArrowRight
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('faq');

  // Handle URL hash navigation or back buttons
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (['faq', 'download-app', 'games', 'deposit-calc', 'loan-calc', 'featured-products', 'branches'].includes(hash)) {
        setActiveTab(hash);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    window.location.hash = tabId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getQuickIcon = (id: string) => {
    switch (id) {
      case 'faq':
        return <HelpCircle className="w-5 h-5" />;
      case 'download-app':
        return <Smartphone className="w-5 h-5" />;
      case 'games':
        return <Gamepad2 className="w-5 h-5" />;
      case 'deposit-calc':
        return <PiggyBank className="w-5 h-5" />;
      case 'loan-calc':
        return <Calculator className="w-5 h-5" />;
      case 'featured-products':
        return <Sparkles className="w-5 h-5" />;
      case 'branches':
        return <MapPin className="w-5 h-5" />;
      default:
        return <ChevronRight className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
      {/* Header */}
      <Header activeTab={activeTab} setActiveTab={handleTabChange} />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Quick Kiosk Service Bar for Mobile/Tablet customers at counter */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-950 text-white py-3 px-4 shadow-inner">
          <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto no-scrollbar gap-2">
            <span className="text-xs font-bold text-blue-200 shrink-0 uppercase tracking-wider hidden sm:inline">
              Chọn nhanh chức năng:
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {contentData.navigation.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    <span>{item.title}</span>
                    {item.id === 'games' && (
                      <span className="px-1.5 py-0.2 text-[9px] font-black rounded-full bg-red-600 text-white">
                        Voucher
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Feature Component Render */}
        <div className="transition-opacity duration-200">
          {activeTab === 'faq' && <FaqSection onBackToMainMenu={() => handleTabChange('faq')} />}
          {activeTab === 'download-app' && <DownloadAppSection />}
          {activeTab === 'games' && <GamesSection />}
          {activeTab === 'deposit-calc' && <DepositCalculator />}
          {activeTab === 'loan-calc' && <LoanRepaymentSchedule />}
          {activeTab === 'featured-products' && <FeaturedProducts />}
          {activeTab === 'branches' && <BranchesSection />}
        </div>
      </main>

      {/* Footer */}
      <Footer setActiveTab={handleTabChange} />
    </div>
  );
}

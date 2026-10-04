import React, { useState, useEffect } from 'react';
import contentData from '../data/contentData.json';
import { 
  HelpCircle, 
  Smartphone, 
  Gamepad2, 
  PiggyBank, 
  Calculator, 
  Sparkles, 
  MapPin, 
  PhoneCall, 
  Clock, 
  Menu, 
  X,
  ChevronRight
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tabId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('vi-VN', {
          weekday: 'long',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const getIcon = (id: string) => {
    switch (id) {
      case 'faq':
        return <HelpCircle className="w-4 h-4" />;
      case 'download-app':
        return <Smartphone className="w-4 h-4" />;
      case 'games':
        return <Gamepad2 className="w-4 h-4" />;
      case 'deposit-calc':
        return <PiggyBank className="w-4 h-4" />;
      case 'loan-calc':
        return <Calculator className="w-4 h-4" />;
      case 'featured-products':
        return <Sparkles className="w-4 h-4" />;
      case 'branches':
        return <MapPin className="w-4 h-4" />;
      default:
        return <ChevronRight className="w-4 h-4" />;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
      {/* Top Banner Bar */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-sky-900 text-white text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-600 text-white tracking-wider uppercase">
              Quầy giao dịch
            </span>
            <span className="hidden sm:inline text-blue-200">|</span>
            <span className="font-medium text-slate-100">
              {contentData.brand.branchName}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-blue-100">
            {currentTime && (
              <span className="hidden md:flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-300" />
                {currentTime}
              </span>
            )}
            <a
              href={`tel:${contentData.faq.consultant.phone}`}
              className="flex items-center gap-1 text-amber-300 font-semibold hover:underline"
            >
              <PhoneCall className="w-3 h-3" />
              Hotline Quầy: {contentData.faq.consultant.phoneFormatted}
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo VietinBank */}
          <div 
            onClick={() => setActiveTab('faq')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="h-10 sm:h-12 flex items-center p-1 bg-white rounded-lg transition-transform group-hover:scale-102">
              <img
                src={contentData.brand.logo}
                alt="Logo VietinBank"
                className="h-8 sm:h-11 w-auto object-contain"
                onError={(e) => {
                  // Fallback in case image url needs fallback
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="hidden lg:block border-l border-slate-300 pl-3">
              <p className="text-xs font-bold text-blue-900 tracking-wide uppercase">
                Cổng Tương Tác Khách Hàng
              </p>
              <p className="text-[11px] text-slate-500">
                Phục vụ nhanh chóng • Tiện ích số vượt trội
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {contentData.navigation.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-blue-700 text-white shadow-sm shadow-blue-500/25 ring-2 ring-blue-700/20'
                      : 'text-slate-700 hover:text-blue-700 hover:bg-blue-50'
                  }`}
                >
                  <span className={isActive ? 'text-white' : 'text-blue-600'}>
                    {getIcon(item.id)}
                  </span>
                  <span>{item.title}</span>
                  {item.id === 'games' && (
                    <span className="ml-0.5 px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-amber-400 text-slate-900 animate-pulse">
                      Quà
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Mobile & Tablet menu toggle */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 focus:outline-none cursor-pointer"
              aria-label="Mở menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Scrollable Horizontal Tabs for Tablets/Laptops */}
        <div className="hidden md:flex xl:hidden overflow-x-auto py-2 gap-1 border-t border-slate-100 no-scrollbar">
          {contentData.navigation.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-blue-700 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {getIcon(item.id)}
                <span>{item.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 shadow-xl">
          <div className="grid grid-cols-1 gap-1.5">
            {contentData.navigation.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-blue-700 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-blue-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? 'text-white' : 'text-blue-600'}>
                      {getIcon(item.id)}
                    </span>
                    <span>{item.title}</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {item.badge}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2 text-xs">
            <a
              href={`tel:${contentData.faq.consultant.phone}`}
              className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-red-50 text-red-700 font-bold border border-red-200"
            >
              <PhoneCall className="w-4 h-4" />
              Gọi Hỗ trợ tại Quầy: {contentData.faq.consultant.phoneFormatted}
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

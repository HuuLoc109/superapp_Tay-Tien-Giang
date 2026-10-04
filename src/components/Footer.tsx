import React from 'react';
import contentData from '../data/contentData.json';
import { ShieldCheck, PhoneCall, MapPin, Building, ArrowUp } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tabId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 mt-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img
                src={contentData.brand.logoWhite}
                alt="Logo VietinBank"
                className="h-9 sm:h-10 w-auto object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {contentData.brand.fullName}
            </p>
            <p className="text-xs text-amber-400 font-semibold italic">
              "{contentData.brand.slogan}"
            </p>
            <div className="pt-2 text-xs text-slate-400">
              <span className="font-bold text-slate-200 block mb-1">
                {contentData.brand.branchName}
              </span>
              <p>560 Quốc lộ 1A, Khu phố 1, Phường Cai Lậy, Tỉnh Đồng Tháp</p>
            </div>
          </div>

          {/* Col 2: Fast Navigation */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Tiện Ích Tại Quầy
            </h4>
            <ul className="space-y-2 text-xs">
              {contentData.navigation.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setActiveTab(item.id);
                      scrollToTop();
                    }}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {item.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Hotlines & Consultants */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Đường Dây Nóng Hỗ Trợ
            </h4>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/50">
                <span className="text-slate-400 block text-[11px]">Tổng đài VietinBank 24/7:</span>
                <a href={`tel:${contentData.brand.hotline.replace(/\s+/g, '')}`} className="font-bold text-amber-400 text-sm hover:underline block">
                  {contentData.brand.hotline}
                </a>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/50">
                <span className="text-slate-400 block text-[11px]">Hỗ trợ tại Quầy - {contentData.faq.consultant.name}:</span>
                <a href={`tel:${contentData.faq.consultant.phone}`} className="font-bold text-emerald-400 text-sm hover:underline block">
                  {contentData.faq.consultant.phoneFormatted}
                </a>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/50">
                <span className="text-slate-400 block text-[11px]">Tư vấn sản phẩm - Chuyên viên {contentData.featuredProducts.consultant.name}:</span>
                <a href={`tel:${contentData.featuredProducts.consultant.phone}`} className="font-bold text-sky-400 text-sm hover:underline block">
                  {contentData.featuredProducts.consultant.phoneFormatted}
                </a>
              </div>
            </div>
          </div>

          {/* Col 4: Safety & Kiosk Note */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Bảo Mật & An Toàn
            </h4>
            <div className="flex items-start gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                Cổng tương tác dành cho khách hàng tại quầy giao dịch VietinBank. Mọi thông tin tra cứu đều được bảo mật theo tiêu chuẩn ngân hàng nhà nước.
              </span>
            </div>

            <button
              onClick={scrollToTop}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <ArrowUp className="w-4 h-4" />
              <span>Lên đầu trang</span>
            </button>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Ngân hàng TMCP Công Thương Việt Nam (VietinBank). Bản quyền thuộc về VietinBank.
        </div>
      </div>
    </footer>
  );
};

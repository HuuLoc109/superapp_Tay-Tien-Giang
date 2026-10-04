import React, { useState } from 'react';
import contentData from '../data/contentData.json';
import { 
  Apple, 
  Smartphone, 
  ExternalLink, 
  QrCode, 
  ShieldCheck, 
  Zap, 
  Percent, 
  Check, 
  Copy, 
  Sparkles,
  Layers
} from 'lucide-react';

export const DownloadAppSection: React.FC = () => {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const handleCopy = (url: string, platform: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(platform);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold mb-3">
          <Smartphone className="w-3.5 h-3.5" />
          <span>Ứng dụng Ngân hàng số Thế hệ mới</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-950 tracking-tight mb-2">
          {contentData.appDownload.title}
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          {contentData.appDownload.subtitle} — Quét mã QR bằng camera điện thoại để tải ngay chỉ trong 30 giây!
        </p>
      </div>

      {/* Main Download Cards (iOS & Android) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* iOS Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100 rounded-bl-full -mr-10 -mt-10 opacity-40 pointer-events-none group-hover:scale-110 transition-transform" />

          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-md">
                <Apple className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Dành cho iPhone / iPad
                </span>
                <h3 className="text-lg font-bold text-slate-900">Apple App Store</h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 mb-6">
              Hỗ trợ iOS 12.0 trở lên. Tích hợp FaceID, Apple Wallet và bảo mật sinh trắc học tối đa.
            </p>

            {/* QR Code Container */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex flex-col sm:flex-row items-center gap-5 mb-6">
              <div className="w-36 h-36 bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm shrink-0 flex items-center justify-center">
                <img
                  src={contentData.appDownload.ios.qr}
                  alt="QR Code tải VietinBank iPay iOS"
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
              <div className="text-center sm:text-left">
                <div className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 mb-1">
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Quét mã tải trực tiếp</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Mở ứng dụng Camera trên iPhone, hướng camera vào mã QR để mở link cài đặt trên App Store.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <a
              href={contentData.appDownload.ios.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Apple className="w-4 h-4" />
              <span>Tải trên App Store</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>

            <button
              onClick={() => handleCopy(contentData.appDownload.ios.url, 'ios')}
              className="p-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
              title="Sao chép link"
            >
              {copiedLink === 'ios' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Android Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-bl-full -mr-10 -mt-10 opacity-30 pointer-events-none group-hover:scale-110 transition-transform" />

          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
                <Smartphone className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                  Dành cho Samsung, Xiaomi, Oppo...
                </span>
                <h3 className="text-lg font-bold text-slate-900">Google Play Store</h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 mb-6">
              Hỗ trợ Android 7.0 trở lên. Quét NFC CCCD mượt mà, xác thực khuôn mặt nhanh gọn.
            </p>

            {/* QR Code Container */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex flex-col sm:flex-row items-center gap-5 mb-6">
              <div className="w-36 h-36 bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm shrink-0 flex items-center justify-center">
                <img
                  src={contentData.appDownload.android.qr}
                  alt="QR Code tải VietinBank iPay Android"
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
              <div className="text-center sm:text-left">
                <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 mb-1">
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Quét mã tải trực tiếp</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Mở Zalo hoặc ứng dụng quét mã QR trên điện thoại Android, quét mã để đến Google Play tải iPay.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <a
              href={contentData.appDownload.android.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Smartphone className="w-4 h-4" />
              <span>Tải trên Google Play</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>

            <button
              onClick={() => handleCopy(contentData.appDownload.android.url, 'android')}
              className="p-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
              title="Sao chép link"
            >
              {copiedLink === 'android' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Trải nghiệm vượt trội</span>
          <h3 className="text-xl sm:text-2xl font-bold mt-1">Lợi ích đặc quyền trên VietinBank iPay</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {contentData.appDownload.benefits.map((b, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-600/30 flex items-center justify-center mb-3 text-amber-300">
                {idx === 0 && <Zap className="w-5 h-5" />}
                {idx === 1 && <Percent className="w-5 h-5" />}
                {idx === 2 && <ShieldCheck className="w-5 h-5" />}
                {idx === 3 && <Sparkles className="w-5 h-5" />}
              </div>
              <h4 className="font-bold text-sm text-white mb-1">{b.title}</h4>
              <p className="text-xs text-blue-200 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 text-center text-xs text-blue-200">
          Cần hỗ trợ kích hoạt Soft OTP hoặc đăng ký tài khoản trực tuyến? Quý khách vui lòng yêu cầu Giao dịch viên tại quầy hỗ trợ ngay!
        </div>
      </div>
    </div>
  );
};

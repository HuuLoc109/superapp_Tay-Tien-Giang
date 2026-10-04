import React, { useState } from 'react';
import contentData from '../data/contentData.json';
import { BranchItem } from '../types';
import { 
  MapPin, 
  Phone, 
  Clock, 
  ExternalLink, 
  Navigation, 
  Building, 
  Search, 
  CheckCircle,
  CalendarDays,
  ShieldCheck,
  ZoomIn,
  X
} from 'lucide-react';

export const BranchesSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<BranchItem | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const branches: BranchItem[] = contentData.branches.list;

  const filteredBranches = branches.filter(
    (b) =>
      b.office.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Lightbox Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl p-2 shadow-2xl overflow-hidden">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-slate-900/70 text-white hover:bg-slate-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={previewImage}
              alt="Chi tiết phòng giao dịch"
              className="w-full h-auto max-h-[85vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold mb-3">
          <MapPin className="w-3.5 h-3.5" />
          <span>Mạng lưới Chi nhánh & PGD</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-950 tracking-tight mb-2">
          {contentData.branches.title}
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          {contentData.branches.subtitle} — Tra cứu thông tin địa chỉ, chỉ đường qua Google Maps và gọi hotline tư vấn ngay.
        </p>
      </div>

      {/* Operating Hours Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Thời Gian Giao Dịch Tại Quầy
              </h3>
              <p className="text-xs text-slate-500">Áp dụng cho toàn bộ Chi nhánh & các Phòng giao dịch</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="font-bold text-blue-900 block mb-1 flex items-center gap-1">
                <CalendarDays className="w-3.5 h-3.5 text-blue-600" />
                {contentData.branches.workingHours.weekdays.title}
              </span>
              <span className="text-slate-600 block">{contentData.branches.workingHours.weekdays.morning}</span>
              <span className="text-slate-600 block">{contentData.branches.workingHours.weekdays.afternoon}</span>
            </div>

            <div className="p-3 rounded-2xl bg-red-50 border border-red-100">
              <span className="font-bold text-red-700 block mb-1">
                {contentData.branches.workingHours.weekend.title}
              </span>
              <span className="text-red-600 font-semibold">{contentData.branches.workingHours.weekend.status}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative max-w-md mx-auto mb-8">
        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm phòng giao dịch, địa chỉ..."
          className="w-full py-3.5 pl-12 pr-4 rounded-2xl border border-slate-200 bg-white text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 shadow-xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
          >
            Xóa
          </button>
        )}
      </div>

      {/* Branch Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBranches.map((item) => (
          <div
            key={item.stt}
            className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
          >
            <div>
              {/* Branch Photo */}
              <div 
                onClick={() => setPreviewImage(item.image)}
                className="relative aspect-[16/10] bg-slate-100 cursor-pointer overflow-hidden group/img"
              >
                <img
                  src={item.image}
                  alt={item.office}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover/img:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-900/90 text-white backdrop-blur-xs">
                    #{item.stt} {item.branch}
                  </span>
                </div>
                <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-semibold">
                  <ZoomIn className="w-4 h-4" />
                  <span>Xem ảnh lớn</span>
                </div>
              </div>

              {/* Branch Content */}
              <div className="p-5">
                <h3 className="font-extrabold text-base text-slate-900 group-hover:text-blue-700 transition-colors mb-2">
                  {item.office}
                </h3>

                <div className="space-y-2.5 text-xs text-slate-600 mb-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{item.address}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold text-slate-800">Hotline: {item.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions: Call + Google Maps */}
            <div className="p-5 pt-0 grid grid-cols-2 gap-2">
              <a
                href={`tel:${item.phone.replace(/[^0-9]/g, '')}`}
                className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-blue-700" />
                <span>Gọi điện</span>
              </a>

              <a
                href={item.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5 text-amber-300" />
                <span>Google Maps</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {filteredBranches.length === 0 && (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
          <p className="text-slate-500 text-sm">Không tìm thấy điểm giao dịch phù hợp với từ khóa.</p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-3 px-4 py-2 rounded-xl bg-blue-50 text-blue-700 font-semibold text-xs"
          >
            Xem toàn bộ danh sách
          </button>
        </div>
      )}
    </div>
  );
};

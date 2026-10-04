import React, { useState } from 'react';
import contentData from '../data/contentData.json';
import { ProductItem } from '../types';
import { 
  Sparkles, 
  Star, 
  Gift, 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  Phone, 
  CheckCircle, 
  X, 
  ZoomIn, 
  Building2, 
  User, 
  Briefcase, 
  Tag, 
  Gavel,
  ShieldCheck
} from 'lucide-react';

export const FeaturedProducts: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [interestedProduct, setInterestedProduct] = useState<ProductItem | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [activeCarouselIdx, setActiveCarouselIdx] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');

  const categories = contentData.featuredProducts.categories;
  const allProducts: ProductItem[] = contentData.featuredProducts.items;

  const filteredProducts = selectedCategory === 'all'
    ? allProducts
    : allProducts.filter((p) => p.category === selectedCategory);

  const getCategoryIcon = (catId: string) => {
    switch (catId) {
      case 'personal':
        return <User className="w-3.5 h-3.5" />;
      case 'household':
        return <Building2 className="w-3.5 h-3.5" />;
      case 'corporate':
        return <Briefcase className="w-3.5 h-3.5" />;
      case 'promotion':
        return <Tag className="w-3.5 h-3.5" />;
      case 'auction':
        return <Gavel className="w-3.5 h-3.5" />;
      default:
        return <Sparkles className="w-3.5 h-3.5" />;
    }
  };

  const handleNextSlide = () => {
    setActiveCarouselIdx((prev) => (prev + 1) % filteredProducts.length);
  };

  const handlePrevSlide = () => {
    setActiveCarouselIdx((prev) => (prev - 1 + filteredProducts.length) % filteredProducts.length);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Lightbox for poster zoom */}
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
              alt="Chi tiết poster"
              className="w-full h-auto max-h-[85vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}

      {/* "Tôi quan tâm" Modal Notification */}
      {interestedProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ring-red-50/60">
              <Heart className="w-7 h-7 fill-red-600" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 text-center mb-1">
              Ghi Nhận Mối Quan Tâm
            </h3>
            <p className="text-xs font-semibold text-blue-700 text-center uppercase tracking-wide mb-4">
              {interestedProduct.title}
            </p>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-slate-700 text-xs sm:text-sm leading-relaxed space-y-3 mb-6">
              <p>
                Cảm ơn Quý khách đã quan tâm đến sản phẩm/dịch vụ này. Quý khách vui lòng liên hệ cán bộ VietinBank tại quầy để được tư vấn chi tiết.
              </p>
              <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                <span className="text-[11px] text-slate-400 block mb-0.5">Hoặc liên hệ trực tiếp:</span>
                <span className="font-bold text-slate-900 block text-sm">
                  Chuyên viên tư vấn {contentData.featuredProducts.consultant.name}
                </span>
                <span className="text-xs font-bold text-red-600">
                  Số điện thoại: {contentData.featuredProducts.consultant.phoneFormatted}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <a
                href={`tel:${contentData.featuredProducts.consultant.phone}`}
                className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>Gọi chuyên viên ngay ({contentData.featuredProducts.consultant.phoneFormatted})</span>
              </a>

              <button
                onClick={() => setInterestedProduct(null)}
                className="py-3 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Banner - Special prominent design per instructions */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-sky-900 to-blue-950 p-6 sm:p-10 text-white shadow-xl border-t-2 border-red-500 mb-8 sm:mb-10">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/90 text-white text-xs font-bold uppercase tracking-wider mb-3 shadow-sm">
            <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
            <span>Sản phẩm nổi bật</span>
            <Gift className="w-3.5 h-3.5" />
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-3">
            {contentData.featuredProducts.title}
          </h1>
          <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
            {contentData.featuredProducts.description}
          </p>
        </div>

        {/* Decorative corner icon */}
        <div className="absolute right-4 bottom-4 opacity-15 pointer-events-none hidden md:block">
          <Sparkles className="w-48 h-48 text-white" />
        </div>
      </div>

      {/* Filter Chips & View Mode Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        {/* Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setActiveCarouselIdx(0);
                }}
                className={`whitespace-nowrap px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                  isSelected
                    ? 'bg-blue-700 text-white ring-2 ring-blue-700/20 shadow-md shadow-blue-700/20'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {getCategoryIcon(cat.id)}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* View Mode Toggle: Carousel vs Grid */}
        <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-xl self-end md:self-auto">
          <button
            onClick={() => setViewMode('carousel')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              viewMode === 'carousel' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Dạng Carousel
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              viewMode === 'grid' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Dạng Lưới (Grid)
          </button>
        </div>
      </div>

      {/* View 1: Carousel Mode (Recommended in prompt: "Nên dùng chế độ hiển thị Poster dạng carousel để hấp dẫn hơn") */}
      {viewMode === 'carousel' && filteredProducts.length > 0 && (
        <div className="relative">
          {(() => {
            const currentItem = filteredProducts[activeCarouselIdx] || filteredProducts[0];
            return (
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden transition-all duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
                  {/* Poster Image (7 cols) */}
                  <div className="lg:col-span-7 bg-slate-100 relative group flex items-center justify-center p-4 sm:p-8 min-h-[380px] sm:min-h-[460px]">
                    <img
                      src={currentItem.image}
                      alt={currentItem.title}
                      className="max-h-[420px] w-auto max-w-full object-contain rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-102"
                      loading="lazy"
                    />

                    <button
                      onClick={() => setPreviewImage(currentItem.image)}
                      className="absolute bottom-6 right-6 p-2.5 rounded-xl bg-slate-900/70 text-white hover:bg-slate-900 transition-colors flex items-center gap-1.5 text-xs font-medium backdrop-blur-sm cursor-pointer"
                    >
                      <ZoomIn className="w-4 h-4" />
                      <span>Xem phóng to</span>
                    </button>

                    {/* Carousel Nav Arrows */}
                    {filteredProducts.length > 1 && (
                      <>
                        <button
                          onClick={handlePrevSlide}
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 shadow-lg text-slate-800 hover:bg-white flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
                          aria-label="Poster trước"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                          onClick={handleNextSlide}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 shadow-lg text-slate-800 hover:bg-white flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
                          aria-label="Poster sau"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Poster Details & Action (5 cols) */}
                  <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between h-full space-y-6">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                          {currentItem.categoryLabel}
                        </span>
                        <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-red-100 text-red-700 border border-red-200 flex items-center gap-1">
                          <Star className="w-3 h-3 fill-red-600" />
                          {currentItem.badge}
                        </span>
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
                        {currentItem.title}
                      </h2>
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                        {currentItem.description}
                      </p>

                      {/* Highlights */}
                      <div className="space-y-2">
                        {currentItem.highlights.map((h, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 space-y-3">
                      {/* Action Button: Tôi quan tâm */}
                      <button
                        onClick={() => setInterestedProduct(currentItem)}
                        className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
                      >
                        <Heart className="w-5 h-5 fill-white" />
                        <span>Tôi quan tâm sản phẩm này</span>
                      </button>

                      <p className="text-[11px] text-center text-slate-400">
                        Bấm để nhận tư vấn trực tiếp từ Chuyên viên Lê Hoàng Hiệp ({contentData.featuredProducts.consultant.phoneFormatted})
                      </p>
                    </div>
                  </div>
                </div>

                {/* Carousel Pagination Dots */}
                {filteredProducts.length > 1 && (
                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-2">
                    {filteredProducts.map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        onClick={() => setActiveCarouselIdx(dotIdx)}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          activeCarouselIdx === dotIdx ? 'w-8 bg-blue-700' : 'w-2 bg-slate-300'
                        }`}
                        aria-label={`Slide ${dotIdx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* View 2: Grid Mode (Alternative layout for quick scanning) */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              <div>
                <div 
                  onClick={() => setPreviewImage(prod.image)}
                  className="relative aspect-[4/3] bg-slate-100 p-4 flex items-center justify-center cursor-pointer overflow-hidden"
                >
                  <img
                    src={prod.image}
                    alt={prod.title}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 text-blue-900 shadow-xs backdrop-blur-xs">
                      {prod.categoryLabel}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-extrabold text-base text-slate-900 group-hover:text-blue-700 transition-colors mb-2 line-clamp-1">
                    {prod.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                    {prod.description}
                  </p>
                  <div className="space-y-1.5 mb-2">
                    {prod.highlights.slice(0, 2).map((h, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="line-clamp-1">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => setInterestedProduct(prod)}
                  className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5 fill-white" />
                  <span>Tôi quan tâm</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

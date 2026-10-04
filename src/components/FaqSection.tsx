import React, { useState } from 'react';
import contentData from '../data/contentData.json';
import { FaqTopic } from '../types';
import { 
  KeyRound, 
  CreditCard, 
  Fingerprint, 
  Receipt, 
  CalendarClock, 
  ChevronRight, 
  ArrowLeft, 
  ExternalLink, 
  CheckCircle2, 
  XCircle, 
  Phone, 
  HelpCircle,
  Video,
  ZoomIn,
  X,
  MessageSquareHeart,
  Smile,
  LogOut
} from 'lucide-react';

interface FaqSectionProps {
  onBackToMainMenu?: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ onBackToMainMenu }) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [feedbackState, setFeedbackState] = useState<'none' | 'resolved' | 'unresolved' | 'ended'>('none');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const topics: FaqTopic[] = contentData.faq.topics;
  const currentTopic = topics.find((t) => t.id === selectedTopicId);

  const getTopicIcon = (id: string) => {
    switch (id) {
      case 'forgot-password':
        return <KeyRound className="w-6 h-6 text-amber-500" />;
      case 'close-card':
        return <CreditCard className="w-6 h-6 text-blue-600" />;
      case 'biometrics':
        return <Fingerprint className="w-6 h-6 text-emerald-600" />;
      case 'e-tax':
        return <Receipt className="w-6 h-6 text-indigo-600" />;
      case 'book-appointment':
        return <CalendarClock className="w-6 h-6 text-rose-500" />;
      default:
        return <HelpCircle className="w-6 h-6 text-blue-600" />;
    }
  };

  const handleSelectTopic = (id: string) => {
    setSelectedTopicId(id);
    setFeedbackState('none');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setSelectedTopicId(null);
    setFeedbackState('none');
  };

  const handleEndChat = () => {
    setFeedbackState('ended');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Lightbox Modal for Step Image */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl p-2 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-slate-900/70 text-white hover:bg-slate-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={previewImage}
              alt="Chi tiết bước hướng dẫn"
              className="w-full h-auto max-h-[85vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}

      {/* Main Ended State Modal */}
      {feedbackState === 'ended' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ring-blue-50/60">
              <Smile className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">VietinBank Xin Cảm Ơn!</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              {contentData.faq.feedbackMessages.endChat}
            </p>
            <button
              onClick={() => {
                setSelectedTopicId(null);
                setFeedbackState('none');
                if (onBackToMainMenu) onBackToMainMenu();
              }}
              className="w-full py-3 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm transition-colors shadow-md shadow-blue-600/20"
            >
              Quay lại màn hình chính
            </button>
          </div>
        </div>
      )}

      {/* View Mode 1: List of Topics */}
      {!selectedTopicId && (
        <div>
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold mb-3">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Hỗ trợ thao tác trực tiếp tại Quầy</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-950 tracking-tight mb-2">
              {contentData.faq.subtitle}
            </h1>
            <p className="text-sm sm:text-base text-slate-600">
              Chọn nội dung Quý khách cần hướng dẫn để xem từng bước thao tác chi tiết kèm hình ảnh minh họa thực tế.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {topics.map((topic, index) => (
              <div
                key={topic.id}
                onClick={() => handleSelectTopic(topic.id)}
                className="group relative bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between"
              >
                {/* Subtle top color strip */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-sky-500 to-red-500 group-hover:h-2 transition-all" />

                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                      {getTopicIcon(topic.id)}
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/50">
                      {topic.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors mb-1.5 line-clamp-1">
                    {index + 1}. {topic.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                    {topic.shortDesc}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-blue-700 font-semibold">
                  <span className="flex items-center gap-1.5">
                    {topic.steps.length} bước hướng dẫn
                  </span>
                  <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Xem ngay</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Help Card */}
          <div className="mt-8 p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-blue-900 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <h4 className="font-bold text-base text-white">Cần trợ giúp trực tiếp tại quầy?</h4>
                <p className="text-xs text-blue-200">
                  Gặp {contentData.faq.consultant.name} hoặc gọi số điện thoại: {contentData.faq.consultant.phoneFormatted}
                </p>
              </div>
            </div>
            <a
              href={`tel:${contentData.faq.consultant.phone}`}
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shrink-0 transition-transform active:scale-95"
            >
              Gọi tư vấn ngay
            </a>
          </div>
        </div>
      )}

      {/* View Mode 2: Detailed Steps of Selected Topic */}
      {selectedTopicId && currentTopic && (
        <div className="animate-in fade-in duration-300">
          {/* Top Bar Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200">
            <button
              onClick={handleBackToList}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại danh sách câu hỏi</span>
            </button>

            <div className="flex items-center gap-2">
              <a
                href={currentTopic.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
              >
                <Video className="w-4 h-4" />
                <span>Xem Video YouTube</span>
                <ExternalLink className="w-3.5 h-3.5 ml-0.5 opacity-80" />
              </a>
            </div>
          </div>

          {/* Topic Title Header */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-sm mb-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="p-2 rounded-xl bg-blue-50 border border-blue-100">
                {getTopicIcon(currentTopic.id)}
              </span>
              <div>
                <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wide">
                  Hướng dẫn chi tiết
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {currentTopic.title}
                </h2>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              {currentTopic.shortDesc}
            </p>
          </div>

          {/* Steps Timeline & Cards */}
          <div className="space-y-6">
            {currentTopic.steps.map((step) => (
              <div
                key={step.step}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-4 sm:p-5 flex flex-col md:flex-row gap-5 items-start">
                  {/* Step Image with Thumbnail Preview */}
                  <div className="w-full md:w-56 shrink-0 relative group">
                    <div 
                      onClick={() => setPreviewImage(step.image)}
                      className="cursor-pointer relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100 aspect-[4/3] flex items-center justify-center"
                    >
                      <img
                        src={step.image}
                        alt={`Minh họa bước ${step.step}`}
                        className="w-full h-full object-contain p-1 transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLElement;
                          target.style.opacity = '0.7';
                        }}
                      />
                      <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-semibold">
                        <ZoomIn className="w-4 h-4" />
                        <span>Phóng to ảnh</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-center text-slate-400 mt-1">
                      Ảnh minh họa bước {step.step}
                    </p>
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="inline-flex items-center gap-2 mb-2">
                        <span className="w-7 h-7 rounded-full bg-blue-700 text-white font-extrabold text-xs flex items-center justify-center shadow-sm">
                          {step.step}
                        </span>
                        <h4 className="font-bold text-slate-900 text-base sm:text-lg">
                          Bước {step.step}: {step.title}
                        </h4>
                      </div>
                      <p className="text-slate-700 text-sm leading-relaxed sm:text-base mt-2 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                        {step.desc}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                      <span>Thao tác trực tiếp trên App VietinBank iPay</span>
                      <button
                        onClick={() => setPreviewImage(step.image)}
                        className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                      >
                        <ZoomIn className="w-3.5 h-3.5" /> Xem ảnh lớn
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* End of content Video Banner */}
          <div className="mt-8 p-5 sm:p-6 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white rounded-2xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-base">Xem video hướng dẫn trực quan trên YouTube</h4>
                <p className="text-xs text-red-100 mt-0.5">
                  Theo dõi từng thao tác sống động trên màn hình điện thoại
                </p>
              </div>
            </div>
            <a
              href={currentTopic.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-red-700 font-bold text-xs shrink-0 shadow-md flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
            >
              <span>Mở Video YouTube</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Feedback & Confirmation Area */}
          <div className="mt-8 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-md text-center">
            <div className="w-12 h-12 bg-blue-50 text-blue-700 rounded-full flex items-center justify-center mx-auto mb-3">
              <MessageSquareHeart className="w-6 h-6" />
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
              {contentData.faq.feedbackMessages.question}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto mb-6">
              Phản hồi của Quý khách giúp VietinBank phục vụ chu đáo và hoàn thiện chất lượng hỗ trợ tốt hơn.
            </p>

            {/* If no feedback yet */}
            {feedbackState === 'none' && (
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => setFeedbackState('resolved')}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Đã ổn, tôi đã làm được</span>
                </button>

                <button
                  onClick={() => setFeedbackState('unresolved')}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Chưa ổn, cần hỗ trợ thêm</span>
                </button>
              </div>
            )}

            {/* Resolved state message */}
            {feedbackState === 'resolved' && (
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 max-w-xl mx-auto mb-6 animate-in fade-in">
                <div className="flex items-center justify-center gap-2 font-bold mb-1">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Thực hiện thành công!</span>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed">
                  {contentData.faq.feedbackMessages.resolved}
                </p>
              </div>
            )}

            {/* Unresolved state message with Consultant direct call */}
            {feedbackState === 'unresolved' && (
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 max-w-xl mx-auto mb-6 animate-in fade-in">
                <p className="text-xs sm:text-sm leading-relaxed mb-3">
                  {contentData.faq.feedbackMessages.unresolved}
                </p>
                <a
                  href={`tel:${contentData.faq.consultant.phone}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Gọi ngay Chuyên viên Hữu Lộc: {contentData.faq.consultant.phoneFormatted}</span>
                </a>
              </div>
            )}

            {/* Navigation Buttons: Quay lại menu chính & Kết thúc cuộc trò chuyện */}
            <div className="pt-6 mt-6 border-t border-slate-100 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleBackToList}
                className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs sm:text-sm shadow-sm transition-colors cursor-pointer"
              >
                Quay lại menu chính
              </button>

              <button
                onClick={handleEndChat}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-slate-500" />
                <span>Kết thúc cuộc trò chuyện</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

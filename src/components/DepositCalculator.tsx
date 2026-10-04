import React, { useState, useMemo } from 'react';
import contentData from '../data/contentData.json';
import { formatCurrencyVND, formatNumber, parseNumberInput } from '../utils/formatters';
import { 
  PiggyBank, 
  Percent, 
  Calendar, 
  Wallet, 
  ExternalLink, 
  Info, 
  CheckCircle2, 
  AlertTriangle,
  PlayCircle,
  HelpCircle
} from 'lucide-react';

export const DepositCalculator: React.FC = () => {
  const [rawAmount, setRawAmount] = useState<string>('100000000'); // 100,000,000 VND
  const [selectedTerm, setSelectedTerm] = useState<number>(6); // 6 months
  const [customRate, setCustomRate] = useState<string>('3.5');
  const [touched, setTouched] = useState({ amount: false, rate: false, term: false });

  const terms = contentData.depositCalc.terms;

  const currentTermObj = terms.find((t) => t.months === selectedTerm);

  // When changing term, auto update interest rate according to the standard tariff
  const handleTermChange = (months: number) => {
    setSelectedTerm(months);
    const found = terms.find((t) => t.months === months);
    if (found) {
      setCustomRate(found.rate.toString());
    }
  };

  const parsedAmount = useMemo(() => parseNumberInput(rawAmount), [rawAmount]);
  const parsedRate = useMemo(() => parseFloat(customRate) || 0, [customRate]);

  // Validations per spec:
  const isAmountValid = parsedAmount >= contentData.depositCalc.minAmount;
  const isTermValid = selectedTerm > 0;
  const isRateValid = parsedRate >= 0 && parsedRate <= 20;

  // Calculation formula:
  // Tiền gửi thông thường trả lãi sau theo kỳ hạn tháng:
  // Tiền lãi = (Số tiền gửi × Lãi suất (%/năm) / 12) × Số tháng
  const calculatedInterest = useMemo(() => {
    if (!isAmountValid || !isTermValid || !isRateValid) return 0;
    return (parsedAmount * (parsedRate / 100) * selectedTerm) / 12;
  }, [parsedAmount, parsedRate, selectedTerm, isAmountValid, isTermValid, isRateValid]);

  const totalMaturityAmount = parsedAmount + calculatedInterest;

  const quickAmounts = [
    { label: '50 Triệu', value: 50000000 },
    { label: '100 Triệu', value: 100000000 },
    { label: '200 Triệu', value: 200000000 },
    { label: '500 Triệu', value: 500000000 },
    { label: '1 Tỷ', value: 1000000000 },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-3">
          <PiggyBank className="w-3.5 h-3.5" />
          <span>Sinh lời an toàn • Lãi suất cạnh tranh</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-950 tracking-tight mb-2">
          {contentData.depositCalc.title}
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          {contentData.depositCalc.subtitle} — Lập kế hoạch tài chính và tối ưu hóa lợi nhuận cho khoản tích lũy của Quý khách.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Inputs */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          {/* Input 1: Số tiền gửi */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-blue-600" />
                <span>Số tiền gửi tiết kiệm (VND)</span>
                <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">Tối thiểu 100.000 VND</span>
            </div>

            <div className="relative">
              <input
                type="text"
                value={formatNumber(parsedAmount)}
                onChange={(e) => {
                  setRawAmount(e.target.value);
                  setTouched((prev) => ({ ...prev, amount: true }));
                }}
                onBlur={() => setTouched((prev) => ({ ...prev, amount: true }))}
                placeholder="Nhập số tiền gửi"
                className={`w-full py-3.5 pl-4 pr-16 text-lg sm:text-xl font-bold rounded-2xl border transition-colors outline-none focus:ring-2 ${
                  touched.amount && !isAmountValid
                    ? 'border-red-400 bg-red-50/30 text-red-900 focus:ring-red-300'
                    : 'border-slate-200 bg-slate-50 text-slate-900 focus:border-blue-600 focus:ring-blue-100'
                }`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                VND
              </span>
            </div>

            {/* Error or validation tip */}
            {touched.amount && !isAmountValid && (
              <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Vui lòng nhập số tiền gửi hợp lệ (lớn hơn 100.000 VND).</span>
              </p>
            )}

            {/* Quick amount chips */}
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {quickAmounts.map((q) => (
                <button
                  key={q.value}
                  type="button"
                  onClick={() => {
                    setRawAmount(q.value.toString());
                    setTouched((prev) => ({ ...prev, amount: true }));
                  }}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
                    parsedAmount === q.value
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input 2: Kỳ hạn gửi */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>Kỳ hạn gửi</span>
                <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-blue-600 font-semibold">
                {currentTermObj?.months} tháng ({currentTermObj?.rate}%/năm)
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
              {terms.map((t) => {
                const isSelected = selectedTerm === t.months;
                return (
                  <button
                    key={t.months}
                    type="button"
                    onClick={() => handleTermChange(t.months)}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-600/20 font-bold shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <span className="text-xs sm:text-sm block">{t.label}</span>
                    <span className="text-[11px] text-red-600 font-bold">{t.rate}%/năm</span>
                  </button>
                );
              })}
            </div>
            {!isTermValid && (
              <p className="mt-1.5 text-xs text-red-600">Vui lòng chọn kỳ hạn gửi.</p>
            )}
          </div>

          {/* Input 3: Lãi suất (%/năm) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Percent className="w-4 h-4 text-blue-600" />
                <span>Lãi suất tham chiếu (%/năm)</span>
                <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">Có thể tùy chỉnh theo chương trình</span>
            </div>

            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0"
                max="20"
                value={customRate}
                onChange={(e) => {
                  setCustomRate(e.target.value);
                  setTouched((prev) => ({ ...prev, rate: true }));
                }}
                className={`w-full py-3 pl-4 pr-16 text-base font-bold rounded-2xl border transition-colors outline-none focus:ring-2 ${
                  touched.rate && !isRateValid
                    ? 'border-red-400 bg-red-50/30 text-red-900 focus:ring-red-300'
                    : 'border-slate-200 bg-slate-50 text-slate-900 focus:border-blue-600 focus:ring-blue-100'
                }`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                %/năm
              </span>
            </div>

            {touched.rate && !isRateValid && (
              <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Vui lòng nhập lãi suất hợp lệ (từ 0% đến 20%/năm).</span>
              </p>
            )}
          </div>

          {/* Video Guide Link from TikTok */}
          <div className="pt-2">
            <a
              href={contentData.depositCalc.videoGuideUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 to-blue-950 text-white flex items-center justify-between hover:bg-slate-800 transition-colors shadow-sm group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center text-white shrink-0">
                  <PlayCircle className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold block">Video Hướng Dẫn Gửi Tiết Kiệm</span>
                  <span className="text-[10px] text-slate-300 block">Xem kinh nghiệm gửi tiết kiệm an toàn trên TikTok</span>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-white transition-colors" />
            </a>
          </div>
        </div>

        {/* Right Card: Calculation Results */}
        <div className="lg:col-span-5 bg-gradient-to-br from-blue-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                Kết Quả Dự Tính
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Trả lãi cuối kỳ
              </span>
            </div>

            {/* Interest Profit */}
            <div className="my-6">
              <span className="text-xs text-blue-200 block mb-1">Tiền lãi dự tính nhận được</span>
              <div className="text-3xl sm:text-4xl font-black text-amber-400 tracking-tight font-mono">
                {formatCurrencyVND(calculatedInterest)}
              </div>
              <p className="text-[11px] text-blue-300 mt-1">
                Tương đương ước tính ~{formatCurrencyVND(calculatedInterest / (selectedTerm || 1))}/tháng
              </p>
            </div>

            {/* Breakdown List */}
            <div className="space-y-3 pt-4 border-t border-white/10 text-xs">
              <div className="flex items-center justify-between text-blue-200">
                <span>Tiền gửi ban đầu:</span>
                <span className="font-bold text-white font-mono">{formatCurrencyVND(parsedAmount)}</span>
              </div>
              <div className="flex items-center justify-between text-blue-200">
                <span>Kỳ hạn gửi:</span>
                <span className="font-bold text-white">{selectedTerm} Tháng</span>
              </div>
              <div className="flex items-center justify-between text-blue-200">
                <span>Lãi suất áp dụng:</span>
                <span className="font-bold text-amber-300">{parsedRate}%/năm</span>
              </div>
            </div>

            {/* Total Balance at Maturity */}
            <div className="mt-6 p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm">
              <span className="text-xs text-blue-200 block">Tổng tiền nhận khi đáo hạn (Gốc + Lãi):</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-white block mt-1 font-mono">
                {formatCurrencyVND(totalMaturityAmount)}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 text-[11px] text-blue-300 leading-relaxed flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
            <span>
              Lưu ý: Bảng tính mang tính chất tham khảo. Lãi suất thực tế áp dụng tại thời điểm gửi tiền theo quy định hiện hành của VietinBank. Gửi online qua iPay thường được cộng thêm lãi suất ưu đãi!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import contentData from '../data/contentData.json';
import { formatCurrencyVND, formatNumber, parseNumberInput } from '../utils/formatters';
import { LoanScheduleRow } from '../types';
import { 
  Calculator, 
  Calendar, 
  DollarSign, 
  Percent, 
  Clock, 
  FileSpreadsheet, 
  X, 
  ArrowDownRight, 
  TrendingDown,
  Layers,
  Printer,
  Copy,
  Check
} from 'lucide-react';

export const LoanRepaymentSchedule: React.FC = () => {
  // Inputs per specification: Số tiền vay dạng nhập (không kéo thả)
  const [loanAmountRaw, setLoanAmountRaw] = useState<string>('500000000'); // 500,000,000 VND
  const [loanTermMonths, setLoanTermMonths] = useState<number>(60); // 60 months (5 years)
  const [interestRatePerYear, setInterestRatePerYear] = useState<string>('7.5'); // 7.5%/year
  const [disbursementDate, setDisbursementDate] = useState<string>('2026-10-10');
  const [paymentCycle, setPaymentCycle] = useState<string>('monthly'); // monthly, quarterly, biannual, yearly
  const [paymentDay, setPaymentDay] = useState<number>(25); // 25th of month
  const [roundToThousand, setRoundToThousand] = useState<boolean>(true); // round to 1,000 VND
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [copiedSchedule, setCopiedSchedule] = useState<boolean>(false);

  const parsedAmount = useMemo(() => parseNumberInput(loanAmountRaw), [loanAmountRaw]);
  const parsedRate = useMemo(() => parseFloat(interestRatePerYear) || 0, [interestRatePerYear]);

  // Selected cycle configuration
  const currentCycle = useMemo(() => {
    return contentData.loanCalc.cycles.find((c) => c.id === paymentCycle) || contentData.loanCalc.cycles[0];
  }, [paymentCycle]);

  // Total periods in the loan term
  const totalPeriods = useMemo(() => {
    const monthsPerPeriod = currentCycle.periodMonths;
    return Math.max(1, Math.round(loanTermMonths / monthsPerPeriod));
  }, [loanTermMonths, currentCycle]);

  // Generate payment dates based on disbursement date, cycle, and paymentDay
  const generateDates = useMemo(() => {
    const dates: string[] = [];
    const disbDateObj = new Date(disbursementDate);
    if (isNaN(disbDateObj.getTime())) return dates;

    const baseYear = disbDateObj.getFullYear();
    const baseMonth = disbDateObj.getMonth();

    for (let i = 1; i <= totalPeriods; i++) {
      const monthOffset = i * currentCycle.periodMonths;
      const targetDate = new Date(baseYear, baseMonth + monthOffset, paymentDay);
      
      const dayStr = String(targetDate.getDate()).padStart(2, '0');
      const monthStr = String(targetDate.getMonth() + 1).padStart(2, '0');
      const yearStr = targetDate.getFullYear();
      dates.push(`${dayStr}/${monthStr}/${yearStr}`);
    }
    return dates;
  }, [disbursementDate, totalPeriods, currentCycle, paymentDay]);

  // Business Logic Calculation: Trả gốc đều, lãi trên dư nợ giảm dần
  const { schedule, totalPrincipalPaid, totalInterestPaid, totalPaymentAll } = useMemo(() => {
    if (parsedAmount <= 0 || totalPeriods <= 0) {
      return { schedule: [], totalPrincipalPaid: 0, totalInterestPaid: 0, totalPaymentAll: 0 };
    }

    const roundValue = (val: number) => {
      return roundToThousand ? Math.round(val / 1000) * 1000 : Math.round(val);
    };

    // Periodic interest rate
    // Lãi suất kỳ = Lãi suất năm / Chu kỳ trả nợ (12 for monthly, 4 for quarterly, etc.)
    const periodicRate = (parsedRate / 100) / currentCycle.divisor;

    // Standard principal per period
    const rawPrincipalPerPeriod = parsedAmount / totalPeriods;
    const roundedPrincipal = roundValue(rawPrincipalPerPeriod);

    const rows: LoanScheduleRow[] = [];
    let currentBalance = parsedAmount;
    let accumulatedPrincipal = 0;
    let accumulatedInterest = 0;

    for (let period = 1; period <= totalPeriods; period++) {
      const beginningBalance = currentBalance;
      
      // Calculate period interest on beginning balance
      const rawInterest = beginningBalance * periodicRate;
      const periodInterest = roundValue(rawInterest);

      // Principal for this period (adjust last period for rounding errors)
      let periodPrincipal = roundedPrincipal;
      if (period === totalPeriods) {
        periodPrincipal = parsedAmount - accumulatedPrincipal;
      } else if (accumulatedPrincipal + periodPrincipal > parsedAmount) {
        periodPrincipal = parsedAmount - accumulatedPrincipal;
      }

      const totalPeriodPayment = periodPrincipal + periodInterest;
      currentBalance = Math.max(0, currentBalance - periodPrincipal);
      accumulatedPrincipal += periodPrincipal;
      accumulatedInterest += periodInterest;

      rows.push({
        period,
        date: generateDates[period - 1] || `Kỳ ${period}`,
        beginningBalance,
        principal: periodPrincipal,
        interest: periodInterest,
        totalPayment: totalPeriodPayment,
        endingBalance: currentBalance,
      });
    }

    return {
      schedule: rows,
      totalPrincipalPaid: accumulatedPrincipal,
      totalInterestPaid: accumulatedInterest,
      totalPaymentAll: accumulatedPrincipal + accumulatedInterest,
    };
  }, [parsedAmount, totalPeriods, parsedRate, currentCycle, roundToThousand, generateDates]);

  // First & Last payment amounts for summary
  const firstPayment = schedule.length > 0 ? schedule[0].totalPayment : 0;
  const lastPayment = schedule.length > 0 ? schedule[schedule.length - 1].totalPayment : 0;

  const handleCopySchedule = () => {
    let tsv = 'Kỳ\tKỳ trả nợ\tSố gốc còn lại\tGốc\tLãi\tTổng Gốc + Lãi\n';
    schedule.forEach((row) => {
      tsv += `${row.period}\t${row.date}\t${row.beginningBalance}\t${row.principal}\t${row.interest}\t${row.totalPayment}\n`;
    });
    navigator.clipboard.writeText(tsv);
    setCopiedSchedule(true);
    setTimeout(() => setCopiedSchedule(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold mb-3">
          <Calculator className="w-3.5 h-3.5" />
          <span>Kế hoạch tài chính minh bạch</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-950 tracking-tight mb-2">
          {contentData.loanCalc.title}
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          {contentData.loanCalc.subtitle} — Lập kế hoạch trả nợ chi tiết, dự trù dòng tiền và quản lý tài chính chuẩn xác.
        </p>
      </div>

      {/* Main Grid: Form Inputs + Summary Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
        {/* Left Inputs (8 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-blue-700" />
              <span>Thông tin khoản vay</span>
            </h3>
            <span className="text-xs text-blue-600 font-medium">Trả gốc đều hàng kỳ</span>
          </div>

          {/* Input: Số tiền vay dạng nhập */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-blue-600" />
                <span>Số tiền vay (VND)</span>
                <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-blue-700 font-semibold">
                {formatCurrencyVND(parsedAmount)}
              </span>
            </div>

            <div className="relative">
              <input
                type="text"
                value={formatNumber(parsedAmount)}
                onChange={(e) => setLoanAmountRaw(e.target.value)}
                placeholder="Nhập số tiền vay..."
                className="w-full py-3.5 pl-4 pr-16 text-lg sm:text-xl font-bold rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-colors"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                VND
              </span>
            </div>

            {/* Quick Amounts */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[100000000, 300000000, 500000000, 1000000000, 2000000000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setLoanAmountRaw(amt.toString())}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
                    parsedAmount === amt
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {amt >= 1000000000 ? `${amt / 1000000000} Tỷ` : `${amt / 1000000} Tr`}
                </button>
              ))}
            </div>
          </div>

          {/* Row: Thời gian vay & Lãi suất năm */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Thời gian vay (tháng) */}
            <div>
              <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1 mb-1.5">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Thời gian vay (Tháng)</span>
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="360"
                  value={loanTermMonths}
                  onChange={(e) => setLoanTermMonths(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="w-full py-3 pl-4 pr-16 text-base font-bold rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  Tháng ({Math.floor(loanTermMonths / 12)} năm)
                </span>
              </div>
            </div>

            {/* Lãi suất (%/năm) */}
            <div>
              <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1 mb-1.5">
                <Percent className="w-4 h-4 text-blue-600" />
                <span>Lãi suất vay (%/năm)</span>
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="30"
                  value={interestRatePerYear}
                  onChange={(e) => setInterestRatePerYear(e.target.value)}
                  className="w-full py-3 pl-4 pr-16 text-base font-bold rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  %/năm
                </span>
              </div>
            </div>
          </div>

          {/* Row: Ngày giải ngân & Chu kỳ trả nợ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Ngày giải ngân */}
            <div>
              <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1 mb-1.5">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>Ngày giải ngân</span>
              </label>
              <input
                type="date"
                value={disbursementDate}
                onChange={(e) => setDisbursementDate(e.target.value)}
                className="w-full py-3 px-4 text-sm font-semibold rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
              />
            </div>

            {/* Chu kỳ trả nợ */}
            <div>
              <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1 mb-1.5">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Chu kỳ trả nợ</span>
              </label>
              <select
                value={paymentCycle}
                onChange={(e) => setPaymentCycle(e.target.value)}
                className="w-full py-3 px-4 text-sm font-semibold rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer"
              >
                {contentData.loanCalc.cycles.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.divisor === 12 ? '1 tháng/kỳ' : c.divisor === 4 ? '3 tháng/kỳ' : `${c.periodMonths} tháng/kỳ`})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Ngày trả nợ định kỳ & Làm tròn */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Ngày trả nợ định kỳ trong tháng
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={paymentDay}
                  onChange={(e) => setPaymentDay(Math.min(31, Math.max(1, parseInt(e.target.value, 10) || 1)))}
                  className="w-24 py-2.5 px-3 text-sm font-bold rounded-xl border border-slate-200 bg-slate-50 text-center"
                />
                <span className="text-xs text-slate-500">hàng tháng (Ví dụ: 25)</span>
              </div>
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={roundToThousand}
                  onChange={(e) => setRoundToThousand(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                />
                <span>Làm tròn đến 1.000 đồng (chuẩn ngân hàng)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Summary Dashboard (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-blue-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                Ước Tính Trả Nợ
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/30">
                {totalPeriods} Kỳ trả nợ
              </span>
            </div>

            {/* Monthly Payment Range (First vs Last) */}
            <div className="my-6">
              <span className="text-xs text-blue-200 block mb-1">Số tiền trả hàng kỳ (giảm dần)</span>
              <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs text-blue-300">Kỳ 1:</span>
                  <span className="text-2xl sm:text-3xl font-black text-amber-400 tracking-tight font-mono">
                    {formatCurrencyVND(firstPayment)}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xs text-blue-300">Kỳ cuối:</span>
                  <span className="text-lg font-bold text-slate-200 font-mono">
                    {formatCurrencyVND(lastPayment)}
                  </span>
                </div>
              </div>
            </div>

            {/* Total Payments Breakdown */}
            <div className="space-y-3 pt-4 border-t border-white/10 text-xs">
              <div className="flex items-center justify-between text-blue-200">
                <span>Tổng nợ gốc:</span>
                <span className="font-bold text-white font-mono">{formatCurrencyVND(totalPrincipalPaid)}</span>
              </div>
              <div className="flex items-center justify-between text-blue-200">
                <span>Tổng tiền lãi phải trả:</span>
                <span className="font-bold text-amber-300 font-mono">{formatCurrencyVND(totalInterestPaid)}</span>
              </div>
              <div className="flex items-center justify-between text-blue-200">
                <span>Tổng tiền gốc + lãi:</span>
                <span className="font-bold text-white text-sm font-mono">{formatCurrencyVND(totalPaymentAll)}</span>
              </div>
            </div>

            {/* Principal per period badge */}
            <div className="mt-5 p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm text-xs">
              <div className="flex items-center justify-between">
                <span className="text-blue-200">Gốc cố định mỗi kỳ:</span>
                <span className="font-bold text-white font-mono">
                  {formatCurrencyVND(parsedAmount / (totalPeriods || 1))}
                </span>
              </div>
            </div>
          </div>

          {/* Button: Xem chi tiết (Modal Popup) */}
          <button
            onClick={() => setShowDetailModal(true)}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-700/40 cursor-pointer transition-transform active:scale-95"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Xem chi tiết lịch trả nợ ({totalPeriods} kỳ)</span>
          </button>
        </div>
      </div>

      {/* Detail Modal: Full Amortization Table */}
      {showDetailModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200 overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">
                  VietinBank Bảng Tính Chi Tiết
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  Lịch Trả Nợ Khoản Vay Dư Nợ Giảm Dần
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Gốc: {formatCurrencyVND(parsedAmount)} • {loanTermMonths} tháng • Lãi {parsedRate}%/năm
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopySchedule}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  {copiedSchedule ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSchedule ? 'Đã chép' : 'Sao chép bảng'}</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>In bảng</span>
                </button>

                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2.5 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Table matching sample from PDF */}
            <div className="flex-1 overflow-auto p-4 sm:p-6">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300 uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-3 text-center w-12">Kỳ</th>
                    <th className="py-3 px-3">Kỳ trả nợ</th>
                    <th className="py-3 px-3 text-right">Số gốc còn lại (Dư nợ)</th>
                    <th className="py-3 px-3 text-right">Gốc trả</th>
                    <th className="py-3 px-3 text-right">Lãi trả</th>
                    <th className="py-3 px-3 text-right">Tổng Gốc + Lãi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono">
                  {/* Period 0: Disbursement row */}
                  <tr className="bg-blue-50/50 font-semibold text-blue-900">
                    <td className="py-2.5 px-3 text-center">0</td>
                    <td className="py-2.5 px-3 font-sans">
                      {disbursementDate.split('-').reverse().join('/')} (Giải ngân)
                    </td>
                    <td className="py-2.5 px-3 text-right">{formatCurrencyVND(parsedAmount)}</td>
                    <td className="py-2.5 px-3 text-right">-</td>
                    <td className="py-2.5 px-3 text-right">-</td>
                    <td className="py-2.5 px-3 text-right">-</td>
                  </tr>

                  {/* Amortization Rows */}
                  {schedule.map((row) => (
                    <tr key={row.period} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-3 text-center font-bold text-slate-800">{row.period}</td>
                      <td className="py-2.5 px-3 font-sans text-slate-700">{row.date}</td>
                      <td className="py-2.5 px-3 text-right text-slate-600">{formatCurrencyVND(row.beginningBalance)}</td>
                      <td className="py-2.5 px-3 text-right font-medium text-slate-900">{formatCurrencyVND(row.principal)}</td>
                      <td className="py-2.5 px-3 text-right text-amber-700">{formatCurrencyVND(row.interest)}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-blue-800">{formatCurrencyVND(row.totalPayment)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-800 text-white font-bold text-xs">
                    <td className="py-3.5 px-3 text-center" colSpan={3}>
                      TỔNG CỘNG
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-emerald-300">
                      {formatCurrencyVND(totalPrincipalPaid)}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-amber-300">
                      {formatCurrencyVND(totalInterestPaid)}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-white text-sm">
                      {formatCurrencyVND(totalPaymentAll)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
              <span>* Bảng tính được lập theo phương thức trả nợ gốc đều, lãi giảm dần theo dư nợ thực tế.</span>
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

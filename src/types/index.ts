export interface FaqStep {
  step: number;
  title: string;
  desc: string;
  image: string;
}

export interface FaqTopic {
  id: string;
  title: string;
  shortDesc: string;
  badge: string;
  videoUrl: string;
  steps: FaqStep[];
}

export interface DepositTerm {
  months: number;
  label: string;
  rate: number;
}

export interface LoanCycle {
  id: string;
  name: string;
  divisor: number;
  periodMonths: number;
}

export interface LoanScheduleRow {
  period: number;
  date: string;
  beginningBalance: number;
  principal: number;
  interest: number;
  totalPayment: number;
  endingBalance: number;
}

export interface ProductItem {
  id: string;
  category: string;
  categoryLabel: string;
  title: string;
  badge: string;
  image: string;
  description: string;
  highlights: string[];
}

export interface BranchItem {
  stt: number;
  branch: string;
  office: string;
  address: string;
  phone: string;
  image: string;
  mapUrl: string;
}

export interface FlappyVoucherWinData {
  score: number;
  voucherCode: string;
  reward: string;
  timestamp: string;
}

export interface FlappyVoucherLoseData {
  score: number;
  timestamp: string;
}

declare global {
  interface Window {
    onFlappyVoucherWin?: (data: FlappyVoucherWinData) => void;
    onFlappyVoucherLose?: (data: FlappyVoucherLoseData) => void;
  }
}

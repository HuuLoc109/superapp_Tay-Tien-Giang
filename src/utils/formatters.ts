export function formatCurrencyVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(Math.round(amount));
}

export function generateVoucherCode(): string {
  const randomSixDigits = Math.floor(100000 + Math.random() * 900000);
  return `VB-${randomSixDigits}`;
}

export function parseNumberInput(value: string): number {
  const cleaned = value.replace(/[^0-9]/g, '');
  return cleaned ? parseInt(cleaned, 10) : 0;
}

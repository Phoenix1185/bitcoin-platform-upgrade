import type { Investment, InvestmentPlan } from '@/types';

export interface InvestmentCalculation {
  dailyReturn: number;
  totalReturn: number;
  totalProfit: number;
  roi: number; // Return on Investment percentage
  endDate: Date;
  daysRemaining: number;
  progress: number; // Percentage of investment period completed
}

/**
 * Calculate investment returns based on plan and amount
 */
export function calculateInvestment(
  amount: number,
  plan: InvestmentPlan,
  startDate: Date = new Date()
): InvestmentCalculation {
  const dailyReturnRate = plan.dailyReturn / 100;
  const dailyReturn = amount * dailyReturnRate;
  const totalReturn = dailyReturn * plan.duration;
  const totalProfit = totalReturn;
  const roi = (totalProfit / amount) * 100;
  
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + plan.duration);
  
  const now = new Date();
  const daysElapsed = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysRemaining = Math.max(0, plan.duration - daysElapsed);
  const progress = Math.min(100, (daysElapsed / plan.duration) * 100);

  return {
    dailyReturn,
    totalReturn,
    totalProfit,
    roi,
    endDate,
    daysRemaining,
    progress,
  };
}

/**
 * Calculate earnings up to current date for an active investment
 */
export function calculateCurrentEarnings(investment: Investment): number {
  const startDate = new Date(investment.startDate);
  const now = new Date();
  const daysElapsed = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const effectiveDays = Math.min(daysElapsed, investment.duration);
  
  const dailyReturn = investment.amount * (investment.dailyReturn / 100);
  return dailyReturn * effectiveDays;
}

/**
 * Calculate projected earnings for a plan
 */
export function calculateProjectedEarnings(
  amount: number,
  plan: InvestmentPlan
): {
  daily: number;
  weekly: number;
  monthly: number;
  total: number;
} {
  const daily = amount * (plan.dailyReturn / 100);
  
  return {
    daily,
    weekly: daily * 7,
    monthly: daily * 30,
    total: daily * plan.duration,
  };
}

/**
 * Format currency amount
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Calculate compound interest over time
 */
export function calculateCompoundInterest(
  principal: number,
  dailyRate: number,
  days: number,
  compoundFrequency: number = 1 // Compound every N days
): number {
  const rate = dailyRate / 100;
  const periods = days / compoundFrequency;
  const ratePerPeriod = rate * compoundFrequency;
  
  return principal * Math.pow(1 + ratePerPeriod, periods);
}

/**
 * Get investment status color
 */
export function getInvestmentStatusColor(status: Investment['status']): string {
  switch (status) {
    case 'active':
      return 'text-green-500';
    case 'completed':
      return 'text-blue-500';
    case 'cancelled':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
}

/**
 * Get investment status badge color
 */
export function getInvestmentStatusBadgeColor(status: Investment['status']): string {
  switch (status) {
    case 'active':
      return 'bg-green-500/20 text-green-500';
    case 'completed':
      return 'bg-blue-500/20 text-blue-500';
    case 'cancelled':
      return 'bg-red-500/20 text-red-500';
    default:
      return 'bg-gray-500/20 text-gray-500';
  }
}

/**
 * Validate investment amount
 */
export function validateInvestmentAmount(
  amount: number,
  plan: InvestmentPlan,
  userBalance: number
): { valid: boolean; error?: string } {
  if (amount <= 0) {
    return { valid: false, error: 'Amount must be greater than 0' };
  }
  
  if (amount < plan.minAmount) {
    return { valid: false, error: `Minimum investment is ${formatCurrency(plan.minAmount)}` };
  }
  
  if (amount > plan.maxAmount) {
    return { valid: false, error: `Maximum investment is ${formatCurrency(plan.maxAmount)}` };
  }
  
  if (amount > userBalance) {
    return { valid: false, error: 'Insufficient balance' };
  }
  
  return { valid: true };
}

/**
 * Generate investment summary for user dashboard
 */
export function generateInvestmentSummary(investments: Investment[]) {
  const activeInvestments = investments.filter(i => i.status === 'active');
  const completedInvestments = investments.filter(i => i.status === 'completed');
  const cancelledInvestments = investments.filter(i => i.status === 'cancelled');
  
  const totalInvested = investments.reduce((sum, i) => sum + i.amount, 0);
  const totalActive = activeInvestments.reduce((sum, i) => sum + i.amount, 0);
  const totalEarned = investments.reduce((sum, i) => sum + i.totalEarned, 0);
  const totalPendingReturns = activeInvestments.reduce((sum, i) => {
    const currentEarnings = calculateCurrentEarnings(i);
    const projectedTotal = i.amount * (i.dailyReturn / 100) * i.duration;
    return sum + (projectedTotal - currentEarnings);
  }, 0);
  
  return {
    totalInvested,
    totalActive,
    totalEarned,
    totalPendingReturns,
    activeCount: activeInvestments.length,
    completedCount: completedInvestments.length,
    cancelledCount: cancelledInvestments.length,
    totalCount: investments.length,
  };
}

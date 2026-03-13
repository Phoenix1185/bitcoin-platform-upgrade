export interface User {
  id: string;
  email: string;
  name: string;
  balance: number;
  totalInvested: number;
  totalReturns: number;
  isAdmin: boolean;
  isFrozen: boolean;
  withdrawalFrozen: boolean;
  createdAt: string;
  kycVerified: boolean;
  kycStatus?: 'pending' | 'approved' | 'rejected' | 'not_submitted';
  kycSubmittedAt?: string;
  kycDocuments?: KYCDocument[];
  preferredCurrency?: string;
  preferredLanguage?: string;
  twoFactorEnabled?: boolean;
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  phoneNumber?: string;
  country?: string;
  dateOfBirth?: string;
  avatar?: string;
}

export interface KYCDocument {
  id: string;
  type: 'passport' | 'drivers_license' | 'national_id' | 'utility_bill' | 'bank_statement';
  status: 'pending' | 'approved' | 'rejected';
  frontImage?: string;
  backImage?: string;
  selfieImage?: string;
  submittedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface InvestmentPlan {
  id: string;
  name: string;
  minAmount: number;
  maxAmount: number;
  dailyReturn: number;
  duration: number;
  featured?: boolean;
}

export interface Investment {
  id: string;
  userId: string;
  planId: string;
  planName: string;
  amount: number;
  dailyReturn: number;
  duration: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'cancelled';
  totalEarned: number;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'investment' | 'return' | 'bonus' | 'penalty';
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  method?: string;
  address?: string;
  createdAt: string;
  processedAt?: string;
  processedBy?: string;
  notes?: string;
}

export interface DepositRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  method: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  txHash?: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  method: string;
  address: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  author: string;
  authorAvatar?: string;
  category: string;
  tags: string[];
  publishedAt: string;
  updatedAt?: string;
  status: 'published' | 'draft' | 'archived';
  featured?: boolean;
  views: number;
}

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  socialLinks: {
    name: string;
    url: string;
    icon: string;
  }[];
  stats: {
    totalInvested: number;
    totalInvestedSuffix: string;
    activeInvestors: number;
    activeInvestorsSuffix: string;
    totalReturns: number;
    totalReturnsSuffix: string;
    uptime: number;
    uptimeSuffix: string;
  };
  depositAddresses: {
    bitcoin: string;
    ethereum: string;
    usdt: {
      trc20: string;
      erc20: string;
      bep20: string;
    };
    usdc: {
      erc20: string;
      bep20: string;
      solana: string;
    };
    bnb: string;
  };
  depositMethods: {
    bitcoin: { enabled: boolean; minAmount: number; };
    ethereum: { enabled: boolean; minAmount: number; };
    usdt: { enabled: boolean; minAmount: number; networks: string[]; };
    usdc: { enabled: boolean; minAmount: number; networks: string[]; };
    bnb: { enabled: boolean; minAmount: number; };
    bank: { enabled: boolean; minAmount: number; bankName: string; accountName: string; accountNumber: string; routingNumber: string; };
  };
  withdrawalSettings: {
    minAmount: number;
    maxAmount: number;
    processingTime: string;
    fee: number;
    feeType: 'fixed' | 'percentage';
  };
  globalWithdrawalFrozen: boolean;
  maintenanceMode: boolean;
  kycRequired: boolean;
  kycThreshold: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface Stats {
  totalInvested: number;
  activeInvestors: number;
  totalReturns: number;
  uptime: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface UserNotification {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'investment' | 'return' | 'kyc' | 'account' | 'system' | 'support' | 'announcement';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  actionText?: string;
  metadata?: Record<string, unknown>;
}

export interface EmailCampaign {
  id: string;
  subject: string;
  body: string;
  recipients: 'all' | 'specific';
  specificUserIds?: string[];
  sentAt?: string;
  status: 'draft' | 'sending' | 'sent';
  createdBy: string;
  createdAt: string;
}

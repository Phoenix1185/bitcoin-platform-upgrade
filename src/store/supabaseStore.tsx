import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, InvestmentPlan, Investment, Transaction, DepositRequest, WithdrawalRequest, BlogPost, SiteSettings, UserNotification } from '@/types';

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  users: User[];
  investmentPlans: InvestmentPlan[];
  investments: Investment[];
  transactions: Transaction[];
  depositRequests: DepositRequest[];
  withdrawalRequests: WithdrawalRequest[];
  blogPosts: BlogPost[];
  siteSettings: SiteSettings;
  notifications: UserNotification[];
  testimonials: { id: string; name: string; role: string; content: string; rating: number; avatar: string; }[];
}

type Action =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'UPDATE_USER_BY_ID'; id: string; payload: Partial<User> }
  | { type: 'SET_INVESTMENT_PLANS'; payload: InvestmentPlan[] }
  | { type: 'SET_INVESTMENTS'; payload: Investment[] }
  | { type: 'ADD_INVESTMENT'; payload: Investment }
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; id: string; payload: Partial<Transaction> }
  | { type: 'SET_DEPOSIT_REQUESTS'; payload: DepositRequest[] }
  | { type: 'ADD_DEPOSIT_REQUEST'; payload: DepositRequest }
  | { type: 'UPDATE_DEPOSIT_REQUEST'; id: string; payload: Partial<DepositRequest> }
  | { type: 'SET_WITHDRAWAL_REQUESTS'; payload: WithdrawalRequest[] }
  | { type: 'ADD_WITHDRAWAL_REQUEST'; payload: WithdrawalRequest }
  | { type: 'UPDATE_WITHDRAWAL_REQUEST'; id: string; payload: Partial<WithdrawalRequest> }
  | { type: 'SET_BLOG_POSTS'; payload: BlogPost[] }
  | { type: 'ADD_BLOG_POST'; payload: BlogPost }
  | { type: 'UPDATE_BLOG_POST'; id: string; payload: Partial<BlogPost> }
  | { type: 'DELETE_BLOG_POST'; id: string }
  | { type: 'SET_SITE_SETTINGS'; payload: Partial<SiteSettings> }
  | { type: 'SET_TESTIMONIALS'; payload: typeof initialState.testimonials }
  | { type: 'SET_NOTIFICATIONS'; payload: UserNotification[] }
  | { type: 'ADD_NOTIFICATION'; payload: UserNotification }
  | { type: 'MARK_NOTIFICATION_READ'; id: string }
  | { type: 'MARK_ALL_NOTIFICATIONS_READ' }
  | { type: 'DELETE_NOTIFICATION'; id: string };

const defaultSiteSettings: SiteSettings = {
  siteName: 'BitWealth',
  siteDescription: 'Your trusted partner in cryptocurrency investment',
  contactEmail: 'support@bitwealth.com',
  contactPhone: '+1 (555) 123-4567',
  contactAddress: '123 Crypto Street, New York, NY 10001',
  socialLinks: [
    { name: 'Twitter', url: 'https://twitter.com', icon: 'twitter' },
    { name: 'Facebook', url: 'https://facebook.com', icon: 'facebook' },
    { name: 'LinkedIn', url: 'https://linkedin.com', icon: 'linkedin' },
    { name: 'Instagram', url: 'https://instagram.com', icon: 'instagram' },
    { name: 'Telegram', url: 'https://t.me', icon: 'telegram' },
    { name: 'YouTube', url: 'https://youtube.com', icon: 'youtube' },
  ],
  stats: {
    totalInvested: 50,
    totalInvestedSuffix: 'M+',
    activeInvestors: 25,
    activeInvestorsSuffix: 'K+',
    totalReturns: 12,
    totalReturnsSuffix: 'M+',
    uptime: 99.9,
    uptimeSuffix: '%',
  },
  depositAddresses: {
    bitcoin: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    ethereum: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    usdt: {
      trc20: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
      erc20: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      bep20: '0x55d398326f99059fF775485246999027B3197955',
    },
    usdc: {
      erc20: '0xA0b86a33E6441E6C7D3D4B4f6c7D8E9f0A1B2C3D',
      bep20: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
      solana: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    },
    bnb: 'bnb1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
  },
  depositMethods: {
    bitcoin: { enabled: true, minAmount: 50 },
    ethereum: { enabled: true, minAmount: 50 },
    usdt: { enabled: true, minAmount: 50, networks: ['trc20', 'erc20', 'bep20'] },
    usdc: { enabled: true, minAmount: 50, networks: ['erc20', 'bep20', 'solana'] },
    bnb: { enabled: true, minAmount: 50 },
    bank: { enabled: false, minAmount: 500, bankName: '', accountName: '', accountNumber: '', routingNumber: '' },
  },
  withdrawalSettings: {
    minAmount: 50,
    maxAmount: 100000,
    processingTime: '24-48 hours',
    fee: 2,
    feeType: 'percentage',
  },
  globalWithdrawalFrozen: false,
  maintenanceMode: false,
  kycRequired: true,
  kycThreshold: 1000,
};

const sampleBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Getting Started with Cryptocurrency Investment',
    slug: 'getting-started-with-cryptocurrency-investment',
    excerpt: 'Learn the basics of cryptocurrency investment and how to start your journey with BitWealth.',
    content: `
      <h2>Introduction to Cryptocurrency Investment</h2>
      <p>Cryptocurrency has revolutionized the way we think about money and investment. With BitWealth, you can start your investment journey with confidence.</p>
      
      <h2>Why Invest in Cryptocurrency?</h2>
      <p>Cryptocurrencies offer several advantages over traditional investments:</p>
      <ul>
        <li>High potential returns</li>
        <li>24/7 market access</li>
        <li>Global accessibility</li>
        <li>Portfolio diversification</li>
      </ul>
      
      <h2>Getting Started with BitWealth</h2>
      <p>Starting your investment journey is simple:</p>
      <ol>
        <li>Create your account</li>
        <li>Complete KYC verification</li>
        <li>Make your first deposit</li>
        <li>Choose an investment plan</li>
        <li>Start earning daily returns</li>
      </ol>
      
      <h2>Risk Management</h2>
      <p>While cryptocurrency offers great potential, it's important to invest responsibly. Only invest what you can afford to lose and consider diversifying your portfolio.</p>
    `,
    coverImage: '/hero-dashboard.jpg',
    author: 'BitWealth Team',
    authorAvatar: '/avatar-1.jpg',
    category: 'Getting Started',
    tags: ['cryptocurrency', 'investment', 'beginners'],
    publishedAt: '2024-01-15T10:00:00Z',
    status: 'published',
    featured: true,
    views: 1250,
  },
  {
    id: '2',
    title: 'Understanding Daily Returns in Crypto Investment',
    slug: 'understanding-daily-returns',
    excerpt: 'Discover how daily returns work and how to maximize your earnings with our investment plans.',
    content: `
      <h2>What Are Daily Returns?</h2>
      <p>Daily returns are the profits you earn on your investment every day. At BitWealth, we offer competitive daily return rates ranging from 5% to 20%.</p>
      
      <h2>How Daily Returns Are Calculated</h2>
      <p>Your daily return is calculated based on your investment amount and the plan's daily return percentage. For example, a $1,000 investment in a plan with 10% daily returns would earn $100 per day.</p>
      
      <h2>Compounding Your Returns</h2>
      <p>One of the most powerful aspects of daily returns is the ability to compound your earnings. By reinvesting your returns, you can accelerate your wealth growth.</p>
      
      <h2>Choosing the Right Plan</h2>
      <p>Select a plan that aligns with your financial goals and risk tolerance. Higher returns typically come with higher risk, so choose wisely.</p>
    `,
    author: 'Sarah Johnson',
    authorAvatar: '/avatar-1.jpg',
    category: 'Education',
    tags: ['returns', 'investment', 'strategy'],
    publishedAt: '2024-01-10T14:30:00Z',
    status: 'published',
    views: 890,
  },
  {
    id: '3',
    title: 'Security Best Practices for Crypto Investors',
    slug: 'security-best-practices',
    excerpt: 'Protect your investments with these essential security tips and best practices.',
    content: `
      <h2>Why Security Matters</h2>
      <p>In the world of cryptocurrency, security is paramount. This guide will help you protect your investments and personal information.</p>
      
      <h2>Enable Two-Factor Authentication</h2>
      <p>Two-factor authentication (2FA) adds an extra layer of security to your account. We strongly recommend enabling it.</p>
      
      <h2>Use Strong, Unique Passwords</h2>
      <p>Create strong passwords that are unique to your BitWealth account. Avoid using the same password across multiple platforms.</p>
      
      <h2>Be Wary of Phishing Attempts</h2>
      <p>Always verify the authenticity of emails and websites. BitWealth will never ask for your password via email.</p>
      
      <h2>Keep Your Software Updated</h2>
      <p>Ensure your devices and browsers are always running the latest security updates.</p>
    `,
    author: 'Michael Chen',
    authorAvatar: '/avatar-2.jpg',
    category: 'Security',
    tags: ['security', '2fa', 'protection'],
    publishedAt: '2024-01-05T09:00:00Z',
    status: 'published',
    views: 1560,
  },
  {
    id: '4',
    title: 'The Future of Cryptocurrency in 2024',
    slug: 'future-of-cryptocurrency-2024',
    excerpt: 'Explore the trends and predictions shaping the cryptocurrency landscape this year.',
    content: `
      <h2>The State of Crypto in 2024</h2>
      <p>As we move through 2024, cryptocurrency continues to evolve and mature as an asset class.</p>
      
      <h2>Key Trends to Watch</h2>
      <ul>
        <li>Institutional adoption</li>
        <li>Regulatory developments</li>
        <li>DeFi innovations</li>
        <li>Layer 2 scaling solutions</li>
      </ul>
      
      <h2>Investment Opportunities</h2>
      <p>The growing maturity of the crypto market presents new opportunities for investors. Platforms like BitWealth make it easier than ever to participate.</p>
      
      <h2>Staying Informed</h2>
      <p>Keep up with the latest developments by following our blog and subscribing to our newsletter.</p>
    `,
    author: 'BitWealth Team',
    authorAvatar: '/avatar-1.jpg',
    category: 'News',
    tags: ['trends', '2024', 'market'],
    publishedAt: '2024-01-01T12:00:00Z',
    status: 'published',
    featured: true,
    views: 2100,
  },
];

const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  users: [],
  investmentPlans: [
    {
      id: '1',
      name: 'Basic Plan',
      minAmount: 100,
      maxAmount: 999,
      dailyReturn: 5,
      duration: 15,
    },
    {
      id: '2',
      name: 'Standard Plan',
      minAmount: 1000,
      maxAmount: 4999,
      dailyReturn: 8,
      duration: 20,
    },
    {
      id: '3',
      name: 'Gold Plan',
      minAmount: 5000,
      maxAmount: 24999,
      dailyReturn: 12,
      duration: 30,
      featured: true,
    },
    {
      id: '4',
      name: 'Platinum Plan',
      minAmount: 25000,
      maxAmount: 49999,
      dailyReturn: 15,
      duration: 45,
    },
    {
      id: '5',
      name: 'Diamond Plan',
      minAmount: 50000,
      maxAmount: 1000000,
      dailyReturn: 20,
      duration: 60,
    },
  ],
  investments: [],
  transactions: [],
  depositRequests: [],
  withdrawalRequests: [],
  blogPosts: sampleBlogPosts,
  siteSettings: defaultSiteSettings,
  notifications: [],
  testimonials: [
    {
      id: '1',
      name: 'Sarah Johnson',
      role: 'Investor since 2022',
      content: 'BitWealth completely changed my financial future. The returns are consistent and the platform is incredibly easy to use. I have recommended it to all my friends and family.',
      rating: 5,
      avatar: '/avatar-1.jpg',
    },
    {
      id: '2',
      name: 'Michael Chen',
      role: 'Crypto Enthusiast',
      content: 'After trying multiple crypto investment platforms, I can confidently say BitWealth is the best. The security features and customer support are unmatched in the industry.',
      rating: 5,
      avatar: '/avatar-2.jpg',
    },
    {
      id: '3',
      name: 'Emma Williams',
      role: 'Business Owner',
      content: 'The Gold Plan has been generating reliable returns every single day. It is become an essential part of my passive income strategy. Highly recommended!',
      rating: 5,
      avatar: '/avatar-3.jpg',
    },
    {
      id: '4',
      name: 'David Brown',
      role: 'Retired Investor',
      content: 'What impressed me most was the excellent customer support. Whenever I had questions, the team was quick to respond and very helpful. A truly professional platform.',
      rating: 5,
      avatar: '/avatar-4.jpg',
    },
  ],
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'LOGIN':
      return { ...state, user: action.payload, isAuthenticated: true, isLoading: false };
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false, isLoading: false };
    case 'UPDATE_USER':
      return { ...state, user: state.user ? { ...state.user, ...action.payload } : null };
    case 'SET_USERS':
      return { ...state, users: action.payload };
    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] };
    case 'UPDATE_USER_BY_ID':
      return {
        ...state,
        users: state.users.map((u) => (u.id === action.id ? { ...u, ...action.payload } : u)),
        user: state.user?.id === action.id ? { ...state.user, ...action.payload } : state.user,
      };
    case 'SET_INVESTMENT_PLANS':
      return { ...state, investmentPlans: action.payload };
    case 'SET_INVESTMENTS':
      return { ...state, investments: action.payload };
    case 'ADD_INVESTMENT':
      return { ...state, investments: [...state.investments, action.payload] };
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [...state.transactions, action.payload] };
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.id ? { ...t, ...action.payload } : t
        ),
      };
    case 'SET_DEPOSIT_REQUESTS':
      return { ...state, depositRequests: action.payload };
    case 'ADD_DEPOSIT_REQUEST':
      return { ...state, depositRequests: [...state.depositRequests, action.payload] };
    case 'UPDATE_DEPOSIT_REQUEST':
      return {
        ...state,
        depositRequests: state.depositRequests.map((d) =>
          d.id === action.id ? { ...d, ...action.payload } : d
        ),
      };
    case 'SET_WITHDRAWAL_REQUESTS':
      return { ...state, withdrawalRequests: action.payload };
    case 'ADD_WITHDRAWAL_REQUEST':
      return { ...state, withdrawalRequests: [...state.withdrawalRequests, action.payload] };
    case 'UPDATE_WITHDRAWAL_REQUEST':
      return {
        ...state,
        withdrawalRequests: state.withdrawalRequests.map((w) =>
          w.id === action.id ? { ...w, ...action.payload } : w
        ),
      };
    case 'SET_BLOG_POSTS':
      return { ...state, blogPosts: action.payload };
    case 'ADD_BLOG_POST':
      return { ...state, blogPosts: [...state.blogPosts, action.payload] };
    case 'UPDATE_BLOG_POST':
      return {
        ...state,
        blogPosts: state.blogPosts.map((p) =>
          p.id === action.id ? { ...p, ...action.payload } : p
        ),
      };
    case 'DELETE_BLOG_POST':
      return {
        ...state,
        blogPosts: state.blogPosts.filter((p) => p.id !== action.id),
      };
    case 'SET_SITE_SETTINGS':
      return {
        ...state,
        siteSettings: { ...state.siteSettings, ...action.payload },
      };
    case 'SET_TESTIMONIALS':
      return { ...state, testimonials: action.payload };
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
    case 'ADD_NOTIFICATION':
      return { 
        ...state, 
        notifications: [action.payload, ...state.notifications].slice(0, 100) 
      };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.id ? { ...n, isRead: true } : n
        ),
      };
    case 'MARK_ALL_NOTIFICATIONS_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      };
    case 'DELETE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.id),
      };
    default:
      return state;
  }
}

const StoreContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

// Helper function to transform Supabase profile to User type
const transformProfile = (profile: any): User => ({
  id: profile.id,
  email: profile.email,
  name: profile.name,
  balance: profile.balance || 0,
  totalInvested: profile.total_invested || 0,
  totalReturns: profile.total_returns || 0,
  isAdmin: profile.is_admin || false,
  isFrozen: profile.is_frozen || false,
  withdrawalFrozen: profile.withdrawal_frozen || false,
  createdAt: profile.created_at,
  kycVerified: profile.kyc_verified || false,
  kycStatus: profile.kyc_status || 'not_submitted',
  kycSubmittedAt: profile.kyc_submitted_at,
  kycDocuments: profile.kyc_documents,
  preferredCurrency: profile.preferred_currency || 'USD',
  preferredLanguage: profile.preferred_language || 'en',
  twoFactorEnabled: profile.two_factor_enabled || false,
  emailNotifications: profile.email_notifications ?? true,
  smsNotifications: profile.sms_notifications || false,
  phoneNumber: profile.phone_number,
  country: profile.country,
  dateOfBirth: profile.date_of_birth,
  avatar: profile.avatar,
});

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Initialize auth state from Supabase
  useEffect(() => {
    const initAuth = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Fetch user profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profile) {
            dispatch({ type: 'LOGIN', payload: transformProfile(profile) });
          }
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          dispatch({ type: 'LOGIN', payload: transformProfile(profile) });
        }
      } else if (event === 'SIGNED_OUT') {
        dispatch({ type: 'LOGOUT' });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch data when authenticated
  useEffect(() => {
    if (!state.isAuthenticated) return;

    const fetchData = async () => {
      try {
        // Fetch users (admin only)
        if (state.user?.isAdmin) {
          const { data: users } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (users) {
            dispatch({ type: 'SET_USERS', payload: users.map(transformProfile) });
          }
        }

        // Fetch investment plans
        const { data: plans } = await supabase
          .from('investment_plans')
          .select('*')
          .order('min_amount', { ascending: true });
        
        if (plans && plans.length > 0) {
          dispatch({ type: 'SET_INVESTMENT_PLANS', payload: plans });
        }

        // Fetch user's investments
        const { data: investments } = await supabase
          .from('investments')
          .select('*')
          .eq('user_id', state.user?.id)
          .order('created_at', { ascending: false });
        
        if (investments) {
          dispatch({ type: 'SET_INVESTMENTS', payload: investments });
        }

        // Fetch user's transactions
        const { data: transactions } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', state.user?.id)
          .order('created_at', { ascending: false });
        
        if (transactions) {
          dispatch({ type: 'SET_TRANSACTIONS', payload: transactions });
        }

        // Fetch deposit requests
        const depositsQuery = state.user?.isAdmin 
          ? supabase.from('deposits').select('*').order('created_at', { ascending: false })
          : supabase.from('deposits').select('*').eq('user_id', state.user?.id).order('created_at', { ascending: false });
        
        const { data: deposits } = await depositsQuery;
        if (deposits) {
          dispatch({ type: 'SET_DEPOSIT_REQUESTS', payload: deposits });
        }

        // Fetch withdrawal requests
        const withdrawalsQuery = state.user?.isAdmin
          ? supabase.from('withdrawals').select('*').order('created_at', { ascending: false })
          : supabase.from('withdrawals').select('*').eq('user_id', state.user?.id).order('created_at', { ascending: false });
        
        const { data: withdrawals } = await withdrawalsQuery;
        if (withdrawals) {
          dispatch({ type: 'SET_WITHDRAWAL_REQUESTS', payload: withdrawals });
        }

        // Fetch notifications
        const { data: notifications } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', state.user?.id)
          .order('created_at', { ascending: false });
        
        if (notifications) {
          dispatch({ type: 'SET_NOTIFICATIONS', payload: notifications });
        }

        // Fetch site settings
        const { data: settings } = await supabase
          .from('site_settings')
          .select('*')
          .single();
        
        if (settings) {
          dispatch({ type: 'SET_SITE_SETTINGS', payload: settings });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    // Set up realtime subscriptions
    const subscriptions: ReturnType<typeof supabase.channel>[] = [];

    // Subscribe to profile changes
    const profileChannel = supabase
      .channel('profile_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'profiles', filter: `id=eq.${state.user?.id}` },
        (payload) => {
          if (payload.new) {
            dispatch({ type: 'UPDATE_USER', payload: transformProfile(payload.new) });
          }
        }
      )
      .subscribe();
    subscriptions.push(profileChannel);

    // Subscribe to notifications
    const notificationsChannel = supabase
      .channel('notifications')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${state.user?.id}` },
        (payload) => {
          dispatch({ type: 'ADD_NOTIFICATION', payload: payload.new as UserNotification });
        }
      )
      .subscribe();
    subscriptions.push(notificationsChannel);

    return () => {
      subscriptions.forEach(sub => sub.unsubscribe());
    };
  }, [state.isAuthenticated, state.user?.id, state.user?.isAdmin]);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}

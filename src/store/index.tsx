import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, Investment, InvestmentPlan, Transaction, UserNotification, SiteSettings, SupportTicket, BlogPost, Testimonial } from '@/types';

interface State {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  investments: Investment[];
  investmentPlans: InvestmentPlan[];
  transactions: Transaction[];
  notifications: UserNotification[];
  siteSettings: SiteSettings | null;
  supportTickets: SupportTicket[];
  blogPosts: BlogPost[];
  testimonials: Testimonial[];
  unreadNotifications: number;
}

type Action =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'SET_INVESTMENTS'; payload: Investment[] }
  | { type: 'ADD_INVESTMENT'; payload: Investment }
  | { type: 'SET_INVESTMENT_PLANS'; payload: InvestmentPlan[] }
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'SET_NOTIFICATIONS'; payload: UserNotification[] }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'MARK_ALL_NOTIFICATIONS_READ' }
  | { type: 'DELETE_NOTIFICATION'; payload: string }
  | { type: 'ADD_NOTIFICATION'; payload: UserNotification }
  | { type: 'SET_SITE_SETTINGS'; payload: SiteSettings }
  | { type: 'SET_SUPPORT_TICKETS'; payload: SupportTicket[] }
  | { type: 'SET_BLOG_POSTS'; payload: BlogPost[] }
  | { type: 'ADD_BLOG_POST'; payload: BlogPost }
  | { type: 'UPDATE_BLOG_POST'; payload: BlogPost }
  | { type: 'DELETE_BLOG_POST'; payload: string }
  | { type: 'SET_TESTIMONIALS'; payload: Testimonial[] }
  | { type: 'UPDATE_BALANCE'; payload: number }
  | { type: 'UPDATE_STATS'; payload: { totalInvested?: number; totalReturns?: number } };

const initialState: State = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  investments: [],
  investmentPlans: [],
  transactions: [],
  notifications: [],
  siteSettings: null,
  supportTickets: [],
  blogPosts: [],
  testimonials: [],
  unreadNotifications: 0,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...initialState,
        isLoading: false,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    case 'SET_INVESTMENTS':
      return { ...state, investments: action.payload };
    case 'ADD_INVESTMENT':
      return { ...state, investments: [...state.investments, action.payload] };
    case 'SET_INVESTMENT_PLANS':
      return { ...state, investmentPlans: action.payload };
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [...state.transactions, action.payload] };
    case 'SET_NOTIFICATIONS':
      return {
        ...state,
        notifications: action.payload,
        unreadNotifications: action.payload.filter((n) => !n.isRead).length,
      };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.payload ? { ...n, isRead: true } : n
        ),
        unreadNotifications: Math.max(0, state.unreadNotifications - 1),
      };
    case 'MARK_ALL_NOTIFICATIONS_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        unreadNotifications: 0,
      };
    case 'DELETE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.payload),
      };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        unreadNotifications: state.unreadNotifications + 1,
      };
    case 'SET_SITE_SETTINGS':
      return { ...state, siteSettings: action.payload };
    case 'SET_SUPPORT_TICKETS':
      return { ...state, supportTickets: action.payload };
    case 'SET_BLOG_POSTS':
      return { ...state, blogPosts: action.payload };
    case 'ADD_BLOG_POST':
      return { ...state, blogPosts: [action.payload, ...state.blogPosts] };
    case 'UPDATE_BLOG_POST':
      return {
        ...state,
        blogPosts: state.blogPosts.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
      };
    case 'DELETE_BLOG_POST':
      return {
        ...state,
        blogPosts: state.blogPosts.filter((p) => p.id !== action.payload),
      };
    case 'SET_TESTIMONIALS':
      return { ...state, testimonials: action.payload };
    case 'UPDATE_BALANCE':
      return {
        ...state,
        user: state.user ? { ...state.user, balance: action.payload } : null,
      };
    case 'UPDATE_STATS':
      return {
        ...state,
        user: state.user
          ? {
              ...state.user,
              totalInvested: action.payload.totalInvested ?? state.user.totalInvested,
              totalReturns: action.payload.totalReturns ?? state.user.totalReturns,
            }
          : null,
      };
    default:
      return state;
  }
}

const StoreContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
} | null>(null);

// Transform Supabase profile to User type
function transformProfile(profile: any): User {
  return {
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
    preferredCurrency: profile.preferred_currency || 'USD',
    preferredLanguage: profile.preferred_language || 'en',
    twoFactorEnabled: profile.two_factor_enabled || false,
    emailNotifications: profile.email_notifications ?? true,
    smsNotifications: profile.sms_notifications || false,
    phoneNumber: profile.phone_number,
    country: profile.country,
    dateOfBirth: profile.date_of_birth,
    avatar: profile.avatar,
  };
}

// Transform user_metadata to User type (fast fallback when profile fetch is slow/fails)
function transformUserMetadata(user: any): User {
  return {
    id: user.id,
    email: user.email,
    name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
    balance: 0,
    totalInvested: 0,
    totalReturns: 0,
    isAdmin:
      user.user_metadata?.is_admin ||
      user.email?.toLowerCase() === 'fredokcee1@gmail.com' ||
      false,
    isFrozen: false,
    withdrawalFrozen: false,
    createdAt: user.created_at,
    kycVerified: user.user_metadata?.kyc_verified || false,
    kycStatus: user.user_metadata?.kyc_status || 'not_submitted',
    preferredCurrency: user.user_metadata?.preferred_currency || 'USD',
    preferredLanguage: user.user_metadata?.preferred_language || 'en',
    twoFactorEnabled: user.user_metadata?.two_factor_enabled || false,
    emailNotifications: user.user_metadata?.email_notifications ?? true,
    smsNotifications: user.user_metadata?.sms_notifications || false,
    phoneNumber: user.user_metadata?.phone_number,
    country: user.user_metadata?.country,
    dateOfBirth: user.user_metadata?.date_of_birth,
    avatar: user.user_metadata?.avatar,
  };
}

// Fetch profile with a hard timeout so login never hangs
async function fetchProfileWithTimeout(userId: string, timeoutMs = 4000): Promise<any | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
      .abortSignal(controller.signal);
    clearTimeout(timer);
    if (error) return null;
    return data;
  } catch {
    clearTimeout(timer);
    return null;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Initialize auth state — login immediately from session, then enrich with profile in background
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          // ✅ Step 1: Log in immediately using auth metadata so the UI is never blocked
          dispatch({ type: 'LOGIN', payload: transformUserMetadata(session.user) });

          // ✅ Step 2: Enrich with real profile data in the background (non-blocking)
          fetchProfileWithTimeout(session.user.id).then((profile) => {
            if (profile) {
              dispatch({ type: 'UPDATE_USER', payload: transformProfile(profile) });
            }
          });
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // ✅ Login immediately, enrich in background
        dispatch({ type: 'LOGIN', payload: transformUserMetadata(session.user) });
        fetchProfileWithTimeout(session.user.id).then((profile) => {
          if (profile) {
            dispatch({ type: 'UPDATE_USER', payload: transformProfile(profile) });
          }
        });
      } else if (event === 'SIGNED_OUT') {
        dispatch({ type: 'LOGOUT' });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Load site settings (non-blocking, runs independently)
  useEffect(() => {
    const loadSiteSettings = async () => {
      try {
        const { data: settings } = await supabase
          .from('site_settings')
          .select('*')
          .single();

        if (settings) {
          dispatch({
            type: 'SET_SITE_SETTINGS',
            payload: {
              siteName: settings.site_name,
              siteDescription: settings.site_description,
              contactEmail: settings.contact_email,
              contactPhone: settings.contact_phone,
              contactAddress: settings.contact_address,
              socialLinks: settings.social_links || [],
              stats: settings.stats || {},
              depositAddresses: settings.deposit_addresses || {},
              depositMethods: settings.deposit_methods || {},
              withdrawalSettings: settings.withdrawal_settings || {},
              globalWithdrawalFrozen: settings.global_withdrawal_frozen || false,
              maintenanceMode: settings.maintenance_mode || false,
              kycRequired: settings.kyc_required || true,
              kycThreshold: settings.kyc_threshold || 1000,
            },
          });
        }
      } catch (error) {
        console.error('Error loading site settings:', error);
      }
    };

    loadSiteSettings();
  }, []);

  // Load user-specific data after authentication (investments, transactions, notifications)
  useEffect(() => {
    if (!state.isAuthenticated || !state.user) return;

    const userId = state.user.id;

    const loadUserData = async () => {
      try {
        // Run all three queries in parallel for speed
        const [investmentsRes, transactionsRes, notificationsRes] = await Promise.allSettled([
          supabase
            .from('investments')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false }),
          supabase
            .from('transactions')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false }),
          supabase
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false }),
        ]);

        if (investmentsRes.status === 'fulfilled' && investmentsRes.value.data) {
          dispatch({
            type: 'SET_INVESTMENTS',
            payload: investmentsRes.value.data.map((inv: any) => ({
              id: inv.id,
              userId: inv.user_id,
              planId: inv.plan_id,
              planName: inv.plan_name,
              amount: inv.amount,
              dailyReturn: inv.daily_return,
              duration: inv.duration,
              startDate: inv.start_date,
              endDate: inv.end_date,
              status: inv.status,
              totalEarned: inv.total_earned,
              lastPayoutDate: inv.last_payout_date,
              createdAt: inv.created_at,
            })),
          });
        }

        if (transactionsRes.status === 'fulfilled' && transactionsRes.value.data) {
          dispatch({
            type: 'SET_TRANSACTIONS',
            payload: transactionsRes.value.data.map((tx: any) => ({
              id: tx.id,
              userId: tx.user_id,
              type: tx.type,
              amount: tx.amount,
              status: tx.status,
              method: tx.method,
              notes: tx.notes || tx.description,
              createdAt: tx.created_at,
            })),
          });
        }

        if (notificationsRes.status === 'fulfilled' && notificationsRes.value.data) {
          dispatch({
            type: 'SET_NOTIFICATIONS',
            payload: notificationsRes.value.data.map((n: any) => ({
              id: n.id,
              userId: n.user_id,
              type: n.type,
              title: n.title,
              message: n.message,
              isRead: n.is_read,
              actionUrl: n.action_url,
              actionText: n.action_text,
              metadata: n.metadata,
              createdAt: n.created_at,
            })),
          });
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, [state.isAuthenticated, state.user?.id]);

  // Load support tickets (admin only)
  useEffect(() => {
    if (!state.user?.isAdmin) return;

    const loadSupportTickets = async () => {
      try {
        const { data: tickets } = await supabase
          .from('support_tickets')
          .select('*')
          .order('created_at', { ascending: false });

        if (tickets) {
          dispatch({
            type: 'SET_SUPPORT_TICKETS',
            payload: tickets.map((t: any) => ({
              id: t.id,
              userId: t.user_id,
              userName: t.user_name,
              userEmail: t.user_email,
              subject: t.subject,
              message: t.message,
              category: t.category,
              priority: t.priority,
              status: t.status,
              adminResponse: t.admin_response,
              createdAt: t.created_at,
            })),
          });
        }
      } catch (error) {
        console.error('Error loading support tickets:', error);
      }
    };

    loadSupportTickets();
  }, [state.user?.isAdmin]);

  // Load blog posts (public)
  useEffect(() => {
    const loadBlogPosts = async () => {
      try {
        const { data: posts } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('status', 'published')
          .order('published_at', { ascending: false });

        if (posts) {
          dispatch({
            type: 'SET_BLOG_POSTS',
            payload: posts.map((p: any) => ({
              id: p.id,
              title: p.title,
              slug: p.slug,
              excerpt: p.excerpt,
              content: p.content,
              coverImage: p.cover_image,
              author: p.author,
              authorAvatar: p.author_avatar,
              category: p.category,
              tags: p.tags || [],
              publishedAt: p.published_at,
              status: p.status,
              featured: p.featured,
              views: p.views,
            })),
          });
        }
      } catch (error) {
        console.error('Error loading blog posts:', error);
      }
    };

    loadBlogPosts();
  }, []);

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

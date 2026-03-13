import { createClient } from '@supabase/supabase-js';
import type { User, InvestmentPlan, Investment, Transaction, DepositRequest, WithdrawalRequest } from '@/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth functions
export const signUp = async (email: string, password: string, name: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        balance: 0,
        total_invested: 0,
        total_returns: 0,
        is_admin: email.toLowerCase() === 'fredokcee1@gmail.com',
        is_frozen: false,
        kyc_verified: false,
      },
    },
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
    },
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
    
  return profile;
};

// User functions
export const getUsers = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
};

export const updateUser = async (userId: string, updates: Partial<User>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  return { data, error };
};

// Investment Plans functions
export const getInvestmentPlans = async () => {
  const { data, error } = await supabase
    .from('investment_plans')
    .select('*')
    .order('min_amount', { ascending: true });
  return { data, error };
};

export const updateInvestmentPlan = async (planId: string, updates: Partial<InvestmentPlan>) => {
  const { data, error } = await supabase
    .from('investment_plans')
    .update(updates)
    .eq('id', planId)
    .select()
    .single();
  return { data, error };
};

// Investment functions
export const getInvestments = async (userId?: string) => {
  let query = supabase.from('investments').select('*');
  if (userId) {
    query = query.eq('user_id', userId);
  }
  const { data, error } = await query.order('created_at', { ascending: false });
  return { data, error };
};

export const createInvestment = async (investment: Omit<Investment, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('investments')
    .insert(investment)
    .select()
    .single();
  return { data, error };
};

// Transaction functions
export const getTransactions = async (userId?: string) => {
  let query = supabase.from('transactions').select('*');
  if (userId) {
    query = query.eq('user_id', userId);
  }
  const { data, error } = await query.order('created_at', { ascending: false });
  return { data, error };
};

export const createTransaction = async (transaction: Omit<Transaction, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('transactions')
    .insert(transaction)
    .select()
    .single();
  return { data, error };
};

// Deposit functions
export const getDeposits = async (status?: string) => {
  let query = supabase.from('deposits').select('*');
  if (status) {
    query = query.eq('status', status);
  }
  const { data, error } = await query.order('created_at', { ascending: false });
  return { data, error };
};

export const createDeposit = async (deposit: Omit<DepositRequest, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('deposits')
    .insert(deposit)
    .select()
    .single();
  return { data, error };
};

export const updateDeposit = async (depositId: string, updates: Partial<DepositRequest>) => {
  const { data, error } = await supabase
    .from('deposits')
    .update(updates)
    .eq('id', depositId)
    .select()
    .single();
  return { data, error };
};

// Withdrawal functions
export const getWithdrawals = async (status?: string) => {
  let query = supabase.from('withdrawals').select('*');
  if (status) {
    query = query.eq('status', status);
  }
  const { data, error } = await query.order('created_at', { ascending: false });
  return { data, error };
};

export const createWithdrawal = async (withdrawal: Omit<WithdrawalRequest, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('withdrawals')
    .insert(withdrawal)
    .select()
    .single();
  return { data, error };
};

export const updateWithdrawal = async (withdrawalId: string, updates: Partial<WithdrawalRequest>) => {
  const { data, error } = await supabase
    .from('withdrawals')
    .update(updates)
    .eq('id', withdrawalId)
    .select()
    .single();
  return { data, error };
};

// Site Settings functions
export const getSiteSettings = async () => {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .single();
  return { data, error };
};

export const updateSiteSettings = async (updates: any) => {
  const { data, error } = await supabase
    .from('site_settings')
    .update(updates)
    .eq('id', 1)
    .select()
    .single();
  return { data, error };
};

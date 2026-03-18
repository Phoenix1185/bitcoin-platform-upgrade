import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store';
import Header from '@/sections/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import {
  ArrowLeft, Search, Save, Lock, Unlock, Plus, Trash2, Check, X,
  DollarSign, Users, TrendingUp, ArrowDownRight, ArrowUpRight,
  Bell, Send, RefreshCw, Eye, Edit2, Shield, AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import type { User, InvestmentPlan } from '@/types';

interface DepositRequest {
  id: string; user_id: string; user_name: string; user_email: string;
  amount: number; method: string; tx_hash?: string; status: string; created_at: string;
}
interface WithdrawalRequest {
  id: string; user_id: string; user_name: string; user_email: string;
  amount: number; method: string; address: string; status: string; created_at: string;
}
interface KYCRequest {
  id: string; user_id: string; user_name: string; user_email: string;
  kyc_status: string; kyc_documents?: any[]; created_at: string;
}

export default function AdminPage() {
  const navigate = useNavigate();
  const { state } = useStore();

  // Users
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [fundAmount, setFundAmount] = useState('');
  const [fundAction, setFundAction] = useState<'add' | 'remove'>('add');
  const [showFundDialog, setShowFundDialog] = useState(false);

  // Deposits
  const [deposits, setDeposits] = useState<DepositRequest[]>([]);
  const [loadingDeposits, setLoadingDeposits] = useState(true);

  // Withdrawals
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [loadingWithdrawals, setLoadingWithdrawals] = useState(true);

  // KYC
  const [kycRequests, setKycRequests] = useState<KYCRequest[]>([]);
  const [loadingKYC, setLoadingKYC] = useState(true);

  // Investment Plans
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [showPlanDialog, setShowPlanDialog] = useState(false);
  const [editingPlan, setEditingPlan] = useState<InvestmentPlan | null>(null);
  const [planForm, setPlanForm] = useState({ name: '', minAmount: '', maxAmount: '', dailyReturn: '', duration: '', featured: false });

  // Notifications
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifTarget, setNotifTarget] = useState<'all' | 'specific'>('all');
  const [notifUserId, setNotifUserId] = useState('');
  const [sendingNotif, setSendingNotif] = useState(false);

  // Site Stats
  const [siteStats, setSiteStats] = useState(state.siteSettings?.stats || {
    totalInvested: 0, totalInvestedSuffix: 'M+',
    activeInvestors: 0, activeInvestorsSuffix: 'K+',
    totalReturns: 0, totalReturnsSuffix: 'M+',
    uptime: 99.9, uptimeSuffix: '%',
  });

  // Redirect non-admins
  useEffect(() => {
    if (!state.isLoading && (!state.isAuthenticated || !state.user?.isAdmin)) {
      navigate('/dashboard');
    }
  }, [state.isAuthenticated, state.user, state.isLoading, navigate]);

  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (data) setUsers(data.map((p: any) => ({
      id: p.id, email: p.email, name: p.name, balance: p.balance || 0,
      totalInvested: p.total_invested || 0, totalReturns: p.total_returns || 0,
      isAdmin: p.is_admin || false, isFrozen: p.is_frozen || false,
      withdrawalFrozen: p.withdrawal_frozen || false, createdAt: p.created_at,
      kycVerified: p.kyc_verified || false, kycStatus: p.kyc_status || 'not_submitted',
    })));
    setLoadingUsers(false);
  }, []);

  const fetchDeposits = useCallback(async () => {
    setLoadingDeposits(true);
    const { data } = await supabase
      .from('transactions')
      .select('*, profiles(name, email)')
      .eq('type', 'deposit')
      .order('created_at', { ascending: false });
    if (data) setDeposits(data.map((d: any) => ({
      id: d.id, user_id: d.user_id,
      user_name: d.profiles?.name || 'Unknown',
      user_email: d.profiles?.email || '',
      amount: d.amount, method: d.method || 'Unknown',
      tx_hash: d.notes, status: d.status, created_at: d.created_at,
    })));
    setLoadingDeposits(false);
  }, []);

  const fetchWithdrawals = useCallback(async () => {
    setLoadingWithdrawals(true);
    const { data } = await supabase
      .from('transactions')
      .select('*, profiles(name, email)')
      .eq('type', 'withdrawal')
      .order('created_at', { ascending: false });
    if (data) setWithdrawals(data.map((d: any) => ({
      id: d.id, user_id: d.user_id,
      user_name: d.profiles?.name || 'Unknown',
      user_email: d.profiles?.email || '',
      amount: d.amount, method: d.method || 'Unknown',
      address: d.address || '', status: d.status, created_at: d.created_at,
    })));
    setLoadingWithdrawals(false);
  }, []);

  const fetchKYC = useCallback(async () => {
    setLoadingKYC(true);
    const { data } = await supabase
      .from('profiles')
      .select('id, name, email, kyc_status, kyc_documents, created_at')
      .neq('kyc_status', 'not_submitted')
      .order('created_at', { ascending: false });
    if (data) setKycRequests(data.map((p: any) => ({
      id: p.id, user_id: p.id, user_name: p.name, user_email: p.email,
      kyc_status: p.kyc_status, kyc_documents: p.kyc_documents, created_at: p.created_at,
    })));
    setLoadingKYC(false);
  }, []);

  const fetchPlans = useCallback(async () => {
    const { data } = await supabase.from('investment_plans').select('*').order('min_amount', { ascending: true });
    if (data) setPlans(data.map((p: any) => ({
      id: p.id, name: p.name, minAmount: p.min_amount, maxAmount: p.max_amount,
      dailyReturn: p.daily_return, duration: p.duration, featured: p.featured || false,
    })));
  }, []);

  useEffect(() => {
    if (state.user?.isAdmin) {
      fetchUsers(); fetchDeposits(); fetchWithdrawals(); fetchKYC(); fetchPlans();
    }
  }, [state.user?.isAdmin, fetchUsers, fetchDeposits, fetchWithdrawals, fetchKYC, fetchPlans]);

  // ── USER ACTIONS ──────────────────────────────────────────────────────────
  const handleFreezeAccount = async (userId: string, freeze: boolean) => {
    const { error } = await supabase.from('profiles').update({ is_frozen: freeze }).eq('id', userId);
    if (error) { toast.error('Failed to update account'); return; }
    setUsers(u => u.map(x => x.id === userId ? { ...x, isFrozen: freeze } : x));
    toast.success(`Account ${freeze ? 'frozen' : 'unfrozen'}`);
  };

  const handleFreezeWithdrawal = async (userId: string, freeze: boolean) => {
    const { error } = await supabase.from('profiles').update({ withdrawal_frozen: freeze }).eq('id', userId);
    if (error) { toast.error('Failed to update withdrawal status'); return; }
    setUsers(u => u.map(x => x.id === userId ? { ...x, withdrawalFrozen: freeze } : x));
    toast.success(`Withdrawal ${freeze ? 'frozen' : 'unfrozen'}`);
  };

  const handleFundUser = async () => {
    if (!selectedUser || !fundAmount) return;
    const amount = parseFloat(fundAmount);
    if (isNaN(amount) || amount <= 0) { toast.error('Enter a valid amount'); return; }

    const user = users.find(u => u.id === selectedUser.id);
    if (!user) return;
    const newBalance = fundAction === 'add' ? user.balance + amount : Math.max(0, user.balance - amount);

    const { error } = await supabase.from('profiles').update({ balance: newBalance }).eq('id', selectedUser.id);
    if (error) { toast.error('Failed to update balance'); return; }

    // Log transaction
    await supabase.from('transactions').insert({
      user_id: selectedUser.id, type: fundAction === 'add' ? 'bonus' : 'penalty',
      amount, status: 'approved', method: 'admin',
      notes: `Admin ${fundAction === 'add' ? 'added' : 'removed'} $${amount}`,
    });

    // Notify user
    await supabase.from('notifications').insert({
      user_id: selectedUser.id, type: 'account',
      title: fundAction === 'add' ? 'Funds Added' : 'Funds Deducted',
      message: `$${amount.toFixed(2)} has been ${fundAction === 'add' ? 'added to' : 'deducted from'} your account by admin.`,
      is_read: false,
    });

    setUsers(u => u.map(x => x.id === selectedUser.id ? { ...x, balance: newBalance } : x));
    toast.success(`Balance updated to $${newBalance.toFixed(2)}`);
    setShowFundDialog(false);
    setFundAmount('');
  };

  // ── DEPOSIT ACTIONS ───────────────────────────────────────────────────────
  const handleDepositAction = async (dep: DepositRequest, action: 'approved' | 'rejected') => {
    const { error } = await supabase.from('transactions').update({ status: action }).eq('id', dep.id);
    if (error) { toast.error('Failed to update deposit'); return; }

    if (action === 'approved') {
      // Credit balance
      const user = users.find(u => u.id === dep.user_id);
      const currentBalance = user?.balance || 0;
      await supabase.from('profiles').update({ balance: currentBalance + dep.amount }).eq('id', dep.user_id);
      setUsers(u => u.map(x => x.id === dep.user_id ? { ...x, balance: x.balance + dep.amount } : x));
    }

    // Notify user
    await supabase.from('notifications').insert({
      user_id: dep.user_id, type: 'deposit',
      title: action === 'approved' ? 'Deposit Approved' : 'Deposit Rejected',
      message: action === 'approved'
        ? `Your deposit of $${dep.amount.toFixed(2)} has been approved and credited to your account.`
        : `Your deposit of $${dep.amount.toFixed(2)} was rejected. Please contact support.`,
      is_read: false,
    });

    setDeposits(d => d.map(x => x.id === dep.id ? { ...x, status: action } : x));
    toast.success(`Deposit ${action}`);
  };

  // ── WITHDRAWAL ACTIONS ────────────────────────────────────────────────────
  const handleWithdrawalAction = async (wit: WithdrawalRequest, action: 'approved' | 'rejected') => {
    const { error } = await supabase.from('transactions').update({ status: action }).eq('id', wit.id);
    if (error) { toast.error('Failed to update withdrawal'); return; }

    if (action === 'approved') {
      // Deduct balance
      const user = users.find(u => u.id === wit.user_id);
      const currentBalance = user?.balance || 0;
      const newBalance = Math.max(0, currentBalance - wit.amount);
      await supabase.from('profiles').update({ balance: newBalance }).eq('id', wit.user_id);
      setUsers(u => u.map(x => x.id === wit.user_id ? { ...x, balance: newBalance } : x));
    } else {
      // Refund balance if rejected
      const user = users.find(u => u.id === wit.user_id);
      const currentBalance = user?.balance || 0;
      await supabase.from('profiles').update({ balance: currentBalance + wit.amount }).eq('id', wit.user_id);
      setUsers(u => u.map(x => x.id === wit.user_id ? { ...x, balance: x.balance + wit.amount } : x));
    }

    // Notify user
    await supabase.from('notifications').insert({
      user_id: wit.user_id, type: 'withdrawal',
      title: action === 'approved' ? 'Withdrawal Approved' : 'Withdrawal Rejected',
      message: action === 'approved'
        ? `Your withdrawal of $${wit.amount.toFixed(2)} has been approved and is being processed.`
        : `Your withdrawal of $${wit.amount.toFixed(2)} was rejected. Funds have been returned to your account.`,
      is_read: false,
    });

    setWithdrawals(w => w.map(x => x.id === wit.id ? { ...x, status: action } : x));
    toast.success(`Withdrawal ${action}`);
  };

  // ── KYC ACTIONS ───────────────────────────────────────────────────────────
  const handleKYCAction = async (userId: string, action: 'approved' | 'rejected') => {
    const { error } = await supabase.from('profiles').update({
      kyc_status: action, kyc_verified: action === 'approved',
    }).eq('id', userId);
    if (error) { toast.error('Failed to update KYC'); return; }

    await supabase.from('notifications').insert({
      user_id: userId, type: 'kyc',
      title: action === 'approved' ? 'KYC Approved' : 'KYC Rejected',
      message: action === 'approved'
        ? 'Your identity verification has been approved. You now have full access.'
        : 'Your identity verification was rejected. Please resubmit with clearer documents.',
      is_read: false,
    });

    setKycRequests(k => k.map(x => x.user_id === userId ? { ...x, kyc_status: action } : x));
    toast.success(`KYC ${action}`);
  };

  // ── INVESTMENT PLAN ACTIONS ───────────────────────────────────────────────
  const handleSavePlan = async () => {
    const payload = {
      name: planForm.name, min_amount: parseFloat(planForm.minAmount),
      max_amount: parseFloat(planForm.maxAmount), daily_return: parseFloat(planForm.dailyReturn),
      duration: parseInt(planForm.duration), featured: planForm.featured,
    };

    if (editingPlan) {
      const { error } = await supabase.from('investment_plans').update(payload).eq('id', editingPlan.id);
      if (error) { toast.error('Failed to update plan'); return; }
    } else {
      const { error } = await supabase.from('investment_plans').insert(payload);
      if (error) { toast.error('Failed to create plan'); return; }
    }

    toast.success(`Plan ${editingPlan ? 'updated' : 'created'} successfully`);
    setShowPlanDialog(false);
    setEditingPlan(null);
    setPlanForm({ name: '', minAmount: '', maxAmount: '', dailyReturn: '', duration: '', featured: false });
    fetchPlans();
  };

  const handleDeletePlan = async (planId: string) => {
    const { error } = await supabase.from('investment_plans').delete().eq('id', planId);
    if (error) { toast.error('Failed to delete plan'); return; }
    toast.success('Plan deleted');
    fetchPlans();
  };

  const openEditPlan = (plan: InvestmentPlan) => {
    setEditingPlan(plan);
    setPlanForm({
      name: plan.name, minAmount: plan.minAmount.toString(), maxAmount: plan.maxAmount.toString(),
      dailyReturn: plan.dailyReturn.toString(), duration: plan.duration.toString(),
      featured: plan.featured || false,
    });
    setShowPlanDialog(true);
  };

  // ── NOTIFICATION ACTIONS ──────────────────────────────────────────────────
  const handleSendNotification = async () => {
    if (!notifTitle || !notifMessage) { toast.error('Enter title and message'); return; }
    setSendingNotif(true);

    try {
      if (notifTarget === 'all') {
        const { data: allUsers } = await supabase.from('profiles').select('id');
        if (allUsers) {
          const notifs = allUsers.map((u: any) => ({
            user_id: u.id, type: 'announcement', title: notifTitle,
            message: notifMessage, is_read: false,
          }));
          await supabase.from('notifications').insert(notifs);
        }
      } else {
        await supabase.from('notifications').insert({
          user_id: notifUserId, type: 'announcement',
          title: notifTitle, message: notifMessage, is_read: false,
        });
      }
      toast.success('Notification sent successfully');
      setNotifTitle(''); setNotifMessage(''); setNotifUserId('');
    } catch {
      toast.error('Failed to send notification');
    } finally {
      setSendingNotif(false);
    }
  };

  // ── SITE STATS ────────────────────────────────────────────────────────────
  const handleUpdateStats = async () => {
    const { error } = await supabase.from('site_settings').update({ stats: siteStats }).eq('id', 1);
    if (error) { toast.error('Failed to update stats'); return; }
    toast.success('Site statistics updated');
  };

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingDeposits = deposits.filter(d => d.status === 'pending');
  const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending');
  const pendingKYC = kycRequests.filter(k => k.kyc_status === 'pending');

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-500/20 text-yellow-400',
      approved: 'bg-green-500/20 text-green-400',
      rejected: 'bg-red-500/20 text-red-400',
      active: 'bg-blue-500/20 text-blue-400',
    };
    return <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${colors[status] || 'bg-gray-500/20 text-gray-400'}`}>{status}</span>;
  };

  return (
    <div className="min-h-screen bg-crypto-dark pb-24 lg:pb-12">
      <Header />
      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-display font-bold text-white">Admin Panel</h1>
              <p className="text-gray-400 text-sm mt-1">Manage users, transactions, and platform settings</p>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Users', value: users.length, icon: Users, color: 'text-blue-400' },
              { label: 'Pending Deposits', value: pendingDeposits.length, icon: ArrowDownRight, color: 'text-green-400' },
              { label: 'Pending Withdrawals', value: pendingWithdrawals.length, icon: ArrowUpRight, color: 'text-red-400' },
              { label: 'Pending KYC', value: pendingKYC.length, icon: Shield, color: 'text-yellow-400' },
            ].map(({ label, value, icon: Icon, color }) => (
              <Card key={label} className="bg-crypto-card border-crypto-border">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-crypto-dark flex items-center justify-center">
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{value}</p>
                    <p className="text-xs text-gray-400">{label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="users" className="space-y-6">
            <TabsList className="bg-crypto-card border border-crypto-border flex-wrap h-auto gap-1 p-1">
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="deposits">
                Deposits {pendingDeposits.length > 0 && <span className="ml-1 bg-yellow-500 text-black text-xs rounded-full px-1.5">{pendingDeposits.length}</span>}
              </TabsTrigger>
              <TabsTrigger value="withdrawals">
                Withdrawals {pendingWithdrawals.length > 0 && <span className="ml-1 bg-yellow-500 text-black text-xs rounded-full px-1.5">{pendingWithdrawals.length}</span>}
              </TabsTrigger>
              <TabsTrigger value="kyc">
                KYC {pendingKYC.length > 0 && <span className="ml-1 bg-yellow-500 text-black text-xs rounded-full px-1.5">{pendingKYC.length}</span>}
              </TabsTrigger>
              <TabsTrigger value="plans">Plans</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="stats">Site Stats</TabsTrigger>
            </TabsList>

            {/* ── USERS TAB ── */}
            <TabsContent value="users">
              <Card className="bg-crypto-card border-crypto-border">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <CardTitle className="text-white flex items-center gap-2">
                      <Users className="w-5 h-5 text-crypto-yellow" /> Manage Users
                    </CardTitle>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input placeholder="Search users..." className="pl-10 bg-crypto-dark border-crypto-border text-white w-64"
                          value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                      </div>
                      <Button variant="outline" size="icon" onClick={fetchUsers} className="border-crypto-border text-white">
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loadingUsers ? (
                    <p className="text-gray-400 text-center py-8">Loading users...</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-crypto-border">
                            <th className="text-left py-3 px-3 text-sm text-gray-400">User</th>
                            <th className="text-left py-3 px-3 text-sm text-gray-400">Balance</th>
                            <th className="text-left py-3 px-3 text-sm text-gray-400">Invested</th>
                            <th className="text-left py-3 px-3 text-sm text-gray-400">KYC</th>
                            <th className="text-left py-3 px-3 text-sm text-gray-400">Status</th>
                            <th className="text-left py-3 px-3 text-sm text-gray-400">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers.map((user) => (
                            <tr key={user.id} className="border-b border-crypto-border/50 hover:bg-crypto-dark/30">
                              <td className="py-3 px-3">
                                <p className="text-white font-medium text-sm">{user.name}</p>
                                <p className="text-gray-400 text-xs">{user.email}</p>
                              </td>
                              <td className="py-3 px-3 text-white text-sm">${user.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                              <td className="py-3 px-3 text-gray-300 text-sm">${user.totalInvested.toLocaleString()}</td>
                              <td className="py-3 px-3">{statusBadge(user.kycStatus || 'not_submitted')}</td>
                              <td className="py-3 px-3">
                                <div className="flex flex-col gap-1">
                                  {statusBadge(user.isFrozen ? 'frozen' : 'active')}
                                  {user.withdrawalFrozen && <span className="text-xs text-orange-400">W.Frozen</span>}
                                </div>
                              </td>
                              <td className="py-3 px-3">
                                <div className="flex gap-1 flex-wrap">
                                  <Button variant="outline" size="sm"
                                    onClick={() => handleFreezeAccount(user.id, !user.isFrozen)}
                                    className="border-crypto-border text-white h-7 px-2 text-xs">
                                    {user.isFrozen ? <><Unlock className="w-3 h-3 mr-1" />Unfreeze</> : <><Lock className="w-3 h-3 mr-1" />Freeze</>}
                                  </Button>
                                  <Button variant="outline" size="sm"
                                    onClick={() => handleFreezeWithdrawal(user.id, !user.withdrawalFrozen)}
                                    className="border-crypto-border text-white h-7 px-2 text-xs">
                                    {user.withdrawalFrozen ? 'W.Unfreeze' : 'W.Freeze'}
                                  </Button>
                                  <Button variant="outline" size="sm"
                                    onClick={() => { setSelectedUser(user); setFundAction('add'); setShowFundDialog(true); }}
                                    className="border-green-500/50 text-green-400 h-7 px-2 text-xs">
                                    <Plus className="w-3 h-3 mr-1" />Funds
                                  </Button>
                                  <Button variant="outline" size="sm"
                                    onClick={() => { setSelectedUser(user); setFundAction('remove'); setShowFundDialog(true); }}
                                    className="border-red-500/50 text-red-400 h-7 px-2 text-xs">
                                    <DollarSign className="w-3 h-3 mr-1" />Deduct
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── DEPOSITS TAB ── */}
            <TabsContent value="deposits">
              <Card className="bg-crypto-card border-crypto-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center gap-2">
                      <ArrowDownRight className="w-5 h-5 text-green-400" /> Deposit Requests
                    </CardTitle>
                    <Button variant="outline" size="icon" onClick={fetchDeposits} className="border-crypto-border text-white">
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {loadingDeposits ? (
                    <p className="text-gray-400 text-center py-8">Loading deposits...</p>
                  ) : deposits.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No deposit requests</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-crypto-border">
                            <th className="text-left py-3 px-3 text-sm text-gray-400">User</th>
                            <th className="text-left py-3 px-3 text-sm text-gray-400">Amount</th>
                            <th className="text-left py-3 px-3 text-sm text-gray-400">Method</th>
                            <th className="text-left py-3 px-3 text-sm text-gray-400">Tx Hash</th>
                            <th className="text-left py-3 px-3 text-sm text-gray-400">Date</th>
                            <th className="text-left py-3 px-3 text-sm text-gray-400">Status</th>
                            <th className="text-left py-3 px-3 text-sm text-gray-400">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {deposits.map((dep) => (
                            <tr key={dep.id} className="border-b border-crypto-border/50 hover:bg-crypto-dark/30">
                              <td className="py-3 px-3">
                                <p className="text-white text-sm">{dep.user_name}</p>
                                <p className="text-gray-400 text-xs">{dep.user_email}</p>
                              </td>
                              <td className="py-3 px-3 text-green-400 font-bold">${dep.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                              <td className="py-3 px-3 text-gray-300 text-sm">{dep.method}</td>
                              <td className="py-3 px-3 text-gray-400 text-xs max-w-[120px] truncate">{dep.tx_hash || '—'}</td>
                              <td className="py-3 px-3 text-gray-400 text-xs">{new Date(dep.created_at).toLocaleDateString()}</td>
                              <td className="py-3 px-3">{statusBadge(dep.status)}</td>
                              <td className="py-3 px-3">
                                {dep.status === 'pending' && (
                                  <div className="flex gap-1">
                                    <Button size="sm" onClick={() => handleDepositAction(dep, 'approved')}
                                      className="bg-green-500/20 text-green-400 hover:bg-green-500/30 h-7 px-2 text-xs border border-green-500/30">
                                      <Check className="w-3 h-3 mr-1" />Approve
                                    </Button>
                                    <Button size="sm" onClick={() => handleDepositAction(dep, 'rejected')}
                                      className="bg-red-500/20 text-red-400 hover:bg-red-500/30 h-7 px-2 text-xs border border-red-500/30">
                                      <X className="w-3 h-3 mr-1" />Reject
                                    </Button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── WITHDRAWALS TAB ── */}
            <TabsContent value="withdrawals">
              <Card className="bg-crypto-card border-crypto-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center gap-2">
                      <ArrowUpRight className="w-5 h-5 text-red-400" /> Withdrawal Requests
                    </CardTitle>
                    <Button variant="outline" size="icon" onClick={fetchWithdrawals} className="border-crypto-border text-white">
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {loadingWithdrawals ? (
                    <p className="text-gray-400 text-center py-8">Loading withdrawals...</p>
                  ) : withdrawals.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No withdrawal requests</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-crypto-border">
                            <th className="text-left py-3 px-3 text-sm text-gray-400">User</th>
                            <th className="text-left py-3 px-3 text-sm text-gray-400">Amount</th>
                            <th className="text-left py-3 px-3 text-sm text-gray-400">Method</th>
                            <th className="text-left py-3 px-3 text-sm text-gray-400">Address</th>
                            <th className="text-left py-3 px-3 text-sm text-gray-400">Date</th>
                            <th className="text-left py-3 px-3 text-sm text-gray-400">Status</th>
                            <th className="text-left py-3 px-3 text-sm text-gray-400">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {withdrawals.map((wit) => (
                            <tr key={wit.id} className="border-b border-crypto-border/50 hover:bg-crypto-dark/30">
                              <td className="py-3 px-3">
                                <p className="text-white text-sm">{wit.user_name}</p>
                                <p className="text-gray-400 text-xs">{wit.user_email}</p>
                              </td>
                              <td className="py-3 px-3 text-red-400 font-bold">${wit.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                              <td className="py-3 px-3 text-gray-300 text-sm">{wit.method}</td>
                              <td className="py-3 px-3 text-gray-400 text-xs max-w-[120px] truncate">{wit.address || '—'}</td>
                              <td className="py-3 px-3 text-gray-400 text-xs">{new Date(wit.created_at).toLocaleDateString()}</td>
                              <td className="py-3 px-3">{statusBadge(wit.status)}</td>
                              <td className="py-3 px-3">
                                {wit.status === 'pending' && (
                                  <div className="flex gap-1">
                                    <Button size="sm" onClick={() => handleWithdrawalAction(wit, 'approved')}
                                      className="bg-green-500/20 text-green-400 hover:bg-green-500/30 h-7 px-2 text-xs border border-green-500/30">
                                      <Check className="w-3 h-3 mr-1" />Approve
                                    </Button>
                                    <Button size="sm" onClick={() => handleWithdrawalAction(wit, 'rejected')}
                                      className="bg-red-500/20 text-red-400 hover:bg-red-500/30 h-7 px-2 text-xs border border-red-500/30">
                                      <X className="w-3 h-3 mr-1" />Reject
                                    </Button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── KYC TAB ── */}
            <TabsContent value="kyc">
              <Card className="bg-crypto-card border-crypto-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center gap-2">
                      <Shield className="w-5 h-5 text-yellow-400" /> KYC Verification Requests
                    </CardTitle>
                    <Button variant="outline" size="icon" onClick={fetchKYC} className="border-crypto-border text-white">
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {loadingKYC ? (
                    <p className="text-gray-400 text-center py-8">Loading KYC requests...</p>
                  ) : kycRequests.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No KYC submissions yet</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-crypto-border">
                            <th className="text-left py-3 px-3 text-sm text-gray-400">User</th>
                            <th className="text-left py-3 px-3 text-sm text-gray-400">Submitted</th>
                            <th className="text-left py-3 px-3 text-sm text-gray-400">Status</th>
                            <th className="text-left py-3 px-3 text-sm text-gray-400">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {kycRequests.map((kyc) => (
                            <tr key={kyc.id} className="border-b border-crypto-border/50 hover:bg-crypto-dark/30">
                              <td className="py-3 px-3">
                                <p className="text-white text-sm">{kyc.user_name}</p>
                                <p className="text-gray-400 text-xs">{kyc.user_email}</p>
                              </td>
                              <td className="py-3 px-3 text-gray-400 text-xs">{new Date(kyc.created_at).toLocaleDateString()}</td>
                              <td className="py-3 px-3">{statusBadge(kyc.kyc_status)}</td>
                              <td className="py-3 px-3">
                                {kyc.kyc_status === 'pending' && (
                                  <div className="flex gap-1">
                                    <Button size="sm" onClick={() => handleKYCAction(kyc.user_id, 'approved')}
                                      className="bg-green-500/20 text-green-400 hover:bg-green-500/30 h-7 px-2 text-xs border border-green-500/30">
                                      <Check className="w-3 h-3 mr-1" />Approve
                                    </Button>
                                    <Button size="sm" onClick={() => handleKYCAction(kyc.user_id, 'rejected')}
                                      className="bg-red-500/20 text-red-400 hover:bg-red-500/30 h-7 px-2 text-xs border border-red-500/30">
                                      <X className="w-3 h-3 mr-1" />Reject
                                    </Button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── INVESTMENT PLANS TAB ── */}
            <TabsContent value="plans">
              <Card className="bg-crypto-card border-crypto-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-crypto-yellow" /> Investment Plans
                    </CardTitle>
                    <Button onClick={() => { setEditingPlan(null); setPlanForm({ name: '', minAmount: '', maxAmount: '', dailyReturn: '', duration: '', featured: false }); setShowPlanDialog(true); }}
                      className="bg-crypto-yellow text-crypto-dark hover:bg-crypto-yellow-light">
                      <Plus className="w-4 h-4 mr-2" />New Plan
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-crypto-border">
                          <th className="text-left py-3 px-3 text-sm text-gray-400">Name</th>
                          <th className="text-left py-3 px-3 text-sm text-gray-400">Min/Max</th>
                          <th className="text-left py-3 px-3 text-sm text-gray-400">Daily %</th>
                          <th className="text-left py-3 px-3 text-sm text-gray-400">Duration</th>
                          <th className="text-left py-3 px-3 text-sm text-gray-400">Featured</th>
                          <th className="text-left py-3 px-3 text-sm text-gray-400">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {plans.map((plan) => (
                          <tr key={plan.id} className="border-b border-crypto-border/50 hover:bg-crypto-dark/30">
                            <td className="py-3 px-3 text-white font-medium">{plan.name}</td>
                            <td className="py-3 px-3 text-gray-300 text-sm">${plan.minAmount.toLocaleString()} – ${plan.maxAmount.toLocaleString()}</td>
                            <td className="py-3 px-3 text-crypto-yellow font-bold">{plan.dailyReturn}%</td>
                            <td className="py-3 px-3 text-gray-300 text-sm">{plan.duration} days</td>
                            <td className="py-3 px-3">{plan.featured ? <span className="text-crypto-yellow text-xs">★ Featured</span> : <span className="text-gray-500 text-xs">—</span>}</td>
                            <td className="py-3 px-3">
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm" onClick={() => openEditPlan(plan)}
                                  className="border-crypto-border text-white h-7 px-2 text-xs">
                                  <Edit2 className="w-3 h-3 mr-1" />Edit
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleDeletePlan(plan.id)}
                                  className="border-red-500/30 text-red-400 h-7 px-2 text-xs">
                                  <Trash2 className="w-3 h-3 mr-1" />Delete
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── NOTIFICATIONS TAB ── */}
            <TabsContent value="notifications">
              <Card className="bg-crypto-card border-crypto-border">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Bell className="w-5 h-5 text-crypto-yellow" /> Send Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 max-w-xl">
                  <div className="space-y-2">
                    <Label className="text-gray-400">Target</Label>
                    <div className="flex gap-3">
                      <Button size="sm" onClick={() => setNotifTarget('all')}
                        className={notifTarget === 'all' ? 'bg-crypto-yellow text-crypto-dark' : 'bg-crypto-dark border border-crypto-border text-white'}>
                        All Users
                      </Button>
                      <Button size="sm" onClick={() => setNotifTarget('specific')}
                        className={notifTarget === 'specific' ? 'bg-crypto-yellow text-crypto-dark' : 'bg-crypto-dark border border-crypto-border text-white'}>
                        Specific User
                      </Button>
                    </div>
                  </div>
                  {notifTarget === 'specific' && (
                    <div className="space-y-2">
                      <Label className="text-gray-400">User ID or Email</Label>
                      <Input value={notifUserId} onChange={(e) => setNotifUserId(e.target.value)}
                        placeholder="Enter user ID or select from users tab"
                        className="bg-crypto-dark border-crypto-border text-white" />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label className="text-gray-400">Title</Label>
                    <Input value={notifTitle} onChange={(e) => setNotifTitle(e.target.value)}
                      placeholder="Notification title" className="bg-crypto-dark border-crypto-border text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-400">Message</Label>
                    <Textarea value={notifMessage} onChange={(e) => setNotifMessage(e.target.value)}
                      placeholder="Notification message" rows={4}
                      className="bg-crypto-dark border-crypto-border text-white resize-none" />
                  </div>
                  <Button onClick={handleSendNotification} disabled={sendingNotif}
                    className="bg-crypto-yellow text-crypto-dark hover:bg-crypto-yellow-light">
                    <Send className="w-4 h-4 mr-2" />
                    {sendingNotif ? 'Sending...' : 'Send Notification'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── SITE STATS TAB ── */}
            <TabsContent value="stats">
              <Card className="bg-crypto-card border-crypto-border">
                <CardHeader>
                  <CardTitle className="text-white">Update Homepage Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {[
                      { label: 'Total Invested Value', key: 'totalInvested', suffixKey: 'totalInvestedSuffix' },
                      { label: 'Active Investors Count', key: 'activeInvestors', suffixKey: 'activeInvestorsSuffix' },
                      { label: 'Total Returns Value', key: 'totalReturns', suffixKey: 'totalReturnsSuffix' },
                      { label: 'Uptime', key: 'uptime', suffixKey: 'uptimeSuffix' },
                    ].map(({ label, key, suffixKey }) => (
                      <div key={key} className="space-y-2">
                        <Label className="text-gray-400">{label}</Label>
                        <div className="flex gap-2">
                          <Input type="number" value={(siteStats as any)[key]}
                            onChange={(e) => setSiteStats({ ...siteStats, [key]: parseFloat(e.target.value) })}
                            className="bg-crypto-dark border-crypto-border text-white" />
                          <Input value={(siteStats as any)[suffixKey]}
                            onChange={(e) => setSiteStats({ ...siteStats, [suffixKey]: e.target.value })}
                            className="bg-crypto-dark border-crypto-border text-white w-24" placeholder="Suffix" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button onClick={handleUpdateStats} className="bg-crypto-yellow text-crypto-dark hover:bg-crypto-yellow-light">
                    <Save className="w-4 h-4 mr-2" />Save Statistics
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Fund User Dialog */}
      <Dialog open={showFundDialog} onOpenChange={setShowFundDialog}>
        <DialogContent className="bg-crypto-card border-crypto-border text-white">
          <DialogHeader>
            <DialogTitle>{fundAction === 'add' ? 'Add Funds' : 'Deduct Funds'}</DialogTitle>
            <DialogDescription className="text-gray-400">
              {fundAction === 'add' ? 'Add' : 'Deduct'} funds {fundAction === 'add' ? 'to' : 'from'} {selectedUser?.name}'s account.
              Current balance: <span className="text-crypto-yellow">${selectedUser?.balance.toFixed(2)}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Amount (USD)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <Input type="number" value={fundAmount} onChange={(e) => setFundAmount(e.target.value)}
                  className="pl-8 bg-crypto-dark border-crypto-border text-white" placeholder="0.00" />
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowFundDialog(false)}
                className="flex-1 border-crypto-border text-white">Cancel</Button>
              <Button onClick={handleFundUser}
                className={`flex-1 ${fundAction === 'add' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white`}>
                {fundAction === 'add' ? <><Plus className="w-4 h-4 mr-2" />Add Funds</> : <><DollarSign className="w-4 h-4 mr-2" />Deduct Funds</>}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Plan Dialog */}
      <Dialog open={showPlanDialog} onOpenChange={setShowPlanDialog}>
        <DialogContent className="bg-crypto-card border-crypto-border text-white">
          <DialogHeader>
            <DialogTitle>{editingPlan ? 'Edit Plan' : 'Create New Plan'}</DialogTitle>
            <DialogDescription className="text-gray-400">Configure the investment plan details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Plan Name</Label>
              <Input value={planForm.name} onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                className="bg-crypto-dark border-crypto-border text-white" placeholder="e.g. Gold Plan" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Min Amount ($)</Label>
                <Input type="number" value={planForm.minAmount} onChange={(e) => setPlanForm({ ...planForm, minAmount: e.target.value })}
                  className="bg-crypto-dark border-crypto-border text-white" />
              </div>
              <div className="space-y-2">
                <Label>Max Amount ($)</Label>
                <Input type="number" value={planForm.maxAmount} onChange={(e) => setPlanForm({ ...planForm, maxAmount: e.target.value })}
                  className="bg-crypto-dark border-crypto-border text-white" />
              </div>
              <div className="space-y-2">
                <Label>Daily Return (%)</Label>
                <Input type="number" value={planForm.dailyReturn} onChange={(e) => setPlanForm({ ...planForm, dailyReturn: e.target.value })}
                  className="bg-crypto-dark border-crypto-border text-white" />
              </div>
              <div className="space-y-2">
                <Label>Duration (days)</Label>
                <Input type="number" value={planForm.duration} onChange={(e) => setPlanForm({ ...planForm, duration: e.target.value })}
                  className="bg-crypto-dark border-crypto-border text-white" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={planForm.featured} onCheckedChange={(v) => setPlanForm({ ...planForm, featured: v })} />
              <Label>Mark as Featured (Best Value)</Label>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowPlanDialog(false)}
                className="flex-1 border-crypto-border text-white">Cancel</Button>
              <Button onClick={handleSavePlan}
                className="flex-1 bg-crypto-yellow text-crypto-dark hover:bg-crypto-yellow-light">
                <Save className="w-4 h-4 mr-2" />{editingPlan ? 'Save Changes' : 'Create Plan'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

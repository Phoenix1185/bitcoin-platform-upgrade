import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store';
import Header from '@/sections/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  ArrowLeft, 
  Users, 
  Wallet, 
  CheckCircle, 
  XCircle, 
  Lock, 
  Unlock,
  Plus,
  Minus,
  Search,
  DollarSign,
  PiggyBank,
  Activity,
  Eye,
  Ban,
  Edit3,
  TrendingUp,
  Save,
  FileText,
  Link as LinkIcon,
  Trash2,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Send,
  MessageSquare,
  Mail,
  Bell,
  Headphones,
  CreditCard,
  Copy,
  Globe
} from 'lucide-react';
import { toast } from 'sonner';
import type { BlogPost, UserNotification, User } from '@/types';
import { TICKET_CATEGORIES, TICKET_PRIORITIES, TICKET_STATUSES } from '@/types/support';
import type { SupportTicket, LiveChatSession } from '@/types/support';
import { DialogDescription } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';

export default function AdminPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect if not admin
  useEffect(() => {
    if (!state.isLoading && (!state.isAuthenticated || !state.user?.isAdmin)) {
      navigate('/dashboard');
    }
  }, [state.isAuthenticated, state.user, state.isLoading, navigate]);

  // Fetch users from Supabase
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        if (data) {
          // Map profiles to User type
          const mappedUsers: User[] = data.map(profile => ({
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
          }));
          setUsers(mappedUsers);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    if (state.user?.isAdmin) {
      fetchUsers();
    }
  }, [state.user?.isAdmin]);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Site settings state (synced with store)
  const [siteStats, setSiteStats] = useState(state.siteSettings?.stats || {
    totalInvested: 0,
    totalInvestedSuffix: 'M+',
    activeInvestors: 0,
    activeInvestorsSuffix: 'K+',
    totalReturns: 0,
    totalReturnsSuffix: 'M+',
    uptime: 99.9,
    uptimeSuffix: '%',
  });

  const handleUpdateStats = async () => {
    try {
      const { error } = await supabase
        .from('site_settings')
        .update({ stats: siteStats })
        .eq('id', 1); // Assuming ID 1 for global settings
      
      if (error) throw error;
      toast.success('Site statistics updated successfully');
    } catch (error) {
      console.error('Error updating stats:', error);
      toast.error('Failed to update stats');
    }
  };

  const handleFreezeAccount = async (userId: string, freeze: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_frozen: freeze })
        .eq('id', userId);
      
      if (error) throw error;
      
      setUsers(users.map(u => u.id === userId ? { ...u, isFrozen: freeze } : u));
      toast.success(`Account ${freeze ? 'frozen' : 'unfrozen'} successfully`);
    } catch (error) {
      toast.error('Failed to update account status');
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-crypto-dark flex items-center justify-center text-white">Loading Admin Panel...</div>;
  }

  return (
    <div className="min-h-screen bg-crypto-dark">
      <Header />
      
      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="text-white">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-3xl font-display font-bold text-white">Admin Panel</h1>
            </div>
          </div>

          <Tabs defaultValue="users" className="space-y-8">
            <TabsList className="bg-crypto-card border-crypto-border">
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="stats">Site Stats</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="users">
              <Card className="bg-crypto-card border-crypto-border">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <CardTitle className="text-white">Manage Users</CardTitle>
                    <div className="relative w-full md:w-72">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input 
                        placeholder="Search users..." 
                        className="pl-10 bg-crypto-dark border-crypto-border text-white"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-crypto-border">
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">User</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Balance</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user) => (
                          <tr key={user.id} className="border-b border-crypto-border/50">
                            <td className="py-4 px-4">
                              <div>
                                <p className="text-white font-medium">{user.name}</p>
                                <p className="text-gray-400 text-xs">{user.email}</p>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-white">${user.balance.toLocaleString()}</td>
                            <td className="py-4 px-4">
                              <Badge variant={user.isFrozen ? "destructive" : "default"}>
                                {user.isFrozen ? 'Frozen' : 'Active'}
                              </Badge>
                            </td>
                            <td className="py-4 px-4">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleFreezeAccount(user.id, !user.isFrozen)}
                                className="border-crypto-border text-white"
                              >
                                {user.isFrozen ? <Unlock className="w-4 h-4 mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
                                {user.isFrozen ? 'Unfreeze' : 'Freeze'}
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats">
              <Card className="bg-crypto-card border-crypto-border">
                <CardHeader>
                  <CardTitle className="text-white">Update Site Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-gray-400">Total Invested Value</Label>
                      <Input 
                        type="number" 
                        value={siteStats.totalInvested}
                        onChange={(e) => setSiteStats({...siteStats, totalInvested: parseFloat(e.target.value)})}
                        className="bg-crypto-dark border-crypto-border text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-400">Total Invested Suffix (e.g., M+)</Label>
                      <Input 
                        value={siteStats.totalInvestedSuffix}
                        onChange={(e) => setSiteStats({...siteStats, totalInvestedSuffix: e.target.value})}
                        className="bg-crypto-dark border-crypto-border text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-400">Active Investors Count</Label>
                      <Input 
                        type="number" 
                        value={siteStats.activeInvestors}
                        onChange={(e) => setSiteStats({...siteStats, activeInvestors: parseFloat(e.target.value)})}
                        className="bg-crypto-dark border-crypto-border text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-400">Investors Suffix (e.g., K+)</Label>
                      <Input 
                        value={siteStats.activeInvestorsSuffix}
                        onChange={(e) => setSiteStats({...siteStats, activeInvestorsSuffix: e.target.value})}
                        className="bg-crypto-dark border-crypto-border text-white"
                      />
                    </div>
                  </div>
                  <Button onClick={handleUpdateStats} className="bg-crypto-yellow text-crypto-dark hover:bg-crypto-yellow-light">
                    <Save className="w-4 h-4 mr-2" /> Save Statistics
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card className="bg-crypto-card border-crypto-border">
                <CardHeader>
                  <CardTitle className="text-white">Global Platform Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-crypto-dark rounded-xl border border-crypto-border">
                    <div>
                      <p className="text-white font-medium">Global Withdrawal Freeze</p>
                      <p className="text-gray-400 text-sm">Disable all withdrawals platform-wide</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-crypto-dark rounded-xl border border-crypto-border">
                    <div>
                      <p className="text-white font-medium">Maintenance Mode</p>
                      <p className="text-gray-400 text-sm">Put the entire platform into maintenance</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

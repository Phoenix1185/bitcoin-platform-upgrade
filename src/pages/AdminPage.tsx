import { useState } from 'react';
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

// Sample data
const usersData: User[] = [
  { id: 'user-1', name: 'John Doe', email: 'john@example.com', balance: 5000, totalInvested: 10000, totalReturns: 1200, isAdmin: false, isFrozen: false, withdrawalFrozen: false, kycVerified: true, kycStatus: 'approved', createdAt: '2024-01-01' },
  { id: 'user-2', name: 'Jane Smith', email: 'jane@example.com', balance: 2500, totalInvested: 5000, totalReturns: 600, isAdmin: false, isFrozen: false, withdrawalFrozen: false, kycVerified: true, kycStatus: 'approved', createdAt: '2024-01-05' },
  { id: 'user-3', name: 'Bob Wilson', email: 'bob@example.com', balance: 0, totalInvested: 0, totalReturns: 0, isAdmin: false, isFrozen: true, withdrawalFrozen: true, kycVerified: false, kycStatus: 'not_submitted', createdAt: '2024-01-10' },
  { id: 'user-4', name: 'Alice Brown', email: 'alice@example.com', balance: 15000, totalInvested: 25000, totalReturns: 3000, isAdmin: false, isFrozen: false, withdrawalFrozen: false, kycVerified: true, kycStatus: 'approved', createdAt: '2023-12-15' },
];

const pendingDeposits = [
  { id: 'dep-1', userName: 'John Doe', userEmail: 'john@example.com', amount: 1000, method: 'Bitcoin', createdAt: '2024-01-15 10:30', txHash: '0x123...abc' },
  { id: 'dep-2', userName: 'Jane Smith', userEmail: 'jane@example.com', amount: 2500, method: 'Ethereum', createdAt: '2024-01-15 09:15', txHash: '0x456...def' },
  { id: 'dep-3', userName: 'Bob Wilson', userEmail: 'bob@example.com', amount: 500, method: 'USDT', createdAt: '2024-01-14 16:45', txHash: '0x789...ghi' },
];

const pendingWithdrawals = [
  { id: 'wit-1', userName: 'Alice Brown', userEmail: 'alice@example.com', amount: 2000, method: 'Bitcoin', address: '1A1z...Na', createdAt: '2024-01-15 11:00' },
  { id: 'wit-2', userName: 'John Doe', userEmail: 'john@example.com', amount: 500, method: 'USDT', address: 'TKrz...z1z', createdAt: '2024-01-14 14:30' },
];

const pendingInvestments = [
  { id: 'inv-1', userName: 'Jane Smith', userEmail: 'jane@example.com', planName: 'Gold Plan', amount: 5000, createdAt: '2024-01-15 08:00' },
  { id: 'inv-2', userName: 'Alice Brown', userEmail: 'alice@example.com', planName: 'Platinum Plan', amount: 15000, createdAt: '2024-01-14 10:30' },
];

const sampleTickets: SupportTicket[] = [
  {
    id: 'TKT-001',
    userId: 'user-1',
    userName: 'John Doe',
    userEmail: 'john@example.com',
    subject: 'Deposit not showing in account',
    message: 'I made a deposit of $500 via Bitcoin 2 hours ago but it is not showing in my account.',
    category: 'deposit',
    priority: 'high',
    status: 'open',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'TKT-002',
    userId: 'user-2',
    userName: 'Jane Smith',
    userEmail: 'jane@example.com',
    subject: 'Question about Gold Plan',
    message: 'What is the minimum withdrawal amount for the Gold Plan?',
    category: 'investment',
    priority: 'low',
    status: 'resolved',
    createdAt: '2024-01-14T14:00:00Z',
    updatedAt: '2024-01-14T16:30:00Z',
    resolvedAt: '2024-01-14T16:30:00Z',
  },
];

const sampleChatSessions: LiveChatSession[] = [
  {
    id: 'CHAT-001',
    userId: 'user-1',
    userName: 'John Doe',
    userEmail: 'john@example.com',
    status: 'waiting',
    startedAt: '2024-01-15T10:00:00Z',
    messages: [
      { id: 'msg-1', userId: 'user-1', userName: 'John Doe', userRole: 'user', message: 'Hello, I need help with my deposit', createdAt: '2024-01-15T10:00:00Z', isRead: true },
      { id: 'msg-2', userId: 'bot', userName: 'BitWealth Bot', userRole: 'bot', message: 'Hello! An agent will be with you shortly.', createdAt: '2024-01-15T10:00:30Z', isRead: true },
    ],
  },
];

const sampleNotifications: UserNotification[] = [
  { id: 'notif-1', userId: 'user-1', type: 'deposit', title: 'Deposit Confirmed', message: 'Your deposit of $1,000 has been confirmed.', isRead: false, createdAt: '2024-01-15T10:30:00Z' },
  { id: 'notif-2', userId: 'user-2', type: 'withdrawal', title: 'Withdrawal Approved', message: 'Your withdrawal of $500 has been approved.', isRead: true, createdAt: '2024-01-14T14:30:00Z' },
];

const defaultSiteStats = {
  totalInvested: 50,
  totalInvestedSuffix: 'M+',
  activeInvestors: 25,
  activeInvestorsSuffix: 'K+',
  totalReturns: 12,
  totalReturnsSuffix: 'M+',
  uptime: 99.9,
  uptimeSuffix: '%',
};

const defaultPlans = [
  { id: '1', name: 'Basic Plan', minAmount: 100, maxAmount: 999, dailyReturn: 5, duration: 15, featured: false },
  { id: '2', name: 'Standard Plan', minAmount: 1000, maxAmount: 4999, dailyReturn: 8, duration: 20, featured: false },
  { id: '3', name: 'Gold Plan', minAmount: 5000, maxAmount: 24999, dailyReturn: 12, duration: 30, featured: true },
  { id: '4', name: 'Platinum Plan', minAmount: 25000, maxAmount: 49999, dailyReturn: 15, duration: 45, featured: false },
  { id: '5', name: 'Diamond Plan', minAmount: 50000, maxAmount: 1000000, dailyReturn: 20, duration: 60, featured: false },
];

const defaultSocialLinks = [
  { name: 'Twitter', url: 'https://twitter.com', icon: 'twitter' },
  { name: 'Facebook', url: 'https://facebook.com', icon: 'facebook' },
  { name: 'LinkedIn', url: 'https://linkedin.com', icon: 'linkedin' },
  { name: 'Instagram', url: 'https://instagram.com', icon: 'instagram' },
  { name: 'Telegram', url: 'https://t.me', icon: 'telegram' },
  { name: 'YouTube', url: 'https://youtube.com', icon: 'youtube' },
];

const sampleBlogPosts: BlogPost[] = [
  { id: '1', title: 'Getting Started', slug: 'getting-started', excerpt: 'Learn the basics', content: 'Content here', author: 'Admin', category: 'Guide', tags: [], publishedAt: '2024-01-15', status: 'published', views: 100 },
];

const getSocialIcon = (iconName: string) => {
  switch (iconName) {
    case 'twitter': return Twitter;
    case 'facebook': return Facebook;
    case 'linkedin': return Linkedin;
    case 'instagram': return Instagram;
    case 'youtube': return Youtube;
    case 'telegram': return Send;
    default: return Globe;
  }
};

export default function AdminPage() {
  const navigate = useNavigate();
  const { dispatch } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState(usersData);
  const [siteStats, setSiteStats] = useState(defaultSiteStats);
  const [investmentPlans, setInvestmentPlans] = useState(defaultPlans);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(sampleBlogPosts);
  const [socialLinks, setSocialLinks] = useState(defaultSocialLinks);
  const [tickets, setTickets] = useState<SupportTicket[]>(sampleTickets);
  const [chatSessions, setChatSessions] = useState<LiveChatSession[]>(sampleChatSessions);
  const [userNotifications, setUserNotifications] = useState<UserNotification[]>(sampleNotifications);
  const [globalWithdrawalFrozen, setGlobalWithdrawalFrozen] = useState(false);
  
  // Deposit settings
  const [depositSettings, setDepositSettings] = useState({
    bitcoin: { enabled: true, minAmount: 50 },
    ethereum: { enabled: true, minAmount: 50 },
    usdt: { enabled: true, minAmount: 50, networks: ['trc20', 'erc20', 'bep20'] },
    usdc: { enabled: true, minAmount: 50, networks: ['erc20', 'bep20', 'solana'] },
    bnb: { enabled: true, minAmount: 50 },
    bank: { enabled: false, minAmount: 500, bankName: '', accountName: '', accountNumber: '', routingNumber: '' },
  });

  // Withdrawal settings
  const [withdrawalSettings, setWithdrawalSettings] = useState({
    minAmount: 50,
    maxAmount: 100000,
    processingTime: '24-48 hours',
    fee: 2,
    feeType: 'percentage' as 'fixed' | 'percentage',
  });

  // Deposit addresses
  const [depositAddresses, setDepositAddresses] = useState<{
    bitcoin: string;
    ethereum: string;
    usdt: { trc20: string; erc20: string; bep20: string };
    usdc: { erc20: string; bep20: string; solana: string };
    bnb: string;
  }>({
    bitcoin: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    ethereum: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    usdt: { trc20: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t', erc20: '0xdAC17F958D2ee523a2206206994597C13D831ec7', bep20: '0x55d398326f99059fF775485246999027B3197955' },
    usdc: { erc20: '0xA0b86a33E6441E6C7D3D4B4f6c7D8E9f0A1B2C3D', bep20: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', solana: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' },
    bnb: 'bnb1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
  });

  // Email campaign
  const [emailCampaign, setEmailCampaign] = useState({
    subject: '',
    body: '',
    recipients: 'all' as 'all' | 'specific',
    specificUsers: [] as string[],
  });
  
  // Dialog states
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isStatsDialogOpen, setIsStatsDialogOpen] = useState(false);
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
  const [isBlogDialogOpen, setIsBlogDialogOpen] = useState(false);
  const [isSocialLinksDialogOpen, setIsSocialLinksDialogOpen] = useState(false);
  const [isDepositSettingsDialogOpen, setIsDepositSettingsDialogOpen] = useState(false);
  const [isWithdrawalSettingsDialogOpen, setIsWithdrawalSettingsDialogOpen] = useState(false);
  const [isEmailCampaignDialogOpen, setIsEmailCampaignDialogOpen] = useState(false);
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false);
  const [isChatDialogOpen, setIsChatDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<typeof investmentPlans[0] | null>(null);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [editingLink, setEditingLink] = useState<{ index: number; name: string; url: string; icon: string } | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [selectedChat, setSelectedChat] = useState<LiveChatSession | null>(null);
  const [ticketReply, setTicketReply] = useState('');
  const [chatReply, setChatReply] = useState('');
  
  const [fundAmount, setFundAmount] = useState('');
  const [fundType, setFundType] = useState<'add' | 'remove'>('add');

  // Blog form state
  const [blogForm, setBlogForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    tags: '',
    author: '',
    status: 'draft' as 'published' | 'draft' | 'archived',
    featured: false,
  });

  const handleApproveDeposit = (id: string) => {
    toast.success(`Deposit ${id} approved successfully`);
    // Send notification to user
    const deposit = pendingDeposits.find(d => d.id === id);
    if (deposit) {
      const user = users.find(u => u.email === deposit.userEmail);
      if (user) {
        addNotification(user.id, 'deposit', 'Deposit Confirmed', `Your deposit of $${deposit.amount} has been confirmed and added to your balance.`);
      }
    }
  };

  const handleRejectDeposit = (id: string) => {
    toast.error(`Deposit ${id} rejected`);
    const deposit = pendingDeposits.find(d => d.id === id);
    if (deposit) {
      const user = users.find(u => u.email === deposit.userEmail);
      if (user) {
        addNotification(user.id, 'deposit', 'Deposit Declined', `Your deposit of $${deposit.amount} was declined. Please contact support.`);
      }
    }
  };

  const handleApproveWithdrawal = (id: string) => {
    toast.success(`Withdrawal ${id} approved successfully`);
    const withdrawal = pendingWithdrawals.find(w => w.id === id);
    if (withdrawal) {
      const user = users.find(u => u.email === withdrawal.userEmail);
      if (user) {
        addNotification(user.id, 'withdrawal', 'Withdrawal Approved', `Your withdrawal of $${withdrawal.amount} has been approved and is being processed.`);
      }
    }
  };

  const handleRejectWithdrawal = (id: string) => {
    toast.error(`Withdrawal ${id} rejected`);
    const withdrawal = pendingWithdrawals.find(w => w.id === id);
    if (withdrawal) {
      const user = users.find(u => u.email === withdrawal.userEmail);
      if (user) {
        addNotification(user.id, 'withdrawal', 'Withdrawal Declined', `Your withdrawal of $${withdrawal.amount} was declined. Please contact support.`);
      }
    }
  };

  const handleApproveInvestment = (id: string) => {
    toast.success(`Investment ${id} approved successfully`);
  };

  const handleRejectInvestment = (id: string) => {
    toast.error(`Investment ${id} rejected`);
  };

  const handleFreezeAccount = (userId: string, freeze: boolean) => {
    setUsers(users.map(u => u.id === userId ? { ...u, isFrozen: freeze } : u));
    toast.success(`Account ${freeze ? 'frozen' : 'unfrozen'} successfully`);
    addNotification(userId, 'account', freeze ? 'Account Frozen' : 'Account Unfrozen', `Your account has been ${freeze ? 'frozen' : 'unfrozen'}. ${freeze ? 'Please contact support.' : ''}`);
  };

  const handleManageFunds = () => {
    if (!selectedUser || !fundAmount) return;

    const amount = parseFloat(fundAmount);
    const newBalance = fundType === 'add' 
      ? selectedUser.balance + amount 
      : selectedUser.balance - amount;

    if (fundType === 'remove' && newBalance < 0) {
      toast.error('Cannot remove more than current balance');
      return;
    }

    setUsers(users.map(u => u.id === selectedUser.id ? { ...u, balance: newBalance } : u));
    toast.success(`Successfully ${fundType === 'add' ? 'added' : 'removed'} $${amount} ${fundType === 'add' ? 'to' : 'from'} user account`);
    addNotification(selectedUser.id, 'account', fundType === 'add' ? 'Funds Added' : 'Funds Removed', `$${amount} has been ${fundType === 'add' ? 'added to' : 'removed from'} your account.`);
    setFundAmount('');
    setIsUserDialogOpen(false);
  };

  const handleSaveStats = () => {
    dispatch({ type: 'SET_SITE_SETTINGS', payload: { stats: siteStats } });
    toast.success('Site statistics updated successfully');
    setIsStatsDialogOpen(false);
  };

  const handleSavePlan = () => {
    if (!editingPlan) return;
    
    setInvestmentPlans(plans => 
      plans.map(p => p.id === editingPlan.id ? editingPlan : p)
    );
    
    dispatch({ type: 'SET_INVESTMENT_PLANS', payload: 
      investmentPlans.map(p => p.id === editingPlan.id ? editingPlan : p)
    });
    
    toast.success('Investment plan updated successfully');
    setIsPlanDialogOpen(false);
    setEditingPlan(null);
  };

  // Blog management functions
  const handleCreateBlogPost = () => {
    setEditingPost(null);
    setBlogForm({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: '',
      tags: '',
      author: 'BitWealth Team',
      status: 'draft',
      featured: false,
    });
    setIsBlogDialogOpen(true);
  };

  const handleEditBlogPost = (post: BlogPost) => {
    setEditingPost(post);
    setBlogForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      tags: post.tags.join(', '),
      author: post.author,
      status: post.status,
      featured: post.featured || false,
    });
    setIsBlogDialogOpen(true);
  };

  const handleDeleteBlogPost = (postId: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      setBlogPosts(posts => posts.filter(p => p.id !== postId));
      dispatch({ type: 'DELETE_BLOG_POST', id: postId });
      toast.success('Blog post deleted successfully');
    }
  };

  const handleSaveBlogPost = () => {
    if (!blogForm.title || !blogForm.excerpt || !blogForm.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    const slug = blogForm.slug || blogForm.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const tags = blogForm.tags.split(',').map(t => t.trim()).filter(Boolean);

    if (editingPost) {
      const updatedPost: BlogPost = {
        ...editingPost,
        title: blogForm.title,
        slug,
        excerpt: blogForm.excerpt,
        content: blogForm.content,
        category: blogForm.category,
        tags,
        author: blogForm.author,
        status: blogForm.status,
        featured: blogForm.featured,
        updatedAt: new Date().toISOString(),
      };
      setBlogPosts(posts => posts.map(p => p.id === editingPost.id ? updatedPost : p));
      dispatch({ type: 'UPDATE_BLOG_POST', id: editingPost.id, payload: updatedPost });
      toast.success('Blog post updated successfully');
    } else {
      const newPost: BlogPost = {
        id: `post-${Date.now()}`,
        title: blogForm.title,
        slug,
        excerpt: blogForm.excerpt,
        content: blogForm.content,
        category: blogForm.category,
        tags,
        author: blogForm.author,
        status: blogForm.status,
        featured: blogForm.featured,
        publishedAt: blogForm.status === 'published' ? new Date().toISOString() : '',
        views: 0,
      };
      setBlogPosts(posts => [newPost, ...posts]);
      dispatch({ type: 'ADD_BLOG_POST', payload: newPost });
      toast.success('Blog post created successfully');
    }
    setIsBlogDialogOpen(false);
  };

  // Social links functions
  const handleSaveSocialLinks = () => {
    dispatch({ type: 'SET_SITE_SETTINGS', payload: { socialLinks } });
    toast.success('Social links updated successfully');
    setIsSocialLinksDialogOpen(false);
  };

  const handleUpdateSocialLink = () => {
    if (!editingLink) return;
    const newLinks = [...socialLinks];
    newLinks[editingLink.index] = {
      name: editingLink.name,
      url: editingLink.url,
      icon: editingLink.icon,
    };
    setSocialLinks(newLinks);
    setEditingLink(null);
  };

  // Deposit settings functions
  const handleSaveDepositSettings = () => {
    dispatch({ type: 'SET_SITE_SETTINGS', payload: { depositMethods: depositSettings, depositAddresses } });
    toast.success('Deposit settings updated successfully');
    setIsDepositSettingsDialogOpen(false);
  };

  // Withdrawal settings functions
  const handleSaveWithdrawalSettings = () => {
    dispatch({ type: 'SET_SITE_SETTINGS', payload: { withdrawalSettings } });
    toast.success('Withdrawal settings updated successfully');
    setIsWithdrawalSettingsDialogOpen(false);
  };

  // Email campaign functions
  const handleSendEmailCampaign = () => {
    if (!emailCampaign.subject || !emailCampaign.body) {
      toast.error('Please fill in subject and message');
      return;
    }
    toast.success(`Email campaign sent to ${emailCampaign.recipients === 'all' ? 'all users' : 'selected users'}`);
    setEmailCampaign({ subject: '', body: '', recipients: 'all', specificUsers: [] });
    setIsEmailCampaignDialogOpen(false);
  };

  // Ticket functions
  const handleTicketReply = () => {
    if (!ticketReply.trim() || !selectedTicket) return;
    toast.success('Reply sent to user');
    setTicketReply('');
    setTickets(tickets.map(t => t.id === selectedTicket.id ? { ...t, status: 'in_progress' as const } : t));
    addNotification(selectedTicket.userId, 'support', 'Ticket Reply', `You have a new reply to ticket #${selectedTicket.id}`);
  };

  const handleCloseTicket = () => {
    if (!selectedTicket) return;
    setTickets(tickets.map(t => t.id === selectedTicket.id ? { ...t, status: 'closed' as const } : t));
    toast.success('Ticket closed');
    setIsTicketDialogOpen(false);
  };

  // Chat functions
  const handleChatReply = () => {
    if (!chatReply.trim() || !selectedChat) return;
    toast.success('Message sent');
    setChatReply('');
    setChatSessions(sessions => sessions.map(s => 
      s.id === selectedChat.id 
        ? { ...s, status: 'active', messages: [...s.messages, { id: `msg-${Date.now()}`, userId: 'admin', userName: 'Support Agent', userRole: 'support', message: chatReply, createdAt: new Date().toISOString(), isRead: true }] }
        : s
    ));
  };

  const handleCloseChat = () => {
    if (!selectedChat) return;
    setChatSessions(sessions => sessions.map(s => s.id === selectedChat.id ? { ...s, status: 'closed' } : s));
    toast.success('Chat closed');
    setIsChatDialogOpen(false);
  };

  // Notification helper
  const addNotification = (userId: string, type: UserNotification['type'], title: string, message: string) => {
    const newNotification: UserNotification = {
      id: `notif-${Date.now()}`,
      userId,
      type,
      title,
      message,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setUserNotifications([newNotification, ...userNotifications]);
    dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });
  };

  // Withdrawal freeze functions
  const handleToggleUserWithdrawalFreeze = (userId: string, freeze: boolean) => {
    setUsers(users.map(u => u.id === userId ? { ...u, withdrawalFrozen: freeze } : u));
    toast.success(`User withdrawal ${freeze ? 'frozen' : 'unfrozen'} successfully`);
    addNotification(userId, 'account', freeze ? 'Withdrawal Frozen' : 'Withdrawal Unfrozen', `Your withdrawal capability has been ${freeze ? 'frozen' : 'unfrozen'}.`);
  };

  const handleToggleGlobalWithdrawalFreeze = () => {
    setGlobalWithdrawalFrozen(!globalWithdrawalFrozen);
    dispatch({ type: 'SET_SITE_SETTINGS', payload: { globalWithdrawalFrozen: !globalWithdrawalFrozen } });
    toast.success(`Global withdrawal ${!globalWithdrawalFrozen ? 'frozen' : 'unfrozen'} successfully`);
  };

  const stats = [
    { title: 'Total Users', value: users.length, icon: Users, color: 'text-blue-500' },
    { title: 'Total Deposits', value: '$45,000', icon: Wallet, color: 'text-green-500' },
    { title: 'Total Investments', value: '$120,000', icon: PiggyBank, color: 'text-crypto-yellow' },
    { title: 'Pending Requests', value: pendingDeposits.length + pendingWithdrawals.length + pendingInvestments.length, icon: Activity, color: 'text-orange-500' },
  ];

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBlogPosts = blogPosts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTickets = tickets.filter(ticket =>
    ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const config = TICKET_STATUSES.find(s => s.value === status);
    return <Badge className={`${config?.color || 'bg-gray-500'} text-white`}>{config?.label}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const config = TICKET_PRIORITIES.find(p => p.value === priority);
    return <Badge className={`${config?.color || 'bg-gray-500'} text-white`}>{config?.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-crypto-dark">
      <Header />
      
      <main className="pt-20 md:pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 md:mb-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="text-white hover:bg-crypto-card self-start"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-white">
                Admin Dashboard
              </h1>
              <p className="text-gray-400 mt-1 text-sm md:text-base">
                Manage users, transactions, and platform settings
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
            {stats.map((stat) => (
              <Card key={stat.title} className="bg-crypto-card border-crypto-border">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs md:text-sm text-gray-400 mb-1">{stat.title}</p>
                      <p className={`text-xl md:text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-opacity-20 flex items-center justify-center ${stat.color.replace('text', 'bg')}`}>
                      <stat.icon className={`w-5 h-5 md:w-6 md:h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3 mb-6 md:mb-8">
            <Button onClick={() => setIsStatsDialogOpen(true)} variant="outline" className="border-crypto-border text-white hover:bg-crypto-card text-sm">
              <TrendingUp className="w-4 h-4 mr-2" />
              Edit Site Stats
            </Button>
            <Button onClick={() => { setEditingPlan(investmentPlans[0]); setIsPlanDialogOpen(true); }} variant="outline" className="border-crypto-border text-white hover:bg-crypto-card text-sm">
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Plans
            </Button>
            <Button onClick={() => setIsSocialLinksDialogOpen(true)} variant="outline" className="border-crypto-border text-white hover:bg-crypto-card text-sm">
              <LinkIcon className="w-4 h-4 mr-2" />
              Social Links
            </Button>
            <Button onClick={() => setIsDepositSettingsDialogOpen(true)} variant="outline" className="border-crypto-border text-white hover:bg-crypto-card text-sm">
              <CreditCard className="w-4 h-4 mr-2" />
              Deposit Settings
            </Button>
            <Button onClick={() => setIsWithdrawalSettingsDialogOpen(true)} variant="outline" className="border-crypto-border text-white hover:bg-crypto-card text-sm">
              <DollarSign className="w-4 h-4 mr-2" />
              Withdrawal Settings
            </Button>
            <Button onClick={() => setIsEmailCampaignDialogOpen(true)} variant="outline" className="border-crypto-border text-white hover:bg-crypto-card text-sm">
              <Mail className="w-4 h-4 mr-2" />
              Email Campaign
            </Button>
            <Button onClick={handleToggleGlobalWithdrawalFreeze} variant="outline" className={`text-sm ${globalWithdrawalFrozen ? 'bg-red-500/20 border-red-500 text-red-400 hover:bg-red-500/30' : 'border-crypto-border text-white hover:bg-crypto-card'}`}>
              <Ban className="w-4 h-4 mr-2" />
              {globalWithdrawalFrozen ? 'Unfreeze Global W/D' : 'Freeze Global W/D'}
            </Button>
          </div>

          {/* Main Tabs */}
          <Tabs defaultValue="deposits" className="space-y-4 md:space-y-6">
            <TabsList className="bg-crypto-card border border-crypto-border flex-wrap h-auto w-full">
              <TabsTrigger value="deposits" className="flex-1 sm:flex-none data-[state=active]:bg-crypto-yellow data-[state=active]:text-crypto-dark text-xs md:text-sm">
                <Wallet className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                Deposits ({pendingDeposits.length})
              </TabsTrigger>
              <TabsTrigger value="withdrawals" className="flex-1 sm:flex-none data-[state=active]:bg-crypto-yellow data-[state=active]:text-crypto-dark text-xs md:text-sm">
                <DollarSign className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                Withdrawals ({pendingWithdrawals.length})
              </TabsTrigger>
              <TabsTrigger value="investments" className="flex-1 sm:flex-none data-[state=active]:bg-crypto-yellow data-[state=active]:text-crypto-dark text-xs md:text-sm">
                <PiggyBank className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                Investments ({pendingInvestments.length})
              </TabsTrigger>
              <TabsTrigger value="users" className="flex-1 sm:flex-none data-[state=active]:bg-crypto-yellow data-[state=active]:text-crypto-dark text-xs md:text-sm">
                <Users className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                Users
              </TabsTrigger>
              <TabsTrigger value="tickets" className="flex-1 sm:flex-none data-[state=active]:bg-crypto-yellow data-[state=active]:text-crypto-dark text-xs md:text-sm">
                <MessageSquare className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                Tickets ({tickets.filter(t => t.status === 'open').length})
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex-1 sm:flex-none data-[state=active]:bg-crypto-yellow data-[state=active]:text-crypto-dark text-xs md:text-sm">
                <Headphones className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                Live Chat ({chatSessions.filter(c => c.status === 'waiting').length})
              </TabsTrigger>
              <TabsTrigger value="blog" className="flex-1 sm:flex-none data-[state=active]:bg-crypto-yellow data-[state=active]:text-crypto-dark text-xs md:text-sm">
                <FileText className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                Blog ({blogPosts.length})
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex-1 sm:flex-none data-[state=active]:bg-crypto-yellow data-[state=active]:text-crypto-dark text-xs md:text-sm">
                <Bell className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                Notifications
              </TabsTrigger>
            </TabsList>

            {/* Deposits Tab */}
            <TabsContent value="deposits">
              <Card className="bg-crypto-card border-crypto-border">
                <CardHeader className="flex flex-row items-center justify-between p-4 md:p-6">
                  <CardTitle className="text-white text-base md:text-lg">Pending Deposits</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-crypto-border">
                          <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-medium text-gray-400">User</th>
                          <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-medium text-gray-400">Amount</th>
                          <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-medium text-gray-400 hidden sm:table-cell">Method</th>
                          <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-medium text-gray-400">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingDeposits.map((deposit) => (
                          <tr key={deposit.id} className="border-b border-crypto-border/50">
                            <td className="py-2 md:py-4 px-2 md:px-4">
                              <div>
                                <p className="text-white font-medium text-xs md:text-sm">{deposit.userName}</p>
                                <p className="text-gray-400 text-[10px] md:text-xs">{deposit.userEmail}</p>
                              </div>
                            </td>
                            <td className="py-2 md:py-4 px-2 md:px-4">
                              <span className="text-green-500 font-medium text-xs md:text-sm">+${deposit.amount.toLocaleString()}</span>
                            </td>
                            <td className="py-2 md:py-4 px-2 md:px-4 text-gray-300 text-xs md:text-sm hidden sm:table-cell">{deposit.method}</td>
                            <td className="py-2 md:py-4 px-2 md:px-4">
                              <div className="flex gap-1 md:gap-2">
                                <Button size="sm" onClick={() => handleApproveDeposit(deposit.id)} className="bg-green-500 text-white hover:bg-green-600 text-[10px] md:text-xs px-2 md:px-3 h-7 md:h-8">
                                  <CheckCircle className="w-3 h-3 mr-0.5 md:mr-1" />
                                  <span className="hidden sm:inline">Approve</span>
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleRejectDeposit(deposit.id)} className="border-red-500 text-red-500 hover:bg-red-500/20 text-[10px] md:text-xs px-2 md:px-3 h-7 md:h-8">
                                  <XCircle className="w-3 h-3 mr-0.5 md:mr-1" />
                                  <span className="hidden sm:inline">Reject</span>
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

            {/* Withdrawals Tab */}
            <TabsContent value="withdrawals">
              <Card className="bg-crypto-card border-crypto-border">
                <CardHeader className="flex flex-row items-center justify-between p-4 md:p-6">
                  <CardTitle className="text-white text-base md:text-lg">Pending Withdrawals</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-crypto-border">
                          <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-medium text-gray-400">User</th>
                          <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-medium text-gray-400">Amount</th>
                          <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-medium text-gray-400 hidden sm:table-cell">Method</th>
                          <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-medium text-gray-400">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingWithdrawals.map((withdrawal) => (
                          <tr key={withdrawal.id} className="border-b border-crypto-border/50">
                            <td className="py-2 md:py-4 px-2 md:px-4">
                              <div>
                                <p className="text-white font-medium text-xs md:text-sm">{withdrawal.userName}</p>
                                <p className="text-gray-400 text-[10px] md:text-xs">{withdrawal.userEmail}</p>
                              </div>
                            </td>
                            <td className="py-2 md:py-4 px-2 md:px-4">
                              <span className="text-red-500 font-medium text-xs md:text-sm">-${withdrawal.amount.toLocaleString()}</span>
                            </td>
                            <td className="py-2 md:py-4 px-2 md:px-4 text-gray-300 text-xs md:text-sm hidden sm:table-cell">{withdrawal.method}</td>
                            <td className="py-2 md:py-4 px-2 md:px-4">
                              <div className="flex gap-1 md:gap-2">
                                <Button size="sm" onClick={() => handleApproveWithdrawal(withdrawal.id)} className="bg-green-500 text-white hover:bg-green-600 text-[10px] md:text-xs px-2 md:px-3 h-7 md:h-8">
                                  <CheckCircle className="w-3 h-3 mr-0.5 md:mr-1" />
                                  <span className="hidden sm:inline">Approve</span>
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleRejectWithdrawal(withdrawal.id)} className="border-red-500 text-red-500 hover:bg-red-500/20 text-[10px] md:text-xs px-2 md:px-3 h-7 md:h-8">
                                  <XCircle className="w-3 h-3 mr-0.5 md:mr-1" />
                                  <span className="hidden sm:inline">Reject</span>
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

            {/* Investments Tab */}
            <TabsContent value="investments">
              <Card className="bg-crypto-card border-crypto-border">
                <CardHeader className="flex flex-row items-center justify-between p-4 md:p-6">
                  <CardTitle className="text-white text-base md:text-lg">Pending Investments</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-crypto-border">
                          <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-medium text-gray-400">User</th>
                          <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-medium text-gray-400">Plan</th>
                          <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-medium text-gray-400">Amount</th>
                          <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-medium text-gray-400">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingInvestments.map((investment) => (
                          <tr key={investment.id} className="border-b border-crypto-border/50">
                            <td className="py-2 md:py-4 px-2 md:px-4">
                              <div>
                                <p className="text-white font-medium text-xs md:text-sm">{investment.userName}</p>
                                <p className="text-gray-400 text-[10px] md:text-xs">{investment.userEmail}</p>
                              </div>
                            </td>
                            <td className="py-2 md:py-4 px-2 md:px-4">
                              <span className="text-crypto-yellow font-medium text-xs md:text-sm">{investment.planName}</span>
                            </td>
                            <td className="py-2 md:py-4 px-2 md:px-4">
                              <span className="text-white font-medium text-xs md:text-sm">${investment.amount.toLocaleString()}</span>
                            </td>
                            <td className="py-2 md:py-4 px-2 md:px-4">
                              <div className="flex gap-1 md:gap-2">
                                <Button size="sm" onClick={() => handleApproveInvestment(investment.id)} className="bg-green-500 text-white hover:bg-green-600 text-[10px] md:text-xs px-2 md:px-3 h-7 md:h-8">
                                  <CheckCircle className="w-3 h-3 mr-0.5 md:mr-1" />
                                  <span className="hidden sm:inline">Approve</span>
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleRejectInvestment(investment.id)} className="border-red-500 text-red-500 hover:bg-red-500/20 text-[10px] md:text-xs px-2 md:px-3 h-7 md:h-8">
                                  <XCircle className="w-3 h-3 mr-0.5 md:mr-1" />
                                  <span className="hidden sm:inline">Reject</span>
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

            {/* Users Tab */}
            <TabsContent value="users">
              <Card className="bg-crypto-card border-crypto-border">
                <CardHeader className="p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
                    <CardTitle className="text-white text-base md:text-lg">User Management</CardTitle>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 text-gray-500" />
                      <Input type="text" placeholder="Search users..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-8 md:pl-10 bg-crypto-dark border-crypto-border text-white w-full sm:w-48 md:w-64 text-sm h-9 md:h-10" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-crypto-border">
                          <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-medium text-gray-400">User</th>
                          <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-medium text-gray-400">Balance</th>
                          <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-medium text-gray-400">Status</th>
                          <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-medium text-gray-400">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user) => (
                          <tr key={user.id} className="border-b border-crypto-border/50">
                            <td className="py-2 md:py-4 px-2 md:px-4">
                              <div>
                                <p className="text-white font-medium text-xs md:text-sm">{user.name}</p>
                                <p className="text-gray-400 text-[10px] md:text-xs">{user.email}</p>
                              </div>
                            </td>
                            <td className="py-2 md:py-4 px-2 md:px-4">
                              <span className="text-white text-xs md:text-sm">${user.balance.toLocaleString()}</span>
                            </td>
                            <td className="py-2 md:py-4 px-2 md:px-4">
                              <div className="flex flex-col gap-1">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] md:text-xs font-medium w-fit ${user.isFrozen ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
                                  {user.isFrozen ? 'Frozen' : 'Active'}
                                </span>
                                {user.withdrawalFrozen && (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] md:text-xs font-medium w-fit bg-orange-500/20 text-orange-500">W/D Frozen</span>
                                )}
                              </div>
                            </td>
                            <td className="py-2 md:py-4 px-2 md:px-4">
                              <div className="flex gap-1 md:gap-2">
                                <Button size="sm" variant="outline" onClick={() => { setSelectedUser(user); setIsUserDialogOpen(true); }} className="border-crypto-border text-white hover:bg-crypto-dark text-[10px] md:text-xs px-2 md:px-3 h-7 md:h-8">
                                  <Eye className="w-3 h-3 mr-0.5 md:mr-1" />
                                  <span className="hidden sm:inline">View</span>
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleFreezeAccount(user.id, !user.isFrozen)} className={user.isFrozen ? 'border-green-500 text-green-500 hover:bg-green-500/20 text-[10px] md:text-xs px-2 md:px-3 h-7 md:h-8' : 'border-red-500 text-red-500 hover:bg-red-500/20 text-[10px] md:text-xs px-2 md:px-3 h-7 md:h-8'}>
                                  {user.isFrozen ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleToggleUserWithdrawalFreeze(user.id, !user.withdrawalFrozen)} className={user.withdrawalFrozen ? 'border-green-500 text-green-500 hover:bg-green-500/20 text-[10px] md:text-xs px-2 md:px-3 h-7 md:h-8' : 'border-orange-500 text-orange-500 hover:bg-orange-500/20 text-[10px] md:text-xs px-2 md:px-3 h-7 md:h-8'}>
                                  <Ban className="w-3 h-3" />
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

            {/* Tickets Tab */}
            <TabsContent value="tickets">
              <Card className="bg-crypto-card border-crypto-border">
                <CardHeader className="p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
                    <CardTitle className="text-white text-base md:text-lg">Support Tickets</CardTitle>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 text-gray-500" />
                      <Input type="text" placeholder="Search tickets..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-8 md:pl-10 bg-crypto-dark border-crypto-border text-white w-full sm:w-48 md:w-64 text-sm h-9 md:h-10" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-crypto-border">
                          <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-medium text-gray-400">Ticket</th>
                          <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-medium text-gray-400">User</th>
                          <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-medium text-gray-400">Status</th>
                          <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-medium text-gray-400">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTickets.map((ticket) => (
                          <tr key={ticket.id} className="border-b border-crypto-border/50">
                            <td className="py-2 md:py-4 px-2 md:px-4">
                              <div>
                                <p className="text-white font-medium text-xs md:text-sm">{ticket.subject}</p>
                                <p className="text-gray-400 text-[10px] md:text-xs">{TICKET_CATEGORIES.find(c => c.value === ticket.category)?.label}</p>
                              </div>
                            </td>
                            <td className="py-2 md:py-4 px-2 md:px-4">
                              <p className="text-white text-xs md:text-sm">{ticket.userName}</p>
                            </td>
                            <td className="py-2 md:py-4 px-2 md:px-4">
                              <div className="flex flex-col gap-1">
                                {getStatusBadge(ticket.status)}
                                {getPriorityBadge(ticket.priority)}
                              </div>
                            </td>
                            <td className="py-2 md:py-4 px-2 md:px-4">
                              <Button size="sm" variant="outline" onClick={() => { setSelectedTicket(ticket); setIsTicketDialogOpen(true); }} className="border-crypto-border text-white hover:bg-crypto-dark text-[10px] md:text-xs px-2 md:px-3 h-7 md:h-8">
                                <MessageSquare className="w-3 h-3 mr-0.5 md:mr-1" />
                                <span className="hidden sm:inline">Reply</span>
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

            {/* Live Chat Tab */}
            <TabsContent value="chat">
              <Card className="bg-crypto-card border-crypto-border">
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="text-white text-base md:text-lg">Live Chat Sessions</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-crypto-border">
                          <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-medium text-gray-400">User</th>
                          <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-medium text-gray-400">Status</th>
                          <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-medium text-gray-400">Started</th>
                          <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-medium text-gray-400">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {chatSessions.map((chat) => (
                          <tr key={chat.id} className="border-b border-crypto-border/50">
                            <td className="py-2 md:py-4 px-2 md:px-4">
                              <div>
                                <p className="text-white font-medium text-xs md:text-sm">{chat.userName}</p>
                                <p className="text-gray-400 text-[10px] md:text-xs">{chat.userEmail}</p>
                              </div>
                            </td>
                            <td className="py-2 md:py-4 px-2 md:px-4">
                              <Badge className={chat.status === 'waiting' ? 'bg-yellow-500' : chat.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}>
                                {chat.status}
                              </Badge>
                            </td>
                            <td className="py-2 md:py-4 px-2 md:px-4 text-gray-400 text-xs md:text-sm">
                              {new Date(chat.startedAt).toLocaleString()}
                            </td>
                            <td className="py-2 md:py-4 px-2 md:px-4">
                              <Button size="sm" variant="outline" onClick={() => { setSelectedChat(chat); setIsChatDialogOpen(true); }} className="border-crypto-border text-white hover:bg-crypto-dark text-[10px] md:text-xs px-2 md:px-3 h-7 md:h-8">
                                <Headphones className="w-3 h-3 mr-0.5 md:mr-1" />
                                <span className="hidden sm:inline">Join Chat</span>
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

            {/* Blog Tab */}
            <TabsContent value="blog">
              <Card className="bg-crypto-card border-crypto-border">
                <CardHeader className="p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
                    <CardTitle className="text-white text-base md:text-lg">Blog Management</CardTitle>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 text-gray-500" />
                        <Input type="text" placeholder="Search posts..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-8 md:pl-10 bg-crypto-dark border-crypto-border text-white w-full sm:w-40 md:w-56 text-sm h-9 md:h-10" />
                      </div>
                      <Button onClick={handleCreateBlogPost} className="bg-crypto-yellow text-crypto-dark hover:bg-crypto-yellow-light text-xs md:text-sm">
                        <Plus className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                        New Post
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-crypto-border">
                          <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-medium text-gray-400">Title</th>
                          <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-medium text-gray-400 hidden sm:table-cell">Category</th>
                          <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-medium text-gray-400">Status</th>
                          <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-medium text-gray-400">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredBlogPosts.map((post) => (
                          <tr key={post.id} className="border-b border-crypto-border/50">
                            <td className="py-2 md:py-4 px-2 md:px-4">
                              <div>
                                <p className="text-white font-medium text-xs md:text-sm">{post.title}</p>
                                <p className="text-gray-400 text-[10px] md:text-xs">{post.author} • {new Date(post.publishedAt).toLocaleDateString()}</p>
                              </div>
                            </td>
                            <td className="py-2 md:py-4 px-2 md:px-4 text-gray-300 text-xs md:text-sm hidden sm:table-cell">{post.category}</td>
                            <td className="py-2 md:py-4 px-2 md:px-4">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] md:text-xs font-medium ${post.status === 'published' ? 'bg-green-500/20 text-green-500' : post.status === 'draft' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-gray-500/20 text-gray-500'}`}>
                                {post.status}
                              </span>
                            </td>
                            <td className="py-2 md:py-4 px-2 md:px-4">
                              <div className="flex gap-1 md:gap-2">
                                <Button size="sm" variant="outline" onClick={() => handleEditBlogPost(post)} className="border-crypto-border text-white hover:bg-crypto-dark text-[10px] md:text-xs px-2 md:px-3 h-7 md:h-8">
                                  <Edit3 className="w-3 h-3 mr-0.5 md:mr-1" />
                                  <span className="hidden sm:inline">Edit</span>
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleDeleteBlogPost(post.id)} className="border-red-500 text-red-500 hover:bg-red-500/20 text-[10px] md:text-xs px-2 md:px-3 h-7 md:h-8">
                                  <Trash2 className="w-3 h-3" />
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

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <Card className="bg-crypto-card border-crypto-border">
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="text-white text-base md:text-lg">System Notifications</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-crypto-border">
                          <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-medium text-gray-400">User</th>
                          <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-medium text-gray-400">Type</th>
                          <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-medium text-gray-400">Message</th>
                          <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-medium text-gray-400">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userNotifications.map((notif) => (
                          <tr key={notif.id} className="border-b border-crypto-border/50">
                            <td className="py-2 md:py-4 px-2 md:px-4">
                              <p className="text-white text-xs md:text-sm">{users.find(u => u.id === notif.userId)?.name || notif.userId}</p>
                            </td>
                            <td className="py-2 md:py-4 px-2 md:px-4">
                              <Badge className="bg-crypto-yellow/20 text-crypto-yellow">{notif.type}</Badge>
                            </td>
                            <td className="py-2 md:py-4 px-2 md:px-4">
                              <p className="text-white font-medium text-xs md:text-sm">{notif.title}</p>
                              <p className="text-gray-400 text-[10px] md:text-xs">{notif.message}</p>
                            </td>
                            <td className="py-2 md:py-4 px-2 md:px-4">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] md:text-xs font-medium ${notif.isRead ? 'bg-gray-500/20 text-gray-500' : 'bg-blue-500/20 text-blue-500'}`}>
                                {notif.isRead ? 'Read' : 'Unread'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* User Management Dialog */}
      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent className="bg-crypto-card border-crypto-border text-white max-w-md md:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl font-display">Manage User: {selectedUser?.name}</DialogTitle>
            <DialogDescription className="text-gray-400 text-sm">{selectedUser?.email}</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 md:space-y-6 py-4">
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="p-3 md:p-4 rounded-xl bg-crypto-dark border border-crypto-border">
                <p className="text-gray-400 text-xs md:text-sm">Current Balance</p>
                <p className="text-lg md:text-xl font-bold text-white">${selectedUser?.balance.toLocaleString()}</p>
              </div>
              <div className="p-3 md:p-4 rounded-xl bg-crypto-dark border border-crypto-border">
                <p className="text-gray-400 text-xs md:text-sm">Total Invested</p>
                <p className="text-lg md:text-xl font-bold text-crypto-yellow">${selectedUser?.totalInvested.toLocaleString()}</p>
              </div>
            </div>

            <div className="p-3 md:p-4 rounded-xl bg-crypto-dark border border-crypto-border">
              <p className="text-white font-medium mb-3 md:mb-4 text-sm md:text-base">Manage Funds</p>
              <div className="flex gap-2 mb-3 md:mb-4">
                <Button size="sm" variant={fundType === 'add' ? 'default' : 'outline'} onClick={() => setFundType('add')} className={fundType === 'add' ? 'bg-green-500 text-white text-xs' : 'border-crypto-border text-white text-xs'}>
                  <Plus className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                  Add
                </Button>
                <Button size="sm" variant={fundType === 'remove' ? 'default' : 'outline'} onClick={() => setFundType('remove')} className={fundType === 'remove' ? 'bg-red-500 text-white text-xs' : 'border-crypto-border text-white text-xs'}>
                  <Minus className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                  Remove
                </Button>
              </div>
              <div className="flex gap-2">
                <Input type="number" value={fundAmount} onChange={(e) => setFundAmount(e.target.value)} placeholder="Enter amount" className="bg-crypto-card border-crypto-border text-white text-sm" />
                <Button onClick={handleManageFunds} disabled={!fundAmount} className={fundType === 'add' ? 'bg-green-500 text-white hover:bg-green-600 text-xs' : 'bg-red-500 text-white hover:bg-red-600 text-xs'}>
                  {fundType === 'add' ? 'Add' : 'Remove'}
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 md:gap-3">
              <Button variant="outline" onClick={() => selectedUser && handleFreezeAccount(selectedUser.id, !selectedUser.isFrozen)} className={`flex-1 text-xs md:text-sm ${selectedUser?.isFrozen ? 'border-green-500 text-green-500 hover:bg-green-500/20' : 'border-red-500 text-red-500 hover:bg-red-500/20'}`}>
                {selectedUser?.isFrozen ? <Unlock className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" /> : <Lock className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />}
                {selectedUser?.isFrozen ? 'Unfreeze Account' : 'Freeze Account'}
              </Button>
              <Button variant="outline" onClick={() => selectedUser && handleToggleUserWithdrawalFreeze(selectedUser.id, !selectedUser.withdrawalFrozen)} className={`flex-1 text-xs md:text-sm ${selectedUser?.withdrawalFrozen ? 'border-green-500 text-green-500 hover:bg-green-500/20' : 'border-orange-500 text-orange-500 hover:bg-orange-500/20'}`}>
                <Ban className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                {selectedUser?.withdrawalFrozen ? 'Unfreeze W/D' : 'Freeze W/D'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Stats Dialog */}
      <Dialog open={isStatsDialogOpen} onOpenChange={setIsStatsDialogOpen}>
        <DialogContent className="bg-crypto-card border-crypto-border text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl font-display flex items-center gap-2">
              <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-crypto-yellow" />
              Edit Site Statistics
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3 md:space-y-4 py-4">
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="space-y-1 md:space-y-2">
                <Label className="text-white text-xs md:text-sm">Total Invested</Label>
                <Input type="number" value={siteStats.totalInvested} onChange={(e) => setSiteStats({ ...siteStats, totalInvested: parseFloat(e.target.value) || 0 })} className="bg-crypto-dark border-crypto-border text-white text-sm" />
              </div>
              <div className="space-y-1 md:space-y-2">
                <Label className="text-white text-xs md:text-sm">Suffix</Label>
                <Input type="text" value={siteStats.totalInvestedSuffix} onChange={(e) => setSiteStats({ ...siteStats, totalInvestedSuffix: e.target.value })} className="bg-crypto-dark border-crypto-border text-white text-sm" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="space-y-1 md:space-y-2">
                <Label className="text-white text-xs md:text-sm">Active Investors</Label>
                <Input type="number" value={siteStats.activeInvestors} onChange={(e) => setSiteStats({ ...siteStats, activeInvestors: parseFloat(e.target.value) || 0 })} className="bg-crypto-dark border-crypto-border text-white text-sm" />
              </div>
              <div className="space-y-1 md:space-y-2">
                <Label className="text-white text-xs md:text-sm">Suffix</Label>
                <Input type="text" value={siteStats.activeInvestorsSuffix} onChange={(e) => setSiteStats({ ...siteStats, activeInvestorsSuffix: e.target.value })} className="bg-crypto-dark border-crypto-border text-white text-sm" />
              </div>
            </div>

            <Button onClick={handleSaveStats} className="w-full bg-crypto-yellow text-crypto-dark hover:bg-crypto-yellow-light">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Plan Dialog */}
      <Dialog open={isPlanDialogOpen} onOpenChange={setIsPlanDialogOpen}>
        <DialogContent className="bg-crypto-card border-crypto-border text-white max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl font-display flex items-center gap-2">
              <Edit3 className="w-5 h-5 md:w-6 md:h-6 text-crypto-yellow" />
              Edit Investment Plans
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3 md:space-y-4 py-4">
            <div className="flex flex-wrap gap-2">
              {investmentPlans.map((plan) => (
                <Button key={plan.id} size="sm" variant={editingPlan?.id === plan.id ? 'default' : 'outline'} onClick={() => setEditingPlan(plan)} className={editingPlan?.id === plan.id ? 'bg-crypto-yellow text-crypto-dark text-xs' : 'border-crypto-border text-white text-xs'}>
                  {plan.name}
                </Button>
              ))}
            </div>

            {editingPlan && (
              <div className="space-y-3 md:space-y-4">
                <div className="space-y-1 md:space-y-2">
                  <Label className="text-white text-xs md:text-sm">Plan Name</Label>
                  <Input type="text" value={editingPlan.name} onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })} className="bg-crypto-dark border-crypto-border text-white text-sm" />
                </div>

                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div className="space-y-1 md:space-y-2">
                    <Label className="text-white text-xs md:text-sm">Min Amount ($)</Label>
                    <Input type="number" value={editingPlan.minAmount} onChange={(e) => setEditingPlan({ ...editingPlan, minAmount: parseFloat(e.target.value) || 0 })} className="bg-crypto-dark border-crypto-border text-white text-sm" />
                  </div>
                  <div className="space-y-1 md:space-y-2">
                    <Label className="text-white text-xs md:text-sm">Max Amount ($)</Label>
                    <Input type="number" value={editingPlan.maxAmount} onChange={(e) => setEditingPlan({ ...editingPlan, maxAmount: parseFloat(e.target.value) || 0 })} className="bg-crypto-dark border-crypto-border text-white text-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div className="space-y-1 md:space-y-2">
                    <Label className="text-white text-xs md:text-sm">Daily Return (%)</Label>
                    <Input type="number" step="0.1" value={editingPlan.dailyReturn} onChange={(e) => setEditingPlan({ ...editingPlan, dailyReturn: parseFloat(e.target.value) || 0 })} className="bg-crypto-dark border-crypto-border text-white text-sm" />
                  </div>
                  <div className="space-y-1 md:space-y-2">
                    <Label className="text-white text-xs md:text-sm">Duration (Days)</Label>
                    <Input type="number" value={editingPlan.duration} onChange={(e) => setEditingPlan({ ...editingPlan, duration: parseInt(e.target.value) || 0 })} className="bg-crypto-dark border-crypto-border text-white text-sm" />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" id="featured" checked={editingPlan.featured} onChange={(e) => setEditingPlan({ ...editingPlan, featured: e.target.checked })} className="w-4 h-4 rounded border-crypto-border bg-crypto-dark text-crypto-yellow" />
                  <Label htmlFor="featured" className="text-white text-xs md:text-sm cursor-pointer">Mark as Featured (Best Value)</Label>
                </div>

                <Button onClick={handleSavePlan} className="w-full bg-crypto-yellow text-crypto-dark hover:bg-crypto-yellow-light">
                  <Save className="w-4 h-4 mr-2" />
                  Save Plan Changes
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Blog Post Dialog */}
      <Dialog open={isBlogDialogOpen} onOpenChange={setIsBlogDialogOpen}>
        <DialogContent className="bg-crypto-card border-crypto-border text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl font-display flex items-center gap-2">
              <FileText className="w-5 h-5 md:w-6 md:h-6 text-crypto-yellow" />
              {editingPost ? 'Edit Blog Post' : 'Create Blog Post'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 md:space-y-6 py-4">
            <div className="space-y-1 md:space-y-2">
              <Label className="text-white text-xs md:text-sm">Title *</Label>
              <Input type="text" value={blogForm.title} onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })} placeholder="Enter post title" className="bg-crypto-dark border-crypto-border text-white text-sm" />
            </div>

            <div className="space-y-1 md:space-y-2">
              <Label className="text-white text-xs md:text-sm">Excerpt *</Label>
              <Textarea value={blogForm.excerpt} onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })} placeholder="Brief summary of the post" rows={2} className="bg-crypto-dark border-crypto-border text-white text-sm resize-none" />
            </div>

            <div className="space-y-1 md:space-y-2">
              <Label className="text-white text-xs md:text-sm">Content * (HTML supported)</Label>
              <Textarea value={blogForm.content} onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })} placeholder="<h2>Your heading</h2><p>Your content here...</p>" rows={8} className="bg-crypto-dark border-crypto-border text-white text-sm font-mono text-xs" />
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="space-y-1 md:space-y-2">
                <Label className="text-white text-xs md:text-sm">Category</Label>
                <Input type="text" value={blogForm.category} onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })} placeholder="e.g. Education" className="bg-crypto-dark border-crypto-border text-white text-sm" />
              </div>
              <div className="space-y-1 md:space-y-2">
                <Label className="text-white text-xs md:text-sm">Status</Label>
                <select value={blogForm.status} onChange={(e) => setBlogForm({ ...blogForm, status: e.target.value as 'published' | 'draft' | 'archived' })} className="w-full bg-crypto-dark border border-crypto-border text-white text-sm rounded-md px-3 py-2">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <Button onClick={handleSaveBlogPost} className="w-full bg-crypto-yellow text-crypto-dark hover:bg-crypto-yellow-light">
              <Save className="w-4 h-4 mr-2" />
              {editingPost ? 'Update Post' : 'Create Post'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Social Links Dialog */}
      <Dialog open={isSocialLinksDialogOpen} onOpenChange={setIsSocialLinksDialogOpen}>
        <DialogContent className="bg-crypto-card border-crypto-border text-white max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl font-display flex items-center gap-2">
              <LinkIcon className="w-5 h-5 md:w-6 md:h-6 text-crypto-yellow" />
              Edit Social Media Links
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 md:space-y-6 py-4">
            <div className="space-y-2">
              {socialLinks.map((link, index) => {
                const Icon = getSocialIcon(link.icon);
                return (
                  <div key={index} className="flex items-center gap-2 p-2 md:p-3 rounded-lg bg-crypto-dark border border-crypto-border">
                    <Icon className="w-4 h-4 md:w-5 md:h-5 text-crypto-yellow flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs md:text-sm font-medium truncate">{link.name}</p>
                      <p className="text-gray-400 text-[10px] md:text-xs truncate">{link.url}</p>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => setEditingLink({ index, name: link.name, url: link.url, icon: link.icon })} className="text-gray-400 hover:text-white flex-shrink-0">
                      <Edit3 className="w-3 h-3 md:w-4 md:h-4" />
                    </Button>
                  </div>
                );
              })}
            </div>

            {editingLink && (
              <div className="p-3 md:p-4 rounded-xl bg-crypto-dark border border-crypto-border space-y-3 md:space-y-4">
                <p className="text-white font-medium text-sm md:text-base">Edit Link</p>
                <div className="space-y-1 md:space-y-2">
                  <Label className="text-white text-xs md:text-sm">Platform Name</Label>
                  <Input type="text" value={editingLink.name} onChange={(e) => setEditingLink({ ...editingLink, name: e.target.value })} className="bg-crypto-card border-crypto-border text-white text-sm" />
                </div>
                <div className="space-y-1 md:space-y-2">
                  <Label className="text-white text-xs md:text-sm">URL</Label>
                  <Input type="url" value={editingLink.url} onChange={(e) => setEditingLink({ ...editingLink, url: e.target.value })} placeholder="https://..." className="bg-crypto-card border-crypto-border text-white text-sm" />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleUpdateSocialLink} className="flex-1 bg-crypto-yellow text-crypto-dark hover:bg-crypto-yellow-light text-xs md:text-sm">
                    <Save className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                    Update
                  </Button>
                  <Button variant="outline" onClick={() => setEditingLink(null)} className="border-crypto-border text-white hover:bg-crypto-card text-xs md:text-sm">Cancel</Button>
                </div>
              </div>
            )}

            <Button onClick={handleSaveSocialLinks} className="w-full bg-crypto-yellow text-crypto-dark hover:bg-crypto-yellow-light">
              <Save className="w-4 h-4 mr-2" />
              Save All Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Deposit Settings Dialog */}
      <Dialog open={isDepositSettingsDialogOpen} onOpenChange={setIsDepositSettingsDialogOpen}>
        <DialogContent className="bg-crypto-card border-crypto-border text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl font-display flex items-center gap-2">
              <CreditCard className="w-5 h-5 md:w-6 md:h-6 text-crypto-yellow" />
              Deposit Settings
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Bitcoin */}
            <div className="p-4 bg-crypto-dark rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm">₿</span>
                  <span className="text-white font-medium">Bitcoin (BTC)</span>
                </div>
                <Switch checked={depositSettings.bitcoin.enabled} onCheckedChange={(checked) => setDepositSettings({ ...depositSettings, bitcoin: { ...depositSettings.bitcoin, enabled: checked } })} />
              </div>
              {depositSettings.bitcoin.enabled && (
                <div className="space-y-3">
                  <div>
                    <Label className="text-gray-400 text-xs">Minimum Deposit ($)</Label>
                    <Input type="number" value={depositSettings.bitcoin.minAmount} onChange={(e) => setDepositSettings({ ...depositSettings, bitcoin: { ...depositSettings.bitcoin, minAmount: parseFloat(e.target.value) || 0 } })} className="bg-crypto-card border-crypto-border text-white text-sm" />
                  </div>
                  <div>
                    <Label className="text-gray-400 text-xs">Deposit Address</Label>
                    <div className="flex gap-2">
                      <Input type="text" value={depositAddresses.bitcoin} onChange={(e) => setDepositAddresses({ ...depositAddresses, bitcoin: e.target.value })} className="bg-crypto-card border-crypto-border text-white text-sm font-mono" />
                      <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(depositAddresses.bitcoin); toast.success('Copied'); }}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* USDT with Networks */}
            <div className="p-4 bg-crypto-dark rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-sm">₮</span>
                  <span className="text-white font-medium">USDT</span>
                </div>
                <Switch checked={depositSettings.usdt.enabled} onCheckedChange={(checked) => setDepositSettings({ ...depositSettings, usdt: { ...depositSettings.usdt, enabled: checked } })} />
              </div>
              {depositSettings.usdt.enabled && (
                <div className="space-y-3">
                  <div>
                    <Label className="text-gray-400 text-xs">Minimum Deposit ($)</Label>
                    <Input type="number" value={depositSettings.usdt.minAmount} onChange={(e) => setDepositSettings({ ...depositSettings, usdt: { ...depositSettings.usdt, minAmount: parseFloat(e.target.value) || 0 } })} className="bg-crypto-card border-crypto-border text-white text-sm" />
                  </div>
                  <div>
                    <Label className="text-gray-400 text-xs mb-2 block">Networks</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-crypto-card rounded">
                        <span className="text-white text-sm uppercase">TRC20</span>
                        <Input type="text" value={depositAddresses.usdt.trc20} onChange={(e) => setDepositAddresses({ ...depositAddresses, usdt: { ...depositAddresses.usdt, trc20: e.target.value } })} placeholder="TRC20 Address" className="w-64 bg-crypto-dark border-crypto-border text-white text-xs font-mono" />
                      </div>
                      <div className="flex items-center justify-between p-2 bg-crypto-card rounded">
                        <span className="text-white text-sm uppercase">ERC20</span>
                        <Input type="text" value={depositAddresses.usdt.erc20} onChange={(e) => setDepositAddresses({ ...depositAddresses, usdt: { ...depositAddresses.usdt, erc20: e.target.value } })} placeholder="ERC20 Address" className="w-64 bg-crypto-dark border-crypto-border text-white text-xs font-mono" />
                      </div>
                      <div className="flex items-center justify-between p-2 bg-crypto-card rounded">
                        <span className="text-white text-sm uppercase">BEP20</span>
                        <Input type="text" value={depositAddresses.usdt.bep20} onChange={(e) => setDepositAddresses({ ...depositAddresses, usdt: { ...depositAddresses.usdt, bep20: e.target.value } })} placeholder="BEP20 Address" className="w-64 bg-crypto-dark border-crypto-border text-white text-xs font-mono" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* USDC with Networks */}
            <div className="p-4 bg-crypto-dark rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">$</span>
                  <span className="text-white font-medium">USDC</span>
                </div>
                <Switch checked={depositSettings.usdc.enabled} onCheckedChange={(checked) => setDepositSettings({ ...depositSettings, usdc: { ...depositSettings.usdc, enabled: checked } })} />
              </div>
              {depositSettings.usdc.enabled && (
                <div className="space-y-3">
                  <div>
                    <Label className="text-gray-400 text-xs">Minimum Deposit ($)</Label>
                    <Input type="number" value={depositSettings.usdc.minAmount} onChange={(e) => setDepositSettings({ ...depositSettings, usdc: { ...depositSettings.usdc, minAmount: parseFloat(e.target.value) || 0 } })} className="bg-crypto-card border-crypto-border text-white text-sm" />
                  </div>
                  <div>
                    <Label className="text-gray-400 text-xs mb-2 block">Networks</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-crypto-card rounded">
                        <span className="text-white text-sm uppercase">ERC20</span>
                        <Input type="text" value={depositAddresses.usdc.erc20} onChange={(e) => setDepositAddresses({ ...depositAddresses, usdc: { ...depositAddresses.usdc, erc20: e.target.value } })} placeholder="ERC20 Address" className="w-64 bg-crypto-dark border-crypto-border text-white text-xs font-mono" />
                      </div>
                      <div className="flex items-center justify-between p-2 bg-crypto-card rounded">
                        <span className="text-white text-sm uppercase">BEP20</span>
                        <Input type="text" value={depositAddresses.usdc.bep20} onChange={(e) => setDepositAddresses({ ...depositAddresses, usdc: { ...depositAddresses.usdc, bep20: e.target.value } })} placeholder="BEP20 Address" className="w-64 bg-crypto-dark border-crypto-border text-white text-xs font-mono" />
                      </div>
                      <div className="flex items-center justify-between p-2 bg-crypto-card rounded">
                        <span className="text-white text-sm uppercase">SOLANA</span>
                        <Input type="text" value={depositAddresses.usdc.solana} onChange={(e) => setDepositAddresses({ ...depositAddresses, usdc: { ...depositAddresses.usdc, solana: e.target.value } })} placeholder="Solana Address" className="w-64 bg-crypto-dark border-crypto-border text-white text-xs font-mono" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bank Transfer */}
            <div className="p-4 bg-crypto-dark rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-sm">🏦</span>
                  <span className="text-white font-medium">Bank Transfer</span>
                </div>
                <Switch checked={depositSettings.bank.enabled} onCheckedChange={(checked) => setDepositSettings({ ...depositSettings, bank: { ...depositSettings.bank, enabled: checked } })} />
              </div>
              {depositSettings.bank.enabled && (
                <div className="space-y-3">
                  <div>
                    <Label className="text-gray-400 text-xs">Minimum Deposit ($)</Label>
                    <Input type="number" value={depositSettings.bank.minAmount} onChange={(e) => setDepositSettings({ ...depositSettings, bank: { ...depositSettings.bank, minAmount: parseFloat(e.target.value) || 0 } })} className="bg-crypto-card border-crypto-border text-white text-sm" />
                  </div>
                  <div>
                    <Label className="text-gray-400 text-xs">Bank Name</Label>
                    <Input type="text" value={depositSettings.bank.bankName} onChange={(e) => setDepositSettings({ ...depositSettings, bank: { ...depositSettings.bank, bankName: e.target.value } })} className="bg-crypto-card border-crypto-border text-white text-sm" />
                  </div>
                  <div>
                    <Label className="text-gray-400 text-xs">Account Name</Label>
                    <Input type="text" value={depositSettings.bank.accountName} onChange={(e) => setDepositSettings({ ...depositSettings, bank: { ...depositSettings.bank, accountName: e.target.value } })} className="bg-crypto-card border-crypto-border text-white text-sm" />
                  </div>
                  <div>
                    <Label className="text-gray-400 text-xs">Account Number</Label>
                    <Input type="text" value={depositSettings.bank.accountNumber} onChange={(e) => setDepositSettings({ ...depositSettings, bank: { ...depositSettings.bank, accountNumber: e.target.value } })} className="bg-crypto-card border-crypto-border text-white text-sm" />
                  </div>
                  <div>
                    <Label className="text-gray-400 text-xs">Routing Number</Label>
                    <Input type="text" value={depositSettings.bank.routingNumber} onChange={(e) => setDepositSettings({ ...depositSettings, bank: { ...depositSettings.bank, routingNumber: e.target.value } })} className="bg-crypto-card border-crypto-border text-white text-sm" />
                  </div>
                </div>
              )}
            </div>

            <Button onClick={handleSaveDepositSettings} className="w-full bg-crypto-yellow text-crypto-dark hover:bg-crypto-yellow-light">
              <Save className="w-4 h-4 mr-2" />
              Save Deposit Settings
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Withdrawal Settings Dialog */}
      <Dialog open={isWithdrawalSettingsDialogOpen} onOpenChange={setIsWithdrawalSettingsDialogOpen}>
        <DialogContent className="bg-crypto-card border-crypto-border text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl font-display flex items-center gap-2">
              <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-crypto-yellow" />
              Withdrawal Settings
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white text-sm">Minimum Withdrawal ($)</Label>
                <Input type="number" value={withdrawalSettings.minAmount} onChange={(e) => setWithdrawalSettings({ ...withdrawalSettings, minAmount: parseFloat(e.target.value) || 0 })} className="bg-crypto-dark border-crypto-border text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-white text-sm">Maximum Withdrawal ($)</Label>
                <Input type="number" value={withdrawalSettings.maxAmount} onChange={(e) => setWithdrawalSettings({ ...withdrawalSettings, maxAmount: parseFloat(e.target.value) || 0 })} className="bg-crypto-dark border-crypto-border text-white" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white text-sm">Processing Time</Label>
              <Input type="text" value={withdrawalSettings.processingTime} onChange={(e) => setWithdrawalSettings({ ...withdrawalSettings, processingTime: e.target.value })} className="bg-crypto-dark border-crypto-border text-white" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white text-sm">Fee Amount</Label>
                <Input type="number" value={withdrawalSettings.fee} onChange={(e) => setWithdrawalSettings({ ...withdrawalSettings, fee: parseFloat(e.target.value) || 0 })} className="bg-crypto-dark border-crypto-border text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-white text-sm">Fee Type</Label>
                <select value={withdrawalSettings.feeType} onChange={(e) => setWithdrawalSettings({ ...withdrawalSettings, feeType: e.target.value as 'fixed' | 'percentage' })} className="w-full bg-crypto-dark border border-crypto-border text-white rounded-md px-3 py-2">
                  <option value="fixed">Fixed ($)</option>
                  <option value="percentage">Percentage (%)</option>
                </select>
              </div>
            </div>

            <Button onClick={handleSaveWithdrawalSettings} className="w-full bg-crypto-yellow text-crypto-dark hover:bg-crypto-yellow-light">
              <Save className="w-4 h-4 mr-2" />
              Save Withdrawal Settings
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Email Campaign Dialog */}
      <Dialog open={isEmailCampaignDialogOpen} onOpenChange={setIsEmailCampaignDialogOpen}>
        <DialogContent className="bg-crypto-card border-crypto-border text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl font-display flex items-center gap-2">
              <Mail className="w-5 h-5 md:w-6 md:h-6 text-crypto-yellow" />
              Email Campaign
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-white text-sm">Recipients</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="recipients" checked={emailCampaign.recipients === 'all'} onChange={() => setEmailCampaign({ ...emailCampaign, recipients: 'all' })} className="text-crypto-yellow" />
                  <span className="text-white">All Users</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="recipients" checked={emailCampaign.recipients === 'specific'} onChange={() => setEmailCampaign({ ...emailCampaign, recipients: 'specific' })} className="text-crypto-yellow" />
                  <span className="text-white">Specific Users</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white text-sm">Subject</Label>
              <Input type="text" value={emailCampaign.subject} onChange={(e) => setEmailCampaign({ ...emailCampaign, subject: e.target.value })} placeholder="Email subject" className="bg-crypto-dark border-crypto-border text-white" />
            </div>

            <div className="space-y-2">
              <Label className="text-white text-sm">Message</Label>
              <Textarea value={emailCampaign.body} onChange={(e) => setEmailCampaign({ ...emailCampaign, body: e.target.value })} placeholder="Write your message here..." rows={8} className="bg-crypto-dark border-crypto-border text-white resize-none" />
            </div>

            <Button onClick={handleSendEmailCampaign} className="w-full bg-crypto-yellow text-crypto-dark hover:bg-crypto-yellow-light">
              <Send className="w-4 h-4 mr-2" />
              Send Campaign
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Ticket Reply Dialog */}
      <Dialog open={isTicketDialogOpen} onOpenChange={setIsTicketDialogOpen}>
        <DialogContent className="bg-crypto-card border-crypto-border text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-display">Ticket: {selectedTicket?.subject}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="p-4 bg-crypto-dark rounded-lg">
              <p className="text-gray-400 text-sm mb-1">From: {selectedTicket?.userName}</p>
              <p className="text-white">{selectedTicket?.message}</p>
            </div>

            <div className="space-y-2">
              <Label className="text-white text-sm">Your Reply</Label>
              <Textarea value={ticketReply} onChange={(e) => setTicketReply(e.target.value)} placeholder="Type your reply..." rows={4} className="bg-crypto-dark border-crypto-border text-white resize-none" />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleTicketReply} className="flex-1 bg-crypto-yellow text-crypto-dark hover:bg-crypto-yellow-light">
                <Send className="w-4 h-4 mr-2" />
                Send Reply
              </Button>
              <Button variant="outline" onClick={handleCloseTicket} className="border-crypto-border text-white hover:bg-crypto-dark">
                Close Ticket
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Live Chat Dialog */}
      <Dialog open={isChatDialogOpen} onOpenChange={setIsChatDialogOpen}>
        <DialogContent className="bg-crypto-card border-crypto-border text-white max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl font-display flex items-center gap-2">
              <Headphones className="w-5 h-5 text-crypto-yellow" />
              Chat with {selectedChat?.userName}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto py-4 space-y-4 max-h-[400px]">
            {selectedChat?.messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.userRole === 'support' || msg.userRole === 'admin' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${msg.userRole === 'bot' ? 'bg-purple-500/20' : msg.userRole === 'user' ? 'bg-crypto-yellow/20' : 'bg-blue-500/20'}`}>
                  <span className={`text-xs font-bold ${msg.userRole === 'bot' ? 'text-purple-400' : msg.userRole === 'user' ? 'text-crypto-yellow' : 'text-blue-400'}`}>
                    {msg.userName.charAt(0)}
                  </span>
                </div>
                <div className={`max-w-[70%] p-3 rounded-lg ${msg.userRole === 'support' || msg.userRole === 'admin' ? 'bg-blue-500/20 text-white' : 'bg-crypto-dark text-white'}`}>
                  <p className="text-xs text-gray-400 mb-1">{msg.userName}</p>
                  <p className="text-sm">{msg.message}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-crypto-border">
            <div className="flex gap-2">
              <Input value={chatReply} onChange={(e) => setChatReply(e.target.value)} placeholder="Type your message..." className="flex-1 bg-crypto-dark border-crypto-border text-white" onKeyPress={(e) => e.key === 'Enter' && handleChatReply()} />
              <Button onClick={handleChatReply} className="bg-crypto-yellow text-crypto-dark hover:bg-crypto-yellow-light">
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <Button variant="outline" onClick={handleCloseChat} className="w-full mt-2 border-crypto-border text-white hover:bg-crypto-dark">
              Close Chat
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '@/store';
import Header from '@/sections/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Wallet, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock,
  DollarSign,
  PiggyBank,
  Activity,
  LayoutDashboard,
  User,
  Settings,
  History,
  Shield,
  Bell
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Sample chart data
const chartData = [
  { name: 'Mon', value: 4000 },
  { name: 'Tue', value: 4500 },
  { name: 'Wed', value: 4200 },
  { name: 'Thu', value: 4800 },
  { name: 'Fri', value: 5100 },
  { name: 'Sat', value: 5400 },
  { name: 'Sun', value: 5800 },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const { state } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = [
    {
      title: 'Total Balance',
      value: `$${state.user?.balance.toLocaleString() || '0'}`,
      icon: Wallet,
      change: '+12.5%',
      positive: true,
    },
    {
      title: 'Total Invested',
      value: `$${state.user?.totalInvested.toLocaleString() || '0'}`,
      icon: PiggyBank,
      change: '+8.2%',
      positive: true,
    },
    {
      title: 'Total Returns',
      value: `$${state.user?.totalReturns.toLocaleString() || '0'}`,
      icon: TrendingUp,
      change: '+15.3%',
      positive: true,
    },
    {
      title: 'Active Investments',
      value: '3',
      icon: Activity,
      change: '2 ending soon',
      positive: true,
    },
  ];

  const recentTransactions = [
    { id: 1, type: 'deposit', amount: 1000, status: 'completed', date: '2024-01-15' },
    { id: 2, type: 'investment', amount: 500, status: 'completed', date: '2024-01-14' },
    { id: 3, type: 'return', amount: 75, status: 'completed', date: '2024-01-13' },
    { id: 4, type: 'withdrawal', amount: 200, status: 'pending', date: '2024-01-12' },
  ];

  const activeInvestments = [
    { id: 1, plan: 'Gold Plan', amount: 5000, dailyReturn: 12, daysLeft: 15 },
    { id: 2, plan: 'Standard Plan', amount: 2000, dailyReturn: 8, daysLeft: 8 },
    { id: 3, plan: 'Basic Plan', amount: 500, dailyReturn: 5, daysLeft: 5 },
  ];

  const sidebarLinks = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Investment', href: '/investment-plans', icon: TrendingUp },
    { label: 'Deposit', href: '/deposit', icon: ArrowDownRight },
    { label: 'Withdraw', href: '/withdraw', icon: ArrowUpRight },
    { label: 'History', href: '/history', icon: History },
    { label: 'Profile', href: '/profile', icon: User },
    { label: 'Account', href: '/profile?tab=account', icon: Shield },
    { label: 'Settings', href: '/profile?tab=preferences', icon: Settings },
    { label: 'Notifications', href: '/profile?tab=notifications', icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-crypto-dark">
      <Header />
      
      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold text-white">
                Dashboard
              </h1>
              <p className="text-gray-400 mt-1">
                Welcome back, {state.user?.name}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => navigate('/deposit')}
                className="bg-crypto-yellow text-crypto-dark hover:bg-crypto-yellow-light"
              >
                <ArrowDownRight className="w-4 h-4 mr-2" />
                Deposit
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/withdraw')}
                className="border-crypto-border text-white hover:bg-crypto-card"
              >
                <ArrowUpRight className="w-4 h-4 mr-2" />
                Withdraw
              </Button>
            </div>
          </div>

          {/* Main Layout with Sidebar */}
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="hidden lg:block lg:col-span-1">
              <Card className="bg-crypto-card border-crypto-border sticky top-24">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Navigation</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <nav className="flex flex-col">
                    {sidebarLinks.map((link) => (
                      <Link
                        key={link.href}
                        to={link.href}
                        className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-crypto-dark ${
                          location.pathname === link.href.split('?')[0]
                            ? 'text-crypto-yellow bg-crypto-yellow/10 border-r-2 border-crypto-yellow'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <link.icon className="w-4 h-4" />
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Stats Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card 
                key={stat.title} 
                className="bg-crypto-card border-crypto-border animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      <p className={`text-sm mt-2 ${stat.positive ? 'text-green-500' : 'text-red-500'}`}>
                        {stat.change}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-crypto-yellow/10 flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-crypto-yellow" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Chart */}
            <Card className="lg:col-span-2 bg-crypto-card border-crypto-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-crypto-yellow" />
                  Portfolio Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                {mounted && (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2a2d35" />
                      <XAxis dataKey="name" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1a1d24', 
                          border: '1px solid #2a2d35',
                          borderRadius: '8px'
                        }}
                        labelStyle={{ color: '#fff' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#f0b90b" 
                        strokeWidth={2}
                        dot={{ fill: '#f0b90b', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Active Investments */}
            <Card className="bg-crypto-card border-crypto-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <PiggyBank className="w-5 h-5 text-crypto-yellow" />
                  Active Investments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeInvestments.map((investment) => (
                  <div 
                    key={investment.id} 
                    className="p-4 rounded-xl bg-crypto-dark border border-crypto-border"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white">{investment.plan}</span>
                      <span className="text-crypto-yellow">{investment.dailyReturn}%/day</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">${investment.amount.toLocaleString()}</span>
                      <span className="text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {investment.daysLeft} days left
                      </span>
                    </div>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  className="w-full border-crypto-border text-white hover:bg-crypto-dark"
                  onClick={() => navigate('/investment-plans')}
                >
                  View All Plans
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          <Card className="mt-8 bg-crypto-card border-crypto-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-crypto-yellow" />
                Recent Transactions
              </CardTitle>
              <Button 
                variant="ghost" 
                className="text-crypto-yellow hover:text-crypto-yellow-light"
                onClick={() => navigate('/history')}
              >
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-crypto-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Type</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Amount</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTransactions.map((tx) => (
                      <tr key={tx.id} className="border-b border-crypto-border/50">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              tx.type === 'deposit' || tx.type === 'return' 
                                ? 'bg-green-500/20' 
                                : 'bg-red-500/20'
                            }`}>
                              {tx.type === 'deposit' || tx.type === 'return' ? (
                                <ArrowDownRight className={`w-4 h-4 ${
                                  tx.type === 'deposit' || tx.type === 'return' 
                                    ? 'text-green-500' 
                                    : 'text-red-500'
                                }`} />
                              ) : (
                                <ArrowUpRight className="w-4 h-4 text-red-500" />
                              )}
                            </div>
                            <span className="text-white capitalize">{tx.type}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`font-medium ${
                            tx.type === 'deposit' || tx.type === 'return' 
                              ? 'text-green-500' 
                              : 'text-red-500'
                          }`}>
                            {tx.type === 'deposit' || tx.type === 'return' ? '+' : '-'}${tx.amount}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            tx.status === 'completed' 
                              ? 'bg-green-500/20 text-green-500' 
                              : 'bg-yellow-500/20 text-yellow-500'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-400">{tx.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

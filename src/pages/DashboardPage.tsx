import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Plus,
  History
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Get chart data from transactions or returns
const getChartData = (transactions: any[]) => {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toLocaleDateString('en-US', { weekday: 'short' });
  });

  // Simple logic: cumulative returns over last 7 days
  let cumulative = 0;
  return last7Days.map(day => {
    // In a real app, you'd filter transactions by date
    // For now, we'll show a simulated growth if they have investments
    cumulative += Math.random() * 50; 
    return { name: day, value: cumulative };
  });
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { state } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use real data from store
  const user = state.user;
  const investments = state.investments || [];
  const transactions = state.transactions || [];

  const stats = [
    {
      title: 'Total Balance',
      value: `$${user?.balance?.toLocaleString() || '0'}`,
      icon: Wallet,
      change: 'Available for withdrawal',
      positive: true,
    },
    {
      title: 'Total Invested',
      value: `$${user?.totalInvested?.toLocaleString() || '0'}`,
      icon: PiggyBank,
      change: 'Active investments',
      positive: true,
    },
    {
      title: 'Total Returns',
      value: `$${user?.totalReturns?.toLocaleString() || '0'}`,
      icon: TrendingUp,
      change: 'Earnings so far',
      positive: true,
    },
    {
      title: 'Active Investments',
      value: investments.filter(i => i.status === 'active').length.toString(),
      icon: Activity,
      change: 'Running plans',
      positive: true,
    },
  ];

  // Get recent transactions (last 5)
  const recentTransactions = transactions.slice(0, 5);
  const chartData = getChartData(transactions);

  // Get active investments
  const activeInvestments = investments.filter(i => i.status === 'active').slice(0, 3);

  return (
    <div className="min-h-screen bg-crypto-dark pb-24 lg:pb-12">
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
                Welcome back, {user?.name}
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
                      <p className={`text-sm mt-2 text-gray-500`}>
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
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <PiggyBank className="w-5 h-5 text-crypto-yellow" />
                  Active Investments
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-crypto-yellow hover:text-crypto-yellow-light"
                  onClick={() => navigate('/investment-plans')}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeInvestments.length > 0 ? (
                  activeInvestments.map((investment) => (
                    <div 
                      key={investment.id} 
                      className="p-4 rounded-xl bg-crypto-dark border border-crypto-border"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-white">{investment.planName}</span>
                        <span className="text-crypto-yellow">{investment.dailyReturn}%/day</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">${investment.amount.toLocaleString()}</span>
                        <span className="text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {Math.ceil((new Date(investment.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400 mb-4">No active investments yet</p>
                    <Button 
                      onClick={() => navigate('/investment-plans')}
                      className="bg-crypto-yellow text-crypto-dark hover:bg-crypto-yellow-light"
                    >
                      Start Investing
                    </Button>
                  </div>
                )}
                {activeInvestments.length > 0 && (
                  <Button 
                    variant="outline" 
                    className="w-full border-crypto-border text-white hover:bg-crypto-dark"
                    onClick={() => navigate('/investment-plans')}
                  >
                    View All Plans
                  </Button>
                )}
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
                <History className="w-4 h-4 mr-2" />
                View All
              </Button>
            </CardHeader>
            <CardContent>
              {recentTransactions.length > 0 ? (
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
                                  <ArrowDownRight className="w-4 h-4 text-green-500" />
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
                              tx.status === 'approved' 
                                ? 'bg-green-500/20 text-green-500' 
                                : tx.status === 'pending'
                                ? 'bg-yellow-500/20 text-yellow-500'
                                : 'bg-red-500/20 text-red-500'
                            }`}>
                              {tx.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-gray-400">
                            {new Date(tx.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-4">No transactions yet</p>
                  <Button 
                    onClick={() => navigate('/deposit')}
                    className="bg-crypto-yellow text-crypto-dark hover:bg-crypto-yellow-light"
                  >
                    Make First Deposit
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

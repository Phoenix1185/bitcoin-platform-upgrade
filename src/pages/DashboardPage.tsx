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
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { calculateCurrentEarnings } from '@/lib/investmentCalculator';

/**
 * Build a 30-day portfolio performance chart from real transaction data.
 * Each point = cumulative balance change (deposits - withdrawals + returns + bonuses)
 * up to that day.
 */
function buildPortfolioChart(transactions: any[]) {
  const today = new Date();
  const days = 30;

  // Create a map of date -> net change
  const dailyMap: Record<string, number> = {};
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    dailyMap[key] = 0;
  }

  for (const tx of transactions) {
    if (!tx.createdAt) continue;
    const key = tx.createdAt.split('T')[0];
    if (!(key in dailyMap)) continue;

    const amt = tx.amount || 0;
    if (tx.type === 'deposit' && tx.status === 'approved') dailyMap[key] += amt;
    else if (tx.type === 'withdrawal' && tx.status === 'approved') dailyMap[key] -= amt;
    else if (tx.type === 'return' || tx.type === 'bonus') dailyMap[key] += amt;
    else if (tx.type === 'investment') dailyMap[key] -= amt;
  }

  // Build cumulative chart data
  let cumulative = 0;
  return Object.entries(dailyMap).map(([dateStr, delta]) => {
    cumulative += delta;
    const d = new Date(dateStr);
    const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return { name: label, value: parseFloat(cumulative.toFixed(2)) };
  });
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { state } = useStore();
  const [mounted, setMounted] = useState(false);
  const [chartRange, setChartRange] = useState<7 | 30>(30);

  useEffect(() => {
    setMounted(true);
  }, []);

  const user = state.user;
  const investments = state.investments || [];
  const transactions = state.transactions || [];

  // Live portfolio chart data
  const allChartData = buildPortfolioChart(transactions);
  const chartData = chartRange === 7 ? allChartData.slice(-7) : allChartData;

  // Stats
  const activeInvestments = investments.filter(i => i.status === 'active');
  
  // Calculate live earnings from active investments (accrued since start)
  const liveEarnings = activeInvestments.reduce((sum, inv) => {
    return sum + calculateCurrentEarnings(inv);
  }, 0);

  const stats = [
    {
      title: 'Total Balance',
      value: `$${(user?.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: Wallet,
      change: 'Available for withdrawal',
      positive: true,
    },
    {
      title: 'Total Invested',
      value: `$${(user?.totalInvested || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: PiggyBank,
      change: `${activeInvestments.length} active plan${activeInvestments.length !== 1 ? 's' : ''}`,
      positive: true,
    },
    {
      title: 'Total Returns',
      value: `$${(user?.totalReturns || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: TrendingUp,
      change: `+$${liveEarnings.toFixed(2)} accrued`,
      positive: true,
    },
    {
      title: 'Active Investments',
      value: activeInvestments.length.toString(),
      icon: Activity,
      change: investments.filter(i => i.status === 'completed').length + ' completed',
      positive: true,
    },
  ];

  const recentTransactions = transactions.slice(0, 5);
  const activeInvestmentSlice = activeInvestments.slice(0, 3);

  const txTypeColor = (type: string) => {
    switch (type) {
      case 'deposit': return 'bg-green-500/20 text-green-400';
      case 'withdrawal': return 'bg-red-500/20 text-red-400';
      case 'return': return 'bg-blue-500/20 text-blue-400';
      case 'investment': return 'bg-yellow-500/20 text-yellow-400';
      case 'bonus': return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const txAmountColor = (type: string) => {
    return ['deposit', 'return', 'bonus'].includes(type) ? 'text-green-400' : 'text-red-400';
  };

  const txAmountPrefix = (type: string) => {
    return ['deposit', 'return', 'bonus'].includes(type) ? '+' : '-';
  };

  return (
    <div className="min-h-screen bg-crypto-dark pb-24 lg:pb-12">
      <Header />
      
      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold text-white">Dashboard</h1>
              <p className="text-gray-400 mt-1">Welcome back, {user?.name}</p>
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
                      <p className="text-sm mt-2 text-gray-500">{stat.change}</p>
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
            {/* Portfolio Performance Chart */}
            <Card className="lg:col-span-2 bg-crypto-card border-crypto-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-crypto-yellow" />
                    Portfolio Performance
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={chartRange === 7 ? 'default' : 'outline'}
                      className={chartRange === 7 
                        ? 'bg-crypto-yellow text-crypto-dark h-7 px-3 text-xs' 
                        : 'border-crypto-border text-gray-400 h-7 px-3 text-xs hover:bg-crypto-dark'}
                      onClick={() => setChartRange(7)}
                    >
                      7D
                    </Button>
                    <Button
                      size="sm"
                      variant={chartRange === 30 ? 'default' : 'outline'}
                      className={chartRange === 30 
                        ? 'bg-crypto-yellow text-crypto-dark h-7 px-3 text-xs' 
                        : 'border-crypto-border text-gray-400 h-7 px-3 text-xs hover:bg-crypto-dark'}
                      onClick={() => setChartRange(30)}
                    >
                      30D
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {mounted && (
                  transactions.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f0b90b" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#f0b90b" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2a2d35" />
                        <XAxis 
                          dataKey="name" 
                          stroke="#6b7280" 
                          tick={{ fontSize: 11 }}
                          interval={chartRange === 30 ? 4 : 0}
                        />
                        <YAxis 
                          stroke="#6b7280" 
                          tick={{ fontSize: 11 }}
                          tickFormatter={(v) => `$${v}`}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1a1d24', 
                            border: '1px solid #2a2d35',
                            borderRadius: '8px'
                          }}
                          labelStyle={{ color: '#fff' }}
                          formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Portfolio Value']}
                        />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#f0b90b"
                          strokeWidth={2}
                          fill="url(#portfolioGradient)"
                          dot={false}
                          activeDot={{ fill: '#f0b90b', strokeWidth: 2, r: 4 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[300px] flex flex-col items-center justify-center text-gray-500">
                      <TrendingUp className="w-12 h-12 mb-3 opacity-30" />
                      <p className="text-sm">No transaction data yet.</p>
                      <p className="text-xs mt-1">Make a deposit to start tracking your portfolio.</p>
                    </div>
                  )
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
                {activeInvestmentSlice.length > 0 ? (
                  activeInvestmentSlice.map((investment) => {
                    const earned = calculateCurrentEarnings(investment);
                    const daysLeft = Math.max(0, Math.ceil(
                      (new Date(investment.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                    ));
                    const totalExpected = investment.amount * (investment.dailyReturn / 100) * investment.duration;
                    const progress = Math.min(100, (earned / totalExpected) * 100);

                    return (
                      <div 
                        key={investment.id} 
                        className="p-4 rounded-xl bg-crypto-dark border border-crypto-border"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-white text-sm">{investment.planName}</span>
                          <span className="text-crypto-yellow text-sm">{investment.dailyReturn}%/day</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                          <span>${investment.amount.toLocaleString()}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {daysLeft}d left
                          </span>
                        </div>
                        {/* Progress bar */}
                        <div className="w-full bg-crypto-border rounded-full h-1.5 mb-1">
                          <div 
                            className="bg-crypto-yellow h-1.5 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Earned: <span className="text-green-400">${earned.toFixed(2)}</span></span>
                          <span>{progress.toFixed(0)}%</span>
                        </div>
                      </div>
                    );
                  })
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
                {activeInvestmentSlice.length > 0 && (
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
                        <tr key={tx.id} className="border-b border-crypto-border/50 hover:bg-crypto-dark/50 transition-colors">
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${txTypeColor(tx.type)}`}>
                              {tx.type}
                            </span>
                          </td>
                          <td className={`py-4 px-4 font-medium ${txAmountColor(tx.type)}`}>
                            {txAmountPrefix(tx.type)}${(tx.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                              tx.status === 'approved' 
                                ? 'bg-green-500/20 text-green-400'
                                : tx.status === 'pending'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-red-500/20 text-red-400'
                            }`}>
                              {tx.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-gray-400 text-sm">
                            {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString('en-US', {
                              month: 'short', day: 'numeric', year: 'numeric'
                            }) : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <DollarSign className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No transactions yet</p>
                  <p className="text-gray-500 text-sm mt-1">Make a deposit to get started</p>
                  <Button 
                    onClick={() => navigate('/deposit')}
                    className="mt-4 bg-crypto-yellow text-crypto-dark hover:bg-crypto-yellow-light"
                  >
                    Make a Deposit
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

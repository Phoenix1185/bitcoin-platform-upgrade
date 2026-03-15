import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store';
import Header from '@/sections/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, ArrowDownRight, ArrowUpRight, PiggyBank, Gift, AlertCircle } from 'lucide-react';

export default function HistoryPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');

  const { state } = useStore();
  const user = state.user;
  const allTransactions = (state.transactions || []).map(tx => ({
    id: tx.id,
    type: tx.type,
    amount: tx.amount,
    status: tx.status,
    date: new Date(tx.createdAt).toLocaleString(),
    method: tx.method,
    notes: tx.notes,
  }));

  const filteredTransactions = activeTab === 'all' 
    ? allTransactions 
    : allTransactions.filter(tx => tx.type === activeTab);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownRight className="w-5 h-5 text-green-500" />;
      case 'withdrawal':
        return <ArrowUpRight className="w-5 h-5 text-red-500" />;
      case 'investment':
        return <PiggyBank className="w-5 h-5 text-crypto-yellow" />;
      case 'return':
        return <Gift className="w-5 h-5 text-green-500" />;
      case 'bonus':
        return <Gift className="w-5 h-5 text-crypto-yellow" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'deposit':
      case 'return':
      case 'bonus':
        return 'text-green-500';
      case 'withdrawal':
      case 'investment':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      approved: 'bg-green-500/20 text-green-500',
      pending: 'bg-yellow-500/20 text-yellow-500',
      rejected: 'bg-red-500/20 text-red-500',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-crypto-dark">
      <Header />
      
      <main className="pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="text-white hover:bg-crypto-card"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-display font-bold text-white">
                Transaction History
              </h1>
              <p className="text-gray-400 mt-1">
                View all your transactions and activities
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid sm:grid-cols-4 gap-4 mb-8">
            <Card className="bg-crypto-card border-crypto-border">
              <CardContent className="p-4">
                <p className="text-sm text-gray-400">Total Deposits</p>
                <p className="text-xl font-bold text-green-500">
                  +${(state.transactions || [])
                    .filter(t => t.type === 'deposit' && t.status === 'approved')
                    .reduce((sum, t) => sum + t.amount, 0)
                    .toLocaleString()}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-crypto-card border-crypto-border">
              <CardContent className="p-4">
                <p className="text-sm text-gray-400">Total Withdrawals</p>
                <p className="text-xl font-bold text-red-500">
                  -${(state.transactions || [])
                    .filter(t => t.type === 'withdrawal' && t.status === 'approved')
                    .reduce((sum, t) => sum + t.amount, 0)
                    .toLocaleString()}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-crypto-card border-crypto-border">
              <CardContent className="p-4">
                <p className="text-sm text-gray-400">Total Invested</p>
                <p className="text-xl font-bold text-crypto-yellow">
                  ${user?.totalInvested?.toLocaleString() || '0'}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-crypto-card border-crypto-border">
              <CardContent className="p-4">
                <p className="text-sm text-gray-400">Total Returns</p>
                <p className="text-xl font-bold text-green-500">
                  +${user?.totalReturns?.toLocaleString() || '0'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Transactions */}
          <Card className="bg-crypto-card border-crypto-border">
            <CardHeader>
              <Tabs defaultValue="all" onValueChange={setActiveTab}>
                <TabsList className="bg-crypto-dark">
                  <TabsTrigger 
                    value="all" 
                    className="data-[state=active]:bg-crypto-yellow data-[state=active]:text-crypto-dark"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger 
                    value="deposit"
                    className="data-[state=active]:bg-crypto-yellow data-[state=active]:text-crypto-dark"
                  >
                    Deposits
                  </TabsTrigger>
                  <TabsTrigger 
                    value="withdrawal"
                    className="data-[state=active]:bg-crypto-yellow data-[state=active]:text-crypto-dark"
                  >
                    Withdrawals
                  </TabsTrigger>
                  <TabsTrigger 
                    value="investment"
                    className="data-[state=active]:bg-crypto-yellow data-[state=active]:text-crypto-dark"
                  >
                    Investments
                  </TabsTrigger>
                  <TabsTrigger 
                    value="return"
                    className="data-[state=active]:bg-crypto-yellow data-[state=active]:text-crypto-dark"
                  >
                    Returns
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-crypto-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Type</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Details</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Amount</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((tx) => (
                      <tr key={tx.id} className="border-b border-crypto-border/50 hover:bg-crypto-dark/50">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              tx.type === 'deposit' || tx.type === 'return' || tx.type === 'bonus'
                                ? 'bg-green-500/20' 
                                : tx.type === 'investment'
                                ? 'bg-crypto-yellow/20'
                                : 'bg-red-500/20'
                            }`}>
                              {getTransactionIcon(tx.type)}
                            </div>
                            <span className="text-white capitalize">{tx.type}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-gray-400 text-sm">
                            {tx.method || tx.notes || '-'}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`font-medium ${getTransactionColor(tx.type)}`}>
                            {tx.type === 'deposit' || tx.type === 'return' || tx.type === 'bonus' ? '+' : '-'}
                            ${tx.amount.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          {getStatusBadge(tx.status)}
                        </td>
                        <td className="py-4 px-4 text-gray-400 text-sm">
                          {tx.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredTransactions.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-crypto-dark flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-gray-500" />
                  </div>
                  <p className="text-gray-400">No transactions found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store';
import Header from '@/sections/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Bitcoin, Wallet, CreditCard, Building2, AlertCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

const NETWORK_OPTIONS: Record<string, string[]> = {
  usdt: ['TRC20', 'ERC20', 'BEP20'],
  usdc: ['ERC20', 'BEP20', 'Solana'],
};

export default function WithdrawPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useStore();
  const [selectedMethodId, setSelectedMethodId] = useState('bitcoin');
  const [selectedNetwork, setSelectedNetwork] = useState('TRC20');
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [withdrawalSettings, setWithdrawalSettings] = useState({
    minAmount: 50, maxAmount: 50000, fee: 1, feeType: 'percentage' as 'fixed' | 'percentage',
    processingTime: '1-3 business days',
  });
  const [globalFrozen, setGlobalFrozen] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const { data } = await supabase.from('site_settings')
        .select('withdrawal_settings, global_withdrawal_frozen').eq('id', 1).single();
      if (data) {
        if (data.withdrawal_settings) setWithdrawalSettings(data.withdrawal_settings);
        if (data.global_withdrawal_frozen) setGlobalFrozen(data.global_withdrawal_frozen);
      }
    };
    loadSettings();
  }, []);

  const methods = [
    { id: 'bitcoin', name: 'Bitcoin (BTC)', icon: Bitcoin },
    { id: 'ethereum', name: 'Ethereum (ETH)', icon: Wallet },
    { id: 'usdt', name: 'USDT', icon: CreditCard },
    { id: 'usdc', name: 'USDC', icon: CreditCard },
    { id: 'bnb', name: 'BNB', icon: Wallet },
    { id: 'bank', name: 'Bank Transfer', icon: Building2 },
  ];

  const selectedMethod = methods.find(m => m.id === selectedMethodId) || methods[0];
  const withdrawAmount = parseFloat(amount || '0');
  const fee = withdrawalSettings.feeType === 'percentage'
    ? withdrawAmount * (withdrawalSettings.fee / 100)
    : withdrawalSettings.fee;
  const youReceive = Math.max(0, withdrawAmount - fee);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (globalFrozen) {
      toast.error('Withdrawals are currently suspended. Please contact support.');
      return;
    }
    if (state.user?.withdrawalFrozen) {
      toast.error('Your withdrawal access has been restricted. Please contact support.');
      return;
    }
    if (!withdrawAmount || withdrawAmount < withdrawalSettings.minAmount) {
      toast.error(`Minimum withdrawal is $${withdrawalSettings.minAmount}`);
      return;
    }
    if (withdrawAmount > withdrawalSettings.maxAmount) {
      toast.error(`Maximum withdrawal is $${withdrawalSettings.maxAmount}`);
      return;
    }
    if (withdrawAmount > (state.user?.balance || 0)) {
      toast.error('Insufficient balance');
      return;
    }
    if (!address.trim()) {
      toast.error('Please enter your wallet address or bank details');
      return;
    }

    setIsSubmitting(true);
    try {
      const methodLabel = NETWORK_OPTIONS[selectedMethodId]
        ? `${selectedMethod.name} (${selectedNetwork})`
        : selectedMethod.name;

      const { data, error } = await supabase.from('transactions').insert({
        user_id: state.user!.id,
        type: 'withdrawal',
        amount: withdrawAmount,
        status: 'pending',
        method: methodLabel,
        address: address.trim(),
        notes: `Fee: $${fee.toFixed(2)} | Net: $${youReceive.toFixed(2)}`,
      }).select().single();

      if (error) throw error;

      // Notify user
      await supabase.from('notifications').insert({
        user_id: state.user!.id,
        type: 'withdrawal',
        title: 'Withdrawal Request Submitted',
        message: `Your withdrawal of $${withdrawAmount.toFixed(2)} via ${methodLabel} is pending review. Processing time: ${withdrawalSettings.processingTime}.`,
        is_read: false,
      });

      // Update local state
      if (data) {
        dispatch({
          type: 'ADD_TRANSACTION',
          payload: {
            id: data.id,
            userId: state.user!.id,
            type: 'withdrawal',
            amount: withdrawAmount,
            status: 'pending',
            method: methodLabel,
            address: address.trim(),
            createdAt: data.created_at,
          },
        });
      }

      toast.success('Withdrawal request submitted! It will be processed within ' + withdrawalSettings.processingTime + '.');
      setAmount('');
      setAddress('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit withdrawal');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFrozen = globalFrozen || state.user?.withdrawalFrozen;

  return (
    <div className="min-h-screen bg-crypto-dark pb-24 lg:pb-12">
      <Header />
      <main className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-white hover:bg-crypto-card">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-display font-bold text-white">Withdraw Funds</h1>
              <p className="text-gray-400 text-sm mt-1">Request a withdrawal to your wallet or bank</p>
            </div>
          </div>

          {/* Freeze Warning */}
          {isFrozen && (
            <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-red-400 font-medium">Withdrawals Suspended</p>
                <p className="text-gray-400 text-sm mt-1">
                  {globalFrozen
                    ? 'All withdrawals are currently suspended by the platform. Please check back later or contact support.'
                    : 'Your withdrawal access has been restricted. Please contact support for assistance.'}
                </p>
              </div>
            </div>
          )}

          {/* Balance Card */}
          <div className="mb-6 bg-crypto-card border border-crypto-border rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Available Balance</p>
              <p className="text-2xl font-bold text-white">${(state.user?.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm">Min / Max</p>
              <p className="text-white text-sm">${withdrawalSettings.minAmount.toLocaleString()} / ${withdrawalSettings.maxAmount.toLocaleString()}</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Method Selector */}
            <div className="space-y-3">
              <h2 className="text-white font-semibold text-sm uppercase tracking-wider">Withdrawal Method</h2>
              {methods.map((method) => {
                const Icon = method.icon;
                return (
                  <button key={method.id} onClick={() => { setSelectedMethodId(method.id); setSelectedNetwork('TRC20'); }}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                      selectedMethodId === method.id
                        ? 'border-crypto-yellow bg-crypto-yellow/10 text-white'
                        : 'border-crypto-border bg-crypto-card text-gray-300 hover:border-gray-500'
                    }`}>
                    <Icon className={`w-5 h-5 ${selectedMethodId === method.id ? 'text-crypto-yellow' : 'text-gray-400'}`} />
                    <p className="text-sm font-medium">{method.name}</p>
                  </button>
                );
              })}
            </div>

            {/* Withdrawal Form */}
            <div className="lg:col-span-2">
              <Card className="bg-crypto-card border-crypto-border">
                <CardHeader>
                  <CardTitle className="text-white">Withdraw via {selectedMethod.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Network selector */}
                    {NETWORK_OPTIONS[selectedMethodId] && (
                      <div className="space-y-2">
                        <Label className="text-gray-400">Select Network</Label>
                        <div className="flex gap-2 flex-wrap">
                          {NETWORK_OPTIONS[selectedMethodId].map(net => (
                            <button key={net} type="button" onClick={() => setSelectedNetwork(net)}
                              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                                selectedNetwork === net
                                  ? 'border-crypto-yellow bg-crypto-yellow/10 text-crypto-yellow'
                                  : 'border-crypto-border bg-crypto-dark text-gray-400 hover:border-gray-500'
                              }`}>
                              {net}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Amount */}
                    <div className="space-y-2">
                      <Label className="text-gray-400">Amount (USD)</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
                          className="pl-8 bg-crypto-dark border-crypto-border text-white"
                          placeholder={`Min $${withdrawalSettings.minAmount}`} required />
                      </div>
                      {withdrawAmount > 0 && (
                        <div className="bg-crypto-dark border border-crypto-border rounded-lg p-3 space-y-1 text-sm">
                          <div className="flex justify-between text-gray-400">
                            <span>Withdrawal amount</span>
                            <span className="text-white">${withdrawAmount.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-gray-400">
                            <span>Fee ({withdrawalSettings.feeType === 'percentage' ? `${withdrawalSettings.fee}%` : `$${withdrawalSettings.fee}`})</span>
                            <span className="text-red-400">-${fee.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-semibold border-t border-crypto-border pt-1 mt-1">
                            <span className="text-gray-300">You receive</span>
                            <span className="text-green-400">${youReceive.toFixed(2)}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Address */}
                    <div className="space-y-2">
                      <Label className="text-gray-400">
                        {selectedMethodId === 'bank' ? 'Bank Account Details' : `${selectedMethod.name} Wallet Address`}
                      </Label>
                      <Input value={address} onChange={(e) => setAddress(e.target.value)}
                        className="bg-crypto-dark border-crypto-border text-white font-mono"
                        placeholder={selectedMethodId === 'bank'
                          ? 'Bank name, account number, routing number'
                          : `Enter your ${selectedMethod.name} address`}
                        required />
                      <p className="text-xs text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Double-check your address — transactions cannot be reversed
                      </p>
                    </div>

                    <Button type="submit" disabled={isSubmitting || isFrozen}
                      className="w-full bg-crypto-yellow text-crypto-dark hover:bg-crypto-yellow-light font-semibold disabled:opacity-50">
                      {isSubmitting ? 'Submitting...' : 'Submit Withdrawal Request'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <div className="mt-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                <p className="text-yellow-400 text-sm font-medium mb-2">Processing Information</p>
                <ul className="text-gray-400 text-xs space-y-1">
                  <li>• Processing time: {withdrawalSettings.processingTime}</li>
                  <li>• Withdrawals are reviewed manually for security</li>
                  <li>• You will receive a notification once processed</li>
                  <li>• Contact support if your withdrawal is delayed</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

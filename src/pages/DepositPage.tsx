import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store';
import Header from '@/sections/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Bitcoin, Copy, Check, Wallet, CreditCard, Building2, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

const NETWORK_OPTIONS: Record<string, string[]> = {
  usdt: ['TRC20', 'ERC20', 'BEP20'],
  usdc: ['ERC20', 'BEP20', 'Solana'],
};

export default function DepositPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useStore();
  const [selectedMethodId, setSelectedMethodId] = useState('bitcoin');
  const [selectedNetwork, setSelectedNetwork] = useState('TRC20');
  const [amount, setAmount] = useState('');
  const [txHash, setTxHash] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [depositAddresses, setDepositAddresses] = useState<Record<string, any>>({});
  const [depositMethods, setDepositMethods] = useState<Record<string, any>>({});

  // Load wallet addresses and methods from site_settings
  useEffect(() => {
    const loadSettings = async () => {
      const { data } = await supabase.from('site_settings').select('deposit_addresses, deposit_methods').eq('id', 1).single();
      if (data) {
        if (data.deposit_addresses) setDepositAddresses(data.deposit_addresses);
        if (data.deposit_methods) setDepositMethods(data.deposit_methods);
      }
    };
    loadSettings();
  }, []);

  const methods = [
    { id: 'bitcoin', name: 'Bitcoin (BTC)', icon: Bitcoin, minAmount: depositMethods.bitcoin?.minAmount || 100 },
    { id: 'ethereum', name: 'Ethereum (ETH)', icon: Wallet, minAmount: depositMethods.ethereum?.minAmount || 100 },
    { id: 'usdt', name: 'USDT', icon: CreditCard, minAmount: depositMethods.usdt?.minAmount || 50 },
    { id: 'usdc', name: 'USDC', icon: CreditCard, minAmount: depositMethods.usdc?.minAmount || 50 },
    { id: 'bnb', name: 'BNB', icon: Wallet, minAmount: depositMethods.bnb?.minAmount || 50 },
    { id: 'bank', name: 'Bank Transfer', icon: Building2, minAmount: depositMethods.bank?.minAmount || 500 },
  ].filter(m => {
    if (Object.keys(depositMethods).length === 0) return true; // show all if not loaded yet
    return depositMethods[m.id]?.enabled !== false;
  });

  const selectedMethod = methods.find(m => m.id === selectedMethodId) || methods[0];

  const getAddress = () => {
    if (!depositAddresses) return '';
    if (selectedMethodId === 'usdt') {
      return depositAddresses.usdt?.[selectedNetwork.toLowerCase()] || depositAddresses.usdt?.trc20 || '';
    }
    if (selectedMethodId === 'usdc') {
      return depositAddresses.usdc?.[selectedNetwork.toLowerCase()] || depositAddresses.usdc?.erc20 || '';
    }
    if (selectedMethodId === 'bank') {
      const b = depositMethods.bank;
      if (b) return `Bank: ${b.bankName} | Account: ${b.accountNumber} | Routing: ${b.routingNumber}`;
    }
    return depositAddresses[selectedMethodId] || '';
  };

  const address = getAddress();

  const handleCopy = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    toast.success('Address copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const depositAmount = parseFloat(amount);

    if (!depositAmount || depositAmount < selectedMethod.minAmount) {
      toast.error(`Minimum deposit is $${selectedMethod.minAmount}`);
      return;
    }
    if (selectedMethodId !== 'bank' && !txHash.trim()) {
      toast.error('Please enter the transaction hash / reference');
      return;
    }

    setIsSubmitting(true);
    try {
      const methodLabel = NETWORK_OPTIONS[selectedMethodId]
        ? `${selectedMethod.name} (${selectedNetwork})`
        : selectedMethod.name;

      const { data, error } = await supabase.from('transactions').insert({
        user_id: state.user!.id,
        type: 'deposit',
        amount: depositAmount,
        status: 'pending',
        method: methodLabel,
        address: address,
        notes: txHash.trim() || null,
      }).select().single();

      if (error) throw error;

      // Notify user
      await supabase.from('notifications').insert({
        user_id: state.user!.id,
        type: 'deposit',
        title: 'Deposit Request Received',
        message: `Your deposit of $${depositAmount.toFixed(2)} via ${methodLabel} is under review. It will be credited once confirmed.`,
        is_read: false,
      });

      // Update local state
      if (data) {
        dispatch({
          type: 'ADD_TRANSACTION',
          payload: {
            id: data.id,
            userId: state.user!.id,
            type: 'deposit',
            amount: depositAmount,
            status: 'pending',
            method: methodLabel,
            address: address,
            notes: txHash.trim() || undefined,
            createdAt: data.created_at,
          },
        });
      }

      toast.success('Deposit request submitted! It will be reviewed and credited shortly.');
      setAmount('');
      setTxHash('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit deposit');
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <h1 className="text-3xl font-display font-bold text-white">Deposit Funds</h1>
              <p className="text-gray-400 text-sm mt-1">Choose a method and submit your deposit request</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Method Selector */}
            <div className="space-y-3">
              <h2 className="text-white font-semibold text-sm uppercase tracking-wider">Payment Method</h2>
              {methods.map((method) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    onClick={() => { setSelectedMethodId(method.id); setSelectedNetwork('TRC20'); }}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                      selectedMethodId === method.id
                        ? 'border-crypto-yellow bg-crypto-yellow/10 text-white'
                        : 'border-crypto-border bg-crypto-card text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${selectedMethodId === method.id ? 'text-crypto-yellow' : 'text-gray-400'}`} />
                    <div>
                      <p className="text-sm font-medium">{method.name}</p>
                      <p className="text-xs text-gray-500">Min: ${method.minAmount}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Deposit Form */}
            <div className="lg:col-span-2">
              <Card className="bg-crypto-card border-crypto-border">
                <CardHeader>
                  <CardTitle className="text-white">
                    Deposit via {selectedMethod.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Network selector for USDT/USDC */}
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

                    {/* Wallet Address */}
                    {selectedMethodId !== 'bank' && address && (
                      <div className="space-y-2">
                        <Label className="text-gray-400">Send to this address</Label>
                        <div className="flex gap-2">
                          <div className="flex-1 bg-crypto-dark border border-crypto-border rounded-lg px-3 py-2">
                            <p className="text-white text-sm font-mono break-all">{address}</p>
                          </div>
                          <Button type="button" variant="outline" size="icon" onClick={handleCopy}
                            className="border-crypto-border text-white shrink-0">
                            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                          </Button>
                        </div>
                        <p className="text-xs text-yellow-400">⚠ Only send {selectedMethod.name} to this address</p>
                      </div>
                    )}

                    {/* Bank info */}
                    {selectedMethodId === 'bank' && (
                      <div className="bg-crypto-dark border border-crypto-border rounded-lg p-4 space-y-2">
                        <p className="text-gray-400 text-sm font-medium">Bank Transfer Details</p>
                        {depositMethods.bank ? (
                          <>
                            <p className="text-white text-sm">Bank: <span className="text-gray-300">{depositMethods.bank.bankName}</span></p>
                            <p className="text-white text-sm">Account Name: <span className="text-gray-300">{depositMethods.bank.accountName}</span></p>
                            <p className="text-white text-sm">Account #: <span className="text-gray-300">{depositMethods.bank.accountNumber}</span></p>
                            <p className="text-white text-sm">Routing #: <span className="text-gray-300">{depositMethods.bank.routingNumber}</span></p>
                          </>
                        ) : (
                          <p className="text-gray-500 text-sm">Bank details not configured. Contact support.</p>
                        )}
                      </div>
                    )}

                    {/* Amount */}
                    <div className="space-y-2">
                      <Label className="text-gray-400">Amount (USD)</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
                          className="pl-8 bg-crypto-dark border-crypto-border text-white"
                          placeholder={`Min $${selectedMethod.minAmount}`} required />
                      </div>
                    </div>

                    {/* Transaction Hash */}
                    {selectedMethodId !== 'bank' && (
                      <div className="space-y-2">
                        <Label className="text-gray-400">Transaction Hash / ID</Label>
                        <Input value={txHash} onChange={(e) => setTxHash(e.target.value)}
                          className="bg-crypto-dark border-crypto-border text-white font-mono"
                          placeholder="Paste your transaction hash here" required />
                        <p className="text-xs text-gray-500">Copy the transaction hash from your wallet after sending</p>
                      </div>
                    )}

                    {selectedMethodId === 'bank' && (
                      <div className="space-y-2">
                        <Label className="text-gray-400">Reference / Transfer ID</Label>
                        <Input value={txHash} onChange={(e) => setTxHash(e.target.value)}
                          className="bg-crypto-dark border-crypto-border text-white"
                          placeholder="Bank transfer reference number" />
                      </div>
                    )}

                    <Button type="submit" disabled={isSubmitting}
                      className="w-full bg-crypto-yellow text-crypto-dark hover:bg-crypto-yellow-light font-semibold">
                      {isSubmitting ? 'Submitting...' : 'Submit Deposit Request'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Info */}
              <div className="mt-4 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <p className="text-blue-400 text-sm font-medium mb-2">How it works</p>
                <ul className="text-gray-400 text-xs space-y-1">
                  <li>1. Send the exact amount to the address above</li>
                  <li>2. Copy your transaction hash and paste it here</li>
                  <li>3. Submit — our team will verify and credit your account</li>
                  <li>4. Processing time: 10 minutes to 24 hours depending on network</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

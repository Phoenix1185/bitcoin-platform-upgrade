import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store';
import Header from '@/sections/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Bitcoin, Copy, Check, Wallet, CreditCard, Building2 } from 'lucide-react';
import { toast } from 'sonner';

const depositMethods = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    icon: Bitcoin,
    address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    minAmount: 100,
    maxAmount: 100000,
    processingTime: '10-30 minutes',
    fee: '0%',
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    icon: Wallet,
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    minAmount: 100,
    maxAmount: 100000,
    processingTime: '5-15 minutes',
    fee: '0%',
  },
  {
    id: 'usdt',
    name: 'USDT (TRC20)',
    icon: CreditCard,
    address: 'TKrzzf8g63xUmzB2eJ1e1z1z1z1z1z1z1z',
    minAmount: 50,
    maxAmount: 50000,
    processingTime: '2-5 minutes',
    fee: '0%',
  },
  {
    id: 'bank',
    name: 'Bank Transfer',
    icon: Building2,
    address: 'Account: 1234567890 | Routing: 021000021',
    minAmount: 500,
    maxAmount: 100000,
    processingTime: '1-3 business days',
    fee: '0%',
  },
];

export default function DepositPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useStore();
  const [selectedMethod, setSelectedMethod] = useState(depositMethods[0]);
  const [amount, setAmount] = useState('');
  const [txHash, setTxHash] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedMethod.address);
    setCopied(true);
    toast.success('Address copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const depositAmount = parseFloat(amount);
    
    if (depositAmount < selectedMethod.minAmount) {
      toast.error(`Minimum deposit amount is $${selectedMethod.minAmount}`);
      return;
    }

    if (depositAmount > selectedMethod.maxAmount) {
      toast.error(`Maximum deposit amount is $${selectedMethod.maxAmount}`);
      return;
    }

    if (!txHash && selectedMethod.id !== 'bank') {
      toast.error('Please enter the transaction hash');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Create deposit request
    const depositRequest = {
      id: 'dep-' + Date.now(),
      userId: state.user!.id,
      type: 'deposit' as const,
      amount: depositAmount,
      status: 'pending' as const,
      method: selectedMethod.name,
      address: txHash,
      description: `Deposit via ${selectedMethod.name}`,
      createdAt: new Date().toISOString(),
    };

    dispatch({ type: 'ADD_TRANSACTION', payload: depositRequest });

    toast.success('Deposit request submitted successfully! It will be processed shortly.');
    setAmount('');
    setTxHash('');
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-crypto-dark">
      <Header />
      
      <main className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
                Deposit Funds
              </h1>
              <p className="text-gray-400 mt-1">
                Add funds to your account securely
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Deposit Form */}
            <div className="lg:col-span-2">
              <Card className="bg-crypto-card border-crypto-border">
                <CardHeader>
                  <CardTitle className="text-white">Select Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue={depositMethods[0].id} onValueChange={(value) => {
                    const method = depositMethods.find(m => m.id === value);
                    if (method) setSelectedMethod(method);
                  }}>
                    <TabsList className="grid grid-cols-2 mb-6 bg-crypto-dark">
                      {depositMethods.map((method) => (
                        <TabsTrigger
                          key={method.id}
                          value={method.id}
                          className="data-[state=active]:bg-crypto-yellow data-[state=active]:text-crypto-dark"
                        >
                          <method.icon className="w-4 h-4 mr-2" />
                          {method.name}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {depositMethods.map((method) => (
                      <TabsContent key={method.id} value={method.id}>
                        <form onSubmit={handleSubmit} className="space-y-6">
                          {/* Address/Account Info */}
                          <div className="space-y-2">
                            <Label className="text-white">
                              {method.id === 'bank' ? 'Bank Account Details' : 'Deposit Address'}
                            </Label>
                            <div className="flex gap-2">
                              <div className="flex-1 p-4 rounded-xl bg-crypto-dark border border-crypto-border font-mono text-sm text-gray-300 break-all">
                                {method.address}
                              </div>
                              {method.id !== 'bank' && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={handleCopy}
                                  className="border-crypto-border text-white hover:bg-crypto-dark"
                                >
                                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </Button>
                              )}
                            </div>
                          </div>

                          {/* Amount */}
                          <div className="space-y-2">
                            <Label htmlFor="amount" className="text-white">
                              Deposit Amount (USD)
                            </Label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                              <Input
                                id="amount"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder={`Min: $${method.minAmount}`}
                                className="pl-8 bg-crypto-dark border-crypto-border text-white"
                                required
                              />
                            </div>
                            <p className="text-xs text-gray-500">
                              Min: ${method.minAmount} - Max: ${method.maxAmount.toLocaleString()}
                            </p>
                          </div>

                          {/* Transaction Hash (for crypto) */}
                          {method.id !== 'bank' && (
                            <div className="space-y-2">
                              <Label htmlFor="txHash" className="text-white">
                                Transaction Hash / TXID
                              </Label>
                              <Input
                                id="txHash"
                                type="text"
                                value={txHash}
                                onChange={(e) => setTxHash(e.target.value)}
                                placeholder="Enter transaction hash"
                                className="bg-crypto-dark border-crypto-border text-white"
                                required
                              />
                            </div>
                          )}

                          {/* Submit Button */}
                          <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-crypto-yellow text-crypto-dark hover:bg-crypto-yellow-light font-semibold py-6"
                          >
                            {isSubmitting ? (
                              <div className="w-6 h-6 border-2 border-crypto-dark border-t-transparent rounded-full animate-spin" />
                            ) : (
                              'Submit Deposit Request'
                            )}
                          </Button>
                        </form>
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Info Sidebar */}
            <div className="space-y-6">
              <Card className="bg-crypto-card border-crypto-border">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Deposit Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Processing Time</span>
                    <span className="text-white">{selectedMethod.processingTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Fee</span>
                    <span className="text-green-500">{selectedMethod.fee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Min Amount</span>
                    <span className="text-white">${selectedMethod.minAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Max Amount</span>
                    <span className="text-white">${selectedMethod.maxAmount.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-crypto-card border-crypto-border">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Important Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-gray-400">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-crypto-yellow flex-shrink-0 mt-0.5" />
                      Only send {selectedMethod.name} to this address
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-crypto-yellow flex-shrink-0 mt-0.5" />
                      Minimum deposit amount is ${selectedMethod.minAmount}
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-crypto-yellow flex-shrink-0 mt-0.5" />
                      Deposits will be credited after network confirmation
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-crypto-yellow flex-shrink-0 mt-0.5" />
                      Keep your transaction hash for reference
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

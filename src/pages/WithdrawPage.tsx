import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store';
import Header from '@/sections/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Bitcoin, Wallet, CreditCard, Building2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const withdrawalMethods = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    icon: Bitcoin,
    minAmount: 50,
    maxAmount: 50000,
    processingTime: '10-30 minutes',
    fee: '1%',
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    icon: Wallet,
    minAmount: 50,
    maxAmount: 50000,
    processingTime: '5-15 minutes',
    fee: '1%',
  },
  {
    id: 'usdt',
    name: 'USDT (TRC20)',
    icon: CreditCard,
    minAmount: 25,
    maxAmount: 25000,
    processingTime: '2-5 minutes',
    fee: '0.5%',
  },
  {
    id: 'bank',
    name: 'Bank Transfer',
    icon: Building2,
    minAmount: 100,
    maxAmount: 100000,
    processingTime: '1-3 business days',
    fee: '2%',
  },
];

export default function WithdrawPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useStore();
  const [selectedMethod, setSelectedMethod] = useState(withdrawalMethods[0]);
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const withdrawAmount = parseFloat(amount);
    
    if (withdrawAmount < selectedMethod.minAmount) {
      toast.error(`Minimum withdrawal amount is $${selectedMethod.minAmount}`);
      return;
    }

    if (withdrawAmount > selectedMethod.maxAmount) {
      toast.error(`Maximum withdrawal amount is $${selectedMethod.maxAmount}`);
      return;
    }

    if (withdrawAmount > (state.user?.balance || 0)) {
      toast.error('Insufficient balance');
      return;
    }

    if (!address) {
      toast.error('Please enter your withdrawal address');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Create withdrawal request
    const withdrawalRequest = {
      id: 'wit-' + Date.now(),
      userId: state.user!.id,
      userName: state.user!.name,
      userEmail: state.user!.email,
      amount: withdrawAmount,
      method: selectedMethod.name,
      address: address,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
    };

    dispatch({ type: 'ADD_WITHDRAWAL_REQUEST', payload: withdrawalRequest });

    toast.success('Withdrawal request submitted successfully! It will be processed shortly.');
    setAmount('');
    setAddress('');
    setIsSubmitting(false);
  };

  const fee = parseFloat(amount || '0') * parseFloat(selectedMethod.fee) / 100;
  const total = parseFloat(amount || '0') - fee;

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
                Withdraw Funds
              </h1>
              <p className="text-gray-400 mt-1">
                Withdraw your earnings securely
              </p>
            </div>
          </div>

          {/* Balance Card */}
          <Card className="mb-8 bg-gradient-to-r from-crypto-yellow/20 to-crypto-yellow/5 border-crypto-yellow/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 mb-1">Available Balance</p>
                  <p className="text-3xl font-bold text-white">
                    ${state.user?.balance.toLocaleString() || '0'}
                  </p>
                </div>
                <div className="w-14 h-14 rounded-xl bg-crypto-yellow/20 flex items-center justify-center">
                  <Wallet className="w-7 h-7 text-crypto-yellow" />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Withdrawal Form */}
            <div className="lg:col-span-2">
              <Card className="bg-crypto-card border-crypto-border">
                <CardHeader>
                  <CardTitle className="text-white">Select Withdrawal Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue={withdrawalMethods[0].id} onValueChange={(value) => {
                    const method = withdrawalMethods.find(m => m.id === value);
                    if (method) setSelectedMethod(method);
                  }}>
                    <TabsList className="grid grid-cols-2 mb-6 bg-crypto-dark">
                      {withdrawalMethods.map((method) => (
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

                    {withdrawalMethods.map((method) => (
                      <TabsContent key={method.id} value={method.id}>
                        <form onSubmit={handleSubmit} className="space-y-6">
                          {/* Address */}
                          <div className="space-y-2">
                            <Label htmlFor="address" className="text-white">
                              {method.id === 'bank' ? 'Bank Account Number' : 'Wallet Address'}
                            </Label>
                            <Input
                              id="address"
                              type="text"
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              placeholder={method.id === 'bank' ? 'Enter account number' : 'Enter wallet address'}
                              className="bg-crypto-dark border-crypto-border text-white"
                              required
                            />
                          </div>

                          {/* Amount */}
                          <div className="space-y-2">
                            <Label htmlFor="amount" className="text-white">
                              Withdrawal Amount (USD)
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

                          {/* Summary */}
                          {amount && (
                            <div className="p-4 rounded-xl bg-crypto-dark border border-crypto-border space-y-2">
                              <div className="flex justify-between">
                                <span className="text-gray-400">Amount</span>
                                <span className="text-white">${parseFloat(amount).toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Fee ({method.fee})</span>
                                <span className="text-red-500">-${fee.toFixed(2)}</span>
                              </div>
                              <div className="border-t border-crypto-border pt-2 flex justify-between">
                                <span className="text-gray-300">You Receive</span>
                                <span className="text-green-500 font-bold">${total.toFixed(2)}</span>
                              </div>
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
                              'Request Withdrawal'
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
                  <CardTitle className="text-white text-lg">Withdrawal Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Processing Time</span>
                    <span className="text-white">{selectedMethod.processingTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Fee</span>
                    <span className="text-red-500">{selectedMethod.fee}</span>
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
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-crypto-yellow" />
                    Important
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-gray-400">
                    <li>• Double-check your wallet address before submitting</li>
                    <li>• Withdrawals are processed within the stated time</li>
                    <li>• Minimum withdrawal amount applies</li>
                    <li>• Fees are deducted from the withdrawal amount</li>
                    <li>• Contact support for any issues</li>
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

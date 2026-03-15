import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store';
import Header from '@/sections/Header';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, Star, TrendingUp, Clock, DollarSign, Shield, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

export default function InvestmentPlansPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useStore();
  const [selectedPlan, setSelectedPlan] = useState<typeof state.investmentPlans[0] | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load investment plans from Supabase if not already loaded
  useEffect(() => {
    if (state.investmentPlans.length === 0) {
      supabase
        .from('investment_plans')
        .select('*')
        .order('min_amount', { ascending: true })
        .then(({ data }) => {
          if (data) {
            dispatch({
              type: 'SET_INVESTMENT_PLANS',
              payload: data.map((p: any) => ({
                id: p.id,
                name: p.name,
                minAmount: p.min_amount,
                maxAmount: p.max_amount,
                dailyReturn: p.daily_return,
                duration: p.duration,
                featured: p.featured || false,
                description: p.description || '',
              })),
            });
          }
        });
    }
  }, []);

  const handleInvest = (plan: typeof state.investmentPlans[0]) => {
    if (!state.isAuthenticated) {
      toast.error('Please login to invest');
      navigate('/login');
      return;
    }
    setSelectedPlan(plan);
    setInvestmentAmount(plan.minAmount.toString());
    setIsDialogOpen(true);
  };

  const confirmInvestment = async () => {
    if (!selectedPlan || !state.user) return;

    const amount = parseFloat(investmentAmount);

    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (amount < selectedPlan.minAmount || amount > selectedPlan.maxAmount) {
      toast.error(`Amount must be between $${selectedPlan.minAmount.toLocaleString()} and $${selectedPlan.maxAmount.toLocaleString()}`);
      return;
    }

    if (amount > (state.user?.balance || 0)) {
      toast.error('Insufficient balance. Please deposit funds first.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Get current session token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      // Call the Edge Function for atomic investment processing
      const response = await supabase.functions.invoke('process-investment', {
        body: { planId: selectedPlan.id, amount },
      });

      if (response.error) throw new Error(response.error.message);

      const result = response.data;
      if (!result?.success) throw new Error(result?.error || 'Investment failed');

      // Update local state with the new investment
      dispatch({
        type: 'ADD_INVESTMENT',
        payload: {
          id: result.investment.id,
          userId: state.user.id,
          planId: selectedPlan.id,
          planName: result.investment.planName,
          amount: result.investment.amount,
          dailyReturn: result.investment.dailyReturn,
          duration: result.investment.duration,
          startDate: result.investment.startDate,
          endDate: result.investment.endDate,
          status: 'active',
          totalEarned: 0,
          createdAt: result.investment.startDate,
        },
      });

      // Update balance in local state
      dispatch({
        type: 'UPDATE_USER',
        payload: {
          balance: result.newBalance,
          totalInvested: (state.user.totalInvested || 0) + amount,
        },
      });

      // Add investment transaction to local state
      dispatch({
        type: 'ADD_TRANSACTION',
        payload: {
          id: 'tx-' + Date.now(),
          userId: state.user.id,
          type: 'investment',
          amount,
          status: 'completed',
          method: 'balance',
          notes: `Invested in ${selectedPlan.name}`,
          createdAt: new Date().toISOString(),
        },
      });

      toast.success(`Successfully invested $${amount.toLocaleString()} in ${selectedPlan.name}!`);
      setIsDialogOpen(false);
      setSelectedPlan(null);
      navigate('/dashboard');

    } catch (err: any) {
      // Fallback: if Edge Function not deployed, do direct Supabase insert
      try {
        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + selectedPlan.duration);

        // Insert investment
        const { data: inv, error: invErr } = await supabase
          .from('investments')
          .insert({
            user_id: state.user.id,
            plan_id: selectedPlan.id,
            plan_name: selectedPlan.name,
            amount,
            daily_return: selectedPlan.dailyReturn,
            duration: selectedPlan.duration,
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
            status: 'active',
            total_earned: 0,
          })
          .select()
          .single();

        if (invErr) throw invErr;

        // Insert transaction
        await supabase.from('transactions').insert({
          user_id: state.user.id,
          type: 'investment',
          amount,
          status: 'completed',
          method: 'balance',
          notes: `Invested in ${selectedPlan.name}`,
        });

        // Update balance
        const newBalance = (state.user.balance || 0) - amount;
        const newTotalInvested = (state.user.totalInvested || 0) + amount;

        await supabase.from('profiles').update({
          balance: newBalance,
          total_invested: newTotalInvested,
        }).eq('id', state.user.id);

        // Update local state
        dispatch({
          type: 'ADD_INVESTMENT',
          payload: {
            id: inv.id,
            userId: state.user.id,
            planId: selectedPlan.id,
            planName: selectedPlan.name,
            amount,
            dailyReturn: selectedPlan.dailyReturn,
            duration: selectedPlan.duration,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            status: 'active',
            totalEarned: 0,
            createdAt: startDate.toISOString(),
          },
        });

        dispatch({
          type: 'UPDATE_USER',
          payload: { balance: newBalance, totalInvested: newTotalInvested },
        });

        toast.success(`Successfully invested $${amount.toLocaleString()} in ${selectedPlan.name}!`);
        setIsDialogOpen(false);
        setSelectedPlan(null);
        navigate('/dashboard');

      } catch (fallbackErr: any) {
        toast.error(fallbackErr.message || 'Investment failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const dailyEarnings = selectedPlan
    ? parseFloat(investmentAmount || '0') * selectedPlan.dailyReturn / 100
    : 0;
  const totalEarnings = selectedPlan
    ? dailyEarnings * selectedPlan.duration
    : 0;

  return (
    <div className="min-h-screen bg-crypto-dark">
      <Header />
      
      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <h1 className="text-3xl font-display font-bold text-white">Investment Plans</h1>
              <p className="text-gray-400 mt-1">Choose the perfect plan for your financial goals</p>
            </div>
          </div>

          {/* Plans Grid */}
          {state.investmentPlans.length === 0 ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="w-8 h-8 text-crypto-yellow animate-spin" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {state.investmentPlans.map((plan, index) => (
                <div
                  key={plan.id}
                  className="relative group animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {plan.featured && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                      <div className="flex items-center gap-1 px-3 py-1 bg-crypto-yellow text-crypto-dark text-xs font-bold rounded-full">
                        <Star className="w-3 h-3 fill-current" />
                        BEST VALUE
                      </div>
                    </div>
                  )}

                  <div className={`relative h-full p-6 rounded-2xl border transition-all duration-500 ${
                    plan.featured
                      ? 'bg-crypto-card border-crypto-yellow/50 shadow-glow-lg scale-105'
                      : 'bg-crypto-card/50 border-crypto-border hover:border-crypto-yellow/30'
                  } hover:-translate-y-2`}>
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-4xl font-bold text-crypto-yellow">{plan.dailyReturn}%</span>
                        <span className="text-gray-400">/day</span>
                      </div>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-lg bg-crypto-yellow/10 flex items-center justify-center flex-shrink-0">
                          <DollarSign className="w-4 h-4 text-crypto-yellow" />
                        </div>
                        <div>
                          <p className="text-gray-400">Investment</p>
                          <p className="text-white font-medium">
                            ${plan.minAmount.toLocaleString()} – ${plan.maxAmount.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-lg bg-crypto-yellow/10 flex items-center justify-center flex-shrink-0">
                          <Clock className="w-4 h-4 text-crypto-yellow" />
                        </div>
                        <div>
                          <p className="text-gray-400">Duration</p>
                          <p className="text-white font-medium">{plan.duration} Days</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-lg bg-crypto-yellow/10 flex items-center justify-center flex-shrink-0">
                          <TrendingUp className="w-4 h-4 text-crypto-yellow" />
                        </div>
                        <div>
                          <p className="text-gray-400">Total Return</p>
                          <p className="text-white font-medium">{(plan.dailyReturn * plan.duration).toFixed(0)}%</p>
                        </div>
                      </div>
                    </div>

                    <ul className="space-y-2 mb-6">
                      {['Daily payouts', 'Principal return', 'Instant withdrawal', '24/7 support'].map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-gray-400">
                          <Check className="w-4 h-4 text-crypto-yellow flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Button
                      onClick={() => handleInvest(plan)}
                      className={`w-full ${
                        plan.featured
                          ? 'bg-crypto-yellow text-crypto-dark hover:bg-crypto-yellow-light'
                          : 'bg-crypto-border text-white hover:bg-crypto-yellow hover:text-crypto-dark'
                      } font-semibold transition-all duration-300`}
                    >
                      Invest Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {[
              { icon: Shield, title: 'Secure Investment', desc: 'Your investments are protected by our advanced security systems and insurance coverage.' },
              { icon: TrendingUp, title: 'Daily Returns', desc: 'Earn consistent daily returns that are automatically credited to your account every day.' },
              { icon: Clock, title: 'Flexible Terms', desc: 'Choose from various investment durations that suit your financial goals and timeline.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-6 rounded-2xl bg-crypto-card border border-crypto-border">
                <div className="w-12 h-12 rounded-xl bg-crypto-yellow/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-crypto-yellow" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                <p className="text-gray-400 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Investment Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-crypto-card border-crypto-border text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display">
              Invest in {selectedPlan?.name}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Enter the amount you want to invest. Funds will be deducted from your balance.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="p-4 rounded-xl bg-crypto-dark border border-crypto-border">
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Daily Return</span>
                <span className="text-crypto-yellow font-bold">{selectedPlan?.dailyReturn}%</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Duration</span>
                <span className="text-white">{selectedPlan?.duration} days</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Total Return</span>
                <span className="text-green-400 font-bold">
                  {selectedPlan ? (selectedPlan.dailyReturn * selectedPlan.duration).toFixed(0) : 0}%
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-crypto-border">
                <span className="text-gray-400">Your Balance</span>
                <span className="text-white font-bold">${(state.user?.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Investment Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <Input
                  id="amount"
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  className="pl-8 bg-crypto-dark border-crypto-border text-white"
                  min={selectedPlan?.minAmount}
                  max={selectedPlan?.maxAmount}
                />
              </div>
              <p className="text-xs text-gray-500">
                Min: ${selectedPlan?.minAmount.toLocaleString()} — Max: ${selectedPlan?.maxAmount.toLocaleString()}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-crypto-yellow/10 border border-crypto-yellow/30">
              <div className="flex justify-between">
                <span className="text-gray-300">Daily Earnings</span>
                <span className="text-crypto-yellow font-bold">${dailyEarnings.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-gray-300">Total Earnings</span>
                <span className="text-green-400 font-bold">${totalEarnings.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="flex-1 border-crypto-border text-white hover:bg-crypto-dark"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmInvestment}
                disabled={isSubmitting}
                className="flex-1 bg-crypto-yellow text-crypto-dark hover:bg-crypto-yellow-light"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Confirm Investment'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useNavigate } from 'react-router-dom';
import Header from '@/sections/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Wallet, 
  CreditCard, 
  Building2, 
  ArrowRightLeft,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Shield
} from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Choose a Crypto Exchange',
    description: 'Select a reputable exchange to buy cryptocurrency. Popular options include Binance, Coinbase, and Kraken.',
    exchanges: [
      { name: 'Binance', url: 'https://binance.com', description: 'World\'s largest crypto exchange' },
      { name: 'Coinbase', url: 'https://coinbase.com', description: 'Beginner-friendly US exchange' },
      { name: 'Kraken', url: 'https://kraken.com', description: 'Secure and regulated exchange' },
    ]
  },
  {
    number: '02',
    title: 'Create & Verify Your Account',
    description: 'Sign up on your chosen exchange and complete the KYC (Know Your Customer) verification process.',
    requirements: [
      'Valid government-issued ID',
      'Proof of address (utility bill or bank statement)',
      'Selfie verification',
      'Phone number verification'
    ]
  },
  {
    number: '03',
    title: 'Add Payment Method',
    description: 'Link your preferred payment method to fund your exchange account.',
    methods: [
      { icon: CreditCard, name: 'Credit/Debit Card', time: 'Instant', fee: '2-4%' },
      { icon: Building2, name: 'Bank Transfer', time: '1-5 days', fee: '0-1%' },
      { icon: ArrowRightLeft, name: 'P2P Trading', time: 'Instant', fee: '0-1%' },
    ]
  },
  {
    number: '04',
    title: 'Buy Cryptocurrency',
    description: 'Purchase the cryptocurrency you want to deposit to BitWealth.',
    tips: [
      'Bitcoin (BTC) - Most widely accepted',
      'Ethereum (ETH) - Fast transactions',
      'USDT (TRC20) - Low fees, stable value',
      'USDC - Regulated stablecoin'
    ]
  },
  {
    number: '05',
    title: 'Transfer to BitWealth',
    description: 'Send your crypto from the exchange to your BitWealth deposit address.',
    warnings: [
      'Double-check the wallet address',
      'Ensure you\'re using the correct network (e.g., TRC20 for USDT)',
      'Start with a small test amount',
      'Save your transaction hash for reference'
    ]
  }
];

const faqs = [
  {
    question: 'How long does verification take?',
    answer: 'Most exchanges complete verification within 24 hours, but it can take up to 3 business days during high demand periods.'
  },
  {
    question: 'What is the minimum amount I can buy?',
    answer: 'Most exchanges allow purchases as low as $10-25 worth of cryptocurrency.'
  },
  {
    question: 'Which cryptocurrency should I buy?',
    answer: 'For BitWealth deposits, we recommend USDT (TRC20 network) due to low transaction fees and stable value. Bitcoin and Ethereum are also accepted.'
  },
  {
    question: 'What if I send to the wrong address?',
    answer: 'Cryptocurrency transactions are irreversible. Always double-check the address and send a small test amount first.'
  },
  {
    question: 'How long does a deposit take to arrive?',
    answer: 'Crypto deposits typically arrive within 10-30 minutes depending on network congestion. Bitcoin may take longer (30-60 minutes).' 
  }
];

export default function GuidePage() {
  const navigate = useNavigate();

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
                Beginner's Guide
              </h1>
              <p className="text-gray-400 mt-1">
                How to buy cryptocurrency and deposit to BitWealth
              </p>
            </div>
          </div>

          {/* Quick Start Banner */}
          <div className="bg-gradient-to-r from-crypto-yellow/20 to-crypto-yellow/5 border border-crypto-yellow/30 rounded-2xl p-6 mb-10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-crypto-yellow/20 flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-crypto-yellow" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">New to Crypto? No Problem!</h2>
                <p className="text-gray-400 mb-4">
                  This step-by-step guide will walk you through buying your first cryptocurrency 
                  and depositing it to BitWealth to start earning daily returns.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button 
                    onClick={() => navigate('/register')}
                    className="bg-crypto-yellow text-crypto-dark hover:bg-crypto-yellow-light"
                  >
                    Create BitWealth Account
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/deposit')}
                    className="border-crypto-border text-white hover:bg-crypto-card"
                  >
                    Go to Deposit Page
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-8 mb-12">
            <h2 className="text-2xl font-semibold text-white">Step-by-Step Guide</h2>
            
            {steps.map((step) => (
              <Card key={step.number} className="bg-crypto-card border-crypto-border">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-crypto-yellow/10 flex items-center justify-center">
                      <span className="text-lg font-bold text-crypto-yellow">{step.number}</span>
                    </div>
                    <CardTitle className="text-white text-xl">{step.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 mb-4">{step.description}</p>
                  
                  {/* Exchange Links */}
                  {step.exchanges && (
                    <div className="grid sm:grid-cols-3 gap-3">
                      {step.exchanges.map((exchange) => (
                        <a
                          key={exchange.name}
                          href={exchange.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-3 rounded-lg bg-crypto-dark border border-crypto-border hover:border-crypto-yellow/50 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4 text-crypto-yellow" />
                          <div>
                            <p className="text-white font-medium text-sm">{exchange.name}</p>
                            <p className="text-gray-500 text-xs">{exchange.description}</p>
                          </div>
                        </a>
                      ))}
                    </div>
                  )}
                  
                  {/* Requirements */}
                  {step.requirements && (
                    <ul className="space-y-2">
                      {step.requirements.map((req, i) => (
                        <li key={i} className="flex items-center gap-2 text-gray-300">
                          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  {/* Payment Methods */}
                  {step.methods && (
                    <div className="grid sm:grid-cols-3 gap-3">
                      {step.methods.map((method) => (
                        <div
                          key={method.name}
                          className="p-3 rounded-lg bg-crypto-dark border border-crypto-border"
                        >
                          <method.icon className="w-5 h-5 text-crypto-yellow mb-2" />
                          <p className="text-white font-medium text-sm">{method.name}</p>
                          <p className="text-gray-500 text-xs">Time: {method.time}</p>
                          <p className="text-gray-500 text-xs">Fee: {method.fee}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Tips */}
                  {step.tips && (
                    <ul className="space-y-2">
                      {step.tips.map((tip, i) => (
                        <li key={i} className="flex items-center gap-2 text-gray-300">
                          <CheckCircle2 className="w-4 h-4 text-crypto-yellow flex-shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  {/* Warnings */}
                  {step.warnings && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <span className="text-red-400 font-medium">Important:</span>
                      </div>
                      <ul className="space-y-1">
                        {step.warnings.map((warning, i) => (
                          <li key={i} className="flex items-center gap-2 text-gray-300 text-sm">
                            <span className="text-red-500">•</span>
                            {warning}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Video Tutorial Placeholder */}
          <Card className="bg-crypto-card border-crypto-border mb-10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Wallet className="w-5 h-5 text-crypto-yellow" />
                Video Tutorial Coming Soon
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-crypto-dark rounded-xl flex items-center justify-center border border-crypto-border">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-crypto-yellow/10 flex items-center justify-center mx-auto mb-4">
                    <Wallet className="w-8 h-8 text-crypto-yellow" />
                  </div>
                  <p className="text-gray-400">Video tutorial will be available soon</p>
                  <p className="text-gray-500 text-sm mt-1">Learn visually how to buy and deposit crypto</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQs */}
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-white mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <Card key={index} className="bg-crypto-card border-crypto-border">
                  <CardContent className="p-5">
                    <h3 className="text-white font-medium mb-2">{faq.question}</h3>
                    <p className="text-gray-400 text-sm">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Support CTA */}
          <div className="text-center bg-gradient-to-r from-crypto-yellow/10 to-transparent border border-crypto-yellow/30 rounded-2xl p-8">
            <h2 className="text-xl font-semibold text-white mb-2">Still Need Help?</h2>
            <p className="text-gray-400 mb-4">
              Our support team is available 24/7 to assist you with any questions.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button 
                onClick={() => navigate('/support')}
                className="bg-crypto-yellow text-crypto-dark hover:bg-crypto-yellow-light"
              >
                Contact Support
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/faq')}
                className="border-crypto-border text-white hover:bg-crypto-card"
              >
                View Full FAQ
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

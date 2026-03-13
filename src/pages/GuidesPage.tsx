import { Link } from 'react-router-dom';
import { useStore } from '@/store';
import Header from '@/sections/Header';
import Footer from '@/sections/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, FileText, Shield, TrendingUp, Wallet, User, HelpCircle, ChevronRight } from 'lucide-react';

const guides = [
  {
    id: 'getting-started',
    title: 'Getting Started Guide',
    description: 'Learn how to create your account, verify your identity, and make your first investment.',
    icon: User,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/20',
    steps: [
      'Creating your BitWealth account',
      'Completing KYC verification',
      'Making your first deposit',
      'Choosing an investment plan',
      'Withdrawing your earnings',
    ],
  },
  {
    id: 'investment-basics',
    title: 'Investment Basics',
    description: 'Understand how cryptocurrency investments work and how to maximize your returns.',
    icon: TrendingUp,
    color: 'text-green-500',
    bgColor: 'bg-green-500/20',
    steps: [
      'Understanding daily returns',
      'How compounding works',
      'Risk management strategies',
      'Diversifying your portfolio',
      'Reading market trends',
    ],
  },
  {
    id: 'deposits-withdrawals',
    title: 'Deposits & Withdrawals',
    description: 'Everything you need to know about funding your account and withdrawing profits.',
    icon: Wallet,
    color: 'text-crypto-yellow',
    bgColor: 'bg-crypto-yellow/20',
    steps: [
      'Supported payment methods',
      'Minimum and maximum limits',
      'Processing times',
      'Transaction fees explained',
      'Troubleshooting failed transactions',
    ],
  },
  {
    id: 'security-guide',
    title: 'Security Guide',
    description: 'Protect your account and investments with our comprehensive security best practices.',
    icon: Shield,
    color: 'text-red-500',
    bgColor: 'bg-red-500/20',
    steps: [
      'Setting up two-factor authentication',
      'Creating strong passwords',
      'Recognizing phishing attempts',
      'Securing your email account',
      'What to do if compromised',
    ],
  },
  {
    id: 'faq-guide',
    title: 'Frequently Asked Questions',
    description: 'Find answers to the most common questions about BitWealth and crypto investing.',
    icon: HelpCircle,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/20',
    steps: [
      'Account-related questions',
      'Investment plan questions',
      'Deposit & withdrawal FAQs',
      'Security concerns',
      'Technical support',
    ],
  },
  {
    id: 'tax-guide',
    title: 'Tax Reporting Guide',
    description: 'Understand your tax obligations and how to report your crypto investment income.',
    icon: FileText,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/20',
    steps: [
      'Understanding crypto taxes',
      'Generating tax reports',
      'Tracking your transactions',
      'Working with tax professionals',
      'Country-specific guidelines',
    ],
  },
];

export default function GuidesPage() {
  const { state } = useStore();
  const plans = state.investmentPlans;

  return (
    <div className="min-h-screen bg-crypto-dark">
      <Header />
      
      <main className="pt-24 pb-12">
        {/* Hero Section */}
        <div className="relative py-12 md:py-20 border-b border-crypto-border">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-crypto-yellow/5 rounded-full blur-[100px] md:blur-[150px]" />
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-crypto-yellow/10 mb-4 md:mb-6">
              <BookOpen className="w-7 h-7 md:w-8 md:h-8 text-crypto-yellow" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-3 md:mb-4">
              BitWealth <span className="text-gradient">Guides</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg px-4">
              Comprehensive guides to help you navigate cryptocurrency investment and make the most of BitWealth.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Back Button */}
          <div className="mb-6 md:mb-8">
            <Link to="/">
              <Button variant="ghost" className="text-white hover:bg-crypto-card -ml-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Guides Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {guides.map((guide) => (
              <div
                key={guide.id}
                className="glass-card rounded-xl md:rounded-2xl p-5 md:p-6 hover:border-crypto-yellow/50 transition-all duration-300 group"
              >
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl ${guide.bgColor} flex items-center justify-center mb-4`}>
                  <guide.icon className={`w-6 h-6 md:w-7 md:h-7 ${guide.color}`} />
                </div>
                
                <h3 className="text-lg md:text-xl font-bold text-white mb-2 group-hover:text-crypto-yellow transition-colors">
                  {guide.title}
                </h3>
                
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                  {guide.description}
                </p>
                
                <ul className="space-y-2 mb-4 md:mb-6">
                  {guide.steps.slice(0, 3).map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-400">
                      <ChevronRight className="w-4 h-4 text-crypto-yellow flex-shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </li>
                  ))}
                  {guide.steps.length > 3 && (
                    <li className="text-sm text-crypto-yellow">
                      +{guide.steps.length - 3} more topics
                    </li>
                  )}
                </ul>
                
                <Link to={`/faq`}>
                  <Button 
                    variant="outline" 
                    className="w-full border-crypto-border text-white hover:bg-crypto-yellow hover:text-crypto-dark hover:border-crypto-yellow transition-colors"
                  >
                    Read Guide
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          {/* Quick Tips Section */}
          <div className="mt-12 md:mt-16">
            <h2 className="text-xl md:text-2xl font-display font-bold text-white mb-4 md:mb-6">Quick Tips</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-card rounded-xl p-4 md:p-5">
                <div className="text-crypto-yellow text-2xl md:text-3xl font-bold mb-2">01</div>
                <h4 className="text-white font-semibold mb-2">Start Small</h4>
                <p className="text-gray-400 text-sm">Begin with our {plans[0]?.name} at just ${plans[0]?.minAmount.toLocaleString()} to learn the ropes.</p>
              </div>
              <div className="glass-card rounded-xl p-4 md:p-5">
                <div className="text-crypto-yellow text-2xl md:text-3xl font-bold mb-2">02</div>
                <h4 className="text-white font-semibold mb-2">Diversify</h4>
                <p className="text-gray-400 text-sm">Spread your investments across multiple plans to minimize risk.</p>
              </div>
              <div className="glass-card rounded-xl p-4 md:p-5">
                <div className="text-crypto-yellow text-2xl md:text-3xl font-bold mb-2">03</div>
                <h4 className="text-white font-semibold mb-2">Reinvest</h4>
                <p className="text-gray-400 text-sm">Compound your returns by reinvesting your daily earnings.</p>
              </div>
              <div className="glass-card rounded-xl p-4 md:p-5">
                <div className="text-crypto-yellow text-2xl md:text-3xl font-bold mb-2">04</div>
                <h4 className="text-white font-semibold mb-2">Stay Secure</h4>
                <p className="text-gray-400 text-sm">Enable 2FA and use a strong, unique password for your account.</p>
              </div>
            </div>
          </div>

          {/* Current Plans Reference */}
          <div className="mt-12 md:mt-16 glass-card rounded-xl md:rounded-2xl p-5 md:p-8">
            <h2 className="text-xl md:text-2xl font-display font-bold text-white mb-4 md:mb-6">Current Investment Plans</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
              {plans.map((plan) => (
                <div key={plan.id} className={`p-3 md:p-4 rounded-lg border ${plan.featured ? 'border-crypto-yellow bg-crypto-yellow/10' : 'border-crypto-border bg-crypto-card/50'}`}>
                  <p className="text-white font-semibold text-sm md:text-base">{plan.name}</p>
                  <p className="text-crypto-yellow font-bold text-lg md:text-xl">{plan.dailyReturn}%</p>
                  <p className="text-gray-400 text-xs">${plan.minAmount.toLocaleString()} - ${plan.maxAmount.toLocaleString()}</p>
                  {plan.featured && (
                    <span className="inline-block mt-2 px-2 py-0.5 bg-crypto-yellow text-crypto-dark text-[10px] font-bold rounded">BEST VALUE</span>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 md:mt-6 text-center">
              <Link to="/investment-plans">
                <Button className="bg-crypto-yellow text-crypto-dark hover:bg-crypto-yellow-light">
                  View All Plans
                </Button>
              </Link>
            </div>
          </div>

          {/* Need Help CTA */}
          <div className="mt-12 md:mt-16 text-center">
            <div className="glass-card rounded-xl md:rounded-2xl p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-2">
                Still need help?
              </h3>
              <p className="text-gray-400 mb-4 md:mb-6">
                Our support team is available 24/7 to assist you with any questions.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/faq">
                  <Button variant="outline" className="border-crypto-border text-white hover:bg-crypto-card w-full sm:w-auto">
                    Browse FAQ
                  </Button>
                </Link>
                <a href="mailto:support@bitwealth.com">
                  <Button className="bg-crypto-yellow text-crypto-dark hover:bg-crypto-yellow-light w-full sm:w-auto">
                    Contact Support
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

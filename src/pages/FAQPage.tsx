import { Link } from 'react-router-dom';
import { useStore } from '@/store';
import Header from '@/sections/Header';
import Footer from '@/sections/Footer';
import { ArrowLeft, HelpCircle, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function FAQPage() {
  const { state } = useStore();
  const plans = state.investmentPlans;

  // Generate dynamic plan info for FAQ
  const getPlanInfo = () => {
    return plans.map(plan => ({
      name: plan.name,
      min: plan.minAmount,
      max: plan.maxAmount,
      daily: plan.dailyReturn,
      duration: plan.duration,
      total: plan.dailyReturn * plan.duration,
      featured: plan.featured,
    }));
  };

  const planInfo = getPlanInfo();
  const featuredPlan = planInfo.find(p => p.featured) || planInfo[2]; // Default to Gold if none featured

  const faqCategories = [
    {
      category: 'Getting Started',
      questions: [
        {
          q: 'What is BitWealth?',
          a: 'BitWealth is a cryptocurrency investment platform that allows users to invest in digital assets and earn daily returns. We offer various investment plans tailored to different risk appetites and financial goals.',
        },
        {
          q: 'How do I create an account?',
          a: 'Creating an account is simple. Click on "Get Started" on the homepage, fill in your details including name, email, and password, and verify your email address. Once verified, you can start using the platform.',
        },
        {
          q: 'Is KYC verification required?',
          a: 'Yes, KYC (Know Your Customer) verification is required for all users. This involves submitting a government-issued ID and proof of address. This helps us maintain a secure platform and comply with regulations.',
        },
        {
          q: 'How long does verification take?',
          a: 'KYC verification typically takes 24-48 hours during business days. You will receive an email notification once your verification is complete.',
        },
      ],
    },
    {
      category: 'Investment Plans',
      questions: [
        {
          q: 'What investment plans do you offer?',
          a: `We offer ${plans.length} investment plans: ${planInfo.map(p => `${p.name} (${p.daily}% daily, $${p.min.toLocaleString()}-$${p.max.toLocaleString()})`).join(', ')}.`,
        },
        {
          q: 'Which plan is the most popular?',
          a: `Our ${featuredPlan.name} is our most popular option, offering ${featuredPlan.daily}% daily returns for ${featuredPlan.duration} days with investments from $${featuredPlan.min.toLocaleString()} to $${featuredPlan.max.toLocaleString()}.`,
        },
        {
          q: 'How are daily returns calculated?',
          a: 'Daily returns are calculated based on your investment amount and the plan\'s daily return percentage. For example, if you invest $1,000 in a plan with 8% daily returns, you earn $80 per day.',
        },
        {
          q: 'When do I receive my returns?',
          a: 'Returns are credited to your account daily at 00:00 UTC. You can withdraw your earnings at any time once they reach the minimum withdrawal amount.',
        },
        {
          q: 'Can I withdraw my principal before the plan ends?',
          a: 'Yes, you can withdraw your principal early, but early withdrawal fees may apply depending on your plan. Please check the specific terms of your investment plan for details.',
        },
        {
          q: 'What happens when my investment plan ends?',
          a: 'When your plan ends, your principal is returned to your account balance along with any accumulated returns. You can then reinvest, withdraw, or choose a different plan.',
        },
        {
          q: 'What is the minimum investment amount?',
          a: `The minimum investment amount varies by plan, starting from $${Math.min(...planInfo.map(p => p.min)).toLocaleString()} for our ${planInfo.find(p => p.min === Math.min(...planInfo.map(p => p.min)))?.name}.`,
        },
        {
          q: 'What is the maximum return I can earn?',
          a: `Our highest-tier plan (${planInfo.find(p => p.daily === Math.max(...planInfo.map(p => p.daily)))?.name}) offers ${Math.max(...planInfo.map(p => p.daily))}% daily returns, totaling ${Math.max(...planInfo.map(p => p.total))}% over the plan duration.`,
        },
      ],
    },
    {
      category: 'Deposits & Withdrawals',
      questions: [
        {
          q: 'What payment methods do you accept?',
          a: 'We accept Bitcoin (BTC), Ethereum (ETH), USDT (TRC20), and bank transfers. Each method has different processing times and minimum/maximum limits.',
        },
        {
          q: 'How long do deposits take to process?',
          a: 'Cryptocurrency deposits typically take 10-30 minutes after network confirmation. Bank transfers may take 1-3 business days depending on your bank.',
        },
        {
          q: 'What is the minimum withdrawal amount?',
          a: 'The minimum withdrawal amount varies by method: Bitcoin ($50), Ethereum ($50), USDT ($25), and Bank Transfer ($100).',
        },
        {
          q: 'How long do withdrawals take?',
          a: 'Cryptocurrency withdrawals are processed within 2-24 hours. Bank transfers may take 1-3 business days. All withdrawals are subject to security review.',
        },
        {
          q: 'Are there any fees for deposits or withdrawals?',
          a: 'Deposits are free of charge. Withdrawal fees vary by method: Cryptocurrency withdrawals have a 1% fee, while bank transfers have a 2% fee.',
        },
      ],
    },
    {
      category: 'Security',
      questions: [
        {
          q: 'How secure is my account?',
          a: 'We use industry-standard security measures including SSL encryption, two-factor authentication (2FA), and cold storage for funds. We also conduct regular security audits.',
        },
        {
          q: 'What is two-factor authentication (2FA)?',
          a: '2FA adds an extra layer of security to your account by requiring a verification code from your phone in addition to your password when logging in. We strongly recommend enabling 2FA.',
        },
        {
          q: 'What should I do if I suspect unauthorized access?',
          a: 'If you suspect unauthorized access to your account, immediately change your password, enable 2FA if not already active, and contact our support team at support@bitwealth.com.',
        },
        {
          q: 'How do you protect my personal information?',
          a: 'We take data privacy seriously. Your information is encrypted and stored securely. We never share your personal data with third parties without your consent. Please see our Privacy Policy for more details.',
        },
      ],
    },
    {
      category: 'Account Management',
      questions: [
        {
          q: 'How do I update my profile information?',
          a: 'You can update your profile information by going to the Profile page from your dashboard. Click on "Edit" to modify your details.',
        },
        {
          q: 'Can I change my email address?',
          a: 'Yes, you can change your email address from the Profile page. A verification email will be sent to your new address to confirm the change.',
        },
        {
          q: 'What if I forget my password?',
          a: 'Click on "Forgot Password" on the login page. Enter your email address, and we will send you instructions to reset your password.',
        },
        {
          q: 'How do I close my account?',
          a: 'To close your account, please contact our support team. Note that you must withdraw all funds and close any active investments before your account can be closed.',
        },
      ],
    },
    {
      category: 'Support',
      questions: [
        {
          q: 'How can I contact customer support?',
          a: 'You can reach our support team via email at support@bitwealth.com or through the live chat feature on our website. Our support team is available 24/7.',
        },
        {
          q: 'What are your support hours?',
          a: 'Our customer support team is available 24 hours a day, 7 days a week, including holidays. We aim to respond to all inquiries within 24 hours.',
        },
        {
          q: 'Do you offer phone support?',
          a: 'Currently, we primarily offer support via email and live chat. For urgent matters, please use our live chat for the fastest response.',
        },
        {
          q: 'Where can I find more information?',
          a: 'Check our Help Center, Blog, and Guides section for detailed articles and tutorials. You can also follow us on social media for updates and tips.',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-crypto-dark">
      <Header />
      
      <main className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-8">
            <Link to="/">
              <Button variant="ghost" className="text-white hover:bg-crypto-card">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-crypto-yellow/10 mb-6">
              <HelpCircle className="w-8 h-8 text-crypto-yellow" />
            </div>
            <h1 className="text-4xl font-display font-bold text-white mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Find answers to commonly asked questions about BitWealth. Can't find what you're looking for? 
              Feel free to contact our support team.
            </p>
          </div>

          {/* FAQ Content */}
          <div className="space-y-8">
            {faqCategories.map((category, idx) => (
              <div key={idx} className="glass-card rounded-2xl p-6">
                <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-crypto-yellow" />
                  {category.category}
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((item, qIdx) => (
                    <AccordionItem 
                      key={qIdx} 
                      value={`${idx}-${qIdx}`}
                      className="border-b border-crypto-border last:border-0"
                    >
                      <AccordionTrigger className="text-white hover:text-crypto-yellow text-left py-4 text-sm md:text-base">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-400 pb-4 text-sm md:text-base leading-relaxed">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="mt-12 text-center">
            <div className="glass-card rounded-2xl p-8">
              <h3 className="text-xl font-display font-bold text-white mb-2">
                Still have questions?
              </h3>
              <p className="text-gray-400 mb-6">
                Can't find the answer you're looking for? Our support team is here to help.
              </p>
              <a href="mailto:support@bitwealth.com">
                <Button className="bg-crypto-yellow text-crypto-dark hover:bg-crypto-yellow-light">
                  Contact Support
                </Button>
              </a>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

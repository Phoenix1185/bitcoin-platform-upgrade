import { Link } from 'react-router-dom';
import Header from '@/sections/Header';
import Footer from '@/sections/Footer';
import { ArrowLeft, FileText, Scale, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TermsOfServicePage() {
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
              <FileText className="w-8 h-8 text-crypto-yellow" />
            </div>
            <h1 className="text-4xl font-display font-bold text-white mb-4">
              Terms of Service
            </h1>
            <p className="text-gray-400">
              Last updated: January 1, 2026
            </p>
          </div>

          {/* Content */}
          <div className="space-y-12">
            <section className="glass-card rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <Scale className="w-6 h-6 text-crypto-yellow" />
                <h2 className="text-2xl font-display font-bold text-white">Agreement to Terms</h2>
              </div>
              <p className="text-gray-400 leading-relaxed">
                By accessing or using the BitWealth platform, you agree to be bound by these Terms of Service. 
                If you disagree with any part of the terms, you may not access the platform. These Terms apply 
                to all visitors, users, and others who access or use the platform.
              </p>
            </section>

            <section className="glass-card rounded-2xl p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-4">Eligibility</h2>
              <div className="space-y-4 text-gray-400">
                <p className="leading-relaxed">
                  By using our platform, you represent and warrant that:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>You are at least 18 years of age</li>
                  <li>You have the legal capacity to enter into binding contracts</li>
                  <li>You are not prohibited from using the platform under applicable laws</li>
                  <li>You are not a resident of any jurisdiction where cryptocurrency investments are prohibited</li>
                  <li>You will use the platform only for lawful purposes</li>
                </ul>
              </div>
            </section>

            <section className="glass-card rounded-2xl p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-4">Account Registration</h2>
              <div className="space-y-4 text-gray-400">
                <p className="leading-relaxed">
                  To access certain features of the platform, you must register for an account. When you 
                  register, you agree to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and promptly update your account information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Accept all risks of unauthorized access to your account</li>
                  <li>Notify us immediately of any security breach or unauthorized use</li>
                </ul>
              </div>
            </section>

            <section className="glass-card rounded-2xl p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-4">Investment Services</h2>
              <div className="space-y-4 text-gray-400">
                <p className="leading-relaxed">
                  BitWealth provides cryptocurrency investment services. By using our investment services, you acknowledge:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>All investments carry risk, including possible loss of principal</li>
                  <li>Past performance does not guarantee future results</li>
                  <li>Returns are not guaranteed and may vary</li>
                  <li>You should only invest what you can afford to lose</li>
                  <li>We recommend consulting with a financial advisor before investing</li>
                </ul>
              </div>
            </section>

            <section className="glass-card rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <h2 className="text-2xl font-display font-bold text-white">Deposits</h2>
              </div>
              <div className="space-y-4 text-gray-400">
                <p className="leading-relaxed">
                  When making deposits to your BitWealth account:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>All deposits must be made from accounts or wallets in your name</li>
                  <li>Minimum deposit amounts apply based on the selected method</li>
                  <li>Deposits are subject to verification and may take time to process</li>
                  <li>We reserve the right to reject any deposit at our discretion</li>
                  <li>You are responsible for ensuring accurate transaction details</li>
                </ul>
              </div>
            </section>

            <section className="glass-card rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <XCircle className="w-6 h-6 text-red-500" />
                <h2 className="text-2xl font-display font-bold text-white">Withdrawals</h2>
              </div>
              <div className="space-y-4 text-gray-400">
                <p className="leading-relaxed">
                  When requesting withdrawals from your BitWealth account:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Withdrawals are processed to verified accounts only</li>
                  <li>Minimum and maximum withdrawal limits apply</li>
                  <li>Processing times vary by withdrawal method</li>
                  <li>Withdrawal fees may apply as specified on the platform</li>
                  <li>We may require additional verification for large withdrawals</li>
                  <li>Withdrawal requests may be subject to review and approval</li>
                </ul>
              </div>
            </section>

            <section className="glass-card rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-crypto-yellow" />
                <h2 className="text-2xl font-display font-bold text-white">Prohibited Activities</h2>
              </div>
              <div className="space-y-4 text-gray-400">
                <p className="leading-relaxed">
                  You agree not to engage in any of the following prohibited activities:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Using the platform for any illegal purpose</li>
                  <li>Attempting to gain unauthorized access to any part of the platform</li>
                  <li>Interfering with or disrupting the platform or servers</li>
                  <li>Using automated systems or software to extract data</li>
                  <li>Creating multiple accounts to abuse promotions</li>
                  <li>Engaging in money laundering or terrorist financing</li>
                  <li>Providing false or misleading information</li>
                </ul>
              </div>
            </section>

            <section className="glass-card rounded-2xl p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-4">Intellectual Property</h2>
              <p className="text-gray-400 leading-relaxed">
                The platform and its original content, features, and functionality are owned by BitWealth 
                and are protected by international copyright, trademark, patent, trade secret, and other 
                intellectual property laws. You may not reproduce, distribute, modify, create derivative 
                works of, publicly display, publicly perform, republish, download, store, or transmit any 
                of the material on our platform without our prior written consent.
              </p>
            </section>

            <section className="glass-card rounded-2xl p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-4">Limitation of Liability</h2>
              <p className="text-gray-400 leading-relaxed">
                In no event shall BitWealth, its directors, employees, partners, agents, suppliers, or 
                affiliates be liable for any indirect, incidental, special, consequential, or punitive 
                damages, including without limitation, loss of profits, data, use, goodwill, or other 
                intangible losses, resulting from your access to or use of or inability to access or 
                use the platform.
              </p>
            </section>

            <section className="glass-card rounded-2xl p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-4">Termination</h2>
              <p className="text-gray-400 leading-relaxed">
                We may terminate or suspend your account immediately, without prior notice or liability, 
                for any reason whatsoever, including without limitation if you breach the Terms. Upon 
                termination, your right to use the platform will immediately cease. If you wish to 
                terminate your account, you may simply discontinue using the platform or contact us 
                to request account closure.
              </p>
            </section>

            <section className="glass-card rounded-2xl p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-4">Changes to Terms</h2>
              <p className="text-gray-400 leading-relaxed">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
                If a revision is material, we will try to provide at least 30 days' notice prior to any 
                new terms taking effect. What constitutes a material change will be determined at our 
                sole discretion. By continuing to access or use our platform after those revisions become 
                effective, you agree to be bound by the revised terms.
              </p>
            </section>

            <section className="glass-card rounded-2xl p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-4">Contact Information</h2>
              <p className="text-gray-400 leading-relaxed">
                If you have any questions about these Terms, please contact us at:
              </p>
              <div className="mt-4 space-y-2 text-gray-400">
                <p>Email: legal@bitwealth.com</p>
                <p>Address: 123 Crypto Street, New York, NY 10001</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

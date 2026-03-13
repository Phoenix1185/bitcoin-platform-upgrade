import { Link } from 'react-router-dom';
import Header from '@/sections/Header';
import Footer from '@/sections/Footer';
import { ArrowLeft, Shield, Lock, Eye, Database, Share2, Cookie } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PrivacyPolicyPage() {
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
              <Shield className="w-8 h-8 text-crypto-yellow" />
            </div>
            <h1 className="text-4xl font-display font-bold text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-gray-400">
              Last updated: January 1, 2026
            </p>
          </div>

          {/* Content */}
          <div className="space-y-12">
            <section className="glass-card rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-6 h-6 text-crypto-yellow" />
                <h2 className="text-2xl font-display font-bold text-white">Introduction</h2>
              </div>
              <p className="text-gray-400 leading-relaxed">
                At BitWealth, we take your privacy seriously. This Privacy Policy explains how we collect, 
                use, disclose, and safeguard your information when you use our cryptocurrency investment 
                platform. Please read this privacy policy carefully. If you do not agree with the terms 
                of this privacy policy, please do not access the platform.
              </p>
            </section>

            <section className="glass-card rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-6 h-6 text-crypto-yellow" />
                <h2 className="text-2xl font-display font-bold text-white">Information We Collect</h2>
              </div>
              <div className="space-y-4 text-gray-400">
                <p className="leading-relaxed">
                  We collect information that you provide directly to us when you:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Register for an account</li>
                  <li>Complete your profile or KYC verification</li>
                  <li>Make deposits or withdrawals</li>
                  <li>Contact our support team</li>
                  <li>Subscribe to our newsletters</li>
                  <li>Participate in promotions or surveys</li>
                </ul>
                <p className="leading-relaxed mt-4">
                  This information may include your name, email address, phone number, government-issued ID, 
                  proof of address, wallet addresses, transaction history, and investment preferences.
                </p>
              </div>
            </section>

            <section className="glass-card rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-6 h-6 text-crypto-yellow" />
                <h2 className="text-2xl font-display font-bold text-white">How We Use Your Information</h2>
              </div>
              <div className="space-y-4 text-gray-400">
                <p className="leading-relaxed">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process your transactions and send you related information</li>
                  <li>Verify your identity and prevent fraud</li>
                  <li>Send you technical notices, updates, and support messages</li>
                  <li>Respond to your comments and questions</li>
                  <li>Communicate with you about products, services, and promotions</li>
                  <li>Monitor and analyze trends, usage, and activities</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>
            </section>

            <section className="glass-card rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <Share2 className="w-6 h-6 text-crypto-yellow" />
                <h2 className="text-2xl font-display font-bold text-white">Information Sharing</h2>
              </div>
              <div className="space-y-4 text-gray-400">
                <p className="leading-relaxed">
                  We do not sell, trade, or rent your personal information to third parties. We may share 
                  your information only in the following circumstances:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>With your consent</li>
                  <li>With service providers who perform services on our behalf</li>
                  <li>To comply with legal obligations</li>
                  <li>To protect our rights, privacy, safety, or property</li>
                  <li>In connection with a merger, acquisition, or sale of assets</li>
                </ul>
              </div>
            </section>

            <section className="glass-card rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <Cookie className="w-6 h-6 text-crypto-yellow" />
                <h2 className="text-2xl font-display font-bold text-white">Cookies and Tracking</h2>
              </div>
              <p className="text-gray-400 leading-relaxed">
                We use cookies and similar tracking technologies to track activity on our platform and 
                hold certain information. Cookies are files with a small amount of data which may include 
                an anonymous unique identifier. You can instruct your browser to refuse all cookies or 
                to indicate when a cookie is being sent. However, if you do not accept cookies, you may 
                not be able to use some portions of our service.
              </p>
            </section>

            <section className="glass-card rounded-2xl p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-4">Data Security</h2>
              <p className="text-gray-400 leading-relaxed">
                The security of your data is important to us. We implement appropriate technical and 
                organizational measures to protect your personal information against unauthorized access, 
                alteration, disclosure, or destruction. However, no method of transmission over the Internet 
                or method of electronic storage is 100% secure. While we strive to use commercially acceptable 
                means to protect your personal information, we cannot guarantee its absolute security.
              </p>
            </section>

            <section className="glass-card rounded-2xl p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-4">Your Rights</h2>
              <div className="space-y-4 text-gray-400">
                <p className="leading-relaxed">
                  Depending on your location, you may have the following rights regarding your personal data:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>The right to access your personal data</li>
                  <li>The right to rectify inaccurate personal data</li>
                  <li>The right to erase your personal data</li>
                  <li>The right to restrict processing of your personal data</li>
                  <li>The right to data portability</li>
                  <li>The right to object to processing of your personal data</li>
                </ul>
              </div>
            </section>

            <section className="glass-card rounded-2xl p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-4">Contact Us</h2>
              <p className="text-gray-400 leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <div className="mt-4 space-y-2 text-gray-400">
                <p>Email: privacy@bitwealth.com</p>
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

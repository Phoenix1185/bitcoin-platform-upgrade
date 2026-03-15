import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Bitcoin, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const redirectUrl = import.meta.env.VITE_RESET_PASSWORD_URL || `${window.location.origin}/reset-password`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        toast.error(error.message);
        setIsLoading(false);
        return;
      }

      setIsSent(true);
      toast.success('Password reset link sent! Check your email.');
    } catch (error: any) {
      console.error('Reset password error:', error);
      toast.error(error?.message || 'Failed to send reset link. Please try again.');
    }

    setIsLoading(false);
  };

  if (isSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-crypto-dark relative overflow-hidden py-8">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-72 md:w-96 h-72 md:h-96 bg-crypto-yellow/10 rounded-full blur-[100px] md:blur-[150px]" />
          <div className="absolute bottom-1/4 right-1/4 w-60 md:w-80 h-60 md:h-80 bg-crypto-yellow/5 rounded-full blur-[80px] md:blur-[120px]" />
        </div>

        <div className="relative z-10 w-full max-w-md px-4">
          {/* Logo */}
          <div className="text-center mb-6 md:mb-8">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-crypto-yellow to-crypto-yellow-dark flex items-center justify-center">
                <Bitcoin className="w-6 h-6 md:w-7 md:h-7 text-crypto-dark" />
              </div>
              <span className="text-xl md:text-2xl font-display font-bold text-white">
                BitWealth
              </span>
            </Link>
          </div>

          {/* Success Card */}
          <div className="glass-card rounded-xl md:rounded-2xl p-6 md:p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            
            <h1 className="text-xl md:text-2xl font-display font-bold text-white mb-2">
              Check Your Email
            </h1>
            
            <p className="text-gray-400 mb-6">
              We've sent a password reset link to <span className="text-white">{email}</span>. 
              Click the link in the email to reset your password.
            </p>

            <div className="space-y-3">
              <p className="text-sm text-gray-500">
                Didn't receive the email? Check your spam folder or
              </p>
              <Button
                onClick={() => {
                  setIsSent(false);
                  setEmail('');
                }}
                variant="outline"
                className="border-crypto-border text-white hover:bg-crypto-card"
              >
                Try Again
              </Button>
            </div>

            <div className="mt-6 pt-6 border-t border-crypto-border">
              <Link 
                to="/login" 
                className="inline-flex items-center text-crypto-yellow hover:underline"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-crypto-dark relative overflow-hidden py-8">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 md:w-96 h-72 md:h-96 bg-crypto-yellow/10 rounded-full blur-[100px] md:blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-60 md:w-80 h-60 md:h-80 bg-crypto-yellow/5 rounded-full blur-[80px] md:blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
        <div className="text-center mb-6 md:mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-crypto-yellow to-crypto-yellow-dark flex items-center justify-center">
              <Bitcoin className="w-6 h-6 md:w-7 md:h-7 text-crypto-dark" />
            </div>
            <span className="text-xl md:text-2xl font-display font-bold text-white">
              BitWealth
            </span>
          </Link>
        </div>

        {/* Forgot Password Card */}
        <div className="glass-card rounded-xl md:rounded-2xl p-6 md:p-8">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-xl md:text-2xl font-display font-bold text-white mb-2">
              Forgot Password?
            </h1>
            <p className="text-sm md:text-base text-gray-400">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            {/* Email */}
            <div className="space-y-1.5 md:space-y-2">
              <Label htmlFor="email" className="text-white text-sm md:text-base">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-crypto-dark border-crypto-border text-white placeholder:text-gray-500 focus:border-crypto-yellow h-11 md:h-12"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-crypto-yellow text-crypto-dark hover:bg-crypto-yellow-light font-semibold py-5 md:py-6 h-auto"
            >
              {isLoading ? (
                <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-crypto-dark border-t-transparent rounded-full animate-spin" />
              ) : (
                'Send Reset Link'
              )}
            </Button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link 
              to="/login" 
              className="inline-flex items-center text-crypto-yellow hover:underline text-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

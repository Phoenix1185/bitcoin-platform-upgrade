import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Bitcoin, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidSession, setIsValidSession] = useState(true);

  // Check if user has a valid recovery session
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      // If no session, the user came directly without a valid reset link
      if (!session) {
        // Check URL for recovery token
        const hash = window.location.hash;
        if (!hash.includes('type=recovery')) {
          setIsValidSession(false);
        }
      }
    };
    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords
    if (!password) {
      toast.error('Please enter a new password');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        toast.error(error.message);
        setIsLoading(false);
        return;
      }

      setIsSuccess(true);
      toast.success('Password reset successful!');
    } catch (error: any) {
      console.error('Reset password error:', error);
      toast.error(error?.message || 'Failed to reset password. Please try again.');
    }

    setIsLoading(false);
  };

  if (!isValidSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-crypto-dark relative overflow-hidden py-8">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-72 md:w-96 h-72 md:h-96 bg-red-500/10 rounded-full blur-[100px] md:blur-[150px]" />
        </div>

        <div className="relative z-10 w-full max-w-md px-4 text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-crypto-yellow to-crypto-yellow-dark flex items-center justify-center">
              <Bitcoin className="w-6 h-6 md:w-7 md:h-7 text-crypto-dark" />
            </div>
            <span className="text-xl md:text-2xl font-display font-bold text-white">
              BitWealth
            </span>
          </Link>

          <div className="glass-card rounded-xl md:rounded-2xl p-6 md:p-8">
            <h1 className="text-xl md:text-2xl font-display font-bold text-white mb-4">
              Invalid or Expired Link
            </h1>
            <p className="text-gray-400 mb-6">
              This password reset link is invalid or has expired. 
              Please request a new password reset link.
            </p>
            <Button
              onClick={() => navigate('/forgot-password')}
              className="bg-crypto-yellow text-crypto-dark hover:bg-crypto-yellow-light"
            >
              Request New Link
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-crypto-dark relative overflow-hidden py-8">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-72 md:w-96 h-72 md:h-96 bg-green-500/10 rounded-full blur-[100px] md:blur-[150px]" />
        </div>

        <div className="relative z-10 w-full max-w-md px-4">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-crypto-yellow to-crypto-yellow-dark flex items-center justify-center">
              <Bitcoin className="w-6 h-6 md:w-7 md:h-7 text-crypto-dark" />
            </div>
            <span className="text-xl md:text-2xl font-display font-bold text-white">
              BitWealth
            </span>
          </Link>

          <div className="glass-card rounded-xl md:rounded-2xl p-6 md:p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            
            <h1 className="text-xl md:text-2xl font-display font-bold text-white mb-2">
              Password Reset Successful!
            </h1>
            
            <p className="text-gray-400 mb-6">
              Your password has been reset successfully. 
              You can now log in with your new password.
            </p>

            <Button
              onClick={() => navigate('/login')}
              className="w-full bg-crypto-yellow text-crypto-dark hover:bg-crypto-yellow-light"
            >
              Go to Login
            </Button>
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

        {/* Reset Password Card */}
        <div className="glass-card rounded-xl md:rounded-2xl p-6 md:p-8">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-xl md:text-2xl font-display font-bold text-white mb-2">
              Reset Your Password
            </h1>
            <p className="text-sm md:text-base text-gray-400">
              Create a new password for your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            {/* New Password */}
            <div className="space-y-1.5 md:space-y-2">
              <Label htmlFor="password" className="text-white text-sm md:text-base">
                New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new password (min 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-crypto-dark border-crypto-border text-white placeholder:text-gray-500 focus:border-crypto-yellow h-11 md:h-12"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4 md:w-5 md:h-5" /> : <Eye className="w-4 h-4 md:w-5 md:h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5 md:space-y-2">
              <Label htmlFor="confirmPassword" className="text-white text-sm md:text-base">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10 bg-crypto-dark border-crypto-border text-white placeholder:text-gray-500 focus:border-crypto-yellow h-11 md:h-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4 md:w-5 md:h-5" /> : <Eye className="w-4 h-4 md:w-5 md:h-5" />}
                </button>
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
                'Reset Password'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

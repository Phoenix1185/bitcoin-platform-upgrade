import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, Bitcoin, Lock, Mail, User, Phone } from 'lucide-react';
import { toast } from 'sonner';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!formData.agreeTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    setIsLoading(true);

    try {
      // Check if this is the admin email
      const isAdmin = formData.email.toLowerCase() === 'fredokcee1@gmail.com';

      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            phone_number: formData.phone,
            is_admin: isAdmin,
          },
        },
      });

      if (error) {
        toast.error(error.message);
        setIsLoading(false);
        return;
      }

      if (data.user) {
        toast.success('Account created successfully! Please check your email to verify your account.');
        navigate('/login');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('An error occurred during registration');
    }
    
    setIsLoading(false);
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      
      if (error) {
        toast.error(error.message);
      }
    } catch (error) {
      console.error('Google signup error:', error);
      toast.error('An error occurred during Google signup');
    }
    setIsLoading(false);
  };

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
              {state.siteSettings?.siteName || 'BitWealth'}
            </span>
          </Link>
        </div>

        {/* Register Card */}
        <div className="glass-card rounded-xl md:rounded-2xl p-6 md:p-8">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-xl md:text-2xl font-display font-bold text-white mb-2">
              Create Account
            </h1>
            <p className="text-sm md:text-base text-gray-400">
              Start your crypto investment journey today
            </p>
          </div>

          {/* Google Signup */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignup}
            className="w-full border-crypto-border text-white hover:bg-crypto-card mb-4 md:mb-6 py-5 md:py-6"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          {/* Divider */}
          <div className="relative mb-4 md:mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-crypto-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-crypto-card text-gray-500">Or sign up with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
            {/* Full Name */}
            <div className="space-y-1.5 md:space-y-2">
              <Label htmlFor="name" className="text-white text-sm md:text-base">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="pl-10 bg-crypto-dark border-crypto-border text-white placeholder:text-gray-500 focus:border-crypto-yellow h-11 md:h-12"
                  required
                />
              </div>
            </div>

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
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10 bg-crypto-dark border-crypto-border text-white placeholder:text-gray-500 focus:border-crypto-yellow h-11 md:h-12"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1.5 md:space-y-2">
              <Label htmlFor="phone" className="text-white text-sm md:text-base">
                Phone Number <span className="text-gray-500">(Optional)</span>
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="pl-10 bg-crypto-dark border-crypto-border text-white placeholder:text-gray-500 focus:border-crypto-yellow h-11 md:h-12"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5 md:space-y-2">
              <Label htmlFor="password" className="text-white text-sm md:text-base">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 pr-10 bg-crypto-dark border-crypto-border text-white placeholder:text-gray-500 focus:border-crypto-yellow h-11 md:h-12"
                  required
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
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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

            {/* Terms */}
            <div className="flex items-start gap-2">
              <Checkbox
                id="terms"
                checked={formData.agreeTerms}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, agreeTerms: checked as boolean })
                }
                className="mt-1 border-crypto-border data-[state=checked]:bg-crypto-yellow data-[state=checked]:border-crypto-yellow"
              />
              <Label htmlFor="terms" className="text-xs md:text-sm text-gray-400 cursor-pointer leading-relaxed">
                I agree to the{' '}
                <Link to="/terms-of-service" className="text-crypto-yellow hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy-policy" className="text-crypto-yellow hover:underline">
                  Privacy Policy
                </Link>
              </Label>
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
                'Create Account'
              )}
            </Button>
          </form>

          {/* Login Link */}
          <p className="text-center mt-4 md:mt-6 text-gray-400 text-sm md:text-base">
            Already have an account?{' '}
            <Link to="/login" className="text-crypto-yellow hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

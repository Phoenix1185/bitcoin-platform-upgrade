import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

export default function EmailSubscribe() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      // Check if email already exists
      const { data: existing } = await supabase
        .from('email_subscribers')
        .select('id')
        .eq('email', email.toLowerCase())
        .single();

      if (existing) {
        toast.info('You are already subscribed!');
        setIsSubscribed(true);
        setIsLoading(false);
        return;
      }

      // Add subscriber
      const { error } = await supabase
        .from('email_subscribers')
        .insert({
          email: email.toLowerCase(),
          subscribed: true,
        });

      if (error) {
        console.error('Subscribe error:', error);
        toast.error('Failed to subscribe. Please try again.');
        setIsLoading(false);
        return;
      }

      toast.success('Successfully subscribed! You will receive updates on new blog posts.');
      setIsSubscribed(true);
      setEmail('');
    } catch (error) {
      console.error('Subscribe error:', error);
      toast.error('An error occurred. Please try again.');
    }

    setIsLoading(false);
  };

  if (isSubscribed) {
    return (
      <div className="flex items-center gap-2 text-green-400">
        <Check className="w-5 h-5" />
        <span>Thanks for subscribing!</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="pl-10 bg-crypto-dark border-crypto-border text-white placeholder:text-gray-500 focus:border-crypto-yellow"
          disabled={isLoading}
        />
      </div>
      <Button
        type="submit"
        disabled={isLoading}
        className="bg-crypto-yellow text-crypto-dark hover:bg-crypto-yellow-light"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          'Subscribe'
        )}
      </Button>
    </form>
  );
}

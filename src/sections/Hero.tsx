import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, Shield, Zap, Bitcoin, Wallet, Globe } from 'lucide-react';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden bg-crypto-dark pt-20"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 md:w-96 h-72 md:h-96 bg-crypto-yellow/10 rounded-full blur-[100px] md:blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-60 md:w-80 h-60 md:h-80 bg-crypto-yellow/5 rounded-full blur-[80px] md:blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(240, 185, 11, 0.5) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(240, 185, 11, 0.5) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-crypto-yellow/10 border border-crypto-yellow/30 animate-fade-in mb-6">
            <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-crypto-yellow" />
            <span className="text-xs md:text-sm text-crypto-yellow font-medium">
              Trusted by 25,000+ Investors Worldwide
            </span>
          </div>

          {/* Headline */}
          <div className="space-y-2 md:space-y-4 mb-6">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold text-white leading-tight">
              <span className="block animate-slide-up" style={{ animationDelay: '0.1s' }}>
                Invest in
              </span>
              <span 
                className="block text-gradient animate-slide-up"
                style={{ animationDelay: '0.2s' }}
              >
                Cryptocurrency
              </span>
              <span className="block animate-slide-up text-3xl sm:text-4xl lg:text-5xl text-gray-300" style={{ animationDelay: '0.3s' }}>
                the Smart Way
              </span>
            </h1>
          </div>

          {/* Subheadline */}
          <p 
            className="text-base md:text-xl text-gray-400 max-w-2xl mx-auto animate-fade-in mb-8"
            style={{ animationDelay: '0.5s' }}
          >
            Join thousands of investors who trust BitWealth to grow their digital 
            assets securely. Earn daily returns of up to 20% on your investments.
          </p>

          {/* CTA Buttons */}
          <div 
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-slide-up mb-12"
            style={{ animationDelay: '0.6s' }}
          >
            <Button
              size="lg"
              onClick={() => navigate('/register')}
              className="bg-crypto-yellow text-crypto-dark hover:bg-crypto-yellow-light font-semibold px-8 md:px-10 py-6 md:py-7 text-base md:text-lg group"
            >
              Start Investing Now
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/investment-plans')}
              className="border-crypto-border text-white hover:bg-crypto-card hover:border-crypto-yellow/50 px-8 md:px-10 py-6 md:py-7 text-base md:text-lg"
            >
              View Investment Plans
            </Button>
          </div>

          {/* Stats Row */}
          <div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 animate-fade-in"
            style={{ animationDelay: '0.8s' }}
          >
            <div className="glass-card rounded-xl p-4 md:p-6">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-crypto-yellow/10 flex items-center justify-center mx-auto mb-3">
                <Shield className="w-5 h-5 md:w-6 md:h-6 text-crypto-yellow" />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-white">99.9%</p>
              <p className="text-xs md:text-sm text-gray-400">Uptime</p>
            </div>
            <div className="glass-card rounded-xl p-4 md:p-6">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-crypto-yellow/10 flex items-center justify-center mx-auto mb-3">
                <Zap className="w-5 h-5 md:w-6 md:h-6 text-crypto-yellow" />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-white">$50M+</p>
              <p className="text-xs md:text-sm text-gray-400">Invested</p>
            </div>
            <div className="glass-card rounded-xl p-4 md:p-6">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-crypto-yellow/10 flex items-center justify-center mx-auto mb-3">
                <Bitcoin className="w-5 h-5 md:w-6 md:h-6 text-crypto-yellow" />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-white">20%</p>
              <p className="text-xs md:text-sm text-gray-400">Max Daily</p>
            </div>
            <div className="glass-card rounded-xl p-4 md:p-6">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-crypto-yellow/10 flex items-center justify-center mx-auto mb-3">
                <Globe className="w-5 h-5 md:w-6 md:h-6 text-crypto-yellow" />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-white">25K+</p>
              <p className="text-xs md:text-sm text-gray-400">Investors</p>
            </div>
          </div>

          {/* Trust Badges */}
          <div 
            className="flex flex-wrap justify-center items-center gap-4 md:gap-8 mt-10 pt-8 border-t border-crypto-border/50 animate-fade-in"
            style={{ animationDelay: '1s' }}
          >
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Shield className="w-4 h-4 text-green-500" />
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Wallet className="w-4 h-4 text-crypto-yellow" />
              <span>Instant Withdrawals</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span>Daily Payouts</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, Shield, Zap, Users, Award } from 'lucide-react';

const stats = [
  { value: '$50M+', label: 'Total Invested', icon: TrendingUp },
  { value: '25K+', label: 'Active Investors', icon: Users },
  { value: '99.9%', label: 'Uptime', icon: Shield },
  { value: '20%', label: 'Max Daily Return', icon: Zap },
];

const features = [
  { icon: Shield, text: 'Bank-Grade Security' },
  { icon: Zap, text: 'Instant Withdrawals' },
  { icon: Award, text: 'Licensed & Regulated' },
];

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-crypto-dark">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-crypto-yellow/5 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-crypto-yellow/3 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(240, 185, 11, 0.5) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(240, 185, 11, 0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {/* Main Content */}
        <div className="text-center max-w-4xl mx-auto">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-crypto-yellow/10 border border-crypto-yellow/30 mb-8">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-crypto-yellow font-medium">
              Trusted by 25,000+ investors worldwide
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-white leading-tight mb-6">
            Grow Your Wealth with{' '}
            <span className="text-gradient">Crypto Investing</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Join thousands of investors earning daily returns of up to 20%. 
            Secure, transparent, and profitable cryptocurrency investment platform.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              onClick={() => navigate('/register')}
              className="bg-crypto-yellow text-crypto-dark hover:bg-crypto-yellow-light font-semibold px-10 py-7 text-lg group"
            >
              Start Investing Now
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/investment-plans')}
              className="border-crypto-border text-white hover:bg-crypto-card hover:border-crypto-yellow/50 px-10 py-7 text-lg"
            >
              View Plans
            </Button>
          </div>

          {/* Trust Features */}
          <div className="flex flex-wrap justify-center gap-6 mb-16">
            {features.map((feature) => (
              <div key={feature.text} className="flex items-center gap-2 text-gray-400">
                <feature.icon className="w-4 h-4 text-crypto-yellow" />
                <span className="text-sm">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat) => (
            <div 
              key={stat.label}
              className="glass-card rounded-2xl p-6 text-center hover:border-crypto-yellow/30 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-crypto-yellow/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-crypto-yellow/20 transition-colors">
                <stat.icon className="w-6 h-6 text-crypto-yellow" />
              </div>
              <p className="text-3xl lg:text-4xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-sm text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Live Ticker */}
        <div className="mt-12 flex items-center justify-center gap-2 text-sm text-gray-500">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span>Live trading data • Updated every 5 minutes</span>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-crypto-dark to-transparent pointer-events-none" />
    </section>
  );
}

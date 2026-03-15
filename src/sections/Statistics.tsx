import { useEffect, useRef, useState } from 'react';
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react';
import { useStore } from '@/store';

function AnimatedCounter({ 
  value, 
  suffix, 
  isVisible 
}: { 
  value: number; 
  suffix: string; 
  isVisible: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value, isVisible]);

  return (
    <span>
      {value % 1 === 0 ? Math.floor(count) : count.toFixed(1)}
      {suffix}
    </span>
  );
}

export default function Statistics() {
  const { state } = useStore();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const stats = [
    {
      icon: DollarSign,
      value: state.siteSettings?.stats?.totalInvested || 50,
      suffix: state.siteSettings?.stats?.totalInvestedSuffix || 'M+',
      label: 'Total Invested',
    },
    {
      icon: Users,
      value: state.siteSettings?.stats?.activeInvestors || 25,
      suffix: state.siteSettings?.stats?.activeInvestorsSuffix || 'K+',
      label: 'Active Investors',
    },
    {
      icon: TrendingUp,
      value: state.siteSettings?.stats?.totalReturns || 12,
      suffix: state.siteSettings?.stats?.totalReturnsSuffix || 'M+',
      label: 'Total Returns',
    },
    {
      icon: Activity,
      value: state.siteSettings?.stats?.uptime || 99.9,
      suffix: state.siteSettings?.stats?.uptimeSuffix || '%',
      label: 'Uptime',
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 bg-crypto-dark overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-crypto-yellow/5 via-transparent to-crypto-yellow/5" />

      {/* Border lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-crypto-yellow/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-crypto-yellow/30 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`text-center transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-crypto-yellow/10 mb-6">
                <stat.icon className="w-8 h-8 text-crypto-yellow" />
              </div>
              <div className="text-4xl sm:text-5xl font-display font-bold text-white mb-2">
                <AnimatedCounter 
                  value={stat.value} 
                  suffix={stat.suffix} 
                  isVisible={isVisible} 
                />
              </div>
              <p className="text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Link, useLocation } from 'react-router-dom';
import { useStore } from '@/store';
import { 
  LayoutDashboard, 
  TrendingUp, 
  ArrowDownRight, 
  ArrowUpRight, 
  History, 
  User 
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Invest', href: '/investment-plans', icon: TrendingUp },
  { label: 'Deposit', href: '/deposit', icon: ArrowDownRight },
  { label: 'Withdraw', href: '/withdraw', icon: ArrowUpRight },
  { label: 'History', href: '/history', icon: History },
  { label: 'Profile', href: '/profile', icon: User },
];

export default function BottomNav() {
  const { state } = useStore();
  const location = useLocation();

  // Only show when logged in
  if (!state.isAuthenticated) return null;

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#1a1d24] border-t border-crypto-border/50 lg:hidden">
      <div className="flex items-center justify-around py-2 px-2">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.href}
            className={`flex flex-col items-center gap-1 px-2 py-1 rounded-lg transition-colors min-w-[60px] ${
              isActive(item.href)
                ? 'text-crypto-yellow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <item.icon className={`w-5 h-5 ${isActive(item.href) ? 'text-crypto-yellow' : ''}`} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
      {/* Safe area for mobile devices */}
      <div className="h-safe-area-inset-bottom bg-[#1a1d24]" />
    </nav>
  );
}

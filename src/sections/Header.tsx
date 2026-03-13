import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '@/store';
import { Button } from '@/components/ui/button';
import NotificationsDropdown from '@/components/NotificationsDropdown';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, X, User, Wallet, LogOut, ChevronDown, LayoutDashboard, Shield } from 'lucide-react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { state, dispatch } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/');
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/#about' },
    { label: 'Investment Plans', href: '/investment-plans' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Support', href: '/support' },
  ];

  const isActive = (href: string) => {
    if (href.startsWith('/#')) {
      return location.pathname === '/' && location.hash === href.slice(1);
    }
    return location.pathname === href;
  };

  return (
    <>
      {/* Dark overlay for dropdown */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md transition-all duration-300"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
      
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'py-3 glass border-b border-crypto-yellow/20'
            : 'py-5 bg-transparent'
        }`}
      >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-crypto-yellow to-crypto-yellow-dark flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
              <span className="text-crypto-dark font-bold text-xl">₿</span>
            </div>
            <span className="text-xl font-display font-bold text-white group-hover:text-crypto-yellow transition-colors">
              BitWealth
            </span>
          </Link>

          {/* Desktop Navigation - Hidden when logged in (Binance style) */}
          {!state.isAuthenticated && (
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`relative text-sm font-medium transition-colors duration-300 ${
                    isActive(link.href)
                      ? 'text-crypto-yellow'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-crypto-yellow transition-all duration-300 ${
                      isActive(link.href) ? 'w-full' : 'w-0 hover:w-full'
                    }`}
                  />
                </Link>
              ))}
            </nav>
          )}

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            {state.isAuthenticated ? (
              <>
                {/* Notifications Dropdown - Exchange Style */}
                <NotificationsDropdown />
                
                {/* Simple User Menu - Binance Style */}
                <DropdownMenu onOpenChange={setIsDropdownOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 text-white hover:text-crypto-yellow hover:bg-crypto-card"
                    >
                      <div className="w-8 h-8 rounded-full bg-crypto-yellow/20 flex items-center justify-center">
                        <User className="w-4 h-4 text-crypto-yellow" />
                      </div>
                      <span className="max-w-[100px] truncate hidden sm:block">{state.user?.name}</span>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-[#1a1d24] border border-crypto-border shadow-2xl z-[100]" style={{ backgroundColor: '#1a1d24' }}>
                    <div className="px-4 py-3 border-b border-crypto-border bg-crypto-dark/50">
                      <p className="text-sm font-semibold text-white">{state.user?.name}</p>
                      <p className="text-xs text-gray-400">{state.user?.email}</p>
                      <p className="text-xs text-crypto-yellow mt-1 font-medium">
                        Balance: ${state.user?.balance.toLocaleString()}
                      </p>
                    </div>
                    <div className="py-1">
                      <DropdownMenuItem
                        onClick={() => navigate('/dashboard')}
                        className="mx-2 text-gray-300 focus:text-white focus:bg-crypto-border cursor-pointer rounded-md"
                      >
                        <LayoutDashboard className="w-4 h-4 mr-3 text-crypto-yellow" />
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate('/profile')}
                        className="mx-2 text-gray-300 focus:text-white focus:bg-crypto-border cursor-pointer rounded-md"
                      >
                        <User className="w-4 h-4 mr-3 text-crypto-yellow" />
                        Profile & Settings
                      </DropdownMenuItem>
                    </div>
                    {state.user?.isAdmin && (
                      <>
                        <DropdownMenuSeparator className="bg-crypto-border mx-2" />
                        <DropdownMenuItem
                          onClick={() => navigate('/admin')}
                          className="mx-2 text-crypto-yellow focus:text-crypto-yellow focus:bg-crypto-border cursor-pointer rounded-md"
                        >
                          <Shield className="w-4 h-4 mr-3" />
                          Admin Panel
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator className="bg-crypto-border mx-2" />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="mx-2 text-red-400 focus:text-red-400 focus:bg-crypto-border cursor-pointer rounded-md"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/login')}
                  className="text-white hover:text-crypto-yellow hover:bg-transparent"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => navigate('/register')}
                  className="bg-crypto-yellow text-crypto-dark hover:bg-crypto-yellow-light font-semibold"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-crypto-border animate-slide-down">
            <nav className="flex flex-col gap-2 mt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    isActive(link.href)
                      ? 'bg-crypto-yellow/20 text-crypto-yellow'
                      : 'text-gray-300 hover:bg-crypto-card hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-4 pt-4 border-t border-crypto-border flex flex-col gap-2">
              {state.isAuthenticated ? (
                <>
                  <div className="px-4 py-2 text-gray-400 text-sm">
                    Signed in as <span className="text-white">{state.user?.name}</span>
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-2 text-gray-300 hover:text-white flex items-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <Link
                    to="/deposit"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-2 text-gray-300 hover:text-white flex items-center gap-2"
                  >
                    <Wallet className="w-4 h-4" />
                    Deposit
                  </Link>
                  <Link
                    to="/withdraw"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-2 text-gray-300 hover:text-white flex items-center gap-2"
                  >
                    <Wallet className="w-4 h-4" />
                    Withdraw
                  </Link>
                  {state.user?.isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-4 py-2 text-crypto-yellow flex items-center gap-2"
                    >
                      <Shield className="w-4 h-4" />
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-red-400 flex items-center gap-2 text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      navigate('/login');
                      setIsMobileMenuOpen(false);
                    }}
                    className="justify-start text-white hover:text-crypto-yellow"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => {
                      navigate('/register');
                      setIsMobileMenuOpen(false);
                    }}
                    className="bg-crypto-yellow text-crypto-dark hover:bg-crypto-yellow-light"
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
    </>
  );
}

import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '@/store';
import { Button } from '@/components/ui/button';
import NotificationsDropdown from '@/components/NotificationsDropdown';
import { Menu, X, User, LogOut, Shield } from 'lucide-react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
              {state.siteSettings?.siteName || 'BitWealth'}
            </span>
          </Link>

          {/* Desktop Navigation - Only when NOT logged in */}
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
          <div className="hidden lg:flex items-center gap-3">
            {state.isAuthenticated ? (
              <>
                {/* Notifications Bell */}
                <NotificationsDropdown />
                
                {/* User Info & Logout */}
                <div className="flex items-center gap-3 pl-3 border-l border-crypto-border">
                  <Link 
                    to="/profile" 
                    className="flex items-center gap-2 text-white hover:text-crypto-yellow transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-crypto-yellow/20 flex items-center justify-center">
                      <User className="w-4 h-4 text-crypto-yellow" />
                    </div>
                    <span className="max-w-[100px] truncate text-sm">{state.user?.name}</span>
                  </Link>
                  
                  {state.user?.isAdmin && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate('/admin')}
                      className="text-crypto-yellow hover:bg-crypto-yellow/10"
                    >
                      <Shield className="w-4 h-4 mr-1" />
                      Admin
                    </Button>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    Logout
                  </Button>
                </div>
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

          {/* Mobile Menu Button - Only when NOT logged in */}
          {!state.isAuthenticated && (
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          )}

          {/* Mobile - When logged in, show only notifications and menu */}
          {state.isAuthenticated && (
            <div className="lg:hidden flex items-center gap-3">
              <NotificationsDropdown />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-white"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu - Only when NOT logged in */}
        {!state.isAuthenticated && isMobileMenuOpen && (
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
            </div>
          </div>
        )}

        {/* Mobile Menu - When logged in */}
        {state.isAuthenticated && isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-crypto-border animate-slide-down">
            <div className="flex flex-col gap-2 mt-4">
              <div className="px-4 py-2 text-gray-400 text-sm">
                Signed in as <span className="text-white">{state.user?.name}</span>
              </div>
              <Link
                to="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-2 text-gray-300 hover:text-white flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Profile
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
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

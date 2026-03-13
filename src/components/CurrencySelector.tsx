import { useState } from 'react';
import { useStore } from '@/store';
import { SUPPORTED_CURRENCIES } from '@/lib/cryptoPrices';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Check } from 'lucide-react';
import { toast } from 'sonner';

interface CurrencySelectorProps {
  variant?: 'default' | 'minimal';
}

export default function CurrencySelector({ variant = 'default' }: CurrencySelectorProps) {
  const { state, dispatch } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  
  const currentCurrency = state.user?.preferredCurrency || 'USD';
  const currency = SUPPORTED_CURRENCIES.find(c => c.code === currentCurrency) || SUPPORTED_CURRENCIES[0];

  const handleCurrencyChange = (code: string) => {
    if (state.user) {
      dispatch({ 
        type: 'UPDATE_USER', 
        payload: { preferredCurrency: code } 
      });
      toast.success(`Currency changed to ${code}`);
    }
    setIsOpen(false);
  };

  if (variant === 'minimal') {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white hover:bg-crypto-card"
          >
            <span className="mr-1">{currency.flag}</span>
            <span className="text-xs">{currency.code}</span>
            <ChevronDown className="w-3 h-3 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-crypto-card border-crypto-border max-h-64 overflow-y-auto">
          {SUPPORTED_CURRENCIES.map((c) => (
            <DropdownMenuItem
              key={c.code}
              onClick={() => handleCurrencyChange(c.code)}
              className="text-gray-300 focus:text-white focus:bg-crypto-border cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span>{c.flag}</span>
                <span className="text-sm">{c.code}</span>
                <span className="text-xs text-gray-500">{c.name}</span>
              </div>
              {currentCurrency === c.code && (
                <Check className="w-4 h-4 text-crypto-yellow" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="bg-crypto-card border border-crypto-border rounded-xl p-4">
      <label className="block text-sm font-medium text-gray-400 mb-2">
        Preferred Currency
      </label>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between border-crypto-border text-white hover:bg-crypto-dark"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{currency.flag}</span>
              <div className="text-left">
                <p className="text-sm font-medium">{currency.code}</p>
                <p className="text-xs text-gray-500">{currency.name}</p>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-72 bg-crypto-card border-crypto-border max-h-80 overflow-y-auto">
          {SUPPORTED_CURRENCIES.map((c) => (
            <DropdownMenuItem
              key={c.code}
              onClick={() => handleCurrencyChange(c.code)}
              className="text-gray-300 focus:text-white focus:bg-crypto-border cursor-pointer flex items-center justify-between py-3"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{c.flag}</span>
                <div>
                  <p className="text-sm font-medium">{c.code}</p>
                  <p className="text-xs text-gray-500">{c.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">{c.symbol}1 = ${c.rate}</p>
                {currentCurrency === c.code && (
                  <Check className="w-4 h-4 text-crypto-yellow ml-auto mt-1" />
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <p className="text-xs text-gray-500 mt-2">
        All amounts will be displayed in your preferred currency
      </p>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useStore } from '@/store';
import { fetchCryptoPrices, type CryptoPrice, formatCurrencyAmount } from '@/lib/cryptoPrices';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function LivePrices() {
  const { state } = useStore();
  const [prices, setPrices] = useState<CryptoPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const userCurrency = state.user?.preferredCurrency || 'USD';

  const fetchPrices = async () => {
    try {
      setLoading(true);
      const data = await fetchCryptoPrices(undefined, userCurrency.toLowerCase());
      setPrices(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching prices:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [userCurrency]);

  const topCoins = prices.slice(0, 6);

  return (
    <section className="py-8 md:py-12 bg-crypto-card/50 border-y border-crypto-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-display font-bold text-white">
              Live Market Prices
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Real-time cryptocurrency prices in {userCurrency}
            </p>
          </div>
          <span className="text-xs text-gray-500">
            Auto-updating • Last: {lastUpdated.toLocaleTimeString()}
          </span>
        </div>

        {loading && prices.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-crypto-card rounded-xl p-4 h-32" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
              {topCoins.map((coin) => (
                <div
                  key={coin.id}
                  className="group bg-crypto-card border border-crypto-border rounded-xl p-4 hover:border-crypto-yellow/50 transition-all duration-300"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <img
                      src={coin.image}
                      alt={coin.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="text-white font-medium text-sm">{coin.symbol.toUpperCase()}</p>
                      <p className="text-gray-500 text-xs">{coin.name}</p>
                    </div>
                  </div>
                  
                  <p className="text-white font-bold text-lg mb-1">
                    {formatCurrencyAmount(coin.current_price, userCurrency)}
                  </p>
                  
                  <div className={`flex items-center gap-1 text-xs ${
                    coin.price_change_percentage_24h >= 0 
                      ? 'text-green-500' 
                      : 'text-red-500'
                  }`}>
                    {coin.price_change_percentage_24h >= 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span>
                      {coin.price_change_percentage_24h >= 0 ? '+' : ''}
                      {coin.price_change_percentage_24h.toFixed(2)}%
                    </span>
                  </div>

                  {/* Mini sparkline */}
                  {coin.sparkline_in_7d?.price && (
                    <div className="mt-3 h-8">
                      <svg viewBox="0 0 100 30" className="w-full h-full" preserveAspectRatio="none">
                        <polyline
                          fill="none"
                          stroke={coin.price_change_percentage_24h >= 0 ? '#22c55e' : '#ef4444'}
                          strokeWidth="2"
                          points={coin.sparkline_in_7d.price
                            .slice(-20)
                            .map((p, i, arr) => {
                              const min = Math.min(...arr);
                              const max = Math.max(...arr);
                              const x = (i / (arr.length - 1)) * 100;
                              const y = 30 - ((p - min) / (max - min)) * 30;
                              return `${x},${y}`;
                            })
                            .join(' ')}
                        />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>

          </>
        )}
      </div>
    </section>
  );
}

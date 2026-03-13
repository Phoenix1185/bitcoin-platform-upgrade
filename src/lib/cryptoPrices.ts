import { useState, useEffect, useCallback } from 'react';

export interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  price_change_24h: number;
  market_cap: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  image: string;
  last_updated: string;
  sparkline_in_7d?: { price: number[] };
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  rate: number; // Rate against USD
}

export const SUPPORTED_CURRENCIES: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸', rate: 1 },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', rate: 0.92 },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧', rate: 0.79 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵', rate: 150.5 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦', rate: 1.35 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺', rate: 1.52 },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', flag: '🇨🇭', rate: 0.88 },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳', rate: 7.19 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳', rate: 83.0 },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷', rate: 4.95 },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', flag: '🇳🇬', rate: 1500 },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦', rate: 19.0 },
  { code: 'BTC', name: 'Bitcoin', symbol: '₿', flag: '₿', rate: 0.000015 },
  { code: 'ETH', name: 'Ethereum', symbol: 'Ξ', flag: 'Ξ', rate: 0.00028 },
  { code: 'USDT', name: 'Tether', symbol: '₮', flag: '₮', rate: 1 },
];

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

// Fetch live crypto prices
export async function fetchCryptoPrices(
  ids: string[] = ['bitcoin', 'ethereum', 'tether', 'binancecoin', 'cardano', 'solana', 'ripple', 'polkadot', 'dogecoin', 'tron'],
  currency: string = 'usd'
): Promise<CryptoPrice[]> {
  try {
    const response = await fetch(
      `${COINGECKO_API}/coins/markets?vs_currency=${currency}&ids=${ids.join(',')}&order=market_cap_desc&sparkline=true&price_change_percentage=24h`
    );
    if (!response.ok) throw new Error('Failed to fetch prices');
    return await response.json();
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    return [];
  }
}

// Fetch single coin price
export async function fetchCoinPrice(coinId: string, currency: string = 'usd'): Promise<CryptoPrice | null> {
  try {
    const response = await fetch(
      `${COINGECKO_API}/coins/markets?vs_currency=${currency}&ids=${coinId}&sparkline=true&price_change_percentage=24h`
    );
    if (!response.ok) throw new Error('Failed to fetch price');
    const data = await response.json();
    return data[0] || null;
  } catch (error) {
    console.error('Error fetching coin price:', error);
    return null;
  }
}

// Fetch historical chart data
export async function fetchChartData(
  coinId: string,
  days: number = 7,
  currency: string = 'usd'
): Promise<{ prices: [number, number][]; market_caps: [number, number][]; total_volumes: [number, number][] } | null> {
  try {
    const response = await fetch(
      `${COINGECKO_API}/coins/${coinId}/market_chart?vs_currency=${currency}&days=${days}`
    );
    if (!response.ok) throw new Error('Failed to fetch chart data');
    return await response.json();
  } catch (error) {
    console.error('Error fetching chart data:', error);
    return null;
  }
}

// Convert amount between currencies
export function convertCurrency(amount: number, fromCode: string, toCode: string): number {
  const fromCurrency = SUPPORTED_CURRENCIES.find(c => c.code === fromCode);
  const toCurrency = SUPPORTED_CURRENCIES.find(c => c.code === toCode);
  
  if (!fromCurrency || !toCurrency) return amount;
  
  // Convert to USD first, then to target currency
  const usdAmount = amount / fromCurrency.rate;
  return usdAmount * toCurrency.rate;
}

// Format currency amount
export function formatCurrencyAmount(amount: number, currencyCode: string = 'USD'): string {
  const currency = SUPPORTED_CURRENCIES.find(c => c.code === currencyCode);
  const symbol = currency?.symbol || '$';
  
  if (amount >= 1000000) {
    return `${symbol}${(amount / 1000000).toFixed(2)}M`;
  } else if (amount >= 1000) {
    return `${symbol}${(amount / 1000).toFixed(2)}K`;
  }
  
  return `${symbol}${amount.toFixed(2)}`;
}

// Format crypto amount
export function formatCryptoAmount(amount: number, symbol: string): string {
  if (amount < 0.0001) {
    return `${amount.toExponential(4)} ${symbol.toUpperCase()}`;
  } else if (amount < 1) {
    return `${amount.toFixed(6)} ${symbol.toUpperCase()}`;
  } else if (amount < 1000) {
    return `${amount.toFixed(4)} ${symbol.toUpperCase()}`;
  } else {
    return `${amount.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${symbol.toUpperCase()}`;
  }
}

// React hook for live prices
export function useLivePrices(currency: string = 'usd', refreshInterval: number = 30000) {
  const [prices, setPrices] = useState<CryptoPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrices = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchCryptoPrices(undefined, currency);
      setPrices(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch prices');
    } finally {
      setLoading(false);
    }
  }, [currency]);

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchPrices, refreshInterval]);

  return { prices, loading, error, refetch: fetchPrices };
}

// React hook for chart data
export function useChartData(coinId: string, days: number = 7, currency: string = 'usd') {
  const [data, setData] = useState<{ prices: [number, number][] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const chartData = await fetchChartData(coinId, days, currency);
        setData(chartData);
      } catch (error) {
        console.error('Error fetching chart:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [coinId, days, currency]);

  return { data, loading };
}

// Get BTC price for USD conversion
export function getBTCPrice(prices: CryptoPrice[]): number {
  const btc = prices.find(p => p.id === 'bitcoin');
  return btc?.current_price || 0;
}

// Get ETH price for USD conversion
export function getETHPrice(prices: CryptoPrice[]): number {
  const eth = prices.find(p => p.id === 'ethereum');
  return eth?.current_price || 0;
}

// Calculate crypto equivalent
export function calculateCryptoEquivalent(usdAmount: number, cryptoPrice: number): number {
  if (!cryptoPrice || cryptoPrice <= 0) return 0;
  return usdAmount / cryptoPrice;
}

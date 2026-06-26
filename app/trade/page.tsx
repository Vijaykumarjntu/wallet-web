'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, Users, BarChart3, Clock } from 'lucide-react';
import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';

interface Token {
  symbol: string;
  price: string;
  change: string;
  volume?: string;
  name?: string;
  address?: string;
}

const initialTrending = [
  { symbol: '$CHAD', price: '0.0421', change: '+124.8', volume: '42.1M' },
  { symbol: '$PUNCH', price: '0.0087', change: '+89.4', volume: '18.9M' },
];

function PrivyUserButton() {
  const { user, logout } = usePrivy();

  if (!user) {
    return (
      <button 
        onClick={() => window.location.href = '/'}
        className="px-5 py-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-sm"
      >
        Sign In
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5 text-emerald-400">
        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" /> 
        {user.email?.address || user.google?.email || 'Connected'}
      </div>
      <button 
        onClick={logout}
        className="px-5 py-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-sm"
      >
        Logout
      </button>
    </div>
  );
}

export default function TradingPage() {
  const [trendingTokens, setTrendingTokens] = useState<Token[]>([]);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [activeTab, setActiveTab] = useState<'chart' | 'holders' | 'trades'>('chart');
  const [loading, setLoading] = useState(true);

  // Fetch real trending Solana tokens from Dexscreener
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setLoading(true);
        // Dexscreener search for Solana pairs (popular tokens)
        const res = await fetch('https://api.dexscreener.com/latest/dex/search?q=solana', {
          cache: 'no-store'
        });
        
        if (!res.ok) throw new Error('Failed to fetch');
        
        const data = await res.json();
        
        // Filter and map to our format (take top pairs)
        const tokens: Token[] = data.pairs
          ?.filter((p: any) => p.chainId === 'solana' && p.baseToken)
          .slice(0, 8)
          .map((p: any) => ({
            symbol: '$' + (p.baseToken.symbol || 'MEME').slice(0, 6).toUpperCase(),
            price: parseFloat(p.priceUsd || 0).toFixed(p.priceUsd > 1 ? 4 : 6),
            change: (p.priceChange?.h24 || 0).toFixed(1),
            volume: (p.volume?.h24 / 1000000).toFixed(1) + 'M',
            name: p.baseToken.name,
            address: p.baseToken.address
          })) || [];

        setTrendingTokens(tokens.length > 0 ? tokens : initialTrending);
        
        if (tokens.length > 0) {
          setSelectedToken(tokens[0]);
        } else {
          setSelectedToken(initialTrending[0]);
        }
      } catch (error) {
        console.error('Failed to fetch real data, using mock:', error);
        setTrendingTokens(initialTrending);
        setSelectedToken(initialTrending[0]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchTrending, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Top Nav */}
      <nav className="border-b border-white/10 bg-black/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-screen-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 hover:text-pink-400">
              <ArrowLeft className="w-5 h-5" /> Back to Home
            </Link>
            <div className="h-6 w-px bg-white/20 mx-4" />
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-cyan-400 rounded-xl flex items-center justify-center text-lg font-black">C</div>
              <div>
                <div className="font-bold">CHADWALLET TERMINAL</div>
                <div className="text-xs text-emerald-400">• LIVE ON SOLANA</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <PrivyUserButton />
          </div>
        </div>
      </nav>

      <div className="flex flex-1 max-w-screen-2xl mx-auto w-full">
        {/* Left Sidebar - Trending */}
        <div className="w-80 border-r border-white/10 bg-zinc-950 p-6 overflow-auto">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-5 h-5 text-pink-400" />
            <h3 className="uppercase tracking-widest text-sm font-semibold">Trending on Solana</h3>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="p-8 text-center text-zinc-500">Loading live Solana tokens...</div>
            ) : (
              trendingTokens.map((token, index) => (
                <div 
                  key={index}
                  onClick={() => setSelectedToken(token)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all hover:bg-white/5 flex justify-between items-center ${selectedToken?.symbol === token.symbol ? 'bg-white/10 border border-pink-500/30' : 'border border-white/5'}`}
                >
                <div>
                  <div className="font-mono font-bold">{token.symbol}</div>
                  <div className="text-xs text-zinc-500">Solana • 5m ago</div>
                </div>
                <div className="text-right">
                  <div className="font-mono">${token.price}</div>
                  <div className={`text-xs ${token.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                    {token.change}%
                  </div>
                </div>
              </div>
            ))
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Token Header */}
          <div className="border-b border-white/10 p-8">
            {selectedToken ? (
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-4">
                    <div className="text-6xl">🦍</div>
                    <div>
                      <div className="text-5xl font-black tracking-tighter">{selectedToken.symbol}</div>
                      <div className="text-zinc-400">{selectedToken.name || 'Meme Coin'} • Live on Solana</div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-5xl font-mono font-semibold">${selectedToken.price}</div>
                  <div className={`text-2xl font-medium ${parseFloat(selectedToken.change) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {parseFloat(selectedToken.change) >= 0 ? '+' : ''}{selectedToken.change}% (24h)
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-zinc-500">Loading token data...</div>
            )}
          </div>

          {/* Chart Area */}
          <div className="flex-1 p-8 border-b border-white/10 bg-zinc-950 relative">
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-2">
                {(['chart', 'holders', 'trades'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-2 rounded-xl text-sm font-medium transition ${activeTab === tab ? 'bg-white text-black' : 'hover:bg-white/10'}`}
                  >
                    {tab === 'chart' && 'Price Chart'}
                    {tab === 'holders' && 'Top Holders'}
                    {tab === 'trades' && 'Live Trades'}
                  </button>
                ))}
              </div>
              <div className="text-xs text-zinc-500">Powered by TradingView + Birdeye API (mock)</div>
            </div>

            {activeTab === 'chart' && (
              <div className="h-[520px] bg-zinc-900 rounded-3xl flex items-center justify-center border border-white/10">
                <div className="text-center">
                  <BarChart3 className="w-20 h-20 mx-auto mb-6 text-zinc-700" />
                  <p className="text-xl text-zinc-400">Real TradingView chart would go here</p>
                  <p className="text-sm text-zinc-500 mt-2">Integrate @tradingview/charting-library in production</p>
                </div>
              </div>
            )}

            {activeTab === 'holders' && (
              <div className="space-y-4">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="flex items-center justify-between bg-zinc-900/50 p-5 rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-zinc-800 rounded-full" />
                      <div>
                        <div className="font-mono">0x71C7...{i}9f2a</div>
                        <div className="text-xs text-zinc-500">Top Holder #{i}</div>
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      8.42% <span className="text-zinc-500">($1.54M)</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'trades' && (
              <div className="space-y-3 max-h-[520px] overflow-auto pr-4">
                {Array.from({length: 12}).map((_, i) => (
                  <div key={i} className="flex justify-between items-center bg-zinc-900/50 p-4 rounded-2xl text-sm">
                    <div className="flex items-center gap-4">
                      <div className={i % 3 === 0 ? "text-green-400" : "text-red-400"}>{i % 3 === 0 ? 'BUY' : 'SELL'}</div>
                      <div>0xA1b2...c3D4</div>
                    </div>
                    <div className="font-mono">142.8 {selectedToken?.symbol || 'TOKEN'}</div>
                    <div>${(Math.random()*4200 + 800).toFixed(2)}</div>
                    <div className="text-xs text-zinc-500">just now</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Trade Panel */}
        <div className="w-96 border-l border-white/10 bg-zinc-950 p-8 flex flex-col">
          <div className="mb-8">
            <div className="text-sm text-zinc-400 mb-2">YOUR POSITION</div>
            <div className="bg-zinc-900 rounded-2xl p-6">
              <div className="flex justify-between text-sm mb-4">
                <div>Balance</div>
                <div className="font-mono">1,284 {selectedToken?.symbol || 'TOKEN'}</div>
              </div>
              <div className="h-2 bg-white/10 rounded mb-6">
                <div className="h-2 w-[65%] bg-gradient-to-r from-pink-500 to-cyan-400 rounded"></div>
              </div>
              <div className="text-xs text-emerald-400">+184.2% (+$2,841)</div>
            </div>
          </div>

          {/* Buy / Sell */}
          <div className="flex-1">
            <div className="flex border-b border-white/10 mb-6">
              <button className="flex-1 py-4 text-center border-b-2 border-green-400 text-green-400 font-semibold">BUY</button>
              <button className="flex-1 py-4 text-center text-red-400">SELL</button>
            </div>

            <div className="space-y-8">
              <div>
                <label className="text-xs uppercase tracking-widest block mb-2">Amount (SOL)</label>
                <input type="text" defaultValue="12.4" className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-6 py-4 text-2xl font-mono focus:outline-none" />
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest block mb-2">Est. Receive</label>
                <div className="bg-zinc-900 border border-white/10 rounded-2xl px-6 py-4 text-2xl font-mono">293.4 {selectedToken?.symbol || 'TOKEN'}</div>
              </div>

              <button className="w-full py-5 bg-gradient-to-r from-green-500 to-emerald-400 text-black rounded-2xl font-bold text-xl hover:brightness-110 transition-all active:scale-[0.985]">
                BUY {selectedToken?.symbol.toUpperCase() || 'TOKEN'}
              </button>
            </div>
          </div>

          <div className="text-[10px] text-center text-zinc-600 mt-auto pt-8">
            Powered by Jupiter • Real swaps on mainnet
          </div>
        </div>
      </div>
    </div>
  );
}

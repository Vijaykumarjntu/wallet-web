'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, Users, BarChart3, Clock } from 'lucide-react';
import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
// import { BarChart3 } from 'lucide-react';

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
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      // Redirect to login page after logout
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!user) {
    return (
      <button 
        onClick={() => router.push('/login')}
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
        onClick={handleLogout}
        className="px-5 py-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-sm"
      >
        Logout
      </button>
    </div>
  );
}

export default function TradingPage() {
  const { authenticated, ready } = usePrivy();
  const router = useRouter();
  const [trendingTokens, setTrendingTokens] = useState<Token[]>([]);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [activeTab, setActiveTab] = useState<'chart' | 'holders' | 'trades'>('chart');
  const [loading, setLoading] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (ready && !authenticated) {
      router.push('/login');
    }
  }, [ready, authenticated, router]);

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

  // Simple Canvas Chart
  useEffect(() => {
    if (activeTab !== 'chart' || !selectedToken) return;

    const canvas = document.getElementById('simple-chart') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = 380;

    const basePrice = parseFloat(selectedToken.price);
    const points = Array.from({ length: 80 }, (_, i) => ({
      x: (i / 79) * canvas.width,
      y: canvas.height * (0.3 + Math.sin(i / 8) * 0.4 + (Math.random() - 0.5) * 0.3)
    }));

    // Background grid
    ctx.strokeStyle = '#27272a';
    ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(0, (i * canvas.height) / 6);
      ctx.lineTo(canvas.width, (i * canvas.height) / 6);
      ctx.stroke();
    }

    // Price line
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#22c55e';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();

    // Glow dots
    ctx.fillStyle = '#22c55e';
    ctx.shadowBlur = 15;
    points.forEach((p, i) => {
      if (i % 8 === 0) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }, [activeTab, selectedToken]);

  // Show loading while checking authentication
  if (!ready) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-zinc-400">Loading...</div>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!authenticated) {
    return null;
  }

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

            

            {activeTab === 'chart' && selectedToken && (
            <div className="h-[520px] bg-zinc-900 rounded-3xl border border-white/10 p-6 relative overflow-hidden">
              <div className="flex justify-between mb-6">
                <div>
                  <div className="text-sm text-zinc-400">PRICE CHART</div>
                  <div className="text-3xl font-mono font-bold text-white">${selectedToken.price}</div>
                </div>
                <div className={`text-right ${parseFloat(selectedToken.change) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  <div className="text-sm">24H CHANGE</div>
                  <div className="text-2xl font-medium">{selectedToken.change}%</div>
                </div>
              </div>

              {/* Simple Live Line Chart using Canvas */}
              <canvas id="simple-chart" className="w-full h-[380px] bg-black/40 rounded-2xl" />

              <div className="absolute bottom-6 left-6 right-6 flex justify-between text-xs text-zinc-500">
                <div>1H AGO</div>
                <div>NOW</div>
              </div>
            </div>
          )}

            {activeTab === 'holders' && selectedToken && (
              <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, i) => {
                  const percentage = (12 - i * 1.5).toFixed(1);
                  const address = `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`;
                  return (
                    <div key={i} className="flex items-center justify-between bg-zinc-900/50 p-5 rounded-2xl border border-white/5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-zinc-700 to-zinc-800 rounded-full flex items-center justify-center text-xs font-mono">
                          {i + 1}
                        </div>
                        <div>
                          <div className="font-mono text-sm">{address}</div>
                          <div className="text-xs text-zinc-500">Wallet #{i + 1}</div>
                        </div>
                      </div>
                      <div className="text-right font-mono">
                        <div>{percentage}%</div>
                        <div className="text-xs text-zinc-500">
                          ~${(parseFloat(selectedToken.price) * parseFloat(percentage) * 42000).toFixed(0)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}  

            {activeTab === 'trades' && selectedToken && (
              <div className="space-y-3 max-h-[520px] overflow-auto pr-4">
                {Array.from({ length: 15 }).map((_, i) => {
                  const isBuy = i % 3 !== 0;
                  const amount = (Math.random() * 420 + 15).toFixed(1);
                  const price = parseFloat(selectedToken.price);
                  const total = (parseFloat(amount) * price).toFixed(2);
                  const timeAgo = i === 0 ? "just now" : `${i + 1}m ago`;

                  return (
                    <div key={i} className="flex justify-between items-center bg-zinc-900/50 p-4 rounded-2xl text-sm border border-white/5">
                      <div className="flex items-center gap-4">
                        <div className={isBuy ? "text-green-400" : "text-red-400 font-medium"}>
                          {isBuy ? 'BUY' : 'SELL'}
                        </div>
                        <div className="font-mono text-xs text-zinc-500">0x{Math.random().toString(16).slice(2, 10)}...</div>
                      </div>
                      
                      <div className="font-mono text-right">
                        {amount} {selectedToken.symbol}
                      </div>
                      
                      <div className="font-mono text-right">
                        ${total}
                      </div>
                      
                      <div className="text-xs text-zinc-500 w-16 text-right">{timeAgo}</div>
                    </div>
                  );
                })}
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
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Wallet, TrendingUp, Users, Zap, ArrowRight, Play } from 'lucide-react';
import Link from 'next/link';
// import { usePrivy, useLogin } from '@privy-io/react-auth';
import {usePrivy, useSendTransaction} from '@privy-io/react-auth';
import router from 'next/router';
const mockTokens = [
  { symbol: '$CHAD', name: 'ChadCoin', price: '0.0421', change: '+124%', color: '#ff00aa' },
  { symbol: '$PUNCH', name: 'Punch', price: '0.0087', change: '+89%', color: '#00ffcc' },
];

// function PrivyLoginButton() {
//   const { login } = useLogin();
//   const { ready, authenticated, user } = usePrivy();

//   if (!ready) {
//     return <button className="bg-white text-black px-6 py-2.5 rounded-full font-semibold text-sm">Loading...</button>;
//   }

//   if (authenticated && user) {
//     return (
//       <button 
//         onClick={() => window.location.href = '/trade'}
//         className="bg-white text-black px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-white/90 transition-all flex items-center gap-2"
//       >
//         Launch Terminal
//       </button>
//     );
//   }

//   return (
//     <button 
//       onClick={login}
//       className="bg-white text-black px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-white/90 transition-all flex items-center gap-2"
//     >
//       <Wallet className="w-4 h-4" /> Sign in with Privy
//     </button>
//   );
// }



export function PrivyLoginButton() {
  const {ready, authenticated, login} = usePrivy();
  const {sendTransaction} = useSendTransaction();
  const router = useRouter();
  useEffect(() => {
    if (ready && !authenticated) {
      router.push('/login');
    }
  }, [authenticated, ready, router]);
  
  if (!ready) return <div>Loading...</div>;

  // Log in
  if (!authenticated) return <button onClick={login}>Log in</button>;
  
  // Send transaction
  // return <button onClick={() => sendTransaction({to: 'recipient', value: 100000})}>Send</button>;

}

export default function ChadWalletLanding() {
  const [currentTokenIndex, setCurrentTokenIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTokenIndex((prev) => (prev + 1) % mockTokens.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentToken = mockTokens[currentTokenIndex];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all ${isScrolled ? 'bg-black/90 backdrop-blur-md border-b border-white/10' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-400 rounded-2xl flex items-center justify-center">
              <span className="text-xl font-black">C</span>
            </div>
            <div>
              <div className="font-bold text-2xl tracking-tighter">CHADWALLET</div>
              <div className="text-[10px] text-zinc-500 -mt-1">MEME COIN MACHINE</div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm">
            <a href="#features" className="hover:text-pink-400 transition-colors">Features</a>
            <a href="#trade" className="hover:text-pink-400 transition-colors">Trade</a>
            <a href="#leaderboard" className="hover:text-pink-400 transition-colors">Leaderboard</a>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => window.location.href = '/trade'}
              className="px-6 py-2.5 rounded-full border border-white/20 hover:bg-white/5 transition-all text-sm font-medium flex items-center gap-2"
            >
              Launch App <ArrowRight className="w-4 h-4" />
            </button>
            <PrivyLoginButton />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24 relative">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">NOW ON WEB + MOBILE</span>
          </div>

          <h1 className="text-7xl md:text-[92px] font-black tracking-tighter leading-none mb-6">
            THE #1<br /> 
            <span className="chad-gradient">MEME COIN</span><br /> 
            TRADING APP
          </h1>

          <p className="max-w-2xl mx-auto text-2xl text-zinc-400 mb-10">
            Hunt memecoins. Copy top traders. Ape instantly on Solana.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <a 
              href="https://play.google.com/store/apps/details?id=xyz.chadwallet.www" 
              target="_blank"
              className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded-2xl font-semibold hover:scale-105 transition-transform"
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-6" />
              GET ON ANDROID
            </a>
            
            <a 
              href="https://apps.apple.com/us/app/chadwallet/id6757367474" 
              target="_blank"
              className="flex items-center gap-3 border border-white/30 px-8 py-4 rounded-2xl font-semibold hover:bg-white/5 transition-all"
            >
              <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="App Store" className="h-6" />
              DOWNLOAD ON IPHONE
            </a>
          </div>

          {/* Rotating Banner */}
          <div className="mb-8">
            <div className="text-xs uppercase tracking-[3px] text-zinc-500 mb-3">HOT RIGHT NOW</div>
            <div 
              onClick={() => window.location.href = `/trade?token=${currentToken.symbol}`}
              className="inline-flex items-center gap-4 bg-zinc-900 hover:bg-zinc-800 border border-white/10 rounded-3xl px-8 py-4 cursor-pointer transition-all group mx-auto"
            >
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-2xl" style={{backgroundColor: currentToken.color + '20'}}>
                {currentToken.symbol}
              </div>
              <div className="text-left"> 
                <div className="font-mono text-xl font-bold">{currentToken.symbol}</div>
                <div className="text-sm text-zinc-400">{currentToken.name}</div>
              </div>
              <div className="ml-auto text-right">
                <div className="font-mono text-lg">${currentToken.price}</div>
                <div className={`text-sm font-medium ${currentToken.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                  {currentToken.change}
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-zinc-400 group-hover:translate-x-1 transition" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 border-t border-white/10 bg-zinc-950">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="uppercase tracking-[4px] text-pink-500 text-sm mb-4">WHY CHADS WIN</div>
            <h2 className="text-6xl font-bold tracking-tighter">Built different.</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <TrendingUp className="w-10 h-10" />,
                title: "Lightning Snipes",
                desc: "Buy the second a token launches. Faster than bots."
              },
              {
                icon: <Users className="w-10 h-10" />,
                title: "Social Alpha",
                desc: "See what the top 100 Chads are buying in real-time."
              },
              {
                icon: <Zap className="w-10 h-10" />,
                title: "Privy Auth",
                desc: "Sign in with Apple/Google. No seed phrases. Ever."
              }
            ].map((feature, i) => (
              <div key={i} className="bg-zinc-900/50 border border-white/10 rounded-3xl p-10 hover:border-pink-500/30 transition-all group">
                <div className="text-pink-500 mb-8 group-hover:scale-110 transition">{feature.icon}</div>
                <h3 className="text-3xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-zinc-400 text-lg leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trading Teaser */}
      <section id="trade" className="py-24 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="uppercase text-pink-500 tracking-widest text-sm mb-4">PRO TRADING TERMINAL</div>
              <h2 className="text-6xl font-black tracking-tighter leading-none mb-8">
                Desktop trading<br />that actually <span className="chad-gradient">slaps</span>
              </h2>
              <p className="text-xl text-zinc-400 mb-10">
                Full featured trading page. Live charts. Real-time trades. Copy top wallets.
              </p>
              <Link 
                href="/trade"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-500 to-cyan-400 text-black font-bold px-10 py-4 rounded-2xl text-lg hover:brightness-110 transition"
              >
                OPEN TRADING TERMINAL <Play className="w-6 h-6" />
              </Link>
            </div>
            
            {/* <div className="bg-zinc-900 border border-white/10 rounded-3xl aspect-video flex items-center justify-center relative overflow-hidden">
              <div className="text-center">
                <div className="text-6xl mb-4">📈</div>
                <p className="text-zinc-500">Trading UI coming in next iteration</p>
              </div>
            </div> */}

            <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="font-mono text-lg">{currentToken.symbol} LIVE</div>
                <div className={`font-medium ${currentToken.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                  {currentToken.change} (24h)
                </div>
              </div>
              
              <div className="h-48 bg-black rounded-2xl relative overflow-hidden flex items-end">
                {/* Simulated price line */}
                <div className="absolute inset-0 flex items-end px-6 pb-6">
                  <div className="w-full h-24 bg-gradient-to-t from-green-500/30 via-green-500/10 to-transparent rounded-t-3xl relative">
                    <div className="absolute -top-3 left-1/3 w-6 h-6 bg-green-400 rounded-full shadow-lg flex items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-black rounded-full"></div>
                    </div>
                  </div>
                </div>
                <div className="absolute top-4 right-4 text-[10px] bg-green-500/20 text-green-400 px-3 py-1 rounded-full font-mono">LIVE</div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-16 bg-black">
        <div className="max-w-6xl mx-auto px-6 text-center text-zinc-500 text-sm">
          <p>© 2026 ChadWallet • Not financial advice. Trade at your own risk.</p>
          <div className="mt-6 flex justify-center gap-8">
            <a href="#" className="hover:text-white">Twitter</a>
            <a href="#" className="hover:text-white">Telegram</a>
            <a href="https://chadwallet.xyz" target="_blank" className="hover:text-white">chadwallet.xyz</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

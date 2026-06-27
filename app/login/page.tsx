// app/login/page.tsx
'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const { login, authenticated, ready, user } = usePrivy();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Add a small delay to ensure state is fully updated
    if (authenticated && !isRedirecting) {
      setIsRedirecting(true);
      // Small delay to ensure everything is settled
      setTimeout(() => {
        router.push('/');
      }, 100);
    }
  }, [authenticated, router, isRedirecting]);

  if (!ready) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="max-w-md w-full space-y-4 p-8">
        <h1 className="text-3xl font-bold text-white text-center">Welcome to ChadWallet</h1>
        <button 
          onClick={login}
          disabled={isRedirecting}
          className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          {isRedirecting ? 'Redirecting...' : 'Sign in with Google/Apple'}
        </button>
      </div>
    </div>
  );
}
// app/login/page.tsx
'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const { login, authenticated, ready } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (authenticated) {
      router.push('/'); // Redirect to home after login
    }
  }, [authenticated, router]);

  if (!ready) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="max-w-md w-full space-y-4 p-8">
        <h1 className="text-3xl font-bold text-white text-center">Welcome to ChadWallet</h1>
        <button 
          onClick={login}
          className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Sign in with Google/Apple
        </button>
      </div>
    </div>
  );
}
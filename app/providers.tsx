// app/providers.tsx
'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { useEffect, useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  const [appId, setAppId] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Set client-side flag
    setIsClient(true);
    
    // Load environment variable on client side
    const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
    
    if (!privyAppId) {
      console.error('NEXT_PUBLIC_PRIVY_APP_ID is not defined in environment variables');
      // You could show an error UI here if needed
    }
    
    setAppId(privyAppId);
  }, []);

  // Don't render anything on server or if appId is not loaded
  if (!isClient || !appId) {
    // Optional: You can return a loading state or null
    return <>{children}</>; // Or return null to render nothing until client loads
  }

  return (
    <PrivyProvider
      appId={appId}
      config={{
        loginMethods: ['google', 'apple', 'email'],
        appearance: {
          theme: 'dark',
          accentColor: '#676FFF',
        },
        // Add supported chains if needed
        // supportedChains: ['solana'],
      }}
    >
      {children}
    </PrivyProvider>
  );
}
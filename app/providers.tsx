  // 'use client';

  // import { PrivyProvider } from '@privy-io/react-auth';

  // export function Providers({ children }: { children: React.ReactNode }) {
  //   return (
  //     <PrivyProvider
  //       appId="cmqrz3ioy00980cl6fin7sfln" // Your real Privy App ID
  //       config={{
  //         loginMethods: ['email', 'google', 'apple', 'wallet'],
  //         appearance: {
  //           theme: 'dark',
  //           accentColor: '#ff00aa',
  //         },
  //         supportedChains: ['solana'],
  //       }}
  //     >
  //       {children}
  //     </PrivyProvider>
  //   );
  // }

// app/providers.tsx
'use client';

import { PrivyProvider } from '@privy-io/react-auth';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID}
      config={{
        loginMethods: ['google', 'apple', 'email'],
        appearance: {
          theme: 'dark',
          accentColor: '#676FFF',
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
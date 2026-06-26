import { PrivyProvider, usePrivy } from '@privy-io/react-auth';

function LoginComponent() {
  const { login, logout, authenticated, user, ready } = usePrivy();

  if (!ready) return <div>Initializing...</div>;

  return (
    <div>
      {!authenticated ? (
        <button 
          onClick={login}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Sign in with Google or Apple
        </button>
      ) : (
        <div>
          <p>Logged in as: {user?.email?.address || user?.google?.email || 'User'}</p>
          <button onClick={logout}>Sign out</button>
        </div>
      )}
    </div>
  );
}

// In your main app
function App() {
  return (
    <PrivyProvider
      appId="cmqry0q9y010z0cju5fop0ux1"
      config={{
        loginMethods: ['google', 'apple', 'email'],
        appearance: {
          theme: 'light',
          accentColor: '#676FFF'
        }
      }}
    >
      <LoginComponent />
    </PrivyProvider>
  );
}
import { ClerkProvider } from '@clerk/clerk-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key: No se encontró VITE_CLERK_PUBLISHABLE_KEY");
}

export function ClerkProviderWrapper({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      navigate={(to) => navigate(to)}
    >
      {children}
    </ClerkProvider>
  );
}

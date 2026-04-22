import { ClerkProvider } from '@clerk/clerk-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key: No se encontró VITE_CLERK_PUBLISHABLE_KEY en el archivo de entorno.");
}

export function ClerkProviderWrapper({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
    >
      {children}
    </ClerkProvider>
  );
}

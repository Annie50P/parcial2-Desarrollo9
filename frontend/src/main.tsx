import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.tsx';
import { ClerkProviderWrapper } from './providers/ClerkProviderWrapper.tsx';

import './index.css';

import { createRoot } from 'react-dom/client';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ClerkProviderWrapper>
          <App />
        </ClerkProviderWrapper>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
)

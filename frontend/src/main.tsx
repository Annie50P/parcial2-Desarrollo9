import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { ClerkProviderWrapper } from './providers/ClerkProviderWrapper.tsx';

import './index.css';

import { createRoot } from 'react-dom/client';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ClerkProviderWrapper>
        <App />
      </ClerkProviderWrapper>
    </BrowserRouter>
  </React.StrictMode>,
)

import { type ComponentProps, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { Constants } from '@/config/constants';

import { ThemeProvider } from '@/components/theme-provider';

import App from '@/app';

import './index.css';
import './pwa';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider
      defaultTheme={Constants.DEFAULT_THEME as ComponentProps<typeof ThemeProvider>['defaultTheme']}
      storageKey={Constants.LS_KEYS.THEME}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);

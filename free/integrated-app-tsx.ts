// src/App.tsx or src/pages/_app.tsx
import { AppProps } from 'next/app';
import { SonicWalletProvider } from '../config/wallet';
import { AppProvider } from '../context/AppContext';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';
import '@/styles/globals.css';

// Main App component
function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <SonicWalletProvider>
        <AppProvider>
          <Component {...pageProps} />
          <Toaster position="bottom-right" />
        </AppProvider>
      </SonicWalletProvider>
    </ThemeProvider>
  );
}

export default App;

import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Script from 'next/script';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Script 
        src="https://pl28969267.profitablecpmratenetwork.com/a4/12/87/a41287224eec82ac91df41f92d0f54f1.js" 
        strategy="afterInteractive" 
      />
      <Component {...pageProps} />
    </>
  );
}

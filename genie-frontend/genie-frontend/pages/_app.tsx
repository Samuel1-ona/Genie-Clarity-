import '../styles/globals.css';
import { useCallback } from 'react';
import { ClientProvider } from '@micro-stacks/react';
import { destroySession, saveSession } from '../common/fetchers';

import type { AppProps } from 'next/app';
import type { ClientConfig } from '@micro-stacks/client';
import { StacksTestnet } from 'micro-stacks/network';

function MyApp({ Component, pageProps }: AppProps) {
  const network = new StacksTestnet({
    url: 'http://localhost:20443',
  });
 

  return (
    <ClientProvider
      appName="Nextjs + Microstacks"
      appIconUrl="/vercel.png"
      network = {network}
    
    >
      <Component {...pageProps} />
    </ClientProvider>
  );
}

export default MyApp;

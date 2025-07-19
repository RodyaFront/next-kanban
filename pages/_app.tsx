import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { SessionProvider } from 'next-auth/react';
import { store } from '../features/store';
import '../styles/globals.css';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        <div className='dark'>
          <Component {...pageProps} />
        </div>
      </Provider>
    </SessionProvider>
  );
}

export default MyApp;
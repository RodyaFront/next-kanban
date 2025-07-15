import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { store } from '../features/store';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <div className='dark'>
      <Component {...pageProps} />
      </div>
    </Provider>
  );
}

export default MyApp;